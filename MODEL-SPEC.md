# MODEL-SPEC.md — token-radar-01 V2 (roni-rockabilly) — FASE 2

**Purpose:** every number the builder needs to implement `main.ts` WITHOUT re-fitting.
All numbers below were computed from the kit snapshot only
(`snapshot.json`, 758 protocols, `as_of` 2026-11-14, floor $50,000,000, 40 watchlist).
Nothing in this file is copied from another entry (all top-10 repos are
`source_withheld`; only their public titles/scores/screenshots were studied).
Analysis scripts (NOT entry code, never bundle): `analysis/sets.py`,
`analysis/common.py`, `analysis/fit00_repro.py`, `analysis/fit01_value_v2.py`,
`analysis/fit02_value_v2_combined.py`, `analysis/fit03_odds_v2.py`,
`analysis/fit04_intervals_rank_farm.py`, `analysis/fit05_control.py`.
Keyed results in `analysis/*.json` (`repro.json`, `value_v2.json`,
`value_v2_combined.json`, `odds_v2.json`, `ranking_v2.json`, `farm_v2.json`,
`control_v2.json`).

**How to read the verdicts:** a term is KEPT only if it lowers the miss/Brier on
BOTH deciding tests (value: LOO **and** walk-forward; odds: LOO **and** 10-fold
**and** walk-forward). "Lowers" means strictly lower on the exact (unrounded)
values — a tie to 6 decimals is a tie, not a win, however the 4-decimal
rounding looks. The 5-fold-by-size split is a third check, reported but not
deciding. A literal both-tests pass is necessary, not sufficient: a term whose
win is driven by one protocol, or whose coefficient flips sign between folds,
is rejected with the mechanism stated (radar-7 precedent: the combined
{growth, age, chains} model beat the final on LOO and WF and was still not kept).

## GO / NO-GO VERDICT — READ FIRST

**NO-GO for building V2 as a new model.** No V2 value term beats radar-7 on
both deciding tests in any defensible sense, and no V2 odds term survives all
three tests. The full V2 design formula (percentiles + age boost + category
multiples + chains premium) scores **LOO ×3.2903 — WORSE than radar-7's
×3.2194** (WF ×1.9399 wins, 5-fold ×3.0890). The V2 value model that would
ship is therefore the radar-7 formula, unchanged; the V2 odds model is the
radar-7 formula, unchanged.

