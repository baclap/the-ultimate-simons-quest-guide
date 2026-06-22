# Actor Trace Notes

This note records the current no-shortcut path for promoting enemies and NPCs
into the guide map. The new actor traces use local Mesen save states as runtime
probes, but the intended source of truth is still ROM data and ROM code.

## Commands

Run one raw trace:

```sh
node src/index.js mesen-trace-actors \
  --rom roms/cv2.nes \
  --name jova-woods-day-forward \
  --state out/states/jova-woods.mss \
  --inputs right:30:840 \
  --trace-frames 900 \
  --sample-every 8 \
  --out out/actor-traces/jova-woods-day-forward
```

Run the configured save-state probe set and aggregate it:

```sh
node src/index.js run-actor-traces \
  --rom roms/cv2.nes \
  --fixtures data/actor-trace-fixtures.json \
  --out out/actor-traces
```

Rebuild only the aggregate from existing trace outputs:

```sh
node src/index.js analyze-actor-traces \
  --fixtures data/actor-trace-fixtures.json \
  --out out/actor-traces
```

## Trace Evidence

`out/actor-traces/analysis.json` currently summarizes 15 complete traces.
Important runtime bindings:

| Trace evidence | Actor id | Selectors | HP evidence |
| --- | ---: | ---: | ---: |
| Jova Woods day, walking forward | `0x13` | `0x65`, `0x66` | `0x02` |
| Jova Woods night, walking forward | `0x13` | `0x65`, `0x66` | `0x04` |
| Jova Woods day, walking forward | `0x03` | `0x0E`, `0x0F` | `0x01` |
| Jova Woods night, walking forward | `0x03` | `0x0E`, `0x0F` | `0x02` |
| Jova town night, walking forward | `0x17` | `0x3F`, `0x40` | `0x02` |
| North Bridge day idle | `0x03` | `0x0E`, `0x0F` | `0x0F` |
| North Bridge night idle | `0x03` | `0x0E`, `0x0F` | `0x1E` |
| Camilla Cemetery day/night idle | `0x38` | `0x8E`, `0x8F` | `0x08` |
| Vrad Graveyard night idle | `0x3A` | `0xBC`, `0xBD` | `0x0F` |
| Berkeley Mansion interior idle | `0x05` | `0x35`, `0x36` | `0x02` |

The Jova Woods idle save state by itself does not prove a non-player actor. The
walking trace matters: it causes the game to stream actor slots in naturally and
then records their live ids, selectors, HP, positions, PPU sprite pattern base,
and visible OAM.

## Selector Write Routine Evidence

The traces record selector writes to `$0300+x`. For the observed enemy classes,
the callback PC is `$DD7D`. That PC lands in the fixed PRG bank, not the
switchable `mapper.prgReg` bank. For this ROM, CPU `$DD7D` maps to file offset
`0x1DD8D`.

The bytes around that fixed-bank window are:

```text
05 A9 00 9D FC 03 C8 B1 08 18 7D FC 03 9D 00 03
C8 B1 08 9D EA 03 FE FC 03 60
```

The important part is the `STA $0300,x` write in the middle. This is the shared
animation/selector stream path. The runtime trace proves which actor ids pass
through it and which selector bytes they emit. The next static step is to decode
the pointer feeding `$08/$09`, the frame counter at `$03FC+x`, and the per-actor
animation streams that supply those selector bytes.

## Actor `$43`: Transparent Sprite Mask

Actor id `$43` is a rendering-control marker, not an enemy, NPC, item, or
clickable guide entity. It should stay in diagnostic/provenance output, but it
should not be promoted into normal guide overlays.

The ROM actor dispatch table routes id `$43` to bank `1`, CPU `$836C`
(`0x0437C` in the `.nes` file). That routine does not load HP, dialogue, or a
normal metasprite selector. Once initialized, it copies the actor slot's
`$0324,x` Y position and `$0348,x` X position into OAM shadow entries
`$0218-$0237`, which are sprite slots `6-13`.

The Veros Woods Part 1 night save-state probe confirmed the runtime behavior:

| Evidence | Value |
| --- | --- |
| ROM actor row | `0x604A: 0C 0D 43 00` |
| Live actor slot | `7` |
| Active id | `$43` |
| Selector / HP | `$00` / `$00` |
| State byte | `$82` |
| Runtime position | `screenX=$AD`, `screenY=$D0` |
| OAM slots written | `6-13` |
| Sprite tile in those slots | `$FF` |

