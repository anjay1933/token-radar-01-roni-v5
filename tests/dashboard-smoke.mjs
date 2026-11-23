// Radar-7 dashboard smoke test (FASE 3). Runs dashboard/app.js in Node with
// a minimal DOM stub against the real built out/data.js, renders #board,
// #farm and two detail views, and asserts the rendered numbers match the
// measured board.json numbers (the live farm mirror must reproduce the
// build-time verdicts at the default controls).
//
//   node tests/dashboard-smoke.mjs [workdir]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const WORK = process.argv[2] ?? new URL('..', import.meta.url).pathname;
const D = JSON.parse(readFileSync(join(WORK, 'out', 'data.js'), 'utf8').slice('window.RADAR='.length).replace(/;\s*$/, ''));
const APP_SRC = readFileSync(join(WORK, 'dashboard', 'app.js'), 'utf8');

let pass = 0;
let fail = 0;
function test(name, ok, detail = '') {
  if (ok) { pass += 1; console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`); }
  else { fail += 1; console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`); }
}

function render(hash) {
  const appEl = { innerHTML: '', setAttribute() {}, querySelectorAll: () => [] };
  const sandbox = {
    window: { RADAR: D, addEventListener() {} },
    document: { getElementById: () => null },
    location: { hash },
    console,
  };
  sandbox.window.window = sandbox.window;
  sandbox.document.getElementById = (id) => (id === 'app' ? appEl : null);
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // app.js reads bare `window`, `document`, `location` — expose them as globals.
  vm.runInContext('var window = this.window; var document = this.document; var location = this.location;', sandbox);
  vm.runInContext(APP_SRC, sandbox);
  return appEl.innerHTML;
}

const board = render('#board');
const farm = render('#farm');
const detailSentora = render('#detail/sentora-curator');
// A FARM row for the detail check: highest net/h FARM row in the board.
const farmRows = D.rows.filter((r) => r.verdict === 'FARM').sort((a, b) => b.net_per_hour_usd - a.net_per_hour_usd);
const detailFarm = render(`#detail/${farmRows[0].slug}`);

test('no STUB text anywhere in the rendered board', !/STUB/i.test(board), 'model_version=' + D.model_version);
test('KPI shows fitted miss x3.22 / x2.07', board.includes('×3.2194') && board.includes('×2.0668'));
test('KPI shows LOO coverage 50% / 83%', board.includes('50% · 83%'));
test('KPI admits honest-WF under-coverage', board.includes('honest WF') && board.includes('66%'));
test('KPI shows odds Brier LOO/10-fold/WF', board.includes('0.189') && board.includes('0.1868') && board.includes('0.2093'));
test('KPI shows 42 of 198 farm', board.includes('42 of 198'));
test('evidence table shows final-model numbers', board.includes('3.2194') && board.includes('3.0188') && board.includes('4.6468'));
test('evidence table shows odds keep/drop rows', board.includes('+ growth_xs, capped ±25%') && board.includes('tested, not kept'));
test('value stability paragraph reports the Round 3 bootstrap', board.includes('paired bootstrap, B=2000') && board.includes('59%') && board.includes('80%') && board.includes('Neither drop improves'));
test('coverage table admits honest WF 65.7%', board.includes('65.7%'));
test('coverage card reports the Round 4 widening test and keeps the bands', board.includes('Widening test (Round 4') && board.includes('×1.23') && board.includes('87.0%') && board.includes('×422') && board.includes('The bands stay as stated'));
test('ledger totals 758 on the board', board.includes('758'));
test('live farm mirror reproduces board verdicts at defaults',
  (board.match(/pill FARM/g) || []).length === D.farmCountsPerRow.FARM
  && (board.match(/pill MARGINAL/g) || []).length === D.farmCountsPerRow.MARGINAL
  && (board.match(/pill SKIP/g) || []).length === D.farmCountsPerRow.SKIP,
  `FARM ${(board.match(/pill FARM/g) || []).length}/${D.farmCountsPerRow.FARM}, MARGINAL ${(board.match(/pill MARGINAL/g) || []).length}/${D.farmCountsPerRow.MARGINAL}, SKIP ${(board.match(/pill SKIP/g) || []).length}/${D.farmCountsPerRow.SKIP}`);
