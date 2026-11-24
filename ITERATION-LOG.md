# ITERATION-LOG.md — radar-9 (token-radar-01, roni-rockabilly) — FASE 3

Keep/drop rule (unchanged throughout): a term/idea is KEPT only if it wins
its deciding test (value: LOO + walk-forward; odds: LOO + 10-fold + WF) or
raises margin without harming honesty. No p-hacking: no fifth formulation
of the same effect. DROP is a legitimate result and is reported as such.

Baseline for every comparison: **V1 = radar-7 model exactly** (Round 1).
Local submit bar: beat radar-7's dev judge **0.923193**. Prize line #10:
**0.962052**.

---

## Round 1 — V1 baseline + reproduction (FASE 2) — 2026-11-24

**What:** wrote `main.ts`, `lib/model.ts`, `dashboard/` (`index.html`,
`style.css`, `app.js`), `tests/gauntlet.mjs`, `tests/dashboard-smoke.mjs`,
`tools/render_screenshots.py`, `tools/capture_screenshots.py`,
`tools/probe_layout.py`, `README.md`, `MODEL-SPEC.md`, `SCREENSHOTS.md`,
`V1-REPORT.md` fresh in-session (kit files `vendor/makefun-board.ts`,
`input/snapshot.json`, LICENSE from the kit starter, the sanctioned source).
Repo init with `--wallet BnAYeRvfjoyWH8sxx1Y6umfzL8NdMN6bhevV99ZqFwb2`;
freshness.json wallet verified before the first line of code.

**Measured (all exact reproductions of radar-7):** 198 rows (40/138/20);
total implied $880,995,215; value LOO ×3.2194 / WF ×2.0668 / 5-fold ×3.0188;
odds Brier LOO 0.1890 / 10-fold 0.1868 / WF 0.2093; coverage LOO P25–P75
50.0% (46/92) / P10–P90 82.6% (76/92); honest WF 57.1% / 65.7%; farm
42/41/115 ($1k 0/55/143, $10k 20/60/118); slope 0.378; rank 1 Sentora
Curator $25,058,273; integrity 7/7.

**Tests:** gauntlet **34/34**, dashboard smoke **27/27**, determinism
byte-identical (2 runs), runtime ~3.1 s, dossier **447,388 B** (target
450,688 B; headroom 3,300 B — thin; no app.js growth without an offsetting
cut). Screenshots are PIL renderings at q38 (293,033 B raw); true browser
captures are a FASE 4 item (Python `playwright` not installed; browsers
cached).

**Corrections surfaced:** MODEL-SPEC analyst totals ($880,995,220 /
$1,952,887,690) are $5/$4 above the built sums of rounded rows — the build
is the authority, spec corrected. Analyst odds 10-fold (0.187834) vs built
seed-11 (0.1868) — same verdicts, dashboard prints built values.

**Verdict: BASELINE ESTABLISHED.** No model change. Proceed to Round 2.

---

## Round 2 — Ide 4: fit value on 119 comps — DROP — 2026-11-24

**Pre-registration:** `analysis/round2_119_prereg.md`, written BEFORE any
119-comp fitting. Set = `mcap_usd > 0` AND `category != 'CEX'` (128 − 9 =
119 exactly; dated 87, undated 32). The definition is corroborated by two
snapshot facts: the count lands exactly on 119, and the median dated
listed date (2024-02-28) reproduces silver-ibis's published walk-forward
split ("tokens listed before 2024-02-28 price the 44 listed since" —
87 dated split 43/44 at that date). Formula identical to MODEL-SPEC §2.1
(no re-spec, one candidate). Splits: LOO over 119; WF at the 2024-02-28
median (undated excluded); 5-fold-by-size reported. Keep rule (strict,
both-tests): KEEP iff `loo119 < 3.2194` AND `wf119 < 2.0668` AND odds Brier
guardrail (LOO ≤ 0.1890, WF ≤ 0.2093 — odds not refit, must hold
trivially). Otherwise DROP.

**Script:** `analysis/round2_119.py` (stdlib only; NOT entry code, never
bundled). The script first refits the 92-comp model as a control — it
reproduces the model exactly (intercept 4.151591, slope 0.378031,
ln-chains −0.073673; LOO ×3.2194, WF ×2.0668, 5-fold ×3.0188), which
validates the script itself.

