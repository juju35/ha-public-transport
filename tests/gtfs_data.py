"""A small GTFS network built around the current time, and GTFS-RT feeds encoded by hand (protobuf wire format)."""

from __future__ import annotations

import io
import zipfile
from datetime import datetime, timedelta

from homeassistant.util import dt as dt_util

ZONE = "Europe/Paris"
GTFS_URL = "https://example.org/gtfs.zip"
RT_URL = "https://example.org/trip-updates.pb"
ALERTS_URL = "https://example.org/alerts.pb"
NETWORK = {
    "id": "reseau-test",
    "name": "Réseau Test",
    "area": "Testville",
    "gtfs_url": GTFS_URL,
    "realtime_urls": [RT_URL],
    "alerts_urls": [ALERTS_URL],
}


# ── protobuf encoding ─────────────────────────────────────────────────────────────────────────────────────────────
def _varint(value: int) -> bytes:
    if value < 0:
        value += 1 << 64
    out = bytearray()
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            out.append(byte | 0x80)
        else:
            out.append(byte)
            return bytes(out)


def varint(number: int, value: int) -> bytes:
    return _varint(number << 3) + _varint(value)


def message(number: int, *parts: bytes | str) -> bytes:
    body = b"".join(p.encode() if isinstance(p, str) else p for p in parts)
    return _varint(number << 3 | 2) + _varint(len(body)) + body


def text(number: int, value: str) -> bytes:
    return message(number, value)


def translated(number: int, value: str, lang: str = "fr") -> bytes:
    return message(number, message(1, text(1, value), text(2, lang)))


def feed(*entities: bytes, timestamp: int | None = None) -> bytes:
    header = message(1, text(1, "2.0"), varint(3, timestamp or int(dt_util.utcnow().timestamp())))
    return header + b"".join(entities)


def trip_update(
    entity_id: str,
    trip_id: str,
    *updates: bytes,
    route_id: str = "",
    relationship: int = 0,
    start_date: str = "",
    delay: int | None = None,
) -> bytes:
    trip = text(1, trip_id) + varint(4, relationship)
    if route_id:
        trip += text(5, route_id)
    if start_date:
        trip += text(3, start_date)
    body = message(1, trip) + b"".join(updates)
    if delay is not None:
        body += varint(5, delay)
    return message(2, text(1, entity_id), message(3, body))


def stop_time(
    sequence: int | None = None,
    stop_id: str = "",
    *,
    delay: int | None = None,
    time: int | None = None,
    relationship: int = 0,
) -> bytes:
    body = b""
    if sequence is not None:
        body += varint(1, sequence)
    event = b""
    if delay is not None:
        event += varint(1, delay)
    if time is not None:
        event += varint(2, time)
    if event:
        body += message(3, event)
    if stop_id:
        body += text(4, stop_id)
    if relationship:
        body += varint(5, relationship)
    return message(2, body)


def alert(entity_id: str, header: str, *, route_id: str = "", stop_id: str = "", severity: int = 3) -> bytes:
    informed = message(5, (text(2, route_id) if route_id else b"") + (text(5, stop_id) if stop_id else b""))
    now = int(dt_util.utcnow().timestamp())
    period = message(1, varint(1, now - 600), varint(2, now + 3600))
    body = period + informed + translated(10, header) + translated(11, f"{header} (détails)") + varint(14, severity)
    return message(2, text(1, entity_id), message(5, body))


# ── GTFS zip ──────────────────────────────────────────────────────────────────────────────────────────────────────
def local_now() -> datetime:
    return dt_util.now(dt_util.get_time_zone(ZONE))


def gtfs_time(minutes: float) -> str:
    """A GTFS time `minutes` from now, counted from today's midnight in the network's time zone."""
    now = local_now()
    midnight = datetime(now.year, now.month, now.day, 12, tzinfo=now.tzinfo) - timedelta(hours=12)
    seconds = int((now + timedelta(minutes=minutes) - midnight).total_seconds())
    return f"{seconds // 3600:02d}:{seconds % 3600 // 60:02d}:{seconds % 60:02d}"


def service_date(offset: int = 0) -> str:
    return (local_now().date() + timedelta(days=offset)).strftime("%Y%m%d")


def _csv(header: str, *rows: str) -> str:
    return "\n".join([header, *rows]) + "\n"


