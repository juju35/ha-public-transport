"""TCL, the metro, tram, funicular and bus network of Lyon, through the data.grandlyon.com web services.

The real-time datasets need a free data.grandlyon.com account with access to the TCL data: its login and password
are typed in the API key field as `login:password` (basic authentication). Datasets used (rdata JSON services):
- tcl_sytral.tclarret: stops, with `desserte` listing the lines and directions serving each one ("C3:A,86:R");
- tcl_sytral.tclpassagearret: coming passages by stop (`id`), `ligne`, `direction`, `heurepassage` and `type`
  ("E" estimated in real time, "T" timetable);
- tcl_sytral.tclalertetrafic_2: traffic alerts (`ligne_cli` / `ligne_com`, `titre`, `message`, `debut`, `fin`).
"""

from __future__ import annotations

import re
from dataclasses import replace
from datetime import datetime
from typing import Any

from homeassistant.util import dt as dt_util

from .base import (
    Alert,
    Departure,
    Line,
    ListedStopsProvider,
    ProviderAuthError,
    ProviderError,
    Stop,
    basic_auth,
    by_level,
    to_float,
)

API = "https://download.data.grandlyon.com/ws/rdata"
STOPS = "tcl_sytral.tclarret"
PASSAGES = "tcl_sytral.tclpassagearret"
ALERTS = "tcl_sytral.tclalertetrafic_2"
ZONE = "Europe/Paris"
METRO = re.compile(r"^(?:[A-D]|F[12])$")
TRAM = re.compile(r"^T\d+$")


def _mode(line: str) -> str:
    if METRO.match(line):
        return "metro" if not line.startswith("F") else "funicular"
    return "tram" if TRAM.match(line) else "bus"


def _time(value: Any) -> datetime | None:
    if not value:
        return None
    parsed = dt_util.parse_datetime(str(value).replace(" ", "T"))
    if parsed is None:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=dt_util.get_time_zone(ZONE))


def _desserte(value: Any) -> list[str]:
    """ "C3:A,86:R" → ["C3", "86"]: the lines serving a stop, whatever their direction."""
    return list(dict.fromkeys(part.split(":", 1)[0].strip() for part in str(value or "").split(",") if part.strip()))


def _line_order(name: str) -> tuple[int, int, str]:
    digits = re.sub(r"\D", "", name)
    rank = {"metro": 0, "funicular": 1, "tram": 2}.get(_mode(name), 3)
    return (rank, int(digits) if digits else 0, name)


class TclProvider(ListedStopsProvider):
    """TCL — Lyon (metro, tram, funicular, bus); data.grandlyon.com account required."""

    id = "tcl"
    name = "TCL"
    area = "Lyon"
    url = "https://data.grandlyon.com"
    api_key_mode = "required"

    def _auth(self) -> dict[str, str]:
        login, _, password = (self.api_key or "").partition(":")
        if not login or not password:
            raise ProviderAuthError("TCL needs a data.grandlyon.com login:password")
        return basic_auth(login, password)

    async def _values(self, dataset: str, **params: Any) -> list[dict[str, Any]]:
        data = await self._get_json(
            f"{API}/{dataset}/all.json", params={"maxfeatures": -1, **params}, headers=self._auth(), timeout=40
        )
        if not isinstance(data, dict):
            raise ProviderError("Unexpected response from data.grandlyon.com")
        return [v for v in data.get("values") or [] if isinstance(v, dict)]

    async def _list_stops(self) -> list[tuple[Stop, list[str]]]:
        stops = []
        for record in await self._values(STOPS):
            if record.get("id") in (None, ""):
                continue
            lines = _desserte(record.get("desserte"))
            modes = [_mode(line) for line in lines]
            stops.append(
                (
                    Stop(
                        id=str(record["id"]),
                        name=str(record.get("nom") or record["id"]),
                        mode=next((m for m in ("metro", "funicular", "tram") if m in modes), "bus"),
                        city=record.get("commune") or None,
                        latitude=to_float(record.get("lat")),
                        longitude=to_float(record.get("lon")),
                    ),
                    sorted(lines, key=_line_order),
                )
            )
        return stops

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        lines = lines or await self.lines()
        served = (await self.served_lines([stop])).get(stop.key, [])
        return [lines.get(name) or Line(id=name, short_name=name, mode=_mode(name)) for name in served]

    async def lines(self) -> dict[str, Line]:
        """The lines named in the stops' service lists (the datasets give no colors)."""
        names = {line for _, served in await self._all_stops() for line in served}
        return {name: Line(id=name, short_name=name, mode=_mode(name)) for name in sorted(names, key=_line_order)}

    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        return await self._each_stop(stops, self._stop_departures)

    async def _stop_departures(self, stop: Stop) -> list[Departure]:
        records = await self._values(PASSAGES, field="id", value=stop.id)
        departures = []
        for record in records:
            when = _time(record.get("heurepassage"))
            line = str(record.get("ligne") or "").strip()
            if when is None or not line or str(record.get("id")) != stop.id:
                continue
            departures.append(
                Departure(
                    line_id=line,
                    line=line,
                    destination=str(record.get("direction") or "").strip(),
                    departure=when,
                    realtime=str(record.get("type") or "").upper() == "E",
                    trip_id=str(record["coursetheorique"]) if record.get("coursetheorique") else None,
                )
            )
        return departures

    async def alerts(self) -> list[Alert]:
        now = dt_util.utcnow()
        alerts: dict[str, Alert] = {}
        for record in await self._values(ALERTS):
            end = _time(record.get("fin"))
            if end is not None and end < now:
                continue
            title = str(record.get("titre") or "").strip()
            line = str(record.get("ligne_cli") or record.get("ligne_com") or "").strip()
            key = f"{title}|{record.get('debut')}"
            alert = alerts.get(key)
            kind = str(record.get("type") or "").lower()
            if alert is None:
                alerts[key] = Alert(
                    id=key,
                    title=title,
                    description=str(record.get("message") or "").strip(),
                    level=3 if "interrompu" in kind or "majeur" in kind else 2 if "perturb" in kind else 1,
                    line_ids=(line,) if line else (),
                    start=_time(record.get("debut")),
                    end=end,
                )
            elif line and line not in alert.line_ids:
                # One record per line the alert concerns.
                alerts[key] = replace(alert, line_ids=(*alert.line_ids, line))
        return by_level(alerts.values())
