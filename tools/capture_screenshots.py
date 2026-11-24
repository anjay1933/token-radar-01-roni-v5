#!/usr/bin/env python3
"""FASE 4 — true browser captures for radar-9 screenshots.

Serves out/ on localhost:8123 (started separately), opens the three
hash-addressed views at 1440x900 and saves viewport JPEGs at quality 38.
Writes to /tmp first; the caller replaces screenshots/ after size checks.
"""
import os
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8123/dashboard/index.html"
QUALITY = int(sys.argv[1]) if len(sys.argv) > 1 else 38
OUT = f"/tmp/radar9-shots-q{QUALITY}"
VIEWS = [
    # (file, hash, scrollY) — the shared cover (hero + KPI + integrity + note)
    # is ~750px tall, so the view-specific content sits below the 900px fold.
    # Each shot scrolls the viewport to its content (still a 1440x900 viewport
    # capture, NOT a full-page capture): board table h2 at y~4860 (measured
    # 2026-11-24 in a real browser; the Round 4 evidence sections pushed it
    # down from ~3917), detail derivation at y~940, farm aggregate/table
    # at y~765.
    ("1-board.jpg", "#board", 4800),
    ("2-detail.jpg", "#detail/sentora-curator", 940),
    ("3-filtered.jpg", "#farm", 760),
]


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        for fname, h, scroll_y in VIEWS:
            page.goto(BASE + h, wait_until="networkidle")
            # Let the hash router render; the app sets aria-busy while loading.
            page.wait_for_timeout(600)
            page.evaluate(f"window.scrollTo(0, {scroll_y})")
            page.wait_for_timeout(300)
            state = page.evaluate(
                """() => {
                  const app = document.getElementById('app');
                  return {
                    busy: app ? app.getAttribute('aria-busy') : null,
                    text_len: app ? app.innerText.length : 0,
                    h1: (document.querySelector('h1,h2') || {}).innerText || '',
                    rows: document.querySelectorAll('table tbody tr').length,
                    title: document.title,
                  };
                }"""
            )
            print(f"{fname} {h}: {state}", flush=True)
            path = os.path.join(OUT, fname)
            page.screenshot(path=path, type="jpeg", quality=QUALITY)
            print(f"  wrote {path} {os.path.getsize(path)} B", flush=True)
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
