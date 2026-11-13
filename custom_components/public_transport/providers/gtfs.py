"""Any network publishing a GTFS timetable and a GTFS-RT feed, found in the national catalogue (transport.data.gouv.fr).

The French national access point (Point d'Accès National) lists the open transit data of every network
(https://transport.data.gouv.fr/api/datasets). A network is offered here when its dataset has a GTFS resource and a
GTFS-RT resource: hundreds of networks, big and small (Toulouse, Bordeaux, Montpellier, Nantes, Lille, Brest…).

- The GTFS zip is downloaded once a day (conditional request) into `.storage/public_transport/` and read in the
  executor: stops for the search, routes for the lines, and the timetable of the followed stops only.
- Departures are the timetable of the followed stops, corrected by the GTFS-RT trip updates (times or delays,
  propagated to the following stops as the specification says; cancelled trips and skipped stops dropped).
- Alerts come from the GTFS-RT service alerts, when the network publishes them.
"""

from __future__ import annotations

import csv
import io
import json
import logging
import re
import time
import unicodedata
import zipfile
from collections.abc import Iterable, Iterator
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, tzinfo
from pathlib import Path
from typing import Any

import aiohttp
from homeassistant.util import dt as dt_util

from .base import Alert, Departure, Line, Provider, ProviderError, ProviderRateLimitError, Stop
from .gtfs_rt import STOP_NO_DATA, STOP_SKIPPED, TRIP_CANCELED, DecodeError, Feed, TripUpdate, parse_feed

_LOGGER = logging.getLogger(__name__)

CATALOG_URL = "https://transport.data.gouv.fr/api/datasets"
TIMEOUT = aiohttp.ClientTimeout(total=30)
DOWNLOAD_TIMEOUT = aiohttp.ClientTimeout(total=600, sock_read=120)
STATIC_REFRESH = timedelta(hours=24)
# Departures looked for this far ahead, at most this many per stop.
HORIZON = timedelta(hours=3)
PER_STOP = 30
# A departure a few minutes late is still worth listing when the real-time feed fails.
PAST = timedelta(minutes=2)
HEX = re.compile(r"^#?([0-9a-fA-F]{6})$")
# GTFS route types (basic and extended) as the integration's modes.
ROUTE_MODES = {0: "tram", 1: "metro", 2: "train", 3: "bus", 4: "ferry", 5: "tram", 6: "cable", 7: "funicular"}
EXTENDED_MODES = ((100, 200, "train"), (200, 300, "bus"), (400, 500, "metro"), (700, 800, "bus"), (900, 1000, "tram"))
MODE_ORDER = ("metro", "tram", "train", "bus", "cable", "funicular", "ferry")


def _fold(text: str) -> str:
    """Lowercase without accents, for the searches."""
    return "".join(c for c in unicodedata.normalize("NFKD", text.casefold()) if not unicodedata.combining(c))


def _mode(route_type: str | None) -> str:
    try:
        value = int(route_type or 3)
    except ValueError:
        return "bus"
    if value in ROUTE_MODES:
        return ROUTE_MODES[value]
    return next((mode for low, high, mode in EXTENDED_MODES if low <= value < high), "bus")


def _color(value: str | None) -> str | None:
    match = HEX.match((value or "").strip())
    return f"#{match.group(1).lower()}" if match else None


def _seconds(value: str) -> int | None:
    """A GTFS time (HH:MM:SS, hours may pass 24) in seconds after the service day's noon minus 12 h."""
    parts = value.strip().split(":")
    if len(parts) != 3:
        return None
    try:
        hours, minutes, seconds = (int(p) for p in parts)
    except ValueError:
        return None
    return hours * 3600 + minutes * 60 + seconds


def _rows(archive: zipfile.ZipFile, name: str) -> Iterator[dict[str, str]]:
    """Rows of a GTFS file (a missing optional file has none); BOM and stray spaces in headers removed."""
    member = next((n for n in archive.namelist() if n.rsplit("/", 1)[-1] == name), None)
    if member is None:
        return
    with archive.open(member) as raw:
        reader = csv.reader(io.TextIOWrapper(raw, encoding="utf-8-sig", errors="replace", newline=""))
        header = [h.strip() for h in next(reader, [])]
        for row in reader:
            yield dict(zip(header, (v.strip() for v in row), strict=False))


