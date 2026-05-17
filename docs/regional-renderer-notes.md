# Regional Renderer Notes

The regional renderer turns individual ROM-native background renders into a
stitched route image. It is intentionally status-aware: a region can mix
validated descriptor-backed screens with inferred candidates derived from
`objset`, `area`, and `submap`.

## Data

Region definitions live in `data/regions.json`.

The first region is `jova-to-veros-day`, a 5-screen route strip:

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

The region strip is a route slice, not final world topology. It is designed to
show that the renderer can now move beyond isolated screens while preserving
confidence status per screen. The next step is to capture emulator fixtures for
the inferred bridge and Veros Woods screens, compare them, and promote them to
validated entries when pixel parity passes.
