# BOUNTY-PROFILE.md — token-radar-01 (radar-9, roni @roni-rockabilly)

<!-- Winner-First Gate artifact. Written BEFORE the build starts, from
     BOARD.md + TOP10.md + RULES.md. The prediction below is recorded
     BEFORE submit — never filled in after the result is known. -->

## Bounty
- Slug: `token-radar-01`
- Type: `judge-scored dashboard (program/v1, Node 22 stdlib only)`
- Gate artifacts: `BOARD.md` · `TOP10.md` · `RULES.md` (paths in this workdir)
- Created: `2026-11-24 17:20 WIB`

source: `BOARD.md` + `TOP10.md` + `RULES.md` (this workdir)
fetched_at: `2026-11-24 17:05 WIB — when the board data was fetched`

## Strategy (from BOARD.md + TOP10.md)
- Rank key: `judge win rate, higher is better` — prize line: `0.962052` — #1: `0.966767`
- Tie-break: `exact tie on win rate → playoff games between tied entries → smaller dossier.json bytes → earlier receipt` — our standing: `radar-7 dossier 374,956 B; radar-8 dossier 409,754 B. Both are SMALLER than sudhan's 450,689 B (smallest in the current 0.962052 tie group of 7). A radar-9 tied at 0.962052 with a dossier ≤ 450,688 B would place FIRST in that tie group (rank #7); with radar-7's 374,956 B it would still be first.`
- Tie-break decision (made BEFORE building, from BOARD.md): `dossier budget ≤ 450,688 B, stretch ≤ 410,000 B (radar-8's 409,754 B). NEVER cut rubric content to meet it — cut screenshot bytes and dashboard code size instead. Do NOT chase receipt-order (the bounty opened 10 days ago; early-receipt advantage is gone).`
- Target score (numeric, not "win"): `dev win rate ≥ 0.962052 (prize line); stretch ≥ 0.963636 (#4 lhowann). Local proxy gates before any submit: value WF ≤ ×2.07 AND LOO ≤ ×3.22 HELD (no regression from radar-7); odds Brier LOO ≤ 0.1890 / WF ≤ 0.2093 HELD; farm watchlist FARM ≥ 3 via an honest rule change; honest-WF P10–P90 coverage ≥ 71.4% HELD; gauntlet 34/34; dossier ≤ 450,688 B.`
- Winner pattern(s) we will use: `(1) "Size up" break-even-deposit farm framing (lhowann #4) — answer "how big a deposit makes this row pay $25/h" instead of a fixed-deposit yes/no; (2) nested term-selection proof (silver-ibis #10) — re-pick terms inside each split and print picked-by-rule vs picked-by-score; (3) adjustable odds-horizon + weeks-held sliders (darren #5) — the reader re-prices implied values/odds/verdicts, with the ever-rate primary ranking labelled and stable. All three in OUR OWN implementation, on the radar-7/8 model as V1 baseline.`
- What we will NOT do: `re-tune slope/band/share/horizon of the fitted value/odds models (radar-8 proved the model is at its honest ceiling on this data — further tuning is p-hacking the same 92 comps / 442 peers); chase LOO ≤ 3.0 via the rejected age/seasoning/category formulations; inflate FARM counts by rule-tuning the book to 113–120 rows; copy any other entry's code, title, or layout; submit unless the local proxy gates above are met AND the dev-rate case is better than radar-7's.`

## Execution plan
1. `FASE 1 (this artifact set): board + top-10 study + rules + profile. DONE 2026-11-24 ~17:20 WIB.`
2. `FASE 2: V1 baseline = radar-8 model reproduced exactly in a FRESH repo + fresh Muse session (init anchor FIRST, before any code — thinking_fresh; bundle with --no-discover + explicit --session + --muse-usage). V1 must reproduce radar-8 numbers (198 rows, total implied $880,995,215, value ×3.2194/×2.0668/×3.0188, odds 0.1890/0.1868/0.2093, coverage LOO 53.3%/82.6%, WF 57.1%/82.9%, honest-WF 57.1%/71.4%, farm 83/0/115 wl 1). If V1 does not reproduce, STOP and report.`
3. `FASE 3 (≥ 5 rounds, keep only measured improvements, both-tests rule unchanged): R2 — 119-comp value fit experiment (pre-registered keep/drop: keep only if it lowers miss on BOTH LOO and WF vs the 92-comp fit; report both fits side by side either way); R3 — Size-up farm framing + deposit-yield sensitivity (0% vs 5%) with the 7%/12wk scenario + control printed; R4 — nested term-selection proof for value + odds; R5 — horizon/weeks sliders + partial-hold table + "Value walk" + row-compare (presentation, zero model risk; dossier budget enforced); R6 — 1-year odds view (displayed, ever-rate stays the implied multiplier) + kind-grouping odds test (6-kind, one pre-registered candidate); R7 — integration + full re-measure + gauntlet/smoke/dossier.`
4. `FASE 4: validate format/size strictly (gate 7/7, transcript gate, bundle --dry-run + check, both outputs shown); V1→final comparison table to the user; UBA gate (prepare → validate → approve) BEFORE any CLI submit.`
5. `Submit best only, roni account only, Force_Last aware: the current counting entry is radar-5 (0.917926), NOT radar-7 — coordinator decides the final-entry question before submit. After 3 entries in this bounty, stop and ask before a 4th (playbook rule; roni has used 5 of 10 total already — radar-9 would be #6).`
- Profiles: `roni @roni-rockabilly ONLY (RULES.txt: "One account per person"; standing user order RONI-ONLY)`
- UBA job id: `(to be created by the coordinator via create_execution_plan — FASE 1 does not create UBA jobs)`

