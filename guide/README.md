# Castlevania II Perfect Guide

This directory is the beginning of the interactive guide product. It is not a
walkthrough article, a slideshow, or a screenshot gallery. It is a guide-map
application whose primary surface should feel like looking at the real game.

## Tenets

- **Game pixels are sacred.** The guide may use modern UI above the map, but the
  game graphics themselves must be rendered from ROM-derived raw data at
  runtime: CHR, layout blocks, metatile definitions, attributes, and palettes.
  Screenshots and PNG renders are research evidence, not the guide's art source.
- **The map is a graph before it is a poster.** Ordinary horizontal exits,
  doors, interiors, mansions, rivers, ferries, warps, kneel spots, and item-gated
  actions are all relationships between places. The UI can draw those
  relationships differently without pretending they are all simple side-by-side
  geography.
- **Spoilers should eventually be user-controlled.** The same data should be
  able to support a discovery mode for players mapping as they go and a
  reveal-all mode for players using the guide as a reference. This first guide
  slice currently renders the covered map up front while the interaction model
  settles.
- **Evidence travels with claims.** A label, transition, door destination, item,
  enemy, or progression requirement should eventually expose whether it is
  ROM-derived, emulator-observed, inferred, guide-authored, or still unknown.
- **Useful does not mean vague.** The guide can be friendly on mobile and
  pleasant to browse, but it should never blur the difference between decoded
  game behavior and presentation choices.
- **Over-engineering is welcome when it preserves truth.** The project is a love
  letter to Simon's Quest. Extra structure is worthwhile when it keeps future
  data honest, reproducible, and inspectable.

## First Slice

The first product slice covers:

`Town of Jova -> Jova Woods -> South Bridge -> Veros Woods -> Denis Woods -> Berkeley Mansion`

It demonstrates the core guide language:

- a full-screen WebGL map rendered from packed raw ROM-derived data;
- day/night palette switching for exterior segments;
- guide UI overlays for place labels, clickable transitions, and actor
  highlights;
- ROM-backed actor rows for the opening route, including NPC dialogue,
  day/night enemies, HP values, and runtime-rendered actor sprites;
- layer controls for labels, character visibility, door highlights, character
  highlights, and map-object highlights;
- a Berkeley Mansion door hotspot that opens the first mansion interior as a
  WebGL-rendered raw-data scene.

The route layout in this prototype is presentation-authored. The pixels are not.

## Local Preview

From the repo root, build the raw slice packs and serve the directory:

```sh
node src/index.js build-guide-slice --rom roms/cv2.nes --slice guide/source/jova-to-berkeley.json --atlas out/render-recipe-atlas/manifest.json --out guide/assets/slices/jova-to-berkeley
node src/index.js build-guide-slice --rom roms/cv2.nes --slice guide/source/berkeley-mansion-part-1.json --atlas out/render-recipe-atlas/manifest.json --out guide/assets/scenes/berkeley-mansion-part-1
python3 -m http.server 4177 --directory guide
```

Then open `http://localhost:4177/`.

## Current Limits

- The slice is intentionally narrow; hidden books, progression logic, shops as
  full purchase flows, and later-route actors are still future work.
- Discovery mode and evidence labels are intentionally deferred until they can
  be applied consistently across the map instead of partially.
- Door placement and door destinations are guide-authored for this demo.
- The guide does not yet decode every interior door, mansion room, or special
  transition. Those should be added as provenance-backed graph edges over time.
