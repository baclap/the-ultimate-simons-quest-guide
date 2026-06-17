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
