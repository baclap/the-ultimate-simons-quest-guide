# ROM Actor Catalog Evidence Demo

This static demo documents the first no-shortcuts pass at the enemies, NPCs,
fixtures, text, and HP data needed by the guide prototype for the Town of Jova
through Berkeley Mansion door slice.

The deck is intentionally direct: it shows the actor roster, exact ROM row
offsets, x/y coordinates, pinned segment maps, day/night visibility, HP values,
and Jova NPC text. It also calls out what is not proven yet:

- full actor sprite/metasprite and palette decoding;
- the merchant row-to-text selector routine;
- two Veros low-priority/control chunks;
- imported display names that still come from cv2r labels rather than a decoded
  sprite/id routine.

## Files

- `index.html`: static slideshow shell.
- `styles.css`: responsive presentation styling.
- `slides.js`: slide rendering, hash navigation, keyboard support, and map pin
  rendering.
- `assets/evidence/actor-catalog.json`: generated take-2 catalog payload.
- `assets/evidence/actor-catalog.js`: browser wrapper for the catalog payload.
- `assets/evidence/actor-evidence.json`: earlier lower-level evidence payload,
  retained for provenance.
- `assets/images/`: copied ROM-native background renders for every segment in
  the reviewed slice.
- `assets/captures/`: copied sprite-overlay capture images used as calibration
  evidence.

## Review

Open `index.html` through any static server, or from the repository root:

```sh
python3 -m http.server 4181 --directory demos/2026-06-15-rom-actor-evidence-demo
```

Then visit `http://localhost:4181/`.

## Verification

```sh
node --check demos/2026-06-15-rom-actor-evidence-demo/slides.js
```

The demo does not require a ROM at runtime. The ROM was used only while
generating the committed evidence assets.
