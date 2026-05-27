# 📋 Changelog

All notable changes to the **Flamehaven Verification Ledger** platform will be documented in this file.

---

## [1.1.0] - 2026-05-27

This release introduces comprehensive visual, search, and navigation upgrades across all dashboards, establishes perfect button layout symmetry, implements dynamic historical calibration registry details, and resolves a critical rendering hotfix for the Bioscience Compliance (BSC) dashboard.

### 🔴 Critical Hotfixes
- **BSC Dashboard Recovery**: Fixed a missing closing `</div>` tag for the BAV dashboard in `index.html`. This tag imbalance caused the browser's DOM parser to nest downstream components (including the BSC collection section and score guide) inside the hidden BAV container on page load, rendering them invisible. Restoring the tag fully restores the BSC dashboard.
- **Card EQA-TEST-0055 Tag Cleanup**: Repaired mangled button tag markup on EQA Card 55 to prevent HTML parser collisions.

### 📐 Visual & Symmetry Upgrades
- **EQA Button Uniformity**: Standardized all Equation-to-Artifact (EQA) cards to a uniform 4-button configuration (`[JSON]`, `[Report]`, `[Repo]`, and `[Paper]`).
  - Active buttons feature sleek glassmorphic hover animations.
  - Inactive archive buttons (`EQA-ARCHIVE-0001`) are elegantly disabled and blurred (`.disabled` class, `0.4` opacity, `not-allowed` cursor).
- **Arrow Character Cleanup**: Completely removed arrow characters (`↗`) from all `[Report]`, `[Repo]`, and `[Paper]` action buttons for modern typographic consistency.
- **Symmetrical 2x2 Landing Grid**: Upgraded the portal landing page (`.portal-intro-grid`) from a 1x3 structure to a symmetrical 2x2 grid by adding a **Methodology & Frameworks** card pointing dynamically to `#extras`.
- **Premium Sidebar Tooltips**: Removed plain `?` circle helpers from folder buttons and refactored the sidebar CSS to display gilded hover tooltips on folder name hover.

### 🔍 Unified Localized Search
- **Part-Specific Search Bars**: Added independent glassmorphic search inputs with real-time on-keyup filters to the EQA ledger list, BAV ledger list, and Methodology ledger list.
- **Dynamic Math Filters**: The new filters index and search within respective collections only, significantly improving performance and usability.

### 📄 Historical Calibration registry & Math Proof Inspector
- **Dynamic 51-Run Registry**: Built an interactive scrollable list in `EQA-ARCHIVE-0001` dynamically generating 51 historical math calibration runs covering Dirichlet L-functions, Euler-Mascheroni lattices, genus class fields, and Galois extension degrees.
- **Default Proof Focusing**: Configured `openJsonInspector` to dynamically detect calibration run clicks, rename the Raw JSON tab to `📄 Calibration Proof`, and focus on it by default on load.
- **Beautiful HTML Mathematical Briefs**: Implemented a lightweight, robust Markdown-to-HTML engine in `js/portal.js` that transforms raw scientific markdown reports into highly styled mathematical briefs with grid telemetry panels.
- **One-Click Clipboard Copying**: Integrated a dynamic copy button that copies the raw mathematical brief to the clipboard with temporary success toast text states.

### 🔒 Core Scoping & Architecture Protection
- **Global Window Bindings**: Explicitly exported all top-level UI interaction handlers (e.g. `openJsonInspector`, `closeJsonInspector`, `switchInspectorTab`, `toggleGuide`, `filterTier`, `filterColl`, `handleSearch`, `handleSort`) to the browser `window` scope in `js/portal.js` to guarantee module scoping immunity.
- **Reflow-Safe Smooth Scrolling**: Wrapped inspector scrolling logic inside `requestAnimationFrame` + `setTimeout` locks to prevent scrolling before browser DOM tree layout reflows complete.

---

*For older records or detailed analyst evidence logs, please refer to the corresponding directories under `stem-bio-ai/` or `eqa/`.*
