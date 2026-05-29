#!/usr/bin/env python3
"""Flamehaven Ledger Sanitizer.

Scrubs local-workspace absolute paths and locale/PII tokens from public-facing
ledger files (information-disclosure / OPSEC patch). Engine skeleton adapted
from AI-SLOP-DETECTOR (autofix FixChange/FixResult/register pattern).

Policy (DI-SAN-001): any absolute filesystem path is collapsed to
"[workspace]/<basename>" so drive letter, OS, workspace codenames, username,
and locale-revealing directory names are removed while the filename is kept
for provenance. Standalone locale tokens are redacted.

Usage:
  python sanitize_ledger.py            # dry-run report (no writes)
  python sanitize_ledger.py --apply    # rewrite files in place
"""
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, List, Optional

# Files to scan (relative globs from repo root). Tracked text/data only.
SCAN_GLOBS = ["**/*.json", "**/*.md", "**/*.html", "**/*.js", "**/*.yaml",
              "**/*.yml", "**/*.cff", "**/*.txt"]
EXCLUDE_DIRS = {".git", ".claude", "node_modules", "__pycache__", "sanitizer"}

WORKSPACE = "[workspace]"
REDACT = "[redacted]"


@dataclass
class FixChange:
    rule_id: str
    original: str
    replacement: str


@dataclass
class FixResult:
    file_path: str
    changes: List[FixChange] = field(default_factory=list)

    @property
    def changed(self) -> bool:
        return bool(self.changes)


Rule = Callable[[str], "tuple[str, List[FixChange]]"]
_RULES: "list[tuple[str, Rule]]" = []


def _register(rule_id: str):
    def deco(fn: Rule) -> Rule:
        _RULES.append((rule_id, fn))
        return fn
    return deco


def _basename(path_token: str) -> str:
    # Split on either separator (JSON-escaped backslash appears as two chars).
    parts = re.split(r"[\\/]+", path_token.strip())
    parts = [p for p in parts if p]
    return parts[-1] if parts else path_token


# Candidate absolute path: a Windows drive token consumed up to a delimiter
# (closing quote ", backtick, <, & for &quot;, or newline). Spaces are allowed
# inside the path so paths containing spaces / locale folders collapse fully.
# Separator class [\\/]+ matches raw "\", JSON-escaped "\\", and "/".
# NOTE: this also matches the "s:" inside "https://"; the replacement function
# is marker-gated so only real workspace paths are collapsed (URLs are left
# untouched), which avoids corrupting note hyperlinks and JS regex literals.
_PATH_RE = re.compile(r"[A-Za-z]:[\\/]+[^\"`<&\r\n]+")
# Hangul (Korean) run: any residual Korean text is locale/PII and is redacted.
# Ranges via \u escapes to keep this source ASCII-only: syllables U+AC00-U+D7A3,
# compatibility jamo U+3130-U+318F.
_HANGUL = chr(0xAC00) + "-" + chr(0xD7A3) + chr(0x3130) + "-" + chr(0x318F)
_HANGUL_RE = re.compile("[" + _HANGUL + "]+(?:\\s+[" + _HANGUL + "]+)*")
# A drive path is only collapsed if it carries a workspace leak marker.
_USERS_DREAM = re.compile(r"Users[\\/]+dream", re.IGNORECASE)


def _is_leak(tok: str) -> bool:
    if "Sanctum" in tok or "STRUCTURA" in tok:
        return True
    if _USERS_DREAM.search(tok):
        return True
    if _HANGUL_RE.search(tok):
        return True
    return False


@_register("abs_path_collapse")
def _rule_abs_path(text: str):
    changes: List[FixChange] = []

    def repl(m):
        tok = m.group(0).rstrip()
        if not _is_leak(tok):
            return m.group(0)  # not a workspace path (e.g. a URL) -> unchanged
        base = _basename(tok)
        # If the path is the workspace root itself, the basename is a codename
        # (e.g. "Sanctum"); drop it so only the neutral placeholder remains.
        new = WORKSPACE if (not base or _is_leak(base)) else WORKSPACE + "/" + base
        changes.append(FixChange("abs_path_collapse", tok, new))
        return new

    return _PATH_RE.sub(repl, text), changes


@_register("hangul_redact")
def _rule_hangul(text: str):
    changes: List[FixChange] = []

    def repl(m):
        tok = m.group(0)
        changes.append(FixChange("hangul_redact", tok, REDACT))
        return REDACT

    return _HANGUL_RE.sub(repl, text), changes


def sanitize_text(text: str) -> "tuple[str, List[FixChange]]":
    all_changes: List[FixChange] = []
    for _rid, rule in _RULES:
        text, ch = rule(text)
        all_changes.extend(ch)
    return text, all_changes


def iter_files(root: Path):
    seen = set()
    for pat in SCAN_GLOBS:
        for p in root.glob(pat):
            if not p.is_file():
                continue
            if any(part in EXCLUDE_DIRS for part in p.parts):
                continue
            if p in seen:
                continue
            seen.add(p)
            yield p


def main() -> int:
    ap = argparse.ArgumentParser(description="Flamehaven ledger sanitizer")
    ap.add_argument("--root", default=".", help="repo root (default: cwd)")
    ap.add_argument("--apply", action="store_true", help="write changes in place")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    results: List[FixResult] = []
    for f in iter_files(root):
        try:
            text = f.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new_text, changes = sanitize_text(text)
        if changes:
            res = FixResult(str(f.relative_to(root)), changes)
            results.append(res)
            if args.apply and new_text != text:
                f.write_text(new_text, encoding="utf-8")

    total = sum(len(r.changes) for r in results)
    mode = "APPLIED" if args.apply else "DRY-RUN"
    print("=== Flamehaven Ledger Sanitizer [%s] ===" % mode)
    print("Files with findings: %d | Total replacements: %d\n" % (len(results), total))
    for r in results:
        uniq = {}
        for ch in r.changes:
            uniq[ch.rule_id] = uniq.get(ch.rule_id, 0) + 1
        summary = ", ".join("%s:%d" % (k, v) for k, v in uniq.items())
        print("  %-58s %s" % (r.file_path, summary))
    if not args.apply and total:
        print("\nRun with --apply to rewrite these files.")
    return 1 if (total and not args.apply) else 0


if __name__ == "__main__":
    sys.exit(main())
