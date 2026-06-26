# Mobile Control Demo Collision

This note records the terrain collision evidence used by
`tools/mobile-control-demo`.

## Terrain Class Source

Berkeley Mansion uses the mansion terrain threshold bytes `E1 E9 FB` from
`7:$F7EC`. The fixed-bank terrain builder at `7:$EB6E-$EB95` classifies each
rendered background tile with those thresholds, and the fixed-bank lookup path
at `7:$E979-$EA10` reads the packed two-bit terrain class.

The demo uses the same threshold classification:

- tile index `< $E1`: terrain `0`
- tile index `< $E9`: terrain `3`
- tile index `< $FB`: terrain `2`
- tile index `>= $FB`: terrain `1`

Player body collision treats terrain classes `0` and `3` as passable, matching
the player movement branches that continue after `BEQ` or `CMP #$03`.
Classes `1` and `2` block Simon's body.

## ROM Probe Wrapper

Fixed-bank routine `7:$D3AC` is the player terrain probe wrapper:

```text
D3AC  CLC
D3AD  ADC $0348
D3B0  STA $02
D3B2  LDA #$00
D3B4  STA $03
D3B6  TYA
D3B7  CLC
D3B8  ADC $0324
D3BB  STA $00
D3BD  JMP $E979
```

`A` is an X offset from Simon's `$0348` anchor. `Y` is a Y offset from Simon's
`$0324` anchor. The terrain lookup at `7:$E9A0-$E9A7` subtracts `$0D` from the
probe Y before converting to the packed terrain row, so the demo applies the
same 13-pixel Y bias when sampling the ROM-expanded guide tilemap.

## Horizontal Collision

Bank 3 player movement around `3:$8399-$83E4` selects the horizontal side probe:

- moving right probes X offset `$08`
- moving left probes X offset `$F8` (`-8`)

For ordinary walking state `$03D8 = $01`, the pointer table at `3:$849F` selects
the Y-offset list at `3:$84A6`:

```text
08 F0 00 FF
```

Those are tested as signed bytes, so the body side probes are `+8`, `-16`, and
`0` relative to Simon's anchor before the terrain lookup's additional `$0D`
Y-bias.

For airborne jump/fall state, the code selects the shorter list at `3:$84A7`:

```text
F0 00 FF
```

The demo resolves horizontal movement by testing the candidate anchor with these
ROM side probes before updating Simon's X coordinate. For airborne diagonal
movement, the candidate X is tested across every integer Y crossed by that same
fixed frame before being accepted. This keeps a rising directional jump from
tunneling through a wall corner when the pre-vertical Y probe is still clear but
the post-vertical Y probe intersects terrain.

The decoded jump selector `$05` spans from `anchorX - 8` through the right edge
at `anchorX + 8`, and from `anchorY - 12` to `anchorY + 19` when rendered with
the guide actor class's 8x16 sprites. The demo now rejects airborne side motion
when that rendered side edge would enter solid terrain at any pixel row in that
visible jump height. This closes the visible corner-overlap gap left by the two
ROM side probe points. Lower/mid body hits still block movement.

For the composed Berkeley control map, a grounded hit from only the `$F0` upper
side probe is not treated as a wall. The live Rib-room left-walk trace
`out/physics-traces/berkeley-orb-left-debug2/` shows Simon leaving the room by
changing vertical state before continuing left, while the demo's current support
surface extractor keeps him grounded through the lower doorway. Ignoring this
top-only lintel hit preserves lower/mid wall blocking without turning the
Rib-room entryway into an artificial wall.

## Upward Collision

Bank 3 vertical movement around `3:$8ABB-$8AD5` tests upward motion with
`7:$D3AC` at these Y offsets:

```text
12
0A
```

The demo now checks those upward probes while Simon is rising. If the next
anchor position would enter terrain class `1` or `2`, Simon's upward motion is
clipped before entering the block and his vertical state switches back to fall.

The control demo also applies a rendered-head guard while rising: the decoded
jump selector `$05` has its top sprite row at anchor Y `-12`, so the demo checks
the left/right head pixels at that rendered top before accepting the next
ascending anchor. This prevents the browser-rendered Simon sprite from visibly
entering ceiling blocks before the ROM torso probes hit. This guard is a
presentation correction for the control demo's rendered collision envelope; it
does not replace the ROM probe evidence above. The side-edge guard described in
the horizontal collision section is the same kind of rendered-envelope
correction for airborne corner contact.

## Remaining Boundary

The demo's floor/platform landing still uses surfaces extracted from the
ROM-expanded Berkeley terrain layer because that part was already aligned with
the visible platforms in most of the control room. The Rib-room lower doorway is
the known exception: the current support surface bridges a spot where the live
ROM trace changes Simon's vertical state. Horizontal wall collision and upward
block collision use ROM-derived terrain classes and ROM-derived player probe
offsets, with the top-only grounded-lintel compensation and rendered-head guard
above. A future full collision port should replace the landing surface extractor
with a direct port of the remaining vertical resolver around `3:$8A8C-$8AB8`,
then re-evaluate whether the rendered-head guard is still necessary.
