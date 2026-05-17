# Reference Data

This directory is for small, durable machine-readable discoveries about the ROM format and map structure.

Generated captures, extracted binaries, rendered PNGs, and other bulky artifacts belong under `out/`. Reference descriptors committed here should be reusable by multiple consumers, such as a PNG renderer, a web canvas renderer, or regression tests.

Current files:

- `background-descriptors.json`: committed ROM-native background descriptors for validated checkpoints. See `docs/background-descriptor-schema.md`.
- `regions.json`: committed regional route descriptors that organize validated and inferred viewport renders. See `docs/regional-renderer-notes.md`.
- `layout-segments.json`: committed continuous layout-space segment and route descriptors that render larger-than-viewport map slices from ROM layout pointers.
