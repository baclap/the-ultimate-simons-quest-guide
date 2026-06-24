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

`Town of Jova -> Jova Woods -> South Bridge -> Veros Woods -> Town of Veros -> Dabi's Path -> Aljiba Woods -> Town of Aljiba -> Camilla Cemetery`

It also includes the Town of Jova, Town of Veros, and Town of Aljiba daytime
doors plus the Denis Woods -> Berkeley Mansion branch and the Blue Crystal
Yuba Lake -> Lauber Mansion secret branch as map-swap destinations. The current guide uses the branch-continuous projection:
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
- ROM-backed door hotspots: the Jova town doors are generated from the manifest
  door table plus expanded-background door signatures and are daytime-only,
  the Veros and Aljiba town doors follow the same daytime-only pattern, while
  the Berkeley/Lauber mansion doors open full mansion scenes;
- full-screen interior map swaps for Jova Church, the Jova Thorn Whip room, the
  Jova Holy Water room, Veros interiors, Aljiba interiors, Berkeley Mansion,
  and Lauber Mansion;
- a branch-continuous exterior projection with camera-aware Veros placement.

The route layout in this prototype is presentation-authored. The pixels are not.

## Actor Coverage

The current slice promotes actor rows only when the row bytes, rendered class,
dialogue text, and palette source are backed by ROM-derived evidence:

- Town of Veros includes its day NPC rows, sign row, and night enemy rows. The
  woman uses ROM row id `$A9`, live id `$29`, and selector record `$0A`; the
  guide labels actor id `$01` / selector record `$08` as a Crow.
- Crow/Bat sprite tiles, palettes, and selector frames remain ROM-derived.
  Because the game pairs zigzag-bat flaps with movement, that static map preview
  applies presentation-only selector-frame offsets so the frozen guide marker
  reads more like a steady body with flapping wings.
- Actor sprite colors are packed from ROM palette fragments: the shared sprite
  palette half at fixed-bank `$CAAE` plus area/variant-specific fragments such
  as `$CB26`, `$CB2F`, `$CB38`, `$CB5C`, and bank `4:$9F2A`.
- Grounded enemy placements start from the ROM actor row and guide visual
  anchor, then the slice builder validates the actor foot tiles against the
  expanded ROM background tilemap. Unsupported placements are snapped by the
  smallest unambiguous horizontal offset that lands on palette `0`/`1` terrain;
  the generated manifest records the before/after support evidence.
- Dabi's Path includes skeletons, eyeballs, zigzag bats, and the sacred-flame
  fixture. Dabi day and night use the same ROM sprite-palette fragment and the
  same ROM background palette transfer address, so the actor palette source is
  shared intentionally rather than guessed.
- Aljiba Woods includes skeletons, spiders, and the hidden clue-book actor.
  These screens use the same day/night sprite palette families proven for the
  Denis/Aljiba exterior palette transfer addresses.
- Town of Aljiba is promoted from ROM manifest rows: day NPCs/sign/crystal
  exchange, night zombies, and three day-only interior doors. The Blue Crystal
  exchange merchant uses the ROM merchant selector table and carries a
  trade-for-White-Crystal item affordance.
- Camilla Cemetery promotes the ROM secret merchant as a `secretFeatures`
  entry, not as an always-visible character. It appears with the Secrets layer,
  carries a Silver Knife item badge with Labels, and uses a grey/blue stacked
  dialog backed by the reveal routine and ROM text pointer. Dead Hand rows and
  Blob rows remain ordinary enemy actors. The first Blob row uses the raw ROM
  actor bytes for placement because the manifest normalizes its Y byte
  differently from the source row.
- The Yuba Lake/Lauber branch is tagged as a Secrets-gated route. ROM code at
  bank `1:$A760-$A79F` proves the route reveal requires Yuba Lake, selected
  crystal slot `$004F == $06`, crystal-tier bits `$0091 & $60 >= $40`, and
  Simon kneeling. Low-level proof is in
  `docs/guide-secret-reveal-methods.md`.
- Denis Woods Part 2/3 includes skeletons, spiders, and zigzag bats.
- Standard NPC/sign/book/item text is decoded from the ROM text pointer table at
  file offset `0xCB92`; the manifest carries the pointer index, table offset,
  text pointer, raw bytes, and normalized guide text.
- Item-bearing NPCs can carry an `itemOffer` record. The guide renders their
  start-menu item icon from ROM CHR inside a small CV2 dialog-frame badge, and
  prices/manual copy stay provenance-backed as described in
  `docs/guide-item-affordances.md`.
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
- Berkeley false platforms are generated by scanning the ROM-expanded mansion
  tilemap for the documented false-floor signatures and packed quadrant value
  `$00`. They share the same Secrets visibility/highlight controls as
  breakable terrain and are documented in `docs/guide-secret-reveal-methods.md`.
