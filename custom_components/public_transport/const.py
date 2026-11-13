"""Constants for the Public Transport integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "public_transport"

CONF_PROVIDER: Final = "provider"
CONF_STOP_ID: Final = "stop_id"
CONF_STOP_NAME: Final = "stop_name"
CONF_STOP_CITY: Final = "stop_city"
CONF_MODE: Final = "mode"
CONF_NETWORK: Final = "network"
CONF_LINES: Final = "lines"
CONF_QUERY: Final = "query"
CONF_STOP: Final = "stop"
CONF_SCAN_INTERVAL: Final = "scan_interval"
CONF_MAX_DEPARTURES: Final = "max_departures"

# Real-time data changes about every 30 s: one minute is close enough for a countdown that the card ticks itself,
# and the network coordinator asks for every stop of a network in one request.
DEFAULT_SCAN_INTERVAL: Final = 60
MIN_SCAN_INTERVAL: Final = 30
MAX_SCAN_INTERVAL: Final = 600
DEFAULT_MAX_DEPARTURES: Final = 6
# Traffic alerts and line colors change rarely: fetched less often than the departures.
ALERTS_REFRESH: Final = timedelta(minutes=5)
LINES_REFRESH: Final = timedelta(hours=24)
# A departure stays listed this long after its time (the vehicle may still be at the stop).
DEPARTED_GRACE: Final = timedelta(seconds=30)

SERVICE_REFRESH: Final = "refresh"
ATTR_CONFIG_ENTRY_ID: Final = "config_entry_id"

FRONTEND_URL: Final = "/public_transport_static"
CARD_FILENAME: Final = "public-transport-card.js"
# Network logos served with the card: frontend/logos/<provider key>.svg (":" of generic networks as "-").
LOGOS_DIR: Final = "logos"
