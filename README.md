# Castlevania II Image Map Tools

This workspace is for generating a pixel-perfect image map of *Castlevania II: Simon's Quest* from the ROM artifact itself.

The current vertical slice includes:

- verifies an iNES ROM and records its mapper/PRG/CHR layout
- renders every CHR ROM bank into native tile-sheet PNGs
- generates a location/actor/door manifest from the vendored `cv2r` metadata
- captures deterministic Mesen screen fixtures
- reconstructs a captured screen from PPU/OAM artifacts for pixel-diff calibration
- decodes the fixed PPU transfer stream format and replays traced NMI PPU buffer updates
- derives background layout/tile pointers from `objset`, `area`, and `submap`
- renders descriptor-backed ROM-native Jova town and Jova Woods nametable checkpoints directly from PRG layout/tile data
- renders validated ROM-native background PNGs from descriptor nametables, CHR banks, and ROM palette bytes
- organizes ROM-native screens into a route-ordered viewport catalog with validated/inferred status
- renders a continuous Jova Woods layout-space segment from adjacent ROM layout column groups

## ROM Setup

Keep ROMs under `roms/`; that directory is ignored by git except for `.gitkeep`.

Recommended local path:

```sh
roms/cv2.nes
```

## Commands

```sh
npm run verify-rom
npm run extract-chr
npm run manifest
npm run render-all
npm run mesen:smoke
npm run capture:jova
npm run capture:jova-woods
npm run inspect:jova-background
npm run inspect:jova-woods-background
npm run render:jova-capture
npm run render:jova-woods-capture
npm run decode:title-transfer
npm run replay:jova-buffer-trace
npm run render:jova-native
npm run render:jova-right-native
npm run render:jova-woods-native
npm run render:jova-native-png
npm run render:jova-right-native-png
npm run render:jova-woods-native-png
npm run render:region:jova-to-veros
npm run render:segment:jova-woods
npm run render:route:jova-to-veros
```

You can also pass paths directly:

```sh
node src/index.js verify-rom --rom "/path/to/Castlevania II - Simon's Quest (USA).nes"
node src/index.js extract-chr --rom roms/cv2.nes --out out/chr --scale 1
node src/index.js manifest --out out/manifest.json
node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0
node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --visible-page 0
node src/index.js render-background-native-png --rom roms/cv2.nes --descriptor jova-day --state out/captures/jova-day/state.json --out out/decoder/jova-native-background.png
node src/index.js render-region-png --rom roms/cv2.nes --region jova-to-veros-day --out out/regions/jova-to-veros-day.png
node src/index.js render-layout-segment-png --rom roms/cv2.nes --segment jova-woods-day --out out/layout-segments/jova-woods-day.png
node src/index.js render-layout-route-png --rom roms/cv2.nes --route jova-to-veros-outdoor-day --out out/layout-routes/jova-to-veros-outdoor-day.png
```

## Demos

Sprint demos live under `demos/`. The current stakeholder demo is:

```text
demos/2026-05-17-sprint-demo/index.html
demos/2026-05-17-regional-demo/index.html
demos/2026-05-17-layout-segment-demo/index.html
```

## Next Milestone

The next milestone is expanding continuous layout rendering from one proven segment toward connected outdoor areas. The vendored `cv2r` source gives us strong anchors for locations, actors, doors, palette offsets, and bank layout, but it does not already contain a complete background renderer. Mesen is available as a representative calibration oracle, including Jova and Jova Woods fixtures that round-trip to 0-pixel composite diffs.

Current background-loader findings are documented in `docs/background-decoder-notes.md`, and the committed descriptor schema is documented in `docs/background-descriptor-schema.md`. Region rendering notes live in `docs/regional-renderer-notes.md`. The important checkpoint is that `npm run inspect:jova-background` and `npm run inspect:jova-woods-background` derive the layout header and tile-set pointers used by the validated descriptors. `npm run render:jova-native` verifies Jova town page 0, `npm run render:jova-right-native` verifies the right-side page, and `npm run render:jova-woods-native` verifies the first overworld checkpoint from a save-state capture. The `render:*native-png` commands turn those same ROM-native backgrounds into PNGs for demos and future map output. `npm run render:region:jova-to-veros` creates a route-ordered viewport catalog from validated descriptors plus inferred manifest-context candidates; it is not a continuous map stitch yet.

`npm run render:segment:jova-woods` is the current continuous-layout milestone:
it renders a 1024x224 Jova Woods day segment from layout header `2:$A23E` and
column groups `0..3`. See `docs/layout-segment-renderer-notes.md`.

`npm run render:route:jova-to-veros` extends that milestone to the full outdoor
Jova-to-Veros route. It renders a 3072x224 route image from Jova Woods,
Jova-Veros Bridge, Veros Woods - Part 1, and Veros Woods - Part 2 layout
segments.

The intended path is:

1. promote additional outdoor contexts into layout segment descriptors
2. attach viewport-sized validation windows to segment metadata without using those captures as source art
3. identify remaining descriptor fields not fully encoded yet: dimensions, page selection, row streaming, CHR-bank choice, and palette mode
4. expand descriptor coverage to day/night outdoor variants and fixed-palette interiors
5. connect validated segments into route graphs, then expand to full composites and overlay data
