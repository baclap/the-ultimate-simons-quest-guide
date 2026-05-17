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
- render a continuous Jova Woods layout-space segment from adjacent ROM layout column groups
- render the full outdoor Jova-to-Veros route as connected layout-space segments
- render an exterior atlas of 55 candidates from `cv2r` metadata plus ROM layout, tile, CHR, and palette data
- decode layout headers as two-dimensional grids and render full multi-section atlas entries
- validate Dora Woods - Part 2 against a Mesen save-state fixture and render it with its ROM palette at `4:$9FD7`
- decode the runtime background palette selector path through bank `2:$F7C5` and fixed-bank transfer table `7:$C895`
- validate Dabi's Path through that selector path, resolving transfer id `$26` to palette `4:$A00A`
- extract live runtime context bytes from save-state captures and store durable
  fixture evidence in `data/runtime-context-fixtures.json`

Generated output is intentionally ignored by git:

- `out/chr/chr-bank-00.png` through `out/chr/chr-bank-0f.png`
- `out/manifest.json`
- `out/captures/`
- `out/states/`

The local ROM copy is also ignored:

- `roms/cv2.nes`

Committed reference data is intentionally tracked:

- `data/background-descriptors.json`
- `data/runtime-context-fixtures.json`

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
- The first layout segment renderer renders `jova-woods-day` as a 1024x224 continuous segment from layout header `2:$A23E` and column groups `0..3`.
- The first route renderer composes `jova-to-veros-outdoor-day` into a 3072x224 outdoor route: Jova Woods, Jova-Veros Bridge, Veros Woods - Part 1, and Veros Woods - Part 2.
- The first exterior atlas pass renders 55 exterior candidates, including towns, overworld routes, mansion doors, mountains, Castlevania Bridge, and Castlevania exterior. It records 31 validated-template renders and 24 inferred-template renders.
- Special exterior screen-record markers `FD`/`FE` are now preserved in metadata and decoded by using byte `1` as the effective layout index for the current five known exterior cases.
- Layout header byte `0` is the horizontal column-group count and byte `1` is the vertical section count. The atlas now renders all sections for 13 multi-section layouts, including Jova `4x2`, Dora Woods - Part 2 `2x2`, Dabi's Path - Part 1 `2x2`, and Castlevania `4x4`.
- Day background palettes are now resolved from the ROM's runtime selector path where the selected transfer stream is raw palette data. The manifest records the palette index table, transfer id, transfer pointer, and final palette address.
- Dora Woods - Part 2 exposes an important context-alias gap: its `cv2r` layout candidate is `2:8:2`, but the validated live palette selector context is `2:0:3`. CPU RAM confirms this through `$30=02`, `$50=00`, `$51=83`.
- Runtime context bytes are now tracked as `$30` object set, `$50` area, and
  `$51` raw submap/flags. The renderer consumes fixture-backed aliases from
  `data/runtime-context-fixtures.json`.
- These verified checkpoints are now stored as reusable descriptors in `data/background-descriptors.json`.
- Runtime nametable mirroring for the current Jova fixture behaves vertically even though the iNES header advertises horizontal mirroring, so mirroring must be treated as mapper/runtime state.

## Strategy

Mesen is a calibration oracle, not the intended source for every final screen.

The long-term renderer should decode the ROM's screen, tile, CHR-bank, palette, and actor data and render the map directly. Emulator captures are used to prove the decoder against representative screen families and special cases. This avoids needing to programmatically traverse every location in-game.

Day/night is a first-class render variant. Outdoor town and overworld screens should eventually render both variants. Town interiors are day-only because they are inaccessible at night. Mansion interiors are accessible at night, but their interior palette is confirmed stable between day and night, so they only need one rendered interior variant.

## Exterior Atlas Milestone

The current implementation target is turning the exterior atlas into a topology-aware world map while keeping descriptor data usable by multiple render targets.

Work items:

1. Preserve decoded checkpoints and atlas entries as data.
   - Store runtime context, ROM addresses, page selection, palette mode, and validation captures in `data/background-descriptors.json`.
   - Store atlas render status, screen-record bytes, layout headers, tile-set addresses, CHR banks, and palette assumptions in generated atlas manifests.
   - Keep docs close enough to the data that a future renderer can use the discoveries without replaying the same traces.

2. Validate multi-section layouts.
   - Add save-state fixtures for Jova vertical movement and at least one additional multi-section outdoor area.
   - Keep the Dora Woods - Part 2 fixture as the reference for the first runtime palette context alias.
   - Compare viewport-sized windows against the full layout-space output without using emulator captures as source art.

3. Convert atlas entries into topology.
   - Use doors, sign text, route names, and observed route continuity to define adjacency/composite placement.
   - Keep the atlas images as layout-space source segments, not emulator screenshots.

4. Promote inferred templates.
   - Add representative save-state fixtures for mansion doors, objset `3`, objset `4`, and Castlevania exterior.
   - Capture both day and night descriptors for outdoor locations.
   - Keep mansion interiors as one fixed-palette descriptor unless later evidence shows otherwise.

5. Generalize runtime palette contexts.
   - The selector mechanism is decoded, but aliases like Dora show that every
     `cv2r` layout tuple is not always the runtime palette tuple.
   - Decode the transition parser around fixed-bank `7:$D0B0`, which writes
     `$30/$50/$51` from route transition table bytes.
   - Preserve day and night palette variants as first-class render options.
   - Add representative save states to prove the remaining alias cases.

6. Validate.
   - Capture deterministic emulator screenshots, PPU state, and OAM.
   - Compare generated output with pixel diffs.

7. Scale out.
   - Generate descriptors for all locations from the `cv2r` manifest and the ROM tables.
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
