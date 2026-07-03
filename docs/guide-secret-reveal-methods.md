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

The guide slice builder scans ROM layout metatiles for mansion chunks that look
like ordinary solid terrain but classify as empty terrain. Floor-shaped false
platforms use metatile `$3B`; wall-shaped false passages use metatile `$32`.

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

Metatile $40, normal solid wall:
F6 F8 F6 F8
F7 F9 F7 F9
F6 F8 F6 F8
F7 F9 F7 F9

Metatile $32, false wall:
D9 DB 00 00
DA DC 00 00
D9 DB 00 00
DA DC 00 00

Metatile $33, false wall:
00 00 D9 DB
00 00 DA DC
00 00 D9 DB
00 00 DA DC
```

CHR tiles `$D9/$DB/$DA/$DC` are pixel-identical to `$F6/$F8/$F7/$F9` in the
mansion CHR banks, and both metatiles use palette attribute `$00`. The guide
therefore highlights only the visible top two tile rows of each `$3B` block and
the visible two-tile wall half of each `$32` or `$33` block. `$32` carries the
left wall half; `$33` carries the right wall half. Adjacent matches are grouped
into guide fixtures, share the same Secrets visibility and Secrets Highlight
controls as breakable terrain, and show a grey guide dialog.

The current whole-Berkeley scene emits 6 grouped false-terrain fixtures:

- Berkeley Mansion 1: tile rect `x=88,y=12,width=4,height=2`.
- Berkeley Mansion 2: tile rects `x=72,y=60,width=4,height=2`,
  `x=8,y=68,width=4,height=2`, `x=24,y=68,width=4,height=2`, and
  `x=32,y=68,width=4,height=2`.
- Berkeley Mansion 2 false wall: tile rect `x=96,y=68,width=2,height=4`.

The current whole-Lauber scene emits 5 grouped false-terrain fixtures:

- Lauber Mansion 1 false walls: tile rects `x=82,y=36,width=2,height=4`
  and `x=80,y=72,width=2,height=8`.
- Lauber Mansion 2 false platforms: tile rects
  `x=100,y=68,width=4,height=2`, `x=108,y=68,width=4,height=2`, and
  `x=116,y=68,width=4,height=2`.

The current whole-Brahm scene emits 2 grouped false-terrain fixtures:

- Brahm Mansion 1 false wall: tile rect `x=18,y=20,width=2,height=4`.
- Brahm Mansion 1 false platform: tile rect `x=16,y=96,width=4,height=2`.

The current whole-Bodley scene emits 7 grouped false-terrain fixtures:

- Bodley Mansion 1 false platforms: tile rects `x=44,y=36,width=4,height=2`
  and `x=36,y=52,width=4,height=2`.
- Bodley Mansion 1 false walls: tile rects `x=126,y=4,width=2,height=4`
  and `x=62,y=72,width=4,height=4`. The wider lower passage is a grouped
  `$33 + $32` pair.
- Bodley Mansion 2 false walls: tile rects `x=0,y=4,width=2,height=4` and
  `x=96,y=72,width=2,height=4`.
- Bodley Mansion 2 false platform: tile rect `x=36,y=84,width=8,height=2`.

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
- Ordinary solid-wall metatile `$40` uses visible tiles `$F6/$F8/$F7/$F9`,
  which classify as terrain value `2`.
- False-wall metatile `$32` uses visible tiles `$D9/$DB/$DA/$DC`, which render
  the same pixels in the visible half but classify as terrain value `0`.
- False-wall metatile `$33` is the right-half companion to `$32`; it also uses
  `$D9/$DB/$DA/$DC` pixels and classifies as terrain value `0`.

Meaning:

These spots are guide-authored secret terrain annotations, but the locations are
generated from ROM layout metatile and terrain-threshold data rather than
hand-authored rectangles.

## Dabi's Path Part 2: Sacred Flame

Player-facing claim:

> Dracula's Eyeball lets Simon see this hidden item before uncovering it.

The linked breakable-block hotspot separately carries the block-opening path:
Holy Water breaks the stacked blocks, and Dracula's Nail lets Simon whip them.

ROM-backed evidence:

- Actor row `0x066B0` is `01 0C 26 76`.
- Actor id `0x26` is the Sacred Flame fixture. It dispatches through bank
  `1:$8335`.
- Routine `1:$8335` selects the sprite record by actor id: actor `$27` uses
  selector-record `$3B`, while every other actor through this routine, including
  Sacred Flame actor `$26`, uses selector-record `$20`.
- Selector-record `$20` expands to reward metasprite selectors `$78/$79`.
- The same `1:$8335` update path clears hidden flag bit `$08` from actor flags
  `$03C6,x`, checks selected item RAM `$004F`, and only re-sets that hidden flag
  when `$004F != $03`. The fixed-bank inventory selection path maps Dracula's
  Eyeball to selected item `$03`, so Dracula's Eyeball reveals actor `$26`.
- Text pointer index `$76` decodes to the Sacred Flame pickup message.
- Holy Water is weapon index `4`. The fixed-bank menu selection path
  `7:$F237-$F2D2` selects `$4A` bit `$08`, and the fixed-bank weapon-use path
  `7:$D8C0` spawns projectile actor `$33` for that selected weapon.
- Dracula's Nail is inventory index `4`. The fixed-bank inventory selection path
  `7:$F275` maps `$91` bit `$08` to selected item `$04`, and the fixed-bank
  block-hit path `7:$D623` checks `$4F == 04` before calling the tile collision
  routine at `7:$D3AC`.

Meaning:

Sacred Flame has two ROM-backed visibility paths. The stacked-block path makes it
visible when the terrain is opened by Holy Water or by a Dracula's Nail whip hit.
Independently, Dracula's Eyeball makes the actor visible before the blocks are
opened by clearing the same hidden-flag bit used by hidden clue books. The
actor-id check in `1:$8335` changes only the metasprite selector (`$20` for
Sacred Flame, `$3B` for clue books); it does not limit the Eyeball branch to
`$27`.

Relevant `1:$8335` disassembly from PRG bank 1:

```asm
8335  BD D8 03  LDA $03D8,X
8338  D0 1A     BNE $8354
833A  A9 04     LDA #$04
833C  9D D8 03  STA $03D8,X
833F  A9 08     LDA #$08
8341  9D C6 03  STA $03C6,X
8344  BD B4 03  LDA $03B4,X
8347  C9 27     CMP #$27
8349  F0 04     BEQ $834F
834B  A9 20     LDA #$20
834D  D0 02     BNE $8351
834F  A9 3B     LDA #$3B
8351  4C D8 DE  JMP $DED8
8354  BD 44 04  LDA $0444,X
8357  D0 10     BNE $8369
8359  BD C6 03  LDA $03C6,X
835C  29 F7     AND #$F7
835E  A4 4F     LDY $4F
8360  C0 03     CPY #$03
8362  F0 02     BEQ $8366
8364  09 08     ORA #$08
8366  9D C6 03  STA $03C6,X
8369  4C 2A DD  JMP $DD2A
```

## Hidden Clue Books

Player-facing claim:

> Dracula's Eyeball lets Simon see this hidden item before uncovering it.

When a book's reveal anchor also has a linked destructible group, the linked
breakable-block hotspot separately carries the Holy Water/Nail block-opening
path.

ROM-backed evidence:

- Actor row `0x066D5` is `05 0D 27 0D`.
- Whole-ROM manifest audit finds 13 actor id `0x27` rows. They all dispatch
  through bank `1:$8335`; there is no separate visible-book actor.
- Routine `1:$8335` passes selector-record index `$3B` to the fixed-bank sprite
  setup path at `$DED8`; selector record `$3B` expands to reward metasprite
  selector `$30`.
- The fourth row byte selects the ROM clue text pointer. It is not a
  visible-vs-hidden mode.
- Text pointer index `$0D` for the Aljiba Woods row decodes to the blue-crystal
  lake clue.
- During guide generation, each promoted `$27` hidden clue-book actor is checked
  against grouped destructible `FB FD / FC FE` background signatures in its
  ROM-expanded segment tilemap. If the book's reveal anchor lands inside exactly
  one destructible group, the generated actor record carries that group as its
  `targetTileRects` link and the destructible fixture is promoted to
  `role=secret-reward`.
- Holy Water follows the same weapon/projectile path described above:
  `7:$F237-$F2D2` selects `$4A` bit `$08`, and `7:$D8C0` spawns projectile
  actor `$33`.
- Dracula's Eyeball is inventory index `3`. The fixed-bank inventory selection
  path `7:$F275` maps `$91` bit `$04` to selected item `$03`, and actor routine
  `1:$8335` clears the hidden flag when `$4F == 03`.

Meaning:

Actor `$27` is the ROM's hidden clue-book actor. Dracula's Eyeball makes these
books visible before their blocks are broken. The same ROM-expanded destructible
terrain scan links books to their breakable-block reveal path when the block
group is present at the reveal anchor, but the grey book dialog keeps only the
non-redundant Eyeball visibility claim.

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

## Yuba Lake Path: Moving Platforms

ROM-backed evidence:

- Raw ROM row `0x06765` is `29 0D 22 45`.
- Raw ROM row `0x0676D` is `37 0D 22 46`.
- Actor id `$22` dispatches to bank `1:$854B` and writes metasprite selector
  `$43`, the same one-screen platform selector proven for the Berkeley hidden
  platform.
- Selector `$43` decodes to four large sprites using tiles `$F6/$F8`.
- Row data low nibble `$5` selects setup branch `1:$859A`, which stores
  positive X velocity and zero Y velocity. The row anchor is the left endpoint.
- Row data low nibble `$6` selects setup branch `1:$859E`, which stores
  negative X velocity and zero Y velocity. The row anchor is the right endpoint.
- Both rows use high nibble `$40`; runtime branch `1:$8616` reloads that value
  into the reversal timer, so each platform travels 64 pixels horizontally
  before reversing.
- The rendered guide placement applies the `$22` platform-family visible anchor
  convention proven by the Berkeley runtime trace: raw row X is the visible
  anchor X and visible Y is row Y minus 13 pixels.

Meaning:

The two Yuba Lake Path platforms are visible moving platforms, not secrets.
They render regardless of the guide Secrets layer and use ROM-defined
horizontal ping-pong paths. The left platform starts from its row anchor moving
right; the right platform starts from its row anchor moving left.

## Outdoor `$20` Vertical Moving Platforms

ROM-backed evidence:

- Vrad Mountain Part 1 has eight raw actor/control rows:
  `0x06874 = 13 0D 34 20`, `0x06878 = 17 0D 34 20`,
  `0x0687C = 1B 0D 34 20`, `0x06880 = 1F 0D 34 20`,
  `0x06884 = 21 0D 34 20`, `0x06888 = 25 0D 34 20`,
  `0x0688C = 29 0D 34 20`, and `0x06890 = 2D 0D 34 20`.
- Jam Wasteland has three raw actor/control rows:
  `0x06899 = 14 0D 34 20`, `0x0689D = 18 0D 34 20`, and
  `0x068A1 = 1C 0D 34 20`.
- Joma Marsh Part 3 has four raw actor/control rows:
  `0x0726C = 24 0C 34 20`, `0x07270 = 27 0C 34 20`,
  `0x07274 = 2A 0C 34 20`, and `0x07278 = 2D 0C 34 20`.
- Debious Woods Part 3 has four raw actor/control rows:
  `0x072BD = 21 28 22 20`, `0x072C9 = 25 28 22 20`,
  `0x072D5 = 29 28 22 20`, and `0x072D9 = 2D 28 22 20`.
- North Bridge has two raw actor/control rows omitted from the vendor enemy list:
  `0x060F0 = 18 0B 22 41` and `0x060FC = 28 0B 22 41`.
- Actor ids `$22` and `$34` dispatch to the shared moving-platform routine at
  bank `1:$854B`.
- The routine writes metasprite selector `$43` for actor id `$22`, while actor
  id `$34` is special-cased to direct metasprite selector `$1B`.
- Selector `$43` decodes to the larger `$22` platform metasprite. Selector
  `$1B` decodes to the 16x16 two-sprite platform using tiles `$F6/$F8`.
- Row data `$20` supplies low-nibble motion index `$0`, selecting setup branch
  `1:$8589`, and high nibble `$20`, reloaded by runtime branch `1:$85BB`.
  North Bridge row data `$41` supplies low-nibble motion index `$1`, which uses
  the same setup and runtime branches, and high nibble `$40`.
- Setup branch `1:$8589` stores a 0.5 px/frame vertical velocity through
  fixed-bank `$E076`; runtime branch `1:$85BB` reloads timer RAM `$0456` from
  the row-data high nibble and calls fixed-bank `$E03B` at reversal. `$20`
  timer frames therefore produce a 16-pixel travel from the row anchor before
  reversal; `$40` timer frames produce a 32-pixel travel.
- Runtime branch `1:$85BB` does not move the actor on the same frame where it
  reloads `$0456` and reverses vertical velocity. The visible motion therefore
  holds one frame at each endpoint: `$20` rows use 32 movement frames
  upward/downward plus two reversal frames, for a 66-frame effective cycle;
  `$40` rows use 64 movement frames upward/downward plus two reversal frames,
  for a 130-frame effective cycle.
- These rows do not carry an explicit per-platform phase byte. Their relative
  phase comes from the live actor loader at `1:$8055-$8188`, which materializes
  actor rows only after their row X position enters the live screen window.
  Under normal rightward scrolling, the camera advances one pixel per frame once
  Simon is held near the screen center; existing walking traces show the coarse
  PPU scroll cell advancing one tile every eight frames. Because the effective
  platform cycle is 66 frames, four-cell spacing is a 64-frame load delta and
  does not quite preserve phase:
  - Vrad Mountain Part 1 rows `$13/$17/$1B/$1F` use renderer phases
    `0,2,4,6`; rows `$21/$25/$29/$2D`, loaded 224/288/352/416 frames after
    `$13`, use phases `40,42,44,46`.
  - Jam Wasteland rows use renderer phases `0,2,4`.
  - Joma Marsh Part 3 rows are three cells apart, so later platforms load 48
    frames after the previous one and use renderer phases `0,18,36,54`.
  - Debious Woods Part 3 rows are four cells apart, so their 64-frame load
    deltas against the 66-frame cycle use renderer phases `0,2,4,6` rather than
    moving in unison.
  - North Bridge rows are sixteen cells apart, so the second row loads 256
    frames after the first. Against the `$41` row's 130-frame effective cycle,
    the renderer phases are `0,4`.
- The rendered guide placement applies the moving-platform visible anchor
  convention already proven by the Berkeley trace: raw row X is the visible
  anchor X and visible Y is row Y minus 13 pixels.
- CHR/palette context remains section-specific: Vrad/Jam use object-set `$04`
  CHR `$06/$07`, Joma/Debious use object-set `$03` CHR `$04/$05`, and each row
  uses the sprite palette resolved for its map section. North Bridge uses object
  set `$02` CHR `$02/$03` and its own day/night sprite palettes.
- Actor id `$43` rows with data `$00` in Dora Woods and Bordia Mountains are not
  platforms. Existing selector-stream evidence classifies `$43` as a
  transparent sprite-mask/rendering-control row that parks blank tile `$FF`
  sprites to consume scanline sprite slots, so those rows are intentionally not
  promoted as guide features.

Meaning:

These twenty-one rows are visible outdoor moving platforms, not hidden secrets or
clickable guide facts. They render regardless of the guide Secrets layer and
use ROM-defined vertical ping-pong paths.

## Dead River: Ferry Route To Brahm

Player-facing claim:

> Board the Dead River ferry with Dracula's Heart selected to reach Brahm's
> Mansion.

ROM-backed evidence:

- The ferry interaction branch at `$C6EE-$C70C` special-cases live ferry actor
  `$3C`. It starts with `Y = $00`, then checks selected item RAM
  `$004F == $02`, area RAM `$50 == $07`, and submap RAM `$51 & $01 != 0`.
- If the checks fail, it stores text pointer `$0B` in `$7F` and writes `$00`
  to RAM `$04EC`.
- If the checks pass, it stores text pointer `$0C` in `$7F` and writes `$01`
  to RAM `$04EC`. Pointer `$0C` decodes to `let me show you the way.`
- The fixed-bank ferry handler scans the live object list for ferry actors
  `$3C/$3D`, consumes `$04EC`, clears it, and writes area RAM `$50 = $06`.
- The exterior topology manifest identifies area `obj02-area06-sub00` as
  `Dead River to Brahm`, with its left boundary leading to
  `Brahm's Mansion - Door`.
