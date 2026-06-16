# Castlevania II Image Map Tools

This workspace is for generating a pixel-perfect image map of *Castlevania II: Simon's Quest* from the ROM artifact itself.

The current vertical slice includes:

- verifies an iNES ROM and records its mapper/PRG/CHR layout
- renders every CHR ROM bank into native tile-sheet PNGs
- generates a location/actor/door manifest from the vendored `cv2r` metadata
- captures deterministic Mesen screen fixtures
- reconstructs a captured screen from PPU/OAM artifacts for pixel-diff calibration
- decodes the fixed PPU transfer stream format and replays traced NMI PPU buffer updates
- derives background layout/tile pointers from `objset`, `area`, and `submap`
- renders descriptor-backed ROM-native Jova town and Jova Woods nametable checkpoints directly from PRG layout/tile data
- renders validated ROM-native background PNGs from descriptor nametables, CHR banks, and ROM palette bytes
- organizes ROM-native screens into a route-ordered viewport catalog with validated/inferred status
- renders a continuous Jova Woods layout-space segment from adjacent ROM layout column groups
- renders an atlas of 55 town, route, mansion-door, mountain, and Castlevania final-area candidates from ROM layout data
- decodes ROM area-transition triples into a reusable exterior topology graph
- decodes layout headers as column-group by vertical-section grids and renders 13 multi-section atlas entries larger than one viewport row
- decodes day background palette selection through the ROM's runtime selector table at `2:$F7C5` and transfer table at `7:$C895`
- derives the known Dora runtime palette-context alias from ROM special
  screen-record structure and validates it against save-state captures
- captures a focused render-recipe probe set and audits live CHR/palette state
  against ROM-derived selector data
- renders a confidence-labeled recipe atlas with validated/projected day,
  night, and fixed variants
- composes the Jova-to-Castlevania exterior route from ROM-derived topology
  constraints and recipe-atlas segments, with inferred solver shifts labeled
- classifies topology edges by transition semantics so connector-only transport
  candidates are not forced into ordinary left/right adjacency
- traces scripted emulator transitions to capture runtime context changes,
  CPU/OAM diffs, write PCs, and PPU state as evidence for destination-position
  decoding
- resolves Simon screen X at `$0348` across the transition probe set and
  separates true visible-Y changes from camera/nametable plane changes
- audits transition routine bytes `$70-$73` across 10 completed scripted
  transitions, including Castlevania visible-Y evidence, Jova interior control
  evidence, and Deborah Cliff special-transport evidence
- writes a transition routine decoder artifact with ROM byte windows, raw write
  metadata, topology matches, and promoted/diagnostic placement hypotheses
- composes the full exterior topology graph into a single world draft with all
  55 exterior nodes represented and `handPlacedCoordinates: 0`
- builds a static Rust WASM + WebGL2 guide-map prototype that renders the Dead
  River 1 to Berkeley route from ROM-derived tile data at browser runtime
- resolves human-facing labels through the Nintendo Power map naming policy
  while preserving `cv2r` source names
- catalogs the Jova-to-Berkeley guide slice's actor rows with ROM offsets,
  exact coordinates, day/night behavior, HP, decoded Jova text, and the
  remaining sprite/merchant-routine gaps before NPC/enemy overlays ship
- decodes the actor metasprite selector path, proves two Jova NPC sprite
  bindings from runtime slot evidence, isolates the merchant text exception,
  and keeps unresolved enemy sprite bindings explicitly research-gated
- traces save-state actor slots and selector writes to prove several live enemy
  ids, selectors, HP values, and the fixed-bank selector-stream path
- decodes the fixed-bank actor selector-stream routine, maps six observed enemy
  actor classes back to ROM selector records, and renders their animation strips
  from ROM metasprite tables plus trace CHR/palette evidence
- closes the current guide slice's actor-art coverage by resolving the remaining
  Jova town NPC selector records, rendering guide-slice NPC/enemy sprites, and
  proving the Jova sign as a no-sprite background fixture

## ROM Setup

Keep ROMs under `roms/`; that directory is ignored by git except for `.gitkeep`.

Recommended local path:

```sh
roms/cv2.nes
```

## Commands

