"""The Public Transport integration: next departures at your stops, network by network."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_API_KEY, EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import Event, HomeAssistant, ServiceCall
from homeassistant.exceptions import ConfigEntryNotReady, HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.typing import ConfigType

from .const import (
    ATTR_CONFIG_ENTRY_ID,
    CARD_FILENAME,
    CONF_MODE,
    CONF_NETWORK,
    CONF_PROVIDER,
    CONF_SCAN_INTERVAL,
    CONF_STOP_CITY,
    CONF_STOP_ID,
    CONF_STOP_NAME,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    FRONTEND_URL,
    LOGOS_DIR,
    SERVICE_REFRESH,
)
from .coordinator import NetworkCoordinator, PublicTransportConfigEntry
from .providers import ProviderError, Stop, create_provider

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.BINARY_SENSOR, Platform.SENSOR]
CARD_PATH = Path(__file__).parent / "frontend" / CARD_FILENAME
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
REFRESH_SCHEMA = vol.Schema({vol.Optional(ATTR_CONFIG_ENTRY_ID): cv.string})


def entry_stop(entry: PublicTransportConfigEntry) -> Stop:
    """The stop a config entry follows."""
    return Stop(
        id=entry.data[CONF_STOP_ID],
        name=entry.data[CONF_STOP_NAME],
        mode=entry.data[CONF_MODE],
        city=entry.data.get(CONF_STOP_CITY),
    )


def network_key(data: dict[str, Any]) -> str:
    """The network of an entry's data: the provider, plus the dataset for a generic provider (one coordinator each)."""
    network = data.get(CONF_NETWORK)
    return (
        f"{data[CONF_PROVIDER]}:{network['id']}"
        if isinstance(network, dict) and network.get("id")
        else (data[CONF_PROVIDER])
    )


def provider_options(hass: HomeAssistant, network: dict[str, Any] | None) -> dict[str, Any]:
    """What a provider needs from Home Assistant: its network, a cache folder and the executor."""
    return {
        "network": network,
        "cache_dir": Path(hass.config.path(".storage", DOMAIN)),
        "executor": hass.async_add_executor_job,
    }


def entry_api_key(entry: PublicTransportConfigEntry) -> str | None:
    return entry.options.get(CONF_API_KEY, entry.data.get(CONF_API_KEY)) or None


