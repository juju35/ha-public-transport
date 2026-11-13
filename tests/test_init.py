"""Setup, sensors, the shared network coordinator, the refresh action and the card resource."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import CONF_API_KEY
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.public_transport.const import DOMAIN
from custom_components.public_transport.diagnostics import async_get_config_entry_diagnostics

from . import star_data as data


def make_entry(hass: HomeAssistant, stop_id: str = "1201", lines=("0004", "0011"), mode="bus", **options):
    entry = MockConfigEntry(
        domain=DOMAIN,
        title=f"STAR {stop_id}",
        unique_id=f"star_{mode}:{stop_id}",
        data={
            "provider": "star",
            "stop_id": stop_id,
            "stop_name": "République" if stop_id == "1201" else "Gares",
            "stop_city": "Rennes",
            "mode": mode,
            "line_names": {"0004": "C4", "0011": "11", "1001": "a"},
            **({CONF_API_KEY: options.pop("api_key")} if "api_key" in options else {}),
        },
        options={"lines": list(lines), **options},
    )
    entry.add_to_hass(hass)
    return entry


async def setup(hass, aioclient_mock, *entries, passages=None):
    data.mock_network(aioclient_mock, passages=passages)
    assert await async_setup_component(hass, "http", {})
    for entry in entries:
        # Setting up the first entry sets up the integration, and with it every entry already added.
        if entry.state is ConfigEntryState.NOT_LOADED:
            await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


def _resources(hass):
    lovelace = hass.data["lovelace"]
    return lovelace["resources"] if isinstance(lovelace, dict) else lovelace.resources


async def test_stop_sensor(hass, aioclient_mock) -> None:
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    assert entry.state is ConfigEntryState.LOADED

    state = hass.states.get("sensor.star_republique_next_departure")
    assert state is not None
    a = state.attributes
    assert a["device_class"] == "timestamp"
    assert a["stop_name"] == "République"
    assert a["network"] == "STAR"
    assert a["mode"] == "bus"
    assert a["config_entry_id"] == entry.entry_id
    assert [d["line"] for d in a["departures"]] == ["C4", "11", "C4"]
    first = a["departures"][0]
    assert first["color"] == "#e30613"
    assert first["text_color"] == "#ffffff"
    assert first["realtime"] is True
    assert first["delay"] == 2
    gap = dt_util.parse_datetime(state.state) - dt_util.parse_datetime(first["departure"])
    assert abs(gap.total_seconds()) < 1
    assert [line["name"] for line in a["lines"]] == ["C4", "11"]
    assert [al["id"] for al in a["alerts"]] == ["P1"]
    assert a["alerts"][0]["lines"] == ["C4", "11"]
    assert a["stale"] is False
    assert "STAR" in a["attribution"]


async def test_line_sensors_and_disruption(hass, aioclient_mock) -> None:
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    c4 = hass.states.get("sensor.star_republique_line_c4")
    assert c4 is not None
    assert c4.attributes["line"] == "C4"
    assert c4.attributes["destination"] == "ZA Saint-Sulpice"
    assert len(c4.attributes["next_departures"]) == 2
    assert c4.attributes["stop_name"] == "République"
    line11 = hass.states.get("sensor.star_republique_line_11")
    assert line11.attributes["realtime"] is False
    alert = hass.states.get("binary_sensor.star_republique_traffic_alert")
    assert alert.state == "on"
    assert alert.attributes["level"] == 2


async def test_max_departures_and_lines_filter(hass, aioclient_mock) -> None:
    entry = make_entry(hass, lines=("0004",), max_departures=1)
    await setup(hass, aioclient_mock, entry)
    a = hass.states.get("sensor.star_republique_next_departure").attributes
    assert [d["line"] for d in a["departures"]] == ["C4"]
    assert hass.states.get("sensor.star_republique_line_11") is None


async def test_no_alert_on_the_followed_lines(hass, aioclient_mock) -> None:
    entry = make_entry(hass, stop_id="8000", mode="metro", lines=("1001",))
    await setup(hass, aioclient_mock, entry)
    assert hass.states.get("binary_sensor.star_gares_traffic_alert").state == "off"
    a = hass.states.get("sensor.star_gares_next_departure").attributes
    assert a["departures"][0]["line"] == "a"


async def test_stops_of_a_network_share_one_request(hass, aioclient_mock) -> None:
    first = make_entry(hass)
    second = make_entry(hass, stop_id="1301", lines=("0011",), scan_interval=30)
    await setup(hass, aioclient_mock, first, second)
    assert first.runtime_data is second.runtime_data
    coordinator = first.runtime_data
    assert coordinator.update_interval == timedelta(seconds=30)
    before = len(data.calls_to(aioclient_mock, data.PASSAGES_BUS))
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=31))
    await hass.async_block_till_done()
    calls = data.calls_to(aioclient_mock, data.PASSAGES_BUS)
    assert len(calls) == before + 1
    assert calls[-1][1].query["where"] == 'idarret="1201" or idarret="1301"'
    # Lines and alerts are not fetched again at every update.
    assert len(data.calls_to(aioclient_mock, data.LINES_BUS)) == 1
    assert hass.states.get("sensor.star_gares_next_departure").attributes["departures"][0]["line"] == "11"

    # Unloading one stop keeps the coordinator for the other; unloading both drops it.
    assert await hass.config_entries.async_unload(second.entry_id)
    assert hass.data[DOMAIN]["star"] is coordinator
    assert list(coordinator.stops) == [first.entry_id]
    assert await hass.config_entries.async_unload(first.entry_id)
    await hass.async_block_till_done()
    assert "star" not in hass.data[DOMAIN]


async def test_first_update_failure_retries_later(hass, aioclient_mock) -> None:
    entry = make_entry(hass)
    aioclient_mock.get(data.PASSAGES_BUS, status=500)
    data.mock_network(aioclient_mock)
    assert await async_setup_component(hass, "http", {})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert "star" not in hass.data.get(DOMAIN, {})


async def test_a_later_failure_keeps_the_departures(hass, aioclient_mock) -> None:
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    aioclient_mock.clear_requests()
    aioclient_mock.get(data.PASSAGES_BUS, status=429)
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=61))
    await hass.async_block_till_done()
    state = hass.states.get("sensor.star_republique_next_departure")
    assert state.state != "unavailable"
    assert state.attributes["stale"] is True
    assert "quota" in state.attributes["last_error"]
    assert len(state.attributes["departures"]) == 3


async def test_refresh_action(hass, aioclient_mock) -> None:
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    before = len(data.calls_to(aioclient_mock, data.PASSAGES_BUS))
    await hass.services.async_call(DOMAIN, "refresh", {"config_entry_id": entry.entry_id}, blocking=True)
    assert len(data.calls_to(aioclient_mock, data.PASSAGES_BUS)) == before + 1

    aioclient_mock.clear_requests()
    aioclient_mock.get(data.PASSAGES_BUS, status=500)
    with pytest.raises(HomeAssistantError) as err:
        await hass.services.async_call(DOMAIN, "refresh", {}, blocking=True)
    assert err.value.translation_key == "refresh_failed"

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "refresh", {"config_entry_id": "nope"}, blocking=True)


async def test_api_key_reaches_the_provider(hass, aioclient_mock) -> None:
    entry = make_entry(hass, api_key="secret")
    await setup(hass, aioclient_mock, entry)
    assert entry.runtime_data.provider.api_key == "secret"
    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    assert diagnostics["entry"]["data"][CONF_API_KEY] == "**REDACTED**"
    assert diagnostics["network"]["api_key_set"] is True
    assert diagnostics["network"]["stops"] == ["bus:1201"]
    assert [d["line"] for d in diagnostics["departures"]] == ["C4", "11", "C4"]


async def test_card_is_added_to_the_dashboard_resources(hass, aioclient_mock) -> None:
    assert await async_setup_component(hass, "lovelace", {})
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    resources = _resources(hass)
    urls = [item["url"] for item in resources.async_items()]
    assert len(urls) == 1
    assert urls[0].startswith("/public_transport_static/public-transport-card.js?v=")


async def test_card_in_yaml_mode_is_loaded_on_every_page(hass, aioclient_mock, stub_frontend) -> None:
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"mode": "yaml"}})
    entry = make_entry(hass)
    await setup(hass, aioclient_mock, entry)
    assert stub_frontend.call_args[0][1].startswith("/public_transport_static/public-transport-card.js?v=")


async def test_one_key_serves_the_whole_network(hass, aioclient_mock) -> None:
    """The second stop, set up without a key, uses the key of the first one."""
    first = make_entry(hass, api_key="secret")
    second = make_entry(hass, stop_id="1301", lines=("0011",))
    await setup(hass, aioclient_mock, first, second)
    assert second.runtime_data is first.runtime_data
    assert first.runtime_data.provider.api_key == "secret"
