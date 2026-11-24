# BOUNTY-PROFILE.md — token-radar-01 V2 (roni @roni-rockabilly)

<!-- Winner-First Gate artifact. Written BEFORE the build starts, from
     BOARD.md + TOP10.md + RULES.md. The prediction below is recorded
     BEFORE submit — never filled in after the result is known. -->

## Bounty
- Slug: `token-radar-01`
- Type: `judge-scored dashboard (program/v1, Node 22 stdlib only)`
- Gate artifacts: `BOARD.md` · `TOP10.md` · `RULES.md` (paths in this workdir)
- Created: `2026-11-24 23:35 WIB`

source: `BOARD.md` + `TOP10.md` + `RULES.md` (this workdir)
fetched_at: `2026-11-24 23:27 WIB — when the board data was fetched`

## Strategy (from BOARD.md + TOP10.md)
- Rank key: `judge win rate, higher is better` — prize line: `0.962052` — #1/#2: `0.966767`
- Tie-break: `exact tie on win rate → playoff games between tied entries → smaller dossier.json bytes → earlier receipt` — our standing: `radar-7 dossier 374,956 B; radar-9 dossier 408,848 B (artifact). Both are SMALLER than sudhan's 450,689 B (smallest in the current 0.962052 tie group of 6). A V2 tied at 0.962052 with a dossier ≤ 450,688 B would place inside the tie group ahead of sudhan.`
- Tie-break decision (made BEFORE building, from BOARD.md): `dossier budget ≤ 450,688 B, stretch ≤ 410,000 B. NEVER cut rubric content to meet it — cut screenshot bytes and dashboard code size instead. Do NOT chase receipt-order (the bounty opened 10 days ago; early-receipt advantage is gone). The dashboard source shown to the judge is capped at 65,536 B — the V2 dossier text must fit with margin (entry #1 was cut at the cap, 247 B lost).`
- Target score (numeric, not "win"): `dev win rate ≥ 0.962052 (prize line); stretch ≥ 0.963636 (#5 lhowann). Local proxy gates before any submit: V2 value model BEATS radar-7 on BOTH LOO and walk-forward (LOO < ×3.2194 AND WF < ×2.0668); odds Brier LOO ≤ 0.1890 / WF ≤ 0.2093 HELD; farm watchlist FARM ≥ 3 via the Size-up framing (honest rule change); honest-WF P10–P90 coverage ≥ 71.4% HELD; gauntlet 34/34; dossier ≤ 450,688 B.`
- Winner pattern(s) we will use: `(1) V2 model per the user's verified design (TR-V2-PREP.md): log TVL percentile + momentum percentile (clamped), age boost <180d with decay, data-based category multiples, log(chains) premium, implied = base × multipliers with per-row component breakdown bar; (2) "Size up" break-even-deposit farm framing (lhowann #5) — answer "how big a deposit makes this row pay $25/h" + category-specific step plans (Risk Curators deposit via curator, CDP mint/borrow, RWA KYC flow, Prediction Market LP); (3) nested term-selection proof (silver-ibis #11) + both-tests keep/drop tables as prominent as kevin #2's title; (4) adjustable odds-horizon + weeks-held sliders (darren #6) with the ever-rate primary ranking labelled and stable; (5) transparency panel with per-protocol exclusion reason codes (72 excluded, 20 off-list) + "above floor, off-list" section (the 20); (6) "range honesty" on the cover (honest coverage incl. the honest-WF miss). All in OUR OWN implementation, on the V2 model fitted in FASE 2.`
- What we will NOT do: `ship the category multiple / age boost untested (both were rejected on walk-forward in the radar-7 tests — they must win BOTH LOO and WF in FASE 2 or be dropped and reported); re-tune radar-7's fitted coefficients (radar-8 proved that model is at its honest ceiling); inflate FARM counts by rule-tuning; copy any other entry's code, title, or layout; submit unless the local proxy gates above are met AND the dev-rate case is better than radar-7's; change the final pick (stays radar-5 until V2's numbers are in and the user agrees).`
- E2 decision (explicit, from TR-V2-PREP-VERIFICATION.md): `The user's prep E2 (excludes only V2/V3 names) gives eligible 201 (bands $10–50M 96 / $5–10M 45, early zone 141) and KEEPS Metric V1 ($24.6M), Privacy Pools V1 ($8.5M), Rysk V12 ($28.5M). The kit/house E2 (all version markers) gives eligible 198. PRELIMINARY CHOICE: prep E2 (the user's design brief is the authority for V2; the kit does not mandate a specific E2 — it requires ≥100 rows and watchlist 40/40). The FASE 2 analyst MUST quantify the odds-fit difference (442 vs 445 peers) and confirm it is immaterial; if prep-E2 materially worsens the odds fit, switch to kit E2 and document why. Either way the transparency panel states the rule used, names the 3 protocols, and prints "72 excluded by house rule, 20 eligible but off-list" (NOT "92 excluded"). OpenRouter consult Q5 agreed the 201-row set is more defensible when stated clearly.`

