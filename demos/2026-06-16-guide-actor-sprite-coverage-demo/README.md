# Guide Actor Sprite Coverage Demo

This sprint demo summarizes the current guide-slice actor-art milestone.

It is intentionally focused on the meaningful result: the current Jova-to-first
guide slice has ROM-backed actor sprite coverage for the NPCs/enemies we need,
and the Jova sign is explicitly classified as a no-sprite background fixture.

## What Is Proven

- Jova `0xAA` man rows render with selector record `0x0D`, selectors
  `0x22/0x23`.
- Jova `0xA8` clue NPC also renders with selector record `0x0D`, selectors
  `0x22/0x23`.
- Jova `0xB5` shepherd rows remain bound to selector record `0x0E`, selectors
  `0x24/0x25`.
- Jova `0xAE` merchant remains bound to selector record `0x0B`, selectors
  `0x1E/0x1F`.
- Jova `0xA4` sign row is not a missing sprite: the dispatch path writes
  selector `0x00`, which decodes to zero metasprite entries.
- Skeleton, fishman, werewolf, and town-night zombie have rendered sprite
  coverage and day/night HP values for guide UI integration.

## Provenance

The generated evidence at `assets/analysis.json` comes from
`npm run decode:guide-actor-sprite-coverage`.

The proof chain is:

1. Verify actor rows directly from ROM file offsets.
2. Resolve town actor IDs to live IDs by the ROM high-bit path.
3. Read actor dispatch entries from bank 1 table `$81D3`.
4. Decode animation records from the fixed-bank selector table rooted at
   `$DDA2`.
5. Render sprites from PRG metasprite tables, CHR ROM banks, and runtime PPU
   palette memory captured from the same ROM execution.

No screenshot crops are used for the sprite art in this demo.

## Regeneration

```sh
npm run decode:guide-actor-sprite-coverage
```

The static demo copies the generated evidence and PNGs into this directory so
it remains reviewable without rerunning the ROM tooling.
