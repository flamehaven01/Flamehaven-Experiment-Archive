"""Fail if a shipped HTML page has unbalanced structural tags.

Run: python scripts/check_html_balance.py   (used by CI; also runnable locally)

Counts opening vs closing for never-self-closing structural tags. A mismatch
usually means a hand-edit dropped a </div> and would break DOM rendering.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ["index.html", "eqa.html"]
TAGS = ["div", "article", "details", "section", "aside", "nav", "script", "table"]

bad = []
for page in PAGES:
    fp = ROOT / page
    if not fp.exists():
        continue
    s = fp.read_text(encoding="utf-8")
    for t in TAGS:
        opens = len(re.findall(r"<" + t + r"\b", s))
        closes = s.count("</" + t + ">")
        if opens != closes:
            bad.append("%s: <%s> %d open / %d close" % (page, t, opens, closes))

if bad:
    print("HTML tag balance FAILED:")
    for b in bad:
        print("  " + b)
    sys.exit(1)
print("HTML tag balance OK (%s)" % ", ".join(PAGES))
