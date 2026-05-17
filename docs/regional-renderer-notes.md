# Regional Renderer Notes

The regional renderer currently turns individual ROM-native background renders
into a route-ordered viewport catalog. It is intentionally status-aware: a region can mix
validated descriptor-backed screens with inferred candidates derived from
`objset`, `area`, and `submap`.

## Data

Region definitions live in `data/regions.json`.

The first region is `jova-to-veros-day`, a 5-screen viewport catalog:

1. Jova town left: validated descriptor screen, 0 differing pixels.
2. Jova town right: validated descriptor screen, 0 differing pixels.
3. Jova Woods: validated descriptor screen, 0 differing pixels.
4. Jova-Veros Bridge: inferred from `objset=2`, `area=0`, `submap=1`.
5. Veros Woods - Part 1: inferred from `objset=2`, `area=0`, `submap=2`.

The inferred entries use the `overworld-woods-day` template:

- CHR banks: `2/3`
- layout bank: `2`
- tile bank: `4`
- tile set: derived from the background context path, currently `4:$8CF4`
- palette: `4:$9FC6`
- dimensions: 8 by 7 blocks
- viewport scroll: `x=0`, `y=227`

## Command

```sh
npm run render:region:jova-to-veros
```

This writes:

- `out/regions/jova-to-veros-day.png`
- `out/regions/jova-to-veros-day.json`

The committed regional demo stores a self-contained render under:

```text
demos/2026-05-17-regional-demo/assets/regional/jova-to-veros-day.png
```

## Interpretation

The current render is not a continuous map strip. Each panel is a 256x240
viewport-sized TV-frame render, arranged in rough route order. The panels should
not be read as proven neighboring world-space sections, and there are likely
missing viewports or layout columns between some entries.

This demo is designed to show that the renderer can now organize validated and
inferred ROM-native viewport samples while preserving confidence status per
screen. The next step is to decode layout section and column continuity for one
outdoor area, render a larger-than-screen map segment from that layout space,
and use viewport-sized emulator crops only as validation windows.
