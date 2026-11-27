"""The GTFS / GTFS-RT provider: catalogue, protobuf reader, timetable, real-time corrections, alerts and cache."""

from __future__ import annotations

import asyncio
import json
from datetime import timedelta

import aiohttp
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util import dt as dt_util

from custom_components.public_transport.providers import (
    ProviderError,
    Stop,
    create_provider,
    search_networks,
)
from custom_components.public_transport.providers import gtfs as gtfs_module
from custom_components.public_transport.providers.gtfs import CATALOG_URL, catalog_networks
from custom_components.public_transport.providers.gtfs_rt import DecodeError, fields, parse_feed

from . import gtfs_data as data

G1 = Stop(id="G1", name="Gare", mode="tram")
G2 = Stop(id="G2", name="Gare", mode="bus")


@pytest.fixture(autouse=True)
def clear_cache():
    gtfs_module._STATIC.clear()
    gtfs_module._LOCKS.clear()
    yield
    gtfs_module._STATIC.clear()
    gtfs_module._LOCKS.clear()


def mock_feeds(aioclient_mock, *, rt=None, alerts=None, rt_status=200) -> None:
    aioclient_mock.get(data.GTFS_URL, content=data.gtfs_zip(), headers={"ETag": '"v1"'})
    aioclient_mock.get(data.RT_URL, content=rt if rt is not None else data.realtime(), status=rt_status)
    aioclient_mock.get(data.ALERTS_URL, content=alerts if alerts is not None else data.alerts())


@pytest.fixture
async def provider(hass: HomeAssistant, aioclient_mock, tmp_path):
    return create_provider(
        "gtfs",
        async_get_clientsession(hass),
        network=data.NETWORK,
        cache_dir=tmp_path,
        executor=hass.async_add_executor_job,
    )


def test_needs_a_network() -> None:
    with pytest.raises(ProviderError):
        create_provider("gtfs", None)


def test_catalog_keeps_networks_with_real_time() -> None:
    networks = catalog_networks(data.catalog())
    assert [n.id for n in networks] == ["reseau-test"]
    network = networks[0]
    # The most recently updated GTFS; trip updates and alerts feeds told apart by their features.
    assert network.gtfs_url == data.GTFS_URL
    assert network.realtime_urls == (data.RT_URL,)
    assert network.alerts_urls == (data.ALERTS_URL,)
    assert network.label == "Réseau Test — Testville Métropole"
    assert search_networks(networks, "testville metropole") == networks
    assert search_networks(networks, "réseau") == networks
    assert search_networks(networks, "lyon") == []


async def test_fetch_catalog(hass, aioclient_mock) -> None:
    from custom_components.public_transport.providers import fetch_catalog

    aioclient_mock.get(CATALOG_URL, json=data.catalog())
    assert [n.id for n in await fetch_catalog(async_get_clientsession(hass))] == ["reseau-test"]
    aioclient_mock.clear_requests()
    aioclient_mock.get(CATALOG_URL, status=500)
    with pytest.raises(ProviderError):
        await fetch_catalog(async_get_clientsession(hass))


def test_protobuf_reader() -> None:
    feed = parse_feed(data.realtime())
    assert [u.trip_id for u in feed.trip_updates] == ["t1", "t2", "extra", "t5"]
    first = feed.trip_updates[0]
    assert first.stop_time_updates[0].departure_delay == 120
    assert first.start_date == data.service_date()
    assert feed.trip_updates[1].relationship == 3
    assert feed.trip_updates[3].delay == -60
    alerts = parse_feed(data.alerts()).alerts
    assert alerts[0].header == "Travaux"
    assert alerts[0].level == 3
    assert alerts[0].route_ids == ["R2"]
    assert alerts[1].stop_ids == ["G1"]
    with pytest.raises(DecodeError):
        parse_feed(b"\x0a\xff")


