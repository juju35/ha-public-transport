"""The README shows each still screenshot as a light/dark pair: both must render the exact same card state."""

import ast
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "screenshots.py"


def _shots():
    # Read SHOTS statically: importing the script would require Playwright.
    for node in ast.parse(SCRIPT.read_text()).body:
        if isinstance(node, ast.Assign) and any(getattr(t, "id", None) == "SHOTS" for t in node.targets):
            return ast.literal_eval(node.value)
    raise AssertionError("SHOTS not found in scripts/screenshots.py")


def test_every_dark_still_is_the_light_twin():
    shots = {shot["file"]: shot for shot in _shots()}
    dark = [name for name in shots if name.endswith("-dark")]
    assert dark, "no dark screenshot"
    for name in dark:
        light = shots.get(name.removesuffix("-dark"))
        assert light is not None, f"{name} has no light twin"
        assert light["theme"] == "light"
        assert shots[name]["theme"] == "dark"
        strip = lambda shot: {k: v for k, v in shot.items() if k not in ("file", "theme")}  # noqa: E731
        assert strip(shots[name]) == strip(light), f"{name} does not show the same state as its light twin"


def test_every_light_still_has_a_dark_twin():
    shots = {shot["file"]: shot for shot in _shots()}
    for name, shot in shots.items():
        if shot["theme"] == "light":
            assert f"{name}-dark" in shots, f"{name} has no dark twin"


def _load_script():
    # The script imports Playwright only in main(): its file helpers load without it.
    import importlib.util

    spec = importlib.util.spec_from_file_location("transport_screenshots", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _image(path, color, *, frames=1, fmt="PNG", **extra):
    from PIL import Image

    images = [Image.new("RGB", (8, 8), c) for c in ([color] * frames if isinstance(color, tuple) else color)]
    images[0].save(path, fmt, save_all=frames > 1, append_images=images[1:], **extra)


def test_an_unchanged_render_leaves_the_screenshot_file_alone(tmp_path):
    """Re-encoding gives other bytes for the same pixels: the bot committed GIFs that looked exactly the same."""
    pytest = __import__("pytest")
    pytest.importorskip("PIL")
    replace_if_changed = _load_script().replace_if_changed
    out, new = tmp_path / "card.png", tmp_path / "new.png"
    _image(out, (255, 0, 0), compress_level=1)
    before = out.read_bytes()
    _image(new, (255, 0, 0), compress_level=9, pnginfo=None)
    assert new.read_bytes() != before
    assert replace_if_changed(new, out) is False
    assert out.read_bytes() == before
    assert not new.exists()
    # A pixel that changes replaces the file.
    _image(new, (254, 0, 0))
    assert replace_if_changed(new, out) is True
    assert out.read_bytes() != before
    # A missing screenshot is written.
    _image(new, (0, 0, 255))
    assert replace_if_changed(new, tmp_path / "missing.png") is True


def test_an_unchanged_animation_leaves_the_gif_alone_and_every_frame_counts(tmp_path):
    pytest = __import__("pytest")
    pytest.importorskip("PIL")
    replace_if_changed = _load_script().replace_if_changed
    out, new = tmp_path / "anim.gif", tmp_path / "new.gif"
    _image(out, [(255, 0, 0), (0, 255, 0)], frames=2, fmt="GIF", duration=50, loop=0)
    before = out.read_bytes()
    _image(new, [(255, 0, 0), (0, 255, 0)], frames=2, fmt="GIF", duration=50, loop=0, comment=b"re-encoded")
    assert replace_if_changed(new, out) is False
    assert out.read_bytes() == before
    # Only the second frame differs: still a change.
    _image(new, [(255, 0, 0), (0, 0, 255)], frames=2, fmt="GIF", duration=50, loop=0)
    assert replace_if_changed(new, out) is True


def _animations():
    for node in ast.parse(SCRIPT.read_text()).body:
        if isinstance(node, ast.Assign) and any(getattr(t, "id", None) == "ANIMATIONS" for t in node.targets):
            return node.value
    raise AssertionError("ANIMATIONS not found in scripts/screenshots.py")


def test_every_animation_is_shown_in_the_readme_in_both_themes():
    """One GIF per animation, rendered light and dark (the script renders both), each displayed in the README."""
    readme = (SCRIPT.parents[1] / "README.md").read_text(encoding="utf-8")
    names = [
        next(v.value for k, v in zip(item.keys, item.values, strict=True) if getattr(k, "value", None) == "file")
        for item in _animations().elts
    ]
    assert len(names) >= 4
    for name in names:
        for suffix in ("", "-dark"):
            assert f"screenshots/{name}{suffix}.gif" in readme, f"{name}{suffix}.gif not in the README"
    for shot in _shots():
        assert f"screenshots/{shot['file']}.png" in readme, f"{shot['file']}.png not in the README"


def test_the_gif_frames_pause_the_animations_inside_the_card():
    """document.getAnimations() leaves out the card's shadow tree: the frame script must reach its animations."""
    assert "shadowRoot" in _load_script().PAUSE_ANIMATIONS
