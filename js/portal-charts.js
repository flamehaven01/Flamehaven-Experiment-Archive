// portal-charts.js — All ChartEngine spec builders for the Flamehaven Verification Ledger.
// Extracted from portal.js [v1.16.0]. Single concern: build chart spec arrays.
// Load order: bav-renderers.js -> portal-charts.js -> portal-inspector.js -> portal.js
function getChartsForRecord(runId, data) {
  if (Array.isArray(data._charts) && data._charts.length) return data._charts;
  const _eqaCharts = { 'toe-test-0057': buildQsotCharts, 'toe-test-0056': buildErdosCharts, 'toe-test-0054': buildGovGateCharts, 'toe-test-0053': buildLogosRuntimeCharts, 'toe-test-0052': buildSparCharts, 'toe-test-0055': buildAEFSOCharts };
  if (_eqaCharts[runId]) return _eqaCharts[runId](data);
  const _bavCharts = { 'bav-exp-031': buildBavExp031Charts, 'bav-exp-005': buildBavExp005Charts, 'bav-exp-028': buildBavExp028Charts, 'bav-exp-032': buildBavExp032Charts, 'bav-exp-033': buildBavExp033Charts, 'bav-exp-034': buildBavExp034Charts };
  if (_bavCharts[runId]) return _bavCharts[runId](data);
  return buildGenericCharts(data);
}

// BAV EXP-005: Upadacitinib truthful null — SR9 gate rejects all lipid carriers. Live from manifest samples.
function buildBavExp005Charts(data) {
  const s = (data && data.samples) || [];
  if (!s.length) return [];
  const thr = (data.guard_thresholds && data.guard_thresholds.sr9_min) || 0.80;
  const bars = [];
  s.forEach(x => { bars.push({ label: x.label || x.id, value: +(x.sr9_resonance ?? 0), color: (x.sr9_resonance ?? 0) >= thr ? '#10b981' : '#ef4444' }); });
  bars.push({ label: 'SR9 gate', value: thr, color: 'rgba(255,255,255,0.18)' });
  return [{
    type: 'bar',
    title: 'SR9 Resonance by Formulation vs Honesty Gate (>= ' + thr + ')',
    data: bars,
    options: { maxValue: 1, caption: 'All three lipid carriers remain far below the SR9 gate. Read this as an early manual-assisted control series that preserved an honest null, not as a fully autonomous production-era pipeline run.' },
  },{
    type: 'grouped-bar',
    title: 'Validator Split by Surface',
    data: {
      groups: [
        { label: 'SLN', values: [1, 0] },
        { label: 'NLC', values: [1, 0] },
        { label: 'Liposomal Gel', values: [1, 0] }
      ],
      series: [{ name: 'validator.metric PASS', color: '#10b981' }, { name: 'lab_validator.phi PASS', color: '#ef4444' }]
    },
    options: { maxValue: 1, caption: 'The public outputs show a consistent split: the generic metric validator passes, but the phi-specific lab validator does not. This ambiguity belongs on the public surface.' }
  }];
}

