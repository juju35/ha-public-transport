"""Binary sensor: a traffic alert concerns a followed line of the stop."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import entry_stop
from .coordinator import PublicTransportConfigEntry
from .entity import PublicTransportEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: PublicTransportConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    async_add_entities([DisruptionSensor(entry, entry_stop(entry), "disruption")])


class DisruptionSensor(PublicTransportEntity, BinarySensorEntity):
    """On while the network announces a traffic alert on one of the followed lines."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _unrecorded_attributes = frozenset({"alerts"})

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.alerts_for(self.line_ids))

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        alerts = self.coordinator.alerts_for(self.line_ids)
        return {"level": max((a.level for a in alerts), default=0), "alerts": self.alert_dicts(alerts)}