```sh
npm run verify-rom
npm run extract-chr
npm run manifest
npm run render-all
npm run mesen:smoke
npm run capture:jova
npm run capture:jova-woods
npm run capture:dora-woods-part-2
npm run capture:dabis-path
npm run capture:recipe-probes
npm run inspect:jova-background
npm run inspect:jova-woods-background
npm run inspect:runtime-contexts
npm run inspect:runtime-context-map
npm run audit:render-recipes
npm run render:recipe-atlas
npm run render:jova-capture
npm run render:jova-woods-capture
npm run render:dora-woods-part-2-capture
npm run render:dabis-path-capture
npm run decode:title-transfer
npm run replay:jova-buffer-trace
npm run render:jova-native
npm run render:jova-right-native
npm run render:jova-woods-native
npm run render:jova-native-png
npm run render:jova-right-native-png
npm run render:jova-woods-native-png
npm run render:region:jova-to-veros
npm run render:segment:jova-woods
npm run render:route:jova-to-veros
npm run render:atlas:exterior
npm run render:topology:exterior
npm run render:composition:exterior
npm run probe:transitions
npm run decode:transition-routine
npm run render:world:exterior
npm run guide:slice:dead-river-berkeley
npm run guide:web:build
npm run guide:web:dev
npm run trace:actors
npm run analyze:actor-traces
npm run decode:actor-selector-streams
npm run decode:guide-actor-sprite-coverage
```

You can also pass paths directly:

```sh
node src/index.js verify-rom --rom "/path/to/Castlevania II - Simon's Quest (USA).nes"
node src/index.js extract-chr --rom roms/cv2.nes --out out/chr --scale 1
node src/index.js manifest --out out/manifest.json
node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0
node src/index.js inspect-runtime-context --capture out/captures/dora-woods-part-2-day
node src/index.js inspect-runtime-context-map --rom roms/cv2.nes
node src/index.js render-background-native --rom roms/cv2.nes --descriptor jova-day --visible-page 0
node src/index.js render-background-native-png --rom roms/cv2.nes --descriptor jova-day --state out/captures/jova-day/state.json --out out/decoder/jova-native-background.png
node src/index.js render-region-png --rom roms/cv2.nes --region jova-to-veros-day --out out/regions/jova-to-veros-day.png
node src/index.js render-layout-segment-png --rom roms/cv2.nes --segment jova-woods-day --out out/layout-segments/jova-woods-day.png
node src/index.js render-layout-route-png --rom roms/cv2.nes --route jova-to-veros-outdoor-day --out out/layout-routes/jova-to-veros-outdoor-day.png
node src/index.js render-exterior-atlas --rom roms/cv2.nes --out out/exterior-atlas
node src/index.js render-exterior-topology --rom roms/cv2.nes --out out/exterior-topology
node src/index.js render-exterior-composition --rom roms/cv2.nes --topology out/exterior-topology/topology.json --atlas out/render-recipe-atlas/manifest.json --out out/exterior-composition
node src/index.js render-exterior-world-composition --rom roms/cv2.nes --topology out/exterior-topology/topology.json --atlas out/render-recipe-atlas/manifest.json --transition-rules out/transition-routine/decoder.json --out out/exterior-world-composition
node src/index.js build-guide-slice --rom roms/cv2.nes --slice data/guide-slices/dead-river-1-to-berkeley.json --atlas out/render-recipe-atlas/manifest.json --out web/guide-map/public/assets/slices/dead-river-1-to-berkeley
node src/index.js run-transition-probes --rom roms/cv2.nes --fixtures data/transition-probes.json --topology out/exterior-topology/topology.json --out out/transition-probes
node src/index.js decode-transition-routine --rom roms/cv2.nes --probes out/transition-probes/analysis.json --topology out/exterior-topology/topology.json --out out/transition-routine
node src/index.js audit-render-recipes --rom roms/cv2.nes --fixtures data/render-recipe-fixtures.json --out out/render-recipe-audit
node src/index.js render-recipe-atlas --rom roms/cv2.nes --audit out/render-recipe-audit/audit.json --out out/render-recipe-atlas
node src/index.js run-actor-traces --rom roms/cv2.nes --fixtures data/actor-trace-fixtures.json --out out/actor-traces
node src/index.js analyze-actor-traces --fixtures data/actor-trace-fixtures.json --out out/actor-traces
node src/index.js decode-actor-selector-streams --rom roms/cv2.nes --fixtures data/actor-trace-fixtures.json --traces out/actor-traces --out out/actor-selector-streams
node src/index.js decode-guide-actor-sprite-coverage --rom roms/cv2.nes --out out/guide-actor-sprite-coverage
```