**Measured — side by side:**

| Fit | Coef (intercept / slope / ln-chains) | LOO miss (flat) | WF miss (flat) | 5-fold |
|---|---|---|---|---|
| 92-comp (V1) | 4.151591 / 0.378031 / −0.073673 | ×3.2194 (×4.6468, −30.7%) | ×2.0668 (×4.5195, −54.3%) | ×3.0188 |
| 119-comp (experiment) | 3.445844 / 0.466724 / −0.021992 | ×3.2533 (×4.9368, −34.1%) | ×2.8122 (×4.9613, −43.3%) | ×3.2696 |

**Keep rule:** loo119 3.2533 < 3.2194? **FAIL** (worse by 0.034).
wf119 2.8122 < 2.0668? **FAIL** (worse by 0.745). Odds guardrail: PASS
(unchanged, 0.1890 / 0.2093).

**Verdict: DROP — the 119-fit is excluded from the final model.** The board
stays on the 92-comp fit. No re-spec, no second 119 variant in this round.

**Reading the result honestly:**
- The 119 set is harder (its flat baseline is worse: ×4.94/×4.96 vs
  ×4.65/×4.52), so the absolute LOO gap (+0.034) is small and the
  relative-vs-own-flat LOO actually improves (−34.1% vs −30.7%). But the
  WF gap is large (+0.745, and relative −43.3% vs −54.3%), and the
  pre-registered rule is absolute on both tests. DROP stands under any
  reading of the rule.
- Caveat, stated not hidden: the WF test sets differ (119: cut 2024-02-28,
  44 priced; 92: cut 2024-07-15, 35 priced), so part of the WF gap is a
  harder test set, not a worse model. The LOO comparison uses the same
  construction on both sets and also fails, so the verdict does not rest
  on the WF caveat alone.
- The 119-fit's steeper slope (0.467 vs 0.378 — near lhowann's 0.504)
  corroborates that the 119 set is the right reconstruction of the top-10
  comp set, even though the fit itself is dropped.
- Board impact if it had been kept (information only): total implied
  +12.7% ($993,172,843 vs $880,995,215); #1 flips to Steakhouse Financial
  $43,874,454; 102/198 rows move ≥5 ranks. The steeper slope inflates
  large-TVL rows — a material board change for a worse-held-out model,
  which is exactly what the both-tests rule exists to prevent.

**No entry code changed in this round.** Gauntlet/smoke/dossier unchanged
from Round 1 (34/34, 27/27, 447,388 B).

---

## Round 3 — Ide 1 "Size up" + Ide 6 yield sensitivity — KEPT — 2026-11-24

**What:** per-row break-even deposit ("Size up") as the headline verdict,
computed from our data — no hardcoded numbers, no model change. The
headline baseline is **0% forgone yield** (idle capital earns nothing);
the **7%/12wk + 4% T-bill scenario stays as the control**, stated
explicitly everywhere the size-up appears. Ide 6 (5%/yr) is a labelled
sensitivity only, never the headline.

**Measured first (analysis/round3_sizeup.py, from out/board.json — no refit):**

| Forgone yield on idle capital | FARM | MARGINAL | SKIP |
|---|---|---|---|
| **0% — baseline (headline)** | **159** | **39** | **0** |
| 4% — T-bill (build control) | 42 | 41 | 115 |
| 5% — lhowann rate (sensitivity) | 26 | 27 | 145 |
| 10% — stress (sensitivity) | 9 | 4 | 185 |

- Size-up at 0% (smallest deposit paying $25/h): cheapest **Katana DEX
  $1,917** (control $2,398 at 4%); median **$9,465** across the 159 rows
  farming at 0%. Cheapest 5: Katana DEX $1,917, MetalX Swap $2,040,
  Abstract $2,417, Kava Mint $2,445, Set Protocol $2,530.
- Net-0 break-even at 0% (drop covers fees): cheapest Bucket CDP $2.95,
  median $189.70.
- Watchlist at 0%: **14 farm** (closest Noble $8,297); at the 4% control,
  none do. Sentora: size-up $149,192 — over the $25,000 cap, never farms
  even at 0% (control pays-from: none).

