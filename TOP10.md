# TOP10.md — token-radar-01 radar-9 FASE 1 (24 Nov 2026 ~17:20 WIB)

Sources (all public, no repo access — EVERY top-10 entry is `source_withheld: true`
with empty `repo_url`; NO repo was cloned, downloaded, or read; NO code was copied):
- Leaderboard API `GET /api/competitions/token-radar-01/leaderboard?view=performance`
  (payload saved `/tmp/radar9_board_perf.json`, fetched 2026-11-24 17:05 WIB):
  titles, scores, bytes, intervals, wins, received dates.
- Submission metadata `GET /api/submissions/<id>` for #4 lhowann, #5 darren-mitch-vicente,
  #10 silver-ibis-46-1447 (saved `/tmp/radar9-top10/sub-*.json`): status, authorship
  lines, build cost, build wall time, dev scores.
- Artifact preview images (the entries' 3 public screenshots each, board / detail /
  filtered) downloaded from the leaderboard payload's `judge.artifact.images` URLs
  to `/tmp/radar9-top10/` and **read visually, one by one** (2026-11-24 ~17:10 WIB).
  These are the same public dossier images FASE 1 radar-7 studied (33 screenshots).
- Prior deep study `~/workspace/testnet-wallet/makefun/token-radar-01-roni-v5/TOP10.md`
  (FASE 1 radar-7, 23 Nov) for #1–#3, #6–#9 as they stood then — carried forward
  below with their [VERIFIED] labels intact; only the board positions changed.

Labelling: **[VERIFIED]** = seen directly in a screenshot, the board payload,
submission metadata, or the kit. **[INFERRED]** = a conclusion drawn from the
evidence (labelled wherever it appears). Nothing here is fabricated: where a
detail could not be read (text too small in a screenshot), it is marked
"not legible" rather than guessed.

## Top 10 (rank | handle | title | score)

| # | Handle | Title | Score |
|---|--------|-------|-------|
| 1 | kiencx | Launch Radar v4: every value term fitted and tested held-out twice, token odds from the peers' record, integrity strip, costed farm verdicts | 0.966767 |
| 2 | nyx77 | Launch Radar | 0.964424 |
| 3 | meena1321 | The Pre-Token Ledger — pre-token launch radar | 0.964424 |
| 4 | lhowann | Fresh Obelisk | 0.963636 |
| 5 | darren-mitch-vicente | Open Lens | 0.962846 |
| 6 | swift-orca-68-9468 | Launch Radar v15: every value term fitted and tested held-out four ways, conformal intervals priced per kind, farm plans sized to minimum viable capital, token odds from the peers' record | 0.962846 |
| 7 | sudhan | Token Radar: fitted launch pricing, 66 farm plans, a KPI strip and every one of 758 protocols accounted for | 0.962052 |
| 8 | behzad-khanlar | T-Minus: token launch radar that answers its own checks on the cover, launch odds that fall with age, every term tested ten-fold and older to newer, and plan-sized farm verdicts | 0.962052 |
| 9 | rstrike | Launch Radar Terminal | 0.962052 |
| 10 | silver-ibis-46-1447 | Pre-Token Radar v8: implied value from TVL, 7-day growth and age; odds terms set by rule and checked nested against picking by score | 0.962052 |

source: `GET /api/competitions/token-radar-01/leaderboard?view=performance`
fetched_at: `2026-11-24 17:05 WIB`

## Ranks 11–20 (for the technique pool)

| # | Handle | Title | Score |
|---|--------|-------|-------|
| 11 | brisk-kestrel-93 | Undercurrent: walk-forward-tested value model, deposit-sized farm plans | 0.962052 |
| 12 | nightshift-labs | Launchscope — pre-token radar: the fitted model and its out-of-sample test on the board, traded tokens as anchors, costed farm timelines | 0.962052 |
| 13 | calm-owl-82 | Launch Radar: comps curve tested blind, costed farm plan for every pre-token protocol | 0.962052 |
| 14 | fikril07 | Launch Radar v9: every value term fitted and tested held-out twice, full price graded LOO x2.99 and walk-forward x4.10, token odds from the peers' record, costed farm verdicts | 0.961255 |
| 15 | northpier-research | Token radar radar-6: fitted size curve, token odds, 758 audit, rank ranges, KPI strip, cover self-check, deposit-tier farm plans, walk-forward, Expected, 2D farm matrix | 0.961255 |
| 16 | ronigrv | Launch Radar: comps-fitted value tested out of sample, every farm plan netted to farm, thin or skip | 0.961255 |
| 17 | tidy-meteor-25 | Launch Radar | 0.961255 |
| 18 | tidy-orca-63 | Unminted: implied value and net farm verdicts | 0.961255 |
| 19 | europa-nova | Pre-Token Radar v16: launch value x odds a token ever lists x own-token share, every term split-tested, 9-check self-test, costed and timed farm plans on every row | 0.960454 |
| 20 | hazel-harbor-63 | Launch Radar: one-per-ticker comps fit tested blind, costed farm plans netted to the dollar | 0.960454 |

