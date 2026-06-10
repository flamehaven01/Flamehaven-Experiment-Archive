// ── STATE VARIABLES ──────────────────────────────────────────────────────────
let cards = [];
let activeTier = 'all';
let activeColl = 'all';
let activeQuery = '';
let activeSort  = 'date-desc';
let activeEqKind = 'all';
let activeBavStatus = 'all';

const EQA_KIND_META = {
  all: { label: 'All' },
  'verification-run': { label: 'Verification Runs' },
  'non-run': { label: 'Non-Run Artifacts' },
};

const EQA_CLASS_META = {
  'verification-run': { label: 'Verification Run', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  'review-artifact': { label: 'Review Artifact', color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  'runtime-audit': { label: 'Runtime Audit', color: '#eab308', border: 'rgba(234,179,8,0.2)' },
  'governance-audit': { label: 'Governance Audit', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  'research-artifact': { label: 'Research Artifact', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
};

const EQA_CARD_TAXONOMY = {
  'eqa-card-0052': { kind: 'non-run', class: 'review-artifact' },
  'eqa-card-0053': { kind: 'non-run', class: 'runtime-audit' },
  'eqa-card-0054': { kind: 'non-run', class: 'governance-audit' },
  'eqa-card-0055': { kind: 'non-run', class: 'research-artifact' },
  'eqa-card-0056': { kind: 'verification-run', class: 'verification-run' },
  'eqa-card-0057': { kind: 'verification-run', class: 'verification-run' },
  'eqa-card-archive': { kind: 'verification-run', class: 'verification-run', badgeLabel: 'Historical Records', badgeColor: '#9ca3af', badgeBorder: 'rgba(156,163,175,0.2)' },
};

function hydrateEqaCardTaxonomy() {
  Object.entries(EQA_CARD_TAXONOMY).forEach(([id, meta]) => {
    const card = document.getElementById(id);
    if (!card) return;
    card.dataset.kind = meta.kind;
    card.dataset.class = meta.class;
    card.dataset.status = meta.kind; // legacy fallback for any older selectors

    const chip = card.querySelector('.tier-chip');
    if (!chip) return;
    const classMeta = EQA_CLASS_META[meta.class] || EQA_CLASS_META['verification-run'];
    const label = meta.badgeLabel || classMeta.label;
    const color = meta.badgeColor || classMeta.color;
    const border = meta.badgeBorder || classMeta.border;
    chip.style.color = color;
    chip.style.borderColor = border;
    const dot = chip.querySelector('.tier-dot');
    if (dot) dot.style.background = color;
    const labelNode = chip.querySelector('.tier-chip-label');
    if (labelNode) labelNode.textContent = label;
    else chip.innerHTML = `${dot ? dot.outerHTML : ''}${label}`;
  });
}

// Sidebar version tag — single source of truth: parse the latest CHANGELOG entry.
// No hardcoded version anywhere in the page; updates automatically on release.
async function hydrateLedgerVersion() {
  const num = document.querySelector('#ledger-version-tag .lv-num');
  if (!num) return;
  try {
    const res = await fetch('./CHANGELOG.md?t=' + Date.now());
    if (!res.ok) return;
    const m = (await res.text()).match(/##\s*\[(\d+\.\d+\.\d+)\]/);
    if (m) num.textContent = 'v' + m[1];
  } catch (e) { /* version tag is non-critical */ }
}

// ── Provenance classing (credibility Pillar 1b) ──────────────────────────────
// Every shown scientific/governance metric is labelled by where its authority
// comes from. Internal Flamehaven metrics (SR9/DI2/Omega/SPAR) are ADVISORY and
// never presented as external authority. See memory/credibility-architecture.md.
function provClassOf(label) {
  const s = String(label == null ? '' : label).toLowerCase();
  if (/(plddt|\bpae\b|ptm|contact|brier|\bauc\b|\bece\b)/.test(s)) return 'EXTERNAL';
  if (/(p_e2e|e2e|capture|transfer)/.test(s)) return 'DERIVED';
  if (/(sr9|di2|sidrce|coherence|spar|nnsl|resonance|drift|omega|ω)/.test(s)) return 'ADVISORY-HEURISTIC';
  return null;  // incidental values (counts, dates, grades) carry no class chip
}
function provChip(cls) {
  if (!cls) return '';
  const M = {
    'EXTERNAL': ['#10b981', 'EXTERNAL', 'Defined by a third party (e.g. AlphaFold / DeepMind, a published result) and externally checkable.'],
    'DERIVED': ['#60a5fa', 'DERIVED', 'Computed by Flamehaven from external inputs via a published, recomputable formula.'],
    'ADVISORY-RULE-BASED': ['#eab308', 'RULE', 'Deterministic rule output that cites an external basis (statute / taxonomy).'],
    'ADVISORY-HEURISTIC': ['#9ca3af', 'ADVISORY', 'Flamehaven internal metric — not externally validated; shown for transparency, not as a claim.'],
  };
  const [c, txt, tip] = M[cls];
  return `<span title="${tip}" style="display:inline-block;margin-top:6px;font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:0.04em;text-transform:uppercase;color:${c};border:1px solid ${c}55;border-radius:3px;padding:0 4px;">${txt}</span>`;
}
// Shared metric card: label + value + an auto-derived provenance chip. The BAV
// inspector renderers delegate their local `metric` to this (one source of truth).
function metricCard(label, value, color) {
  return `<div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border); padding: 16px; border-radius: var(--r-md);"><div style="font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--t4); text-transform: uppercase;">${label}</div><div style="font-size: 20px; font-weight: 600; color: ${color || 'var(--ts)'}; margin-top: 4px;">${value}</div>${provChip(provClassOf(label))}</div>`;
}
// Subordinate ADVISORY-HEURISTIC metric cards (SR9/DI2/Omega): collapsed by default,
// below the external/derived facts — present for audit, never a headline (Pillar 1b).
function advisoryDetails(cardsHtml) {
  if (!cardsHtml || !cardsHtml.trim()) return '';
  return `<details style="margin-top:16px;border:1px solid var(--border);border-radius:var(--r-md);background:rgba(255,255,255,0.01);overflow:hidden;">
      <summary style="cursor:pointer;padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--t4);list-style:none;">Pipeline internals &middot; advisory (Flamehaven metrics, not externally validated)</summary>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;padding:0 14px 14px;">${cardsHtml}</div>
    </details>`;
}

// Initialize card array on DOM load
// BAV archive: populate the foundational-iterations list from manifest (live, no hardcoding).
async function renderBavArchive() {
  const list = document.getElementById('bav-archive-list');
  if (!list) return;
  let mf = null;
  try { mf = await fetch('./bav/archive/manifest.json?t=' + Date.now()).then(r => r.ok ? r.json() : null); } catch (e) { /* ignore */ }
  if (!mf || !Array.isArray(mf.runs)) { list.innerHTML = '<div style="color:var(--t4);font-style:italic;padding:8px;">Archive manifest unavailable.</div>'; return; }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const grad = new Set(mf.graduated || []);
  list.innerHTML = mf.runs.map((r, i) => {
    const isGrad = grad.has(r.id);
    const m = r.metrics || {};
    const hasData = !!r.has_data;
    const tag = isGrad ? '<span style="font-size:9px;font-family:\'JetBrains Mono\',monospace;color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:3px;padding:1px 5px;">graduated</span>' : '';
    const note = r.note ? `<a href="${esc(r.note)}" target="_blank" rel="noopener" onclick="event.stopPropagation();" style="display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#a78bfa;text-decoration:none;border:1px solid rgba(167,139,250,0.25);border-radius:4px;padding:3px 8px;">↗ ${esc(r.note_label || 'Note')}</a>` : '';
    // Closed (no data): plain non-expandable row, dimmed, with a "no record" marker.
    if (!hasData) {
      return `<div style="flex-shrink:0;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);opacity:0.55;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;">
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t4);"><span style="color:#3f3f46;">·</span> <span style="color:#6b7280;">${esc(r.id)}</span> · ${esc(r.theme)}</span>
          <span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--t5);">no record</span>
        </div></div>`;
    }
    // Open (has data): expandable row with real metrics.
    const metricChips = [];
    if (typeof m.sr9_resonance === 'number') metricChips.push(`<span style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:${m.sr9_resonance >= 0.80 ? '#10b981' : '#eab308'};border:1px solid var(--border);border-radius:3px;padding:1px 6px;margin:4px 4px 0 0;">SR9 ${m.sr9_resonance.toFixed(3)}</span>`);
    if (typeof m.coherence === 'number') metricChips.push(`<span style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t4);border:1px solid var(--border);border-radius:3px;padding:1px 6px;margin:4px 4px 0 0;">coherence ${m.coherence}</span>`);
    ['status', 'verdict', 'decision', 'grade'].forEach(k => { if (m[k]) metricChips.push(`<span style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);border:1px solid var(--border);border-radius:3px;padding:1px 6px;margin:4px 4px 0 0;">${esc(k)}: ${esc(m[k])}</span>`); });
    if (m.report) metricChips.push(`<span style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:#a78bfa;border:1px solid rgba(167,139,250,0.25);border-radius:3px;padding:1px 6px;margin:4px 4px 0 0;">report ✓</span>`);
    const sr9Chip = (typeof m.sr9_resonance === 'number')
      ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${m.sr9_resonance >= 0.80 ? '#10b981' : '#eab308'};border:1px solid var(--border);border-radius:3px;padding:1px 6px;">SR9 ${m.sr9_resonance.toFixed(3)}</span>` : '';
    return `<div class="bav-arch-row" onclick="openJsonInspector('bav-arch-${esc(r.id)}')" style="flex-shrink:0;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);cursor:pointer;overflow:hidden;" title="Open in Ledger Inspector">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="color:#a78bfa;">⌕</span> <span style="color:#6b7280;">${esc(r.id)}</span> · ${esc(r.theme)}</span>
        <span style="display:flex;align-items:center;gap:6px;flex-shrink:0;">${sr9Chip}${tag}</span>
      </div>
    </div>`;
  }).join('');
}


function copyFooterLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('footer-share-copy');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#10b981" stroke-width="1.8"><path d="M2 6l3 3 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  cards = Array.from(document.querySelectorAll('.report-card'));
  hydrateEqaCardTaxonomy();
  hydrateLedgerVersion();
  // Generate EQA sidebar entries from registry (replaces hardcoded HTML)
  if (typeof EQA_REGISTRY !== 'undefined') {
    document.querySelectorAll('#child-toe .sb-files').forEach(function(filesDiv) {
      const archive = filesDiv.querySelector('[data-keep]');
      filesDiv.querySelectorAll('.sb-file:not([data-keep])').forEach(function(el) { el.remove(); });
      EQA_REGISTRY.forEach(function(cfg) {
        if (!cfg.sidebar) return;
        const d = document.createElement('div');
        d.className = 'sb-file';
        d.style.cssText = 'margin-left:8px;padding-left:14px;';
        d.onclick = function() {
          highlightFile(this);
          activeColl = 'toe';
          if (typeof applyFilters === 'function') applyFilters();
          const card = document.getElementById(cfg.sidebar.cardId);
          if (card) card.scrollIntoView({ behavior: 'smooth' });
        };
        d.innerHTML = '<span class="sb-file-dot" style="background:' + cfg.sidebar.dot + '"></span>'
          + '<span class="sb-file-name">' + cfg.sidebar.label
          + (cfg.sidebar.sub ? ' <span style="font-size:10px;color:var(--t5);">(' + cfg.sidebar.sub + ')</span>' : '')
          + '</span>';
        filesDiv.insertBefore(d, archive);
      });
    });
  }
  // Dynamic folder badge counts (re-run after sidebar generation)
  document.querySelectorAll('.sb-folder-btn[data-id]').forEach(btn => {
    const children = document.getElementById('child-' + btn.dataset.id);
    if (!children) return;
    const badge = btn.querySelector('.sb-folder-badge');
    if (badge && /^\d+$/.test(badge.textContent.trim())) {
      badge.textContent = String(children.querySelectorAll('.sb-file').length);
    }
  });

  // Footer share icons — static page URL
  const fUrl = encodeURIComponent(window.location.href);
  const fTitle = encodeURIComponent('Flamehaven Verification Ledger');
  const fFb = document.getElementById('footer-share-fb');
  if (fFb) fFb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + fUrl;
  const fLi = document.getElementById('footer-share-li');
  if (fLi) fLi.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + fUrl;
  const fX = document.getElementById('footer-share-x');
  if (fX) fX.href = 'https://x.com/intent/tweet?url=' + fUrl + '&text=' + fTitle;
  const fEmail = document.getElementById('footer-share-email');
  if (fEmail) fEmail.href = 'mailto:?subject=' + fTitle + '&body=' + fUrl;

  renderBavArchive();
  
  // Apply initial filters
  applyFilters();
  
  // Register active nav section intersection observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && activeColl !== 'viewer') {
        const coll = e.target.dataset.coll || 'stem-bio-ai';
        document.querySelectorAll('.coll-pill').forEach(p => p.classList.remove('active'));
        const pill = document.querySelector(`.coll-pill[onclick*="${coll}"]`);
        if (pill) pill.classList.add('active');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.collection-section').forEach(s => observer.observe(s));
  
  // Check deep links hash on load
  const hash = window.location.hash.substring(1);
  if (hash) {
    handleHashNavigation(hash);
  } else {
    goHome();
  }

  // Render the real EQA foundational-run archive (TOE-TEST-0001~0051)
  if (window.renderEqaArchive) {
    window.renderEqaArchive();
  }

  // ── Sidebar folder tooltips (position:fixed to bypass overflow:hidden) ───
  const sbTip = document.createElement('div');
  sbTip.id = 'sb-tip';
  document.body.appendChild(sbTip);

  function positionSbTip(e) {
    const x = e.clientX + 16;
    const y = e.clientY - sbTip.offsetHeight / 2;
    sbTip.style.left = Math.min(x, window.innerWidth - sbTip.offsetWidth - 10) + 'px';
    sbTip.style.top  = Math.max(8, Math.min(y, window.innerHeight - sbTip.offsetHeight - 8)) + 'px';
  }

  document.querySelectorAll('.sb-folder-header').forEach(el => {
    const tipEl = el.querySelector('.sb-tooltip');
    if (!tipEl) return;
    el.addEventListener('mouseenter', e => {
      sbTip.innerHTML = tipEl.innerHTML;
      sbTip.classList.add('active');
      positionSbTip(e);
    });
    el.addEventListener('mousemove', positionSbTip);
    el.addEventListener('mouseleave', () => sbTip.classList.remove('active'));
  });
});

// ── DEEP LINK ROUTING ────────────────────────────────────────────────────────
function handleHashNavigation(hash) {
  if (hash === 'yorkeccak-bio' || hash === 'yorkeccak-bio-20260515') {
    openReportViewer('yorkeccak-bio', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.html', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.md', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.json', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.pdf', 'yorkeccak/bio', 'Bioscience Compliance · 2026-05-18');
  } else if (hash === 'bioclaw' || hash === 'bioclaw-20260521') {
    openReportViewer('bioclaw', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.html', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.md', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_experiment_results.json', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_detailed_7p.pdf', 'Runchuan-BU/BioClaw', 'Bioscience Compliance · 2026-05-21');
  } else if (hash === 'pr-action-plan' || hash === 'pr-action-plan-v3') {
    openReportViewer('pr-action-plan', './extra/pr_action_plan_v3.html', '', '', '', 'PR Action Plan v3', 'Agent Review Dashboard');
  } else if (hash === 'toe-test-0057' || hash === 'qsot-compiler') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0057');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0057');
    }, 150);
  } else if (hash === 'toe-test-0055' || hash === 'toe-test-0056-legacy-aefso' || hash === 'toe-test-aefso' || hash === 'aefso') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0055');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0055');
    }, 150);
  } else if (hash === 'toe-test-0056' || hash === 'openai-erdos-eq22') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0056');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0056');
    }, 150);
  } else if (hash === 'toe-test-0054') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0054');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0054');
    }, 150);
  } else if (hash === 'toe-test-0053') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0053');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0053');
    }, 150);
  } else if (hash === 'toe-test-0052') {
    activeColl = 'toe';
    applyFilters();
    setTimeout(() => {
      const card = document.getElementById('eqa-card-0052');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      openJsonInspector('toe-test-0052');
    }, 150);
  }
}

