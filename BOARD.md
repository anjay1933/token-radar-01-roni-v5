# BOARD.md — token-radar-01 V2 (roni @roni-rockabilly, FASE 1)

<!-- Winner-First Gate artifact. Filled from LIVE API data before any build.
     NEVER invent a number. Every data block carries source + timestamp. -->

## Bounty
- Slug: `token-radar-01`
- Title: `Build the best token launch radar`
- Pot: `$1,325 — 1st $1,000; 2nd–5th $50 each; 6th–10th $25 each`
- Deadline (entries close): `2026-12-14 17:00 WIB (2026-12-14T10:00:00.000Z)`
- Final phase / results: `Final 2026-12-14 17:10 WIB – 2026-12-15 05:10 WIB; leaderboard published within 1 day of the deadline unless a check holds it`
- Entry fee: `FREE`
- Status: `open` | acceptingSubmissions: `true`
- Harness / runtime: `program/v1, Node 22 (stdlib only), no network in sandbox, 1 CPU / 1024 MB / 120 s per run, program runs twice and both runs must write identical bytes`
- Submission rule: `Force_Last` (last submission before the deadline is the final entry; `makefun final` can pick an earlier one — current pick is radar-5 01a1fe16, NOT changed for V2)
- Repo / size limit: `dashboard/ ≤ 4 MiB and ≤ 400 files; board.json ≤ 8 MiB, 100–4,000 rows; dossier.json ≤ 1.5 MiB; dashboard source text shown to the judge ≤ 65,536 bytes; screenshots 3–4, each ≤ 512 KiB, long side ≤ 1440, short side ≥ 800`

source: `GET /api/competitions/token-radar-01` (detail endpoint) + fresh kit `RULES.txt`
fetched_at: `2026-11-24 23:27 WIB`

## Rank key
- **Rank key:** `judge win rate (dev win rate, Bradley-Terry fit over dev games vs fixed house dashboards)`
- **Direction:** `higher is better`
- **Tie-break (ALL of them):** `An exact tie on the win rate goes to (1) the entry that took more of the playoff games between the tied entries, then (2) the smaller dossier.json (fewer bytes), then (3) the earlier receipt. A provisional (dev) rate is never shown as tied. A displayed tie never moves a place.`
- **Reward bar:** `NONE — prizeGate is null; no score threshold before ranking matters. Any valid entry that reaches the final heat can place.`
- **Gate / hard fail:** `Sealed scorer, 7 checks (dashboard_files, board_file, sorted_by_value, coverage, farm_steps, screenshots, dossier_matches). Any fail → Valid 0, no rate, no reward. Transcript gate (9 checks) rejects before grading. An entry whose dossier is byte-for-byte a house dashboard plays as that dashboard and takes no reward.`
- **Final heat:** `After the deadline every final entry is screened on its dev rating: the line sits at place 40 (interval high vs 40th-best low among rated entries). Shortlist plays 3 Swiss rounds, then racing at the prize boundaries (48–96 games cap), then a playoff: the first 12 by rate play every pair once + 3 more games between the top two. Playoff players place above every non-playoff entry whatever the rates. Top 5 are held for finalist review (≤ 60 min).`

source: `RULES.txt in the fresh kit (read in full, 2026-11-24 23:27 WIB) — sections "The judge", "Heats", "Ranking", "Rewards", "The gate"`
fetched_at: `2026-11-24 23:27 WIB`

