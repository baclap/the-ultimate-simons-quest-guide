# Reverse-Engineering Plan

## Current State

The repository now has a zero-dependency Node CLI that can:

- parse the ROM's iNES/NES 2.0 header
- verify PRG/CHR boundaries and SHA-256
- render all 16 CHR ROM banks into PNG tile sheets
- generate a `cv2r`-derived manifest of locations, actors, and doors
- capture deterministic Mesen fixtures with screenshot, PPU memory, CPU RAM, and OAM
- load local Mesen `.mss` save states as representative fixture starting points
- reconstruct a captured screen from PPU/OAM artifacts
- decode the fixed `$C6C0` PPU transfer stream format
- replay traced `$0700-$07FF` NMI PPU buffer updates into nametable bytes
- derive background layout/tile pointers from `objset`, `area`, and `submap`
- render descriptor-backed ROM-native Jova town and Jova Woods nametable checkpoints from PRG bank `2` layout data and PRG bank `4` tile data
- render ROM-native background PNGs from descriptor nametables, CHR banks, and ROM palette bytes
- organize ROM-native screens into a route-ordered viewport catalog with validated and inferred status metadata

Generated output is intentionally ignored by git:

- `out/chr/chr-bank-00.png` through `out/chr/chr-bank-0f.png`
- `out/manifest.json`
- `out/captures/`
- `out/states/`

The local ROM copy is also ignored:

- `roms/cv2.nes`

Committed reference data is intentionally tracked:

- `data/background-descriptors.json`

## Findings

- The local ROM is 262160 bytes.
- Header bytes: `4E 45 53 1A 08 10 10 08 00 00 00 00 00 00 00 01`.
- Mapper: MMC1 / mapper 1.
- Mirroring: horizontal.
- PRG ROM: 8 banks, 131072 bytes.
- CHR ROM: 16 banks, 131072 bytes.
- CHR starts at file offset `0x20010`.
- The vendored `cv2r` metadata yields 96 locations, 588 actors, and 25 doors.
- The Jova gameplay background is built through the NMI PPU update buffer, not only through a full-screen transfer stream.
- Replaying the traced Jova `$0700` buffer reproduces nametable page 0 and its mirror exactly against the Mesen capture.
- The stable Jova block layout comes from PRG bank `2:$8497`; tile definitions come from PRG bank `4:$8461`; attributes come from PRG bank `4:$841E`.
- The first ROM-native Jova checkpoint reproduces captured nametable page 0 and its mirror exactly. Rows `0-3` and `28-29` now come from the traced row-streaming algorithm instead of a hard-coded edge-tile descriptor.
- The Jova right-side checkpoint reproduces captured nametable page 1 and its mirror exactly using the same row-streaming logic with column group `3`.
- The common background pointer path now derives layout headers and tile sets from `objset`, `area`, and `submap`.
- The Jova Woods save-state fixture reproduces captured nametable page 0 and its mirror exactly from screen record `2:$A1A0`, layout header `2:$A23E`, visible layout `2:$A4DA`, and tile set `4:$8CF4`.
- The validated Jova and Jova Woods backgrounds now render as ROM-native PNGs with 0 differing pixels against PPU-background reconstructions.
- The first regional renderer catalogs `jova-to-veros-day` from three validated screens and two inferred manifest-context candidates: Jova-Veros Bridge and Veros Woods - Part 1. It is route-ordered, but not a continuous world-space stitch.
- These verified checkpoints are now stored as reusable descriptors in `data/background-descriptors.json`.
- Runtime nametable mirroring for the current Jova fixture behaves vertically even though the iNES header advertises horizontal mirroring, so mirroring must be treated as mapper/runtime state.

## Strategy

Mesen is a calibration oracle, not the intended source for every final screen.

The long-term renderer should decode the ROM's screen, tile, CHR-bank, palette, and actor data and render the map directly. Emulator captures are used to prove the decoder against representative screen families and special cases. This avoids needing to programmatically traverse every location in-game.

Day/night is a first-class render variant. Outdoor town and overworld screens should eventually render both variants. Town interiors are day-only because they are inaccessible at night. Mansion interiors are accessible at night, but their interior palette is confirmed stable between day and night, so they only need one rendered interior variant.

## Descriptor Pipeline Milestone

The current implementation target is turning verified one-off checkpoints into reusable descriptor data that can be consumed by multiple render targets.

Work items:

1. Preserve decoded checkpoints as data.
   - Store runtime context, ROM addresses, page selection, palette mode, and validation captures in `data/background-descriptors.json`.
   - Keep docs close enough to the data that a future renderer can use the discoveries without replaying the same traces.

2. Expand descriptor derivation from decoded background pointer tables.
   - Use `inspect-background-context` to derive layout headers and tile-set pointers for more `out/manifest.json` locations.
   - Identify the remaining descriptor fields not fully encoded yet: dimensions, page selection, row streaming, CHR-bank choice, and palette mode.
   - Use Jova town and Jova Woods as known-good endpoints while expanding the decoder.

3. Expand descriptor coverage.
   - Add representative save-state fixtures for additional towns, roads, mansions, and interiors.
   - Capture both day and night descriptors for outdoor locations.
   - Keep mansion interiors as one fixed-palette descriptor unless later evidence shows otherwise.

4. Validate.
   - Capture deterministic emulator screenshots, PPU state, and OAM.
   - Compare generated output with pixel diffs.

5. Scale out.
   - Generate descriptors for all locations from `out/manifest.json` and the ROM tables.
   - Define adjacency/composite layout per area.
   - Generate full-map PNGs plus optional actor/door overlays.

## Emulator Note

Mesen 2.1.1 is installed locally:

- app bundle: `/Applications/Mesen.app`
- executable: `/Applications/Mesen.app/Contents/MacOS/Mesen`
- shell shim: `/opt/homebrew/bin/mesen`
- dependency: Homebrew `sdl2 2.32.10`

The installed binary is Apple Silicon `arm64`, code-sign verification passes, and no `com.apple.quarantine` attribute was present after installation.

`--testRunner` automation is now confirmed. See `docs/mesen-automation.md` for the working invocation, Lua sandbox notes, and smoke-test outputs.

The first screen-level capture path is also confirmed. `npm run capture:jova` writes emulator screenshot, PPU memory, CPU RAM, and OAM artifacts. `npm run render:jova-capture` reconstructs the background and sprites from those artifacts. Save-state-driven fixtures are now supported with `--state`; `npm run capture:jova-woods` loads `out/states/jova-woods.mss` and captures a stable overworld screen.

Current Jova day results:

- background-only diff: 316 pixels, about 0.51%
- background+sprite composite diff: 0 pixels

Current Jova Woods day results:

- background-only diff: 306 pixels, about 0.50%
- background+sprite composite diff: 0 pixels
- native nametable page 0 and vertical mirror: 0 differing bytes

That gives us a pixel-perfect calibration fixture while still keeping the final map renderer focused on ROM decoding instead of exhaustive emulator traversal. See `docs/capture-schema.md`.

The first background-decoder utilities are also in place. `npm run decode:title-transfer` validates the fixed transfer stream decoder, and `npm run replay:jova-buffer-trace` validates the traced NMI buffer format. See `docs/background-decoder-notes.md`.