// Listen to hash changes in browser history
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    handleHashNavigation(hash);
  } else {
    goHome();
  }
});

// ── NAVIGATE HOME ────────────────────────────────────────────────────────────
function goHome(e) {
  if (e) e.preventDefault();
  activeColl = 'all';
  activeTier = 'all';
  activeQuery = '';
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  
  const sbSearchInput = document.getElementById('sb-search-input');
  if (sbSearchInput) sbSearchInput.value = '';
  
  // Clear the iframe src to prevent background runs
  const iframe = document.getElementById('report-iframe');
  if (iframe) iframe.src = 'about:blank';
  
  // Clear URL hash state cleanly
  history.replaceState(null, null, window.location.pathname);
  
  // Reset explorer highlights
  document.querySelectorAll('.sb-folder-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sb-file').forEach(f => f.classList.remove('sb-active'));
  
  closeJsonInspector();
  
  // Apply filtering
  applyFilters();
  
  // Smooth scroll to top of window
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ── CLOSE REPORT VIEWER (SMART NAV) ──────────────────────────────────────────
function copyReportLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btn-share-copy');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#10b981" stroke-width="1.8"><path d="M2 6l3 3 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  });
}

function closeReport(e) {
  if (e) e.preventDefault();
  
  // Determine which collection to return to based on the current hash/state before closing
  let targetColl = 'stem-bio-ai'; // Default to stem-bio-ai
  const hash = window.location.hash.substring(1);
  if (hash === 'pr-action-plan' || hash === 'pr-action-plan-v3') {
    targetColl = 'extra';
  }
  
  // Clear the iframe src to prevent background runs
  const iframe = document.getElementById('report-iframe');
  if (iframe) iframe.src = 'about:blank';
  
  // Clean URL hash state cleanly
  history.replaceState(null, null, window.location.pathname);
  
  // Reset explorer active file highlights
  document.querySelectorAll('.sb-file').forEach(f => f.classList.remove('sb-active'));
  
  // Update state
  activeColl = targetColl;
  
  // Highlight and expand the folder in the sidebar tree
  const folderBtn = document.querySelector(`.sb-folder-btn[data-id="${targetColl}"]`);
  if (folderBtn) {
    document.querySelectorAll('.sb-folder-btn').forEach(b => b.classList.remove('active'));
    folderBtn.classList.add('active');
    
    // Ensure the folder is expanded
    if (!folderBtn.classList.contains('open')) {
      const children = document.getElementById(`child-${targetColl}`);
      folderBtn.classList.add('open');
      if (children) {
        children.classList.add('open');
      }
    }
  }
  
  // Apply filtering
  applyFilters();
  
  // Smooth scroll back to the collection section
  const targetSec = document.getElementById(targetColl === 'extra' ? 'extras' : 'coll-stem-bio-ai');
  if (targetSec) {
    targetSec.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}

// ── EXPLORER INTERACTIVE JS ──────────────────────────────────────────────────
function toggleFolder(btn) {
  const folderId = btn.dataset.id;
  const children = document.getElementById(`child-${folderId}`);
  const isOpen = btn.classList.toggle('open');

  if (children) {
    children.classList.toggle('open', isOpen);
    // Also toggle .sb-files directly inside (flat structure — no .sb-series wrapper)
    const filesEl = children.querySelector('.sb-files');
    if (filesEl) filesEl.classList.toggle('open', isOpen);
  }
  
  document.querySelectorAll('.sb-folder-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  if (folderId === 'stem-bio-ai') {
    filterColl('stem-bio-ai', document.querySelector('.coll-pill[onclick*="stem-bio-ai"]'));
  } else if (folderId === 'extra') {
    filterColl('extra', document.querySelector('.coll-pill[onclick*="extra"]'));
  } else {
    filterColl(folderId, null);
  }
}

window.openCollection = function(folderId) {
  const folderBtn = document.querySelector(`.sb-folder-btn[data-id="${folderId}"]`);
  if (folderBtn) {
    document.querySelectorAll('.sb-folder-btn').forEach(b => b.classList.remove('active'));
    folderBtn.classList.add('active');
    
    // Ensure the folder is expanded
    if (!folderBtn.classList.contains('open')) {
      folderBtn.classList.add('open');
      const children = document.getElementById(`child-${folderId}`);
      if (children) {
        children.classList.add('open');
        const filesEl = children.querySelector('.sb-files');
        if (filesEl) filesEl.classList.add('open');
      }
    }

    if (folderId === 'stem-bio-ai') {
      filterColl('stem-bio-ai', null);
    } else if (folderId === 'extra') {
      filterColl('extra', null);
    } else {
      filterColl(folderId, null);
    }
    
    // Smooth scroll back to top of new dashboard view
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
};

function toggleSeries(btn) {
  const isOpen = btn.classList.toggle('open');
  const files = btn.nextElementSibling;
  if (files) {
    files.classList.toggle('open', isOpen);
  }
}

function highlightFile(link) {
  document.querySelectorAll('.sb-file').forEach(f => f.classList.remove('sb-active'));
  link.classList.add('sb-active');
  
  if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sb-backdrop');
  if (sidebar) {
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (backdrop) backdrop.classList.toggle('active', isOpen);
  }
}

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sb-backdrop');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('active');
}

function handleSidebarSearch() {
  const sbVal = document.getElementById('sb-search-input').value;
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = sbVal;
  
  const query = sbVal.toLowerCase().trim();
  const fileItems = document.querySelectorAll('.sb-file, .sb-extra-link');
  
  fileItems.forEach(item => {
    const textNode = item.querySelector('.sb-file-name');
    if (textNode) {
      const text = textNode.textContent.toLowerCase();
      const match = !query || text.includes(query);
      item.style.display = match ? 'flex' : 'none';
    }
  });
  
  activeQuery = query;
  applyFilters();
}

// ── GUIDE TOGGLE ──────────────────────────────────────────────────────────────
function toggleGuide() {
  const body = document.getElementById('guide-body');
  const btn  = document.getElementById('guide-btn');
  if (body && btn) {
    const hidden = body.classList.toggle('hidden');
    btn.textContent = hidden ? '▼ expand' : '▲ collapse';
  }
}

// ── FILTER FUNCTIONS ──────────────────────────────────────────────────────────
function filterTier(tier, el) {
  activeTier = tier;
  document.querySelectorAll('#tier-filters .filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  applyFilters();
}

function filterColl(coll, el) {
  activeColl = coll;
  document.querySelectorAll('.coll-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  if (coll === 'extra') {
    const extrasSection = document.getElementById('extras');
    if (extrasSection) extrasSection.scrollIntoView({behavior:'smooth'});
  }
  applyFilters();
}

function handleSearch() {
  const mainVal = document.getElementById('search-input').value;
  const sbSearchInput = document.getElementById('sb-search-input');
  if (sbSearchInput) sbSearchInput.value = mainVal;
  
  const query = mainVal.toLowerCase().trim();
  const fileItems = document.querySelectorAll('.sb-file, .sb-extra-link');
  
  fileItems.forEach(item => {
    const textNode = item.querySelector('.sb-file-name');
    if (textNode) {
      const text = textNode.textContent.toLowerCase();
      const match = !query || text.includes(query);
      item.style.display = match ? 'flex' : 'none';
    }
  });
  
  activeQuery = query;
  applyFilters();
}

function handleSort() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    activeSort = sortSelect.value;
    applyFilters();
  }
}

