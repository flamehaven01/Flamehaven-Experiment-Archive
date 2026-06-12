// EQA experiment registry — single source of truth for all EQA run configs.
// Add a new experiment here; portal.js and eqa-renderers.js pick it up automatically.

const EQA_REGISTRY = [
  {
    id: 'toe-test-0058',
    inspectorTitle: 'EQA · TOE-TEST-0058 QSOT-HARNESS v2.1.0',
    jsonPath: './eqa/toe-test-0058/verification_result.json',
    reportPaths: ['./eqa/toe-test-0058/analysis_report.md'],
    rawTabLabel: '📄 Verification Note',
    sidebar: { dot: '#eab308', label: 'eqa-test-0058', sub: 'qsot-harness', cardId: 'eqa-card-0058' },
  },
  {
    id: 'toe-test-0057',
    inspectorTitle: 'EQA · TOE-TEST-0057 QSOT COMPILER',
    jsonPath: './eqa/toe-test-0057/verification_result.json',
    reportPaths: ['./eqa/toe-test-0057/analysis_report.md'],
    rawTabLabel: '📄 Verification Note',
    sidebar: { dot: '#eab308', label: 'eqa-test-0057', sub: 'qsot-compiler', cardId: 'eqa-card-0057' },
  },
  {
    id: 'toe-test-0056',
    inspectorTitle: 'EQA · TOE-TEST-0056 OPENAI ERDOS EQ.2.2',
    jsonPath: './eqa/toe-test-0056/verification_result.json',
    reportPaths: ['./eqa/toe-test-0056/analysis_report.md'],
    rawTabLabel: '📄 Verification Note',
    sidebar: { dot: '#10b981', label: 'eqa-test-0056', sub: 'openai-erdos', cardId: 'eqa-card-0056' },
  },
  {
    id: 'toe-test-0055',
    inspectorTitle: 'EQA · TOE-TEST-0055 AEFSO',
    jsonPath: './eqa/toe-test-0055/AEFSO_MANIFEST.json',
    reportPaths: ['./eqa/toe-test-0055/analysis_report.md'],
    rawTabLabel: '📄 Research Dossier',
    sidebar: { dot: '#eab308', label: 'eqa-test-0055', sub: 'AEFSO', cardId: 'eqa-card-0055' },
  },
  {
    id: 'toe-test-0054',
    inspectorTitle: 'EQA · TOE-TEST-0054 GOVERNANCE GATE',
    jsonPath: './eqa/toe-test-0054/logos_toe_contract_inspection.json',
    reportPaths: ['./eqa/toe-test-0054/README.md'],
    rawTabLabel: '📄 Intake Report',
    sidebar: { dot: '#3b82f6', label: 'eqa-test-0054', sub: null, cardId: 'eqa-card-0054' },
  },
  {
    id: 'toe-test-0053',
    inspectorTitle: 'EQA · TOE-TEST-0053 NAMESPACE AUDIT',
    jsonPath: './eqa/toe-test-0053/analysis_results.json',
    reportPaths: ['./eqa/toe-test-0053/analysis_report.md'],
    rawTabLabel: '📄 Raw JSON',
    sidebar: { dot: '#3b82f6', label: 'eqa-test-0053', sub: null, cardId: 'eqa-card-0053' },
  },
  {
    id: 'toe-test-0052',
    inspectorTitle: 'EQA · TOE-TEST-0052 GTE PEDAGOGY',
    jsonPath: './eqa/toe-test-0052/internal_data.json',
    reportPaths: [
      './eqa/toe-test-0052/analysis_report.md',
      './eqa/toe-test-0052/comparison_2025_2026.md',
    ],
    rawTabLabel: '📄 Analysis + Comparison',
    sidebar: { dot: '#eab308', label: 'eqa-test-0052', sub: null, cardId: 'eqa-card-0052' },
  },
];

// O(1) lookup by experiment id — used by portal.js dispatch
const EQA_MAP = new Map(EQA_REGISTRY.map(function(e) { return [e.id, e]; }));
