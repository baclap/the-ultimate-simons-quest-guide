# Composition Draft Demo

This demo presents the first topology-aware exterior route composition.

It is generated from:

- `out/exterior-topology/topology.json`
- `out/render-recipe-atlas/manifest.json`
- `out/exterior-composition/composition.json`
- `out/exterior-composition/composition.png`

The composition is intentionally labeled as a draft. Area pixels and dimensions
come from the ROM-derived recipe atlas, and left/right placement constraints
come from ROM boundary-transition edges. The single row break is a generic
overlap-avoidance solver move and is recorded as inferred in
`composition.json`.
