"""Writes the list of the GTFS-RT networks into the README, between its `networks` markers.

The networks are those the GTFS-RT provider offers in its setup form: the datasets of the national catalogue
(transport.data.gouv.fr) with both a GTFS file and a GTFS-RT feed of trip updates, read with the provider's own
`catalog_networks`. One row per network: the areas it covers, its name, whether it publishes service alerts.

    python scripts/networks_readme.py            # fetch the catalogue and rewrite the README
    python scripts/networks_readme.py file.json  # from a catalogue saved before (tests, offline)
"""

from __future__ import annotations

import importlib.util
import json
import re
import sys
import types
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
CATALOG_URL = "https://transport.data.gouv.fr/api/datasets"
START, END = "<!-- networks:start -->", "<!-- networks:end -->"


def _catalog_networks():
    """The provider's `catalog_networks`, loaded without Home Assistant (only its pure parsing is used)."""
    pkg = ROOT / "custom_components" / "public_transport" / "providers"
    # Home Assistant's date helpers are not needed to read the catalogue: stubbed when Home Assistant is not installed
    try:
        import homeassistant.util.dt  # noqa: F401, PLC0415
    except ImportError:
        for name in ("homeassistant", "homeassistant.util", "homeassistant.util.dt"):
            sys.modules[name] = types.ModuleType(name)
        sys.modules["homeassistant.util"].dt = sys.modules["homeassistant.util.dt"]  # type: ignore[attr-defined]
    parent = types.ModuleType("pt_providers")
    parent.__path__ = [str(pkg)]
    sys.modules["pt_providers"] = parent
    for mod in ("base", "gtfs_rt", "gtfs"):
        spec = importlib.util.spec_from_file_location(f"pt_providers.{mod}", pkg / f"{mod}.py")
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"pt_providers.{mod}"] = module
        spec.loader.exec_module(module)
    return sys.modules["pt_providers.gtfs"].catalog_networks


def _fold(text: str) -> str:
    return unicodedata.normalize("NFD", text).encode("ascii", "ignore").decode().lower()


# The legal form of an intercommunality, left out to name its city: "CA de Béziers-Méditerranée" -> "Béziers-Méditerranée"
_FORM = re.compile(
    r"^(?:CA|CU|CC|CA[A-Z]+|Communauté (?:d'agglomération|urbaine|de communes)|Agglomération)\s+"
    r"(?:(?:de la|de l'|du|des|de|d')\s*)?",
    re.IGNORECASE,
)


def _city(area: str) -> str:
    """An area named as people say it: without the legal form, quotes or a parenthesised long name."""
    name = _FORM.sub("", area.strip())
    name = re.sub(r"\s*\([^)]*\)\s*$", "", name).replace("''", "").replace('"', "").strip(" '")
    return name[:1].upper() + name[1:] if name else area


def _cell(text: str) -> str:
    return re.sub(r"\s+", " ", text).replace("|", "\\|").strip()


def table(datasets: list) -> str:
    """The Markdown of the list: a count, then one row per network sorted by area."""
    networks = _catalog_networks()(datasets)
    by_id = {str(d.get("slug") or d.get("id")): d for d in datasets if isinstance(d, dict)}
    rows = []
    for n in networks:
        dataset = by_id.get(n.id, {})
        areas = list(
            dict.fromkeys(
                _city(str(a.get("nom")))
                for a in dataset.get("covered_area") or []
                if isinstance(a, dict) and a.get("nom")
            )
        )
        area = ", ".join(areas[:4]) + (f" (+{len(areas) - 4})" if len(areas) > 4 else "")
        page = f"https://transport.data.gouv.fr/datasets/{n.id}"
        rows.append(
            (
                _fold(area or n.name),
                f"| {_cell(area) or '—'} | [{_cell(n.name)}]({page}) | {'Yes' if n.alerts_urls else '—'} |",
            )
        )
    rows.sort()
    lines = [
        f"{len(rows)} networks, from the [transport.data.gouv.fr](https://transport.data.gouv.fr) catalogue "
        "(refreshed every week; the setup form always reads the current catalogue).",
        "",
        "| City / area | Network | Alerts |",
        "|---|---|---|",
        *(row for _, row in rows),
    ]
    return "\n".join(lines)


def write(readme: str, body: str) -> str:
    start, end = readme.index(START) + len(START), readme.index(END)
    return f"{readme[:start]}\n{body}\n{readme[end:]}"


def main() -> None:
    if len(sys.argv) > 1:
        datasets = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    else:
        request = urllib.request.Request(CATALOG_URL, headers={"User-Agent": "ha-public-transport README"})
        with urllib.request.urlopen(request, timeout=120) as resp:  # noqa: S310 (a fixed https URL)
            datasets = json.load(resp)
    text = README.read_text(encoding="utf-8")
    new = write(text, table(datasets))
    if new != text:
        README.write_text(new, encoding="utf-8")
        print("README updated")
    else:
        print("README unchanged")


if __name__ == "__main__":
    main()