def test_feed_decoder_wire_types_and_damaged_feeds() -> None:
    """The protobuf reader: fixed 64/32-bit fields, and a clear error on a truncated or unknown field."""
    assert list(
        fields(b"\x08\x96\x01" + b"\x11" + (5).to_bytes(8, "little") + b"\x1d" + (7).to_bytes(4, "little"))
    ) == [
        (1, 150),
        (2, 5),
        (3, 7),
    ]
    for damaged in (b"\x08", b"\x08" + b"\xff" * 10, b"\x0b", b"\x11\x01", b"\x1d\x01"):
        with pytest.raises(DecodeError):
            list(fields(damaged))


async def test_real_time_network_error_keeps_the_timetable(provider, aioclient_mock) -> None:
    """A real-time feed that cannot be reached at all (no answer, not an HTTP error) leaves the timetable."""
    aioclient_mock.get(data.GTFS_URL, content=data.gtfs_zip(), headers={"ETag": '"v1"'})
    aioclient_mock.get(data.RT_URL, exc=aiohttp.ClientError("unreachable"))
    aioclient_mock.get(data.ALERTS_URL, exc=TimeoutError())
    result = await provider.departures([G1])
    assert all(not d.realtime for d in result["tram:G1"])


async def test_search_lines_and_hints(provider, aioclient_mock) -> None:
    mock_feeds(aioclient_mock)
    stops = await provider.search_stops("gare")
    # Platforms only (the station itself is left out), the tram platform first.
    assert [(s.id, s.mode) for s in stops] == [("G1", "tram"), ("G2", "bus")]
    assert await provider.search_stops("  ") == []
    assert await provider.served_lines(stops) == {"tram:G1": ["T1"], "bus:G2": ["12"]}
    # t3 has no headsign: it goes to its last stop.
    assert await provider.destinations(stops) == {"tram:G1": ["Terminus"], "bus:G2": ["Mairie"]}
    lines = await provider.lines_at_stop(G1)
    assert [(line.short_name, line.color, line.mode) for line in lines] == [("T1", "#e2001a", "tram")]
    assert provider.key == "gtfs:reseau-test"
    assert provider.network_name == "Réseau Test"


async def test_departures_with_real_time(provider, aioclient_mock) -> None:
    mock_feeds(aioclient_mock)
    result = await provider.departures([G1, G2])
    now = dt_util.utcnow()
    g1 = result["tram:G1"]
    # t1 two minutes late, t2 cancelled, the extra trip added, t5 a minute early (trip delay).
    assert [d.trip_id for d in g1] == ["t1", "extra", "t5"]
    t1 = g1[0]
    assert t1.realtime is True
    assert t1.delay == 2
    assert t1.destination == "Terminus"
    assert abs((t1.departure - now) - timedelta(minutes=6)) < timedelta(seconds=90)
    assert g1[1].line == "12"
    assert g1[2].delay == -1
    # t3 runs (no real time: timetable); t4's service is removed today.
    g2 = result["bus:G2"]
    assert [(d.trip_id, d.realtime) for d in g2] == [("t3", False)]
    assert g2[0].direction == 1


async def test_numeric_headsign_shows_terminus(provider, aioclient_mock) -> None:
    # SNCF-style feed: headsigns are train numbers; the destination must be the terminus name.
    aioclient_mock.get(data.GTFS_URL, content=data.gtfs_zip_sncf(), headers={"ETag": '"v1"'})
    aioclient_mock.get(data.RT_URL, content=data.sncf_added())
    aioclient_mock.get(data.ALERTS_URL, content=data.feed())
    s1 = Stop(id="S1", name="Rennes", mode="train")
    result = await provider.departures([s1])
    board = result["train:S1"]
    by_trip = {d.trip_id: d for d in board}
    # The scheduled train 8719 and the headsign-less trip both point at the terminus, not the number.
    assert by_trip["tn"].destination == "Paris Montparnasse"
    assert by_trip["tn"].line == "401C"
    # The train number survives: recovered from the numeric headsign, or read from trip_short_name.
    assert by_trip["tn"].train_number == "8719"
    assert by_trip["tz"].train_number == "8800"
    assert by_trip["tz"].destination == "Paris Montparnasse"
    # The extra real-time trip takes its terminus from its own downstream stops.
    assert by_trip["extra-tgv"].destination == "Paris Montparnasse"
    # The config form's destination hints are readable too (no bare "8719").
    assert await provider.destinations([s1]) == {"train:S1": ["Paris Montparnasse"]}


