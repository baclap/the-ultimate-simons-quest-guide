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

Generated guide scenes enforce this at build time: enemy display labels must
come from the canonical actor-class label, not the source manifest row name. A
row source name such as "mansion bat" may remain in research artifacts as source
metadata, but it must not become player-facing UI text.

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
| `$11` | `mansion-bat` | Vampire Bat | Manual match | The mansion bat actor uses a different ROM actor id/selector context from `$09`, but the rendered bat class matches the same manual "Vampire Bat" enemy name. |
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
| `$27` | Hidden clue book | 3 | Shared hidden-book routine `1:$8335`; selector record `$3B`; text decoded from ROM file offsets; each generated book is linked to the ROM-expanded destructible group at its reveal anchor. |
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

## Town Interior Promotion

Town interiors are promoted shop/church destinations. The
generated research artifact `out/interior-map-research/jova-interiors.json`
accounts for all three current rows by byte-checking the manifest row pointers
against the ROM:

| Location | Actor id | Guide class | Evidence expectation |
| --- | --- | --- | --- |
| Church | `$AD` | Priest | Town high-bit NPC path, selector record `$0C`, CHR banks `$00/$01`, town-interior day sprite palette, text decoded from ROM file offset `$0D233`. |
| Thorn Whip Room | `$AE` | Thorn Whip Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `thorn`, ROM text pointer `$0D25F`, and ROM sale-table row `$5B $01 $00`. |
| Holy Water Room | `$AE` | Holy Water Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `holyWater`, ROM text pointer `$0D2B7`, and ROM sale-table row `$57 $00 $50`. |

These rooms are independent single-room interiors. They do not need
multi-submap alignment proof, but their exterior door links still come from the
Town of Jova ROM door table and the expanded-background door signature.

The Town of Veros proof artifact
`out/interior-map-research/veros-interiors.json` uses the same byte-check rule
for all four promoted rows:

| Location | Actor id | Guide class | Evidence expectation |
| --- | --- | --- | --- |
| Church | `$AD` | Priest | Shared town church row; selector record `$0C`, CHR banks `$00/$01`, town-interior day sprite palette, text decoded from ROM file offset `$0D233`. |
| Dagger Room | `$AE` | Dagger Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `dagger`, ROM text pointer `$0D2A0`, and ROM sale-table row `$54 $00 $50`. |
| Chain Whip Room | `$AE` | Chain Whip Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `chain`, ROM text pointer `$0D271`, and ROM sale-table row `$5B $01 $50`. |
| Chain Whip Room | `$27` | Hidden clue book | Shared hidden-book routine `1:$8335`, selector record `$3B`, CHR banks `$00/$01`, ROM text pointer `$0D4C6`, and a ROM-expanded destructible group at the reveal anchor. |

Veros Dagger is a two-submap destination: `obj00-area0A-sub00` is the empty
entry room and `obj00-area0A-sub01` is linked by the ROM manifest `entryRoom`
relationship as the Dagger merchant room. The guide composes that entry chain
horizontally as a single destination. Veros Church and Veros Chain Whip are
single-room destinations.

The Town of Aljiba proof artifact
`out/interior-map-research/aljiba-interiors.json` uses the same byte-check rule
for all four promoted rows:

| Location | Actor id | Guide class | Evidence expectation |
| --- | --- | --- | --- |
| Garlic Room | `$AE` | Garlic Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `garlicAljiba`, ROM text pointer `$0D201`, and ROM sale-table row `$6D $00 $50`. |
| Book Room | `$27` | Hidden clue book | Shared hidden-book routine `1:$8335`, selector record `$3B`, CHR banks `$00/$01`, ROM text pointer `$0D99D`, and a ROM-expanded destructible group at the reveal anchor. |
| Old Lady Room | `$AC` | Old Lady | High-bit town NPC path to live id `$2C`; direct selector `$28`; text decoded from ROM file offset `$0D92B`. |
| Laurels Room | `$AE` | Laurels Merchant | Merchant selector record `$0B`, CHR banks `$00/$01`, item type `laurelsAljiba`, ROM text pointer `$0D21B`, and ROM sale-table row `$58 $00 $50`. |

Aljiba Garlic is a single-room destination. The Book/Old Lady and Laurels
destinations use ROM manifest `entryRoom` chains and are composed horizontally.

## Lauber Mansion And Camilla Cemetery Coverage

Lauber Mansion is inventoried by
`out/interior-map-research/lauber-mansion.json`. It accounts for 45 raw rows:
44 promoted actor rows plus one moving-platform control row promoted through
`secretFeatures`.

