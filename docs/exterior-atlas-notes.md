# Exterior Atlas Notes

The exterior atlas renderer is the first broad pass over the game's exterior
map inventory. It is intentionally an atlas, not a final stitched world map:
each output image is a layout-space segment for one `cv2r` location candidate.

## Command

```sh
npm run render:atlas:exterior
```

This writes:

- `out/exterior-atlas/manifest.json`
- `out/exterior-atlas/atlas-data.js`
- `out/exterior-atlas/images/*.png`

The same command can write self-contained demo assets:

```sh
node src/index.js render-exterior-atlas --rom roms/cv2.nes --out demos/2026-05-17-exterior-atlas-demo/assets/exterior-atlas
```

## Inventory Rules

The atlas starts from the vendored `cv2r` manifest and includes:

- town exteriors from objset `0`, areas `0..6`
- mansion door exteriors from objset `1`
- all route-like objset `2`, `3`, and `4` locations, including exterior-like
  ceiling areas such as Dabi's Path and Debious Woods
- Castlevania exterior from objset `5`

It excludes town interiors, mansion interiors, entry rooms, and Dracula's fight.

Current coverage:

| Category | Count |
| --- | ---: |
| Town exteriors | 7 |
| Mansion door exteriors | 5 |
| Western overworld | 24 |
| Eastern overworld | 11 |
| Mountains and castle approach | 7 |
| Castlevania exterior | 1 |
| **Total** | **55** |

All 55 candidates render a PNG in the current pass. Thirteen candidates have
multi-section layout headers and now render taller than one viewport row.

## Confidence

The atlas manifest separates renderability from validation confidence:

- `validated-template`: a representative screen for that template family has
  exact emulator fixture parity. This currently covers Jova town and Jova Woods,
  so town exteriors and objset `2` route areas are stronger than a raw guess.
- `inferred-template`: the ROM table path resolves and renders, but the
  template's CHR/palette selection still needs representative emulator
  validation before the output should be treated as final pixel-perfect art.

Current confidence split:

| Confidence | Count |
| --- | ---: |
| Validated-template | 31 |
| Inferred-template | 24 |

## Template Assumptions

| Objset | Template | CHR banks | Palette | Status |
| ---: | --- | --- | --- | --- |
| `0` | Town exterior, day | `0/1` | derived from bank 7 town layout palette table, with Jova validating `4:$9EA2` | validated-template |
| `1` | Mansion door exterior, day | `4/5` | `4:$9FE8` | inferred-template |
| `2` | Overworld woods/routes, day | `2/3` | `4:$9FC6`, with Dora Woods - Part 2 overriding to `4:$9FD7` from bank 7 pointer `$88DB` | validated-template |
| `3` | Cemetery/marsh/woods exterior, day | `4/5` | `4:$9FE8` | inferred-template |
| `4` | Mountain/ditch/bridge exterior, day | `6/7` | `4:$A070` | inferred-template |
| `5` | Castlevania exterior, day | `8/9` | `4:$A0C5` | inferred-template |

These assumptions are deliberately preserved in generated metadata so a future
PNG renderer, web canvas renderer, or regression suite can see exactly which
parts are proven and which parts are pending validation.

## Layout Grids

Layout headers begin with two bytes that define the segment grid:

- byte `0`: horizontal column-group count
- byte `1`: vertical section count

Each pointer cell after those two bytes selects one layout block matrix. Atlas
v0 originally rendered section `0` only. The current renderer walks every
section in the header for atlas output while still allowing narrow validation
segments to request one section explicitly.

Town descriptors keep `heightBlocks=8` for exact nametable/viewport
reconstruction, but layout-space composition uses `rowsPerLayoutSection=7`.
That avoids stitching in the hidden/wrapped bottom block row that the runtime
row-streaming code uses for scrolling.

Representative multi-section entries:

| Location | Grid | Output |
| --- | ---: | ---: |
| Jova | `4x2` | `1024x448` |
| Alba | `4x3` | `1024x672` |
| Dora Woods - Part 2 | `2x2` | `512x448` |
| Dabi's Path - Part 1 | `2x2` | `512x448` |
| Castlevania | `4x4` | `1024x896` |

## Special Screen Records

Five exterior candidates use special marker bytes as their first screen-record
byte. Atlas v0 handles these by preserving the raw bytes and using byte `1` as
the effective layout index:

| Location | First bytes | Effective layout |
| --- | --- | ---: |
| Veros Woods - Part 2 | `FE 06 FF` | `0x06` |
| Dabi's Path - Part 1 | `FD 13 FF` | `0x13` |
| Aljiba Woods - Part 2 | `FE 09 00` | `0x09` |
| Sadam Woods - Part 2 | `FD 06 00` | `0x06` |
| Dora Woods - Part 2 | `FE 0D FF` | `0x0D` |

## Dora Palette Fixture

`out/states/dora-woods-part-2.mss` is a local Mesen save-state fixture for
Dora Woods - Part 2. Capturing it with `npm run capture:dora-woods-part-2`
shows the day background palette in PPU RAM as:

```text
0F 00 10 0A 0F 16 1C 06 0F 22 19 1C 0F 11 20 15
```

Those 16 bytes are present in PRG bank `4` at `$9FD7`, and bank `7:$88DB`
points to that palette. Rendering the full Dora Woods - Part 2 layout with
palette `4:$9FD7`, then cropping at the captured scroll position
`x=144, y=48`, matches the emulator background render with `0` differing
pixels. The earlier object-set fallback palette `4:$9FC6` is still valid for
the Jova Woods fixture, but not for this Dora screen.

## Limits

Atlas v0 is not yet the final map image.

- It does not place all segments into world topology coordinates.
- It does not render night palettes yet.
- Inferred templates need representative emulator validation.
- Most non-town palette choices are still object-set fallbacks; Dora Woods -
  Part 2 is the first fixture-backed per-location override.
- Mansion-door renders are still inferred and visibly wrong; they likely need a
  separate CHR/tile template investigation rather than only a palette change.

The next milestone should attach viewport-sized save-state validation windows
to representative multi-section layouts, then use those fixtures to isolate
palette selection and mansion-template fixes.