## Board (live scores)
- Scored entries: `18,938` (payload entries; competition `submissionCount: 31,265` — all submissions ever, including unscored/rejected ones)
- #1: `0.966767` — `kiencx, "Launch Radar v4: every value term fitted and tested held-out twice, token odds from the peers' record, integrity strip, costed farm verdicts"` (received `2026-11-20T02:36:22Z`, 20W/0D/0L)
- #2: `0.966767` — `kevin, "Firstlight v2: every value term kept or dropped on two blind tests (walk-forward x2.26, leave-one-out x2.99), range honesty, costed farm verdicts in $/hour"` (received `2026-11-24T12:41:18Z` — NEW entry today; kevin fell to #24 (0.95965) at 17:05 WIB and is back tied at #1 hours later on a fresh receipt)
- **PRIZE LINE (last paid place, rank 10): `0.962052`** — `rstrike, "Launch Radar Terminal"` (received `2026-11-19T06:05:10Z`, 20W/0D/0L)
- Rank 11: `0.962052` · rank 20: `0.960454` · rank 30: `0.958843` · rank 50: `0.956401` · rank 100: `0.953929` · median: `0.860921` · max: `0.966767` · min: `0.072010`
- Ties observed: `6 entries tied exactly at the prize line 0.962052 (ranks 8–13: sudhan, behzad-khanlar, rstrike, silver-ibis-46-1447, nightshift-labs, calm-owl-82) — inside the tie the dossier-bytes order decides.`
- Entries ≥ prize line: `13`. Entries ≥ 0.962846: `7`. Entries ≥ 0.963636: `5`. Entries ≥ 0.966767: `2`.
- Board movement (24 Nov): `kevin's NEW "Firstlight v2" receipt (19:41 WIB) went straight to a tie at #1 (0.966767) — dev rates move in hours and a fresh receipt can jump the whole board. The prize line held at 0.962052.`

source: `GET /api/competitions/token-radar-01/leaderboard?view=performance`
fetched_at: `2026-11-24 23:27 WIB`

