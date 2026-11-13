"""Render the public transport cards with mock departures and save the README screenshots and animations.

Usage: python scripts/screenshots.py  (needs `pip install playwright pillow`, `playwright install chromium` and ffmpeg;
CHROMIUM_PATH=/path/to/chrome to use another browser)
A screenshot is rewritten only when its decoded pixels change, so a re-render never commits identical images.
The clock is frozen on 13 November 2026, 08:00 in Paris, so countdowns and dates stay the same.
"""

import base64
import json
import os
import shutil
import subprocess
import tempfile
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARD_JS = (ROOT / "custom_components/public_transport/frontend/public-transport-card.js").read_text()
NOW = datetime.fromisoformat("2026-11-13T08:00:00+01:00")
WIDTH = 420

THEMES = {
    "light": {
        "--primary-background-color": "#e8eaed",
        "--secondary-background-color": "#ececec",
        "--card-background-color": "#ffffff",
        "--primary-text-color": "#212121",
        "--secondary-text-color": "#727272",
        "--divider-color": "rgba(0,0,0,.12)",
    },
    "dark": {
        "--primary-background-color": "#111111",
        "--secondary-background-color": "#282828",
        "--card-background-color": "#1c1c1c",
        "--primary-text-color": "#e1e1e1",
        "--secondary-text-color": "#9b9b9b",
        "--divider-color": "rgba(225,225,225,.12)",
    },
}
COMMON = {
    "--primary-color": "#03a9f4",
    "--info-color": "#039be5",
    "--success-color": "#43a047",
    "--warning-color": "#ffa600",
    "--error-color": "#db4437",
    "--disabled-text-color": "#9e9e9e",
}

# Minimal stand-in for Home Assistant's <ha-card> (the cards draw their own icons).
HA_ELEMENTS = """
customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});
"""

LINES = {
    "C4": ("#e5007d", "#ffffff"),
    "11": ("#3e9d44", "#ffffff"),
    "C1": ("#f39200", "#ffffff"),
    "a": ("#e3051b", "#ffffff"),
    "b": ("#00893e", "#ffffff"),
}


def dep(line, minutes, destination, *, realtime=True, delay=0, colors=None):
    color, text = (colors or LINES)[line]
    when = NOW + timedelta(minutes=minutes, seconds=20)
    return {
        "line_id": line,
        "line": line,
        "color": color,
        "text_color": text,
        "destination": destination,
        "departure": when.isoformat(),
        "scheduled": (when - timedelta(minutes=delay)).isoformat() if realtime else None,
        "delay": delay if realtime else None,
        "realtime": realtime,
    }


ALERTS = [
    {
        "id": "P1",
        "title": "Line C4: stop République moved",
        "description": "Because of works, the stop is moved 50 m towards Quai Lamartine until the end of the month.",
        "level": 2,
        "lines": ["C4"],
        "start": (NOW - timedelta(days=3)).isoformat(),
        "end": (NOW + timedelta(days=17)).isoformat(),
        "url": "https://www.star.fr/se-deplacer/info-trafic",
    },
    {
        "id": "P2",
        "title": "Line 11 diverted on Saturday",
        "description": "Market day: line 11 does not serve Place des Lices from 7:00 to 14:00.",
        "level": 1,
        "lines": ["11"],
        "start": (NOW + timedelta(days=1)).isoformat(),
        "end": (NOW + timedelta(days=1, hours=7)).isoformat(),
        "url": None,
    },
]
MAJOR = [{**ALERTS[0], "id": "P3", "title": "Metro line a interrupted", "level": 3, "lines": ["a"]}]


LOGOS = ROOT / "custom_components/public_transport/frontend/logos"


def logo(name):
    """A network logo of the integration as a data URL (the page has no server to fetch it from)."""
    path = LOGOS / name
    mime = "image/svg+xml" if path.suffix == ".svg" else "image/png"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"


def stop(
    entity, name, mode, departures, alerts=(), *, provider="star", network="STAR", city="Rennes", logo_file="star.svg"
):
    return {
        "entity_id": entity,
        "state": departures[0]["departure"] if departures else "unknown",
        "attributes": {
            "config_entry_id": entity,
            "provider": provider,
            "network": network,
            "logo": logo(logo_file),
            "stop_id": "1201",
            "stop_name": name,
            "stop_city": city,
            "mode": mode,
            "departures": departures,
            "alerts": list(alerts),
            "stale": False,
            "device_class": "timestamp",
        },
    }


