# Background Descriptor Schema

Committed background descriptors live in `data/background-descriptors.json`.
They are small, durable ROM discoveries, not generated artifacts. The goal is for
the same descriptor data to drive a PNG renderer, a browser `<canvas>` renderer,
or future regression tests.

The current schema version is `1`.

## Top-Level File

```json
{
  "schemaVersion": 1,
  "descriptors": []
}
```

Each descriptor is one renderable background family or checkpoint. A descriptor
can include more than one nametable page when the same runtime context and tile
set render adjacent pages, as with Jova town.

## Descriptor Fields

Required fields for `renderer: "native-background-v1"`:

- `id`: stable machine name, such as `jova-day`
- `label`: human-readable name
- `location`, `variant`, `access`: map/catalog metadata
- `paletteMode`: currently `day`; future values should include `night` and fixed interior modes
- `runtimeContext`: observed RAM state used to tie the descriptor back to the game
- `layoutBank`: PRG bank containing block layout bytes
- `tileBank`: PRG bank containing tile/metatile bytes and block attribute bytes
- `tileSetAddress`: CPU address of the tile-set pointer table in `tileBank`
- `widthBlocks`, `heightBlocks`: block grid dimensions rendered into the nametable
- `nametableMirroring`: mapper mirroring observed for the capture, currently `vertical`
- `pages`: one or more nametable page descriptors

Optional fields:

- `layoutHeaderAddress`: fixed-bank pointer table header used to resolve layouts
- `rowsPerLayoutSection`: row-stream section height, currently `7` for Jova town
- `validation`: known capture comparisons for this descriptor

Numbers may be decimal JSON numbers or strings like `"0xFA86"`. The loader
normalizes both forms to integers for rendering.

## Page Fields

Each page describes one nametable page:

- `name`: stable page name
- `page`: nametable page number, `0` through `3`
- `layoutAddress`: direct layout CPU address, used by Jova Woods
- `layoutSection` and `columnGroup`: inputs to `layoutHeaderAddress`, used by Jova town
- `expectedLayoutAddress`: optional guard that verifies pointer-table decoding
- `rowStream`: optional streamed row patch used for wrapped top/bottom rows

`rowStream` fields:

- `startWorldRow`: first world tile row to stream
- `rowCount`: number of tile rows to stream
- `columnGroup`: layout pointer column group for streamed rows
- `columnCount`: number of block columns to stream
- `hiddenAttributeHighNibbles`: byte-exact hidden attribute data when offscreen rows still affect the final nametable bytes

## Current Descriptors

- `jova-day`: Jova town day fixture. Covers page `0` for the starting screen and page `1` for the right-side screen. It uses fixed-bank layout header `$FA86`, PRG bank `2` layouts, and PRG bank `4:$841D` tile-set data.
- `jova-woods-day`: Jova Woods day fixture from the local save state. It uses direct layout `2:$A111` and PRG bank `4:$8CF4` tile-set data.

Both descriptors currently validate exact visible-page nametable parity against
Mesen captures through `npm run render:jova-native`,
`npm run render:jova-right-native`, and `npm run render:jova-woods-native`.
