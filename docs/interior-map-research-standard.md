# Interior Map Research Standard

Interior destinations in the guide are full maps, not isolated room screenshots
or modal previews. Before an interior is promoted as a guide destination, the
project must prove its room inventory, render recipes, contents, and
entry/exit relationships from ROM or runtime evidence.

## Required Order

1. Inventory every room/submap for the interior.
2. Prove each promoted submap's render recipe: CHR banks, tile set, layout
   header, palette selector, fixed/day/night behavior, dimensions, and atlas
   status.
3. Decode or probe entry/exit relationships before composing multiple submaps
   into one map.
4. Decode every actor/fixture row for every promoted submap.
5. Promote each row to guide output or document why it is non-visible,
   control-only, or intentionally out of scope.
6. Generate the guide scene only after the proof artifact has no silent
   omissions.

`cv2r`, screenshots, memory, maps, and external guides are useful leads. Committed
guide facts must come from ROM decoding, emulator traces, generated manifests,
or validation artifacts.

## No Silent Omissions

Every interior actor/fixture row must be accounted for. A row can be:

- `promoted`: rendered/clickable in the guide with ROM-backed class, text, HP,
  palette, selector, and placement evidence appropriate to its kind.
- `promoted-direct-selector`: rendered/clickable from a direct selector path
  rather than a selector-stream record.
- `control`: documented as non-guide-facing runtime control behavior.
- `blocked`: omitted from guide rendering with an explicit missing proof reason.

Unknown rows must fail the scene build for promoted interiors.

## Alignment Proof

Multiple interior submaps may only be composed after entry/exit alignment has a
proof artifact. The preferred proof is an emulator transition probe that records:

- source and target context bytes (`$30/$50/$51`);
- direction/input;
- Simon screen position before/after;
- PPU scroll state before/after;
- transition routine bytes if applicable;
- computed placement delta.

When runtime transition evidence is not yet available, a ROM entry-room chain can
be used as provisional scene layout only if the generated proof artifact says so
plainly. Future interiors should replace provisional placement with transition
probe evidence before being treated as final alignment truth.

## Berkeley Mansion Baseline

Berkeley Mansion is generated through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:berkeley
npm run guide:scene:berkeley-mansion
```

The current Berkeley proof artifact is
`out/interior-map-research/berkeley-mansion.json`. It inventories
`obj01-area07-sub00` and `obj01-area07-sub01`, scans the ROM actor tables at
file offsets `$5AD4` and `$5B3D`, and accounts for all raw rows: 49 promoted
guide rows plus the documented `$22` block/control row at `$5AD8`. Part 2 is
composed immediately to the right of Part 1 from the entry-room chain. This
alignment has been visually reviewed and accepted for the current guide
milestone, but it should still gain a transition probe before being treated as
final alignment truth. Part 1 has exact save-state render recipe validation;
Part 2 currently renders from the same ROM table path with projected recipe
status until a Part 2 runtime capture/transition probe is added.

The `$22` row is the first canonical conditional secret feature: it is decoded
as the crystal-gated moving platform and emitted through the guide
`secretFeatures` layer, not the normal actor layer. Future interior-specific
mechanics should follow the same path: prove the control row/routine first,
document the condition and motion/effect, then promote it through a generic
secret feature record.

## Town Of Jova Interior Baseline

The three Town of Jova doors are independent daytime-only interior
destinations, generated through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:jova
npm run guide:scenes:jova
```

The current proof artifact is
`out/interior-map-research/jova-interiors.json`. It inventories
`obj00-area07-sub00` Church, `obj00-area08-sub00` Jova Thorn Whip Room, and
`obj00-area09-sub00` Jova Holy Water Room. These rooms are not composed into one
map; each one is a single-room destination reached from the Town of Jova door
table. The artifact byte-checks each promoted manifest actor row directly at
its ROM pointer: one priest row (`$AD`) and two merchant rows (`$AE`).

Jova town door hotspots are generated from the exterior location's ROM door
table and the expanded-background `town-door-4x6` tile signature. The runtime
marks those hotspots as day-only because town doors are inaccessible in the
night exterior state. Future shops/churches should use this same pattern:
prove the room inventory and actor rows first, then wire exterior doors through
ROM-backed door target records rather than browser-only links.

## Town Of Veros Interior Baseline

