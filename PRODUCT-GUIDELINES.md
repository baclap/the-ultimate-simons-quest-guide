# Product Guidelines

The guide should feel like the real game, with guide knowledge layered on only
where the project can explain why that knowledge is true.

## North Star

Build the definitive interactive *Castlevania II: Simon's Quest* guide: a
ROM-faithful, explorable game-map experience for players, not a generic map
viewer, article, or asset gallery.

## Product Shape

- The first screen is the explorable game world.
- The map is a graph before it is a poster: doors, interiors, mansions, ferries,
  kneel reveals, warps, and secret routes are relationships between places.
- Modern UI is allowed for controls, overlays, dialogs, labels, and navigation,
  but it should remain visibly guide-authored.
- Spoiler visibility should be controllable. Players can use the guide as a
  reference or preserve some discovery by hiding layers.

## Truth Standard

The ROM is the source of truth for game facts.

Good sources:

- ROM tables, routines, CHR, layouts, palettes, text bytes, actor rows, and
  generated manifests.
- Emulator traces, save states, CPU/OAM/PPU evidence, and rendered comparisons.
- Manual or Nintendo Power text when the guide is explicitly using those sources
  for naming or player-facing flavor.

Leads, not final proof:

- Existing maps, screenshots, memory, wikis, videos, and external projects.

When a claim cannot be proven, omit it, mark it as research-only, or keep it in
docs until the proof exists.

## Game Pixels

Game graphics in the guide must be rendered from ROM-derived data at runtime:
CHR, metatiles, layout blocks, palettes, attributes, nametables, actor sprite
records, item icons, and decoded animation data.

Screenshots and generated PNGs are fine for demos, docs, validation, and
debugging. They are not source art for the production guide.

## Guide Copy

Prefer game text, manual text, or concise guide-authored copy that sounds like
it belongs near *Simon's Quest*. The guide should be helpful without flattening
the game's weirdness.

Guide-authored dialogs should stay short, concrete, and clearly attached to a
specific hidden route, enemy, item, or mechanic.

## Presentation

Keep decoded facts separate from presentation choices.

ROM-derived examples:

- map pixels, actor rows, text bytes, HP values, palette bytes, sprite selectors,
  item rewards, transition routines.

Guide-authored examples:

- world layout, label placement, connector styling, overlay colors, camera
  defaults, consolidated click targets, and explanatory copy.

## Completeness

No silent omissions. When a map section, interior, mechanic, or enemy set is
added, account for relevant actors, doors, items, secrets, fixtures, and special
behavior, or document why something is intentionally out of scope.
