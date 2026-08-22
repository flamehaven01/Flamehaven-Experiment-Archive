#!/usr/bin/env python3
"""Check the shared portal frame contract without third-party dependencies."""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = (ROOT / "index.html", ROOT / "eqa.html")

REQUIRED_FRAME_IDS = (
    "child-toe",
    "dashboard-toe",
    "eq-local-search",
    "eqa-cards-container",
    "eqa-card-archive",
    "eqa-archive-list",
    "eq-json-inspector",
    "inspector-run-id",
    "ins-insights",
    "ins-charts",
    "ins-integrity",
    "ins-checks",
    "ins-raw",
    "sb-backdrop",
    "toast",
)

REQUIRED_EQA_SCRIPTS = (
    "js/chart-engine.js",
    "js/chart-builder.js",
    "js/eqa-registry.js",
    "js/eqa-renderers.js",
    "js/portal-charts.js",
    "js/portal-inspector.js",
    "js/portal.js",
)

SCRIPT_RE = re.compile(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>', re.I)
ID_RE = re.compile(r'\bid=["\']([^"\']+)["\']', re.I)
LIVE_CARD_RE = re.compile(r'\bid=["\']eqa-card-\d{4}["\']', re.I)
EQA_CONTAINER_RE = re.compile(
    r'<[^>]+\bid=["\']eqa-cards-container["\'][^>]*>', re.I
)


def normalized_script(src: str) -> tuple[str, str | None]:
    local = src.split("#", 1)[0]
    path, separator, query = local.partition("?")
    path = path.removeprefix("./")
    version = None
    if separator:
        for part in query.split("&"):
            key, equals, value = part.partition("=")
            if equals and key == "v":
                version = value
                break
    return path, version


def page_scripts(html: str) -> dict[str, str | None]:
    scripts: dict[str, str | None] = {}
    for src in SCRIPT_RE.findall(html):
        if src.startswith(("http://", "https://", "//")):
            continue
        path, version = normalized_script(src)
        scripts[path] = version
    return scripts


def inline_style(tag: str) -> dict[str, str]:
    match = re.search(r'\bstyle=["\']([^"\']*)["\']', tag, re.I)
    if not match:
        return {}
    declarations: dict[str, str] = {}
    for declaration in match.group(1).split(";"):
        key, separator, value = declaration.partition(":")
        if separator:
            declarations[key.strip().lower()] = value.strip().lower()
    return declarations


def check_pages(errors: list[str]) -> None:
    script_maps: dict[str, dict[str, str | None]] = {}

    for page in PAGES:
        html = page.read_text(encoding="utf-8")
        ids = ID_RE.findall(html)
        script_maps[page.name] = page_scripts(html)

        duplicates = sorted({item for item in ids if ids.count(item) > 1})
        if duplicates:
            errors.append(f"{page.name}: duplicate ids: {', '.join(duplicates)}")

        for required_id in REQUIRED_FRAME_IDS:
            count = ids.count(required_id)
            if count != 1:
                errors.append(
                    f"{page.name}: required frame id {required_id!r} occurs {count} times"
                )

        container_match = EQA_CONTAINER_RE.search(html)
        if container_match:
            style = inline_style(container_match.group(0))
            expected_stack = {
                "display": "flex",
                "flex-direction": "column",
                "gap": "16px",
            }
            for property_name, expected_value in expected_stack.items():
                if style.get(property_name) != expected_value:
                    errors.append(
                        f"{page.name}: eqa-cards-container must set "
                        f"{property_name}:{expected_value}"
                    )

        static_cards = LIVE_CARD_RE.findall(html)
        if static_cards:
            errors.append(
                f"{page.name}: live EQA cards must be registry-rendered; found "
                f"{len(static_cards)} static card id(s)"
            )

        for script in REQUIRED_EQA_SCRIPTS:
            if script not in script_maps[page.name]:
                errors.append(f"{page.name}: missing required script {script}")

    left = script_maps[PAGES[0].name]
    right = script_maps[PAGES[1].name]
    for script in REQUIRED_EQA_SCRIPTS:
        if script not in left or script not in right:
            continue
        if left[script] != right[script]:
            errors.append(
                f"cache version mismatch for {script}: "
                f"{PAGES[0].name}={left[script]!r}, {PAGES[1].name}={right[script]!r}"
            )

    versioned = {
        version
        for scripts in script_maps.values()
        for path, version in scripts.items()
        if path in REQUIRED_EQA_SCRIPTS and version is not None
    }
    if len(versioned) != 1:
        errors.append(
            "shared EQA scripts must use one cache version; found "
            + (", ".join(sorted(versioned)) if versioned else "none")
        )


def extract_registry_contract(errors: list[str]) -> None:
    registry_path = ROOT / "js" / "eqa-registry.js"
    renderer_path = ROOT / "js" / "eqa-renderers.js"
    registry = registry_path.read_text(encoding="utf-8")
    renderers = renderer_path.read_text(encoding="utf-8")

    entry_matches = list(
        re.finditer(r"^\s{4}id:\s*['\"](toe-test-\d{4})['\"],", registry, re.M)
    )
    registry_ids = [match.group(1) for match in entry_matches]
    renderer_ids = set(
        re.findall(r"^\s{2}['\"](toe-test-\d{4})['\"]:\s*\{", renderers, re.M)
    )

    if not registry_ids:
        errors.append("eqa-registry.js: no top-level EQA registry ids found")
        return
    if len(registry_ids) != len(set(registry_ids)):
        errors.append("eqa-registry.js: duplicate registry ids")

    for run_id in registry_ids:
        if run_id not in renderer_ids:
            errors.append(f"{run_id}: missing EQA_RENDERERS entry")

    registry_end = registry.find("\n];", entry_matches[-1].end())
    for index, match in enumerate(entry_matches):
        run_id = match.group(1)
        end = entry_matches[index + 1].start() if index + 1 < len(entry_matches) else registry_end
        entry = registry[match.start():end]

        json_match = re.search(r"jsonPath:\s*['\"](\./eqa/[^'\"]+)['\"]", entry)
        if not json_match:
            errors.append(f"{run_id}: missing jsonPath")

        reports_match = re.search(r"reportPaths:\s*\[(.*?)\]", entry, re.S)
        report_paths = (
            re.findall(r"['\"](\./eqa/[^'\"]+)['\"]", reports_match.group(1))
            if reports_match
            else []
        )
        if not report_paths:
            errors.append(f"{run_id}: missing reportPaths")

        artifact_paths = ([json_match.group(1)] if json_match else []) + report_paths
        for relative in artifact_paths:
            target = ROOT / relative.removeprefix("./")
            if not target.is_file():
                errors.append(f"{run_id}: registry artifact does not exist: {relative}")


def check_optional_bootstrap(errors: list[str]) -> None:
    portal = (ROOT / "js" / "portal.js").read_text(encoding="utf-8")
    for function_name in (
        "renderBscCards",
        "renderBscSidebar",
        "renderExtraItems",
        "renderExtraSidebar",
    ):
        guarded = re.search(
            rf"typeof\s+{function_name}\s*===\s*['\"]function['\"]\s*\)?\s*{function_name}\s*\(",
            portal,
        )
        if not guarded:
            errors.append(
                f"portal.js: optional bootstrap call {function_name}() is not feature-guarded"
            )


def check_multisection_sidebar_visibility(errors: list[str]) -> None:
    portal = (ROOT / "js" / "portal.js").read_text(encoding="utf-8")
    singular_selector = "children.querySelector('.sb-files')"
    plural_selector = "children.querySelectorAll('.sb-files')"

    if singular_selector in portal:
        errors.append(
            "portal.js: folder expansion must not open only the first .sb-files list"
        )
    if portal.count(plural_selector) < 2:
        errors.append(
            "portal.js: toggleFolder and openCollection must open every .sb-files list"
        )


def check_knowledge_extractor_freeze(errors: list[str]) -> None:
    extra = ROOT / "extra"
    spec = extra / "Flamehaven_Knowledge_Extractor_v6.8.3a.md"
    manifest = extra / "Flamehaven_Knowledge_Extractor_v6.8.3a.freeze.yaml"
    receipt = extra / "Flamehaven_Knowledge_Extractor_v6.8.3a.freeze.txt"
    reader = extra / "flamehaven_knowledge_extractor_v6.8.3a.html"

    for artifact in (spec, manifest, receipt, reader):
        if not artifact.is_file():
            errors.append(f"Knowledge Extractor artifact missing: {artifact.name}")
    if not all(artifact.is_file() for artifact in (spec, manifest, receipt, reader)):
        return

    raw = spec.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        errors.append("Knowledge Extractor spec: UTF-8 BOM is forbidden")
    try:
        source = raw.decode("utf-8")
    except UnicodeDecodeError:
        errors.append("Knowledge Extractor spec: not valid UTF-8")
        return

    normalized = source.replace("\r\n", "\n").replace("\r", "\n")
    trailing = [
        line_no
        for line_no, line in enumerate(normalized.split("\n"), 1)
        if line.endswith((" ", "\t"))
    ]
    if trailing:
        errors.append(
            "Knowledge Extractor spec: trailing whitespace at line(s) "
            + ", ".join(map(str, trailing[:10]))
        )
    canonical = normalized.rstrip("\n") + "\n"
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    manifest_text = manifest.read_text(encoding="utf-8")
    receipt_text = receipt.read_text(encoding="utf-8")
    digest_match = re.search(
        r'canonical_spec_sha256:\s*"([0-9a-f]{64})"', manifest_text
    )
    if not digest_match or digest_match.group(1) != digest:
        errors.append("Knowledge Extractor freeze manifest digest mismatch")
    if 'canonicalization: "fh-spec-bytes-v1"' not in manifest_text:
        errors.append("Knowledge Extractor freeze manifest canonicalization mismatch")
    if f"actual_sha256={digest}" not in receipt_text:
        errors.append("Knowledge Extractor freeze receipt actual digest mismatch")
    if f"manifest_sha256={digest}" not in receipt_text:
        errors.append("Knowledge Extractor freeze receipt manifest digest mismatch")
    if "match=true" not in receipt_text or "FREEZE_VALID" not in receipt_text:
        errors.append("Knowledge Extractor freeze receipt is not valid")

    registry = (ROOT / "js" / "extra-registry.js").read_text(encoding="utf-8")
    for required in (
        "flamehaven-knowledge-extractor-v6-8-3a",
        "deepLinks: ['flamehaven-knowledge-extractor-v6-8-2']",
        "./extra/Flamehaven_Knowledge_Extractor_v6.8.3a.freeze.yaml",
        "./extra/Flamehaven_Knowledge_Extractor_v6.8.3a.freeze.txt",
    ):
        if required not in registry:
            errors.append(f"extra-registry.js: missing {required}")

    index = (ROOT / "index.html").read_text(encoding="utf-8")
    for button_id in ("btn-dl-yaml", "btn-dl-txt"):
        if index.count(f'id="{button_id}"') != 1:
            errors.append(f"index.html: {button_id} must occur exactly once")

    portal = (ROOT / "js" / "portal.js").read_text(encoding="utf-8")
    for token in ("yamlPath", "txtPath", "btn-dl-yaml", "btn-dl-txt", "flamehaven-knowledge-extractor-v6-8-3a"):
        if token not in portal:
            errors.append(f"portal.js: missing freeze download token {token}")


def main() -> int:
    errors: list[str] = []
    check_pages(errors)
    extract_registry_contract(errors)
    check_optional_bootstrap(errors)
    check_multisection_sidebar_visibility(errors)
    check_knowledge_extractor_freeze(errors)

    if errors:
        print(f"frame contract: FAIL ({len(errors)} issue(s))")
        for error in errors:
            print(f"- {error}")
        return 1

    print("frame contract: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