- The ferry actor row used for the guide hotspot is `0x060A6`:
  `0E 0C BC 00` in `Dead River - Part 1`. Row id `$BC` resolves to live ferry
  actor `$3C`.
- The ferry actor render is a two-actor composite. Routine `1:$A431` initializes
  live actor `$3C` with selector `$7F`, copies the row data to `$0420,x`, and
  subtracts 6 pixels from Y RAM `$0324,x`. Its state-0 branch spawns companion
  live actor `$3D`, whose dispatch target `1:$A4DC` initializes selector `$80`.
  Row data `$00` places `$3D` at `X + $14, Y + $10`; nonzero row data places it
  at `X - $14, Y + $10`. The guide keeps the raw row X anchor for this special
  composite instead of the normal character `+8` X anchor.
- When row data is nonzero, selector `$80` is mirrored locally before it is
  placed on the left side. Without that mirror, the boat end-cap tiles touch in
  the middle of the composite instead of putting the boat middle tiles together.
  The left-side ferry variant also mirrors selector `$7F` so the ferryman and
  the boat half beneath him face the correct direction.
- The ordinary ferry-man dialog is ROM text pointer index `$0B`, not the actor
  row data byte: `sure, i'll take you to a good place. heh! heh! heh!`
  Dead River Part 1 can instead show `$0C` when the Dracula's Heart condition
  above passes. Dead River Part 2 and the Brahm-route ferry use `$0B` because
  the area/submap checks do not both pass there.