**Dashboard changes (app.js only; lib/model.ts untouched, board.json
unchanged):** `farmEcon`/`depositFor` take a forgone-yield `rate`
(default 4% T-bill — all existing verdicts/pills unchanged); new
`sizeUpRaw`/`sizeUpDisp`/`net0At`/`verdictAtRate`/`farmCountsAtRate`
helpers. Board gains a sortable **SIZE UP · 0%** column ($X or >$25k).
Farm view gains the size-up headline (cheapest + median, computed live)
and the 0/4/5/10% sensitivity table. Detail view gains a size-up line
(farms from $X at 0%, control at 4%, covers fees from $Y at 0%).

**Honesty note (stated on the board, not hidden):** the 0% baseline makes
159 rows farm vs 42 at the control — the 4% T-bill does most of the work
in the verdicts. The 0% number is always printed WITH its control, and
the board's pills never move off the 4% rule. The consult's fabricated
"$12,400" headline was not used; every dollar above is computed from
board.json.

**Tests:** gauntlet **34/34**, smoke **27 → 31/31** (4 new Round 3
assertions: SIZE UP column + cheapest $1,917; farm size-up headline +
159/42/26/9 counts + watchlist 14 at 0%; Sentora over-cap + fees from
$11,634; Flux Finance farms from $6,743 at 0%). Dossier **427,954 B**
(down from 447,388 B — screenshots re-rendered at q34 to buy headroom
for Rounds 4–5; app.js +4,651 B). Runtime ~3.3 s.

**Verdict: KEPT.** Presentation feature, zero model risk; all tests green;
dossier under target with 22,734 B headroom.

---

## Round 4 — DONE (2026-11-24)

Ide 3 nested term-selection proof + Ide 10 ablation "Top 20 kept" + Ide 2
detail sliders + Ide 7 presentation ("Value walk", partial hold).
Pre-registered in `analysis/round4_prereg.md` before the dashboard edits;
all numbers below were re-verified independently in this session against
`lib/model.ts` (live computation) and the rebuilt `out/data.js`.

**Ide 3 — nested proof (EVIDENCE ONLY, model unchanged).** Term selection
re-run inside six training subsets (five 5-fold training sets + the
walk-forward train half), once by the spec rule and once by best-single-score
(lowest LOO inside the subset). `analysis/round4_nested.py`; the harness
reproduces the full fits exactly (value ×3.2194 / ×2.0668, odds Brier
0.1890 / 0.2093).

- Value: full-fit picks {growth, chains} replicate in **0/6** subsets.
  Rule/score agree 0/6; 2/6 subsets pick nothing; the control — rejected on
  the full fit — is rule-picked in 1/6 (WF train, n=35, thin margins
  0.04/0.07). Rule picks per subset: chains / growth / growth+cat64 /
  (none) / (none) / control. At n=92 the selection is sample-dependent;
  the full-fit picks stand on the full data.
- Odds: rule picks match the full-fit set {age, dummy, size, growth} in
  **2/6** subsets (5-fold trains 2 and 4); rule/score agree 0/6. Age and
  size are rule-picked in 5/6 each, dummy 4/6, growth 4/6, cat 2/6, chains
  0/6, control 0/6. More stable than the value picks, but not clean.
- Honest reading, printed on the board: nested selection does NOT
  corroborate the value picks; it partly corroborates the odds picks.
  Neither result changes the model — that was pre-registered.

**Ide 10 — ablation "Top 20 kept" (EVIDENCE, KEPT).** The 20 comps with
the highest model-implied value (launch × odds): ssv-network, eigencloud,
babylon-protocol, falcon-finance, obol, concrete, tornado-cash,
convex-finance, grove-finance, benqi-lending, pinksale, concentrator,
railgun, fx-protocol, dolomite, enzyme-finance, re, cap, usd-ai, solstice.
Computed live by `ablationEvidence()` in `lib/model.ts` (no hardcoded
numbers in the dashboard). Pre-registered thresholds: kept iff subset LOO
miss ≤ full + 0.10 absolute AND ≤ full × 1.10 relative.

- Measure 1: top-20 comps LOO miss **×3.0846 (50.0% within 3×)** vs full
  **×3.2194 (48.9%)** — the subset prices BETTER than the full set; both
  thresholds pass → **KEPT**.
