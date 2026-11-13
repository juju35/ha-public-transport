"""A minimal GTFS-realtime reader: the protobuf wire format decoded by hand, for the fields the integration uses.

GTFS-RT feeds are protocol buffers (https://gtfs.org/realtime/reference/). Decoding the few messages needed here
takes less code than a generated module and keeps the integration free of a protobuf dependency (whose versions
Home Assistant pins for its own integrations). Unknown fields are skipped, as protobuf readers do.

Field numbers used (gtfs-realtime.proto):
- FeedMessage: 1 header, 2 entity
- FeedHeader: 3 timestamp
- FeedEntity: 1 id, 2 is_deleted, 3 trip_update, 5 alert
- TripUpdate: 1 trip, 2 stop_time_update, 5 delay
- TripDescriptor: 1 trip_id, 2 start_time, 3 start_date, 4 schedule_relationship, 5 route_id, 6 direction_id
- StopTimeUpdate: 1 stop_sequence, 2 arrival, 3 departure, 4 stop_id, 5 schedule_relationship
- StopTimeEvent: 1 delay, 2 time
- Alert: 1 active_period, 5 informed_entity, 7 effect, 8 url, 10 header_text, 11 description_text, 14 severity_level
- TimeRange: 1 start, 2 end; EntitySelector: 2 route_id, 4 trip, 5 stop_id
- TranslatedString: 1 translation; Translation: 1 text, 2 language
"""

from __future__ import annotations

from collections.abc import Iterator
from dataclasses import dataclass, field

# Trip schedule relationships
TRIP_CANCELED = 3
# Stop time schedule relationships
STOP_SKIPPED = 1
STOP_NO_DATA = 2
# Alert severity levels (UNKNOWN 1, INFO 2, WARNING 3, SEVERE 4) and effects (NO_SERVICE 1, SIGNIFICANT_DELAYS 3)
SEVERITY_LEVELS = {2: 1, 3: 2, 4: 3}
GRAVE_EFFECTS = {1: 3, 2: 2, 3: 2, 4: 2}


class DecodeError(ValueError):
    """The bytes are not a valid protocol buffer."""


def _varint(data: bytes, pos: int) -> tuple[int, int]:
    result = shift = 0
    while True:
        if pos >= len(data):
            raise DecodeError("Truncated varint")
        byte = data[pos]
        pos += 1
        result |= (byte & 0x7F) << shift
        if not byte & 0x80:
            return result, pos
        shift += 7
        if shift > 63:
            raise DecodeError("Varint too long")


def fields(data: bytes) -> Iterator[tuple[int, int | bytes]]:
    """(field number, value) of a message: an int for varints and fixed numbers, bytes for length-delimited ones."""
    pos = 0
    while pos < len(data):
        key, pos = _varint(data, pos)
        number, wire = key >> 3, key & 7
        if wire == 0:
            value, pos = _varint(data, pos)
        elif wire == 1:
            value, pos = int.from_bytes(data[pos : pos + 8], "little"), pos + 8
        elif wire == 2:
            length, pos = _varint(data, pos)
            if pos + length > len(data):
                raise DecodeError("Truncated field")
            value, pos = data[pos : pos + length], pos + length
        elif wire == 5:
            value, pos = int.from_bytes(data[pos : pos + 4], "little"), pos + 4
        else:
            raise DecodeError(f"Unsupported wire type {wire}")
        if pos > len(data):
            raise DecodeError("Truncated field")
        yield number, value


def _signed(value: int) -> int:
    """int32/int64 varints: negative numbers are their 64-bit two's complement."""
    return value - (1 << 64) if value >= 1 << 63 else value


def _text(value: int | bytes) -> str:
    return value.decode("utf-8", "replace") if isinstance(value, bytes) else str(value)


def _translated(data: bytes, languages: tuple[str, ...]) -> str:
    """The translation in the first preferred language, else the one without a language, else the first one."""
    found: list[tuple[str, str]] = []
    for number, value in fields(data):
        if number == 1 and isinstance(value, bytes):
            text = lang = ""
            for sub, item in fields(value):
                if sub == 1:
                    text = _text(item)
                elif sub == 2:
                    lang = _text(item).lower()
            found.append((lang, text))
    for wanted in languages:
        for lang, text in found:
            if lang.split("-")[0] == wanted:
                return text
    return next((text for lang, text in found if not lang), found[0][1] if found else "")


@dataclass(slots=True)
class StopTimeUpdate:
    stop_sequence: int | None = None
    stop_id: str | None = None
    arrival_time: int | None = None
    arrival_delay: int | None = None
    departure_time: int | None = None
    departure_delay: int | None = None
    relationship: int = 0


