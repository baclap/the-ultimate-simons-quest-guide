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
  save-state evidence before promotion. The current atlas has no diagnostic
  entries.
- `blocked`: the recipe could not be resolved enough to render.

## Current Result

The current atlas renders 112 entries without blocked/error cases:

- 23 validated
- 89 projected
- 0 diagnostic
- 56 day variants
- 54 night variants
- 2 fixed variants

The resolver derives palettes through the ROM selector table at `2:$F7C5` and
the transfer pointer table at `7:$8895`. CHR banks come from exact probe
fingerprints when available, then from validated family evidence, then from
explicit diagnostic fallbacks for unresolved families.

Objset `4` is now promoted from diagnostic to a validated family. Vrad
Graveyard, Castlevania Bridge, and Deborah Cliff probes all resolve live CHR
banks `06/07`; the old diagnostic fallback used `08/09`, which explains the
scrambled tile output.

Objset `5` is now validated too. Castlevania's final area is a fixed-palette
area, not a day/night exterior; its probe resolves live CHR banks `0B/0C` and
palette transfer `$57 -> 4:$A150`.

## Interpretation

This milestone intentionally separates "rendered" from "proven pixel-perfect."
The important improvement is that unknown areas can now be generated through the
same recipe resolver used by validated areas. If a projected area still looks
wrong, that is evidence about a missing recipe rule, not a hidden per-area
override.

The next validation work should focus on crop/layout parity for remaining
inferred mansion-door templates and on coordinate-aware composition. The broad
recipe atlas no longer has a deferred or diagnostic render family.