| Actor id | Guide class | Rows | Evidence expectation |
| --- | --- | ---: | --- |
| `$03` | Skeleton | 22 | ROM row id plus selector record `$05`; mansion CHR/palette comes from the fixed interior recipe. |
| `$05` | Spear knight | 6 | Selector record `$13`; Lauber rows carry HP `$04`. |
| `$0D` | Bone thrower | 5 | Dispatch entry `$0D` initializes selector record `$05`; Lauber rows carry HP `$04`. |
| `$0F` | The Gargoyle | 2 | Dispatch entry `$0F` initializes selector record `$12`; Lauber rows carry HP `$04`. |
| `$11` | Vampire Bat | 5 | Dispatch entry `$11` initializes selector record `$07`, selectors `$12/$13`, in the mansion CHR context. |
| `$AE` | Oak-stake merchant | 1 | High-bit merchant row maps to live id `$2E`; selector record `$0B`; item type `oakHeart`; text decoded from ROM file offset `$0D044`. |
| `$25` | Dracula's Heart orb | 1 | Direct `$DED0` selector path with selector `$3B`; text/data `$19` selects the Dracula's Heart pickup message. |
| `$27` | Hidden clue book | 2 | Shared hidden-book routine `1:$8335`; selector record `$3B`; text decoded from ROM file offsets `$0D0F1` and `$0D11D`; each generated book is linked to the ROM-expanded destructible group at its reveal anchor. |
| `$21` | Moving platform | 1 | ROM row `$24 $25 $21 $85` at file offset `$5C2B`; dispatches to bank `1:$854B`, initializes platform selector `$51`, uses setup branch `1:$859A`, and uses motion branch `1:$8616`. Setup branch `$859A` stores positive X velocity, so the row anchor is the left endpoint; row data high nibble `$80` is the reversal timer, so the platform moves horizontally 128 pixels rightward before reversing. The raw row anchor is retained as provenance; visible guide placement applies the same `(0,-13)` mansion platform actor-slot/OAM anchor correction proven by the Berkeley `$22` moving-platform trace. |

Camilla Cemetery is promoted into the exterior slice from ROM manifest rows,
runtime/static selector proof, and secret-feature proof:

| Actor id | Guide class | Rows | Evidence expectation |
| --- | --- | ---: | --- |
| `$9E` | Secret Merchant | 1 | Promoted through `secretFeatures`, not the ordinary character layer. ROM row `$06F32` maps `$9E` to live actor `$1E`; routine `1:$B1BD` hides the merchant until actor slots `$03-$05` contain transient actor `$09`, then clears hidden bit `$20` from `$03C6,x`. The initialization branch loads selector-record `$0B`, which emits merchant selectors `$1E/$1F`; the reward text pointer `$0CED8` gives the Silver Knife dialog, and PPU pattern-table captures match CHR banks `$04/$05`. |
| `$38` | Dead Hand | 5 | Camilla day/night traces prove selector record `$17`, selectors `$8E/$8F`, OAM tile pairs `$89/$9F` and `$FB/$FD`, HP `$08`, and PPU pattern-table CHR banks `$04/$05`. |
| `$41` | Blob | 2 | Dispatch entry `$41` at bank `1:$B119` initializes direct selector `$C3`; the state routine at `1:$B13F` toggles selector RAM `$0300,x` between `$C3/$C4` for neutral animation; Camilla captures prove PPU pattern-table CHR banks `$04/$05`; raw ROM bytes are used for placement when the manifest row normalizes Y differently. |

Yuba Lake Path contains two `$22` moving-platform control rows not exposed by
the generic manifest actor list. They are promoted through `secretFeatures`
because they are actor-like ROM control rows rather than enemies/NPCs.

| Actor id | Guide class | Rows | Evidence expectation |
| --- | --- | ---: | --- |
| `$22` | Moving platform | 2 | ROM rows `$29 $0D $22 $45` at `$06765` and `$37 $0D $22 $46` dispatch to bank `1:$854B`, initialize selector `$43`, use setup branches `1:$859A`/`1:$859E`, and use runtime branch `1:$8616` for 64-pixel horizontal ping-pong motion. |

Future interiors must follow the same promotion rule before their rows appear in
the guide: actor class, HP/data semantics, selector or direct-selector path,
sprite CHR/palette, text pointer behavior, and fixture behavior should be
proven or the row must be explicitly documented as blocked/control/out of
scope. The build should not silently drop unknown rows from a promoted interior.
