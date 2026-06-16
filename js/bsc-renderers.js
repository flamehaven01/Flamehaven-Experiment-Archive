// bsc-renderers.js — BSC card and sidebar renderer.
// Reads BSC_REGISTRY; called by portal.js on DOMContentLoaded.

function renderBscCards() {
  var container = document.getElementById('bsc-cards-container');
  if (!container || typeof BSC_REGISTRY === 'undefined') return;
  BSC_REGISTRY.forEach(function(c) {
    var stages = c.stages.map(function(s) {
      return '<div class="stage-row">'
        + '<div class="stage-key">' + s.key + '</div>'
        + '<div class="stage-bar-track"><div class="stage-bar-fill" style="width:' + s.val + '%;background:' + s.color + '"></div></div>'
        + '<div class="stage-val">' + s.val + '</div>'
        + '</div>';
    }).join('');
    var signals = c.signals.map(function(s) {
      return '<div class="signal-item signal-' + s.type + '">'
        + '<div class="signal-dot"></div>'
        + '<div class="signal-text">' + s.text + '</div>'
        + '<div class="signal-score">' + s.score + '</div>'
        + '</div>';
    }).join('');
    var dlIconDown = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 1v6M2 5l3 3 3-3M2 9h6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var html = '<article class="report-card"'
      + ' data-score="' + c.score + '" data-tier="' + c.tier + '" data-coll="stem-bio-ai"'
      + ' data-date="' + c.auditDate + '" data-title="' + c.title + '" data-id="' + c.dataId + '">'
      // header
      + '<div class="card-body" style="padding-bottom:0;">'
      + '<div class="card-eyebrow">' + c.eyebrow + '</div>'
      + '<div class="card-title"><a href="#" onclick="openReportViewer('
        + JSON.stringify(c.id) + ',' + JSON.stringify(c.report) + ',' + JSON.stringify(c.reportMd) + ','
        + JSON.stringify(c.reportJson) + ',' + JSON.stringify(c.reportPdf) + ','
        + JSON.stringify(c.viewerTitle) + ',' + JSON.stringify(c.viewerEyebrow)
        + '); return false;">' + c.title + '</a></div>'
      + '<div class="card-date" style="margin-bottom:0;">Audit Date: ' + c.auditDate + ' \xb7 Expires: ' + c.expiryDate + '</div>'
      + '</div>'
      // score gauge
      + '<div class="card-score-panel">'
      + '<div class="score-gauge-wrap">'
      + '<svg class="score-gauge" width="84" height="84" viewBox="0 0 84 84">'
      + '<circle class="gauge-bg" cx="42" cy="42" r="34"/>'
      + '<circle class="gauge-fill" cx="42" cy="42" r="34" stroke="' + c.scoreColor + '"'
      + ' stroke-dasharray="' + c.gaugeArc + '" transform="rotate(-90 42 42)"/>'
      + '<text class="gauge-score-text" x="42" y="46" text-anchor="middle" font-size="16" fill="' + c.scoreColor + '">' + c.score + '</text>'
      + '<text class="gauge-denom" x="42" y="57" text-anchor="middle" font-size="9">/100</text>'
      + '</svg></div>'
      + '<div class="score-meta">'
      + '<div class="score-big" style="color:' + c.scoreColor + '">' + c.score + '</div>'
      + '<div class="score-label-sm">Final Score</div>'
      + '<span class="tier-chip ' + c.tierClass + '"><span class="tier-dot" style="background:' + c.tierDotVar + '"></span>' + c.tierLabel + '</span>'
      + '</div></div>'
      // stage bars
      + '<div class="card-stages">' + stages + '</div>'
      // brief + signals
      + '<div class="card-body" style="padding-top:10px;">'
      + '<div class="card-verdict"><strong style="color:var(--ts);font-size:11.5px;display:block;margin-bottom:4px;">Selection &amp; Evaluation Brief:</strong>' + c.brief + '</div>'
      + '<div class="signal-list">' + signals + '</div>'
      + '</div>'
      // downloads
      + '<div class="card-downloads">'
      + '<a class="dl-btn primary" href="#" onclick="openReportViewer('
        + JSON.stringify(c.id) + ',' + JSON.stringify(c.report) + ',' + JSON.stringify(c.reportMd) + ','
        + JSON.stringify(c.reportJson) + ',' + JSON.stringify(c.reportPdf) + ','
        + JSON.stringify(c.viewerTitle) + ',' + JSON.stringify(c.viewerEyebrow)
        + '); return false;"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="8" height="8" rx="1"/><path d="M3 5h4M5 3v4" stroke-linecap="round"/></svg>Open Report</a>'
      + '<button class="dl-btn" onclick="openJsonInspector(\'' + c.id + '\'); return false;"'
      + ' style="cursor:pointer;color:#a78bfa;border-color:rgba(167,139,250,0.2);background:rgba(167,139,250,0.05);font-weight:500;">'
      + '<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="5" cy="5" r="3.2"/><path d="M7.5 7.5l2.8 2.8" stroke-linecap="round"/></svg>Inspect</button>'
      + '<a class="dl-btn" href="' + c.articleUrl + '" target="_blank" rel="noopener">'
      + '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 3h10M1 6h7M1 9h5" stroke-linecap="round"/></svg>Read Article</a>'
      + '<a class="dl-btn" href="https://github.com/flamehaven01/STEM-BIO-AI" target="_blank" rel="noopener" title="' + c.scannerTitle + '">'
      + '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 3l3 3-3 3M6 9h4" stroke-linecap="round" stroke-linejoin="round"/></svg>Scanner (source)</a>'
      + '<a class="dl-btn" href="' + c.reportPdf + '" download>' + dlIconDown + 'PDF</a>'
      + '<a class="dl-btn" href="' + c.reportMd  + '" download>' + dlIconDown + 'MD</a>'
      + '<a class="dl-btn" href="' + c.reportJson + '" download>' + dlIconDown + 'JSON</a>'
      + '<button class="dl-copy-btn" onclick="copyURL(\'' + c.report + '\')" title="Copy link">'
      + '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="7" height="7" rx="1"/><path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2"/></svg>'
      + '</button>'
      + '</div>'
      + '</article>';
    container.insertAdjacentHTML('beforeend', html);
  });
}

function renderBscSidebar() {
  var filesDiv = document.querySelector('#child-stem-bio-ai .sb-files');
  if (!filesDiv || typeof BSC_REGISTRY === 'undefined') return;
  filesDiv.querySelectorAll('.sb-file').forEach(function(el) { el.remove(); });
  BSC_REGISTRY.forEach(function(c) {
    var a = document.createElement('a');
    a.className = 'sb-file';
    a.href = '#';
    (function(cfg) {
      a.onclick = function() {
        openReportViewer(cfg.id, cfg.report, cfg.reportMd, cfg.reportJson, cfg.reportPdf, cfg.viewerTitle, cfg.viewerEyebrow);
        highlightFile(this);
        return false;
      };
    })(c);
    a.innerHTML = '<span class="sb-file-dot" style="background:' + c.tierDotVar + '"></span>'
      + '<span class="sb-file-name" title="' + c.title + '">' + c.title + '</span>'
      + '<span class="sb-file-tier" style="color:' + c.tierDotVar + ';border-color:' + c.tierDotBdVar + '">' + c.tier + '</span>';
    filesDiv.appendChild(a);
  });
}
