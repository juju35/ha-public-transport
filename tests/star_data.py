"""Mocked answers of the STAR open data portal (Explore API v2.1), built around the current time."""

from __future__ import annotations

from datetime import timedelta

from homeassistant.util import dt as dt_util

from custom_components.public_transport.providers.star import ALERTS, API_BASE, BIKES, DATASETS, DESSERTES, PARK_RIDES

PASSAGES_BUS = f"{API_BASE}/{DATASETS['bus']['passages']}/records"
PASSAGES_METRO = f"{API_BASE}/{DATASETS['metro']['passages']}/records"
STOPS_BUS = f"{API_BASE}/{DATASETS['bus']['stops']}/records"
STOPS_METRO = f"{API_BASE}/{DATASETS['metro']['stops']}/records"
LINES_BUS = f"{API_BASE}/{DATASETS['bus']['lines']}/records"
LINES_METRO = f"{API_BASE}/{DATASETS['metro']['lines']}/records"
SERVED = f"{API_BASE}/{DESSERTES}/records"
ALERTS_URL = f"{API_BASE}/{ALERTS}/records"
BIKES_URL = f"{API_BASE}/{BIKES}/records"
PARKS_URL = f"{API_BASE}/{PARK_RIDES}/records"


def page(results: list[dict]) -> dict:
    return {"total_count": len(results), "results": results}


def at(minutes: float) -> str:
    return (dt_util.now() + timedelta(minutes=minutes)).isoformat()


def bus_passages() -> dict:
    return page(
        [
            {
                "idligne": "0004",
                "nomcourtligne": "C4",
                "sens": 0,
                "destination": "ZA Saint-Sulpice",
                "idarret": "1201",
                "nomarret": "République",
                "arriveetheorique": at(1),
                "departtheorique": at(1),
                "arrivee": at(3),
                "depart": at(3),
                "idcourse": "268475",
                "precision": "Temps réel",
            },
            {
                "idligne": "0011",
                "nomcourtligne": "11",
                "sens": 1,
                "destination": "Gaité",
                "idarret": "1201",
                "arrivee": at(9),
                "depart": at(9),
                "precision": "Applicable",
            },
            {
                "idligne": "0004",
                "nomcourtligne": "C4",
                "sens": 0,
                "destination": "ZA Saint-Sulpice",
                "idarret": "1201",
                "arriveetheorique": at(12),
                "departtheorique": at(12),
                "arrivee": at(12),
                "depart": at(12),
                "precision": "Temps réel",
            },
            # Already gone: dropped.
            {
                "idligne": "0004",
                "nomcourtligne": "C4",
                "destination": "ZA Saint-Sulpice",
                "idarret": "1201",
                "depart": at(-5),
                "precision": "Temps réel",
            },
            # Another stop of the same request.
            {
                "idligne": "0011",
                "nomcourtligne": "11",
                "destination": "Gaité",
                "idarret": "1301",
                "depart": at(4),
                "precision": "Temps réel",
            },
        ]
    )


def metro_passages() -> dict:
    # As the portal answers for the metro: `precision` is a list, `arrivee` a local time with a +hhmm offset,
    # `depart` in UTC, and no timetable fields.
    return page(
        [
            {
                "idligne": "1001",
                "nomcourtligne": "a",
                "sens": 1,
                "destination": "J.F. Kennedy",
                "idarret": "8000",
                "nomarret": "République",
                "coordonnees": {"lon": -1.68, "lat": 48.11},
                "arrivee": dt_util.as_local(dt_util.now() + timedelta(minutes=2)).strftime("%Y-%m-%d %H:%M:%S%z"),
                "depart": dt_util.as_utc(dt_util.now() + timedelta(minutes=2, seconds=18)).isoformat(),
                "precision": ["Temps réel"],
                "idrame": None,
            },
            {
                "idligne": "1001",
                "nomcourtligne": "a",
                "sens": 1,
                "destination": "J.F. Kennedy",
                "idarret": "8000",
                "depart": at(9),
                "precision": ["Applicable"],
            },
        ]
    )


def bus_lines() -> dict:
    return page(
        [
            {
                "id": "0004",
                "nomcourt": "C4",
                "nomlong": "ZA Saint-Sulpice <> Grand Quartier",
                "couleurligne": "#E30613",
                "couleurtexteligne": "#FFFFFF",
                "estversionactive": "Oui",
            },
            {
                "id": "0011",
                "nomcourt": "11",
                "nomlong": "Gaité <> ZI Sud-Est",
                "couleurligne": "3E9D44",
                "couleurtexteligne": "FFFFFF",
                "estversionactive": "Oui",
            },
            # An old version of line 11: ignored.
            {"id": "0011", "nomcourt": "11", "couleurligne": "#000000", "estversionactive": "Non"},
        ]
    )


def metro_lines() -> dict:
    return page(
        [
            {
                "id": "1001",
                "nomcourt": "a",
                "nomlong": "J.F. Kennedy <> La Poterie",
                "couleurligne": "#E3051B",
                "couleurtexteligne": "#FFFFFF",
            }
        ]
    )


