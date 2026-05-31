"""Acceptance test for the promotional_language detector.

Run: python sanitizer/tests/test_promotional.py   (also pytest-compatible)

Verifies the §4.3 spec: bare promotional prose is flagged; the same terms inside
code / external-title / allowlist context are not; HTML CSS/attributes never flag.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import sanitize_ledger as S  # noqa: E402

# Empty promo_scope => detector runs on any relpath (so we can test logic directly).
CFG = {
    "promo_scope": [],
    "promo_terms": S._PROMO_TERMS_DEFAULT,
    "promo_allowlist": S._PROMO_ALLOW_DEFAULT,
}


def _hits(text, ext):
    _, f = S.detect_promotional(text, CFG, ext, "fixture." + ext)
    return [x.original.lower() for x in f]


def test_bare_prose_md_is_flagged():
    hits = _hits("This is a revolutionary, world-class breakthrough.", "md")
    assert set(hits) == {"revolutionary", "world-class", "breakthrough"}, hits


def test_inline_and_fenced_code_md_not_flagged():
    md = "Use `revolutionary` flag.\n```\nultimate = breakthrough\n```\n"
    assert _hits(md, "md") == [], _hits(md, "md")


def test_html_css_and_attrs_not_flagged():
    html = '<div style="position:absolute"><a title="ultimate">x</a><style>.a{}</style></div>'
    assert _hits(html, "html") == [], _hits(html, "html")


def test_html_visible_text_is_flagged():
    assert _hits("<p>An authoritative result.</p>", "html") == ["authoritative"]


def test_allowlist_absolute_path_not_flagged():
    assert _hits("Collapse the absolute path to a token.", "md") == []


def test_bare_absolute_still_flagged():
    assert _hits("We guarantee absolute integrity.", "md") == ["absolute"]


def test_scope_gate_blocks_out_of_scope_files():
    cfg = dict(CFG, promo_scope=["index.html"])
    _, f = S.detect_promotional("a breakthrough", cfg, "md", "reports/x.md")
    assert f == []


if __name__ == "__main__":
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn()
        print("PASS", fn.__name__)
    print("\nAll %d promotional_language tests passed." % len(fns))
