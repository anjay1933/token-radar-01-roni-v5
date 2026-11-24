#!/usr/bin/env python3
"""Probe live element positions for the three radar-9 views."""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8123/dashboard/index.html"

PROBE = """() => {
  const out = {docH: document.documentElement.scrollHeight, vw: innerWidth, vh: innerHeight, items: []};
  const push = (label, el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    out.items.push({label, y: Math.round(r.top + scrollY), h: Math.round(r.height)});
  };
  push('header.hero', document.querySelector('header.hero'));
  push('.kpis', document.querySelector('.kpis'));
  push('.checks', document.querySelector('.checks'));
  push('.note', document.querySelector('.note'));
  document.querySelectorAll('section.card h2').forEach(h => {
    push('card: ' + h.innerText.slice(0, 60), h.closest('section'));
  });
  document.querySelectorAll('table').forEach((t, i) => {
    push('table#' + i, t);
  });
  push('.controls', document.querySelector('.controls'));
  document.querySelectorAll('h2,h3').forEach(h => {
    const t = h.innerText;
    if (/derivation|nearest|farm plan|Farm book|Sentora/i.test(t)) push('h: ' + t.slice(0, 60), h);
  });
  return out;
}"""


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        for h in ("#board", "#detail/sentora-curator", "#farm"):
            page.goto(BASE + h, wait_until="networkidle")
            page.wait_for_timeout(500)
            print(f"=== {h} ===")
            print(json.dumps(page.evaluate(PROBE), indent=1))
        browser.close()


if __name__ == "__main__":
    main()
