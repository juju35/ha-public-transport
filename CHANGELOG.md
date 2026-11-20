# Changelog

## 1.7.1 - 2026-11-20

### Fixes
- The list of stops starting with Home Assistant is dropped once it runs (it was kept in memory for nothing).

### Maintenance
- Tests: the card resource moved to a new version and its duplicates removed, the fallback when the resources cannot be edited, an unreachable real-time feed, and the feed decoder on damaged data.

## 1.7.0 - 2026-11-20

### Features
- STAR bike stations and park-and-rides: the options of a STAR stop list the bike-share stations and park-and-rides nearest first (within 3 km, distance shown) to follow with it. Each one gets a sensor (bikes available, free spaces) with its free docks or free spaces by type (disabled, electric, car-pool), and the stop sensor lists them in a `nearby` attribute. They are fetched with the departures, only while one is followed.
- Card: *Around the stop* strip (option `show_nearby`, also in the visual editor) with one pill per station — bikes or free spaces, green, amber when few are left, red when none — and its detail on tap.

## 1.6.4 - 2026-11-20

### Fixes
- The status pill is placed from the card's first frame: it was measured before Home Assistant's `<ha-card>` had laid out its content (0 px wide), so for a frame it showed on the wrong line (under the title, or beside it when it belongs under it), sometimes changing the card's height, before jumping to its place. It is now fitted once the card is drawn.
- Card: folding back on a tap elsewhere now works on iOS (Safari and the companion app): a tap on something that is not clickable sent no click to the page, so the unfolded sections and the mini card's detail view stayed open. The press and the release are caught instead; a scroll does not fold anything, and keyboard clicks still work.
- Card: leaving the page (another dashboard view, a conditional card hidden) folds the sections and the mini card's detail view back.
- Card: the 15-second clock tick no longer rewrites a card whose content did not change, which restarted the banner's animations.
- Card: a state update patches the card in place instead of drawing it again — the banner's picture, the network logo and their animations keep their nodes, an unfolded section stays as it is, and the card keeps its height: a re-created card is laid out again, which can make the dashboard jump (scroll anchoring). Updates of other entities still touch nothing.

### Maintenance
- The commit-msg hook works again (the commitlint config is an ES module, as `package.json` declares).

## 1.6.3 - 2026-11-19

### Fixes
- Start: the stops of one network set up together wait for each other before their first update, whatever order Home Assistant sets them up in (the stops expected are taken when the integration starts), so the timetable is read once for all of them.

## 1.6.2 - 2026-11-19

### Performance
- **Faster start**: the stops no longer hold Home Assistant's start while their network's timetable is read — they are set up at once and their first departures are fetched in the background (the entities are unavailable until then; a network down at start no longer retries the setup, the polling reaches it).
- **GTFS networks** (transport.data.gouv.fr, e.g. the national SNCF timetable): the parsed timetable is kept on disk next to the zip and read back at the next start in a fraction of a second, until a new timetable is downloaded; the followed stops' timetable is read in the same pass over `stop_times.txt` instead of a second one.
- Several stops of one network starting together share a single reading of the timetable and a single first update.

## 1.6.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.6.0 - 2026-11-17

