"""Sensors: next departure at the stop (all followed lines) and next departure of each followed line."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import entry_stop
from .const import CONF_MAX_DEPARTURES, DEFAULT_MAX_DEPARTURES
from .coordinator import PublicTransportConfigEntry
from .entity import PublicTransportEntity
from .providers import Stop


async def async_setup_entry(
    hass: HomeAssistant, entry: PublicTransportConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    stop = entry_stop(entry)
    entities: list[SensorEntity] = [StopSensor(entry, stop)]
    entities += [LineSensor(entry, stop, line_id) for line_id in entry.options.get("lines", [])]
    async_add_entities(entities)


class StopSensor(PublicTransportEntity, SensorEntity):
    """Next departure at the stop on the followed lines; the coming departures, lines and alerts as attributes.

    The card reads this sensor.
    """

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    # Lists that change at every update: kept out of the recorder.
    _unrecorded_attributes = frozenset({"departures", "alerts", "lines"})

    def __init__(self, entry: PublicTransportConfigEntry, stop: Stop) -> None:
        super().__init__(entry, stop, "next_departure")

    @property
    def native_value(self) -> datetime | None:
        departures = self.coordinator.departures_for(self.stop, self.line_ids)
        return departures[0].departure if departures else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        coordinator = self.coordinator
        limit = int(self.entry.options.get(CONF_MAX_DEPARTURES, DEFAULT_MAX_DEPARTURES))
        departures = coordinator.departures_for(self.stop, self.line_ids)[:limit]
        lines = [self.line(lid) for lid in self.line_ids]
        return {
            "config_entry_id": self.entry.entry_id,
            "provider": coordinator.provider.id,
            "network": coordinator.provider.name,
            "stop_id": self.stop.id,
            "stop_name": self.stop.name,
            "stop_city": self.stop.city,
            "mode": self.stop.mode,
            "lines": [
                {"id": line.id, "name": line.short_name, "color": line.color, "text_color": line.text_color}
                for line in lines
            ],
            "departures": [self.departure_dict(d) for d in departures],
            "alerts": self.alert_dicts(coordinator.alerts_for(self.line_ids)),
            # True while the last update failed and the departures are the ones of the update before.
            "stale": coordinator.last_error is not None,
            "last_error": str(coordinator.last_error) if coordinator.last_error else None,
        }


class LineSensor(PublicTransportEntity, SensorEntity):
    """Next departure of one line at the stop."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _unrecorded_attributes = frozenset({"next_departures", "alerts"})

    def __init__(self, entry: PublicTransportConfigEntry, stop: Stop, line_id: str) -> None:
        super().__init__(entry, stop, "line")
        self.line_id = line_id
        self._attr_unique_id = f"{entry.entry_id}_line_{line_id}"
        self._attr_translation_placeholders = {"line": self.line(line_id).short_name}

    @property
    def native_value(self) -> datetime | None:
        departures = self.coordinator.departures_for(self.stop, [self.line_id])
        return departures[0].departure if departures else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        departures = self.coordinator.departures_for(self.stop, [self.line_id])
        line = self.line(self.line_id)
        first = departures[0] if departures else None
        return {
            "config_entry_id": self.entry.entry_id,
            "network": self.coordinator.provider.name,
            "stop_name": self.stop.name,
            "mode": self.stop.mode,
            "line_id": self.line_id,
            "line": line.short_name,
            "color": line.color,
            "text_color": line.text_color,
            "destination": first.destination if first else None,
            "realtime": first.realtime if first else None,
            "delay": first.delay if first else None,
            "next_departures": [self.departure_dict(d) for d in departures[:3]],
            "alerts": self.alert_dicts(self.coordinator.alerts_for([self.line_id])),
        }