@dataclass(slots=True)
class Timetable:
    """The scheduled passages at some stops: (seconds, trip id, stop sequence) by stop id, sorted by time."""

    stop_ids: frozenset[str]
    passages: dict[str, list[tuple[int, str, int]]] = field(default_factory=dict)


@dataclass(slots=True)
class GtfsStatic:
    """What the integration keeps of a GTFS zip (the timetable of the followed stops is read apart)."""

    path: Path
    timezone: str = "Europe/Paris"
    stops: dict[str, tuple[str, float | None, float | None, str]] = field(default_factory=dict)
    lines: dict[str, Line] = field(default_factory=dict)
    trips: dict[str, tuple[str, str, str, int | None]] = field(default_factory=dict)  # route, service, headsign, dir
    calendar: dict[str, tuple[set[int], date, date]] = field(default_factory=dict)
    exceptions: dict[str, dict[date, bool]] = field(default_factory=dict)
    stop_routes: dict[str, set[str]] = field(default_factory=dict)
    stop_headsigns: dict[str, set[str]] = field(default_factory=dict)
    timetable: Timetable | None = None

    @classmethod
    def load(cls, path: Path) -> GtfsStatic:
        """Read stops, routes, trips, calendars and which routes serve which stop (one pass over stop_times)."""
        static = cls(path=path)
        try:
            with zipfile.ZipFile(path) as archive:
                static._read(archive)
        except (OSError, zipfile.BadZipFile, csv.Error, KeyError) as err:
            raise ProviderError(f"Invalid GTFS file: {err}") from err
        return static

    def _read(self, archive: zipfile.ZipFile) -> None:
        self.timezone = next((r.get("agency_timezone") or "" for r in _rows(archive, "agency.txt")), "") or (
            "Europe/Paris"
        )
        for row in _rows(archive, "stops.txt"):
            if row.get("stop_id") and row.get("location_type", "0") in ("", "0"):
                self.stops[row["stop_id"]] = (
                    row.get("stop_name") or row["stop_id"],
                    _float(row.get("stop_lat")),
                    _float(row.get("stop_lon")),
                    row.get("parent_station", ""),
                )
        for row in _rows(archive, "routes.txt"):
            if row.get("route_id"):
                self.lines[row["route_id"]] = Line(
                    id=row["route_id"],
                    short_name=row.get("route_short_name") or row.get("route_long_name") or row["route_id"],
                    long_name=(row.get("route_long_name") or None) if row.get("route_short_name") else None,
                    color=_color(row.get("route_color")),
                    text_color=_color(row.get("route_text_color")),
                    mode=_mode(row.get("route_type")),
                )
        for row in _rows(archive, "trips.txt"):
            if row.get("trip_id"):
                direction = row.get("direction_id", "")
                self.trips[row["trip_id"]] = (
                    row.get("route_id", ""),
                    row.get("service_id", ""),
                    row.get("trip_headsign", ""),
                    int(direction) if direction.isdigit() else None,
                )
        for row in _rows(archive, "calendar.txt"):
            days = {i for i, day in enumerate(WEEKDAYS) if row.get(day) == "1"}
            start, end = _date(row.get("start_date")), _date(row.get("end_date"))
            if row.get("service_id") and start and end:
                self.calendar[row["service_id"]] = (days, start, end)
        for row in _rows(archive, "calendar_dates.txt"):
            day = _date(row.get("date"))
            if row.get("service_id") and day:
                self.exceptions.setdefault(row["service_id"], {})[day] = row.get("exception_type") == "1"
        last: dict[str, tuple[int, str]] = {}
        for row in _rows(archive, "stop_times.txt"):
            trip = self.trips.get(row.get("trip_id", ""))
            stop_id = row.get("stop_id", "")
            if trip is None or not stop_id:
                continue
            self.stop_routes.setdefault(stop_id, set()).add(trip[0])
            if trip[2]:
                heads = self.stop_headsigns.setdefault(stop_id, set())
                if len(heads) < 6:
                    heads.add(trip[2])
            sequence = _int(row.get("stop_sequence"))
            previous = last.get(row["trip_id"])
            if previous is None or sequence > previous[0]:
                last[row["trip_id"]] = (sequence, stop_id)
        # Trips without a headsign go to their last stop.
        for trip_id, (_, stop_id) in last.items():
            route, service, headsign, direction = self.trips[trip_id]
            if not headsign and stop_id in self.stops:
                self.trips[trip_id] = (route, service, self.stops[stop_id][0], direction)

    def read_timetable(self, stop_ids: frozenset[str]) -> Timetable:
        """The scheduled passages at these stops (a second pass over stop_times, kept until the stops change)."""
        timetable = Timetable(stop_ids=stop_ids)
        try:
            with zipfile.ZipFile(self.path) as archive:
                for row in _rows(archive, "stop_times.txt"):
                    stop_id = row.get("stop_id", "")
                    if stop_id not in stop_ids or row.get("trip_id") not in self.trips:
                        continue
                    # Drop-off only (pickup_type 1) is no departure for someone waiting at the stop.
                    if row.get("pickup_type") == "1":
                        continue
                    seconds = _seconds(row.get("departure_time") or row.get("arrival_time") or "")
                    if seconds is not None:
                        timetable.passages.setdefault(stop_id, []).append(
                            (seconds, row["trip_id"], _int(row.get("stop_sequence")))
                        )
        except (OSError, zipfile.BadZipFile, csv.Error) as err:
            raise ProviderError(f"Invalid GTFS file: {err}") from err
        for items in timetable.passages.values():
            items.sort()
        return timetable

    def runs(self, service_id: str, day: date) -> bool:
        exception = self.exceptions.get(service_id, {}).get(day)
        if exception is not None:
            return exception
        days, start, end = self.calendar.get(service_id, (set(), date.max, date.min))
        return start <= day <= end and day.weekday() in days

    def mode_of(self, stop_id: str) -> str:
        modes = {self.lines[r].mode for r in self.stop_routes.get(stop_id, ()) if r in self.lines}
        return next((m for m in MODE_ORDER if m in modes), "bus")


