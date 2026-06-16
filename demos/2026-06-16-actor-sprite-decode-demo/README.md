# Actor Sprite Decode Evidence Demo

This sprint demo documents the next actor-overlay milestone for the future
guide: how ROM actor rows become runtime sprite art, where that is now proven,
and where the no-shortcut gaps remain.

It is intentionally conservative. The demo does not promote enemy art by visual
similarity, and it does not treat `cv2r` labels as truth when the ROM path has
not been proven. It uses `cv2r` as a map of useful clues, then keeps ROM bytes,
runtime CPU/PPU/OAM captures, and decoded metasprite streams as the evidence.

## What This Demo Proves

- The actor draw path reads `$0300,x`, selects a metasprite pointer through
  `$AC30` or `$AD30`, and emits OAM Y/tile/attribute/X entries.
- A local metasprite decoder reproduces Simon's captured selector `0x04`
  output, including tiles `03 05 07 09`.
- The Jova shepherd-style NPC row is runtime-bound to selector `0x24`.
- The Jova white-crystal merchant row is runtime-bound to selector `0x1E`.
- Sprite color selection comes from OAM/metasprite attribute palette bits.
- The Jova merchant row is not an ordinary row-data text lookup: row data
  `0x07` is not the white-crystal prompt selector, while text-table index
  `0x32` points to the ROM bytes for `buy a white / crystal?`.
- The two Veros mystery chunks are row-like records with id `0x43`, but remain
  unresolved until the id behavior path is traced.

## What Is Still Not Proven

- Exact enemy sprite bindings for skeleton, fishman, werewolf, and zombie.
- All remaining town-person sprite variants in Jova.
- Sign/fixture sprite treatment.
- The complete merchant row-data-to-dialog selector routine.

## Files

- `index.html`: static slideshow shell.
- `styles.css`: slideshow layout and responsive styling.
- `slides.js`: slide renderer.
- `assets/evidence/actor-sprite-evidence.json`: generated evidence bundle.
- `assets/sprites/*.png`: generated sprite images from decoded metasprite data
  and captured PPU pattern/palette memory.
- `assets/images/*.png`: copied map/capture context images from committed demo
  artifacts.
