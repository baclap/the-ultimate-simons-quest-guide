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

`Town of Jova -> Jova Woods -> South Bridge -> Veros Woods -> Town of Veros -> Dabi's Path -> Aljiba Woods`

It also keeps the Denis Woods -> Berkeley Mansion branch visible as the first
door/interior proof. The current guide uses the branch-continuous projection:
Berkeley -> Denis Woods -> Dabi's Path is physically continuous, while Town of
Veros eases between the Veros Woods side and the Dabi's Path side of the lower
projection space based on the current camera view. Subtle grey stripes mark
whatever blank projection space is currently visible.

It demonstrates the core guide language:

- a full-screen WebGL map rendered from packed raw ROM-derived data;
- day/night palette switching for exterior segments;
- guide UI overlays for place labels, clickable transitions, and actor
  highlights;
- ROM-backed actor rows for the opening route, including NPC dialogue,
  day/night enemies, HP values, hidden fixture text, and runtime-rendered actor
  sprites;
- layer controls for labels, character visibility, door highlights, character
  highlights, and map-object highlights;
- a Berkeley Mansion door hotspot that opens the first mansion interior as a
  WebGL-rendered raw-data scene;
- a branch-continuous exterior projection with camera-aware Veros placement.

The route layout in this prototype is presentation-authored. The pixels are not.

## Actor Coverage

The current slice promotes actor rows only when the row bytes, rendered class,
dialogue text, and palette source are backed by ROM-derived evidence:

- Town of Veros includes its day NPC rows, sign row, and night enemy rows. The
  woman uses ROM row id `$A9`, live id `$29`, and selector record `$0A`; the
  bats use actor id `$01` and selector record `$08`.
- Bat sprite tiles, palettes, and selector frames remain ROM-derived. Because
  the game pairs zigzag-bat flaps with movement, that static map preview applies
  presentation-only selector-frame offsets so the frozen guide marker reads more
  like a steady body with flapping wings. The Veros town bat is temporarily left
  unadjusted for visual comparison.
- Actor sprite colors are packed from ROM palette fragments: the shared sprite
  palette half at fixed-bank `$CAAE` plus area/variant-specific fragments such
  as `$CB26`, `$CB2F`, `$CB38`, `$CB5C`, and bank `4:$9F2A`.
- Dabi's Path includes skeletons, eyeballs, zigzag bats, and the sacred-flame
  fixture. Dabi day and night use the same ROM sprite-palette fragment and the
  same ROM background palette transfer address, so the actor palette source is
  shared intentionally rather than guessed.
- Aljiba Woods includes skeletons, spiders, and the hidden clue-book fixture.
  These screens use the same day/night sprite palette families proven for the
  Denis/Aljiba exterior palette transfer addresses.
- Denis Woods Part 2/3 includes skeletons, spiders, and zigzag bats.
- Standard NPC/sign/book/item text is decoded from the ROM text pointer table at
  file offset `0xCB92`; the manifest carries the pointer index, table offset,
  text pointer, raw bytes, and normalized guide text.
- Signpost outline rectangles are validated during `build-guide-slice` against
  the ROM-expanded background tilemap. The sign actor row proves the text
  trigger, while the `town-sign-4x4` tile signature proves the visible map tiles
  to highlight.
- Hidden destructible-block secrets are modeled as their own `secret` layer,
  not generic map objects. Their actor rows prove the reward/text trigger, their
  selector-record indexes expand through the ROM `$DED8` sprite path to render
  the reward graphics from ROM CHR, and their highlighted rectangles are
  validated against ROM-expanded destructible-block tile signatures.
- Breakable terrain that has no reward actor row is generated by scanning the
  ROM-expanded background tilemap for the same destructible-block tile
  signature. These terrain fixtures share the secret highlight option, but they
  remain distinct from actor-backed reward secrets.
- Secret reveal methods are named only where ROM routines back them. The current
  slice records Holy Water's weapon/projectile path, Dracula's Nail's block-hit
  path, and Dracula's Eyeball's hidden-book visibility path. Low-level proof
  lives in `docs/guide-secret-reveal-methods.md`; normal guide cards should
  stay player-facing.
- The only actor-like rows intentionally excluded from the character layer are
  the documented `$43` rendering-control rows. They are not NPCs/enemies and do
  not represent visible guide characters.

## Local Preview

From the repo root, build the raw slice packs and serve the directory:

```sh
node src/index.js build-guide-slice --rom roms/cv2.nes --slice guide/source/jova-to-berkeley.json --layout branch-continuous --atlas out/render-recipe-atlas/manifest.json --out guide/assets/slices/jova-to-berkeley
node src/index.js build-guide-slice --rom roms/cv2.nes --slice guide/source/berkeley-mansion-part-1.json --atlas out/render-recipe-atlas/manifest.json --out guide/assets/scenes/berkeley-mansion-part-1
python3 -m http.server 4177 --directory guide
```

Then open `http://localhost:4177/`.

## Current Limits

- The slice is intentionally narrow; progression logic, shops as full purchase
  flows, and later-route actors are still future work.
- Discovery mode and evidence labels are intentionally deferred until they can
  be applied consistently across the map instead of partially.
- Door placement and door destinations are guide-authored for this demo.
- The guide does not yet decode every interior door, mansion room, or special
  transition. Those should be added as provenance-backed graph edges over time.
- The actor layer covers the non-control actor rows in the current exterior
  slice. Future expansion should preserve that rule: no silent omissions, and no
  promoted actor without ROM row, selector, palette, HP, and text evidence where
  applicable.
