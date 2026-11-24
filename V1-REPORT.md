# V1-REPORT.md — radar-9 (token-radar-01, roni-rockabilly) — FASE 2 baseline

## What was built

Entry structure (Node 22+, stdlib only, no network, no dependencies), following
the kit starter's output layout exactly. Unlike radar-7's V1 (which was built
on stub coefficients before MODEL-SPEC arrived), radar-9 V1 implements the
fitted model from the start — the fitted values are carried over from radar-7
(our own prior entry, same snapshot, same analysis), and V1's job is to
reproduce them exactly.

| File | Bytes | What it is |
|---|---|---|
| `main.ts` | 4,806 | Orchestrator: deriveAll → buildRadar → boardIssue → writes `out/` (board.json, data.js, dashboard/, screenshots/, dossier.json) |
| `lib/model.ts` | 77,623 | The whole pipeline: `deriveAll`, `selectUniverse`, `fitValue`, `testTerms`, `fitOdds`, `bootstrapBands`, `farmPlan`, `checkBoard`, `buildRadar`, `boardIssue`, `dataScript` |
| `vendor/makefun-board.ts` | 19,788 | Kit vendored dossier library (copied from the starter, per its header) |
| `input/snapshot.json` | 247,940 | Kit snapshot, copied unmodified |
| `dashboard/index.html` | 473 | Shell; loads `../data.js` + `app.js` |
| `dashboard/app.js` | 49,698 | Dashboard logic: KPI strip, integrity recompute, evidence + ledger, sortable/filterable/searchable board, controls, detail view, FARM book, CSV/JSON export, hash routing |
| `dashboard/style.css` | 4,653 | Ink-navy + amber — radar-9's own palette, not a copy of any top-10 palette |
| `dashboard/` total | 54,824 | 3 files — fits the 65,536 B dossier text cap whole |
| `screenshots/1-board.jpg` | 109,469 | Board view, 1440×900 JPEG (PIL rendering — see SCREENSHOTS.md) |
| `screenshots/2-detail.jpg` | 90,774 | Detail view (#1 Sentora Curator), 1440×900 JPEG (PIL rendering) |
| `screenshots/3-filtered.jpg` | 92,790 | FARM book view, 1440×900 JPEG (PIL rendering) |
| `tests/gauntlet.mjs` | 12,927 | Test harness (see below) |
| `tests/dashboard-smoke.mjs` | 7,451 | Dashboard render checks against the built data.js |
| `tools/render_screenshots.py` | 16,702 | PIL screenshot renderer (build support, not entry code) |
| `tools/capture_screenshots.py` | 2,419 | FASE 4 true browser captures (Playwright; module not yet installed) |
| `tools/probe_layout.py` | 1,716 | FASE 4 layout probe for capture scroll positions |
| `out/board.json` | 451,549 | 198 rows |
| `out/data.js` | 713,236 | `window.RADAR` dataset for the dashboard |
| `out/dossier.json` | **447,388** | Byte-for-byte what `buildDossier` writes |

## Reproduction check — V1 vs radar-7 (all exact)

| Metric | Radar-7 (target) | Radar-9 V1 (measured) | Match |
|---|---|---|---|
| Rows / tiers | 198 (40 / 138 / 20) | 198 (40 / 138 / 20) | ✓ |
| Total implied | $880,995,215 | $880,995,215 | ✓ |
| Total launch / TVL | $1,952,887,686 / $20,707,499,265 | $1,952,887,686 / $20,707,499,265 | ✓ |
| Value LOO / WF / 5-fold | ×3.2194 / ×2.0668 / ×3.0188 | ×3.2194 / ×2.0668 / ×3.0188 | ✓ |
| Odds Brier LOO / 10-fold / WF | 0.1890 / 0.1868 / 0.2093 | 0.1890 / 0.1868 / 0.2093 | ✓ |
| Coverage LOO P25–P75 / P10–P90 | 50.0% (46/92) / 82.6% (76/92) | 50.0% (46/92) / 82.6% (76/92) | ✓ |
| Coverage honest WF P25–P75 / P10–P90 | 57.1% (20/35) / 65.7% (23/35) | 57.1% (20/35) / 65.7% (23/35) | ✓ |
| Farm per-row | 42 / 41 / 115 | 42 / 41 / 115 | ✓ |
| Farm $1k / $10k | 0/55/143, 20/60/118 | 0/55/143, 20/60/118 | ✓ |
| Slope | 0.378 | 0.37803061564497553 | ✓ |
| Rank 1 | Sentora Curator $25,058,273 | Sentora Curator $25,058,273 | ✓ |
| Integrity checks | 7/7 | 7/7 | ✓ |

Two MODEL-SPEC corrections surfaced by the reproduction (documented in
MODEL-SPEC.md's built-vs-analyst note): the analyst's §5 totals
($880,995,220 / $1,952,887,690) are $5/$4 above the built sums of rounded
whole-dollar rows — the build is the authority; and the analyst's odds
10-fold Brier (0.187834) vs the built seed-11 value (0.1868) — same verdicts,
dashboard prints the built value.

## Board (fitted model, real computation)

- **198 rows: 40 watchlist + 138 early + 20 off-list.** Total implied
  **$880,995,215**. Rank 1: Sentora Curator $25,058,273. Median implied
  $3,283,893; P90 $9,146,281; min $387,934 (Mezzanine).
- **Ledger: 758/758.**
- **Value terms (LOO / walk-forward):** size curve ×3.2693 / ×2.1057 (base);
  +growth ×3.2224 / ×2.0924 (kept, thin); +chains ×3.2194 / ×2.0668 (kept,
  final). Category, age, control tested, not kept. Flat baseline ×4.6468 /
  ×4.5195 / ×4.8826. 5-fold by size ×3.0188.
- **Odds (442 peers, 244 record a token):** Brier LOO 0.1890 / 10-fold 0.1868 /
  walk-forward 0.2093 vs base 0.2484 / 0.2473 / 0.3523 (−24% / −24% / −41%).
  Hit rate at 0.5 (WF): 67.2%.
- **Intervals:** predictive bands ×0.3007–×2.9556 (P25–P75), ×0.0976–×13.300
  (P10–P90). Coverage LOO 50.0%/82.6%, WF 57.1%/82.9%, honest WF 57.1%/65.7%
  (P10–P90 under 80% — admitted on the board).
- **Farm verdicts: FARM 42 / MARGINAL 41 / SKIP 115** (per-row deposit, cap
  $25,000). Per-row book: capital $513,405; fees $63.72; T-bill forgone
  $4,739.12; hours 147.0; slices if all launch $8,477.84; net $3,675.00;
  book break-even 1 in 1.8. Watchlist: 0 FARM at any deposit (structural).
- **Integrity strip: all 7 checks pass** (rows recomputed = board.json 198/198,
  ranks in order, values never rise, totals equal, checksum = main.ts,
  watchlist 40/40, ledger 758/758). Checksum `b61666de`.

## Gauntlet results

`node tests/gauntlet.mjs` — **34 passed, 0 failed**:

- (a) Real snapshot: exit 0, 198 rows, tiers 40/138/20, watchlist 40/40, total implied positive.
- (b) Corrupted inputs (8): truncated JSON refuses cleanly (exit 1, no board);
  missing fields, all-null change_7d, all-missing listed_at, TVL 0, negative TVL,
  duplicate slugs (deduped, board still 198), unknown categories — all still build.
- (c) Edge cases (5): no-token + no-age + null-7d (Mezzanine, implied $3,769,428);
  TVL exactly $50M floor; age > 5 yr (2,874 d); 20+ chains (25 chains, implied
  $252,743); tiny synthetic snapshot refuses cleanly with a board message (exit 1).
- (d) Determinism: two runs byte-identical (board.json, data.js, dossier.json).
- (e) Gate limits (15): board 198 rows / 451,549 B ≤ 8 MiB; implied positive
  whole ≤ 1e14; farm steps 3–12 of 20–600 chars; ranks in order, values never
  rise; dossier 447,388 B ≤ 1.5 MiB **and ≤ 450,688 B byte target**; dashboard
  54,824 B / 3 files; dashboard source 54,824 B ≤ 65,536 text cap; 3 screenshots
  ≤ 512 KiB, 1440×900; ledger 758; integrity checks pass.

## Dashboard smoke results

`node tests/dashboard-smoke.mjs` — **27 passed, 0 failed**: KPI numbers,
evidence tables, coverage admissions, ledger, live farm mirror reproducing
board verdicts at defaults (FARM 42/42, MARGINAL 41/41, SKIP 115/115),
Sentora detail (launch $43,132,939, implied $25,058,273, logit → ever 58.1%
→ remaining 88.1%, age-bin peers, sensitivity exact-ratio values), undated
detail, FARM-row detail, farm book aggregates ($513,405 · $3,675.00 ·
1 in 1.8), watchlist-gap explanation, sensitivity grid, Noble over-cap truth.

## Determinism check

Two full runs: `board.json`, `data.js`, `dossier.json` byte-identical (sha256
compared in the gauntlet). No `Date.now`/random in outputs; the only
randomness is the seeded LCG (seed 20261114) in `bootstrapBands`.

## Dossier bytes

**447,388 B** — under the **450,688 B target** by 3,300 B (beats sudhan's
450,689 B by 3,301 B), under the 650,000 B acceptable line, and far under the
1,422,960 B hard ceiling. Biggest contributors: screenshots base64 (~390 KB
of the dossier), dashboard source text (~55 KB). Headroom is thin — no
further app.js growth without an offsetting cut; never cut rubric content.

## Runtime

- `node main.ts --input input/snapshot.json --output out`: **~3.1 s wall**
  (grader limits: 120 s, 1,024 MB). Node v24.22.1 local; code is erasable
  TypeScript (no enums/namespaces/parameter properties) for the Node 22 grader.

## What is NOT yet done

1. **FASE 3 rounds 2–5** — see ITERATION-LOG.md. Round 2 (119-comp fit)
   already ran: DROP (see log).
2. **Screenshots are PIL renderings, not browser captures** — Python
   `playwright` is not installed on this VM (browsers are cached, though).
   FASE 4 must install it and replace all three with true captures of
   `#board` / `#detail/<slug>` / `#farm` at 1440×900 per SCREENSHOTS.md.
3. **Dashboard smoke test in a real browser** — `app.js` passes the Node VM
   stub render, but no real browser render has been run yet. FASE 4 must
   open `out/dashboard/index.html` in a real browser and click through
   board → detail → farm.
4. No git push, no CLI submit, no bundle submit performed (per task rules).
   No API keys, keypairs, or recovery phrases written anywhere.
