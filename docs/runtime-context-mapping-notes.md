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
| Dora Woods - Part 2 | `2:8:2` | `2:0:3`, raw `$51=83` | Superseded transition-context capture; not a palette source. |
| Dabi's Path | `2:3:0` | `2:3:0`, raw `$51=00` | Direct match. |

Dora is the important cautionary capture: the saved state records RAM as
`$30=02`, `$50=00`, `$51=83`, but that value represents a transitional live
context and should not be used to palette Dora Woods - Part 2. The direct ROM
selector context `2:8:2` resolves day transfer `$24`, auxiliary transfer `$33`,
and palette `4:$9FE8`, matching Dora Woods - Part 1 (`2:8:1`) and Dora Woods -
Part 3 (`2:9:0`).

## Current Renderer Rule

`src/runtime-context.js` now uses the direct [`cv2r`](https://github.com/tonylukasavage/cv2r)
location context for palette selection. It still exposes special screen-record
metadata for inspection, but same-marker special screen-record containment is
not treated as a palette alias. That inference incorrectly mapped Dora Woods -
Part 2 (`2:8:2`) through Veros Woods - Part 2 (`2:0:3`) and produced the wrong
Dora 2 day palette.

Fixture-backed palette aliases are also disabled per fixture with
`useForPaletteContext: false` where evidence has been superseded.

Use this command to inspect the current resolver report:

```sh
npm run inspect:runtime-context-map
```

## Remaining Gap

The remaining research step is broader transition semantics: decode all table
paths that set `$30`, `$50`, and `$51`, especially around the fixed-bank parser
near `7:$D0B2`, so the project can explain transitional contexts without using
them as final palette selectors.
