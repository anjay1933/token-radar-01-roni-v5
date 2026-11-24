# BOARD.md — token-radar-01 (radar-9 FASE 1)

<!-- Winner-First Gate artifact. Filled from LIVE API data before any build.
     NEVER invent a number. Every data block carries source + timestamp. -->

## Bounty
- Slug: `token-radar-01`
- Title: `Build the best token launch radar`
- Pot: `$1,325 — 1st $1,000; 2nd–5th $50 each; 6th–10th $25 each`
- Deadline (entries close): `2026-12-14 17:00 WIB (2026-12-14T10:00:00.000Z)`
- Final phase / results: `Final 2026-12-14 17:10 WIB – 2026-12-15 05:10 WIB (10:10–22:10 UTC); leaderboard published within 1 day of the deadline unless a check holds it`
- Entry fee: `FREE (entryFeeUsd null, entryFeesUsd "0.00")`
- Status: `open` | acceptingSubmissions: `true`
- Harness / runtime: `program/v1, Node 22 (stdlib only), no network in sandbox, 1 CPU / 1024 MB / 120 s per run, program runs twice and both runs must write identical bytes`
- Submission rule: `Force_Last` (last submission before the deadline is the final entry; `makefun final` can pick an earlier one — see the radar-5/radar-7 note below)
- Repo / size limit: `dashboard/ ≤ 4 MiB and ≤ 400 files; board.json ≤ 8 MiB, 100–4,000 rows; dossier.json ≤ 1.5 MiB; dashboard source text shown to the judge ≤ 65,536 bytes; screenshots 3–4, each ≤ 512 KiB, long side ≤ 1440, short side ≥ 800`

source: `GET /api/competitions/token-radar-01` (detail endpoint) + fresh kit `RULES.txt`
fetched_at: `2026-11-24 17:05 WIB`

## Rank key
- **Rank key:** `judge win rate (dev win rate, Bradley-Terry fit over dev games vs fixed house dashboards)`
- **Direction:** `higher is better`
- **Tie-break (ALL of them):** `An exact tie on the win rate goes to (1) the entry that took more of the playoff games between the tied entries, then (2) the smaller `dossier.json` (fewer bytes), then (3) the earlier receipt. A provisional (dev) rate is never shown as tied. A displayed tie never moves a place.`
- **Reward bar:** `NONE — prizeGate is null; no score threshold before ranking matters. Any valid entry that reaches the final heat can place.`
- **Gate / hard fail:** `Sealed scorer, 7 checks (dashboard_files, board_file, sorted_by_value, coverage, farm_steps, screenshots, dossier_matches). Any fail → Valid 0, no rate, no reward. Transcript gate (9 checks) rejects before grading. An entry whose dossier is byte-for-byte a house dashboard plays as that dashboard and takes no reward.`
- **Final heat:** `After the deadline every final entry is screened on its dev rating: the line sits at place 40 (interval high vs 40th-best low among rated entries). Shortlist plays 3 Swiss rounds, then racing at the prize boundaries (48–96 games cap), then a playoff: the first 12 by rate play every pair once + 3 more games between the top two. Playoff players place above every non-playoff entry whatever the rates. Top 5 are held for finalist review (≤ 60 min).`

source: `RULES.txt in the fresh kit (read in full, 2026-11-24 17:10 WIB) — sections "The judge", "Heats", "Ranking", "Rewards", "The gate"`
fetched_at: `2026-11-24 17:10 WIB`

## Board (live scores)
- Scored entries: `18,400` with a judge value (payload entries: `18,714`; competition `submissionCount: 30,668` — all submissions ever, including unscored/rejected ones)
- #1: `0.966767` — `kiencx, "Launch Radar v4: every value term fitted and tested held-out twice, token odds from the peers' record, integrity strip, costed farm verdicts"` (received `2026-11-20T02:36:22Z`, 20W/0D/0L, 90% interval [0.955228, 0.978305], 780,687 B)
- **PRIZE LINE (last paid place, rank 10): `0.962052`** — `silver-ibis-46-1447, "Pre-Token Radar v8: implied value from TVL, 7-day growth and age; odds terms set by rule and checked nested against picking by score"` (received `2026-11-24T00:52:18Z`, 20W/0D/0L, 1,297,840 B)
- Rank 11: `0.962052` · rank 20: `0.960454` · rank 30: `0.958843` · rank 50: `0.956401` · rank 100: `0.953098` · median: `0.860921` · max: `0.966767` · min: `0.072010`
- Ties observed: `7 entries tied exactly at the prize line 0.962052 (ranks 7–13: sudhan 450,689 B; behzad-khanlar 853,857 B; rstrike 1,142,803 B; silver-ibis-46-1447 1,297,840 B; brisk-kestrel-93 1,414,933 B; nightshift-labs 1,422,960 B; calm-owl-82 1,534,202 B) — inside the tie the dossier-bytes order decides, so sudhan (smallest) holds rank 7. 5 tied at 0.961255, 5 tied at 0.960454.`
- Entries ≥ prize line: `13`. Entries ≥ 0.962846: `6`. Entries ≥ 0.963636: `4`.
- Board movement (24 Nov): `THREE new entries hit the top 10 within ~9 hours — #4 lhowann 0.963636 (recv 01:58 UTC), #5 darren-mitch-vicente 0.962846 (recv 04:48 UTC), #10 silver-ibis-46-1447 0.962052 (recv 00:52 UTC). kevin fell from #2 (0.966767) to #24 (0.95965) in the same window — dev rates MOVE as the tournament plays. The prize line itself held at 0.962052 only because 7 entries tie there.`

source: `GET /api/competitions/token-radar-01/leaderboard?view=performance`
fetched_at: `2026-11-24 17:05 WIB`