source: `GET /api/competitions/token-radar-01/leaderboard?view=performance`
fetched_at: `2026-11-24 17:05 WIB`

## Technique names (from top-20 titles)
- every value term fitted and tested held-out twice (kiencx #1, fikril07 #14)
- every value term fitted and tested held-out four ways + conformal intervals priced per kind + farm plans sized to minimum viable capital (swift-orca #6)
- odds terms set by rule and checked nested against picking by score (silver-ibis #10)
- launch value x odds a token ever lists x own-token share (europa-nova #19)
- one-per-ticker comps fit tested blind (hazel-harbor-63 #20)
- deposit-tier farm plans + 2D farm matrix (northpier-research #15)
- "Size up" / break-even deposit verdict (lhowann #4 — from its screenshots, title gives nothing)
- adjustable odds-horizon + weeks-held sliders (darren #5 — from its screenshots, title gives nothing)
- 119-traded-token comp fit (lhowann #4, silver-ibis #10 — from their screenshots)
- 1-year launch-odds horizon (lhowann #4 — from its screenshots)

## NEW ENTRIES — deep dives (the 24 Nov movers; priority study per user order)

### #4 lhowann — "Fresh Obelisk" · 0.963636 · 880,884 B · received 2026-11-24T01:58:42Z
- **Submission metadata [VERIFIED]:** status finished, error null, via api, source_withheld true, repo empty. Authorship: 1,297 lines total, 825 authored, 0 pasted, 451 read, 21 absent, authored coverage 63.6%; 19 sessions, 477 turns; build cost $53.12; build wall 46,675,997 ms (~13.0 h). Dev score 0.963636, SE 0.007381, interval [0.951495, 0.975778], 20W/0D/0L, provisional.
- **Title [VERIFIED]:** "Fresh Obelisk" — reveals NOTHING about the technique. [INFERRED: the judge reads the dashboard, not the title; nyx77 #2 already proved this, lhowann confirms it again.]
- **Headline formula [VERIFIED]:** "Implied value = launch value × launch odds. Launch value is the cap the market pays for this TVL: ln(cap) = 7.20 + 0.504 ln(TVL) + sector − 0.016 time listed, fitted on 119 traded tokens. Launch odds are the chance of a token within a year, from a logistic fit on 383 comparable protocols (192 with a token) using years listed, size, sector, 7-day growth."
- **Value model [VERIFIED]:** fitted on **119 traded tokens** (not the modal 92). LOO ×4.34 vs flat ×5.55; walk-forward ×5.72–5.94. Terms added in order: one cap for all (baseline ×5.55 / ×6.01); size ln(TVL) kept (×4.69 / ×5.94); sector offset kept (×4.34 / ×5.72); 7-day growth fitted 0.00 "kept, no signal" (×4.34 / ×5.72); time listed fitted −0.02 "kept, no signal" (×4.34 / ×5.74). [INFERRED: the 119-comp set is harder than the 92-comp set — its flat baseline is ×5.55 vs the usual ×4.65 — so its LOO ×4.34 is NOT comparable to radar-7's ×3.22 on 92 comps. Composition unverified from screenshots; 128 mcap>0 minus 9 = 119 matches the CEX exclusion count in radar-7's MODEL-SPEC §1.2, i.e. plausibly mcap>0 minus CEX only — but that is a hypothesis, not a verified count.]
- **Odds [VERIFIED]:** **1-YEAR horizon** ("chance of a token within a year") — the only top-10 entry on a 1-year horizon. Logistic on 383 comparable protocols (192 with a token). Brier: base rate 0.252 / 0.291; + years listed ln(1+yr) 0.2133 / 0.2255 kept; + size ln(TVL) 0.2088 / 0.2224 kept; + sector 0.2063 / 0.2140 kept; + 7-day growth 0.2025 / 0.2099 kept; + chain count ln 0.2029 / 0.2121 tested, not kept. "Terms that lowered held-out error: 2 + 4" (value: size, sector offset; odds: years listed, size, sector, 7-day growth).
- **Bands [VERIFIED]:** "Are the bands honest? 48% / 70% — of the 27 newest tokens fall inside the 50% / 80% band, fitted on the older 60." [INFERRED: their walk-forward split is fit-on-older-60 → price-newest-27, a harder split than behzad's 35→35 median split — another reason their WF ×5.72 is not comparable to radar-7's ×2.07.]
- **Farm — the "Size up" verdict [VERIFIED]:** "Plans that pay $25 an hour: 115 — 3 from $5K or less, 112 from $25K; cheapest: Defa By InvoiceMate $4.2K, Binaryx Platform $4.6K." Board columns: "Verdict, $/h at $5K" and "Farm plan, net". Verdict vocabulary: **Pass / Size up** (not FARM/MARGINAL/SKIP). A row reads "Size up $6.54/h — breaks even at $19K". The farm plan's cost of capital is **5%/yr on idle capital** ("the deposit earns its own yield, so the money tied up costs nothing extra") — NOT the 4% T-bill: the deposit is assumed yield-bearing (vault yield offsets the opportunity cost). Detail view (OnRe #4, $10.9M): "Farm plan on Solana, Size up, breaks even at $19K" — 7 steps over 60 days on $19K: expected drop $68, less gas and 5%/yr on idle capital = net $68, $25 an hour against $25. "All in: 7 steps over 60 days on $19K: expected drop $68, less gas and 5%/yr on idle capital = net $68, $25 an hour against $25." Steps include "Decide first…", "Open a fresh wallet… one wallet per person, since sybil filters drop clusters of scripted wallets", "Set an exit line: if its TVL falls 25% below today's $308.9M, redeem at NAV…".
- **Detail view [VERIFIED] (OnRe):** "How the value is made" — size curve $25.0M at $308.9M TVL; sector Stable & RWA **×1.452**; 7-day growth 0.1%, fitted 0.000, ×1.000; time listed 488 days, fitted −0.016, against the average age, ×1.006; launch value $36.6M; launch odds within a year 30% ("1.3 years listed, size, sector, 7-day growth; 59% of such peers have a token"); implied $10.9M, 50% $3.7M–$33.1M, 80% $1.0M–$117.2M. "What moves the value" sensitivity table at the bottom (values not legible in the screenshot).
- **Filtered view [VERIFIED] (Watchlist, sorted by $/h):** Firelight $25/h (breaks even at $5.1K), Ember $11/h ($12K), Doppler Finance $11/h ($12K), Valos $9.04/h ($14K), R25 $8.69/h ($14K), Lofty $8.26/h ($15K), Plume Vaults $8.17/h ($15K), Saturn $7.85/h ($16K), OpenTrade $6.69/h ($18K). [INFERRED: the Size-up framing makes WATCHLIST rows farmable at their break-even ticket — lhowann's watchlist is not a 0-FARM zone the way radar-7's was. The verdict answers "how big a deposit makes this row pay $25/h" instead of "does it pay at $1k/$10k".]
- **Board [VERIFIED]:** 198 rows; #1 Bittensor dTAO $19.5M (50% band $6.2M–$61.1M), #2 Steakhouse $13.6M, #3 Sentora $13.5M, #4 OnRe $10.9M, #5 Lightning Network $10.9M. Rank ranges on rows (4–5, 4–6, 10–11…). Tabs: Pre-token board / Traded tokens (119) / Model, tests & audit. Ledger: "Left out: category CEX 42, category Liquid Staking 38, category Bridge 28, category Canonical Bridge 15, versioned name 11, wrapped or staked name 5, category Liquid Restaking 3, category Restaked BTC 2" (= 144). Scatter: "Every traded token priced by a fit that never saw it, against its real cap" (predicted, dashed ×6.3).
- **Distinctive:** 1-year odds horizon; 119-comp fit; "Size up" break-even-deposit verdict; 5%/yr idle-capital cost instead of the T-bill; "kept, no signal" honest labelling of null terms; cheapest-farm framing ($4.2K).

### #5 darren-mitch-vicente — "Open Lens" · 0.962846 · 585,869 B · received 2026-11-24T04:48:24Z
- **Submission metadata [VERIFIED]:** status finished, error null, via web, source_withheld true, repo empty. Authorship: 898 lines total, 606 authored, 0 pasted, 1 read, 291 absent, authored coverage 67.5%; **1 session, 140 turns**; build cost $49.91; build wall 38,881,207 ms (~10.8 h). Dev score 0.962846, SE 0.007472, interval [0.950555, 0.975137], 20W/0D/0L, provisional. [INFERRED: a 1-session, 140-turn, ~$50 build reached #5 — the third cheap-build precedent after sudhan (94 turns, $14.85, #7) and brisk-kestrel (118 turns, $17.96, #11).]
- **Title [VERIFIED]:** "Open Lens" — reveals NOTHING about the technique.
- **Headline [VERIFIED]:** "Unissued — A radar for tokens that do not exist yet: 198 protocols that record no token, valued from their own record and costed to farm." KPI strip: Watchlist 40/40; value miss walk-forward ×2.42 vs ×4.46 flat; token odds Brier 0.187 vs 0.248 base, ten folds; worth farming 5 of 198 ("beat a T-bill and $25/h; 16 do not cover fees"); board implied $815.3M.
- **Formula [VERIFIED]:** "Implied value = launch value × token odds. Launch value = $12.9M × (TVL ÷ $100M)^0.39, the curve of 92 traded tokens' market caps on their TVL. Token odds = of peers like it with no token at its age, the share that record one within 2 yr, from a logistic fit of 442 peers on years listed, ln, category token share, shrunk, size, ln TVL, 7-day TVL change."
- **Value model [VERIFIED]:** PURE size curve — every extra term tested and REJECTED: flat ×4.65/×4.46; + size curve ×3.27/×2.42 kept; + category effect shrunk ×3.63/×2.62 not kept; + 7-day TVL change ×3.25/×2.66 not kept; + years listed ln ×2.99/×2.76 not kept; + chain count ln ×3.21/×2.45 not kept. [INFERRED: the behzad-style minimalism, with a different justification line — "7-day growth and age do not price a token better, so they leave them out; both help tell which peers record a token, so they enter through the odds."]
- **Odds [VERIFIED]:** **conditional 2-year odds derived from the ever-rate curve**: the detail view shows the arithmetic — "Peers with a token at its age: logit −1.60 base; years listed, ln +1.20, category token share, shrunk +0.26, size, ln TVL −0.14, 7-day TVL change +0.22 → 49%. Peers with a token 2 yr later: the same row, 3.0 years listed → 76%. Token odds (76% − 49%) ÷ (100% − 49%) = 53%." Brier table (ten-fold / walk-forward): base 0.2478/0.3553; + years listed ln 0.1974/0.2486 kept; + no listing date 0.1975/0.2557 not kept; + category token share shrunk 0.1928/0.2408 kept; + size ln TVL 0.1882/0.2369 kept; + 7-day TVL change 0.1870/0.2365 kept; + chain count ln 0.1877/0.2362 not kept. "The record behind the odds" age-bin table: 0 to 1 yr 117 peers 31%; 1 to 2 yr 125, 39%; 2 to 3 yr 62, 63%; 3 yr or more 79, 86%.
- **Controls — the adjustable horizon [VERIFIED]:** board controls include **Deposit $10,000 slider, Drop share 7% slider, Weeks held 26 wk slider, and an ODDS HORIZON 2 yr slider** — the reader re-prices implied values, odds and verdicts live by moving the horizon. [INFERRED: this is the first top-10 entry that makes the odds horizon itself a reader control rather than a fixed modelling choice. The ever-rate vs conditional vs 24-month debate (TOP10.md radar-7 Pattern 2) is answered by letting the reader choose.]
- **Detail view [VERIFIED] (Yuzu Money #47, $5.5M):** "How the figure is made" (TVL $57.3M → size curve ×0.18 TVL → launch value $10.3M → token odds 53% → implied $5.5M, P25–P75 $1.7M–$21.6M). "What moves it" sensitivity table (TVL 30% lower ×0.85; TVL doubles ×1.37; 7-day change +20 points ×0.87; one more year, still no token ×0.91). Nearest priced peers table (Wise Token ×0.17, Concentrator ×0.001, sDAI ×1.00, THORChain DEX ×3.18, ZEROBASE ×0.31, Treehouse ×0.09). Farm verdict MARGINAL with a plain-language reason ("It clears its fees but not the T-bill"). **"Held for part of the 26-week season" table** (4/8/13/26 wk × net of fees / hours / net per hour / verdict). Net-of-fees by drop share × deposit matrix (3.5%/7%/14% × $1,000/$5,000/$10,000/$50,000). 8-step farm plan with numbered steps (WALLET / VERIFY / FUND / ENTER / DEEPEN / WEEKLY / EXIT / LEDGER), per-step cost/time, all-in $3.33 / 3.7 h. Footer honesty: "Fees are planning estimates per chain; yield earned while farming is not in the snapshot and is left out."
- **Filtered view [VERIFIED] (Dexs category, 19 of 198 rows, $46.4M implied):** GoonFi FARM +$235 (+$29.36/h), Temple FARM +$219 (+$27.48/h), Stellar AMM MARGINAL +$197, Fluxion Network MARGINAL +$191, Icarus CL MARGINAL +$182. Footer: "Implied value is this model's estimate, not a price and not advice. DefiLlama records no token for these protocols, which is not proof that none exists."
- **Distinctive:** pure size curve (all extras rejected); conditional odds with the arithmetic shown; adjustable odds-horizon slider; partial-hold (weeks-held) table per row; "record behind the odds" age-bin table; plain-language verdict reasons.

### #10 silver-ibis-46-1447 — "Pre-Token Radar v8" · 0.962052 · 1,297,840 B · received 2026-11-24T00:52:18Z
- **Submission metadata [VERIFIED]:** status finished, error null, via api, source_withheld true, repo empty. Authorship: 1,059 lines total, 402 authored, 0 pasted, 470 read, 187 absent, authored coverage 38.0%; 7 sessions, 728 turns; build cost $48.71; build wall 111,917,767 ms (~31.1 h). Dev score 0.962052, SE 0.007563, interval [0.949612, 0.974492], 20W/0D/0L, provisional.
- **Headline [VERIFIED]:** "implied value = value if it launches (size curve on TVL) × 24-month launch odds (age, TVL, 7-day growth, kind, category)". KPI strip: Watchlist 40/40 (+20 parent-linked, 138 under $50M); blind pricing miss ×2.73 walk-forward on 44 newer tokens vs ×4.89 flat; LOO ×3.34 vs ×4.88; range holds 59% · 73% of newer tokens inside P25–P75 and P10–P90 (stated 50%, 80%); token odds Brier 0.211 5-fold vs 0.251 base; walk-fwd 0.283 vs 0.336; **terms in use 1 of 6 · 5 of 7** ("value fixed in advance · odds set by rule"); worth farming 6 FARM (0.02% of TVL for 26 weeks, net of fees, ≥ $25/h; best $39.77/h).
- **Value model [VERIFIED]:** size curve on **119 traded tokens**, slope 0.53 ± 0.09 (bootstrap s.e., 200 refits). Terms: flat ×4.884/×4.895; + size curve ×3.340/×2.730 kept; + kind effect ×3.087/×3.076 tested, not kept; + age (log days listed) ×3.324/×2.752 tested, not kept; + 7-day move as a fitted term ×3.383/×3.074 tested, not kept; + chain count (log) ×3.199/×2.786 tested, not kept; + control: a random number ×3.326/×2.685 "passes, not adopted". Walk-forward split: tokens listed before 2024-02-28 price the 44 listed since.
- **Odds [VERIFIED]:** 24-month, on **595 dated protocols**. Brier (5-fold / walk-fwd): base 0.2512/0.3358; + age (log days listed) 0.2253/0.2934 kept; + size (log TVL) 0.2256/0.2943 kept; + 7-day TVL growth 0.2250/0.2947 kept; + **kind** 0.2173/0.2852 kept; + **category** 0.2108/0.2831 kept; + age squared 0.1969/0.3308 tested, not used; + control: a random number 0.2112/0.2827 tested, not used. Odds fitted on protocols listed before 2025-01-23, scored on the rest.
- **NESTED term-selection check [VERIFIED] — the title's core claim:** "Picking terms by score, redone in each split (main.ts): value 5-fold ×3.29 vs ×3.39 fixed, walk-fwd ×2.73 vs ×2.73; odds Brier 0.2168 vs 0.2108 by rule, walk-fwd 0.3368 vs 0.2831." [INFERRED: this is a second-order proof — it tests whether the TERM-SELECTION PROCEDURE itself overfits, by re-picking terms inside each split and comparing against the fixed rule. No radar-7/8 round did this. The honest result is mixed (nested picking is slightly worse on odds Brier 0.2168 vs 0.2108 by rule) and they print it anyway.]
- **Bands [VERIFIED]:** "Is the printed range honest? REAL CAPS INSIDE / STATED / LOO / WALK-FWD: P25–P75 range 50% / 50% / 59%; P10–P90 range 80% / 80% / 73%."
- **Farm [VERIFIED]:** 6 FARM / 157 Thin / 35 Skip at 0.02% of TVL, 26 weeks, 7.5% to users. Controls: deposit 0.02% of TVL / $1K / $10K / $100K; drop to users 3.5% / 7.5% / 15%; hold 13 / 26 / 52 wk. **"tick rows to compare"** checkboxes on rows. Kind filters: Trading 38, Credit & stables 33, Yield & vaults 91, Real-world assets 18, Staking & restaking 10, Infrastructure 8. Board rows: #1 Steakhouse $19.3M THIN +$129 ($24.99/h); #2 Veda $15.5M FARM +$183 ($35.42/h, 6 steps, 182 days); #3 USDD $14.8M FARM +$114; #4 Nonce Capital $13.8M FARM +$205 ($39.77/h); #5 Gauntlet $12.1M FARM +$141; #6 Sentora $12.1M THIN +$78.92; #7 Bittensor dTAO $10.1M SKIP −$443. Total implied $502.0M — the lowest scale in the top 10.
- **Detail view [VERIFIED] (Veda #2, $15.5M):** **"Value walk"** — TVL $1.56B; × fitted multiple 0.042 ("traded tokens are priced at TVL^0.53: small protocols at a higher multiple") → $65.3M; × launch odds 24% → $15.5M. "Priced against" table: traded Yield & vaults tokens nearest in TVL (Falcon Finance $318.1M mcap, Grove $6.5M, Concrete $21.0M, Convex $148.2M; Veda blind model $65.3M). "Launch odds by age" chart (share of peers that record a token; odds it records one within 24 months — 24% at 1.7 yr). Farm plan $250K on Ink, 6 steps over 182 days, one-off $2.47, weekly $0, 5.2 h work; "Expected drop $185 − fees $2.47 = +$183, $35.42 per hour of work: FARM (FARM pays $25/h or more, THIN pays less, SKIP loses money)". Inline expandable farm plan on the board itself (Veda expanded in the board screenshot).
- **Distinctive:** nested term-selection proof; "value fixed in advance · odds set by rule" (1 of 6 / 5 of 7) framing; 119-comp fit; 595-protocol odds fit; "Value walk" named build-up; row-compare checkboxes; kind (6-group) taxonomy used in odds; lowest implied-value scale in the top 10.

## Carried-forward deep study (#1–#3, #6–#9)
Full per-entry dives are in `~/workspace/testnet-wallet/makefun/token-radar-01-roni-v5/TOP10.md`
(FASE 1 radar-7, 23 Nov — screenshots read visually there). One-line state, updated
to the 24 Nov board:
- #1 kiencx 0.966767 (unchanged) — size curve + category ridge (kept), ever-odds, control term in both tables, off-list parent haircut ×0.48, bootstrap rank ranges, FARM 14 (net vs T-bill + $25/h).
- #2 nyx77 0.964424 (unchanged) — simplest model (size curve + momentum + category premium), plain title, honest under-coverage admission (45%/74%), "typical wait".
- #3 meena1321 0.964424 (unchanged) — ledger aesthetic, P_tge + farmer-capital netting, THIN verdicts, "validation is honest and weak", 52 FARM.
- #6 swift-orca-68-9468 0.962846 (was #5) — four-way validation incl. category-blind split, "netted twice" (ROBUST tier), full public audit table of all 92 comps, "minimum viable capital".
- #7 sudhan 0.962052 (was #6) — smallest dossier in the top 10 (450,689 B), dollar-days airdrop slice, market-relative momentum, kinship, "pays from a $566 ticket".
- #8 behzad-khanlar 0.962052 (was #7) — minimal price (size curve ONLY), falling conditional odds, "0 protocol names in the code", factor columns in the board.
- #9 rstrike 0.962052 (was #8) — terminal UI + keyboard navigation, 2-year-window odds, what-if controls, slice-repays-costs multiplier.
- Dropped out of the top 10 since 23 Nov: kevin (was #2, now #24 @ 0.95965) — its 24-month odds + per-row optimised deposit no longer hold the line as the tournament plays. [INFERRED: dev rates decay/move with more games; a 20W/0L provisional rate is not a settled rank.]

## Patterns (3–5, each traceable to a row above)
1. **The board moves in hours, and the prize line is a tie, not a wall.** Three entries submitted within ~9 hours of each other (lhowann, darren, silver-ibis) all landed top 10 on 24 Nov, and kevin fell #2 → #24 the same day. The prize line held at 0.962052 only because SEVEN entries tie there — the line is defended by a crowd, not by one strong entry. A radar-9 that reaches 0.962052 exactly joins a 7-way tie decided by dossier bytes, where radar-7's 374,956 B would place FIRST in the group.
2. **Absolute LOO/WF miss does NOT decide rank — the judge scores the whole dashboard.** lhowann ranks #4 with LOO ×4.34 / WF ×5.72 — far worse than radar-7's ×3.22 / ×2.07 — on a harder 119-comp set and a harder 60→27 walk-forward split. silver-ibis ranks #10 with LOO ×3.34 / WF ×2.73. The margin comes from coherence + ownable features (Size-up verdicts, horizon sliders, nested proof), not from the miss number. Radar-8's lesson stands: chasing LOO ≤ 3.0 by tuning was the wrong war.
3. **The new ownable farm framings all answer "how big" instead of "yes/no".** lhowann's "Size up $19K" (break-even deposit as the headline), darren's weeks-held + deposit + drop-share + horizon sliders (the reader re-prices everything), silver-ibis's 0.02%-of-TVL deposit with 13/26/52-wk holds and row-compare. Radar-7/8 answer "FARM at $1k/$10k/per-row" — a fixed-deposit verdict. The 24 Nov winners let the READER choose the size and show what size makes each row pay.
4. **Second-order honesty is the new evidence frontier.** silver-ibis's nested term-selection check (re-picking terms inside each split) and lhowann's "kept, no signal" null terms are proofs ABOUT the proof. The top 10 already all print kept/tested-not-kept tables; the 24 Nov entries add proof that the selection procedure itself, and the null terms, are honest. Radar-7's evidence tables are first-order only.
5. **Cheap builds still win; cost and session count do not predict rank.** darren: 1 session, 140 turns, $49.91 → #5. lhowann: 19 sessions, $53.12 → #4. silver-ibis: $48.71 → #10. All three cost ~$49–53 — a quarter of kiencx's $205.85. (Consistent with sudhan $14.85 and brisk-kestrel $17.96.) What predicts rank is the dashboard the judge reads, not the build behind it.

## Our gap (vs top-10)
- Radar-7 dev win rate 0.923193 (12W/0D/0L, provisional); counting entry is radar-5 at 0.917926 (see BOARD.md — radar-7 is currently superseded as final). Prize line 0.962052. Gap: 3.89pp (radar-7) / 4.41pp (radar-5).
- Local metrics already at/above the top-10 band: value WF ×2.0668 (best in top 10), value LOO ×3.2194 (better than #1's ×3.33), odds Brier WF 0.2093 (better than #1/#7's 0.215), honest-WF coverage 71.4% (radar-8). The gap is NOT in these numbers — it is in margin-driving presentation and farm framing the new top 10 owns and radar-7/8 lack: Size-up/break-even-deposit verdicts, adjustable odds horizon + weeks-held, nested term-selection proof, 119-comp fit, 1-year odds view, deposit-yield cost-of-capital, "Value walk" + row-compare + partial-hold tables.
- Plan in one line: keep the radar-7/8 fitted model as the V1 baseline (do not re-tune its coefficients), and win the margin on the NEW farm framing + new evidence (nested selection) + new interaction (horizon/weeks sliders) — see the ranked idea list in the parent report.

---
**SOURCE_WITHHELD** — every top-10 entry's source is withheld (`source_withheld: true`, `repo_url: ""`); technique names come from titles, submission metadata, and public artifact screenshots only. Do NOT copy code from any entry repo (none is visible anyway).
