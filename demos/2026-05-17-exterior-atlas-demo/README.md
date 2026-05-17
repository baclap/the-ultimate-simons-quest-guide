# Exterior Atlas Demo

This demo presents the first full exterior atlas pass.

The atlas assets are generated from the ROM with:

```sh
node src/index.js render-exterior-atlas --rom roms/cv2.nes --out demos/2026-05-17-exterior-atlas-demo/assets/exterior-atlas
```

The Jova-to-Veros baseline route image is copied from the previous route demo so
this slideshow remains self-contained.

The atlas manifest distinguishes validated-template renders from
inferred-template renders. The latter are ROM-native layout renders, but their
CHR/palette template choices still need representative emulator validation
before they should be treated as final pixel-perfect map output.

The embedded atlas assets have been refreshed after the vertical-layout
milestone. Multi-section entries now render all layout rows instead of only
section `0`.