BUS = [
    dep("C4", 4, "ZA Saint-Sulpice", delay=2),
    dep("11", 7, "Gaité", realtime=False),
    dep("C4", 12, "ZA Saint-Sulpice"),
    dep("C1", 16, "Chantepie Rosa Parks"),
    dep("11", 27, "Gaité", realtime=False),
]
METRO = [dep("a", 1, "J.F. Kennedy"), dep("a", 4, "La Poterie"), dep("b", 6, "Cesson Viasilva")]

STATES = {
    "sensor.star_republique_next_departure": stop(
        "sensor.star_republique_next_departure", "République", "bus", BUS, ALERTS
    ),
    "sensor.star_republique_metro_next_departure": stop(
        "sensor.star_republique_metro_next_departure", "République", "metro", METRO
    ),
    "sensor.star_arriving_next_departure": stop(
        "sensor.star_arriving_next_departure", "République", "bus", [dep("C4", 1, "ZA Saint-Sulpice"), *BUS[1:]]
    ),
    "sensor.star_metro_major_next_departure": stop(
        "sensor.star_metro_major_next_departure", "Charles de Gaulle", "metro", METRO, MAJOR
    ),
}
BUS_STOP = ["sensor.star_republique_next_departure"]


def alert(alert_id, title, description, lines, *, level=2, days=(-2, 5)):
    return {
        "id": alert_id,
        "title": title,
        "description": description,
        "level": level,
        "lines": lines,
        "start": (NOW + timedelta(days=days[0])).isoformat(),
        "end": (NOW + timedelta(days=days[1])).isoformat(),
        "url": None,
    }


