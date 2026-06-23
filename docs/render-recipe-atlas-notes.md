# Render Recipe Atlas Notes

The render recipe atlas is the first step from isolated recipe probes toward
full-map rendering. It uses the audited save-state evidence to resolve render
recipes, then applies those recipes to every current exterior candidate,
promoted mansion/town interior candidate, and captured interior probe context.

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
  same object set and access type. A projected interior can be rendered for
  research, but a promoted guide destination should get per-submap fixture or
  transition/capture evidence before its recipe is treated as final.
- `diagnostic`: the image renders, but the family still needs representative
  save-state evidence before promotion. The current atlas has no diagnostic
  entries.
- `blocked`: the recipe could not be resolved enough to render.

## Current Result

The current atlas renders 149 entries without blocked/error cases:

- 23 validated
- 126 projected
- 0 diagnostic
- 79 day variants
- 54 night variants
- 16 fixed variants

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

Interior atlas entries are generated for mansion/town interior manifest
candidates so a full interior can be built from ROM layout tables once its
research artifact accounts for the room inventory. Town interiors are day-only
entries because their exterior doors are inaccessible at night. Mansion
interiors remain fixed-palette entries unless later evidence proves otherwise.
These entries must still be interpreted per submap: Berkeley Mansion Part 1 is
exact-fixture validated by the current save state, while Berkeley Mansion Part 2
is rendered from the same ROM recipe family and remains `projected` until a
Part 2 runtime capture or transition probe validates that exact submap.

## Interpretation

This milestone intentionally separates "rendered" from "proven pixel-perfect."
The important improvement is that unknown areas can now be generated through the
same recipe resolver used by validated areas. If a projected area still looks
wrong, that is evidence about a missing recipe rule, not a hidden per-area
override.

The next validation work should focus on per-promoted-interior fixture coverage,
runtime transition/alignment probes, crop/layout parity for remaining inferred
mansion-door templates, and coordinate-aware composition. The broad recipe atlas
no longer has a deferred or diagnostic render family.