**What that means for the build decision (coordinator's call, not the
analyst's):** do NOT build V2 expecting a better model. The parts of V2 that
are still worth building are presentational and use the radar-7 formulas:
the transparency panel (72 excluded, 20 off-list — the corrected numbers),
the "above floor, off-list" section (the 20), the Size-up / break-even-deposit
farm framing (`D_farm` per row, computed in §6), the per-row component
breakdown bar (components of the radar-7 formula, exported per row in §5),
and the 201-row ranked set (prep E2, §1.4). The local proxy gates from
BOUNTY-PROFILE.md resolve as: value beats radar-7 on BOTH — **NOT MET**
(it IS radar-7); odds Brier held — **MET** (0.188978 / 0.209304);
farm watchlist FARM ≥ 3 — **NOT MET** (0 at every deposit, honest rule);
honest-WF P10–P90 ≥ 71.4% — **NOT MET** (65.7%, same as radar-7).

**One nominal exception, rejected with evidence:** a momentum-percentile term
referenced against the pre-token 342 passes both tests literally
(LOO ×3.1961, WF ×2.0308). It is NOT kept: its coefficient flips sign
between the WF-train fit (+0.1565) and the full fit (−0.1772); its LOO win
lives entirely in the 22 undated comps while it LOSES on both dated halves
(older35 +0.135, newer35 +0.375); 5-fold worsens to ×3.1898; and in a paired
bootstrap it beats the baseline on LOO in only 38% of resamples. Full
numbers in §2.2, row V1f. Shipping it would hardcode noise.

---

## 0. Verified snapshot counts — and two corrections to the brief

| Count | Value |
|---|---|
| Protocols | 758 |
| Watchlist | 40 (all present in `protocols`, all TVL ≥ $50M) |
| Record no token at all (mcap + gecko_id + symbol all null) | 342 |
| Record a token (symbol present) | 416 |
| `mcap_usd > 0` | **128 — NOT 129.** The brief/RULES.md say 129; the snapshot has 144 non-null `mcap_usd`, of which **15 are exactly 0**. All downstream counts use 128. |
| `gecko_id` present | 158 |
| No `listed_at` | 113 |
| Null `change_7d` | 4 |
| Null `category` | 0 |
| Top categories | Dexs 99, Liquid Staking 78, Lending 75, CEX 56, Bridge 55, Risk Curators 39, Yield 39, RWA 33 |
| Market median `change_7d` (754 non-null, as a fraction) | **−0.0823335** (middle two values −0.082467, −0.082200). The top-10's "market −8.2%" is this number. |
| Snapshot date (`AS_OF`) | 2026-11-14. Ages are `(2026-11-14 − listed_at) / 365.25` in years. |

**Verified numbers carried from TR-V2-PREP-VERIFICATION.md (honored exactly):**
- `change_7d` is in PERCENT units — divide by 100 before using as a fraction.
- Age over eligible-usr 201: median **420d**, <90d **28**, <180d **50**, null **7**
  (the prep's 513d/37/64/24 are over pre-token 342, not eligible).
- Momentum over eligible-usr 201: median **−3.8%**, p10 **−12.7%**, p90 **+5.7%**
  (the prep's −6.8%/−14.2%/+4.6% are over pre-token 342).
- TVL p75/median claimed $28M/~$17M does not reproduce exactly: pre-token
  $5–50M gives **$26.3M/$15.7M**; eligible $5–50M gives **$24.6M/$14.6M**.
  The design conclusion (log-scale mandatory) is unchanged.
- **"92 dari 132" is WRONG:** house-rule exclusions among pre-token ≥$50M = **72**,
  not 92 (92 = 72 excluded + 20 eligible-but-off-list). Transparency numbers are
  **72 excluded, 20 off-list**.

---

## 1. Sets — comp set, peer set, ranked set, ledger

### 1.1 Exclusion rules (snapshot fields only) — TWO E2 variants

A protocol is a **peer** (stand-alone) unless ANY of these holds:

- **E1 — category** in `{Bridge, Canonical Bridge, CEX, Liquid Staking,
  Liquid Restaking, Restaked BTC}`. `Cross Chain Bridge` and `Staking Pool`
  are NOT excluded.
- **E2 — versioned name.** Two variants (see §1.5 for the decision):
  - **E2-kit** (house rule, MODEL-SPEC v9 §1.1): regex
    `\s+(V\d+(\.\d+)?|\d+\.\d+)\s*$` (case-insensitive). Matches
    `V1/V2/V3/V4/V12/V2.1/2.0`. Drops 11 pre-token names, 76 versioned
    names among non-E1 overall.
  - **E2-prep** (user's V2 design brief): regex `\s+(V2|V3)\s*$` only.
    Drops 8 pre-token names, 52 versioned names among non-E1 overall.
    It KEEPS **Metric V1** (Dexs, $24.6M), **Privacy Pools V1** (Privacy,
    $8.5M), **Rysk V12** (Options Vault, $28.5M).
- **E3 — wrapped/staked name:** name contains a whole word `wrapped`,
  `staked`, or `staking` (regex `\b(wrapped|staked|staking)\b`, case-insensitive).
- **E4 — exchange-named:** name starts with `binance|coinbase|bybit|
  bitfinex|robinhood|kraken|okx|bitget|kucoin|huobi|gemini|bitstamp`.
  (Removes 0 additional protocols after E1–E3; kept as a stated rule.)

### 1.2 Comp set (traded comps for the value model) — n = 92 (BOTH E2 variants)

Identical under kit and prep E2 (the only comp E2 removes is `Aave V2`,
dropped by both). Same ledger as MODEL-SPEC v9 §1.2: `mcap_usd > 0` = **128**
→ 92 after E1–E4. Dated 70, undated 22. Median age of dated comps
2.342231348391513 y. `change_7d` null among comps: 0. `mcap/TVL` ratio:
median 0.2460, range 0.00129 (Concentrator) – 400.2 (Rain).

### 1.3 Peer set (token-odds fit) — n = 442 (kit) / 466 (prep)

| Variant | Peers | Token-recorded | No-token |
|---|---|---|---|
| Kit E2 | **442** | 244 (55.2036%) | 198 |
| Prep E2 | **466** | 265 (56.8678%) | 201 |

**CORRECTION to the task brief:** prep E2 gives **466 peers, NOT 445**.
The 445 figure counts only the 3 pre-token names. E2 also drops
versioned names among TOKEN-recorded protocols: kit E2 drops 65 of them,
prep E2 drops 44 — so prep keeps **21 token-recorded versioned
sub-products** as peers (Aave V1, Aave V4, Aerodrome V1, Bancor V2.1,
dYdX V4, JustLend V1, Liquity V1, Uniswap V4, SunSwap V4, Stargate V1,
and 11 more). These are versioned deployments of protocols that already
have tokens — the prep peer set double-counts the underlying protocol.
The 21 are all token-recorded (21/24 extra peers); median TVL $28M,
median age 2.96 y.

### 1.4 Ranked set — n = 201 (prep E2, the V2 ranked set)

Ranked = peers (prep E2) with no token at all: **201 = 40 watchlist + 20
off-list + 141 early (TVL < $50M)**. Bands: $10–50M **96**, $5–10M **45**
(kit E2 would give 198 = 40 + 20 + 138; bands 94/44).

- **Watchlist 40:** `slug` in the snapshot's `watchlist` array. All 40 are
  in the peer set under both variants (0 watchlist protocols excluded).
- **Off-list 20:** peer, no token, `TVL ≥ $50,000,000`, `slug` NOT in the
  watchlist array. Identical 20 under both variants (the 3 prep-kept rows
  are all below $50M). In rank order: Sentora Curator, Polymarket
  International, Defi Saver Asset Management, CIAN Yield Layer, BitFi
  Basis, Avant avUSD, Figure Markets Exchange, Mellow Core, Loopscale
  Lending, Figure Markets Prime, Extended Perps, IPOR Fusion, Theo Network
  thUSD, Solv Strategies, Nado Spot, Circle Gateway, Arcus Perps, Stellar
  DeFi Hub, USDCx, AZverse Perps. (Why they are not on the house watchlist
  is not derivable from the snapshot — label them "Off-list (above the
  floor, not on the house watchlist)", do not invent a reason.)
- **Early 141:** peer, no token, `TVL < $50,000,000` (includes the 3
  prep-kept rows: Rysk V12 #87, Privacy Pools V1 #142, Metric V1 #199).

### 1.5 Ledger — all 758 in exactly one group (prep E2, the V2 ledger)

| Group | Count |
|---|---|
| Ranked, records no token (peers, prep) | 201 |
| Peer, records a token (prep) | 265 |
| Set aside — category Bridge | 55 |
| Set aside — category CEX | 56 |
| Set aside — category Canonical Bridge | 32 |
| Set aside — category Liquid Staking | 78 |
| Set aside — category Liquid Restaking | 9 |
| Set aside — category Restaked BTC | 3 |
| Set aside — versioned name (E2-prep) | 52 |
| Set aside — wrapped/staked name (E3) | 7 |
| **Total** | **758** |

(201 + 265 + 233 + 52 + 7 = 758. ✓ Kit-E2 ledger for reference: 198 + 244 +
233 + 76 + 7 = 758.)

### 1.6 E2 DECISION + quantification

**Decision: ranked set uses prep E2 (201 rows); the value and odds FITS stay
kit (92 comps / 442 peers).** The transparency panel states both rules,
names the 3 prep-kept rows, and prints "72 excluded by house rule, 20
eligible but off-list".

Odds fit under both E2 variants (same formula, §3.1):

| Variant | Peers | LOO Brier | 10-fold Brier | WF Brier | WF split |
|---|---|---|---|---|---|
| Kit E2 | 442 | 0.188978 | 0.187834 | 0.209304 | 2025-05-05 (191→192) |
| Prep E2 | 466 | 0.184941 | 0.184793 | 0.217103 | 2025-04-22 (200→200) |

The headline WF comparison is confounded (different test sets). On
**common rows** (LOO over the same 442 kit peers; WF on the same 192 kit
test rows, prep training pool = prep peers listed before 2025-05-05):

| Evaluation on common rows | Kit-trained | Prep-trained | Difference |
|---|---|---|---|
| LOO Brier (442 rows) | 0.188978 | 0.184979 | **−0.0040** (prep better) |
| WF Brier (192 rows) | 0.209304 | 0.210311 | **+0.0010** (kit better) |

The difference is **immaterial in magnitude** (±0.004 LOO, ±0.001 WF) and
mixed in sign — the preliminary coordinator choice (prep E2) is confirmed
immaterial for the fit. The fits stay kit for two non-numerical reasons:
(1) the kit peer set does not double-count versioned sub-products of
token protocols; (2) kit reproduces the published counts (442/244/198/92)
and preserves the exact validated odds coefficients. The 3 extra ranked
rows' odds barely move between fits: Metric V1 0.1114 (kit) vs 0.1144
(prep); Privacy Pools V1 0.3714 vs 0.3813; Rysk V12 0.4331 vs 0.4426
(≤0.01). The prep odds coefficients for reference:
`[−5.6271, +0.7200, +2.1615, +0.2567, −3.4178]`, median peer age 1.5715 y
(vs kit 1.5277 y). The builder implements the kit fit (§3.1).

---

## 2. Value model — fitted launch value

### 2.1 Final formula (the ONLY value formula the builder implements)

The V2 candidates all failed (§2.2). The formula is the radar-7 formula,
reproduced exactly in `fit00_repro.py` (REPRODUCTION: PASS — every number
below matches MODEL-SPEC v9 to 4 decimals):

```
excess   = change_7d_frac − (−0.0823335)          # change_7d_frac = change_7d/100
           ; null change_7d → excess = 0
excess_c = clamp(excess, −0.25, +0.25)
TVL_fwd  = TVL_usd × (1 + excess_c)
log10(V_launch) = 4.151591391698986
                + 0.37803061564497553 × log10(TVL_fwd)
                − 0.07367333346996185 × ln(n_chains)     # n_chains = len(chains)
V_launch = 10 ^ log10(V_launch)
```

- `ln` is the natural log. `log10` is base 10.
- At TVL = $100M, 1 chain, no carry: V_launch = **$14.99M**.
- Fit: OLS in log10 space on the 92 comps. Residual SD (log10) **0.8393**,
  R² **0.1094** — the model explains ~11% of log-cap variance. Say so on the
  board (meena's framing: "the ranking is signal, the level is not").
- **LOO ×3.2194, WF ×2.0668, 5-fold ×3.0188** (within-3×: LOO 48.9%,
  WF 57.1%, 5-fold 50.0%) vs flat baseline ×4.65 / ×4.52 / ×4.88.
- Bootstrap standard errors (200 refits, resampling the 92 comps with
  replacement; seed 20261123, first-in-stream — same stream as the rank
  ranges in §4):

| Coefficient | Full-fit value | Bootstrap mean | Bootstrap SE | 95% interval (P2.5–P97.5) | Sign stable |
|---|---|---|---|---|---|
| Intercept | +4.151591391698986 | +4.190333 | 0.901544 | +2.577061 – +6.046476 | — |
| log10(TVL) slope | +0.37803061564497553 | +0.374426 | 0.114049 | +0.142040 – +0.584091 | >0 in 100% of refits |
| ln(chains) coef | −0.07367333346996185 | −0.085728 | 0.078988 | −0.234848 – +0.046926 | <0 in 83.5% of refits |

(Note: MODEL-SPEC v9 §2.1 prints a slightly different bootstrap table
— intercept mean +4.121732, SE 0.992795; slope mean +0.383232, SE
0.125286; chains mean −0.078397, SE 0.082900, <0 in 79.5% — because that
table used a later position in the same seeded stream (FINAL-A refits
first). Same distribution, Monte Carlo noise; the numbers above are from
this run's single stream, consistent with §4's rank ranges.)

### 2.2 Keep/drop table — V2 candidates, each tested on the 92 comps

Miss = median miss as a multiplier: 10^median|log10(pred/actual)|.
**Splits (all honest refits inside every fold):**
- **LOO:** leave-one-out over all 92 comps.
- **Walk-forward:** fit on the 35 comps listed before **2024-07-15**
  (the median listed date), price the 35 listed on/after it; 22 undated
  comps excluded from WF (same split as behzad: 35/35/22).
- **5-fold-by-size:** comps sorted by TVL, dealt round-robin into 5 folds,
  each fold priced by a fit on the other four.

Percentile definition (B1): ECDF percentile of the row's value against the
reference set. In LOO/WF/5-fold the reference is the TRAINING comps only
(no leakage); the reference-set sensitivities in §2.2 row V1f use fixed
external sets (eligible-201 / pre-token-342 / all-758, all disjoint from
the priced comps). Baseline to beat: **LOO ×3.2194 / WF ×2.0668 /
5-fold ×3.0188**.

| # | Model | LOO miss (≤3×) | WF miss (≤3×) | 5-fold miss (≤3×) | Verdict |
|---|---|---|---|---|---|
| — | **Flat multiple baseline** | **×4.65 (38%)** | **×4.52 (37%)** | **×4.88 (37%)** | baseline |
| 0 | Size curve only | ×3.2693 (45.7%) | ×2.1057 (57.1%) | ×3.2022 (45.7%) | BASE (reproduced) |
| 0+g | + growth carry, excess capped ±25% | ×3.2224 (46.7%) | ×2.0924 (57.1%) | ×3.2653 (46.7%) | KEPT (radar-7; thin) |
| 0+g+c | + ln(chains) = **radar-7 final** | **×3.2194 (48.9%)** | **×2.0668 (57.1%)** | **×3.0188 (50.0%)** | **FINAL (reproduced)** |
| V1a | pct(logTVL) only (replaces log-linear TVL) | ×3.5856 (45.7%) | ×2.4819 (57.1%) | ×3.6517 (45.7%) | **NOT KEPT** — both worse |
| V1a+c | pct(logTVL) + ln(chains) | ×3.0910 (47.8%) | ×2.3712 (60.0%) | ×3.2867 (45.7%) | **NOT KEPT** — LOO wins, WF fails badly |
| V1b | logTVL_fwd + pct(momentum) (replaces growth carry) | ×3.4556 (45.7%) | ×2.0932 (57.1%) | ×3.3543 (46.7%) | **NOT KEPT** — both worse |
| V1c | pct(logTVL) + pct(momentum) | ×3.7153 (45.7%) | ×2.4017 (57.1%) | ×3.4709 (44.6%) | **NOT KEPT** — both worse |
| V1d | pct(logTVL) + pct(mom) + ln(chains) | ×3.1290 (50.0%) | ×2.4523 (60.0%) | ×3.3586 (46.7%) | **NOT KEPT** — LOO wins, WF fails badly |
| V1e | pct both, percentiles clamped [0.05, 0.95] | ×3.7288 (45.7%) | ×2.4064 (57.1%) | ×3.4875 (44.6%) | **NOT KEPT** — both worse |
| V1f | logTVL_fwd + pct(momentum vs **pre-token 342**) + ln(chains) | ×3.1961 (48.9%) | ×2.0308 (57.1%) | ×3.1898 (47.8%) | **NOT KEPT — nominal both-tests pass, REJECTED on robustness** (see below) |
| V1f2 | logTVL_fwd + pct(mom vs eligible-201) + ln(chains) | ×3.2562 (48.9%) | ×1.9910 (57.1%) | ×3.1090 (47.8%) | **NOT KEPT** — LOO worse |
| V1f3 | logTVL_fwd + pct(mom vs all-758) + ln(chains) | ×3.1694 (48.9%) | ×2.0837 (60.0%) | ×3.2052 (48.9%) | **NOT KEPT** — WF worse |
| V1f4 | pct(logTVL vs pretoken-342) + ln(chains) | ×3.0264 (50.0%) | ×2.0713 (57.1%) | ×3.2169 (45.7%) | **NOT KEPT** — WF fails by 0.0045 |
| V1f5 | pct(logTVL vs eligible-201) + ln(chains) | ×2.9835 (50.0%) | ×2.3451 (60.0%) | ×3.2219 (46.7%) | **NOT KEPT** — WF fails |
| V2a | + age boost, lin-decay, free coef (on final) | ×3.4467 (47.8%) | ×2.0668 (57.1%) | ×3.2527 (48.9%) | **NOT KEPT** — LOO worse, WF exact tie |
| V2b | + age boost, exp-decay, free coef (on final) | ×3.2349 (48.9%) | ×5,538,700,999,999,992,832 (0%) | ×3.0188 (50.0%) | **NOT KEPT** — WF catastrophic (degenerate) |
| V2c | + age boost lin + undated dummy (on final) | ×3.1045 (47.8%) | ×2.0668 (57.1%) | ×3.1910 (46.7%) | **NOT KEPT** — WF is an exact tie (diff +0.000000), not a win |
| V2d | multiplicative boost (1+a·max(0,(180−d)/180)), a=0.1–2.0 | LOO ×3.2167→×3.1822 as a rises | WF ×2.0668 (a≤1.0), ×2.1069 (a=1.5), ×2.2785 (a=2.0) | — | **NOT KEPT** — WF never lowers |
| V3a | + category, coarse3 (Risk Curators / Dexs-Lending / Other), ridge k=16 | ×3.1534 (47.8%) | ×2.1583 (57.1%) | ×3.0664 (48.9%) | **NOT KEPT** — WF fails |
| V3b | + category, coarse3, ridge k=64 | ×3.3003 (47.8%) | ×2.1073 (57.1%) | ×3.1197 (48.9%) | **NOT KEPT** — both worse |
| V3c | + category, Allocator (RC+Onchain Cap Alloc, n=3) vs rest, k=16 | ×3.2198 | ×2.2133 | — | **NOT KEPT** — both worse |
| V3d | + category, Allocator vs rest, k=64 | ×3.2197 | ×2.0319 | — | **NOT KEPT** — LOO worse by 0.0003 |
| V3e | + category, Dexs/Lending (n=25) vs rest, k=16 | ×3.1112 | ×2.1912 | — | **NOT KEPT** — WF fails |
| V3f | + category, Risk Curators (n=1) vs rest, ridge k=16 | ×3.1662 (48.9%) | ×1.9870 (57.1%) | ×3.0107 (48.9%) | **NOT KEPT — literal both-tests pass, REJECTED on mechanism** (see below) |
| V3g | + category, Risk Curators vs rest, ridge k=64 | ×3.1827 (48.9%) | ×2.0257 (57.1%) | ×3.0107 (50.0%) | **NOT KEPT — same mechanism rejection** |
| V4 | ln(chains) sign/size (on base+growth and on pct model) | coef −0.073673 (base+growth); −0.074133 (pct model) | — | — | **Chains is a DISCOUNT, not a premium** — the design's "log(chains) premium" is wrong-signed; <0 in 83.5% of bootstrap refits |
| V5 | **COMBINED V2 full design** (pct TVL + pct mom + age-boost-lin + coarse3-cat k=16 + ln(chains)) | **×3.2903 (47.8%)** | **×1.9399 (60.0%)** | **×3.0890 (48.9%)** | **NOT KEPT — LOO worse than radar-7** |
| V5b | best-of (pct both + chains + RC-vs-rest k=16) | ×3.1349 (50.0%) | ×2.3661 (57.1%) | — | **NOT KEPT** — WF fails badly |
| G1 | CONTROL: neighbour-row growth (on base+growth) | ×3.3467 (45.7%) | ×2.5403 (60.0%) | ×3.1305 (48.9%) | **NOT KEPT — must not help.** Hurts both deciding tests. ✓ |
| G2 | CONTROL: neighbour-row growth (on final) | ×3.1217 (48.9%) | ×2.5019 (60.0%) | ×3.1728 (48.9%) | **NOT KEPT — must not help.** LOO improves but WF worsens badly. ✓ |

**Why V1f is rejected despite passing both tests literally.** The
momentum-percentile term referenced against pre-token 342
(`logTVL_fwd + pct_mom + ln(chains)`, coef −0.177178) scores LOO ×3.1961 /
WF ×2.0308 — strictly below baseline on both. It is not kept, for four
independent reasons, any one of which is disqualifying:
1. **Sign instability:** the coefficient is +0.1565 when fitted on the
   WF-train half (older 35) and −0.1772 on the full fit. The WF "win" was
   produced by the OPPOSITE sign from the coefficient the builder would
   hardcode. Bootstrap (100 refits): mean −0.1423, SD 0.2985, 95% interval
   [−0.7052, +0.3618], negative in only 61% of refits.
2. **Subset inconsistency:** the LOO win lives entirely in the 22 undated
   comps (LOO ×7.5630 → ×6.9003). On dated comps it LOSES: older-35
   ×3.0224 → ×3.1577 (+0.135), newer-35 ×2.9718 → ×3.3464 (+0.375).
3. **Third check contradicts:** 5-fold worsens ×3.0188 → ×3.1898.
4. **Selection:** it is 1 of 8 reference-set variants tried (eligible-201,
   pre-token-342, all-758 × two placements); the others fail. In a paired
   bootstrap it beats the baseline on LOO in only 38% of resamples (mean
   difference +0.096 — worse on average). The same term without the
   growth carry (LOO ×3.1633 / WF ×2.0497) inherits the same instability
   and is rejected on the same grounds.
   Reverse walk-forward (fit newer 35 → price older 35) does favor it
   (×2.0771 vs base ×2.1480) — noted, but it does not outweigh 1–4.

**Why V3f/V3g are rejected despite passing both tests literally.** The
Risk-Curators-vs-rest ridge offset (k=16: LOO ×3.1662 / WF ×1.9870;
k=64: ×3.1827 / ×2.0257) is not a category effect:
1. **The multiple rests on ONE comp.** Risk Curators has exactly 1 traded
   comp (Api3, mcap/TVL 2.9747, residual +0.776 under the base model).
   Full-fit multiples: Risk Curators ×1.111 (k=16) / ×1.028 (k=64) — a
   one-protocol number. Dexs/Lending ×0.729 (n=25), Other ×1.146 (n=66)
   in the coarse3 split, which itself fails WF.
2. **Zero Risk Curator rows in the WF test set** (Api3 is in the WF train
   half). No Risk Curator row is ever priced better by the term on the
   deciding test.
3. **Intercept-shift equivalence:** a plain constant shift of −0.0171 dex
   applied to the base model's predictions reproduces the WF win EXACTLY
   (WF ×1.9870) and beats the category term on LOO (×3.0951 vs ×3.1662);
   c=−0.03 gives LOO ×3.0362 / WF ×1.9643. The "win" is Api3's single
   +0.776 residual leaking into the Rest-group offset (−0.0171) — a global
   intercept shift, not a category multiple. 22 of the 35 WF test comps
   get WORSE under the term; only the median improves.
4. Removing Api3 from the comps entirely moves the base model to LOO
   ×2.9770 / WF ×2.0710 — the whole effect is one outlier's leverage.
   This is the third rejection of category effects (radar-7 rejected them
   twice, on ridge k=16 and k=64); the V2 design's "Risk Curators/allocator
   tertinggi" multiple is unfittable from 1 comp.

**Why the age boost fails (V2a–V2d).** Only **3 of the 92 comps** are
<180d old (Fables 80d, Wise Token 88d, Huma 171d), and all three sit in the
WF TEST half — the WF TRAIN half (older 35) contains ZERO protocols
<180d, so any <180d-only boost feature is identically zero in WF training
and its coefficient is unidentified there (WF ties at ×2.0668 exactly, or
degenerates: the exp-decay form's WF is ×5.5×10¹⁸ — a coefficient fitted
on a ~10⁻⁴-constant column blowing up on young test rows). Worse, the
three young comps all price BELOW the size curve (residuals Fables −0.845,
Huma −0.180, Wise Token −0.101): the data says young is a DISCOUNT, not a
boost — the free-coefficient fit gives −0.967. The OpenRouter-suggested
multiplier `max(1 − days/180, 0)` would decay to ZERO at 180 days and zero
out older protocols; it was not tested as a multiplier for that reason.
The tested multiplicative form `1 + a·max(0,(180−d)/180)` (decays to
neutral ×1.0) improves LOO monotonically with a (×3.2167 at a=0.1 →
×3.1822 at a=2.0) but NEVER lowers WF (×2.0668 for a≤1.0, then worse).
Listed_at null = neutral (feature 0) + flag, as designed; the undated
dummy does not change WF (undated comps are excluded from WF by
construction), so V2c's WF is an exact tie, not a win.

**Per-category raw median mcap/TVL (comps only — for the record, most
categories have 1–3 comps and no multiple is supported):** Lending n=14
×0.1306; Dexs n=11 ×0.3424; Yield n=9 ×0.1914; RWA n=9 ×0.2748; Basis
Trading n=7 ×0.6544; Cross Chain Bridge n=4 ×1.2205; Yield Aggregator n=4
×0.1510; Indexes n=3 ×0.1477; CDP n=3 ×0.1687; Privacy n=3 ×0.9691;
Restaking n=2 ×0.0246; Onchain Capital Allocator n=2 ×0.0125; Token Locker
n=2 ×9.5204; Derivatives n=2 ×2.1619; AI Agents n=2 ×0.6047; Staking Pool
n=2 ×0.0018; Payments n=2 ×0.1813; Risk Curators n=1 ×2.9747; Prediction
Market n=1 ×400.2045 (Rain); Collateral Management n=1 ×12.1602; plus
8 more n=1 categories. No finer split was tested beyond coarse3 /
allocator-family / Dexs-Lending / RC-vs-rest, because the coarse factor
failed first (per the task's sequencing rule) and the RC-vs-rest pass was
shown above to be an artifact.

### 2.3 Worked example — Sentora Curator (#1)

- TVL $2,757,585,593; change_7d +2.3672%; chains 4 (Ethereum, Ink, Solana,
  Tempo); listed 2025-10-03 (age 1.1143 y).
- excess = 0.023672 − (−0.0823335) = **0.1060055** (within ±0.25, no clamp).
- TVL_fwd = 2,757,585,593 × 1.1060055 = $3,049,904,833.
- Component breakdown (exported per row for the breakdown bar):
  - TVL component: 10^(4.151591391698986 + 0.37803061564497553 × log10(3,049,904,833))
    = 10^7.736979 = $54,568,495 (before the chains factor).
  - Chains factor: 10^(−0.07367333346996185 × ln(4)) = 10^(−0.102134) =
    **0.790437** (a discount, not a premium — 4 chains; the coefficient
    lives in log10 space, so the multiplier is 10^term, NOT e^term).
  - Launch value = $54,568,495 × 0.790437 = **$43,132,939**.
- log10(V) = 4.151591391698986 + 0.37803061564497553 × 9.484340
  − 0.07367333346996185 × 1.386294 = **7.634845** → V_launch = **$43,132,939**.
- Odds 0.5810 (§3) → implied = 43,132,939 × 0.5810 = **$25,058,273**.

### 2.4 Sensitivity table (builder: compute per row from the formulas)

For Sentora Curator (launch value $43,132,939):

| Change | Launch value | × recorded |
|---|---|---|
| TVL 30% lower | $37,692,190 | ×0.874 |
| TVL 30% higher | $47,630,279 | ×1.104 |
| 7-day change 0% (excess +0.0823) | $42,781,598 | ×0.992 |
| 7-day change +20% (excess +0.25, capped) | $45,175,442 | ×1.047 |
| Six more months, still no token (value model has no age term; odds 0.5810→0.6626, §3) | implied ×1.140 | — |

---

---

## 3. Token odds — fitted on the 442 peers (kit E2)

### 3.1 Final formula (the ONLY odds formula the builder implements)

The V2 odds candidates all failed (§3.2). The formula is the radar-7
formula, reproduced exactly in `fit00_repro.py`:

```
age_years = (2026-11-14 − listed_at) / 365.25 ; undated → age_years = 1.5277207392197125
undated   = 1 if listed_at is null else 0
growth_xs = clamp(change_7d_frac − (−0.0823335), −0.25, +0.25) ; null change_7d → 0
logit(p)  = −5.541816482709376
          + 0.696382469603912 × age_years
          + 2.1259905871569202 × undated
          + 0.25135695713616923 × ln(TVL_usd)
          − 3.503363706437129 × growth_xs
p_ever    = 1 / (1 + exp(−logit(p)))
```

- The ±25% cap on `growth_xs` is load-bearing (see MODEL-SPEC v9 §3.1:
  uncapped, Shift DeFi at +4448.47% gets odds 9.4×10⁻¹⁴ and implied $0.00).
  21/442 peers have |excess| > 0.25.
- Bootstrap SEs (200 refits, seed 20261123 — identical to MODEL-SPEC v9 §3.1):

| Coefficient | Full-fit value | Bootstrap mean | Bootstrap SE | 95% interval | Sign stable |
|---|---|---|---|---|---|
| Intercept | −5.541816482709376 | −5.730092 | 1.440943 | −8.761122 – −3.186152 | — |
| age_years | +0.696382469603912 | +0.714415 | 0.112940 | +0.527717 – +0.947061 | >0 in 100% |
| undated dummy | +2.1259905871569202 | +2.190331 | 0.443546 | +1.524857 – +3.241283 | >0 in 100% |
| ln(TVL_usd) | +0.25135695713616923 | +0.260174 | 0.080277 | +0.114973 – +0.429346 | >0 in 100% |
| growth_xs (capped) | −3.503363706437129 | −3.492187 | 1.567192 | −6.444205 – −0.482427 | <0 in 99.5% |

- In-sample Brier **0.184817**. Base rate 244/442 = **0.552036**.

### 3.2 Keep/drop table — Brier scores (lower is better)

**Splits:** LOO over all 442 peers; 10-fold stratified (seed 11); walk-forward:
fit on the 191 peers listed before **2025-05-05** (median listed date among
dated peers), price the 192 listed on/after it; 59 undated peers excluded
from WF by construction. V2 candidates are tested on top of the final
4-term model; the radar-7 rows below are reproduced from MODEL-SPEC v9 §3.2.

| # | Model (cumulative, in test order) | LOO Brier | 10-fold Brier | WF Brier | Verdict |
|---|---|---|---|---|---|
| — | **Base rate only (0.552036)** | **0.2484** | **0.2473** | **0.3523** | baseline |
| 1 | + age_years | 0.2151 | 0.2142 | 0.2203 | **KEPT** (radar-7) |
| 1b | + age + undated dummy | 0.1952 | 0.1942 | 0.2203 | **KEPT** (radar-7; WF silent, dummy is real signal: undated token rate 0.881 vs dated 0.501) |
| 2c | + size, ln(TVL_usd) (on age+dummy) | 0.1906 | 0.1893 | 0.2116 | **KEPT** (radar-7) |
| 3c | + category share, shrunk α=8 (on age+dummy+size) | 0.1885 | 0.1874 | 0.2302 | **NOT KEPT** (radar-7) — WF worsens |
| 4d | + growth_xs, capped ±25% (on age+dummy+size) | 0.1890 | 0.1878 | 0.2093 | **KEPT** (radar-7) — thin, all three improve |
| 5d | + chain count, ln(n_chains) (on final) | 0.1891 | 0.1878 | 0.2070 | **NOT KEPT** (radar-7) — LOO worsens by 0.00015 |
| D1 | + age-boost, lin-decay max(0,(180−d)/180) (on final) | 0.188058 | 0.186950 | 0.209304 | **NOT KEPT** — LOO/10-fold improve thinly, WF is an EXACT TIE (same structural trap as value V2a: WF train has zero peers <180d, feature identically 0, coefficient unidentified). New coef +1.1066. |
| D2 | + age-boost, exp-decay exp(−d/90) (on final) | 0.186999 | 0.185653 | 0.409105 | **NOT KEPT** — WF catastrophic (degenerate: near-constant ~10⁻⁴ column in train, coef +1.6886 blows up on young test peers) |
| D3 | + chain count, ln(n_chains) (on final, re-test) | 0.189126 | 0.187758 | 0.207000 | **NOT KEPT** — LOO worsens (same as 5d); 10-fold/WF improve |
| D4 | + coarse category share, Allocator (Risk Curators) vs rest, α=8 (on final) | 0.183007 | 0.181669 | 0.278699 | **NOT KEPT** — LOO/10-fold improve a lot, WF worsens catastrophically. Risk Curators peers n=39, token rate **0.128** (5/39) — the share is a strong in-sample signal that does not travel forward in time. New coef +0.9686. Third category rejection in odds. |
| G3 | + CONTROL: growth of neighbouring peer in snapshot order (on final) | 0.189645 | 0.188562 | 0.210293 | **NOT KEPT — must not help.** All three worsen. ✓ Clean control. |

**Final odds model = steps 1 + 1b + 2c + 4d: LOO Brier 0.188978,
10-fold 0.187834, WF 0.209304.** vs base 0.2484/0.2473/0.3523
(−24% / −24% / −41%). Peers <180d: n=66, token rate 0.258; peers <90d:
n=39. The age-boost candidates fail for the same structural reason as in
the value model: the WF training half contains no young protocols, so a
young-only feature cannot be validated forward in time.

### 3.3 Ever-rate curve (fitted p at median peer size/growth, dated)

Median ln(TVL) among peers 17.1373; growth_xs = 0:

| Age (y) | 0 | 0.25 | 0.5 | 1.0 | 1.5 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 8.0 | 10.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| p_ever | 0.2254 | 0.2573 | 0.2919 | 0.3687 | 0.4527 | 0.5396 | 0.7016 | 0.8251 | 0.9045 | **0.9500** | 0.9871 | 0.9968 |

- **Ceiling c = 0.9500** = p_ever at age 6.0 y (median size/growth).
- Undated protocol (dummy 1, age = median 1.5277 y): p = **0.8761**.
- Observed token rate by age bin (dated peers): 0–0.5 y: 25.4% (n=67);
  0.5–1 y: 38.0% (50); 1–2 y: 39.2% (125); 2–3 y: 62.9% (62); 3–4 y:
  85.7% (42); 4–6 y: 86.5% (37).

### 3.4 Calibration by age bin (fitted model vs observed, dated peers)

| Age bin | n | Observed token rate | Model mean p | Diff |
|---|---|---|---|---|
| 0–0.5 y | 67 | 0.254 | 0.226 | −0.027 |
| 0.5–1 y | 50 | 0.380 | 0.308 | −0.072 |
| 1–2 y | 125 | 0.392 | 0.466 | +0.074 |
| 2–3 y | 62 | 0.629 | 0.627 | −0.002 |
| 3–4 y | 42 | 0.857 | 0.774 | −0.083 |
| 4–6 y | 37 | 0.865 | 0.860 | −0.005 |

Max |diff| 0.083. Identical to MODEL-SPEC v9 §3.4 (same fit).

### 3.5 TWO views of the same peer record — and the primary recommendation

Definitions (per ranked row, with `p` = its fitted ever-rate from §3.1 and
`c` = 0.9500) — unchanged from MODEL-SPEC v9 §3.5:

- **View (i) EVER-RATE (primary):** `p_ever` itself.
- **View (ii) REMAINING CONDITIONAL (secondary display):**
  `p_remaining = (c − p) / (1 − p)`, clipped to [0, 1].

Measured on the 201 ranked rows (prep E2):

| | Ever-rate | Remaining conditional |
|---|---|---|
| Min / median / max / mean | 0.0782 / 0.3753 / 0.9494 / 0.4114 | 0.0121 / 0.9199 / 0.9457 / 0.8871 |
| Share of rows > 0.5 | 31.3% | 98.5% |
| Spearman vs age | +0.853 | −0.853 |
| Spearman(ever, remaining) | **−1.000** (exactly opposite ranking, by construction) | |

**Recommendation: PRIMARY = ever-rate (view i); SECONDARY = remaining
conditional (view ii), shown alongside per row.** Reasons as in MODEL-SPEC
v9 §3.5: the ever-rate is the quantity actually TESTED held-out (LOO Brier
0.188978 vs base 0.2484); the two views rank rows in exactly opposite order
(Spearman −1.000), so only one can drive the ranking; using the
remaining-conditional as the implied-value multiplier would collapse the
value spread (median 0.9199, 98.5% above 0.5).

**Implied value uses the EVER-RATE ONLY:**
`implied_value = V_launch × p_ever`. Never multiply by `p_remaining`.

---

## 4. Intervals — bootstrap bands and held-out coverage

### 4.1 Construction (what the builder prints)

The printed band is a **PREDICTIVE band**, not a refit-only band. Same
construction as MODEL-SPEC v9 §4.1, rebuilt here for the V2 model (which
is the radar-7 formula — the numbers reproduce v9 exactly):

- Refit spread: 200 bootstrap refits of the value model (§2.1). Pooled
  log10 deviations (refit prediction − full-fit prediction) have SD **0.1495**,
  Q10 −0.1881, Q25 −0.0980, Q75 +0.0976, Q90 +0.1836.
- Residual scatter: LOO residuals (log10) have SD **0.8668**, Q10 −0.9961,
  Q25 −0.5558, Q75 +0.4568, Q90 +1.0908. (WF residuals: SD 0.9196,
  Q25 −0.4587, Q75 +0.2935.)
- Combined predictive deviation = refit deviation + LOO residual (Monte
  Carlo, 200,000 draws, seed 99). Log10 quantiles:

| Quantile | Q10 | Q25 | Q75 | Q90 |
|---|---|---|---|---|
| log10 deviation | −1.0106 | −0.5217 | +0.4707 | +1.1239 |
| Multiplier | ×0.0976 | **×0.3008** | **×2.9561** | ×13.3003 |

- **Per-row band:** `P25 = implied × 0.3008`, `P75 = implied × 2.9561`,
  `P10 = implied × 0.0976`, `P90 = implied × 13.3003`. (Same multipliers for
  every row — the band is homoscedastic in log space by construction.)
- **Rank ranges** come from the 200 bootstrap refits ONLY (value model
  refit, odds fixed): re-rank all 201 rows per refit, take P10–P90 of each
  row's rank. Examples: #1 Sentora Curator 1–7; #10 Hive Protocol 6–12;
  #100 Plasma Saving Vaults 81–109 (v9 #100 was Vesu 66–113 on the
  198-row set; the 201-row set shifts mid-table rank ranges). The builder
  computes all 201.

### 4.2 Held-out coverage — reported honestly, including the bad news

| Band | Test | Inside P25–P75 (stated 50%) | Inside P10–P90 (stated 80%) |
|---|---|---|---|
| **Refit-only** (bootstrap spread only) | LOO (92) | **14.1% (13/92)** | **26.1% (24/92)** |
| **Refit-only** | WF (35) | **11.4% (4/35)** | **22.9% (8/35)** |
| **Predictive** (refit + residuals, §4.1) | LOO (92) | **50.0% (46/92)** | **82.6% (76/92)** |
| **Predictive** | WF (35) | **57.1% (20/35)** | **82.9% (29/35)** |
| **Predictive, honest WF check** (band quantiles built from older-half LOO residuals only, then applied to newer) | WF (35) | **57.1% (20/35)** | **65.7% (23/35)** |

- The honest-WF band multipliers (older-half residuals only) are
  P25–P75 ×0.3358–×2.5845, P10–P90 ×0.1724–×7.3789.
- **Do NOT print refit-only bands as row bands.** They hold only ~14%/26%.
- **Print the predictive bands** (§4.1) and report the coverage table above
  on the board, including the honest-WF line: the P10–P90 band is UNDER its
  stated 80% on the honest walk-forward check (65.7%, 23/35). **The
  BOUNTY-PROFILE proxy target (honest-WF P10–P90 ≥ 71.4%) is NOT met** —
  same as radar-7 (65.7%). Do not inflate the band after the fact to hit
  a target (that would be fitting the band to the test set).

---

## 5. Ranking — the 201 rows

- **Definition:** `implied_value = V_launch (§2.1) × p_ever (§3.1)`,
  rounded to whole dollars. Rows sorted descending by implied value.
- **Per-row components (exported for the breakdown bar — V2 design item 5,
  implemented on the radar-7 formula since no V2 component was kept):**
  `excess` (capped growth excess), `tvl_fwd`, `chains_factor`
  (= 10^(−0.07367333346996185 × ln(n_chains))), `launch_value`, `odds`,
  `implied`, `p10/p25/p75/p90` (from §4.1), `rank_p10/rank_p90`
  (bootstrap rank range). All in `analysis/ranking_v2.json`.
- **Totals (recompute and check in the builder — the build sums the rounded
  whole-dollar row values; the analyst sums below are unrounded, so expect
  a few dollars of gap as in v9):**
  - Total implied value: **$887,133,819**
  - Total launch value (if all launched): **$1,972,517,968**
  - Total TVL of ranked rows: **$20,769,092,766**
  - Median implied: **$3,260,130**; P90: **$9,115,400** (linear
    interpolation); max **$25,058,273** (Sentora Curator); min **$387,934**
    (Mezzanine). All 201 implied values are positive whole dollars (min
    $387,934 — no gate problem; no floor was applied).
  - vs radar-7 (198 rows): implied +$6,138,599, launch +$19,630,278, TVL
    +$61,593,501 — exactly the 3 prep-kept rows (Rysk $3,580,983 /
    Privacy Pools $1,845,680 / Metric $711,935 implied).
- **Checks (must all pass in the builder):** 201 rows; watchlist 40/40;
  ranks 1–201 in order; values never rise; totals equal the sums above
  (recomputed from `board.json`, not copied from this file).
- Null `change_7d` among ranked: 2 (Estate Protocol, Swan DAO) → excess 0.

### Top 10 rows (exact; the builder's table must match these — unchanged from radar-7)

| Rank | Protocol | TVL ($) | Odds | Launch value ($) | Implied ($) | Tier |
|---|---|---|---|---|---|---|
| 1 | Sentora Curator | 2,757,585,593 | 0.5810 | 43,132,939 | 25,058,273 | Off-list |
| 2 | Steakhouse Financial | 2,753,981,495 | 0.6782 | 35,739,859 | 24,238,197 | Watchlist |
| 3 | Polymarket International | 320,193,439 | 0.9339 | 23,891,212 | 22,311,678 | Off-list |
| 4 | USDD | 1,055,793,606 | 0.6583 | 30,939,895 | 20,366,579 | Watchlist |
| 5 | Veda | 1,563,415,482 | 0.7284 | 27,426,597 | 19,976,820 | Watchlist |
| 6 | Lightning Network | 217,862,346 | 0.9270 | 19,976,137 | 18,517,079 | Watchlist |
| 7 | Gauntlet | 1,577,685,462 | 0.5820 | 28,551,771 | 16,615,811 | Watchlist |
| 8 | Symbiotic | 253,923,299 | 0.7586 | 21,012,057 | 15,939,261 | Watchlist |
| 9 | Defi Saver Asset Management | 276,366,296 | 0.9494 | 16,627,463 | 15,785,604 | Off-list |
| 10 | Hive Protocol | 198,776,765 | 0.7489 | 19,292,945 | 14,448,889 | Watchlist |

(Bottom 3: #199 Metric V1 $711,935; #200 Monolith Market $664,732;
#201 Mezzanine $387,934. The 3 prep-kept rows: Rysk V12 #87 $3,580,983,
odds 0.4331; Privacy Pools V1 #142 $1,845,680, odds 0.3714; Metric V1
#199 $711,935, odds 0.1114.)

---

## 6. Farm verdicts — deposit-sized plans

### 6.1 Verdict rule (exact, as specified for this analysis — unchanged from MODEL-SPEC v9 §6.1)

```
drop   = implied_value × 0.07 × D / TVL_usd        # 7% drop share
tbill  = D × 0.04 × 12/52                          # 4% T-bill, 12-week horizon
fees   = 8 × gas(first_chain) + (1.00 if len(chains) > 1 else 0)
net    = drop − fees − tbill
net/h  = net / 3.5                                 # 3.5 h hands-on per plan
FARM      iff net > 0 AND net/h ≥ 25 − 1e-9        # 1e-9 float tolerance is REQUIRED
MARGINAL  iff net > 0 AND net/h < 25 − 1e-9
SKIP      iff net ≤ 0
```

Fee table (gas per transaction, first chain only, 8 transactions per plan,
one $1.00 bridge leg if multi-chain): Ethereum $0.80; Binance $0.05; Base,
Arbitrum, Optimism, Avalanche $0.02; Solana, Polygon, Sui $0.01; Bitcoin
$1.00; any other chain $0.10. Resulting fees across the 201 rows:
$0.08–$9.00. First-chain distribution: Ethereum 59, Solana 21, Binance 11,
Base 9, Hyperliquid L1 9, Bitcoin 7, Monad 7, Arbitrum 7, Stellar 7, Flare 4,
Polygon 3, Ink 3, others fewer. Multi-chain rows: 88.

**Break-even odds (per row, per deposit):**
`odds_be = (fees + tbill) / (V_launch × 0.07 × D / TVL)`.

**Pays-from ticket / break-even deposit (Size-up framing):** smallest
deposit `D` with net ≥ $87.50 (the FARM threshold at 3.5 h):
`D_farm = (87.50 + fees) / (implied×0.07/TVL − 0.04×12/52)`,
finite only if `implied×0.07/TVL > 0.00923077` (else FARM is impossible at
any deposit). Also `D_net0 = fees / (implied×0.07/TVL − 0.00923077)`
(smallest deposit with net > 0). `D_farm` is the per-row Size-up number:
"how big a deposit makes this row pay $25/h". Full per-row values in
`analysis/farm_v2.json`.

### 6.2 Counts — what the data says (do NOT tune the rule to change these)

| Deposit | FARM | MARGINAL | SKIP |
|---|---|---|---|
| **$1,000** | **0** | **55** | **146** |
| **$10,000** | **20** | **61** | **120** |
| Per-row deposit (smallest D paying costs + $25/h, cap $25,000 — kevin's rule) | **43** | **41** | **117** |

- At $1,000 the best row nets **+$36.03** (Katana DEX, $10.29/h) — nobody
  clears $25/h. Max net/h at $1k is $10.29. Top 5 by net/h at $1k: Katana
  DEX +$36.03, MetalX Swap +$33.25, Kava Mint +$26.08, Abstract +$23.22,
  FstSwap +$22.39 (all MARGINAL). Identical to radar-7.
- At $10,000 the 20 FARM rows net $90.99–$367.47; best net/h Katana DEX
  $104.99/h, MetalX Swap $97.07/h, Abstract $82.79/h, Set Protocol $77.83/h,
  Kava Mint $76.57/h. Identical 20 rows to radar-7 (full list in
  `analysis/farm_v2.json`).
- Pays-from ticket (FARM threshold): finite for **85/201** rows; min $2,398,
  P25 $11,648, median **$24,587**, P75 $62,535, max $1,590,229. Rows with
  D_farm ≤ $25,000: 43; ≤ $10,000: 20; ≤ $1,000: **0** (consistent with
  FARM 0 at $1k). **116 rows can NEVER farm at any deposit**
  (drop-per-dollar ≤ T-bill rate — a bigger deposit never helps).
- Pays-from ticket (net>0 threshold): finite 85/201, median $299,
  84 rows ≤ $25,000.
- Break-even odds at $1k: median 0.511, P10 0.206, P90 2.165; 55/201 rows
  have `odds_be ≤ model odds`. At $10k: 81/201.
- **Watchlist rows: 0 FARM at $1k, $10k, AND per-row deposit; 1 MARGINAL,
  39 SKIP at every deposit.** No watchlist row farms under any deposit rule
  in this model. **The BOUNTY-PROFILE proxy target (farm watchlist FARM ≥ 3
  via the Size-up framing) is NOT met by the honest rule** — Size-up
  reframes the verdict as a deposit size (`D_farm`), it does not change the
  verdict rule, and no watchlist row's `D_farm` is finite-and-≤$25k. Do not
  retune hours/fees/share to manufacture watchlist FARM rows.
- The 3 prep-kept rows: Privacy Pools V1 is FARM at per-row deposit
  ($15,984 — the +1 vs radar-7's 42); Rysk V12 SKIP (never farms);
  Metric V1 SKIP (never farms).

### 6.3 Farm books (filtered-view aggregates)

- **$10,000 FARM view (20 rows):** capital at work $200,000; fees $26.36;
  T-bill forgone $1,846.15; hours 70.0; slices if all launch $5,568.98;
  net $3,696.46; book break-even **1 in 3.0**
  (= Σdrops / Σ(fees+tbill) = 5,568.98 / 1,872.51). Identical to radar-7.
- **Per-row-deposit FARM view (43 rows):** capital at work $529,389; fees
  $71.12; T-bill forgone $4,886.67; hours 150.5; slices if all launch
  $8,720.29; net $3,762.50 (= 43 × $87.50 by construction); book break-even
  **1 in 1.8** (= 8,720.29 / 4,957.79).
- FARM deposit range (per-row): $2,398–$24,587, median $11,648.

### 6.4 The FARM-0-at-$1k finding — and the board mechanism

Same finding as radar-7: under the specified rule, **FARM = 0 at $1,000**
(the largest modelled drop at $1k is $46.06 against $87.50 needed). The
rule was NOT retuned. Board mechanism (same as MODEL-SPEC v9 §6.4, plus
the V2 Size-up framing): use **per-row deposit sizing as the board's
verdict mechanism** — deposit = smallest D paying costs and $25/h, capped
at $25,000 (kevin's rule, adapted) — which yields FARM 43 / MARGINAL 41 /
SKIP 117, with the fixed-$1,000 and fixed-$10,000 counts (0/55/146 and
20/61/120) printed on the board as controls. The deposit toggle
($1,000 / $10,000) stays as a what-if control that re-prices every verdict
in place. In addition, print **`D_farm` per row** (the Size-up number from
§6.1) so the board answers "how big" instead of only "yes/no".

---

## 7. What could NOT be determined from the snapshot (do not invent)

1. **Own-token share** (europa-nova #19's multiplier). No
   allocation/vesting/insider data in the snapshot. **REJECTED — do not use.**
2. **Token launch dates / hazards.** Only protocol `listed_at`, not token
   launch dates. The odds model is a cross-sectional ever-rate, not a hazard.
3. **Category effects with statistical confidence.** Now rejected THREE
   times (radar-7 ridge k=16/k=64; V2 coarse3/allocator/Dexs-Lending, §2.2).
   The one literal both-tests pass (RC-vs-rest) is a one-protocol artifact
   (§2.2, V3f). With 92 comps spread over ~28 categories, most categories
   have 1–3 comps; no shrinkage level rescues that.
4. **Age effect on price.** Age improves LOO (×3.22→×3.07 for log-age;
   ×3.22→×3.10 for lin-boost+dummy) but never lowers walk-forward — and
   cannot: the WF training half contains ZERO protocols <180d, so a
   young-only effect is structurally unidentifiable forward in time. The
   three young comps price BELOW the curve (negative residuals). (Age IS
   in the odds model, where it passes all three tests decisively.)
5. **Percentile reference set.** Four references were tried (train comps,
   eligible-201, pre-token-342, all-758); no percentile form wins both
   tests robustly. The one nominal pass (momentum percentile vs
   pre-token-342) fails sign stability, subset consistency, 5-fold, and
   bootstrap (§2.2, V1f). There is no snapshot-grounded reason to prefer
   one reference over another.
6. **log(chains) premium.** The data says the opposite: the coefficient is
   NEGATIVE (−0.0737, <0 in 83.5% of bootstrap refits) — more chains is a
   small price DISCOUNT in this comp set. The V2 design's "premium" is
   wrong-signed; the radar-7 term is kept as fitted.
7. **The 20 off-list protocols' reason for not being on the house watchlist.**
   Not derivable from snapshot fields. Label only.
8. **Fees/hours beyond the stated assumptions.** Gas prices, transaction
   counts (8), bridge legs ($1.00), and hours (3.5) are stated assumptions
   in §6.1, not snapshot facts. The builder prints them as assumptions.
9. **Why 15 protocols have `mcap_usd` exactly 0** (vs null). Treated as
   "no usable cap" (not comps, not ranked unless all three token fields
   are null — check per protocol; the 15 zero-mcap protocols record a token
   by symbol/gecko and are therefore peers-with-token, not ranked).

---

## 8. Builder implementation checklist

1. **Constants (hardcode exactly as written; do not re-derive by a different
   definition):** `AS_OF = 2026-11-14`; `MED_CHANGE_7D = -0.0823335`
   (median of the 754 non-null `change_7d` values, as a fraction);
   `MED_AGE_PEERS = 1.5277207392197125` (median age of the 383 dated peers,
   kit E2); growth cap `±0.25` (both models); `CEILING_C = 0.9500`.
2. **Sets:** implement E1, E3, E4 exactly as §1.1. **E2 has two rules:**
   ranked set uses **E2-prep** (`\s+(V2|V3)\s*$`); the value/odds FITS use
   **E2-kit** (`\s+(V\d+(\.\d+)?|\d+\.\d+)\s*$`). Verify: peers (kit) 442,
   comps 92, ranked (prep) 201, ledger (prep) 758, watchlist 40/40,
   off-list 20, early 141. (Note: `Cross Chain Bridge` and `Staking Pool`
   are KEPT as peers.)
3. **Value:** §2.1 formula. `change_7d` null → excess 0. `n_chains =
   len(chains)`. No age term, no category term, no percentile term.
   **Chains factor is 10^(coef × ln(n_chains))** — the coefficient lives
   in log10 space; do NOT use e^term (that gives 0.9029 for 4 chains
   instead of the correct 0.7904 — caught in FASE 2 review).
4. **Odds:** §3.1 formula, fitted on kit peers (442). Undated → age =
   `MED_AGE_PEERS`, dummy = 1. `change_7d` null → excess 0. Growth capped
   ±0.25 **before** multiplying by −3.503363706437129.
5. **Implied:** `round(V_launch × p_ever)` to whole dollars. Must be ≥ 1
   for all 201 (min observed $387,934).
6. **Bands:** §4.1 multipliers (same for every row). Rank ranges from 200
   bootstrap refits of the value model (odds fixed); use a fixed seed so
   the two required runs are byte-identical.
7. **Farm:** §6.1 rule, fee table, 3.5 h, `net/h ≥ 25 − 1e-9` (float
   tolerance — do not use a bare `>= 25`). Board deposit: per-row sized
   (§6.4) with $1,000/$10,000 toggles re-pricing verdicts. Print `D_farm`
   per row (Size-up framing).
8. **Per-row components:** export `excess`, `tvl_fwd`, `chains_factor`,
   `launch_value`, `odds`, `implied`, `p10/p25/p75/p90`, `rank_p10/rank_p90`,
   farm verdicts at $1k/$10k/per-row, `d_farm` (§5). These are the V2
   breakdown-bar inputs — computed from the §2.1/§3.1 formulas, not from
   any V2 component (none was kept).
9. **Transparency panel (V2, presentational — no model change):** print
   "72 excluded by house rule, 20 eligible but off-list" (NOT "92
   excluded"); per-protocol exclusion reason codes (E1 category / E2
   version / E3 wrapped-staked); the "above floor, off-list" section (the
   20, §1.4); and the E2 note: ranked set uses prep E2 (keeps Metric V1,
   Privacy Pools V1, Rysk V12), fits use kit E2 (§1.6).
10. **Checks to print on the cover:** rows recomputed = board.json; ranks
    1–201 in order; values never rise; totals equal ($887,133,819 implied,
    recomputed from rounded rows); watchlist 40/40; ledger 758/758;
    0 protocol names in the code (the model uses only snapshot fields —
    no hardcoded names anywhere).
11. **Determinism:** two runs must write identical bytes. No
    `Date.now()`, no unseeded randomness (bootstrap uses fixed seeds).
12. **Do NOT:** add a percentile term, an age-boost term, a category/family
    multiplier, a chains premium, an own-token share, an uncapped growth
    term, or refit-only bands as row bands. Each was tested and rejected,
    with the numbers in §2.2/§3.2/§4.2 — including the two literal
    both-tests passes (V1f, V3f/V3g) that fail on robustness/mechanism.

---

## 9. Headline numbers (for the parent report)

- **GO/NO-GO: NO-GO for building V2 as a new model.** No V2 value term
  beats radar-7 on both tests defensibly; the full V2 design formula scores
  LOO ×3.2903 (worse than radar-7 ×3.2194). The shippable V2 model IS
  radar-7's formulas on a 201-row ranked set. Still worth building
  (presentational): transparency panel (72/20), off-list section, Size-up
  `D_farm` framing, per-row component breakdown, honest coverage on cover.
- Sets: comps **92** (from mcap>0 = **128**). Peers **442 kit / 466 prep**.
  Ranked **201 prep** (40 + 20 + 141) vs 198 kit. Ledger 758/758 both ways.
- Value model: `log10(V) = 4.151591 + 0.378031·log10(TVL_fwd) − 0.073673·ln(chains)`.
  **LOO ×3.2194, WF ×2.0668, 5-fold ×3.0188** vs flat ×4.65 / ×4.52 / ×4.88.
  Rejected: percentiles (all forms — best LOO win still fails WF by
  +0.3), age boost (young n=3, all below curve; WF structurally
  unidentifiable; exp form WF ×5.5×10¹⁸), category multiples (coarse3
  fails WF; RC-vs-rest literal pass is a one-protocol intercept-shift
  artifact), chains premium (wrong-signed: −0.0737, discount).
- Odds model: logit with age + undated dummy + lnTVL + capped growth.
  **Brier LOO 0.188978, 10-fold 0.187834, WF 0.209304** vs base
  0.2484 / 0.2473 / 0.3523. Rejected: age-boost lin (WF exact tie),
  age-boost exp (WF 0.4091 catastrophic), chains (LOO worse), coarse
  category share (WF 0.2787 catastrophic).
- E2: prep peers **466, not 445** (brief's number missed the 21
  token-recorded versioned sub-products). Common-row fit difference is
  immaterial (LOO −0.0040, WF +0.0010). Decision: ranked prep (201),
  fits kit (442/92).
- Intervals: predictive bands ×0.3008–×2.9561 (P25–P75), ×0.0976–×13.3003
  (P10–P90). Coverage LOO 50.0%/82.6%, WF 57.1%/82.9%, honest WF
  57.1%/65.7% (P10–P90 under 80% — admitted; 71.4% proxy target NOT met).
  Refit-only bands hold only 14%/26% — never print them as row bands.
- Odds views: ever-rate primary (median 0.3753 on ranked 201), remaining
  conditional secondary (median 0.9199); they rank in exactly opposite
  order (Spearman −1.000). Ceiling c = 0.9500.
- Ranking: total implied **$887,133,819**; #1 Sentora Curator $25,058,273;
  #2 Steakhouse $24,238,197; #3 Polymarket International $22,311,678.
  Top 10 unchanged from radar-7. Prep-only rows: Rysk V12 #87 $3,580,983;
  Privacy Pools V1 #142 $1,845,680; Metric V1 #199 $711,935.
- Farm (specified rule, 201 rows): **$1k: FARM 0 / MARGINAL 55 / SKIP 146**;
  **$10k: FARM 20 / MARGINAL 61 / SKIP 120**; per-row deposit (cap $25k):
  FARM 43 / MARGINAL 41 / SKIP 117. No watchlist row farms at any deposit
  (watchlist-FARM ≥ 3 proxy target NOT met). `D_farm` finite 85/201,
  median $24,587; 116 rows can never farm. Per-row FARM book: capital
  $529,389, net $3,762.50, break-even 1 in 1.8. $10k FARM book identical
  to radar-7: net $3,696.46, 1 in 3.0.
- Control: neighbour-growth hurts WF badly on both value bases
  (×2.54 / ×2.50 vs ×2.07) and worsens all three odds tests. Clean.
- Blockers for the builder: none in the model. The growth cap (§3.1), the
  float tolerance (§6.1), the chains-factor base-10 trap (§8 item 3), and
  the dual-E2 rule (§8 item 2) are the details most likely to be missed;
  all are called out above.

---

## What changed vs radar-7, and why (one paragraph)

Nothing in the fitted model changed, because nothing in the user's V2 design
survived testing: the percentile value components lose on walk-forward by
~0.3–0.4× in every form (percentile ranks computed on older comps do not
transfer forward in time); the age boost cannot be validated at all (only 3
young comps exist, all in the walk-forward test half, and all three price
below the size curve); the data-based category multiple rests on a single
Risk Curators comp and its apparent win is a global intercept shift, not a
category effect; and log(chains) is a small discount in the data, not the
premium the design assumed. What DID change is the ranked set (198 → 201
rows under the user's prep E2, adding Metric V1, Privacy Pools V1, Rysk
V12), the farm book (+1 FARM row, Privacy Pools V1 at a $15,984
break-even deposit), and the presentational surface the builder is asked
for: a transparency panel with the corrected 72-excluded/20-off-list
numbers, an off-list section, per-row component exports, and a Size-up
break-even deposit on every row — all computed from the radar-7 formulas,
which remain the best-tested model on this snapshot.
