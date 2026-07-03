# Exterior World Composition Notes

This milestone composes the full exterior topology graph into one rendered draft
without hand-placed area coordinates. It is a constraint-composition draft, not
the final pixel-perfect world map.

## Command

```sh
npm run render:world:exterior
```

Equivalent direct command:

```sh
node src/index.js render-exterior-world-composition --rom roms/cv2.nes --topology out/exterior-topology/topology.json --atlas out/render-recipe-atlas/manifest.json --transition-rules out/transition-routine/decoder.json --out out/exterior-world-composition
```

This writes:

- `out/exterior-world-composition/world.png`
- `out/exterior-world-composition/world-composition.json`
- `out/exterior-world-composition/world-composition-data.js`

## Inputs

| Input | Role |
| --- | --- |
| `out/exterior-topology/topology.json` | Exterior nodes, areas, submap sequence edges, and ROM boundary transition edges. |
| `out/render-recipe-atlas/manifest.json` | ROM-native rendered area images and dimensions. |
| `out/transition-routine/decoder.json` | Routine-observed edge evidence and `$70-$73` byte metadata. |

## Current Run

| Metric | Count |
| --- | ---: |
| Areas placed | 32 / 32 |
| Nodes rendered | 55 / 55 |
| Edge constraints represented | 87 / 87 |
| Submap sequence constraints | 23 |
| Boundary constraints | 64 |
| Solved constraints | 68 |
| Routine-supported constraints | 6 |
| Connector-only transitions | 1 |
| Unresolved constraints | 1 |
| Conflict constraints | 17 |
| Generic overlap shifts | 10 |
| Hand-placed coordinates | 0 |
| Output size | 15936x4864 |

## What Is ROM-Derived

- Area and submap inventory comes from the exterior topology pass.
- Submap relative ordering comes from the [`cv2r`](https://github.com/tonylukasavage/cv2r) submap order preserved in
  topology edges.
- Boundary transition endpoints come from decoded ROM transition bytes.
- Segment pixels and dimensions come from the recipe atlas.
- Routine-supported labels come from the transition routine decoder.

## What Is Solver-Derived

The composer uses deterministic graph layout when side-only ROM topology would
overlap previously placed areas. Those row shifts are labeled as
`deterministic-overlap-avoidance`; they are not counted as ROM-derived world
coordinates.

Connector-only transitions remain connectors. Deborah Cliff to Bodley Mansion -
Door is still not treated as ordinary adjacency because the transition routine
evidence does not yet provide true transport coordinates.

Conflicts are preserved instead of hidden. They identify places where side-only
topology is insufficient and the next routine-decoding work should look for
vertical offsets, special placements, or missing coordinate semantics.

## Limits

- This is the exterior graph only. Town interiors, mansion interiors, and
  Dracula remains rooms remain a future layer.
- It does not claim final world coordinates for conflict, connector-only, or
  unresolved edges.
- It does not yet validate the full composition against emulator traversal.
- Mansion-door renders still depend on the existing recipe-atlas render quality.
