"""Every translation has exactly the keys and placeholders of the English one."""

import json
import re
from pathlib import Path

import pytest

TRANSLATIONS = Path(__file__).parents[1] / "custom_components" / "public_transport" / "translations"
PLACEHOLDER = re.compile(r"\{\w+\}")
CYRILLIC = re.compile(r"[Ѐ-ӿ]")
LATIN = re.compile(r"[A-Za-z]")
# Proper names, brands, codes and units that stay in Latin letters in the Cyrillic text.
LATIN_IN_CYRILLIC = re.compile(
    r"Home Assistant|Public Transport|API|STAR|TCL|CTS|GTFS-RT|PRIM|Île-de-France Mobilités|login:password"
    r"|transport\.data\.gouv\.fr|data\.grandlyon\.com|\{\w+\}"
)


def _load(lang: str) -> dict:
    return json.loads((TRANSLATIONS / f"{lang}.json").read_text(encoding="utf-8"))


def _keys(data: dict, prefix: str = "") -> set[str]:
    keys = set()
    for key, value in data.items():
        keys.add(prefix + key)
        if isinstance(value, dict):
            keys |= _keys(value, f"{prefix}{key}.")
    return keys


def _strings(data: dict, prefix: str = "") -> dict[str, str]:
    strings = {}
    for key, value in data.items():
        if isinstance(value, dict):
            strings |= _strings(value, f"{prefix}{key}.")
        else:
            strings[prefix + key] = value
    return strings


LANGUAGES = [
    "fr",
    "de",
    "es",
    "sr",
    "sr-Latn",
    "it",
    "nl",
    "pt",
    "pt-BR",
    "pl",
    "ro",
    "da",
    "sv",
    "bg",
    "ru",
    "uk",
    "hu",
    "sk",
    "cs",
    "sl",
    "lv",
    "el",
]


@pytest.mark.parametrize("lang", LANGUAGES)
def test_translation_keys_match_english(lang: str) -> None:
    """The translation exists and has the same keys and placeholders as en.json, with no empty text."""
    english = _load("en")
    other = _load(lang)
    assert _keys(other) == _keys(english)
    english_strings = _strings(english)
    for path, text in _strings(other).items():
        assert text.strip(), path
        assert sorted(PLACEHOLDER.findall(text)) == sorted(PLACEHOLDER.findall(english_strings[path])), path


def test_every_translation_file_is_tested() -> None:
    """No translation file is left out of the parity test."""
    assert sorted(p.stem for p in TRANSLATIONS.glob("*.json")) == sorted(["en", *LANGUAGES])


def test_serbian_stays_in_one_script() -> None:
    """sr is Cyrillic and sr-Latn is Latin, apart from names, brands and codes."""
    for path, text in _strings(_load("sr")).items():
        assert not LATIN.search(LATIN_IN_CYRILLIC.sub("", text)), path
    for path, text in _strings(_load("sr-Latn")).items():
        assert not CYRILLIC.search(text), path


def test_readme_features_name_every_language() -> None:
    """The README feature list names every language the integration and the card ship."""
    readme = (Path(__file__).parents[1] / "README.md").read_text(encoding="utf-8")
    features = readme.split("## Features", 1)[1].split("\n## ", 1)[0]
    names = [
        "English",
        "French",
        "German",
        "Spanish",
        "Serbian",
        "Cyrillic",
        "Latin",
        "Italian",
        "Dutch",
        "Portuguese",
        "Polish",
        "Romanian",
        "Danish",
        "Swedish",
        "Bulgarian",
        "Russian",
        "Ukrainian",
        "Hungarian",
        "Slovak",
        "Czech",
        "Slovenian",
        "Latvian",
        "Greek",
    ]
    for name in names:
        assert name in features, name
