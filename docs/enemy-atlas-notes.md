# Enemy Atlas Notes

`data/enemy-atlas.json` is the durable whole-ROM enemy inventory. It is meant
to be rebuilt whenever enemy proof improves:

```sh
npm run build:enemy-atlas
```

The atlas is broader than the current guide map. It inventories every manifest
row whose actor kind is `enemy`, including regions and mansions that are not yet
rendered in the guide.

## Proof Sources

The atlas combines these evidence paths:

- `data/vendor/cv2r/locations.json`, `data/vendor/cv2r/objects.json`, and
  `src/manifest.js` provide the raw enemy row inventory, file offsets, location
  contexts, and source names.
- The ROM file bytes at each manifest row pointer are read back and checked.
  The row id and row data byte must match the manifest for the occurrence to
  validate.
- The ROM HP initializer at PRG bank `1`, CPU `$8117-$8147`, provides the HP
  rule. The fourth actor-row byte is base HP; normal exterior night enemies use
  the ROM night-strength `ASL` path, and object set `$01` skips that path.
- `out/render-recipe-atlas/manifest.json` provides the validated/projected
  render recipe for each `objset/area/submap` variant. The enemy atlas resolves
  sprite palette bytes through the render recipe's auxiliary transfer id and
  the PRG-bank-7 transfer pointer table at `$8895`.
- The actor dispatch table at PRG bank `1`, CPU `$81D3`, provides each enemy
  routine target. Simple `$DED8` selector-stream initializers and `$DED0`
  direct-selector initializers are decoded into fixed-bank metasprite records.
- The English NES manual enemy pages are used only when a manual name has been
  matched to a ROM-rendered actor class with sprite evidence.

## Current Coverage

The current build validates:

| Metric | Count |
| --- | ---: |
| Enemy rows | 494 |
| Enemy classes | 34 |
| Enemy-bearing map sections | 54 |
| Rows using standard night HP doubling | 303 |
| Rows using fixed mansion/interior HP | 191 |
| Manual-name matches proven | 21 |
| Manual-name matches still unproven | 13 |

The row validation currently has one documented position normalization:
Camilla Cemetery actor `$41` at file offset `$06F42` is raw ROM row
`$24 $0D $41 $08`, while the manifest supplies `y=12`. The atlas keeps both raw
and manifest positions and treats the occurrence as valid because the pointer,
actor id, and HP/data byte match the ROM. This is provenance, not a guide
placement claim.

## Sprite Decode Status

Most classes expose selector evidence directly from their dispatch routine:

| Status | Class count | Meaning |
| --- | ---: | --- |
| `dispatch-routine-selector-proof` | 26 | The static routine scan found one or more selector-stream/direct-selector initializers and decoded their metasprites. |
| `partial-static-dispatch-proof` | 1 | Fishman body selector proof is decoded, but water/projectile states still need fuller routine coverage. |
| `dispatch-routine-local-selector-table-proof` | 2 | The routine writes visible selectors from a local ROM table rather than the shared selector-record helper. |
| `direct-selector-state-machine-partial` | 3 | A direct selector and known neutral animation selectors are decoded, but the whole state machine is not yet unfolded. |
| `direct-selector-partial` | 2 | A direct selector is decoded for a boss/large enemy, but related state/projectile behavior remains out of scope. |

Classes whose visible sprite selectors are decoded but whose larger behavior is
still partial:

| Actor id | Display name | Status | Note |
| --- | --- | --- | --- |
| `$04` | The Fish Man | `partial-static-dispatch-proof` | Body selector record `$06` is decoded; water/projectile behavior still needs fuller routine coverage. |
| `$15` | The Mud Man | `dispatch-routine-local-selector-table-proof` | Local ROM table at bank `1:$A3E4` writes selectors `$59/$5A/$5B`. |
| `$18` | Swamp ghoul | `dispatch-routine-local-selector-table-proof` | Local ROM table at bank `1:$AF12` writes selectors `$C0/$C1/$C2`. |
| `$1F` | Slimey BarSinister | `direct-selector-state-machine-partial` | Direct selector `$3C` and neutral selector `$3D` are decoded. |
| `$41` | Slimey BarSinister | `direct-selector-state-machine-partial` | Direct selector `$C3` and neutral selector `$C4` are decoded. |
| `$42` | Camilla | `direct-selector-partial` | Direct selector `$CA` is decoded; boss/projectile states remain separate. |
| `$44` | Death | `direct-selector-state-machine-partial` | Direct selector `$44` and follow-up selector `$45` are decoded; scythe/projectile behavior remains separate. |
| `$4A` | Dragon Bones | `direct-selector-partial` | Direct selector `$56` is decoded; projectile/spawn behavior remains separate. |

## Swamp Ghoul Placement

Swamp Ghoul actor rows use actor id `$18`, which dispatches to PRG bank
`1:$AE95`. The shared actor loader at bank `1:$8055-$8188` writes row X/Y to
runtime screen anchor RAM `$0348/$0324` after scroll subtraction. The `$18`
routine does not adjust either coordinate; its state machine changes selector
RAM `$0300,x` through the local table at `1:$AF12` (`$00/$C0/$C1/$C2`) to make
the ghoul rise, wait, and sink.

Because the `$C0-$C2` metasprites already carry their own OAM X offsets from
that runtime anchor, Swamp Ghoul guide placement uses the raw row X anchor
rather than the generic `+8` spawn-cell center used for normal upright enemy
markers. It still uses the normal row-backed sprite Y presentation offset, so
the ghoul is not drawn too low in the marsh.

## Manual Names

The atlas preserves the manual's leading `The` when a match is proven. Current
proven manual names are:

| Actor id | Manual name |
| --- | --- |
| `$01` | Raven |
| `$02` | The Ghastly Leech |
| `$04` | The Fish Man |
| `$06` | The Two-Headed Creature |
| `$08` | Ghostly Eyeball |
| `$09` | Vampire Bat |
| `$0A` | Medusa Head |
| `$0E` | The Spider |
| `$0F` | The Gargoyle |
| `$11` | Vampire Bat |
| `$12` | The Wolf |
| `$13` | The Wolf Man |
| `$15` | The Mud Man |
| `$17` | The Zombie |
| `$1F` | Slimey BarSinister |
| `$38` | The Zombie Hand |
| `$39` | The Pirate Skeleton |
| `$3A` | The Mummy |
| `$3F` | Man-Eating Plant |
| `$41` | Slimey BarSinister |
| `$4A` | Dragon Bones |

All other manual names remain candidates until their manual illustration/name is
matched to ROM-rendered sprite evidence. The atlas stores candidates separately
from `displayName` so future guide builds cannot accidentally promote an
unproven manual label.

## How To Use It

When expanding the guide into a new route, use the atlas as a first-pass enemy
truth table:

1. Filter `occurrences` by `location.objset`, `location.area`, and
   `location.submap`.
2. Use the occurrence `row` object for raw ROM provenance.
3. Use `hp` and `hpEvidence` for day/night HP copy.
4. Use `paletteByDisplayedState` and the class `spriteModel` as the starting
   render proof.
5. If a class has a partial or blocked sprite status, finish the ROM routine
   decode for that class before claiming final sprite behavior in the guide.

Do not use this atlas as permission to skip route-specific placement validation.
Enemy positions still need to be validated against the same composed map and
viewport alignment used by the guide destination.