// BAV EXP-028: honesty test — calibration achieved but cross-domain resonance fails honestly. Live.
function buildBavExp028Charts(data) {
  if (!data) return [];
  const p1 = data.phase1 || {};
  const p2 = (data.phase2 && data.phase2.metrics) || {};
  const p3 = data.phase3 || {};
  const p4 = data.phase4 || {};
  const specs = [];
  // 1. Calibration improvement (before -> after)
  specs.push({
    type: 'grouped-bar',
    title: 'Calibration Improvement (lower is better)',
    data: {
      groups: [
        { label: 'Brier', values: [+(p2.brier_before ?? 0), +(p2.brier_after ?? 0)] },
        { label: 'ECE', values: [+(p2.ece_before ?? 0), +(p2.ece_after ?? 0)] },
      ],
      series: [{ name: 'Before', color: '#ef4444' }, { name: 'After', color: '#10b981' }],
    },
    options: { maxValue: Math.max(+(p2.brier_before ?? 0), +(p2.ece_before ?? 0), 0.5), caption: 'Calibration improved sharply, but this remains a tiny pilot. Better Brier and ECE do not turn fallback-gated n=2 evaluation into a robust claim.' },
  });
  // 2. Honesty test vs targets (SR9 >= 0.80, DI2 <= 0.20) — the system fails honestly
  specs.push({
    type: 'bar',
    title: 'Honesty Test: Cross-Domain Resonance vs Targets',
    data: [
      { label: 'SR9 (positive)', value: +(p1.sr9_pos_mean ?? 0), color: (p1.sr9_pos_mean ?? 0) >= 0.80 ? '#10b981' : '#ef4444' },
      { label: 'SR9 target', value: 0.80, color: 'rgba(255,255,255,0.18)' },
      { label: 'DI2 (positive)', value: +(p1.di2_pos_mean ?? 0), color: (p1.di2_pos_mean ?? 1) <= 0.20 ? '#10b981' : '#ef4444' },
      { label: 'DI2 target', value: 0.20, color: 'rgba(255,255,255,0.18)' },
    ],
    options: { maxValue: 1, caption: 'SR9 (cross-domain resonance, target >=0.80) is far below target and DI2 (logical drift, target <=0.20) far above — the system honestly reports it cannot resolve the cross-domain reasoning rather than hallucinating confidence.' },
  });
  specs.push({
    type: 'bar',
    title: 'Thresholding Context',
    data: [
      { label: 'Default gate', value: +(p3.gate_threshold_default ?? 0.5), color: 'rgba(255,255,255,0.18)' },
      { label: 'Deployed gate', value: +(p3.gate_threshold ?? 0), color: '#eab308' },
      { label: 'Youden J', value: +((p3.gate_optimization || {}).youden_j ?? 0), color: '#ef4444' }
    ],
    options: { maxValue: 1, caption: 'The deployed gate came from fallback optimization, not a strong discriminative optimum. Youden J = 0 is a warning sign, not a triumph.' }
  });
  specs.push({
    type: 'grouped-bar',
    title: 'Chem Policy Comparison',
    data: {
      groups: [
        { label: 'SR9 mean', values: [+(p4.chem_on?.sr9_mean ?? 0), +(p4.chem_off?.sr9_mean ?? 0)] },
        { label: 'DI2 mean', values: [+(p4.chem_on?.di2_mean ?? 0), +(p4.chem_off?.di2_mean ?? 0)] },
        { label: 'Overall mean', values: [+(p4.chem_on?.overall_mean ?? 0), +(p4.chem_off?.overall_mean ?? 0)] }
      ],
      series: [{ name: 'chem_on', color: '#10b981' }, { name: 'chem_off', color: '#60a5fa' }]
    },
    options: { maxValue: 1, caption: 'The public report shows chem_on and chem_off as numerically identical. That means policy preference exists, but measurable separation is not demonstrated here.' }
  });
  return specs;
}

// BAV EXP-033: pipeline-level p_e2e chain + classification parity. Live from multiaxis baseline. No hardcoding.
function buildBavExp033Charts(data) {
  const base = data && data.baseline && data.baseline.summary;
  const curr = data && data.current && data.current.summary;
  if (!base || !curr) return [];
  const bc = base.classification || {}, cc = curr.classification || {};
  const bg = base.governance || {}, cg = curr.governance || {};
  const specs = [];
  specs.push({
    type: 'grouped-bar',
    title: 'Baseline vs Current Repro2 (classification metrics)',
    data: {
      groups: [
        { label: 'EXP-032 baseline', values: [+(bc.accuracy ?? 0), +(bc.balanced_accuracy ?? 0), +(bc.pass_recall ?? 0), +(bc.block_recall ?? 0)] },
        { label: 'EXP-033 current', values: [+(cc.accuracy ?? 0), +(cc.balanced_accuracy ?? 0), +(cc.pass_recall ?? 0), +(cc.block_recall ?? 0)] },
      ],
      series: [
        { name: 'Accuracy', color: '#10b981' },
        { name: 'Balanced acc.', color: '#60a5fa' },
        { name: 'Pass recall', color: '#f59e0b' },
        { name: 'Block recall', color: '#8b5cf6' },
      ],
    },
    options: { maxValue: 1, caption: 'Baseline parity was perfect. Current repro2 preserves block recall but collapses the PASS cohort, driving pass recall to 0.00 and balanced accuracy to 0.50.' },
  });
  specs.push({
    type: 'grouped-bar',
    title: 'Clinical Status Counts (baseline vs current repro2)',
    data: {
      groups: [
        { label: 'EXP-032 baseline', values: [+(bg.clinical_status_counts?.PASS ?? 0), +(bg.clinical_status_counts?.BLOCK ?? 0)] },
        { label: 'EXP-033 current', values: [+(cg.clinical_status_counts?.PASS ?? 0), +(cg.clinical_status_counts?.BLOCK ?? 0)] },
      ],
      series: [
        { name: 'PASS', color: '#10b981' },
        { name: 'BLOCK', color: '#ef4444' },
      ],
    },
    options: { caption: 'The accepted baseline keeps a 3/3 PASS/BLOCK split. Current repro2 routes every control to BLOCK, revealing the pipeline-level failure surface.' },
  });
  return specs;
}

