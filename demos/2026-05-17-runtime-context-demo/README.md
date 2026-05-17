# Runtime Context Resolver Demo

This demo captures the milestone where runtime palette-context aliases are
derived from ROM screen-record structure instead of being driven by a
Dora-specific fixture alias.

Open `index.html` directly, or serve this directory with a local static server.

## Assets

- `assets/images/dora-woods-part-2-before-direct.png` renders Dora Woods Part 2
  with its direct `cv2r` context palette.
- `assets/images/dora-woods-part-2-current.png` renders the same layout with the
  ROM-derived runtime context `2:0:3`, raw submap `$83`.
- `assets/data/runtime-context-map.js` records the resolver report generated
  from `npm run inspect:runtime-context-map`.
- `assets/data/atlas-data.js` and `manifest.json` are copied from the current
  exterior atlas output.

## Commands

```sh
npm run inspect:runtime-context-map
npm run render:atlas:exterior
```
