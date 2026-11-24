# Iteration log — radar-10 (token-radar-01 V2, roni)

## R1 — V1 baseline (2026-11-24, ~17:15 WIB)
- Model: RADAR-7 formulas on the 201-row ranked set (dual-E2), per MODEL-SPEC.
  V2 new-model hypothesis NOT shipped (FASE 2 verdict: full V2 LOO ×3.2903
  worse than radar-7 ×3.2194) — V2 tables report the failed attempt honestly.
- Totals: 201 rows, watchlist 40/40, total implied $887,133,813 (spec
  $887,133,819, −$6 rounding), total launch $1,972,517,964, total TVL
  $20,769,092,766, median implied $3,260,130. Top 10 exact. Farm per-row
  43/41/117; $1k 0/55/146; $10k 20/61/120. Value LOO ×3.2194 / WF ×2.0668 /
  5-fold ×3.0188. Odds Brier 0.189 / 0.1868 / 0.2093. Coverage LOO 50.0%/82.6%,
  WF 57.1%/82.9%, honest WF 57.1%/65.7% (admitted, band NOT inflated).
- Tests: gauntlet 38/38, dashboard smoke 43/43 (smoke needed one fix: the
  farm paragraph had lost the rank-1 pool name in a trim; restored live as
  "The rank-1 pool, Sentora Curator, sits at 0.9%" — +24 B).
- Spec validation 6/6: rows 201; watchlist 40/40; farm steps 0 bad; determinism
  md5 board.json 3a8e28e8f2d70ef3504e2074feaf45b5, data.js
  068a45b05665b9ba42991ecfb74fdb17, dossier.json 4fa74dad19eff29d2729c14918f8ff99
  (identical across two runs); screenshots 1440×900, 97,412 / 77,950 / 78,453 B
  (each <512 KiB); dossier schema makefun/dossier/v1.
- Dossier 405,239 B (target ≤450,688, margin 45,449 B). Dashboard source
  64,797 B / 65,536 B cap (margin 739 B). Board.json 458,490 B. Runtime 3.0s.
- Screenshots: real PIL renderings from out/data.js at q30 (tools/
  render_screenshots.py), 253,815 B total. q38 would have put the dossier at
  ~457 KB — over target — so q30 is the ceiling for this dashboard size.
- Features already in the R1 baseline (R2–R5 are refinement/measurement, not
  first introduction): size-up column + farm-view sensitivity (0/4/5/10%),
  nested proof, both-tests keep/drop tables, range-honesty KPI, transparency
  panel (72 excluded + 20 off-list), horizon/weeks sliders, partial-hold
  table, value walk, row-compare, per-row component breakdown bar.
- Gates NOT met (honest, per FASE 2): value beats radar-7 on both — NOT MET
  (it IS radar-7); farm watchlist FARM ≥3 — NOT MET (0 at every deposit);
  honest-WF P10–P90 ≥71.4% — NOT MET (65.7%). Submit case rests entirely on
  presentation margin; submit decision stays with the user.

## R2 — Size-up farm framing (2026-11-24, ~17:45 WIB)
- D_farm (pays_from_usd) is now the headline verdict everywhere: board VERDICT
  cell reads "FARM - from $20,004" / "MARGINAL - from $62,535" / "SKIP - no
  ticket"; detail headline "Farm verdict - FARM - from $20,004"; SIZE UP column
  renamed "SIZE UP 0%" (the 0% ticket). D_farm unchanged: 85 finite, median
  $24,587.41 (analyst target exact).
