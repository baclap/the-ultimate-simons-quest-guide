# Layout Segment Demo

Stakeholder demo for the first continuous ROM-native layout-space segment.

The primary visual asset is:

```text
assets/layout-segments/jova-woods-day.png
```

It is generated with:

```sh
node src/index.js render-layout-segment-png \
  --rom roms/cv2.nes \
  --segment jova-woods-day \
  --out demos/2026-05-17-layout-segment-demo/assets/layout-segments/jova-woods-day.png \
  --metadata-out demos/2026-05-17-layout-segment-demo/assets/layout-segments/jova-woods-day.json
```

The output is a 1024x224 Jova Woods day segment rendered from ROM layout data,
not a stitched emulator screenshot.
