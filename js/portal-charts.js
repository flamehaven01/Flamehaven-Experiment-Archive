// portal-charts.js — Chart spec dispatcher + generic fallback.
// Per-experiment builders are co-located in EQA_RENDERERS / BAV_RENDERERS (charts key).
// Load order: bav-renderers.js -> portal-charts.js -> portal-inspector.js -> portal.js

function getChartsForRecord(runId, data) {
  if (Array.isArray(data._charts) && data._charts.length) return data._charts;
  const eqaR = EQA_RENDERERS[runId];
  if (eqaR && eqaR.charts) return eqaR.charts(data);
  const bavR = BAV_RENDERERS[runId];
  if (bavR && bavR.charts) return bavR.charts(data);
  return buildGenericCharts(data);
}

function buildGenericCharts(data) {
  const checks = data.checks ?? {}, vals = Object.values(checks);
  if (!vals.length) return [];
  const passCount = vals.filter(Boolean).length, failCount = vals.length - passCount;
  return [donutChart('Verification Check Results',
    [{ label: 'Pass', value: passCount, color: '#10b981' }, ...(failCount > 0 ? [{ label: 'Fail', value: failCount, color: '#ef4444' }] : [])],
    { centerText: String(passCount), centerSub: 'of ' + vals.length + ' passed' })];
}
