"""Setting up a GTFS-RT network from the catalogue, and the networks that need a key."""

from __future__ import annotations

import pytest
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntryState
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.public_transport.const import DOMAIN
from custom_components.public_transport.providers import gtfs as gtfs_module
from custom_components.public_transport.providers.gtfs import CATALOG_URL

from . import gtfs_data as data
from .test_gtfs import mock_feeds


@pytest.fixture(autouse=True)
def clear_cache(hass, tmp_path):
    """Each test downloads into its own folder (the timetables are kept in the config folder's .storage)."""
    hass.config.config_dir = str(tmp_path)
    gtfs_module._STATIC.clear()
    yield
    gtfs_module._STATIC.clear()


async def _start(hass, provider: str, **extra):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    return await hass.config_entries.flow.async_configure(result["flow_id"], {"provider": provider, **extra})


async def test_gtfs_flow(hass, aioclient_mock) -> None:
    aioclient_mock.get(CATALOG_URL, json=data.catalog())
    mock_feeds(aioclient_mock)
    result = await _start(hass, "gtfs")
    assert result["step_id"] == "network_search"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "lyon"})
    assert result["errors"] == {"query": "no_network_found"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "testville"})
    assert result["step_id"] == "network"
    options = result["data_schema"].schema["network"].config["options"]
    assert options == [{"value": "reseau-test", "label": "Réseau Test — Testville Métropole"}]

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"network": "reseau-test"})
    # The timetable is downloaded behind a progress step.
    if result["type"] is FlowResultType.SHOW_PROGRESS:
        await hass.async_block_till_done()
        result = await hass.config_entries.flow.async_configure(result["flow_id"])
    assert result["type"] is FlowResultType.SHOW_PROGRESS_DONE or result["step_id"] == "search"
    if result["type"] is FlowResultType.SHOW_PROGRESS_DONE:
        result = await hass.config_entries.flow.async_configure(result["flow_id"])
    assert result["step_id"] == "search"
    assert result["description_placeholders"] == {"network": "Réseau Test"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "gare"})
    labels = {o["value"]: o["label"] for o in result["data_schema"].schema["stop"].config["options"]}
    assert labels == {"tram:G1": "Gare · Tram · T1 · → Terminus", "bus:G2": "Gare · Bus · 12 · → Mairie"}
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"stop": "tram:G1"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"lines": ["R1"]})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Réseau Test Gare"
    assert result["data"]["network"]["gtfs_url"] == data.GTFS_URL
    assert result["result"].unique_id == "gtfs:reseau-test_tram:G1"
    await hass.async_block_till_done()

    entry = result["result"]
    assert entry.state is ConfigEntryState.LOADED
    coordinator = entry.runtime_data
    assert hass.data[DOMAIN]["gtfs:reseau-test"] is coordinator
    state = hass.states.get("sensor.reseau_test_gare_next_departure")
    assert state is not None
    assert state.attributes["network"] == "Réseau Test"
    assert state.attributes["provider"] == "gtfs"
    assert [d["line"] for d in state.attributes["departures"]] == ["T1", "T1"]
    assert state.attributes["alerts"][0]["title"] == "Ascenseur en panne"
    # The timetable was downloaded once, for the flow and the coordinator.
    assert len([c for c in aioclient_mock.mock_calls if str(c[1]) == data.GTFS_URL]) == 1


async def test_catalogue_unreachable(hass, aioclient_mock) -> None:
    aioclient_mock.get(CATALOG_URL, status=502)
    result = await _start(hass, "gtfs")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "x"})
    assert result["errors"] == {"base": "cannot_connect"}


async def test_timetable_download_fails(hass, aioclient_mock) -> None:
    aioclient_mock.get(CATALOG_URL, json=data.catalog())
    aioclient_mock.get(data.GTFS_URL, status=404)
    result = await _start(hass, "gtfs")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "test"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"network": "reseau-test"})
    while result["type"] in (FlowResultType.SHOW_PROGRESS, FlowResultType.SHOW_PROGRESS_DONE):
        await hass.async_block_till_done()
        result = await hass.config_entries.flow.async_configure(result["flow_id"])
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "cannot_connect"


@pytest.mark.parametrize("provider", ["idfm", "tcl", "cts"])
async def test_key_required(hass, provider) -> None:
    result = await _start(hass, provider)
    assert result["step_id"] == "user"
    assert result["errors"] == {"api_key": "api_key_required"}


async def test_two_gtfs_networks_have_their_own_coordinator(hass, aioclient_mock) -> None:
    mock_feeds(aioclient_mock)
    other = {**data.NETWORK, "id": "autre", "name": "Autre"}
    entries = []
    for network in (data.NETWORK, other):
        entry = MockConfigEntry(
            domain=DOMAIN,
            title=f"{network['name']} Gare",
            unique_id=f"gtfs:{network['id']}_tram:G1",
            data={
                "provider": "gtfs",
                "network": network,
                "stop_id": "G1",
                "stop_name": "Gare",
                "stop_city": None,
                "mode": "tram",
                "line_names": {"R1": "T1"},
            },
            options={"lines": ["R1"]},
        )
        entry.add_to_hass(hass)
        entries.append(entry)
    assert await async_setup_component(hass, "http", {})
    await hass.config_entries.async_setup(entries[0].entry_id)
    await hass.async_block_till_done()
    assert all(e.state is ConfigEntryState.LOADED for e in entries)
    assert set(hass.data[DOMAIN]) == {"gtfs:reseau-test", "gtfs:autre"}
    assert entries[0].runtime_data is not entries[1].runtime_data
    await hass.config_entries.async_unload(entries[0].entry_id)
    assert set(hass.data[DOMAIN]) == {"gtfs:autre"}


def test_logo_url(tmp_path, monkeypatch) -> None:
    import custom_components.public_transport as integration

    card = tmp_path / "frontend" / "public-transport-card.js"
    (tmp_path / "frontend" / "logos").mkdir(parents=True)
    (tmp_path / "frontend" / "logos" / "gtfs-reseau-test.svg").write_text("<svg/>")
    monkeypatch.setattr(integration, "CARD_PATH", card)
    assert integration._logo_url("gtfs:reseau-test") == "/public_transport_static/logos/gtfs-reseau-test.svg"
    assert integration._logo_url("star") is None
