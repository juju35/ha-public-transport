"""Diagnostics: the entry, the network coordinator state and the departures of the stop (the API key redacted)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.const import CONF_API_KEY
from homeassistant.core import HomeAssistant

from . import entry_stop
from .coordinator import PublicTransportConfigEntry
from .providers import Departure

TO_REDACT = {CONF_API_KEY}


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry: PublicTransportConfigEntry) -> dict[str, Any]:
    coordinator = entry.runtime_data
    stop = entry_stop(entry)
    return {
        "entry": async_redact_data({"data": dict(entry.data), "options": dict(entry.options)}, TO_REDACT),
        "network": {
            "provider": coordinator.provider.id,
            "api_key_set": coordinator.provider.api_key is not None,
            "update_interval": str(coordinator.update_interval),
            "last_update_success": coordinator.last_update_success,
            "last_error": str(coordinator.last_error) if coordinator.last_error else None,
            "stops": sorted(s.key for s in coordinator.stops.values()),
            "lines": len(coordinator.lines),
            "alerts": [a.as_dict() for a in coordinator.alerts],
        },
        "departures": [_departure(d) for d in coordinator.departures_for(stop)],
    }


def _departure(d: Departure) -> dict[str, Any]:
    return {
        "line_id": d.line_id,
        "line": d.line,
        "destination": d.destination,
        "departure": d.departure.isoformat(),
        "scheduled": d.scheduled.isoformat() if d.scheduled else None,
        "realtime": d.realtime,
    }
