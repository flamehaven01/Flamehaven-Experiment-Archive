// chart-builder.js — Factory helpers for ChartEngine spec objects.
// Callers use e.g. barChart(title, data, opts) instead of writing spec literals.
// Load order: chart-engine.js -> chart-builder.js -> eqa-registry.js -> ...

function barChart(title, data, opts) {
  return { type: 'bar', title, data, options: opts || {} };
}
function groupedBarChart(title, groups, series, opts) {
  return { type: 'grouped-bar', title, data: { groups, series }, options: opts || {} };
}
function donutChart(title, data, opts) {
  return { type: 'donut', title, data, options: opts || {} };
}
function plddtTrack(title, plddt, caption) {
  return { type: 'plddt-track', title, data: { plddt }, options: { caption } };
}
function paeHeatmap(title, matrix, maxValue, caption) {
  return { type: 'pae-heatmap', title, data: { matrix }, options: { scale: 'pae', maxValue, caption } };
}
function contactMap(title, matrix, caption) {
  return { type: 'contact-map', title, data: { matrix }, options: { scale: 'contact', caption } };
}
