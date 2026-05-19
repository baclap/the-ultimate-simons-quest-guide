# Render Recipe Audit Notes

The render recipe audit uses save states as validation probes. Captures are not
source art for the final map; they expose live CPU/PPU state so the renderer can
check whether its ROM-derived recipe matches what the game actually selected.

## Commands

```sh
npm run capture:recipe-probes
npm run audit:render-recipes
```

`capture:recipe-probes` reads `data/render-recipe-fixtures.json`, runs each
configured Mesen capture, and writes ignored artifacts under `out/captures/`.
`audit:render-recipes` writes:

- `out/render-recipe-audit/audit.json`
- `out/render-recipe-audit/audit-data.js`

## Current Probe Set

The current fixture manifest covers:

- Jova town day and night
- Jova Woods day and night
- Dora Woods - Part 2 day
- Dabi's Path day
- Camilla Cemetery day and night
- Berkeley Mansion door day
- Jova town interior day
- Berkeley Mansion interior day

Deferred probes remain explicit in the manifest: North Bridge day/night, Vrad
Graveyard day, Castlevania Bridge day, and Castlevania exterior day.

## Findings

All 11 captured probes now have exact CHR ROM fingerprints and exact ROM
palette selector matches.

| Probe | Runtime context | CHR banks | Palette transfer | Palette address |
| --- | --- | --- | --- | --- |
| Jova town, day | `0:0:$00` | `00/01` | `$16` | `4:$9EA2` |
| Jova town, night | `0:0:$80` | `00/01` | `$14` | `4:$9E80` |
| Jova Woods, day | `2:0:$00` | `02/03` | `$22` | `4:$9FC6` |
| Jova Woods, night | `2:0:$00` | `02/03` | `$25` | `4:$9FF9` |
| Dora Woods - Part 2, day | `2:0:$83` | `02/03` | `$23` | `4:$9FD7` |
| Dabi's Path, day | `2:3:$00` | `02/03` | `$26` | `4:$A00A` |
| Camilla Cemetery, day | `3:0:$00` | `04/05` | `$29` | `4:$A03D` |
| Camilla Cemetery, night | `3:0:$00` | `04/05` | `$2B` | `4:$A05F` |
| Berkeley Mansion door, day | `1:1:$00` | `08/09` | `$0F` | `4:$9F5E` |
| Jova town interior, day | `0:8:$00` | `00/01` | `$15` | `4:$9E91` |
| Berkeley Mansion interior, day | `1:7:$00` | `08/09` | `$0F` | `4:$9F5E` |

The Berkeley Mansion door probe explains the scrambled mansion-door atlas
template: object set `1` uses CHR banks `08/09`, not the old inferred `04/05`.
The atlas template has been updated to that generalized object-set evidence,
but door layout crop validation is still pending.

## Interpretation

The audit confirms that palette selection can be driven from the runtime
selector table for the current probes, including day/night variants and
interiors. It also confirms that captured PPU pattern memory can be fingerprinted
against CHR ROM to identify live banks without relying on manual visual checks.

Dora remains the important context-alias example: the atlas layout candidate is
`2:8:2`, while the live runtime palette context is `2:0:$83`.

Small composite diffs on some diagnostic captures should be treated separately
from recipe evidence. The audit milestone records live CHR and palette state;
full pixel validation still requires crop/scroll alignment for each promoted
render family.
