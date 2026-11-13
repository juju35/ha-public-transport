"""One coordinator per network: it asks for the departures of every configured stop of that network at once."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import ALERTS_REFRESH, DEFAULT_SCAN_INTERVAL, DEPARTED_GRACE, DOMAIN, LINES_REFRESH, MIN_SCAN_INTERVAL
from .providers import Alert, Departure, Line, Provider, ProviderError, Stop

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
            name=f"{DOMAIN}_{provider.id}",
            update_interval=timedelta(seconds=DEFAULT_SCAN_INTERVAL),
        )
        self.provider = provider
        self.stops: dict[str, Stop] = {}
        self._intervals: dict[str, int] = {}
        self.lines: dict[str, Line] = {}
        self.alerts: list[Alert] = []
        self._lines_updated: datetime | None = None
        self._alerts_updated: datetime | None = None
        # Set while the network fails and the last departures are kept (sensor attributes `stale` / `last_error`).
        self.last_error: ProviderError | None = None

    def add_stop(self, entry_id: str, stop: Stop, interval: int) -> None:
        self.stops[entry_id] = stop
        self._intervals[entry_id] = interval
        self._apply_interval()

    def remove_stop(self, entry_id: str) -> bool:
        """Forget an entry's stop; True when no stop is left (the coordinator can go)."""
        self.stops.pop(entry_id, None)
        self._intervals.pop(entry_id, None)
        self._apply_interval()
        return not self.stops

    def _apply_interval(self) -> None:
        # The most demanding entry sets the pace for the whole network.
        seconds = min(self._intervals.values(), default=DEFAULT_SCAN_INTERVAL)
        self.update_interval = timedelta(seconds=max(MIN_SCAN_INTERVAL, seconds))

    async def _async_update_data(self) -> dict[str, list[Departure]]:
        stops = list({stop.key: stop for stop in self.stops.values()}.values())
        try:
            await self._async_refresh_static()
            departures = await self.provider.departures(stops)
        except ProviderError as err:
            if self.data is None:
                raise UpdateFailed(str(err)) from err
            # A quota or a timeout only delays the next update: keep the last departures meanwhile.
            _LOGGER.warning("%s update failed, keeping the last departures: %s", self.provider.name, err)
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
                _LOGGER.debug("Could not refresh the %s lines: %s", self.provider.name, err)
        if self._alerts_updated is None or now - self._alerts_updated >= ALERTS_REFRESH:
            try:
                self.alerts = await self.provider.alerts()
                self._alerts_updated = now
            except ProviderError as err:
                _LOGGER.debug("Could not refresh the %s alerts: %s", self.provider.name, err)

    @staticmethod
    def _fresh(departures: dict[str, list[Departure]]) -> dict[str, list[Departure]]:
        """Without the departures already gone (kept data gets older at each failed update)."""
        limit = dt_util.utcnow() - DEPARTED_GRACE
        return {key: [d for d in items if d.departure >= limit] for key, items in departures.items()}

    def departures_for(self, stop: Stop, line_ids: list[str] | None = None) -> list[Departure]:
        limit = dt_util.utcnow() - DEPARTED_GRACE
        items = (self.data or {}).get(stop.key, [])
        return [d for d in items if d.departure >= limit and (not line_ids or d.line_id in line_ids)]

    def alerts_for(self, line_ids: list[str]) -> list[Alert]:
        """Alerts on these lines; an alert naming no line concerns the whole network."""
        wanted = set(line_ids)
        return [a for a in self.alerts if not a.line_ids or wanted.intersection(a.line_ids)]
