// Radar-7 test gauntlet. Runs main.ts against the real snapshot, corrupted
// inputs, edge cases, determinism (two runs byte-identical) and the kit gate
// limits. Every test prints PASS/FAIL with the reason. Exit 0 iff all pass.
//
//   node tests/gauntlet.mjs [workdir]
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const WORK = process.argv[2] ?? new URL('..', import.meta.url).pathname;
const MAIN = join(WORK, 'main.ts');
const REAL = join(WORK, 'input', 'snapshot.json');
const TMP = join(WORK, 'tests', '.tmp');
mkdirSync(TMP, { recursive: true });

let pass = 0;
let fail = 0;
const results = [];
function test(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (ok) { pass += 1; console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`); }
  else { fail += 1; console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`); }
}

/** Run main.ts on an input file into an out dir. Returns {code, stdout, stderr}. */
function runMain(input, out) {
  const r = spawnSync('node', [MAIN, '--input', input, '--output', out], { encoding: 'utf8', timeout: 120_000 });
  return { code: r.status ?? -1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function loadBoard(out) {
  return JSON.parse(readFileSync(join(out, 'board.json'), 'utf8'));
}

/** JPEG dimensions from SOF0/SOF2 markers (no image library needed). */
function jpegDims(path) {
  const b = readFileSync(path);
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length - 1) {
    if (b[i] !== 0xff) { i += 1; continue; }
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function dirBytes(dir) {
  let total = 0;
  let count = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) { total += statSync(p).size; count += 1; }
    }
  };
  walk(dir);
  return { total, count };
}

// ---------------------------------------------------------------- (a) real snapshot
const OUT_REAL = join(TMP, 'out-real');
const rReal = runMain(REAL, OUT_REAL);
test('(a) real snapshot exits 0', rReal.code === 0, rReal.code === 0 ? rReal.stdout.trim().split('\n')[0] ?? '' : rReal.stderr.slice(0, 200));
let board = null;
if (rReal.code === 0) {
  board = loadBoard(OUT_REAL);
  test('(a) board has 198 rows (40 watchlist + 138 early + 20 off-list)', board.rows.length === 198, `${board.rows.length} rows`);
  const tiers = board.rows.reduce((a, r) => { a[r.tier] = (a[r.tier] ?? 0) + 1; return a; }, {});
  test('(a) tiers are 40/138/20', tiers.watchlist === 40 && tiers.early === 138 && tiers['off-list'] === 20, JSON.stringify(tiers));
  const snap = JSON.parse(readFileSync(REAL, 'utf8'));
  test('(a) watchlist 40/40 covered', snap.watchlist.every((s) => board.rows.some((r) => r.slug === s)));
  test('(a) total implied is positive', board.rows.reduce((a, r) => a + r.implied_value_usd, 0) > 0, `$${board.rows.reduce((a, r) => a + r.implied_value_usd, 0).toLocaleString('en-US')}`);
}

// ---------------------------------------------------------------- (b) corrupted inputs
function variant(name, mutate) {
  const snap = JSON.parse(readFileSync(REAL, 'utf8'));
  mutate(snap);
  const p = join(TMP, `${name}.json`);
  writeFileSync(p, JSON.stringify(snap));
  return p;
}

const truncPath = join(TMP, 'truncated.json');
writeFileSync(truncPath, readFileSync(REAL, 'utf8').slice(0, Math.floor(statSync(REAL).size * 0.6)));
const rTrunc = runMain(truncPath, join(TMP, 'out-trunc'));
test('(b) truncated JSON refuses cleanly (non-zero exit, no board)', rTrunc.code !== 0 && !existsSync(join(TMP, 'out-trunc', 'board.json')), `exit ${rTrunc.code}`);

const rMissingFields = runMain(variant('missing-fields', (s) => {
  for (let i = 0; i < 10; i++) { delete s.protocols[i].change_7d; delete s.protocols[i].category; delete s.protocols[i].chains; }
}), join(TMP, 'out-missing-fields'));
test('(b) missing change_7d/category/chains still builds', rMissingFields.code === 0, rMissingFields.code === 0 ? '' : rMissingFields.stderr.slice(0, 160));

const rNull7d = runMain(variant('null-7d', (s) => { for (const p of s.protocols) p.change_7d = null; }), join(TMP, 'out-null-7d'));
test('(b) all change_7d null still builds', rNull7d.code === 0, rNull7d.code === 0 ? '' : rNull7d.stderr.slice(0, 160));

const rNoListed = runMain(variant('no-listed', (s) => { for (const p of s.protocols) p.listed_at = null; }), join(TMP, 'out-no-listed'));
test('(b) all listed_at missing still builds', rNoListed.code === 0, rNoListed.code === 0 ? '' : rNoListed.stderr.slice(0, 160));

