# CV2 Mobile Control Demo

This is a portrait-only control lab for motion, gesture, and tap inputs. It
renders the Berkeley Mansion guide scene from the existing ROM-derived guide
pack:

- `guide/assets/scenes/berkeley-mansion/slice.json`
- `guide/assets/scenes/berkeley-mansion/slice-data.bin`
- `guide/vendor/guide-map-wasm/guide_map_wasm.js`

The visible game pixels are decoded in the browser from packed CHR, layout,
metatile, and palette data. Simon's standing/walking frames come from the
guide's ROM-decoded `simon-belmont` actor class. The whip pose and whip tiles
are embedded from the ROM-derived `out/actor-traces/berkeley-mansion-whip-b`
B-button trace: Simon selectors `$0B/$0C` and weapon selectors `$6E/$72/$71`.

The control lab starts in Berkeley Mansion Part 2, in the Dracula's Rib room.
The camera can pan across the full two-part Berkeley composition. Walking
support is extracted from the ROM-expanded tilemap using the Berkeley terrain
threshold proof (`E1 E9 FB`), so false-platform tiles are not treated as solid
test geometry.
Simon's movement anchor is calibrated to the decoded standing selector: support
rows use `tileTop - 15px`, matching the Berkeley entry proof where anchor
`625` stands on the floor whose visible tile top is `640`.

## Current Controls

The control mapping is implemented:

- device tilt drives thresholded left/right intent
- tap triggers ROM-traced jump intent
- a portrait phone pitch/thrust motion flick triggers the traced whip visual
- vertical swipe starts or reverses ROM-traced stair stepping on ROM-derived
  Berkeley stair-metatile paths
- the gear panel adjusts the tilt and flick thresholds live and stores them in
  browser-local settings; current preferred defaults are `0.50`, `80`, and
  `5.0` from top to bottom

There are intentionally no fallback keyboard or on-screen movement controls.
This tool is for tuning the mobile control scheme.

## Movement Implementation

Walk, jump, and fall movement are ROM-traced and ported into the browser as the
same fixed-point frame logic:

- `$88F5-$8928` starts Simon's jump state and captures horizontal intent once.
- `$D362` seeds the signed 8.8 vertical velocity as `-$0400`.
- `$D36A` stores horizontal movement in `$6C/$6D`, so walking and directional
  jumping move at exactly one pixel per 60 Hz frame.
- `$E0E0-$E0F3` applies `$036C/$037E` to `$0324/$0336`.
- The traced jump/fall update adds `$0038` gravity per frame and clamps fall
  speed at `$0300`.

Tilt is thresholded, not analog. Once the tilt threshold is crossed, Simon walks
at the fixed ROM-traced one-pixel-per-frame pace. Jump direction is captured at
jump start and is not changed in midair.

The small visual hold at the top of a jump is ROM-traced fixed-point behavior,
not easing. In `out/physics-traces/player-right-jump-fixed/player-physics.tsv`,
the first right jump's apex rows advance X every frame while Y repeats around
the top: `screenY 74,74,74,73,74,74` with `screenX 182,183,184,185,186,187`.
The double-jump trace
`out/physics-traces/player-right-double-jump-fixed/player-physics.tsv` shows
that later jumps can hold the apex for several frames depending on Simon's
grounded subpixel byte. The demo keeps this cadence instead of smoothing it,
because smoothing would no longer match the ROM motion.

The repeatable movement proof scripts are:

- `tools/mesen/trace-player-physics.lua`
- `tools/mesen/trace-player-stairs.lua`

Recent evidence outputs were generated under:

- `out/physics-traces/player-jump-fixed/`
- `out/physics-traces/player-double-jump-fixed/`
- `out/physics-traces/player-right-jump-fixed/`
- `out/physics-traces/player-right-double-jump-fixed/`
- `out/physics-traces/player-right-fixed/`
- `out/stair-probes/stairs-state-idle/`
- `out/stair-probes/stairs-state-up/`
- `out/stair-probes/stairs-state-down/`

## Collision Behavior

The demo samples the ROM-expanded Berkeley tilemap with the same terrain classes
used by the game. Terrain classes `0` and `3` are passable; classes `1` and `2`
block Simon's body.

Horizontal wall checks use the ROM player probe wrapper at `7:$D3AC`: moving
right checks X offset `$08`, moving left checks X offset `$F8`, and the walking
Y-offset list is `$08/$F0/$00`. Lower/mid body probes block movement; a
grounded top-only `$F0` hit is treated as a doorway lintel in the composed demo
map. Airborne horizontal checks use `$F0/$00` and test the fixed frame's crossed
Y range before accepting a diagonal X step. The demo also checks the decoded
jump frame's rendered side edge across its visible height so diagonal jumps
cannot visibly enter solid block corners before the two ROM side probe points
fire. Upward block collision uses the
vertical probe offsets `$12/$0A` from the bank-3 jump/fall routine. The demo
applies the terrain lookup's `$0D` Y bias before sampling the guide tilemap,
matching `7:$E9A0-$E9A7`.
While rising, the demo also guards the rendered jump frame's head pixels using
selector `$05`'s decoded top offset (`anchorY - 12`) so Simon does not visibly
enter ceiling blocks before the torso probes hit. The same decoded jump frame
provides the airborne side-edge guard used for corner contact.

