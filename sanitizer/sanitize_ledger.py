#!/usr/bin/env python3
"""Flamehaven Ledger Sanitizer (v1.1).

OPSEC / PII guard for the public verification ledger. Config-driven detectors
scrub local-workspace absolute paths and locale tokens (fix mode) and flag
IP / email / secret exposure (detect mode). Each run is recorded to a scan
history ledger from which a calibration file is derived (self-learning loop
adapted from AI-SLOP-DETECTOR). Engine skeleton: FixChange/_register pattern.

Usage:
  python sanitize_ledger.py            # dry-run report (no writes)
  python sanitize_ledger.py --apply    # rewrite fix-mode findings in place
  python sanitize_ledger.py --no-history   # skip history/calibration write
"""
from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable, Dict, List, Tuple

# Ensure the sibling module is importable when run as "python sanitizer/sanitize_ledger.py".
sys.path.insert(0, str(Path(__file__).resolve().parent))
import scan_history  # noqa: E402

WORKSPACE = "[workspace]"
REDACT = "[redacted]"
FLAG = "<flagged>"
_HANGUL = chr(0xAC00) + "-" + chr(0xD7A3) + chr(0x3130) + "-" + chr(0x318F)
_HANGUL_RE = re.compile("[" + _HANGUL + "]+(?:\\s+[" + _HANGUL + "]+)*")
_PATH_RE = re.compile(r"[A-Za-z]:[\\/]+[^\"`<&\r\n]+")
# Strict octets (no leading zeros) to avoid matching SVG/coordinate number runs.
_OCTET = r"(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)"
_IPV4_RE = re.compile(r"\b" + _OCTET + r"(?:\." + _OCTET + r"){3}\b")
# detect-mode rules run only on data files (paths below), not HTML/JS/MD where
# SVG coordinates and code produce false positives.
DATA_EXTS = {"json", "txt", "yaml", "yml", "cff"}
_EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
# Conservative secret rule: a sensitively-named key assigned a long value.
# Deliberately does NOT match bare hex so SHA-256 provenance hashes are not flagged.
_SECRET_RE = re.compile(
    r"(?i)(?:api[_-]?key|secret|password|passwd|access[_-]?token|bearer|private[_-]?key)"
    r"\s*[:=]\s*[\"']?[A-Za-z0-9_\-./+]{12,}"
)

DEFAULT_CONFIG = {
    "detectors": {"abs_path_collapse": "fix", "hangul_redact": "fix",
                  "ipv4_address": "detect", "email_address": "detect",
                  "secret_token": "detect"},
    "markers": ["Sanctum", "STRUCTURA", "Users/dream", "Users\\dream"],
    "ignore_dirs": [".git", ".claude", "node_modules", "__pycache__", "sanitizer"],
    "extensions": ["json", "md", "html", "js", "yaml", "yml", "cff", "txt"],
    "allowlist": [r"0\.0\.0\.0", r"127\.0\.0\.1", r"example\.(com|org)"],
}


@dataclass
class Finding:
    rule_id: str
    original: str
    replacement: str  # FLAG for detect-only rules


@dataclass
class FileResult:
    file_path: str
    findings: List[Finding] = field(default_factory=list)

    @property
    def rule_counts(self) -> Dict[str, int]:
        c: Dict[str, int] = {}
        for f in self.findings:
            c[f.rule_id] = c.get(f.rule_id, 0) + 1
        return c


# ---------------------------------------------------------------- detectors
Detector = Callable[[str, dict], Tuple[str, List[Finding]]]
_FIX: Dict[str, Detector] = {}
_DETECT: Dict[str, Detector] = {}


def _basename(tok: str) -> str:
    parts = [p for p in re.split(r"[\\/]+", tok.strip()) if p]
    return parts[-1] if parts else tok


def _is_path_leak(tok: str, markers: List[str]) -> bool:
    low = tok.lower()
    if any(m.lower() in low for m in markers):
        return True
    return bool(_HANGUL_RE.search(tok))


def fix_abs_path(text: str, cfg: dict):
    found: List[Finding] = []
    markers = cfg.get("markers", [])

    def repl(m):
        tok = m.group(0).rstrip()
        if not _is_path_leak(tok, markers):
            return m.group(0)
        base = _basename(tok)
        new = WORKSPACE if (not base or _is_path_leak(base, markers)) else WORKSPACE + "/" + base
        found.append(Finding("abs_path_collapse", tok, new))
        return new

    return _PATH_RE.sub(repl, text), found