- Measure 2: removing the top-20 ranked rows (sentora-curator,
  steakhouse-financial, polymarket-international, usdd, veda, …) leaves
  implied **$579,264,833 (65.8% kept)** of $880,995,215, launch
  $1,501,109,905 of $1,952,887,686, TVL $6,942,701,203 of $20,707,499,265,
  and farm counts **42 FARM / 40 MARGINAL / 96 SKIP** vs full 42/41/115 —
  all 42 FARM rows survive. Two-thirds of the implied value does not lean
  on the head; the head rows carry the TVL.

**Ide 2 — detail sliders (KEPT, defect fixed).** The `#d-weeks` /
`#d-stress` sliders were rendered but NEVER bound — dead controls. Now
bound via `bind()` + `sensUpdate()`: dragging re-prices the `#d-sens`
paragraph in place (outerHTML swap, so the drag is not interrupted).
Smoke-tested functionally: 12wk → 26wk and stress 100% → 50% both
re-price the paragraph. Weeks 4–52 (default 12), stress 50–100%
(default 100%). A launch-horizon slider is still not offered — it would
need a time-to-launch model the snapshot does not support.

**Ide 7 — value walk + partial hold (KEPT).** Detail view shows the
log10 value walk (intercept + slope·log10(TVL_fwd) − chains term → launch
× odds = implied; e.g. Sentora 4.1516 + 3.5854 − 0.1021 = 7.6348 →
$43,132,939 × 58% = $25,058,273) and a partial-hold table (25/50/75/100%
of the auto deposit; drop and T-bill scale, fees do not). Row-compare is
deferred to Round 5.

**Byte budget — the hard problem of this round.** Dashboard source was
70,471 B at round start vs the 65,536 B dossier-text cap. Fix: evidence
numbers moved from hardcoded `app.js` strings into `data.js`, computed
live in `lib/model.ts` (`WideningResult`, `CoverageResult.widening`,
`NESTED_VALUE` / `NESTED_ODDS` constants from `round4_nested.json`,
`ablationEvidence()`), plus a trimming campaign (CSV/JSON export removed
— not in the rubric; net-by-deposit grid removed — not in any spec;
skip link removed; KPI cards merged 6→5; prose tightened throughout).
Final: **app.js 60,134 + style.css 4,446 + index.html 370 = 64,950 B**
(dossier text 64,792 chars) — under the cap by 586 B, but **2,950 B over
the 62,000 B Round 4 target**. The target was missed because the
data-driven refactor saved far less than assumed (renderer code is
verbose) and the sliders fix added ~800 B. No rubric content was cut to
chase the target; the miss is reported as-is and Round 5 must fit in the
remaining 586 B of headroom.

**Defects found and fixed in-session:** (1) dead detail sliders (above);
(2) a `pct7` → `pct(x,1)` golf that doubled the ×100 (caught before
commit — `pct()` already multiplies by 100); (3) one edit deleted the
`sensitivityRows` function line (caught by grep, restored);
(4) a stale citation to `analysis/round4_bands.ts`, a file that does not
exist (removed; the widening is cited as live computation in
`intervalCoverage`). Four smoke failures from over-trimmed wording
("No ticket size pays", "Size-up — baseline 0%…") were fixed by restoring
the exact smoke-asserted strings (+19 B).

**Board impact:** none — model unchanged; verdicts FARM 42 / MARGINAL 41 /
SKIP 115, total implied $880,995,215, identical to V1. All Round 4 work
is evidence + presentation.

**Tests:** gauntlet **34/34**, smoke **31 → 38/38** (7 new Round 4
assertions: nested tables + 0/6 + odds 5/6; ablation ×3.0846/×3.2194 +
KEPT + 65.8% kept + 42 FARM survive; value walk; partial hold; slider
bounds; two functional slider-move checks). Determinism: 2 runs
byte-identical (board.json, data.js, dossier.json). Dossier **433,525 B**
(text 64,792 chars, under the 65,536 cap). Screenshots unchanged
(PIL renderings 1440×900, 102,823 / 85,113 / 86,974 B — true browser
capture still pending, FASE 4). Runtime ~3.0 s.