- Secret reveal methods are named only where ROM routines back them. The current
  slice records Holy Water's weapon/projectile path, Dracula's Nail's block-hit
  path, and Dracula's Eyeball's hidden-book visibility path. Low-level proof
  lives in `docs/guide-secret-reveal-methods.md`; normal guide cards should
  stay player-facing.
- The only actor-like rows intentionally excluded from the character layer are
  the documented `$43` rendering-control rows. They are not NPCs/enemies and do
  not represent visible guide characters.
- Simon Belmont spawn markers are guide-authored character-layer markers backed
  by ROM/runtime transition evidence rather than ROM actor rows. The sprite
  source, spawn anchors, and per-view placements are documented in
  `docs/simon-spawn-marker-notes.md`.
- Berkeley Mansion is generated from the interior research standard in
  `docs/interior-map-research-standard.md`. The whole-mansion scene promotes 49
  mansion actor rows: 44 enemies, 4 fixtures, and 1 NPC. The proof artifact also
  accounts for the raw `$22` block/control row at ROM file offset `$5AD8`, which
  is rendered separately as a `secretFeatures` moving platform when Secrets are
  visible, not as a character-layer actor. The Part 1 -> Part 2 alignment is
  visually reviewed and accepted for this milestone; a transition probe should
  still replace that acceptance with stronger runtime alignment evidence later.
  Part 1 has exact save-state render recipe validation; Part 2 is rendered from
  ROM layout/table evidence and remains marked projected until a Part 2 runtime
  transition/capture probe is added.
- The Town of Jova interiors also follow the interior research standard. The
  proof artifact `out/interior-map-research/jova-interiors.json` inventories
  Church, Thorn Whip room, and Holy Water room as independent single-room
  destinations, byte-checks all three ROM actor row pointers, and promotes the
  priest/merchant rows without silent omissions.
- The Town of Veros interiors follow the same standard. The proof artifact
  `out/interior-map-research/veros-interiors.json` inventories Veros Church,
  the two-room Dagger destination, and the Chain Whip room. It byte-checks the
  priest, Dagger merchant, Chain Whip merchant, and clue-book rows, and uses the
  ROM `entryRoom` chain for the Dagger room composition.
- The Town of Aljiba interiors follow the same standard. The proof artifact
  `out/interior-map-research/aljiba-interiors.json` inventories the Garlic
  room, Book/Old Lady destination, and Laurels destination, byte-checking all
  merchant/book/old-lady rows.
- Lauber Mansion follows the mansion standard. The proof artifact
  `out/interior-map-research/lauber-mansion.json` inventories Part 1, Part 2,
  and the manifest-exposed Lauber -> Laruba Wrong Warp submap. The guide scene
  promotes the normal Part 1/Part 2 destination and renders the `$21`
  platform-control row as a normal moving platform with its ROM-decoded
  horizontal path. The scene retains the raw row anchor as provenance while
  rendering the visible path with the mansion platform actor-slot/OAM anchor
  correction proven by the Berkeley `$22` platform trace.

## Local Preview

From the repo root, build the raw slice packs and serve the directory:

```sh
npm run render:recipe-atlas
npm run analyze:interior:berkeley
npm run analyze:interior:jova
npm run analyze:interior:veros
npm run analyze:interior:aljiba
npm run analyze:interior:lauber
npm run guide:slice:jova-to-berkeley
npm run guide:scene:berkeley-mansion
npm run guide:scenes:jova
npm run guide:scenes:veros
npm run guide:scenes:aljiba
npm run guide:scene:lauber-mansion
python3 -m http.server 4177 --directory guide
```

Then open `http://localhost:4177/`.

## Current Limits

- The slice is intentionally narrow; progression logic, shops as full purchase
  flows, and later-route actors are still future work.
- Discovery mode and evidence labels are intentionally deferred until they can
  be applied consistently across the map instead of partially.
- Door hit rectangles are guide-facing controls, but their target destinations
  should come from ROM-backed door tables and their visible door locations
  should be derived from ROM-expanded background signatures or documented
  validation artifacts.
- The guide does not yet decode every interior door, shop, church, mansion, or
  special transition. Those should be added as provenance-backed graph edges
  with transition/alignment artifacts over time.
- The actor layer covers the non-control actor rows in the current exterior
  slice. Future expansion should preserve that rule: no silent omissions, and no
  promoted actor without ROM row, selector, palette, HP, and text evidence where
  applicable.
