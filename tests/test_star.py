"""The STAR provider reads the open data portal: departures, lines, alerts, stop search and errors."""

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
from custom_components.public_transport.providers.star import _any_of, _quote

from . import star_data as data

BUS = Stop(id="1201", name="République", mode="bus", city="Rennes")
OTHER = Stop(id="1301", name="Gares", mode="bus")
METRO = Stop(id="8000", name="République", mode="metro")


@pytest.fixture
async def star(hass: HomeAssistant, aioclient_mock):
    return create_provider("star", async_get_clientsession(hass))


def test_registry() -> None:
    assert "star" in PROVIDERS
    with pytest.raises(ProviderError):
        create_provider("nowhere", None)


def test_odsql_literals_are_escaped() -> None:
    assert _quote('a"b\\') == '"a\\"b\\\\"'
    assert _any_of("idarret", ["1", "2"]) == 'idarret="1" or idarret="2"'


async def test_departures_of_several_stops_in_one_request_per_mode(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    result = await star.departures([BUS, OTHER, METRO])
    assert len(data.calls_to(aioclient_mock, data.PASSAGES_BUS)) == 1
    assert len(data.calls_to(aioclient_mock, data.PASSAGES_METRO)) == 1
    params = data.calls_to(aioclient_mock, data.PASSAGES_BUS)[0][1].query
    assert params["where"] == 'idarret="1201" or idarret="1301"'
    assert params["order_by"] == "depart"

    bus = result["bus:1201"]
    # Sorted by time; the departed one is still there (the coordinator drops it).
    assert [d.line for d in bus] == ["C4", "C4", "11", "C4"]
    first = bus[1]
    assert first.realtime is True
    assert first.destination == "ZA Saint-Sulpice"
    assert first.delay == 2
    assert first.direction == 0
    assert first.trip_id == "268475"
    timetable = bus[2]
    assert timetable.realtime is False
    assert timetable.scheduled is None
    assert timetable.delay is None
    assert [d.line for d in result["bus:1301"]] == ["11"]
    metro = result["metro:8000"]
    assert [d.destination for d in metro] == ["J.F. Kennedy", "J.F. Kennedy"]
    # `precision` is a list in the metro dataset; no timetable there, so no delay.
    assert [d.realtime for d in metro] == [True, False]
    assert metro[0].delay is None


async def test_no_request_for_a_mode_without_stop(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    await star.departures([BUS])
    assert not data.calls_to(aioclient_mock, data.PASSAGES_METRO)


async def test_lines_keep_the_active_version_and_normalize_colors(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    lines = await star.lines()
    assert lines["0004"].color == "#e30613"
    assert lines["0011"].color == "#3e9d44"
    assert lines["0011"].text_color == "#ffffff"
    assert lines["1001"].mode == "metro"
    assert lines["1001"].short_name == "a"


async def test_alerts_are_merged_by_id_and_expired_ones_dropped(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    alerts = await star.alerts()
    assert [a.id for a in alerts] == ["P4", "P1", "P2"]
    # Levels as numbers or as lists of labels: the gravest counts.
    assert [a.level for a in alerts] == [3, 2, 1]
    alerts = alerts[1:]
    p1 = alerts[0]
    assert p1.line_ids == ("0004", "0011")
    assert p1.level == 2
    assert p1.description == "Stop République moved 50 m."
    assert p1.url == "https://www.star.fr/info-trafic"
    assert p1.as_dict()["line_ids"] == ["0004", "0011"]


async def test_search_lists_metro_first_and_skips_old_versions(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    stops = await star.search_stops("répu")
    assert [s.key for s in stops] == ["metro:8000", "bus:1201", "bus:1202"]
    assert stops[1].latitude == 48.1096
    assert stops[0].latitude == 48.11
    assert stops[1].label == "République (Rennes)"
    where = data.calls_to(aioclient_mock, data.STOPS_BUS)[0][1].query["where"]
    assert where == 'search(nom, "répu")'
    assert await star.search_stops("  ") == []


async def test_served_lines_tell_apart_stops_of_the_same_name(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    served = await star.served_lines([BUS, Stop(id="1202", name="République", mode="bus"), METRO])
    assert served == {"bus:1201": ["C4", "11"], "bus:1202": ["C4"]}


async def test_destinations_tell_apart_the_platforms(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    found = await star.destinations([BUS, OTHER, METRO])
    assert found == {"bus:1201": ["Gaité", "ZA Saint-Sulpice"], "bus:1301": ["Gaité"], "metro:8000": ["J.F. Kennedy"]}
    assert len(data.calls_to(aioclient_mock, data.PASSAGES_METRO)) == 1


async def test_lines_at_a_bus_stop_from_served_stops_and_passages(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    lines = await star.lines_at_stop(BUS)
    assert [line.short_name for line in lines] == ["C4", "11"]
    assert lines[0].color == "#e30613"


async def test_lines_at_a_metro_stop(star, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    lines = await star.lines_at_stop(METRO)
    assert [line.short_name for line in lines] == ["a"]


async def test_pages_are_followed(star, aioclient_mock) -> None:
    first = {"total_count": 150, "results": [{"id": str(i), "nomcourt": str(i)} for i in range(100)]}
    second = {"total_count": 150, "results": [{"id": str(i), "nomcourt": str(i)} for i in range(100, 150)]}
    aioclient_mock.get(data.LINES_BUS, params={"offset": "0"}, json=first)
    aioclient_mock.get(data.LINES_BUS, params={"offset": "100"}, json=second)
    aioclient_mock.get(data.LINES_METRO, json=data.page([]))
    assert len(await star.lines()) == 150


async def test_the_api_key_is_sent(hass, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    star = create_provider("star", async_get_clientsession(hass), "secret")
    await star.departures([BUS])
    headers = data.calls_to(aioclient_mock, data.PASSAGES_BUS)[0][3]
    assert headers["Authorization"] == "Apikey secret"


@pytest.mark.parametrize(
    ("kwargs", "error"),
    [
        ({"status": 429}, ProviderRateLimitError),
        ({"status": 401}, ProviderAuthError),
        ({"status": 500}, ProviderError),
        ({"text": "not json"}, ProviderError),
        ({"json": ["a list"]}, ProviderError),
        ({"exc": TimeoutError()}, ProviderError),
    ],
)
async def test_errors(star, aioclient_mock, kwargs, error) -> None:
    aioclient_mock.get(data.PASSAGES_BUS, **kwargs)
    with pytest.raises(error):
        await star.departures([BUS])