**Verdict: KEPT (evidence + presentation).** Nested is an honest
non-replication, ablation passes its pre-registered thresholds, sliders
now work, value walk + partial hold render from live data. Model
unchanged. Byte headroom for Round 5: 586 B — tight.

---

## Round 5 — DONE (2026-11-24)

Ide 7 remainder: row-compare. Pre-registered in
`analysis/round5_prereg.md` BEFORE any Round 5 code. Pure presentation,
zero model risk.

**What was built.** A `CMP` checkbox column on the board table (and the
FARM-book table, which reuses the same renderer). Tick two rows and the
page navigates to `#compare/<slug-a>/<slug-b>`, which renders both
protocols' full detail cards side by side in a two-column grid — value
walk, odds derivation, nearest peers, farm verdict, sensitivities,
partial hold — by reusing `detailHTML` twice in a new compact mode.
Compact mode skips the detail sliders and the prev/next links (two copies
would duplicate the `d-weeks` / `d-stress` ids and leave the second set
dead — the defect Round 4 fixed); the static sensitivity paragraph at the
defaults is still shown. Unknown slugs render the existing "Not on the
board" card.

**Byte-budget design (the whole round).** Round 4 ended at 64,950 B with
586 B of headroom to the 65,536 B cap; the compare feature cost 1,041 B
gross. It was funded by offsetting cuts, never by cutting rubric content:
noteHTML item 4 shortened, farm sensitivity header, board mini, ledger
total row, KPI "rank 1" sub-label, header comment, compare-handler
comments removed, plus ~10 small prose trims. Two deliberate UX
trade-offs, both documented in the pre-registration: (1) auto-navigate
on the second tick instead of a compare bar with a link (~230 B saved);
(2) no section-header wrapper on the compare view — the two detail cards
already carry their protocol names (~100 B saved). Final: **app.js
60,597 + style.css 4,446 + index.html 370 = 65,413 B** (dossier text
65,107 chars) — under the cap by **123 B** (source) / 429 B (dossier
text). The ≤ 64,000 B Round 5 target was already missed in Round 4 and
is not met; the hard cap is met with almost no margin left. No further
dashboard growth is possible without an offsetting cut.

**Known warts (documented, not hidden).** (1) If a third box is ticked,
the oldest pick is dropped but its checkbox stays ticked until the next
render. (2) The two compact detail cards each render a static
`#d-sens` paragraph, so that id appears twice in the compare view — inert
(no sliders call `sensUpdate` there), but invalid HTML. (3) The
two-column grid has no narrow-screen stacking — cramped on a phone.

**Board impact:** none — model unchanged; verdicts FARM 42 / MARGINAL 41 /
SKIP 115, total implied $880,995,215, identical to V1.

**Tests:** gauntlet **34/34**, smoke **38 → 43/43** (5 new Round 5
assertions: CMP column renders; one tick does not navigate; two ticks set
`location.hash` to `#compare/sentora-curator/noble`; the compare route
renders both protocols with no duplicate slider ids; unknown slug handled
gracefully). The tick test runs the real `bind()` handler against a
parsing-DOM stub (`renderInteractive` now parses `input.cmp` from the
rendered HTML and fires `change` with a correct `this`). Determinism: 2
runs byte-identical (board.json, data.js, dossier.json). Dossier
**433,848 B** (text 65,107 chars, under the 65,536 cap). Screenshots
unchanged (PIL renderings 1440×900 — true browser capture still pending,
FASE 4). Runtime ~3.1 s.

**Verdict: KEPT.** Compare works end-to-end (tick → navigate → two
detail cards), all tests green, cap met by 123 B. No headroom remains for
a Round 6 in this dashboard — see the Round 6 proposal in the final
report.

---

## FASE 4 — validation (2026-11-24)