## Demos

Sprint demos live under `demos/`. The current stakeholder demo is:

```text
demos/2026-05-17-sprint-demo/index.html
demos/2026-05-17-regional-demo/index.html
demos/2026-05-17-layout-segment-demo/index.html
demos/2026-05-17-jova-to-veros-route-demo/index.html
demos/2026-05-17-exterior-atlas-demo/index.html
demos/2026-05-17-vertical-layout-demo/index.html
demos/2026-05-17-palette-resolver-demo/index.html
demos/2026-05-17-runtime-context-demo/index.html
demos/2026-05-17-topology-demo/index.html
demos/2026-05-19-render-recipe-audit-demo/index.html
demos/2026-05-19-recipe-resolver-demo/index.html
demos/2026-05-19-objset4-recipe-demo/index.html
demos/2026-05-19-recipe-completeness-demo/index.html
demos/2026-05-20-composition-draft-demo/index.html
demos/2026-05-20-transition-semantics-demo/index.html
demos/2026-05-20-transition-probe-demo/index.html
demos/2026-05-20-destination-position-demo/index.html
demos/2026-05-20-camera-scroll-demo/index.html
demos/2026-05-20-destination-y-probe-demo/index.html
demos/2026-05-20-transition-routine-bytes-demo/index.html
demos/2026-05-20-transition-routine-decoder-demo/index.html
demos/2026-05-20-world-composition-demo/index.html
demos/2026-05-21-rom-unwound-lesson-demo/index.html
demos/2026-06-15-rom-actor-evidence-demo/index.html
demos/2026-06-16-actor-sprite-decode-demo/index.html
demos/2026-06-16-actor-selector-stream-demo/index.html
demos/2026-06-16-guide-actor-sprite-coverage-demo/index.html
```

## Next Milestone

The next milestone is decoding what the transition routine computes from the
observed `$70-$73` bytes. The byte writes are now captured and tied to scripted
transition evidence; the next step is mapping the routine inputs back to ROM
transition tables so the composer can infer player placement and camera state
from the ROM instead of relying on save-state-specific placement guesses. The
vendored `cv2r` source gives us strong anchors for locations, actors, doors,
palette offsets, and bank layout, but it does not already contain a complete
background renderer. Mesen remains a representative calibration oracle for
proving ROM-derived rules, not the source art for the final map.

Current background-loader findings are documented in `docs/background-decoder-notes.md`, and the committed descriptor schema is documented in `docs/background-descriptor-schema.md`. Region rendering notes live in `docs/regional-renderer-notes.md`. The important checkpoint is that `npm run inspect:jova-background` and `npm run inspect:jova-woods-background` derive the layout header and tile-set pointers used by the validated descriptors. `npm run render:jova-native` verifies Jova town page 0, `npm run render:jova-right-native` verifies the right-side page, and `npm run render:jova-woods-native` verifies the first overworld checkpoint from a save-state capture. The `render:*native-png` commands turn those same ROM-native backgrounds into PNGs for demos and future map output. `npm run render:region:jova-to-veros` creates a route-ordered viewport catalog from validated descriptors plus inferred manifest-context candidates; it is not a continuous map stitch yet.

`npm run render:segment:jova-woods` is the current continuous-layout milestone:
it renders a 1024x224 Jova Woods day segment from layout header `2:$A23E` and
column groups `0..3`. See `docs/layout-segment-renderer-notes.md`.

`npm run render:route:jova-to-veros` extends that milestone to the full outdoor
Jova-to-Veros route. It renders a 3072x224 route image from Jova Woods,
Jova-Veros Bridge, Veros Woods - Part 1, and Veros Woods - Part 2 layout
segments.

`npm run render:atlas:exterior` expands from route rendering into atlas coverage.
It enumerates 55 exterior candidates from the vendored `cv2r` metadata, resolves
their ROM screen records and layout headers, and writes a manifest plus PNGs
under `out/exterior-atlas/`. Layout headers are decoded as two-dimensional
grids, so entries like Jova, Dora Woods - Part 2, and Castlevania render as
full layout-space segments rather than first-row-only strips. Day background
palettes are resolved from the ROM's runtime selector path where possible; the
manifest records selector context, index-list pointer, transfer id, transfer
pointer, and final palette address. The known runtime palette context alias,
Dora Woods - Part 2, is now derived from ROM special screen-record structure;
fixtures validate that the derived raw submap `$83` matches live Mesen RAM.
See `docs/exterior-atlas-notes.md` and
`docs/runtime-context-mapping-notes.md` for the inventory rules, confidence
split, template assumptions, vertical grid coverage, special screen-record
handling, and runtime context evidence.

