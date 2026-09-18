# Bowl-O-Matic 5000 worker panel — locked design rules

Locked by Bryan, 2026-09-18. These are decisions, not suggestions. Reskin within
them; do not undo them without Bryan saying so.

Files: `lunch-rush-hoppers.html` (dark), `lunch-rush-light.html` (light).
Tokens, live states and rules as a page: `design-system.html`.
Both share structure and JS; only the color layer differs.
Slot-map variant: `lunch-rush-light-slots.html` — same panel, status card
redrawn as the 18-slot machine layout below instead of grouped-by-category.

## Machine layout (one shape, everywhere)
Locked 2026-09-18, revised twice same day (diamond, then this — one row
per category). The machine has **18 physical dispenser slots**, numbered
1–18, always in this fixed order and **one row per category**, labeled:
- Row **Proteins** (2): 1 Chicken · 2 Beef.
- Row **Bases** (2): 3 Rice · 4 Quinoa.
- Row **Vegetables** (6): 5 Beans · 6 Corn · 7 Pico · 8 Lettuce · 9 Cilantro · 10 Lime.
- Row **Sauces** (4): 11 Guac · 12 Verde · 13 Chipotle · 14 Roja.
- Row **Dairy** (2): 15 Cheese · 16 Sour Cream.
- Row **Open** (2): 17 open (swing) · 18 open (swing).

Every screen that draws the machine's slots — the worker panel's status
card, the manager console's machine detail (when built), `recipe-
development.html`'s rack — draws this exact list, in these exact six
labeled rows, as the same numbered-slot primitive: a `#N` badge, a
hot/cold dot (amber = hot-held, blue = cold-held, gray = open swing), then
the name. Never merge or reorder the category rows, resize some slots
bigger than others, or invent a different diagram per screen. **One
physical object gets one visual representation** — recognizable at a
glance whichever screen it's on, same shape in landscape and portrait
alike. Per-context detail layers on top of that shape (the worker panel
adds a photo, percent and refill countdown; recipe development adds
edit/remove controls) but the 6 rows, their labels, order and numbering
never change.

Implementation: each row is `<label><cards>` — a fixed-width label
followed by a flex row of cards sized to the widest category (Vegetables,
6): `(100% - 5×gap) / 6`. Shorter rows (2 or 4 cards) center within that
same per-card width rather than stretching to fill, so every card is the
same size everywhere. Gotcha hit and fixed while building this: a
percentage-based photo gutter (`padding-left: calc(var(--phw) + Npx)`) on
a flex item with a `calc()` flex-basis resolves against the flex
*container's* width in Chromium, not the item's own — it must be a fixed
px value on these cards, not `--phw`'s percentage.

Files on the slot-map layout: `recipe-development.html` (the rack),
`lunch-rush-light-slots.html` (worker panel — identical category-row shape
in both orientations, only the card size/font scales). `lunch-rush-
light.html` and `lunch-rush-hoppers.html` still use the older grouped-by-
category layout in **Boxes** below (visually similar in spirit, but not on
this shared numbered-slot contract) — kept as-is, not migrated.

## Brand
- Name: **Bowl-O-Matic 5000** (hyphens, capital O). Mark: `logo.svg` — a solid hot yellow-green circle, no outline, with the icon
  (solid O dot over a bowl, no outlines) in black centered inside. On a hot surface, icon only, in ink.

## Structure (top to bottom, one iPad screen, no scroll)
1. **Top lockup** — title bar + machine status line fused as one card,
   edge to edge, flush with the top and both sides, square corners.
   Machine line is the bottom row of the title card (dark strip on light).
2. **Status card** — one card holding the label `STATUS · ALL ITEMS` and all
   five ingredient groups (Proteins, Bases, Vegetables, Sauces, Dairy).
   Light: card is a light blue-gray (#e2e7f1); boxes are pure white.
   Dark: card is panel-toned.
3. **Actions dock** — label `ACTIONS` + alert card + Next Up fused as one dark
   dock, edge to edge, hooked to the bottom edge, square corners.
   Spare height opens between Status and Actions, never elsewhere.

## Recipe (the job)
- Model: each machine is a company; each **order** is a series of bowls for one
  customer. An order is either à la carte (a handful of bowls within a range) or
  a **recipe**: a named batch, e.g. `SF-0912 · Salesforce · 50 bowls · Salesforce
  Tower 45F · Wed 09-12-26 12:30 meeting`, with a fixed hopper set and a veg
  variant (12 on quinoa).
- The recipe row lives in the top lockup between the title bar and the machine
  line: label · customer + id · bowls/where/when · progress (done / total, left,
  minutes to due) · hopper chips (problem hoppers first, four then +N) · next job.
- Every hopper the recipe uses carries an `SF` tag on its photo corner.
- Progress ticks with the line's speed; when the batch completes the next job
  takes over. Manager's store card shows the running recipe in one line.

## Boxes
- Every box carries a photo of its ingredient on the left: 25% width by
  default (`?photo=50` half, `?photo=0` none). Photos hotlink Wikimedia
  Commons via Special:FilePath. Mains stack name over number when photos on.
- Mains (proteins, bases) are bigger than sub-ingredients. Dairy is one box.
- All boxes were cut 20% shorter than the first version; keep them short.
- Percent + refill-by time on every box; the level fill is the message.

## Color (no red anywhere)
- **Needs you now** = hot yellow-green (`--hot`, same as the action button).
  Light: the box goes dark (#1c1c1e) with bright yellow numbers + yellow ring.
- **Getting low** = light: dark box with yellow numbers; dark: amber fill.
- **Fine** = green fill. **Just refilled** = green ring (never lime).
- Alert card edge = hot yellow-green. Alert status dot = hot orange.
- Machine line dots: green ok, amber warn, hot lime bad.

## Alert card
- Left: headline + sub, then two real glove buttons (Send tech, Log + alert
  Eng.) — tall, outlined, never text links. Each opens hold-to-confirm.
- Middle: minutes-until-late is the hero on top, the other two numbers
  below it, whole block centered. Dividers are straight lines (no radius).
- Right: one big lime action button, verb-specific ("TAP TO START REROUTE").

## Type and touch
- No small text: body ≥14px, labels ≥13px. Tabular numerals on anything that
  ticks. Uppercase names get +.01em tracking, never negative.
- Section labels lead (ink, 16px, 2.2px tracking); group labels follow
  (14px, dimmer).
- touch-action manipulation, no text selection, press feedback on every
  tappable surface, eased state changes.
- Verified sizes: 1024×768, 1180×820, 1366×1024 landscape; 820×1180 portrait.
  Short landscape screens (≤800px tall) compact box heights automatically.

## Alternate looks
- `?look=flat` on the light panel: white cells, no lift (comparison only).
- Manager console (`manager-fleet.html`) is separate: Apple-clean light,
  white store boxes, green status lights, 100% = on plan.