async def test_overnight_keeps_next_departures(provider, aioclient_mock) -> None:
    # The only departure is well beyond HORIZON (e.g. tomorrow morning): the card must still show it.
    aioclient_mock.get(data.GTFS_URL, content=data.gtfs_zip_times(("n1", 300)), headers={"ETag": '"v1"'})
    aioclient_mock.get(data.RT_URL, content=data.feed())
    aioclient_mock.get(data.ALERTS_URL, content=data.feed())
    result = await provider.departures([G1])
    assert [d.trip_id for d in result["tram:G1"]] == ["n1"]


async def test_within_horizon_hides_far_departures(provider, aioclient_mock) -> None:
    # A near departure exists, so the far one (beyond HORIZON) stays out of the normal window.
    aioclient_mock.get(data.GTFS_URL, content=data.gtfs_zip_times(("near", 5), ("far", 300)), headers={"ETag": '"v1"'})
    aioclient_mock.get(data.RT_URL, content=data.feed())
    aioclient_mock.get(data.ALERTS_URL, content=data.feed())
    result = await provider.departures([G1])
    assert [d.trip_id for d in result["tram:G1"]] == ["near"]


async def test_real_time_failure_keeps_the_timetable(provider, aioclient_mock) -> None:
    mock_feeds(aioclient_mock, rt_status=503)
    result = await provider.departures([G1])
    assert [(d.trip_id, d.realtime) for d in result["tram:G1"]] == [("t1", False), ("t2", False), ("t5", False)]


async def test_skipped_stop_and_absolute_time(provider, aioclient_mock) -> None:
    at = int((dt_util.utcnow() + timedelta(minutes=9)).timestamp())
    rt = data.feed(
        data.trip_update("e1", "t1", data.stop_time(1, "G1", relationship=1)),
        data.trip_update("e2", "t2", data.stop_time(1, "G1", time=at)),
    )
    mock_feeds(aioclient_mock, rt=rt)
    result = await provider.departures([G1])
    departures = result["tram:G1"]
    assert [d.trip_id for d in departures] == ["t2", "t5"]
    assert int(departures[0].departure.timestamp()) == at


async def test_alerts(provider, aioclient_mock) -> None:
    mock_feeds(aioclient_mock)
    await provider.lines()
    alerts = await provider.alerts()
    assert [(a.title, a.level, a.line_ids) for a in alerts] == [
        ("Travaux", 3, ("R2",)),
        # An alert on a stop concerns the lines serving it.
        ("Ascenseur en panne", 2, ("R1",)),
    ]


async def test_timetable_is_downloaded_once_and_cached(hass, provider, aioclient_mock, tmp_path) -> None:
    mock_feeds(aioclient_mock)
    await provider.lines()
    await provider.search_stops("gare")
    downloads = [c for c in aioclient_mock.mock_calls if str(c[1]) == data.GTFS_URL]
    assert len(downloads) == 1
    assert (tmp_path / "reseau-test.zip").is_file()
    # Another provider (the coordinator after the config flow) reads the file on disk.
    other = create_provider("gtfs", async_get_clientsession(hass), network=data.NETWORK, cache_dir=tmp_path)
    assert await other.search_stops("mairie")
    assert len([c for c in aioclient_mock.mock_calls if str(c[1]) == data.GTFS_URL]) == 1


async def test_invalid_timetable(provider, aioclient_mock) -> None:
    aioclient_mock.get(data.GTFS_URL, content=b"not a zip")
    with pytest.raises(ProviderError):
        await provider.search_stops("gare")
    aioclient_mock.clear_requests()
    aioclient_mock.get(data.GTFS_URL, status=404)
    with pytest.raises(ProviderError):
        await provider.prepare()