## Execution plan
1. `FASE 1 (this artifact set): board + top-10 study + rules + profile + UBA analyze/recommend/plan + OpenRouter consult. DONE 2026-11-24 ~23:35 WIB. UBA job 3afeb07f-a2d3-4ab7-a3fd-3a21c4c48fe5 (status queued). OpenRouter consult saved or-consult-v2-response.md (cost $0).`
2. `FASE 2: analyst fits + both-tests-validates the V2 value/odds models (LOO + walk-forward, keep only terms that lower miss/Brier on BOTH; E2 variant quantified; category multiple + age boost tested as fresh candidates with pre-registered kill criteria). V2 MODEL-SPEC written with exact coefficients + keep/drop tables + coverage. If NO V2 term beats radar-7 on both tests, STOP and report — do not build a worse model.`
3. `FASE 3 (≥ 5 rounds, keep only measured improvements, both-tests rule unchanged): R1 — V1 baseline = V2 model as fitted in FASE 2, reproduced exactly in a FRESH repo + fresh Muse sessions (init anchor FIRST, before any code — thinking_fresh; bundle with --no-discover + explicit --session + --muse-usage); R2 — Size-up farm framing + deposit-yield sensitivity + category step plans; R3 — nested term-selection proof + both-tests tables prominent + "range honesty" cover; R4 — horizon/weeks sliders + partial-hold table + "Value walk" + row-compare + per-row component breakdown bar; R5 — transparency panel (72/20) + off-list section + visual polish (criterion 5 — OpenRouter flagged it as V2's weakest); R6 — integration + full re-measure + gauntlet/smoke/dossier.`
4. `FASE 4: validate format/size strictly (gate 7/7, transcript gate, bundle --dry-run + check, both outputs shown); V1→final comparison table; UBA gate (prepare → validate → approve) BEFORE any CLI submit. NO SUBMIT without a fresh Gas from the user.`
5. `Submit best only, roni account only, Force_Last aware: the current counting entry is radar-5 (0.917926) via the final pick — V2 does NOT change the pick. Roni has used 6 of 10 total (V2 would be #7).`
- Profiles: `roni @roni-rockabilly ONLY (RULES.txt: "One account per person"; standing user order RONI-ONLY)`
- UBA job id: `3afeb07f-a2d3-4ab7-a3fd-3a21c4c48fe5` (created 2026-11-24 23:28 WIB, status queued)

