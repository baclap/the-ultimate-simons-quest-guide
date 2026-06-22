# Guide Secret Reveal Methods

This note tracks ROM-backed proof for guide secrets whose player-facing cards
need to stay simple. The guide UI should describe what a player does. The
details here explain why the guide is allowed to make that claim.

## Current UI Rule

Secret cards should show normal guide text:

- what to use;
- what appears;
- the in-game message, when one is decoded.

They should not show actor row bytes, selector records, CPU routine addresses,
or tile signature details unless a future developer/provenance mode explicitly
asks for them.

## Destructible Terrain Scan

The guide slice builder also scans every ROM-expanded background tilemap for the
destructible 2x2 tile signature:

```text
FB FD
FC FE
```

Adjacent signature hits are grouped into larger destructible fixtures. This
detects breakable terrain even when no reward actor row is attached.

Current guide-slice examples:

- Veros Woods Part 1 has a 4x2-tile breakable platform at tile rect
  `x=4,y=20,width=4,height=2`.
- Denis Woods Part 2 has a 4x2-tile breakable platform at tile rect
  `x=36,y=20,width=4,height=2`.
- Dabi's Path Part 2 has the Sacred Flame reward stack at tile rect
  `x=2,y=20,width=2,height=4` and a separate 4x2-tile breakable platform at
  tile rect `x=48,y=20,width=4,height=2`.
- Aljiba Woods Part 1 has the hidden-book reward block at tile rect
  `x=10,y=24,width=2,height=2`.

The route/platform cases are not actor-backed secrets. They are breakable
terrain proven by the same ROM-expanded background tile signature that validates
the reward blocks.

## False Platform Terrain Scan

The guide slice builder scans ROM layout metatiles for mansion floor chunks that
look like ordinary walkable platforms but classify as empty terrain. Berkeley's
false platforms use metatile `$3B`.

```text
Metatile $01, normal platform:
F6 F8 F6 F8
F7 F9 F7 F9
00 00 00 00
00 00 00 00

Metatile $3B, false platform:
D9 DB D9 DB
DA DC DA DC
00 00 00 00
00 00 00 00
```

CHR tiles `$D9/$DB/$DA/$DC` are pixel-identical to `$F6/$F8/$F7/$F9` in the
mansion CHR banks, and both metatiles use palette attribute `$00`. The guide
therefore highlights only the visible top two tile rows of each `$3B` block.
Adjacent matches are grouped into guide fixtures, share the same Secrets
visibility and Secrets Highlight controls as breakable terrain, and show a grey
guide dialog.

The current whole-Berkeley scene emits 5 grouped false-platform fixtures:

- Berkeley Mansion 1: tile rect `x=88,y=12,width=4,height=2`.
- Berkeley Mansion 2: tile rects `x=72,y=60,width=4,height=2`,
  `x=8,y=68,width=4,height=2`, `x=24,y=68,width=4,height=2`, and
  `x=32,y=68,width=4,height=2`.

ROM-backed evidence:

- Berkeley's mansion tile set starts at bank `4:$8891`; its auxiliary terrain
  threshold table at `7:$F7EC` is `E1 E9 FB`.
- The fixed-bank terrain builder at `7:$EB6E-$EB95` classifies each rendered
  tile through that threshold table before packing the terrain byte.
- The fixed-bank terrain lookup path `7:$E979-$EA10` later reads those packed
  terrain values for collision checks.
- Ordinary platform metatile `$01` uses visible tiles `$F6/$F8/$F7/$F9`, which
  classify as terrain value `2`.
- False-platform metatile `$3B` uses visible tiles `$D9/$DB/$DA/$DC`, which
  render the same pixels but classify as terrain value `0`.

Meaning:

These spots are guide-authored secret terrain annotations, but the locations are
generated from ROM layout metatile and terrain-threshold data rather than
hand-authored rectangles.

## Dabi's Path Part 2: Sacred Flame

Player-facing claim:

> Throw Holy Water at the marked stacked blocks, or equip Dracula's Nail and
> whip them, to reveal the Sacred Flame.

ROM-backed evidence:

- Actor row `0x066B0` is `01 0C 26 76`.
- Actor id `0x26` is the Sacred Flame fixture. It dispatches through bank
  `1:$8335`.