def fix_hangul(text: str, cfg: dict):
    found: List[Finding] = []

    def repl(m):
        found.append(Finding("hangul_redact", m.group(0), REDACT))
        return REDACT

    return _HANGUL_RE.sub(repl, text), found


def _detect(rule_id: str, rx: re.Pattern):
    def fn(text: str, cfg: dict):
        allow = [re.compile(a) for a in cfg.get("allowlist", [])]
        found = []
        for m in rx.finditer(text):
            tok = m.group(0)
            if any(a.search(tok) for a in allow):
                continue
            found.append(Finding(rule_id, tok, FLAG))
        return text, found
    return fn


_FIX["abs_path_collapse"] = fix_abs_path
_FIX["hangul_redact"] = fix_hangul
_DETECT["ipv4_address"] = _detect("ipv4_address", _IPV4_RE)
_DETECT["email_address"] = _detect("email_address", _EMAIL_RE)
_DETECT["secret_token"] = _detect("secret_token", _SECRET_RE)


def load_config(base: Path) -> dict:
    # Config lives beside the tool, not at the scan root.
    cfg_path = Path(__file__).resolve().parent / ".sanconfig.yaml"
    if not cfg_path.exists():
        return dict(DEFAULT_CONFIG)
    try:
        import yaml
        data = yaml.safe_load(cfg_path.read_text(encoding="utf-8")) or {}
        merged = dict(DEFAULT_CONFIG)
        merged.update(data)
        return merged
    except Exception:
        return dict(DEFAULT_CONFIG)


def sanitize_text(text: str, cfg: dict, ext: str = "") -> Tuple[str, List[Finding]]:
    det = cfg.get("detectors", DEFAULT_CONFIG["detectors"])
    findings: List[Finding] = []
    for rid, mode in det.items():
        fn = _FIX.get(rid) if mode == "fix" else _DETECT.get(rid)
        if not fn:
            continue
        # detect-mode rules run only on data files to avoid HTML/JS/SVG noise.
        if mode != "fix" and ext and ext.lower() not in DATA_EXTS:
            continue
        text, f = fn(text, cfg)
        findings.extend(f)
    return text, findings


def iter_files(root: Path, cfg: dict):
    exts = set(cfg.get("extensions", DEFAULT_CONFIG["extensions"]))
    ignore = set(cfg.get("ignore_dirs", DEFAULT_CONFIG["ignore_dirs"]))
    seen = set()
    for ext in exts:
        for p in root.rglob("*." + ext):
            if not p.is_file() or p in seen:
                continue
            if any(part in ignore for part in p.parts):
                continue
            seen.add(p)
            yield p


def main() -> int:
    ap = argparse.ArgumentParser(description="Flamehaven ledger sanitizer v1.1")
    ap.add_argument("--root", default=".")
    ap.add_argument("--apply", action="store_true", help="rewrite fix-mode findings")
    ap.add_argument("--no-history", action="store_true", help="skip history/calibration")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    cfg = load_config(root)
    results: List[FileResult] = []
    for f in iter_files(root, cfg):
        try:
            text = f.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        new_text, findings = sanitize_text(text, cfg, f.suffix.lstrip("."))
        if findings:
            results.append(FileResult(str(f.relative_to(root)), findings))
            if args.apply and new_text != text:
                f.write_text(new_text, encoding="utf-8")

    fix_total = sum(sum(1 for x in r.findings if x.replacement != FLAG) for r in results)
    flag_total = sum(sum(1 for x in r.findings if x.replacement == FLAG) for r in results)
    mode = "APPLIED" if args.apply else "DRY-RUN"
    print("=== Flamehaven Ledger Sanitizer v1.1 [%s] ===" % mode)
    print("Files: %d | fixable: %d | flagged(detect): %d\n" % (len(results), fix_total, flag_total))
    for r in results:
        summ = ", ".join("%s:%d" % (k, v) for k, v in r.rule_counts.items())
        print("  %-56s %s" % (r.file_path, summ))

    if not args.no_history:
        scan_history.record_run(root / "sanitizer", mode, [
            {"file": r.file_path, "rule_counts": r.rule_counts} for r in results])
        cal = scan_history.calibrate(root / "sanitizer")
        print("\nHistory: %d runs recorded | calibration -> sanitizer/calibration.json"
              % cal["runs_recorded"])

    # Non-zero on a dry-run with fixable leaks, or any flagged detect finding.
    if (fix_total and not args.apply) or flag_total:
        print("\nLeaks present. Fix with --apply (paths/locale) and review flagged items.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
