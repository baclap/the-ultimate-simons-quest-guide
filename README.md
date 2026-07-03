# The Ultimate Simon's Quest Guide

A ROM-faithful, explorable guide to *Castlevania II: Simon's Quest*.

This project is a love letter to a strange, mysterious NES game: the kind of
guide that feels like it could have existed in the back pages of a late-80s
magazine, but built with a frankly unreasonable amount of modern reverse
engineering.

Live site: https://theultimatesimonsquestguide.com/

## What It Is

The guide is not a screenshot map, wiki page, or walkthrough article. It is an
interactive WebGL map where the game world, interiors, enemies, items, dialogs,
secrets, moving platforms, and music are rendered from decoded game data and
carefully authored guide metadata.

The guide can show the full world, switch day/night palettes, enter towns and
mansions, reveal hidden routes, inspect characters and enemies, play
ROM-recreated music, and work offline after the first visit.

## Why It Exists

*Simon's Quest* is famously opaque: hidden floors, cryptic NPCs, kneeling
secrets, and progression rules that were easy to miss unless you had the manual,
Nintendo Power, or a friend who somehow knew. This project tries to preserve
that feeling while making the game legible.

The result is intentionally over-engineered. The point was not just to make a
map, but to understand the ROM well enough that the guide can say why each
player-facing claim is true.

## How It Works

- `guide/` is the production web app. It is a Vite app deployed as static files.
- `guide/source/` contains authored guide scene/layout definitions.
- `guide/public/assets/` contains generated runtime packs consumed by the app.
- `src/` contains the ROM decoding, validation, and asset-generation pipeline.
- `data/vendor/cv2r/` contains extracted metadata from [`cv2r`](https://github.com/tonylukasavage/cv2r); the vendored repo
  itself is not required at runtime or build time.
- `docs/` keeps reverse-engineering notes and context useful to future agent or
  developer work.
- `demos/` is an archive of milestone demos from the research process.

More detail is in [ARCHITECTURE.md](ARCHITECTURE.md) and the product philosophy
is in [PRODUCT-GUIDELINES.md](PRODUCT-GUIDELINES.md).

## Running Locally

The committed guide app works without a ROM:

```sh
npm install --prefix guide
npm --prefix guide run dev
```

Build the production app:

```sh
npm --prefix guide run build
npm --prefix guide run preview
```

The ROM-backed asset pipeline requires a local *Castlevania II* NES ROM at
`roms/cv2.nes`. ROM files are intentionally not included in this repository.

Regenerate all guide runtime assets:

```sh
npm install
npm run guide:assets
```

Useful focused commands:

```sh
npm run verify-rom
npm run build:enemy-atlas
npm run guide:slice:jova-to-berkeley
```

## Offline Behavior

The production guide registers a service worker. On first load it fetches the
current app shell and visible guide data, then warms a cache with the remaining
interiors, audio, fonts, WASM, and generated runtime assets. New deployments use
soft updates: the current session is left alone and the new version is picked up
on a later page load.

## License

Original project code and documentation are released under the MIT License. See
[LICENSE](LICENSE).

This repository also contains generated data and references related to
*Castlevania II: Simon's Quest*. See [NOTICE.md](NOTICE.md) for third-party,
trademark, ROM-derived data, and provenance notes.