# One stop of each other network, with its real lines, official colors (as published) and destinations.
NETWORKS = {
    "idfm": {
        "network": "Île-de-France Mobilités",
        "provider": "idfm",
        "logo": "idfm.svg",
        "city": "Paris",
        "stop": "Châtelet",
        "mode": "metro",
        "colors": {"1": ("#ffcd00", "#000000"), "14": ("#62259d", "#ffffff"), "4": ("#be418d", "#ffffff")},
        "departures": [
            ("1", 1, "La Défense", 1),
            ("14", 2, "Aéroport d'Orly", 0),
            ("1", 3, "Château de Vincennes", 0),
            ("4", 4, "Bagneux–Lucie Aubrac", 2),
            ("14", 5, "Saint-Denis Pleyel", 0),
            ("4", 7, "Porte de Clignancourt", 0),
        ],
        "alerts": [
            alert("I1", "Line 4: reduced service after 22:00", "Works between Montparnasse and Bagneux.", ["4"])
        ],
    },
    "tcl": {
        "network": "TCL",
        "provider": "tcl",
        "logo": "tcl.svg",
        "city": "Lyon",
        "stop": "Bellecour",
        "mode": "metro",
        "colors": {"A": ("#ec1c24", "#ffffff"), "D": ("#00a651", "#ffffff")},
        "departures": [
            ("A", 2, "Vaulx-en-Velin La Soie", 0),
            ("D", 3, "Gare de Vénissieux", 0),
            ("A", 5, "Perrache", 0),
            ("D", 6, "Gare de Vaise", 1),
            ("A", 8, "Vaulx-en-Velin La Soie", 0),
        ],
        "alerts": [],
    },
    "cts": {
        "network": "CTS",
        "provider": "cts",
        "logo": "cts.svg",
        "city": "Strasbourg",
        "stop": "Homme de Fer",
        "mode": "tram",
        "colors": {
            "A": ("#e10d19", "#ffffff"),
            "B": ("#00a0dd", "#ffffff"),
            "C": ("#f29400", "#ffffff"),
            "D": ("#007934", "#ffffff"),
            "F": ("#9bc31c", "#ffffff"),
        },
        "departures": [
            ("A", 2, "Illkirch Graffenstaden", 0),
            ("D", 3, "Kehl Rathaus", 1),
            ("B", 4, "Hoenheim Gare", 0),
            ("C", 6, "Neuhof Rodolphe Reuss", 0),
            ("F", 8, "Place d'Islande", 0),
        ],
        "alerts": [
            alert("S1", "Line C: Christmas market", "Stop Broglie not served from 26 November.", ["C"], level=1)
        ],
    },
    "tisseo": {
        "network": "Réseau urbain Tisséo",
        "provider": "gtfs",
        "logo": "gtfs-tisseo-reseau-transport-urbain-toulousain.png",
        "city": "Toulouse",
        "stop": "Capitole",
        "mode": "metro",
        "colors": {"A": ("#e3051c", "#ffffff"), "L4": ("#f39200", "#ffffff")},
        "departures": [
            ("A", 1, "Balma-Gramont", 0),
            ("A", 3, "Basso Cambo", 0),
            ("L4", 5, "Cité de l'Espace", 2),
            ("A", 6, "Balma-Gramont", 0),
        ],
        "alerts": [],
    },
    "tbm": {
        "network": "Réseau urbain et scolaire TBM",
        "provider": "gtfs",
        "logo": "gtfs-offres-de-services-bus-tram-et-scolaire-au-format-gtfs-netex-gtfs-rt-siri-lite.svg",
        "city": "Bordeaux",
        "stop": "Hôtel de Ville",
        "mode": "tram",
        "colors": {"A": ("#81197f", "#ffffff"), "B": ("#e30613", "#ffffff")},
        "departures": [
            ("A", 2, "Floirac Dravemont", 1),
            ("B", 3, "Pessac Centre", 0),
            ("A", 5, "Le Haillan Rostand", 0),
            ("B", 7, "Berges de la Garonne", 0),
        ],
        "alerts": [alert("B1", "Line B: works at Quinconces", "Trams every 8 minutes until Sunday.", ["B"])],
    },
    "tam": {
        "network": "Réseau urbain TaM",
        "provider": "gtfs",
        "logo": "gtfs-offre-de-transport-tam-en-temps-reel-gtfs-rt-urbain-et-suburbain.png",
        "city": "Montpellier",
        "stop": "Comédie",
        "mode": "tram",
        "colors": {"1": ("#005ca9", "#ffffff"), "2": ("#f37c21", "#ffffff")},
        "departures": [
            ("1", 1, "Odysseum", 0),
            ("2", 4, "Jacou", 0),
            ("1", 5, "Mosson", 0),
            ("2", 9, "Saint-Jean-de-Védas Centre", 1),
        ],
        "alerts": [],
    },
    "naolib": {
        "network": "Réseau urbain Naolib",
        "provider": "gtfs",
        "logo": "gtfs-reseau-de-transports-collectifs-naolib.svg",
        "city": "Nantes",
        "stop": "Commerce",
        "mode": "tram",
        "colors": {"1": ("#007a3d", "#ffffff"), "2": ("#e30613", "#ffffff"), "3": ("#1d71b8", "#ffffff")},
        "departures": [
            ("1", 2, "François Mitterrand", 0),
            ("2", 3, "Orvault Grand Val", 0),
            ("3", 4, "Marcel Paul", 1),
            ("1", 6, "Ranzay", 0),
        ],
        "alerts": [],
    },
    "ilevia": {
        "network": "Réseau urbain ilévia",
        "provider": "gtfs",
        "logo": "gtfs-ilevia-localisation-des-arrets-bus-metro-et-tram-gtfs.svg",
        "city": "Lille",
        "stop": "Gare Lille Flandres",
        "mode": "metro",
        "colors": {"1": ("#ffcd00", "#000000"), "2": ("#e2001a", "#ffffff")},
        "departures": [
            ("1", 1, "4 Cantons Stade Pierre Mauroy", 0),
            ("2", 2, "Saint-Philibert", 0),
            ("1", 3, "CHU Eurasanté", 0),
            ("2", 5, "CH Dron", 1),
        ],
        "alerts": [],
    },
    "astuce": {
        "network": "Réseau urbain Astuce",
        "provider": "gtfs",
        "logo": "gtfs-donnees-statiques-et-temps-reel-du-reseau-astuce-metropole-rouen-normandie.svg",
        "city": "Rouen",
        "stop": "Théâtre des Arts",
        "mode": "metro",
        "colors": {"M": ("#e2001a", "#ffffff"), "T1": ("#00a4e4", "#ffffff")},
        "departures": [
            ("M", 2, "Technopôle", 0),
            ("M", 4, "Boulingrin", 0),
            ("T1", 5, "CHU Charles Nicolle", 1),
            ("M", 6, "Georges Braque", 0),
        ],
        "alerts": [],
    },
    "lignesdazur": {
        "network": "Réseau urbain Lignes d'Azur",
        "provider": "gtfs",
        "logo": "gtfs-donnees-statiques-et-dynamiques-du-reseau-de-transport-lignes-dazur.svg",
        "city": "Nice",
        "stop": "Jean Médecin",
        "mode": "tram",
        "colors": {"L1": ("#e2001a", "#ffffff"), "L2": ("#00a0e2", "#ffffff")},
        "departures": [
            ("L1", 1, "Hôpital Pasteur", 0),
            ("L2", 3, "Port Lympia", 0),
            ("L1", 4, "Henri Sappia", 0),
            ("L2", 6, "Aéroport Terminal 2", 2),
        ],
        "alerts": [
            alert(
                "N1",
                "Line L2: evening works",
                "Replacement buses between Jean Médecin and Port Lympia after 21:30.",
                ["L2"],
            )
        ],
    },
    "filbleu": {
        "network": "Réseau urbain Fil Bleu",
        "provider": "gtfs",
        "logo": "gtfs-fil-bleu-syndicat-des-mobilites-gtfs-gtfs-rt.png",
        "city": "Tours",
        "stop": "Jean Jaurès",
        "mode": "tram",
        "colors": {"A": ("#e2001a", "#ffffff")},
        "departures": [
            ("A", 2, "Vaucanson", 0),
            ("A", 4, "Lycée Jean Monnet", 1),
            ("A", 9, "Vaucanson", 0),
            ("A", 11, "Lycée Jean Monnet", 0),
        ],
        "alerts": [],
    },
    "lia": {
        "network": "Réseau urbain LiA",
        "provider": "gtfs",
        "logo": "gtfs-reseau-de-transport-en-commun-lia-gtfs-siri.svg",
        "city": "Le Havre",
        "stop": "Hôtel de Ville",
        "mode": "tram",
        "colors": {"A": ("#e2001a", "#ffffff"), "B": ("#0090d4", "#ffffff")},
        "departures": [
            ("A", 1, "Grand Hameau", 0),
            ("B", 3, "Caucriauville", 0),
            ("A", 5, "La Plage", 0),
            ("B", 7, "La Plage", 1),
        ],
        "alerts": [],
    },
    "irigo": {
        "network": "Réseau urbain Irigo",
        "provider": "gtfs",
        "logo": "gtfs-angers-loire-metropole-reseau-irigo-gtfs-gtfs-rt-siri.svg",
        "city": "Angers",
        "stop": "Ralliement",
        "mode": "tram",
        "colors": {"B": ("#00a0e2", "#ffffff"), "C": ("#95c11f", "#ffffff")},
        "departures": [
            ("B", 2, "Monplaisir", 0),
            ("C", 3, "Roseraie", 0),
            ("B", 5, "Belle-Beille Campus", 1),
            ("C", 8, "Belle-Beille Campus", 0),
        ],
        "alerts": [],
    },
}

