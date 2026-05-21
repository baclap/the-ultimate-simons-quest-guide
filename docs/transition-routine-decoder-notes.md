# Transition Routine Decoder Notes

This milestone turns the transition probe output into a durable decoder artifact
for the fixed-bank routine evidence around `$70-$73`. It is still an evidence
model, not a final placement formula.

## Command

```sh
npm run decode:transition-routine
```

Equivalent direct command:

```sh
node src/index.js decode-transition-routine --rom roms/cv2.nes --probes out/transition-probes/analysis.json --topology out/exterior-topology/topology.json --out out/transition-routine
```

This writes:

- `out/transition-routine/decoder.json`
- `out/transition-routine/decoder-data.js`

## Current Findings

The decoder summarizes 6 probes and 10 completed transitions from
`out/transition-probes/analysis.json`.

It records four observed write PCs for `$70-$73`:

| Address | Write PC |
| --- | --- |
| `$0070` | `7:$D19E` |
| `$0071` | `7:$D1A3` |
| `$0072` | `7:$D1A8` |
| `$0073` | `7:$D1AD` |

Those PCs are kept as trace evidence. The decoder also includes ROM byte
windows around each PC so the next pass can align the trace callback to the
actual instruction stream instead of assuming the PC is already perfectly
decoded.

The decoder preserves:

- before/after `$70-$73` values
- raw write metadata from `ram-writes.tsv`, including A/X/Y, PRG register,
  frame, step frame, and runtime context
- matched topology edge and ROM transition bytes when available
- Simon X/Y and sprite-top evidence
- PPU scroll/camera changes

## Promoted And Diagnostic Evidence

Promoted:

- `$0348` remains Simon screen-center X evidence from the transition probe
  analysis.
- `$70-$73` are promoted only as transition-routine output bytes.

Diagnostic:

- No direct `$70-$73` visible-Y formula is promoted. `$0073` matches
  Castlevania-to-Bridge sprite top, but it does not explain Deborah or Jova
  interior placement by itself.
- No direct `$70-$73` camera/scroll formula is promoted.
- Deborah Cliff remains a special transport diagnostic because each byte is
  written twice before settling at Bodley Mansion - Door.

## Why This Matters

The world composer can now consume a structured transition evidence file rather
than scraping demo-specific probe output. That lets composition distinguish:

- routine-observed edges
- topology-only edges
- connector-only transport candidates
- unresolved placement or camera behavior

The next milestone should use this artifact to assemble the full exterior graph
without per-area hand placement.