The three Town of Veros doors are daytime-only guide destinations generated
through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:veros
npm run guide:scenes:veros
```

The current proof artifact is
`out/interior-map-research/veros-interiors.json`. It inventories
`obj00-area07-sub00` Church, the two-submap Dagger destination
`obj00-area0A-sub00` / `obj00-area0A-sub01`, and `obj00-area0B-sub00` Veros
Chain Whip Room. The artifact byte-checks all four promoted actor/fixture rows
against their ROM pointers: one priest row (`$AD`), two merchant rows (`$AE`),
and one hidden clue-book row (`$27`).

Veros Dagger is the first promoted town interior with an entry-room chain. Its
composition uses the ROM manifest `entryRoom` relationship from
`Veros - Dagger Room` back to `Veros - Empty Room Before Dagger`, placing the
merchant room as the next horizontal room. Church and Chain Whip remain
single-room destinations. Veros exterior door hotspots come from the Town of
Veros ROM door table and the expanded-background `town-door-4x6` tile
signature; they are day-only like the Jova doors.

## Town Of Aljiba Interior Baseline

The three Town of Aljiba doors are daytime-only guide destinations generated
through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:aljiba
npm run guide:scenes:aljiba
```

The current proof artifact is
`out/interior-map-research/aljiba-interiors.json`. It inventories the Garlic
room, the two-submap Book/Old Lady destination, and the two-submap Laurels
destination. The artifact byte-checks every promoted row at its ROM pointer:
two merchant rows (`$AE`), one hidden clue-book row (`$27`), and one old-lady row
(`$AC`). The two multi-room destinations use ROM manifest `entryRoom`
relationships for horizontal composition.

## Lauber Mansion Baseline

Lauber Mansion is generated through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:lauber
npm run guide:scene:lauber-mansion
```

The current proof artifact is
`out/interior-map-research/lauber-mansion.json`. It inventories
`obj01-area08-sub00`, `obj01-area08-sub01`, and the manifest-exposed
`obj01-area08-sub02` Lauber -> Laruba Wrong Warp submap. The guide scene
promotes Part 1 and Part 2 as the normal Lauber Mansion destination and
documents the wrong-warp submap as excluded from normal destination rendering.

The artifact accounts for 45 raw rows: 44 promoted actor rows and one `$21`
platform-control row at ROM file offset `$5C2B`. The `$21` row dispatches to
bank `1:$854B`, initializes selector `$51`, and is promoted through
`secretFeatures` as a normal moving platform. Row data `$85` selects setup
branch `1:$859A` and motion branch `1:$8616`; the high nibble `$80` is the
horizontal reversal timer. Setup branch `$859A` stores positive X velocity, so
the row anchor is the left endpoint and the rendered path extends rightward
before reversing. The guide preserves the raw row anchor separately from visible
placement; the rendered path applies the mansion platform actor-slot/OAM anchor
correction proven by the Berkeley `$22` moving-platform trace.

## Brahm Mansion Baseline

Brahm's Mansion is generated through:

```sh
npm run render:recipe-atlas
npm run analyze:interior:brahm
npm run guide:scene:brahm-mansion
```

The current proof artifact is
`out/interior-map-research/brahm-mansion.json`. It inventories all four manifest
submaps in the normal Brahm destination: Part 1, Part 2, Death Fight, and Orb
Room. The ROM manifest `entryRoom` chain links Part 2, Death Fight, and Orb
Room back to Part 1. The screen records for Brahm's branch expose layout
indices `$0A`, `$0B`, and `$0C` in order for Part 2, Death Fight, and Orb Room.
The one-screen Death Fight and Orb Room are bottom-aligned against Part 2 at
`y = 672` (`896 - 224`), not top-aligned: the ROM-derived layout block grid has
Part 2's right edge open at block row 26, Death Fight's left and right edges
open at local block row 5, and the Orb Room's left edge open at local block row
5. Top-aligning the one-screen rooms places those openings against solid blocks;
bottom-aligning them lines all three openings up on the same world row.

The artifact accounts for 33 raw rows with no silent omissions: 29 enemies, 3
fixtures, and 1 NPC. Actor ids `$03`, `$05`, `$0F`, `$11`, `$1F`, `$27`, and
`$AE` reuse the proven mansion actor classes from Berkeley/Lauber. Brahm adds
Death at row `$05CDE` (`08 08 44 80`): the whole-ROM enemy atlas proves actor
id `$44`, direct body selectors `$44/$45`, fixed mansion CHR/palette, and row
HP `$80` = 128. Death's scythe/projectile behavior remains outside the current
static actor marker and should be decoded separately before adding any
projectile overlay. The same row carries the ROM item flag/text pointer for the
Golden Knife reward dialog at `$0DCC0`, so the guide promotes Death as the Gold
Knife reward source.

The Orb Room row `$05CE3` (`0D 07 25 1A`) uses the shared actor `$25` orb
routine. Text pointer index `$1A` resolves to ROM file `$0CFDE` and decodes to
the Dracula's Eyeball pickup message, so Brahm's orb is promoted as Dracula's
Eyeball rather than inheriting Berkeley's Rib label.
