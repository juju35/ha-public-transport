"""CTS, the tram and bus network of Strasbourg, through its open API (api.cts-strasbourg.eu, SIRI 2.0 in JSON).

The free token (https://www.cts-strasbourg.eu/fr/portail-open-data/) is sent as the user of a basic authentication
with an empty password. Endpoints used:
- stoppoints-discovery: every stop point (platform), with its `StopCode` (the monitoring reference) and name;
- lines-discovery: lines with their mode and official colors (`Extension.RouteType`, `RouteColor`, `RouteTextColor`);
- stop-monitoring?MonitoringRef=<StopCode>: coming passages, `MonitoredCall.Extension.IsRealTime` telling real
  time from timetable;
- general-message: traffic alerts on the lines they name.
"""

from __future__ import annotations

import re
from typing import Any

from .base import Alert, Line, ListedStopsProvider, ProviderAuthError, Stop, basic_auth
from .siri import SiriMonitoringProvider, general_messages, items, text

API = "https://api.cts-strasbourg.eu/v1/siri/2.0"
HEX = re.compile(r"^#?([0-9a-fA-F]{6})$")
MODES = {"tram": "tram", "bus": "bus", "coach": "bus", "rail": "train"}


def _color(value: Any) -> str | None:
    match = HEX.match(str(value or "").strip())
    return f"#{match.group(1).lower()}" if match else None


class CtsProvider(SiriMonitoringProvider, ListedStopsProvider):
    """CTS — Strasbourg (tram and bus), free API token required."""

    id = "cts"
    name = "CTS"
    area = "Strasbourg"
    url = "https://www.cts-strasbourg.eu/fr/portail-open-data/"
    api_key_mode = "required"

    def _auth(self) -> dict[str, str]:
        if not self.api_key:
            raise ProviderAuthError("The CTS API needs a token")
        return basic_auth(self.api_key)

    async def _api(self, endpoint: str, **params: Any) -> Any:
        return await self._get_json(f"{API}/{endpoint}", params=params or None, headers=self._auth())

    async def _list_stops(self) -> list[tuple[Stop, list[str]]]:
        data = await self._api("stoppoints-discovery")
        delivery = (data or {}).get("StopPointsDelivery") or {}
        stops: list[tuple[Stop, list[str]]] = []
        for item in items(delivery.get("AnnotatedStopPointRef")):
            if not isinstance(item, dict):
                continue
            extension = item.get("Extension") or {}
            code = text(extension.get("StopCode")) or text(item.get("StopPointRef"))
            if not code:
                continue
            location = item.get("Location") or {}
            lines = [text(line.get("LineRef")) for line in items(item.get("Lines")) if isinstance(line, dict)]
            stops.append(
                (
                    Stop(
                        id=code,
                        name=text(item.get("StopName")) or code,
                        mode="tram" if any(len(n) == 1 and n.isalpha() for n in lines) else "bus",
                        latitude=location.get("Latitude"),
                        longitude=location.get("Longitude"),
                    ),
                    sorted({n for n in lines if n}),
                )
            )
        return stops

    def _stop_order(self, stop: Stop) -> tuple[Any, ...]:
        return (stop.mode != "tram", stop.name.lower(), stop.id)

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        lines = lines or await self.lines()
        served = (await self.served_lines([stop])).get(stop.key) or []
        if not served:
            # The discovery listed no line: the coming passages tell which ones stop here.
            served = sorted({d.line_id for d in (await self.departures([stop]))[stop.key]})
        return [lines.get(name) or Line(id=name, short_name=name, mode=stop.mode) for name in served]

    async def lines(self) -> dict[str, Line]:
        data = await self._api("lines-discovery")
        delivery = (data or {}).get("LinesDelivery") or {}
        lines: dict[str, Line] = {}
        for item in items(delivery.get("AnnotatedLineRef")):
            if not isinstance(item, dict) or not text(item.get("LineRef")):
                continue
            extension = item.get("Extension") or {}
            line_id = text(item.get("LineRef"))
            lines[line_id] = Line(
                id=line_id,
                short_name=text(item.get("LineName")) or line_id,
                color=_color(extension.get("RouteColor")),
                text_color=_color(extension.get("RouteTextColor")),
                mode=MODES.get(text(extension.get("RouteType")).lower(), "bus"),
            )
        self._lines = lines
        return lines

    async def _monitor(self, stop: Stop) -> Any:
        return await self._api("stop-monitoring", MonitoringRef=stop.id, MaximumStopVisits=20)

    async def alerts(self) -> list[Alert]:
        return general_messages(await self._api("general-message"))
