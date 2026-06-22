# Reference Data

This directory is for small, durable machine-readable discoveries about the ROM format and map structure.

Generated captures, extracted binaries, rendered PNGs, and other bulky artifacts belong under `out/`. Reference descriptors committed here should be reusable by multiple consumers, such as a PNG renderer, a web canvas renderer, or regression tests.

Current files:

- `background-descriptors.json`: committed ROM-native background descriptors for validated checkpoints. See `docs/background-descriptor-schema.md`.
- `regions.json`: committed regional route descriptors that organize validated and inferred viewport renders. See `docs/regional-renderer-notes.md`.
- `layout-segments.json`: committed continuous layout-space segment and route descriptors that render larger-than-viewport map slices from ROM layout pointers.
- `runtime-context-fixtures.json`: committed save-state-derived evidence for
  live `$30/$50/$51` runtime context bytes, including the Dora palette-context
  alias. See `docs/runtime-context-mapping-notes.md`.
- `render-recipe-fixtures.json`: committed manifest for save-state probes used
  to audit live CHR banks, palette selector output, and interior/exterior recipe
  families. Interior guide destinations still need per-promoted-submap proof in
  addition to any family recipe projection. See
  `docs/render-recipe-audit-notes.md` and
  `docs/interior-map-research-standard.md`.
- `actor-trace-fixtures.json`: committed manifest for save-state probes that
  trace actor slots, selector writes, HP values, and visible OAM. See
  `docs/actor-trace-notes.md`. The same fixtures feed
  `npm run decode:actor-selector-streams`, which maps observed selector writes
  back to fixed-bank ROM records and renders actor sprite strips. Interior
  research artifacts should also scan the raw actor table rows from the ROM and
  compare promoted guide rows against those bytes so control/non-visible rows
  are explicitly accounted for.
- `transition-probes.json`: committed manifest for runtime transition probes.
  Interior entry/exit alignment should add targeted probes here before a
  composed interior relationship is treated as final Simon/scroll placement
  truth.
- `guide/source/*.json`: guide scene definitions. Interior sources should point
  at full interior maps only after a generated proof artifact inventories all
  submaps, render recipes, actor/fixture rows, and entry/exit relationships.

The exterior atlas is generated from `cv2r` metadata plus ROM table reads rather
than maintained as a hand-authored `data/` JSON file. Run
`npm run render:atlas:exterior` to create `out/exterior-atlas/manifest.json`;
the current demo also commits a self-contained generated atlas manifest under
`demos/2026-05-17-exterior-atlas-demo/assets/exterior-atlas/`.