### Features
- **Illustrated header, harmonized with the other cards**: both cards now open on a 90px banner (the mini card too) — the stop's name or the next departure on the sky at the left, a city stop at the right (buildings, the platform, the stop's display with the line and its countdown, and the bus, metro or tram in its line color), over a 10px road or rail strip running edge to edge, with day and night variants.
- **Status at a glance**: the round icon is green when the next departure is on time, amber when it runs late (2 min or more), red when the stop is disrupted (a disruption alert, stale or unavailable data) and grey with nothing announced; the stop's display adds an amber `+n'` tag or a red warning sign, blinks `▶` when the vehicle is at the stop and shows `--` with no departure.
- **`illustration_theme`** option (`auto`, `day`, `night`, also in the visual editor) to force the banner's day or night picture; `illustration: false` keeps a classic header, like `show_scene: false`.
- **Status pill** on the banner's title row, after the stop's name (full card) or the line and destination (mini card), with a dot in the icon's colour: Real time or Timetable, the delay (`+n min`, then not repeated under it), Disruption / Major disruption, Offline or No departure. It stays there only when the whole name (or line and destination) and its whole label fit (the name is never cut for it), else it takes a line of its own under the other lines (kept to one line); when even that does not fit in the banner, and on cards 200 px wide or less, only its dot stays. Measured on the rendered banner, so it holds in every language. The header buttons (refresh, expand / collapse) are 24 px frosted rounds on one line in the top right corner, and the text keeps clear of them. New label translated into the 22 languages.
- Night picture with the dark theme even while the sun is up (it used to wait for sunset when `sun.sun` exists).

### Documentation
- README: screenshots of the mini card expanded to the full card, light and dark.

## 1.5.0 - 2026-11-16

### Features
- **Board redesign of both cards**, in the style of the flight and train board cards: an illustrated banner with the stop's name, its number of departures and share of real time, and a street scene whose bus, metro or tram (line color and number) drives in and stops when it is close; the road or the track runs under the whole banner, with a night picture after sunset.
- **Next departure block** on the full card: line, destination, real time, the timetable time struck through, a big countdown with its state, and an **approach bar** where the vehicle reaches the stop as the countdown runs out.
- **Tabs** when the card shows several stops (*All*, then one per mode or stop), then the following departures — countdown, line badge, destination with its next times, and a state pill (approaching, delay, real time or timetable).
- **Mini card**: the banner now tells the next departure of all its stops (line, destination, countdown, real time, delay and the timetable time struck through), with its approach bar.

## 1.4.0 - 2026-11-15

### Features
- **Train number on departures**: the GTFS carries the run's own number (SNCF `trip_short_name`, or `trip_headsign` when it is a bare number). It is now kept and exposed as the `train_number` attribute of each departure, distinct from the line code.

## 1.3.5 - 2026-11-15

### Fixes
- **Network-wide alerts capped per stop**: some networks (SNCF) broadcast every regional disruption network-wide, with no line in the feed, so a single stop inherited hundreds of them. Alerts on a followed line are always kept; the network-wide ones are now capped (the gravest first).

## 1.3.4 - 2026-11-15

### Features
- **Bibus logo**: the Brest network (Bibus), reachable through the generic GTFS-RT provider, now ships its logo on the card and in the README.

## 1.3.3 - 2026-11-15

### Features
- **SNCF logo**: the national SNCF network (TGV, Intercités, TER — `horaires-sncf`), reachable through the generic GTFS-RT provider, now ships its logo on the card.

## 1.3.2 - 2026-11-15

### Fixes
- **GTFS destinations**: on feeds that carry the train number in the trip headsign (notably the SNCF TGV INOUI export), departures showed an opaque number ("8719") instead of a place. A headsign that is empty or a bare number now falls back to the trip's terminus (a real station name); the same applies to extra real-time trips and to the destination hints shown in the configuration form.

## 1.3.1 - 2026-11-15

### Removed
- **SNCF provider**: removed. It relied on a Navitia/SNCF API key that can no longer be obtained through self-service (the SNCF developer-token page is gone and Navitia's free token is no longer issued), so the provider was unusable for new users. The optional `code`/`platform` departure fields and the card's train rendering added for it are reverted. SNCF national trains remain reachable through the generic GTFS-RT provider (transport.data.gouv.fr).

## 1.3.0 - 2026-11-15

### Features
- **SNCF national trains** (TGV, OUIGO, Intercités, TER, Transilien, RER): a new `sncf` provider reads the SNCF/Navitia API (`api.sncf.com`) and gives the departures board of a station — the coming trains with their commercial mode as badge, destination, train number, real-time delay to the timetable, and the disruptions impacting them. A free SNCF API key is required. Replaces the unmaintained `train_traveler`; also usable by `ha-train-board-card`.
- The cards show a train scene and, for each departure, the train number and platform (voie) when the network provides them.

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
