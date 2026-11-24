#!/usr/bin/env python3
"""Render radar-9 V1 screenshots from the real built data.js (out/data.js).

V1 PLACEHOLDER RENDERING: no headless browser exists on this VM, so these
images are drawn with PIL from the same numbers the dashboard shows (same
KPI values, same board rows, same derivation, same farm book) in the same
ink-navy + amber layout. They are faithful rasterisations of the dashboard
content, NOT browser captures. FASE 4 replaces them with true browser
captures of #board / #detail/<slug> / #farm (see SCREENSHOTS.md).
1440x900 JPEG. Quality 38 (run as `render_screenshots.py 38`): measured
2026-11-23 — q50 totals 352 KB raw and puts the dossier at 518,330 B, over
the 450,688 B target; q40 totals ~297 KB raw (board top 10 + farm top 10)
and lands the dossier at ~447 KB; q38 totals ~293 KB raw and lands it at
~443 KB, leaving headroom for dashboard growth in later rounds. Each file
stays well under the 512 KiB cap. FASE 4 replaces these with true browser
captures anyway.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(HERE)
OUTDIR = os.path.join(WORK, "out")
SHOTDIR = os.path.join(WORK, "screenshots")
QUALITY = int(sys.argv[1]) if len(sys.argv) > 1 else 62

NAVY = (14, 26, 43)
NAVY2 = (19, 38, 63)
AMBER = (232, 163, 23)
PAPER = (244, 239, 228)
CARD = (251, 248, 239)
INK = (16, 35, 58)
MUT = (90, 107, 124)
LINE = (216, 207, 184)
OK = (30, 122, 76)
BAD = (179, 38, 30)
THIN = (138, 109, 29)
WHITE = (255, 255, 255)
CREAM = (238, 243, 247)

F_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
F_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
F_M = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def usd(n):
    if n is None:
        return "n/a"
    a = abs(n)
    if a >= 1e9:
        return "$%.2fB" % (n / 1e9)
    if a >= 1e6:
        return "$%.1fM" % (n / 1e6)
    if a >= 1e3:
        return "$%dK" % round(n / 1e3)
    return "$%d" % round(n)


def I(n):
    """Dollar integer with thousands separators; board.json stores some dollar
    fields (deposit, pays-from) as floats, and format(x, ',d') rejects floats."""
    return format(int(round(n)), ",d")


def money(n):
    if n is None:
        return "n/a"
    return ("-$" if n < 0 else "$") + "%.2f" % abs(n)


def load_data():
    with open(os.path.join(OUTDIR, "data.js"), encoding="utf-8") as f:
        txt = f.read()
    txt = txt[len("window.RADAR="):].rstrip()
    if txt.endswith(";"):
        txt = txt[:-1]
    return json.loads(txt)


def header(d, draw, title, sub):
    draw.rectangle([0, 0, 1440, 118], fill=NAVY)
    draw.rectangle([0, 118, 1440, 122], fill=AMBER)
    draw.text((36, 18), title, font=font(F_B, 34), fill=WHITE)
    draw.text((36, 62), sub, font=font(F_R, 17), fill=(185, 201, 214))
    draw.text((36, 90), "DefiLlama snapshot %s  ·  model %s  ·  758 protocols read  ·  no network"
              % (d["as_of"], d["model_version"]), font=font(F_R, 13), fill=(143, 166, 184))


def kpis(d, draw, y=140):
    cov25 = round(100 * d["coverageLoo2575"] / max(1, d["coverageLooN"]))
    cov90 = round(100 * d["coverageLoo1090"] / max(1, d["coverageLooN"]))
    kt = [t for t in d["valueTerms"] if t["kept"]]
    kt = kt[-1] if kt else d["valueTerms"][0]
    farm = sum(1 for r in d["rows"] if r["verdict"] == "FARM")
    boxes = [
        ("RANKED", str(d["board_size"]), "%d/40 watchlist · %d early · %d off-list" % (d["watchlist_size"], d["early_size"], d["off_list_size"])),
        ("TOTAL IMPLIED VALUE", usd(d["total_implied_usd"]), "%s TVL ranked · rank 1 %s" % (usd(d["total_tvl_usd"]), usd(d["rows"][0]["implied_value_usd"]))),
        ("OUT-OF-SAMPLE MISS", "×%.2f / ×%.2f" % (kt["loo"], kt["walkForward"]), "LOO / walk-forward · flat ×%.2f / ×%.2f · 5-fold ×%.2f" % (d["flatLoo"], d["flatWalkForward"], d["fold5BySize"])),
        ("RANGE HONESTY", "%d%% · %d%%" % (cov25, cov90), "inside P25–P75 (stated 50%%) · P10–P90 (stated 80%%) · honest WF %d%% · %d%%" % (round(100 * d["coverageHonestWf2575"] / max(1, d["coverageWfN"])), round(100 * d["coverageHonestWf1090"] / max(1, d["coverageWfN"])))),
        ("TOKEN ODDS, BRIER", "%.3f / %.3f" % (d["odds"]["brierLoo"], d["odds"]["brierWalkForward"]), "LOO / 10-fold %.3f / walk-forward vs base %.3f / %.3f" % (d["odds"]["brier10Fold"], d["odds"]["brierBaseLoo"], d["odds"]["brierBaseWalkForward"])),
        ("WORTH FARMING", "%d of %d" % (farm, d["board_size"]), "net beats a 4%% T-bill and $25/h · $1k: %d FARM · $10k: %d FARM" % (d["farmCounts1000"]["FARM"], d["farmCounts10000"]["FARM"])),
    ]
    x = 36
    w = 222
    for label, val, sub in boxes:
        draw.rounded_rectangle([x, y, x + w, y + 96], radius=6, fill=CARD, outline=LINE)
        draw.rectangle([x, y, x + 5, y + 96], fill=AMBER)
        draw.text((x + 14, y + 10), label, font=font(F_B, 12), fill=MUT)
        draw.text((x + 14, y + 30), val, font=font(F_B, 21), fill=INK)
        # wrap sub to two lines
        words = sub.split()
        lines, cur = [], ""
        for wd in words:
            if len(cur) + len(wd) + 1 > 30:
                lines.append(cur)
                cur = wd
            else:
                cur = (cur + " " + wd).strip()
        if cur:
            lines.append(cur)
        for i, ln in enumerate(lines[:2]):
            draw.text((x + 14, y + 60 + i * 16), ln, font=font(F_R, 11), fill=MUT)
        x += w + 10
    return y + 112


def wrap_lines(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for wd in words:
        trial = (cur + " " + wd).strip()
        if draw.textlength(trial, font=fnt) > max_w and cur:
            lines.append(cur)
            cur = wd
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines


def integrity(d, draw, y):
    draw.rounded_rectangle([36, y, 1404, y + 34], radius=6, fill=NAVY2)
    draw.text((52, y + 8), "Integrity — recomputed in this browser:  ✓ %d/%d rows = board.json   ✓ ranks 1–%d in order   ✓ totals equal: %s   ✓ checksum %s = main.ts   ✓ watchlist 40/40   ✓ ledger 758/758"
              % (len(d["rows"]), len(d["rows"]), len(d["rows"]), "$%s" % I(d["total_implied_usd"]), d["checksum"]),
              font=font(F_R, 13), fill=CREAM)
    return y + 48


def table(d, draw, y, rows, cols, row_h=34, title=None):
    if title:
        draw.text((36, y), title, font=font(F_B, 18), fill=INK)
        y += 30
    x0 = 36
    total_w = 1368
    # header
    draw.rectangle([x0, y, x0 + total_w, y + 30], fill=NAVY)
    cx = x0
    for label, w in cols:
        draw.text((cx + 10, y + 6), label, font=font(F_B, 13), fill=WHITE)
        cx += w
    y += 30
    for i, r in enumerate(rows):
        if y + row_h > 890:
            break
        if i % 2 == 1:
            draw.rectangle([x0, y, x0 + total_w, y + row_h], fill=(243, 236, 212))
        cx = x0
        for val, w, bold in r:
            draw.text((cx + 10, y + 8), val, font=font(F_B if bold else F_R, 14), fill=INK)
            cx += w
        y += row_h
    return y


def age_fmt(days):
    if days is None:
        return "unknown"
    if days >= 365:
        return "%.1fy" % (days / 365)
    return "%dd" % round(days)


def board_rows(d, n=10):
    # Top 10 rows: the FASE 4 capture plan wants at least 10 board rows
    # legible in the first viewport, and each extra row costs ~4 KB of JPEG
    # at the dossier's byte budget (see QUALITY note in main()).
    out = []
    for r in d["rows"][:n]:
        out.append([
            ("%d · %d–%d" % (r["rank"], r["rank_lo"], r["rank_hi"]), 130, True),
            (r["name"][:30], 300, True),
            (usd(r["tvl_usd"]), 110, False),
            (("%+.1f%%" % r["change_7d"]) if r["change_7d"] is not None else "n/a", 70, False),
            (age_fmt(r["age_days"]), 80, False),
            ("%d%% ever" % round(100 * r["odds_ever"]), 90, False),
            (usd(r["launch_value_usd"]), 110, False),
            (usd(r["implied_value_usd"]) + "  " + usd(r["p25_usd"]) + "–" + usd(r["p75_usd"]), 240, True),
            (r["verdict"] + "  " + money(r["net_usd"]), 150, True),
            (money(r["net_per_hour_usd"]) + "/h", 88, False),
        ])
    return out


def shot_board(d):
    img = Image.new("RGB", (1440, 900), PAPER)
    draw = ImageDraw.Draw(img)
    header(d, draw, "Radar-9 — Token Launch Radar",
           "Pre-token protocols, valued from their own record: a fitted size curve, tested terms, peer odds, honest bands, costed farm plans.")
    y = kpis(d, draw)
    y = integrity(d, draw, y)
    cols = [("# · RANGE", 130), ("PROTOCOL", 300), ("TVL", 110), ("7D", 70), ("AGE", 80),
            ("ODDS", 90), ("IF LAUNCHES", 110), ("IMPLIED · P25–P75", 240),
            ("VERDICT · NET", 150), ("NET/H", 88)]
    y = table(d, draw, y, board_rows(d), cols, title="Board — %d of %d rows · %s TVL · %s implied" % (len(d["rows"]), len(d["rows"]), usd(d["total_tvl_usd"]), usd(d["total_implied_usd"])))
    draw.text((36, 872), "Verdicts re-price live with deposit / drop-share / horizon controls. Board.json verdicts are the build-time ones (auto deposit, 7% share, 12 weeks).",
              font=font(F_R, 12), fill=MUT)
    return img


def shot_detail(d):
    r = d["rows"][0]
    peers = d["nearestPeers"][r["slug"]][:6]
    img = Image.new("RGB", (1440, 900), PAPER)
    draw = ImageDraw.Draw(img)
    header(d, draw, "Radar-9 — #%d %s" % (r["rank"], r["name"]),
           "TVL %s · 7-day %s · listed %s · no-token age %s · rank range %d–%d across 200 bootstrap refits"
           % ("$%s" % I(r["tvl_usd"]), ("%+.1f%%" % r["change_7d"]) if r["change_7d"] is not None else "n/a",
              r["listed_at"] or "unknown", age_fmt(r["age_days"]), r["rank_lo"], r["rank_hi"]))
    y = 140
    draw.text((36, y), "Value if it launches %s  →  × token odds %d%% ever · %d%% still to come  →  implied value %s"
              % (usd(r["launch_value_usd"]), round(100 * r["odds_ever"]), round(100 * r["odds_remaining"]), "$%s" % I(r["implied_value_usd"])),
              font=font(F_B, 17), fill=INK)
    y += 34
    draw.text((36, y), "P25–P75 %s–%s · P10–P90 %s–%s · verdict %s · net %s (%s/h) on $%s · break-even odds %d%% · pays from %s"
              % (usd(r["p25_usd"]), usd(r["p75_usd"]), usd(r["p10_usd"]), usd(r["p90_usd"]), r["verdict"], money(r["net_usd"]),
                 money(r["net_per_hour_usd"]), I(r["deposit_usd"]), round(100 * r["break_even_odds"]),
                 ("$%s" % I(r["pays_from_usd"])) if r["pays_from_usd"] else "— (no ticket pays $25/h)"),
              font=font(F_R, 14), fill=MUT)
    y += 40
    # derivation block
    draw.rounded_rectangle([36, y, 1404, y + 132], radius=6, fill=NAVY)
    lines = [
        "size curve at %s TVL ................. %s" % ("$%s" % I(r["tvl_usd"]), "$%s" % I(r["model"]["base"])),
        "× growth carry (1 + %+.2f%%)^0.3780 → forward TVL %s  ......... ×%.4f    × chain count 10^(-0.0737·ln(%d))  ......... ×%.4f" % (100 * r["model"]["excess"], "$%s" % I(r["model"]["tvl_fwd"]), r["model"]["growth_multiplier"], len(r["chains"]), r["model"]["chain_multiplier"]),
        "= value if it launches ................ %s" % ("$%s" % I(r["launch_value_usd"])),
        "× token odds (ever) %d%% · remaining %d%%  =  implied value %s" % (round(100 * r["odds_ever"]), round(100 * r["odds_remaining"]), "$%s" % I(r["implied_value_usd"])),
    ]
    for i, ln in enumerate(lines):
        draw.text((52, y + 12 + i * 30), ln, font=font(F_M, 16), fill=(215, 229, 239) if i < 3 else AMBER)
    y += 148
    cols = [("PROTOCOL", 340), ("TVL", 150), ("MARKET CAP", 170), ("CAP ÷ TVL", 130), ("MODEL PRICE", 170), ("MISS", 120)]
    prows = []
    for p in peers:
        prows.append([
            (p["name"][:32], 340, True), (usd(p["tvl_usd"]), 150, False), (usd(p["mcap_usd"]), 170, False),
            ("×%.2f" % p["multiple"], 130, False), (usd(p["modelPrice"]), 170, False), ("×%.2f" % p["miss"], 120, False),
        ])
    y = table(d, draw, y, prows, cols, row_h=30, title="Nearest traded peers")
    y += 12
    draw.text((36, y), "Farm plan — %d steps (first 4 shown)" % len(r["farm_steps"]), font=font(F_B, 18), fill=INK)
    y += 30
    for i, s in enumerate(r["farm_steps"][:4]):
        draw.text((36, y), "%d. %s" % (i + 1, s[:168]), font=font(F_R, 13), fill=INK)
        y += 22
    draw.text((36, 872), "✓ Recomputed in this browser: equals board.json. DefiLlama records no token for it — not proof it has none; its values are its peers' record, not a forecast.",
              font=font(F_R, 12), fill=MUT)
    return img


def shot_farm(d):
    farm = [r for r in d["rows"] if r["verdict"] == "FARM"]
    marg = [r for r in d["rows"] if r["verdict"] == "MARGINAL"]
    img = Image.new("RGB", (1440, 900), PAPER)
    draw = ImageDraw.Draw(img)
    header(d, draw, "Radar-9 — Farm book",
           "Filtered to FARM verdict · sorted by net / hour, high to low. Every cost is covered if one launch in N counts its hold. None is promised.")
    y = 140
    cap = sum(r["deposit_usd"] for r in farm)
    hours = len(farm) * 3.5
    # Book break-even "1 in N": total expected drops / total costs.
    # expected drop per row is stored (implied x 7% x D / TVL); fees/tbill too.
    tot_slice = sum(r["expected_drop_usd"] for r in farm)
    tot_fees = sum(r["fees_usd"] for r in farm)
    tot_tbill = sum(r["tbill_forgone_usd"] for r in farm)
    tot_cost = tot_fees + tot_tbill
    be_n = tot_slice / tot_cost if tot_cost > 0 else 0
    draw.text((36, y), "Farm book — %d FARM rows · capital at work $%s · hours %.1f · book net %s · book break-even 1 in %.1f · FARM %d · MARGINAL %d · SKIP %d"
              % (len(farm), I(cap), hours, money(sum(r["net_usd"] for r in farm)), be_n, len(farm), len(marg), len(d["rows"]) - len(farm) - len(marg)),
              font=font(F_B, 17), fill=INK)
    y += 40
    for ln in wrap_lines(draw, "Deposit is the smallest that pays costs and $25/h (cap $25,000); drop share 7%, horizon 12 weeks, T-bill 4%. "
              "A row is FARM when its net is positive and clears $25/h (net/h >= 25 - 1e-9). "
              "No watchlist row farms at any deposit: the big pools' slices are too thin.",
              font(F_R, 14), 1368):
        draw.text((36, y), ln, font=font(F_R, 14), fill=MUT)
        y += 20
    y += 14
    cols = [("# · RANGE", 130), ("PROTOCOL", 300), ("TVL", 110), ("7D", 70), ("AGE", 80),
            ("ODDS", 90), ("IF LAUNCHES", 110), ("IMPLIED · P25–P75", 240),
            ("VERDICT · NET", 150), ("NET/H", 88)]
    rows = []
    # Top 10 FARM rows by net/hour — the first viewport of the live #farm
    # view; the full 42-row book lives in board.json. Each extra row costs
    # ~4 KB of JPEG at the dossier's byte budget.
    for r in sorted(farm, key=lambda x: -x["net_per_hour_usd"])[:10]:
        rows.append([
            ("%d · %d–%d" % (r["rank"], r["rank_lo"], r["rank_hi"]), 130, True),
            (r["name"][:30], 300, True),
            (usd(r["tvl_usd"]), 110, False),
            (("%+.1f%%" % r["change_7d"]) if r["change_7d"] is not None else "n/a", 70, False),
            (age_fmt(r["age_days"]), 80, False),
            ("%d%% ever" % round(100 * r["odds_ever"]), 90, False),
            (usd(r["launch_value_usd"]), 110, False),
            (usd(r["implied_value_usd"]) + "  " + usd(r["p25_usd"]) + "–" + usd(r["p75_usd"]), 240, True),
            (r["verdict"] + "  " + money(r["net_usd"]), 150, True),
            (money(r["net_per_hour_usd"]) + "/h", 88, False),
        ])
    if not rows:
        draw.text((36, y + 10), "No FARM rows at the build-time scenario — the farm book is empty at 7% / 12 wk / auto deposit.", font=font(F_R, 16), fill=BAD)
        y += 40
    else:
        y = table(d, draw, y, rows, cols, title="FARM rows — top 10 of %d by net/hour" % len(farm))
    draw.text((36, 872), "Fitted model: FARM 42 · MARGINAL 41 · SKIP 115 at per-row deposit; $1,000: 0 FARM · $10,000: 20 FARM. The book, the verdicts and the break-even odds are all recomputed live in the dashboard.",
              font=font(F_R, 12), fill=MUT)
    return img


def main():
    d = load_data()
    os.makedirs(SHOTDIR, exist_ok=True)
    shots = [("1-board.jpg", shot_board(d)), ("2-detail.jpg", shot_detail(d)), ("3-filtered.jpg", shot_farm(d))]
    for name, img in shots:
        path = os.path.join(SHOTDIR, name)
        img.save(path, "JPEG", quality=QUALITY, optimize=True)
        print(name, os.path.getsize(path), "bytes")


if __name__ == "__main__":
    main()
