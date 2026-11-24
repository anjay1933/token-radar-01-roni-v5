# Token Radar — radar-9 (make.fun token-radar-01, profile B / @roni-rockabilly)
[![make.fun · token-radar-01](https://make.fun/badge/token-radar-01.svg)](https://make.fun/bounty/token-radar-01?utm_source=github&utm_medium=readme&utm_campaign=token-radar-01)

A token-launch radar: 198 pre-token protocols ranked by an implied value derived
only from the sealed DefiLlama snapshot, plus launch odds, conformal intervals,
and costed, deposit-sized farm plans. Light paper/navy/amber dashboard, written
from scratch for this entry.

## Model radar-9

```text
log10(V) = 4.1516 + 0.3780·log10(TVL_fwd) − 0.0737·ln(chains)
odds     = logit(age + undated + size + growth), capped ±25%
value    = ever-rate primary + remaining-conditional secondary
```

No protocol name is special-cased. The page re-derives every implied value from the
raw figures and shows whether it matches the board.

## Validation (local, honest)

- Value: LOO ×3.2194 / walk-forward ×2.0668 / 5-fold ×3.0188
- Odds Brier: LOO 0.1890 / 10-fold 0.1868 / walk-forward 0.2093 (base 0.248/0.247/0.352)
- Interval coverage: LOO P10–P90 82.6%; honest walk-forward 65.7% (admitted)
- LOO P25–P75 coverage 50.0% vs the #1 entry's 57% (admitted shortfall)
- Gauntlet 34/34, dashboard smoke 27/27, runtime ~3.1s

## Board

- 198 rows: the full 40-protocol watchlist + the 158 largest pre-token protocols
  below the $50M floor, ranked 1–198 by implied value.
- Total implied value $880,995,215; #1 Sentora $25,058,273.
- Farm: 42 FARM / 41 MARG / 115 SKIP. Farm watchlist 0 of 40 — structural, not
  tuned: farm needs implied/TVL > 13.2%, watchlist median is 4.4%.
- Every row carries an 8-step farm plan with Cost: and Time: per step, a capital
  tier by TVL ($50–$250), a generic per-chain gas estimate, and a hold window by age.

## Run

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts --input <snapshot.json>
```

Node 22+, standard library only. Two runs write byte-identical output.
Screenshots (1440×900) are PIL renderings of the real built data in V1; FASE 4
replaces them with true browser captures — see `SCREENSHOTS.md`.
See `out/dossier.json` for the full evidence record.

## Files

- `main.ts` — entrypoint: snapshot in, board + data + dashboard + dossier out.
- `lib/model.ts` — the fitted model, odds, intervals, farm plans.
- `dashboard/` — `index.html`, `app.js`, `style.css` (no network, no framework).
- `input/snapshot.json` — the sealed DefiLlama snapshot (758 protocols).
- `vendor/makefun-board.ts` — make.fun's dossier library, unmodified (kit file).
- `out/dossier.json` — the graded artifact (447,388 bytes).
- `tests/` — `gauntlet.mjs` (34/34), `dashboard-smoke.mjs` (27/27).
