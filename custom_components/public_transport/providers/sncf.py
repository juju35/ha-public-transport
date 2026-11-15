"""SNCF trains (TGV, TER, Intercités…) through the SNCF/Navitia API (api.sncf.com, coverage "sncf").

One "stop" is a station (gare): the departures board of that station, like the big screens on the concourse.
A free API key is needed (https://numerique.sncf.com/startup/api/token-developpeur/); without it the API answers
nothing, so `api_key_mode` is "required". The key is sent as the HTTP basic-auth user (no password).

Endpoints used (all under {base}/coverage/sncf):
- places?q=…&type[]=stop_area : the station search;
- stop_areas/{id}/departures?data_freshness=realtime : the coming departures, each with its commercial mode
  (TGV INOUI, OUIGO, TER…), its destination, its train number and, when the API gives it, its real-time delay;
- the same answer carries the disruptions impacting those departures, kept for the station's alerts.

Navitia has no notion of "line" that suits a departures board (a TER line is a route, not a readable badge), so the
integration's lines are the commercial modes themselves (TGV, TER, OUIGO…): following "TGV" keeps the high-speed
trains of the station, which is what the card and ha-train-board-card filter on.
"""

from __future__ import annotations

import unicodedata
from datetime import datetime
from typing import Any

from homeassistant.util import dt as dt_util

from .base import (
    Alert,
    Departure,
    Line,
    Provider,
    ProviderAuthError,
    ProviderError,
    Stop,
    basic_auth,
)

API_BASE = "https://api.sncf.com/v1/coverage/sncf"
PARIS = dt_util.get_time_zone("Europe/Paris")
# How many departures to ask for a station: enough to cover every mode (TGV, TER…) a big gare mixes.
DEPARTURES_COUNT = 50
# Disruption effects by gravity (1 information, 2 disruption, 3 major disruption).
EFFECT_LEVELS = {
    "NO_SERVICE": 3,
    "REDUCED_SERVICE": 2,
    "SIGNIFICANT_DELAYS": 2,
    "DETOUR": 2,
    "MODIFIED_SERVICE": 2,
    "ADDITIONAL_SERVICE": 1,
    "UNKNOWN_EFFECT": 1,
    "OTHER_EFFECT": 1,
}

# The commercial modes the integration knows, with a stable badge color (#rrggbb) and text color.
# Matched on a folded keyword found in the commercial (or physical) mode; an unknown mode keeps its own name.
CATEGORIES: list[tuple[str, str, str, str, str]] = [
    # keyword,    id,            label,          color,     text color
    ("ouigo", "ouigo", "OUIGO", "#e40d7e", "#ffffff"),
    ("lyria", "tgv", "TGV Lyria", "#b1151c", "#ffffff"),
    ("inoui", "tgv", "TGV INOUI", "#38004b", "#ffffff"),
    ("tgv", "tgv", "TGV", "#38004b", "#ffffff"),
    ("grande vitesse", "tgv", "TGV", "#38004b", "#ffffff"),
    ("eurostar", "eurostar", "Eurostar", "#003a5d", "#ffffff"),
    ("intercit", "intercites", "Intercités", "#5b6670", "#ffffff"),
    ("transilien", "transilien", "Transilien", "#5a9e3a", "#ffffff"),
    ("rer", "rer", "RER", "#0055c8", "#ffffff"),
    ("ter", "ter", "TER", "#0063cb", "#ffffff"),
    ("navette", "car", "Navette", "#8a8a8a", "#ffffff"),
    ("autocar", "car", "Car", "#8a8a8a", "#ffffff"),
    ("car", "car", "Car", "#8a8a8a", "#ffffff"),
    ("bus", "car", "Bus", "#8a8a8a", "#ffffff"),
]
# The known categories, by id, for lines(): the first label met for each id.
KNOWN: dict[str, Line] = {}
for _kw, _id, _label, _color, _text in CATEGORIES:
    KNOWN.setdefault(_id, Line(id=_id, short_name=_label, color=_color, text_color=_text, mode="train"))