@dataclass(slots=True)
class TripUpdate:
    trip_id: str | None = None
    route_id: str | None = None
    direction_id: int | None = None
    start_date: str | None = None
    relationship: int = 0
    delay: int | None = None
    stop_time_updates: list[StopTimeUpdate] = field(default_factory=list)


@dataclass(slots=True)
class RtAlert:
    id: str
    header: str = ""
    description: str = ""
    url: str | None = None
    level: int = 1
    periods: list[tuple[int | None, int | None]] = field(default_factory=list)
    route_ids: list[str] = field(default_factory=list)
    stop_ids: list[str] = field(default_factory=list)


def _event(data: bytes) -> tuple[int | None, int | None]:
    """(time, delay) of a StopTimeEvent."""
    time = delay = None
    for number, value in fields(data):
        if number == 1 and isinstance(value, int):
            delay = _signed(value)
        elif number == 2 and isinstance(value, int):
            time = _signed(value)
    return time, delay


def _stop_time_update(data: bytes) -> StopTimeUpdate:
    update = StopTimeUpdate()
    for number, value in fields(data):
        if number == 1 and isinstance(value, int):
            update.stop_sequence = value
        elif number == 2 and isinstance(value, bytes):
            update.arrival_time, update.arrival_delay = _event(value)
        elif number == 3 and isinstance(value, bytes):
            update.departure_time, update.departure_delay = _event(value)
        elif number == 4:
            update.stop_id = _text(value)
        elif number == 5 and isinstance(value, int):
            update.relationship = value
    return update


def _trip_update(data: bytes) -> TripUpdate:
    trip = TripUpdate()
    for number, value in fields(data):
        if number == 1 and isinstance(value, bytes):
            for sub, item in fields(value):
                if sub == 1:
                    trip.trip_id = _text(item)
                elif sub == 3:
                    trip.start_date = _text(item)
                elif sub == 4 and isinstance(item, int):
                    trip.relationship = item
                elif sub == 5:
                    trip.route_id = _text(item)
                elif sub == 6 and isinstance(item, int):
                    trip.direction_id = item
        elif number == 2 and isinstance(value, bytes):
            trip.stop_time_updates.append(_stop_time_update(value))
        elif number == 5 and isinstance(value, int):
            trip.delay = _signed(value)
    return trip


def _alert(entity_id: str, data: bytes, languages: tuple[str, ...]) -> RtAlert:
    alert = RtAlert(id=entity_id)
    severity = effect = None
    for number, value in fields(data):
        if number == 1 and isinstance(value, bytes):
            start = end = None
            for sub, item in fields(value):
                if sub == 1 and isinstance(item, int):
                    start = item
                elif sub == 2 and isinstance(item, int):
                    end = item
            alert.periods.append((start, end))
        elif number == 5 and isinstance(value, bytes):
            for sub, item in fields(value):
                if sub == 2:
                    alert.route_ids.append(_text(item))
                elif sub == 5:
                    alert.stop_ids.append(_text(item))
                elif sub == 4 and isinstance(item, bytes):
                    alert.route_ids.extend(_text(v) for n, v in fields(item) if n == 5)
        elif number == 7 and isinstance(value, int):
            effect = value
        elif number == 8 and isinstance(value, bytes):
            alert.url = _translated(value, languages) or None
        elif number == 10 and isinstance(value, bytes):
            alert.header = _translated(value, languages).strip()
        elif number == 11 and isinstance(value, bytes):
            alert.description = _translated(value, languages).strip()
        elif number == 14 and isinstance(value, int):
            severity = value
    alert.level = SEVERITY_LEVELS.get(severity or 0) or GRAVE_EFFECTS.get(effect or 0, 1)
    return alert


@dataclass(slots=True)
class Feed:
    timestamp: int | None = None
    trip_updates: list[TripUpdate] = field(default_factory=list)
    alerts: list[RtAlert] = field(default_factory=list)


def parse_feed(data: bytes, languages: tuple[str, ...] = ("fr", "en")) -> Feed:
    """Trip updates and alerts of a FeedMessage (vehicle positions are skipped)."""
    feed = Feed()
    for number, value in fields(data):
        if number == 1 and isinstance(value, bytes):
            for sub, item in fields(value):
                if sub == 3 and isinstance(item, int):
                    feed.timestamp = item
        elif number == 2 and isinstance(value, bytes):
            entity_id = ""
            deleted = False
            trip: bytes | None = None
            alert: bytes | None = None
            for sub, item in fields(value):
                if sub == 1:
                    entity_id = _text(item)
                elif sub == 2:
                    deleted = bool(item)
                elif sub == 3 and isinstance(item, bytes):
                    trip = item
                elif sub == 5 and isinstance(item, bytes):
                    alert = item
            if deleted:
                continue
            if trip is not None:
                feed.trip_updates.append(_trip_update(trip))
            if alert is not None:
                feed.alerts.append(_alert(entity_id, alert, languages))
    return feed
