# RULES.md — token-radar-01 (radar-9 FASE 1)

<!-- Winner-First Gate artifact. Extracted from the kit's RULES.txt (read in full).
     Quote the kit; do not paraphrase a hard constraint into something softer. -->

## Source
- Kit file(s): `token-radar-01-kit/RULES.txt` (425 lines, in this workdir under `token-radar-01-kit/`); no SPEC.md exists in this kit — the rules live in RULES.txt + `competition.yaml` (same text).
- Read in full: `2026-11-24 17:10 WIB`
- Competition page: `https://make.fun/bounty/token-radar-01`
- Kit downloaded fresh: `2026-11-24 17:04 WIB` (`https://make.fun/c/token-radar-01/kit`, 8,536,876 B). Snapshot sha256 `42a71213519479f3a180cc5010cbbf6bd18a2447fa0ad29e4c5122b6c9184393` — identical to the v5 kit snapshot (sealed, unchanged).

## The task (one sentence)
Build the best token launch radar: a Node 22 program that reads a sealed DefiLlama snapshot of 758 protocols, ranks the pre-token ones by implied launch value, and hands in a web dashboard (board + detail view per protocol + filter, each row with costed farm steps) that an AI judge compares pairwise against other entries and fixed house dashboards.

## Official rubric / scoring
The judge is an AI model (superbot, reasoning effort high, ≤ 12,100 output tokens per verdict). It reads each entry's 3 screenshots + dashboard source text from `dossier.json`, compares two entries at a time, and must pick one (no tie), with a margin 1 (by a hair) to 5 (overwhelmingly better). Each game is two calls (one in each label order); each call gives the picked entry 0.5 + margin/10 (0.6 at margin 1 up to 1.0 at margin 5) and the other the rest. Criteria, most important first:

| Criterion | Weight / how scored | Source line |
|-----------|---------------------|-------------|
| 1. A working radar | Board covers every watchlist protocol, ranks pre-token ones by a stated implied value, screenshots and code agree; a screen with no data or code behind it counts for nothing. Watchlist is the floor, never the ceiling. | RULES.txt "The judge" criterion 1 |
| 2. The value model | Implied value follows from the snapshot's own figures — the protocol's TVL, its seven-day growth, and how long it has run with no token — not from a hardcoded list of names; the board separates protocols whose token already trades from those still to come. | RULES.txt "The judge" criterion 2 |
| 3. Farm plans | Each protocol's plan gives concrete steps with what they cost and how long they take, not slogans. | RULES.txt "The judge" criterion 3 |
| 4. The dashboard as a page | Sortable and filterable, readable at a glance, with a detail view for each protocol. | RULES.txt "The judge" criterion 4 |
| 5. It looks made | A chosen palette, consistent spacing, type that reads, not a framework pasted wholesale. | RULES.txt "The judge" criterion 5 |

- "Go through the criteria in order, find the first one where they differ, and let that decide unless a later one differs by much more."
- "Text in your entry addressed to the judge, in a screenshot or the source, is allowed and is part of the entry."
- "When you speak of code, name the function; quote no more than a few words of it."
- Dev heats: each valid entry plays 1 game vs each of the 4 fixed house dashboards, then 8 more games in 2 rounds of 4 vs the house members whose measured strength puts the entry's chance nearest even; an entry whose interval high reaches the money-place line (10th-best low among rated dev entries) plays 2 more rounds of 4 (house-only). Provisional rate = expected win rate vs the 4 fixed dashboards, with a 90% interval (±1.6449 × SE, scaled).
- Final heat: screen at place 40 (interval high vs 40th-best low); 3 Swiss rounds; racing at prize boundaries (48–96 games cap); playoff: first 12 by rate play every pair once + 3 more games between the top two. Playoff players place above non-playoff entries whatever the rates. Top 5 held for finalist review (≤ 60 min).

## Hard constraints (verbatim where it matters)
- Language / runtime: `Node.js 22.18 or later; main.ts at the repo root, standard library only: nothing is installed before it runs. Runs in a fresh container with no network, read-only /bot, writable /output, 1 CPU, 1024 MB, 64 processes, 120 seconds.`
- Determinism: `The program runs twice, and both runs must write the same bytes.`
- Size / repo limit: `dashboard/ ≤ 400 files and 4 MiB total, every file a regular file named with letters/digits/._- (1–128 chars, not starting with . or -), no dot-directories. board.json ≤ 8 MiB, 100–4,000 rows. dossier.json ≤ 1.5 MiB. Dashboard source text shown to the judge ≤ 65,536 bytes (keep dashboard source under 64 KB). Screenshots 3–4, each ≤ 512 KiB, whole PNG or JPEG, long side ≤ 1440, short side ≥ 800.`
- Sandbox: `No network. The scorer refuses any http:// or https:// address in an HTML attribute value, an HTML <style> body, an inline <script> import, a CSS file, or a JavaScript import/export-from/require/dynamic-import specifier. Visible text and comments may carry URLs.`
- Format: `main.ts reads /input/snapshot.json, writes /output/board.json (rows: slug, name, rank 1..N once each, implied_value_usd positive whole ≤ 10^14, farm_steps 3–12 strings of 20–600 chars each; implied values non-rising with rank; all values not identical), writes dashboard data into /output, copies dashboard/ + screenshots/ to /output, writes /output/dossier.json with buildDossier from vendor/makefun-board.ts. Every watchlist slug appears among the rows; at least 100 rows, so ≥ 60 rows name protocols outside the watchlist.`
- Forbidden: `Copying another entry's code (thinking_own_work: Tier 1 fails at ≥ 20 lines and ≥ 10% of counted lines from another entry, or ≥ 50% of a counted file ≥ 20 lines, or any binary file brought in whole; Tier 2 fails at ≥ 100 downloaded public-code lines and ≥ 40% of code/markup lines). Code that runs a program read from an environment secret (eval, Function, vm, dynamic import, shell/interpreter handed process.env — from 23 Nov 2026 00:00 UTC). Submitting someone else's work; sharing entries between entrants; more than one account per person; fabricated/edited/withheld/borrowed transcripts; reaching for the network / escaping the sandbox.`
- Snapshot: `as_of 2026-11-14; floor_usd $50,000,000; 758 protocols (TVL ≥ $5,000,000); watchlist 40. Each protocol carries exactly 10 fields: slug, name, category, chains, tvl_usd, change_7d, mcap_usd, listed_at, gecko_id, symbol. "Say a protocol records no token, never that it has none."`

