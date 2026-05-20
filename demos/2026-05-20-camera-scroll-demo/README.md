# Camera Scroll Evidence Demo

This demo presents the second transition-probe milestone.

It is generated from:

- `out/transition-probes/analysis.json`
- `out/transition-probes/analysis-data.js`

The demo separates three evidence tracks:

- Simon screen X: still resolved at low RAM `$0348` across the scoped probes.
- Camera scroll low bytes: `$00FC` matches scroll Y low for the Jova Woods
  outdoor round trip; `$00FD` and `$0053` match scroll X low for the Doina
  church round trip.
- Simon destination Y: explicitly unresolved because all current transitions
  land Simon at the same visible Y center.

The next useful fixture is a safe vertical-varying transition, ideally with a
return step, so the same analyzer can prove or reject destination-Y candidates.