**True browser screenshots: DONE.** Python Playwright 1.65.2 installed
into a throwaway venv (`/tmp/pw-venv`; system pip is PEP 668-blocked)
and launched against the already-cached Chromium. `tools/capture_screenshots.py`
served `out/` on localhost:8123 and captured all three views at 1440×900,
JPEG q38: 1-board.jpg 69,376 B, 2-detail.jpg 104,632 B, 3-filtered.jpg
82,151 B — all under the 512 KiB limit. The board scroll position had to
be corrected (3835 → 4800: the Round 4 evidence sections pushed the board
table h2 to y=4860; the old scroll landed in the evidence/ledger area).
All three captures were viewed: board table with the CMP column, Sentora
detail with value walk / logit / peers / sliders, FARM book with
aggregates and the FARM table. The repo `screenshots/` now holds the
browser captures (PIL renderings retired); the dossier embeds them
(sha256 585fc31f…, 19d52737…, 8e6090ad…).

**Browser interaction check (real Chromium, not the vm stub):** row click
→ `#detail/sentora-curator` ("#1 Sentora Curator"); filter `sentora`
narrows the table; 198 CMP checkboxes on the board; 1st tick stays on
`#board`, 2nd tick navigates to `#compare/sentora-curator/steakhouse-financial`
with both detail heads rendered and **0 slider inputs** (compact mode
works in a real browser); moving the weeks slider 12 → 26 re-prices
`#d-sens` live. Nothing blank or broken on any of the three views.

**Gate limits (all via gauntlet 34/34):** 198 rows (100–4000), watchlist
40/40, farm steps in range, max implied < 1e13, dossier 408,848 B
(≤ 1.5 MiB), dashboard text 65,107 chars (≤ 65,536), screenshots ≤ 512 KiB
each, ledger sums to 758, integrity checks pass, determinism 2-run
byte-identical.

---

## V1 → final

| Metric | V1 (Round 1) | Final (Round 5) | Change |
|---|---|---|---|
| Rows (watchlist / early / off-list) | 198 (40 / 138 / 20) | 198 (40 / 138 / 20) | — |
| Total implied value | $880,995,215 | $880,995,215 | — |
| Value miss LOO / WF / 5-fold | ×3.2194 / ×2.0668 / ×3.0188 | ×3.2194 / ×2.0668 / ×3.0188 | — (model untouched Rounds 2–5) |
| Odds Brier LOO / 10-fold / WF | 0.1890 / 0.1868 / 0.2093 | 0.1890 / 0.1868 / 0.2093 | — |
| Coverage LOO P25–P75 / P10–P90 | 50.0% (46/92) / 82.6% (76/92) | 50.0% (46/92) / 82.6% (76/92) | — |
| Coverage honest WF P10–P90 | 65.7% (23/35) | 65.7% (23/35) | — (admitted on the board) |
| Verdicts FARM / MARGINAL / SKIP | 42 / 41 / 115 | 42 / 41 / 115 | — |
| Watchlist FARM rows | 0 of 40 | 0 of 40 | — (structural, explained) |
| Gauntlet | 34/34 | 34/34 | — |
| Dashboard smoke | 27/27 | 43/43 | +16 assertions (4 R3, 7 R4, 5 R5) |
| Dashboard source (app.js + css + html) | not recorded at V1 (70,471 B at R4 start) | 65,413 B | −5,058 B from R4 start; cap met by 123 B |
| Dossier file | 447,388 B | 408,848 B | −38,540 B (browser screenshots are smaller) |
| Dossier text | not recorded at V1 | 65,107 chars | under the 65,536 cap by 429 B |
| Screenshots | PIL renderings 1440×900 (~85–103 KB) | True browser captures 1440×900 (69,376 / 104,632 / 82,151 B) | real Chromium |
| Determinism (2 runs) | byte-identical | byte-identical | — |
| Runtime | ~3.1 s | ~3.1 s | — |

**Verdicts per round:** R1 V1 reproduction — KEPT (baseline). R2 119-comp
fit — DROP (fails both-tests). R3 Size-up — KEPT. R4 nested — EVIDENCE
(value 0/6, odds 2/6 full-pick replication; no model change); ablation —
KEPT (×3.0846 vs ×3.2194); sliders — KEPT (dead controls fixed); value
walk + partial hold — KEPT. R5 row-compare — KEPT.

**What the final entry is:** the same model as radar-7/V1, with the
evidence for its term choices now shown on the board (nested proof,
ablation, widening test), working detail sliders, a value walk and
partial-hold table per row, a size-up column, and a side-by-side
row-compare. Nothing in Rounds 2–5 changed a single number on the board.
