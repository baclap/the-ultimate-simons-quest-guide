# Castlevania II ROM-Derived Music Player Demo

This is a standalone proof-of-concept for ROM-derived Castlevania II music
playback. The ROM is only used at build time to produce committed guide assets;
the browser demo loads generated APU write streams and does not require, fetch,
or ask for a ROM at runtime.

The goal is the same model as the guide itself: ROM-derived evidence, packaged
into self-contained assets that just work for the user.

## Build Data

From the repository root:

```sh
node tools/rom-music-player/build-music-data.cjs --rom roms/cv2.nes
```

This writes `tools/rom-music-player/music-data.js`. That file contains the
sound-driver-derived per-frame writes to `$4000-$4017`, along with loop metadata,
driver addresses, sound table evidence, DMC sample bytes referenced by the
driver's `$4012/$4013` writes, and the source ROM SHA-256 used to build the data.

## Run

From the repository root:

```sh
python3 -m http.server 4180
```

Then open:

```text
http://127.0.0.1:4180/tools/rom-music-player/
```

The page must be served over HTTP because it uses an AudioWorklet. It does not
load `roms/cv2.nes` in the browser.

## Current Proof Model

- Build-time ROM source: local iNES file supplied to `build-music-data.cjs`.
- Runtime source: committed `music-data.js`.
- Driver trigger: CPU `$A29B`, called with the selected sound ID in `A`.
- Driver update: CPU `$967D`, called once per NTSC frame.
- Mapping: bank 0 at `$8000-$BFFF`, last PRG bank fixed at `$C000-$FFFF`.
- Audio evidence: generated per-frame writes to `$4000-$4017` plus ROM-extracted
  DMC sample bytes.

The current milestone proves a no-runtime-ROM pipeline and plausible NES APU
recreation. A later hardening pass should name the tracks, verify unresolved
fallback loops, and compare generated register writes against Mesen traces for
each song before calling the full soundtrack ROM-perfect.
