# ROM Unwound Lesson Demo

This demo is a long-form lesson about the ROM-side reverse-engineering work in
this repository. It intentionally avoids the `web/` WASM/WebGL app and focuses
on the Node ROM tooling, generated evidence artifacts, and the conceptual path
from raw NES bytes to a topology-aware world draft.

Open:

```text
demos/2026-05-21-rom-unwound-lesson-demo/index.html
```

The lesson is self-contained. Its `assets/` directory packages committed demo
images plus already-generated local `out/` evidence files so it can be read
without a ROM, emulator, or build step.

Covered sections:

- ROM container: iNES, PRG, CHR, banks, and address mapping
- NES graphics primitives: CHR bitplanes, palettes, nametables, attributes,
  and metatiles
- Background reconstruction: runtime context, table pointer paths, layout
  headers, row streaming, descriptors, and ROM-native renders
- Validation: Mesen capture artifacts as calibration evidence
- Recipes and palettes: CHR fingerprints, palette selectors, aliases, variants,
  and recipe-atlas confidence
- Topology: exterior nodes, areas, transition triples, and connector-only edges
- Transition probes: scripted emulator transitions, `$0348`, `$70-$73`, and
  camera/placement separation
- World composition: topology plus rendered segments plus routine evidence,
  with provenance labels and no hand-placed coordinates
