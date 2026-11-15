"""The SNCF provider reads the SNCF/Navitia API: station search, departures (TGV/TER), delays, disruptions, errors."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from custom_components.public_transport.providers import (
    PROVIDERS,
    ProviderAuthError,
    ProviderError,
    ProviderRateLimitError,
    Stop,
    create_provider,
)
from custom_components.public_transport.providers.sncf import (
    API_BASE,
    SncfProvider,
    _category,
    _clean_direction,
)

RENNES = "stop_area:SNCF:87471003"
NANTES = "stop_area:SNCF:87481002"
STOP = Stop(id=RENNES, name="Rennes", mode="train", city="Rennes")


def _dep(url: str) -> str:
    return f"{API_BASE}/stop_areas/{url}/departures"


PLACES = {
    "places": [
        {
            "embedded_type": "stop_area",
            "id": RENNES,
            "name": "Rennes",
            "stop_area": {
                "id": RENNES,
                "name": "Rennes",
                "coord": {"lat": "48.1035", "lon": "-1.6725"},
                "administrative_regions": [
                    {"name": "Ille-et-Vilaine", "level": 7},
                    {"name": "Rennes", "level": 8},
                ],
            },
        },
        {"embedded_type": "address", "id": "addr:x", "name": "Rue de Rennes"},
    ]
}

DEPARTURES = {
    "departures": [
        {
            "display_informations": {
                "commercial_mode": "TER",
                "physical_mode": "Train express régional",
                "direction": "Saint-Malo (Saint-Malo)",
                "headsign": "857001",
                "network": "SNCF",
            },
            "stop_date_time": {
                "departure_date_time": "20261115T130000",
                "base_departure_date_time": "20261115T130000",
                "data_freshness": "base_schedule",
            },
        },
        {
            "display_informations": {
                "commercial_mode": "TGV INOUI",
                "physical_mode": "Train grande vitesse",
                "direction": "Paris Montparnasse (Paris)",
                "headsign": "8075",
                "trip_short_name": "8075",
                "network": "SNCF",
            },
            "stop_date_time": {
                "departure_date_time": "20261115T124500",
                "base_departure_date_time": "20261115T124000",
                "data_freshness": "realtime",
            },
        },
    ],
    "disruptions": [
        {
            "disruption_id": "d1",
            "severity": {"effect": "SIGNIFICANT_DELAYS", "name": "perturbée"},
            "cause": "Travaux",
            "messages": [{"text": "Retards sur l'axe Atlantique."}],
            "application_periods": [{"begin": "20261115T000000", "end": "20261115T235900"}],
        }
    ],
}


@pytest.fixture
async def sncf(hass: HomeAssistant, aioclient_mock):
    return create_provider("sncf", async_get_clientsession(hass), "secret")


def test_registry() -> None:
    assert PROVIDERS["sncf"] is SncfProvider
    assert SncfProvider.api_key_mode == "required"


def test_category_maps_commercial_modes() -> None:
    assert _category("TGV INOUI", "Train grande vitesse").id == "tgv"
    assert _category("OUIGO", "Train grande vitesse").id == "ouigo"
    assert _category("TER", "Train express régional").short_name == "TER"
    assert _category("", "RER").id == "rer"
    # An unknown mode keeps its own name under the generic "train" badge.
    unknown = _category("Funiculaire", "")
    assert unknown.id == "train"
    assert unknown.short_name == "Funiculaire"


def test_clean_direction_drops_the_city_in_parentheses() -> None:
    assert _clean_direction("Paris Montparnasse (Paris)") == "Paris Montparnasse"
    assert _clean_direction("Rennes") == "Rennes"


async def test_search_lists_only_stations(sncf, aioclient_mock) -> None:
    aioclient_mock.get(f"{API_BASE}/places", json=PLACES)
    stops = await sncf.search_stops("rennes")
    assert [s.id for s in stops] == [RENNES]
    stop = stops[0]
    assert stop.mode == "train"
    assert stop.city == "Rennes"  # the lowest administrative level (highest number)
    assert stop.latitude == 48.1035
    assert await sncf.search_stops("  ") == []


async def test_departures_parse_mode_destination_delay_and_number(sncf, aioclient_mock) -> None:
    aioclient_mock.get(_dep(RENNES), json=DEPARTURES)
    result = await sncf.departures([STOP])
    deps = result[STOP.key]
    assert STOP.key == f"train:{RENNES}"
    # Sorted by time: the 12:45 TGV comes before the 13:00 TER.
    assert [d.line for d in deps] == ["TGV INOUI", "TER"]
    tgv = deps[0]
    assert tgv.line_id == "tgv"
    assert tgv.destination == "Paris Montparnasse"
    assert tgv.realtime is True
    assert tgv.delay == 5
    assert tgv.code == "8075"
    ter = deps[1]
    assert ter.line_id == "ter"
    assert ter.destination == "Saint-Malo"
    assert ter.realtime is False
    assert ter.scheduled is None
    assert ter.delay is None
    assert ter.code == "857001"


async def test_disruptions_become_alerts_with_a_level(sncf, aioclient_mock) -> None:
    aioclient_mock.get(_dep(RENNES), json=DEPARTURES)
    await sncf.departures([STOP])
    alerts = await sncf.alerts()
    assert len(alerts) == 1
    assert alerts[0].title == "Travaux"
    assert alerts[0].description == "Retards sur l'axe Atlantique."
    assert alerts[0].level == 2


async def test_lines_at_stop_lists_the_modes_actually_departing(sncf, aioclient_mock) -> None:
    aioclient_mock.get(_dep(RENNES), json=DEPARTURES)
    lines = await sncf.lines_at_stop(STOP)
    assert {line.id for line in lines} == {"tgv", "ter"}


async def test_the_api_key_is_sent_as_basic_auth(sncf, aioclient_mock) -> None:
    aioclient_mock.get(_dep(RENNES), json=DEPARTURES)
    await sncf.departures([STOP])
    headers = aioclient_mock.mock_calls[0][3]
    assert headers["Authorization"].startswith("Basic ")


async def test_one_station_failing_keeps_the_others(sncf, aioclient_mock) -> None:
    other = Stop(id=NANTES, name="Nantes", mode="train")
    aioclient_mock.get(_dep(RENNES), json=DEPARTURES)
    aioclient_mock.get(_dep(NANTES), status=500)
    result = await sncf.departures([STOP, other])
    assert [d.line for d in result[STOP.key]] == ["TGV INOUI", "TER"]
    assert result[other.key] == []


async def test_every_station_failing_raises(sncf, aioclient_mock) -> None:
    aioclient_mock.get(_dep(RENNES), status=500)
    with pytest.raises(ProviderError):
        await sncf.departures([STOP])


@pytest.mark.parametrize(
    ("kwargs", "error"),
    [
        ({"status": 429}, ProviderRateLimitError),
        ({"status": 401}, ProviderAuthError),
        ({"status": 500}, ProviderError),
        ({"text": "not json"}, ProviderError),
    ],
)
async def test_errors(sncf, aioclient_mock, kwargs, error) -> None:
    aioclient_mock.get(_dep(RENNES), **kwargs)
    with pytest.raises(error):
        await sncf.departures([STOP])
