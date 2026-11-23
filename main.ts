// radar-7 (token-radar-01, roni-rockabilly) — entry program.
// Node 22, standard library only, no network, deterministic.
//
// Reads the sealed snapshot, runs the pipeline in lib/model.ts
// (deriveAll -> selectUniverse -> fitValue -> testTerms -> fitOdds
// -> bootstrapBands -> farmPlan -> checkBoard), and writes the output
// directory in the starter's exact layout:
//
//   <out>/board.json      { rows: [...] } (100-4000 rows, gate-checked)
//   <out>/data.js         window.RADAR = {...} (the dashboard's dataset)
//   <out>/dashboard/      index.html + app.js + style.css (static, no network)
//   <out>/screenshots/    1-board, 2-detail, 3-filtered (3 images)
//   <out>/dossier.json    byte-for-byte what buildDossier writes
//
// Usage (outside the grader's container):
//   MAKEFUN_OUTPUT_DIR=out node main.ts --input input/snapshot.json
// In the grader's container: node main.ts reads /input, writes /output.

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { boardIssue, buildRadar, dataScript, deriveAll } from './lib/model.ts';
import { buildDossier } from './vendor/makefun-board.ts';

const here = fileURLToPath(new URL('.', import.meta.url));

const TEXT_MAX_BYTES = 65_536;
const SCREENSHOT_CAPS = { max: 4, max_bytes: 524_288 };
const IMAGE_NAME = /^[A-Za-z0-9_][A-Za-z0-9._-]{0,127}$/;

function arg(name: string, fallback: string): string {
  const at = process.argv.indexOf(`--${name}`);
  if (at >= 0 && at + 1 < process.argv.length) return process.argv[at + 1]!;
  const withEquals = process.argv.find((a) => a.startsWith(`--${name}=`));
  return withEquals === undefined ? fallback : withEquals.slice(name.length + 3);
}

const inputArg = arg('input', '/input');
const inputFile = inputArg.endsWith('.json') ? inputArg : join(inputArg, 'snapshot.json');
if (!existsSync(inputFile)) {
  process.stderr.write(`radar-7: no snapshot at ${inputFile}: pass --input <snapshot.json|directory> or mount the sealed /input\n`);
  process.exit(2);
}
const out = arg('output', process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// checksum = main.ts: first 8 hex of sha256(main.ts), printed on the cover.
const checksum = createHash('sha256').update(readFileSync(join(here, 'main.ts'))).digest('hex').slice(0, 8);

const t0 = Date.now();
const snapshot = deriveAll(readFileSync(inputFile, 'utf8'));
const { board, radar } = buildRadar(snapshot, checksum);
const issue = boardIssue(board, snapshot);
if (issue !== null) {
  process.stderr.write(`radar-7: the model wrote a board the gate refuses: ${issue}\n`);
  process.exit(1);
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'board.json'), `${JSON.stringify({ rows: board })}\n`);
writeFileSync(join(out, 'data.js'), dataScript(radar));

function copyFiles(from: string, to: string): string[] {
  if (!existsSync(from)) return [];
  mkdirSync(to, { recursive: true });
  const copied: string[] = [];
  for (const name of readdirSync(from)) {
    if (name.startsWith('.')) continue;
    const path = join(from, name);
    if (!statSync(path).isFile()) continue;
    copyFileSync(path, join(to, name));
    copied.push(name);
  }
  return copied;
}

copyFiles(join(here, 'dashboard'), join(out, 'dashboard'));
const shots = copyFiles(join(here, 'screenshots'), join(out, 'screenshots'));
if (shots.length < 3) {
  process.stderr.write(`radar-7: screenshots/ holds ${shots.length} image${shots.length === 1 ? '' : 's'}: hand in 3, the board, a detail view and a filtered view\n`);
  process.exit(1);
}
for (const name of shots) {
  if (!IMAGE_NAME.test(name)) {
    process.stderr.write(`radar-7: screenshots/${name}: a name is letters, digits and . _ -, 1 to 128 characters\n`);
    process.exit(1);
  }
}

writeFileSync(join(out, 'dossier.json'), buildDossier(out, { text_max_bytes: TEXT_MAX_BYTES, screenshots: SCREENSHOT_CAPS, dashboard: { max_files: 400, max_bytes: 4_194_304 } }));

const secs = (Date.now() - t0) / 1000;
const verdicts = { FARM: 0, MARGINAL: 0, SKIP: 0 };
for (const r of board) verdicts[r.verdict] += 1;
process.stdout.write(
  `radar-7: ${snapshot.protocols.length} protocols, ${snapshot.watchlist.length} on the watchlist, ${board.length} rows scored (${radar.early_size} early, ${radar.off_list_size} off-list)\n` +
    `radar-7: verdicts FARM ${verdicts.FARM} / MARGINAL ${verdicts.MARGINAL} / SKIP ${verdicts.SKIP}; total implied $${radar.total_implied_usd.toLocaleString('en-US')}\n` +
    `radar-7: wrote ${join(out, 'board.json')}, ${join(out, 'data.js')}, ${join(out, 'dashboard')}, ${join(out, 'screenshots')} (${shots.length} images) and ${join(out, 'dossier.json')} in ${secs.toFixed(1)}s\n`,
);
