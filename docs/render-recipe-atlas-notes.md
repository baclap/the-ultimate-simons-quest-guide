# Render Recipe Atlas Notes

The render recipe atlas is the first step from isolated recipe probes toward
full-map rendering. It uses the audited save-state evidence to resolve render
recipes, then applies those recipes to every current exterior candidate plus
the captured interior probe contexts.

## Commands

```sh
npm run audit:render-recipes
npm run render:recipe-atlas
```

`render:recipe-atlas` writes:

- `out/render-recipe-atlas/manifest.json`
- `out/render-recipe-atlas/recipe-atlas-data.js`
- `out/render-recipe-atlas/images/*.png`

## Confidence Status

- `validated`: this exact atlas context and variant has a save-state probe.
- `projected`: the context uses a recipe family validated elsewhere in the
  same object set and access type.
- `diagnostic`: the image renders, but the family still needs representative
  save-state evidence before promotion.
- `blocked`: the recipe could not be resolved enough to render.

## Current Result

The current atlas renders 99 entries without blocked/error cases:

- 11 validated
- 80 projected
- 8 diagnostic
- 57 day variants
- 42 night variants

The resolver derives palettes through the ROM selector table at `2:$F7C5` and
the transfer pointer table at `7:$8895`. CHR banks come from exact probe
fingerprints when available, then from validated family evidence, then from
explicit diagnostic fallbacks for unresolved families.

## Interpretation

This milestone intentionally separates "rendered" from "proven pixel-perfect."
The important improvement is that unknown areas can now be generated through the
same recipe resolver used by validated areas. If a projected area still looks
wrong, that is evidence about a missing recipe rule, not a hidden per-area
override.

The next validation states should prioritize North Bridge, Vrad Graveyard,
Castlevania Bridge, and Castlevania exterior. Those are the remaining areas
where projected or diagnostic output is most likely to expose missing CHR,
tile-set, or palette rules.