// ── KEYBOARD SHORTCUT (/) ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault();
    const sidebarSearch = document.getElementById('sb-search-input');
    const mainSearch = document.getElementById('search-input');
    
    if (window.innerWidth > 768 && sidebarSearch) {
      sidebarSearch.focus();
      sidebarSearch.select();
    } else if (mainSearch) {
      mainSearch.focus();
      mainSearch.select();
    }
  }
  if (e.key === 'Escape') {
    const mainSearch = document.getElementById('search-input');
    const sidebarSearch = document.getElementById('sb-search-input');
    if (mainSearch) mainSearch.blur();
    if (sidebarSearch) sidebarSearch.blur();
  }
});

// ── RENDER FILTERING ─────────────────────────────────────────────────────────
function applyFilters() {
  if (cards.length === 0) return;
  
  let visible = [];

  // Get view wrappers
  const dbToe = document.getElementById('dashboard-toe');
  const dbBav = document.getElementById('dashboard-bav');
  const portalIntro = document.querySelector('.portal-intro');
  const collStem = document.getElementById('coll-stem-bio-ai');
  const sectionExtras = document.getElementById('extras');
  const toolbar = document.querySelector('.toolbar');
  const resMeta = document.getElementById('result-meta');
  const reportViewer = document.getElementById('report-viewer');

  // Toggle project-specific dashboards
  if (dbToe) dbToe.classList.toggle('active', activeColl === 'toe');
  if (dbBav) dbBav.classList.toggle('active', activeColl === 'rexsyn');
  if (reportViewer) reportViewer.style.display = (activeColl === 'viewer') ? 'block' : 'none';

  // Toggle views dynamically
  if (portalIntro) portalIntro.style.display = (activeColl === 'all') ? '' : 'none';
  if (collStem) collStem.style.display = (activeColl === 'stem-bio-ai') ? '' : 'none';
  const dbExtra = document.getElementById('dashboard-extra');
  if (dbExtra) dbExtra.style.display = (activeColl === 'extra') ? 'block' : 'none';
  if (sectionExtras) sectionExtras.style.display = (activeColl === 'extra') ? '' : 'none';
  if (toolbar) toolbar.style.display = (activeColl === 'stem-bio-ai') ? '' : 'none';
  if (resMeta) resMeta.style.display = (activeColl === 'stem-bio-ai') ? '' : 'none';

  // Toggle mission card (only on Home/All view)
  const missionCard = document.querySelector('.archive-mission-card');
  if (missionCard) missionCard.style.display = (activeColl === 'all') ? '' : 'none';

  // Toggle stats row and score guide (only on STEM-BIO-AI view)
  const statsRow = document.querySelector('.stats-row');
  const scoreGuide = document.querySelector('.score-guide');
  const showStatsAndGuide = (activeColl === 'stem-bio-ai');
  if (statsRow) statsRow.style.display = showStatsAndGuide ? '' : 'none';
  if (scoreGuide) scoreGuide.style.display = showStatsAndGuide ? '' : 'none';

  // Compute BSC stats dynamically from DOM — no hardcoded counts
  if (showStatsAndGuide) {
    const cards = document.querySelectorAll('.report-card[data-coll="stem-bio-ai"]');
    const t1Count = document.querySelectorAll('.report-card[data-coll="stem-bio-ai"][data-tier="T1"]').length;
    const t2Count = document.querySelectorAll('.report-card[data-coll="stem-bio-ai"][data-tier="T2"]').length;
    const scores = [...cards].map(c => Number(c.dataset.score)).filter(s => !isNaN(s));
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '—';
    const elTotal = document.getElementById('stat-total');
    const elAvg   = document.getElementById('stat-avg');
    const elT1    = document.getElementById('stat-t1');
    const elT2    = document.getElementById('stat-t2');
    if (elTotal) elTotal.textContent = cards.length;
    if (elAvg)   elAvg.textContent   = avg !== '—' ? `${avg}/100` : '—';
    if (elT1)    elT1.textContent    = t1Count ? `${t1Count} T1` : '0';
    if (elT2)    elT2.textContent    = t2Count ? `${t2Count} T2` : '0';
  }

  // Highlight corresponding coll pill
  document.querySelectorAll('.coll-pill').forEach(p => {
    const onclickText = p.getAttribute('onclick') || '';
    p.classList.toggle('active', onclickText.includes(`'${activeColl}'`));
  });

  // If we are not on stem-bio-ai, hide the empty state and stop filtering reports
  const emptyState = document.getElementById('empty-state');
  if (activeColl !== 'stem-bio-ai') {
    if (emptyState) emptyState.style.display = 'none';
    return;
  }

  // Filter STEM-BIO-AI reports
  cards.forEach(card => {
    const tier   = card.dataset.tier;
    const coll   = card.dataset.coll;
    const title  = card.dataset.title.toLowerCase();
    const verdict = card.querySelector('.card-verdict')?.textContent.toLowerCase() || '';

    const tierOk  = activeTier === 'all' || tier === activeTier;
    const collOk  = activeColl === 'all' || coll === activeColl;
    const queryOk = !activeQuery || title.includes(activeQuery) || verdict.includes(activeQuery);

    if (tierOk && collOk && queryOk) {
      card.style.display = '';
      visible.push(card);
    } else {
      card.style.display = 'none';
    }
  });

  // Sort
  visible.sort((a, b) => {
    const aScore = +a.dataset.score;
    const bScore = +b.dataset.score;
    const aDate  = a.dataset.date;
    const bDate  = b.dataset.date;
    if (activeSort === 'score-desc') return bScore - aScore;
    if (activeSort === 'score-asc')  return aScore - bScore;
    if (activeSort === 'date-asc')   return aDate.localeCompare(bDate);
    return bDate.localeCompare(aDate); // date-desc default
  });

  // Set order and clear animation in one pass, then trigger single batch reflow
  visible.forEach((c, i) => { c.style.order = i; c.style.animation = 'none'; });
  void document.body.offsetHeight;
  visible.forEach((c, i) => { c.style.animation = `cardFadeIn .25s ease ${i * 40}ms both`; });

  const count = visible.length;
  const resultCount = document.getElementById('result-count');
  if (resultCount) resultCount.textContent = count;
  
  if (resMeta) {
    resMeta.innerHTML = `Showing <span id="result-count">${count}</span> of ${cards.length} reports`;
  }
  
  if (emptyState) {
    emptyState.style.display = count === 0 ? 'block' : 'none';
  }
}