- The fixed-bank inventory selection path maps Dracula's Heart to selected item
  `$02`. Red Crystal uses the shared crystal selected-item slot, not `$02`.

Meaning:

The in-game Jova rumor about the ferryman loving garlic is preserved as game
dialog, but it is not the ROM condition for this route. The guide marks the
alternate Brahm river path as a Secret and shows the lower Dead River/Brahm
branch only when the Secrets layer is visible. The same Secrets-gated branch is
extended left of Brahm's exterior door through Vrad Mountain Part 1 and Vrad
Mountain Part 2. Its separated lower placement and dashed connector are
guide-authored presentation, not a ROM geography claim: the topology manifest
has the Brahm door's left boundary
targeting `obj04-area00-sub01`, and the submap-order edge places
`obj04-area00-sub00` immediately left of it. No ordinary boundary edge is
promoted between Vrad Mountain and Jam Wasteland.

## Deborah Cliff: Red Crystal Tornado

Player-facing claim:

> Kneel at Deborah Cliff with the Red Crystal to summon the tornado to Bodley
> Mansion.

ROM-backed evidence:

- The reveal detector at bank `1:$A91D-$A929` checks area RAM `$50 == $01`
  and submap RAM `$51 & $7F == $01`, identifying
  `obj04-area01-sub01` / Jam Wasteland (Deborah Cliff).
