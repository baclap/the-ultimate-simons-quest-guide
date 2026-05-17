# Runtime Context Mapping Notes

This note tracks the gap between a static atlas candidate identity and the live
context bytes the game uses while selecting palettes.

## Live Context Bytes

Mesen CPU RAM fixtures identify the palette-selector context as:

| Meaning | CPU RAM | Notes |
| --- | ---: | --- |
| object set | `$0030` | Used by fixed-bank palette routine `7:$C7CF`. |
| area | `$0050` | Multiplied by four to choose day/night index-list pointers. |
| submap raw | `$0051` | The palette routine masks with `$7F` before indexing the submap pair. |
| actor pointer | `$003D/$003E` | Useful corroborating evidence for which actor list is live. |
| tile set pointer | `$0063/$0064` | Useful corroborating evidence for rendered background family. |

The capture script now records these values into `state.json`, and the CLI can
also extract them from existing `cpu-0000-07ff.bin` dumps:

```sh
node src/index.js inspect-runtime-context --capture out/captures/dora-woods-part-2-day
npm run inspect:runtime-contexts
```

## Fixture Evidence

The durable evidence lives in `data/runtime-context-fixtures.json`.

| Fixture | Atlas context | Runtime context | Result |
| --- | --- | --- | --- |
| Jova Woods | `2:0:0` | `2:0:0`, raw `$51=00` | Direct match. |
| Dora Woods - Part 2 | `2:8:2` | `2:0:3`, raw `$51=83` | Validated alias. |
| Dabi's Path | `2:3:0` | `2:3:0`, raw `$51=00` | Direct match. |

Dora is the important clue: the map layout candidate remains `2:8:2`, but the
palette-selector context in RAM is `$30=02`, `$50=00`, `$51=83`. Since the
routine masks `$51 & $7F`, the palette context is `2:0:3`, resolving transfer
`$23` and palette `4:$9FD7`.

## Current Renderer Rule

`src/runtime-context.js` now builds a ROM-derived resolver over the atlas
candidates. It reads each candidate's area record, screen-record pointer, and
first screen-record byte. For special screen records (`$FD`/`$FE`), it looks
for a prior same-marker special stream in the same object set.

That rule currently finds one exterior alias:

| Atlas candidate | Screen record | Alias source | Runtime selector context |
| --- | --- | --- | --- |
| Dora Woods - Part 2, `2:8:2` | `2:$A1AB`, starts `$FE $0D` | Veros Woods - Part 2, `2:0:3`, stream `2:$A1A3`, starts `$FE $06` | `2:0:3`, raw `$51=$83` |

This matches the committed Mesen fixture exactly, so fixtures are now
validation evidence rather than the primary source of the alias. If the ROM rule
does not find an alias, the renderer still falls back to the fixture-backed
alias table, and then to the direct `cv2r` context.

Use this command to inspect the current resolver report:

```sh
npm run inspect:runtime-context-map
```

## Remaining Gap

The resolver now closes the known Dora alias without location-specific logic.
The remaining research step is broader transition semantics: decode all table
paths that set `$30`, `$50`, and `$51`, especially around the fixed-bank parser
near `7:$D0B2`, so the project can explain every possible runtime context
transition and not only aliases visible in current atlas records.