WEEKDAYS = ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")


def _float(value: str | None) -> float | None:
    try:
        return float(value) if value else None
    except ValueError:
        return None


def _int(value: str | None) -> int:
    try:
        return int(value or 0)
    except ValueError:
        return 0


def _date(value: str | None) -> date | None:
    try:
        return datetime.strptime(value or "", "%Y%m%d").date()
    except ValueError:
        return None


# One parsed GTFS per file, shared by the config flow and the coordinator of the network.
_STATIC: dict[Path, tuple[float, GtfsStatic]] = {}


@dataclass(frozen=True, slots=True)
class GtfsNetwork:
    """A dataset of the catalogue with a GTFS and a GTFS-RT feed."""

    id: str
    name: str
    area: str
    gtfs_url: str
    realtime_urls: tuple[str, ...]
    alerts_urls: tuple[str, ...] = ()

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "area": self.area,
            "gtfs_url": self.gtfs_url,
            "realtime_urls": list(self.realtime_urls),
            "alerts_urls": list(self.alerts_urls),
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> GtfsNetwork:
        return cls(
            id=str(data["id"]),
            name=str(data.get("name") or data["id"]),
            area=str(data.get("area") or ""),
            gtfs_url=str(data["gtfs_url"]),
            realtime_urls=tuple(data.get("realtime_urls") or ()),
            alerts_urls=tuple(data.get("alerts_urls") or ()),
        )

    @property
    def label(self) -> str:
        return f"{self.name} — {self.area}" if self.area and _fold(self.area) not in _fold(self.name) else self.name


