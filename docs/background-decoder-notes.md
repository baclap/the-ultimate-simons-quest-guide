# Background Decoder Notes

These notes capture the current bridge between Mesen traces and the eventual ROM-native background renderer.

The current committed descriptor data lives in `data/background-descriptors.json`.
See `docs/background-descriptor-schema.md` for the machine-readable fields. The
descriptors preserve the RAM context, ROM addresses, tile-set pointers, page
selection, row-stream behavior, and validation captures needed to reuse these
discoveries outside the current PNG-oriented CLI.

## Addressing

The game uses MMC1 PRG banking. During the current Jova day fixture:

- switchable PRG bank: `4` while town background tiles are generated
- CHR banks: `0` and `1`
- `objset`: `$30 = 00`
- `area`: `$50 = 00`
- `submap`: `$51 = 00`
- actor pointer: `$3D/$3E = $90AC`, matching Jova actor data in PRG bank `1`

The iNES header says horizontal mirroring, but the captured runtime nametable memory mirrors `$2000` at `$2800` and `$2400` at `$2C00`. Treat mirroring as runtime mapper state, not as a fixed header-only property.

## Fixed Transfer Stream

The fixed-bank routine at `$C6C0-$C724` decodes a PPU transfer stream from the pointer in `$00/$01`.

Stream format:

```text
<ppuLow> <ppuHigh> <commands...>
```

The first two bytes are little-endian as stored in ROM, but the routine writes high then low to `$2006`. For example, `00 20` targets PPU `$2000`.

Commands:

- `FF`: end stream
- `7F`: address marker; the next two stream bytes are a new `<ppuLow> <ppuHigh>` target
- `00` through `7E`: repeat run; repeat the next byte `count` times, with `00` behaving as 256 repeats by 6502 wraparound
- `80` through `FE`: literal run; copy `command & 7F` following bytes

The new `decode-transfer` command decodes this format and can write the resulting nametable bytes:

```sh
npm run decode:title-transfer
```

Current sanity check:

```text
bank 4, address $8000
commands: 65
PPU writes: 2048
applied nametable writes with vertical mirroring: 4096
```

This validates the transfer format, but it is not the whole Jova gameplay background. The visible Jova screen is built later through the NMI PPU update buffer.

## NMI PPU Buffer

The game builds small PPU update batches in CPU RAM `$0700-$07FF`; the fixed NMI routine consumes them and writes to `$2007`.

Observed command group:

```text
01 <ppuHigh> <ppuLow> <data bytes...> FF
```

The buffer ends with `00`.

For example, frame `3765` starts visible Jova construction:

```text
01 20 00 A0 A0 A0 A0 FF
01 20 20 A0 A0 A0 A0 FF
01 20 40 A0 A0 A0 A0 FF
...
01 23 C0 AA FF
```

The new `replay-ppu-buffer-trace` command reconstructs nametable bytes from a Mesen trace of writes to `$0700-$07FF`:

```sh
npm run replay:jova-buffer-trace
```

Current Jova replay result against `out/captures/jova-day/ppu-2000-2fff-nametables.bin`:

```text
frames applied: 38
buffer commands: 473
PPU writes: 2206
unsupported commands: 0
page 0 differences: 0 / 1024
page 1 differences: 68 / 1024
page 2 differences: 0 / 1024
page 3 differences: 68 / 1024
```

Pages `0` and `2` are the visible Jova nametable and its mirror; replaying the buffer trace reproduces them exactly. The page `1` and `3` differences are leftover menu/text bytes in the trace replay that are cleared by non-buffer transfer work before the final capture. This is expected for the trace-only replay and confirms that full nametable history needs both transfer-stream replay and buffer replay.

## ROM-Native Decoder Direction

The important ROM data paths seen while the Jova background is generated are:

