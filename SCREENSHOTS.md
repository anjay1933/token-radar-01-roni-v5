# SCREENSHOTS.md — radar-9 (fitted model, FASE 2 V1)

## Status

**PIL RENDERINGS (V1, 2026-11-24).** The three images in `screenshots/` are
drawn with PIL from the real built `out/data.js` (same KPI values, same board
rows, same derivation, same farm book) in the ink-navy + amber layout. They
are faithful rasterisations of the dashboard content, NOT browser captures.
FASE 4 replaces them with true browser captures of #board /
#detail/&lt;slug&gt; / #farm (see "Capture plan for FASE 4" below).

Renderer: `tools/render_screenshots.py` (quality is argv[1], default 62).
V1 was rendered at quality **38**.

## Byte budget (measured 2026-11-24, V1)

- Screenshots at quality 38 total **293,033 B** raw
  (1-board 109,469 / 2-detail 90,774 / 3-filtered 92,790).
- Dossier lands at **447,388 B** — under the 450,688 B target by 3,300 B.
  (Radar-7's FASE 3 note: q50 totals 352 KB raw and puts the dossier at
  518,330 B, over target; q40 totals ~297 KB raw and lands it at ~447 KB;
  q38 totals ~293 KB raw and lands it at ~443 KB. Radar-9 V1 at q38 lands
  at 447,388 B — the dashboard source grew by ~8 KB vs radar-7's V1, so
  headroom is thinner. Do not grow app.js without an offsetting cut.)
- Each image is ≤ 512 KiB (kit cap) and 1440×900 (long ≤ 1440, short ≥ 800).

## Capture plan for FASE 4 (true browser captures)

1. Install the Python `playwright` package (`pip install playwright` —
   the browsers are already cached in `~/.cache/ms-playwright/`:
   chromium-1148, chromium-1255 and the headless shells, so no browser
   download is needed). The module is NOT installed on this VM as of V1
   (verified 2026-11-24); the FASE 3 claim "no headless browser on this VM"
   was about the module, not the cached browsers.
2. Serve the built output: `cd out && python3 -m http.server 8123` (or open
   `out/dashboard/index.html` directly; `data.js` is loaded via relative path
   `../data.js`).
3. Viewport **1440 × 900** (long side 1440, short side 900 — inside the kit
   limits: long ≤ 1440, short ≥ 800).
4. Capture with `tools/capture_screenshots.py` (quality is argv[1],
   default 38); layout probe: `tools/probe_layout.py`. The script scrolls
   each view to its content (board table, detail derivation, farm aggregate)
   because the shared cover (hero + KPI + integrity + note, ~750px tall)
   sits above the view content on every view — an unscrolled capture shows
   the same cover on all three shots. Scrolls (tuned on radar-7's identical
   layout; re-verify with `probe_layout.py` after any dashboard change):
   board 3835, detail 940, farm 760.
5. Quality: start at 30 (radar-7's FASE 4: q38 totals 334,100 B raw and
   pushes the dossier to ~502 KB — over target; q30 totals 238,708 B and
   lands the dossier at 374,956 B). Re-measure the dossier after capture;
   keep it ≤ 450,688 B.
6. Replace the three files in `screenshots/`, re-run `node main.ts`
   (it copies them into `out/screenshots/` and rebuilds `dossier.json`),
   re-run `node tests/gauntlet.mjs`, and confirm the dossier bytes in the
   iteration log.

## The three views (all addressable by URL hash in the live dashboard)

| # | File | View | Hash | Content |
|---|---|---|---|---|
| 1 | `1-board.jpg` | Board | `#board` | Filter controls + board table header + top rows by implied value |
| 2 | `2-detail.jpg` | Detail | `#detail/sentora-curator` | Rank-1 row: derivation block, odds derivation, nearest traded peers, farm verdict, net matrix, farm plan |
| 3 | `3-filtered.jpg` | Filtered FARM book | `#farm` | FARM-only rows + farm-book aggregate (capital, hours, book net, book break-even "1 in 1.8") |

## Regenerating the PIL renderings (V1 method)

```sh
python3 tools/render_screenshots.py 38   # PIL, 1440x900, JPEG q38 -> screenshots/
node main.ts --input input/snapshot.json --output out   # copy shots + rebuild dossier
node tests/gauntlet.mjs                                # must stay 34/34
```
