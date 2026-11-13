"""What a transit network provider gives the integration, whatever its API."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any, ClassVar

import aiohttp


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


class Provider(ABC):
    """A transit network. Subclasses are registered in providers/__init__.py."""

    id: ClassVar[str]
    name: ClassVar[str]
    area: ClassVar[str]
    url: ClassVar[str]

    def __init__(self, session: aiohttp.ClientSession, api_key: str | None = None) -> None:
        self._session = session
        self.api_key = api_key or None

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
