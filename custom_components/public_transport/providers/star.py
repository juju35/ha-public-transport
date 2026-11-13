"""STAR, the bus and metro network of Rennes Métropole, through its open data portal (data.explore.star.fr).

The portal is an Opendatasoft instance (Explore API v2.1). Datasets used:
- tco-bus-circulation-passages-tr / tco-metro-circulation-passages-tr: coming passages in real time, with
  `precision` "Temps réel" (real time) or "Applicable" (timetable, shown with a * on the stop displays) — a string
  for the bus, a list of one string for the metro. Bus passages also give the timetable (`departtheorique`), metro
  ones do not. Times are ISO strings with an offset (the metro `arrivee` as "2026-10-08 13:58:41+0200");
- tco-bus-topologie-pointsarret-td / tco-metro-topologie-pointsarret-td: stops, for the search;
- tco-bus-topologie-dessertes-td: which bus lines serve which stop;
- tco-bus-topologie-lignes-td / tco-metro-topologie-lignes-td: line names and official colors;
- tco-busmetro-trafic-alertes-tr: traffic alerts, one record per alert and line; `niveau` was documented as "1" to
  "3" and is now a list of labels ("Mineure", "Bloquante", "Majeure"): both are read.
The API works without a key; a key (free account on the portal) raises the daily quota.
"""

from __future__ import annotations

import re
from collections.abc import Iterable
from datetime import datetime
from typing import Any

import aiohttp
from homeassistant.util import dt as dt_util

from .base import (
    Alert,
    Departure,
    Line,
    Provider,
    ProviderAuthError,
    ProviderError,
    ProviderRateLimitError,
    Stop,
)

API_BASE = "https://data.explore.star.fr/api/explore/v2.1/catalog/datasets"
TIMEOUT = aiohttp.ClientTimeout(total=20)
PAGE = 100  # the Explore API's maximum page size

DATASETS = {
    "bus": {
        "passages": "tco-bus-circulation-passages-tr",
        "stops": "tco-bus-topologie-pointsarret-td",
        "lines": "tco-bus-topologie-lignes-td",
    },
    "metro": {
        "passages": "tco-metro-circulation-passages-tr",
        "stops": "tco-metro-topologie-pointsarret-td",
        "lines": "tco-metro-topologie-lignes-td",
    },
}
DESSERTES = "tco-bus-topologie-dessertes-td"
ALERTS = "tco-busmetro-trafic-alertes-tr"
REALTIME = "temps réel"
# Alert levels as labels, by increasing gravity (1 information, 2 disruption, 3 major disruption).
LEVELS = {"mineure": 1, "bloquante": 2, "majeure": 3}
HEX = re.compile(r"^#?([0-9a-fA-F]{6})$")


def _quote(value: str) -> str:
    """An ODSQL string literal."""
    return '"' + str(value).replace("\\", "\\\\").replace('"', '\\"') + '"'


def _any_of(field: str, values: Iterable[str]) -> str:
    return " or ".join(f"{field}={_quote(v)}" for v in values)


def _color(value: Any) -> str | None:
    match = HEX.match(str(value or "").strip())
    return f"#{match.group(1).lower()}" if match else None


def _time(value: Any) -> datetime | None:
    if not value:
        return None
    parsed = dt_util.parse_datetime(str(value))
    if parsed is None:
        return None
    # The portal gives offsets; a naive time would be Rennes local time.
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=dt_util.get_time_zone("Europe/Paris"))


def _coords(value: Any) -> tuple[float | None, float | None]:
    """geo_point_2d: {"lat", "lon"} in API v2.1, [lat, lon] in older exports."""
    if isinstance(value, dict):
        return value.get("lat"), value.get("lon")
    if isinstance(value, list | tuple) and len(value) == 2:
        return value[0], value[1]
    return None, None


def _values(value: Any) -> list[str]:
    """A field that is a string or a list of strings (multivalued fields of the portal), as a list."""
    if value is None:
        return []
    items = value if isinstance(value, list | tuple) else [value]
    return [str(v).strip() for v in items if v is not None and str(v).strip()]


def _active(record: dict[str, Any]) -> bool:
    """Topology datasets keep past and future versions: only the current one counts."""
    flag = record.get("estversionactive")
    return flag is None or str(flag).strip().lower() in ("oui", "true", "1")


def _ids(value: Any) -> tuple[str, ...]:
    if value is None or value == "":
        return ()
    if isinstance(value, list | tuple):
        return tuple(str(v) for v in value if v not in (None, ""))
    return tuple(part.strip() for part in str(value).split(",") if part.strip())


