# Bowl-O-Matic 5000 worker panel — locked design rules

Locked by Bryan, 2026-09-18. These are decisions, not suggestions. Reskin within
them; do not undo them without Bryan saying so.

Files: `lunch-rush-hoppers.html` (dark), `lunch-rush-light.html` (light).
Tokens, live states and rules as a page: `design-system.html`.
Both share structure and JS; only the color layer differs.
Slot-map variant: `lunch-rush-light-slots.html` — same panel, status card
redrawn as the 18-slot machine layout below instead of grouped-by-category.

## Machine layout (one shape, everywhere)
Locked 2026-09-18, revised three times same day (diamond → one row per
category → this, sized by real dispenser hardware). The machine has **18
physical dispenser slots**, numbered 1–18, always in this fixed order.
**Row 1 is the 4 mains.** Every row after that is one **dispenser-size
tier**, left-justified, down to Open last:
- Row **Hot Grain Hopper** — **4 bays, always full, 4/4.** 1 Chicken ·
  2 Beef · 3 Rice · 4 Quinoa. Holds ≈2.5 gal each. Auger / steam-table
  dispensers — the most volume per bowl, sized biggest.
- Row **Loose-Scoop Bin** — **6 bays, always full, 6/6.** 5 Beans ·
  6 Corn · 7 Pico · 8 Lettuce · 9 Cilantro · 15 Cheese. Holds ≈175 in³
  each. Scoop-dispensed produce and cheese.
- Row **Sauce Dispenser** — **8 bays, 6 used + 2 open, 6/8.** 10 Lime ·
  11 Guac · 12 Verde · 13 Chipotle · 14 Roja · 16 Sour Cream, then bays
  17 · 18 open, labeled "+ Add" (never "OPEN" — an open bay is an action,
  not a status). Holds ≈32 oz each. Squeeze bottles and pinch garnish —
  smallest footprint, and the tier a bigger machine grows first: +1 to
  Hot Grain Hopper, +2 to Loose-Scoop Bin, a bunch more Sauce Dispensers.

**The bay count per tier is fixed hardware, not a setting — 4 / 6 / 8,
not fungible between tiers.** The two open bays physically live *inside*
the Sauce Dispenser row, not a separate 4th row: there is no "Open"
section, because on this machine only Sauce Dispenser has spare capacity.
A row at its count has no "+ Add" card anywhere, on any screen — there is
no such thing as a 5th hopper. To put something different in a full row,
remove one of its bays first; the freed bay stays that same size (a
hopper bay can only take another Hot-Grain-Hopper-sized thing — Protein
or Base — never a sauce). Every row label shows its live `used/total`
count, and "· full" when it's maxed, so nobody mistakes a full row for
one with room.

Row labels are three lines: the dispenser type in caps, the `used/total`
count, then a dimmer "Holds ≈N unit" capacity line — one gallons, one
cubic inches, one ounces, picked per tier for whichever unit reads most
naturally for that container (bulk hopper in gal, a rectangular bin in
in³, a bottle in oz). Capacity is per dispenser, not per row.

Every screen that draws the machine's slots — the worker panel's status
card, the manager console's machine detail (when built), `recipe-
development.html`'s rack — draws this exact list, in these exact three
rows (no separate Open row), as the same numbered-slot primitive: a `#N`
badge, a hot/cold dot (amber = hot-held, blue = cold-held, gray = open
swing), then the name. Never merge or reorder the tier rows, size a slot
off-tier, center a row instead of left-justifying it, show a "+ Add" on a
row that's already full, or invent a different diagram per screen. **One
physical object gets one visual representation** — recognizable at a
glance whichever screen it's on, same shape in landscape and portrait
alike. Per-context detail layers on top (the worker panel adds a photo,
percent and refill countdown; recipe development adds edit/remove
controls) but the 3 rows, their labels, fixed bay counts, order,
numbering and *relative* sizing never change.

Sizing: every row fills the full width, edge to edge, same as every
other row — cards are `flex:1` within their row, not a fixed percentage.
Size hierarchy still reads clearly without ever leaving a ragged trailing
gap: a row with only 4 cards (Hot Grain Hopper) divides that same full
width four ways, so each card is wider than a Sauce Dispenser card
sharing that width eight ways — the tier's width emerges from its own
bay count, it isn't set directly. **Height is the same for every card,
every tier** (`9.5vh` landscape, `80px` portrait) — width is the only
thing that varies, so a 4-bay row and an 8-bay row still read as one
consistent grid, not three differently-scaled ones. An earlier version
also varied height per tier (large hopper taller, not just wider) —
replaced same session for a cleaner, more consistent grid. A still-
earlier version fixed each tier's width to a percentage (L 22% / M 14% /
S 11%) and left-justified rows with unfilled space on the right — rejected for
not reading as one aligned grid; full-width `flex:1` replaced it same
session.