const rTvl0 = runMain(variant('tvl-zero', (s) => { for (let i = 0; i < 5; i++) s.protocols[i].tvl_usd = 0; }), join(TMP, 'out-tvl-zero'));
let tvl0Ok = rTvl0.code === 0;
if (tvl0Ok) { const b0 = loadBoard(join(TMP, 'out-tvl-zero')); tvl0Ok = b0.rows.every((r) => r.implied_value_usd >= 1); }
test('(b) TVL 0 still builds, implied >= 1', tvl0Ok, rTvl0.code === 0 ? '' : rTvl0.stderr.slice(0, 160));

const rTvlNeg = runMain(variant('tvl-neg', (s) => { for (let i = 0; i < 3; i++) s.protocols[i].tvl_usd = -100; }), join(TMP, 'out-tvl-neg'));
test('(b) negative TVL still builds', rTvlNeg.code === 0, rTvlNeg.code === 0 ? '' : rTvlNeg.stderr.slice(0, 160));

const rDup = runMain(variant('dup-slugs', (s) => { for (let i = 0; i < 5; i++) s.protocols.push({ ...s.protocols[i] }); }), join(TMP, 'out-dup'));
let dupOk = rDup.code === 0;
if (dupOk) {
  const bd = loadBoard(join(TMP, 'out-dup'));
  const slugs = new Set(bd.rows.map((r) => r.slug));
  dupOk = slugs.size === bd.rows.length && bd.rows.length === 198;
}
test('(b) duplicate slugs deduped, board still 198', dupOk, rDup.code === 0 ? '' : rDup.stderr.slice(0, 160));

const rUnknownCat = runMain(variant('unknown-cat', (s) => { for (let i = 0; i < 10; i++) s.protocols[i].category = 'Quantum Flux'; }), join(TMP, 'out-unknown-cat'));
test('(b) unknown categories still build', rUnknownCat.code === 0, rUnknownCat.code === 0 ? '' : rUnknownCat.stderr.slice(0, 160));

// ---------------------------------------------------------------- (c) edge cases (mutations of the real snapshot)
function edgeCase(name, mutate, check) {
  const out = join(TMP, `out-${name}`);
  const r = runMain(variant(name, mutate), out);
  let ok = r.code === 0;
  let detail = '';
  if (ok && check) { try { const res = check(loadBoard(out)); ok = res.ok; detail = res.detail ?? ''; } catch (e) { ok = false; detail = String(e); } }
  if (!ok && r.code !== 0) detail = r.stderr.slice(0, 160);
  test(`(c) ${name}`, ok, detail);
}

edgeCase('edge-no-token-no-age-null-7d', (s) => {
  const p = s.protocols.find((x) => x.slug === 'mezzanine') ?? s.protocols.find((x) => x.mcap_usd === null);
  p.change_7d = null; p.listed_at = null;
}, (b) => {
  const r = b.rows.find((x) => x.slug === 'mezzanine');
  return { ok: !!r && r.age_days === null && r.implied_value_usd >= 1, detail: r ? `age null, implied $${r.implied_value_usd}` : 'row missing' };
});

edgeCase('edge-tvl-exact-floor', (s) => {
  const p = s.protocols.find((x) => s.watchlist.includes(x.slug));
  p.tvl_usd = 50_000_000;
}, (b) => {
  const snap = JSON.parse(readFileSync(REAL, 'utf8'));
  return { ok: b.rows.length === 198 && snap.watchlist.every((sl) => b.rows.some((r) => r.slug === sl)), detail: 'TVL exactly $50M still ranked' };
});

edgeCase('edge-age-over-5y', (s) => {
  const p = s.protocols.find((x) => x.slug === 'mezzanine');
  p.listed_at = '2019-01-01';
}, (b) => {
  const r = b.rows.find((x) => x.slug === 'mezzanine');
  return { ok: !!r && (r.age_days ?? 0) > 1825, detail: r ? `age ${r.age_days}d` : 'row missing' };
});

edgeCase('edge-20plus-chains', (s) => {
  const p = s.protocols.find((x) => x.slug === 'mezzanine');
  p.chains = Array.from({ length: 25 }, (_, i) => `Chain${i + 1}`);
}, (b) => {
  const r = b.rows.find((x) => x.slug === 'mezzanine');
  return { ok: !!r && r.chains.length === 25 && r.implied_value_usd >= 1, detail: r ? `25 chains, implied $${r.implied_value_usd}` : 'row missing' };
});

