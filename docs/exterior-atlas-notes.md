# Exterior Atlas Notes

The exterior atlas renderer is the first broad pass over the game's exterior
map inventory. It is intentionally an atlas, not a final stitched world map:
each output image is a layout-space segment for one [`cv2r`](https://github.com/tonylukasavage/cv2r) location candidate.

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

The atlas starts from the vendored [`cv2r`](https://github.com/tonylukasavage/cv2r) manifest and includes:

- town exteriors from objset `0`, areas `0..6`
- mansion door exteriors from objset `1`
- all route-like objset `2`, `3`, and `4` locations, including exterior-like
  ceiling areas such as Dabi's Path and Debious Woods
- Castlevania final area from objset `5`

It excludes town interiors, mansion interiors, entry rooms, and Dracula's fight.

Current coverage:

| Category | Count |
| --- | ---: |
| Town exteriors | 7 |
| Mansion door exteriors | 5 |
| Western overworld | 24 |
| Eastern overworld | 11 |
| Mountains and castle approach | 7 |
| Castlevania final area | 1 |
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
| Validated-template | 50 |
| Inferred-template | 5 |

## Template Assumptions

| Objset | Template | CHR banks | Palette | Status |
| ---: | --- | --- | --- | --- |
| `0` | Town exterior, day | `0/1` | runtime selector table, with Jova resolving to transfer `$16` and palette `4:$9EA2` | validated-template |
| `1` | Mansion door exterior, day | `8/9` | runtime selector table, with Berkeley Mansion door resolving to transfer `$0F` and palette `4:$9F5E` | inferred-template |
| `2` | Overworld woods/routes, day | `2/3` | runtime selector table, with Jova Woods `$22 -> 4:$9FC6`, Dora Woods Part 2 `$23 -> 4:$9FD7`, and Dabi's Path `$26 -> 4:$A00A` validated by fixtures | validated-template |
| `3` | Cemetery/marsh/woods exterior, day | `4/5` | runtime selector table, with Camilla Cemetery resolving exact day/night selector palettes | validated-template |
| `4` | Mountain/ditch/bridge exterior, day | `6/7` | runtime selector table, with Vrad Graveyard and Castlevania Bridge resolving exact selector palettes | validated-template |
| `5` | Castlevania final area, fixed palette | `0B/0C` | runtime selector table, with Castlevania resolving transfer `$57 -> 4:$A150` | validated-template |

These assumptions are deliberately preserved in generated metadata so a future
PNG renderer, web canvas renderer, or regression suite can see exactly which
parts are proven and which parts are pending validation.

The mansion-door CHR banks were promoted from the render recipe audit, not from
a per-area visual tweak: Berkeley Mansion door live PPU pattern memory matches
CHR banks `08/09`, and its palette selector resolves `$0F -> 4:$9F5E`. Layout
crop validation is still pending, so the family remains `inferred-template`.

Objset `4` was later promoted from the same audit path. Vrad Graveyard,
Castlevania Bridge, and Deborah Cliff live PPU pattern memory matches CHR banks
`06/07`; the previous `08/09` assumption caused visibly scrambled diagnostic
renders.

Objset `5` is treated as the Castlevania final area rather than an exterior
day/night map. Its live PPU pattern memory matches CHR banks `0B/0C`, and its
fixed palette resolves through the ROM selector table as `$57 -> 4:$A150`.

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

## Runtime Palette Selector

The palette milestone decoded the game path that queues background palette
transfers:

- fixed-bank routine `7:$C7CF`, called by `7:$C7FD`, derives a palette
  index-list pointer from runtime objset/area/submap context
- bank `2:$F7C5` points to one palette index table per objset
- each area has day and night index-list pointers, four bytes per area
- each submap entry is two bytes: a background transfer id and an auxiliary
  transfer id
- fixed-bank table `7:$C895` maps transfer ids to the actual transfer stream
  or raw background palette bytes

The atlas manifest records this selector chain under
`template.paletteSelector` for each candidate when the selected transfer stream
starts with a raw background palette byte (`$0F`). Runtime context aliases are
now resolved from ROM screen-record structure first, with
`data/runtime-context-fixtures.json` retained as validation evidence and a
fallback alias source.

Representative day fixtures:

| Location | Selector context | Index list | Transfer id | Palette |
| --- | --- | --- | ---: | --- |
| Jova Woods | `2:0:0` | `2:$A1C0` | `$22` | `4:$9FC6` |
| Dora Woods - Part 2 | `2:0:3` fixture alias for layout candidate `2:8:2` | `2:$A1C0` | `$23` | `4:$9FD7` |
| Dabi's Path | `2:3:0` / `2:3:1` | `2:$A6EB` | `$26` | `4:$A00A` |

Dora Woods - Part 2 is the first evidence that a [`cv2r`](https://github.com/tonylukasavage/cv2r) layout candidate tuple
can differ from the live runtime palette selector context. The renderer now
derives that alias from the ROM: candidate `2:8:2` starts at special screen
record `2:$A1AB` (`$FE $0D`), which is nested inside the same-marker special
stream for `2:0:3` at `2:$A1A3` (`$FE $06`). The derived raw runtime submap is
`$83`, matching the Mesen fixture.

## Dora Palette Fixture

`out/states/dora-woods-part-2.mss` is a local Mesen save-state fixture for
Dora Woods - Part 2. Capturing it with `npm run capture:dora-woods-part-2`
shows the day background palette in PPU RAM as:

```text
0F 00 10 0A 0F 16 1C 06 0F 22 19 1C 0F 11 20 15
```

Those 16 bytes are present in PRG bank `4` at `$9FD7`. The decoded selector
path reaches it through runtime context `2:0:3`, transfer id `$23`, and bank
`7:$88DB`. Rendering the full Dora Woods - Part 2 layout with palette
`4:$9FD7`, then cropping at the captured scroll position
`x=144, y=48`, matches the emulator background render with `0` differing
pixels. CPU RAM provides the alias evidence: `$30=02`, `$50=00`, `$51=83`;
the palette routine masks `$51 & $7F`, giving submap `3`.

## Dabi Palette Fixture

`out/states/dabis-path.mss` is a local Mesen save-state fixture for Dabi's
Path. Capturing it with `npm run capture:dabis-path` shows the day background
palette in PPU RAM as:

```text
0F 00 23 03 0F 1C 04 0C 0F 01 11 05 0F 01 20 05
```

Those 16 bytes are present in PRG bank `4` at `$A00A`. The selector path for
both Dabi's Path candidates uses index list `2:$A6EB`, transfer id `$26`, and
bank `7:$88E1`. The fixture crop differs only at the known scroll-wrap edge
and enemy-overlap pixels; the palette bytes match exactly.

## Limits

Atlas v0 is not yet the final map image.

- It does not place all segments into world topology coordinates.
- It does not render night palettes yet, although the selector table already
  exposes day and night index-list pointers.
- Inferred templates need representative emulator validation.
- The palette mechanism is decoded, and the known Dora alias is now derived
  from ROM screen-record structure and validated by save-state evidence.
- Mansion-door renders are still inferred and visibly wrong; they likely need a
  separate CHR/tile template investigation rather than only a palette change.

The topology milestone adds an adjacency graph on top of this atlas; see
`docs/exterior-topology-notes.md`. Mansion template fixes and final
world-coordinate composition remain separate follow-up work.
