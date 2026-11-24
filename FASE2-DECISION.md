# FASE 2 DECISION — coordinator, 24 Nov 2026 ~23:50 WIB

## Analyst verdict (fe28a37b, completed 23:45 WIB)
**NO-GO for building V2 as a new model.** No V2 value term beats radar-7 on
both deciding tests defensibly; no V2 odds term survives all three tests.
Full V2 design formula: LOO ×3.2903 (WORSE than radar-7 ×3.2194), WF ×1.9399,
5-fold ×3.0890. Baseline reproduction exact (value ×3.2194/×2.0668/×3.0188;
odds 0.188978/0.187834/0.209304). Deliverable: MODEL-SPEC.md (917 lines) +
analysis/ scripts + JSONs. Repo untouched by the analyst.

## Coordinator decision: PROCEED to FASE 3 with REVISED scope
The analyst's explicit recommendation is to build the **presentational V2**:
radar-7 formulas exactly (v10 MODEL-SPEC §2.1 + §3.1) on the **201-row ranked
set** (prep E2 for ranking, kit E2 for fits) + the margin features. This is
NOT "building a worse model" — it is the validated model with new
presentation, which is the half of the user's V2 design that was never
tested. The BOUNTY-PROFILE "STOP and report" clause was conditioned on
building a worse MODEL; the presentational V2 is not a worse model.

## What the local proxy gates resolve to (honest)
- Value beats radar-7 on BOTH — NOT MET (it IS radar-7: LOO ×3.2194 / WF ×2.0668).
- Odds Brier held — MET (0.188978 / 0.209304).
- Farm watchlist FARM ≥ 3 — NOT MET (0 at every deposit, honest rule).
- Honest-WF P10–P90 ≥ 71.4% — NOT MET (65.7%, same as radar-7).
- Dossier ≤ 450,688 B — TBD in FASE 3 (enforced from R1).
The submit case for V2 therefore rests ENTIRELY on presentation margin
(the same basis as the top-10 evidence: lhowann #5 and darren #6 win with
worse/equal model numbers). The final report will state this plainly; the
submit decision stays with the user.

## E2 decision (confirmed by analyst quantification)
Ranked set prep E2 (201 rows); fits kit (92 comps / 442 peers). Correction:
prep E2 gives **466 peers, not 445** (the brief missed 21 token-recorded
versioned sub-products). Common-row fit difference immaterial (LOO −0.0040,
WF +0.0010). The 3 extra rows' odds shift ≤0.01 between fits.

## V2 numbers the builder must reproduce (v10 MODEL-SPEC)
- 201 rows; watchlist 40/40; ranks 1–201; values never rise.
- Total implied ≈ $887,133,819 (build sums rounded rows; a few dollars gap
  vs the analyst's unrounded sum is expected, as in v9).
- Total launch ≈ $1,972,517,968; total TVL $20,769,092,766; median implied
  $3,260,130; P90 $9,115,400; max $25,058,273; min $387,934.
- Top 10 unchanged from radar-7 (Sentora $25,058,273 … Hive $14,448,889).
- Farm: $1k 0/55/146; $10k 20/61/120; per-row 43/41/117; D_farm finite
  85/201, median $24,587; per-row book capital $529,389, net $3,762.50,
  break-even 1 in 1.8. The +1 FARM vs radar-7 is Privacy Pools V1 ($15,984).
- Coverage: bands ×0.3008–×2.9561 (P25–P75), ×0.0976–×13.3003 (P10–P90);
  LOO 50.0%/82.6%, WF 57.1%/82.9%, honest-WF 57.1%/65.7%.

## Traps the builder must not miss (from the analyst)
1. Chains factor is **10^(coef × ln n)**, NOT e^term (4 chains: 0.7904, not 0.9029).
2. Dual-E2 rule: ranked prep (201) / fits kit (442/92) — do NOT implement as
   a single rule.
3. Growth cap ±0.25 in BOTH models; float tolerance net/h ≥ 25 − 1e-9.
4. change_7d is in PERCENT — divide by 100.
5. Transparency numbers: **72 excluded, 20 off-list** (NOT 92).
