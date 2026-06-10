// bav-registry.js — BAV lane experiment registry. Single source of truth for
// BAV run IDs, inspector titles, and primary JSON paths.
// Load order: eqa-registry.js -> eqa-renderers.js -> bav-registry.js -> bav-renderers.js -> portal-charts.js -> portal-inspector.js -> portal.js

const BAV_REGISTRY = [
  { id: 'bav-exp-034', inspectorTitle: 'BAV \xb7 EXP-034 CROSS-PARITY',         jsonPath: './bav/exp-034/cross_parity_multiaxis.json' },
  { id: 'bav-exp-033', inspectorTitle: 'BAV \xb7 EXP-033 GOVERNANCE-MULTIAXIS', jsonPath: './bav/exp-033/governance_multiaxis.json' },
  { id: 'bav-exp-032', inspectorTitle: 'BAV \xb7 EXP-032 ADAPTIVE-GATE',        jsonPath: './bav/exp-032/pass-001-arm-a/payload.json' },
  { id: 'bav-exp-031', inspectorTitle: 'BAV \xb7 EXP-031 OOD-ABLATION',         jsonPath: './bav/exp-031/arm-a/hybrid_result.json' },
  { id: 'bav-exp-028', inspectorTitle: 'BAV \xb7 EXP-028 HONESTY-CALIBRATION',  jsonPath: './bav/exp-028/post_overlay_report.json' },
  { id: 'bav-exp-005', inspectorTitle: 'BAV \xb7 EXP-005 UPADACITINIB-NULL',    jsonPath: './bav/exp-005/manifest.json' },
];
const BAV_MAP = new Map(BAV_REGISTRY.map(e => [e.id, e]));