- Category step plans (lib/model.ts, no dossier cost): CDP = mint/borrow
  ("Deposit $25000 of collateral on USDD on Tron, mint or borrow against it")
  + weekly "top up collateral or trim the borrow"; RWA step 1 = KYC/whitelist
  ("complete Lofty's KYC or whitelist check first - its yield asset is
  permissioned"); Risk Curators = "via its curator" ("into a Sentora Curator
  vault on Ethereum via its curator"); Prediction Market = liquidity provision
  ("Provide $25000 of liquidity to a Polymarket International market") +
  weekly "add or remove liquidity"; CDP Manager kept sensible ("Use Defi
  Saver Asset Management to manage a $25000 position").
- Deposit-yield note (0% vs 5%): detail size-up now states the 5% ticket per
  row (Katana $1,917 / $2,398 / $2,558 at 0/4/5%; Sentora + Flux over the cap
  at 5%); farm view adds "One point more - 5% - leaves only 26 farming,
  removing 17 of the 43: the forgone yield is the biggest lever."
- One build break fixed in-session: `name` is not defined in farmPlan (the
  RWA step used ${name}); fixed to ${p.name}; rebuild clean.
- Dashboard source 65,461 B / 65,536 B cap (margin 75 B - TIGHT; every later
  round needs an offsetting cut for any addition). Dossier 406,226 B (margin
  44,462 B). Screenshots re-rendered at q30: 96,623 / 78,243 / 79,357 B.
- Tests: smoke 52/52 (9 new R2 assertions), gauntlet 38/38, spec 6/6.
  Determinism md5 board 387fea863ef4b618be61b4e0da967a02, data.js
  f4d9c378899e50b142dcf9d74fb7f695, dossier 8830dfa49d54e60bf52e68ee00ff73dd.
  Totals unchanged: implied $887,133,813, farm 43/41/117.

## R3 — Nested proof + keep/drop prominence + range-honesty cover (2026-11-24, ~18:15 WIB)
- Judge note (top of page, item 2) now states the proof in one place, all
  live-computed: "29 V2 value and 5 V2 odds candidates were tested the same
  way and dropped", "Nested re-selection replicates the value picks in 0/6
  subsets, age + size in 5/6 and 5/6 for odds", "Honest walk-forward P10-P90
  covers 65.7% - 14.3 points under the stated 80%, admitted; bands not
  widened."
- Range honesty KPI now quantifies the gap: "P10-P90 14.3 pts under the stated
  80%, admitted" (GAP90/HON90 computed once, shared by KPI + note).
- Nested counts hoisted to one shared computation (NC) used by both the note
  and the nested-proof card - one computation, two renderings, always
  agreeing. Evidence cards (keep/drop, V2 candidates, intervals, nested)
  verified to render ABOVE the board table (order assertions).
- Paid for with prose trims only (evidence/odds intros, widening
  parenthetical, V2 intro, ablation mini, note page item, hero sub, farm
  sens/size-up paragraphs, detail minis) - no rubric content cut.
- Dashboard source 65,345 B / 65,536 B cap (margin 191 B). Dossier 406,219 B
  (margin 44,469 B). Screenshots re-rendered at q30: 96,617 / 78,243 / 79,357 B
  (PIL Range Honesty box now shows the 14.3-pt gap, fitting its 2-line box).
- Tests: smoke 56/56 (4 new R3 assertions), gauntlet 38/38, spec 6/6.
  Determinism md5 board 387fea863ef4b618be61b4e0da967a02, data.js
  f4d9c378899e50b142dcf9d74fb7f695, dossier e639a5a1a52222873ab30ed609905ed7.
  Totals unchanged: implied $887,133,813, farm 43/41/117.

## R4 — Sliders + partial hold + value walk + compare + breakdown bar (2026-11-24, ~18:40 WIB)
- Measurement round: all six R4 features were already in the R1 baseline, so
  the work was verification, not new code. No dashboard change was needed.
- Horizon slider verified EXACTLY against MODEL-SPEC constants, independent
  Python recomputation: Sentora +2y ever-rate 0.848059 -> 85%, implied
  $36,579,276 - matches the dashboard to the dollar. (First check used
  age/365 and was $2,953 off; lib and dashboard both use days/365.25 per
  MODEL-SPEC - the check, not the code, was wrong.)
- Breakdown bar measured: size curve x52.5M (+7.72 dex), growth carry x1.039
  (+0.02 dex), chains (discount) x0.790 (-0.10 dex), token odds x0.581
  (-0.24 dex); explainer "4 chains cost 21% of the size-curve value".
- Partial hold measured (Sentora): 25% hold $6,250 deposit, $3.98 drop,
  -$61.12 net (-$17.46/h); 100% hold $25,000 / $15.90 / -$222.27 (-$63.50/h).
  Drop and T-bill scale with deposit, fees do not.
- Tests: smoke 59/59 (3 new R4 assertions: horizon functional re-price,
  breakdown-bar legend, partial-hold 25% numbers), gauntlet 38/38.
  No repo change in R4, so board/data/dossier md5s carry over from R3
  (387fea86... / f4d9c378... / e639a5a1...); gauntlet determinism re-passed.

## R5 — Transparency panel + off-list section + visual polish (2026-11-24, ~19:00 WIB)
- Transparency measured: 132 pre-token at/above floor = 60 ranked + 72
  excluded; reason codes E1 CEX 27, E1 Liquid Staking 18, E1 Bridge 15,
  E1 Canonical Bridge 8, E1 Restaked BTC 2, E2 versioned name 2 (= 72);
  all 72 excluded protocols named with a reason code; dual-E2 note stated.
- Off-list measured: all 20 named, all SKIP; top rows Sentora $25.1M,
  Polymarket $22.3M; "no reason is invented" for why they are off-list.
  Transparency + off-list verified to render before the board table.
- Visual polish (criterion 5): full hex-color audit of style.css + app.js.
  One outlier found: link blue #0b5fa5, the only saturated non-navy hue.
  Fixed to #1d4e79 (navy family), zero byte cost. Everything else already
  consistent: ink-navy + amber vars, paper tints, 11/12/13/15/16/20/22/30px
  type scale, 16px section rhythm, 900px responsive breakpoint. Legend
  inline colors match the CSS bar classes exactly.
- Dashboard source 65,345 B / 65,536 B cap (margin 191 B). Dossier 406,219 B
  (margin 44,469 B). Screenshots re-rendered at q30: 96,617 / 78,243 / 79,357 B.
  Board.json 461,896 B (grew from 458,490 B in R1: longer R2 farm steps).
- Tests: smoke 67/67 (8 new R5 assertions), gauntlet 38/38, spec 6/6.
  Determinism md5 board 387fea863ef4b618be61b4e0da967a02, data.js
  f4d9c378899e50b142dcf9d74fb7f695, dossier 845f9aab5b96480ce7a9b96295ae5c9b.
  Totals unchanged: implied $887,133,813, farm 43/41/117.

## R6 — Integration + full re-measure (2026-11-24, ~19:30 WIB)
- Visual audit of all three screenshots (read as images, not just byte
  counts) found 4 real defects, all fixed and re-verified by re-reading:
  (1) board header sub cut off at the right edge - renderer still used the
  pre-R3 long text (1,555px vs 1,368px available); updated to the current
  dashboard sub (1,214px). (2) Brier KPI value "0.1890 / 0.1868 / 0.2093"
  overflowed its box in the screenshot AND in the live dashboard (288px
  in a ~172px box) - fixed in the dashboard with a 16px .sm value class
  for the two long KPIs + Brier to 3 decimals ("0.189 / 0.187 / 0.209");
  full 4-decimal precision still in the odds table. PIL renderer matches
  (3-decimal Brier, 16px for miss + Brier). (3) farm book "net $3762.50"
  lacked a thousands comma - money() now uses ",.2f" ("$3,762.50").
  (4) detail step 2 cut mid-word at the 168-char slice - now truncates at
  a word boundary with an ellipsis.
- Final numbers: smoke 68/68, gauntlet 38/38, spec 6/6. Dashboard source
  65,449 B / 65,536 B cap (margin 87 B). Dossier 405,113 B (margin 45,575 B
  vs 450,688 target). Screenshots 95,818 / 78,182 / 79,392 B, all 1440x900.
  Board.json 461,896 B. Determinism md5 board
  387fea863ef4b618be61b4e0da967a02, data.js f4d9c378899e50b142dcf9d74fb7f695,
  dossier 28a42046c9abda81f03d840d03812f9d. Totals unchanged throughout:
  implied $887,133,813, farm 43/41/117, top 10 exact.
- NO round reverted. R4 needed no dashboard change (verification only).