- The same branch at `1:$A92B-$A936` requires scroll bytes `$53/$54 == 0`
  and Simon center X RAM `$0348 < $50`. The guide therefore highlights the
  left 80 pixels of the Jam Wasteland/Deborah Cliff screen rather than a
  guessed smaller kneel spot.
- The item/state branch at `1:$A938-$A94B` checks selected item RAM
  `$004F == $06`, inventory RAM `$0091 & $60 == $60`, and Simon state RAM
  `$03D8 == $03`. This means the selected item is the shared crystal slot,
  but the owned crystal tier must be Red Crystal.
- The spawn branch at `1:$A953-$A991` lets the kneel condition count down for
  256 frames, changes Simon to state `$0B`, clears flags, and initializes
  tornado actor `$1C` in slot `$11` with selector `$9C`, screen X `$F0`, and
  screen Y `$80`.
- After the tornado setup, bank `1:$A991-$A996` calls the helper at `$C0E7`,
  loads sound id `$28`, and jumps to the sound trigger helper `$C118`. The
  helper writes immediate APU silence/reset values to the pulse, triangle, and
  noise channels before the tornado sound starts, so the tornado event replaces
  the current music instead of layering over it.
- The game does not let that isolated `$28` sound table play to its far end.
  Bank `1:$A999-$A9C8` detects the tornado/Simon overlap 266 frames after the
  tornado actor appears, advances the tornado state, and triggers sound id
  `$2D`; bank `1:$AA3A-$AA44` then sets the transport/event state with
  `$4A |= $10` and `$7F = $12`. The guide therefore uses synthetic event track
  `$128`, generated from `$C0E7`, `$28`, and the mid-animation `$2D` trigger,
  and cuts it at the end of the visible tornado animation instead of playing
  the unused `$28` tail that appears only when the sound is rendered in
  isolation.