class StarProvider(Provider):
    """STAR — Rennes Métropole (bus and metro)."""

    id = "star"
    name = "STAR"
    area = "Rennes Métropole"
    url = "https://data.explore.star.fr"

    async def _records(
        self, dataset: str, *, where: str | None = None, order_by: str | None = None, limit: int = PAGE, **extra: Any
    ) -> list[dict[str, Any]]:
        """Every record of a query, page after page, up to `limit` records."""
        records: list[dict[str, Any]] = []
        headers = {"Authorization": f"Apikey {self.api_key}"} if self.api_key else {}
        while len(records) < limit:
            params: dict[str, Any] = {"limit": min(PAGE, limit - len(records)), "offset": len(records), **extra}
            if where:
                params["where"] = where
            if order_by:
                params["order_by"] = order_by
            data = await self._get(f"{API_BASE}/{dataset}/records", params, headers)
            page = [r for r in data.get("results") or [] if isinstance(r, dict)]
            records.extend(page)
            if len(page) < params["limit"] or len(records) >= int(data.get("total_count") or 0):
                break
        return records

    async def _get(self, url: str, params: dict[str, Any], headers: dict[str, str]) -> dict[str, Any]:
        try:
            async with self._session.get(url, params=params, headers=headers, timeout=TIMEOUT) as resp:
                if resp.status == 429:
                    raise ProviderRateLimitError("STAR open data quota reached")
                if resp.status in (401, 403):
                    raise ProviderAuthError("STAR open data refused the API key")
                if resp.status >= 400:
                    raise ProviderError(f"STAR open data answered HTTP {resp.status}")
                try:
                    data = await resp.json(content_type=None)
                except ValueError as err:
                    raise ProviderError("Invalid response from STAR open data") from err
        except TimeoutError as err:
            raise ProviderError("Timeout while calling STAR open data") from err
        except aiohttp.ClientError as err:
            raise ProviderError(f"Cannot reach STAR open data: {err}") from err
        if not isinstance(data, dict):
            raise ProviderError("Unexpected response from STAR open data")
        return data

    async def search_stops(self, query: str) -> list[Stop]:
        text = query.strip()
        if not text:
            return []
        stops: dict[str, Stop] = {}
        for mode, datasets in DATASETS.items():
            for record in await self._records(
                datasets["stops"], where=f"search(nom, {_quote(text)})", order_by="nom", limit=40
            ):
                if not _active(record) or not record.get("id"):
                    continue
                lat, lon = _coords(record.get("coordonnees"))
                stop = Stop(
                    id=str(record["id"]),
                    name=str(record.get("nom") or record["id"]),
                    mode=mode,
                    city=record.get("nomcommune"),
                    latitude=lat,
                    longitude=lon,
                )
                stops[stop.key] = stop
        return sorted(stops.values(), key=lambda s: (s.mode != "metro", s.name.lower(), s.city or "", s.id))

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        """Bus lines from the served-stops dataset, metro lines from the coming passages; plus any line passing now."""
        lines = lines or await self.lines()
        ids: dict[str, str] = {}
        if stop.mode == "bus":
            for record in await self._records(DESSERTES, where=f"idarret={_quote(stop.id)}", limit=200):
                if record.get("idligne"):
                    ids[str(record["idligne"])] = str(record.get("nomcourtligne") or record["idligne"])
        passages = await self._records(
            DATASETS[stop.mode]["passages"], where=f"idarret={_quote(stop.id)}", order_by="depart", limit=100
        )
        for record in passages:
            if record.get("idligne"):
                ids.setdefault(str(record["idligne"]), str(record.get("nomcourtligne") or record["idligne"]))
        if not ids and stop.mode == "metro":
            ids = {lid: line.short_name for lid, line in lines.items() if line.mode == "metro"}
        found = [lines.get(lid) or Line(id=lid, short_name=name, mode=stop.mode) for lid, name in ids.items()]
        return sorted(found, key=_line_order)

    async def served_lines(self, stops: list[Stop]) -> dict[str, list[str]]:
        """Short names of the bus lines serving each stop, to tell apart the search results of the same name."""
        bus = [s.id for s in stops if s.mode == "bus"]
        served: dict[str, set[str]] = {}
        if bus:
            for record in await self._records(DESSERTES, where=_any_of("idarret", bus), limit=300):
                if record.get("idarret") and record.get("nomcourtligne"):
                    served.setdefault(f"bus:{record['idarret']}", set()).add(str(record["nomcourtligne"]))
        return {key: sorted(names, key=_name_order) for key, names in served.items()}

    async def destinations(self, stops: list[Stop]) -> dict[str, list[str]]:
        """Destinations of the coming passages at each stop: they tell apart the platforms of a station (a metro
        station has one per direction) or the two sides of a street. One request per mode."""
        found: dict[str, set[str]] = {}
        for mode, datasets in DATASETS.items():
            ids = sorted({s.id for s in stops if s.mode == mode})
            if not ids:
                continue
            records = await self._records(
                datasets["passages"], where=_any_of("idarret", ids), order_by="depart", limit=min(300, 20 * len(ids))
            )
            for record in records:
                destination = str(record.get("destination") or "").strip()
                if record.get("idarret") and destination:
                    found.setdefault(f"{mode}:{record['idarret']}", set()).add(destination)
        return {key: sorted(names) for key, names in found.items()}

    async def lines(self) -> dict[str, Line]:
        lines: dict[str, Line] = {}
        for mode, datasets in DATASETS.items():
            for record in await self._records(datasets["lines"], limit=400):
                if not _active(record) or not record.get("id"):
                    continue
                line = Line(
                    id=str(record["id"]),
                    short_name=str(record.get("nomcourt") or record["id"]),
                    long_name=record.get("nomlong"),
                    color=_color(record.get("couleurligne")),
                    text_color=_color(record.get("couleurtexteligne")),
                    mode=mode,
                )
                lines[line.id] = line
        return lines

    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        result: dict[str, list[Departure]] = {stop.key: [] for stop in stops}
        for mode in DATASETS:
            ids = sorted({s.id for s in stops if s.mode == mode})
            if not ids:
                continue
            records = await self._records(
                DATASETS[mode]["passages"], where=_any_of("idarret", ids), order_by="depart", limit=50 * len(ids)
            )
            for record in records:
                departure = _departure(record)
                key = f"{mode}:{record.get('idarret')}"
                if departure is not None and key in result:
                    result[key].append(departure)
        for departures in result.values():
            departures.sort(key=lambda d: d.departure)
        return result

    async def alerts(self) -> list[Alert]:
        now = dt_util.utcnow()
        merged: dict[str, dict[str, Any]] = {}
        for record in await self._records(ALERTS, limit=300):
            alert_id = str(record.get("idperturbation") or record.get("titre") or "")
            if not alert_id:
                continue
            end = _time(record.get("finvalidite"))
            if end is not None and end < now:
                continue
            item = merged.setdefault(
                alert_id,
                {
                    "id": alert_id,
                    "title": str(record.get("titre") or "").strip(),
                    "description": str(record.get("description") or "").strip(),
                    "level": _level(record.get("niveau")),
                    "line_ids": [],
                    "start": _time(record.get("debutvalidite")),
                    "end": end,
                    "url": record.get("url") or None,
                },
            )
            # The same alert comes once per line it concerns.
            for line_id in _ids(record.get("idligne")):
                if line_id not in item["line_ids"]:
                    item["line_ids"].append(line_id)
        alerts = [Alert(**{**item, "line_ids": tuple(item["line_ids"])}) for item in merged.values()]
        return sorted(alerts, key=lambda a: (-a.level, a.start or now))