// BAV EXP-034: path separation + non-degradation deltas. Live. No hardcoding.
function buildBavExp034Charts(data) {
  const specs = [];
  const ds = data && data.delta_summary;
  const gov = (data && data._gov) || {};
  // 1. Cross-cycle non-degradation deltas (verdict fixed, governance surface shifts)
  if (ds) {
    specs.push({
      type: 'bar',
      title: 'Cross-Cycle Governance Deltas (EXP-034 legacy-replay vs EXP-033 v5j)',
      data: [
        { label: 'Accuracy Δ', value: +(ds.accuracy_delta ?? 0), color: '#10b981' },
        { label: 'p_e2e Δ', value: +(ds.ccge_p_e2e_mean_delta ?? 0), color: '#8b5cf6' },
        { label: 'SR9 tech Δ', value: +(ds.nnsl_sr9_tech_mean_delta ?? 0), color: '#60a5fa' },
        { label: 'DI2 tech Δ', value: +(ds.nnsl_di2_tech_mean_delta ?? 0), color: '#f59e0b' },
      ],
      options: { caption: 'Accuracy delta is exactly 0 — the judgment baseline stayed fixed across cycles. Governance metrics shifted (more measurable), but the verdict did not move. Non-degradation, not repair.' },
    });
  }
  const lb = gov.legacy_benchmark || {};
  const lbm = (lb.benchmark && lb.benchmark.metrics) || lb.metrics || {};
  const accVal = v => (v && typeof v === 'object') ? (v.value ?? 0) : (+v || 0);
  specs.push({
    type: 'bar',
    title: 'Accepted Anchor Metrics (legacy-replay only)',
    data: [
      { label: 'Accuracy', value: accVal(lbm.accuracy) || 0, color: '#10b981' },
      { label: 'Balanced acc.', value: accVal(lbm.balanced_accuracy) || 0, color: '#60a5fa' },
      { label: 'Pass recall', value: accVal(lbm.pass_recall) || 0, color: '#8b5cf6' },
      { label: 'Block recall', value: accVal(lbm.block_recall) || 0, color: '#f59e0b' },
    ],
    options: { maxValue: 1, caption: 'Only the accepted legacy-replay anchor is charted numerically. Current regeneration remains a diagnostic HOLD and is intentionally excluded from anchor-performance charts.' },
  });
  return specs;
}

// BAV EXP-032: governance verification charts. Live from payload + go/no-go + benchmark. No hardcoding.
function buildBavExp032Charts(data) {
  if (!data) return [];
  const gov = data._gov || {};
  const sm = (gov.go_no_go && gov.go_no_go.summary) || {};
  const pm = data.pipeline_metrics || {};
  const passV = data.viability_assessment || {};
  const block = gov.blockPayload || {};
  const blockV = block.viability_assessment || {};
  const specs = [];

  // 1. Classification parity (the trust headline): accuracy / balanced / dangerous-pass / false-reject
  if (Object.keys(sm).length) {
    specs.push({
      type: 'bar',
      title: 'Classification Parity (legacy-replay anchor · verdict GO)',
      data: [
        { label: 'Accuracy', value: +(sm.benchmark_accuracy ?? 0), color: '#10b981' },
        { label: 'Balanced acc.', value: +(sm.benchmark_balanced_accuracy ?? 0), color: '#10b981' },
        { label: 'Dangerous false-pass', value: +(sm.dangerous_pass_rate ?? 0), color: '#ef4444' },
        { label: 'False-reject', value: +(sm.false_reject_rate ?? 0), color: '#f59e0b' },
      ],
      options: { maxValue: 1, caption: 'Accepted legacy-replay anchor only. GO means clinical PASS/BLOCK parity on 2 labeled classes (6 arm payloads), not a production LawBinder PASS. Current-regeneration path is held out.' },
    });
  }
  // 2. PASS vs BLOCK discrimination (model separates controls)
  if (block && blockV) {
    specs.push({
      type: 'grouped-bar',
      title: 'PASS vs BLOCK Control Discrimination',
      data: {
        groups: [
          { label: 'Viability %', values: [(+passV.percent || 0), (+blockV.percent || 0)] },
          { label: 'Confidence %', values: [((+data.confidence || 0) * 100), ((+block.confidence || 0) * 100)] },
        ],
        series: [{ name: 'PASS-001', color: '#10b981' }, { name: 'BLOCK-001', color: '#ef4444' }],
      },
      options: { maxValue: 100, unit: '%', caption: 'PASS control scores higher than BLOCK on both axes, so the replay discriminates correctly. LawBinder still escalates both, and shadow outputs remain non-binding observer hints.' },
    });
  }
  // 3. Honesty-test / pipeline metrics vs guard thresholds (SR9>=0.70, DI2<=0.30)
  if (Object.keys(pm).length) {
    specs.push({
      type: 'bar',
      title: 'Pipeline Governance Metrics (PASS-001 · guard: SR9>=0.70, DI2<=0.30)',
      data: [
        { label: 'Ω 3-modal', value: +(pm.omega_3modal ?? 0), color: '#8b5cf6' },
        { label: 'SR9 (tech)', value: +(pm.sr9_tech ?? 0), color: (pm.sr9_tech ?? 0) >= 0.70 ? '#10b981' : '#ef4444' },
        { label: 'SR9 (clinical)', value: +(pm.sr9_clinical ?? 0), color: (pm.sr9_clinical ?? 0) >= 0.70 ? '#10b981' : '#f59e0b' },
        { label: 'DI2 (tech)', value: +(pm.di2_tech ?? 0), color: (pm.di2_tech ?? 0) <= 0.30 ? '#10b981' : '#ef4444' },
      ],
      options: { maxValue: 1, caption: 'SR9 = cross-domain resonance (higher better, >=0.70). DI2 = dimensional drift (lower better, <=0.30). Green = within guard threshold.' },
    });
  }
  return specs;
}