// Tiny synthetic snapshot: must refuse cleanly (fewer than 100 rows), not crash.
const tiny = { as_of: '2026-11-14', source: 'synthetic', floor_usd: 50000000, watchlist: ['alpha'], protocols: [
  { slug: 'alpha', name: 'Alpha', category: 'Dexs', chains: ['Ethereum'], tvl_usd: 60000000, change_7d: 5, mcap_usd: null, listed_at: '2025-01-01', gecko_id: null, symbol: null },
  { slug: 'beta', name: 'Beta', category: 'Lending', chains: ['Solana'], tvl_usd: 40000000, change_7d: null, mcap_usd: null, listed_at: null, gecko_id: null, symbol: null },
] };
const tinyPath = join(TMP, 'tiny.json');
writeFileSync(tinyPath, JSON.stringify(tiny));
const rTiny = runMain(tinyPath, join(TMP, 'out-tiny'));
test('(c) tiny snapshot refuses cleanly with a board message', rTiny.code === 1 && /board/.test(rTiny.stderr), `exit ${rTiny.code}`);

// ---------------------------------------------------------------- (d) determinism
const OUT_A = join(TMP, 'out-det-a');
const OUT_B = join(TMP, 'out-det-b');
const rA = runMain(REAL, OUT_A);
const rB = runMain(REAL, OUT_B);
let detOk = rA.code === 0 && rB.code === 0;
let detDetail = '';
if (detOk) {
  for (const f of ['board.json', 'data.js', 'dossier.json']) {
    const ha = sha256(join(OUT_A, f));
    const hb = sha256(join(OUT_B, f));
    if (ha !== hb) { detOk = false; detDetail = `${f} differs`; break; }
  }
  if (detOk) detDetail = 'board.json, data.js, dossier.json byte-identical';
}
test('(d) determinism: two runs byte-identical', detOk, detDetail);

// ---------------------------------------------------------------- (e) gate limits (on the real run)
if (board) {
  const boardBytes = statSync(join(OUT_REAL, 'board.json')).size;
  test('(e) board.json rows 100-4000', board.rows.length >= 100 && board.rows.length <= 4000, `${board.rows.length} rows`);
  test('(e) board.json <= 8 MiB', boardBytes <= 8 * 1024 * 1024, `${boardBytes} B`);
  test('(e) implied values positive whole <= 1e14', board.rows.every((r) => Number.isSafeInteger(r.implied_value_usd) && r.implied_value_usd > 0 && r.implied_value_usd <= 1e14));
  test('(e) farm steps 3-12 of 20-600 chars', board.rows.every((r) => r.farm_steps.length >= 3 && r.farm_steps.length <= 12 && r.farm_steps.every((s) => s.length >= 20 && s.length <= 600)));
  test('(e) ranks 1-N, values never rise', board.rows.every((r, i) => r.rank === i + 1 && (i === 0 || r.implied_value_usd <= board.rows[i - 1].implied_value_usd)));
  const dossierBytes = statSync(join(OUT_REAL, 'dossier.json')).size;
  test('(e) dossier.json <= 1.5 MiB', dossierBytes <= 1_572_864, `${dossierBytes} B`);
  test('(e) dossier.json <= 450,688 B byte target', dossierBytes <= 450_688, `${dossierBytes} B`);
  const dash = dirBytes(join(OUT_REAL, 'dashboard'));
  test('(e) dashboard <= 4 MiB, <= 400 files', dash.total <= 4_194_304 && dash.count <= 400, `${dash.total} B, ${dash.count} files`);
  const dashSrc = ['app.js', 'index.html', 'style.css'].reduce((a, f) => a + statSync(join(OUT_REAL, 'dashboard', f)).size, 0);
  test('(e) dashboard source <= 65,536 B text cap', dashSrc <= 65_536, `${dashSrc} B`);
  const shots = readdirSync(join(OUT_REAL, 'screenshots')).filter((n) => !n.startsWith('.'));
  test('(e) screenshots: 3-4 images', shots.length >= 3 && shots.length <= 4, `${shots.length} images`);
  for (const name of shots) {
    const p = join(OUT_REAL, 'screenshots', name);
    const size = statSync(p).size;
    const dims = jpegDims(p);
    const longSide = dims ? Math.max(dims.w, dims.h) : 0;
    const shortSide = dims ? Math.min(dims.w, dims.h) : 0;
    test(`(e) screenshot ${name} <= 512 KiB, long <= 1440, short >= 800`, size <= 524_288 && longSide <= 1440 && shortSide >= 800, `${size} B, ${dims ? `${dims.w}x${dims.h}` : 'unreadable'}`);
  }
  const dataJs = JSON.parse(readFileSync(join(OUT_REAL, 'data.js'), 'utf8').slice('window.RADAR='.length).replace(/;\s*$/, ''));
  const ledgerTotal = dataJs.ledger.reduce((a, g) => a + g.count, 0);
  test('(e) ledger sums to 758', ledgerTotal === 758, `${ledgerTotal}`);
  test('(e) integrity checks all pass', dataJs.checks.every((c) => c.ok), dataJs.checks.map((c) => c.label).join(', '));
}

console.log(`\nGauntlet: ${pass} passed, ${fail} failed, ${pass + fail} total.`);
process.exit(fail === 0 ? 0 : 1);
