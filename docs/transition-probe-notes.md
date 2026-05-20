# Transition Probe Notes

This milestone adds a small Mesen-driven probe harness for observing how the
game changes runtime context during actual area transitions. The emulator trace
is calibration evidence for decoding ROM behavior; it is not used as source art
for final map rendering.

## Command

```sh
npm run probe:transitions
```

Equivalent direct command:

```sh
node src/index.js run-transition-probes --rom roms/cv2.nes --fixtures data/transition-probes.json --out out/transition-probes
```

The command reads `data/transition-probes.json`, loads each configured Mesen
save state, applies the configured controller input until the expected runtime
context is observed, waits the configured settle frames, and writes trace data
under `out/transition-probes/`.

Each probe writes:

- `trace.tsv`: frame-by-frame runtime context and PPU state
- `ram-writes.tsv`: per-step zero-page and sprite-staging writes with PC,
  registers, runtime context, and written value
- `summary.json`: per-step timing and status
- `probe-start-cpu-0000-07ff.bin`: zero-page plus low RAM before scripted input
- `<step>-before-cpu-0000-07ff.bin`: CPU RAM before a transition step
- `<step>-after-cpu-0000-07ff.bin`: CPU RAM after the transition settles
- `<step>-before-oam-0000-00ff.bin`: OAM before a transition step
- `<step>-after-oam-0000-00ff.bin`: OAM after the transition settles

The analyzer writes:

- `analysis.json`: durable transition evidence
- `analysis-data.js`: browser-friendly copy for demos

## Initial Probe Set

The first probe set intentionally covers only two round trips:

- Jova Woods left edge to Town of Jova, then back into Jova Woods
- Doina church interior exit to Town of Doina, then re-entry by pressing up

The Jova Woods return uses a short settle window so the script records the
post-transition context before enemies can interfere with Simon.

## Findings

All four scoped transitions completed without timeout.

| Transition | Input | Frames to target | Runtime context change | Simon X evidence |
| --- | --- | ---: | --- | --- |
| Jova Woods to Jova | left | 36 | `$30` `02 -> 00`, `$51` `00 -> 80`, `$63/$64` `8CF4 -> 841D` | `$0348` `30 -> E9`, OAM center `E9` |
| Jova to Jova Woods | right | 21 | `$30` `00 -> 02`, `$3D/$3E` `9FE4 -> 90AC`, `$51` `80 -> 00`, `$63/$64` `841D -> 8CF4` | `$0348` `E9 -> 10`, OAM center `10` |
| Doina church to Doina | left | 4 | `$50` `07 -> 05` | `$0348` `10 -> 80`, OAM center `80` |
| Doina to Doina church | up | 4 | `$50` `05 -> 07`, `$3D/$3E` `8EDD -> 91A1` | `$0348` `80 -> 10`, OAM center `10` |

These traces confirm that the known runtime context bytes are enough to detect
the transition target quickly:

- `$30`: runtime object set
- `$50`: runtime area
- `$51`: runtime submap plus high-bit flags
- `$3D/$3E`: actor pointer
- `$63/$64`: runtime tile-set pointer

The first destination-position probe resolves Simon's screen-center X for the
scoped transition families. Low RAM `$0348` matches the OAM-derived Simon
sprite-cluster center in all four transitions and is written during each step:

- `woods-to-jova`: `$0348 = $E9`, OAM center X `$E9`
- `jova-to-woods`: `$0348 = $10`, OAM center X `$10`
- `church-to-doina`: `$0348 = $80`, OAM center X `$80`
- `doina-to-church`: `$0348 = $10`, OAM center X `$10`

This is high-confidence for screen X within the current horizontal/interior
probe set. It does not yet prove vertical destination Y, full camera state, or
special-transport placement.

The focused write trace also confirms that the fixed-bank transition routine
around `7:$D0B0-$D260` writes runtime context and loader state during the
transition. For example, the Jova Woods round trip records writes to `$30`,
`$50`, `$51`, `$63/$64`, `$6E/$6F`, `$70-$73`, `$89`, `$8E`, and `$93` from
PCs in that range. `$0348` is written later by the sprite/object staging path,
so the next trace target is the path from transition-state bytes into final
player/object position staging.

## Why This Matters

The route composer already knows which areas are connected. This probe harness
starts closing the next gap: where the game places Simon and the camera after a
transition. That is the data needed to turn topology edges into coordinate-aware
composition rules without area-specific placement guesses.

## Limits

- This milestone validates only one normal outdoor horizontal round trip and one
  town-interior round trip.
- It does not yet prove vertical transitions, doors, mansion entrances, or
  special transports.
- It resolves Simon screen-center X for the scoped transitions, but it does not
  yet promote final map placement rules.