for _key, _net in NETWORKS.items():
    STATES[f"sensor.{_key}_next_departure"] = stop(
        f"sensor.{_key}_next_departure",
        _net["stop"],
        _net["mode"],
        [
            dep(line, minutes, dest, delay=delay, colors=_net["colors"])
            for line, minutes, dest, delay in _net["departures"]
        ],
        _net["alerts"],
        provider=_net["provider"],
        network=_net["network"],
        city=_net["city"],
        logo_file=_net["logo"],
    )

SHOTS = [
    # The full card on a bus stop: the bus idles before the stop, departures, folded alerts.
    {"file": "card", "theme": "light", "config": {"entities": ["sensor.star_republique_next_departure"]}},
    {"file": "card-dark", "theme": "dark", "config": {"entities": ["sensor.star_republique_next_departure"]}},
    # Two stops (metro and bus) with the traffic alerts unfolded.
    {
        "file": "card-alerts",
        "theme": "light",
        "config": {
            "entities": ["sensor.star_republique_metro_next_departure", "sensor.star_republique_next_departure"]
        },
        "open": True,
    },
    {
        "file": "card-alerts-dark",
        "theme": "dark",
        "config": {
            "entities": ["sensor.star_republique_metro_next_departure", "sensor.star_republique_next_departure"]
        },
        "open": True,
    },
    # The mini card: the next three departures of each stop.
    {
        "file": "mini-card",
        "theme": "light",
        "element": "public-transport-mini-card",
        "width": 300,
        "config": {
            "entities": ["sensor.star_republique_metro_next_departure", "sensor.star_republique_next_departure"]
        },
    },
    {
        "file": "mini-card-dark",
        "theme": "dark",
        "element": "public-transport-mini-card",
        "width": 300,
        "config": {
            "entities": ["sensor.star_republique_metro_next_departure", "sensor.star_republique_next_departure"]
        },
    },
]

