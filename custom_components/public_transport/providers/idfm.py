"""Île-de-France Mobilités: real-time departures from PRIM (SIRI Lite), stops and lines from the IDFM open data.

- Departures: PRIM stop monitoring (`/marketplace/stop-monitoring?MonitoringRef=…`), one request per stop, with the
  free PRIM key in the `apikey` header (1,000,000 requests a day).
- Stops: `arrets-lignes` of data.iledefrance-mobilites.fr (Opendatasoft), one record per stop and line. Stop ids are
  `IDFM:<quay>` (bus, tram, metro) — monitored as `STIF:StopPoint:Q:<quay>:` — or `IDFM:monomodalStopPlace:<zone>`
  (RER, Transilien) — monitored as `STIF:StopArea:SP:<zone>:`.
- Lines: `referentiel-des-lignes` (names, modes, official colors), exported in one request.
- Alerts: PRIM general messages of the lines seen at the followed stops.
"""

from __future__ import annotations

import re
from dataclasses import replace
from typing import Any

from .base import Alert, Line, ProviderAuthError, Stop, by_level, to_float
from .siri import SiriMonitoringProvider, general_messages

PRIM = "https://prim.iledefrance-mobilites.fr/marketplace"
OPENDATA = "https://data.iledefrance-mobilites.fr/api/explore/v2.1/catalog/datasets"
MODES = {"metro": "metro", "tram": "tram", "rail": "train", "rapidtransit": "train", "bus": "bus", "funicular": "cable"}
HEX = re.compile(r"^#?([0-9a-fA-F]{6})$")
# General messages are asked line by line: at most this many lines per refresh.
MAX_ALERT_LINES = 12


def monitoring_ref(stop_id: str) -> str:
    """The SIRI reference of an IDFM stop id."""
    code = stop_id.rsplit(":", 1)[-1]
    if "monomodalStopPlace" in stop_id:
        return f"STIF:StopArea:SP:{code}:"
    return f"STIF:StopPoint:Q:{code}:"


def _line_id(value: Any) -> str:
    """ "IDFM:C01742", "STIF:Line::C01742:" or "C01742" → "C01742"."""
    return [p for p in str(value or "").split(":") if p][-1] if value else ""


def _color(value: Any) -> str | None:
    match = HEX.match(str(value or "").strip())
    return f"#{match.group(1).lower()}" if match else None


def _quote(text: str) -> str:
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


class IdfmProvider(SiriMonitoringProvider):
    """Île-de-France Mobilités (metro, RER, Transilien, tram, bus) — PRIM key required."""

    id = "idfm"
    name = "Île-de-France Mobilités"
    area = "Île-de-France"
    url = "https://prim.iledefrance-mobilites.fr"
    api_key_mode = "required"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._stop_lines: dict[str, set[str]] = {}

    def _headers(self) -> dict[str, str]:
        if not self.api_key:
            raise ProviderAuthError("Île-de-France Mobilités needs a PRIM API key")
        return {"apikey": self.api_key, "Accept": "application/json"}

    async def _open_data(self, dataset: str, **params: Any) -> list[dict[str, Any]]:
        data = await self._get_json(f"{OPENDATA}/{dataset}/records", params=params)
        return [r for r in (data or {}).get("results") or [] if isinstance(r, dict)]

    async def search_stops(self, query: str) -> list[Stop]:
        text = query.strip()
        if not text:
            return []
        stops: dict[str, Stop] = {}
        self._stop_lines = {}
        for record in await self._open_data(
            "arrets-lignes", where=f"search(stop_name, {_quote(text)})", order_by="stop_name", limit=100
        ):
            stop_id = str(record.get("stop_id") or "")
            if not stop_id:
                continue
            mode = MODES.get(str(record.get("mode") or "").lower().replace(" ", ""), "bus")
            stop = Stop(
                id=stop_id,
                name=str(record.get("stop_name") or stop_id),
                mode=mode,
                city=record.get("nom_commune") or None,
                latitude=to_float(record.get("stop_lat")),
                longitude=to_float(record.get("stop_lon")),
            )
            stops.setdefault(stop.key, stop)
            if record.get("route_long_name"):
                self._stop_lines.setdefault(stop.key, set()).add(str(record["route_long_name"]))
        return sorted(stops.values(), key=lambda s: (s.name.lower(), s.city or "", s.mode, s.id))

    async def served_lines(self, stops: list[Stop]) -> dict[str, list[str]]:
        return {stop.key: sorted(self._stop_lines.get(stop.key, ())) for stop in stops}

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        lines = lines or await self.lines()
        ids: dict[str, str] = {}
        for record in await self._open_data("arrets-lignes", where=f"stop_id={_quote(stop.id)}", limit=100):
            line_id = _line_id(record.get("id"))
            if line_id:
                ids[line_id] = str(record.get("route_long_name") or line_id)
        found = [lines.get(lid) or Line(id=lid, short_name=name, mode=stop.mode) for lid, name in ids.items()]
        return sorted(found, key=lambda line: (line.mode or "", line.short_name))

    async def lines(self) -> dict[str, Line]:
        data = await self._get_json(
            f"{OPENDATA}/referentiel-des-lignes/exports/json",
            params={
                "select": "id_line,name_line,shortname_line,transportmode,colourweb_hexa,textcolourweb_hexa",
            },
            timeout=60,
        )
        lines: dict[str, Line] = {}
        for record in data if isinstance(data, list) else []:
            line_id = _line_id(record.get("id_line"))
            if not line_id:
                continue
            lines[line_id] = Line(
                id=line_id,
                short_name=str(record.get("shortname_line") or record.get("name_line") or line_id),
                long_name=record.get("name_line") or None,
                color=_color(record.get("colourweb_hexa")),
                text_color=_color(record.get("textcolourweb_hexa")),
                mode=MODES.get(str(record.get("transportmode") or "").lower(), "bus"),
            )
        self._lines = lines
        return lines

    async def _monitor(self, stop: Stop) -> Any:
        params = {"MonitoringRef": monitoring_ref(stop.id)}
        return await self._get_json(f"{PRIM}/stop-monitoring", params=params, headers=self._headers())

    async def alerts(self) -> list[Alert]:
        alerts: dict[str, Alert] = {}
        for line_id in sorted(self._seen_lines)[:MAX_ALERT_LINES]:
            data = await self._get_json(
                f"{PRIM}/general-message", params={"LineRef": f"STIF:Line::{line_id}:"}, headers=self._headers()
            )
            for found in general_messages(data):
                # Asked for this line: the message concerns it even when it names no line.
                alert = found if found.line_ids else replace(found, line_ids=(line_id,))
                alerts.setdefault(alert.id, alert)
        return by_level(alerts.values())