- Routine `1:$8335` passes selector-record index `$20` to the fixed-bank sprite
  setup path at `$DED8`; selector record `$20` expands to reward metasprite
  selectors `$78/$79`.
- Text pointer index `$76` decodes to the Sacred Flame pickup message.
- Holy Water is weapon index `4`. The fixed-bank menu selection path
  `7:$F237-$F2D2` selects `$4A` bit `$08`, and the fixed-bank weapon-use path
  `7:$D8C0` spawns projectile actor `$33` for that selected weapon.
- Dracula's Nail is inventory index `4`. The fixed-bank inventory selection path
  `7:$F275` maps `$91` bit `$08` to selected item `$04`, and the fixed-bank
  block-hit path `7:$D623` checks `$4F == 04` before calling the tile collision
  routine at `7:$D3AC`.

Meaning:

Holy Water reveals the flame through the weapon/projectile interaction. Dracula's
Nail reveals it by letting Simon break the blocks with the whip while the Nail
is equipped.

## Aljiba Woods Part 1: Hidden Clue Book

Player-facing claim:

> Throw Holy Water at the marked block, or equip Dracula's Eyeball, to reveal
> the hidden clue book.

ROM-backed evidence:

- Actor row `0x066D5` is `05 0D 27 0D`.
- Actor id `0x27` is the hidden book fixture. It dispatches through bank
  `1:$8335`.
- Routine `1:$8335` passes selector-record index `$3B` to the fixed-bank sprite
  setup path at `$DED8`; selector record `$3B` expands to reward metasprite
  selector `$30`.
- Text pointer index `$0D` decodes to the blue-crystal lake clue.
- Holy Water follows the same weapon/projectile path described above:
  `7:$F237-$F2D2` selects `$4A` bit `$08`, and `7:$D8C0` spawns projectile
  actor `$33`.
- Dracula's Eyeball is inventory index `3`. The fixed-bank inventory selection
  path `7:$F275` maps `$91` bit `$04` to selected item `$03`, and actor routine
  `1:$8335` clears the hidden flag when `$4F == 03`.

Meaning:

Holy Water exposes the book by opening the marked block. Dracula's Eyeball
reveals the hidden book directly as a visibility effect.

## Berkeley Mansion Part 1: Hidden Moving Platform

Player-facing claim:

> Visible with White Crystal or better.

ROM-backed evidence:

- Raw ROM row `0x05AD8` is `05 28 22 A4`. This row is not promoted as a
  normal actor; the guide promotes it through `secretFeatures`.
- Actor id `$22` dispatches to bank `1:$854B`. The `$22` path writes metasprite
  selector `$43`.
- Selector `$43` decodes to four large sprites using tiles `$F6/$F8`, matching
  the platform seen in the Berkeley opening room trace.
- Row data `$A4` supplies low-nibble motion index `$4`, which selects the
  vertical motion setup at `1:$8589` and runtime branch at `1:$85FE`.
- Runtime trace `out/actor-traces/berkeley-mansion-interior-day-idle` observes
  active actor `$22`, selector `$43`, screen X `$50`, and screen Y oscillating
  from `$70` to `$C0` at `0.5` px/frame with a `$A0`-frame reversal cadence.
- Matching `out/captures/berkeley-mansion-interior-day/background.png` against
  the ROM-rendered atlas
  `out/render-recipe-atlas/images/obj01-area07-sub00-berkeley-mansion-part-1-fixed.png`
  places the captured opening-room viewport at atlas `x=0,y=435`. The guide
  therefore anchors the moving platform path at world X `$50` and world Y
  `435 + $C0 = 627`, with the top of travel at `435 + $70 = 547`.
- The runtime branch at `1:$85FE` checks selected item RAM `$004F == $06`.
  The fixed-bank inventory selection path at `7:$F275` maps crystal ownership
  bits `$0091 & $60` into selectable item slot `$06`, so any crystal tier can
  satisfy the selected-crystal condition.

Meaning:

In the game, the platform behavior is gated by having a crystal selected; White,
Blue, or Red Crystal all qualify through the same selected item slot. The guide
does not simulate equipped inventory, so the platform is shown whenever the
Secrets layer is visible and its card uses the simpler player-facing wording.