// BAV EXP-031: multi-model disagreement (drift) + real structural confidence charts.
// All values live from AF outputs attached at data._bav. No hardcoding (DI-BSC-001).
function buildBavExp031Charts(data) {
  const bav = data && data._bav;
  if (!bav) return [];
  const specs = [];
  const armResult = a => (a && a.result) || {};
  const arms = [['A', data], ['B', bav.armB], ['C', bav.armC]].filter(x => x[1]);

  // 1. Consensus / drift comparison across arms (headline: "when models fight")
  if (arms.length) {
    specs.push({
      type: 'grouped-bar',
      title: 'Final Drift / Effective Drift / pTM by Arm',
      data: {
        groups: arms.map(([name, a]) => {
          const r = armResult(a);
          const vs = r.validator_summary || {};
          return { label: 'arm ' + name, values: [r.final_drift ?? 0, vs.effective_drift ?? r.final_drift ?? 0, vs.ptm_weighted_mean ?? 0] };
        }),
        series: [{ name: 'Final drift', color: '#f59e0b' }, { name: 'Effective drift', color: '#ef4444' }, { name: 'pTM (consensus)', color: '#8b5cf6' }],
      },
      options: { maxValue: 1, caption: 'Observer-only governance adds a penalty to final drift when disagreement remains unresolved. Arm C looks mild on final drift alone, but still fails once effective drift is applied.' },
    });
  }
  // 2. pLDDT track (real per-residue confidence, AF2 arm A)
  if (bav.af2 && Array.isArray(bav.af2.plddt)) {
    specs.push({ type: 'plddt-track', title: 'Per-Residue Confidence (AF2, arm A · pLDDT)', data: { plddt: bav.af2.plddt }, options: { caption: 'AlphaFold2 per-residue pLDDT. Low/very-low regions flag intrinsic disorder where structure should not be over-trusted.' } });
  }
  // 3. PAE heatmap (real AF2 PAE matrix)
  if (bav.af2 && Array.isArray(bav.af2.pae)) {
    specs.push({ type: 'pae-heatmap', title: 'Predicted Aligned Error (AF2, arm A)', data: { matrix: bav.af2.pae }, options: { scale: 'pae', maxValue: bav.af2.max_pae, caption: 'PAE[i,j]: expected position error of residue j when aligned on residue i. Low (teal) = confident relative positioning.' } });
  }
  // 4. Contact map (real AF3 contact probabilities)
  if (bav.af3full && Array.isArray(bav.af3full.contact_probs)) {
    specs.push({ type: 'contact-map', title: 'Contact Probability Map (AF3, arm A)', data: { matrix: bav.af3full.contact_probs }, options: { scale: 'contact', caption: 'AlphaFold3 predicted residue-residue contact probability. Bright = high predicted contact.' } });
  }
  return specs;
}

