// ── STATE VARIABLES ──────────────────────────────────────────────────────────
let cards = [];
let activeTier = 'all';
let activeColl = 'all';
let activeQuery = '';
let activeSort  = 'date-desc';

// Initialize card array on DOM load
document.addEventListener('DOMContentLoaded', () => {
  cards = Array.from(document.querySelectorAll('.report-card'));
  
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
  }
});

// ── DEEP LINK ROUTING ────────────────────────────────────────────────────────
function handleHashNavigation(hash) {
  if (hash === 'yorkeccak-bio' || hash === 'yorkeccak-bio-20260515') {
    openReportViewer('yorkeccak-bio', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.html', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.md', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.json', './stem-bio-ai/yorkeccak-bio/2026-05-15/report.pdf', 'yorkeccak/bio', 'STEM-BIO-AI · 2026-05-18');
  } else if (hash === 'bioclaw' || hash === 'bioclaw-20260521') {
    openReportViewer('bioclaw', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.html', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_report.md', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_experiment_results.json', './stem-bio-ai/bioclaw/2026-5-21/Runchuan-BU_BioClaw_detailed_7p.pdf', 'Runchuan-BU/BioClaw', 'STEM-BIO-AI · 2026-05-21');
  } else if (hash === 'pr-action-plan' || hash === 'pr-action-plan-v3') {
    openReportViewer('pr-action-plan', './extra/pr_action_plan_v3.html', '', '', '', 'PR Action Plan v3', 'Agent Review Dashboard');
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
  
  // Apply filtering
  applyFilters();
  
  // Smooth scroll to top of window
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ── CLOSE REPORT VIEWER (SMART NAV) ──────────────────────────────────────────
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
  
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.toggle('mobile-open');
  }
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
  const dbRexsyn = document.getElementById('dashboard-rexsyn');
  const portalIntro = document.querySelector('.portal-intro');
  const collStem = document.getElementById('coll-stem-bio-ai');
  const sectionExtras = document.getElementById('extras');
  const toolbar = document.querySelector('.toolbar');
  const resMeta = document.getElementById('result-meta');
  const reportViewer = document.getElementById('report-viewer');

  // Toggle project-specific dashboards
  if (dbToe) dbToe.classList.toggle('active', activeColl === 'toe');
  if (dbRexsyn) dbRexsyn.classList.toggle('active', activeColl === 'rexsyn');
  if (reportViewer) reportViewer.style.display = (activeColl === 'viewer') ? 'block' : 'none';

  // Toggle views dynamically
  if (portalIntro) portalIntro.style.display = (activeColl === 'all') ? '' : 'none';
  if (collStem) collStem.style.display = (activeColl === 'stem-bio-ai') ? '' : 'none';
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

  visible.forEach((c, i) => {
    c.style.order = i;
    // subtle stagger animation
    c.style.animation = 'none';
    c.offsetHeight; // reflow
    c.style.animation = `cardFadeIn .25s ease ${i * 40}ms both`;
  });

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

// ── COPY URL ──────────────────────────────────────────────────────────────────
function copyURL(path) {
  const base = getBaseUrl();
  const full = path.startsWith('http') ? path : base + path.replace(/^\.\//, '');
  navigator.clipboard.writeText(full).then(() => {
    const t = document.getElementById('toast');
    if (t) {
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2200);
    }
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

  // Setup connection link buttons
  const viewTabBtn = document.getElementById('btn-view-tab');
  if (viewTabBtn) viewTabBtn.href = absHtmlPath;
  
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

  // Bind copy clipboard button
  const copyBtn = document.getElementById('btn-copy-link');
  if (copyBtn) {
    copyBtn.onclick = function() {
      copyURL(absHtmlPath);
    };
  }

  // Update social shares
  const fullShareUrl = window.location.origin + window.location.pathname + '#' + reportId;
  const fbBtn = document.getElementById('btn-share-fb');
  if (fbBtn) fbBtn.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fullShareUrl);
  
  const liBtn = document.getElementById('btn-share-li');
  if (liBtn) liBtn.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(fullShareUrl);
  
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
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }
}

// Inject subtle fade-in animation rule into document head
const styleNode = document.createElement('style');
styleNode.textContent = `
  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cards-grid { animation: none; }
`;
document.head.appendChild(styleNode);