# Each other network: the full card and the mini card, light and dark.
for _key in NETWORKS:
    for _theme, _suffix in (("light", ""), ("dark", "-dark")):
        _entities = {"entities": [f"sensor.{_key}_next_departure"]}
        SHOTS.append({"file": f"card-{_key}{_suffix}", "theme": _theme, "config": _entities})
        SHOTS.append(
            {
                "file": f"mini-card-{_key}{_suffix}",
                "theme": _theme,
                "element": "public-transport-mini-card",
                "width": 300,
                "config": _entities,
            }
        )

# One GIF per animation, each with a dark twin (same setup): seconds is one loop of the animation.
ANIMATIONS = [
    # The next bus is a minute away: it drives in to the stop, waves rise from the sign (real time).
    {"file": "arriving", "config": {"entities": ["sensor.star_arriving_next_departure"]}, "seconds": 3.2},
    # The next train is a minute away: it glides in along the rails.
    {"file": "arriving-metro", "config": {"entities": ["sensor.star_republique_metro_next_departure"]}, "seconds": 3.2},
    # The next bus is minutes away: it idles before the stop, engine running.
    {"file": "waiting", "config": {"entities": BUS_STOP}, "seconds": 1.6},
    # A major disruption: the alert sign shakes.
    {
        "file": "alerts",
        "config": {"entities": ["sensor.star_metro_major_next_departure"], "show_scene": False},
        "open": True,
        "seconds": 1.2,
    },
    # Refreshing: the refresh button spins until the update is done.
    {"file": "refreshing", "config": {"entities": BUS_STOP, "show_scene": False}, "refreshing": True, "seconds": 1.0},
]


def _frames(path):
    """Decoded RGBA pixels of every frame, with each frame's duration: what the image looks like, not its bytes."""
    from PIL import Image, ImageSequence

    with Image.open(path) as image:
        return [
            (frame.info.get("duration"), frame.convert("RGBA").size, frame.convert("RGBA").tobytes())
            for frame in ImageSequence.Iterator(image)
        ]


def replace_if_changed(new, out):
    """Move the fresh render `new` onto `out` only when its pixels differ (or `out` is missing); return whether
    `out` changed. Encoders do not give the same bytes twice for the same image."""
    new, out = Path(new), Path(out)
    if out.exists() and _frames(new) == _frames(out):
        new.unlink()
        return False
    shutil.move(str(new), str(out))
    return True


# Pauses every animation at `t` ms, shadow trees included (document.getAnimations() leaves them out).
PAUSE_ANIMATIONS = """(t) => {
  const all = (root) => [
    ...root.getAnimations(),
    ...[...root.querySelectorAll("*")].filter((el) => el.shadowRoot).flatMap((el) => all(el.shadowRoot)),
  ];
  const animations = all(document);
  for (const a of animations) { a.pause(); a.currentTime = t; }
  return animations.length;
}"""


def page_html(theme, width=WIDTH):
    variables = "".join(f"{k}:{v};" for k, v in {**THEMES[theme], **COMMON}.items())
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
  :root {{ {variables} }}
  body {{ margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: {width}px; }}