- Runtime actor/OAM trace
  `out/actor-traces/deborah-tornado-sprite-probe` validates the spawned
  actor path. The committed artifact `data/deborah-tornado-path.json` records
  the trace-derived per-frame segment/X/Y points used by the guide runtime.
  It also preserves one explicit guide-presentation smoothing replacement:
  the raw trace's Jam-to-Cliff screen-wrap handoff flashes at the far left of
  the wall screen and then holds at the cliff entry point, so the guide
  replaces frames `305-324` with a short curved boundary bridge and compresses
  the 20-frame raw hold out of the presentation timeline. The bridge follows
  the incoming Jam slope, settles into the early Cliff slope, and frame `325`
  resumes the original cliff-side motion from raw trace frame `345`, so the
  guide animation reads as one continuous motion.
- The same OAM trace emits 8x16 sprite tiles `$C5/$C7/$C9/$CB/$CD/$CF` from
  CHR banks `$06/$07`, with attr `$40` alternating every two NES frames. The
  guide renders those tiles at runtime from ROM CHR data when the hotspot is
  clicked.

Meaning:

The kneel region is a normal guide Secret hotspot, controlled by the Secrets
visibility/highlight options. The tornado itself is not a permanent map object
and is not independently clickable; it is a triggered animation that replays
the ROM/runtime path across Jam Wasteland (Deborah Cliff) and the adjacent
Deborah Cliff wall screen, with the internal screen-wrap handoff window
smoothed as guide-authored presentation.

