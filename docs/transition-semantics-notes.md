# Transition Semantics Notes

The topology pass now records a semantic layer for edges. The goal is to avoid
treating every edge as ordinary left/right world adjacency just because the ROM
transition table names a target area.

## Why This Exists

The Jova-to-Castlevania composition exposed one suspicious row shift around
Deborah Cliff. In gameplay, Deborah Cliff is not just a normal walkable edge:
with the red crystal equipped, Simon crouches, waits, and is carried by a
tornado to a mansion door. The ROM transition table names the endpoint, but that
does not give us final coordinates for the transport event.

## Current Classes

| Class | Placement mode | Source |
| --- | --- | --- |
| `same-area-submap-sequence` | `ordinary-adjacency` | [`cv2r`](https://github.com/tonylukasavage/cv2r) submap order. |
| `object-set-boundary` | `ordinary-adjacency` | ROM transition marker `$FF`. |
| `object-set-load-boundary` | `ordinary-adjacency` | ROM transition marker `$FC`. |
| `same-object-set-boundary` | `ordinary-adjacency` | ROM transition marker other than known control markers. |
| `same-object-set-load-boundary` | `ordinary-adjacency` | ROM transition marker `$FA`. |
| `explicit-submap-boundary` | `ordinary-adjacency` | ROM transition marker `$FB`. |
| `special-transport-candidate` | `connector-only` | ROM endpoint plus [`cv2r`](https://github.com/tonylukasavage/cv2r) tornado location metadata. |
| `unresolved-target` | `unresolved` | ROM endpoint is not currently in the exterior atlas. |

## Deborah Cliff

The edge
`boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left` now has:

- transition bytes: `$FF $01 $04`
- ROM target: object set `$01`, area `$04`
- source label: Deborah Cliff (In Tornado)
- target label: Bodley Mansion - Door
- transition class: `special-transport-candidate`
- placement mode: `connector-only`

This is deliberately conservative. The endpoint is ROM-derived. The
connector-only interpretation is based on reverse-engineered metadata and known
gameplay behavior, so it is marked as a candidate rather than final coordinate
truth.

## Next Research Target

The next decoder should inspect the route transition/runtime routine that
writes map context and Simon destination state. We specifically need the data
that distinguishes:

- ordinary boundary walking
- area-load boundary changes
- connector or transport events
- vertical and entrance-position offsets

Until that data is decoded, connector-only edges should stay visibly marked in
composition output instead of being converted into hand-placed map coordinates.
