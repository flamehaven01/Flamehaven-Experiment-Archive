// EQA renderer functions — extracted from portal.js to eliminate if-else chains.
// Each experiment has: insights(data,esc)->string, integrity(data,esc,insIntegrity,insChecks)->void,
// analysis(container,data,esc)->void. Null means fall through to portal.js default.

// ─── INSIGHTS ────────────────────────────────────────────────────────────────

function eqaInsights0057(data, esc) {
  const obs = data.observations || {};
  const cptpDev = obs.cptp_completeness_max_deviation || 1.57e-16;
  const dsPurity = obs.desitter_purity || 0.6360680891448688;
  const schPurity = obs.schwarz_purity || 0.9994346211351026;
  const kdNeg = obs.kd_flat?.kd_value || -0.1234429932877238;
  const nmMeasure = obs.memory_kernel?.nm_measure || 0.0014132140336108878;
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Axiom Validation Precision</div>
        <div style="font-size:20px;font-weight:600;color:#10b981;margin-top:4px;">&lt; 5e-16</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">CPTP Max Dev: ${cptpDev.toExponential(4)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">de Sitter Purity</div>
        <div style="font-size:20px;font-weight:600;color:#f97316;margin-top:4px;">${dsPurity.toFixed(4)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Schwarzschild: ${schPurity.toFixed(4)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Kirkwood-Dirac Negativity</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">${kdNeg.toFixed(4)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Flat Spacetime Optimization</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Non-Markovianity (TTM)</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">${nmMeasure.toExponential(4)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">de Sitter Environment</div>
      </div>
    </div>
    <div style="margin-top:24px;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:var(--r-md);padding:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#ef4444;font-weight:700;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;">
        <span>⚠️ High-Formality, Fake Physics Slop Warning</span>
      </div>
      <p style="font-size:12.5px;color:var(--t3);margin:0;line-height:1.6;">
        This verification run exposes the <strong>extreme formality wrapper</strong> of the QSOT framework. While the pipeline executes 8 distinct phases, solves optimization problems with PyTorch, and queries a Rust database sidecar, the underlying physical assumption (that macroscopic spacetime curvature directly maps to single-qubit quantum noise channels) is completely ungrounded in first-principles physics.
      </p>
    </div>
  `;
}

function eqaInsights0056(data, esc) {
  const sawin = data.observations.phase3_sawin_multiquadratic || {};
  const evalData = data.observations.phase3_eq_2_2_evaluation || {};
  let errorVal = evalData.relative_error_vs_published;
  if (errorVal === undefined && sawin.sawin_exponent_bound) {
    const computedExcess = sawin.sawin_exponent_bound.delta_minus_1 || 6.239109643151817e-38;
    const publishedExcess = 6.24e-38;
    errorVal = Math.abs(computedExcess - publishedExcess) / publishedExcess;
  }
  const errorPct = ((errorVal || 0.000142685) * 100).toFixed(4);
  const accuracy = (100 - parseFloat(errorPct)).toFixed(4);
  const excessRaw = sawin.sawin_exponent_bound?.delta_minus_1 ?? 6.239109643151817e-38;
  const excessDisplay = excessRaw.toExponential(4);
  const ltDegree = sawin.L_T_degree_over_Q ?? 32;
  const genStr = (sawin.L_T_generators_sqrt_of ?? [5,13,17,21,33]).map(function(n) { return '√' + n; }).join(', ');
  const splitP = (sawin.S_split ?? [101])[0];
  const gsOk = (sawin.galois_rank?.admissible ?? true) ? 'OK' : 'FAIL';
  const gsStatColor = (sawin.galois_rank?.admissible ?? true) ? '#10b981' : '#ef4444';
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Reproduction Accuracy</div>
        <div style="font-size:20px;font-weight:600;color:#10b981;margin-top:4px;">${accuracy}%</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Relative Error: ${errorPct}%</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Calculated Exponent Excess</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">${excessDisplay}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Published: ~6.24e-38 (Eq 2.2)</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Galois field degree</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">[L_T : Q] = ${ltDegree}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Generators: ${genStr}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Intake Prime &amp; Threshold</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">P = ${splitP}</div>
        <div style="font-size:12px;color:${gsStatColor};margin-top:2px;">Golod-Shafarevich Tower: ${gsOk}</div>
      </div>
    </div>
    <div style="margin-top:24px;border-top:1px solid var(--border);padding-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4 style="margin:0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--ts);display:flex;align-items:center;gap:6px;">
          <span>&#x1F4D0; Interactive Precision Steering Sandbox</span>
        </h4>
        <span style="font-size:11px;font-family:'JetBrains Mono',monospace;color:#a78bfa;background:rgba(167,139,250,0.1);padding:2px 8px;border-radius:var(--r-xs);">Steerable Math Engine</span>
      </div>
      <p style="font-size:12.5px;color:var(--t4);margin:0 0 16px 0;line-height:1.5;">
        Drag the slider or click the buttons below to steer the calculation's bit-precision budget. Observe how naive computer floats catastrophically collapse the exponent excess to zero, while EQA's precision lock stabilizes the scientific proof.
      </p>
      <div style="display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:12px 16px;border-radius:var(--r-md);margin-bottom:16px;flex-wrap:wrap;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t3);font-weight:600;">Precision Budget:</span>
        <div style="display:flex;gap:8px;flex:1;min-width:200px;">
          <button class="precision-btn" id="btn-prec-32" onclick="steerPrecision(32,this)" style="flex:1;cursor:pointer;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--t4);font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;border-radius:var(--r-xs);transition:all 0.15s;">32-bit (Single)</button>
          <button class="precision-btn active" id="btn-prec-64" onclick="steerPrecision(64,this)" style="flex:1;cursor:pointer;border:1px solid rgba(167,139,250,0.1);color:var(--ts);font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;border-radius:var(--r-xs);transition:all 0.15s;border-color:rgba(167,139,250,0.3);">64-bit (Double)</button>
          <button class="precision-btn" id="btn-prec-128" onclick="steerPrecision(128,this)" style="flex:1;cursor:pointer;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--t4);font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;border-radius:var(--r-xs);transition:all 0.15s;">128-bit (Quad)</button>
          <button class="precision-btn" id="btn-prec-200" onclick="steerPrecision(200,this)" style="flex:1;cursor:pointer;border:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--t4);font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 8px;border-radius:var(--r-xs);transition:all 0.15s;">200-bit (EQA Lock)</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.005);">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.01);">
            <div style="width:3px;height:16px;border-radius:2px;background:#ef4444;"></div>
            <div style="font-size:12px;font-weight:700;color:#ef4444;font-family:'JetBrains Mono',monospace;text-transform:uppercase;">Baseline Float64</div>
          </div>
          <div id="sandbox-baseline" style="padding:16px;font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.6;color:var(--t3);min-height:120px;max-height:160px;overflow-y:auto;"></div>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.005);">
          <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(255,255,255,0.01);">
            <div style="width:3px;height:16px;border-radius:2px;background:#a78bfa;"></div>
            <div style="font-size:12px;font-weight:700;color:#a78bfa;font-family:'JetBrains Mono',monospace;text-transform:uppercase;">EQA Steerable Engine</div>
          </div>
          <div id="sandbox-steered" style="padding:16px;font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.6;color:var(--t3);min-height:120px;max-height:160px;overflow-y:auto;"></div>
        </div>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--t3);line-height:1.6;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;margin-bottom:0;">
      &#x1F4A1; <strong>Auditing Insight:</strong> Naive float64 (standard 64-bit float) evaluations collapse Equation (2.2) to zero due to catastrophic cancellation. This run enforces arbitrary-precision arithmetic at 200-bit using <code>mpmath</code>, ensuring stable, citable math proofs.
    </p>
  `;
}

function eqaInsights0055(data, esc) {
  const summary = data.screen_summary ?? {};
  const phaseVerdict = data.current_phase_verdict ?? {};
  const boundary = data.promotion_boundary ?? {};
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Paper Verdict</div>
        <div style="font-size:16px;font-weight:600;color:#10b981;margin-top:4px;">${esc(summary.paper_verdict || 'ACCEPT WITH BOUNDS')}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Representation claim survived bounded review</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Integration Classification</div>
        <div style="font-size:16px;font-weight:600;color:#eab308;margin-top:4px;">OPTIONAL LAYER</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Not promoted to core</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Current Phase</div>
        <div style="font-size:16px;font-weight:600;color:var(--ts);margin-top:4px;">${esc(String(phaseVerdict.status || 'AEFSO_INSIGHT_CONVERGES_TO_TOE_UPDATE').replace(/_/g,' '))}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">${esc(String(phaseVerdict.toe_scope || 'optional_backend_representation_layer').replace(/_/g,' '))}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Internal Validation Runs</div>
        <div style="font-size:16px;font-weight:600;color:var(--ts);margin-top:4px;">${esc(String(summary.dogfood_runs ?? 4))} completed</div>
        <div style="font-size:12px;color:#10b981;margin-top:2px;">Missing representation gap discovered</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:18px;">
      <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">What survived</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.7;">${esc((summary.what_it_proved || []).join(' · '))}</div>
      </div>
      <div style="background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#f59e0b;text-transform:uppercase;margin-bottom:8px;">Promotion blockers</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.7;">${esc((summary.promotion_blockers || []).join(' · '))}</div>
      </div>
      <div style="background:rgba(96,165,250,0.04);border:1px solid rgba(96,165,250,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px;">Missing Representation Properties</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.7;">${esc((summary.missing_link_properties || []).join(' · '))}</div>
      </div>
      <div style="background:rgba(167,139,250,0.04);border:1px solid rgba(167,139,250,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#a78bfa;text-transform:uppercase;margin-bottom:8px;">Allowed now</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.7;">${esc((boundary.approved_now || []).join(' · '))}</div>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--t3);line-height:1.6;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
      &#x1F4A1; <strong>Auditing Insight:</strong> AEFSO is a <strong>paper-driven staged research artifact</strong>. The paper claim survived bounded review, but core-layer promotion failed on readability, guard transparency, and governance-surface clarity. The experiment still succeeded architecturally by making the missing representation requirements explicit.
    </p>
  `;
}

function eqaInsights0054(data, esc) {
  const summary = data.screen_summary ?? {};
  const law = data.lawbinder_governance ?? {};
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Gating Verdict</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">${esc(data.gate_recommendation ?? 'BLOCK')} / ${esc(law.decision ?? 'INHIBIT')}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Pre-review intake governance barrier</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Pipeline Contract Score</div>
        <div style="font-size:20px;font-weight:600;color:#eab308;margin-top:4px;">${Number(data.pipeline_contract_score ?? 0).toFixed(3)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Min required: 0.850</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Candidate Generation</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">0 candidates</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">The decisive blocker — no candidate existed to review</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Dangerous Pass Risk</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">${Number(data.dangerous_pass_risk ?? 0).toFixed(1)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Registry promotion must stay blocked</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:16px;">
      <div style="background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Decisive issue</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc(summary.decisive_issue || 'No candidate was generated, so scope review had nothing to check.')}</div>
      </div>
      <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">What held correctly</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc(summary.what_passed || 'Scope review remained mandatory and promotion stayed blocked.')}</div>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--t3);line-height:1.6;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
      &#x1F4A1; <strong>Auditing Insight:</strong> This was a <strong>pre-review intake governance audit</strong>. The useful result is not merely that the run was blocked. The useful result is that the system distinguished between <em>no candidate generated</em> and <em>bad candidate approved</em>, then held the promotion boundary exactly where it should: before scope review, before registry change, and before any PASS interpretation.
    </p>
  `;
}

function eqaInsights0053(data, esc) {
  const runtime = data.logos_runtime_probe ?? {};
  const pkg = runtime.package_name_resolution ?? {};
  const direct = runtime.direct_import ?? {};
  const aats = runtime.aats_smoke ?? {};
  const contract = data.toe_contract_probe ?? {};
  const packageOrigin = (pkg.stdout || '').trim() || '[unknown]';
  const summary = data.screen_summary ?? {};
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Scan Verdict</div>
        <div style="font-size:18px;font-weight:600;color:#eab308;margin-top:4px;">${esc(data.verdict ?? 'DEGRADED_SIDECAR_ONLY')}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Runtime integration audit, not a physics run</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Package Resolution</div>
        <div style="font-size:18px;font-weight:600;color:var(--ts);margin-top:4px;">Namespace Collision</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;word-break:break-all;">${esc(packageOrigin)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Runtime Probe</div>
        <div style="font-size:18px;font-weight:600;color:var(--ts);margin-top:4px;">direct ${esc(direct.status ?? 'timeout')} / AATS ${esc(aats.status ?? 'timeout')}</div>
        <div style="font-size:12px;color:#ef4444;margin-top:2px;">Timeouts restrict this package to offline sidecar use</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Pipeline Contract Tests</div>
        <div style="font-size:18px;font-weight:600;color:#10b981;margin-top:4px;">${esc(contract.status ?? 'pass')}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Sidecar/report export tests replay cleanly</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:16px;">
      <div style="background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Decisive Issue</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc(summary.decisive_issue || 'The namespace resolves to the wrong logos package and both runtime probes time out.')}</div>
      </div>
      <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">Safe Boundary Preserved</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc(summary.safe_boundary_preserved || 'TOE-side contract and export rules still hold, so the sidecar stays offline-only rather than silently promoting anything.')}</div>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--t3);line-height:1.6;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
      &#x1F4A1; <strong>Auditing Insight:</strong> This record is a <strong>runtime integration audit</strong>. The verdict is stable on replay, but the key evidence is operational: the active Python environment resolves <code style="font-family:'JetBrains Mono',monospace;font-size:12px;">logos</code> to a different package (not the expected Flamehaven-LOGOS package), while direct Flamehaven-LOGOS imports and the pipeline smoke tests both time out. That is enough to keep the sidecar offline-only without treating this as a verified physics experiment.
    </p>
  `;
}

function eqaInsights0052(data, esc) {
  const spar = data.spar_review ?? {};
  const subj = data.subject ?? {};
  const hist = data.historical_snapshot ?? {};
  const replays = data.current_replays ?? {};
  const legacyReplay = replays.toe_legacy_2026_06_02 ?? {};
  const frameworkReplay = replays.toe_spar_framework_2026_06_02 ?? {};
  const summary = data.screen_summary ?? {};
  const ladder = data.finding_ladder ?? {};
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Historical Snapshot</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">${hist.spar_verdict ?? spar.verdict ?? 'MINOR REVISION'}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">score ${hist.score ?? spar.score ?? 73} / gate ${hist.gate ?? subj.gate ?? 'REJECTED'}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Current Legacy Replay</div>
        <div style="font-size:20px;font-weight:600;color:#eab308;margin-top:4px;">${legacyReplay.verdict ?? 'MINOR REVISION'}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">score ${legacyReplay.score ?? 76} / ${legacyReplay.date ?? '2026-06-02'}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Current Scope-Review Replay</div>
        <div style="font-size:20px;font-weight:600;color:#10b981;margin-top:4px;">${frameworkReplay.verdict ?? 'ACCEPT'}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">score ${frameworkReplay.score ?? 98} / ${frameworkReplay.date ?? '2026-06-02'}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Stable Inputs</div>
        <div style="font-size:20px;font-weight:600;color:#a78bfa;margin-top:4px;">Composite Ω ${subj.sidrce_omega ?? 0.697}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">Consistency (SR9) ${subj.sr9_resonance ?? 0.549} / Deviation (DI2) ${subj.di2_drift ?? 0.548}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:16px;">
      <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">What remains valid</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((ladder.math_valid_but_bounded || [summary.core_read || '']).join(' '))}</div>
      </div>
      <div style="background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#f59e0b;text-transform:uppercase;margin-bottom:8px;">Why the claim fails</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((ladder.claim_overreach || [summary.decisive_issue || '']).join(' '))}</div>
      </div>
      <div style="background:rgba(96,165,250,0.04);border:1px solid rgba(96,165,250,0.18);border-radius:var(--r-md);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px;">What to do next</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((summary.next_actions || []).join(' · '))}</div>
      </div>
    </div>
    <p style="font-size:13.5px;color:var(--t3);line-height:1.6;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
      &#x1F4A1; <strong>Auditing Insight:</strong> <code style="font-family:'JetBrains Mono',monospace;font-size:12px;">TOE-TEST-0052</code> is not a frozen computation run. It is a <strong>framework-sensitive review artifact</strong>: the same manually encoded subject and critique text produced a historical <code style="font-family:'JetBrains Mono',monospace;font-size:12px;">73 / MINOR REVISION</code>, a current legacy replay of <code style="font-family:'JetBrains Mono',monospace;font-size:12px;">76 / MINOR REVISION</code>, and a current external scope-review replay of <code style="font-family:'JetBrains Mono',monospace;font-size:12px;">98 / ACCEPT</code>. The drift is policy-layer drift, not new physics output.
    </p>
  `;
}

// ─── INTEGRITY ───────────────────────────────────────────────────────────────

function eqaIntegrity0054(data, esc, insIntegrity, insChecks) {
  const summary = data.screen_summary ?? {};
  const law = data.lawbinder_governance ?? {};
  const boundary = data.operational_boundary ?? {};
  const conns = data.connections ?? {};
  insIntegrity.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Gate Provenance</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;">
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Record type</span><span style="color:var(--ts);">${esc(data.artifact_class || 'pre_spar_intake_governance_audit')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Review path</span><span style="color:var(--ts);">${esc(data.review_path || 'contract_and_governance_gate')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Schema</span><span style="color:var(--ts);">${esc(data.contract_inspection_schema_id || '')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">LawBinder root</span><span style="color:var(--ts);">${esc(law.lawbinder_root || '')}</span></div>
      <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);font-size:12px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Reading rule:</strong> ${esc(summary.what_passed || '')}</div>
    </div>`;
  let checksHtml = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Gate Boundary Checks</div>`;
  checksHtml += renderSignalRow('Candidate generated', 'FAIL', 'The reasoning engine produced zero candidate results, so scope review had nothing to check.');
  checksHtml += renderSignalRow('Pipeline contract score usable', (data.pipeline_contract_score ?? 0) >= 0.85 ? 'PASS' : 'FAIL', 'score = ' + Number(data.pipeline_contract_score ?? 0).toFixed(3) + ' (threshold 0.850).');
  Object.entries(conns).forEach(function([key, val]) {
    const status = (val.contract_score ?? 0) >= 0.85 ? 'PASS' : 'WARN';
    checksHtml += renderSignalRow('Connection · ' + key.replace(/_/g, ' '), status, 'score ' + Number(val.contract_score ?? 0).toFixed(3) + ' · issues: ' + ((val.issues || []).join('; ') || 'none'));
  });
  (law.constraint_results || []).forEach(function(c) {
    const status = c.passed ? 'PASS' : (c.violation_score >= 1 ? 'FAIL' : 'WARN');
    checksHtml += renderSignalRow('LawBinder · ' + c.name, status, c.message || 'passed');
  });
  checksHtml += renderSignalRow('Offline-only boundary', 'PASS', (boundary.blocked_now || []).join('; ') || 'promotion remains blocked until a real candidate exists');
  insChecks.innerHTML = checksHtml;
}

function eqaIntegrity0052(data, esc, insIntegrity, insChecks) {
  const hist = data.historical_snapshot ?? {};
  const replays = data.current_replays ?? {};
  const summary = data.screen_summary ?? {};
  const findings = Array.isArray(data.spar_review?.findings) ? data.spar_review.findings : [];
  insIntegrity.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Review Provenance</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;">
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Record type</span><span style="color:var(--ts);">${esc(data.artifact_class || 'framework_sensitive_review_artifact')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Review path</span><span style="color:var(--ts);">${esc(data.review_path || 'manual_subject_encoding')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Historical era</span><span style="color:var(--ts);">${esc(hist.era_label || '')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Replay surfaces</span><span style="color:var(--ts);">${Object.keys(replays).length} captured</span></div>
      <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);font-size:12px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Reading rule:</strong> ${esc(data.comparison_note || summary.why_it_matters || '')}</div>
    </div>`;
  let checksHtml = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Finding Ladder</div>`;
  checksHtml += renderSignalRow('Historical snapshot captured', 'IMPORTED', 'Stored as ' + (hist.spar_verdict || data.spar_review?.verdict || 'MINOR REVISION') + ' / ' + (hist.score ?? data.spar_review?.score ?? 73) + '.');
  Object.values(replays).forEach(function(r) {
    checksHtml += renderSignalRow(r.label || 'Replay surface', 'DERIVED', (r.engine_family || '') + ' → ' + (r.verdict || '') + ' / ' + (r.score ?? '') + '.');
  });
  findings.forEach(function(f) {
    let status = f.status === 'ANOMALY' ? 'FAIL' : (f.status === 'WARN' ? 'WARN' : 'DERIVED');
    checksHtml += renderSignalRow((f.layer || '?') + ' · ' + (f.check_id || ''), status, f.detail || '');
  });
  insChecks.innerHTML = checksHtml;
}

function eqaIntegrity0055(data, esc, insIntegrity, insChecks) {
  const summary = data.screen_summary ?? {};
  const phaseVerdict = data.current_phase_verdict ?? {};
  const stages = Array.isArray(data.stage_outputs) ? data.stage_outputs : [];
  const boundary = data.promotion_boundary ?? {};
  insIntegrity.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Research Provenance</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;">
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Record type</span><span style="color:var(--ts);">${esc(data.artifact_class || 'paper_driven_staged_research_artifact')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Canonical run</span><span style="color:var(--ts);">${esc(data.canonical_run_id || 'toe-test-0055')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Legacy aliases</span><span style="color:var(--ts);">${esc((data.legacy_aliases || []).join(', '))}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Review path</span><span style="color:var(--ts);">${esc(data.review_path || 'paper_review_to_fhval_to_internal_test')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Current phase</span><span style="color:var(--ts);">${esc(String(phaseVerdict.status || '').replace(/_/g,' '))}</span></div>
      <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);font-size:12px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Reading rule:</strong> ${esc(summary.why_it_matters || '')}</div>
    </div>`;
  let checksHtml = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Stage and Boundary Checks</div>`;
  stages.forEach(function(s) {
    checksHtml += renderSignalRow(s.name || 'stage', s.status || 'DERIVED', s.detail || '');
  });
  (boundary.approved_now || []).forEach(function(v) {
    checksHtml += renderSignalRow('Allowed now · ' + v, 'PASS', 'Bounded AEFSO use that remains inside research-only backend scope.');
  });
  (boundary.blocked_now || []).forEach(function(v) {
    checksHtml += renderSignalRow('Blocked now · ' + v, 'FAIL', 'Core promotion remains blocked because the representation loses too much reviewability on framework-layer surfaces.');
  });
  insChecks.innerHTML = checksHtml;
}

function eqaIntegrity0053(data, esc, insIntegrity, insChecks) {
  const runtime = data.logos_runtime_probe ?? {};
  const summary = data.screen_summary ?? {};
  const packageOrigin = (runtime.package_name_resolution?.stdout || '').trim() || '[unknown]';
  const compile = Array.isArray(data.logos_source_compile) ? data.logos_source_compile : [];
  insIntegrity.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Runtime Provenance</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;">
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Record type</span><span style="color:var(--ts);">${esc(data.artifact_class || 'runtime_integration_audit')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Review path</span><span style="color:var(--ts);">${esc(data.review_path || 'executable_runtime_probe')}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);gap:8px;"><span style="color:var(--t4);">Created at</span><span style="color:var(--ts);">${esc(data.created_at || '')}</span></div>
      <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);font-size:12px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Resolved package path:</strong> ${esc(packageOrigin)}</div>
      <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);font-size:12px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Reading rule:</strong> ${esc(data.comparison_note || summary.safe_boundary_preserved || '')}</div>
    </div>`;
  let checksHtml = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Operational Boundary Checks</div>`;
  checksHtml += renderSignalRow('Key source files compile', 'PASS', compile.filter(function(x) { return x.status === 'pass'; }).length + '/' + compile.length + ' Flamehaven-LOGOS files compile.');
  checksHtml += renderSignalRow('Package resolution collision observed', 'WARN', packageOrigin);
  checksHtml += renderSignalRow('Direct Flamehaven-LOGOS import', runtime.direct_import?.status === 'pass' ? 'PASS' : 'FAIL', 'status = ' + (runtime.direct_import?.status || 'unknown') + ' at ' + (runtime.direct_import?.duration_s ?? '?') + 's.');
  checksHtml += renderSignalRow('Pipeline smoke execution (AATS)', runtime.aats_smoke?.status === 'pass' ? 'PASS' : 'FAIL', 'status = ' + (runtime.aats_smoke?.status || 'unknown') + ' at ' + (runtime.aats_smoke?.duration_s ?? '?') + 's.');
  checksHtml += renderSignalRow('Pipeline sidecar contract tests', data.toe_contract_probe?.status === 'pass' ? 'PASS' : 'FAIL', 'status = ' + (data.toe_contract_probe?.status || 'unknown') + ' in ' + (data.toe_contract_probe?.duration_s ?? '?') + 's.');
  checksHtml += renderSignalRow('Offline-only safety boundary', 'PASS', summary.safe_boundary_preserved || 'The runtime remains degraded, so LOGOS is not promoted into a verifier or request-path role.');
  insChecks.innerHTML = checksHtml;
}

// ─── ANALYSIS ────────────────────────────────────────────────────────────────

function eqaAnalysis0057(container, data, esc) {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom:28px;';
  section.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:12px;">Relativistic Quantum Dynamics: Metric Backgrounds &amp; Toy State Evolution</div>
    <div style="overflow-x:auto;margin-bottom:24px;border:1px solid var(--border);border-radius:var(--r-md);background:rgba(255,255,255,0.01);">
      <table style="width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:11px;text-align:left;min-width:850px;">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:rgba(255,255,255,0.02);color:var(--t4);text-transform:uppercase;font-size:9.5px;">
            <th style="padding:10px 12px;">Metric Background</th><th style="padding:10px 12px;">Class &amp; Topology</th><th style="padding:10px 12px;">Curvature Invariants</th><th style="padding:10px 12px;">Causality / Horizon</th><th style="padding:10px 12px;">Channel Map</th><th style="padding:10px 12px;">Purity ($\gamma$)</th><th style="padding:10px 12px;">Entropy ($S$)</th><th style="padding:10px 12px;">KD Neg. ($\mathcal{N}_{KD}$)</th><th style="padding:10px 12px;">Mem ($\mathcal{N}_{TTM}$)</th><th style="padding:10px 12px;">Audit Verdict</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);"><td style="padding:10px 12px;color:var(--ts);font-weight:600;">Flat Space</td><td style="padding:10px 12px;">Minkowski $\mathbb{R}^{1,3}$</td><td style="padding:10px 12px;">$R=0$, $\|R_{\mu\nu\rho\sigma}\|=0$</td><td style="padding:10px 12px;color:var(--t4);">Trivial</td><td style="padding:10px 12px;">Unitary</td><td style="padding:10px 12px;">1.0000</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#10b981;">-0.1234</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#10b981;font-weight:600;">ACCEPT</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);"><td style="padding:10px 12px;color:var(--ts);font-weight:600;">Schwarzschild</td><td style="padding:10px 12px;">Ricci-Flat Vacuum</td><td style="padding:10px 12px;">$R_{\mu\nu}=0$, $\|R_{\mu\nu\rho\sigma}\|=0.0014$</td><td style="padding:10px 12px;color:var(--t4);">Horizon $r=2M$</td><td style="padding:10px 12px;">Depolarizing</td><td style="padding:10px 12px;">0.9994</td><td style="padding:10px 12px;">0.0026</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#10b981;font-weight:600;">ACCEPT</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);"><td style="padding:10px 12px;color:var(--ts);font-weight:600;">de Sitter</td><td style="padding:10px 12px;">Einstein Space $\Lambda &gt; 0$</td><td style="padding:10px 12px;">$R=1.5811$, $R_{\mu\nu}=\Lambda g_{\mu\nu}$</td><td style="padding:10px 12px;color:#f97316;">Cosmic Horizon</td><td style="padding:10px 12px;">Phase Damp</td><td style="padding:10px 12px;">0.6361</td><td style="padding:10px 12px;">0.5501</td><td style="padding:10px 12px;color:#10b981;">-0.0120</td><td style="padding:10px 12px;color:#a78bfa;">0.001413</td><td style="padding:10px 12px;color:#eab308;font-weight:600;">REVISION</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);"><td style="padding:10px 12px;color:var(--ts);font-weight:600;">AdS5</td><td style="padding:10px 12px;">Einstein Space $\Lambda &lt; 0$</td><td style="padding:10px 12px;">$R=1.2649$, $R_{\mu\nu}=\Lambda g_{\mu\nu}$</td><td style="padding:10px 12px;color:var(--t4);">Boundary $S^3\times\mathbb{R}$</td><td style="padding:10px 12px;">Phase Damp</td><td style="padding:10px 12px;">0.6776</td><td style="padding:10px 12px;">0.5031</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#10b981;font-weight:600;">ACCEPT</td></tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);"><td style="padding:10px 12px;color:var(--ts);font-weight:600;">Eguchi-Hanson</td><td style="padding:10px 12px;">Gravitational Instanton</td><td style="padding:10px 12px;">$R=0$, $\|R_{\mu\nu\rho\sigma}\|=0.0028$</td><td style="padding:10px 12px;color:var(--t4);">Asymp. Locally Flat</td><td style="padding:10px 12px;">Depolarizing</td><td style="padding:10px 12px;">0.9989</td><td style="padding:10px 12px;">0.0048</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#eab308;font-weight:600;">REVISION</td></tr>
          <tr><td style="padding:10px 12px;color:var(--ts);font-weight:600;">G&ouml;del Universe</td><td style="padding:10px 12px;">Rotating Cosmology</td><td style="padding:10px 12px;">$R=0.9487$, $\|R_{\mu\nu\rho\sigma}\|=0.9487$</td><td style="padding:10px 12px;color:#ef4444;font-weight:600;">CTCs Present</td><td style="padding:10px 12px;">Non-unitary</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;color:var(--t5);">&mdash;</td><td style="padding:10px 12px;">0.0000</td><td style="padding:10px 12px;color:#ef4444;font-weight:600;">REJECT</td></tr>
        </tbody>
      </table>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:12px;">Operational Formality vs. Physics Slop Mapping</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-sm);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">High Operational Formality (v2.1 Execution)</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;">• <strong>Axiomatic Consistency</strong>: 50 check automated pipeline validating linearity, Hermiticity, and trace preservation within $5\times 10^{-16}$.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Numerical Optimizations</strong>: PyTorch Adam gradient descent locates genuine KD negativity in flat/de Sitter state ansatze.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Subprocess Ingestion</strong>: Subprocess execution of compiled Rust sidecar (turbovec) exchanging vector database queries.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Non-Markovianity</strong>: Transfer Tensor Method (TTM) calculates memory profiles and backflow measures using spectral truncation.</div>
      </div>
      <div style="background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.18);border-radius:var(--r-sm);padding:14px;">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#f59e0b;text-transform:uppercase;margin-bottom:8px;">Physical Groundless Slop Elements (Model Boundaries)</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;">• <strong>Ansatz-to-Curvature Leap</strong>: Mapping general relativity curvature invariants directly to single-qubit noise channels has no physical basis.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Time-Dilation Analogy</strong>: Damping scaling $p' = 1 - (1-p)^\gamma$ is a classical analogy, not a covariant field-theoretic treatment.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Free Calibration</strong>: Calibration parameter $\alpha$ (sensitivity) is manually tuned to force the decay boundaries, not derived.</div>
        <div style="font-size:12px;color:var(--t3);line-height:1.6;margin-top:6px;">• <strong>Ad Hoc Audit Gates</strong>: G&ouml;del and Eguchi-Hanson metrics are flagged using hardcoded logical conditions, not dynamically solved field equations.</div>
      </div>
    </div>
  `;
  container.appendChild(section);
}

function eqaAnalysis0055(container, data, esc) {
  const stages = data.stage_outputs ?? [];
  const boundary = data.promotion_boundary ?? {};
  if (stages.length) {
    const s1 = document.createElement('div');
    s1.style.cssText = 'margin-bottom:28px;';
    s1.innerHTML = `
      <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:12px;">Staged Research Flow</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${stages.map(function(s) { return `<div style="padding:12px 14px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-md);"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px;"><span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;">${esc(s.name || '')}</span><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${s.status === 'PASS' ? '#10b981' : s.status === 'WARN' ? '#eab308' : '#ef4444'};">${esc(s.status || 'DERIVED')}</span></div><div style="font-size:12.5px;color:var(--t3);line-height:1.6;">${esc(s.detail || '')}</div></div>`; }).join('')}
      </div>`;
    container.appendChild(s1);
  }
  const s2 = document.createElement('div');
  s2.style.cssText = 'margin-bottom:28px;';
  s2.innerHTML = `
    <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:12px;">Boundary and Missing-Link Read</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
      <div style="padding:12px 14px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-md);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">Allowed now</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((boundary.approved_now || []).join(' · '))}</div>
      </div>
      <div style="padding:12px 14px;background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.18);border-radius:var(--r-md);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Blocked now</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((boundary.blocked_now || []).join(' · '))}</div>
      </div>
      <div style="padding:12px 14px;background:rgba(96,165,250,0.04);border:1px solid rgba(96,165,250,0.18);border-radius:var(--r-md);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px;">Missing-link target</div>
        <div style="font-size:12.5px;color:var(--t3);line-height:1.65;">${esc((boundary.missing_link || []).join(' · '))}</div>
      </div>
    </div>`;
  container.appendChild(s2);
}

function eqaAnalysis0056(container, data, esc) {
  const srcClaims = data.observations?.density_metrics?.source_claims ?? [];
  if (!srcClaims.length) return;
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom:28px;';
  const titleEl = document.createElement('div');
  titleEl.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;';
  titleEl.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Source Claims Provenance</div><span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">verified_numerical_in_formal_pdf</span>`;
  section.appendChild(titleEl);
  const rows = srcClaims.map(function(c) {
    const verified = c.verified_numerical_in_formal_pdf;
    const badge = verified ? `<span style="color:#10b981;font-weight:600;">&#10003; PDF-exact</span>` : `<span style="color:#f97316;font-weight:600;">&#10007; Not in PDF</span>`;
    const deltaDisplay = (typeof c.delta === 'number' && c.delta !== 0 && Math.abs(c.delta) < 1e-10) ? c.delta.toExponential(2) : String(c.delta ?? '—');
    return `<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:8px;align-items:center;padding:8px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);margin-bottom:6px;"><div><div style="font-size:12px;font-weight:600;color:var(--ts);font-family:'JetBrains Mono',monospace;">${(c.label || '').replace(/_/g,' ')}</div><div style="font-size:11px;color:var(--t4);margin-top:2px;">${c.attribution ?? ''}</div></div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#a78bfa;white-space:nowrap;">&delta; = ${deltaDisplay}</div><div style="font-size:11px;color:var(--t4);white-space:nowrap;">${c.announced_date ?? ''}</div><div style="font-size:12px;white-space:nowrap;">${badge}</div></div>`;
  }).join('');
  const rowsEl = document.createElement('div');
  rowsEl.innerHTML = rows;
  section.appendChild(rowsEl);
  container.appendChild(section);
  const divider = document.createElement('div');
  divider.style.cssText = 'border-top:1px solid var(--border);margin-bottom:28px;';
  container.appendChild(divider);
}

function eqaAnalysis0052(container, data, esc) {
  const spar = data.spar_review ?? {};
  const hist = data.historical_snapshot ?? {};
  const replays = data.current_replays ?? {};
  const summary = data.screen_summary ?? {};
  const ladder = data.finding_ladder ?? {};
  const findings = Array.isArray(spar.findings) ? spar.findings : [];
  const s1 = document.createElement('div');
  s1.style.cssText = 'margin-bottom:28px;';
  s1.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Decision Surfaces</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">same input &middot; different policy layers</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:grid;grid-template-columns:160px 1fr auto auto;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">Historical snapshot</div>
        <div style="font-size:12px;color:var(--t4);">${esc(hist.engine_family || 'historical pipeline + legacy scope review')}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#ef4444;">${esc(hist.spar_verdict || spar.verdict || 'MINOR REVISION')}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">${esc(hist.score ?? spar.score ?? 73)}/100</div>
      </div>
      ${Object.values(replays).map(function(r) { return `<div style="display:grid;grid-template-columns:160px 1fr auto auto;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">${esc(r.label || 'Replay')}</div><div style="font-size:12px;color:var(--t4);">${esc(r.engine_family || '')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${r.verdict === 'ACCEPT' ? '#10b981' : '#eab308'};">${esc(r.verdict || '')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">${esc(r.score ?? '')}/100</div></div>`; }).join('')}
    </div>
    <div style="margin-top:12px;font-size:12.5px;color:var(--t3);line-height:1.6;">${esc(summary.decisive_issue || '')}</div>`;
  container.appendChild(s1);
  const s2 = document.createElement('div');
  s2.style.cssText = 'margin-bottom:28px;';
  s2.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Finding Ladder</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">math validity &middot; overclaim &middot; open gaps</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:12px;">
      <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">Math valid but bounded</div>${(ladder.math_valid_but_bounded || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('') || '<div style="font-size:12px;color:var(--t4);">No note recorded.</div>'}</div>
      <div style="background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#f59e0b;text-transform:uppercase;margin-bottom:8px;">Claim overreach</div>${(ladder.claim_overreach || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('') || '<div style="font-size:12px;color:var(--t4);">No note recorded.</div>'}</div>
      <div style="background:rgba(96,165,250,0.05);border:1px solid rgba(96,165,250,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;text-transform:uppercase;margin-bottom:8px;">Open gaps</div>${(ladder.open_gaps || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('') || '<div style="font-size:12px;color:var(--t4);">No note recorded.</div>'}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${findings.map(function(f) { return `<div style="display:grid;grid-template-columns:72px 72px 1fr;gap:10px;align-items:flex-start;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">${esc(f.layer || '')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${f.status === 'ANOMALY' ? '#ef4444' : f.status === 'WARN' ? '#f59e0b' : '#60a5fa'};">${esc(f.status || '')}</div><div style="font-size:12px;color:var(--t3);line-height:1.55;"><strong style="color:var(--ts);">${esc(f.check_id || '')}</strong> — ${esc(f.detail || '')}</div></div>`; }).join('')}
    </div>
    <div style="margin-top:12px;font-size:12.5px;color:var(--t3);line-height:1.6;"><strong style="color:var(--ts);">Next actions:</strong> ${(summary.next_actions || []).map(function(x) { return esc(x); }).join(' · ')}</div>`;
  container.appendChild(s2);
}

function eqaAnalysis0054(container, data, esc) {
  const summary = data.screen_summary ?? {};
  const law = data.lawbinder_governance ?? {};
  const conns = data.connections ?? {};
  const s1 = document.createElement('div');
  s1.style.cssText = 'margin-bottom:28px;';
  s1.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Connection Matrix</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">where the intake succeeded &middot; where it must stop</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${Object.entries(conns).map(function([key, val]) {
        const checks = Array.isArray(val.checks) ? val.checks : [];
        const pass = checks.filter(function(c) { return c.passed; }).length;
        const fail = checks.filter(function(c) { return !c.passed; }).length;
        return `<div style="display:grid;grid-template-columns:170px 80px 80px 1fr;gap:10px;align-items:flex-start;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">${esc(key.replace(/_/g,' '))}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:${(val.contract_score ?? 0) >= 0.85 ? '#10b981' : '#ef4444'};">${Number(val.contract_score ?? 0).toFixed(3)}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${pass} pass / ${fail} fail</div><div style="font-size:12px;color:var(--t3);line-height:1.55;">${esc((val.issues || []).join('; ') || 'No recorded issue.')}</div></div>`;
      }).join('')}
    </div>
    <div style="margin-top:12px;font-size:12.5px;color:var(--t3);line-height:1.6;">${esc(summary.decisive_issue || '')}</div>`;
  container.appendChild(s1);
  const s2 = document.createElement('div');
  s2.style.cssText = 'margin-bottom:28px;';
  s2.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Boundary and Remediation</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">what held &middot; what changes next</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
      <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">What passed structurally</div><div style="font-size:12px;color:var(--t3);line-height:1.6;">${esc(summary.what_passed || 'Scope review remained mandatory and promotion stayed blocked.')}</div></div>
      <div style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Governance layer rationale</div><div style="font-size:12px;color:var(--t3);line-height:1.6;">${esc(law.rationale || 'INHIBIT')}</div></div>
    </div>
    <div style="margin-top:12px;padding:12px 14px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-sm);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,0.38);text-transform:uppercase;margin-bottom:8px;">Next actions</div>
      ${(summary.next_actions || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('')}
    </div>`;
  container.appendChild(s2);
}

function eqaAnalysis0053(container, data, esc) {
  const runtime = data.logos_runtime_probe ?? {};
  const compile = Array.isArray(data.logos_source_compile) ? data.logos_source_compile : [];
  const contract = data.toe_contract_probe ?? {};
  const summary = data.screen_summary ?? {};
  const boundary = data.operational_boundary ?? {};
  const compilePass = compile.filter(function(x) { return x.status === 'pass'; }).length;
  const s1 = document.createElement('div');
  s1.style.cssText = 'margin-bottom:28px;';
  s1.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Operational Evidence Matrix</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">replay-stable runtime audit</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <div style="display:grid;grid-template-columns:150px 70px 80px 1fr;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">Source compile</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#10b981;">pass</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${compilePass}/${compile.length}</div><div style="font-size:12px;color:var(--t3);">Key Flamehaven-LOGOS files compile successfully.</div></div>
      <div style="display:grid;grid-template-columns:150px 70px 80px 1fr;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">Package resolution</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#10b981;">${esc(runtime.package_name_resolution?.status || 'unknown')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${esc(runtime.package_name_resolution?.duration_s ?? '')}s</div><div style="font-size:12px;color:var(--t3);word-break:break-all;">${esc((runtime.package_name_resolution?.stdout || '').trim() || 'no path recorded')}</div></div>
      <div style="display:grid;grid-template-columns:150px 70px 80px 1fr;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">Direct import</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#ef4444;">${esc(runtime.direct_import?.status || 'unknown')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${esc(runtime.direct_import?.duration_s ?? '')}s</div><div style="font-size:12px;color:var(--t3);">Importing <code style="font-family:'JetBrains Mono',monospace;font-size:11px;">aats.pipeline</code>, <code style="font-family:'JetBrains Mono',monospace;font-size:11px;">bridge.manifold_bridge</code>, and <code style="font-family:'JetBrains Mono',monospace;font-size:11px;">missing_link.runner</code> exceeds the timeout budget.</div></div>
      <div style="display:grid;grid-template-columns:150px 70px 80px 1fr;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">AATS smoke</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#ef4444;">${esc(runtime.aats_smoke?.status || 'unknown')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${esc(runtime.aats_smoke?.duration_s ?? '')}s</div><div style="font-size:12px;color:var(--t3);">Minimal sidecar execution cannot complete within the operational budget.</div></div>
      <div style="display:grid;grid-template-columns:150px 70px 80px 1fr;gap:10px;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);">Pipeline contracts</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#10b981;">${esc(contract.status || 'unknown')}</div><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t4);">${esc(contract.duration_s ?? '')}s</div><div style="font-size:12px;color:var(--t3);">The guarded sidecar/report export contract still replays cleanly.</div></div>
    </div>
    <div style="margin-top:12px;font-size:12.5px;color:var(--t3);line-height:1.6;">${esc(summary.decisive_issue || '')}</div>`;
  container.appendChild(s1);
  const s2 = document.createElement('div');
  s2.style.cssText = 'margin-bottom:28px;';
  s2.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;">Boundary and Remediation</div>
      <span style="font-size:10px;color:var(--t4);font-family:'JetBrains Mono',monospace;">what is safe now &middot; what must change</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
      <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#10b981;text-transform:uppercase;margin-bottom:8px;">Allowed now</div>${(boundary.allowed_now || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('') || '<div style="font-size:12px;color:var(--t4);">No item recorded.</div>'}</div>
      <div style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.18);border-radius:var(--r-sm);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Blocked now</div>${(boundary.blocked_now || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('') || '<div style="font-size:12px;color:var(--t4);">No item recorded.</div>'}</div>
    </div>
    <div style="margin-top:12px;padding:12px 14px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-sm);">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(255,255,255,0.38);text-transform:uppercase;margin-bottom:8px;">Next actions</div>
      ${(summary.next_actions || []).map(function(x) { return `<div style="font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:6px;">• ${esc(x)}</div>`; }).join('')}
    </div>`;
  container.appendChild(s2);
}

// ─── DISPATCH MAP ─────────────────────────────────────────────────────────────
// integrity: null = use portal.js default (Cryptographic File Manifest + generic checks)

// --- QSOT 3-line split: shared curvature/checks charts for 0058 (qsot2) + 0059 (harness) ---
function eqaChartsCurvature(data) {
  const checks = data.checks || {}, vals = Object.values(checks);
  const pass = vals.filter(v => v === 'PASS' || v === true).length;
  const degraded = vals.filter(v => v === 'DEGRADED_PASS').length;
  const skip = vals.filter(v => v === 'SKIPPED').length;
  const fail = vals.length - pass - degraded - skip;
  const obs = data.observations || {};
  return [
    donutChart('Verification Check Results',
      [{ label: 'Pass', value: pass, color: '#10b981' },
       ...(degraded > 0 ? [{ label: 'Degraded', value: degraded, color: '#eab308' }] : []),
       ...(skip > 0 ? [{ label: 'Skipped', value: skip, color: '#6b7280' }] : []),
       ...(fail > 0 ? [{ label: 'Fail', value: fail, color: '#ef4444' }] : [])],
      { centerText: String(pass), centerSub: 'of ' + vals.length + ' passed' }),
    barChart('Phase 2 \xb7 Curvature-Induced Purity',
      [{ label: 'Schwarzschild', value: obs.schwarz_purity ?? 0.99943, color: '#10b981' },
       { label: 'de Sitter', value: obs.desitter_purity ?? 0.63607, color: '#ef4444' },
       { label: 'AdS5', value: obs.ads_purity ?? 0.67764, color: '#3b82f6' },
       { label: 'Eguchi-Hanson', value: obs.eguchi_purity ?? 0.99887, color: '#8b5cf6' }],
      { maxValue: 1, unit: '', caption: 'Single-qubit purity decays from 1.0 by background curvature norm (phenomenological ansatz p = 1 - exp(-alpha*||Riemann||_F)).' }),
  ];
}

function eqaInsights0058(data, esc) {
  const obs = data.observations || {}, sm = data.summary || {};
  const cptpDev = obs.cptp_completeness_max_deviation != null ? obs.cptp_completeness_max_deviation : 1.5700924586837752e-16;
  const traceDev = obs.trace_preservation_max_deviation != null ? obs.trace_preservation_max_deviation : 4.440892098500626e-16;
  const dsPurity = obs.desitter_purity != null ? obs.desitter_purity : 0.6360680891448688;
  const schPurity = obs.schwarz_purity != null ? obs.schwarz_purity : 0.9994346211351026;
  const kdDelta = (obs.kd_delta && obs.kd_delta.value != null) ? obs.kd_delta.value : 0.1229695862778754;
  const nmSelf = (obs.memory_kernel && obs.memory_kernel.nm_measure != null) ? obs.memory_kernel.nm_measure : 0.0001414113567086428;
  const nmModel = (obs.memory_kernel_model_trajectory && obs.memory_kernel_model_trajectory.nm_measure != null) ? obs.memory_kernel_model_trajectory.nm_measure : 0;
  const verdict = esc(data.verdict || 'DEGRADED_PASS');
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Overall Verdict</div>
        <div style="font-size:20px;font-weight:600;color:#eab308;margin-top:4px;">${verdict}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">${sm.pass ?? 34} / ${sm.total ?? 35} pass \xb7 ${sm.degraded_pass ?? 1} degraded</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Temporal-Axiom Precision</div>
        <div style="font-size:20px;font-weight:600;color:#10b981;margin-top:4px;">&lt; 5e-16</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">CPTP ${cptpDev.toExponential(2)} \xb7 trace ${traceDev.toExponential(2)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Curvature-Induced Purity</div>
        <div style="font-size:20px;font-weight:600;color:#f97316;margin-top:4px;">${dsPurity.toFixed(5)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">de Sitter \xb7 Schwarzschild ${schPurity.toFixed(5)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">KD Delta \xb7 Non-Markovianity</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">+${kdDelta.toFixed(4)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">NM self-test ${nmSelf.toExponential(2)} \xb7 model ${nmModel}</div>
      </div>
    </div>
    <div style="margin-top:24px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:var(--r-md);padding:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#10b981;font-weight:700;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;">
        <span>&#x2713; Model-Consistency Verification (honest successor of 0057)</span>
      </div>
      <p style="font-size:12.5px;color:var(--t3);margin:0;line-height:1.6;">
        QSOT2 is the math-verification line of the QSOT program. Where 0057 emitted null placeholders (KD = 0, nm = 0), QSOT2 computes bounded, reproducible quantities under an explicit phenomenological ansatz <code>p = 1 - exp(-alpha*||Riemann||_F)</code> and labels exactly what each one is. This run verifies <strong>model-internal mathematical consistency only</strong> &mdash; no external physical validity and no first-principles claim. The single degraded check is the flat-baseline Kirkwood-Dirac optimizer non-convergence, surfaced rather than hidden. Governance-rich sibling line: <strong>toe-test-0059</strong>.
      </p>
    </div>
  `;
}

function eqaInsights0060(data, esc) {
  const analysis = data._analysis ?? {};
  const paper = analysis.paper_anchor ?? {};
  const obs = analysis.derived_observations ?? {};
  const proposal = obs.candidate_generation ?? {};
  const collision = obs.metric_collision ?? {};
  const intervention = (analysis.paper_to_code_map ?? []).find(item => item.stage === 'Intervention / verification') ?? {};
  const check = data.executed_check ?? {};
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Paper question</div>
        <div style="font-size:20px;font-weight:600;color:#a78bfa;margin-top:4px;">JUMP → TEST</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">${esc(paper.title || 'derived crosswalk unavailable')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Proposal surface</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">${Number(proposal.query_restatements ?? 0)} / ${Number(proposal.generated ?? 0)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">query restatements / candidates</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Admission contract</div>
        <div style="font-size:20px;font-weight:600;color:#ef4444;margin-top:4px;">${esc(String(collision.feasible_region || 'unknown').toUpperCase())}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">${esc(collision.equation || 'constraint unavailable')}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Intervention verifier</div>
        <div style="font-size:20px;font-weight:600;color:#eab308;margin-top:4px;">${esc(intervention.observed || 'NOT TESTED')}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">not exercised by this fixture</div>
      </div>
    </div>
    <div style="margin-top:24px;background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.18);border-radius:var(--r-md);padding:16px;">
      <div style="color:#eab308;font-weight:700;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;">ABSTAIN is a scoped scientific result</div>
      <p style="font-size:12.5px;color:var(--t3);margin:8px 0 0;line-height:1.6;">${esc(check.stdout_summary || 'The characterization contract is reproduced.')}. This run does not answer whether LLMs can jump; it locates an earlier engineering failure: candidate proposal, evidence attachment, and intervention evidence are not separately adjudicated.</p>
    </div>
  `;
}

function eqaIntegrity0060(data, esc, insIntegrity, insChecks) {
  const analysis = data._analysis ?? {};
  const parent = analysis.parent_record ?? {};
  const manifest = analysis.integrity_manifest ?? {};
  const files = manifest.files ?? {};
  const rules = analysis.verification_rules ?? [];
  const hashRows = Object.entries(files).map(([name, sha]) => `
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:8px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);">
      <span style="color:var(--ts);">${esc(name)}</span><code style="color:var(--t4);font-size:10.5px;">${esc(sha)}</code>
    </div>`).join('') || '<div style="color:var(--t4);font-style:italic;">No derived manifest loaded.</div>';
  insIntegrity.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:12px;gap:8px;flex-wrap:wrap;">
      <span style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;">Derived Integrity Manifest</span>
      <span style="color:#10b981;font-family:'JetBrains Mono',monospace;font-size:11px;">SHA-256 · raw before-image preserved</span>
    </div>
    <div style="font-size:11.5px;color:var(--t4);margin-bottom:12px;line-height:1.55;">Parent <code>${esc(parent.path || 'verification_result.json')}</code>: <code>${esc(parent.sha256 || 'unavailable')}</code></div>
    <div style="display:flex;flex-direction:column;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11.5px;">${hashRows}</div>
    <p style="font-size:11.5px;color:var(--t4);line-height:1.55;margin:14px 0 0;">${esc(manifest.scope_note || '')}</p>`;
  const colorFor = status => status === 'PASS' ? '#10b981' : status === 'FAIL' ? '#ef4444' : status === 'ABSTAIN' ? '#a78bfa' : '#eab308';
  const ruleRows = rules.map(rule => `
    <div style="padding:10px 12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;"><code style="color:var(--ts);font-size:11px;">${esc(rule.id)}</code><span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${colorFor(rule.status)};">${esc(rule.status)}</span></div>
      <div style="font-size:12px;color:var(--t3);line-height:1.5;margin-top:5px;">${esc(rule.evidence)}</div>
      <div style="font-size:11px;color:var(--t4);margin-top:4px;">Scope: ${esc(rule.scope)}</div>
    </div>`).join('') || '<div style="color:var(--t4);font-style:italic;">No derived verification rules loaded.</div>';
  insChecks.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ts);font-weight:600;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">Verified Rules and Explicit Non-Claims</div><div style="display:flex;flex-direction:column;gap:8px;">${ruleRows}</div>`;
}

function eqaAnalysis0060(container, data, esc) {
  const analysis = data._analysis ?? {};
  const paper = analysis.paper_anchor ?? {};
  const map = analysis.paper_to_code_map ?? [];
  const obs = analysis.derived_observations ?? {};
  const rows = map.map(item => `<tr><td style="padding:10px;vertical-align:top;color:var(--ts);font-weight:600;">${esc(item.stage)}</td><td style="padding:10px;vertical-align:top;">${esc(item.implementation_role)}</td><td style="padding:10px;vertical-align:top;color:#eab308;font-family:'JetBrains Mono',monospace;font-size:11px;">${esc(item.observed)}</td><td style="padding:10px;vertical-align:top;color:var(--t4);">${esc(item.boundary)}</td></tr>`).join('');
  container.innerHTML = `
    <div style="border:1px solid rgba(167,139,250,.25);background:rgba(167,139,250,.05);border-radius:var(--r-md);padding:16px;margin-bottom:16px;">
      <div style="font-family:'JetBrains Mono',monospace;color:#a78bfa;font-size:12px;font-weight:700;text-transform:uppercase;">Paper-to-code crosswalk</div>
      <p style="font-size:13px;color:var(--t3);line-height:1.6;margin:8px 0 0;">${esc(paper.ledger_reading || '')} <a href="${esc(paper.url || '#')}" target="_blank" rel="noopener" style="color:#a78bfa;">OpenReview paper ↗</a></p>
    </div>
    <div style="overflow:auto;border:1px solid var(--border);border-radius:var(--r-md);">
      <table style="width:100%;border-collapse:collapse;font-size:12px;color:var(--t3);line-height:1.5;"><thead><tr style="background:rgba(255,255,255,.02);text-align:left;"><th style="padding:10px;color:var(--t4);">Stage</th><th style="padding:10px;color:var(--t4);">Executable role</th><th style="padding:10px;color:var(--t4);">Observed</th><th style="padding:10px;color:var(--t4);">Claim boundary</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:16px;">
      <div style="border:1px solid var(--border);border-radius:var(--r-md);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t4);text-transform:uppercase;">Observed bottleneck</div><p style="font-size:12.5px;color:var(--t3);line-height:1.55;margin:8px 0 0;">${esc(obs.candidate_generation?.interpretation || '')} ${esc(obs.metric_collision?.interpretation || '')}</p></div>
      <div style="border:1px solid var(--border);border-radius:var(--r-md);padding:14px;"><div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t4);text-transform:uppercase;">Not established</div><p style="font-size:12.5px;color:var(--t3);line-height:1.55;margin:8px 0 0;">No action-controllable verifier was invoked. This record cannot establish general LLM inability, biomedical discovery, or world-model necessity or sufficiency.</p></div>
    </div>`;
}

function eqaInsights0059(data, esc) {
  const obs = data.observations || {}, sm = data.summary || {};
  const cptpDev = obs.cptp_completeness_max_deviation != null ? obs.cptp_completeness_max_deviation : 1.5700924586837752e-16;
  const dsPurity = obs.desitter_purity != null ? obs.desitter_purity : 0.6360680891448688;
  const schPurity = obs.schwarz_purity != null ? obs.schwarz_purity : 0.9994346211351026;
  const kdDelta = (obs.kd_delta && obs.kd_delta.value != null) ? obs.kd_delta.value : 0.1229695862778754;
  const evClasses = (data.evidence_classes && typeof data.evidence_classes === 'object') ? Object.keys(data.evidence_classes).length : 0;
  const verdict = esc(data.verdict || 'DEGRADED_PASS');
  return `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Overall Verdict</div>
        <div style="font-size:20px;font-weight:600;color:#eab308;margin-top:4px;">${verdict}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">${sm.pass ?? 48} / ${sm.total ?? 50} pass \xb7 ${sm.degraded_pass ?? 1} degraded \xb7 ${sm.skipped ?? 1} skipped</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Temporal-Axiom Precision</div>
        <div style="font-size:20px;font-weight:600;color:#10b981;margin-top:4px;">&lt; 5e-16</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">CPTP ${cptpDev.toExponential(2)} (machine epsilon)</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Curvature-Induced Purity</div>
        <div style="font-size:20px;font-weight:600;color:#f97316;margin-top:4px;">${dsPurity.toFixed(5)}</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">de Sitter \xb7 Schwarzschild ${schPurity.toFixed(5)}</div>
      </div>
      <div style="background:rgba(255,255,255,0.01);border:1px solid var(--border);padding:16px;border-radius:var(--r-md);">
        <div style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--t4);text-transform:uppercase;">Governance Surface</div>
        <div style="font-size:20px;font-weight:600;color:var(--ts);margin-top:4px;">${evClasses} evidence classes</div>
        <div style="font-size:12px;color:var(--t4);margin-top:2px;">KD delta +${kdDelta.toFixed(4)} \xb7 model-output consistency only</div>
      </div>
    </div>
    <div style="margin-top:24px;background:rgba(234,179,8,0.05);border:1px solid rgba(234,179,8,0.18);border-radius:var(--r-md);padding:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#eab308;font-weight:700;font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;">
        <span>&#x1F6E1; Governance-Rich Combined Snapshot (v2.1.2, hardening r1)</span>
      </div>
      <p style="font-size:12.5px;color:var(--t3);margin:0;line-height:1.6;">
        QSOT-Harness is the published combined snapshot of the QSOT line: the same phenomenological ansatz as 0058, wrapped in an 8-phase, 50-check pipeline that serializes a fixed claim boundary, a per-observation evidence class, and a calibration manifest. The two non-pass checks are surfaced, not hidden: the flat-baseline Kirkwood-Dirac optimizer does not converge (degraded) and the optional governance backend is absent (skipped). Verified for <strong>model-output consistency only</strong>, not external physical validity. DOI <a href="https://doi.org/10.5281/zenodo.20665824" target="_blank" rel="noopener" style="color:#a78bfa;">10.5281/zenodo.20665824</a>. Math-only sibling line: <strong>toe-test-0058</strong>.
      </p>
    </div>
  `;
}

const EQA_RENDERERS = {
  'toe-test-0060': {
    insights: eqaInsights0060, integrity: eqaIntegrity0060, analysis: eqaAnalysis0060, charts: null,
  },
  'toe-test-0059': {
    insights: eqaInsights0059, integrity: null, analysis: null, charts: eqaChartsCurvature,
  },
  'toe-test-0058': {
    insights: eqaInsights0058, integrity: null, analysis: null, charts: eqaChartsCurvature,
  },
  'toe-test-0057': {
    insights: eqaInsights0057, integrity: null, analysis: eqaAnalysis0057,
    charts: function(data) {
      const checks = data.checks ?? {}, vals = Object.values(checks);
      const passCount = vals.filter(v => v === 'PASS' || v === true).length;
      const skipCount = vals.filter(v => v === 'SKIPPED').length;
      const failCount = vals.length - passCount - skipCount;
      const obs = data.observations ?? {};
      const schPurity = obs.schwarz_purity ?? 0.9994346211351026;
      const dsPurity = obs.desitter_purity ?? 0.6360680891448688;
      const adsPurity = obs.ads_purity ?? 0.6776355966184198;
      const eguchiPurity = obs.eguchi_purity ?? 0.9988698549640613;
      const boost = obs.ads_boost_info ?? {};
      const v = boost.observer_velocity ?? 0.5;
      const gammaBoost = boost.gamma_boost ?? 1.1547005383792517;
      return [
        donutChart('Verification Check Results',
          [{ label: 'Pass', value: passCount, color: '#10b981' }, ...(skipCount > 0 ? [{ label: 'Skipped', value: skipCount, color: '#6b7280' }] : []), ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : [])],
          { centerText: String(passCount), centerSub: 'of ' + vals.length + ' passed' }),
        barChart('Phase 2 \xb7 Curvature Induced Purity Decay',
          [{ label: 'Schwarzschild Rest', value: schPurity, color: '#10b981', note: 'Decay parameter: ~0.0001' }, { label: 'de Sitter Rest', value: dsPurity, color: '#ef4444', note: 'Decay parameter: ~0.3639' }, { label: 'AdS5 Rest', value: adsPurity, color: '#3b82f6', note: 'Decay parameter: ~0.3224' }, { label: 'Eguchi-Hanson Rest', value: eguchiPurity, color: '#8b5cf6', note: 'Decay parameter: ~0.0011' }],
          { maxValue: 1, unit: '', caption: 'Purity decays asymptotically from 1.0 depending on background curvature tensors.' }),
        barChart('Phase 3 \xb7 Relativistic Boost Time Dilation',
          [{ label: 'Rest (v = 0.0)', value: 1.0, color: '#10b981', note: 'gamma = 1.0' }, { label: 'Boost (v = ' + v + 'c)', value: gammaBoost, color: '#ef4444', note: 'gamma = ' + gammaBoost.toFixed(4) }],
          { maxValue: 2.0, unit: '', caption: 'Observer velocity sweep shows time dilation scaling factor gamma. Total factor combines boost and curvature metrics.' }),
      ];
    },
  },
  'toe-test-0056': {
    insights: eqaInsights0056, integrity: null, analysis: eqaAnalysis0056,
    charts: function(data) {
      const checks = data.checks ?? {}, vals = Object.values(checks);
      const passCount = vals.filter(Boolean).length, failCount = vals.length - passCount;
      const phase1 = data.observations?.phase1_lattice ?? {};
      const gaussian = phase1.gaussian ?? {}, eisenstein = phase1.eisenstein ?? {};
      const sawin = data.observations?.phase3_sawin_multiquadratic ?? {};
      const gs = sawin.galois_rank ?? {};
      const gsR = gs.r_G_S_bound ?? 0, gsThreshold = gs.golod_shafarevich_threshold ?? 0;
      const gsDelta = gs.d_G_infty ?? 0, gsAdmit = gs.admissible ?? true;
      return [
        donutChart('Verification Check Results',
          [{ label: 'Pass', value: passCount, color: '#10b981' }, ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : [])],
          { centerText: String(passCount), centerSub: 'of ' + vals.length + ' passed' }),
        barChart('Phase 1 \xb7 Lattice Unit-Distance Pairs',
          [{ label: 'Q(i) Gaussian', value: gaussian.unit_distance_pairs ?? 0, color: '#3b82f6', note: gaussian.observed_exponent != null ? 'observed exponent: ' + gaussian.observed_exponent.toFixed(6) : '' }, { label: 'Q(√-3) Eisenstein', value: eisenstein.unit_distance_pairs ?? 0, color: '#8b5cf6', note: eisenstein.observed_exponent != null ? 'observed exponent: ' + eisenstein.observed_exponent.toFixed(6) : '' }],
          { unit: ' pairs', caption: 'Eisenstein integers are denser at identical grid bounds (h=1 degenerate cases, Prop. 2.2).' }),
        barChart('Phase 3 \xb7 Golod-Shafarevich Tower Admissibility',
          [{ label: 'r_{G,S} bound', value: gsR, color: '#f59e0b', note: 'H² relations — must be < d²/4' }, { label: 'd²/4 threshold', value: gsThreshold, color: '#10b981', note: 'GS upper bound' }, { label: 'd_G_∞ dim', value: gsDelta, color: '#6366f1', note: 'H¹ generators' }],
          { maxValue: Math.max(gsThreshold * 1.2, gsDelta * 1.2, 1), caption: 'Tower exists ⇔ r < d²/4. Here: ' + gsR + ' < ' + (gsDelta * gsDelta / 4).toFixed(2) + ' → infinite pro-2 tower ' + (gsAdmit ? 'CONFIRMED' : 'NOT CONFIRMED') + '. (Hajir-Maire, Prop. 2.3)' }),
      ];
    },
  },
  'toe-test-0055': {
    insights: eqaInsights0055, integrity: eqaIntegrity0055, analysis: eqaAnalysis0055,
    charts: function(data) {
      const stack = data.validation_stack ?? [], stages = data.stage_outputs ?? [];
      const summary = data.screen_summary ?? {};
      const stackColors = ['#10b981', '#3b82f6', '#a78bfa'];
      return [
        barChart('Validation Stack Completion',
          stack.map((s, i) => ({ label: s, value: 100, color: stackColors[i % stackColors.length] })),
          { maxValue: 100, unit: '% complete', caption: 'All three validation stages completed: scope-and-claim review, fhval validation, and internal testing (4 runs).' }),
        donutChart('Target Outcome Classification',
          [{ label: 'Optional Layer', value: 1, color: '#eab308' }, { label: 'Missing Link', value: 1, color: '#10b981' }, { label: 'Core (Rejected)', value: 1, color: '#ef4444' }],
          { centerText: 'ORL', centerSub: 'classification', caption: 'AEFSO received OPTIONAL_REPRESENTATION_LAYER classification. Core candidate rejected; missing-link discovery approved for continued research.' }),
        barChart('Stage Outcomes',
          stages.map(s => ({ label: s.name, value: s.status === 'PASS' ? 100 : s.status === 'WARN' ? 60 : 20, color: s.status === 'PASS' ? '#10b981' : s.status === 'WARN' ? '#eab308' : '#ef4444', note: s.detail })),
          { maxValue: 100, unit: '% confidence', caption: 'AEFSO survives as a bounded research candidate, but the core-promotion step fails on readability and governance-surface criteria.' }),
        barChart('Architectural Yield Mix',
          [{ label: 'What survived', value: (summary.what_it_proved || []).length, color: '#10b981' }, { label: 'Promotion blockers', value: (summary.promotion_blockers || []).length, color: '#ef4444' }, { label: 'Missing-link properties', value: (summary.missing_link_properties || []).length, color: '#60a5fa' }],
          { maxValue: 5, unit: 'signals', caption: '0055 is not a clean fail. The missing-link output is part of the result, not post-hoc spin.' }),
      ];
    },
  },
  'toe-test-0054': {
    insights: eqaInsights0054, integrity: eqaIntegrity0054, analysis: eqaAnalysis0054,
    charts: function(data) {
      const conns = data.connections ?? {}, entries = Object.entries(conns);
      const chartData = entries.map(([key, val]) => { const score = val.contract_score ?? 0; return { label: key.replace(/_/g, ' '), value: score, color: score >= 0.9 ? '#10b981' : score >= 0.7 ? '#eab308' : '#ef4444', note: 'discord ' + (val.discord_score ?? 0).toFixed(3) + ' \xb7 risk ' + (val.dangerous_pass_risk ?? 0).toFixed(4) }; });
      const passCount = entries.filter(([, v]) => (v.contract_score ?? 0) >= 0.85).length;
      const law = data.lawbinder_governance ?? {};
      const constraints = Array.isArray(law.constraint_results) ? law.constraint_results : [];
      const hard = Number(law.hard_violations ?? 0), soft = Number(law.soft_violations ?? 0);
      const clean = Math.max(0, constraints.length - hard - soft);
      const connRisk = entries.map(([key, val]) => ({ label: key.replace(/_/g, ' '), value: +(val.dangerous_pass_risk ?? 0), color: (val.dangerous_pass_risk ?? 0) > 0 ? '#ef4444' : '#10b981', note: (val.issues || []).join('; ') || 'no recorded issue' }));
      return [
        donutChart('Gate Contract Results',
          [{ label: 'Above threshold (≥0.85)', value: passCount, color: '#10b981' }, { label: 'Below threshold (<0.85)', value: entries.length - passCount, color: '#ef4444' }],
          { centerText: String(passCount), centerSub: 'of ' + entries.length + ' gates', caption: 'Only the promotion-boundary connection clears the threshold. The other two surfaces are intentionally blocked because no candidate exists yet.' }),
        barChart('Pipeline Contract Scores', chartData,
          { maxValue: 1, caption: 'Minimum threshold for pipeline promotion: 0.850. INHIBIT gate triggered by hard constraint violation.' }),
        barChart('Dangerous Pass Risk by Connection', connRisk,
          { maxValue: 1, caption: 'The system is not just saying no. It localizes where a false promotion would be dangerous, with the global intake surface correctly pinned at risk 1.0.' }),
        donutChart('Governance Constraint Outcomes',
          [{ label: 'Clean constraints', value: clean, color: '#10b981' }, { label: 'Soft violations', value: soft, color: '#f59e0b' }, { label: 'Hard violations', value: hard, color: '#ef4444' }].filter(x => x.value > 0),
          { centerText: String(hard), centerSub: 'hard', caption: 'The governance layer distinguishes one hard blocker from one softer usability blocker. That distinction is the real governance insight of 0054.' }),
      ];
    },
  },
  'toe-test-0053': {
    insights: eqaInsights0053, integrity: eqaIntegrity0053, analysis: eqaAnalysis0053,
    charts: function(data) {
      const runtime = data.logos_runtime_probe ?? {}, compile = Array.isArray(data.logos_source_compile) ? data.logos_source_compile : [];
      const contract = data.toe_contract_probe ?? {};
      const probes = [
        { label: 'Package resolution', status: runtime.package_name_resolution?.status || 'unknown', duration: runtime.package_name_resolution?.duration_s ?? 0.0, color: '#10b981', note: (runtime.package_name_resolution?.stdout || '').trim() || 'no path recorded' },
        { label: 'Direct import', status: runtime.direct_import?.status || 'unknown', duration: runtime.direct_import?.duration_s ?? 0.0, color: runtime.direct_import?.status === 'pass' ? '#10b981' : '#ef4444', note: 'imports aats.pipeline, bridge.manifold_bridge, missing_link.runner' },
        { label: 'AATS smoke', status: runtime.aats_smoke?.status || 'unknown', duration: runtime.aats_smoke?.duration_s ?? 0.0, color: runtime.aats_smoke?.status === 'pass' ? '#10b981' : '#ef4444', note: 'runs AATSPipeline().run(...) in the active environment' },
        { label: 'Pipeline contracts', status: contract.status || 'unknown', duration: contract.duration_s ?? 0.0, color: contract.status === 'pass' ? '#10b981' : '#ef4444', note: 'tests/unit/test_logos_sidecar_contract.py + export contract' },
      ];
      const passCount = probes.filter(p => p.status === 'pass').length + compile.filter(x => x.status === 'pass').length;
      const timeoutCount = probes.filter(p => p.status === 'timeout').length;
      const failCount = probes.filter(p => p.status === 'fail').length + compile.filter(x => x.status === 'fail').length;
      const compileRatio = compile.length ? Math.round((compile.filter(x => x.status === 'pass').length / compile.length) * 100) : 0;
      return [
        barChart('Probe Duration Profile',
          probes.map(p => ({ label: p.label, value: +(p.duration || 0), color: p.color, note: p.status + ' — ' + p.note })),
          { maxValue: Math.max(25, ...probes.map(p => +(p.duration || 0))), unit: 's', caption: 'Two probes hit the 20-second timeout ceiling. The sidecar boundary is operational, not speculative: import and smoke execution are too slow for guarded runtime use.' }),
        donutChart('Operational Outcome Mix',
          [{ label: 'Pass', value: passCount, color: '#10b981' }, { label: 'Timeout', value: timeoutCount, color: '#ef4444' }, { label: 'Fail', value: failCount, color: '#f59e0b' }].filter(x => x.value > 0),
          { centerText: String(passCount), centerSub: 'passes', caption: 'The audit is not empty: compile checks and TOE contract tests pass. The decisive blockers are the two runtime timeouts.' }),
        barChart('Boundary Readiness Matrix',
          [{ label: 'Source compile', value: compileRatio, color: '#10b981', note: compile.filter(x => x.status === 'pass').length + '/' + compile.length + ' key files compile' }, { label: 'Package resolution', value: runtime.package_name_resolution?.status === 'pass' ? 100 : 0, color: '#10b981', note: 'Path resolved, but not to Flamehaven-LOGOS' }, { label: 'Direct import', value: runtime.direct_import?.status === 'pass' ? 100 : 0, color: runtime.direct_import?.status === 'pass' ? '#10b981' : '#ef4444', note: 'status = ' + (runtime.direct_import?.status || 'unknown') }, { label: 'AATS smoke', value: runtime.aats_smoke?.status === 'pass' ? 100 : 0, color: runtime.aats_smoke?.status === 'pass' ? '#10b981' : '#ef4444', note: 'status = ' + (runtime.aats_smoke?.status || 'unknown') }, { label: 'Pipeline contracts', value: contract.status === 'pass' ? 100 : 0, color: contract.status === 'pass' ? '#10b981' : '#ef4444', note: 'status = ' + (contract.status || 'unknown') }],
          { maxValue: 100, unit: '%', caption: '0053 preserves the safe boundary because runtime execution is still degraded even though compile and contract checks are healthy.' }),
      ];
    },
  },
  'toe-test-0052': {
    insights: eqaInsights0052, integrity: eqaIntegrity0052, analysis: eqaAnalysis0052,
    charts: function(data) {
      const spar = data.spar_review ?? {}, subj = data.subject ?? {}, hist = data.historical_snapshot ?? {};
      const replays = data.current_replays ?? {};
      const legacyReplay = replays.toe_legacy_2026_06_02 ?? {};
      const frameworkReplay = replays.toe_spar_framework_2026_06_02 ?? {};
      const historicalScore = hist.score ?? spar.score ?? 0;
      const findings = Array.isArray(spar.findings) ? spar.findings : [];
      const statusCounts = findings.reduce((acc, f) => { const k = f.status || 'UNKNOWN'; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
      const layerCounts = findings.reduce((acc, f) => { const k = f.layer || '?'; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
      return [
        barChart('Replay Comparison',
          [{ label: 'Historical', value: historicalScore, color: '#ef4444', note: 'Historical snapshot — ' + (hist.spar_verdict ?? spar.verdict ?? 'MINOR REVISION') }, { label: 'TOE Legacy', value: legacyReplay.score ?? historicalScore, color: '#eab308', note: (legacyReplay.verdict ?? 'MINOR REVISION') + ' on ' + (legacyReplay.date ?? '2026-06-02') }, { label: 'toe-spar', value: frameworkReplay.score ?? 98, color: '#10b981', note: (frameworkReplay.verdict ?? 'ACCEPT') + ' on ' + (frameworkReplay.date ?? '2026-06-02') }],
          { maxValue: 100, unit: '/100', caption: 'Same manually encoded subject, different scope-review policy surfaces. This chart shows review-policy drift, not new physics output.' }),
        barChart('Agent Metrics',
          [{ label: 'SR9 (cross-domain consistency)', value: Math.round((subj.sr9_resonance ?? 0) * 100), color: '#10b981', note: (subj.sr9_resonance ?? 0) + ' — theoretical alignment' }, { label: 'DI2 (reasoning deviation)', value: Math.round((subj.di2_drift ?? 0) * 100), color: '#ef4444', note: (subj.di2_drift ?? 0) + ' — claim-to-math deviation' }, { label: 'Omega (composite score)', value: Math.round((subj.sidrce_omega ?? 0) * 100), color: '#eab308', note: (subj.sidrce_omega ?? 0) + ' — composite adjudication' }],
          { maxValue: 100, unit: '%', caption: 'SR9 measures cross-domain reasoning consistency. DI2 measures reasoning deviation from stated claims. Omega is the composite adjudication score.' }),
        donutChart('Finding Severity Mix',
          [{ label: 'ANOMALY', value: statusCounts.ANOMALY || 0, color: '#ef4444' }, { label: 'WARN', value: statusCounts.WARN || 0, color: '#f59e0b' }, { label: 'APPROXIMATION', value: statusCounts.APPROXIMATION || 0, color: '#eab308' }, { label: 'GAPPED', value: statusCounts.GAPPED || 0, color: '#60a5fa' }, { label: 'HEURISTIC', value: statusCounts.HEURISTIC || 0, color: '#a78bfa' }].filter(x => x.value > 0),
          { centerText: String(findings.length), centerSub: 'findings', caption: 'The verdict is driven by one scope anomaly, one scope-honesty warning, and three bounded-domain/model-gap findings.' }),
        barChart('Finding Layers',
          [{ label: 'Layer A', value: layerCounts.A || 0, color: '#ef4444', note: 'math / claim mismatch' }, { label: 'Layer B', value: layerCounts.B || 0, color: '#f59e0b', note: 'scope honesty' }, { label: 'Layer C', value: layerCounts.C || 0, color: '#60a5fa', note: 'domain limits and evidence gaps' }],
          { maxValue: Math.max(3, ...Object.values(layerCounts), 1), caption: '0052 is not failing because the symbolic story collapses everywhere. It fails because the reviewed claim outruns a bounded, domain-specific mathematical construction.' }),
      ];
    },
  },
};