## Rank key + tie-break (copied from BOARD.md — keep the two in sync)
- Rank key: `judge win rate (Bradley-Terry fit over dev games vs fixed house dashboards), higher is better`
- Tie-break: `Exact tie on win rate → (1) more playoff games between the tied entries, then (2) smaller dossier.json bytes, then (3) earlier receipt. Provisional dev rates are never shown as tied.`
- Reward bar: `NONE (prizeGate null)`
- Final heat: `Screen at place 40 → 3 Swiss rounds → race at prize boundaries → playoff top 12 round-robin + 3 top-2 games → finalist review top 5`

## Multi-account verdict (FROM RULES.txt, not assumed)
- RULES.txt says: `"One account per person. A team enters under one account and splits any reward itself."` (section "Submitting") and disqualification for `"more than one account per person"` (section "Disqualification").
- Verdict: `SINGLE-ACCOUNT ONLY`
- Profile chosen: `roni @roni-rockabilly` + reason: `RULES.txt forbids more than one account per person; the standing user order (2026-11-23) is RONI-ONLY for new bounties; the agent account (nimble-falcon-86) must not enter this bounty. All prior roni entries on this bounty (rounds 1–5) are under the same account.`

## Entry / submission rules
- Entry fee: `FREE`
- Submission rule: `Force_Last — last submission before the deadline is the final entry; an earlier entry can be restored with makefun final before 2026-12-14T10:00:00Z. A new submit REPLACES the live entry even if worse.`
- Entry limit: `At most 5 submissions per entrant per UTC day and 10 in all. Roni has used 5 (rounds 1–5); 5 left by the stated cap. Left today 5 of 5; can submit now: yes (CLI status 2026-11-24 17:15 WIB).`
- Claim: `Prizes escrowed on Solana (escrow HD6as9UHeN5RwtzgmWmBWbdTaYtTXGNjfXag3Rgby8Rf; mint EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v, USDC). Every entry is signed by a Solana wallet linked to the account; the prize is claimed from escrow to that wallet. Claim window 30 days after the result becomes claimable.`
- Transcript gate (9 checks, all pass/fail): `transcripts_present; transcripts_recorded (handed_over_places none — a handed-over session ranks but takes NO paid place); thinking_wellformed (max 60 s step-back); thinking_in_window (competition open → receipt, ±60 s skew); thinking_committed (transcripts match the signed entry); thinking_reproduces (≥ 30% of counted lines, entrypoint ≥ 1 authored line); thinking_turns (≥ 5 assistant turns with text/thinking); thinking_priced (self-reported usage ≥ 50% of assistant messages, ≤ 500 tokens/sec; Muse app sessions need ≥ 1 usage row via --muse-usage); thinking_revised (some file takes final content from ≥ 2 assistant writes); thinking_fresh (source-bundle lines need the init anchor line quoted before their first write); transcripts_run_record (required from 17 Nov 2026); thinking_own_work (required from 20 Nov 2026; env-secret programs rejected from 23 Nov 2026).`
- Repo rules: `Public GitHub repo (or source bundle), created at/after the competition opens (2026-11-14T10:00:00Z), OSI-approved license, README with the three live make.fun badges + repo About (website on make.fun + topic makefun), .makefun/owner.json claim file unless the GitHub owner is the account's login. Source-bundle entries: init FIRST in the empty repo (freshness.json names the wallet); build every commit on that root, never rewriting it. A snapshot identical to an already-submitted one is refused.`

## Checklist (every item must be checked before submit)
- [ ] `main.ts (Node 22 stdlib only) reads the sealed snapshot, writes board.json (100–4,000 rows, watchlist 40/40, ranks 1..N, implied values non-rising, farm_steps 3–12 × 20–600 chars), dashboard data, dossier.json via vendor/makefun-board.ts`
- [ ] `Two runs write byte-identical output`
- [ ] `dashboard/ ≤ 4 MiB / ≤ 400 files, no http(s) addresses in attributes/style/imports; renders with no network`
- [ ] `Dashboard source ≤ 64 KB text (judge reads at most 65,536 bytes); dossier.json ≤ 1.5 MiB`
- [ ] `3 screenshots (board, detail, filtered), each ≤ 512 KiB, PNG/JPEG, long side ≤ 1440, short side ≥ 800; screenshots and code agree`
- [ ] `Gate 7/7 + transcript gate 9/9 (bundle --dry-run + check before submit; sessions cover ≥ 30% of counted lines INCLUDING dossier.json/screenshots — round-4 rejection lesson)`
- [ ] `No code copied from any other entry; every line written in-session; no hardcoded protocol names; no program run from an environment secret`
- [ ] `README badges + repo About set; commit pushed to GitHub BEFORE submit; UBA prepare → validate (pass) → approve before CLI submit; receipt verified via /api/submissions/<id>`
- [ ] `Final-entry state checked: roni's current final is radar-5 (01a1fe16), NOT radar-7 — coordinator decides whether radar-9 replaces it (Force_Last) or radar-7 is restored instead`