OTHER = Line(id="train", short_name="Train", color="#607d8b", text_color="#ffffff", mode="train")


def _fold(text: str) -> str:
    folded = unicodedata.normalize("NFKD", str(text or "").casefold())
    return "".join(c for c in folded if not unicodedata.combining(c))


def _category(commercial: str, physical: str) -> Line:
    """The badge (id, label, colors) for a train, from its commercial mode (TGV INOUI, TER…) or physical mode."""
    haystack = f"{_fold(commercial)} {_fold(physical)}"
    for keyword, cat_id, label, color, text in CATEGORIES:
        if keyword in haystack:
            return Line(id=cat_id, short_name=label, color=color, text_color=text, mode="train")
    name = str(commercial or physical or "").strip()
    return Line(
        id="train",
        short_name=name or OTHER.short_name,
        color=OTHER.color,
        text_color=OTHER.text_color,
        mode="train",
    )


def _time(value: Any) -> datetime | None:
    """A Navitia local datetime ("YYYYMMDDTHHMMSS", coverage time zone) as an aware datetime."""
    text = str(value or "").strip()
    if not text:
        return None
    try:
        parsed = datetime.strptime(text, "%Y%m%dT%H%M%S")
    except ValueError:
        return None
    return parsed.replace(tzinfo=PARIS)


def _clean_direction(value: Any) -> str:
    """The destination terminus; Navitia appends the city in parentheses ("Paris Montparnasse (Paris)")."""
    text = str(value or "").strip()
    if text.endswith(")") and "(" in text:
        head = text[: text.rfind("(")].strip()
        if head:
            return head
    return text


def _coord(value: Any) -> tuple[float | None, float | None]:
    if isinstance(value, dict):
        try:
            return float(value["lat"]), float(value["lon"])
        except (KeyError, TypeError, ValueError):
            return None, None
    return None, None


def _city(stop_area: dict[str, Any]) -> str | None:
    regions = stop_area.get("administrative_regions") or []
    if isinstance(regions, list):
        # The town is the lowest administrative level (highest "level" number); fall back to the first named one.
        towns = [r for r in regions if isinstance(r, dict) and r.get("name")]
        if towns:
            best = max(towns, key=lambda r: r.get("level") or 0)
            return str(best.get("name"))
    return None