## Yuba Lake: Blue Crystal Kneel Route

Player-facing claim:

> Kneel by Yuba Lake with the Blue Crystal or better to reveal the route to
> Lauber Mansion.

ROM-backed evidence:

- The reveal detector at bank `1:$A760` checks area RAM `$50 == $05` and
  submap RAM `$51 & $7F == $01`, identifying Yuba Lake.
- The follow-up branch at bank `1:$A780` checks selected item RAM
  `$004F == $06`, the shared crystal selected-item slot.
- The same branch checks inventory RAM `$0091 & $60 >= $40`, so Blue Crystal
  and Red Crystal qualify. White Crystal alone does not satisfy this route.
- The branch also checks Simon state RAM `$03D8 == $03`, the kneeling/ducking
  state, before setting route state RAM `$56 = $01`.
- The routine does not check Simon's X/Y position within the Yuba Lake submap.
  The guide therefore highlights the Yuba Lake screen as the kneel interaction
  zone rather than guessing a smaller spot.
- The guide does not simulate equipment state. The Yuba Lake Path and the upper
  Yuba Lake screen remain visible normally. The lower Yuba Lake continuation is
  emitted as a ROM-derived crop of `obj02-area05-sub01` and tagged
  `visibilityLayer: "secrets"`, and the Lauber Mansion door segment remains
  tagged `visibilityLayer: "secrets"`.

