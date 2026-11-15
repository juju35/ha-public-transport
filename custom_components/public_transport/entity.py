"""Base entity: one service device per followed stop."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_LINES, DOMAIN
from .coordinator import NetworkCoordinator, PublicTransportConfigEntry
from .providers import Alert, Departure, Line, Stop


class PublicTransportEntity(CoordinatorEntity[NetworkCoordinator]):
    """An entity of a followed stop, attached to the stop's device."""

    _attr_has_entity_name = True

    def __init__(self, entry: PublicTransportConfigEntry, stop: Stop, key: str) -> None:
        super().__init__(entry.runtime_data)
        provider = entry.runtime_data.provider
        self.entry = entry
        self.stop = stop
        self._attr_translation_key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_attribution = f"Data: {provider.network_name} open data"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=f"{provider.network_name} {stop.name}",
            manufacturer=provider.network_name,
            model=stop.mode.capitalize(),
            entry_type=DeviceEntryType.SERVICE,
            configuration_url=provider.url,
        )

    @property
    def line_ids(self) -> list[str]:
        return list(self.entry.options.get(CONF_LINES, []))

    def line(self, line_id: str, fallback: str | None = None) -> Line:
        names: dict[str, str] = self.entry.data.get("line_names", {})
        return self.coordinator.lines.get(line_id) or Line(
            id=line_id, short_name=fallback or names.get(line_id, line_id)
        )

    def departure_dict(self, departure: Departure) -> dict[str, Any]:
        line = self.line(departure.line_id, departure.line)
        return {
            "line_id": departure.line_id,
            "line": line.short_name,
            "color": line.color,
            "text_color": line.text_color,
            "destination": departure.destination,
            "direction": departure.direction,
            "departure": departure.departure.isoformat(),
            "scheduled": departure.scheduled.isoformat() if departure.scheduled else None,
            "delay": departure.delay,
            "realtime": departure.realtime,
        }

    def alert_dicts(self, alerts: list[Alert]) -> list[dict[str, Any]]:
        return [
            {**alert.as_dict(), "lines": [self.line(lid).short_name for lid in alert.line_ids if lid in self.line_ids]}
            for alert in alerts
        ]
