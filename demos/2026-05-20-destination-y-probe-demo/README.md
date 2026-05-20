# Destination and Camera Probe Demo

This demo presents the third transition-probe milestone.

It is generated from:

- `out/transition-probes/analysis.json`
- `out/transition-probes/analysis-data.js`

The demo adds two transition fixtures to the earlier Jova Woods and Doina
church round trips:

- Castlevania entrance walking left to Castlevania Bridge
- Dora Woods - Part 3 walking left to Dora Woods - Part 2

The evidence separates three outputs:

- Simon screen X: `$0348` is high-confidence across all six scoped transitions.
- Simon destination Y: `$0073` is the lead diagnostic transition-routine clue,
  but only Castlevania currently changes Simon's visible Y.
- Camera state: Dora Woods - Part 3 changes the vertical camera/nametable plane
  while Simon keeps the same visible Y, proving player placement and camera
  placement need separate decoding.

The next milestone is to decode the transition-routine bytes behind `$70-$73`
and tie them back to ROM transition data before promoting more placement rules.
