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
  research artifacts should also scan raw actor tables when a table boundary is
  known, or byte-check every manifest actor row pointer directly for simple
  single-room interiors, so control/non-visible rows are explicitly accounted
  for and no row is silently promoted or omitted.
- `enemy-atlas.json`: generated whole-ROM enemy inventory. It byte-checks every
  manifest enemy row, derives day/night HP from the ROM initializer rule,
  resolves sprite palette bytes through the render-recipe atlas, records
  selector/metasprite evidence where the actor routine is decoded, and keeps
  manual-name candidates separate from proven manual names. Rebuild with
  `npm run build:enemy-atlas`; see `docs/enemy-atlas-notes.md`.
- `transition-probes.json`: committed manifest for runtime transition probes.
  Interior entry/exit alignment should add targeted probes here before a
  composed interior relationship is treated as final Simon/scroll placement
  truth.
- `deborah-tornado-path.json`: committed trace-derived path for the Deborah
  Cliff tornado actor. The ROM routine condition and actor initialization are
  documented in `docs/guide-secret-reveal-methods.md`; this file preserves the
  per-frame runtime segment/X/Y positions used by the guide's triggered
  animation, plus the explicitly labeled guide-presentation smoothing for the
  Jam-to-Cliff screen-wrap handoff.
- `guide/source/*.json`: guide scene definitions. Interior sources should point
  at full interior maps only after a generated proof artifact inventories all
  submaps, render recipes, actor/fixture rows, and entry/exit relationships.
  Door target view mappings belong in guide source, but the target contexts
  should come from ROM door tables and the visible hit locations should come
  from ROM-expanded tile signatures or documented validation artifacts.

The exterior atlas is generated from `cv2r` metadata plus ROM table reads rather
than maintained as a hand-authored `data/` JSON file. Run
`npm run render:atlas:exterior` to create `out/exterior-atlas/manifest.json`;
the current demo also commits a self-contained generated atlas manifest under
`demos/2026-05-17-exterior-atlas-demo/assets/exterior-atlas/`.
