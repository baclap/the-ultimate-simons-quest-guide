# Exterior Composition Notes

The exterior composition pass is the first bridge from topology to a rendered
map draft. It composes a route from already-rendered recipe-atlas segments while
preserving which placement facts come from ROM data and which placement choices
are still generic solver inference.

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

The current pass does not claim final world coordinates. It only has horizontal
left/right constraints, so when the route would overlap itself the renderer
uses a generic row-shift solver. That row shift is recorded as
`solverAdjustment.source = "generic-overlap-avoidance"` in
`composition.json`.

Current run summary:

| Metric | Count |
| --- | ---: |
| Route areas | 14 |
| Rendered nodes | 21 |
| ROM-derived placement constraints | 13 |
| Solver-inferred placements | 1 |
| Unresolved placements | 0 |
| Output size | 8512x1920 |

The one inferred row shift occurs when placing `obj04-area02` after
`obj01-area04`. The edge direction still comes from the ROM transition
`obj01-area04 -> obj04-area02`; only the row move is inferred to avoid reusing
the same layout space.

## Limits

- This is a route composition, not the full exterior graph.
- It does not decode vertical transition offsets, stair destinations, or exact
  entrance coordinates yet.
- It does not validate the composed map against live emulator windows yet.
- Mansion-door segments are included from the recipe atlas, but mansion-door
  layout/crop parity remains a separate validation target.

## Next Step

The next milestone should expand the same provenance model from one route to
the full exterior topology graph. Where placement remains ambiguous, the output
should keep marking solver inference instead of adding per-area hand placement.
The most valuable deeper decoding target is the ROM/runtime state that explains
vertical placement and entrance position across transitions.