def alerts() -> dict:
    return page(
        [
            {
                "idperturbation": "P1",
                "titre": "Works on line C4",
                "description": "Stop République moved 50 m.",
                "niveau": "2",
                "debutvalidite": at(-60 * 24),
                "finvalidite": at(60 * 24 * 3),
                "idligne": "0004",
                "nomcourtligne": "C4",
                "url": "https://www.star.fr/info-trafic",
            },
            {
                "idperturbation": "P1",
                "titre": "Works on line C4",
                "niveau": "2",
                "finvalidite": at(60 * 24 * 3),
                "idligne": "0011",
            },
            # The portal now gives the level as a list of labels.
            {"idperturbation": "P2", "titre": "Line 70 diverted", "niveau": ["Mineure"], "idligne": "0070"},
            {"idperturbation": "P3", "titre": "Over", "niveau": ["Majeure"], "finvalidite": at(-10), "idligne": "0004"},
            {"idperturbation": "P4", "titre": "Metro b stopped", "niveau": ["Mineure", "Majeure"], "idligne": "1002"},
        ]
    )


def bus_stops() -> dict:
    return page(
        [
            {
                "id": "1201",
                "nom": "République",
                "nomcommune": "Rennes",
                "estversionactive": "Oui",
                "coordonnees": {"lat": 48.1096, "lon": -1.6793},
            },
            {"id": "1202", "nom": "République", "nomcommune": "Rennes", "estversionactive": "Oui"},
            {"id": "1299", "nom": "République", "nomcommune": "Rennes", "estversionactive": "Non"},
        ]
    )


def metro_stops() -> dict:
    return page([{"id": "8000", "nom": "République", "nomcommune": "Rennes", "coordonnees": [48.11, -1.68]}])


def served() -> dict:
    return page(
        [
            {"idarret": "1201", "idligne": "0004", "nomcourtligne": "C4"},
            {"idarret": "1201", "idligne": "0011", "nomcourtligne": "11"},
            {"idarret": "1202", "idligne": "0004", "nomcourtligne": "C4"},
        ]
    )


def bike_stations() -> dict:
    """Shaped like the portal's answers captured in Nov. 2026."""
    return page(
        [
            {
                "idstation": "5505",
                "nom": "Sainte-Anne",
                "coordonnees": {"lon": -1.680534, "lat": 48.114219},
                "etat": ["En fonctionnement"],
                "nombreemplacementsactuels": 24,
                "nombreemplacementsdisponibles": 17,
                "nombrevelosdisponibles": 7,
            },
            {
                "idstation": "5509",
                "nom": "Saint-Georges Piscine",
                "coordonnees": {"lon": -1.674417, "lat": 48.112385},
                "etat": ["En maintenance"],
                "nombreemplacementsactuels": 18,
                "nombreemplacementsdisponibles": 15,
                "nombrevelosdisponibles": 3,
            },
        ]
    )


def park_rides() -> dict:
    return page(
        [
            {
                "idparc": "HFR",
                "nom": "Henri Fréville",
                "coordonnees": {"lon": -1.674555, "lat": 48.087537},
                "capaciteparking": 416,
                "etatouverture": "OUVERT",
                "etatremplissage": "LIBRE",
                "capacitesoliste": 384,
                "jrdinfosoliste": 196,
                "capaciteve": 20,
                "jrdinfoelectrique": 12,
                "capacitecovoiturage": 0,
                "jrdinfocovoiturage": 15,
                "capacitepmr": 9,
                "jrdinfopmr": 8,
                "nbascenseurdispo": "NA",
            },
            {
                "idparc": "CVI",
                "nom": "Cesson-Viasilva",
                "coordonnees": {"lon": -1.620879, "lat": 48.13259},
                "capaciteparking": 815,
                "etatouverture": "FERME",
                "capacitesoliste": 757,
                "jrdinfosoliste": "NA",
            },
        ]
    )


def mock_network(aioclient_mock, *, passages: dict | None = None) -> None:
    """Every dataset the integration reads, answered."""
    aioclient_mock.get(PASSAGES_BUS, json=passages if passages is not None else bus_passages())
    aioclient_mock.get(PASSAGES_METRO, json=metro_passages())
    aioclient_mock.get(LINES_BUS, json=bus_lines())
    aioclient_mock.get(LINES_METRO, json=metro_lines())
    aioclient_mock.get(ALERTS_URL, json=alerts())
    aioclient_mock.get(STOPS_BUS, json=bus_stops())
    aioclient_mock.get(STOPS_METRO, json=metro_stops())
    aioclient_mock.get(SERVED, json=served())
    aioclient_mock.get(BIKES_URL, json=bike_stations())
    aioclient_mock.get(PARKS_URL, json=park_rides())


def calls_to(aioclient_mock, url: str) -> list:
    return [c for c in aioclient_mock.mock_calls if str(c[1]).split("?")[0] == url]
