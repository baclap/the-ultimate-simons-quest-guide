# Castlevania II Image Map Tools

This workspace is for generating a pixel-perfect image map of *Castlevania II: Simon's Quest* from the ROM artifact itself.

The current vertical slice includes:

- verifies an iNES ROM and records its mapper/PRG/CHR layout
- renders every CHR ROM bank into native tile-sheet PNGs
- generates a location/actor/door manifest from the vendored `cv2r` metadata
- captures deterministic Mesen screen fixtures
- reconstructs a captured screen from PPU/OAM artifacts for pixel-diff calibration
- decodes the fixed PPU transfer stream format and replays traced NMI PPU buffer updates
- renders ROM-native Jova town and Jova Woods nametable checkpoints directly from PRG layout/tile data

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
npm run render:jova-capture
npm run render:jova-woods-capture
npm run decode:title-transfer
npm run replay:jova-buffer-trace
npm run render:jova-native
npm run render:jova-woods-native
```

You can also pass paths directly:

```sh
node src/index.js verify-rom --rom "/path/to/Castlevania II - Simon's Quest (USA).nes"
node src/index.js extract-chr --rom roms/cv2.nes --out out/chr --scale 1
node src/index.js manifest --out out/manifest.json
```

## Next Milestone

The next milestone is decoding the room background format into full 256x240 screen PNGs. The vendored `cv2r` source gives us strong anchors for locations, actors, doors, palette offsets, and bank layout, but it does not already contain a complete background renderer. Mesen is now available as a representative calibration oracle, including a Jova day fixture that round-trips to a 0-pixel composite diff.

Current background-loader findings are documented in `docs/background-decoder-notes.md`. The important checkpoint is that replaying the traced `$0700` NMI PPU buffer reproduces Jova nametable page 0 exactly against the Mesen capture, giving us a concrete oracle for the ROM-native Jova decoder. `npm run render:jova-native` verifies Jova town page 0 and the right-side page against representative captures. `npm run render:jova-woods-native` verifies the first overworld checkpoint from a save-state capture.

The intended path is:

1. identify the remaining room pointer tables and compressed/background layout formats
2. generalize save-state fixtures for representative locations
3. identify the common pointer-table path for town and overworld descriptors
4. verify against representative emulator screenshots
5. expand to full composites and overlay data from `out/manifest.json`
