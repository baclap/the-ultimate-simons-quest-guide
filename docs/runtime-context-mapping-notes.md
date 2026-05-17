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

`src/exterior-atlas.js` now consumes fixture-backed aliases from
`data/runtime-context-fixtures.json`. This moves the Dora behavior out of an
inline hardcoded palette exception and into committed evidence. The renderer
still only aliases contexts when a fixture proves that the atlas context and
runtime context differ.

## Remaining Gap

The next research step is to decode the transition tables that set `$30`,
`$50`, and `$51`, then map static `cv2r` atlas candidates to live runtime
contexts without needing a fixture for every location. The likely source is the
fixed-bank transition parser around `7:$D0B0`, which writes `$30/$50/$51` from
table bytes containing control markers such as `$FA`, `$FB`, `$FC`, and `$FF`.