def gtfs_zip() -> bytes:
    """Two lines (tram T1, bus 12) at "Gare" (two platforms) and "Mairie"; trip t3 does not run today."""
    start, end = service_date(-30), service_date(30)
    files = {
        "agency.txt": _csv("agency_id,agency_name,agency_url,agency_timezone", f"A,Test,https://example.org,{ZONE}"),
        "stops.txt": _csv(
            "stop_id,stop_name,stop_lat,stop_lon,location_type,parent_station",
            "GARE,Gare,48.1,-1.6,1,",
            "G1,Gare,48.1,-1.6,0,GARE",
            "G2,Gare,48.1,-1.6,0,GARE",
            "M1,Mairie,48.2,-1.7,,",
            "T9,Terminus,48.3,-1.8,0,",
        ),
        "routes.txt": _csv(
            "route_id,agency_id,route_short_name,route_long_name,route_type,route_color,route_text_color",
            "R1,A,T1,Gare - Terminus,0,E2001A,FFFFFF",
            "R2,A,12,,3,0055A4,",
        ),
        "trips.txt": _csv(
            "route_id,service_id,trip_id,trip_headsign,direction_id",
            "R1,DAILY,t1,Terminus,0",
            "R1,DAILY,t2,Terminus,0",
            "R2,DAILY,t3,,1",
            "R2,NEVER,t4,Mairie,1",
            "R1,DAILY,t5,Terminus,0",
        ),
        "calendar.txt": _csv(
            "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date",
            f"DAILY,1,1,1,1,1,1,1,{start},{end}",
            f"NEVER,1,1,1,1,1,1,1,{start},{end}",
        ),
        "calendar_dates.txt": _csv("service_id,date,exception_type", f"NEVER,{service_date()},2"),
        "stop_times.txt": _csv(
            "trip_id,arrival_time,departure_time,stop_id,stop_sequence,pickup_type",
            f"t1,{gtfs_time(4)},{gtfs_time(4)},G1,1,0",
            f"t1,{gtfs_time(10)},{gtfs_time(10)},T9,2,0",
            f"t2,{gtfs_time(20)},{gtfs_time(20)},G1,1,0",
            f"t2,{gtfs_time(26)},{gtfs_time(26)},T9,2,0",
            f"t3,{gtfs_time(6)},{gtfs_time(6)},G2,1,0",
            f"t3,{gtfs_time(15)},{gtfs_time(15)},M1,2,1",
            f"t4,{gtfs_time(8)},{gtfs_time(8)},G2,1,0",
            f"t5,{gtfs_time(30)},{gtfs_time(30)},G1,1,0",
            f"t5,{gtfs_time(36)},{gtfs_time(36)},T9,2,0",
        ),
    }
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        for name, content in files.items():
            archive.writestr(name, "﻿" + content if name == "stops.txt" else content)
    return buffer.getvalue()


def realtime() -> bytes:
    """t1 two minutes late at G1, t2 cancelled, an extra trip at G1, t5 late from an earlier stop."""
    soon = int((dt_util.utcnow() + timedelta(minutes=12)).timestamp())
    return feed(
        trip_update("e1", "t1", stop_time(1, "G1", delay=120), route_id="R1", start_date=service_date()),
        trip_update("e2", "t2", route_id="R1", relationship=3),
        trip_update("e3", "extra", stop_time(None, "G1", time=soon), route_id="R2", relationship=1),
        trip_update("e4", "t5", route_id="R1", delay=-60),
    )


def alerts() -> bytes:
    return feed(alert("a1", "Travaux", route_id="R2", severity=4), alert("a2", "Ascenseur en panne", stop_id="G1"))


def catalog() -> list[dict]:
    """Answer of the transport.data.gouv.fr API: one network with GTFS-RT, one without, one with RT only."""
    return [
        {
            "slug": "reseau-test",
            "title": "Réseau Test",
            "type": "public-transit",
            "covered_area": [{"type": "epci", "nom": "Testville Métropole"}],
            "resources": [
                {"format": "GTFS", "url": GTFS_URL, "is_available": True, "updated": "2026-11-01T00:00:00Z"},
                {"format": "GTFS", "url": "https://example.org/old.zip", "is_available": True, "updated": "2025-01-01"},
                {"format": "gtfs-rt", "url": RT_URL, "features": ["trip_updates", "vehicle_positions"]},
                {"format": "gtfs-rt", "url": ALERTS_URL, "features": ["service_alerts"]},
            ],
        },
        {
            "slug": "timetable-only",
            "title": "Horaires seuls",
            "type": "public-transit",
            "resources": [{"format": "GTFS", "url": "https://example.org/x.zip", "is_available": True}],
        },
        {
            "slug": "velos",
            "title": "Vélos Testville",
            "type": "bike-scooter-sharing",
            "resources": [{"format": "gbfs", "url": "https://example.org/gbfs.json"}],
        },
    ]
