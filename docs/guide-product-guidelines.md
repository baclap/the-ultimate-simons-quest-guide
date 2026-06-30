# Interactive Guide Product Guidelines

This draft captures the product principles already visible in the interactive
guide app. It is not a requirements catalog for every town, route, mansion, or
room. It is the decision frame to use when deciding what belongs in the guide,
how it should look, and how much proof is needed before it becomes player-facing.

## North Star

Build the definitive interactive *Castlevania II: Simon's Quest* guide: a
ROM-faithful, explorable game-map experience that feels like looking at the real
game, with guide knowledge layered on only where the project can explain why it
is true.

The guide should be useful to a player, legible as a product, and strict enough
that future contributors can distinguish game fact from guide presentation.

## Product Shape

The guide is a map-first product, not a walkthrough article, screenshot gallery,
wiki page, or debug viewer. The first screen should be the explorable game world.
Text, panels, dialogs, labels, and controls exist to help the player understand
and use that world.

The map is also a graph before it is a poster. Horizontal exits, doors,
interiors, mansions, ferries, kneel reveals, warps, secret routes, and item-gated
actions are relationships between places. The visual layout may arrange those
relationships for readability, but it should not pretend that every relationship
is ordinary physical adjacency.

The product should support both reference use and discovery use over time. A
player who wants the full guide should be able to reveal everything; a player who
wants to preserve mystery should eventually be able to hide spoilers and reveal
layers deliberately.

## Truth And Evidence

The ROM is the source of truth for game facts. Emulator traces, save states,
screenshots, published maps, manuals, wikis, and memory are evidence or leads,
not final authority unless the claim being made is explicitly about that source.

A guide fact is ready for the main product only when its source category is
clear:

- `rom-derived`: decoded from ROM tables, code paths, CHR, layouts, palettes,
  text, actor rows, routines, or generated manifests.
- `runtime-validated`: checked against emulator traces, save-state captures,
  OAM/PPU/CPU evidence, or pixel comparisons.
- `guide-authored`: authored to make the product usable, such as world
  placement, label positions, connector styling, summaries, camera behavior, and
  explanatory copy.
- `projected`: generated from decoded rules but not yet validated in the exact
  runtime context.
- `unknown` or `blocked`: understood to be missing proof and therefore not
  promoted silently.

Every player-facing claim should be able to point back to one of those
categories. If that path does not exist yet, the product should omit the claim,
mark it as provisional in research output, or create a research task.

## Game Pixels

Game graphics in the interactive guide must be rendered at runtime from
ROM-derived data: CHR, metatiles, layout blocks, palettes, attributes,
nametables, actor sprite records, item icons, and decoded animation data.

Screenshots and generated PNGs are appropriate for demos, docs, validation,
comparison, and explanation. They are not source art for the guide app.

Modern UI may sit above the game map, but it should not contaminate the map's
claim to be game data. When modern UI borrows the game's visual language, such
as dialog frames or item icons, the borrowed graphics should still come from the
same ROM-derived rendering path.

## Presentation

The guide should feel like a respectful instrument panel around the game, not a
skin that competes with it. Modern UI should be clear, compact, accessible, and
obviously guide-authored.

Use visual language consistently:

- Blue CV2-style dialog boxes are reserved for decoded in-game text.
- Grey CV2-style dialog boxes are guide-authored explanations, summaries,
  labels, HP cards, item notes, and secret instructions.
- Door portals should open destinations directly.
- Item badges and inline item mentions should use ROM-rendered menu icons.
- Labels and outlines are overlays, not game pixels.

Player-facing copy should explain what the player needs to do or understand. It
should not expose ROM offsets, selector records, CPU addresses, or tile
signatures unless a future provenance/debug mode explicitly asks for that level.

## Layers And Controls

Layer controls should separate visibility from highlighting wherever those are
different jobs. Showing a thing, outlining it, and opening its guide card are
separate product decisions.

The player-facing layer taxonomy should stay simple:

- Labels name places and important guide landmarks.
- Characters include NPCs, enemies, bosses, fixtures with actor-like presence,
  and guide-authored spawn markers.
- Doors and portals represent navigable destination relationships.
- Map sections expose the authored composition of ROM-rendered segments.
- Secrets cover hidden or conditional discoveries, even when their internal
  implementations differ.

Do not create a new player-facing layer just because the ROM implementation has
a new internal mechanism. Create new internal data only when rendering, motion,
hit testing, provenance, or validation requires it.

## Secrets And Conditional Features