Meaning:

The Yuba/Lauber branch is a real ROM-gated route, not ordinary continuous
exterior geography. The guide presents it as a Secrets-controlled branch so the
main route stays uncluttered and the hidden path can be revealed on demand.
Its world placement is guide-authored composition backed by ROM topology, not a
fully decoded transition-height solver. The left boundary transition for
`obj02-area05` uses bytes `$FA $00 $03`, linking the Yuba Lake Path back to
area `obj02-area03`/Aljiba Woods, and the right boundary transition for
`obj02-area05-sub01` leads to `obj01-area02-sub00`/Lauber Mansion Door. The
authored guide layout aligns Yuba Lake Path to the lower-right exit band of
`obj02-area03-sub03` (`aljiba-woods-part-2`) at `y=448`, renders Yuba Lake as
two ROM-derived crops, and aligns the Lauber Mansion Door segment to the bottom
Yuba Lake screen at `y=672`.

## Uta Lower Road 1: Blue Crystal Kneel Lower Path

Player-facing claim:

> Kneel on Uta Lower Road with the Blue Crystal or better to reveal the lower
> path.

ROM-backed evidence:

- The reveal detector at bank `1:$AD96` checks area RAM `$50 == $03` and
  submap RAM `$51 & $7F == $03`, identifying Uta Lower Road 1
  (`obj03-area03-sub03`).
- The follow-up branch at bank `1:$ADBC` checks selected item RAM
  `$004F == $06`, the shared crystal selected-item slot.
- The same branch checks inventory RAM `$0091 & $60 >= $40`, so Blue Crystal
  and Red Crystal qualify. White Crystal alone does not satisfy this route.
- The branch also checks Simon state RAM `$03D8 == $03`, the kneeling/ducking
  state, before setting route state RAM `$56 = $01`.
- Bank `1:$ADD6-$ADE4` sets `$56 = $01`, clears route latch RAM `$0195` and
  action state RAM `$4B`, then plays sound `$2B`.
- The routine does not check Simon's X/Y position within the Uta Lower Road 1
  submap. The guide therefore highlights the upper Uta Lower Road 1 screen as
  the kneel interaction zone rather than guessing a smaller spot.
- The guide does not simulate equipment state. Uta Lower Road 2 remains a
  normal visible section. Uta Lower Road 1 is split into two ROM-derived crops:
  the upper screen remains visible normally, and only the lower screen is tagged
  `visibilityLayer: "secrets"`.

Meaning:

The lower half of Uta Lower Road 1 is a real ROM-gated reveal. The guide
presents only that lower half as Secrets-controlled geography; Uta Lower Road 2
is not treated as part of this secret.

