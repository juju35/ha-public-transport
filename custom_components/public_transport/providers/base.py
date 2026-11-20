"""What a transit network provider gives the integration, whatever its API."""

from __future__ import annotations

import base64
import unicodedata
from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable, Iterable
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, ClassVar

import aiohttp

Executor = Callable[..., Awaitable[Any]]


class ProviderError(Exception):
    """The network's API could not be reached or answered an error."""


class ProviderAuthError(ProviderError):
    """The API key was refused."""


class ProviderRateLimitError(ProviderError):
    """The API quota was reached."""


@dataclass(frozen=True, slots=True)
class Stop:
    """A stop (or a platform) where departures are announced."""

    id: str
    name: str
    mode: str  # "bus", "metro", "tram"…: providers may hold several modes behind separate APIs
    city: str | None = None
    latitude: float | None = None
    longitude: float | None = None

    @property
    def key(self) -> str:
        """Unique within the network: ids of different modes may overlap."""
        return f"{self.mode}:{self.id}"

    @property
    def label(self) -> str:
        return f"{self.name} ({self.city})" if self.city else self.name


@dataclass(frozen=True, slots=True)
class Line:
    """A line of the network, with its official colors (#rrggbb)."""

    id: str
    short_name: str
    long_name: str | None = None
    color: str | None = None
    text_color: str | None = None
    mode: str | None = None


@dataclass(frozen=True, slots=True)
class Departure:
    """A coming departure at a stop."""

    line_id: str
    line: str
    destination: str
    departure: datetime
    realtime: bool
    scheduled: datetime | None = None
    direction: int | None = None
    trip_id: str | None = None
    train_number: str | None = None  # The run's own number (SNCF trip_short_name), distinct from the line.

    @property
    def delay(self) -> int | None:
        """Minutes behind (positive) or ahead of (negative) the timetable, when both times are known."""
        if self.scheduled is None:
            return None
        return round((self.departure - self.scheduled).total_seconds() / 60)


@dataclass(frozen=True, slots=True)
class Alert:
    """A traffic alert (works, disruption…) on one or more lines."""

    id: str
    title: str
    description: str = ""
    level: int = 1  # 1 information, 2 disruption, 3 major disruption
    line_ids: tuple[str, ...] = field(default_factory=tuple)
    start: datetime | None = None
    end: datetime | None = None
    url: str | None = None

    def as_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["line_ids"] = list(self.line_ids)
        data["start"] = self.start.isoformat() if self.start else None
        data["end"] = self.end.isoformat() if self.end else None
        return data


@dataclass(frozen=True, slots=True)
class Mobility:
    """A bike-share station (`kind` "bike": `available` bikes, `docks` free) or a park-and-ride (`kind` "park":
    `available` free spaces), near the stops; `spaces`: free spaces by type of a park-and-ride (pmr, ev, carpool)."""

    id: str
    kind: str
    name: str
    available: int | None
    capacity: int | None = None
    docks: int | None = None
    open: bool = True
    latitude: float | None = None
    longitude: float | None = None
    spaces: dict[str, int] = field(default_factory=dict)

    @property
    def key(self) -> str:
        """Unique within the network: a station and a park-and-ride may share an id."""
        return f"{self.kind}:{self.id}"

    def as_dict(self) -> dict[str, Any]:
        return {
            "id": self.key,
            "kind": self.kind,
            "name": self.name,
            "available": self.available,
            "capacity": self.capacity,
            "docks": self.docks,
            "open": self.open,
            **({"spaces": dict(self.spaces)} if self.spaces else {}),
        }


