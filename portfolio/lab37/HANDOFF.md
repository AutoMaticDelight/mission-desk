# Bowl-O-Matic 5000 — handoff for a new chat

Paste or upload this file at the start of the next chat. It is everything the next
session needs to pick up exactly where this one stopped. Written 2026-09-19.

## Who / why
Bryan S. Holland (bryan@automaticdelight.com). Recruiter screen with **Kristin
Gonzales** (Sr. Technical Recruiter, Atoms / Lab37) for a product-design role on a
robotic bowl line. Call is **Tue Sep 22, 11am PT** on Google Meet
(meet.google.com/mcj-behw-xmq). The prototype exists to answer "what would you do
on day one" and to be shown on screen share.

## Where everything lives
- Repo: **github.com/AutoMaticDelight/mission-desk** (static site, branch `main`,
  Vercel auto-deploys on push, ~1 min). Folder: `portfolio/lab37/`.
- Live: **https://mission-desk-smoky.vercel.app** (desk login: any username,
  password `12345`; everything under `/portfolio/*` and `/show/*` is public).
- Pages that matter:
  - `lunch-rush-light.html` — worker panel, light skin (**show this first**)
  - `lunch-rush-hoppers.html` — worker panel, dark skin (same JS, color layer differs)
  - `manager-fleet.html` — manager console, 20 stores, Apple-clean light
  - `design-system.html` — tokens, live states, components, rules, CSS + JSON export
  - `prep.html` — interview prep (about you, call plan, keywords, say-this, panels)
  - `photos.html` — review sheet of all 16 ingredient photos as the panel crops them
  - `PANEL-DESIGN.md` — the **locked** design rules (read before touching UI)
  - `logo.svg`, `img/README.md` (photo stash), `index.html` (29 screens)
- Options: `?photo=25|50|0` (photo width), `?look=flat` (light panel alt), `?autoplay`.

## The product, in one paragraph
Brand **Bowl-O-Matic 5000** (hyphens, capital O). Mark: a solid hot yellow-green
circle with the icon in black in the middle — a solid O dot over a bowl, no outlines
anywhere; icon only (ink) on a hot surface. Worker HMI on an iPad, one screen, no
scroll: **top lockup** (title bar + **recipe row** + machine-at-a-glance line, edge
to edge, flush top) → **status card** (light blue-gray #e2e7f1; all ingredients in
five groups: Proteins, Bases, Vegetables, Sauces, Dairy; mains bigger than toppings;
photo on every box; percent + refill-by forecast; the level fill is the message) →
**actions dock** (dark, edge to edge, hooked to the bottom: label, alert card with
minutes-until-late as the hero, two glove buttons, one verb-specific lime button,
Next Up). Spare height opens only between status and actions.

## Locked rules (short form — full text in PANEL-DESIGN.md)
- No red anywhere. Needs-you-now = hot yellow-green (#cfff3e dark / #c8f000 light),
  same as the action button. Low = amber. Fine = green. Just refilled = green ring.
  Alert status dot = hot orange. On the light panel a low/now box goes **dark with
  bright yellow numbers**.
- No small text (body ≥14, labels ≥13). Tabular numerals on anything that ticks.
  No text links in the HMI; every tappable thing is a 48–72pt button; secondary
  actions open a hold-two-seconds confirm sheet.
- Verified sizes: 1024×768, 1180×820, 1366×1024 landscape; 820×1180 portrait.
  Short landscape (≤800px tall) compacts box heights. Done = verified in the browser
  at those sizes before pushing.
- Recipe model: each machine is a company; each order is a series of bowls for one
  customer — à la carte within a range, or a **recipe** (named batch). Sample running:
  `SF-0912 · Salesforce · 50 bowls · Salesforce Tower 45F · Wed 09-12-26 · 12:30
  meeting`, 12 veg on quinoa (which is the held hopper — that's why the reroute).
  Hoppers in the recipe carry an `SF` tag on the photo corner. Manager's Uptown card
  shows the running recipe.

## Ingredients (16)
Proteins: Chicken, Beef · Bases: Rice, Quinoa (held) · Vegetables: Beans, Corn,
Pico, Lettuce, Cilantro, Lime · Sauces: Guac, Verde, Chipotle, Roja · Dairy:
Cheese, Sour Cream. (Crema was removed — it duplicated Sour Cream.)
**Dispensers: 18 slots on the machine, 16 loaded (one per ingredient), 2 open.** The
machine line reads running/loaded while anything is held (`15/16` with quinoa held)
and `16/18` when all are running. Adding an ingredient = adding a hopper box + a
photo key; the count updates itself.

## Photos — the unfinished part
The sandbox that builds this can reach **GitHub only** (Wikimedia, Unsplash, Pexels,
Dropbox content are all blocked), so photos are hotlinked from Wikimedia Commons by
file name and were chosen blind. Bryan has seen them; some are still weak.
Mechanism: each box loads `img/<key>.jpg` from the repo first and falls back to
Commons only if that file is missing. **To fix a photo, drop a square JPG named by
key into** https://github.com/AutoMaticDelight/mission-desk/upload/main/portfolio/lab37/img
(keys in `img/README.md`, e.g. `sour-cream.jpg`, `guac.jpg`). Or paste photos into
the chat; Claude can crop and commit them. Review at `/portfolio/lab37/photos`.
Photos never flash and always fill their slot (fixed 2026-09-19).

## How the last session worked (do the same)
- Edit files in `/home/user/mission-desk/portfolio/lab37/`, append CSS at the end
  of each panel's `<style>` (later rules win), keep both worker panels in sync.
- Verify with headless Chromium / Playwright at the four sizes; measure that the
  status card never overlaps the dock (`actions.top - hoppers.bottom > 0`) and that
  no `.bar .n` truncates. The sandbox lacks Inter, so the dark panel renders in a
  wider fallback there; the iPad is narrower.
- Commit as Bryan: `git -c user.name="Bryan S. Holland"
  -c user.email="bryan@automaticdelight.com" commit`, then `git fetch origin main &&
  git rebase origin/main && git push -u origin main`. Another session may push
  concurrently.
- Bryan's style: short imperative asks, iPad in hand, says "no" fast. When an ask is
  ambiguous, ship the most literal reading and show a screenshot; don't ask first.
  He hates: small text, dark voids, cute, red, web-page-looking controls, things
  that clip.

## Open threads
1. Photos: replace the weak ones via the stash (see above).
2. Manager console has not had the finesse pass the worker panels got.
3. The "show" page and desk labels still say Lab37 for the company; only the product
   is Bowl-O-Matic 5000 (intentional).
4. Prep page: rehearse the "tell me about yourself" at the top and the comp script.