Secrets should be player-discoverable hidden or conditional things, including
breakable blocks, hidden books, false floors, hidden routes, conditional
merchants, item-revealed platforms, ferries, and kneel-triggered events.

Before a secret is highlighted, the project should prove the relevant ROM
source: actor/control row, routine branch, item flag check, terrain
classification, layout signature, selector path, movement path, or runtime trace
as applicable.

Secrets may still render as game graphics when the game would render them, but
their guide reveal and outline should stay controlled by the Secrets visibility
and highlight options. When the guide simplifies an in-game condition for
readability, the provenance should say what was simplified.

## Actors, Fixtures, And Motion

Actor rows are evidence, not automatic map objects. A promoted character or
fixture should have enough proof for its role: raw row bytes, class, selector or
sprite path, palette, HP when relevant, text when relevant, day/night behavior,
visible placement, and any interaction bounds.

Control rows, sprite-mask rows, state initializers, moving-platform parameters,
and other behavior triggers should not be rendered as ordinary characters. They
should be documented, excluded, or promoted through a data model that matches
their visible behavior.

For moving and conditional entities, preserve raw row coordinates separately
from proven visible placement. Raw bytes are provenance. They are not always the
coordinates the player sees.

## Map Expansion

Expand the guide in slices, but hold each promoted slice to final-guide
standards. A narrow route with complete, ROM-backed actors, doors, secrets, and
transitions is better than a broad map that quietly guesses.

Adding a new section should normally answer these questions:

- Can the background pixels be rendered from ROM-derived data at runtime?
- Are labels and names sourced or intentionally unresolved?
- Are graph relationships represented without faking geography?
- Are actors, fixtures, doors, secrets, and transitions accounted for?
- Are exclusions documented as control rows, non-visible rows, unknowns, or
  explicit out-of-scope work?
- Are generated validations or proof artifacts available for the risky parts?

Presentation-authored world placement is allowed, but it must remain labeled as
presentation. Composition should preserve conflicts and unknowns rather than
hiding them behind confident-looking coordinates.

## Naming And Copy

Names should be stable, human-facing, and source-aware. Use the project's
location naming policy for map labels, preserve source names as metadata, and
keep ambiguous labels unresolved rather than inventing precision.

Enemy and actor display names should come from canonical actor-class labels
backed by ROM/runtime/manual evidence, not from one-off location names. A source
row label may remain in provenance, but it should not become player-facing text
unless it is the right class name.

Guide copy should be concise and practical. The player should learn what the
thing is, what it does, where it goes, what it gives, or how to reveal it. The
proof belongs in docs, manifests, validations, or an explicit provenance mode.

## Mobile And Interaction

The guide should be usable on desktop and phone-sized screens. Pan, zoom,
labels, dialogs, layer controls, door targets, actors, and secrets should remain
reachable with touch and mouse.

The map should tolerate exploration: players should be able to move around,
reset to a known spawn, switch day/night where appropriate, open and close
interiors, and recover from a selected object without losing their place.

Hit targets may be guide-authored for usability, but their existence and
destination should be evidence-backed. If a click target covers a ROM feature,
the product should know whether the target came from a tile signature, actor
row, door table, runtime trace, or authored presentation.

## Validation

Validation should be proportional to risk. Rendering paths, actor promotion,
doors, interiors, movement, secrets, and special transitions need stronger proof
than label placement or panel styling.

Prefer validations that cross-check multiple kinds of evidence:

- ROM table decoding and generated manifests.
- CHR, palette, and layout recipe audits.
- Expanded tilemap signature scans.
- Emulator traces and save-state probes.
- Pixel comparisons where alignment is known.
- Browser checks for the guide runtime when UI or rendering behavior changes.

Builds should fail on missing proof for promoted data whenever practical. Unknowns
are acceptable; silent omissions are not.

## Anti-Goals

Do not make the guide a screenshot atlas.

Do not use external maps, fan knowledge, or memory as final proof for gameplay
facts.

Do not promote guessed overlays because they look right.

Do not bury evidence only in chat, temporary scripts, or ignored output.

Do not expose implementation trivia to players when simple guide language is
enough.

Do not let modern UI obscure the difference between ROM-derived game data and
guide-authored presentation.

## Product Test

When a decision is unclear, ask:

1. Does this make the guide more useful to a player exploring Simon's Quest?
2. Does it preserve the feeling of looking at the real game?
3. Can we explain which parts are ROM-derived, runtime-validated, projected, or
   guide-authored?
4. Would a future contributor know what evidence to check or improve?

If the answer is yes, the decision is probably aligned with the product.
