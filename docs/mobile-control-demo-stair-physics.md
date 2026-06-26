# Mobile Control Demo Stair Physics

This note records the stair evidence used by `tools/mobile-control-demo`.

## Runtime Trace Inputs

- Script: `tools/mesen/trace-player-stairs.lua`
- On-stairs save state: `out/states/stairs.mss`
- Rib-room route trace: `out/stair-probes/orb-left470-up/`

The save state loads Simon already on a staircase. After 30 settle frames,
slot 0 is in ROM stair idle state:

- `$03D8 = $09`
- selector `$0300 = $08`
- screen anchor `$0348/$0324 = (128, 128)`
- facing `$0420 = $00`
- stair kind `$04C2 = $01`

## State And Motion

The ROM uses two player stair states in the traced flow:

- `$09`: stair idle
- `$0A`: stair stepping

Pressing up from `out/states/stairs.mss` enters state `$0A` and moves
left/up on that staircase. The traced velocity fields are:

- horizontal movement `$6D:$6C = FF:80`
- vertical velocity `$036C:$037E = FF:80`

Pressing down from the same state enters state `$0A` and moves right/down:

- horizontal movement `$6D:$6C = 00:80`
- vertical velocity `$036C:$037E = 00:80`

Those are signed 8.8 values, so stair stepping advances at 0.5 pixels per
60 Hz frame on each axis. A step runs for 16 movement frames, then returns to
state `$09` for the inter-step idle before the next held-input step begins.

The ROM keeps this subpixel movement separately from the visible sprite
coordinates. `$035A/$0336` carry the subpixel components, while `$0348/$0324`
are the integer screen coordinates used for OAM staging. The control demo keeps
half-pixel stair physics internally but snaps Simon and the camera to whole NES
pixels when rendering, so stair feet line up with the background the same way
they do in the emulator.

## Stair Sprites

The traced selector cadence is direction-dependent:

- Up stair step: `$08`, `$09`, `$08`
- Down stair step: `$06`, `$07`, `$06`

Decoded selector records:

| Selector | Pointer | Role |
| --- | --- | --- |
| `$06` | `$B19F` | down-stair first/last pose |
| `$07` | `$B179` | down-stair middle pose |
| `$08` | `$B1AD` | up-stair first/last pose and idle pose after upward movement |
| `$09` | `$B179` | up-stair middle pose |

The browser demo embeds these ROM-decoded metasprites directly instead of using
walking selectors while Simon is on stairs.

## Static ROM Cross-Check

Bank 3 player dispatch around `$81C4` routes player state through a pointer
table. The stair branch around `$8AD9-$8B62` selects a direction and enters
state `$0A`. The velocity groups beginning at `$8B66` include:

- `00 80 00 80`
- `FF 80 00 80`
- `00 80 FF 80`
- `FF 80 FF 80`

Those bytes match the traced signed 8.8 half-pixel stair vectors.

## Remaining Boundary

The demo still derives stair paths from ROM layout metatiles `$02/$04`
and `$03/$05` in the Berkeley guide slice. Those metatile paths are calibrated
from the raw 32x32 block-corner diagonal by stair orientation: `$03/$05`
up-right paths shift 8 pixels left, while `$02/$04` up-left paths shift 8
pixels right. This matches the emulator save-state's OAM/foot alignment on the
original stair and the mirrored Berkeley stair path. The step cadence, velocity,
facing, and stair selectors are ROM-traced ports; the full stair-entry collision
predicate is not yet a direct port.