class Provider(ABC):
    """A transit network. Subclasses are registered in providers/__init__.py."""

    id: ClassVar[str]
    name: ClassVar[str]
    area: ClassVar[str]
    url: ClassVar[str]
    # "required" when the API answers nothing without a key, "optional" when a key only raises a quota.
    api_key_mode: ClassVar[str] = "optional"
    # Generic providers serve many networks: the config flow asks which one (stored in the entry as `network`).
    needs_network: ClassVar[bool] = False
    # The network also publishes bike-share stations and park-and-rides (`mobility`): the options offer them.
    has_mobility: ClassVar[bool] = False

    def __init__(
        self,
        session: aiohttp.ClientSession,
        api_key: str | None = None,
        *,
        network: dict[str, Any] | None = None,
        cache_dir: Path | None = None,
        executor: Executor | None = None,
    ) -> None:
        self._session = session
        self.api_key = api_key or None
        self.network = network or {}
        self.cache_dir = cache_dir
        self._run = executor
        self.network_name: str = self.name

    @property
    def key(self) -> str:
        """The network: one coordinator per key (a generic provider has one per network it serves)."""
        return self.id

    async def _executor[T](self, func: Callable[..., T], *args: Any) -> T:
        """Blocking work (files) off the event loop: Home Assistant's executor, or inline in tests without one."""
        if self._run is None:
            return func(*args)
        return await self._run(func, *args)

    async def prepare(self) -> None:  # noqa: B027 — optional hook, nothing to do for most networks
        """Fetch what the stop search needs once (a generic provider downloads the network's timetable)."""

    def follow(self, stops: list[Stop]) -> None:  # noqa: B027 — optional hook, nothing to do for most networks
        """The stops the coordinator polls, told before each update (a generic provider indexes their timetable
        while it reads the network's file, instead of reading it a second time)."""

    @abstractmethod
    async def search_stops(self, query: str) -> list[Stop]:
        """Stops whose name matches the query."""

    @abstractmethod
    async def lines_at_stop(self, stop: Stop, lines: dict[str, Line] | None = None) -> list[Line]:
        """Lines serving a stop; `lines` are the network's lines when already known (else fetched)."""

    @abstractmethod
    async def lines(self) -> dict[str, Line]:
        """Every line of the network, by id (names and colors)."""

    @abstractmethod
    async def departures(self, stops: list[Stop]) -> dict[str, list[Departure]]:
        """Coming departures by stop key (Stop.key), for all the stops in as few requests as the API allows."""

    async def alerts(self) -> list[Alert]:
        """Current traffic alerts; a network without an alerts feed has none."""
        return []

    async def mobility(self) -> list[Mobility]:
        """Bike-share stations and park-and-rides of the network, with what is free now (`has_mobility`)."""
        return []

    async def stop_location(self, stop: Stop) -> tuple[float, float] | None:
        """Latitude and longitude of a stop, when the network can tell (the stations are offered nearest first)."""
        return None

    async def _get_json(
        self,
        url: str,
        *,
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
        timeout: float = 20,
    ) -> Any:
        """A JSON answer of the network's API, with its errors as provider errors (key refused, quota reached)."""
        label = self.network_name
        try:
            async with self._session.get(
                url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=timeout)
            ) as resp:
                if resp.status == 429:
                    raise ProviderRateLimitError(f"{label} API quota reached")
                if resp.status in (401, 403):
                    raise ProviderAuthError(f"{label} API refused the key")
                if resp.status >= 400:
                    raise ProviderError(f"{label} API answered HTTP {resp.status}")
                try:
                    return await resp.json(content_type=None)
                except ValueError as err:
                    raise ProviderError(f"Invalid response from the {label} API") from err
        except TimeoutError as err:
            raise ProviderError(f"Timeout while calling the {label} API") from err
        except aiohttp.ClientError as err:
            raise ProviderError(f"Cannot reach the {label} API: {err}") from err

    async def _each_stop(
        self, stops: list[Stop], fetch: Callable[[Stop], Awaitable[list[Departure]]]
    ) -> dict[str, list[Departure]]:
        """Departures of APIs answering one stop per request: a refused key stops all, other errors only fail when
        every stop failed (the stops that answered are kept)."""
        result: dict[str, list[Departure]] = {}
        errors: list[ProviderError] = []
        for stop in stops:
            try:
                departures = await fetch(stop)
            except ProviderAuthError:
                raise
            except ProviderError as err:
                errors.append(err)
                continue
            result[stop.key] = sorted(departures, key=lambda d: d.departure)
        if errors and len(errors) == len(stops):
            raise errors[0]
        return {stop.key: result.get(stop.key, []) for stop in stops}


class ListedStopsProvider(Provider):
    """A network whose API lists every stop at once (with the lines serving it): searched locally."""

    MAX_RESULTS: ClassVar[int] = 60

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self._stops: list[tuple[Stop, list[str]]] | None = None

    @abstractmethod
    async def _list_stops(self) -> list[tuple[Stop, list[str]]]:
        """Every stop of the network with the short names of its lines."""

    async def _all_stops(self) -> list[tuple[Stop, list[str]]]:
        if self._stops is None:
            self._stops = await self._list_stops()
        return self._stops

    def _stop_order(self, stop: Stop) -> tuple[Any, ...]:
        return (stop.name.lower(), stop.id)

    async def search_stops(self, query: str) -> list[Stop]:
        words = fold(query).split()
        if not words:
            return []
        found = [stop for stop, _ in await self._all_stops() if all(w in fold(stop.name) for w in words)]
        return sorted(found, key=self._stop_order)[: self.MAX_RESULTS]

    async def served_lines(self, stops: list[Stop]) -> dict[str, list[str]]:
        known = {stop.key: lines for stop, lines in await self._all_stops()}
        return {stop.key: known.get(stop.key, []) for stop in stops}


def fold(text: str) -> str:
    """Lowercase without accents, for the searches."""
    return "".join(c for c in unicodedata.normalize("NFKD", text.casefold()) if not unicodedata.combining(c))


def to_float(value: Any) -> float | None:
    try:
        return float(value) if value not in (None, "") else None
    except (TypeError, ValueError):
        return None


def by_level(alerts: Iterable[Alert]) -> list[Alert]:
    """The gravest alerts first."""
    return sorted(alerts, key=lambda a: -a.level)


def basic_auth(user: str, password: str = "") -> dict[str, str]:
    """An Authorization header for HTTP basic authentication (aiohttp.BasicAuth is deprecated)."""
    token = base64.b64encode(f"{user}:{password}".encode()).decode()
    return {"Authorization": f"Basic {token}"}
