# Guide App

This is the production interactive guide.

- `src/`: Vite app source.
- `source/`: authored guide scene/layout definitions.
- `public/assets/`: generated runtime guide packs, audio data, and fonts.
- `public/sw.js`: soft-update service worker for offline support.

Run locally:

```sh
npm install
npm run dev
```

Build:

```sh
npm run build
npm run preview
```

The committed app runs without a ROM. Regenerating `public/assets/` requires the
root project pipeline and a local ROM at `../roms/cv2.nes`.
