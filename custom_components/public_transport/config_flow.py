"""Config flow: network, stop search, stop, lines. One config entry per stop."""

from __future__ import annotations

import asyncio
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_API_KEY
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)

from . import entry_stop, provider_options
from .const import (
    CONF_LINES,
    CONF_MAX_DEPARTURES,
    CONF_MODE,
    CONF_NETWORK,
    CONF_PROVIDER,
    CONF_QUERY,
    CONF_SCAN_INTERVAL,
    CONF_STOP,
    CONF_STOP_CITY,
    CONF_STOP_ID,
    CONF_STOP_NAME,
    DEFAULT_MAX_DEPARTURES,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)
from .providers import (
    PROVIDERS,
    GtfsNetwork,
    Line,
    Provider,
    ProviderAuthError,
    ProviderError,
    Stop,
    create_provider,
    fetch_catalog,
    search_networks,
)

CONF_LINE_NAMES = "line_names"
PASSWORD = TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))


def _line_label(line: Line) -> str:
    return f"{line.short_name} — {line.long_name}" if line.long_name else line.short_name


def _lines_selector(lines: list[Line]) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(
            options=[SelectOptionDict(value=line.id, label=_line_label(line)) for line in lines],
            multiple=True,
            mode=SelectSelectorMode.LIST,
        )
    )


