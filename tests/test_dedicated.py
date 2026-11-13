"""Île-de-France Mobilités (PRIM), CTS (Strasbourg) and TCL (Lyon): departures, stops, lines, alerts, keys."""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util import dt as dt_util

from custom_components.public_transport.providers import (
    ProviderAuthError,
    ProviderError,
    Stop,
    create_provider,
    cts,
    idfm,
    tcl,
)
from custom_components.public_transport.providers.idfm import monitoring_ref


def at(minutes: float) -> str:
    return (dt_util.utcnow() + timedelta(minutes=minutes)).isoformat().replace("+00:00", "Z")


# ── Île-de-France Mobilités ───────────────────────────────────────────────────────────────────────────────────────
IDFM_STOP = Stop(id="IDFM:463158", name="Châtelet", mode="metro")
RER_STOP = Stop(id="IDFM:monomodalStopPlace:58566", name="Châtelet les Halles", mode="train")


def visit(line: str, destination: str, expected: float | None, aimed: float, status: str = "onTime") -> dict:
    call = {"AimedDepartureTime": at(aimed), "DepartureStatus": status, "DestinationDisplay": [{"value": destination}]}
    if expected is not None:
        call["ExpectedDepartureTime"] = at(expected)
    return {
        "MonitoringRef": {"value": "STIF:StopPoint:Q:463158:"},
        "MonitoredVehicleJourney": {
            "LineRef": {"value": f"STIF:Line::{line}:"},
            "DirectionName": [{"value": "Direction"}],
            "FramedVehicleJourneyRef": {"DatedVehicleJourneyRef": "RATP:VehicleJourney::M1.R.1:LOC"},
            "MonitoredCall": call,
        },
    }


def siri(name: str, key: str, records: list) -> dict:
    return {"Siri": {"ServiceDelivery": {name: [{key: records}]}}}


@pytest.fixture
async def idfm_provider(hass, aioclient_mock):
    return create_provider("idfm", async_get_clientsession(hass), "key")


def test_monitoring_refs() -> None:
    assert monitoring_ref("IDFM:463158") == "STIF:StopPoint:Q:463158:"
    assert monitoring_ref("IDFM:monomodalStopPlace:58566") == "STIF:StopArea:SP:58566:"


async def test_idfm_departures(idfm_provider, aioclient_mock) -> None:
    aioclient_mock.get(
        f"{idfm.PRIM}/stop-monitoring",
        json=siri(
            "StopMonitoringDelivery",
            "MonitoredStopVisit",
            [
                visit("C01371", "La Défense", 5, 3),
                visit("C01371", "Château de Vincennes", None, 2),
                visit("C01371", "Supprimé", 4, 4, status="cancelled"),
            ],
        ),
    )
    aioclient_mock.get(
        f"{idfm.OPENDATA}/referentiel-des-lignes/exports/json",
        json=[
            {
                "id_line": "C01371",
                "name_line": "1",
                "shortname_line": "1",
                "transportmode": "metro",
                "colourweb_hexa": "FFCD00",
                "textcolourweb_hexa": "000000",
            }
        ],
    )
    lines = await idfm_provider.lines()
    assert lines["C01371"].color == "#ffcd00"
    result = await idfm_provider.departures([IDFM_STOP])
    departures = result["metro:IDFM:463158"]
    assert [(d.destination, d.realtime, d.delay) for d in departures] == [
        ("Château de Vincennes", False, None),
        ("La Défense", True, 2),
    ]
    assert departures[0].line == "1"
    call = aioclient_mock.mock_calls[-1]
    assert call[1].query["MonitoringRef"] == "STIF:StopPoint:Q:463158:"
    assert call[3]["apikey"] == "key"


async def test_idfm_needs_a_key(hass, aioclient_mock) -> None:
    provider = create_provider("idfm", async_get_clientsession(hass))
    with pytest.raises(ProviderAuthError):
        await provider.departures([IDFM_STOP])
    aioclient_mock.get(f"{idfm.PRIM}/stop-monitoring", status=401)
    provider.api_key = "wrong"
    with pytest.raises(ProviderAuthError):
        await provider.departures([IDFM_STOP])


