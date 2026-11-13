"""The list of the GTFS-RT networks written into the README (scripts/networks_readme.py)."""

from __future__ import annotations

import importlib.util
from pathlib import Path

from .gtfs_data import catalog

ROOT = Path(__file__).resolve().parent.parent


def _script():
    spec = importlib.util.spec_from_file_location("networks_readme", ROOT / "scripts" / "networks_readme.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_table_lists_the_networks_the_provider_offers() -> None:
    """Only the networks with a GTFS and a GTFS-RT feed, with their area, a link and their alerts."""
    body = _script().table(catalog())
    assert body.startswith("1 networks")
    assert "| Testville Métropole | [Réseau Test](https://transport.data.gouv.fr/datasets/reseau-test) | Yes |" in body
    assert "Horaires seuls" not in body
    assert "Vélos" not in body


def test_written_between_the_readme_markers() -> None:
    """The README keeps its markers, and the list replaces what lies between them."""
    script = _script()
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert script.START in readme
    assert script.END in readme
    new = script.write(f"before\n{script.START}\nold\n{script.END}\nafter", "LIST")
    assert new == f"before\n{script.START}\nLIST\n{script.END}\nafter"