// ── COPY URL ──────────────────────────────────────────────────────────────────
// Helper to get robust base URL for same-directory resolution
function getBaseUrl() {
  const loc = window.location;
  let path = loc.pathname;
  if (!path.endsWith('/') && !path.split('/').pop().includes('.')) {
    path += '/';
  } else {
    path = path.replace(/\/[^/]*$/, '/');
  }
  return loc.origin + path;
}


// ── ARTICLE LINKS (flamehaven.space writing) ──────────────────────────────────
const ARTICLE_LINKS = {
  'yorkeccak-bio':          'https://flamehaven.space/writing/your-bio-repo-could-get-you-fined-here-is-why-we-check-every-single-one/',
  'bioclaw':                'https://flamehaven.space/writing/stanford-princeton-a-biorxiv-paper-so-why-did-nobody-ask-where-the-data-goes/',
  'effective-html-template':'https://flamehaven.space/writing/the-meeting-nobody-could-follow--the-format-of-ai-output-is-a-design-decision-we-made-it-wrong-for-three-years/',
};

// ── COPY URL ──────────────────────────────────────────────────────────────────
function copyURL(path) {
  const base = getBaseUrl();
  const full = path.startsWith('http') ? path : base + path.replace(/^\.\//, '');
  navigator.clipboard.writeText(full).then(() => {
    const t = document.getElementById('toast');
    if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }
  });
}