async def test_idfm_search_and_lines(idfm_provider, aioclient_mock) -> None:
    aioclient_mock.get(
        f"{idfm.OPENDATA}/arrets-lignes/records",
        json={
            "results": [
                {
                    "id": "IDFM:C01371",
                    "route_long_name": "1",
                    "stop_id": "IDFM:463158",
                    "stop_name": "Châtelet",
                    "nom_commune": "Paris",
                    "mode": "Metro",
                    "stop_lat": "48.85",
                    "stop_lon": "2.34",
                },
                {
                    "id": "IDFM:C01742",
                    "route_long_name": "A",
                    "stop_id": "IDFM:monomodalStopPlace:58566",
                    "stop_name": "Châtelet les Halles",
                    "nom_commune": "Paris",
                    "mode": "RapidTransit",
                },
            ]
        },
    )
    stops = await idfm_provider.search_stops("Châtelet")
    assert [(s.key, s.city) for s in stops] == [
        ("metro:IDFM:463158", "Paris"),
        ("train:IDFM:monomodalStopPlace:58566", "Paris"),
    ]
    assert (await idfm_provider.served_lines(stops))["metro:IDFM:463158"] == ["1"]
    aioclient_mock.get(f"{idfm.OPENDATA}/referentiel-des-lignes/exports/json", json=[])
    lines = await idfm_provider.lines_at_stop(stops[0])
    assert {line.id for line in lines} == {"C01371", "C01742"}


async def test_idfm_alerts(idfm_provider, aioclient_mock) -> None:
    idfm_provider._seen_lines = {"C01371"}
    aioclient_mock.get(
        f"{idfm.PRIM}/general-message",
        json=siri(
            "GeneralMessageDelivery",
            "InfoMessage",
            [
                {
                    "InfoMessageIdentifier": {"value": "m1"},
                    "InfoChannelRef": {"value": "Perturbation"},
                    "ValidUntilTime": at(60),
                    "Content": {
                        "Message": [
                            {"MessageType": "SHORT_MESSAGE", "MessageText": {"value": "Trafic perturbé"}},
                            {"MessageType": "LONG_MESSAGE", "MessageText": {"value": "Incident voyageur"}},
                        ]
                    },
                },
                {
                    "InfoMessageIdentifier": {"value": "m2"},
                    "InfoChannelRef": {"value": "Commercial"},
                    "Content": {"Message": [{"MessageText": {"value": "Pub"}}]},
                },
            ],
        ),
    )
    alerts = await idfm_provider.alerts()
    assert [(a.title, a.description, a.level, a.line_ids) for a in alerts] == [
        ("Trafic perturbé", "Incident voyageur", 2, ("C01371",))
    ]


# ── CTS ───────────────────────────────────────────────────────────────────────────────────────────────────────────
CTS_STOP = Stop(id="275C", name="Homme de Fer", mode="tram")


@pytest.fixture
async def cts_provider(hass, aioclient_mock):
    return create_provider("cts", async_get_clientsession(hass), "token")


async def test_cts(cts_provider, aioclient_mock) -> None:
    aioclient_mock.get(
        f"{cts.API}/stoppoints-discovery",
        json={
            "StopPointsDelivery": {
                "AnnotatedStopPointRef": [
                    {
                        "StopPointRef": "275C",
                        "StopName": "Homme de Fer",
                        "Location": {"Longitude": 7.74, "Latitude": 48.58},
                        "Extension": {"StopCode": "275C", "LogicalStopCode": "275"},
                        "Lines": [{"LineRef": "A"}, {"LineRef": "D"}],
                    },
                    {"StopPointRef": "300A", "StopName": "Hôpital", "Extension": {"StopCode": "300A"}},
                ]
            }
        },
    )
    aioclient_mock.get(
        f"{cts.API}/lines-discovery",
        json={
            "LinesDelivery": {
                "AnnotatedLineRef": [
                    {
                        "LineRef": "A",
                        "LineName": "A",
                        "Extension": {"RouteType": "tram", "RouteColor": "E10D19", "RouteTextColor": "FFFFFF"},
                    }
                ]
            }
        },
    )
    aioclient_mock.get(
        f"{cts.API}/stop-monitoring",
        json={
            "ServiceDelivery": {
                "StopMonitoringDelivery": [
                    {
                        "MonitoredStopVisit": [
                            {
                                "MonitoredVehicleJourney": {
                                    "LineRef": "A",
                                    "DestinationName": "Illkirch Graffenstaden",
                                    "DirectionRef": 1,
                                    "MonitoredCall": {
                                        "ExpectedDepartureTime": at(3),
                                        "Extension": {"IsRealTime": False},
                                    },
                                }
                            }
                        ]
                    }
                ]
            }
        },
    )
    aioclient_mock.get(f"{cts.API}/general-message", json={"ServiceDelivery": {"GeneralMessageDelivery": []}})
    stops = await cts_provider.search_stops("homme fer")
    assert [(s.id, s.mode) for s in stops] == [("275C", "tram")]
    lines = await cts_provider.lines()
    assert lines["A"].color == "#e10d19"
    assert [line.id for line in await cts_provider.lines_at_stop(CTS_STOP, lines)] == ["A", "D"]
    departures = (await cts_provider.departures([CTS_STOP]))["tram:275C"]
    assert [(d.line, d.destination, d.realtime, d.direction) for d in departures] == [
        ("A", "Illkirch Graffenstaden", False, 1)
    ]
    assert await cts_provider.alerts() == []
    assert aioclient_mock.mock_calls[-2][1].query["MonitoringRef"] == "275C"


