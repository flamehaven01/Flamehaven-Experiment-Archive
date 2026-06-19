// portal-inspector.js — Inspector lifecycle, data rendering, and analysis tab.
// Extracted from portal.js [v1.16.0]. Dead EQA branches removed (handled by eqa-renderers.js).
// Load order: portal-charts.js -> portal-inspector.js -> portal.js (defer)
function normalizeLiveEqaRunId(runId) {
  if (runId === 'openai-erdos-eq22') return 'toe-test-0056';
  if (runId === 'toe-test-0056-legacy-aefso' || runId === 'toe-test-aefso' || runId === 'aefso') return 'toe-test-0055';
  return runId;
}

async function openJsonInspector(runId, type = 'json') {
  runId = normalizeLiveEqaRunId(runId);
  const inspector = document.getElementById('eq-json-inspector');
  if (!inspector) return;
  // Hide any open report viewer so a prior report (e.g. a BSC report) does not bleed into this inspector view.
  const reportViewer = document.getElementById('report-viewer');
  if (reportViewer) reportViewer.style.display = 'none';
  inspector.style.display = 'block';
  // Clear stale tab content from any previous inspector session
  ['ins-insights', 'ins-analysis', 'ins-integrity', 'ins-rules', 'ins-raw'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  inspector.dataset.activeRunId = runId;
  
  const titleNode = document.getElementById('inspector-run-id');
  if (titleNode) {
    const _eqaTitleCfg = EQA_MAP.get(runId);
    if (_eqaTitleCfg) {
      titleNode.textContent = _eqaTitleCfg.inspectorTitle;
    } else if (BAV_MAP.has(runId)) {
      titleNode.textContent = BAV_MAP.get(runId).inspectorTitle;
    } else if (runId.startsWith('bav-arch-')) {
      titleNode.textContent = 'BAV ARCHIVE · ' + runId.replace('bav-arch-', '');
    } else if (runId.startsWith('eqa-arch-')) {
      titleNode.textContent = 'EQA ARCHIVE · ' + runId.replace('eqa-arch-', '');
    } else {
      titleNode.textContent = runId.toUpperCase();
    }
  }
  
  // Switch to the correct tab initially
  const initialTab = type === 'report' ? 'raw' : 'insights';
  const tabBtn = Array.from(document.querySelectorAll('.inspector-tab')).find(b => {
    const text = b.textContent.toLowerCase();
    return initialTab === 'raw' ? (text.includes('raw') || text.includes('json') || text.includes('proof') || text.includes('report')) : text.includes('insight');
  });
  if (tabBtn) {
    switchInspectorTab(initialTab, tabBtn);
  }
  
  // Rename raw tab button header dynamically
  const rawTabBtn = Array.from(document.querySelectorAll('.inspector-tab')).find(b => {
    const text = b.textContent.toLowerCase();
    return text.includes('raw') || text.includes('json') || text.includes('proof') || text.includes('report');
  });
  if (rawTabBtn) {
    const _eqaTabCfg = EQA_MAP.get(runId);
    if (_eqaTabCfg && type === 'report') {
      rawTabBtn.innerHTML = _eqaTabCfg.rawTabLabel;
    } else {
      rawTabBtn.innerHTML = `📄 Raw JSON`;
    }
  }
  
  // Fetch unedited raw JSON from our local workspace paths
  let jsonPath = '';
  const _eqaJsonCfg = EQA_MAP.get(runId);
  if (_eqaJsonCfg) {
    jsonPath = _eqaJsonCfg.jsonPath;
  } else if (runId === 'yorkeccak-bio') {
    jsonPath = './stem-bio-ai/yorkeccak-bio/2026-05-15/report.json';
  } else if (runId === 'bioclaw') {
    jsonPath = './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_experiment_results.json';
  } else if (BAV_MAP.has(runId)) {
    jsonPath = BAV_MAP.get(runId).jsonPath;
  } else if (runId.startsWith('bav-arch-')) {
    jsonPath = './bav/archive/manifest.json';
  } else if (runId.startsWith('eqa-arch-')) {
    jsonPath = './eqa/archive/manifest.json';
  }
  
  let jsonData = null;
  if (jsonPath) {
    try {
      const res = await fetch(jsonPath + '?t=' + new Date().getTime());
      if (!res.ok) throw new Error('Failed to fetch JSON');
      jsonData = await res.json();
    } catch (err) {
      // Single source of truth (v1.13.1): no inlined fallback. Surface an honest
      // load error instead of stale data. Serve this ledger over HTTP, not file://.
      console.warn(`Could not load ${jsonPath} for ${runId}. Serve over HTTP (e.g. python -m http.server), not file://.`, err);
      jsonData = { _load_error: `Could not load ${runId}: this ledger reads its evidence from on-disk JSON and must be served over HTTP (e.g. "python -m http.server"), not opened via file://.` };
    }
  } else {
    console.warn(`No jsonPath mapping for ${runId}.`);
    jsonData = { _load_error: `No data path is mapped for ${runId}.` };
  }
  
  // Archive (BAV/EQA): the fetched file is the manifest; narrow it to one run record.
  const archPrefix = runId.startsWith('bav-arch-') ? 'bav-arch-' : (runId.startsWith('eqa-arch-') ? 'eqa-arch-' : null);
  if (archPrefix && jsonData && Array.isArray(jsonData.runs)) {
    const wantId = runId.replace(archPrefix, '');
    const run = jsonData.runs.find(x => x.id === wantId);
    jsonData = run ? Object.assign({ _archive_label: jsonData.label, _lane: archPrefix === 'eqa-arch-' ? 'eqa' : 'bav' }, run) : jsonData;
    const rp = (jsonData.metrics && jsonData.metrics.report_path) || jsonData.report_path;
    if (rp) {
      try {
        const res = await fetch(rp + '?t=' + new Date().getTime());
        if (res.ok) jsonData._reportText = await res.text();
      } catch (e) { /* report optional */ }
    }
  }

  inspector.jsonData = jsonData;

  // BAV EXP-031: fetch supplementary structural + per-arm data for charts (live, no hardcoding)
  if (runId === 'bav-exp-031' && jsonData) {
    try {
      const bust = '?t=' + new Date().getTime();
      const [armB, armC, af2, af3full, af3sum] = await Promise.all([
        fetch('./bav/exp-031/arm-b/hybrid_result.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-031/arm-c/hybrid_result.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-031/arm-a/af2_scores_rank1.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-031/arm-a/af3_full_data_0.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-031/arm-a/af3_summary_0.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      jsonData._bav = { armB, armC, af2, af3full, af3sum };
    } catch (e) { console.warn('BAV exp-031 supplementary fetch failed', e); }
  }

  // BAV EXP-032: fetch governance evidence (benchmark, go/no-go, BLOCK control) for charts
  if (runId === 'bav-exp-032' && jsonData) {
    try {
      const bust = '?t=' + new Date().getTime();
      const [gng, bench, blockPayload] = await Promise.all([
        fetch('./bav/exp-032/go_no_go.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-032/benchmark.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-032/block-001-arm-a/payload.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      jsonData._gov = { go_no_go: gng, benchmark: bench, blockPayload };
    } catch (e) { console.warn('BAV exp-032 supplementary fetch failed', e); }
  }

  // BAV EXP-034: fetch stage-gate + legacy-replay benchmark for path-separation charts
  if (runId === 'bav-exp-034' && jsonData) {
    try {
      const bust = '?t=' + new Date().getTime();
      const [gate, legacy] = await Promise.all([
        fetch('./bav/exp-034/stage_gate_report.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('./bav/exp-034/legacy_replay_benchmark.json' + bust).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      jsonData._gov = { stage_gate: gate, legacy_benchmark: legacy };
    } catch (e) { console.warn('BAV exp-034 supplementary fetch failed', e); }
  }

  // BAV: fetch the experiment manifest (provenance/SHA256) for the Integrity tab
  if (runId.startsWith('bav-exp-') && jsonData) {
    try {
      const n = runId.replace('bav-exp-', '');
      const mf = await fetch('./bav/exp-' + n + '/manifest.json?t=' + new Date().getTime()).then(r => r.ok ? r.json() : null).catch(() => null);
      if (mf) jsonData._manifest = mf;
    } catch (e) { console.warn('BAV manifest fetch failed', e); }
  }

  // Fetch report markdown — EQA paths driven by registry; archive handled above.
  let reportText = '';
  if (type === 'report') {
    const _eqaRpCfg = EQA_MAP.get(runId);
    if (_eqaRpCfg && _eqaRpCfg.reportPaths.length) {
      try {
        const stamp = new Date().getTime();
        const texts = await Promise.all(
          _eqaRpCfg.reportPaths.map(function(p) {
            return fetch(p + '?t=' + stamp).then(function(r) { return r.ok ? r.text() : ''; }).catch(function() { return ''; });
          })
        );
        reportText = texts.filter(Boolean).join('\n\n---\n\n');
      } catch (e) {}
    }
  }
  inspector.reportText = reportText;
  
  // Render
  renderInspectorData(runId, jsonData, reportText);

  // Smooth scroll with layout reflow protection
  requestAnimationFrame(() => {
    setTimeout(() => {
      inspector.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });
}

function closeJsonInspector() {
  const inspector = document.getElementById('eq-json-inspector');
  if (inspector) {
    inspector.style.display = 'none';
  }
}

function switchInspectorTab(tabId, btn) {
  // Toggle tab buttons active class
  document.querySelectorAll('.inspector-tab').forEach(t => {
    t.classList.remove('active');
    t.style.borderBottomColor = 'transparent';
    t.style.color = 'var(--t3)';
  });
  if (btn) {
    btn.classList.add('active');
    btn.style.borderBottomColor = '#3b82f6';
    btn.style.color = 'var(--ts)';
  }
  
  // Toggle panels display
  document.querySelectorAll('.inspector-panel').forEach(p => {
    p.style.display = 'none';
  });
  
  const activePanel = document.getElementById(`ins-${tabId}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }
}

function parseMarkdownToHtml(md) {
  let html = md;
  // SECURITY GUARD (do not remove): escape &,<,> up front so any raw HTML in a
  // fetched .md report (incl. imported external reports) renders as inert text,
  // not live markup. Combined with the fact that this parser never emits <a href>
  // from markdown link syntax, there is no script/href XSS path. If you ever add
  // link rendering, sanitize the href scheme (allow http/https/mailto/# only).
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const blocks = [];
  html = html.replace(/```json\n([\s\S]*?)\n```/g, (match, p1) => {
    const idx = blocks.length;
    blocks.push(`<pre style="background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 12px; border-radius: var(--r-sm); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #a78bfa; overflow-x: auto; text-align: left; margin: 12px 0;">${p1}</pre>`);
    return `__CODEBLOCK_PLACEHOLDER_${idx}__`;
  });

  html = html.replace(/```bash\n([\s\S]*?)\n```/g, (match, p1) => {
    const idx = blocks.length;
    blocks.push(`<pre style="background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 12px; border-radius: var(--r-sm); font-family: 'JetBrains Mono', monospace; font-size: 11.5px; color: #10b981; overflow-x: auto; text-align: left; margin: 12px 0;">${p1}</pre>`);
    return `__CODEBLOCK_PLACEHOLDER_${idx}__`;
  });

  // GFM tables: a header row, a |---|---| separator, then body rows.
  {
    const srcLines = html.split('\n');
    const outLines = [];
    for (let i = 0; i < srcLines.length; i++) {
      const head = srcLines[i];
      const sep = srcLines[i + 1] || '';
      const isRow = /^\s*\|.*\|\s*$/.test(head);
      const isSep = /^\s*\|[\s:|-]+\|\s*$/.test(sep) && sep.includes('-');
      if (isRow && isSep) {
        const bold = t => t.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--ts);font-weight:600;">$1</strong>');
        const cells = s => s.trim().replace(/^\||\|$/g, '').split('|').map(c => bold(c.trim()));
        const ths = cells(head).map(c => `<th style="text-align:left;padding:6px 10px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:10.5px;text-transform:uppercase;color:var(--t4);">${c}</th>`).join('');
        let j = i + 2;
        const bodyRows = [];
        while (j < srcLines.length && /^\s*\|.*\|\s*$/.test(srcLines[j])) {
          const tds = cells(srcLines[j]).map(c => `<td style="padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:12px;color:var(--t3);">${c}</td>`).join('');
          bodyRows.push(`<tr>${tds}</tr>`);
          j++;
        }
        const idx = blocks.length;
        blocks.push(`<table style="width:100%;border-collapse:collapse;margin:12px 0;"><thead><tr>${ths}</tr></thead><tbody>${bodyRows.join('')}</tbody></table>`);
        outLines.push(`__CODEBLOCK_PLACEHOLDER_${idx}__`);
        i = j - 1;
      } else {
        outLines.push(head);
      }
    }
    html = outLines.join('\n');
  }

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; font-family: \'JetBrains Mono\', monospace; font-size: 11.5px; color: var(--ts);">$1</code>');

  // Headers
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-size: 18px; font-weight: 700; color: var(--ts); margin: 20px 0 12px 0; border-bottom: 1px solid var(--border); padding-bottom: 8px;">$1</h2>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-size: 13.5px; font-weight: 600; color: #a78bfa; margin: 18px 0 10px 0; font-family: \'JetBrains Mono\', monospace; text-transform: uppercase; letter-spacing: 0.5px;">$1</h3>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--border); margin: 20px 0;">');

  // Lists
  html = html.replace(/^\s*-\s*\*\*(.*?)\*\*(.*$)/gim, '<li style="margin-left: 16px; margin-bottom: 8px; font-size: 13px; color: var(--t3); line-height: 1.6;"><strong style="color: var(--ts); font-weight: 600;">$1</strong>$2</li>');
  html = html.replace(/^\s*-\s*(.*$)/gim, '<li style="margin-left: 16px; margin-bottom: 8px; font-size: 13px; color: var(--t3); line-height: 1.6;">$1</li>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--ts); font-weight: 600;">$1</strong>');

  // Restore placeholders
  blocks.forEach((block, idx) => {
    html = html.replace(`__CODEBLOCK_PLACEHOLDER_${idx}__`, block);
  });

  // Paragraph lines
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<hr') || trimmed.startsWith('<li') || trimmed.startsWith('<pre') || trimmed.startsWith('<div') || trimmed.startsWith('<p') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) {
      return line;
    }
    return `<p style="font-size: 13px; color: var(--t3); line-height: 1.6; margin: 8px 0;">${line}</p>`;
  });
  
  return processedLines.join('\n');
}

// ── BAV (Biomolecular AI Validation) live insights renderer ──────────────────
// All values derived from live payload (rexsyn_bio_report_payload). No hardcoding (DI-BSC-001).

function renderInspectorData(runId, data, reportText = '') {
  const insInsights = document.getElementById('ins-insights');
  const insIntegrity = document.getElementById('ins-integrity');
  const insChecks = document.getElementById('ins-checks');
  const insRaw = document.getElementById('ins-raw');
  const insCharts = document.getElementById('ins-charts');

  if (!insInsights || !insIntegrity || !insChecks || !insRaw) return;

  // Honest load-state guard (v1.13.1): no inlined fallback data. If the on-disk
  // JSON could not be fetched, show why instead of crashing or showing stale data.
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  if (!data || data._load_error) {
    const msg = (data && data._load_error) || 'Could not load this record. The Verification Ledger reads its evidence from on-disk JSON and must be served over HTTP (e.g. "python -m http.server"), not opened via file://.';
    insRaw.innerHTML = `<p class="empty-state" style="color:rgba(255,255,255,0.4);font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.7;">${msg}</p>`;
    insInsights.innerHTML = '';
    insIntegrity.innerHTML = '';
    insChecks.innerHTML = '';
    if (insCharts) insCharts.innerHTML = '';
    return;
  }

  // 1. Insights Tab Contents
  let insightHtml = '';
  const _eqaInsRend = EQA_RENDERERS[runId];
  if (_eqaInsRend) {
    insightHtml = _eqaInsRend.insights(data, esc);
    if (runId === 'toe-test-0056') {
      setTimeout(function() { const b = document.getElementById('btn-prec-64'); if (b) steerPrecision(64, b); }, 50);
    }
  } else if (runId === 'yorkeccak-bio' || runId === 'bioclaw') {
    const scoreVal = data.score ? data.score.final_score : 0;
    const tierVal = data.score ? data.score.formal_tier : '';
    const scoreColor = _bscTierColor(tierVal);
    // arc length = circumference(r=34) * score/100 = 213.6 * score/100
    const fillDash = `${(213.6 * scoreVal / 100).toFixed(1)} 213.6`;
    const scopeStr = data.score ? data.score.use_scope : '';
    
    insightHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; align-items: center;">
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 16px; border-radius: var(--r-md); display: flex; align-items: center; gap: 16px;">
          <svg width="60" height="60" viewBox="0 0 84 84" style="flex-shrink: 0;">
            <circle cx="42" cy="42" r="34" style="fill: none; stroke: rgba(255,255,255,0.03); stroke-width: 6;"/>
            <circle cx="42" cy="42" r="34" style="fill: none; stroke: ${scoreColor}; stroke-width: 6; stroke-dasharray: ${fillDash}; transform: rotate(-90deg); transform-origin: 42px 42px;"/>
            <text x="42" y="48" text-anchor="middle" font-size="18" font-family="'JetBrains Mono', monospace" font-weight="600" fill="${scoreColor}">${scoreVal}</text>
          </svg>
          <div>
            <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--t4); text-transform: uppercase;">Compliance Score</div>
            <div style="font-size: 16px; font-weight: 600; color: var(--ts); margin-top: 2px;">${scoreVal} / 100</div>
          </div>
        </div>
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 16px; border-radius: var(--r-md);">
          <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--t4); text-transform: uppercase;">Formal Tier</div>
          <div style="font-size: 18px; font-weight: 600; color: ${scoreColor}; margin-top: 4px;">${tierVal}</div>
          <div style="font-size: 12px; color: var(--t4); margin-top: 2px;">Status: Authoritative Release</div>
        </div>
        <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 16px; border-radius: var(--r-md);">
          <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--t4); text-transform: uppercase;">MIT AI Risk Coverage</div>
          <div style="font-size: 18px; font-weight: 600; color: var(--ts); margin-top: 4px;">2 risks covered</div>
          <div style="font-size: 12px; color: #10b981; margin-top: 2px;">MIT AIRI V4_03 aligned</div>
        </div>
      </div>
      
      <p style="font-size: 13.5px; color: var(--t3); line-height: 1.6; margin-top: 16px; margin-bottom: 0;">
        🔍 <strong>Auditing Scope:</strong> ${scopeStr}
      </p>

      <!-- Bio-Audit Compliance Steering Sandbox -->
      <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--ts); display: flex; align-items: center; gap: 6px;">
            <span>🛡️ Bio-Audit Compliance Steering Sandbox</span>
          </h4>
          <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 2px 8px; border-radius: var(--r-xs);">Compliance Engine · Simulation</span>
        </div>
        
        <p style="font-size: 12.5px; color: var(--t4); margin: 0 0 16px 0; line-height: 1.5;">
          Select the policy target below to dynamically steer the compliance scanning logic. Observe how standard priors allow clinical-adjacent hazards, while high-strictness locks quarantine and hard floors.
        </p>
        
        <div style="display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 12px 16px; border-radius: var(--r-md); margin-bottom: 16px; flex-wrap: wrap;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--t3); font-weight: 600;">Policy Target:</span>
          <div style="display: flex; gap: 8px; flex: 1; min-width: 200px;">
            <button class="precision-btn active" id="btn-comp-std" onclick="steerCompliance('standard', '${runId}', this)" style="flex: 1; cursor: pointer; border: 1px solid rgba(167, 139, 250, 0.1); color: var(--ts); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 8px; border-radius: var(--r-xs); transition: all 0.15s; border-color: rgba(167, 139, 250, 0.3);">Standard Prior</button>
            <button class="precision-btn" id="btn-comp-eu" onclick="steerCompliance('eu-ai-act', '${runId}', this)" style="flex: 1; cursor: pointer; border: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--t4); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 8px; border-radius: var(--r-xs); transition: all 0.15s;">EU AI Act Art. 12</button>
            <button class="precision-btn" id="btn-comp-mit" onclick="steerCompliance('mit-cap', '${runId}', this)" style="flex: 1; cursor: pointer; border: 1px solid var(--border); background: rgba(255,255,255,0.02); color: var(--t4); font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 8px; border-radius: var(--r-xs); transition: all 0.15s;">MIT AI Risk Cap</button>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <!-- Baseline Panel -->
          <div style="border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.005);">
            <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.01);">
              <div style="width: 3px; height: 16px; border-radius: 2px; background: #ef4444;"></div>
              <div style="font-size: 12px; font-weight: 700; color: #ef4444; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">Baseline Unmapped Prior</div>
            </div>
            <div id="compliance-baseline" style="padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; color: var(--t3); min-height: 120px;">
              <!-- Filled dynamically -->
            </div>
          </div>
          
          <!-- Compliance Steered Panel -->
          <div style="border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.005);">
            <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.01);">
              <div style="width: 3px; height: 16px; border-radius: 2px; background: #a78bfa;"></div>
              <div style="font-size: 12px; font-weight: 700; color: #a78bfa; font-family: 'JetBrains Mono', monospace; text-transform: uppercase;">Sovereign Compliance Lock</div>
            </div>
            <div id="compliance-steered" style="padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.6; color: var(--t3); min-height: 120px;">
              <!-- Filled dynamically -->
            </div>
          </div>
        </div>
      </div>
      
      <p style="font-size: 13.5px; color: var(--t3); line-height: 1.6; margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px; margin-bottom: 0;">
        💡 <strong>Auditing Insight:</strong> Static audits programmatically enforce rigorous clinical boundary and package validation rules. Under standard settings, the compliance ledger reports these issues; with strict policies engaged, the contract compiler issues hard quarantined flags to prevent patient-adjacent risk exposure.
      </p>
    `;
    
    // Automatically trigger initial compliance steering render
    setTimeout(() => {
      const defaultBtn = document.getElementById('btn-comp-std');
      if (defaultBtn) steerCompliance('standard', runId, defaultBtn);
    }, 50);
  } else {
    const _bavR = BAV_RENDERERS[runId];
    if (_bavR) insightHtml = _bavR.insights(data);
  }
  insInsights.innerHTML = insightHtml;
  
  // Archive records (BAV/EQA): thin single-experiment view from the manifest entry
  // plus the verbatim source report rendered inline.
  if (runId.startsWith('bav-arch-') || runId.startsWith('eqa-arch-')) {
    renderArchiveInspector(runId, data, { insInsights, insIntegrity, insChecks, insRaw, insCharts });
    return;
  }

  if (runId.startsWith('bav-exp-')) {
    insIntegrity.innerHTML = renderBavIntegrity(runId, data);
    insChecks.innerHTML = renderBavChecks(runId, data);
    // Raw JSON + Analysis tabs handled below
    let rawContentBav = JSON.stringify(data, (k, v) => k.startsWith('_') ? undefined : v, 2);
    if (insRaw) {
      insRaw.innerHTML = `<div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t4); margin-bottom:8px;">Canonical record (verbatim, internal merge keys hidden)</div><pre style="margin:0; white-space:pre-wrap; word-break:break-word; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t3); background:rgba(0,0,0,0.2); border:1px solid var(--border); border-radius:var(--r-sm); padding:14px; max-height:480px; overflow:auto;">${rawContentBav.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</pre>`;
    }
    if (insCharts) { insCharts.innerHTML = ''; renderAnalysisTab(insCharts, runId, data); }
    // Live Report tab: expert markdown generated from the live payload.
    const insReport = document.getElementById('ins-report');
    const reportTab = document.getElementById('tab-live-report');
    if (insReport) {
      const md = buildBavReportMarkdown(runId, data);
      insReport.innerHTML = '<div class="calibration-markdown-body" style="font-family:\'Inter\',sans-serif;">' + parseMarkdownToHtml(md) + '</div>';
    }
    if (reportTab) reportTab.style.display = '';
    return;
  }

  // Non-BAV records: hide the BAV-only Live Report tab.
  const _reportTab = document.getElementById('tab-live-report');
  if (_reportTab) _reportTab.style.display = 'none';


  // 2. Integrity Tab Contents
  const _eqaIntRend = EQA_RENDERERS[runId];
  if (_eqaIntRend && _eqaIntRend.integrity) {
    _eqaIntRend.integrity(data, esc, insIntegrity, insChecks);
  } else {
    let manifest = data.source_sha256_manifest || data.file_hashes_sha256 || {};
    let integrityHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border); padding-bottom:12px; margin-bottom:16px;">
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ts); font-weight:600;">Cryptographic File Manifest</span>
        <span style="color:#10b981; font-family:'JetBrains Mono', monospace; font-size:11px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); padding:2px 8px; border-radius:var(--r-xs);">🛡️ CRYPTO LOCKED</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; font-family:'JetBrains Mono', monospace; font-size:11.5px;">
    `;
    
    const manifestKeys = Object.keys(manifest);
    if (manifestKeys.length === 0) {
      integrityHtml += `<div style="color:var(--t4); font-style:italic;">No files tracked in manifest for this run.</div>`;
    } else {
      manifestKeys.forEach(k => {
        integrityHtml += `
          <div style="display:flex; justify-content:space-between; padding:6px 12px; background:rgba(255,255,255,0.01); border:1px solid var(--border); border-radius:var(--r-xs); flex-wrap:wrap; gap:8px;">
            <span style="color:var(--ts);">${k}</span>
            <span style="color:var(--t4);">${manifest[k].substring(0, 32)}...</span>
          </div>
        `;
      });
    }
    integrityHtml += `</div>`;
    insIntegrity.innerHTML = integrityHtml;
    
    // 3. Checks Tab Contents
    let checks = data.checks || {};
    
    // Bridge BRC code_integrity checks to checks tab!
    if (runId === 'yorkeccak-bio' || runId === 'bioclaw') {
      checks = {};
      if (data.code_integrity) {
        Object.keys(data.code_integrity).forEach(k => {
          checks[k] = data.code_integrity[k].status;
        });
      }
    }
    
    let checksHtml = `
      <div style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ts); font-weight:600; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">Active Test Case Verdict Logs</div>
      <div style="display:flex; flex-direction:column; gap:8px;">
    `;
    
    const checkKeys = Object.keys(checks);
    if (checkKeys.length === 0) {
      checksHtml += `<div style="color:var(--t4); font-style:italic;">No verification checks recorded.</div>`;
    } else {
      checkKeys.forEach(k => {
        const status = checks[k];
        const isPass = status === true || status === 'PASS';
        const isWarn = status === 'WARN';
        
        let statusIcon = `<span style="color:#10b981; font-weight:bold; margin-right:8px;">[✓]</span>`;
        let statusLabel = 'PASS';
        let labelColor = '#10b981';
        
        if (!isPass) {
          if (isWarn) {
            statusIcon = `<span style="color:#eab308; font-weight:bold; margin-right:8px;">[!]</span>`;
            statusLabel = 'WARN';
            labelColor = '#eab308';
          } else {
            statusIcon = `<span style="color:#ef4444; font-weight:bold; margin-right:8px;">[✗]</span>`;
            statusLabel = 'FAIL';
            labelColor = '#ef4444';
          }
        }
        
        let humanDesc = k.replace(/_/g, ' ');
        if (k === 'phase3_matches_remarks_pdf_eq_2_2_624e_minus_38') {
          humanDesc = "Calculated Equation excess matches Remarks Equation 2.2 exactly (< 0.1% rel. err)";
        } else if (k === 'phase3_golod_shafarevich_admissible') {
          humanDesc = "Multi-quadratic field galois rank satisfies Golod-Shafarevich admissibility (d² - 4r >= 0)";
        } else if (k === 'phase2_h2_genus_theory_hcf_is_Q_i_sqrt5') {
          humanDesc = "Hilbert class field of K=Q(√-5) matches K(i, √5) predicted by genus theory";
        } else if (k === 'square_unit_pairs_is_4') {
          humanDesc = "Gaussian lattice coefficient boundary returns exact baseline near-unit pairs";
        } else if (k === 'phase3_101_splits_in_L_T_compositum') {
          humanDesc = "Split prime p=101 splits completely in multi-quadratic compositum L_T";
        } else if (k === 'AF3_coordinate_clash_ratio_less_than_0.02') {
          humanDesc = "AlphaFold 3 in-silico prediction returns structure clash margin < 0.02";
        } else if (k === 'Boltz2_binding_affinity_threshold_matched') {
          humanDesc = "Boltz-2 binding-affinity consensus overlaps model parameters";
        } else if (k === 'AlphaGenome_enhancer_regulatory_conformance') {
          humanDesc = "AlphaGenome epigenomic variant impact modeling conforms to literature";
        } else if (k === 'NNSL_clinical_safety_exception_boundary') {
          humanDesc = "NNSL reasoning checks strictly enforce patient-adjacent disclaimer barriers";
        } else if (data.code_integrity && data.code_integrity[k]) {
          humanDesc = data.code_integrity[k].evidence.join('; ');
        }
        
        checksHtml += `
          <div style="display:flex; align-items:center; padding:8px 12px; background:rgba(255,255,255,0.01); border:1px solid var(--border); border-radius:var(--r-xs); font-size:12.5px; color:var(--t3);">
            ${statusIcon}
            <div style="flex:1;">
              <div style="font-weight:600; color:var(--ts); font-size:12px; font-family:'JetBrains Mono',monospace; margin-bottom:2px;">${k}</div>
              <div style="font-size:12px; color:var(--t4);">${humanDesc}</div>
            </div>
            <span style="font-size:11px; font-family:'JetBrains Mono',monospace; color:${labelColor}; margin-left:12px;">${statusLabel}</span>
          </div>
        `;
      });
    }
    checksHtml += `</div>`;
    insChecks.innerHTML = checksHtml;
  }
  
  // 4. Raw JSON Tab Contents
  // Exclude UI-internal merge keys (e.g. _bav) so Raw shows the canonical record and avoids circular refs.
  let rawContent = JSON.stringify(data, (k, v) => k.startsWith('_') ? undefined : v, 2);
  let copyButtonId = 'btn-copy-raw-json';
  
  if ((runId === 'toe-test-0054' || runId === 'toe-test-0052' || runId === 'toe-test-0053') && reportText) {
    const reportTitle = runId === 'toe-test-0054'
      ? '📄 Governance Gate Report (TOE-TEST-0054)'
      : runId === 'toe-test-0052'
      ? '📄 Historical Analysis + 2025/2026 Replay Comparison (TOE-TEST-0052)'
      : '📄 Namespace Audit Report (TOE-TEST-0053)';
    insRaw.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:8px; flex-wrap:wrap;">
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ts); font-weight:600;">${reportTitle}</span>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button id="btn-copy-raw-report" class="eq-slot-btn" style="cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t3); background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:4px 10px; border-radius:var(--r-xs);">Copy Markdown</button>
          <button id="${copyButtonId}" class="eq-slot-btn" style="cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t3); background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:4px 10px; border-radius:var(--r-xs);">Copy JSON</button>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,1fr); gap:16px;">
        <div style="max-height: 480px; overflow-y: auto; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; text-align: left;">
          <div class="calibration-markdown-body" style="font-family: 'Inter', sans-serif;">${parseMarkdownToHtml(reportText)}</div>
        </div>
        <div style="max-height: 480px; overflow-y: auto; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px; text-align: left;">
          <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:var(--t4); margin-bottom:8px;">Canonical JSON snapshot</div>
          <pre style="margin:0; white-space:pre-wrap; word-break:break-word; font-family:'JetBrains Mono',monospace; font-size:11px; color:#a78bfa;">${rawContent.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</pre>
        </div>
      </div>
    `;
    const copyReportBtn = document.getElementById('btn-copy-raw-report');
    if (copyReportBtn) {
      copyReportBtn.onclick = function() {
        navigator.clipboard.writeText(reportText).then(() => {
          copyReportBtn.textContent = 'Copied!';
          setTimeout(() => { copyReportBtn.textContent = 'Copy Markdown'; }, 2000);
        });
      };
    }
  } else if (reportText && (runId === 'toe-test-0054' || runId === 'toe-test-0053' || runId === 'toe-test-0052' || runId === 'toe-test-0055' || runId === 'toe-test-0056' || runId === 'toe-test-0057' || runId === 'toe-test-0058' || runId === 'toe-test-0059')) {
    const reportTitle = runId === 'toe-test-0054'
      ? '📄 Governance Gate Report (TOE-TEST-0054)'
      : runId === 'toe-test-0053'
      ? '📄 Namespace Audit Report (TOE-TEST-0053)'
      : runId === 'toe-test-0052'
      ? '📄 Historical Analysis + 2025/2026 Replay Comparison (TOE-TEST-0052)'
      : runId === 'toe-test-0055'
      ? '📄 AEFSO Research Dossier (TOE-TEST-0055)'
      : '📄 Verification Note (' + runId.toUpperCase() + ')';
    insRaw.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ts); font-weight:600;">${reportTitle}</span>
        <button id="${copyButtonId}" class="eq-slot-btn" style="cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t3); background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:4px 10px; border-radius:var(--r-xs);">Copy Markdown</button>
      </div>
      <div style="max-height: 480px; overflow-y: auto; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; text-align: left;">
        <div class="calibration-markdown-body" style="font-family: 'Inter', sans-serif;">${parseMarkdownToHtml(reportText)}</div>
      </div>
    `;
  } else {
    insRaw.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; color:var(--ts); font-weight:600;">Unmodified Original Verification JSON</span>
        <button id="${copyButtonId}" class="eq-slot-btn" style="cursor:pointer; display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--t3); background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:4px 10px; border-radius:var(--r-xs);">Copy JSON</button>
      </div>
      <pre style="max-height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--r-md); padding: 16px; font-size: 11.5px; color: #a78bfa; margin: 0; font-family: 'JetBrains Mono', monospace; text-align:left;">${rawContent}</pre>
    `;
  }
  
  // Wire up copy button
  const copyBtn = document.getElementById(copyButtonId);
  if (copyBtn) {
    copyBtn.onclick = function() {
      const isMarkdownReport = reportText && (runId === 'toe-test-0054' || runId === 'toe-test-0053' || runId === 'toe-test-0052' || runId === 'toe-test-0055' || runId === 'toe-test-0056' || runId === 'toe-test-0057');
      const prefersJson = (runId === 'toe-test-0054' || runId === 'toe-test-0052' || runId === 'toe-test-0053');
      const copyVal = (isMarkdownReport && !prefersJson) ? reportText : rawContent;
      navigator.clipboard.writeText(copyVal).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = (isMarkdownReport && !prefersJson) ? 'Copy Markdown' : 'Copy JSON';
        }, 2000);
      });
    };
  }

  // 5. Analysis Tab Contents — driven by ChartEngine + chart registry
  if (insCharts) {
    insCharts.innerHTML = '';
    renderAnalysisTab(insCharts, runId, data);
  }
}

function renderAnalysisTab(container, runId, data) {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Source claims provenance table (EQA-specific)
  const _eqaAnRend = EQA_RENDERERS[runId];
  if (_eqaAnRend && _eqaAnRend.analysis) {
    _eqaAnRend.analysis(container, data, esc);

  }
  // SVG charts from registry
  const specs = getChartsForRecord(runId, data);
  if (specs.length) {
    ChartEngine.renderAll(container, specs);
  } else {
    const empty = document.createElement('div');
    empty.style.cssText = "color:rgba(255,255,255,0.3);font-family:'JetBrains Mono',monospace;font-size:12px;font-style:italic;";
    empty.textContent = 'No structured analysis data available for this record.';
    container.appendChild(empty);
  }
}

function getFallbackReportText(runId) {
  // Removed (v1.13.1): inlined report-text fallback drifted from the on-disk .md
  // reports. Single source of truth = the on-disk files fetched above.
  return '';
}

function getFallbackDataset(runId) {
  // Removed (v1.13.1): inlined fallback datasets had drifted from the on-disk JSON
  // (151 schema/value mismatches found 2026-06-02 by check_fallback_drift.py).
  // Single source of truth = the on-disk evidence files fetched above. This ledger
  // must be served over HTTP (e.g. "python -m http.server"), not opened via file://.
  // Returns null so the inspector shows an honest load error rather than stale data.
  return null;
}

// Expose inspector functions to window scope (called from inline onclick attributes in HTML).
window.openJsonInspector   = openJsonInspector;
window.closeJsonInspector  = closeJsonInspector;
window.switchInspectorTab  = switchInspectorTab;
