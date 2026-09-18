# Bowl-O-Matic 5000 worker panel — locked design rules

Locked by Bryan, 2026-09-18. These are decisions, not suggestions. Reskin within
them; do not undo them without Bryan saying so.

Files: `lunch-rush-hoppers.html` (dark), `lunch-rush-light.html` (light).
Tokens, live states and rules as a page: `design-system.html`.
Both share structure and JS; only the color layer differs.

## Brand
- Name: **Bowl-O-Matic 5000** (hyphens, capital O). Mark: `logo.svg` — a solid hot yellow-green circle, no outline, with the icon
  (O ring over a bowl) in black centered inside. On a hot surface, icon only, in ink.

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
