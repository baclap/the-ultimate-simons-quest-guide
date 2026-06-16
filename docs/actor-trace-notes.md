# Actor Trace Notes

This note records the current no-shortcut path for promoting enemies and NPCs
into the guide map. The new actor traces use local Mesen save states as runtime
probes, but the intended source of truth is still ROM data and ROM code.

## Commands

Run one raw trace:

```sh
node src/index.js mesen-trace-actors \
  --rom roms/cv2.nes \
  --name jova-woods-day-forward \
  --state out/states/jova-woods.mss \
  --inputs right:30:840 \
  --trace-frames 900 \
  --sample-every 8 \
  --out out/actor-traces/jova-woods-day-forward
```

Run the configured save-state probe set and aggregate it:

```sh
node src/index.js run-actor-traces \
  --rom roms/cv2.nes \
  --fixtures data/actor-trace-fixtures.json \
  --out out/actor-traces
```

Rebuild only the aggregate from existing trace outputs:

```sh
node src/index.js analyze-actor-traces \
  --fixtures data/actor-trace-fixtures.json \
  --out out/actor-traces
```

## Trace Evidence

`out/actor-traces/analysis.json` currently summarizes 15 complete traces.
Important runtime bindings:

| Trace evidence | Actor id | Selectors | HP evidence |
| --- | ---: | ---: | ---: |
| Jova Woods day, walking forward | `0x13` | `0x65`, `0x66` | `0x02` |
| Jova Woods night, walking forward | `0x13` | `0x65`, `0x66` | `0x04` |
| Jova Woods day, walking forward | `0x03` | `0x0E`, `0x0F` | `0x01` |
| Jova Woods night, walking forward | `0x03` | `0x0E`, `0x0F` | `0x02` |
| Jova town night, walking forward | `0x17` | `0x3F`, `0x40` | `0x02` |
| North Bridge day idle | `0x03` | `0x0E`, `0x0F` | `0x0F` |
| North Bridge night idle | `0x03` | `0x0E`, `0x0F` | `0x1E` |
| Camilla Cemetery day/night idle | `0x38` | `0x8E`, `0x8F` | `0x08` |
| Vrad Graveyard night idle | `0x3A` | `0xBC`, `0xBD` | `0x0F` |
| Berkeley Mansion interior idle | `0x05` | `0x35`, `0x36` | `0x02` |

The Jova Woods idle save state by itself does not prove a non-player actor. The
walking trace matters: it causes the game to stream actor slots in naturally and
then records their live ids, selectors, HP, positions, PPU sprite pattern base,
and visible OAM.

## Selector Write Routine Evidence

The traces record selector writes to `$0300+x`. For the observed enemy classes,
the callback PC is `$DD7D`. That PC lands in the fixed PRG bank, not the
switchable `mapper.prgReg` bank. For this ROM, CPU `$DD7D` maps to file offset
`0x1DD8D`.

The bytes around that fixed-bank window are:

```text
05 A9 00 9D FC 03 C8 B1 08 18 7D FC 03 9D 00 03
C8 B1 08 9D EA 03 FE FC 03 60
```

The important part is the `STA $0300,x` write in the middle. This is the shared
animation/selector stream path. The runtime trace proves which actor ids pass
through it and which selector bytes they emit. The next static step is to decode
the pointer feeding `$08/$09`, the frame counter at `$03FC+x`, and the per-actor
animation streams that supply those selector bytes.

## Actor `$43`: Transparent Sprite Mask

Actor id `$43` is a rendering-control marker, not an enemy, NPC, item, or
clickable guide entity. It should stay in diagnostic/provenance output, but it
should not be promoted into normal guide overlays.

The ROM actor dispatch table routes id `$43` to bank `1`, CPU `$836C`
(`0x0437C` in the `.nes` file). That routine does not load HP, dialogue, or a
normal metasprite selector. Once initialized, it copies the actor slot's
`$0324,x` Y position and `$0348,x` X position into OAM shadow entries
`$0218-$0237`, which are sprite slots `6-13`.

The Veros Woods Part 1 night save-state probe confirmed the runtime behavior:

| Evidence | Value |
| --- | --- |
| ROM actor row | `0x604A: 0C 0D 43 00` |
| Live actor slot | `7` |
| Active id | `$43` |
| Selector / HP | `$00` / `$00` |
| State byte | `$82` |
| Runtime position | `screenX=$AD`, `screenY=$D0` |
| OAM slots written | `6-13` |
| Sprite tile in those slots | `$FF` |

The active sprite pattern table has blank bytes for tile `$FF`, so the object is
not drawing visible art. Instead, it parks eight transparent sprites on the same
scanlines. On the NES, only eight sprites can be drawn on one scanline; consuming
those slots is a hardware-era way to hide or cut off later sprites in that
horizontal band. The clearest guide rule is therefore: treat `$43` as a
transparent sprite-mask/control row.

## What This Means For Programmatic Decode

The existing save states are enough to bind several actor classes without hand
labeling screenshots:

- `0x13` is now live-proven in Jova Woods with day/night HP doubling.
- `0x17` is now live-proven in Jova town at night.
- `0x03` is live-proven across multiple contexts, with HP varying by area and
  night state.
- `0x38`, `0x3A`, and `0x05` have live selector/HP evidence outside the first
  guide slice.

The save states are not enough by themselves to cover every enemy class on every
screen. Castlevania bridge day/night and Vrad Graveyard day did not surface
non-player actors during the configured idle probes. Those are not failures, but
they are still gaps: they need either better scripted movement from the existing
state, a new save-state probe, or a complete static decode of the actor routine
that instantiates that class.

The current no-shortcut path is therefore:

1. Decode ROM actor rows for placement and actor id.
2. Use runtime traces to calibrate actor id to live selector, HP, palette/attr,
   and animation-stream behavior.
3. Decode the fixed-bank selector stream around `$DD7D` so observed actor
   classes can be rendered programmatically on screens that do not have their own
   save state.
4. Add targeted probes only where a class or context has not appeared in the
   current evidence.