def _network_api_key(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> str | None:
    """The key of this stop, else the key of another stop of the same network: one key serves the network."""
    key = network_key(entry.data)
    others = [
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.entry_id != entry.entry_id and e.data.get(CONF_PROVIDER) and network_key(e.data) == key
    ]
    return next((key for key in map(entry_api_key, [entry, *others]) if key), None)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the Lovelace card and register the refresh action once."""
    await hass.http.async_register_static_paths([StaticPathConfig(FRONTEND_URL, str(CARD_PATH.parent), True)])
    await _async_register_card(hass)

    async def refresh(call: ServiceCall) -> None:
        coordinators = _coordinators(hass, call.data.get(ATTR_CONFIG_ENTRY_ID))
        for coordinator in coordinators:
            # async_refresh (not async_request_refresh): the action returns once the data is fetched.
            await coordinator.async_refresh()
        failed = [c for c in coordinators if not c.last_update_success or c.last_error]
        if failed:
            error = failed[0].last_error or failed[0].last_exception
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="refresh_failed",
                translation_placeholders={"error": str(getattr(error, "__cause__", None) or error)},
            )

    hass.services.async_register(DOMAIN, SERVICE_REFRESH, refresh, REFRESH_SCHEMA)
    return True


async def _async_register_card(hass: HomeAssistant) -> None:
    """Add the card to the dashboard resources, the URL versioned with the file hash so browsers fetch updates."""
    digest = await hass.async_add_executor_job(
        lambda: hashlib.md5(CARD_PATH.read_bytes(), usedforsecurity=False).hexdigest()[:8]
    )
    base_url = f"{FRONTEND_URL}/{CARD_FILENAME}"
    url = f"{base_url}?v={digest}"

    async def register(_event: Event | None = None) -> None:
        resources, mode = _lovelace_resources(hass.data.get("lovelace"))
        if resources is None or mode != "storage":
            # Dashboards in YAML mode: resources can't be edited, load the card on every page.
            add_extra_js_url(hass, url)
            return
        try:
            if not resources.loaded:
                await resources.async_load()
                resources.loaded = True
            existing = [item for item in resources.async_items() if item.get("url", "").split("?")[0] == base_url]
            if not existing:
                await resources.async_create_item({"res_type": "module", "url": url})
                _LOGGER.info("Public transport card added to dashboard resources: %s", url)
            elif existing[0].get("url") != url:
                await resources.async_update_item(existing[0]["id"], {"res_type": "module", "url": url})
                _LOGGER.info("Public transport card resource updated: %s", url)
            for duplicate in existing[1:]:
                await resources.async_delete_item(duplicate["id"])
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning(
                "Could not add the public transport card to dashboard resources (%s). Add %s manually "
                "in Settings > Dashboards > Resources (JavaScript module)",
                err,
                url,
            )
            add_extra_js_url(hass, url)

    if hass.is_running:
        await register()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, register)


def _lovelace_resources(lovelace: Any) -> tuple[Any, str]:
    """Lovelace resources collection and its mode, whatever the Home Assistant version.

    hass.data["lovelace"] is a dict before 2025.2, then a dataclass whose `mode` field became `resource_mode` in 2026.2.
    """
    if isinstance(lovelace, dict):
        return lovelace.get("resources"), lovelace.get("resource_mode", lovelace.get("mode", "storage"))
    return getattr(lovelace, "resources", None), getattr(
        lovelace, "resource_mode", getattr(lovelace, "mode", "storage")
    )


async def async_setup_entry(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> bool:
    coordinators: dict[str, NetworkCoordinator] = hass.data.setdefault(DOMAIN, {})
    key = network_key(entry.data)
    api_key = _network_api_key(hass, entry)
    coordinator = coordinators.get(key)
    if coordinator is None:
        try:
            provider = create_provider(
                entry.data[CONF_PROVIDER],
                async_get_clientsession(hass),
                api_key,
                **provider_options(hass, entry.data.get(CONF_NETWORK)),
            )
        except ProviderError as err:
            raise ConfigEntryNotReady(str(err)) from err
        coordinator = coordinators[key] = NetworkCoordinator(hass, provider)
        coordinator.logo = await hass.async_add_executor_job(_logo_url, provider.key)
    else:
        # A key changed or removed in the options of one stop applies to the whole network.
        coordinator.provider.api_key = api_key

    stop = entry_stop(entry)
    coordinator.add_stop(entry.entry_id, stop, int(entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)))
    # The first entry of a network, or a stop the last update did not ask for: fetch now.
    if coordinator.data is None or stop.key not in coordinator.data:
        await coordinator.async_refresh()
    if not coordinator.last_update_success:
        _release(hass, entry)
        raise ConfigEntryNotReady(
            translation_domain=DOMAIN,
            translation_key="network_unavailable",
            translation_placeholders={"error": str(coordinator.last_exception)},
        )
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        _release(hass, entry)
    return unloaded


def _release(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> None:
    """Take the entry's stop out of its network coordinator, and drop the coordinator once no stop is left."""
    coordinators: dict[str, NetworkCoordinator] = hass.data.get(DOMAIN, {})
    key = network_key(entry.data)
    coordinator = coordinators.get(key)
    if coordinator is not None and coordinator.remove_stop(entry.entry_id):
        coordinators.pop(key)
        hass.async_create_task(coordinator.async_shutdown(), f"{DOMAIN}_shutdown")


def _logo_url(key: str) -> str | None:
    """The URL of the network's logo when the integration ships one (frontend/logos/<key>.svg, else .png)."""
    for extension in ("svg", "png"):
        name = f"{key.replace(':', '-')}.{extension}"
        if (CARD_PATH.parent / LOGOS_DIR / name).is_file():
            return f"{FRONTEND_URL}/{LOGOS_DIR}/{name}"
    return None


async def _async_reload(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


def _coordinators(hass: HomeAssistant, entry_id: str | None) -> list[NetworkCoordinator]:
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if e.state is ConfigEntryState.LOADED]
    if entry_id:
        entries = [e for e in entries if e.entry_id == entry_id]
    if not entries:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_stop")
    return list({id(e.runtime_data): e.runtime_data for e in entries}.values())
