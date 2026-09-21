---
name: website
description: Look at a live web site as design reference — full-page screenshots at desktop and phone widths, plus an extracted palette (hex, by pixel share), type stack, radii and spacing, written to a refs folder. Use whenever Bryan names a site or URL as design cues ("use lab37.us as design cues", "make it feel like stripe.com"), or asks to see, check, or compare a web page. Never say a site can't be seen without first running this.
---

# website — see a site, keep the evidence

Bryan works from iPad/phone and points at sites by name. The job is to turn a URL into
things a designer can use: screenshots to look at, and the numbers behind them.

## Run

```bash
node .claude/skills/website/snap.mjs <url> [out-dir]
```

Default out-dir: `refs/<host>/` under the current working directory. Writes:

- `desktop.png` (1440 wide, full page), `phone.png` (390 wide, full page), `fold.png` (first screen only)
- `notes.md` — palette (top background/text/accent colors by pixel share, as hex), font families
  actually rendered (with weights and the sizes used for h1/h2/body/buttons), button radius and
  padding, section spacing, the page title and the visible nav labels
- `styles.json` — the raw computed-style census the notes were built from

Then **Read** the PNGs (the Read tool shows images) before writing a word about the site.

## If the fetch is refused

A `403`/`connect_rejected` from the proxy means the *environment's* network policy blocks the host —
not a missing tool. Say exactly that, once, and name the fix: claude.ai/code → Environments → this
environment → Network access → allow the domain (or full access). Do not route around the proxy.
Meanwhile the same command runs unchanged in Bryan's Mac session (full network); its output dropped
into `refs/` on GitHub reaches the cloud session.

## Turning cues into a skin

- Palette goes into the page as tokens (`--brand`, `--ink`, `--paper`, `--accent`), never sprinkled hex.
- Match the *feel* (weight, case, spacing, radius), not the pixels; the panel rules in
  `PANEL-DESIGN.md` still win (no small text, no red, one button system).
- Ship as a separate variant page, screenshot it, and say which cues were taken.
