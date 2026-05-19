# Render Recipe Audit Demo

This demo presents the save-state probe milestone. The images are captured
evidence from Mesen probes, while the audit data records how those live render
facts match ROM-derived CHR banks and palette selector tables.

Open `index.html` directly, or serve this directory with a local static server.

## Source Commands

```sh
npm run capture:recipe-probes
npm run audit:render-recipes
npm run render:atlas:exterior
```

## Assets

- `assets/audit/` is a snapshot of `out/render-recipe-audit/`.
- `assets/captures/` contains copied probe screenshots and PPU background
  reconstructions.
- `assets/current-atlas/` contains current atlas renders for fixtures that map
  to exterior atlas candidates.
