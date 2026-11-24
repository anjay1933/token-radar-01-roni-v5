# MODEL-SPEC.md — token-radar-01 radar-9 (roni-rockabilly) — FASE 2

**Purpose:** every number the builder needs to implement `main.ts` WITHOUT re-fitting.
All numbers below were computed from the kit snapshot only
(`snapshot.json`, 758 protocols, `as_of` 2026-11-14, floor $50,000,000, 40 watchlist).
The fitted values are carried over from radar-7 (our own prior entry, same
snapshot, same analysis scripts); radar-9 V1 reproduces them exactly before
any new experiment — see V1-REPORT.md for the reproduction check. Nothing in
this file is copied from another entry (all top-10 repos are
`source_withheld`; only their public titles/scores/screenshots were studied).
Analysis scripts (NOT entry code, never bundle): `analysis/sets.py`,
`analysis/explore_sets.py`, `analysis/explore_variants.py`,
`analysis/verify_sets.py`, `analysis/fit_value.py`, `analysis/fit_value2.py`,
`analysis/fit_value3.py`, `analysis/fit_value4.py`, `analysis/fit_odds.py`,
`analysis/fit_odds2.py`, `analysis/fit_odds3.py`, `analysis/fit_odds4.py`,
`analysis/fit_intervals_rank.py`, `analysis/fit_farm.py`,
`analysis/fit_farm_book.py`. Keyed results in `analysis/*.json`.

**How to read the verdicts:** a term is KEPT only if it lowers the miss/Brier on
BOTH deciding tests (value: LOO **and** walk-forward; odds: LOO **and** 10-fold
**and** walk-forward). "Lowers" means strictly lower, however small — borderline
cases are flagged as such rather than rounded into a win. The 5-fold-by-size
split is a third check, reported but not deciding.

**Built-vs-analyst note (read first).** Two numbers in this spec differ
between the analyst's tables and the built `board.json`/`data.js`, both
traced and harmless:
- **Totals (§5):** the analyst's tables say total implied **$880,995,220**
  and total launch **$1,952,887,690**; the build sums the rounded
  whole-dollar row values and measures **$880,995,215** and
  **$1,952,887,686**. The build is the authority; the $5/$4 gaps are the
  analyst summing unrounded values. V1 reproduces the built totals exactly.
- **Odds 10-fold Brier (§3.2):** the analyst's table says the final model
  scores 10-fold **0.187834**; the built 10-fold split (seed 11, as
  implemented in `lib/model.ts`) measures **0.1868**, and every odds row's
  built 10-fold value runs ~0.0005–0.001 below the analyst's table. LOO and
  WF columns match the analyst exactly, and every keep/drop verdict is
  identical. The dashboard prints the built values.

---

## 0. Verified snapshot counts — and two corrections to the brief

| Count | Value |
|---|---|
| Protocols | 758 |
| Watchlist | 40 (all present in `protocols`, all TVL ≥ $50M) |
| Record no token at all (mcap + gecko_id + symbol all null) | 342 |
| Record a token (symbol present) | 416 |
| `mcap_usd > 0` | **128 — NOT 129.** The brief/RULES.md say 129; the snapshot has 144 non-null `mcap_usd`, of which **15 are exactly 0**. Verified twice. All downstream counts use 128. |
| `gecko_id` present | 158 |
| No `listed_at` | 113 |
| Null `change_7d` | 4 |
| Null `category` | 0 |
| Top categories | Dexs 99, Liquid Staking 78, Lending 75, CEX 56, Bridge 55, Risk Curators 39, Yield 39, RWA 33 |
| Market median `change_7d` (754 non-null, as a fraction) | **−0.0823335** (middle two values −0.082467, −0.082200). The top-10's "market −8.2%" is this number. |
| Snapshot date (`AS_OF`) | 2026-11-14. Ages are `(2026-11-14 − listed_at) / 365.25` in years. |

---

## 1. Sets — comp set, peer set, ranked set, ledger

### 1.1 Exclusion rules (snapshot fields only)

A protocol is a **peer** (stand-alone) unless ANY of these holds:

- **E1 — category** in `{Bridge, Canonical Bridge, CEX, Liquid Staking,
  Liquid Restaking, Restaked BTC}`. These are exactly the house watchlist's
  own exclusion categories (RULES.md), plus CEX. Note `Cross Chain Bridge`
  and `Staking Pool` are NOT excluded — the house rule does not exclude them.
- **E2 — versioned name:** name ends with a version marker, regex
  `\s+(V\d+(\.\d+)?|\d+\.\d+)\s*$` (case-insensitive). Matches `V1/V2/V3/V4/
  V12/V2.1/2.0`. Does NOT match `Project 0` (bare `0` with no `V` and no
  decimal point is a name, not a version — `Project 0` is ranked by kiencx
  and is kept here too).
- **E3 — wrapped/staked name:** name contains a whole word `wrapped`,
  `staked`, or `staking` (regex `\b(wrapped|staked|staking)\b`, case-insensitive).
- **E4 — exchange-named:** name starts with `binance|coinbase|bybit|
  bitfinex|robinhood|kraken|okx|bitget|kucoin|huobi|gemini|bitstamp`.
  (Removes 0 additional protocols after E1–E3; kept as a stated rule.)

This rule set was **verified by reproduction**: it yields exactly kiencx's and
behzad's published counts (442 peers / 244 token / 198 ranked / 92 comps) and
the 40/20/138 ranked split. The nearest alternatives do not reproduce them
(E1 with `Staking Pool` added → 429 peers; broad versioned regex also dropping
`Project 0` → 441 peers).