The active sprite pattern table has blank bytes for tile `$FF`, so the object is
not drawing visible art. Instead, it parks eight transparent sprites on the same
scanlines. On the NES, only eight sprites can be drawn on one scanline; consuming
those slots is a hardware-era way to hide or cut off later sprites in that
horizontal band. The clearest guide rule is therefore: treat `$43` as a
transparent sprite-mask/control row.

## What This Means For Programmatic Decode

The existing save states are enough to bind several actor classes without hand
labeling screenshots:

- `0x13` is now live-proven in Jova Woods with day/night HP doubling.
- `0x17` is now live-proven in Jova town at night.
- `0x03` is live-proven across multiple contexts, with HP varying by area and
  night state.
- `0x38`, `0x3A`, and `0x05` have live selector/HP evidence outside the first
  guide slice.

The save states are not enough by themselves to cover every enemy class on every
screen. Castlevania bridge day/night and Vrad Graveyard day did not surface
non-player actors during the configured idle probes. Those are not failures, but
they are still gaps: they need either better scripted movement from the existing
state, a new save-state probe, or a complete static decode of the actor routine
that instantiates that class.

The current no-shortcut path is therefore:

1. Decode ROM actor rows for placement and actor id.
2. Use runtime traces to calibrate actor id to live selector, HP, palette/attr,
   and animation-stream behavior.
3. Decode the fixed-bank selector stream around `$DD7D` so observed actor
   classes can be rendered programmatically on screens that do not have their own
   save state.
4. Add targeted probes only where a class or context has not appeared in the
   current evidence.

## Enemy Naming Standard

Enemy display names should be stable class names, not labels derived from the
current map segment. Use official names from the instruction manual when the
manual illustration can be matched to the ROM actor class with sprite evidence.
The Nintendo-hosted NES manual pages "Count Dracula's Best Buddies" are the
primary English manual source for enemy names. External wikis, walkthroughs,
fan maps, and memory can suggest candidates, but they are leads until matched
against ROM/runtime evidence. Preserve the manual's leading "The" when it is
part of the printed name.

When an official name is unavailable or the manual match is not yet proven, use
a short generic descriptive name. Do not prefix an enemy with a location such as
town, woods, mansion, Berkeley, or Veros unless the class is proven exclusive to
that place and the location is needed to distinguish it from another visually or
mechanically similar class. If the same actor id appears in multiple places,
the guide name must remain generic.

Actor id `$1F` is the current example. It was first promoted while building
Berkeley Mansion and temporarily named "Mansion blob", but a whole-ROM actor
inventory finds the same id in Berkeley, Brahm, and Bodley mansions. Until an
official manual-name match is proven for that sprite, the guide-facing name is
"Blob".

## Current Enemy Name Audit

This table covers the enemy classes currently promoted in the guide. "Manual
match" means the ROM-rendered guide sprite was compared against the English
manual enemy pages and the guide label now follows the printed name exactly.
"Generic" means the actor is ROM-proven, but the English manual match is not yet
clear enough to claim an official name.

| Actor id | Guide class | Guide label | Status | Evidence note |
| --- | --- | --- | --- | --- |
| `$01` | `crow` | Raven | Manual match | The bird sprite matches the manual's "Raven" illustration. |
| `$03` | `skeleton` / `mansion-skeleton` | Skeleton | Generic | The guide renders a walking skeleton body; the English manual does not show a plain walking skeleton match clearly enough for a manual name. |
| `$04` | `fishman` | The Fish Man | Manual match | The amphibious humanoid sprite matches the manual's "The Fish Man". |
| `$08` | `eyeball` | Ghostly Eyeball | Manual match | The flying eyeball sprite matches the manual's "Ghostly Eyeball". |
| `$09` | `zigzag-bat` | Vampire Bat | Manual match | The flying bat sprite matches the manual's "Vampire Bat". |
| `$0E` | `spider` | The Spider | Manual match | The hanging/crawling spider sprite matches the manual's "The Spider". |
| `$13` | `werewolf` | The Wolf Man | Manual match | The Jova Woods humanoid wolf sprite matches the manual's "The Wolf Man". |
| `$17` | `zombie` | The Zombie | Manual match | The town night humanoid sprite matches the manual's "The Zombie". |
| `$05` | `mansion-spear-knight` | Spear knight | Generic | The spear-bearing mansion enemy is ROM-proven, but the English manual enemy pages do not include a clear spear-knight label. |
| `$0D` | `mansion-bone-thrower` | Bone thrower | Generic | The actor behavior is ROM-proven, but the sprite/name relationship needs a fuller projectile and actor-state proof before using a manual-derived name. |
| `$0F` | `mansion-gargoyle` | The Gargoyle | Manual match | The winged mansion sprite matches the manual's "The Gargoyle". |
| `$1F` | `blob` | Blob | Generic | The sprite is a mansion slime/blob class; neither "Slimey BarSinister" nor another English manual name is proven for this actor yet. |

