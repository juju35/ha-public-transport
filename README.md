# ha-public-transport

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-public-transport/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-public-transport/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-public-transport/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-public-transport/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-public-transport/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-public-transport/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-public-transport)](https://github.com/juju35/ha-public-transport/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-public-transport/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

<p align="center">
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/brand/icon.png" alt="Public Transport" width="96">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/star.svg" alt="STAR" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/idfm.svg" alt="Île-de-France Mobilités" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/tcl.svg" alt="TCL" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/cts.svg" alt="CTS" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-tisseo-reseau-transport-urbain-toulousain.png" alt="Tisséo" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-offres-de-services-bus-tram-et-scolaire-au-format-gtfs-netex-gtfs-rt-siri-lite.svg" alt="TBM" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-offre-de-transport-tam-en-temps-reel-gtfs-rt-urbain-et-suburbain.png" alt="TaM" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-reseau-de-transports-collectifs-naolib.svg" alt="Naolib" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-ilevia-localisation-des-arrets-bus-metro-et-tram-gtfs.svg" alt="ilévia" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-donnees-statiques-et-temps-reel-du-reseau-astuce-metropole-rouen-normandie.svg" alt="Astuce" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-donnees-statiques-et-dynamiques-du-reseau-de-transport-lignes-dazur.svg" alt="Lignes d'Azur" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-fil-bleu-syndicat-des-mobilites-gtfs-gtfs-rt.png" alt="Fil Bleu" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-reseau-de-transport-en-commun-lia-gtfs-siri.svg" alt="LiA" height="40">&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-angers-loire-metropole-reseau-irigo-gtfs-gtfs-rt-siri.svg" alt="Irigo" height="40">
</p>

Home Assistant integration for the **next departures at your public transport stops**: lines, direction, minutes left, real time or timetable, and traffic alerts — with its Lovelace cards included. Networks: **[STAR](https://www.star.fr)** (Rennes), **Île-de-France Mobilités** (Paris region), **TCL** (Lyon), **CTS** (Strasbourg), and **every network publishing GTFS-RT** on the French national access point [transport.data.gouv.fr](https://transport.data.gouv.fr) (Toulouse, Montpellier, Bordeaux, Nantes, Lille, Brest… and hundreds of smaller networks).

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-public-transport&category=integration)

| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/star.svg" alt="" height="20"> STAR | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/idfm.svg" alt="" height="20"> Île-de-France Mobilités | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/tcl.svg" alt="" height="20"> TCL |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card.png" alt="STAR card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-idfm.png" alt="Île-de-France Mobilités card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tcl.png" alt="TCL card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card.png" alt="STAR mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-idfm.png" alt="Île-de-France Mobilités mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tcl.png" alt="TCL mini card" width="300"> |

| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/cts.svg" alt="" height="20"> CTS | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-tisseo-reseau-transport-urbain-toulousain.png" alt="" height="20"> Tisséo | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-offres-de-services-bus-tram-et-scolaire-au-format-gtfs-netex-gtfs-rt-siri-lite.svg" alt="" height="20"> TBM |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-cts.png" alt="CTS card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tisseo.png" alt="Tisséo card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tbm.png" alt="TBM card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-cts.png" alt="CTS mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tisseo.png" alt="Tisséo mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tbm.png" alt="TBM mini card" width="300"> |

| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-offre-de-transport-tam-en-temps-reel-gtfs-rt-urbain-et-suburbain.png" alt="" height="20"> TaM | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-reseau-de-transports-collectifs-naolib.svg" alt="" height="20"> Naolib | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-ilevia-localisation-des-arrets-bus-metro-et-tram-gtfs.svg" alt="" height="20"> ilévia |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tam.png" alt="TaM card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-naolib.png" alt="Naolib card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-ilevia.png" alt="ilévia card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tam.png" alt="TaM mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-naolib.png" alt="Naolib mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-ilevia.png" alt="ilévia mini card" width="300"> |

| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-donnees-statiques-et-temps-reel-du-reseau-astuce-metropole-rouen-normandie.svg" alt="" height="20"> Astuce | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-donnees-statiques-et-dynamiques-du-reseau-de-transport-lignes-dazur.svg" alt="" height="20"> Lignes d'Azur | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-fil-bleu-syndicat-des-mobilites-gtfs-gtfs-rt.png" alt="" height="20"> Fil Bleu |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-astuce.png" alt="Astuce card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lignesdazur.png" alt="Lignes d'Azur card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-filbleu.png" alt="Fil Bleu card" width="400"> |
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-astuce.png" alt="Astuce mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lignesdazur.png" alt="Lignes d'Azur mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-filbleu.png" alt="Fil Bleu mini card" width="300"> |

| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-reseau-de-transport-en-commun-lia-gtfs-siri.svg" alt="" height="20"> LiA | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/custom_components/public_transport/frontend/logos/gtfs-angers-loire-metropole-reseau-irigo-gtfs-gtfs-rt-siri.svg" alt="" height="20"> Irigo | |
|---|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lia.png" alt="LiA card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-irigo.png" alt="Irigo card" width="400"> | |
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lia.png" alt="LiA mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-irigo.png" alt="Irigo mini card" width="300"> | |

## Features

- **Stops set up in the UI**: pick the network, search the stop by name, choose the lines to follow — no YAML, no stop code to look up
- **Next departure** sensor per stop (timestamp), with the coming departures, the lines and their colors, and the alerts as attributes
- **Line** sensor per followed line: its next departure, destination, real time or not, delay
- **Traffic alert** binary sensor per stop, on while an alert concerns one of its lines
- **Real time or timetable**, for each departure: real-time times come with their delay to the timetable; timetable-only times are marked like the `*` of the stop displays
- **Hundreds of networks**: a generic GTFS / GTFS-RT provider searches the national catalogue by city or network name, downloads the timetable once a day and corrects it with the real-time feed
- **Network logo** in the card header, when the integration ships one
- **One request per network**: every stop of a network is updated at once, so following more stops costs no more of the open data quota
- `public_transport.refresh` action to update now
- `custom:public-transport-card` card, **shipped with the integration** and loaded automatically: line badges in the official colors, countdown that ticks by itself, real-time indicator, collapsible traffic alerts, and an **animated scene** of the next departure (the bus or the train drives in when it is close)
- `custom:public-transport-mini-card` compact card: the next three departures of each stop, with a button to open the full card
- Diagnostics download with the API key redacted
- English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek

## Supported networks

| Network | Area | Modes | Real time | Alerts | Data |
|---|---|---|---|---|---|
| [STAR](https://www.star.fr) | Rennes Métropole (France) | Bus, metro (lines a and b) | Yes, with the timetable delay (bus) | Yes, with their level (information, disruption, major disruption) | [data.explore.star.fr](https://data.explore.star.fr) (ODbL), no key needed |
| [Île-de-France Mobilités](https://www.iledefrance-mobilites.fr) | Île-de-France | Metro, RER, Transilien, tram, bus | Yes, with the timetable delay | Yes (general messages of the lines followed) | [PRIM](https://prim.iledefrance-mobilites.fr) (SIRI Lite) + IDFM open data, **free PRIM key required** |
| [TCL](https://www.tcl.fr) | Lyon | Metro, funicular, tram, bus | Yes (estimated or timetable) | Yes | [data.grandlyon.com](https://data.grandlyon.com), **free account required** (key typed as `login:password`) |
| [CTS](https://www.cts-strasbourg.eu) | Strasbourg | Tram, bus | Yes (real time or timetable) | Yes | [api.cts-strasbourg.eu](https://www.cts-strasbourg.eu/fr/portail-open-data/) (SIRI 2.0), **free token required** |
| **GTFS-RT** | Any network of [transport.data.gouv.fr](https://transport.data.gouv.fr) with a GTFS-RT feed | All (from the GTFS route types) | Yes: trip updates (delays, cancelled trips, skipped stops, extra trips) | When the network publishes service alerts | GTFS + GTFS-RT of the national access point (licences vary by network, mostly ODbL or Licence Ouverte) |

Through GTFS-RT: Toulouse (Tisséo), Montpellier (TaM), Bordeaux (TBM), Nantes (Naolib), Lille (Ilévia), Rouen (Astuce), Nice (Lignes d'Azur), Tours (Fil Bleu), Le Havre (LiA), Angers (Irigo), Brest (Bibus), and many smaller networks — any dataset of the catalogue with both a GTFS file and a GTFS-RT feed. More networks can be added as providers: see [Adding a network](#adding-a-network).

## Prerequisites

- Home Assistant 2024.12 or later
- Internet access to the network's open data portal

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-public-transport&category=integration)

Then click **Install** and restart Home Assistant.

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-public-transport` — Type: **Integration**
3. Open **Public Transport** and click **Install**
4. Restart Home Assistant

The cards are **part of the integration**: at startup they are added to the dashboard resources (`/public_transport_static/public-transport-card.js`, module). After an install or an update, restart Home Assistant and refresh the browser (clear the companion app cache if needed).

If your dashboards are in YAML mode, the cards are loaded on every page without going through the resources.

### Manual

Copy `custom_components/public_transport/` to `/config/custom_components/public_transport/`, then restart Home Assistant.

## Configuration

### Integration

[![Add integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=public_transport)

**Settings → Devices & services → Add integration → Public Transport**, then:

1. **Network**: STAR, Île-de-France Mobilités, TCL, CTS, or **GTFS-RT** for any other network. STAR works without a key; IDFM (PRIM key), TCL (`login:password` of a data.grandlyon.com account) and CTS (open data token) need their free key.
   - **GTFS-RT**: type a city or a network name (`Toulouse`, `Tisséo`…), choose the network in the list, and wait while its timetable is downloaded and read (up to a minute for a big network).
2. **Stop**: type part of its name (`Républ`, `Gares`…).
3. **Choose the stop**: stops of the same name are the platforms of each direction; the bus lines serving each one and the destinations of its next departures (→) are listed after its name, so you can tell them apart (a metro station has one platform per direction).
4. **Lines**: all the lines serving the stop are selected; keep the ones you take.

Add the integration again for each stop. Each stop is a device with its own sensors.

Options (**Configure** button):

| Option | Default | Description |
|---|---|---|
| Lines | the lines chosen | Lines followed at this stop; each one has its own sensor |
| Update interval | 60 s | 30 s to 10 min. All the stops of a network are updated in one request, at the shortest interval of its stops |
| Departures kept | 6 | Coming departures in the stop sensor's attributes, which the card shows |
| API key | none | Required by IDFM, TCL and CTS; for STAR, it only raises the daily quota of the open data API (free account on data.explore.star.fr) |

### Entities

For a stop named *République*:

| Entity | State | Main attributes |
|---|---|---|
| `sensor.star_republique_next_departure` | Next departure on the followed lines (timestamp) | `departures` (line, colors, destination, departure, scheduled, delay, realtime), `lines`, `alerts`, `stop_name`, `mode`, `network`, `stale`, `last_error` |
| `sensor.star_republique_line_c4` | Next departure of line C4 (timestamp) | `destination`, `realtime`, `delay`, `color`, `next_departures` |
| `binary_sensor.star_republique_traffic_alert` | `on` while an alert concerns a followed line | `level` (1 to 3), `alerts` |

The timestamp states work as they are in automations and in the standard cards (`Next departure: in 4 minutes`):

```yaml
triggers:
  - trigger: template
    value_template: >
      {{ states('sensor.star_republique_line_c4') not in ['unknown', 'unavailable']
         and (as_datetime(states('sensor.star_republique_line_c4')) - now()).total_seconds() < 300 }}
actions:
  - action: notify.mobile_app_phone
    data:
      message: "C4 to {{ state_attr('sensor.star_republique_line_c4', 'destination') }} in 5 minutes"
```

### Refresh action

```yaml
action: public_transport.refresh
data:
  config_entry_id: 01J...   # optional: only the network of this stop
```

Errors are translated in the Home Assistant language.

### Card types

| Type | Description |
|---|---|
| `custom:public-transport-card` | Full card: animated scene of the next departure, departures of each stop, traffic alerts |
| `custom:public-transport-mini-card` | Compact card: the next three departures of each stop; the button at the top right opens the full card in place, a click outside folds it back |

### Visual editor

Add the **Public transport** card from the card picker: every option is set in the visual editor.

### Minimal

```yaml
type: custom:public-transport-card
```

Without `entities`, the card shows every stop of the integration.

### Full options

```yaml
type: custom:public-transport-card
entities:
  - sensor.star_republique_metro_next_departure
  - sensor.star_republique_next_departure
title: To work
show_title: true
show_scene: true
show_alerts: true
show_refresh: true
max_departures: 5
time_format: relative
language: en
```

### Options reference

| Option | Default | Description |
|---|---|---|
| `entities` | every stop | Stop sensors (`sensor.*_next_departure`) to show, in this order; line sensors (`sensor.*_line_*`) work too |
| `title` | `Next departures` | Card title |
| `show_title` | `true` | Show the title in the header (e.g. `false` under a section heading of your own) |
| `show_scene` | `true` | Show the animated scene of the next departure (first stop) |
| `show_alerts` | `true` | Show the traffic alerts (and their count in the header) |
| `show_refresh` | `true` | Show the refresh button |
| `max_departures` | `5` | Departures shown per stop (up to the integration's *Departures kept*) |
| `time_format` | `relative` | `relative`: countdown (`4 min`, `Now`), clock time from an hour; `absolute`: always the clock time |
| `language` | Auto | Force language: `en`, `fr`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings) |

The mini card takes the same options; `show_scene` and `max_departures` apply to its full view.

## Screenshots

### Animations

Each animation of the card, in the light and dark themes.

**The next departure is close** (2 minutes or less): the bus, in its line color, drives in to the stop and stops at the sign; waves rise from the sign while the time is real time, and the countdown pulses.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/arriving.gif" alt="bus arriving" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/arriving-dark.gif" alt="bus arriving dark" width="400"> |

**At a metro station**, the train glides in along the rails.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/arriving-metro.gif" alt="metro arriving" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/arriving-metro-dark.gif" alt="metro arriving dark" width="400"> |

**The next departure is a few minutes away**: the bus idles before the stop, engine running.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/waiting.gif" alt="bus waiting" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/waiting-dark.gif" alt="bus waiting dark" width="400"> |

**Major disruption**: the alert sign shakes (a lesser alert only pulses).

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/alerts.gif" alt="major alert" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/alerts-dark.gif" alt="major alert dark" width="400"> |

**Refreshing**: the refresh button spins until the update is done.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/refreshing.gif" alt="refreshing" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/refreshing-dark.gif" alt="refreshing dark" width="400"> |

All animations stop when the system asks for reduced motion.

### Cards

A bus stop: the next departure with its scene, then the coming departures — line badge in the official colors, destination, delay, real time (waves) or timetable (clock) — and the folded traffic alerts.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card.png" alt="card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-dark.png" alt="card dark" width="400"> |

Two stops (the metro station and the bus stop of the same name), with the traffic alerts unfolded: level, lines concerned, validity and a link to the network's page.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-alerts.png" alt="card with alerts" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-alerts-dark.png" alt="card with alerts dark" width="400"> |

The mini card: the next three departures of each stop.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card.png" alt="mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-dark.png" alt="mini card dark" width="300"> |

### Networks

One stop of each network, with its logo, its lines in their official colors and real destinations (GTFS-RT networks show the dataset title of the national catalogue as network name).

| Network | Light | Dark |
|---|---|---|
| **Île-de-France Mobilités** — Châtelet, metro | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-idfm.png" alt="Île-de-France Mobilités card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-idfm.png" alt="Île-de-France Mobilités mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-idfm-dark.png" alt="Île-de-France Mobilités card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-idfm-dark.png" alt="Île-de-France Mobilités mini card dark" width="300"> |
| **TCL** — Bellecour, metro | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tcl.png" alt="TCL card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tcl.png" alt="TCL mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tcl-dark.png" alt="TCL card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tcl-dark.png" alt="TCL mini card dark" width="300"> |
| **CTS** — Homme de Fer, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-cts.png" alt="CTS card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-cts.png" alt="CTS mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-cts-dark.png" alt="CTS card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-cts-dark.png" alt="CTS mini card dark" width="300"> |
| **Tisséo** — Capitole, metro and Linéo | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tisseo.png" alt="Tisséo card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tisseo.png" alt="Tisséo mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tisseo-dark.png" alt="Tisséo card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tisseo-dark.png" alt="Tisséo mini card dark" width="300"> |
| **TBM** — Hôtel de Ville, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tbm.png" alt="TBM card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tbm.png" alt="TBM mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tbm-dark.png" alt="TBM card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tbm-dark.png" alt="TBM mini card dark" width="300"> |
| **TaM** — Comédie, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tam.png" alt="TaM card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tam.png" alt="TaM mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-tam-dark.png" alt="TaM card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-tam-dark.png" alt="TaM mini card dark" width="300"> |
| **Naolib** — Commerce, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-naolib.png" alt="Naolib card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-naolib.png" alt="Naolib mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-naolib-dark.png" alt="Naolib card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-naolib-dark.png" alt="Naolib mini card dark" width="300"> |
| **ilévia** — Gare Lille Flandres, metro | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-ilevia.png" alt="ilévia card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-ilevia.png" alt="ilévia mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-ilevia-dark.png" alt="ilévia card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-ilevia-dark.png" alt="ilévia mini card dark" width="300"> |
| **Astuce** — Théâtre des Arts, metro | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-astuce.png" alt="Astuce card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-astuce.png" alt="Astuce mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-astuce-dark.png" alt="Astuce card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-astuce-dark.png" alt="Astuce mini card dark" width="300"> |
| **Lignes d'Azur** — Jean Médecin, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lignesdazur.png" alt="Lignes d'Azur card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lignesdazur.png" alt="Lignes d'Azur mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lignesdazur-dark.png" alt="Lignes d'Azur card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lignesdazur-dark.png" alt="Lignes d'Azur mini card dark" width="300"> |
| **Fil Bleu** — Jean Jaurès, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-filbleu.png" alt="Fil Bleu card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-filbleu.png" alt="Fil Bleu mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-filbleu-dark.png" alt="Fil Bleu card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-filbleu-dark.png" alt="Fil Bleu mini card dark" width="300"> |
| **LiA** — Hôtel de Ville, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lia.png" alt="LiA card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lia.png" alt="LiA mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-lia-dark.png" alt="LiA card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-lia-dark.png" alt="LiA mini card dark" width="300"> |
| **Irigo** — Ralliement, tram | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-irigo.png" alt="Irigo card" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-irigo.png" alt="Irigo mini card" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/card-irigo-dark.png" alt="Irigo card dark" width="360"><br><img src="https://raw.githubusercontent.com/juju35/ha-public-transport/main/screenshots/mini-card-irigo-dark.png" alt="Irigo mini card dark" width="300"> |

## How it works

Each config entry is one stop. The entries of the same network share one coordinator: it asks the network for the departures of all their stops in a single request (one per mode for STAR, bus and metro being separate datasets), at the shortest update interval among them. Line names and colors are fetched once a day, traffic alerts every 5 minutes.

When an update fails (quota reached, timeout, server error), the sensors keep the last departures — without those already gone — and flag them with their `stale` (`true`) and `last_error` attributes; the card says the network is unreachable. Only a failed first update leaves the stop to be set up again later.

The card reads the stop sensors and counts the minutes down every 15 seconds by itself, between two updates. A departure 2 minutes away or less is *approaching*: the countdown pulses and the scene shows the vehicle arriving.

### STAR open data

| Dataset | Used for |
|---|---|
| `tco-bus-circulation-passages-tr`, `tco-metro-circulation-passages-tr` | Coming departures, and their destinations in the stop list; `precision` *Temps réel* (real time) or *Applicable* (timetable); the timetable time (delay) for the bus only |
| `tco-bus-topologie-pointsarret-td`, `tco-metro-topologie-pointsarret-td` | Stop search |
| `tco-bus-topologie-dessertes-td` | Lines serving each bus stop |
| `tco-bus-topologie-lignes-td`, `tco-metro-topologie-lignes-td` | Line names and official colors |
| `tco-busmetro-trafic-alertes-tr` | Traffic alerts; their level (*Mineure*, *Bloquante*, *Majeure*) gives 1 to 3 |

The portal's API works without a key; a key (free account) only raises the daily quota.

### GTFS-RT networks

The catalogue is the [transport.data.gouv.fr API](https://transport.data.gouv.fr/api/datasets): a network is offered when its dataset has a GTFS file and a GTFS-RT feed with trip updates.

- The GTFS zip is downloaded into `.storage/public_transport/` and refreshed once a day (conditional request); it is read in the background, keeping the stops, routes, trips, calendars and only the timetable of the followed stops.
- Departures are the timetable of the next 3 hours, corrected by the GTFS-RT trip updates: times or delays (propagated to the following stops), cancelled trips and skipped stops removed, extra trips added. When the real-time feed fails, the timetable is still shown, marked as such.
- Alerts come from the service alerts feed, when there is one; an alert on a stop concerns the lines serving it.
- The GTFS-RT protocol buffers are read by a small built-in decoder: no extra dependency.

### Île-de-France Mobilités, TCL and CTS

| Network | Departures | Stops and lines | Alerts |
|---|---|---|---|
| IDFM | PRIM `stop-monitoring` (one request per stop; 1,000,000 a day) | `arrets-lignes`, `referentiel-des-lignes` (official colors) | PRIM `general-message`, for the lines seen at the followed stops |
| TCL | `tcl_sytral.tclpassagearret` (one request per stop) | `tcl_sytral.tclarret` (lines from `desserte`) | `tcl_sytral.tclalertetrafic_2` |
| CTS | SIRI `stop-monitoring` (one request per stop) | `stoppoints-discovery`, `lines-discovery` (official colors) | SIRI `general-message` |

### Network logos

The card shows the network's logo in its header when the integration ships `frontend/logos/<network>.svg` (or `.png`) (`star`, `idfm`, `tcl`, `cts`; a GTFS-RT network as `gtfs-<dataset>.svg`) and every stop of the card belongs to that network; otherwise it keeps its icon. Shipped: STAR, CTS and TCL (Wikimedia Commons), Île-de-France Mobilités ([Simple Icons](https://simpleicons.org), CC0), Tisséo, TaM, Fil Bleu (Wikimedia Commons, PNG), TBM, Naolib, ilévia, Astuce, Lignes d'Azur, LiA, Irigo (Wikimedia Commons). The logos remain the trademarks of their networks.

### Adding a network

A network is a class of `custom_components/public_transport/providers/` deriving from `Provider` (`providers/base.py`) and registered in `providers/__init__.py`. It implements:

| Method | Returns |
|---|---|
| `search_stops(query)` | Stops matching a name |
| `lines_at_stop(stop)` | Lines serving a stop |
| `lines()` | Every line, with its colors |
| `departures(stops)` | Coming departures of several stops, in as few requests as the API allows |
| `alerts()` | Current traffic alerts (optional) |

The config flow, sensors and cards then work unchanged. A provider that serves many networks sets `needs_network` (the config flow asks which one, see `providers/gtfs.py`); one whose API needs a key sets `api_key_mode = "required"`. Contributions for other networks are welcome.

## Development

```bash
pip install -r requirements_test.txt && pytest
npm install && npm test          # card tests (node --test)
npm run build                    # checks the translation split the release makes
pip install playwright pillow && playwright install chromium
python scripts/screenshots.py    # renders the stills and every animation GIF (needs ffmpeg) into screenshots/
```

Python tests live in `tests/` (pytest, every API answer mocked: no network needed); the card's JavaScript tests live in `test/`.

### Releasing

1. Bump the version in `custom_components/public_transport/manifest.json`, `TRANSPORT_CARD_VERSION` in the card and `package.json`
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-public-transport/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow creates the tag and the GitHub release with the changelog section as notes

## Translations

The integration and the cards follow the language of Home Assistant (the card's `language` option can force another one). In the release, the card file keeps English only; each other language is a small file next to it, loaded when needed. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (Portugal) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Brazilian Portuguese (`pt-BR`): pt-BR uses the European Portuguese texts, in the integration and the cards.

Contributions for additional languages are welcome!

## Credits

Departures, lines and alerts: [STAR open data](https://data.explore.star.fr) (Rennes Métropole / Keolis Rennes), under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/); [Île-de-France Mobilités](https://prim.iledefrance-mobilites.fr) (PRIM and open data); [data.grandlyon.com](https://data.grandlyon.com) (SYTRAL Mobilités / TCL); [CTS](https://www.cts-strasbourg.eu/fr/portail-open-data/); the networks of [transport.data.gouv.fr](https://transport.data.gouv.fr), each under its own licence. Network logos: [Wikimedia Commons](https://commons.wikimedia.org) and [Simple Icons](https://simpleicons.org), trademarks of their owners.

## License

[MIT](https://github.com/juju35/ha-public-transport/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