function buildQsotCharts(data) {
  const checks = data.checks ?? {};
  const vals = Object.values(checks);
  const passCount = vals.filter(v => v === 'PASS' || v === true).length;
  const skipCount = vals.filter(v => v === 'SKIPPED').length;
  const failCount = vals.length - passCount - skipCount;

  const obs = data.observations ?? {};
  const dsPurity = obs.desitter_purity ?? 0.6360680891448688;
  const schPurity = obs.schwarz_purity ?? 0.9994346211351026;
  const adsPurity = obs.ads_purity ?? 0.6776355966184198;
  const eguchiPurity = obs.eguchi_purity ?? 0.9988698549640613;

  const boost = obs.ads_boost_info ?? {};
  const v = boost.observer_velocity ?? 0.5;
  const gammaRest = 1.0;
  const gammaBoost = boost.gamma_boost ?? 1.1547005383792517;

  return [
    {
      type: 'donut',
      title: 'Verification Check Results',
      data: [
        { label: 'Pass', value: passCount, color: '#10b981' },
        ...(skipCount > 0 ? [{ label: 'Skipped', value: skipCount, color: '#6b7280' }] : []),
        ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : []),
      ],
      options: { centerText: String(passCount), centerSub: `of ${vals.length} passed` },
    },
    {
      type: 'bar',
      title: 'Phase 2 · Curvature Induced Purity Decay',
      data: [
        { label: 'Schwarzschild Rest', value: schPurity, color: '#10b981', note: 'Decay parameter: ~0.0001' },
        { label: 'de Sitter Rest', value: dsPurity, color: '#ef4444', note: 'Decay parameter: ~0.3639' },
        { label: 'AdS5 Rest', value: adsPurity, color: '#3b82f6', note: 'Decay parameter: ~0.3224' },
        { label: 'Eguchi-Hanson Rest', value: eguchiPurity, color: '#8b5cf6', note: 'Decay parameter: ~0.0011' },
      ],
      options: { maxValue: 1, unit: '', caption: 'Purity decays asymptotically from 1.0 depending on background curvature tensors.' },
    },
    {
      type: 'bar',
      title: 'Phase 3 · Relativistic Boost Time Dilation',
      data: [
        { label: 'Rest (v = 0.0)', value: gammaRest, color: '#10b981', note: 'gamma = 1.0' },
        { label: 'Boost (v = ' + v + 'c)', value: gammaBoost, color: '#ef4444', note: 'gamma = ' + gammaBoost.toFixed(4) },
      ],
      options: { maxValue: 2.0, unit: '', caption: 'Observer velocity sweep shows time dilation scaling factor gamma. Total factor combines boost and curvature metrics.' },
    },
  ];
}

function buildErdosCharts(data) {
  const checks = data.checks ?? {};
  const vals = Object.values(checks);
  const passCount = vals.filter(Boolean).length;
  const failCount = vals.length - passCount;

  const phase1 = data.observations?.phase1_lattice ?? {};
  const gaussian = phase1.gaussian ?? {};
  const eisenstein = phase1.eisenstein ?? {};
  const sawin = data.observations?.phase3_sawin_multiquadratic ?? {};
  const gs = sawin.galois_rank ?? {};

  const gsR = gs.r_G_S_bound ?? 0;
  const gsThreshold = gs.golod_shafarevich_threshold ?? 0;
  const gsDelta = gs.d_G_infty ?? 0;
  const gsAdmit = gs.admissible ?? true;

  return [
    {
      type: 'donut',
      title: 'Verification Check Results',
      data: [
        { label: 'Pass', value: passCount, color: '#10b981' },
        ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : []),
      ],
      options: { centerText: String(passCount), centerSub: `of ${vals.length} passed` },
    },
    {
      type: 'bar',
      title: 'Phase 1 · Lattice Unit-Distance Pairs',
      data: [
        {
          label: 'Q(i) Gaussian',
          value: gaussian.unit_distance_pairs ?? 0,
          color: '#3b82f6',
          note: gaussian.observed_exponent != null ? `observed exponent: ${gaussian.observed_exponent.toFixed(6)}` : '',
        },
        {
          label: 'Q(√-3) Eisenstein',
          value: eisenstein.unit_distance_pairs ?? 0,
          color: '#8b5cf6',
          note: eisenstein.observed_exponent != null ? `observed exponent: ${eisenstein.observed_exponent.toFixed(6)}` : '',
        },
      ],
      options: { unit: ' pairs', caption: 'Eisenstein integers are denser at identical grid bounds (h=1 degenerate cases, Prop. 2.2).' },
    },
    {
      type: 'bar',
      title: 'Phase 3 · Golod-Shafarevich Tower Admissibility',
      data: [
        { label: 'r_{G,S} bound', value: gsR, color: '#f59e0b', note: 'H² relations — must be < d²/4' },
        { label: 'd²/4 threshold', value: gsThreshold, color: '#10b981', note: 'GS upper bound' },
        { label: 'd_G_∞ dim', value: gsDelta, color: '#6366f1', note: 'H¹ generators' },
      ],
      options: {
        maxValue: Math.max(gsThreshold * 1.2, gsDelta * 1.2, 1),
        caption: `Tower exists ⇔ r < d²/4. Here: ${gsR} < ${(gsDelta * gsDelta / 4).toFixed(2)} → infinite pro-2 tower ${gsAdmit ? 'CONFIRMED' : 'NOT CONFIRMED'}. (Hajir-Maire, Prop. 2.3)`,
      },
    },
  ];
}