### 1.2 Comp set (traded comps for the value model) — n = 92

Start: `mcap_usd > 0` = **128**. Sequential exclusions (a protocol removed by
an earlier rule is not counted again). Note the category set here is the
house set from §1.1: `Cross Chain Bridge` (4 comps: Across, Hyperlane,
Symbiosis, Synapse) and `Staking Pool` (2 comps: Obol, SSV Network) are
**kept** — the house watchlist rule excludes `Bridge`/`Canonical Bridge`
but not `Cross Chain Bridge`, and `Liquid Staking`/`Liquid Restaking`/
`Restaked BTC` but not `Staking Pool`:

| Step | Rule | Removes | Remaining |
|---|---|---|---|
| 0 | `mcap_usd > 0` | — | 128 |
| 1 | Category in `{Bridge, Canonical Bridge}` | 14 | 114 |
| 2 | Category `CEX` | 9 | 105 |
| 3 | Category in `{Liquid Staking, Liquid Restaking, Restaked BTC}` | 11 | 94 |
| 4 | E2 versioned (`Aave V2`) | 1 | 93 |
| 5 | E3 wrapped/staked (`Astar dApps Staking`) | 1 | **92** |
| 6 | E4 exchange-named | 0 | **92** |

**Comp set = 92 traded tokens.** Dated 70, undated 22. Median age of dated
comps 2.342231348391513 y. `change_7d` null among comps: 0.
`mcap/TVL` ratio: median 0.2460, range 0.00129 (Concentrator) – 400.2 (Rain).
This matches the modal top-10 comp size (92: kevin, nyx77, meena1321,
swift-orca, behzad, rstrike, brisk-kestrel) and behzad's exact validation
split (see §2.2).

### 1.3 Peer set (token-odds fit) — n = 442

Peers = all protocols passing E1–E4: **442**, of which **244 record a token**
(symbol present, 55.2036%) and **198 record no token**. Dated 383, undated 59.
Median age of dated peers **1.5277207392197125 y** (used for undated
imputation, §3). Token rate: dated peers 0.501, undated peers **0.881**
(52/59 — undated protocols are overwhelmingly established, token-recorded
ones; this is why the undated dummy in §3 is a real signal, not a hack).

### 1.4 Ranked set — n = 198

Ranked = peers with no token at all (`symbol`, `gecko_id`, `mcap_usd` all null):
**198 = 40 watchlist + 20 off-list + 138 early (TVL < $50M)**.
The split is derivable from snapshot fields only:

- **Watchlist 40:** `slug` in the snapshot's `watchlist` array. All 40 are
  in the peer set (verified: 0 watchlist protocols excluded).
- **Off-list 20:** peer, no token, `TVL ≥ $50,000,000`, `slug` NOT in the
  watchlist array. (Why they are not on the house watchlist is not derivable
  from the snapshot — most look like sub-products/kin of token protocols,
  e.g. Polymarket International, Figure Markets Prime/Exchange, Defi Saver
  Asset Management, CIAN Yield Layer, Mellow Core, Theo Network thUSD,
  Circle Gateway (Cross Chain Bridge). The rule "above floor, not on the
  house list" is itself clean and snapshot-only, which is what the builder
  needs. The 20 are: Sentora Curator, Polymarket International, CIAN Yield
  Layer, Defi Saver Asset Management, Mellow Core, BitFi Basis, Figure
  Markets Prime, Theo Network thUSD, Figure Markets Exchange, Extended Perps,
  Avant avUSD, Stellar DeFi Hub, Loopscale Lending, IPOR Fusion, Circle
  Gateway, Arcus Perps, USDCx, Solv Strategies, AZverse Perps, Nado Spot.)
- **Early 138:** peer, no token, `TVL < $50,000,000`.

**No fallback grouping is needed** — the 198 split (40+20+138) is cleanly
derivable, so the 192 fallback (40+19+133) does not apply. For the record,
two kin rules were tested as alternatives and neither reproduces 192:
first-word kin (no-token peer sharing its first name-word with a
token-recorded protocol) removes 7 → 191; full-name-prefix kin removes 3
(Re7 Labs, Reti Pooling, Reya Perps) → 195. Kin is therefore NOT excluded
in radar-9 (same choice as kiencx/nyx77, who rank 198).

### 1.5 Ledger — all 758 in exactly one group

| Group | Count |
|---|---|
| Ranked, records no token (peers) | 198 |
| Peer, records a token | 244 |
| Set aside — category Bridge | 55 |
| Set aside — category CEX | 56 |
| Set aside — category Canonical Bridge | 32 |
| Set aside — category Liquid Staking | 78 |
| Set aside — category Liquid Restaking | 9 |
| Set aside — category Restaked BTC | 3 |
| Set aside — versioned name (E2) | 76 |
| Set aside — wrapped/staked name (E3) | 7 |
| **Total** | **758** |

(Cross Chain Bridge and Staking Pool protocols are NOT set aside — they are
peers by the house rule; that is why the ledger's category rows sum to 233,
not 316. 198 + 244 + 233 + 76 + 7 = 758. ✓)

---

## 2. Value model — fitted launch value

### 2.1 Final formula (the ONLY value formula the builder implements)

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
- At TVL = $100M, 1 chain, no carry: V_launch = **$14.99M**
  (10^(4.151591391698986 + 0.37803061564497553×8) = 10^7.175844…).
