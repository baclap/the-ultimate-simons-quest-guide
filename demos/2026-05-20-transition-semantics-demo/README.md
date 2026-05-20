# Transition Semantics Demo

This demo shows the first transition-classification pass.

It is generated from:

- `out/exterior-topology/topology.json`
- `out/exterior-composition/composition.json`
- `out/exterior-composition/composition.png`

The important change is that Deborah Cliff (In Tornado) to Bodley Mansion - Door
is now classified as `special-transport-candidate` with placement mode
`connector-only`. The ROM transition bytes still identify the endpoint, but the
composition no longer treats the edge as ordinary adjacency.
