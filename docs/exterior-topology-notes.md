# Exterior Topology Notes

The exterior topology pass turns the atlas from a rendered inventory into an
adjacency graph. It does not place the world in final pixel coordinates yet; it
records which rendered exterior candidates connect to each other according to
the ROM's area transition tables.

## Command

```sh
npm run render:topology:exterior
```

This writes:

- `out/exterior-topology/topology.json`
- `out/exterior-topology/topology-data.js`

The graph is intentionally separate from PNG output. Consumers can use the same
data to build a static composite, an SVG schematic, or a future canvas renderer.

## Data Model

The topology contains:

- `nodes`: one node per rendered exterior atlas candidate
- `areas`: one group per `objset/area`, with one or more submap nodes
- `edges`: adjacency edges
- `routes`: derived paths through the graph

There are two edge families:

| Edge type | Source | Meaning |
| --- | --- | --- |
| `submap-sequence` | [`cv2r`](https://github.com/tonylukasavage/cv2r) submap order inside one area record | Adjacent map sections within the same area. |
| `boundary-transition` | ROM area-record bytes at offsets `3..8` | Left/right exits between areas. |

Each `boundary-transition` preserves its raw three-byte transition tuple and
decoded marker kind.

Each edge also carries `transitionSemantics`. This separates ordinary
left/right adjacency from connector-only candidates where the endpoint is known
but the world coordinate is not yet decoded.

## Transition Bytes

Area records are read through bank `2:$F7AB`. For each area:

- byte `2` is the maximum submap index
- bytes `3..5` describe the left boundary
- bytes `6..8` describe the right boundary
- bytes `9+` point to screen records for each submap

The current decoder treats markers this way:

| Marker | Decoded as |
| ---: | --- |
| `$FF` | target object set + area |
| `$FC` | target object set + area with a load flag |
| `$FB` | same object set, explicit area + raw submap |
| `$FA` | same object set, area with a load flag |
| other | same object set, target area in byte `2` |

When a transition names an area but not a submap, left exits target the
rightmost submap of the destination area, and right exits target the leftmost
submap. This is a topology-level interpretation, not a final scroll-position
model.

## Current Coverage

The current pass emits:

| Metric | Count |
| --- | ---: |
| Nodes | 55 |
| Areas | 32 |
| Edges | 87 |
| Submap sequence edges | 23 |
| Boundary transition edges | 64 |
| Unresolved boundary targets | 1 |
| Connector-only edges | 1 |
| Template-pending mansion-door nodes | 5 |

The unresolved boundary target is `obj00-area09`, an excluded interior room.
It remains in metadata as a non-atlas target rather than being hidden.

Transition semantics currently classify:

| Transition class | Count |
| --- | ---: |
| `same-area-submap-sequence` | 23 |
| `object-set-boundary` | 42 |
| `object-set-load-boundary` | 4 |
| `same-object-set-boundary` | 15 |
| `same-object-set-load-boundary` | 1 |
| `special-transport-candidate` | 1 |
| `unresolved-target` | 1 |

The connector-only edge is
`obj04-area01-sub00 -> obj01-area04-sub00`: Deborah Cliff (In Tornado) to
Bodley Mansion - Door. The ROM transition bytes still identify the endpoint,
but [`cv2r`](https://github.com/tonylukasavage/cv2r) location metadata marks the source as a tornado submap, so the
composition pass treats it as a connector until the transport coordinates are
decoded.

## Demo Path

The topology pass also derives a shortest area-level path from Jova to
Castlevania using resolved ROM transition edges. This path is a schematic route
through connected areas, not final world-coordinate placement.

That route currently passes through:

```text
Jova -> Dead River / Belasco Marsh -> Alba -> Sadam Woods -> Ondol ->
Jam Wasteland / Deborah Cliff -> Bodley Mansion Door -> Wicked Ditch ->
Doina -> North Bridge / Dora Woods -> Yomi -> Vrad Graveyard /
Castlevania Bridge -> Castlevania
```

## Limits

- The graph is topology-aware, not pixel-coordinate aware.
- Door/interior edges are not expanded into a full interior graph.
- Mansion-door nodes are connected landmarks, but their render template remains
  pending because those atlas images are still visibly scrambled.
- Vertical routes, stairs, and exact entrance positions still require runtime
  validation or deeper transition-state decoding.
