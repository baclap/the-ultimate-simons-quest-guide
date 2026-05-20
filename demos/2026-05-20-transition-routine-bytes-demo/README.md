# Transition Routine Bytes Demo

This demo summarizes the 2026-05-20 transition-routine byte milestone.

It uses the full `out/transition-probes/analysis.json` output from
`npm run probe:transitions`, copied into
`assets/transition-probes/analysis.json` and
`assets/transition-probes/analysis-data.js`.

The demo is evidence-first:

- 6 scripted probes
- 10 completed transition steps
- per-step `$70-$73` before/after values
- last transition-routine write PCs
- topology matches when decoded exterior ROM edges are available
- diagnostic status for Deborah Cliff's special transport behavior

No renderer placement rule is promoted by this demo. The next milestone is to
decode how the ROM transition routine turns transition table data into those
runtime bytes, Simon placement, and camera state.
