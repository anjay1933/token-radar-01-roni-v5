# EVIDENCE-SCORECARD.md — radar-9 vs the top-10 bands (FASE 3 local proxy)

There is NO platform dev-heat run available locally — no win rate is claimed
anywhere in this file. This scorecard compares radar-9's MEASURED local
numbers against the top-10 bands from TOP10.md, criterion by criterion.
FASE 3 is done when radar-9 is IN-BAND or better on every locally measurable
row AND the gauntlet is 100% green.

Top-10 bands (TOP10.md): value WF 2.11–3.51 / LOO 2.92–3.4; #1 value
WF ×2.53 / LOO ×3.33; #2 value WF ×2.26 / LOO ×2.99; odds Brier #1 0.215 WF;
#7 behzad 0.215 WF / 0.187 10-fold; coverage #1 57%/76% (P25–P75 / P10–P90
presumably LOO); FARM counts kiencx 14 / kevin 36 / sudhan 66; bytes sudhan
450,689 B (the dossier target 450,688 B is sudhan − 1 B).

Local submit bar: beat radar-7's dev judge **0.923193**. Prize line #10:
**0.962052**. No local win rate exists — the scorecard tracks the measurable
proxies, not the rank key.

## Scorecard (measured 2026-11-24, Round 1 V1 — re-measured after each round)

| Criterion | Radar-9 (measured) | Top-10 band / comparator | Verdict |
|---|---|---|---|
| Value LOO miss | ×3.2194 | #1 ×3.33, #2 ×2.99, band 2.92–3.4 | **IN-BAND** (better than #1, worse than #2) |
| Value WF miss | ×2.0668 | #1 ×2.53, #2 ×2.26, band floor 2.11 | **BETTER** (beats #2 by 0.19, beats the band floor) |
| Value 5-fold miss | ×3.0188 | (no top-10 5-fold band recorded) | — (reported; flat ×4.8826) |
| Value vs flat | −31% LOO / −54% WF | — | better than flat on both tests |
| Odds Brier LOO | 0.1890 | (no top-10 LOO Brier recorded) | — (vs base 0.2484, −24%) |
| Odds Brier 10-fold | 0.1868 | #7 behzad 0.187 | **IN-BAND** (≈ behzad, −0.0002) |
| Odds Brier WF | 0.2093 | #1 0.215, #7 0.215 | **BETTER** (−0.006 vs both; vs base 0.3523, −41%) |
| Coverage LOO P25–P75 | 50.0% (46/92) | #1 57% | **SHORT** (−7 pp; stated 50%, so honest, but below #1's achieved 57%) |
| Coverage LOO P10–P90 | 82.6% (76/92) | #1 76% | **BETTER** (+6.6 pp; stated 80%) |
| Coverage honest WF P10–P90 | 65.7% (23/35) | (no top-10 honest-WF number recorded) | **ADMITTED** — under the stated 80%; shown on the board, nyx77 precedent |
| FARM per-row | 42 | kiencx 14 / kevin 36 / sudhan 66 | **IN-BAND** (between kevin and sudhan) |
| FARM $10k / $1k | 20 / 0 | (no top-10 $1k/$10k split recorded) | — (reported) |
| FARM watchlist rows | 0 of 40 | kiencx best FARM = Yuzu Money (watchlist); kevin Axis (watchlist) farms | **GAP, EXPLAINED** — structural: farm needs implied/TVL > 13.2% at 7%/12wk; watchlist median 4.4%; closest Noble 15.2% clears the rate but needs a $62,535 ticket over the $25,000 cap; Sentora 0.9% fails on three grounds. Shown on the board with a sensitivity table. NOT tunable without changing the rule |
| 119-comp fit (Round 2) | LOO ×3.2533 / WF ×2.8122 vs 92-fit ×3.2194 / ×2.0668 | lhowann #4 LOO ×4.34 / WF ×5.72 on 119 | **DROPPED** — fails the pre-registered both-tests rule on both tests; 119-fit excluded from the final model. The 119 set is harder (flat ×4.94/×4.96 vs ×4.65/×4.52); relative-vs-flat LOO improves (−34.1% vs −30.7%) but WF worsens (−43.3% vs −54.3%). Board impact if kept: total implied +12.7%, #1 flips to Steakhouse, 102/198 rows move ≥5 ranks |
| Nested value picks (Round 4) | replicate 0/6 subsets; rule/score agree 0/6; 2/6 pick nothing | (no top-10 nested number recorded) | **EVIDENCE, HONEST NON-REPLICATION** — the value term selection is sample-dependent at n=92; full-fit picks stand on the full data, model unchanged |
| Nested odds picks (Round 4) | rule picks match full-fit set in 2/6; age+size 5/6 each, dummy 4/6, growth 4/6, cat 2/6, chains 0/6, control 0/6 | (no top-10 nested number recorded) | **EVIDENCE, PARTIAL** — more stable than value picks, but not clean; model unchanged |
| Ablation top-20 (Round 4) | subset LOO ×3.0846 (50.0%) vs full ×3.2194 (48.9%); rest keeps 65.8% of implied ($579,264,833), all 42 FARM rows survive | (no top-10 ablation number recorded) | **KEPT** — passes both pre-registered thresholds (≤ full +0.10 abs, ≤ full ×1.10 rel); the model's head prices better than its average |
| Detail sliders (Round 4) | weeks 4–52 + odds stress 50–100%, both re-price #d-sens live | — | **KEPT** — were dead controls (rendered, never bound); now bound and smoke-tested functionally |
| Row-compare (Round 5) | CMP checkboxes on board + farm tables; two ticks → #compare view with both detail cards side by side, no duplicate slider ids | — | **KEPT** — pure presentation, model unchanged; auto-navigate instead of a compare bar (byte budget); known warts: third tick drops the oldest pick but its box stays ticked until re-render; `#d-sens` id duplicated in compare view (inert); no narrow-screen stacking |
| Dossier bytes | 433,848 (text 65,107 chars) | sudhan 450,689; target ≤ 450,688 | **BETTER** (under target by 16,840 B; dashboard source 65,413 B vs the 65,536 B text cap — 123 B headroom. The ≤ 64,000 B Round 5 target was missed; the hard cap is met with almost no margin) |
| Gauntlet | 34/34 | — | **GREEN** |
| Dashboard smoke | 43/43 | — | **GREEN** (38 → 43: 5 new Round 5 assertions) |
| Runtime | ~3.1 s | — | — |