def catalog_networks(datasets: Iterable[Any]) -> list[GtfsNetwork]:
    """Datasets of the catalogue that have both a GTFS file and a GTFS-RT feed with trip updates."""
    networks: list[GtfsNetwork] = []
    for dataset in datasets:
        if not isinstance(dataset, dict) or dataset.get("type") not in (None, "public-transit"):
            continue
        resources = [r for r in dataset.get("resources") or [] if isinstance(r, dict) and r.get("url")]
        gtfs = sorted(
            (r for r in resources if str(r.get("format", "")).lower() == "gtfs" and r.get("is_available", True)),
            key=lambda r: str(r.get("updated") or ""),
            reverse=True,
        )
        realtime = [r for r in resources if str(r.get("format", "")).lower() == "gtfs-rt"]
        trip_updates = [r for r in realtime if _has(r, "trip_updates") or not r.get("features")]
        if not gtfs or not trip_updates:
            continue
        alerts = [r for r in realtime if _has(r, "service_alerts")]
        areas = [str(a.get("nom")) for a in dataset.get("covered_area") or [] if isinstance(a, dict) and a.get("nom")]
        networks.append(
            GtfsNetwork(
                id=str(dataset.get("slug") or dataset.get("id")),
                name=str(dataset.get("title") or dataset.get("slug")),
                area=", ".join(areas[:3]),
                gtfs_url=str(gtfs[0]["url"]),
                realtime_urls=tuple(dict.fromkeys(str(r["url"]) for r in trip_updates)),
                alerts_urls=tuple(dict.fromkeys(str(r["url"]) for r in alerts)),
            )
        )
    return sorted(networks, key=lambda n: _fold(n.name))


def _has(resource: dict[str, Any], feature: str) -> bool:
    return feature in [str(f).lower() for f in resource.get("features") or []]


def search_networks(networks: Iterable[GtfsNetwork], query: str) -> list[GtfsNetwork]:
    """Networks whose name, area or id contain every word of the query (case and accents ignored)."""
    words = _fold(query).split()
    return [n for n in networks if all(w in _fold(f"{n.name} {n.area} {n.id}") for w in words)]


async def fetch_catalog(session: aiohttp.ClientSession) -> list[GtfsNetwork]:
    """Every network of transport.data.gouv.fr with a GTFS-RT feed."""
    try:
        async with session.get(CATALOG_URL, timeout=TIMEOUT) as resp:
            if resp.status >= 400:
                raise ProviderError(f"transport.data.gouv.fr answered HTTP {resp.status}")
            data = await resp.json(content_type=None)
    except TimeoutError as err:
        raise ProviderError("Timeout while calling transport.data.gouv.fr") from err
    except (aiohttp.ClientError, ValueError) as err:
        raise ProviderError(f"Cannot read the transport.data.gouv.fr catalogue: {err}") from err
    if not isinstance(data, list):
        raise ProviderError("Unexpected response from transport.data.gouv.fr")
    return catalog_networks(data)


