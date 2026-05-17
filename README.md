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
```

You can also pass paths directly:

```sh
node src/index.js verify-rom --rom "/path/to/Castlevania II - Simon's Quest (USA).nes"
node src/index.js extract-chr --rom roms/cv2.nes --out out/chr --scale 1
node src/index.js manifest --out out/manifest.json
node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0
node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --visible-page 0
```

## Next Milestone

The next milestone is expanding descriptor derivation from the decoded background pointer tables. The vendored `cv2r` source gives us strong anchors for locations, actors, doors, palette offsets, and bank layout, but it does not already contain a complete background renderer. Mesen is available as a representative calibration oracle, including Jova and Jova Woods fixtures that round-trip to 0-pixel composite diffs.

Current background-loader findings are documented in `docs/background-decoder-notes.md`, and the committed descriptor schema is documented in `docs/background-descriptor-schema.md`. The important checkpoint is that `npm run inspect:jova-background` and `npm run inspect:jova-woods-background` derive the layout header and tile-set pointers used by the validated descriptors. `npm run render:jova-native` verifies Jova town page 0, `npm run render:jova-right-native` verifies the right-side page, and `npm run render:jova-woods-native` verifies the first overworld checkpoint from a save-state capture.

The intended path is:

1. derive descriptor candidates for more locations from `out/manifest.json`
2. identify the remaining descriptor fields not fully encoded yet: dimensions, page selection, row streaming, CHR-bank choice, and palette mode
3. add representative save-state fixtures for additional screen families
4. expand descriptor coverage to day/night outdoor variants and fixed-palette interiors
5. verify against representative emulator screenshots, then expand to full composites and overlay data
