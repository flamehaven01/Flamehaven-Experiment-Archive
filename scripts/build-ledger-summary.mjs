import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const archiveUrl = 'https://flamehaven01.github.io/Flamehaven-Verification-Ledger/';

const laneDefinitions = {
  'stem-bio-ai': {
    key: 'stem-bio-ai',
    title: 'STEM-BIO-AI',
    status: 'active',
    summary: 'Deterministic repository evidence-surface audits for biomedical and medical-adjacent AI systems.',
  },
  toe: {
    key: 'toe',
    title: 'TOE',
    status: 'in_preparation',
    summary: 'Calibration and algebraic-geometric verification runs are in preparation.',
  },
  rexsyn: {
    key: 'rexsyn',
    title: 'REXSYN',
    status: 'in_preparation',
    summary: 'Integrated telemetry and conformational consensus briefings remain under pre-release review.',
  },
};

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function absoluteArchiveUrl(relativePath = '') {
  const normalized = relativePath ? toPosixPath(relativePath).replace(/^\/+/, '') : '';
  return normalized ? `${archiveUrl}${normalized}` : archiveUrl;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function firstNonEmptyLine(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(
      (line) =>
        Boolean(
          line &&
          !line.startsWith('#') &&
          !line.startsWith('-') &&
          !line.startsWith('Files:') &&
          !line.startsWith('|') &&
          !line.startsWith('>') &&
          !line.startsWith('**') &&
          !line.startsWith('**Published:**') &&
          !line.startsWith('**Repository:**') &&
          !line.startsWith('**Method:**'),
        ),
    )
    || '';
}

function extractReadmeMetadata(readmeText) {
  const metadata = {};

  for (const line of readmeText.split(/\r?\n/)) {
    const match = line.match(/^- ([^:]+): `?(.+?)`?$/);
    if (!match) {
      continue;
    }

    metadata[match[1].trim().toLowerCase()] = match[2].trim();
  }

  return metadata;
}

function pickFirstExistingFile(reportDir, candidates) {
  for (const candidate of candidates) {
    const fullPath = path.join(reportDir, candidate);
    if (fs.existsSync(fullPath)) {
      return candidate;
    }
  }

  return null;
}

function getRecordSummary(reportJson) {
  const score = reportJson?.score?.final_score;
  const tier = reportJson?.score?.formal_tier;
  const scope = reportJson?.score?.use_scope;
  const clinicalBoundary = reportJson?.classification?.has_explicit_clinical_boundary;

  const fragments = [];

  if (typeof score === 'number' && tier) {
    fragments.push(`${tier} at ${score}/100.`);
  } else if (tier) {
    fragments.push(`${tier}.`);
  }

  if (scope) {
    fragments.push(scope);
  }

  if (clinicalBoundary === false) {
    fragments.push('Clinical boundary language was not explicitly detected.');
  }

  return fragments.join(' ').trim();
}

function scanLaneRecords(laneDirName) {
  const laneRoot = path.join(repoRoot, laneDirName);
  if (!fs.existsSync(laneRoot)) {
    return [];
  }

  const targetDirs = fs.readdirSync(laneRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const records = [];

  for (const targetDir of targetDirs) {
    const targetRoot = path.join(laneRoot, targetDir.name);
    const dateDirs = fs.readdirSync(targetRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());

    for (const dateDir of dateDirs) {
      const reportDir = path.join(targetRoot, dateDir.name);
      const jsonFileName = pickFirstExistingFile(reportDir, [
        'report.json',
        `${targetDir.name}_report.json`,
        `${targetDir.name}_experiment_results.json`,
        'experiment_results.json',
        'Runchuan-BU_BioClaw_experiment_results.json',
      ]);

      if (!jsonFileName) {
        continue;
      }

      const jsonPath = path.join(reportDir, jsonFileName);
      const reportJson = readJson(jsonPath);
      const readmePath = path.join(reportDir, 'README.md');
      const analysisPath = path.join(reportDir, 'audit-analysis.md');
      const readmeText = readTextIfExists(readmePath);
      const analysisText = readTextIfExists(analysisPath);
      const readmeMetadata = extractReadmeMetadata(readmeText);

      const htmlFileName = pickFirstExistingFile(reportDir, [
        'report.html',
        `${targetDir.name}_report.html`,
        'Runchuan-BU_BioClaw_report.html',
      ]);
      const markdownFileName = pickFirstExistingFile(reportDir, [
        'report.md',
        `${targetDir.name}_report.md`,
        'Runchuan-BU_BioClaw_report.md',
      ]);
      const pdfFileName = pickFirstExistingFile(reportDir, [
        'report.pdf',
        `${targetDir.name}_detailed_7p.pdf`,
        'Runchuan-BU_BioClaw_detailed_7p.pdf',
      ]);
      const explainFileName = pickFirstExistingFile(reportDir, ['explain.txt']);

      const relativeDir = path.relative(repoRoot, reportDir);
      const lane = laneDefinitions[laneDirName];
      const auditDate = readmeMetadata['audit date'] || reportJson?.generated_at_local || dateDir.name;
      const repoName = reportJson?.target?.name || readmeMetadata.target || targetDir.name;
      const score = reportJson?.score?.final_score ?? null;
      const tier = reportJson?.score?.formal_tier ?? '';
      const title = `${lane.title}: ${repoName}`;
      const summary = firstNonEmptyLine(analysisText) || getRecordSummary(reportJson);
      const relativeJsonPath = path.relative(repoRoot, jsonPath);

      records.push({
        id: `${laneDirName}-${targetDir.name}-${dateDir.name}`.toLowerCase(),
        laneKey: lane.key,
        laneTitle: lane.title,
        title,
        repoName,
        targetSlug: targetDir.name,
        auditDate,
        score,
        tier,
        summary,
        useScope: reportJson?.score?.use_scope ?? '',
        sourceCommit: reportJson?.target?.commit ?? '',
        repoUrl: reportJson?.target?.remote ?? '',
        artifactFolder: absoluteArchiveUrl(relativeDir),
        urls: {
          folder: absoluteArchiveUrl(relativeDir),
          html: htmlFileName ? absoluteArchiveUrl(path.join(relativeDir, htmlFileName)) : '',
          markdown: markdownFileName ? absoluteArchiveUrl(path.join(relativeDir, markdownFileName)) : '',
          json: absoluteArchiveUrl(relativeJsonPath),
          pdf: pdfFileName ? absoluteArchiveUrl(path.join(relativeDir, pdfFileName)) : '',
          analysis: fs.existsSync(analysisPath) ? absoluteArchiveUrl(path.join(relativeDir, 'audit-analysis.md')) : '',
          explain: explainFileName ? absoluteArchiveUrl(path.join(relativeDir, explainFileName)) : '',
        },
      });
    }
  }

  return records.sort((a, b) => String(b.auditDate).localeCompare(String(a.auditDate)));
}

function buildSummary() {
  const activeRecords = Object.keys(laneDefinitions)
    .filter((laneKey) => laneKey === 'stem-bio-ai')
    .flatMap((laneKey) => scanLaneRecords(laneKey));

  const activeByLane = new Map();
  for (const record of activeRecords) {
    activeByLane.set(record.laneKey, (activeByLane.get(record.laneKey) || 0) + 1);
  }

  const lanes = Object.values(laneDefinitions).map((lane) => ({
    ...lane,
    recordCount: activeByLane.get(lane.key) || 0,
    latestAuditDate: activeRecords.find((record) => record.laneKey === lane.key)?.auditDate || '',
  }));

  return {
    schemaVersion: 'flamehaven-ledger-summary-v1',
    generatedAt: new Date().toISOString(),
    archiveUrl,
    sourceRepo: 'flamehaven-audit-reports',
    reportsActive: activeRecords.length,
    lanes,
    methodology: [
      {
        title: 'Agent Review Dashboard (PR Action Plan 2.0)',
        url: absoluteArchiveUrl('extra/pr_action_plan_v3.html'),
      },
    ],
    records: activeRecords,
  };
}

const outputPath = path.join(repoRoot, 'ledger-summary.json');
const summary = buildSummary();
fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${summary.records.length} active records.`);
