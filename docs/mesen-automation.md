# Mesen Automation

Mesen 2.1.1 can be used as a headless scripted capture backend for this project.

## Confirmed Install

- app bundle: `/Applications/Mesen.app`
- executable: `/Applications/Mesen.app/Contents/MacOS/Mesen`
- shell shim: `/opt/homebrew/bin/mesen`
- dependency: Homebrew `sdl2 2.32.10`
- support folder: `~/Library/Application Support/Mesen2`

## Required Bootstrap

Mesen checks for `settings.json` before it enters `--testRunner` mode. If the file is missing, it attempts to show the first-run GUI, which fails in headless automation contexts.

This minimal settings file is sufficient for test-runner mode:

```json
{
  "Version": "2.1.1",
  "ConfigUpgrade": 1
}
```

Confirmed path:

```sh
~/Library/Application Support/Mesen2/settings.json
```

## Headless Test Runner

Mesen source confirms this form:

```sh
mesen --testRunner [lua script] [rom file]
```

This repository has a smoke script:

```sh
mesen --testRunner --timeout=5 tools/mesen/smoke-exit.lua roms/cv2.nes
```

Confirmed result: exits with status `0`.

## Lua File Output

Mesen intentionally disables Lua `io`, `os`, and `require` by default. That is the sandbox issue. Without I/O access, `tools/mesen/smoke-file.lua` exits with status `21`.

Use this runtime-only switch to allow file output:

```sh
--debug.scriptWindow.allowIoOsAccess=true
```

`--testRunner` disables saving settings, so this switch does not permanently open the sandbox.

## Output Paths

Mesen changes its current directory to its support folder before running scripts. Do not rely on relative paths if the output should land in this repository.

Use an absolute output directory via `CV2MAP_MESEN_OUT`:

```sh
CV2MAP_MESEN_OUT="$PWD/out/mesen-smoke" \
  mesen --testRunner \
  --debug.scriptWindow.allowIoOsAccess=true \
  --timeout=10 \
  tools/mesen/smoke-capture.lua \
  roms/cv2.nes
```

Equivalent npm command:

```sh
npm run mesen:smoke
```

Equivalent project CLI command:

```sh
node src/index.js mesen-capture \
  --rom roms/cv2.nes \
  --script tools/mesen/smoke-capture.lua \
  --out out/mesen-smoke \
  --timeout 10
```

Confirmed outputs:

- `out/mesen-smoke/screenshot.png`
- `out/mesen-smoke/state.json`

The screenshot is a native `256 x 240` PNG. The state JSON confirms ROM identity, screen size, and CPU/PPU reads.

Example confirmed state:

```json
{"frames":30,"romName":"cv2.nes","romPath":"/Users/baclap/workspace/castlevania/roms/cv2.nes","screenWidth":256,"screenHeight":240,"cpu2000":168,"ppuPalette0":15,"ppuNametable0":0}
```

## Useful Lua APIs

Confirmed or source-verified APIs for this project:

- `emu.addEventCallback(callback, emu.eventType.endFrame)`
- `emu.stop(exitCode)`
- `emu.getRomInfo()`
- `emu.getScreenSize()`
- `emu.takeScreenshot()`
- `emu.read(address, emu.memType.nesDebug)`
- `emu.read(address, emu.memType.nesPpuDebug)`
- `emu.read(address, emu.memType.nesSpriteRam)`

`tools/mesen/discover-memtypes.lua` dumps the installed emulator's Lua memory type table:

```sh
npm run mesen:memtypes
```

For NES screen fixtures, the important memory types are:

- `nesPpuDebug`: pattern tables, nametables, and palettes.
- `nesSpriteRam`: primary 256-byte OAM sprite RAM.
- `nesDebug`: CPU-visible debug memory/register reads.

## Project Use

Use Mesen for deterministic emulator oracle captures:

1. Launch ROM in `--testRunner` mode.
2. Wait for a known frame or game state.
3. Capture `emu.takeScreenshot()` as PNG.
4. Read PPU/CPU/OAM memory through debug memory types.
5. Compare generated renderer output against captured pixels.

The project CLI now wraps this as `mesen-capture`. Use that command for screen-level capture fixtures during map decoding.

For full screen fixtures, use `mesen-capture-screen`; see `docs/capture-schema.md`.