class GtfsProvider(Provider):
    """A GTFS + GTFS-RT network of the national catalogue."""

    id = "gtfs"
    name = "GTFS-RT"
    area = "transport.data.gouv.fr"
    url = "https://transport.data.gouv.fr"
    needs_network = True

    def __init__(self, session: aiohttp.ClientSession, api_key: str | None = None, **kwargs: Any) -> None:
        super().__init__(session, api_key, **kwargs)
        if not self.network:
            raise ProviderError("No GTFS network chosen")
        self.feed = GtfsNetwork.from_dict(self.network)
        self.network_name = self.feed.name
        self._static: GtfsStatic | None = None

    @property
    def key(self) -> str:
        return f"{self.id}:{self.feed.id}"

    # ── Static timetable ────────────────────────────────────────────────────────────────────────────────────────
    def _paths(self) -> tuple[Path, Path]:
        base = self.cache_dir or Path(".")
        slug = re.sub(r"[^A-Za-z0-9_-]", "_", self.feed.id)
        return base / f"{slug}.zip", base / f"{slug}.json"

    async def _load_static(self, *, refresh: bool = False) -> GtfsStatic:
        """The parsed timetable: downloaded when missing or a day old, parsed again when the file changed."""
        path, meta_path = self._paths()
        meta = await self._executor(_read_json, meta_path)
        fetched = float(meta.get("fetched") or 0)
        stale = refresh and time.time() - fetched >= STATIC_REFRESH.total_seconds()
        exists = await self._executor(path.exists)
        if not exists or stale or meta.get("url") != self.feed.gtfs_url:
            try:
                await self._download(path, meta_path, meta if exists and meta.get("url") == self.feed.gtfs_url else {})
            except ProviderError:
                if not exists:
                    raise
                _LOGGER.warning("Could not refresh the %s timetable, keeping the one on disk", self.network_name)
        mtime = await self._executor(lambda: path.stat().st_mtime)
        cached = _STATIC.get(path)
        if cached is None or cached[0] != mtime:
            static = await self._executor(GtfsStatic.load, path)
            _STATIC[path] = (mtime, static)
            cached = _STATIC[path]
        self._static = cached[1]
        return self._static

    async def _download(self, path: Path, meta_path: Path, meta: dict[str, Any]) -> None:
        headers = {}
        if meta.get("etag"):
            headers["If-None-Match"] = meta["etag"]
        if meta.get("last_modified"):
            headers["If-Modified-Since"] = meta["last_modified"]
        partial = path.with_suffix(".part")
        try:
            async with self._session.get(self.feed.gtfs_url, headers=headers, timeout=DOWNLOAD_TIMEOUT) as resp:
                if resp.status == 304:
                    await self._executor(_write_json, meta_path, {**meta, "fetched": time.time()})
                    return
                if resp.status == 429:
                    raise ProviderRateLimitError(f"{self.network_name} timetable quota reached")
                if resp.status >= 400:
                    raise ProviderError(f"{self.network_name} timetable answered HTTP {resp.status}")
                await self._executor(partial.parent.mkdir, 0o755, True, True)
                handle = await self._executor(partial.open, "wb")
                try:
                    async for chunk in resp.content.iter_chunked(1 << 16):
                        await self._executor(handle.write, chunk)
                finally:
                    await self._executor(handle.close)
                etag, modified = resp.headers.get("ETag"), resp.headers.get("Last-Modified")
        except TimeoutError as err:
            raise ProviderError(f"Timeout while downloading the {self.network_name} timetable") from err
        except aiohttp.ClientError as err:
            raise ProviderError(f"Cannot download the {self.network_name} timetable: {err}") from err
        if not await self._executor(zipfile.is_zipfile, partial):
            await self._executor(partial.unlink, True)
            raise ProviderError(f"The {self.network_name} timetable is not a GTFS zip")
        await self._executor(partial.replace, path)
        await self._executor(
            _write_json,
            meta_path,
            {"url": self.feed.gtfs_url, "etag": etag, "last_modified": modified, "fetched": time.time()},
        )

    async def _timetable(self, static: GtfsStatic, stop_ids: frozenset[str]) -> Timetable:
        if static.timetable is None or not stop_ids <= static.timetable.stop_ids:
            # Read for the union, so that the config flow and the coordinator do not read each other's out.
            wanted = stop_ids | (static.timetable.stop_ids if static.timetable else frozenset())
            static.timetable = await self._executor(static.read_timetable, wanted)
        return static.timetable

    # ── Real time ───────────────────────────────────────────────────────────────────────────────────────────────
    async def _feed(self, url: str) -> Feed:
        headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        try:
            async with self._session.get(url, headers=headers, timeout=TIMEOUT) as resp:
                if resp.status == 429:
                    raise ProviderRateLimitError(f"{self.network_name} real-time quota reached")
                if resp.status >= 400:
                    raise ProviderError(f"{self.network_name} real time answered HTTP {resp.status}")
                body = await resp.read()
        except TimeoutError as err:
            raise ProviderError(f"Timeout while calling the {self.network_name} real time") from err
        except aiohttp.ClientError as err:
            raise ProviderError(f"Cannot reach the {self.network_name} real time: {err}") from err
        try:
            return parse_feed(body)
        except DecodeError as err:
            raise ProviderError(f"Invalid GTFS-RT feed from {self.network_name}: {err}") from err

    async def _trip_updates(self) -> dict[str, TripUpdate]:
        updates: dict[str, TripUpdate] = {}
        errors: list[ProviderError] = []
        for url in self.feed.realtime_urls:
            try:
                feed = await self._feed(url)
            except ProviderError as err:
                errors.append(err)
                continue
            for update in feed.trip_updates:
                if update.trip_id:
                    updates[update.trip_id] = update
        if errors and len(errors) == len(self.feed.realtime_urls):
            raise errors[0]
        return updates

    # ── Provider API ────────────────────────────────────────────────────────────────────────────────────────────
    async def search_stops(self, query: str) -> list[Stop]:
        static = await self._load_static()
        words = _fold(query).split()
        if not words:
            return []
        found = [
            Stop(id=stop_id, name=name, mode=static.mode_of(stop_id), latitude=lat, longitude=lon)
            for stop_id, (name, lat, lon, _) in static.stops.items()
            if all(w in _fold(name) for w in words) and stop_id in static.stop_routes
        ]
        return sorted(found, key=lambda s: (MODE_ORDER.index(s.mode), s.name.lower(), s.id))[:60]

    async def served_lines(self, stops: list[Stop]) -> dict[str, list[str]]:
        static = self._static or await self._load_static()
        return {
            stop.key: sorted({static.lines[r].short_name for r in static.stop_routes.get(stop.id, ()) if r in static.lines})
            for stop in stops
        }

    async def destinations(self, stops: list[Stop]) -> dict[str, list[str]]:
        static = self._static or await self._load_static()
        return {stop.key: sorted(static.stop_headsigns.get(stop.id, ())) for stop in stops}

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        static = self._static or await self._load_static()
        found = [static.lines[r] for r in static.stop_routes.get(stop.id, ()) if r in static.lines]
        return sorted(found, key=lambda line: (MODE_ORDER.index(line.mode or "bus"), _natural(line.short_name)))

    async def lines(self) -> dict[str, Line]:
        # Called once a day by the coordinator: the moment to fetch a newer timetable.
        static = await self._load_static(refresh=True)
        return dict(static.lines)

    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        static = self._static or await self._load_static()
        result: dict[str, list[Departure]] = {stop.key: [] for stop in stops}
        timetable = await self._timetable(static, frozenset(s.id for s in stops))
        try:
            updates = await self._trip_updates()
        except ProviderError as err:
            # The timetable alone is still worth showing; the coordinator notes the failure only when nothing is left.
            _LOGGER.debug("%s real time unavailable, timetable only: %s", self.network_name, err)
            updates = {}
        zone = dt_util.get_time_zone(static.timezone) or dt_util.get_default_time_zone()
        now = dt_util.now(zone)
        for stop in stops:
            items = _scheduled(static, timetable.passages.get(stop.id, []), zone, now)
            departures = [d for d in (_apply(static, stop.id, item, updates) for item in items) if d is not None]
            departures.extend(_added(static, stop.id, updates, now))
            departures.sort(key=lambda d: d.departure)
            result[stop.key] = [d for d in departures if now - PAST <= d.departure <= now + HORIZON][:PER_STOP]
        return result

    async def alerts(self) -> list[Alert]:
        if not self.feed.alerts_urls:
            return []
        static = self._static or await self._load_static()
        now = int(dt_util.utcnow().timestamp())
        alerts: dict[str, Alert] = {}
        for url in self.feed.alerts_urls:
            feed = await self._feed(url)
            for item in feed.alerts:
                if item.periods and not any((s or 0) <= now <= (e or now) for s, e in item.periods):
                    continue
                routes = set(item.route_ids)
                for stop_id in item.stop_ids:
                    routes |= static.stop_routes.get(stop_id, set())
                start = min((s for s, _ in item.periods if s), default=None)
                end = max((e for _, e in item.periods if e), default=None)
                alerts[item.id or item.header] = Alert(
                    id=item.id or item.header,
                    title=item.header or item.description[:80],
                    description=item.description,
                    level=item.level,
                    line_ids=tuple(sorted(routes)),
                    start=dt_util.utc_from_timestamp(start) if start else None,
                    end=dt_util.utc_from_timestamp(end) if end else None,
                    url=item.url,
                )
        return sorted(alerts.values(), key=lambda a: -a.level)