- fixed-bank buffer helper: `$C840-$C891`
- fixed-bank layout pointer selection around `$E804`
- fixed-bank block-index read around `$EA4B`
- fixed-bank tile pointer calculation around `$EA57` and `$E7F4`
- fixed-bank tile write loop around `$E845-$E850`
- fixed-bank attribute write path around `$E8C5-$E909`

Those routines use data from multiple switchable banks:

- PRG bank `2`: block-index layout tables
- PRG bank `4`: tile/metatile definitions and attribute bytes
- fixed PRG bank `7`: renderer/control code

The trace replay now gives an exact page-0 oracle for the ROM-native decoder work.

## Background Context Table Path

`node src/index.js inspect-background-context` derives the main descriptor
pointers from runtime context:

```sh
node src/index.js inspect-background-context --rom roms/cv2.nes --objset 0x02 --area 0 --submap 0
```

The current table path is:

- fixed table `$F7AB + objset * 2` -> area-table pointer
- area table entry `area * 2` -> area/submap record pointer
- area/submap record entry `$09 + submap * 2` -> screen record pointer
- screen record byte `0` -> layout index
- fixed table `$F7FB + objset * 2` -> layout-header table pointer
- layout-header table entry `layoutIndex * 4` -> primary and secondary layout headers
- fixed table `$F7D1 + objset * 4` -> tile-set pointer and an auxiliary pointer

Switchable addresses in these tables are read from PRG bank `2`. Tile/metatile
definitions and block attribute bytes currently come from PRG bank `4`.

Known outputs:

```text
Jova:       objset 0, area 0, submap 0 -> screen $FA3A, layout header $FA86, tile set $841D
Jova Woods: objset 2, area 0, submap 0 -> screen $A1A0, layout header 2:$A23E, tile set $8CF4
```

## Jova Native Decoder Checkpoint

`npm run render:jova-native` renders the first descriptor-backed ROM-native checkpoint:

```sh
npm run render:jova-native
```

The `jova-day` descriptor reads the visible Jova background from these ROM addresses:

- layout header: fixed bank `$FA86`
- first layout pointer: fixed bank `$FA88-$FA89`, resolving to `$8497`
- layout data: PRG bank `2` at `$8497`
- tile set pointer: PRG bank `4` at `$841D`
- tile data base: `$841D + $44 = $8461`
- attribute table: PRG bank `4` at `$841E`
- background palette: PRG bank `4` at `$9EA2`

The main 8x8 block layout at bank `2:$8497` is:

```text
18 3c 3d 3d 3d 3d 3d 3e
18 12 21 1f 21 1f 21 13
18 12 2c 38 2c 38 2c 13
40 12 21 1f 15 38 21 13
40 12 2c 1f 20 37 2c 13
42 10 25 25 2b 25 25 11
01 01 02 0a 01 01 01 01
12 29 04 26 38 38 13 18
```

Each block index selects 16 tile bytes from bank `4:$8461 + index * 16`, arranged as a 4x4 tile block. The matching attribute byte is `bank4[$841E + index]`.

That base layout reproduces the stable middle of page 0. Rows `0-3` and `28-29` are now calculated through the row-streaming rules observed in the fixed-bank renderer instead of a hard-coded tile descriptor.

The relevant row-stream rules are:

- `$EAA6` maps a world tile row to `section`, `layoutRow`, and `tileRow`.
- `tileRow = worldRow & 3`.
- `layoutRow = floor(worldRow / 4) % 7`.
- `section = floor(floor(worldRow / 4) / 7)`.
- `$E804` selects the layout pointer as `header + 2 + 2 * (header[0] * section + columnGroup)`.
- `$EB35` maps the streamed row to a nametable row with `worldRow % 30`.

For the current Jova fixture, the streamed rows are:

