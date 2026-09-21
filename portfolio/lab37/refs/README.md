# Design references

Source photos and screenshots to build from — not shipped UI, not linked from any page.

- `square-pos-favorites.jpg` — Square Register's Favorites grid (photo tiles, category
  shortcuts on the left, running order + total on the right). Reference for the public
  ordering page: a Bowl-O-Matic equivalent, photo-tile grid of ingredients/combos, same
  Apple-card visual language already locked in PANEL-DESIGN.md for the worker panel.

## Capturing a site as cues (`/website`)

From a Claude Code session with network (the laptop), in this repo:

```
node .claude/skills/website/snap.mjs lab37.us portfolio/lab37/refs/lab37.us
```

writes `desktop.png`, `fold.png`, `phone.png`, `notes.md` (palette by pixel share, type stack,
button radius/padding) and `styles.json`. Commit and push that folder; the cloud session pulls it and
skins from the numbers. The cloud sandbox itself cannot reach most hosts (environment network policy).