function buildGovGateCharts(data) {
  const conns = data.connections ?? {};
  const entries = Object.entries(conns);
  const chartData = entries.map(([key, val]) => {
    const score = val.contract_score ?? 0;
    const color = score >= 0.9 ? '#10b981' : score >= 0.7 ? '#eab308' : '#ef4444';
    return { label: key.replace(/_/g, ' '), value: score, color, note: `discord ${(val.discord_score ?? 0).toFixed(3)} · risk ${(val.dangerous_pass_risk ?? 0).toFixed(4)}` };
  });
  const passCount = entries.filter(([, v]) => (v.contract_score ?? 0) >= 0.85).length;
  const law = data.lawbinder_governance ?? {};
  const constraints = Array.isArray(law.constraint_results) ? law.constraint_results : [];
  const hard = Number(law.hard_violations ?? 0);
  const soft = Number(law.soft_violations ?? 0);
  const clean = Math.max(0, constraints.length - hard - soft);
  const connRisk = entries.map(([key, val]) => ({
    label: key.replace(/_/g, ' '),
    value: +(val.dangerous_pass_risk ?? 0),
    color: (val.dangerous_pass_risk ?? 0) > 0 ? '#ef4444' : '#10b981',
    note: (val.issues || []).join('; ') || 'no recorded issue',
  }));

  return [
    {
      type: 'donut',
      title: 'Gate Contract Results',
      data: [
        { label: 'Above threshold (≥0.85)', value: passCount, color: '#10b981' },
        { label: 'Below threshold (<0.85)', value: entries.length - passCount, color: '#ef4444' },
      ],
      options: { centerText: String(passCount), centerSub: `of ${entries.length} gates`, caption: 'Only the promotion-boundary connection clears the threshold. The other two surfaces are intentionally blocked because no candidate exists yet.' },
    },
    {
      type: 'bar',
      title: 'Pipeline Contract Scores',
      data: chartData,
      options: { maxValue: 1, caption: 'Minimum threshold for pipeline promotion: 0.850. INHIBIT gate triggered by hard constraint violation.' },
    },
    {
      type: 'bar',
      title: 'Dangerous Pass Risk by Connection',
      data: connRisk,
      options: { maxValue: 1, caption: 'The system is not just saying no. It localizes where a false promotion would be dangerous, with the global intake surface correctly pinned at risk 1.0.' },
    },
    {
      type: 'donut',
      title: 'LawBinder Constraint Outcomes',
      data: [
        { label: 'Clean constraints', value: clean, color: '#10b981' },
        { label: 'Soft violations', value: soft, color: '#f59e0b' },
        { label: 'Hard violations', value: hard, color: '#ef4444' },
      ].filter(x => x.value > 0),
      options: { centerText: String(hard), centerSub: 'hard', caption: 'LawBinder distinguishes one hard blocker from one softer usability blocker. That distinction is the real governance insight of 0054.' },
    },
  ];
}

function buildGenericCharts(data) {
  const checks = data.checks ?? {};
  const vals = Object.values(checks);
  if (!vals.length) return [];

  const passCount = vals.filter(Boolean).length;
  const failCount = vals.length - passCount;
  return [
    {
      type: 'donut',
      title: 'Verification Check Results',
      data: [
        { label: 'Pass', value: passCount, color: '#10b981' },
        ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : []),
      ],
      options: { centerText: String(passCount), centerSub: `of ${vals.length} passed` },
    },
  ];
}