test('detail Sentora shows launch + implied', detailSentora.includes('$43,132,939') && detailSentora.includes('$25,058,273'));
test('detail Sentora shows odds derivation (term-by-term logit → ever 58.1% → remaining 88.1%, matching board.json 0.581/0.8807)',
  detailSentora.includes('logit =') && detailSentora.includes('58.1%') && detailSentora.includes('88.1%')
  && detailSentora.includes('Peers aged 1–2 y: 125 peers, 39% record a token')
  && detailSentora.includes('Record: category Risk Curators'), 'logit + age-bin peers + record line');
const undatedRow = D.rows.find((r) => r.listed_at === null);
const detailUndated = render(`#detail/${undatedRow.slug}`);
test('detail undated row shows undated-dummy odds derivation',
  detailUndated.includes('undated dummy') && detailUndated.includes('median peer age'), undatedRow.slug);
test('detail Sentora sensitivity matches exact-ratio recomputation (spec §2.4 dollars are ~$300 stale — see app.js note)',
  detailSentora.includes('$37,692,190') && detailSentora.includes('$47,630,279')
  && detailSentora.includes('$42,781,598') && detailSentora.includes('$45,175,442')
  && detailSentora.includes('×0.874') && detailSentora.includes('×1.104'),
  'TVL ±30% and 7d 0%/+20% launch values, ratios ×0.874/×1.104');
test('detail Sentora six-months row shows implied x1.14x', /Six more months[\s\S]{0,200}×1\.14/.test(detailSentora));
test('detail Sentora shows tested-not-used line', detailSentora.includes('Tested, not used'));
test('detail Sentora shows honest watchlist-free farm note', detailSentora.includes('No ticket size pays') || detailSentora.includes('Pays from'));
test('detail FARM row shows FARM verdict + pays-from', detailFarm.includes('FARM') && detailFarm.includes('Pays from'), farmRows[0].slug);
test('farm book aggregates match spec §6.3 per-row book',
  farm.includes('$513,405') && farm.includes('$3,675.00') && farm.includes('1 in 1.8'),
  'capital $513,405 · net $3,675.00 · break-even 1 in 1.8');
const detailNoble = render('#detail/noble');
test('farm view explains the watchlist gap structurally',
  farm.includes('13.2%') && farm.includes('Noble') && farm.includes('$62,535') && farm.includes('Sentora')
  && farm.includes('4.4%') && farm.includes('All 42 FARM rows are early'),
  'threshold 13.2% · Noble $62,535 over cap · Sentora 0.9% · watchlist median 4.4%');
test('farm sensitivity table matches independent recomputation (rule unchanged)',
  farm.includes('<td class="num">116 (4 watchlist)</td>') && farm.includes('<td class="num">75 (1 watchlist)</td>')
  && farm.includes('<td class="num">42</td>') && farm.includes('<td class="num">13</td>')
  && farm.includes('<td class="num">39</td>') && farm.includes('<td class="num">164 (16 watchlist)</td>')
  && farm.includes('<td class="num">51</td>'),
  '3.5/7/14% x 4/8/12/26wk grid');
test('detail Noble states the over-cap truth', detailNoble.includes('over the $25,000 cap') && detailNoble.includes('$62,535') && detailNoble.includes('MARGINAL'), 'Noble MARGINAL, pays from $62,535');
test('detail Sentora still shows no-ticket-pays', detailSentora.includes('No ticket size pays'));
test('farm view lists 42 FARM rows', (farm.match(/pill FARM/g) || []).length === 42, `${(farm.match(/pill FARM/g) || []).length} pills`);

console.log(`\nDashboard smoke: ${pass} passed, ${fail} failed, ${pass + fail} total.`);
process.exit(fail === 0 ? 0 : 1);