class PublicTransportConfigFlow(ConfigFlow, domain=DOMAIN):
    """Add a stop of a network."""

    VERSION = 1

    def __init__(self) -> None:
        self._provider_id: str = ""
        self._api_key: str | None = None
        self._stops: dict[str, Stop] = {}
        self._hints: dict[str, tuple[list[str], list[str]]] = {}
        self._stop: Stop | None = None
        self._lines: list[Line] = []
        self._catalog: list[GtfsNetwork] | None = None
        self._networks: dict[str, GtfsNetwork] = {}
        self._network: GtfsNetwork | None = None
        self._network_query = ""
        self._download: asyncio.Task[None] | None = None
        self._progress_shown = False
        self._provider_instance: Provider | None = None

    def _provider(self) -> Provider:
        """One provider for the whole flow: a generic one keeps the timetable it read for the next steps."""
        if self._provider_instance is None:
            network = self._network.as_dict() if self._network else None
            self._provider_instance = create_provider(
                self._provider_id,
                async_get_clientsession(self.hass),
                self._api_key,
                **provider_options(self.hass, network),
            )
        return self._provider_instance

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._provider_id = user_input[CONF_PROVIDER]
            self._api_key = (user_input.get(CONF_API_KEY) or "").strip() or None
            self._provider_instance = None
            cls = PROVIDERS[self._provider_id]
            if cls.api_key_mode == "required" and not self._api_key:
                return self._user_form({CONF_API_KEY: "api_key_required"})
            if cls.needs_network:
                return await self.async_step_network_search()
            return await self.async_step_search()
        return self._user_form({})

    def _user_form(self, errors: dict[str, str]) -> ConfigFlowResult:
        options = [
            SelectOptionDict(value=cls.id, label=f"{cls.name} — {cls.area}")
            for cls in sorted(PROVIDERS.values(), key=lambda c: (c.needs_network, c.name.lower()))
        ]
        schema = vol.Schema(
            {
                vol.Required(CONF_PROVIDER, default=self._provider_id or "star"): SelectSelector(
                    SelectSelectorConfig(options=options, mode=SelectSelectorMode.LIST)
                ),
                vol.Optional(CONF_API_KEY): PASSWORD,
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_network_search(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """A generic provider: find the network in the national catalogue."""
        errors: dict[str, str] = {}
        if user_input is not None:
            self._network_query = user_input[CONF_QUERY].strip()
            try:
                if self._catalog is None:
                    self._catalog = await fetch_catalog(async_get_clientsession(self.hass))
            except ProviderError:
                errors["base"] = "cannot_connect"
            else:
                found = search_networks(self._catalog, self._network_query)
                if not found:
                    errors[CONF_QUERY] = "no_network_found"
                else:
                    self._networks = {n.id: n for n in found}
                    return await self.async_step_network()
        schema = vol.Schema({vol.Required(CONF_QUERY, default=self._network_query): TextSelector()})
        return self.async_show_form(step_id="network_search", data_schema=schema, errors=errors)

    async def async_step_network(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._network = self._networks[user_input[CONF_NETWORK]]
            self._provider_instance = None
            self._download = None
            return await self.async_step_download()
        options = [SelectOptionDict(value=n.id, label=n.label) for n in self._networks.values()]
        schema = vol.Schema(
            {
                vol.Required(CONF_NETWORK): SelectSelector(
                    SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN)
                )
            }
        )
        return self.async_show_form(
            step_id="network", data_schema=schema, description_placeholders={"query": self._network_query}
        )

    async def async_step_download(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """The network's timetable is downloaded and read once (it can take a minute for a big network)."""
        if self._download is None:
            provider = self._provider()
            self._download = self.hass.async_create_task(provider.prepare(), f"{DOMAIN}_timetable")
            self._progress_shown = False
        if not self._download.done():
            self._progress_shown = True
            return self.async_show_progress(
                step_id="download",
                progress_action="download",
                progress_task=self._download,
                description_placeholders={"network": self._provider().network_name},
            )
        failed = self._download.exception() is not None
        if failed:
            self._download = None
        if not self._progress_shown:
            # Done before any progress was shown (eager tasks, timetable already on disk): no progress step to close.
            return self.async_abort(reason="cannot_connect") if failed else await self.async_step_search()
        return self.async_show_progress_done(next_step_id="download_failed" if failed else "search")

    async def async_step_download_failed(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_abort(reason="cannot_connect")

    async def async_step_search(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        query = ""
        if user_input is not None:
            query = user_input[CONF_QUERY].strip()
            provider = self._provider()
            try:
                stops = await provider.search_stops(query)
                hints = await _hints(provider, stops)
            except ProviderAuthError:
                # The key is typed on the first step: back there to fix it.
                return self._user_form({"base": "invalid_auth"})
            except ProviderError:
                errors["base"] = "cannot_connect"
            else:
                if not stops:
                    errors[CONF_QUERY] = "no_stop_found"
                else:
                    self._stops = {stop.key: stop for stop in stops}
                    self._hints = hints
                    return await self.async_step_stop()
        schema = vol.Schema({vol.Required(CONF_QUERY, default=query): TextSelector()})
        return self.async_show_form(
            step_id="search",
            data_schema=schema,
            errors=errors,
            description_placeholders={"network": self._provider().network_name},
        )

    async def async_step_stop(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            stop = self._stops[user_input[CONF_STOP]]
            await self.async_set_unique_id(f"{self._provider().key}_{stop.key}")
            self._abort_if_unique_id_configured()
            try:
                self._lines = await self._provider().lines_at_stop(stop)
            except ProviderError:
                errors["base"] = "cannot_connect"
            else:
                self._stop = stop
                if not self._lines:
                    return self.async_abort(reason="no_line")
                return await self.async_step_lines()
        options = [
            SelectOptionDict(value=key, label=_stop_label(stop, self._hints.get(key)))
            for key, stop in self._stops.items()
        ]
        schema = vol.Schema(
            {
                vol.Required(CONF_STOP): SelectSelector(
                    SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN)
                )
            }
        )
        return self.async_show_form(step_id="stop", data_schema=schema, errors=errors)

    async def async_step_lines(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        assert self._stop is not None
        errors: dict[str, str] = {}
        if user_input is not None:
            selected = [lid for lid in user_input.get(CONF_LINES, []) if any(line.id == lid for line in self._lines)]
            if not selected:
                errors[CONF_LINES] = "no_line_selected"
            else:
                stop = self._stop
                data: dict[str, Any] = {
                    CONF_PROVIDER: self._provider_id,
                    CONF_STOP_ID: stop.id,
                    CONF_STOP_NAME: stop.name,
                    CONF_STOP_CITY: stop.city,
                    CONF_MODE: stop.mode,
                    CONF_LINE_NAMES: {line.id: line.short_name for line in self._lines},
                }
                if self._api_key:
                    data[CONF_API_KEY] = self._api_key
                if self._network:
                    data[CONF_NETWORK] = self._network.as_dict()
                return self.async_create_entry(
                    title=f"{self._provider().network_name} {stop.name}",
                    data=data,
                    options={CONF_LINES: selected},
                )
        schema = vol.Schema(
            {
                vol.Required(CONF_LINES, default=[line.id for line in self._lines]): _lines_selector(self._lines),
            }
        )
        return self.async_show_form(
            step_id="lines",
            data_schema=schema,
            errors=errors,
            description_placeholders={"stop": self._stop.label},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return PublicTransportOptionsFlow()


class PublicTransportOptionsFlow(OptionsFlow):
    """Lines followed, polling interval, departures kept and the network's API key."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entry = self.config_entry
        errors: dict[str, str] = {}
        names: dict[str, str] = dict(entry.data.get(CONF_LINE_NAMES, {}))
        lines = await self._lines(entry, names, list(entry.options.get(CONF_LINES, [])))
        if user_input is not None:
            if not user_input.get(CONF_LINES):
                errors[CONF_LINES] = "no_line_selected"
            else:
                options = {
                    CONF_LINES: list(user_input[CONF_LINES]),
                    CONF_SCAN_INTERVAL: int(user_input[CONF_SCAN_INTERVAL]),
                    CONF_MAX_DEPARTURES: int(user_input[CONF_MAX_DEPARTURES]),
                }
                # An emptied field removes the key (the entry data keeps the one typed at setup otherwise).
                options[CONF_API_KEY] = (user_input.get(CONF_API_KEY) or "").strip()
                # Lines discovered since the entry was made keep their names for the sensors.
                known = {line.id: line.short_name for line in lines}
                if known.keys() - names.keys():
                    self.hass.config_entries.async_update_entry(
                        entry, data={**entry.data, CONF_LINE_NAMES: {**names, **known}}
                    )
                return self.async_create_entry(data=options)

        current = entry.options
        api_key = current.get(CONF_API_KEY, entry.data.get(CONF_API_KEY))
        schema = vol.Schema(
            {
                vol.Required(CONF_LINES, default=list(current.get(CONF_LINES, []))): _lines_selector(lines),
                vol.Required(
                    CONF_SCAN_INTERVAL, default=current.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=MIN_SCAN_INTERVAL,
                        max=MAX_SCAN_INTERVAL,
                        step=10,
                        unit_of_measurement="s",
                        mode=NumberSelectorMode.BOX,
                    )
                ),
                vol.Required(
                    CONF_MAX_DEPARTURES, default=current.get(CONF_MAX_DEPARTURES, DEFAULT_MAX_DEPARTURES)
                ): NumberSelector(NumberSelectorConfig(min=1, max=20, step=1, mode=NumberSelectorMode.BOX)),
                vol.Optional(CONF_API_KEY, description={"suggested_value": api_key}): PASSWORD,
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema, errors=errors)

    async def _lines(self, entry: ConfigEntry, names: dict[str, str], selected: list[str]) -> list[Line]:
        """Lines serving the stop now (and the followed ones it no longer lists); the known ones offline."""
        known = [Line(id=lid, short_name=name) for lid, name in names.items()]
        coordinator = getattr(entry, "runtime_data", None)
        if coordinator is None:
            return known
        try:
            found = await coordinator.provider.lines_at_stop(entry_stop(entry), coordinator.lines)
        except ProviderError:
            return known
        ids = {line.id for line in found}
        return found + [line for line in known if line.id not in ids and line.id in selected]


async def _hints(provider: Provider, stops: list[Stop]) -> dict[str, tuple[list[str], list[str]]]:
    """Lines serving each stop found and the destinations of its coming passages, when the network tells:
    they tell apart stops of the same name (both sides of a street, the platforms of a metro station)."""
    found: dict[str, tuple[list[str], list[str]]] = {}
    for index, fetch in enumerate((getattr(provider, "served_lines", None), getattr(provider, "destinations", None))):
        if fetch is None:
            continue
        try:
            values = await fetch(stops)
        except ProviderError:
            continue
        for key, names in values.items():
            found.setdefault(key, ([], []))[index].extend(names)
    return found


# Destinations listed in a stop label, at most: enough to tell the directions apart.
MAX_DESTINATIONS = 3


def _stop_label(stop: Stop, hints: tuple[list[str], list[str]] | None) -> str:
    lines, destinations = hints or ([], [])
    parts = [stop.label, stop.mode.capitalize()]
    if lines:
        parts.append(", ".join(lines))
    if destinations:
        more = "…" if len(destinations) > MAX_DESTINATIONS else ""
        parts.append("→ " + " / ".join(destinations[:MAX_DESTINATIONS]) + more)
    return " · ".join(parts)