## Open gaps (priority order for Rounds 3–5)

1. **Watchlist FARM = 0** — structural (threshold 13.2%, Noble over cap,
   Sentora triple-failure; sensitivity table on the board). Remains a numeric
   gap vs kiencx/kevin, but no honest fix exists within the spec rule — the
   explanation IS the deliverable. Round 3 (Ide 1 Size-up) reframes it as
   break-even-deposit verdicts rather than trying to manufacture FARM rows.
2. **Coverage LOO P25–P75 50.0% vs #1's 57%** — the band is honest
   (stated 50%) but #1 achieves more. TESTED in radar-7 Round 4: widening by
   the honest-WF factor (×1.23) would over-cover held-out (LOO 87.0% / WF
   85.7%) and triple the band span (×422) for a circular gain → BANDS KEPT
   as stated, widening test reported on the board. The LOO P25–P75 gap vs
   #1 remains a numeric shortfall, not a fixable miscalibration.
3. **Growth carry is thin / chain-count keep rests on WF+5-fold** —
   re-verified in radar-7 Round 3 (paired bootstrap B=2000): chains keep is
   STABLE (wins 80% LOO / 75% WF / 89% 5-fold of resamples; the LOO point
   margin −0.003 understates it); growth keep is weak-but-real (59% LOO /
   62% WF). Neither drop improves both deciding tests → BOTH TERMS KEPT,
   no model change. Stability paragraph on the board.
4. **Dossier headroom is 123 B** (dashboard source 65,413 B vs the 65,536 B
   text cap after Round 5; dossier.json 433,848 B vs the 450,688 B target).
   No further dashboard growth is possible without an offsetting cut;
   never cut rubric content. A Round 6 (Ide 9 ensemble band) does not fit
   in this dashboard as it stands.
5. **Nested value picks do not replicate (0/6)** — an honest evidence gap,
   not a model defect: the full-fit picks stand on the full data, and the
   board says so. The odds picks replicate only 2/6. No fix is available
   within the spec rule; do not re-run nested selection without a fresh
   pre-registration.
6. **Screenshots are PIL renderings, not browser captures** — FASE 4 item,
   not a FASE 3 metric.
7. **Round 2 (119-comp) DROPPED** — the top-10's 119-comp fit does not
   transfer to this snapshot under the both-tests rule. The set definition
   itself is corroborated (exact 119 count + silver-ibis's 2024-02-28 split
   date), but the fitted model is worse held-out. Do not re-try a 119
   variant without a fresh pre-registration.
