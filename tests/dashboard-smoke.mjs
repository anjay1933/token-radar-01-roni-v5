// Radar-9 dashboard smoke test (FASE 3). Runs dashboard/app.js in Node with
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
test('Round 3: board has SIZE UP column, cheapest $1,917 (Katana DEX, 0% baseline)',
  board.includes('SIZE UP') && board.includes('$1,917'), 'size-up column + cheapest deposit');
test('Round 3: farm view size-up headline + forgone-yield sensitivity (0/4/5/10%)',
  farm.includes('cheapest farm from <b>$1,917 (Katana DEX)</b>') && farm.includes('median $9,465')
  && farm.includes('0% — baseline (headline)') && farm.includes('<td class="num">159</td>')
  && farm.includes('4% — T-bill (build control)') && farm.includes('<td class="num">42</td>')
  && farm.includes('5% — lhowann rate (sensitivity)') && farm.includes('<td class="num">26</td>')
  && farm.includes('10% — stress (sensitivity)') && farm.includes('<td class="num">9</td>')
  && farm.includes('14 watchlist rows farm') && farm.includes('Noble $8,297'),
  'cheapest $1,917 · median $9,465 · counts 159/42/26/9 · watchlist 14 at 0%');
test('Round 3: detail Sentora size-up is over-cap at 0% and covers fees from $11,634',
  detailSentora.includes('Size-up — baseline 0% forgone yield: farms from over the $25,000 cap')
  && detailSentora.includes('Covers its fees from $11,634 at 0%'), 'Sentora never farms even at 0%');
test('Round 3: detail cheapest-FARM row (Flux Finance) farms from $6,743 at 0%',
  detailFarm.includes('Size-up — baseline 0% forgone yield: farms from $6,743'), farmRows[0].slug);

// --- Round 4 assertions (evidence rendered from data.js, not hardcoded) ---
test('Round 4: nested proof renders both tables and the honest 0/6 value replication',
  board.includes('Nested term-selection proof') && board.includes('5-fold train 1')
  && board.includes('walk-forward train') && board.includes('do NOT replicate (0/6)')
  && board.includes('Age + size are rule-picked in 5/6 and 5/6'),
  'value 0/6, odds age+size 5/6');
test('Round 4: ablation renders live numbers and the KEPT verdict',
  board.includes('Ablation — “Top 20 kept”') && board.includes('×3.0846 (50% within 3×)')
  && board.includes('×3.2194 (49%)') && board.includes('KEPT (survives)')
  && board.includes('ssv-network') && board.includes('65.8% kept')
  && board.includes('All 42 FARM rows survive'),
  'top-20 LOO ×3.0846 vs full ×3.2194, rest keeps 65.8% of implied');
test('Round 4: value walk renders in the detail view',
  detailSentora.includes('value walk — log10(V) = 4.1516')
  && detailSentora.includes('→ launch $43,132,939')
  && detailSentora.includes('× odds 58% = implied $25,058,273'),
  'log10 walk → launch → implied');
test('Round 4: partial hold renders in the detail view',
  detailSentora.includes('Partial hold — fraction of the auto deposit')
  && detailSentora.includes('Net / hour') && detailSentora.includes('25%'),
  '25/50/75/100% hold table');
test('Round 4: detail sliders render with the right bounds',
  detailSentora.includes('id="d-weeks" min="4" max="52"') && detailSentora.includes('id="d-stress" min="50" max="100"')
  && detailSentora.includes('id="d-sens"') && detailSentora.includes('At 12 weeks held and 100% of the estimated odds'),
  'weeks 4–52 @12, stress 50–100 @100');