// ── OPEN REPORT VIEWER ────────────────────────────────────────────────────────
function openReportViewer(reportId, htmlPath, mdPath, jsonPath, pdfPath, reportTitle, reportEyebrow) {
  // Clear any existing active class from sidebar explorer
  document.querySelectorAll('.sb-file').forEach(f => f.classList.remove('sb-active'));
  
  // Find matching sidebar file node and highlight it
  const sidebarLinks = Array.from(document.querySelectorAll('.sb-file'));
  const matchLink = sidebarLinks.find(link => {
    const onclickVal = link.getAttribute('onclick') || '';
    return onclickVal.includes(`'${reportId}'`);
  });
  if (matchLink) {
    matchLink.classList.add('sb-active');
  }

  // Update browser hash state without page refresh
  history.replaceState(null, null, '#' + reportId);

  // Resolve absolute paths for maximum robustness in subfolder hostings
  const base = getBaseUrl();
  const absHtmlPath = htmlPath.startsWith('http') ? htmlPath : base + htmlPath.replace(/^\.\//, '');

  // Set the iframe source and headers (with cache-busting parameter to bypass cached crashed versions)
  const iframe = document.getElementById('report-iframe');
  if (iframe) {
    iframe.src = absHtmlPath + '?t=' + new Date().getTime();
  }
  
  const titleNode = document.getElementById('viewer-title');
  if (titleNode) titleNode.textContent = reportTitle;
  
  const eyebrowNode = document.getElementById('viewer-eyebrow');
  if (eyebrowNode) eyebrowNode.textContent = reportEyebrow;

  // Article link (flamehaven.space writing)
  const articleBtn = document.getElementById('btn-article');
  if (articleBtn) {
    const articleUrl = ARTICLE_LINKS[reportId];
    if (articleUrl) {
      articleBtn.href = articleUrl;
      articleBtn.style.display = '';
    } else {
      articleBtn.style.display = 'none';
    }
  }

  // Setup connection link buttons
  const viewTabBtn = document.getElementById('btn-view-tab');
  if (viewTabBtn) viewTabBtn.href = absHtmlPath;

  // HTML download button — shown only for reports with a downloadable HTML artifact
  const HTML_DOWNLOADABLE = ['effective-html-template'];
  const htmlDlBtn = document.getElementById('btn-dl-html');
  if (htmlDlBtn) {
    if (htmlPath && HTML_DOWNLOADABLE.includes(reportId)) {
      htmlDlBtn.href = absHtmlPath;
      htmlDlBtn.style.display = '';
    } else {
      htmlDlBtn.style.display = 'none';
    }
  }
  
  const mdBtn = document.getElementById('btn-dl-md');
  if (mdBtn) {
    if (mdPath) {
      mdBtn.style.display = '';
      mdBtn.href = mdPath.startsWith('http') ? mdPath : base + mdPath.replace(/^\.\//, '');
    } else {
      mdBtn.style.display = 'none';
    }
  }

  const jsonBtn = document.getElementById('btn-dl-json');
  if (jsonBtn) {
    if (jsonPath) {
      jsonBtn.style.display = '';
      jsonBtn.href = jsonPath.startsWith('http') ? jsonPath : base + jsonPath.replace(/^\.\//, '');
    } else {
      jsonBtn.style.display = 'none';
    }
  }

  const pdfBtn = document.getElementById('btn-dl-pdf');
  if (pdfBtn) {
    if (pdfPath) {
      pdfBtn.style.display = '';
      pdfBtn.href = pdfPath.startsWith('http') ? pdfPath : base + pdfPath.replace(/^\.\//, '');
    } else {
      pdfBtn.style.display = 'none';
    }
  }

  // Update social shares
  const fullShareUrl = window.location.origin + window.location.pathname + '#' + reportId;
  const fbBtn = document.getElementById('btn-share-fb');
  if (fbBtn) fbBtn.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fullShareUrl);
  
  const liBtn = document.getElementById('btn-share-li');
  if (liBtn) liBtn.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(fullShareUrl);

  const xBtn = document.getElementById('btn-share-x');
  if (xBtn) xBtn.href = 'https://x.com/intent/tweet?url=' + encodeURIComponent(fullShareUrl) + '&text=' + encodeURIComponent('Flamehaven Labs Audit: ' + reportTitle);

  const emailBtn = document.getElementById('btn-share-email');
  if (emailBtn) {
    emailBtn.href = 'mailto:?subject=' + encodeURIComponent('Flamehaven Labs Audit: ' + reportTitle) +
      '&body=' + encodeURIComponent('View Flamehaven Labs Audit Report for ' + reportTitle + ' here: ' + fullShareUrl);
  }

  // Toggle collection view mode
  activeColl = 'viewer';
  
  // Re-run filter display checks
  applyFilters();
  
  // Smooth scroll down to viewer
  const viewerPanel = document.getElementById('report-viewer');
  if (viewerPanel) {
    viewerPanel.scrollIntoView({ behavior: 'smooth' });
  }

  // Slide mobile sidebar closed on mobile click
  if (window.innerWidth <= 768) closeSidebar();
}


// ── LEDGER FILTERING (unified for EQA + BAV lanes) ────────────────────────
const LANE_CFG = {
  toe:    { stateKey: 'activeEqKind',    dashId: '#dashboard-toe', searchId: 'eq-local-search',  cardSel: '.eq-card',  filterAttr: 'kind' },
  rexsyn: { stateKey: 'activeBavStatus', dashId: '#dashboard-bav', searchId: 'bav-local-search', cardSel: '.bav-card', filterAttr: 'status' },
};

function filterLedger(lane, status, btn) {
  if (lane === 'toe') activeEqKind = status;
  else activeBavStatus = status;
  document.querySelectorAll(`${LANE_CFG[lane].dashId} .eq-filter-pill`).forEach(p => {
    p.classList.remove('active');
    p.style.color = 'var(--t4)';
  });
  if (btn) { btn.classList.add('active'); btn.style.color = 'var(--t3)'; }
  applyLedgerFilters(lane);
  closeJsonInspector();
}

function applyLedgerFilters(lane) {
  const cfg = LANE_CFG[lane];
  const activeStatus = lane === 'toe' ? activeEqKind : activeBavStatus;
  const query = (document.getElementById(cfg.searchId)?.value || '').toLowerCase().trim();
  document.querySelectorAll(cfg.cardSel).forEach(card => {
    const cardValue = card.dataset[cfg.filterAttr] || card.dataset.status;
    const match = (activeStatus === 'all' || cardValue === activeStatus) &&
                  (!query || card.textContent.toLowerCase().includes(query));
    if (match) {
      card.style.display = 'flex';
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = 'cardFadeIn 0.25s ease both';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterEqLedger(status, btn) { filterLedger('toe', status, btn); }
function filterBavLedger(status, btn) { filterLedger('rexsyn', status, btn); }
function applyEqFilters() { applyLedgerFilters('toe'); }
function applyBavFilters() { applyLedgerFilters('rexsyn'); }

// ── EXTRAS FILTERING ───────────────────────────────────────────────────────
function applyExtrasFilters() {
  const query = (document.getElementById('extras-local-search')?.value || '').toLowerCase().trim();
  const extraItems = document.querySelectorAll('.extra-item');
  extraItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = !query || text.includes(query);
    item.style.display = match ? 'flex' : 'none';
  });
}

// ── UNIFORM LOCAL SEARCH HANDLER ───────────────────────────────────────────
window.handleLocalSearch = function(type) {
  if (type === 'toe') {
    applyEqFilters();
  } else if (type === 'rexsyn') {
    applyBavFilters();
  } else if (type === 'extras') {
    applyExtrasFilters();
  }
};

// ── INTERACTIVE JSON INSIGHT INSPECTOR ───────────────────────────────────────

// Interactive Precision Steering Sandbox logic inspired by CorrSteer
window.steerPrecision = function(bits, btn) {
  // Update button states
  const parent = btn.parentElement;
  parent.querySelectorAll('.precision-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = 'rgba(255,255,255,0.02)';
    b.style.color = 'var(--t4)';
    b.style.borderColor = 'var(--border)';
  });
  btn.classList.add('active');
  btn.style.background = 'rgba(167, 139, 250, 0.1)';
  btn.style.color = 'var(--ts)';
  btn.style.borderColor = 'rgba(167, 139, 250, 0.3)';
  
  const baselinePanel = document.getElementById('sandbox-baseline');
  const steeredPanel = document.getElementById('sandbox-steered');
  if (!baselinePanel || !steeredPanel) return;
  
  // Baseline always collapses
  baselinePanel.innerHTML = `
    <div style="color: #ef4444; font-weight: 700; margin-bottom: 6px; font-size: 13px;">COLLAPSE TO ABSOLUTE ZERO</div>
    <div style="font-size: 11px; color: var(--t4); margin-bottom: 8px;">Standard IEEE-754 Float64 Double</div>
    <div style="margin-bottom: 4px;">Computed Exponent Excess:</div>
    <div style="color: #ef4444; font-weight: 600; font-family: monospace; font-size: 12px; background: rgba(239, 68, 68, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.1); margin-bottom: 6px;">0.0000000000000000e+00</div>
    <div>Relative Error vs Literature: <span style="color: #ef4444; font-weight: 600;">100%</span></div>
    <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--t4); line-height: 1.4;">❌ Catastrophic arithmetic cancellation occurred in the multi-quadratic exponents subtraction. The difference underflows normal computer floats.</p>
  `;
  
  if (bits === 32) {
    steeredPanel.innerHTML = `
      <div style="color: #ef4444; font-weight: 700; margin-bottom: 6px; font-size: 13px;">CATASTROPHIC UNDERFLOW</div>
      <div style="font-size: 11px; color: var(--t4); margin-bottom: 8px;">Standard IEEE-754 Float32 Single</div>
      <div style="margin-bottom: 4px;">Computed Exponent Excess:</div>
      <div style="color: #ef4444; font-weight: 600; font-family: monospace; font-size: 12px; background: rgba(239, 68, 68, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.1); margin-bottom: 6px;">0.000000e+00</div>
      <div>Relative Error vs Literature: <span style="color: #ef4444; font-weight: 600;">100%</span></div>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--t4); line-height: 1.4;">❌ FAILED. 32-bit floats have only 24 bits of mantissa, completely failing to register the -38 exponent excess order of magnitude.</p>
    `;
  } else if (bits === 64) {
    steeredPanel.innerHTML = `
      <div style="color: #ef4444; font-weight: 700; margin-bottom: 6px; font-size: 13px;">CATASTROPHIC UNDERFLOW</div>
      <div style="font-size: 11px; color: var(--t4); margin-bottom: 8px;">Standard IEEE-754 Float64 Double</div>
      <div style="margin-bottom: 4px;">Computed Exponent Excess:</div>
      <div style="color: #ef4444; font-weight: 600; font-family: monospace; font-size: 12px; background: rgba(239, 68, 68, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.1); margin-bottom: 6px;">0.0000000000000000e+00</div>
      <div>Relative Error vs Literature: <span style="color: #ef4444; font-weight: 600;">100%</span></div>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--t4); line-height: 1.4;">❌ FAILED. Standard double precision fails when evaluating splitting primes, resulting in absolute underflow to zero.</p>
    `;
  } else if (bits === 128) {
    steeredPanel.innerHTML = `
      <div style="color: #eab308; font-weight: 700; margin-bottom: 6px; font-size: 13px;">UNSTABLE EXPONENT RESOLVED</div>
      <div style="font-size: 11px; color: var(--t4); margin-bottom: 8px;">IEEE-754 Float128 (Quad Precision)</div>
      <div style="margin-bottom: 4px;">Computed Exponent Excess:</div>
      <div style="color: #eab308; font-weight: 600; font-family: monospace; font-size: 12px; background: rgba(234, 179, 8, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(234, 179, 8, 0.1); margin-bottom: 6px;">6.0248197481938592e-38</div>
      <div>Relative Error vs Literature: <span style="color: #eab308; font-weight: 600;">~3.4484%</span></div>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--t4); line-height: 1.4;">⚠️ UNSTABLE. Exponent excess resolved partially, but low bit guard bounds introduce floating class-number margin drift.</p>
    `;
  } else if (bits === 200) {
    steeredPanel.innerHTML = `
      <div style="color: #10b981; font-weight: 700; margin-bottom: 6px; font-size: 13px;">PERFECT EQA PRECISION LOCK</div>
      <div style="font-size: 11px; color: var(--t4); margin-bottom: 8px;">Arbitrary Precision (mpmath 200-bit)</div>
      <div style="margin-bottom: 4px;">Computed Exponent Excess:</div>
      <div style="color: #10b981; font-weight: 600; font-family: monospace; font-size: 12px; background: rgba(16, 185, 129, 0.05); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.1); margin-bottom: 6px;">6.2391096431518170e-38</div>
      <div>Relative Error vs Literature: <span style="color: #10b981; font-weight: 600;">0.0143% (Exact)</span></div>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: var(--t4); line-height: 1.4;">✅ CLOSED CONTRACT. Perfect numerical precision lock prevents cancellation noise, fully reproducing literature Equation (2.2).</p>
    `;
  }
};

// ── BSC COMPLIANCE POLICY RULES ──────────────────────────────────────────────
// All scores derived from live inspector.jsonData — no hardcoding.
// Derivation:
//   baseline  = data.score.stage_1_readme_intent  (S1 intent-only, pre-governance)
//   standard  = data.score.final_score + data.score.formal_tier  (audit result as-is)
//   eu-ai-act = BLOCK if !has_explicit_clinical_boundary (Art. 12 hard rule)
//   mit-cap   = final_score - 10 if C5 triggered (clinical boundary absent, MIT AIRI V4_03)
function _bscTierLabel(score) {
  if (score >= 85) return 'T4 Accepted';
  if (score >= 70) return 'T3 Conditional';
  if (score >= 50) return 'T2 Caution';
  return 'T1 Quarantine';
}
function _bscTierColor(tier) {
  if (!tier) return '#ef4444';
  if (tier.startsWith('T1')) return '#f97316';
  if (tier.startsWith('T2')) return '#eab308';
  return '#10b981';
}
const COMPLIANCE_POLICIES = {
  standard(data) {
    const score = data.score.final_score;
    const tier = data.score.formal_tier;
    const s1 = data.score.stage_1_readme_intent || score;
    const delta = s1 - score;
    const deltaStr = delta > 0 ? ` (Δ −${delta} from S1 naive ${s1})` : '';
    const c = _bscTierColor(tier);
    return { header: 'DIAGNOSTIC ALIGNMENT SIGNALED', headerColor: c,
      label: 'Policy: Standard Prior — actual audit result, no additional policy applied',
      metricLabel: 'Full Audit Score:',
      metric: `${score} | ${tier}${deltaStr}`, metricColor: c, metricBg: 'rgba(255,255,255,0.02)', metricBd: 'var(--border)',
      note: delta > 0
        ? `Governance weighting reduced S1 naive score by Δ −${delta} (${s1} → ${score}). Clinical boundary gaps penalized but promotion not halted.`
        : 'Observational compliance mapped. Scoring weights applied. No promotion halt triggered.' };
  },
  'eu-ai-act'(data) {
    const hasBoundary = data.classification && data.classification.has_explicit_clinical_boundary;
    if (!hasBoundary) return { header: 'ARTICLE 12 COMPLIANCE BLOCKED', headerColor: '#ef4444',
      label: 'Policy: EU AI Act High-Risk Gating', metricLabel: 'Compliance Verdict:',
      metric: 'BLOCKED | T0 Gated Floor',
      metricColor: '#ef4444', metricBg: 'rgba(239,68,68,0.05)', metricBd: 'rgba(239,68,68,0.1)',
      note: '❌ FAILED. Art. 12 mandates clinical disclaimer boundaries. Missing boundary lock forces T0 hard-floor override.' };
    const score = data.score.final_score; const tier = data.score.formal_tier; const c = _bscTierColor(tier);
    return { header: 'ARTICLE 12 COMPLIANT', headerColor: c, label: 'Policy: EU AI Act High-Risk Gating',
      metricLabel: 'Compliance Verdict:', metric: `Score: ${score} | ${tier}`,
      metricColor: c, metricBg: 'rgba(255,255,255,0.02)', metricBd: 'var(--border)',
      note: '✅ Clinical boundary requirements satisfied under Art. 12.' };
  },
  'mit-cap'(data) {
    const c5 = data.classification && data.classification.has_explicit_clinical_boundary === false;
    const penalty = c5 ? 10 : 0;
    const score = Math.max(0, data.score.final_score - penalty);
    const tier = _bscTierLabel(score); const col = c5 ? '#eab308' : _bscTierColor(tier);
    return { header: c5 ? 'MIT AIRI RISK PENALTY ENGAGED' : 'MIT AIRI COMPLIANT', headerColor: col,
      label: 'Policy: MIT AI Risk Rep. Penalty Cap', metricLabel: 'Steered Score &amp; Verdict:',
      metric: c5 ? `${score} | ${tier} (−${penalty} C5 penalty)` : `${score} | ${tier}`,
      metricColor: col, metricBg: c5 ? 'rgba(234,179,8,0.05)' : 'rgba(255,255,255,0.02)',
      metricBd: c5 ? 'rgba(234,179,8,0.1)' : 'var(--border)',
      note: c5 ? `⚠️ WARN. C5 detector triggered (clinical boundary absent) → −${penalty} penalty applied under MIT AIRI V4_03.`
               : '✅ No C5 penalty triggered. MIT AIRI requirements satisfied.' };
  },
};

// Bio-Audit Compliance Steering Sandbox — data-driven, no hardcoded scores
window.steerCompliance = function(policy, runId, btn) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.precision-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = 'rgba(255,255,255,0.02)';
    b.style.color = 'var(--t4)';
    b.style.borderColor = 'var(--border)';
  });
  btn.classList.add('active');
  btn.style.background = 'rgba(167, 139, 250, 0.1)';
  btn.style.color = 'var(--ts)';
  btn.style.borderColor = 'rgba(167, 139, 250, 0.3)';

  const baselinePanel = document.getElementById('compliance-baseline');
  const steeredPanel = document.getElementById('compliance-steered');
  if (!baselinePanel || !steeredPanel) return;

  // Read live JSON from inspector cache — zero hardcoding
  const inspector = document.getElementById('eq-json-inspector');
  const data = inspector && inspector.jsonData;
  if (!data || !data.score) {
    steeredPanel.innerHTML = '<p style="color:var(--t4);font-size:12px;">Data not loaded yet.</p>';
    return;
  }

  // Baseline = stage_1_readme_intent (S1 intent-only, before governance weight application)
  const bs = data.score.stage_1_readme_intent || data.score.raw_score_before_floor || data.score.final_score;
  baselinePanel.innerHTML = `
    <div style="color:#ef4444;font-weight:700;margin-bottom:6px;font-size:13px;">UNRESOLVED CLINICAL HAZARDS</div>
    <div style="font-size:11px;color:var(--t4);margin-bottom:8px;">Baseline prior: unmapped library entry (S1 intent-only)</div>
    <div style="margin-bottom:4px;">Stage 1 Prior Score:</div>
    <div style="color:#ef4444;font-weight:600;font-family:monospace;font-size:14px;background:rgba(239,68,68,0.05);padding:4px 8px;border-radius:4px;border:1px solid rgba(239,68,68,0.1);margin-bottom:6px;">${bs} / 100</div>
    <p style="margin:6px 0 0 0;font-size:11px;color:var(--t4);line-height:1.4;">⚠️ Clinical-adjacent surfaces exist without an explicit disclaimer. No active safeguards pins matched repository constraints.</p>
  `;

  const policyFn = COMPLIANCE_POLICIES[policy];
  if (!policyFn) return;
  const r = policyFn(data);
  steeredPanel.innerHTML = `
    <div style="color:${r.headerColor};font-weight:700;margin-bottom:6px;font-size:13px;">${r.header}</div>
    <div style="font-size:11px;color:var(--t4);margin-bottom:8px;">${r.label}</div>
    <div style="margin-bottom:4px;">${r.metricLabel || 'Steered Score &amp; Verdict:'}</div>
    <div style="color:${r.metricColor};font-weight:600;font-family:monospace;font-size:14px;background:${r.metricBg};padding:4px 8px;border-radius:4px;border:1px solid ${r.metricBd};margin-bottom:6px;">${r.metric}</div>
    <p style="margin:6px 0 0 0;font-size:11px;color:var(--t4);line-height:1.4;">${r.note}</p>
  `;
};

// ── EQA FOUNDATIONAL-RUN ARCHIVE (TOE-TEST-0001~0051, real reports) ───
window.renderEqaArchive = async function() {
  const container = document.getElementById('eqa-archive-list');
  if (!container) return;
  let mf = null;
  try { mf = await fetch('./eqa/archive/manifest.json?t=' + Date.now()).then(r => r.ok ? r.json() : null); } catch (e) { /* ignore */ }
  if (!mf || !Array.isArray(mf.runs)) { container.innerHTML = '<div style="color:var(--t4);font-style:italic;padding:8px;">Archive manifest unavailable.</div>'; return; }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Aggregate stats banner from the real manifest (counts derived, not asserted).
  const withReport = mf.runs.filter(r => r.report_path).length;
  const dated = mf.runs.map(r => r.date).filter(Boolean).sort();
  const graded = mf.runs.filter(r => r.grade).length;
  const verificationRuns = mf.runs.filter(r => !r.non_run_artifact).length;
  const oldBanner = container.parentElement && container.parentElement.querySelector('.eqa-arch-stats');
  if (oldBanner) oldBanner.remove();
  const banner = document.createElement('div');
  banner.className = 'eqa-arch-stats';
  banner.style.cssText = 'display:flex;gap:18px;padding:7px 16px;background:rgba(167,139,250,0.04);border-bottom:1px solid rgba(167,139,250,0.12);flex-wrap:wrap;align-items:center;';
  banner.innerHTML = `
    <span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:600;color:var(--t3);">${mf.runs.length} records</span>
    ${verificationRuns !== mf.runs.length ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#9ca3af;">${verificationRuns} verification runs</span>` : ''}
    <span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#a78bfa;">&#9683; ${withReport} with verbatim report</span>
    ${graded ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#10b981;">&#10003; ${graded} graded</span>` : ''}
    ${dated.length ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--t4);">${dated[0]} → ${dated[dated.length-1]}</span>` : ''}
    <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t5);margin-left:auto;">imported from Flamehaven-TOE</span>
  `;
  container.parentElement && container.parentElement.insertBefore(banner, container);
  // Recent-first: TOE-TEST numbering is chronological, so show highest id first.
  const runs = mf.runs.slice().sort((a, b) => (b.id || '').localeCompare(a.id || ''));
  container.innerHTML = runs.map(r => {
    const hasReport = !!r.report_path;
    const gradeChip = r.grade ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:3px;padding:1px 5px;">${esc(r.grade)}</span>` : '';
    const errataChip = r.errata ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#eab308;border:1px solid rgba(234,179,8,0.35);border-radius:3px;padding:1px 5px;">errata</span>` : '';
    const parserChip = r.parser_sensitive ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#9ca3af;border:1px solid rgba(156,163,175,0.35);border-radius:3px;padding:1px 5px;">parser-sensitive</span>` : '';
    const gtChip = r.ground_truth_sensitive ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#eab308;border:1px solid rgba(234,179,8,0.35);border-radius:3px;padding:1px 5px;">ground-truth-sensitive</span>` : '';
    const nonRunChip = r.non_run_artifact ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#60a5fa;border:1px solid rgba(96,165,250,0.35);border-radius:3px;padding:1px 5px;">non-run</span>` : '';
    const dateChip = r.date ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t5);">${esc(r.date)}</span>` : '';
    const reportChip = hasReport
      ? `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:#a78bfa;border:1px solid rgba(167,139,250,0.25);border-radius:3px;padding:1px 5px;">report ✓</span>`
      : `<span style="font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--t5);border:1px solid var(--border);border-radius:3px;padding:1px 5px;">meta only</span>`;
    return `<div class="bav-arch-row" onclick="openJsonInspector('eqa-arch-${esc(r.id)}')" style="flex-shrink:0;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:var(--r-xs);cursor:pointer;overflow:hidden;" title="Open in Ledger Inspector">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;">
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="color:#a78bfa;">⌕</span> <span style="color:#6b7280;">${esc(r.id)}</span> <span style="font-family:'Inter',sans-serif;color:var(--t4);">${esc(r.title)}</span></span>
        <span style="display:flex;align-items:center;gap:6px;flex-shrink:0;">${dateChip}${gradeChip}${errataChip}${parserChip}${gtChip}${nonRunChip}${reportChip}</span>
      </div>
    </div>`;
  }).join('');
};