- Fit: OLS in log10 space on the 92 comps. Residual SD (log10) **0.8393**,
  R² **0.1094** — the model explains ~11% of log-cap variance. Say so on the
  board (meena's framing: "the ranking is signal, the level is not").
- Bootstrap standard errors (200 refits, resampling the 92 comps with
  replacement; seed 20261123):

| Coefficient | Full-fit value | Bootstrap mean | Bootstrap SE | 95% interval (P2.5–P97.5) | Sign stable |
|---|---|---|---|---|---|
| Intercept | +4.151591391698986 | +4.121732 | 0.992795 | +2.424096 – +6.222700 | — |
| log10(TVL) slope | +0.37803061564497553 | +0.383232 | 0.125286 | +0.120777 – +0.621201 | >0 in 100% of refits |
| ln(chains) coef | −0.07367333346996185 | −0.078397 | 0.082900 | −0.225708 – +0.084175 | <0 in 79.5% of refits |

The chains coefficient is weak (SE larger than the estimate; sign flips in
20.5% of refits). It is kept only because it passes the both-tests rule
(§2.2) — the spec flags this openly; FASE 3 may revisit it, but the builder
implements the formula as written.

### 2.2 Keep/drop table — terms added ONE AT A TIME, in order

Miss = median miss as a multiplier: 10^median|log10(pred/actual)|.
"≤3×" = share of priced tokens within 3× of the real cap.
Flat baseline = one median `mcap/TVL` ratio (LOO: leave-one-out median;
WF: older-half median applied to newer; 5F: fold-wise median).

**Splits (all honest refits inside every fold):**
- **LOO:** leave-one-out over all 92 comps.
- **Walk-forward:** fit on the 35 comps listed before **2024-07-15**
  (the median listed date), price the 35 listed on/after it; 22 undated
  comps excluded from WF (same split as behzad: 35/35/22).
- **5-fold-by-size:** comps sorted by TVL, dealt round-robin into 5 folds,
  each fold priced by a fit on the other four.

| # | Model (cumulative, in test order) | LOO miss (≤3×) | WF miss (≤3×) | 5-fold miss (≤3×) | Verdict |
|---|---|---|---|---|---|
| — | **Flat multiple baseline** | **×4.65 (38%)** | **×4.52 (37%)** | **×4.88 (37%)** | baseline |
| 0 | Size curve only | ×3.2693 (45.7%) | ×2.1057 (57.1%) | ×3.2022 (45.7%) | **BASE** |
| 1a | + category effect, ridge k=16 | ×3.51 (47%) | ×2.11 (57%) | ×3.44 (45%) | **NOT KEPT** — LOO worse, WF unchanged |
| 1b | + category effect, ridge k=64 | ×3.24 (48%) | ×2.11 (57%) | ×3.18 (46%) | **NOT KEPT** — WF unchanged (not lowered); LOO gain only 0.03 |
| 1c | + family effect (first word of category), ridge k=16 / k=64 | ×3.51 / ×3.24 | ×2.11 / ×2.11 | ×3.44 / ×3.18 | **NOT KEPT** — identical to category on this comp set |
| 2 | + growth carry, excess capped ±25% (on base) | ×3.2224 (46.7%) | ×2.0924 (57.1%) | ×3.2653 (46.7%) | **KEPT** — LOO and WF both improve, but THIN (LOO −0.047, WF −0.013); 5-fold worsens 3.20→3.27 — flagged |
| 3 | + age, log10(1+age_years) (on base+growth) | ×3.0737 (48.9%) | ×2.1943 (57.1%) | ×3.2265 (47.8%) | **NOT KEPT** — LOO improves a lot but WF worsens 2.09→2.19 |
| 3b | + age + undated dummy (median-age imputation 2.3422 y) | ×3.00 (51%) | ×2.19 (57%) | ×3.33 (47%) | **NOT KEPT** — WF worsens |
| 4 | + chain count, ln(n_chains) (on base+growth) | ×3.2194 (48.9%) | ×2.0668 (57.1%) | ×3.0188 (50.0%) | **KEPT** — LOO −0.003 (a tie within noise; the keep rests on WF −0.026 and 5-fold −0.247), WF and 5-fold both improve |
| 5 | + CONTROL: growth of neighbouring row in snapshot order (on base+growth) | ×3.35 (45%) | ×2.54 (60%) | ×3.13 (48%) | **NOT KEPT — must not help.** Hurts LOO and WF. (5-fold improves; the deciding tests both fail.) |
| 5b | + CONTROL (on final base+growth+chains) | ×3.12 (48%) | ×2.50 (60%) | ×3.17 (48%) | **NOT KEPT.** LOO improves (+0.10) but WF worsens badly (2.07→2.50) — the LOO gain is not trusted |

**Final model = step 0 + step 2 + step 4: LOO ×3.2194, WF ×2.0668,
5-fold ×3.0188.** (Within-3×: LOO 48.9%, WF 57.1%, 5-fold 50.0%.)

**Validation-target check (BOUNTY-PROFILE.md):** WF ≤ ×2.6 ✓ (2.07);
LOO ≤ ×3.3 ✓ (3.22); beat flat by ≥25% on both: LOO (4.65−3.22)/4.65 =
**−30.8%** ✓; WF (4.52−2.07)/4.52 = **−54.3%** ✓. The model is ready for
FASE 3 on its own numbers. Note the absolute level is still weak (median miss
3.2×) — that is the normal top-10 range (LOO 2.92–3.4×), not a defect.

**Sensitivities (reported, NOT in the final model):**
- Chains alone (on base): LOO ×3.2146 / WF ×2.0844 / 5F ×3.1221 — passes
  both tests alone, consistent with the keep.
- Age alone (on base): LOO ×3.04 / WF ×2.16 / 5F ×3.22 — fails WF alone.
- Combined {growth, age, chains}: LOO ×2.9602 / WF ×2.0269 / 5F ×3.4516 —
  beats the final model on LOO and WF but fails 5-fold badly and, decisively,
  age failed its own sequential step, so it is NOT in the final model.
  FASE 3 may revisit this combination only with a fresh justification; the
  builder implements §2.1 as written.
- Category on top of base+growth (k=64): LOO ×3.2829 / WF ×2.0924 / 5F
  ×3.3170 — worse than base+growth on LOO and 5-fold, WF unchanged. The
  category rejection is robust to ordering. (This matches swift-orca's and
  brisk-kestrel's rejection; it contradicts kiencx/nyx77/sudhan/nightshift,
  who kept a category/family effect on their comp sets. The board prints
  the rejection with its numbers either way.)

### 2.3 Worked example — Sentora Curator (#1)

- TVL $2,757,585,593; change_7d +2.3672%; chains 4 (Ethereum, Ink, Solana,
  Tempo); listed 2025-10-03 (age 1.1146 y).
- excess = 0.023672 − (−0.0823335) = **0.1060055** (within ±0.25, no clamp).
- TVL_fwd = 2,757,585,593 × 1.1060055 = $3,049,916,470.
- log10(V) = 4.151591391698986 + 0.37803061564497553 × log10(3,049,916,470)
  − 0.07367333346996185 × ln(4)
  = 4.151591391698986 + 0.37803061564497553 × 9.484349 − 0.07367333346996185 × 1.386294
  = **7.634845** → V_launch = **$43,132,939**.
- Odds 0.5810 (§3) → implied = 43,132,939 × 0.5810 = **$25,058,273**.

### 2.4 Sensitivity table (builder: compute per row from the formulas)

For Sentora Curator (launch value $43,132,939 as recorded):

| Change | Launch value | × recorded |
|---|---|---|
| TVL 30% lower | $37,692,513 | ×0.874 |
| TVL 30% higher | $47,630,699 | ×1.104 |
| 7-day change 0% (excess +0.0823) | $42,781,971 | ×0.992 |
| 7-day change +20% (excess +0.25, capped) | $45,175,830 | ×1.047 |
| Six more months, still no token (value model has no age term; odds 0.5810→0.6611, §3) | implied ×1.141 | — |

(Note: the dashboard's exact-ratio recomputation prints
$37,692,190 / $47,630,279 / $42,781,598 / $45,175,442 — ~$300 below the
table above, ratios identical to 3dp. The table dollars were computed with
an earlier fit's slope (≈0.3778 vs final 0.37803); the dashboard prints its
own exact recomputation from the final coefficients. See app.js.)

---

## 3. Token odds — fitted on the 442 peers

### 3.1 Final formula (the ONLY odds formula the builder implements)

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

- **The ±25% cap on `growth_xs` is load-bearing, not cosmetic.** The odds
  feature was first fitted UNCAPPED, and one ranked row (Shift DeFi,
  `change_7d` +4448.47%) got odds 9.4×10⁻¹⁴ and implied value $0.00 — which
  would fail the kit gate (implied value must be a positive whole). The cap
  was added, the model was REFITTED, and every keep/drop decision below was
  re-verified with the capped feature (decisions unchanged; coefficients in
  §3.1 are the capped refit). The value carry uses the same ±25% cap, so the
  board has ONE stated growth cap. Peer excess range: P95 +0.159, P99 +0.844,
  max +44.57 — the linear logit is only supported to ~±0.3, so the cap is
  also the honest range limit. 21/442 peers have |excess| > 0.25.
- Bootstrap SEs (200 refits, seed 20261123):

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
from WF by construction. Category share (when tested) = shrunk token share
per category, `(k_c + 8×base)/(n_c + 8)`, logit-transformed, computed from the
training peers only (honest inside every fold).

| # | Model (cumulative, in test order) | LOO Brier | 10-fold Brier | WF Brier | Verdict |
|---|---|---|---|---|---|
| — | **Base rate only (0.552036)** | **0.2484** | **0.2473** | **0.3523** | baseline |
| 1 | + age_years | 0.2151 | 0.2142 | 0.2203 | **KEPT** — all three improve sharply |
| 1b | + age + undated dummy | 0.1952 | 0.1942 | 0.2203 | **KEPT** — LOO −0.020, 10-fold −0.020; WF is SILENT (undated excluded from WF, so it cannot move); the dummy is real signal (undated token rate 0.881 vs dated 0.501). Same choice as behzad ("undated flagged" kept). |
| 2c | + size, ln(TVL_usd) (on age+dummy) | 0.1906 | 0.1893 | 0.2116 | **KEPT** — all three improve |
| 3c | + category share, shrunk α=8 (on age+dummy+size) | 0.1885 | 0.1874 | 0.2302 | **NOT KEPT** — LOO/10-fold improve but WF worsens 0.2116→0.2302 |
| 4d | + growth_xs, capped ±25% (on age+dummy+size) | 0.1890 | 0.1878 | 0.2093 | **KEPT** — all three improve, thinly (LOO −0.0016, 10F −0.0015, WF −0.0023) |
| 5d | + chain count, ln(n_chains) (on age+dummy+size+growth) | 0.1891 | 0.1878 | 0.2070 | **NOT KEPT** — LOO worsens 0.188978→0.189126 (by 0.00015); 10-fold ties, WF improves. Strict rule: not kept. |
| 6d | + CONTROL: growth of neighbouring peer in snapshot order (on final) | 0.1896 | 0.1886 | 0.2103 | **NOT KEPT — must not help.** All three worsen. ✓ Clean control. |

**Final odds model = steps 1 + 1b + 2c + 4d: LOO Brier 0.188978,
10-fold 0.187834 (analyst) / 0.1868 (built, seed 11 as implemented — see the
note at the top of this file), WF 0.209304.** vs base 0.2484/0.2473/0.3523
(−24% / −24% / −41%). This beats the best top-10 odds Briers on the same
tests (behzad 0.215 WF / 0.187 10-fold; kiencx 0.215 WF).

(For completeness: the non-cumulative chain without the dummy gave the same
decisions — size kept, category/growth/chains tested — and the uncapped-growth
refit gave the same keep/drop verdicts with slightly different coefficients.
Only the capped refit in §3.1 is to be implemented.)

### 3.3 Ever-rate curve (fitted p at median peer size/growth, dated)

Median ln(TVL) among peers 17.1373; growth_xs = 0:

| Age (y) | 0 | 0.25 | 0.5 | 1.0 | 1.5 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 8.0 | 10.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| p_ever | 0.2254 | 0.2573 | 0.2919 | 0.3687 | 0.4527 | 0.5396 | 0.7016 | 0.8251 | 0.9045 | **0.9500** | 0.9871 | 0.9968 |

- **Ceiling c = 0.9500** = p_ever at age 6.0 y (median size/growth). Used for
  the remaining-conditional view (§3.5).
- Undated protocol (dummy 1, age = median 1.5277 y): p = **0.8761**.
- Observed token rate by age bin (dated peers): 0–0.5 y: 25.4% (n=67);
  0.5–1 y: 38.0% (50); 1–2 y: 39.2% (125); 2–3 y: 62.9% (62); 3–4 y:
  85.7% (42); 4–6 y: 86.5% (37). The ever-rate rises monotonically with age.

### 3.4 Calibration by age bin (fitted model vs observed, dated peers)

| Age bin | n | Observed token rate | Model mean p | Diff |
|---|---|---|---|---|
| 0–0.5 y | 67 | 0.254 | 0.226 | −0.027 |
| 0.5–1 y | 50 | 0.380 | 0.308 | −0.072 |
| 1–2 y | 125 | 0.392 | 0.466 | +0.074 |
| 2–3 y | 62 | 0.629 | 0.627 | −0.002 |
| 3–4 y | 42 | 0.857 | 0.774 | −0.083 |
| 4–6 y | 37 | 0.865 | 0.860 | −0.005 |

Max |diff| 0.083. No bin is wildly off; the model is approximately calibrated
across ages.

### 3.5 TWO views of the same peer record — and the primary recommendation

Definitions (per ranked row, with `p` = its fitted ever-rate from §3.1 and
`c` = 0.9500):

- **View (i) EVER-RATE (primary):** `p_ever` itself — the probability a
  protocol like this one has (or ever will have) recorded a token, given its
  age/size/growth. Rises with age.
- **View (ii) REMAINING CONDITIONAL (secondary display):**
  `p_remaining = (c − p) / (1 − p)`, clipped to [0, 1] — of the protocols
  like this one that recorded no token by this age, the share the curve says
  record one in the end. Falls with age (behzad's formula).

Measured on the 198 ranked rows:

| | Ever-rate | Remaining conditional |
|---|---|---|
| Min / median / max / mean | 0.0782 / 0.3794 / 0.9494 / 0.4130 | 0.0125 / 0.9194 / 0.9458 / 0.8866 |
| Share of rows > 0.5 | 31.8% | 98.5% |
| Spearman vs age | +0.852 | −0.852 |
| Spearman(ever, remaining) | **−1.000** (exactly opposite ranking, by construction) | |

**Recommendation: PRIMARY = ever-rate (view i); SECONDARY = remaining
conditional (view ii), shown alongside per row. Reasons, from the data:**

1. The ever-rate is the quantity actually TESTED held-out (LOO Brier
   0.188978 vs base 0.2484). The remaining-conditional cannot be separately
   scored: its target event (a future launch) is unobserved in a single
   snapshot. It inherits the ever-rate's calibration by construction — it is
   a deterministic transform of `p` and `c`, not an independent fit.
2. The two views rank rows in EXACTLY OPPOSITE order (Spearman −1.000), so
   only one can drive the ranking. The board must label which one does.
3. Using the remaining-conditional as the implied-value multiplier would
   collapse the value spread: 98.5% of rows sit above 0.5 and the median is
   0.9194, so implied values would be ~launch values for nearly every row
   and the ranking would invert to youngest-first. The ever-rate preserves
   discrimination (median 0.3794, range 0.0782–0.9494).
4. Both views are shown so the reader sees they are the same peer record
   viewed two ways — the synthesis BOUNTY-PROFILE.md asked for — with the
   primary/secondary roles decided by the snapshot's own data, as instructed.

**Implied value uses the EVER-RATE ONLY:**
`implied_value = V_launch × p_ever`. Never multiply by `p_remaining`.

---

## 4. Intervals — bootstrap bands and held-out coverage

### 4.1 Construction (what the builder prints)

The printed band is a **PREDICTIVE band**, not a refit-only band:

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
| Multiplier | ×0.0976 | **×0.3007** | **×2.9556** | ×13.300 |

- **Per-row band:** `P25 = implied × 0.3007`, `P75 = implied × 2.9556`,
  `P10 = implied × 0.0976`, `P90 = implied × 13.300`. (Same multipliers for
  every row — the band is homoscedastic in log space by construction.)
- **Rank ranges** come from the 200 bootstrap refits ONLY (value model
  refit, odds fixed): re-rank all 198 rows per refit, take P10–P90 of each
  row's rank. Examples: #1 Sentora Curator 1–7; #10 Hive Protocol 6–12;
  #100 Vesu 66–113. The builder computes all 198.

### 4.2 Held-out coverage — reported honestly, including the bad news

| Band | Test | Inside P25–P75 (stated 50%) | Inside P10–P90 (stated 80%) |
|---|---|---|---|
| **Refit-only** (bootstrap spread only) | LOO (92) | **14.1% (13/92)** | **26.1% (24/92)** |
| **Refit-only** | WF (35) | **11.4% (4/35)** | **22.9% (8/35)** |
| **Predictive** (refit + residuals, §4.1) | LOO (92) | **50.0% (46/92)** | **82.6% (76/92)** |
| **Predictive** | WF (35) | **57.1% (20/35)** | **82.9% (29/35)** |
| **Predictive, honest WF check** (band quantiles built from older-half LOO residuals only, then applied to newer) | WF (35) | **57.1% (20/35)** | **65.7% (23/35)** |

- **Do NOT print refit-only bands as row bands.** They capture parameter
  uncertainty only (SD 0.15 dex) while the real pricing error is 0.87 dex,
  so they hold only ~14%/26% of real caps. Printing them at "50%/80%"
  would be false. This is stated here so the builder does not "fix" it by
  relabelling.
- **Print the predictive bands** (§4.1) and report the coverage table above
  on the board, including the honest-WF line: the P10–P90 band is UNDER its
  stated 80% on the honest walk-forward check (65.7%, 23/35). That is the
  nyx77 precedent — admit the miss on the board; do not inflate the band
  after the fact to hit 80% (that would be fitting the band to the test set).
- LOO coverage of the predictive band is exact by construction (the
  quantiles come from LOO residuals); the WF numbers are the honest check.

---

## 5. Ranking — the 198 rows

- **Definition:** `implied_value = V_launch (§2.1) × p_ever (§3.1)`,
  rounded to whole dollars. Rows sorted descending by implied value.
- **Totals (recompute and check in the builder — built values, see the
  note at the top of this file):**
  - Total implied value: **$880,995,215**
  - Total launch value (if all launched): **$1,952,887,686**
  - Total TVL of ranked rows: **$20,707,499,265**
  - Median implied: **$3,283,893**; P90: **$9,146,281** (linear
    interpolation);
    max **$25,058,273** (Sentora Curator); min **$387,934** (Mezzanine).
    All 198 implied values are positive whole dollars (min $387,934 — no
    gate problem; no floor was applied).
- **Checks (must all pass in the builder):** 198 rows; watchlist 40/40;
  ranks 1–198 in order; values never rise; totals equal the sums above
  (recomputed from `board.json`, not copied from this file).
- Null `change_7d` among ranked: 2 (Estate Protocol, Swan DAO) → excess 0.

### Top 10 rows (exact; the builder's table must match these)

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

(Top scale $25.1M — in line with nyx77 $27.6M / brisk-kestrel $28.4M, and
far below nightshift's $80.0M, which used a 128-comp fit with no odds
shrinkage. Bottom 3: #196 GoonFi $761,604; #197 Monolith Market $664,732;
#198 Mezzanine $387,934.)

---

## 6. Farm verdicts — deposit-sized plans

### 6.1 Verdict rule (exact, as specified for this analysis)

```
drop   = implied_value × 0.07 × D / TVL_usd        # 7% drop share
tbill  = D × 0.04 × 12/52                          # 4% T-bill, 12-week horizon
fees   = 8 × gas(first_chain) + (1.00 if len(chains) > 1 else 0)
net    = drop − fees − tbill
net/h  = net / 3.5                                 # 3.5 h hands-on per plan
FARM      iff net > 0 AND net/h ≥ 25 − 1e-9        # 1e-9 float tolerance is REQUIRED:
                                                   # at D = D_farm, net/h computes as
                                                   # 24.999999999999996 in float
MARGINAL  iff net > 0 AND net/h < 25 − 1e-9
SKIP      iff net ≤ 0
```

**Fee assumptions (stated explicitly — gas per transaction, first chain
only, 8 transactions per plan, one $1.00 bridge leg if multi-chain):**

| First chain | Gas/tx |
|---|---|
| Ethereum | $0.80 |
| Binance | $0.05 |
| Base, Arbitrum, Optimism, Avalanche | $0.02 |
| Solana, Polygon, Sui | $0.01 |
| Bitcoin | $1.00 |
| Any other chain | $0.10 |

Resulting fees across the 198 rows: $0.08–$9.00. First-chain distribution:
Ethereum 57, Solana 21, Binance 11, Base 9, Hyperliquid L1 8, Bitcoin 7,
Monad 7, Arbitrum 7, Stellar 7, Flare 4, Polygon 3, Ink 3, others fewer.
Multi-chain rows: 85.

**Break-even odds (per row, per deposit):**
`odds_be = (fees + tbill) / (V_launch × 0.07 × D / TVL)` — the odds at which
the expected drop exactly covers fees + T-bill forgone. (Uses launch value,
not implied value: the odds are the unknown being solved for.)

**Pays-from ticket (per row):** smallest deposit `D` with net ≥ $87.50
(the FARM threshold at 3.5 h):
`D_farm = (87.50 + fees) / (implied×0.07/TVL − 0.04×12/52)`,
finite only if `implied×0.07/TVL > 0.00923077` (else FARM is impossible at
any deposit). Also report `D_net0 = fees / (implied×0.07/TVL − 0.00923077)`
(smallest deposit with net > 0).

### 6.2 Counts — what the data says (do NOT tune the rule to change these)

| Deposit | FARM | MARGINAL | SKIP |
|---|---|---|---|
| **$1,000** | **0** | **55** | **143** |
| **$10,000** | **20** | **60** | **118** |
| Per-row deposit (smallest D paying costs + $25/h, cap $25,000 — kevin's rule) | **42** | **41** | **115** |

- At $1,000 the best row nets **+$36.03** (Katana DEX, $10.29/h) — nobody
  clears $25/h. Max net/h at $1k is $10.29. Top 5 by net/h at $1k: Katana
  DEX +$36.03, MetalX Swap +$33.25, Kava Mint +$26.08, Abstract +$23.22,
  FstSwap +$22.39 (all MARGINAL).
- At $10,000 the 20 FARM rows net $90.99–$367.47; best net/h Katana DEX
  $104.99/h, MetalX Swap $97.07/h, Abstract $82.79/h, Set Protocol $77.83/h,
  Kava Mint $76.57/h. (Full list of 20 with nets in `analysis/farm.json`.)
- Pays-from ticket (FARM threshold): finite for **84/198** rows; min $2,398,
  P25 $11,385, median **$25,109**, P75 $62,653, max $1,590,229. Rows with
  D_farm ≤ $25,000: 42; ≤ $10,000: 20; ≤ $1,000: **0** (consistent with
  FARM 0 at $1k). **114 rows can NEVER farm at any deposit**
  (drop-per-dollar ≤ T-bill rate — a bigger deposit never helps).
- Pays-from ticket (net>0 threshold): finite 84/198, median $286,
  83 rows ≤ $25,000.
- Break-even odds at $1k: median 0.505, P10 0.203, P90 2.201; 55/198 rows
  have `odds_be ≤ model odds`. At $10k: 80/198.
- **Watchlist rows: 0 FARM at $1k, $10k, AND per-row deposit; 1 MARGINAL,
  39 SKIP at every deposit.** No watchlist row farms under any deposit rule
  in this model — watchlist rows are large-TVL (thin slices). The board's
  FARM view will contain zero watchlist rows; that is what the data says,
  not a bug. (Top-10 precedent: kiencx's FARM list is likewise dominated by
  small rows; nightshift's watchlist $/h figures are net-IF-launch, a
  different metric that assumes the launch happens.)

### 6.3 Farm books (filtered-view aggregates)

- **$10,000 FARM view (20 rows):** capital at work $200,000; fees $26.36;
  T-bill forgone $1,846.15; hours 70.0; slices if all launch $5,568.98;
  net $3,696.46; book break-even **1 in 3.0**
  (= Σdrops / Σ(fees+tbill) = 5,568.98 / 1,872.51).
- **Per-row-deposit FARM view (42 rows):** capital at work $513,405; fees
  $63.72; T-bill forgone $4,739.12; hours 147.0; slices if all launch
  $8,477.84; net $3,675.00 (= 42 × $87.50 by construction); book break-even
  **1 in 1.8** (= 8,477.84 / 4,802.84).
- FARM deposit range (per-row): $2,398–$24,587, median $11,122.

### 6.4 The FARM-0-at-$1k finding — and the proposed adjustment

**Finding:** under the specified rule (fixed $1,000 deposit, 7% share,
12 weeks, 4% T-bill, 3.5 h, $25/h), **FARM = 0**. This is not a
computation error: at $1k the T-bill forgone alone is $9.23, FARM needs
net ≥ $87.50, and the largest modelled drop at $1k is $46.06. The rule was
NOT retuned to manufacture FARM rows (no hours/fees/share changes were made
to hit a target count).

**Proposed adjustment for the board (FASE 2 recommendation, builder to
implement):** use **per-row deposit sizing as the board's verdict mechanism**
— deposit = smallest D paying costs and $25/h, capped at $25,000 (kevin's
rule, adapted) — which yields FARM 42 / MARGINAL 41 / SKIP 115, with the
fixed-$1,000 and fixed-$10,000 counts (0/55/143 and 20/60/118) printed on
the board as controls. The deposit toggle ($1,000 / $10,000) stays as a
what-if control that re-prices every verdict in place. This matches the
top-10 pattern (kevin's optimised deposit; kiencx's 0.02%-of-TVL deposit)
while keeping the specified fixed-deposit numbers visible and honest.

---

## 7. What could NOT be determined from the snapshot (do not invent)

1. **Own-token share** (europa-nova #19's multiplier: launch value × odds ×
   own-token share). The snapshot has no allocation/vesting/insider data.
   There is no snapshot-grounded proxy. **REJECTED — do not use.**
2. **Token launch dates / hazards.** The snapshot has protocol `listed_at`
   only, not token launch dates. A true launch-hazard model (launches per
   protocol-year at risk) cannot be fitted; the odds model is a
   cross-sectional ever-rate, not a hazard. The remaining-conditional view
   (§3.5) is a transform of that ever-rate, not a fitted hazard.
3. **Category effects with statistical confidence.** The category/family
   effect was tested twice (ridge k=16 and k=64, raw category and first-word
   family) and rejected on the walk-forward test both times. With 92 comps
   spread over ~28 categories, most categories have 1–3 comps; no
   shrinkage level rescues that. Do not re-add a category multiplier without
   a fresh both-tests win.
4. **Age effect on price.** Age improves LOO a lot (×3.22→×3.07) but fails
   walk-forward (×2.09→×2.19). The WF test has only 35 priced tokens, so
   small differences are fragile — but the rule is the rule, and age is out
   of the price model. (Age IS in the odds model, where it passes all three
   tests decisively.)
5. **The 20 off-list protocols' reason for not being on the house watchlist.**
   Not derivable from snapshot fields. The grouping rule ("above floor, not
   on the house list") is derivable; the house's reason is not. Do not
   invent a reason on the board — label them "Off-list (above the floor,
   not on the house watchlist)".
6. **Fees/hours beyond the stated assumptions.** Gas prices, transaction
   counts (8), bridge legs ($1.00), and hours (3.5) are stated assumptions
   in §6.1, not snapshot facts. The builder prints them as assumptions.
7. **Why 15 protocols have `mcap_usd` exactly 0** (vs null). Treated as
   "no usable cap" (not comps, not ranked unless all three token fields
   are null — check per protocol; the 15 zero-mcap protocols record a token
   by symbol/gecko and are therefore peers-with-token, not ranked).

---

## 8. Builder implementation checklist

1. **Constants (hardcode exactly as written; do not re-derive by a different
   definition):** `AS_OF = 2026-11-14`; `MED_CHANGE_7D = -0.0823335`
   (median of the 754 non-null `change_7d` values, as a fraction);
   `MED_AGE_PEERS = 1.5277207392197125` (median age of the 383 dated peers);
   growth cap `±0.25` (both models); `CEILING_C = 0.9500`.
2. **Sets:** implement E1–E4 exactly as §1.1 (note: `Cross Chain Bridge`
   and `Staking Pool` are KEPT as peers). Verify: peers 442, comps 92,
   ranked 198, ledger 758, watchlist 40/40.
3. **Value:** §2.1 formula. `change_7d` null → excess 0. `n_chains =
   len(chains)`. No age term, no category term.
4. **Odds:** §3.1 formula. Undated → age = `MED_AGE_PEERS`, dummy = 1.
   `change_7d` null → excess 0. Growth capped ±0.25 **before** multiplying
   by −3.503363706437129.
5. **Implied:** `round(V_launch × p_ever)` to whole dollars. Must be ≥ 1
   for all 198 (min observed $387,934).
6. **Bands:** §4.1 multipliers (same for every row). Rank ranges from 200
   bootstrap refits of the value model (odds fixed); use a fixed seed so
   the two required runs are byte-identical.
7. **Farm:** §6.1 rule, fee table, 3.5 h, `net/h ≥ 25 − 1e-9` (float
   tolerance — do not use a bare `>= 25`). Board deposit: per-row sized
   (§6.4) with $1,000/$10,000 toggles re-pricing verdicts.
8. **Checks to print on the cover:** rows recomputed = board.json; ranks
   1–198 in order; values never rise; totals equal ($880,995,215 implied);
   watchlist 40/40; ledger 758/758; 0 protocol names in the code (the
   model uses only snapshot fields — no hardcoded names anywhere).
9. **Determinism:** two runs must write identical bytes. No
   `Date.now()`, no unseeded randomness (bootstrap uses fixed seeds).
10. **Do NOT:** add a category/family multiplier, an age term to the price,
    an own-token share, an uncapped growth term, or refit-only bands as row
    bands. Each was tested and rejected, with the numbers in §2.2/§3.2/§4.2.

---

## 9. Headline numbers (for the parent report)

- Comp set **92** (from mcap>0 = **128**, not 129 as briefed — 15 zero-mcap).
  Peers **442** (244 token / 198 no-token). Ranked **198** (40 + 20 + 138).
- Value model: `log10(V) = 4.151591 + 0.378031·log10(TVL_fwd) − 0.073673·ln(chains)`.
  **LOO ×3.2194, WF ×2.0668, 5-fold ×3.0188** vs flat ×4.65 / ×4.52 / ×4.88.
  Targets met (WF ≤2.6, LOO ≤3.3, flat beaten by 31%/54%).
  Kept: growth carry (thin), chain count (LOO tie, WF+5F win). Rejected:
  category/family (both ridges), age, control.
- Odds model: logit with age + undated dummy + lnTVL + capped growth.
  **Brier LOO 0.188978, 10-fold 0.1868 (built) / 0.187834 (analyst), WF 0.209304** vs base
  0.2484 / 0.2473 / 0.3523. Kept: age, undated dummy, size, growth.
  Rejected: category share (fails WF), chains (fails LOO), control.
- Intervals: predictive bands ×0.301–×2.956 (P25–P75), ×0.098–×13.300
  (P10–P90). Coverage LOO 50.0%/82.6%, WF 57.1%/82.9%, honest WF
  57.1%/65.7% (P10–P90 under 80% — admitted). Refit-only bands hold only
  14%/26% — never print them as row bands.
- Odds views: ever-rate primary (median 0.3794 on ranked), remaining
  conditional secondary (median 0.9194); they rank in exactly opposite
  order (Spearman −1.000). Ceiling c = 0.9500.
- Ranking: total implied **$880,995,215**; #1 Sentora Curator $25,058,273;
  #2 Steakhouse $24,238,197; #3 Polymarket International $22,311,678.
- Farm (specified rule): **$1k: FARM 0 / MARGINAL 55 / SKIP 143**;
  **$10k: FARM 20 / MARGINAL 60 / SKIP 118**; per-row deposit (cap $25k):
  FARM 42 / MARGINAL 41 / SKIP 115. No watchlist row farms at any deposit.
- Blockers for the builder: none in the model. The growth cap (§3.1) and
  the float tolerance (§6.1) are the two details most likely to be missed;
  both are called out in §8.