## Lessons pulled (Step 0 feed-forward — REQUIRED)
- Lesson: `radar-8 FASE 3 (24 Nov 2026, ITERATION-LOG-OPT.md + EVIDENCE-SCORECARD-OPT.md): value LOO/WF + odds Brier UNCHANGED after 5 rounds of honest re-tests; only farm breadth + honest coverage moved, and farm profit FELL ($2,177 vs $3,675).` → Change to this plan: `radar-9 MUST bring a genuinely new idea (farm framing / evidence / interaction), not another tuning round; the fitted coefficients are frozen as V1.`
- Lesson: `radar-7 TOP10.md (23 Nov): the judge's margin scale punishes thinness more than a 2–3× miss — every top-10 model misses by 2–3×; what differs is the proof each term earned its place.` → Change to this plan: `invest the rounds in second-order proof (nested selection) and ownable farm framing, not in the miss number.`
- Lesson: `lhowann #4 (24 Nov, TOP10.md this file): LOO ×4.34 / WF ×5.72 still ranks #4 — absolute miss does not decide rank.` → Change to this plan: `do NOT reject the 119-comp experiment for a worse headline miss alone; judge it by the both-tests rule AND by what the board shows (harder set, different slope).`
- Lesson: `round-4 rejection (CLI status, 24 Nov): thinking_reproduces 14.5% — dossier.json + screenshots/.gitkeep had no agent evidence.` → Change to this plan: `bundle EVERY session that writes entry files, including the ones that generate the dossier/screenshots; verify ≥ 30% coverage in bundle --dry-run before check.`
- Lesson: `anchor bug (22 Nov, AGENTS.md): repo init anchored to the wrong wallet cost a failed intake + quota.` → Change to this plan: `init the radar-9 repo with the roni keypair explicitly; verify freshness.json wallet immediately after init.`
- Lesson: `gta6-01 v9 (23 Nov, AGENTS.md): strict-transcripts bounty refused a --bundle submit — no live recording, no submit.` → Change to this plan: `check this bounty's transcript requirements from the kit (bundle accepted here per RULES.txt "Enter"); use --no-discover + explicit --session + --muse-usage for the bundle.`
- Lesson: `news-image provisional decay (ALIGNMENT_SYNTHESIS.md): a build "in the money" at 0.983404 fell to 0.978494 as the tournament played; kevin fell #2 → #24 in a day here.` → Change to this plan: `never report a provisional dev rate as won; the prize line is a moving tie, not a fixed wall.`

## Prediction (recorded BEFORE submit — do not edit after results)
- predictedScore: `(TO BE FILLED by FASE 3/4 with the measured local proxy — NOT a judge win rate, which cannot be measured locally. At FASE 1 the honest statement is: local proxy must hold value WF ≤ ×2.07 / LOO ≤ ×3.22, odds Brier ≤ 0.1890/0.2093, farm watchlist ≥ 3, dossier ≤ 450,688 B. No dev win rate is predicted here because no judge games exist before submit.)`
- predictedRank: `(TO BE FILLED after FASE 3 measurement: "inside top 10 IF dev rate reaches 0.962052; else outside". At FASE 1: outside — counting entry radar-5 sits at 0.917926, ≈ rank 3,059.)`
- Prize line at prediction time: `0.962052 (fetched 2026-11-24 17:05 WIB)`
- Distance to money: `radar-7 0.923193 − 0.962052 = −3.8859pp; counting entry radar-5 0.917926 − 0.962052 = −4.4126pp (both need to GAIN that much on the rank key)`
- Confidence: `low — the gap must be closed by margin (criteria 2–4 presentation/evidence), not by local accuracy, and no local metric predicts a judge win rate; the three new ideas are untested until FASE 3 measures them`

## Actual (filled ONLY after the official result is published)
- actualScore: `(empty until the official result)`
- actualRank: `(empty until the official result)`
- Outcome: `(empty)`
- Provisional vs finalized: `(provisional dev rates are NOT the result — record the finalized result here only)`

## Lessons (one line each, copied to LESSONS.md after the result)
- What raised the score most: `(empty)`
- What wasted time or failed: `(empty)`
- Do first next time: `(empty)`
