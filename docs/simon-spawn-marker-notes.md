# Simon Spawn Marker Notes

The guide renders one Simon Belmont marker per whole map view. This marker is
guide UI backed by ROM/runtime evidence, not a ROM actor row.

## Sprite Source

Simon standing still is rendered from metasprite selector `$04`. Decoding that
selector yields the four 8x16 sprite tiles `$03`, `$05`, `$07`, and `$09`.
Selectors `$01`, `$02`, and `$03` decode to the neighboring player walking
frames, and player-slot trace evidence observes those selector writes during
movement. The guide uses one `simon-belmont` actor class built from selectors
`$04/$01/$02/$03` and CHR banks `$00/$01`.

For left-facing interior spawns, the runtime mirrors the selector horizontally
around the same anchor. This matches the OAM captures where the same tiles carry
the horizontal-flip bit.

## Coordinate Source

Selector `$04` has visible offsets `x=-8/0` and `y=-15/1` from its anchor. The
PPU renderer draws sprite Y at raw OAM Y + 1, so the screen-space anchor is
derived from rendered sprite pixels, not raw OAM bytes alone. The spawn
coordinates in generated guide manifests are the guide-map selector anchor, not
the top-left sprite corner.

| Map view | Guide segment | Anchor | Evidence |
| --- | --- | ---: | --- |
| Overworld | `town-of-jova` | `(128, 177)` | ROM-generated start-flow capture `out/captures/jova-day` shows Simon at raw OAM `x=120/128`, `y=128/144`; selector `$04` renders a screen anchor of `(128,144)`. The ROM-derived guide background matches that capture at `guideY = captureY + 33`. |
| Town interiors | room entry segment | `(16, 177)` | Transition probes in `out/transition-probes/analysis.json` show town interior entry OAM `x=8/16`, `y=174/190`; selector `$04` renders a screen anchor of `(16,190)`. The ROM-derived guide background matches the town-interior capture at `guideY = captureY - 13`. |
| Berkeley Mansion | `berkeley-mansion-part-1` | `(16, 625)` | The mansion entry routine reads `$F7A6 + (area - $06)`; Berkeley area `$07` resolves to scroll byte `$02`. The rendered entry screen anchor is `(16,190)`, and the ROM-derived guide background matches the Berkeley capture at `guideY = captureY + 435`. |

The Veros dagger room is a two-submap interior. Its Simon marker is placed in
the first entry submap because the town-interior entry routine zeroes the
interior camera state before jumping to the entry handler.

## UI Behavior

Simon is exposed through the normal character visibility and highlight controls.
Clicking or tapping him opens a grey guide-authored dialog:

```text
Simon Belmont
----------
On a quest to uncover Count Dracula's five missing body parts.
```

No blue game-dialog surface is used because this is not decoded in-game NPC
dialog text. The description is sourced from the Nintendo-hosted *Castlevania
II: Simon's Quest* instruction manual, whose Basic Play section says Simon is
on a quest to uncover Count Dracula's five missing body parts.
