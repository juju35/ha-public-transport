# Public Transport Integration — Agent Context

## Purpose
Home Assistant custom integration for the next departures at public transport stops, network by network
(providers). Networks: STAR (Rennes, data.explore.star.fr, Opendatasoft Explore API v2.1), IDFM (PRIM SIRI Lite + IDFM open data),
TCL (data.grandlyon.com rdata), CTS (api.cts-strasbourg.eu SIRI 2.0) and a generic GTFS + GTFS-RT provider for every
network of transport.data.gouv.fr with real time.
Ships its own Lovelace cards (`frontend/public-transport-card.js`), served by the integration itself.

## Architecture

```
custom_components/public_transport/
├── __init__.py        # Setup, card registration (Lovelace resources), refresh action, one coordinator per network in hass.data
├── coordinator.py     # NetworkCoordinator: departures of every stop of a network in one request; lines daily, alerts every 5 min; keeps the last data on failure (last_error)
├── providers/base.py  # Provider ABC, Stop / Line / Departure / Alert dataclasses, errors
├── providers/star.py  # STAR provider (passages, stops, dessertes, lines, alerts datasets)
├── providers/gtfs.py  # Generic GTFS + GTFS-RT provider: catalogue of transport.data.gouv.fr, GTFS zip cached in .storage, timetable + trip updates
├── providers/gtfs_rt.py # Hand-written protobuf reader for GTFS-RT (trip updates, alerts): no dependency
├── providers/siri.py  # SIRI / SIRI Lite JSON helpers (stop monitoring, general messages) + SiriMonitoringProvider
├── providers/idfm.py, cts.py, tcl.py  # Île-de-France Mobilités (key), CTS Strasbourg (token), TCL Lyon (login:password)
├── config_flow.py     # Network (+ API key) → [GTFS: catalogue search → network → download progress] → search → stop → lines; options
├── entity.py          # Base entity: one service device per stop (config entry)
├── sensor.py          # Next departure per stop (card's source) and per followed line (timestamps)
├── binary_sensor.py   # Traffic alert per stop
├── diagnostics.py     # API key redacted
└── frontend/public-transport-card.js   # Vanilla JS cards (public-transport-card, public-transport-mini-card) + editor
```

## Notes
- One config entry per stop; unique id `<provider key>_<mode>:<stop_id>` (provider key = provider id, or `gtfs:<dataset>`).
  Entry data keeps `line_names` for sensor names, and `network` (dataset id, name, GTFS and GTFS-RT URLs) for GTFS.
- Coordinators in hass.data[DOMAIN] are keyed by the provider key (`network_key(entry.data)`): one per GTFS network.
- GTFS: the parsed zip is shared by every provider instance (`_STATIC`, keyed by file path and mtime); the timetable of
  the followed stops is read in a second pass over stop_times (union of the stops asked so far).
- Field names of IDFM, TCL and CTS come from their documentation and community clients (Nov. 2026), not from captured
  answers: check them first if a network shows nothing.
- Logos: frontend/logos/<provider key with ":" as "-">.svg, exposed as the stop sensor's `logo` attribute.
- The coordinator has no config entry (shared): setup refreshes it when the stop is new, unload removes the stop and drops the coordinator when empty.
- STAR `precision`: "Temps réel" = real time, "Applicable" = timetable; a string in the bus dataset, a list in the metro one.
  Only bus passages have `departtheorique` (delay = depart − departtheorique). Alert `niveau`: list of labels
  (Mineure 1, Bloquante 2, Majeure 3) or a number 1-3. Field names checked against portal answers captured in Oct. 2026 and the dataset schemas.
- Stop step labels: bus lines (dessertes) + destinations of the coming passages (`destinations()`), to tell platforms apart.
- Card: countdown re-rendered every 15 s; approaching ≤ 2 min (scene `arriving`, pulsing countdown). Translations split at release (scripts/split-frontend.mjs).