async def test_parsed_timetable_is_kept_on_disk(hass, provider, aioclient_mock, tmp_path, monkeypatch) -> None:
    """The next start reads the parsed timetable back instead of the zip, until the zip changes."""
    mock_feeds(aioclient_mock)
    provider.follow([G1])
    await provider.lines()
    first = await provider.departures([G1])
    assert (tmp_path / "reseau-test.cache.json").is_file()
    # The followed stop's timetable came with the first reading of the zip: no second pass.
    assert provider._static.timetable.stop_ids == frozenset({"G1"})

    gtfs_module._STATIC.clear()  # a restart
    reads = []
    monkeypatch.setattr(gtfs_module.GtfsStatic, "read_timetable", lambda self, ids: reads.append(ids))
    load = gtfs_module.GtfsStatic.load
    monkeypatch.setattr(gtfs_module.GtfsStatic, "load", lambda *a: reads.append(a) or load(*a))
    again = create_provider("gtfs", async_get_clientsession(hass), network=data.NETWORK, cache_dir=tmp_path)
    again.follow([G1])
    await again.lines()
    assert await again.departures([G1]) == first
    assert first[G1.key]
    assert reads == []

    # A new zip (another size or date) is read again.
    gtfs_module._STATIC.clear()
    zip_path = tmp_path / "reseau-test.zip"
    zip_path.write_bytes(zip_path.read_bytes() + b"\0")
    other = create_provider("gtfs", async_get_clientsession(hass), network=data.NETWORK, cache_dir=tmp_path)
    await other.prepare()
    assert len(reads) == 1


async def test_damaged_cache_reads_the_zip(provider, aioclient_mock, tmp_path) -> None:
    mock_feeds(aioclient_mock)
    await provider.prepare()
    (tmp_path / "reseau-test.cache.json").write_bytes(b"garbage")
    gtfs_module._STATIC.clear()
    assert await provider.search_stops("gare")


async def test_cache_is_plain_json_and_round_trips(provider, aioclient_mock, tmp_path) -> None:
    """The parsed GTFS is kept as plain JSON (never a pickle) and read back to the very same data."""
    mock_feeds(aioclient_mock)
    provider.follow([G1])
    await provider.departures([G1])
    path = tmp_path / "reseau-test.cache.json"
    raw = json.loads(path.read_text(encoding="utf-8"))
    assert raw["format"] == gtfs_module.CACHE_VERSION
    static = provider._static
    back = gtfs_module._read_cache(path, gtfs_module._file_version(tmp_path / "reseau-test.zip"))
    assert back is not None
    for name in (
        "timezone",
        "stops",
        "lines",
        "trips",
        "calendar",
        "exceptions",
        "stop_routes",
        "stop_headsigns",
        "path",
    ):
        assert getattr(back, name) == getattr(static, name), name
    assert back.timetable == static.timetable


async def test_old_pickle_cache_is_deleted_unread(provider, aioclient_mock, tmp_path, monkeypatch) -> None:
    """The pickle kept by the versions before 1.8 is removed, never loaded (a file read back must not run code)."""
    mock_feeds(aioclient_mock)
    await provider.prepare()
    legacy = tmp_path / "reseau-test.cache"
    legacy.write_bytes(b"\x80\x05not a pickle to load")
    gtfs_module._STATIC.clear()
    assert await provider.search_stops("gare")
    assert not legacy.exists()


async def test_one_reading_for_stops_loading_together(hass, provider, aioclient_mock, tmp_path, monkeypatch) -> None:
    mock_feeds(aioclient_mock)
    await provider.prepare()
    gtfs_module._STATIC.clear()
    (tmp_path / "reseau-test.cache.json").unlink()
    loads = []
    load = gtfs_module.GtfsStatic.load
    monkeypatch.setattr(gtfs_module.GtfsStatic, "load", lambda *a: loads.append(a) or load(*a))
    other = create_provider(
        "gtfs",
        async_get_clientsession(hass),
        network=data.NETWORK,
        cache_dir=tmp_path,
        executor=hass.async_add_executor_job,
    )
    await asyncio.gather(provider.search_stops("gare"), other.search_stops("gare"))
    assert len(loads) == 1