Two gotchas hit and fixed while building this, both worth not
rediscovering:
- A percentage-based photo gutter (`padding-left: calc(var(--phw) +
  Npx)`) on a flex item with a `calc()` flex-basis resolves its
  percentage against the flex *container's* width in Chromium, not the
  item's own. Cards briefly ballooned to ~300px. Fix: a fixed-px gutter
  on these cards (`--sphw`), not `--phw`'s percentage.
- The "long name wraps" rule (`.long`, for names ≥8 chars) needs
  `overflow-wrap: break-word` too — "Chipotle" is one word with no space
  to break at, so `white-space:normal` alone still overflowed the card
  edge instead of wrapping.

## Card anatomy (Apple card language)
Locked 2026-09-18, revised same day to four stacked bands instead of two
— every fact gets its own centered zone, nothing overlaid on anything
else:
- **Name, top.** Centered, bold, the one glanceable fact (which
  ingredient this is) with zero visual competition. Wraps to two lines
  rather than truncating or shrinking; a bay's `#N` badge and hot/cold
  dot sit as a quiet corner overlay (top-right, ~50% opacity), never
  inline with the name.
- **Quantity, centered, directly below the name.** The live **weight**
  and refill time (or "SCRAPE IT" — see below), its own band, not an
  overlay on the photo — a fact this important doesn't share space with
  an image.
- **Progress track, touching the photo.** A thin (4px) bar sitting flush
  against the photo's top edge with zero gap — genuinely touching it, not
  just close — filling left to right with the same live level. This is
  "the fill is the message," now a real progress bar instead of a bottom
  edge line.
- **Photo, full-bleed, below the track (worker panel only —
  recipe-development's compact edit chips skip the photo, there's no room
  and no need for one in a dev tool).** Edge to edge, no padding, no text
  overlaid on it — it's pure image, so it actually reads as a photo of
  the product, not a thumbnail with a caption. The recipe "SF" tag is the
  one exception, small in its top-left corner.

## Fullness is weight, not volume (2026-09-18)
Every bin sits on a load cell — a scale is simpler and more reliable
hardware than a volume sensor, and it's what the caption shows: **lb**,
not a percent. Each size tier has a fixed full weight (`FULL` in
`lunch-rush-light-slots.html`): Hot Grain Hopper 20 lb, Loose-Scoop Bin
8 lb, Sauce Dispenser 2 lb. Below **25% of that weight** (5 lb / 2 lb /
0.5 lb) is a physical floor, not a display threshold: an auger or pump
can't cleanly pull the last bit out anymore, a worker has to squeegee or
scrape it by hand, and whatever's left after that gets thrown away. That
25% floor is what drives the "now" (needs-attention) state directly —
not a minutes-until-empty guess — and its caption says so plainly:
"SCRAPE IT" instead of a refill-by clock. 25–40% is "low" (plan a
refill); above that is "ok." The internal simulation still tracks a
0–100 level for the math (refill forecasting, the fill-bar width); `lb`
is purely how a human reads it, via `lbs(x) = level/100 × FULL[tier]`.
- **Level fill** is a thin (4px) bar at the card's own bottom edge,
  growing left to right — still "the fill is the message," just anchored
  to the whole card now instead of starting after a photo gutter.
- **Corner radius 18px** on every card, every tier, both files — call it
  the house radius. Status coloring (hot-lime ring for "needs you now,"
  dark card for low/now, grayscale photo for held) still applies to the
  whole card, unchanged from before this pass; only the internal anatomy
  moved.

This reads as one system precisely because nothing here is bespoke per
ingredient or per tier — same two zones, same radius, same badge
position, same caption treatment, whether it's a 2.5-gallon hopper or a
32oz squeeze bottle.

Files on the slot-map layout: `recipe-development.html` (the rack),
`lunch-rush-light-slots.html` (worker panel — identical shape in both
orientations, only card size/font scales). `lunch-rush-light.html` and
`lunch-rush-hoppers.html` still use the older grouped-by-category layout
in **Boxes** below (visually similar in spirit, but not on this shared
numbered-slot contract) — kept as-is, not migrated.

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
