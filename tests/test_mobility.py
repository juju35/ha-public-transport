"""Bike-share stations and park-and-rides followed with a stop: provider, options, sensors and the stop attribute."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from custom_components.public_transport.config_flow import _station_choices
from custom_components.public_transport.providers import Mobility, Stop, create_provider

from . import star_data as data
from .test_init import make_entry, setup


async def test_star_reads_bike_stations_and_park_rides(hass: HomeAssistant, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    star = create_provider("star", async_get_clientsession(hass))
    assert star.has_mobility
    found = {m.key: m for m in await star.mobility()}
    assert list(found) == ["bike:5505", "bike:5509", "park:HFR", "park:CVI"]
    bike = found["bike:5505"]
    assert (bike.available, bike.docks, bike.capacity, bike.open) == (7, 17, 24, True)
    assert bike.latitude == 48.114219
    # A station out of service is closed.
    assert not found["bike:5509"].open
    park = found["park:HFR"]
    assert (park.available, park.capacity, park.open) == (196, 384, True)
    assert park.spaces == {"pmr": 8, "ev": 12, "carpool": 15}
    closed = found["park:CVI"]
    assert not closed.open and closed.available is None and closed.spaces == {}
    assert closed.as_dict() == {
        "id": "park:CVI",
        "kind": "park",
        "name": "Cesson-Viasilva",
        "available": None,
        "capacity": 757,
        "docks": None,
        "open": False,
    }


async def test_star_stop_location(hass: HomeAssistant, aioclient_mock) -> None:
    data.mock_network(aioclient_mock)
    star = create_provider("star", async_get_clientsession(hass))
    assert await star.stop_location(Stop(id="1201", name="République", mode="bus")) == (48.1096, -1.6793)
    assert await star.stop_location(Stop(id="1", name="?", mode="ferry")) is None


def test_choices_nearest_first_within_the_radius_plus_the_followed() -> None:
    near = Mobility("1", "bike", "Near", 3, latitude=48.1100, longitude=-1.6790)
    mid = Mobility("2", "park", "Mid", 30, latitude=48.1200, longitude=-1.6790)
    far = Mobility("3", "bike", "Far", 1, latitude=48.3000, longitude=-1.6790)
    unknown = Mobility("4", "bike", "Nowhere", 1)
    choices = _station_choices([far, mid, near, unknown], (48.1096, -1.6793), [])
    assert list(choices) == ["bike:1", "park:2"]
    assert choices["bike:1"] == ("Near", "Near · 50 m")
    assert choices["park:2"][1] == "P+R Mid · 1.2 km"
    # A followed station stays offered, however far.
    assert "bike:3" in _station_choices([far, near], (48.1096, -1.6793), ["bike:3"])
    # Without the stop's place: every station, by name.
    assert list(_station_choices([mid, near], None, [])) == ["park:2", "bike:1"]


async def test_options_follow_stations_and_sensors(hass: HomeAssistant, aioclient_mock) -> None:
    entry = make_entry(hass, lines=("0004",))
    await setup(hass, aioclient_mock, entry)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    offered = [o["value"] for o in result["data_schema"].schema["mobility"].config["options"]]
    # Nearest the stop first (République, 48.1096 / -1.6793): Saint-Georges, Sainte-Anne, then Henri Fréville.
    assert offered[:3] == ["bike:5509", "bike:5505", "park:HFR"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {"lines": ["0004"], "scan_interval": 60, "max_departures": 4, "mobility": ["bike:5505", "park:HFR"]},
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["mobility"] == ["bike:5505", "park:HFR"]
    assert entry.options["mobility_names"] == {"bike:5505": "Sainte-Anne", "park:HFR": "Henri Fréville"}
    await hass.async_block_till_done(wait_background_tasks=True)
    await entry.runtime_data.async_refresh()
    await hass.async_block_till_done()

    bikes = hass.states.get("sensor.star_republique_bikes_at_sainte_anne")
    assert bikes is not None and bikes.state == "7"
    assert bikes.attributes["docks"] == 17 and bikes.attributes["capacity"] == 24
    spaces = hass.states.get("sensor.star_republique_free_spaces_at_henri_freville")
    assert spaces is not None and spaces.state == "196"
    assert spaces.attributes["spaces"] == {"pmr": 8, "ev": 12, "carpool": 15}

    nearby = hass.states.get("sensor.star_republique_next_departure").attributes["nearby"]
    assert [m["id"] for m in nearby] == ["bike:5505", "park:HFR"]
    assert nearby[0] == {
        "id": "bike:5505",
        "kind": "bike",
        "name": "Sainte-Anne",
        "available": 7,
        "capacity": 24,
        "docks": 17,
        "open": True,
    }


async def test_no_station_requests_when_none_followed(hass: HomeAssistant, aioclient_mock) -> None:
    entry = make_entry(hass, lines=("0004",))
    await setup(hass, aioclient_mock, entry)
    await entry.runtime_data.async_refresh()
    assert not data.calls_to(aioclient_mock, data.BIKES_URL)
    assert hass.states.get("sensor.star_republique_next_departure").attributes["nearby"] == []