def _departure(record: dict[str, Any]) -> Departure | None:
    when = _time(record.get("depart")) or _time(record.get("arrivee"))
    if when is None or not record.get("idligne"):
        return None
    realtime = any(v.lower() == REALTIME for v in _values(record.get("precision")))
    scheduled = _time(record.get("departtheorique")) or _time(record.get("arriveetheorique"))
    direction = record.get("sens")
    return Departure(
        line_id=str(record["idligne"]),
        line=str(record.get("nomcourtligne") or record["idligne"]),
        destination=str(record.get("destination") or "").strip(),
        departure=when,
        realtime=realtime,
        scheduled=scheduled if realtime else None,
        direction=int(direction) if isinstance(direction, int | float) or str(direction).isdigit() else None,
        trip_id=str(record["idcourse"]) if record.get("idcourse") else None,
    )


def _level(value: Any) -> int:
    """The gravest level of the alert: numbers 1 to 3 or labels, alone or in a list; 1 when unknown."""
    levels = []
    for item in _values(value):
        if item.isdigit():
            levels.append(min(3, max(1, int(item))))
        elif item.lower() in LEVELS:
            levels.append(LEVELS[item.lower()])
    return max(levels, default=1)


def _name_order(name: str) -> tuple[int, int, str]:
    """Metro lines first (a, b), then by number (C1 before 10), then by name."""
    digits = re.sub(r"\D", "", name)
    return (0 if len(name) == 1 and name.isalpha() else 1, int(digits) if digits else 10_000, name)


def _line_order(line: Line) -> tuple[int, int, str]:
    return _name_order(line.short_name)