`npm run render:topology:exterior` decodes the ROM area-transition triples into
a reusable graph under `out/exterior-topology/`. It emits 55 exterior nodes, 32
area groups, and adjacency edges for area boundaries and same-area submaps. This
is the current topology milestone: connected map structure without claiming
final world-coordinate placement. See `docs/exterior-topology-notes.md`.

`npm run capture:recipe-probes` and `npm run audit:render-recipes` are the
current ROM-first calibration milestone. They use the local save states listed
in `data/render-recipe-fixtures.json` to capture live CPU/PPU evidence and
verify that CHR banks and palettes can be derived from ROM data. The audit now
covers 23 probes, resolves exact CHR and palette selector matches for all of
them, promotes the mansion-door CHR template to banks `8/9`, promotes objset
`4` to banks `6/7`, and resolves Castlevania final area to banks `0B/0C`. See
`docs/render-recipe-audit-notes.md`.

`npm run render:recipe-atlas` applies that audit evidence to atlas rendering.
It currently renders 112 ROM-native entries: 23 exact validated contexts and 89
projected variants from validated recipe families, with no diagnostic render
families remaining. Castlevania is modeled as a fixed-palette final area, not a
day/night exterior. See `docs/render-recipe-atlas-notes.md`.

`npm run render:composition:exterior` composes the Jova-to-Castlevania route
from the ROM-derived topology graph and recipe-atlas segments. It currently
places 14 route areas and 21 rendered nodes, with 12 ordinary ROM-derived
boundary constraints, one connector-only transport candidate, zero generic
overlap shifts, and zero unresolved links. See
`docs/exterior-composition-notes.md`.

Topology edges now include `transitionSemantics` metadata. The first
connector-only edge is Deborah Cliff (In Tornado) to Bodley Mansion - Door:
the endpoint is still ROM-derived, but final transport coordinates remain
unresolved. See `docs/transition-semantics-notes.md`.

`npm run probe:transitions` runs the destination and camera probe harness. It
loads small save-state fixtures, drives scripted inputs, watches `$30/$50/$51`
target context, and records CPU/OAM/PPU evidence before and after transitions
settle. The current probe set covers six probes and 10 completed transitions:
Jova Woods, Doina church, Castlevania Bridge, Dora Woods - Part 3, Deborah
Cliff tornado transport, and Jova Thorn Whip Room. It identifies sprite-staging
`$0348` as Simon screen-center X, reports `$70-$73` writes at
`7:$D19E/$D1A3/$D1A8/$D1AD`, and keeps routine-byte, Simon placement, camera,
and topology evidence as separate tracks. See `docs/transition-probe-notes.md`.

`npm run decode:transition-routine` converts that probe output into a reusable
transition routine evidence artifact under `out/transition-routine/`. It records
ROM byte windows around the observed `$70-$73` write PCs, raw write metadata,
matched topology edges, Simon placement, camera state, and promoted/diagnostic
role hypotheses. See `docs/transition-routine-decoder-notes.md`.

`npm run render:world:exterior` composes the full exterior topology graph using
the topology, recipe atlas, and transition routine decoder artifact. The current
draft places all 32 exterior areas and all 55 exterior nodes, represents all 87
topology constraints, and reports `handPlacedCoordinates: 0` while keeping
conflicts, connector-only transitions, and unresolved edges explicit. See
`docs/exterior-world-composition-notes.md`.

Human-facing location names now follow the Nintendo Power map where the scan is
legible, with `cv2r` labels preserved as `sourceName`. See
`docs/location-naming-policy.md`.

The intended path is:

1. decode conflict classes from the full exterior world composition, especially vertical and special-transport placement rules
2. validate remaining mansion-door layout/crop assumptions
3. connect validated exteriors/interiors/final-area segments into final PNG and optional canvas outputs
4. preserve day, night, and fixed variants as first-class outputs