## Our position (roni @roni-rockabilly) — CORRECTION to the handoff
- Radar-7 `01a20a83-2489-7532-a282-318ed256bce9`: dev win rate **0.923193** (12W/0D/0L), interval [0.897789, 0.948596]. **NOT on the public board payload** (exact-ID match = 0). By count, 2,483 entries score ≥ 0.923193, so its board rank would be ≈ **2,484**. Gap to the prize line: **3.8859pp**.
- **CORRECTION — radar-7 is NOT the counting entry.** `node cli/makefun.mjs status` (fresh kit CLI, account @roni-rockabilly, 2026-11-24 ~17:15 WIB) shows radar-7 as `scored (superseded)` and: *"Your final is 01a1fe16-ad82-71df-bc50-c0244c84f78c: you picked it, so it counts instead of this one."* The entry that currently COUNTS is **radar-5 `01a1fe16` (round 3, scored), dev win rate 0.917926, board rank ≈ 3,059** (3,058 entries ≥ 0.917926). Gap to the prize line: **4.4126pp**. Radar-7 can be restored as final with `node cli/makefun.mjs final token-radar-01 01a20a83-2489-7532-a282-318ed256bce9` before the deadline — that is a coordinator decision, NOT taken in this FASE 1.
- Quota (roni, same status call): `entries made 5 (kept: 4); left today 5 of 5; daily limit left 50 of 50; left under the hard limit 36 of 40; can submit now: yes`. RULES.txt caps at **10 submissions in all** per entrant → 5 used (rounds 1–5), **5 left** by the stated cap. (Round 4, `01a20a7b`, was REJECTED on `thinking_reproduces`: transcripts covered only 14.5% of counted lines — dossier.json + screenshots/.gitkeep had no agent evidence. Lesson for radar-9: bundle the sessions that write the dossier/screenshots too.)
- Radar-8: built, NOT submitted, NOT the counting entry. Its measured deltas vs radar-7 (value LOO/WF and odds Brier UNCHANGED; farm breadth 83 vs 42, watchlist 0→1, honest-WF coverage 65.7%→71.4%, farm profit DOWN $2,177 vs $3,675) do not predict closing the 3.89pp gap.

source: `GET /api/submissions/01a20a83-2489-7532-a282-318ed256bce9` (radar-7 score, prior FASE 1) + `node cli/makefun.mjs status --competition token-radar-01` (fresh kit CLI, @roni-rockabilly)
fetched_at: `2026-11-24 17:15 WIB`

## Go / no-go (playbook Langkah 6)
- Prize depth: `10 / 18,400 = 0.054%` (✗ below the 0.5% playbook bar — but this is a judge bounty with 18,400 scored entries and a $1,325 pot; the bar is a heuristic, not a kit rule. The depth is thin because the field is enormous, not because the prize is small.)
- #1 and prize line not both at metric ceiling: `YES — #1 0.966767 vs line 0.962052, gap 0.47pp; the metric ceiling is 1.0 and nobody is near it. Headroom exists but is narrow: the whole top 13 sits inside 0.47pp.`
- Reward bar passable with a method I know: `YES — there is NO reward bar (prizeGate null). The method is the radar-7/8 model + new margin ideas from the 24 Nov top-10 study (see TOP10.md + idea list in the parent report).`
- ≥1 technique name from top-20: `YES — "every value term fitted and tested held-out twice" (kiencx #1, fikril07 #14), "conformal intervals priced per kind" (swift-orca #6), "nested against picking by score" (silver-ibis #10), "Size up / break-even deposit" (lhowann #4, from its screenshots), "odds horizon slider" (darren #5, from its screenshots).`
- **Verdict: `GO (conditional)`** — Target: `dev win rate ≥ 0.962052 (the prize line) on the rank key; stretch ≥ 0.963636 (#4). Local proxy targets before any submit: value WF ≤ ×2.07 AND LOO ≤ ×3.22 HELD (no regression), odds Brier LOO ≤ 0.1890 / WF ≤ 0.2093 HELD, farm watchlist FARM ≥ 3 via an honest rule change (not count inflation), dossier ≤ 450,688 B (a tie at 0.962052 with radar-7's 374,956 B would place FIRST in the tie group, rank #7). CONDITION: the builder must bring a genuinely NEW idea (see idea list) — radar-8 proved further tuning of the same model is at its honest ceiling. If no new idea survives its both-tests check, the correct outcome is NO SUBMIT, not a tuned resubmit.`

## Multi-account (RULES.txt, read in full)
- RULES.txt multi-account rule: `"One account per person. A team enters under one account and splits any reward itself."` (section "Submitting") and disqualification for `"more than one account per person"` (section "Disqualification").
- Decision: `SINGLE-ACCOUNT ONLY — roni @roni-rockabilly. The agent account (nimble-falcon-86) must NOT enter this bounty. This matches the standing user order (RONI-ONLY for new bounties, 2026-11-23) and the kit rule.`

---
Kit provenance: fresh kit downloaded `2026-11-24 17:04 WIB` (`curl https://make.fun/c/token-radar-01/kit`, 8,536,876 B) into this workdir; snapshot `input/snapshot.json` sha256 `42a71213519479f3a180cc5010cbbf6bd18a2447fa0ad29e4c5122b6c9184393` — IDENTICAL to the v5 kit snapshot (sealed, unchanged). Harness `harness@1adec795a0c7c05bfdd426f110c32805b159da5b574afd722fbac675f334f0d3 node v26.13.1`; bundle_sha256 `ea1c9dccab78e6846655e81b921a79465c7267677ea2e0908624ddbc8a012d43`.
