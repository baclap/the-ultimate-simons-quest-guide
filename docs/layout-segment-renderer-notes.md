# Layout Segment Renderer Notes

The layout segment renderer is the first renderer in this project that emits a
larger-than-viewport map slice from ROM layout space rather than arranging
already-rendered 256x240 TV frames.

## Current Segment

The first committed segment definition is `jova-woods-day` in
`data/layout-segments.json`.

It uses the validated `jova-woods-day` background descriptor and renders layout
section `0`, column groups `0..3`, from layout header `2:$A23E`.

Resolved column groups:

| Column group | Pointer address | Layout address |
| --- | ---: | ---: |
| 0 | `2:$A240` | `2:$A4DA` |
| 1 | `2:$A242` | `2:$9F89` |
| 2 | `2:$A244` | `2:$A3FA` |
| 3 | `2:$A246` | `2:$A4A2` |

Each column group is an 8x7 block grid. Each block is 4x4 NES background tiles,
or 32x32 pixels. The output is therefore:

```text
4 column groups * 8 blocks/group * 32 px/block = 1024 px wide
7 block rows * 32 px/block = 224 px tall
```

## Command

```sh
npm run render:segment:jova-woods
```

This writes:

- `out/layout-segments/jova-woods-day.png`
- `out/layout-segments/jova-woods-day.json`

The PNG is generated entirely from the ROM:

- layout bytes from PRG bank `2`
- tile/metatile definitions from PRG bank `4:$8CF4`
- CHR banks `2/3`
- day background palette at PRG bank `4:$9FC6`

## Layout Header Grids

The layout header's first two bytes are now decoded as grid dimensions:

```text
byte 0 = horizontal column-group count
byte 1 = vertical section count
```

Each pointer after the header selects one layout block matrix. The renderer can
still target a single `layoutSection` for validation slices, but atlas entries
can set `renderAllSections` to draw every row of the header. The resulting
metadata records `layoutSections`, `layoutGrid`, and per-cell pointer addresses.

For towns, section height is not the same as the full 8-block nametable
descriptor height. `rowsPerLayoutSection=7` is used for layout-space
composition, while `heightBlocks=8` remains available for exact viewport
reconstruction with row-streamed hidden/wrapped rows.

Examples from the exterior atlas:

| Location | Header grid | Rendered size |
| --- | ---: | ---: |
| Jova | `4x2` | `1024x448` |
| Dora Woods - Part 2 | `2x2` | `512x448` |
| Castlevania | `4x4` | `1024x896` |

## Interpretation

This is a continuous layout-space segment, not a screenshot stitch. The renderer
walks adjacent column-group pointers and draws each metatile block into one
shared pixel buffer.

The first 256x224 column group is tied to the existing Jova Woods emulator
fixture: column group `0`, layout `2:$A4DA`, is the same layout source used by
the descriptor that already validates at 0 differing visible-page nametable
bytes and 0 differing PNG pixels against the captured PPU background.

The TV viewport itself is still 256x240 and can involve scroll wrapping, HUD
space, and runtime nametable state. For map output, this segment focuses on the
underlying map layout. Future validation should compare viewport-sized windows
against emulator captures while keeping the full map image derived from layout
space.

## Route Composition

The renderer can also compose multiple continuous layout segments into one route
image:

```sh
npm run render:route:jova-to-veros
```

This writes:

- `out/layout-routes/jova-to-veros-outdoor-day.png`
- `out/layout-routes/jova-to-veros-outdoor-day.json`

The first route is `jova-to-veros-outdoor-day`, a 3072x224 day-palette outdoor
route from Jova Woods through Veros Woods:

| Segment | Runtime context | Layout header | Column groups | Status |
| --- | --- | ---: | --- | --- |
| Jova Woods | `objset=2 area=0 submap=0` | `2:$A23E` | `0..3` | validated source layout |
| Jova-Veros Bridge | `objset=2 area=0 submap=1` | `2:$A250` | `0..3` | inferred |
| Veros Woods - Part 1 | `objset=2 area=0 submap=2` | `2:$A262` | `0..1` | inferred |
| Veros Woods - Part 2 | `objset=2 area=0 submap=3` | `2:$A26C` | `0..1` | special inferred |

The Veros Woods - Part 2 screen-record pointer resolves to `2:$A1A3`, whose
first bytes are:

```text
FE 06 FF 00 01 16 0B 0C
```

For this milestone, the segment records `layoutIndexOverride: 0x06`, resolving
layout header `2:$A26C`. That keeps the special-case discovery explicit in
reference data while preserving the raw screen-record bytes in generated
metadata.
