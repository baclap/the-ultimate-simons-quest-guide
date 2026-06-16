# Actor Selector Stream Demo

Brief stakeholder demo for the actor selector-stream milestone.

This demo is intentionally high level. It shows the meaningful end result:
observed runtime actor classes are now mapped back to fixed-bank ROM selector
records, their animation selectors resolve through the ROM metasprite tables,
and the included sprite strips are rendered from ROM/metasprite/CHR/palette
evidence rather than hand-authored PNG crops.

Generated inputs:

- `assets/evidence.js`: copied from `out/actor-selector-streams/evidence.js`
- `assets/sprites/*.png`: copied from `out/actor-selector-streams/sprites/`

Regenerate the source evidence with:

```sh
npm run decode:actor-selector-streams
```

Then refresh the demo assets by copying the generated `evidence.js` and sprite
PNGs back into this directory.
