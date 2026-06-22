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