## Camilla Cemetery: Secret Merchant

Player-facing claim:

> Drop Garlic in Camilla Cemetery to reveal the hidden merchant. He gives Simon
> the Silver Knife.

ROM-backed evidence:

- Raw ROM row `0x06F32` is `04 0C 9E 06`.
- The manifest row's high-bit actor id `$9E` maps to live actor id `$1E`.
- Actor dispatch table entry `$1E` points to bank `1:$B1BD`.
- The initialization branch at `1:$B1BD-$B1CE` sets actor state RAM
  `$03D8,x = $40`, sets hidden flag bit `$20` in `$03C6,x`, and initializes
  selector-record index `$0B` through the fixed-bank sprite setup path.
- Selector-record `$0B` expands to metasprite selectors `$1E/$1F`, so the guide
  renders the hidden merchant as an animated ROM-derived actor rather than a
  static `$1E` frame.
- The reveal detector at `1:$B1DD-$B1EB` scans actor slots `$03-$05` by reading
  `$03B4,Y` and comparing each live actor id to `$09`.
- When actor `$09` is found, `1:$B1EC` advances state RAM `$0444,x`,
  `1:$B1EF-$B1F4` clears hidden flag bit `$20` from `$03C6,x`, and
  `1:$B1F7-$B1F9` sets timer RAM `$0456,x = $20`.
- Actor `$09` dispatches to bank `1:$A7F2` and initializes selector-record
  index `$3A`. In normal enemy contexts this id is also used by the Vampire Bat,
  so the guide documents the cemetery trigger as a local transient dropped-item
  actor, not a global actor-name identity.
- ROM item/menu evidence links Garlic to tile `$6D`, and the project already
  promotes Garlic sale rows from the ROM sale table. The cemetery routine is the
  hidden-person side of that Garlic behavior.
- Text pointer `$0CED8` decodes to the merchant's game dialog:
  `i'll give you this silver knife to save your neck.`
- The Silver Knife badge uses start-menu icon tile `$55` from the fixed-bank
  weapon/crystal menu icon table.

Meaning:

The Camilla person is not an always-visible NPC. The guide promotes the row as a
`secretFeatures` entry, renders the ROM-derived merchant sprite only when the
Secrets layer is visible, keeps highlighting on the Secrets highlight option,
and shows a Silver Knife item badge when Labels are visible. The guide dialog is
the standard grey/blue stack: grey guide-authored reveal/reward explanation
above the blue ROM dialog.

## Storigoi Graveyard: Secret Merchant

Player-facing claim:

> Drop Garlic in Storigoi Graveyard to reveal the hidden merchant. He gives
> Simon the Silk Bag.

ROM-backed evidence:

- Raw ROM row `0x06F88` is `04 0C 9E 02`.
- The manifest row's high-bit actor id `$9E` maps to live actor id `$1E`, the
  same hidden-merchant actor family used by the Camilla Cemetery garlic reveal.
- Text pointer `$CEBE` decodes to the merchant's game dialog:
  `i'll give you a silk bag.`
- The reward routine at ROM file `$06E17` runs `A5 92 / 09 01 / 85 92`, setting
  RAM `$92` bit 0 for the Silk Bag.
- The fixed-bank start-menu branch at `7:$F199` checks RAM `$92` bit 0; when set,
  it loads tile `$5C` and draws it through `7:$EB9C`. The guide uses that tile
  for the merchant's floating Silk Bag item badge.

Meaning:

`obj03-area01-sub00` is the missing Storigoi Graveyard branch that exits right
into Sadam Woods Part 2. The guide adds the full ROM-rendered strip west of
Sadam Woods Part 2, promotes its hidden merchant as a Secrets-layer entity, and
places the strip with guide-authored composition so it aligns to Sadam Woods
without overlapping Ondol or the Vrad Mountain branch.
