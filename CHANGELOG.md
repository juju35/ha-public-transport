# Changelog

## 1.0.0 - 2026-11-13

### Features
- **Public Transport** integration (`public_transport`): next departures at your stops, one config entry per stop, set up in the UI (network, stop search, lines to follow) with options for the lines, the update interval, the departures kept and an optional API key.
- First network: **STAR** (bus and metro of Rennes Métropole) through its open data portal — real-time departures with their delay to the timetable, timetable-only departures marked as such, official line colors and traffic alerts.
- Networks are providers (`providers/`): one coordinator per network asks for every stop of that network in one request.
- Sensors: next departure per stop (with the coming departures, lines and alerts as attributes) and per followed line; traffic alert binary sensor per stop.
- `public_transport.refresh` action; diagnostics with the API key redacted.
- `custom:public-transport-card`, shipped with the integration: line badges, ticking countdown, real-time indicator, collapsible traffic alerts and an animated scene of the next departure (vehicle arriving, idling, real-time waves).
- `custom:public-transport-mini-card`: the next three departures of each stop, with a button to open the full card.
- 22 languages; in the release zip, the card keeps English and loads the other languages on demand.
