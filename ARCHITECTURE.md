# Architecture

The project has two halves: a production guide app and a ROM decoding pipeline
that produces the data consumed by that app.

## Production Guide

The guide in `guide/` is a static Vite app.

- `guide/src/app.js` owns the map runtime, pan/zoom, overlays, dialogs, guide
  music state, URL state, and service-worker registration.
- `guide/src/dialog.js` renders the CV2-style dialog frame and text from
  ROM-derived font data.
- `guide/src/vendor/guide-map-wasm/` contains the small Rust/WASM tilemap helper
  used by the WebGL renderer.
- `guide/public/assets/` contains generated guide packs, fonts, audio data, and
  the audio worklet.
- Vite emits hashed JS/CSS/WASM under `/app`, while generated guide assets stay
  under `/assets`.

The app renders maps from packed binary data plus JSON manifests. It does not
use screenshots as game art.

## Generated Runtime Packs

Each guide pack has:

- `slice.json`: runtime manifest with segments, palettes, actor classes,
  actors, doors, secrets, item icons, and UI-visible copy.
- `slice-data.bin`: packed CHR, metatile, layout, and palette bytes.

Production guide packs use a runtime manifest profile that strips proof prose
and provenance fields from browser payloads. Durable evidence remains in source
files, `data/`, `docs/`, and generated research outputs.

## Audio Playback

Guide music is stored as ROM-derived APU register events rather than
pre-rendered audio files. At runtime, `guide/src/app.js` expands those events and
streams them into an `AudioWorklet` processor that recreates the NES audio
channels. The generated music data also includes the DMC sample bytes referenced
by `$4012/$4013`, so the worklet can play the ROM's sampled percussion without
requiring the ROM in the browser.

The worklet output is routed through a `MediaStreamAudioDestinationNode` into a
hidden HTML `<audio>` element. That keeps the synthesis path ROM-derived while
letting mobile Safari treat playback as normal media, which improves phone
speaker output and background-app behavior on iOS. Browsers without that route
fall back to direct `AudioContext.destination` output.

## ROM Pipeline

The `src/` pipeline decodes and validates:

- iNES/ROM structure, PRG/CHR banks, palettes, and transfer tables.
- Background layouts, metatiles, attributes, collision thresholds, and render
  recipes.
- Actor rows, NPC text, item rewards, enemy HP rules, sprite selectors,
  metasprites, and palette sources.
- Doors, transitions, secret routes, false terrain, breakable terrain, moving
  platforms, and special actor behavior.
- Music event streams used by the guide's NES-style audio playback.

The ROM is the source of truth for game facts. Save states, screenshots, maps,
manuals, magazines, and external projects are useful leads or validation
evidence, but player-facing claims should trace back to ROM decoding or clearly
labeled guide-authored presentation choices.

## [`cv2r`](https://github.com/tonylukasavage/cv2r) Metadata

Earlier project stages used a vendored copy of [`cv2r`](https://github.com/tonylukasavage/cv2r) as a metadata source. The
production repo keeps only the extracted metadata needed by this project:

- `data/vendor/cv2r/locations.json`
- `data/vendor/cv2r/objects.json`

Regenerate those files with:

```sh
node tools/extract-cv2r-metadata.js --cv2r-root path/to/cv2r
```

The guide and asset pipeline read the extracted JSON files and no longer require
the [`cv2r`](https://github.com/tonylukasavage/cv2r) repository to be present.

## Offline And Caching

The app uses a custom service worker:

- HTML, `sw.js`, and `asset-manifest.json` revalidate.
- Vite's hashed `/app` assets are immutable.
- Generated `/assets` files are cached by HTTP and by the service worker.
- Runtime-cache misses fetch from the network and then cache successful
  same-origin responses.
- After first load, the app sends `asset-manifest.json` to the service worker so
  all guide data can be cached in the background.

Service-worker updates are soft. A new deployment installs in the background and
becomes active on a later load instead of forcing a mid-session reload.
