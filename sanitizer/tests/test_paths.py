"""Acceptance test for abs_path_collapse across Windows / UNC / POSIX paths.

Run: python sanitizer/tests/test_paths.py   (also pytest-compatible)

Proves the marker-gated collapse: workspace-marker paths are redacted to
[workspace]/..., while URLs and ordinary relative paths are left intact (the
POSIX pattern may *match* a URL path component but must never *collapse* it).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import sanitize_ledger as S  # noqa: E402

CFG = {"markers": ["Sanctum", "STRUCTURA", "Users/dream", "Users\\dream"]}


def fix(text):
    return S.fix_abs_path(text, CFG)[0]


def test_windows_marker_path_collapses():
    assert fix(r'"p": "D:\Sanctum\flamehaven-audit-reports\bio"') == '"p": "[workspace]/bio"', fix(r'"p": "D:\Sanctum\x\bio"')


def test_posix_marker_path_collapses():
    out = fix("host: /home/dream/Sanctum/flamehaven-audit-reports/bio")
    assert "[workspace]" in out and "Sanctum" not in out, out


def test_unc_marker_path_collapses():
    out = fix(r"share: \\server\Sanctum\ledger\bio")
    assert "[workspace]" in out and "Sanctum" not in out, out


def test_url_is_untouched():
    url = "https://github.com/flamehaven01/Flamehaven-Verification-Ledger/tree/main"
    assert fix("see " + url) == "see " + url, fix("see " + url)


def test_relative_path_is_untouched():
    rel = "./eqa/archive/reports/TOE-TEST-0001.md"
    assert fix("path " + rel) == "path " + rel, fix("path " + rel)


def test_posix_nonmarker_path_untouched():
    p = "/usr/local/bin/python3"
    assert fix(p) == p, fix(p)


if __name__ == "__main__":
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    for fn in fns:
        fn(); print("PASS", fn.__name__)
    print("\nAll %d path tests passed." % len(fns))