// Functional slider check: a parsing getElementById stub so bind() attaches
// real handlers; moving a slider must re-price #d-sens in place.
function renderInteractive(hash) {
  const appEl = { innerHTML: '', setAttribute() {}, querySelectorAll: (sel) => {
    if (sel !== 'input.cmp') return [];
    const out = [];
    const re = /<input type="checkbox" class="cmp" data-s="([^"]+)"/g;
    let m;
    while ((m = re.exec(appEl.innerHTML)) !== null) {
      const slug = m[1];
      if (!els['cmp:' + slug]) {
        els['cmp:' + slug] = { checked: false, _h: {},
          getAttribute: (a) => (a === 'data-s' ? slug : null),
          addEventListener(ev, fn) { (this._h[ev] = this._h[ev] || []).push(fn); },
          fire(ev) { (this._h[ev] || []).forEach((fn) => fn.call(this)); } };
      }
      out.push(els['cmp:' + slug]);
    }
    return out;
  } };
  const els = {};
  function fakeEl(id) {
    if (els[id]) return els[id];
    const tag = appEl.innerHTML.match(new RegExp('id="' + id + '"[^>]*'));
    const vm2 = tag ? tag[0].match(/value="([^"]*)"/) : null;
    const el = {
      id, value: vm2 ? vm2[1] : '', textContent: '', outerHTML: '', _h: {},
      addEventListener(ev, fn) { (this._h[ev] = this._h[ev] || []).push(fn); },
      fire(ev) { (this._h[ev] || []).forEach((fn) => fn.call(this)); },
    };
    els[id] = el;
    return el;
  }
  const sandbox = {
    window: { RADAR: D, addEventListener() {} },
    document: { getElementById: (id) => (id === 'app' ? appEl : (appEl.innerHTML.includes('id="' + id + '"') ? fakeEl(id) : null)) },
    location: { hash },
    console,
  };
  sandbox.window.window = sandbox.window;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext('var window = this.window; var document = this.document; var location = this.location;', sandbox);
  vm.runInContext(APP_SRC, sandbox);
  return { html: appEl.innerHTML, els, location: sandbox.location };
}
const inter = renderInteractive('#detail/sentora-curator');
inter.els['d-weeks'].value = '26';
inter.els['d-weeks'].fire('input');
const sensAfterWeeks = inter.els['d-sens'].outerHTML;
inter.els['d-stress'].value = '50';
inter.els['d-stress'].fire('input');
const sensAfterStress = inter.els['d-sens'].outerHTML;
test('Round 4: moving the weeks slider re-prices the sensitivity paragraph',
  sensAfterWeeks.includes('26 weeks held') && !sensAfterWeeks.includes('12 weeks held'),
  '12wk → 26wk re-price');
test('Round 4: moving the odds-stress slider re-prices the sensitivity paragraph',
  sensAfterStress.includes('26 weeks held') && sensAfterStress.includes('50% of the estimated odds'),
  'stress 100% → 50% re-price');

// --- Round 5 assertions (row-compare) ---
test('Round 5: board has a CMP checkbox column',
  board.includes('<th class="nosort">CMP</th>') && board.includes('type="checkbox" class="cmp"')
  && board.includes('data-s="sentora-curator"') && board.includes('Tick two CMP boxes to compare side by side'),
  'checkbox per row, max 2 → #compare');
const cmpBoard = renderInteractive('#board');
const cb1 = cmpBoard.els['cmp:sentora-curator'];
const cb2 = cmpBoard.els['cmp:noble'];
cb1.checked = true; cb1.fire('change');
test('Round 5: ticking one CMP box does not navigate yet',
  cmpBoard.location.hash === '#board', 'one pick, still on board');
cb2.checked = true; cb2.fire('change');
test('Round 5: ticking two CMP boxes navigates to the compare route',
  cmpBoard.location.hash === '#compare/sentora-curator/noble', cmpBoard.location.hash);
const compare = render('#compare/sentora-curator/noble');
test('Round 5: compare route renders both protocols side by side, no duplicate sliders',
  compare.includes('#1 Sentora') && compare.includes('Noble') && compare.includes('value walk')
  && (compare.match(/id="d-weeks"/g) || []).length === 0
  && (compare.match(/id="d-stress"/g) || []).length === 0,
  'two detail cards, sliders omitted in compact mode');
test('Round 5: compare route handles an unknown slug gracefully',
  render('#compare/sentora-curator/no-such-protocol').includes('Not on the board'),
  'detailHTML not-found card');

console.log(`\nDashboard smoke: ${pass} passed, ${fail} failed, ${pass + fail} total.`);
process.exit(fail === 0 ? 0 : 1);
