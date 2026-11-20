"""One coordinator per network: it asks for the departures of every configured stop of that network at once."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import (
    ALERTS_REFRESH,
    DEFAULT_SCAN_INTERVAL,
    DEPARTED_GRACE,
    DOMAIN,
    LINES_REFRESH,
    MAX_NETWORK_ALERTS_PER_STOP,
    MIN_SCAN_INTERVAL,
)
from .providers import Alert, Departure, Line, Mobility, Provider, ProviderError, Stop

_LOGGER = logging.getLogger(__name__)

type PublicTransportConfigEntry = ConfigEntry[NetworkCoordinator]


class NetworkCoordinator(DataUpdateCoordinator[dict[str, list[Departure]]]):
    """Departures by stop key for the stops of every config entry of one network, plus its lines and alerts.

    Each config entry is one stop. Polling the network once for all of them keeps within the open data quotas,
    however many stops are followed.
    """

    def __init__(self, hass: HomeAssistant, provider: Provider) -> None:
        # Shared by several config entries: attached to none of them.
        super().__init__(
            hass,
            _LOGGER,
            config_entry=None,
            name=f"{DOMAIN}_{provider.key}",
            update_interval=timedelta(seconds=DEFAULT_SCAN_INTERVAL),
        )
        self.provider = provider
        self.stops: dict[str, Stop] = {}
        self._intervals: dict[str, int] = {}
        self.lines: dict[str, Line] = {}
        self.alerts: list[Alert] = []
        # Bike-share stations and park-and-rides by key, fetched with the departures while an entry follows one.
        self.mobility: dict[str, Mobility] = {}
        self._mobility_wanted: dict[str, list[str]] = {}
        self._lines_updated: datetime | None = None
        self._alerts_updated: datetime | None = None
        # Set while the network fails and the last departures are kept (sensor attributes `stale` / `last_error`).
        self.last_error: ProviderError | None = None
        # URL of the network's logo served with the card, when the integration ships one.
        self.logo: str | None = None
        # One update at a time: the first fetch of new stops, the polling and the refresh action share the network.
        self._lock = asyncio.Lock()
        self._fill: asyncio.Task[None] | None = None

    def add_stop(self, entry_id: str, stop: Stop, interval: int, mobility: list[str] | None = None) -> None:
        self.stops[entry_id] = stop
        self._intervals[entry_id] = interval
        if mobility:
            self._mobility_wanted[entry_id] = list(mobility)
        else:
            self._mobility_wanted.pop(entry_id, None)
        self._apply_interval()

    def remove_stop(self, entry_id: str) -> bool:
        """Forget an entry's stop; True when no stop is left (the coordinator can go)."""
        self.stops.pop(entry_id, None)
        self._intervals.pop(entry_id, None)
        self._mobility_wanted.pop(entry_id, None)
        self._apply_interval()
        return not self.stops

    def missing_stops(self) -> bool:
        """Whether a followed stop has no departures fetched yet."""
        return self.data is None or any(stop.key not in self.data for stop in self.stops.values())

    @callback
    def async_fetch_new_stops(self) -> None:
        """Fetch the stops not fetched yet, in the background: a network whose timetable takes long to read (a
        national GTFS) must not hold Home Assistant's start. The entities stay unavailable meanwhile."""
        if self._fill is None or self._fill.done():
            self._fill = self.hass.async_create_background_task(self._async_fill(), f"{self.name}_first_refresh")

    async def _async_fill(self) -> None:
        # Stops added while an update runs are fetched by the next one; a failure is left to the polling.
        for _ in range(3):
            if not self.stops or not self.missing_stops():
                return
            await self.async_refresh()
            if not self.last_update_success:
                return

    async def async_shutdown(self) -> None:
        if self._fill is not None and not self._fill.done():
            self._fill.cancel()
        await super().async_shutdown()

    def _apply_interval(self) -> None:
        # The most demanding entry sets the pace for the whole network.
        seconds = min(self._intervals.values(), default=DEFAULT_SCAN_INTERVAL)
        self.update_interval = timedelta(seconds=max(MIN_SCAN_INTERVAL, seconds))

    async def _async_update_data(self) -> dict[str, list[Departure]]:
        async with self._lock:
            return await self._async_update_locked()

    async def _async_update_locked(self) -> dict[str, list[Departure]]:
        stops = list({stop.key: stop for stop in self.stops.values()}.values())
        self.provider.follow(stops)
        try:
            await self._async_refresh_static()
            departures = await self.provider.departures(stops)
        except ProviderError as err:
            if self.data is None:
                raise UpdateFailed(str(err)) from err
            # A quota or a timeout only delays the next update: keep the last departures meanwhile.
            _LOGGER.warning("%s update failed, keeping the last departures: %s", self.provider.network_name, err)
            self.last_error = err
            return self._fresh(self.data)
        self.last_error = None
        return self._fresh(departures)

    async def _async_refresh_static(self) -> None:
        """Line colors once a day and alerts every few minutes; a failure keeps the previous ones."""
        now = dt_util.utcnow()
        if not self.lines or self._lines_updated is None or now - self._lines_updated >= LINES_REFRESH:
            try:
                self.lines = await self.provider.lines()
                self._lines_updated = now
            except ProviderError as err:
                if not self.lines:
                    raise
                _LOGGER.debug("Could not refresh the %s lines: %s", self.provider.network_name, err)
        if self._alerts_updated is None or now - self._alerts_updated >= ALERTS_REFRESH:
            try:
                self.alerts = await self.provider.alerts()
                self._alerts_updated = now
            except ProviderError as err:
                _LOGGER.debug("Could not refresh the %s alerts: %s", self.provider.network_name, err)
        # Bikes and free spaces move as fast as the departures: fetched at every update, only while followed.
        if self._mobility_wanted and self.provider.has_mobility:
            try:
                self.mobility = {m.key: m for m in await self.provider.mobility()}
            except ProviderError as err:
                _LOGGER.debug("Could not refresh the %s stations: %s", self.provider.network_name, err)

    @staticmethod
    def _fresh(departures: dict[str, list[Departure]]) -> dict[str, list[Departure]]:
        """Without the departures already gone (kept data gets older at each failed update)."""
        limit = dt_util.utcnow() - DEPARTED_GRACE
        return {key: [d for d in items if d.departure >= limit] for key, items in departures.items()}

    def departures_for(self, stop: Stop, line_ids: list[str] | None = None) -> list[Departure]:
        limit = dt_util.utcnow() - DEPARTED_GRACE
        items = (self.data or {}).get(stop.key, [])
        return [d for d in items if d.departure >= limit and (not line_ids or d.line_id in line_ids)]

    def mobility_for(self, keys: list[str]) -> list[Mobility]:
        """The followed stations that the network still lists, in the order chosen."""
        return [self.mobility[key] for key in keys if key in self.mobility]

    def alerts_for(self, line_ids: list[str]) -> list[Alert]:
        """Alerts on these lines, plus the network-wide ones (naming no line), capped so a noisy feed that
        broadcasts every disruption network-wide cannot bury a stop under hundreds of them. Line-scoped
        alerts are always kept; the gravest network-wide ones survive the cap (self.alerts is level-ordered)."""
        wanted = set(line_ids)
        result: list[Alert] = []
        network_wide = 0
        for alert in self.alerts:
            if alert.line_ids:
                if wanted.intersection(alert.line_ids):
                    result.append(alert)
            elif network_wide < MAX_NETWORK_ALERTS_PER_STOP:
                result.append(alert)
                network_wide += 1
        return result