## Our position (roni @roni-rockabilly)
- Radar-5 `01a1fe16-ad82-71df-bc50-c0244c84f78c`: dev win rate **0.917926**, board rank **2,954** (was ≈3,059 at 17:05 WIB). **This is the COUNTING entry** — final pick set 2026-11-21T12:48:56Z. Gap to the prize line: **4.4126pp**. The pick is NOT changed for V2 (user decision 23:24 WIB: "Bangun V2 aja, pick belakangan").
- Radar-7 `01a20a83-2489-7532-a282-318ed256bce9`: dev **0.923193** (12W/0D/0L), interval [0.897789, 0.948596]. **NOT on the public board payload.** Gap to the prize line: **3.8859pp**.
- Radar-9 `01a20da4-24c3-7407-a629-84ae37539f51`: dev **0.858657** (12W/0D/0L, provisional), interval [0.821225, 0.896089], graded 23:12 WIB. **NOT on the public board payload.** Exact reproduction of radar-7, scored **6.45pp LOWER** (intervals do not overlap — systematic, not noise). Gap to the prize line: **10.34pp**. The reproduction does NOT hurt the final standing (the radar-5 pick shields it).
- **Grader moved:** the harness that graded radar-9 is `harness@969cfe34` / `scorer@86a42446`; the v42 kit carried `harness@fde96184` / `scorer@b1e698c9`. The fresh kit downloaded 23:27 WIB carries the NEW harness/scorer — V2 MUST use the fresh kit, not the v42 kit. The grader change is a candidate explanation for part of the radar-9 drop (alongside the 247 B dossier cut). V2's analyst must not assume the dev set/grader is fixed.
- Quota (roni, CLI status 2026-11-24 23:27 WIB): `entries made 6 (kept: 5); left today 4 of 5; daily limit left 49 of 50; left under the hard limit 35 of 40; can submit now: yes`. RULES.txt caps at **10 submissions in all** per entrant → 6 used, **4 left by the stated cap** (V2 would be #7). The CLI's hard limit (40) and the RULES.txt cap (10) disagree; the playbook says honor can_submit (yes).

source: `GET /api/submissions/01a20da4-24c3-7407-a629-84ae37539f51` (radar-9 score, 23:18 WIB) + `node cli/makefun.mjs status --competition token-radar-01` (fresh kit CLI, @roni-rockabilly) + `node cli/makefun.mjs final token-radar-01` (pick state, 23:24 WIB)
fetched_at: `2026-11-24 23:27 WIB`

## Go / no-go (playbook Langkah 6)
- Prize depth: `10 / 18,938 = 0.053%` (✗ below the 0.5% playbook bar — but this is a judge bounty with 18,938 scored entries and a $1,325 pot; the bar is a heuristic, not a kit rule. The depth is thin because the field is enormous, not because the prize is small.)
- #1 and prize line not both at metric ceiling: `YES — #1/#2 0.966767 vs line 0.962052, gap 0.47pp; the metric ceiling is 1.0 and nobody is near it. Headroom exists but is narrow: the whole top 13 sits inside 0.47pp.`
- Reward bar passable with a method I know: `YES — there is NO reward bar (prizeGate null). The method is the user's V2 design (TR-V2-PREP.md, verified) + the new margin ideas from the 24 Nov top-10 study (see TOP10.md).`
- ≥1 technique name from top-20: `YES — "every value term fitted and tested held-out twice" (kiencx #1), "every value term kept or dropped on two blind tests" (kevin #2, NEW), "conformal intervals priced per kind" (swift-orca #7), "nested against picking by score" (silver-ibis #11), "Size up / break-even deposit" (lhowann #5, from its screenshots), "odds horizon slider" (darren #6, from its screenshots).`
- **Verdict: `GO`** — Target: `dev win rate ≥ 0.962052 (the prize line) on the rank key; stretch ≥ 0.963636 (#5). Local proxy targets before any submit: V2 value model must BEAT radar-7 on BOTH LOO and walk-forward (LOO < ×3.2194 AND WF < ×2.0668) or the V2 model is not an improvement; odds Brier LOO ≤ 0.1890 / WF ≤ 0.2093 HELD (no regression); farm watchlist FARM ≥ 3 via an honest rule change (Size-up framing); dossier ≤ 450,688 B (a tie at 0.962052 with a dossier ≤ 450,688 B would place inside the tie group ahead of sudhan's 450,689 B). CONDITION: the V2 model terms must survive the both-tests rule — if the category multiple / age boost fail both tests, the correct outcome is to drop them and report it, not to ship them untested.`

## Multi-account (RULES.txt, read in full)
- RULES.txt multi-account rule: `"One account per person. A team enters under one account and splits any reward itself."` (section "Submitting") and disqualification for `"more than one account per person"` (section "Disqualification").
- Decision: `SINGLE-ACCOUNT ONLY — roni @roni-rockabilly. The agent account (nimble-falcon-86) must NOT enter this bounty. This matches the standing user order (RONI-ONLY for new bounties, 2026-11-23) and the kit rule.`

---
Kit provenance: fresh kit downloaded `2026-11-24 23:27 WIB` (`curl https://make.fun/c/token-radar-01/kit`, 8,670,542 B) into this workdir as `token-radar-01-kit/`; harness `harness@969cfe348c3989824c494a9976b5c125c05ac1f3092317a1f98d7242624f9e17 node v26.13.1`; scorer `scorer@86a424468b6ba4afaf727c7899286569eb2923586c5e9a9010ea609c10f503f7 program@09a3c69e80790f73fe3f77b15788aeefd7975f9237e2051a9ef3603de3d55da2`; bundle_sha256 `ea1c9dccab78e6846655e81b921a79465c7267677ea2e0908624ddbc8a012d43`; snapshot `input/snapshot.json` sha256 `42a71213519479f3a180cc5010cbbf6bd18a2447fa0ad29e4c5122b6c9184393` — IDENTICAL to the v5/v9 kit snapshot (sealed, unchanged). RULES.txt differs from the v42 kit in ONE line only (harness-src.tar.gz sha256 43459ff1… → 60384b70…). The v42 kit is STALE — do not use it for V2.
