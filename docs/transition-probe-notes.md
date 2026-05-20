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
node src/index.js run-transition-probes --rom roms/cv2.nes --fixtures data/transition-probes.json --topology out/exterior-topology/topology.json --out out/transition-probes
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

The current probe set covers normal outdoor horizontal edges, two town-interior
entry/exit pairs, a final-area edge with visible-Y evidence, a Dora camera-plane
edge, and the Deborah Cliff tornado transport:

- Jova Woods left edge to Town of Jova, then back into Jova Woods
- Doina church interior exit to Town of Doina, then re-entry by pressing up
- Castlevania entrance walking left to Castlevania Bridge, then back right
- Dora Woods - Part 3 walking left to Dora Woods - Part 2
- Deborah Cliff tornado transport to Bodley Mansion - Door
- Jova Thorn Whip Room exit to Town of Jova, then re-entry by pressing up

The Jova Woods return uses a short settle window so the script records the
post-transition context before enemies can interfere with Simon.

## Findings

All 10 scoped transitions completed without timeout.

| Transition | Input | Frames | Context | Simon X/Y | `$70-$73` after values | Topology |
| --- | --- | ---: | --- | --- | --- | --- |
| `woods-to-jova` | left | 36 | `02/00/00 -> 00/00/00` | X `30 -> E9`, Y `BA -> BA` | `86 FA 50 FA` | direct |
| `jova-to-woods` | right | 21 | `00/00/00 -> 02/00/00` | X `E9 -> 10`, Y `BA -> BA` | `3E A2 21 A2` | direct |
| `church-to-doina` | left | 4 | `00/07/00 -> 00/05/00` | X `10 -> 80`, Y `BA -> BA` | `66 FB 35 FB` | none |
| `doina-to-church` | up | 4 | `00/05/00 -> 00/07/00` | X `80 -> 10`, Y `BA -> BA` | `10 80 3D 80` | none |
| `castlevania-to-bridge` | left | 5 | `05/00/00 -> 04/03/01` | X `14 -> E9`, Y `8C -> BA` | `22 AF FD AE` | direct |
| `bridge-to-castlevania` | right | 14 | `04/03/01 -> 05/00/00` | X `E9 -> 10`, Y `BA -> BA` | `82 BC 68 BC` | direct |
| `dora-part-3-to-part-2` | left | 4 | `02/09/00 -> 02/08/02` | X `14 -> E9`, Y `6D -> 6D` | `96 A2 F8 A1` | direct |
| `deborah-cliff-to-bodley-door` | down | 787 | `04/01/01 -> 01/04/00` | X `27 -> E7`, Y `6F -> BA` | `CF 87 CE 87` | source-area candidate |
| `jova-interior-to-town` | left | 3 | `00/08/00 -> 00/00/00` | X `0C -> 80`, Y `BA -> 8C` | `86 FA 50 FA` | none |
| `jova-town-to-interior` | up | 5 | `00/00/00 -> 00/08/00` | X `80 -> 10`, Y `8C -> BA` | `16 80 41 80` | none |

These traces confirm that the known runtime context bytes are enough to detect
the transition target quickly:

- `$30`: runtime object set
- `$50`: runtime area
- `$51`: runtime submap plus high-bit flags
- `$3D/$3E`: actor pointer
- `$63/$64`: runtime tile-set pointer

The destination-position probe continues to resolve Simon's screen-center X for
the scoped transition families. Sprite-staging RAM `$0348` matches the
OAM-derived Simon sprite-cluster center across all 10 transitions and is written
during each step.

The transition-routine byte audit now reports `$0070-$0073` as a separate
evidence track. The bytes are written by stable PCs in fixed bank 7:

- `$0070`: written at `7:$D19E`
- `$0071`: written at `7:$D1A3`
- `$0072`: written at `7:$D1A8`
- `$0073`: written at `7:$D1AD`

For ordinary horizontal and interior transitions, each byte is written once.
Deborah Cliff's tornado transport writes each byte twice before settling at
Bodley Mansion - Door, which makes it a useful diagnostic for special transport
handling. The topology graph cannot direct-match its exact starting submap, but
it finds a source-area candidate edge:
`boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left`.
That edge carries ROM transition bytes `FF 01 04` and is classified as a
connector-only special-transport candidate.

Destination Y is still not promoted into renderer rules. The evidence now has
multiple useful cases:

- Castlevania to Bridge changes Simon center Y `8C -> BA`.
- Deborah Cliff tornado transport changes Simon center Y `6F -> BA`.
- Jova Thorn Whip Room exit changes Simon center Y `BA -> 8C`, and re-entry
  changes `8C -> BA`.
- Dora Woods - Part 3 to Part 2 changes vertical camera/nametable state while
  Simon center Y stays `6D -> 6D`.

That split is important: player placement and camera placement must be decoded
as separate outputs from the ROM routine rather than inferred from broad area
shape alone.

## Why This Matters

The route composer already knows which areas are connected. This probe harness
is closing the next gap: how the game derives Simon placement and camera state
after a transition. The new `$70-$73` matrix gives concrete routine-level bytes
to tie back to ROM tables, which is the path toward coordinate-aware
composition rules without area-specific placement guesses.

## Limits

- This milestone records transition-routine byte evidence; it does not promote
  new exterior composition or final map rendering rules.
- Interior door edges are not represented in the exterior topology graph yet,
  so their topology status remains `none` even when the scripted transition is
  validated.
- Deborah Cliff completed successfully, but it remains diagnostic until the ROM
  routine explains the special-transport placement and camera state.
- The next milestone should decode how the routine inputs around `$70-$73`
  correspond to ROM transition triples, player placement, and PPU scroll state.
