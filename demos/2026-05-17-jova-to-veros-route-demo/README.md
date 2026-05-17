# Jova To Veros Route Demo

Stakeholder demo for the first full outdoor Jova-to-Veros route render.

The primary visual asset is:

```text
assets/layout-routes/jova-to-veros-outdoor-day.png
```

It is generated with:

```sh
node src/index.js render-layout-route-png \
  --rom roms/cv2.nes \
  --route jova-to-veros-outdoor-day \
  --out demos/2026-05-17-jova-to-veros-route-demo/assets/layout-routes/jova-to-veros-outdoor-day.png \
  --metadata-out demos/2026-05-17-jova-to-veros-route-demo/assets/layout-routes/jova-to-veros-outdoor-day.json
```

The output is a 3072x224 day-palette outdoor route image rendered from ROM
layout data, not a stitched emulator screenshot.