The floor/platform landing code still uses ROM-expanded support surfaces. The
Rib-room left-walk trace showed the current surface extractor bridging a lower
doorway where the ROM changes Simon's vertical state, so the top-only lintel
compensation keeps that doorway traversable until the remaining vertical
resolver is ported. See `docs/mobile-control-demo-collision.md` for the
collision audit details.

The camera follows Simon through a capped-rate vertical anchor. It does not
chase the upward half of a jump, so Simon's jump arc remains visible instead of
being canceled by the guide camera, but it follows downward falls and landings
gradually so platform drops do not snap the camera in one frame.

## Stair Behavior

Stairs are built from Berkeley Mansion layout metatiles:

- up-left stair metatiles: `$02/$04`
- up-right stair metatiles: `$03/$05`

Adjacent stair metatiles are chained by matching endpoints into continuous stair
paths. A vertical swipe snaps Simon to the nearest path and starts traversal.
The path line is calibrated from the raw 32x32 metatile corner diagonal by stair
orientation: up-right stair paths are shifted 8 pixels left, while up-left stair
paths are shifted 8 pixels right. This matches the emulator/OAM alignment seen
in the on-stairs save-state capture and its mirrored Berkeley stair path:
Simon's ROM sprite anchor is not centered on the raw block-corner diagonal used
by the first guide-derived path pass.
While on a stair path, Simon uses the traced ROM stair state model:

- `$03D8 = $09` is stair idle.
- `$03D8 = $0A` is stair stepping.
- each step moves 0.5 pixels horizontally and 0.5 pixels vertically per 60 Hz
  frame for 16 movement frames.
- stair physics keeps the half-pixel cadence internally, but Simon and the
  camera are rendered on whole NES pixels, matching the ROM's integer OAM screen
  coordinates (`$0348/$0324`) rather than the subpixel bytes (`$035A/$0336`).
- held stair input starts the next step after the ROM idle boundary.
- up-stair rendering uses selectors `$08/$09/$08`.
- down-stair rendering uses selectors `$06/$07/$06`.

The on-stairs save state `out/states/stairs.mss` proves the idle anchor
`$0348/$0324 = (128,128)` with selector `$08`. Direction traces from that state
prove the signed 8.8 stair vectors:

- up on that staircase: `$6D:$6C = FF:80`, `$036C:$037E = FF:80`
- down on that staircase: `$6D:$6C = 00:80`, `$036C:$037E = 00:80`

See `docs/mobile-control-demo-stair-physics.md` for the durable trace summary.

## Evidence Boundaries

The visible room pixels, terrain metatiles, palettes, Simon standing/walking
frames, jump frame `$05`, and stair frames `$06/$07/$08/$09` are decoded from
ROM data. Stair state handling and cadence are now ROM-traced ports. Horizontal
wall collision and upward block collision use ROM-derived terrain classes and
ROM-derived player probe offsets, with a documented doorway-lintel compensation
for the composed Rib-room route and decoded rendered-envelope guards for jump
head/side contact. Stair path geometry is still derived from ROM layout
metatiles in the guide slice; the full stair-entry collision predicate and
remaining vertical landing resolver are not yet direct ports.

The motion-whip visual is ROM-traced for this Berkeley Mansion control lab. It
uses Simon selectors `$0B/$0C` and weapon selectors `$6E/$72/$71`, but this tool
does not claim the full combat mechanic is decoded.

To preview locally from the repo root with phone motion sensors enabled, serve
over HTTPS. The helper serves the repo root with no-store cache headers and uses
the temporary self-signed cert under `out/mobile-control-demo-https/`.

```sh
mkdir -p out/mobile-control-demo-https
openssl req -x509 -newkey rsa:2048 \
  -keyout out/mobile-control-demo-https/key.pem \
  -out out/mobile-control-demo-https/cert.pem \
  -days 7 -nodes -subj '/CN=localhost' \
  -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1,IP:192.168.86.32'
CV2_CONTROL_DEMO_PORT=4445 python3 tools/mobile-control-demo/serve-https.py
```

Then open:

```text
https://192.168.86.32:4445/tools/mobile-control-demo/
```

If the computer's LAN IP changes, update the certificate `subjectAltName` IP and
the phone URL to match.
