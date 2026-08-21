// extra-renderers.js — Methodology & Frameworks sidebar and content renderers.
// Reads EXTRA_REGISTRY; called by portal.js on DOMContentLoaded.

function _extraSingleQuoted(value) {
  return "'" + String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}

function renderExtraItems() {
  if (typeof EXTRA_REGISTRY === 'undefined') return;
  _renderExtraCategory('extra-templates-list', EXTRA_REGISTRY.templates, true);
  _renderExtraCategory('extra-frameworks-list', EXTRA_REGISTRY.frameworks, false);
  _renderExtraCategory('extra-code-list', EXTRA_REGISTRY.practicalCode, false);
}

function _renderExtraCategory(containerId, items, hasIcon) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!items || !items.length) {
    el.innerHTML = '<div class="extra-empty-state">No items published yet.</div>';
    el.classList.add('extras-empty');
    return;
  }
  el.classList.remove('extras-empty');
  el.innerHTML = items.map(function(item) {
    var va = item.viewerArgs.map(_extraSingleQuoted).join(',');
    var iconHtml = hasIcon
      ? '<div class="extra-icon"><svg viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5">'
        + '<rect x="1" y="1" width="11" height="11" rx="1.5"/>'
        + '<path d="M4 5h6M4 7.5h4" stroke-linecap="round"/>'
        + '<circle cx="9" cy="9" r="2.5"/>'
        + '<path d="M10.8 10.8l1.2 1.2" stroke-linecap="round"/>'
        + '</svg></div>'
      : '';
    return '<div class="extra-item">'
      + iconHtml
      + '<div><div class="extra-name">' + item.name + '</div>'
      + '<div class="extra-meta">' + item.meta + '</div></div>'
      + '<a href="#" onclick="openReportViewer(' + va + '); return false;" class="extra-link">Open →</a>'
      + '</div>';
  }).join('');
}

function renderExtraSidebar() {
  if (typeof EXTRA_REGISTRY === 'undefined') return;
  _renderExtraSidebarCategory('extra-sb-templates',  EXTRA_REGISTRY.templates);
  _renderExtraSidebarCategory('extra-sb-frameworks',  EXTRA_REGISTRY.frameworks);
  _renderExtraSidebarCategory('extra-sb-code',        EXTRA_REGISTRY.practicalCode);
}

function _renderExtraSidebarCategory(containerId, items) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  if (!items || !items.length) {
    el.innerHTML = '<div style="padding:4px 8px;font-size:10px;color:var(--t5);font-style:italic;">Coming soon</div>';
    return;
  }
  items.forEach(function(item) {
    var a = document.createElement('a');
    a.className = 'sb-file';
    a.href = '#';
    (function(it) {
      a.onclick = function() {
        openReportViewer.apply(null, it.viewerArgs);
        highlightFile(this);
        return false;
      };
    })(item);
    a.innerHTML = '<span class="sb-file-dot" style="background:var(--tp)"></span>'
      + '<span class="sb-file-name" title="' + (item.nameTitle || item.name) + '">' + item.name + '</span>'
      + '<span class="sb-file-tier" style="color:var(--t4);border-color:var(--border)">' + (item.tier || '') + '</span>';
    el.appendChild(a);
  });
}
