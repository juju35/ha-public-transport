# Changelog

## 1.2.0 - 2026-11-14

### Features
- **Departures board**: both cards group the departures by line and destination, one row each with its next times in aligned columns (three in the full card, two in the mini card), the first one bold; the delay is written under the destination. `max_departures` now counts these rows.
- **Full card**: every stop has its animated scene (not only the first one); the countdown of a late or early departure shows the timetable time it replaces, struck through.
- **Mini card**: the animated scene of the next departure of all its stops, then up to three rows per stop; its header chip is reduced to the alert sign and count (or the status dot) so the title stays readable.

## 1.1.0 - 2026-11-13

### Features
- **GTFS-RT networks**: every network of transport.data.gouv.fr with a GTFS timetable and a GTFS-RT feed (Toulouse, Montpellier, Bordeaux, Nantes, Lille, Brest… and hundreds of smaller ones). The network is searched by city or name in the national catalogue; its timetable is downloaded once a day, read in the background and corrected by the trip updates (delays, cancelled trips, skipped stops, extra trips); service alerts when published. Built-in GTFS-RT reader, no new dependency.
- **Île-de-France Mobilités** (PRIM key): metro, RER, Transilien, tram and bus, with official line colors and the general messages of the lines followed.
- **TCL** (Lyon, data.grandlyon.com account) and **CTS** (Strasbourg, open data token).
- Network logo in the card header (`logo` attribute of the stop sensor), when the integration ships one.
- The config flow asks for the key of the networks that need one.

### Fixes
- `biome.json` schema aligned with the Biome version of the pre-commit hook.

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