```text
world 28 -> nametable 28, section 1, layout row 0, tile row 0, layout $83B7
world 29 -> nametable 29, section 1, layout row 0, tile row 1, layout $83B7
world 30 -> nametable 00, section 1, layout row 0, tile row 2, layout $83B7
world 31 -> nametable 01, section 1, layout row 0, tile row 3, layout $83B7
world 32 -> nametable 02, section 1, layout row 1, tile row 0, layout $83B7
world 33 -> nametable 03, section 1, layout row 1, tile row 1, layout $83B7
```

Attributes are assembled from per-tile palette quadrant bits rather than copied as whole block bytes. Attribute row `0` falls out of the streamed rows naturally. Attribute row `7` includes the non-visible conceptual tile rows `30-31`; the exact captured high nibbles for that hidden half are still represented as `hiddenAttributeHighNibbles`. Those bits preserve byte-exact nametable comparison but do not affect visible 240-pixel rendering for the current scroll.

Current comparison against `out/captures/jova-day/ppu-2000-2fff-nametables.bin`:

```text
page 0 differences: 0 / 1024
page 2 differences: 0 / 1024
```

Pages `1` and `3` are not generated by this checkpoint; they contain non-visible nametable history in the Mesen fixture.

The same descriptor-driven renderer also covers Jova's right-side nametable page:

- layout header: fixed bank `$FA86`
- column group: `3`
- layout pointer: fixed bank `$FA8E-$FA8F`, resolving to `$8507`
- streamed row layout: bank `2:$845F`

`npm run render:jova-right-native` compares against `out/captures/jova-right-day/ppu-2000-2fff-nametables.bin`:

```text
page 1 differences: 0 / 1024
page 3 differences: 0 / 1024
```

`npm run render:jova-native-png` and `npm run render:jova-right-native-png`
combine the ROM-native nametable bytes with ROM CHR banks `0/1` and palette
`4:$9EA2`. Both generated background PNGs compare at 0 differing pixels
against the corresponding PPU-background reconstructions.

## Jova Woods Native Decoder Checkpoint

`npm run capture:jova-woods` loads the local save-state fixture at `out/states/jova-woods.mss`, waits 30 frames, and writes `out/captures/jova-woods-day/`. The `.mss` is a local emulator artifact and is not committed.

The capture identifies this runtime context:

- `objset`: `$30 = 02`
- `area`: `$50 = 00`
- `submap`: `$51 = 00`
- CHR banks: `2` and `3`
- actor pointer: `$3D/$3E = $9FE4`, matching Jova Woods actor data
- tile set pointer: `$63/$64 = $8CF4`

`npm run render:jova-woods-native` renders the first descriptor-backed overworld ROM-native checkpoint:

```sh
npm run render:jova-woods-native
```

The `jova-woods-day` descriptor now follows the table-derived layout header
path. It reads the visible Jova Woods background from these ROM addresses:

- layout header: PRG bank `2` at `$A23E`
- first layout pointer: PRG bank `2` at `$A240-$A241`, resolving to `$A4DA`
- layout data: PRG bank `2` at `$A4DA`
- tile set pointer: PRG bank `4` at `$8CF4`
- tile data base: `$8CF4 + $46 = $8D3A`
- attribute table: PRG bank `4` at `$8CF5`
- background palette: PRG bank `4` at `$9FC6`

The visible 8x7 block layout at bank `2:$A4DA` is:

```text
00 41 00 41 00 41 00 41
41 12 41 12 41 12 41 12
11 11 11 11 11 11 11 11
10 10 10 10 10 10 10 10
15 15 15 15 15 15 15 15
14 14 14 14 14 14 14 14
17 17 17 17 17 17 17 17
```

Current comparison against `out/captures/jova-woods-day/ppu-2000-2fff-nametables.bin`:

```text
page 0 differences: 0 / 1024
page 2 differences: 0 / 1024
```

`npm run render:jova-woods-native-png` combines the ROM-native nametable bytes
with ROM CHR banks `2/3` and palette `4:$9FC6`. The generated background PNG
compares at 0 differing pixels against the PPU-background reconstruction.