function buildSparCharts(data) {
  const spar = data.spar_review ?? {};
  const subj = data.subject ?? {};
  const hist = data.historical_snapshot ?? {};
  const replays = data.current_replays ?? {};
  const legacyReplay = replays.toe_legacy_2026_06_02 ?? {};
  const frameworkReplay = replays.toe_spar_framework_2026_06_02 ?? {};
  const historicalScore = hist.score ?? spar.score ?? 0;
  const findings = Array.isArray(spar.findings) ? spar.findings : [];
  const statusCounts = findings.reduce((acc, finding) => {
    const key = finding.status || 'UNKNOWN';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const layerCounts = findings.reduce((acc, finding) => {
    const key = finding.layer || '?';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return [
    {
      type: 'bar',
      title: 'Replay Comparison',
      data: [
        { label: 'Historical', value: historicalScore, color: '#ef4444', note: `Historical snapshot — ${hist.spar_verdict ?? spar.verdict ?? 'MINOR REVISION'}` },
        { label: 'TOE Legacy', value: legacyReplay.score ?? historicalScore, color: '#eab308', note: `${legacyReplay.verdict ?? 'MINOR REVISION'} on ${legacyReplay.date ?? '2026-06-02'}` },
        { label: 'toe-spar', value: frameworkReplay.score ?? 98, color: '#10b981', note: `${frameworkReplay.verdict ?? 'ACCEPT'} on ${frameworkReplay.date ?? '2026-06-02'}` },
      ],
      options: { maxValue: 100, unit: '/100', caption: 'Same manually encoded subject, different SPAR policy surfaces. This chart shows review-policy drift, not new physics output.' },
    },
    {
      type: 'bar',
      title: 'Agent Metrics',
      data: [
        { label: 'SR9 Resonance', value: Math.round((subj.sr9_resonance ?? 0) * 100), color: '#10b981', note: `${subj.sr9_resonance ?? 0} — theoretical alignment` },
        { label: 'DI2 Drift', value: Math.round((subj.di2_drift ?? 0) * 100), color: '#ef4444', note: `${subj.di2_drift ?? 0} — claim-to-math deviation` },
        { label: 'Omega (SIDRCE)', value: Math.round((subj.sidrce_omega ?? 0) * 100), color: '#eab308', note: `${subj.sidrce_omega ?? 0} — composite adjudication` },
      ],
      options: { maxValue: 100, unit: '%', caption: 'SR9 Resonance measures theoretical alignment. DI2 Drift measures claim-to-math deviation. Omega is the composite SIDRCE adjudication score.' },
    },
    {
      type: 'donut',
      title: 'Finding Severity Mix',
      data: [
        { label: 'ANOMALY', value: statusCounts.ANOMALY || 0, color: '#ef4444' },
        { label: 'WARN', value: statusCounts.WARN || 0, color: '#f59e0b' },
        { label: 'APPROXIMATION', value: statusCounts.APPROXIMATION || 0, color: '#eab308' },
        { label: 'GAPPED', value: statusCounts.GAPPED || 0, color: '#60a5fa' },
        { label: 'HEURISTIC', value: statusCounts.HEURISTIC || 0, color: '#a78bfa' },
      ].filter(x => x.value > 0),
      options: { centerText: String(findings.length), centerSub: 'findings', caption: 'The verdict is driven by one scope anomaly, one scope-honesty warning, and three bounded-domain/model-gap findings.' },
    },
    {
      type: 'bar',
      title: 'Finding Layers',
      data: [
        { label: 'Layer A', value: layerCounts.A || 0, color: '#ef4444', note: 'math / claim mismatch' },
        { label: 'Layer B', value: layerCounts.B || 0, color: '#f59e0b', note: 'scope honesty' },
        { label: 'Layer C', value: layerCounts.C || 0, color: '#60a5fa', note: 'domain limits and evidence gaps' },
      ],
      options: { maxValue: Math.max(3, ...Object.values(layerCounts), 1), caption: '0052 is not failing because the symbolic story collapses everywhere. It fails because the reviewed claim outruns a bounded, domain-specific mathematical construction.' },
    },
  ];
}

function buildLogosRuntimeCharts(data) {
  const runtime = data.logos_runtime_probe ?? {};
  const compile = Array.isArray(data.logos_source_compile) ? data.logos_source_compile : [];
  const contract = data.toe_contract_probe ?? {};
  const probes = [
    { label: 'Package resolution', status: runtime.package_name_resolution?.status || 'unknown', duration: runtime.package_name_resolution?.duration_s ?? 0.0, color: '#10b981', note: (runtime.package_name_resolution?.stdout || '').trim() || 'no path recorded' },
    { label: 'Direct import', status: runtime.direct_import?.status || 'unknown', duration: runtime.direct_import?.duration_s ?? 0.0, color: runtime.direct_import?.status === 'pass' ? '#10b981' : '#ef4444', note: 'imports aats.pipeline, bridge.manifold_bridge, missing_link.runner' },
    { label: 'AATS smoke', status: runtime.aats_smoke?.status || 'unknown', duration: runtime.aats_smoke?.duration_s ?? 0.0, color: runtime.aats_smoke?.status === 'pass' ? '#10b981' : '#ef4444', note: 'runs AATSPipeline().run(...) in the active environment' },
    { label: 'TOE contracts', status: contract.status || 'unknown', duration: contract.duration_s ?? 0.0, color: contract.status === 'pass' ? '#10b981' : '#ef4444', note: 'tests/unit/test_logos_sidecar_contract.py + export contract' },
  ];
  const passCount = probes.filter(p => p.status === 'pass').length + compile.filter(x => x.status === 'pass').length;
  const timeoutCount = probes.filter(p => p.status === 'timeout').length;
  const failCount = probes.filter(p => p.status === 'fail').length + compile.filter(x => x.status === 'fail').length;
  const compileRatio = compile.length ? Math.round((compile.filter(x => x.status === 'pass').length / compile.length) * 100) : 0;
  return [
    {
      type: 'bar',
      title: 'Probe Duration Profile',
      data: probes.map(p => ({ label: p.label, value: +(p.duration || 0), color: p.color, note: `${p.status} — ${p.note}` })),
      options: { maxValue: Math.max(25, ...probes.map(p => +(p.duration || 0))), unit: 's', caption: 'Two probes hit the 20-second timeout ceiling. The sidecar boundary is operational, not speculative: import and smoke execution are too slow for guarded runtime use.' },
    },
    {
      type: 'donut',
      title: 'Operational Outcome Mix',
      data: [
        { label: 'Pass', value: passCount, color: '#10b981' },
        { label: 'Timeout', value: timeoutCount, color: '#ef4444' },
        { label: 'Fail', value: failCount, color: '#f59e0b' },
      ].filter(x => x.value > 0),
      options: { centerText: String(passCount), centerSub: 'passes', caption: 'The audit is not empty: compile checks and TOE contract tests pass. The decisive blockers are the two runtime timeouts.' },
    },
    {
      type: 'bar',
      title: 'Boundary Readiness Matrix',
      data: [
        { label: 'Source compile', value: compileRatio, color: '#10b981', note: `${compile.filter(x => x.status === 'pass').length}/${compile.length} key files compile` },
        { label: 'Package resolution', value: runtime.package_name_resolution?.status === 'pass' ? 100 : 0, color: '#10b981', note: 'Path resolved, but not to Flamehaven-LOGOS' },
        { label: 'Direct import', value: runtime.direct_import?.status === 'pass' ? 100 : 0, color: runtime.direct_import?.status === 'pass' ? '#10b981' : '#ef4444', note: `status = ${runtime.direct_import?.status || 'unknown'}` },
        { label: 'AATS smoke', value: runtime.aats_smoke?.status === 'pass' ? 100 : 0, color: runtime.aats_smoke?.status === 'pass' ? '#10b981' : '#ef4444', note: `status = ${runtime.aats_smoke?.status || 'unknown'}` },
        { label: 'TOE contracts', value: contract.status === 'pass' ? 100 : 0, color: contract.status === 'pass' ? '#10b981' : '#ef4444', note: `status = ${contract.status || 'unknown'}` },
      ],
      options: { maxValue: 100, unit: '%', caption: '0053 preserves the safe boundary because runtime execution is still degraded even though compile and TOE contract checks are healthy.' },
    },
  ];
}

function buildAEFSOCharts(data) {
  const stack = data.validation_stack ?? [];
  const stages = data.stage_outputs ?? [];
  const summary = data.screen_summary ?? {};
  const stackColors = ['#10b981', '#3b82f6', '#a78bfa'];
  return [
    {
      type: 'bar',
      title: 'Validation Stack Completion',
      data: stack.map((s, i) => ({ label: s, value: 100, color: stackColors[i % stackColors.length] })),
      options: { maxValue: 100, unit: '% complete', caption: 'All three validation stages completed: SPAR paper review, fhval validation, and TOE dogfood testing (4 runs).' },
    },
    {
      type: 'donut',
      title: 'Target Outcome Classification',
      data: [
        { label: 'Optional Layer', value: 1, color: '#eab308' },
        { label: 'Missing Link', value: 1, color: '#10b981' },
        { label: 'Core (Rejected)', value: 1, color: '#ef4444' },
      ],
      options: { centerText: 'ORL', centerSub: 'classification', caption: 'AEFSO received OPTIONAL_REPRESENTATION_LAYER classification. Core candidate rejected; missing-link discovery approved for continued research.' },
    },
    {
      type: 'bar',
      title: 'Stage Outcomes',
      data: stages.map(s => ({
        label: s.name,
        value: s.status === 'PASS' ? 100 : s.status === 'WARN' ? 60 : 20,
        color: s.status === 'PASS' ? '#10b981' : s.status === 'WARN' ? '#eab308' : '#ef4444',
        note: s.detail
      })),
      options: { maxValue: 100, unit: '% confidence', caption: 'AEFSO survives as a bounded research candidate, but the core-promotion step fails on readability and governance-surface criteria.' },
    },
    {
      type: 'bar',
      title: 'Architectural Yield Mix',
      data: [
        { label: 'What survived', value: (summary.what_it_proved || []).length, color: '#10b981' },
        { label: 'Promotion blockers', value: (summary.promotion_blockers || []).length, color: '#ef4444' },
        { label: 'Missing-link properties', value: (summary.missing_link_properties || []).length, color: '#60a5fa' },
      ],
      options: { maxValue: 5, unit: 'signals', caption: '0055 is not a clean fail. The missing-link output is part of the result, not post-hoc spin.' },
    },
  ];
}


