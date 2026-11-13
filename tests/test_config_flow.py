"""Config flow: network, search, stop, lines; options."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.setup import async_setup_component

from custom_components.public_transport.config_flow import _stop_label
from custom_components.public_transport.const import DOMAIN
from custom_components.public_transport.providers import Stop

from . import star_data as data
from .test_init import make_entry, setup


async def _to_search(hass, **extra):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"provider": "star", **extra})
    assert result["step_id"] == "search"
    return result


async def test_full_flow(hass, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    result = await _to_search(hass, api_key=" secret ")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "Répu"})
    assert result["step_id"] == "stop"
    options = result["data_schema"].schema["stop"].config["options"]
    labels = {o["value"]: o["label"] for o in options}
    # Lines and the destinations of the coming passages tell apart the stops of the same name.
    assert labels["bus:1201"] == "République (Rennes) · Bus · C4, 11 · → Gaité / ZA Saint-Sulpice"
    assert labels["bus:1202"] == "République (Rennes) · Bus · C4"
    assert labels["metro:8000"] == "République (Rennes) · Metro · → J.F. Kennedy"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"stop": "bus:1201"})
    assert result["step_id"] == "lines"
    assert result["description_placeholders"] == {"stop": "République (Rennes)"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"lines": []})
    assert result["errors"] == {"lines": "no_line_selected"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"lines": ["0004"]})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "STAR République"
    assert result["data"]["stop_id"] == "1201"
    assert result["data"]["mode"] == "bus"
    assert result["data"]["line_names"] == {"0004": "C4", "0011": "11"}
    assert result["data"][CONF_API_KEY] == "secret"
    assert result["options"] == {"lines": ["0004"]}
    assert result["result"].unique_id == "star_bus:1201"


async def test_no_stop_found(hass, aioclient_mock) -> None:
    aioclient_mock.get(data.STOPS_BUS, json=data.page([]))
    aioclient_mock.get(data.STOPS_METRO, json=data.page([]))
    result = await _to_search(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "Nowhere"})
    assert result["errors"] == {"query": "no_stop_found"}


async def test_search_errors(hass, aioclient_mock) -> None:
    aioclient_mock.get(data.STOPS_BUS, status=503)
    result = await _to_search(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "x"})
    assert result["errors"] == {"base": "cannot_connect"}

    aioclient_mock.clear_requests()
    aioclient_mock.get(data.STOPS_BUS, status=401)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "x"})
    # A refused key sends back to the first step, where the key is typed.
    assert result["step_id"] == "user"
    assert result["errors"] == {"base": "invalid_auth"}
    aioclient_mock.clear_requests()
    data.mock_network(aioclient_mock)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"provider": "star", "api_key": "ok"})
    assert result["step_id"] == "search"


def test_stop_label_keeps_a_few_destinations() -> None:
    stop = Stop(id="1", name="Gares", mode="bus", city="Rennes")
    assert _stop_label(stop, None) == "Gares (Rennes) · Bus"
    label = _stop_label(stop, (["C1"], ["A", "B", "C", "D"]))
    assert label == "Gares (Rennes) · Bus · C1 · → A / B / C…"


async def test_stop_already_followed(hass, aioclient_mock) -> None:
    make_entry(hass)
    data.mock_network(aioclient_mock)
    result = await _to_search(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"query": "Répu"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"stop": "bus:1201"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow(hass, aioclient_mock) -> None:
    entry = make_entry(hass, lines=("0004",))
    await setup(hass, aioclient_mock, entry)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["step_id"] == "init"
    lines = [o["value"] for o in result["data_schema"].schema["lines"].config["options"]]
    assert lines == ["0004", "0011"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"lines": [], "scan_interval": 60, "max_departures": 4}
    )
    assert result["errors"] == {"lines": "no_line_selected"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"lines": ["0004", "0011"], "scan_interval": 90, "max_departures": 4, "api_key": "k"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options == {"lines": ["0004", "0011"], "scan_interval": 90, "max_departures": 4, CONF_API_KEY: "k"}
    await hass.async_block_till_done()
    # Reloaded with the new line: its sensor exists.
    assert hass.states.get("sensor.star_republique_line_11") is not None
    assert entry.runtime_data.provider.api_key == "k"

    # An emptied key field removes the key.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"lines": ["0004"], "scan_interval": 90, "max_departures": 4}
    )
    await hass.async_block_till_done()
    assert entry.options[CONF_API_KEY] == ""
    assert entry.runtime_data.provider.api_key is None


async def test_options_flow_without_network(hass, aioclient_mock) -> None:
    """The lines known when the entry was made are offered when the network can't be reached."""
    entry = make_entry(hass, lines=("0004",))
    assert await async_setup_component(hass, "http", {})
    data.mock_network(aioclient_mock)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    aioclient_mock.clear_requests()
    aioclient_mock.get(data.SERVED, status=500)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    values = [o["value"] for o in result["data_schema"].schema["lines"].config["options"]]
    assert values == ["0004", "0011", "1001"]