## Berkeley Mansion Interior Promotion

Berkeley Mansion is the first whole-interior destination and should be treated
as the reference standard for future mansion/shop/church actor work. Its
generated research artifact currently accounts for 50 raw ROM rows across
`obj01-area07-sub00` and `obj01-area07-sub01`: 49 promoted guide rows plus the
documented `$22` moving-platform control row at ROM file offset `$5AD8`.

| Actor id | Guide class | Rows | Evidence expectation |
| --- | --- | ---: | --- |
| `$03` | Skeleton | 22 | ROM row id plus selector record `$05`; mansion CHR/palette comes from the fixed interior recipe. |
| `$05` | Spear knight | 6 | Berkeley runtime trace observes selectors `$35/$36`; selector record `$13` backs the class. |
| `$0D` | Bone thrower | 2 | Dispatch entry `$0D` initializes selector record `$05`; rows carry HP `$02`. |
| `$0F` | The Gargoyle | 4 | Dispatch entry `$0F` initializes selector record `$12`. |
| `$1F` | Blob | 10 | Direct `$DED0` selector path, not a normal selector-stream record; neutral animation uses selectors `$3C/$3D`. |
| `$27` | Clue book | 3 | Selector record `$3B`; text decoded from ROM file offsets. |
| `$AE` | Oak-stake merchant | 1 | High-bit merchant row maps to live id `$2E`; selector record `$0B`; text decoded from ROM file offset `$0D044`. |
| `$25` | Dracula's Rib orb | 1 | Direct `$DED0` selector path for the orb sequence; pre-stake save-state OAM proves selector `$3B` and the class-specific anchor; text decoded from ROM file offset `$0CF9C`. |
| `$22` | Secret feature | 1 | ROM row `$05 $28 $22 $A4` at file offset `$5AD8`; promoted through `secretFeatures` as the crystal-gated moving platform rather than the normal actor layer. |

The `$22` row is actor-like ROM data, but it should not become a character
hotspot. Its routine writes platform selector `$43`, uses row data `$A4` for the
vertical motion branch, and checks selected item `$004F == $06`. Details for the
crystal condition and motion proof live in
`docs/guide-secret-reveal-methods.md`.

### Dracula's Rib Orb Placement

`out/states/berkeley-mansion-orb.mss` is the current proof fixture for the
Berkeley Rib room before the Oak Stake strike. The capture runtime context is
objset `$01`, area `$07`, submap `$01`, actor pointer `$9B2D`, and tile-set
pointer `$8891`. ROM row `$05B99` is `$3D $15 $25 $18`, so the row anchor is
local pixel `$3D * 16 = 976`, `$15 * 16 = 336`.

The settled captures show actor `$25` using selector `$3B` only in the
pre-stake state. Visible OAM uses tiles `$EC/$EE`, screen X `$C8/$D0`, and
screen Y `$60`. The orb blink is an OAM palette cycle, not a tile-selector
cycle. A frame-by-frame trace in
`out/actor-traces/berkeley-mansion-orb-cadence` samples
`out/states/berkeley-mansion-orb.mss` with `--sample-every 1` and proves palette
bits `$01/$02/$03/$00`, advancing once per NES frame. Earlier captures at settle
frames 15/30/45/60 only proved membership in the cycle and aliased the true
cadence. The guide draw anchor remains `x + 0`, `y - 12`: the sprite tiles land
at local X `968/976` and the visible orb sits on the platform. Selector `$A1` is
part of the later reveal sequence, not part of the pre-stake blink.

Future interiors must follow the same promotion rule before their rows appear in
the guide: actor class, HP/data semantics, selector or direct-selector path,
sprite CHR/palette, text pointer behavior, and fixture behavior should be
proven or the row must be explicitly documented as blocked/control/out of
scope. The build should not silently drop unknown rows from a promoted interior.
