# Palette Resolver Demo

This demo is the historical checkpoint for the palette resolver milestone.

It preserves a before/after Dabi's Path comparison and shows the decoded runtime
palette path:

1. Bank `2:$F7C5` selects a per-objset palette index table.
2. The runtime objset/area/submap context selects a transfer id.
3. Fixed-bank table `7:$C895` resolves that transfer id to palette bytes.
4. The atlas renderer uses those bytes to color ROM-native layout renders.

The demo intentionally does not overwrite earlier demo directories.