def _scheduled(
    static: GtfsStatic, passages: list[tuple[int, str, int]], zone: tzinfo, now: datetime
) -> list[tuple[datetime, str, int, str]]:
    """Passages of yesterday's and today's services in the coming hours: (time, trip, sequence, service date)."""
    found = []
    for day in (now.date() - timedelta(days=1), now.date()):
        # GTFS times count from noon minus 12 h, which is midnight except on daylight saving days.
        base = datetime(day.year, day.month, day.day, 12, tzinfo=zone) - timedelta(hours=12)
        low, high = (now - PAST - base).total_seconds() - 3600, (now + HORIZON - base).total_seconds()
        for seconds, trip_id, sequence in passages:
            if seconds < low or seconds > high:
                continue
            trip = static.trips.get(trip_id)
            if trip is not None and static.runs(trip[1], day):
                found.append((base + timedelta(seconds=seconds), trip_id, sequence, day.strftime("%Y%m%d")))
    return found


def _apply(
    static: GtfsStatic, stop_id: str, item: tuple[datetime, str, int, str], updates: dict[str, TripUpdate]
) -> Departure | None:
    """A scheduled passage with its real-time correction; None when the trip is cancelled or skips the stop."""
    scheduled, trip_id, sequence, service_date = item
    route_id, _, headsign, direction = static.trips[trip_id]
    line = static.lines.get(route_id)
    update = updates.get(trip_id)
    if update is not None and update.start_date and update.start_date != service_date:
        update = None
    when, realtime = scheduled, False
    if update is not None:
        if update.relationship == TRIP_CANCELED:
            return None
        matched, previous = None, None
        for stu in update.stop_time_updates:
            if (stu.stop_sequence is not None and stu.stop_sequence == sequence) or (
                stu.stop_sequence is None and stu.stop_id == stop_id
            ):
                matched = stu
                break
            if stu.stop_sequence is not None and stu.stop_sequence < sequence:
                previous = stu
        if matched is not None and matched.relationship == STOP_SKIPPED:
            return None
        source = matched or previous
        if source is not None and source.relationship != STOP_NO_DATA:
            if matched is not None and (matched.departure_time or matched.arrival_time):
                when = dt_util.utc_from_timestamp(matched.departure_time or matched.arrival_time or 0)
                realtime = True
            else:
                delay = source.departure_delay if source.departure_delay is not None else source.arrival_delay
                if delay is not None:
                    when, realtime = scheduled + timedelta(seconds=delay), True
        elif update.delay is not None:
            when, realtime = scheduled + timedelta(seconds=update.delay), True
    return Departure(
        line_id=route_id,
        line=line.short_name if line else route_id,
        destination=headsign,
        departure=when,
        realtime=realtime,
        scheduled=scheduled if realtime else None,
        direction=direction,
        trip_id=trip_id,
    )


def _added(static: GtfsStatic, stop_id: str, updates: dict[str, TripUpdate], now: datetime) -> list[Departure]:
    """Trips of the real-time feed that the timetable does not have (extra runs), with a time at the stop."""
    found = []
    for update in updates.values():
        if update.trip_id in static.trips or not update.route_id or update.relationship == TRIP_CANCELED:
            continue
        for stu in update.stop_time_updates:
            moment = stu.departure_time or stu.arrival_time
            if stu.stop_id == stop_id and moment and stu.relationship != STOP_SKIPPED:
                line = static.lines.get(update.route_id)
                found.append(
                    Departure(
                        line_id=update.route_id,
                        line=line.short_name if line else update.route_id,
                        destination="",
                        departure=dt_util.utc_from_timestamp(moment),
                        realtime=True,
                        direction=update.direction_id,
                        trip_id=update.trip_id,
                    )
                )
    return [d for d in found if d.departure >= now - PAST]


def _natural(name: str) -> tuple[int, str]:
    digits = re.match(r"\d+", name)
    return (int(digits.group()) if digits else 10_000, name)


def _read_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data), encoding="utf-8")
