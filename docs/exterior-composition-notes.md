# Exterior Composition Notes

The exterior composition pass is the bridge from topology to a rendered map
draft. It composes a route from already-rendered recipe-atlas segments while
preserving which placement facts come from ROM data and which placement choices
are still unresolved connector inference.

## Command

```sh
npm run render:composition:exterior
```

This writes:

- `out/exterior-composition/composition.png`
- `out/exterior-composition/composition.json`
- `out/exterior-composition/composition-data.js`

The committed demo copies those generated files into
`demos/2026-05-20-composition-draft-demo/assets/exterior-composition/`.

## Inputs

The pass uses two committed renderer outputs:

| Input | Role |
| --- | --- |
| `out/exterior-topology/topology.json` | Route areas and ROM-derived boundary transition edges. |
| `out/render-recipe-atlas/manifest.json` | Rendered segment PNGs, dimensions, CHR banks, palette recipe data, and variant status. |

The default route is `jova-to-castlevania-area-path`, the shortest area-level
path emitted by the topology pass. The default variant is day; Castlevania's
final area stays fixed because the recipe atlas marks it as a fixed-palette
final-area render rather than a day/night exterior.

## What Is ROM-Derived

- Area-to-area left/right constraints come from decoded area-record transition
  triples.
- Each transition constraint preserves its raw bytes, marker kind, source area,
  and target area.
- Submap ordering inside an area follows the topology area record order.
- Segment pixels and dimensions come from the recipe atlas, which renders from
  ROM layout data, CHR banks, and palette selector output.

## What Is Still Inferred

The current pass does not claim final world coordinates. Most route edges still
use ordinary left/right constraints, but topology now identifies the Deborah
Cliff tornado edge as connector-only. The composition renderer starts a new
route row for that edge instead of pretending the mansion is simply adjacent to
the cliff wall.

That connector break is recorded as
`solverAdjustment.source = "connector-only-route-break"` in `composition.json`.
It is not a per-area placement tweak; it is a visible marker that exact tornado
transport coordinates still need deeper decoding.

Current run summary:

| Metric | Count |
| --- | ---: |
| Route areas | 14 |
| Rendered nodes | 21 |
| ROM-derived ordinary placement constraints | 12 |
| Connector-only transitions | 1 |
| Generic overlap shifts | 0 |
| Solver-inferred placements | 1 |
| Unresolved placements | 0 |
| Output size | 8512x1696 |

The one inferred row break occurs on
`obj04-area01-sub00 -> obj01-area04-sub00`: Deborah Cliff (In Tornado) to
Bodley Mansion - Door. The endpoint still comes from the ROM transition tuple
`$FF $01 $04`; the connector-only interpretation is based on the
reverse-engineered [`cv2r`](https://github.com/tonylukasavage/cv2r) location name until the actual tornado routine is
decoded.

## Limits

- This is a route composition, not the full exterior graph.
- It does not decode vertical transition offsets, stair destinations, tornado
  transport coordinates, or exact entrance coordinates yet.
- It does not validate the composed map against live emulator windows yet.
- Mansion-door segments are included from the recipe atlas, but mansion-door
  layout/crop parity remains a separate validation target.

## Next Step

The next milestone should decode the ROM/runtime state behind special transport
and vertical placement. Where placement remains ambiguous, the output should
keep marking connector inference instead of adding per-area hand placement. The
most valuable deeper decoding target is the routine that handles route
transitions and writes runtime context plus Simon's destination position.
