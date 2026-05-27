// chart-engine.js
// Pure SVG chart renderer for Flamehaven Research Lab.
// No external dependencies. Exported to window.ChartEngine.
// Supports: bar (horizontal), donut, scatter, grouped-bar

(function () {
  'use strict';

  const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
  const FM = "'JetBrains Mono', monospace";
  const FS = "'Inter', sans-serif";

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtNum(v) {
    if (typeof v !== 'number') return String(v);
    if (v !== 0 && Math.abs(v) < 0.001) return v.toExponential(3);
    return Number.isInteger(v) ? String(v) : v.toFixed(4).replace(/\.?0+$/, '');
  }

  function wrapSvg(W, H, body) {
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;display:block;overflow:visible;">${body}</svg>`;
  }

  // ── HORIZONTAL BAR ──────────────────────────────────────────────────────
  // spec.data : [{label, value, color?, note?}]
  // spec.options: {maxValue?, unit?, caption?}

  function renderBar(spec) {
    const data = spec.data || [];
    if (!data.length) return '<div style="color:rgba(255,255,255,0.3);font-size:12px;">No data</div>';
    const opts = spec.options || {};
    const maxVal = opts.maxValue != null ? opts.maxValue : Math.max(...data.map(d => d.value), 1);
    const unit = opts.unit || '';
    const W = 520;
    const LW = 170; // label column width
    const VW = 100; // value column width
    const BW = W - LW - VW - 24; // bar column width
    const RH = 26; // row height
    const GAP = 8;
    const PAD = 14;
    const H = PAD * 2 + data.length * (RH + GAP) - GAP;

    const rows = data.map((d, i) => {
      const pct = Math.min(Math.max((d.value / maxVal), 0), 1);
      const barPx = (pct * BW).toFixed(1);
      const color = d.color || PALETTE[i % PALETTE.length];
      const y = PAD + i * (RH + GAP);
      const mid = (y + RH / 2).toFixed(1);
      const valStr = esc(fmtNum(d.value) + unit);
      const noteStr = d.note ? `<text x="${LW}" y="${(y + RH + 2).toFixed(1)}" fill="rgba(255,255,255,0.22)" font-size="8.5" font-family="${FS}">${esc(d.note)}</text>` : '';

      return `<text x="${(LW - 8).toFixed(0)}" y="${mid}" dominant-baseline="middle" text-anchor="end" fill="rgba(255,255,255,0.55)" font-size="11" font-family="${FM}">${esc(d.label)}</text>
<rect x="${LW}" y="${(y + 5).toFixed(1)}" width="${BW}" height="${(RH - 10).toFixed(0)}" rx="3" fill="rgba(255,255,255,0.04)"/>
<rect x="${LW}" y="${(y + 5).toFixed(1)}" width="${barPx}" height="${(RH - 10).toFixed(0)}" rx="3" fill="${color}"/>
<text x="${(LW + BW + 8).toFixed(0)}" y="${mid}" dominant-baseline="middle" fill="${color}" font-size="11" font-weight="600" font-family="${FM}">${valStr}</text>
${noteStr}`;
    }).join('\n');

    const caption = opts.caption
      ? `<div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:8px;font-family:${FS};line-height:1.55;">${esc(opts.caption)}</div>`
      : '';

    return wrapSvg(W, H, rows) + caption;
  }

  // ── DONUT ────────────────────────────────────────────────────────────────
  // spec.data : [{label, value, color}]
  // spec.options: {centerText?, centerSub?, caption?}

  function renderDonut(spec) {
    const data = (spec.data || []).filter(d => d.value > 0);
    const opts = spec.options || {};
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return '<div style="color:rgba(255,255,255,0.3);font-size:12px;">No data</div>';

    const R = 76, IR = 50, CX = 100, CY = 100;
    const W = 460, H = 210;
    const centerText = opts.centerText ?? String(total);
    const centerSub = opts.centerSub ?? 'total';

    let arcs = '';
    if (data.length === 1) {
      const color = data[0].color || PALETTE[0];
      arcs = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${color}" opacity="0.9"/>
<circle cx="${CX}" cy="${CY}" r="${IR}" fill="rgba(0,0,0,0.6)"/>`;
    } else {
      let angle = -Math.PI / 2;
      arcs = data.map((d, i) => {
        const sweep = (d.value / total) * 2 * Math.PI;
        const end = angle + sweep;
        const [x1, y1] = [CX + R * Math.cos(angle), CY + R * Math.sin(angle)];
        const [x2, y2] = [CX + R * Math.cos(end), CY + R * Math.sin(end)];
        const [xi1, yi1] = [CX + IR * Math.cos(end), CY + IR * Math.sin(end)];
        const [xi2, yi2] = [CX + IR * Math.cos(angle), CY + IR * Math.sin(angle)];
        const lg = sweep > Math.PI ? 1 : 0;
        const color = d.color || PALETTE[i % PALETTE.length];
        const path = `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${lg},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${xi1.toFixed(2)},${yi1.toFixed(2)} A${IR},${IR} 0 ${lg},0 ${xi2.toFixed(2)},${yi2.toFixed(2)} Z`;
        angle = end;
        return `<path d="${path}" fill="${color}" opacity="0.9"/>`;
      }).join('');
    }

    const legend = data.map((d, i) => {
      const color = d.color || PALETTE[i % PALETTE.length];
      const pct = ((d.value / total) * 100).toFixed(1);
      const lx = 214;
      const ly = 18 + i * 38;
      return `<rect x="${lx}" y="${ly}" width="10" height="10" rx="2" fill="${color}"/>
<text x="${lx + 16}" y="${ly + 9}" fill="rgba(255,255,255,0.65)" font-size="11" font-family="${FS}">${esc(d.label)}</text>
<text x="${lx + 16}" y="${ly + 21}" fill="rgba(255,255,255,0.3)" font-size="9" font-family="${FM}">${d.value} · ${pct}%</text>`;
    }).join('');

    const center = `<text x="${CX}" y="${CY - 7}" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="21" font-weight="700" font-family="${FM}">${esc(centerText)}</text>
<text x="${CX}" y="${CY + 11}" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="9.5" font-family="${FS}">${esc(centerSub)}</text>`;

    const caption = opts.caption
      ? `<div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:8px;font-family:${FS};line-height:1.55;">${esc(opts.caption)}</div>`
      : '';

    return wrapSvg(W, H, arcs + center + legend) + caption;
  }

  // ── SCATTER ──────────────────────────────────────────────────────────────
  // spec.data : [{x, y, label?, color?, size?}]
  // spec.options: {xLabel?, yLabel?, xRange?, yRange?, caption?}

  function renderScatter(spec) {
    const data = spec.data || [];
    const opts = spec.options || {};
    if (!data.length) return '<div style="color:rgba(255,255,255,0.3);font-size:12px;">No data</div>';

    const W = 460, H = 260;
    const PAD = { top: 18, right: 28, bottom: 46, left: 56 };
    const PW = W - PAD.left - PAD.right;
    const PH = H - PAD.top - PAD.bottom;

    const xs = data.map(d => d.x);
    const ys = data.map(d => d.y);
    const xMin = opts.xRange ? opts.xRange[0] : Math.min(...xs);
    const xMax = opts.xRange ? opts.xRange[1] : Math.max(...xs);
    const yMin = opts.yRange ? opts.yRange[0] : Math.min(...ys);
    const yMax = opts.yRange ? opts.yRange[1] : Math.max(...ys);
    const xSpan = xMax - xMin || 1;
    const ySpan = yMax - yMin || 1;

    const xS = v => PAD.left + ((v - xMin) / xSpan) * PW;
    const yS = v => PAD.top + PH - ((v - yMin) / ySpan) * PH;

    const N = 4;
    const grid = Array.from({ length: N + 1 }, (_, i) => {
      const xv = xMin + (i / N) * xSpan;
      const yv = yMin + (i / N) * ySpan;
      const gx = xS(xv).toFixed(1);
      const gy = yS(yv).toFixed(1);
      return `<line x1="${gx}" y1="${PAD.top}" x2="${gx}" y2="${PAD.top + PH}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="${gx}" y="${PAD.top + PH + 14}" text-anchor="middle" fill="rgba(255,255,255,0.28)" font-size="8.5" font-family="${FM}">${fmtNum(xv)}</text>
<line x1="${PAD.left}" y1="${gy}" x2="${PAD.left + PW}" y2="${gy}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="${PAD.left - 5}" y="${gy}" dominant-baseline="middle" text-anchor="end" fill="rgba(255,255,255,0.28)" font-size="8.5" font-family="${FM}">${fmtNum(yv)}</text>`;
    }).join('');

    const axes = `<line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + PH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
<line x1="${PAD.left}" y1="${PAD.top + PH}" x2="${PAD.left + PW}" y2="${PAD.top + PH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;

    const axisLabels = [
      opts.xLabel ? `<text x="${PAD.left + PW / 2}" y="${H - 4}" text-anchor="middle" fill="rgba(255,255,255,0.38)" font-size="10" font-family="${FS}">${esc(opts.xLabel)}</text>` : '',
      opts.yLabel ? `<text x="11" y="${PAD.top + PH / 2}" text-anchor="middle" transform="rotate(-90,11,${(PAD.top + PH / 2).toFixed(0)})" fill="rgba(255,255,255,0.38)" font-size="10" font-family="${FS}">${esc(opts.yLabel)}</text>` : '',
    ].join('');

    const points = data.map((d, i) => {
      const cx = xS(d.x).toFixed(1);
      const cy = yS(d.y).toFixed(1);
      const r = d.size ?? 5;
      const color = d.color || PALETTE[i % PALETTE.length];
      const lbl = d.label ? `<text x="${cx}" y="${(+cy - r - 3).toFixed(1)}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="8.5" font-family="${FS}">${esc(d.label)}</text>` : '';
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.88"/>${lbl}`;
    }).join('');

    const caption = opts.caption
      ? `<div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:8px;font-family:${FS};line-height:1.55;">${esc(opts.caption)}</div>`
      : '';

    return wrapSvg(W, H, grid + axes + axisLabels + points) + caption;
  }

  // ── GROUPED BAR (VERTICAL) ────────────────────────────────────────────────
  // spec.data : {groups:[{label,values:[]}], series:[{name,color}]}
  // spec.options: {maxValue?, unit?, caption?}

  function renderGroupedBar(spec) {
    const { groups = [], series = [] } = spec.data || {};
    const opts = spec.options || {};
    if (!groups.length) return '<div style="color:rgba(255,255,255,0.3);font-size:12px;">No data</div>';

    const W = 460;
    const PAD = { top: 14, right: 20, bottom: 58, left: 48 };
    const CHART_H = 180;
    const H = PAD.top + CHART_H + PAD.bottom;
    const PW = W - PAD.left - PAD.right;
    const allVals = groups.flatMap(g => g.values || []);
    const maxVal = opts.maxValue != null ? opts.maxValue : Math.max(...allVals, 1);
    const sN = Math.max(series.length, 1);
    const gW = PW / groups.length;
    const bW = Math.floor((gW * 0.72) / sN);

    const yS = v => CHART_H - Math.max((v / maxVal) * CHART_H, 0);

    const bars = groups.map((g, gi) => {
      const gx = PAD.left + gi * gW + gW * 0.14;
      const lx = (gx + (bW * sN) / 2).toFixed(1);
      const label = `<text x="${lx}" y="${PAD.top + CHART_H + 14}" text-anchor="middle" fill="rgba(255,255,255,0.42)" font-size="10" font-family="${FS}">${esc(g.label)}</text>`;
      const rects = (g.values || []).map((v, si) => {
        const color = (series[si] || {}).color || PALETTE[si % PALETTE.length];
        const bh = Math.max(((v / maxVal) * CHART_H), 2);
        const by = PAD.top + yS(v);
        const bx = (gx + si * bW).toFixed(1);
        const valY = (by - 3).toFixed(1);
        return `<rect x="${bx}" y="${by.toFixed(1)}" width="${bW - 2}" height="${bh.toFixed(1)}" rx="2" fill="${color}" opacity="0.88"/>
<text x="${(+bx + (bW - 2) / 2).toFixed(1)}" y="${valY}" text-anchor="middle" fill="${color}" font-size="9" font-weight="600" font-family="${FM}">${fmtNum(v)}</text>`;
      }).join('');
      return label + rects;
    }).join('');

    const N = 4;
    const yTicks = Array.from({ length: N + 1 }, (_, i) => {
      const v = (i / N) * maxVal;
      const y = (PAD.top + yS(v)).toFixed(1);
      return `<line x1="${PAD.left - 4}" y1="${y}" x2="${W - PAD.right}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
<text x="${PAD.left - 6}" y="${y}" dominant-baseline="middle" text-anchor="end" fill="rgba(255,255,255,0.28)" font-size="9" font-family="${FM}">${fmtNum(v)}</text>`;
    }).join('');

    const axes = `<line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + CHART_H}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
<line x1="${PAD.left}" y1="${PAD.top + CHART_H}" x2="${W - PAD.right}" y2="${PAD.top + CHART_H}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;

    const legend = series.map((s, i) => {
      const color = s.color || PALETTE[i % PALETTE.length];
      const lx = PAD.left + i * 130;
      const ly = PAD.top + CHART_H + 32;
      return `<rect x="${lx}" y="${ly}" width="9" height="9" rx="2" fill="${color}"/><text x="${lx + 14}" y="${ly + 8}" fill="rgba(255,255,255,0.5)" font-size="10" font-family="${FS}">${esc(s.name)}</text>`;
    }).join('');

    const caption = opts.caption
      ? `<div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:8px;font-family:${FS};line-height:1.55;">${esc(opts.caption)}</div>`
      : '';

    return wrapSvg(W, H, yTicks + axes + bars + legend) + caption;
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────

  const ChartEngine = {
    render(container, spec) {
      if (typeof container === 'string') container = document.getElementById(container);
      if (!container) return;

      const wrap = document.createElement('div');
      wrap.style.cssText = 'margin-bottom:28px;';

      if (spec.title) {
        const t = document.createElement('div');
        t.style.cssText = `font-family:${FM};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.38);margin-bottom:10px;border-left:2px solid rgba(255,255,255,0.12);padding-left:8px;`;
        t.textContent = spec.title;
        wrap.appendChild(t);
      }

      const chart = document.createElement('div');
      let html = '';
      switch (spec.type) {
        case 'bar':         html = renderBar(spec);         break;
        case 'donut':       html = renderDonut(spec);       break;
        case 'scatter':     html = renderScatter(spec);     break;
        case 'grouped-bar': html = renderGroupedBar(spec);  break;
        default:            html = `<div style="color:rgba(255,255,255,0.3);font-size:12px;">Unknown type: ${esc(spec.type)}</div>`;
      }
      chart.innerHTML = html;
      wrap.appendChild(chart);
      container.appendChild(wrap);
    },

    renderAll(container, specs) {
      if (typeof container === 'string') container = document.getElementById(container);
      if (container && Array.isArray(specs)) specs.forEach(s => this.render(container, s));
    },
  };

  window.ChartEngine = ChartEngine;
})();
