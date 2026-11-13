"""Transit network providers: one class per network (or per generic feed format), registered here."""

from __future__ import annotations

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
from .star import StarProvider

PROVIDERS: dict[str, type[Provider]] = {cls.id: cls for cls in (StarProvider,)}


def create_provider(provider_id: str, session: aiohttp.ClientSession, api_key: str | None = None) -> Provider:
    """An instance of the provider registered under this id."""
    try:
        cls = PROVIDERS[provider_id]
    except KeyError as err:
        raise ProviderError(f"Unknown network: {provider_id}") from err
    return cls(session, api_key)


__all__ = [
    "PROVIDERS",
    "Alert",
    "Departure",
    "Line",
    "Provider",
    "ProviderAuthError",
    "ProviderError",
    "ProviderRateLimitError",
    "Stop",
    "create_provider",
]
