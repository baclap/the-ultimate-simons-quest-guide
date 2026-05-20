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

## Current Probe Set

The current probe set intentionally stays small, but it now covers normal
horizontal edges, an interior entry/exit pair, a final-area edge with a real
visible Y change, and a Dora edge with a vertical camera-plane change:

- Jova Woods left edge to Town of Jova, then back into Jova Woods
- Doina church interior exit to Town of Doina, then re-entry by pressing up
- Castlevania entrance walking left to Castlevania Bridge
- Dora Woods - Part 3 walking left to Dora Woods - Part 2

The Jova Woods return uses a short settle window so the script records the
post-transition context before enemies can interfere with Simon.

## Findings

All six scoped transitions completed without timeout.

| Transition | Input | Frames to target | Runtime context change | Simon X evidence |
| --- | --- | ---: | --- | --- |
| Jova Woods to Jova | left | 36 | `$30` `02 -> 00`, `$51` `00 -> 80`, `$63/$64` `8CF4 -> 841D` | `$0348` `30 -> E9`, OAM center `E9` |
| Jova to Jova Woods | right | 21 | `$30` `00 -> 02`, `$3D/$3E` `9FE4 -> 90AC`, `$51` `80 -> 00`, `$63/$64` `841D -> 8CF4` | `$0348` `E9 -> 10`, OAM center `10` |
| Doina church to Doina | left | 4 | `$50` `07 -> 05` | `$0348` `10 -> 80`, OAM center `80` |
| Doina to Doina church | up | 4 | `$50` `05 -> 07`, `$3D/$3E` `8EDD -> 91A1` | `$0348` `80 -> 10`, OAM center `10` |
| Castlevania to Castlevania Bridge | left | 5 | `$30` `05 -> 04`, `$50` `00 -> 03`, `$51` `00 -> 81`, `$63/$64` `9A3F -> 9620` | `$0348` `11 -> E9`, OAM center `E9` |
| Dora Woods - Part 3 to Dora Woods - Part 2 | left | 4 | `$50` `09 -> 08`, `$51` `00 -> 82` | `$0348` `11 -> E9`, OAM center `E9` |

These traces confirm that the known runtime context bytes are enough to detect
the transition target quickly:

- `$30`: runtime object set
- `$50`: runtime area
- `$51`: runtime submap plus high-bit flags
- `$3D/$3E`: actor pointer
- `$63/$64`: runtime tile-set pointer

The destination-position probe resolves Simon's screen-center X for the scoped
transition families. Sprite-staging RAM `$0348` matches the OAM-derived Simon
sprite-cluster center in all six transitions and is written during each step:

- `woods-to-jova`: `$0348 = $E9`, OAM center X `$E9`
- `jova-to-woods`: `$0348 = $10`, OAM center X `$10`
- `church-to-doina`: `$0348 = $80`, OAM center X `$80`
- `doina-to-church`: `$0348 = $10`, OAM center X `$10`
- `castlevania-to-bridge`: `$0348 = $E9`, OAM center X `$E9`
- `dora-part-3-to-part-2`: `$0348 = $E9`, OAM center X `$E9`

This is high-confidence for screen X within the current horizontal/interior and
edge-transition probe set. The candidate scorer now favors written
sprite-staging bytes so `$0348` is not buried under incidental zero-value RAM
matches.

The camera/scroll pass now compares the same before/after CPU snapshots against
decoded PPU scroll state. It keeps these candidates separate from Simon position
so incidental zero matches do not hide scroll-specific evidence.

| Metric | RAM candidate | Probe support | Write evidence | Confidence |
| --- | --- | --- | --- | --- |
| Scroll Y low byte | `$00FC` | Jova Woods both ways and Castlevania to Bridge | Repeated writes from `7:$D2F5` | Diagnostic after Dora adds a scroll-Y change that does not match this low byte |
| Scroll X low byte | `$00FD` | Doina church exit, then re-entry | Repeated writes from `7:$D2F9` | Diagnostic after Dora adds an unmatched scroll-X change |
| Nametable Y bit | `$0012`, `$00AF`, `$00C7` | Dora Woods - Part 3 to Part 2 | Writes outside the transition routine | High match for the scoped Dora camera-plane change, still diagnostic as a placement rule |

The PPU scroll itself changes as follows:

- `woods-to-jova`: scroll X/Y `0,227 -> 256,211`
- `jova-to-woods`: scroll X/Y `256,211 -> 0,227`
- `church-to-doina`: scroll X/Y `0,227 -> 498,227`
- `doina-to-church`: scroll X/Y `498,227 -> 0,227`
- `castlevania-to-bridge`: scroll X/Y `0,33 -> 256,227`
- `dora-part-3-to-part-2`: scroll X/Y `16,240 -> 256,0`

Destination Y is deliberately not promoted yet. Castlevania is the first
scoped fixture that changes Simon's visible Y, moving from center `$8C` to
`$BA`. The lead diagnostic candidate is zero-page `$0073`: it is written by
the fixed-bank transition routine at `7:$D1AD` and lands on Simon's final
sprite top, `$AE`, for the Castlevania-to-Bridge step.

Dora Woods - Part 3 to Dora Woods - Part 2 is an important counterpoint:
it changes vertical camera/nametable state, but Simon's visible Y stays
`$6D -> $6D`. That means the project should decode player placement and camera
placement as separate outputs instead of treating every vertically interesting
edge as a Simon-Y transition.

The focused write trace also confirms that the fixed-bank transition routine
around `7:$D0B0-$D260` writes runtime context and loader state during the
transition. For example, the Jova Woods round trip records writes to `$30`,
`$50`, `$51`, `$63/$64`, `$6E/$6F`, `$70-$73`, `$89`, `$8E`, and `$93` from
PCs in that range. `$0348` is written later by the sprite/object staging path,
and `$00FC/$00FD` are written just after that range by the scroll staging path
around `7:$D2F5-$D2F9`.

## Why This Matters

The route composer already knows which areas are connected. This probe harness
starts closing the next gap: where the game places Simon and the camera after a
transition. That is the data needed to turn topology edges into coordinate-aware
composition rules without area-specific placement guesses.

## Limits

- This milestone validates one normal outdoor horizontal round trip, one
  town-interior round trip, one final-area Y delta, and one Dora camera-plane
  transition.
- It does not yet prove doors, mansion entrances, or special transports.
- It resolves Simon screen-center X, but it does not yet promote final map
  placement rules.
- Destination Y still needs either another true visible-Y fixture or a decoded
  ROM-table explanation for the `$70-$73` transition-routine bytes.