</style></head><body><div id="root"></div></body></html>"""


def mount(context, shot):
    # A new page per capture: the card's top-level declarations would clash in a reused page.
    page = context.new_page()
    page.on("pageerror", lambda err, name=shot["file"]: print(f"{name}: page error: {err}"))
    page.clock.set_fixed_time(NOW.timestamp())
    page.set_content(page_html(shot["theme"], shot.get("width", WIDTH)))
    page.add_script_tag(content=HA_ELEMENTS)
    page.add_script_tag(content=CARD_JS)
    page.evaluate(
        """({config, states, element, open, refreshing}) => {
          const el = document.createElement(element);
          el.setConfig({type: `custom:${element}`, ...config});
          el.hass = {states, language: "en", locale: {language: "en"},
                     callService: () => new Promise(() => {}), callWS: () => Promise.resolve({})};
          document.getElementById("root").appendChild(el);
          if (open) { for (const id of config.entities) el._open[id] = true; el._render(); }
          if (refreshing) { el._refreshing = true; el._render(); }
        }""",
        {
            "config": shot["config"],
            "states": STATES,
            "element": shot.get("element", "public-transport-card"),
            "open": shot.get("open", False),
            "refreshing": shot.get("refreshing", False),
        },
    )
    return page


def _clip(page, shot):
    box = page.locator("#root").bounding_box()
    return {"x": 0, "y": 0, "width": shot.get("width", WIDTH) + 32, "height": int(box["height"] + 0.999) + 32}


def animate(context, shot, *, fps=15):
    """Record one animation as a looping screenshots/<file>.gif (needs ffmpeg). Every animation is paused and stepped
    frame by frame, so the GIF is identical whatever the machine's speed."""
    page = mount(context, shot)
    page.wait_for_timeout(200)
    clip = _clip(page, shot)
    frames = round(fps * shot["seconds"])
    with tempfile.TemporaryDirectory() as frame_dir:
        for i in range(frames):
            page.evaluate(f"(t) => ({PAUSE_ANIMATIONS})(t)", (i * 1000) / fps)
            page.screenshot(path=f"{frame_dir}/f{i:03d}.png", clip=clip)
        page.close()
        out = f"{frame_dir}/{shot['file']}.gif"
        palette = "split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-framerate",
                str(fps),
                "-i",
                f"{frame_dir}/f%03d.png",
                "-vf",
                f"scale={clip['width']}:-1:flags=lanczos,{palette}",
                "-loop",
                "0",
                out,
            ],
            check=True,
        )
        changed = replace_if_changed(out, ROOT / "screenshots" / f"{shot['file']}.gif")
    print(f"screenshots/{shot['file']}.gif" + ("" if changed else " (unchanged)"))


def main():
    out_dir = ROOT / "screenshots"
    out_dir.mkdir(exist_ok=True)
    # Imported here: the file helpers above (and their tests) do not need Playwright.
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        chromium = os.environ.get("CHROMIUM_PATH")
        browser = p.chromium.launch(executable_path=chromium) if chromium else p.chromium.launch()
        context = browser.new_context(
            device_scale_factor=2, viewport={"width": 1000, "height": 2400}, timezone_id="Europe/Paris"
        )
        for shot in SHOTS:
            page = mount(context, shot)
            page.wait_for_timeout(300)
            with tempfile.TemporaryDirectory() as tmp:
                fresh = Path(tmp) / f"{shot['file']}.png"
                page.screenshot(path=str(fresh), clip=_clip(page, shot), animations="disabled")
                changed = replace_if_changed(fresh, out_dir / f"{shot['file']}.png")
            print(f"screenshots/{shot['file']}.png" + ("" if changed else " (unchanged)"))
            page.close()
        for animation in ANIMATIONS:
            for theme, suffix in (("light", ""), ("dark", "-dark")):
                animate(context, {**animation, "file": f"{animation['file']}{suffix}", "theme": theme})
        browser.close()


if __name__ == "__main__":
    print(json.dumps({"shots": len(SHOTS), "animations": len(ANIMATIONS) * 2}))
    main()
