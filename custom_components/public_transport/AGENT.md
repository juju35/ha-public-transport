# Public Transport Integration — Agent Context

## Purpose
Home Assistant custom integration for the next departures at public transport stops, network by network
(providers). First network: STAR (Rennes Métropole) through data.explore.star.fr (Opendatasoft Explore API v2.1).
Ships its own Lovelace cards (`frontend/public-transport-card.js`), served by the integration itself.

## Architecture

```
custom_components/public_transport/
├── __init__.py        # Setup, card registration (Lovelace resources), refresh action, one coordinator per network in hass.data
├── coordinator.py     # NetworkCoordinator: departures of every stop of a network in one request; lines daily, alerts every 5 min; keeps the last data on failure (last_error)
├── providers/base.py  # Provider ABC, Stop / Line / Departure / Alert dataclasses, errors
├── providers/star.py  # STAR provider (passages, stops, dessertes, lines, alerts datasets)
├── config_flow.py     # Network (+ optional API key) → search → stop → lines; options (lines, scan_interval, max_departures, api_key)
├── entity.py          # Base entity: one service device per stop (config entry)
├── sensor.py          # Next departure per stop (card's source) and per followed line (timestamps)
├── binary_sensor.py   # Traffic alert per stop
├── diagnostics.py     # API key redacted
└── frontend/public-transport-card.js   # Vanilla JS cards (public-transport-card, public-transport-mini-card) + editor
```

## Notes
- One config entry per stop; unique id `<provider>_<mode>:<stop_id>`. Entry data keeps `line_names` for sensor names.
- The coordinator has no config entry (shared): setup refreshes it when the stop is new, unload removes the stop and drops the coordinator when empty.
- STAR `precision`: "Temps réel" = real time, "Applicable" = timetable; a string in the bus dataset, a list in the metro one.
  Only bus passages have `departtheorique` (delay = depart − departtheorique). Alert `niveau`: list of labels
  (Mineure 1, Bloquante 2, Majeure 3) or a number 1-3. Field names checked against portal answers captured in Oct. 2026 and the dataset schemas.
- Stop step labels: bus lines (dessertes) + destinations of the coming passages (`destinations()`), to tell platforms apart.
- Card: countdown re-rendered every 15 s; approaching ≤ 2 min (scene `arriving`, pulsing countdown). Translations split at release (scripts/split-frontend.mjs).