class SncfProvider(Provider):
    """SNCF national rail: the departures board of a station, from the SNCF/Navitia API."""

    id = "sncf"
    name = "SNCF"
    area = "France"
    url = "https://www.sncf-connect.com"
    api_key_mode = "required"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        # Disruptions seen in the last departures answer, served back by alerts() (scoped to the followed stations).
        self._alerts: list[Alert] = []

    def _headers(self) -> dict[str, str]:
        return basic_auth(self.api_key or "")

    async def _departures(self, stop_id: str, count: int) -> dict[str, Any]:
        return await self._get_json(
            f"{API_BASE}/stop_areas/{stop_id}/departures",
            params={"data_freshness": "realtime", "count": count},
            headers=self._headers(),
        )

    async def search_stops(self, query: str) -> list[Stop]:
        text = query.strip()
        if not text:
            return []
        data = await self._get_json(
            f"{API_BASE}/places",
            params={"q": text, "type[]": "stop_area", "count": 25},
            headers=self._headers(),
        )
        stops: dict[str, Stop] = {}
        for place in data.get("places") or []:
            if not isinstance(place, dict) or place.get("embedded_type") != "stop_area":
                continue
            area = place.get("stop_area") or {}
            area_id = str(area.get("id") or place.get("id") or "")
            if not area_id:
                continue
            lat, lon = _coord(area.get("coord"))
            stop = Stop(
                id=area_id,
                name=str(area.get("name") or place.get("name") or area_id),
                mode="train",
                city=_city(area),
                latitude=lat,
                longitude=lon,
            )
            stops[stop.key] = stop
        return list(stops.values())

    async def lines(self) -> dict[str, Line]:
        """The known commercial modes (TGV, TER…): a stable badge and color for each."""
        return {line.id: line for line in KNOWN.values()}

    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        """The commercial modes actually departing from the station, so only the relevant ones can be followed."""
        try:
            data = await self._departures(stop.id, DEPARTURES_COUNT)
        except ProviderError:
            # A failed probe should not block the config flow: offer the known modes to follow.
            return list(KNOWN.values())
        found: dict[str, Line] = {}
        for item in data.get("departures") or []:
            info = item.get("display_informations") or {}
            category = _category(info.get("commercial_mode", ""), info.get("physical_mode", ""))
            found.setdefault(category.id, category)
        return list(found.values()) or list(KNOWN.values())

    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        result: dict[str, list[Departure]] = {}
        alerts: dict[str, Alert] = {}
        errors: list[ProviderError] = []
        for stop in stops:
            try:
                data = await self._departures(stop.id, DEPARTURES_COUNT)
            except ProviderAuthError:
                # A refused key is the same for every station: fail the whole update.
                raise
            except ProviderError as err:
                errors.append(err)
                continue
            result[stop.key] = sorted(
                (dep for dep in map(_departure, data.get("departures") or []) if dep is not None),
                key=lambda d: d.departure,
            )
            for alert in _disruptions(data.get("disruptions") or []):
                alerts[alert.id] = alert
        # Every station failed: raise so the coordinator keeps the last departures instead of blanking the board.
        if errors and len(errors) == len(stops):
            raise errors[0]
        self._alerts = sorted(alerts.values(), key=lambda a: -a.level)
        return {stop.key: result.get(stop.key, []) for stop in stops}

    async def alerts(self) -> list[Alert]:
        return list(self._alerts)


def _departure(item: dict[str, Any]) -> Departure | None:
    if not isinstance(item, dict):
        return None
    info = item.get("display_informations") or {}
    times = item.get("stop_date_time") or {}
    when = _time(times.get("departure_date_time"))
    if when is None:
        return None
    category = _category(info.get("commercial_mode", ""), info.get("physical_mode", ""))
    realtime = str(times.get("data_freshness") or "").lower() == "realtime"
    scheduled = _time(times.get("base_departure_date_time"))
    number = str(info.get("headsign") or info.get("trip_short_name") or "").strip() or None
    return Departure(
        line_id=category.id,
        line=category.short_name,
        destination=_clean_direction(info.get("direction")),
        departure=when,
        realtime=realtime,
        scheduled=scheduled if realtime else None,
        trip_id=str(info.get("trip_short_name") or "").strip() or None,
        code=number,
    )


def _disruptions(disruptions: list[Any]) -> list[Alert]:
    alerts: list[Alert] = []
    for item in disruptions:
        if not isinstance(item, dict):
            continue
        alert_id = str(item.get("disruption_id") or item.get("id") or "")
        if not alert_id:
            continue
        severity = item.get("severity") or {}
        effect = str(severity.get("effect") or "").upper()
        messages = [
            str(m.get("text")).strip() for m in item.get("messages") or [] if isinstance(m, dict) and m.get("text")
        ]
        title = str(item.get("cause") or severity.get("name") or (messages[0] if messages else "")).strip()
        description = "\n".join(messages)
        if not title and not description:
            continue
        periods = item.get("application_periods") or []
        begin = _time(periods[0].get("begin")) if periods and isinstance(periods[0], dict) else None
        end = _time(periods[0].get("end")) if periods and isinstance(periods[0], dict) else None
        alerts.append(
            Alert(
                id=alert_id,
                title=title or description[:80],
                description=description,
                level=EFFECT_LEVELS.get(effect, 1),
                start=begin,
                end=end,
            )
        )
    return alerts