async def test_cts_needs_a_token(hass, aioclient_mock) -> None:
    with pytest.raises(ProviderAuthError):
        await create_provider("cts", async_get_clientsession(hass)).search_stops("x")


# ── TCL ───────────────────────────────────────────────────────────────────────────────────────────────────────────
TCL_STOP = Stop(id="30101", name="Bellecour", mode="metro")


def rdata(values: list[dict]) -> dict:
    return {"fields": [], "layer_name": "x", "nb_results": len(values), "values": values}


@pytest.fixture
async def tcl_provider(hass, aioclient_mock):
    return create_provider("tcl", async_get_clientsession(hass), "me:secret")


async def test_tcl(tcl_provider, aioclient_mock) -> None:
    local = dt_util.now(dt_util.get_time_zone("Europe/Paris"))
    soon = (local + timedelta(minutes=4)).strftime("%Y-%m-%d %H:%M:%S")
    later = (local + timedelta(minutes=9)).strftime("%Y-%m-%d %H:%M:%S")
    aioclient_mock.get(
        f"{tcl.API}/{tcl.STOPS}/all.json",
        json=rdata(
            [
                {"id": 30101, "nom": "Bellecour", "desserte": "A:A,A:R,D:A,C9:A", "lat": "45.75", "lon": "4.83"},
                {"id": 2000, "nom": "Perrache", "desserte": "T2:A"},
            ]
        ),
    )
    aioclient_mock.get(
        f"{tcl.API}/{tcl.PASSAGES}/all.json",
        json=rdata(
            [
                {"id": 30101, "ligne": "D", "direction": "Gare de Vénissieux", "heurepassage": later, "type": "T"},
                {"id": 30101, "ligne": "A", "direction": "Vaulx-en-Velin La Soie", "heurepassage": soon, "type": "E"},
                {"id": 1, "ligne": "A", "direction": "Ailleurs", "heurepassage": soon, "type": "E"},
            ]
        ),
    )
    aioclient_mock.get(
        f"{tcl.API}/{tcl.ALERTS}/all.json",
        json=rdata(
            [
                {"type": "Perturbation", "titre": "Travaux", "message": "Arrêt", "ligne_cli": line, "debut": soon}
                for line in ("C9", "A")
            ]
        ),
    )
    stops = await tcl_provider.search_stops("belle")
    assert [(s.id, s.mode) for s in stops] == [("30101", "metro")]
    assert (await tcl_provider.served_lines(stops))["metro:30101"] == ["A", "D", "C9"]
    assert [line.mode for line in await tcl_provider.lines_at_stop(TCL_STOP)] == ["metro", "metro", "bus"]
    departures = (await tcl_provider.departures([TCL_STOP]))["metro:30101"]
    assert [(d.line, d.realtime) for d in departures] == [("A", True), ("D", False)]
    call = next(c for c in aioclient_mock.mock_calls if tcl.PASSAGES in str(c[1]))
    assert call[1].query["field"] == "id"
    assert call[1].query["value"] == "30101"
    alerts = await tcl_provider.alerts()
    assert [(a.title, a.level, a.line_ids) for a in alerts] == [("Travaux", 2, ("C9", "A"))]


async def test_tcl_needs_login_and_password(hass, aioclient_mock) -> None:
    with pytest.raises(ProviderAuthError):
        await create_provider("tcl", async_get_clientsession(hass), "no-password").search_stops("x")
    aioclient_mock.get(f"{tcl.API}/{tcl.STOPS}/all.json", status=500)
    with pytest.raises(ProviderError):
        await create_provider("tcl", async_get_clientsession(hass), "a:b").search_stops("x")