## Lessons pulled (Step 0 feed-forward — REQUIRED)
- Lesson: `radar-9 (24 Nov 2026, graded 23:12 WIB): exact reproduction of radar-7 scored 0.858657 vs 0.923193 — 6.45pp lower, non-overlapping intervals. The grader harness moved (fde96184 → 969cfe34) in the same window, and the dossier was cut 247 B at the 65,536 B cap.` → Change to this plan: `V2 uses the FRESH kit (harness@969cfe34, scorer@86a42446) only; the dossier is budgeted with margin from the start; do not assume the dev set/grader is fixed — OpenRouter Q2 warns not to over-interpret a single dev score as model evidence.`
- Lesson: `radar-8 FASE 3 (24 Nov 2026): value LOO/WF + odds Brier UNCHANGED after 5 rounds of honest re-tests; only farm breadth + honest coverage moved, and farm profit FELL ($2,177 vs $3,675).` → Change to this plan: `V2 MUST bring a genuinely new model (the user's design), not another tuning round; the fitted coefficients are frozen as V1 once FASE 2 validates them.`
- Lesson: `radar-7 TOP10.md (23 Nov): the judge's margin scale punishes thinness more than a 2–3× miss — every top-10 model misses by 2–3×; what differs is the proof each term earned its place.` → Change to this plan: `invest the rounds in second-order proof (nested selection) and ownable farm framing, not in the miss number.`
- Lesson: `kevin #2 (24 Nov 19:41 WIB): a fresh receipt jumped #24 → tie at #1 the same day.` → Change to this plan: `dev rates move in hours; never report a provisional dev rate as won; the prize line is a moving tie, not a fixed wall.`
- Lesson: `round-4 rejection (24 Nov): thinking_reproduces 14.5% — dossier.json + screenshots/.gitkeep had no agent evidence.` → Change to this plan: `bundle EVERY session that writes entry files, including the ones that generate the dossier/screenshots; verify ≥ 30% coverage in bundle --dry-run before check.`
- Lesson: `anchor bug (22 Nov, AGENTS.md): repo init anchored to the wrong wallet cost a failed intake + quota.` → Change to this plan: `init the V2 repo with the roni keypair explicitly; verify freshness.json wallet (BnAYeRvf) immediately after init.`
- Lesson: `README 422 (radar-9 submit #1, 24 Nov): README had only the competition badge; the site requires THREE (competition + rank + reward).` → Change to this plan: `V2 README at ROOT carries ALL THREE badges; verified live before submit.`
- Lesson: `gta6-01 v9 (23 Nov, AGENTS.md): strict-transcripts bounty refused a --bundle submit — no live recording, no submit.` → Change to this plan: `this bounty is the INVERSE (bundle only, record refused HTTP 400) — never attempt record or --recording submit here.`

## Prediction (recorded BEFORE submit — do not edit after results)
- predictedScore: `(TO BE FILLED by FASE 3/4 with the measured local proxy — NOT a judge win rate, which cannot be measured locally. At FASE 1 the honest statement is: local proxy must hold value LOO < ×3.2194 AND WF < ×2.0668 (beat radar-7 on BOTH), odds Brier ≤ 0.1890/0.2093, farm watchlist ≥ 3, dossier ≤ 450,688 B. No dev win rate is predicted here because no judge games exist before submit.)`
- predictedRank: `(TO BE FILLED after FASE 3 measurement: "inside top 10 IF dev rate reaches 0.962052; else outside". At FASE 1: outside — counting entry radar-5 sits at 0.917926, rank 2,954.)`
- Prize line at prediction time: `0.962052 (fetched 2026-11-24 23:27 WIB)`
- Distance to money: `radar-7 0.923193 − 0.962052 = −3.8859pp; counting entry radar-5 0.917926 − 0.962052 = −4.4126pp; radar-9 0.858657 − 0.962052 = −10.3395pp (all need to GAIN that much on the rank key)`
- Confidence: `low — the gap must be closed by a new model + margin (criteria 2–4 presentation/evidence), not by local accuracy, and no local metric predicts a judge win rate; the V2 model terms are untested until FASE 2 measures them against the both-tests rule`

## Actual (filled ONLY after the official result is published)
- actualScore: `(empty until the official result)`
- actualRank: `(empty until the official result)`
- Outcome: `(empty)`
- Provisional vs finalized: `(provisional dev rates are NOT the result — record the finalized result here only)`

## Lessons (one line each, copied to LESSONS.md after the result)
- What raised the score most: `(empty)`
- What wasted time or failed: `(empty)`
- Do first next time: `(empty)`