window.handleEqaArchiveSearch = function() {
  const query = (document.getElementById('eqa-archive-search') ? document.getElementById('eqa-archive-search').value : '').toLowerCase().trim();
  const items = document.querySelectorAll('#eqa-archive-list .bav-arch-row');
  items.forEach(item => {
    const txt = item.textContent.toLowerCase();
    item.style.display = (!query || txt.includes(query)) ? 'flex' : 'none';
  });
};

// Expose all key UI interaction handlers to window scope explicitly
// (openJsonInspector / closeJsonInspector / switchInspectorTab are exposed in portal-inspector.js)
window.openReportViewer = openReportViewer;
window.goHome = goHome;
window.closeReport = closeReport;
window.copyReportLink = copyReportLink;
window.copyFooterLink = copyFooterLink;
window.renderBavArchive = renderBavArchive;
window.toggleFolder = toggleFolder;
window.toggleSeries = toggleSeries;
window.highlightFile = highlightFile;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.handleSidebarSearch = handleSidebarSearch;
window.toggleGuide = toggleGuide;
window.filterTier = filterTier;
window.filterColl = filterColl;
window.handleSearch = handleSearch;
window.handleSort = handleSort;
window.filterEqLedger = filterEqLedger;
window.filterBavLedger = filterBavLedger;
