"""Guards on the CI workflows that a unit test can check statically."""

import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
WORKFLOWS = ROOT / ".github" / "workflows"


def _load(name):
    return yaml.safe_load((WORKFLOWS / name).read_text())


def test_screenshots_workflow_runs_when_it_changes():
    # PyYAML reads the bare "on" key as True.
    paths = _load("screenshots.yml")[True]["pull_request"]["paths"]
    assert ".github/workflows/screenshots.yml" in paths


def test_release_publishes_from_main_only():
    release = _load("release.yml")["jobs"]["release"]
    assert release.get("if") == "github.ref == 'refs/heads/main'"


def _hook_rev(repo):
    config = yaml.safe_load((ROOT / ".pre-commit-config.yaml").read_text())
    hook = next(r for r in config["repos"] if r["repo"].endswith(repo))
    return hook


def test_biome_version_is_the_same_everywhere():
    hook = _hook_rev("biomejs/pre-commit")
    version = hook["rev"].lstrip("v")
    assert hook["hooks"][0]["additional_dependencies"] == [f"@biomejs/biome@{version}"]
    schema = re.search(r"schemas/([\d.]+)/schema.json", (ROOT / "biome.json").read_text()).group(1)
    assert schema == version
    lint = (WORKFLOWS / "lint.yml").read_text()
    # The CI reads the versions from .pre-commit-config.yaml instead of repeating them.
    assert not re.search(r"version: \d", lint), "a tool version is hard-coded in lint.yml"
    assert "Read Biome version from .pre-commit-config.yaml" in lint
    assert "Read ruff version from .pre-commit-config.yaml" in lint
