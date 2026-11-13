"""Reading SIRI / SIRI Lite JSON answers (stop monitoring, general messages), as served by IDFM PRIM and the CTS.

SIRI JSON comes in two flavours: values wrapped in {"value": …} objects (PRIM) or plain (CTS), lists of one item
or bare items, field names in PascalCase. The helpers here accept both, so a provider only names the fields.
"""

from __future__ import annotations

from abc import abstractmethod
from datetime import datetime
from typing import Any

from homeassistant.util import dt as dt_util

from .base import Alert, Departure, Line, Provider, Stop, by_level

# InfoChannelRef of the general messages: the level of the alert (commercial messages are left out).
CHANNEL_LEVELS = {"information": 1, "perturbation": 2, "disruption": 2, "majeure": 3, "bloquante": 3}
SKIPPED_CHANNELS = {"commercial"}


def value(item: Any) -> Any:
    """The value of a SIRI field: {"value": x} or {"Value": x} unwrapped, the first item of a list."""
    while True:
        if isinstance(item, list):
            if not item:
                return None
            item = item[0]
        elif isinstance(item, dict) and ("value" in item or "Value" in item):
            item = item.get("value", item.get("Value"))
        else:
            return item


def text(item: Any) -> str:
    found = value(item)
    return str(found).strip() if found not in (None, "") else ""


def items(item: Any) -> list[Any]:
    if item is None:
        return []
    return item if isinstance(item, list) else [item]


def time(item: Any) -> datetime | None:
    found = text(item)
    return dt_util.parse_datetime(found) if found else None


def deliveries(data: Any, name: str) -> list[dict[str, Any]]:
    """The deliveries of a SIRI answer, wrapped in "Siri" (PRIM) or not (CTS)."""
    root = data.get("Siri", data) if isinstance(data, dict) else {}
    service = root.get("ServiceDelivery") if isinstance(root, dict) else None
    if not isinstance(service, dict):
        return []
    return [d for d in items(service.get(name)) if isinstance(d, dict)]


def ref_id(ref: str, prefix: str = "") -> str:
    """An identifier out of a SIRI reference: "STIF:Line::C01742:" → "C01742" (or the reference when plain)."""
    parts = [p for p in ref.split(":") if p]
    found = parts[-1] if parts else ref
    return found[len(prefix) :] if prefix and found.startswith(prefix) else found


def stop_visits(data: Any) -> list[dict[str, Any]]:
    visits: list[dict[str, Any]] = []
    for delivery in deliveries(data, "StopMonitoringDelivery"):
        visits.extend(v for v in items(delivery.get("MonitoredStopVisit")) if isinstance(v, dict))
    return visits


def departures_of(data: Any, line_names: dict[str, str]) -> list[Departure]:
    """The departures of a stop monitoring answer (cancelled ones left out)."""
    return [d for d in (visit_departure(v, line_names) for v in stop_visits(data)) if d is not None]


def visit_departure(visit: dict[str, Any], line_names: dict[str, str]) -> Departure | None:
    """A departure out of a MonitoredStopVisit; None when cancelled or without a time."""
    journey = visit.get("MonitoredVehicleJourney") or {}
    call = journey.get("MonitoredCall") or {}
    status = (text(call.get("DepartureStatus")) or text(call.get("ArrivalStatus"))).lower()
    if status in ("cancelled", "canceled", "noreport"):
        return None
    expected = time(call.get("ExpectedDepartureTime")) or time(call.get("ExpectedArrivalTime"))
    aimed = time(call.get("AimedDepartureTime")) or time(call.get("AimedArrivalTime"))
    extension = call.get("Extension") if isinstance(call.get("Extension"), dict) else {}
    flag = extension.get("IsRealTime")
    realtime = bool(flag) if flag is not None else expected is not None
    when = expected or aimed
    line_ref = text(journey.get("LineRef"))
    if when is None or not line_ref:
        return None
    line_id = ref_id(line_ref)
    destination = next(
        (found for found in map(text, (call.get("DestinationDisplay"), journey.get("DestinationName"))) if found),
        text(journey.get("DirectionName")),
    )
    direction = text(journey.get("DirectionRef"))
    return Departure(
        line_id=line_id,
        line=line_names.get(line_id) or text(journey.get("PublishedLineName")) or line_id,
        destination=destination,
        departure=when,
        realtime=realtime,
        scheduled=aimed if realtime and aimed and expected else None,
        direction=int(direction) if direction.isdigit() else None,
        trip_id=ref_id(text((journey.get("FramedVehicleJourneyRef") or {}).get("DatedVehicleJourneyRef"))) or None,
    )


def general_messages(data: Any) -> list[Alert]:
    """Traffic alerts out of a GeneralMessageDelivery: one per message, on the lines it names."""
    now = dt_util.utcnow()
    alerts: dict[str, Alert] = {}
    for delivery in deliveries(data, "GeneralMessageDelivery"):
        for message in items(delivery.get("InfoMessage")):
            if not isinstance(message, dict):
                continue
            channel = text(message.get("InfoChannelRef")).lower()
            if channel in SKIPPED_CHANNELS:
                continue
            end = time(message.get("ValidUntilTime"))
            if end is not None and end < now:
                continue
            content = message.get("Content") or {}
            texts: dict[str, str] = {}
            for part in items(content.get("Message")):
                if isinstance(part, dict):
                    kind = text(part.get("MessageType")) or text(part.get("MessageZoneRef")) or str(len(texts))
                    texts.setdefault(kind.upper(), text(part.get("MessageText")))
            lines = [ref_id(text(r)) for r in items(content.get("LineRef") or content.get("ImpactedLineRef"))]
            short = texts.get("SHORT_MESSAGE") or next(iter(texts.values()), "")
            long = texts.get("LONG_MESSAGE") or texts.get("TEXT_ONLY") or ""
            identifier = text(message.get("InfoMessageIdentifier")) or short
            if not identifier:
                continue
            alerts[identifier] = Alert(
                id=identifier,
                title=short or long[:80],
                description=long if long != short else "",
                level=CHANNEL_LEVELS.get(channel, 1),
                line_ids=tuple(dict.fromkeys(line for line in lines if line)),
                start=time(message.get("RecordedAtTime")),
                end=end,
            )
    return by_level(alerts.values())


class SiriMonitoringProvider(Provider):
    """A network whose departures come from a SIRI stop monitoring request per stop."""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._lines: dict[str, Line] = {}
        # Lines seen at the followed stops (networks whose alerts are asked line by line).
        self._seen_lines: set[str] = set()

    @abstractmethod
    async def _monitor(self, stop: Stop) -> Any:
        """The stop monitoring answer for a stop."""

    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        async def fetch(stop: Stop) -> list[Departure]:
            found = departures_of(await self._monitor(stop), {lid: n.short_name for lid, n in self._lines.items()})
            self._seen_lines.update(d.line_id for d in found)
            return found

        return await self._each_stop(stops, fetch)
