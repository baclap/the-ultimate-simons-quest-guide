# Capture Schema

`mesen-capture-screen` creates one directory per deterministic emulator capture.

Example:

```sh
npm run capture:jova
npm run render:jova-capture
npm run capture:jova-woods
npm run render:jova-woods-capture
```

Current Jova fixture:

```text
out/captures/jova-day/
out/captures/jova-woods-day/
```

Save states used as local capture starting points live under `out/states/`. They are emulator artifacts and are intentionally ignored by git; commit the decoded addresses and behavior in docs/code instead of committing `.mss` files.

## Files

- `screenshot.png`: Mesen's native 256x240 RGB screenshot.
- `ppu-0000-1fff-patterns.bin`: 8 KB PPU pattern memory at capture time.
- `ppu-2000-2fff-nametables.bin`: 4 KB PPU nametable/attribute memory.
- `ppu-3f00-3f1f-palettes.bin`: 32 bytes of PPU palette RAM.
- `oam-0000-00ff-sprites.bin`: 256 bytes of NES primary sprite/OAM RAM.
- `cpu-0000-07ff.bin`: 2 KB internal CPU RAM.
- `state.json`: capture timing, ROM identity, screen size, and selected PPU state.

Derived renderer outputs:

- `background.png`: background reconstructed from PPU memory.
- `background.diff.png`: magenta pixel diff against `screenshot.png`.
- `background.sprites.png`: transparent sprite layer reconstructed from OAM and PPU pattern/palette memory.
- `background.composite.png`: background plus sprites.
- `background.composite.diff.png`: magenta pixel diff for the composited output.

## State Fields

Important fields in `state.json`:

- `frames`: frame count when captured.
- `location`: human-readable location label, such as `Jova`.
- `variant`: render/capture variant, currently `day`, `night`, or `unknown`.
- `access`: access class, such as `outdoor`, `interior`, or `mansion`.
- `startPresses`: scripted input windows used to reach the state.
- `inputs`: generic scripted input windows, encoded as `button:startFrame:duration`.
- `statePath`: optional local `.mss` file loaded before capture.
- `stateLoadedFrame`: frame when the `.mss` was loaded in testRunner.
- `settleFrames`: frames waited after loading the `.mss` before capture.
- `ppuXScroll`: PPU fine X scroll.
- `ppuVideoRamAddr`: current internal PPU VRAM address.
- `ppuTmpVideoRamAddr`: internal temporary PPU VRAM address used to reconstruct scroll.
- `ppuBackgroundPatternAddr`: active background pattern table base.
- `ppuSpritePatternAddr`: active 8x8 sprite pattern table base.
- `ppuLargeSprites`: whether sprites are 8x16 instead of 8x8.
- `ppuSpritesEnabled`: whether sprite rendering is enabled in PPUMASK.
- `ppuSpriteRamAddr`: current OAM address.

## Current Result

The Jova day capture currently renders the background from PPU data with this result:

```text
differingPixels: 316
totalPixels: 61440
differenceRatio: 0.005143229166666667
```

The same fixture renders as a full background+sprite composite from PPU and OAM data with this result:

```text
differingPixels: 0
totalPixels: 61440
differenceRatio: 0
```

This proves the remaining background-only differences are dynamic sprite pixels rather than a background reconstruction problem.

The Jova Woods save-state fixture also composites to a 0-pixel diff:

```text
npm run capture:jova-woods
npm run render:jova-woods-capture
background-only differingPixels: 306
background+sprite differingPixels: 0
```

## Next Work

1. Capture representative outdoor day/night palette fixtures.
2. Capture one mansion/interior-style screen.
3. Add more named save-state fixtures for representative outdoor areas.
4. Use these emulator captures as fixtures while decoding ROM room/background data.

## Variant Model

Long-term map output should treat day/night as a first-class render variant:

```text
<location>.<variant>.png
```

Current variant rules:

- Outdoor town/overworld screens need `day` and `night` variants.
- Town interiors are day-only because they are not accessible at night.
- Mansion interiors are accessible at night, but confirmed palette-stable between day and night, so they only need one interior render variant.

Representative emulator captures should include outdoor day/night pairs early enough to decode palette switching, but the final full-map renderer should render variants from ROM data rather than requiring emulator traversal for every screen.
