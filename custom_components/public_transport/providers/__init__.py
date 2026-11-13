"""Transit network providers: one class per network (or per generic feed format), registered here."""

from __future__ import annotations

from typing import Any

import aiohttp

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
from .cts import CtsProvider
from .gtfs import GtfsNetwork, GtfsProvider, fetch_catalog, search_networks
from .idfm import IdfmProvider
from .star import StarProvider
from .tcl import TclProvider

PROVIDERS: dict[str, type[Provider]] = {
    cls.id: cls for cls in (StarProvider, IdfmProvider, TclProvider, CtsProvider, GtfsProvider)
}


def create_provider(
    provider_id: str, session: aiohttp.ClientSession, api_key: str | None = None, **kwargs: Any
) -> Provider:
    """An instance of the provider registered under this id (kwargs: network, cache_dir, executor)."""
    try:
        cls = PROVIDERS[provider_id]
    except KeyError as err:
        raise ProviderError(f"Unknown network: {provider_id}") from err
    return cls(session, api_key, **kwargs)


__all__ = [
    "PROVIDERS",
    "Alert",
    "Departure",
    "GtfsNetwork",
    "Line",
    "Provider",
    "ProviderAuthError",
    "ProviderError",
    "ProviderRateLimitError",
    "Stop",
    "create_provider",
    "fetch_catalog",
    "search_networks",
]
