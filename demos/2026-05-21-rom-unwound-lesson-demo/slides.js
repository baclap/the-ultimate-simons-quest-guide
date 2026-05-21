(function () {
  'use strict';

  const data = {
    atlas: window.EXTERIOR_ATLAS || {},
    audit: window.RENDER_RECIPE_AUDIT || {},
    recipeAtlas: window.RENDER_RECIPE_ATLAS || {},
    topology: window.EXTERIOR_TOPOLOGY || {},
    probes: window.TRANSITION_PROBES || {},
    routine: window.TRANSITION_ROUTINE_DECODER || {},
    world: window.EXTERIOR_WORLD_COMPOSITION || {}
  };

  const slides = [
    {
      id: 'start',
      chapter: 'Orientation',
      eyebrow: 'ROM Unwound',
      title: 'How the Castlevania II ROM gives up a map',
      lede: 'This lesson is for web engineers crossing into ROM reverse engineering: bytes become tables, tables become backgrounds, backgrounds become route segments, and route segments become a topology-aware world draft.',
      html: `
        <div class="stat-row" id="hero-stats"></div>
        <div class="grid two">
          <figure class="figure-card">
            <img src="assets/rom-native/jova-town-left.png" alt="ROM-native Jova town left screen">
            <figcaption>ROM-native Jova town, rendered from decoded layout/tile/palette data.</figcaption>
          </figure>
          <figure class="figure-card">
            <img src="assets/exterior-world-composition/world.png" alt="Full exterior world composition draft">
            <figcaption>The current full exterior world draft: composed evidence, not hand-drawn map art.</figcaption>
          </figure>
        </div>
      `
    },
    {
      id: 'map-of-the-lesson',
      chapter: 'Orientation',
      eyebrow: 'Reading Path',
      title: 'The deck is long because the problem is layered',
      lede: 'The important trick is not any one magic address. It is keeping each layer honest: source bytes, decoded tables, runtime evidence, generated images, graph edges, and solver claims stay separate.',
      html: `
        <div class="pipeline">
          <div><strong>ROM</strong><span>iNES header, PRG banks, CHR banks, mapper state.</span></div>
          <div><strong>Graphics</strong><span>Bitplanes, palettes, nametables, attributes, metatiles.</span></div>
          <div><strong>Backgrounds</strong><span>Context bytes select screen records, layouts, tile sets, palettes.</span></div>
          <div><strong>Evidence</strong><span>Mesen probes validate recipes, positions, and routine bytes.</span></div>
          <div><strong>World</strong><span>Atlas images plus ROM topology become a labeled composition.</span></div>
        </div>
        <div class="callout gold"><strong>Theme for the whole lesson</strong><p>Every artifact asks the same question: did this fact come from ROM data, runtime evidence, a validated family projection, or a deterministic solver choice?</p></div>
      `
    },
    {
      id: 'section-rom',
      chapter: 'ROM Container',
      section: true,
      eyebrow: 'Part 1',
      title: 'The ROM is a small database with code attached',
      lede: 'The first move is to stop treating the game as pixels on screen. Treat it as a file with addressable banks of program bytes and graphics bytes.'
    },
    {
      id: 'rom-as-artifact',
      chapter: 'ROM Container',
      eyebrow: 'Web Analogy',
      title: 'A ROM is closer to a packed deploy artifact than a screenshot',
      lede: 'A web bundle has JS modules, images, config blobs, route manifests, and runtime state. The NES ROM has program banks, graphics banks, pointer tables, compressed-ish streams, and RAM variables.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>What is familiar</strong><p>There are entrypoints, assets, indirection tables, runtime selectors, and rendering state. You can inspect it with parsers, fixtures, and regression checks.</p></div>
          <div class="tile"><strong>What is alien</strong><p>There is no DOM, no filenames, no JSON schema, and no stable high-level API. Meaning is discovered by following pointer math and validating against the running game.</p></div>
        </div>
        <ul class="list">
          <li><strong>PRG ROM</strong> holds code and data tables that the CPU reads.</li>
          <li><strong>CHR ROM</strong> holds tile graphics that the PPU reads.</li>
          <li><strong>RAM</strong> holds the current object set, area, submap, scroll, and transient routine output.</li>
        </ul>
      `
    },
    {
      id: 'ines-header',
      chapter: 'ROM Container',
      eyebrow: 'iNES Header',
      title: 'The first 16 bytes tell the tooling how to split the file',
      lede: 'The project starts by verifying the container. For this ROM, the header declares 8 PRG banks and 16 CHR banks, giving fixed byte boundaries for later address conversion.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Field</th><th>Current value</th><th>Why it matters</th></tr></thead>
            <tbody>
              <tr><td>Magic</td><td><code>4E 45 53 1A</code></td><td>Confirms an iNES/NES-style ROM container.</td></tr>
              <tr><td>PRG ROM</td><td><code>08</code> banks / 131,072 bytes</td><td>CPU-visible program and data banks.</td></tr>
              <tr><td>CHR ROM</td><td><code>10</code> banks / 131,072 bytes</td><td>PPU-visible graphics tile data.</td></tr>
              <tr><td>Mapper</td><td>MMC1 / mapper 1</td><td>Explains bank switching and why the active bank matters.</td></tr>
              <tr><td>CHR start</td><td><code>0x20010</code></td><td>File offset where tile graphics begin.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'ines-parser-code',
      chapter: 'ROM Container',
      eyebrow: 'Code Reading',
      title: 'The parser turns header bytes into durable offsets',
      lede: 'This is the first decoder layer: identify the ROM shape, compute where PRG and CHR start, and reject truncated input before any map logic runs.',
      html: `
        <div class="code-card">
          <header><strong>src/ines.js</strong><span>container parsing</span></header>
          <pre><code>const prgRomBanks = buffer[4];
const chrRomBanks = buffer[5];
const trainerSize = (flags6 &amp; 0x04) ? TRAINER_SIZE : 0;
const prgRomSize = prgRomBanks * PRG_BANK_SIZE;
const chrRomSize = chrRomBanks * CHR_BANK_SIZE;
const prgStart = HEADER_SIZE + trainerSize;
const chrStart = prgStart + prgRomSize;
const expectedSize = chrStart + chrRomSize;</code></pre>
        </div>
        <div class="callout"><strong>What this proves</strong><p>Every later file offset is downstream of these boundaries. If the header split is wrong, every decoded tile, pointer, and table address becomes suspect.</p></div>
      `
    },
    {
      id: 'prg-vs-chr',
      chapter: 'ROM Container',
      eyebrow: 'Two Memory Worlds',
      title: 'PRG and CHR answer different questions',
      lede: 'PRG says what the game does and where its tables live. CHR says what tile shapes exist. A rendered map needs both: layout bytes from PRG choose tile IDs, while CHR provides the pixels behind those IDs.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>PRG ROM</strong><p>Background table pointers, area records, layout headers, metatile definitions, palette transfer tables, transition routines, and code.</p></div>
          <div class="tile"><strong>CHR ROM</strong><p>Pattern-table graphics: two bitplanes per 8x8 tile, banked into the PPU-visible graphics address space.</p></div>
        </div>
        <figure class="figure-card">
          <img src="assets/chr/chr-bank-02.png" alt="CHR bank 02 extracted tile sheet">
          <figcaption>CHR bank 02. It is visually meaningful to us, but to the game it is a bank of 16-byte tile records.</figcaption>
        </figure>
      `
    },
    {
      id: 'cpu-addresses',
      chapter: 'ROM Container',
      eyebrow: 'Address Translation',
      title: 'A CPU address is not automatically a file offset',
      lede: 'The CPU reads PRG ROM through address windows. For switchable banks, the same CPU address can mean different file bytes depending on mapper state.',
      html: `
        <div class="code-card">
          <header><strong>src/background.js</strong><span>CPU address to PRG offset</span></header>
          <pre><code>if (cpuAddress &lt; 0xc000) {
  if (!Number.isInteger(opts.bank)) {
    throw new Error('bank is required for switchable PRG address');
  }
  return info.prgStart + opts.bank * PRG_BANK_SIZE + (cpuAddress - 0x8000);
}

const fixedBank = opts.fixedBank ?? (info.prgRomBanks - 1);
return info.prgStart + fixedBank * PRG_BANK_SIZE + (cpuAddress - 0xc000);</code></pre>
        </div>
        <p class="note">The tooling preserves bank labels such as <code>2:$A23E</code> because the bank is part of the address.</p>
      `
    },
    {
      id: 'bank-switching',
      chapter: 'ROM Container',
      eyebrow: 'MMC1',
      title: 'Bank switching is why evidence carries bank provenance',
      lede: 'When docs say layout header <code>2:$A23E</code> or palette <code>4:$9FC6</code>, the prefix is not decoration. It prevents two different bank windows from being collapsed into one fake global address.',
      html: `
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node"><strong>CPU $8000-$BFFF</strong><span>Switchable PRG window.</span></div>
            <div class="diagram-node"><strong>Bank 2</strong><span>Background layout tables.</span></div>
            <div class="diagram-node"><strong>Bank 4</strong><span>Tile definitions and palettes.</span></div>
            <div class="diagram-node"><strong>CPU $C000-$FFFF</strong><span>Fixed PRG window.</span></div>
            <div class="diagram-node"><strong>Bank 7</strong><span>Renderer and transition code.</span></div>
            <div class="diagram-node"><strong>Evidence</strong><span>Always names bank plus address.</span></div>
          </div>
        </div>
        <div class="callout"><strong>Practical rule</strong><p>When you see a ROM address below <code>$C000</code>, ask which bank was selected. Above <code>$C000</code>, this project usually treats it as the fixed final PRG bank.</p></div>
      `
    },
    {
      id: 'cli-surface',
      chapter: 'ROM Container',
      eyebrow: 'Command Surface',
      title: 'The CLI is a ladder of increasingly semantic decoders',
      lede: 'Early commands prove the container. Later commands decode domain concepts: backgrounds, recipes, topology, transition routine evidence, and world composition.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Command family</th><th>Question answered</th><th>Output shape</th></tr></thead>
            <tbody>
              <tr><td><code>verify-rom</code></td><td>Is this the expected ROM container?</td><td>Header and hash metadata.</td></tr>
              <tr><td><code>extract-chr</code></td><td>What tile graphics exist?</td><td>CHR bank PNG sheets.</td></tr>
              <tr><td><code>inspect-background-context</code></td><td>Which tables render this context?</td><td>Pointer path and descriptor fields.</td></tr>
              <tr><td><code>render-recipe-atlas</code></td><td>Can validated recipe families render broad coverage?</td><td>Image atlas plus confidence manifest.</td></tr>
              <tr><td><code>render:world:exterior</code></td><td>Can the topology graph compose without hand placement?</td><td>World PNG plus provenance JSON.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'section-graphics',
      chapter: 'Graphics Primitives',
      section: true,
      eyebrow: 'Part 2',
      title: 'NES graphics are tile IDs, bitplanes, palette bits, and nametable state',
      lede: 'Before the map can be decoded, the renderer has to speak the PPU grammar.'
    },
    {
      id: 'render-stack',
      chapter: 'Graphics Primitives',
      eyebrow: 'PPU Stack',
      title: 'The visible screen is assembled from several small structures',
      lede: 'A background image is not stored as one bitmap. It is tile graphics plus tile IDs plus attribute bits plus palette bytes plus scroll/mirroring state.',
      html: `
        <div class="pipeline">
          <div><strong>CHR tile</strong><span>16 bytes describe one 8x8 tile shape.</span></div>
          <div><strong>Nametable</strong><span>960 tile IDs choose which CHR tile appears in each cell.</span></div>
          <div><strong>Attribute</strong><span>64 bytes choose palette quadrant bits for tile regions.</span></div>
          <div><strong>Palette</strong><span>16 background bytes map 2-bit color IDs to NES colors.</span></div>
          <div><strong>Scroll</strong><span>Runtime camera state selects the visible viewport.</span></div>
        </div>
      `
    },
    {
      id: 'chr-bitplanes',
      chapter: 'Graphics Primitives',
      eyebrow: 'Bitplanes',
      title: 'Each 8x8 tile is two 1-bit planes folded into 2-bit pixels',
      lede: 'A NES background tile has four color indexes, not true RGB pixels. The two bitplanes combine into values 0, 1, 2, or 3; a palette later decides what those values mean.',
      html: `
        <div class="code-card">
          <header><strong>src/chr.js</strong><span>tile decode loop</span></header>
          <pre><code>for (let y = 0; y &lt; 8; y += 1) {
  const low = buffer[tileOffset + y];
  const high = buffer[tileOffset + y + 8];
  for (let x = 0; x &lt; 8; x += 1) {
    const bit = 7 - x;
    pixels[y * 8 + x] = ((low &gt;&gt; bit) &amp; 1) | (((high &gt;&gt; bit) &amp; 1) &lt;&lt; 1);
  }
}</code></pre>
        </div>
        <div class="callout"><strong>Web analogy</strong><p>This is like decoding a tiny indexed-color sprite sheet from a custom binary format, except the sheet is the native format the hardware consumes.</p></div>
      `
    },
    {
      id: 'chr-banks-gallery',
      chapter: 'Graphics Primitives',
      eyebrow: 'CHR Evidence',
      title: 'CHR bank sheets turn invisible bitplanes into inspectable assets',
      lede: 'The project renders every CHR ROM bank as a tile sheet. The sheets are not the final map, but they make bank selection and bad recipe choices visually obvious.',
      html: `
        <div class="gallery small">
          <figure class="figure-card"><img src="assets/chr/chr-bank-00.png" alt="CHR bank 00"><figcaption>Bank 00: town family.</figcaption></figure>
          <figure class="figure-card"><img src="assets/chr/chr-bank-02.png" alt="CHR bank 02"><figcaption>Bank 02: western overworld.</figcaption></figure>
          <figure class="figure-card"><img src="assets/chr/chr-bank-06.png" alt="CHR bank 06"><figcaption>Bank 06: objset 4 route family.</figcaption></figure>
          <figure class="figure-card"><img src="assets/chr/chr-bank-0b.png" alt="CHR bank 0B"><figcaption>Bank 0B: Castlevania final area.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'indexed-palettes',
      chapter: 'Graphics Primitives',
      eyebrow: 'Indexed Color',
      title: 'Palette bytes color the same tile IDs differently',
      lede: 'The PPU does not store a full RGB color per pixel. The background palette is a small lookup table, which is why day, night, and fixed variants can share layouts and CHR but differ visually.',
      html: `
        <div class="compare">
          <figure><img src="assets/recipe-atlas/images/obj00-area00-sub00-town-of-jova-day.png" alt="Town of Jova day render"><figcaption>Town of Jova, day palette.</figcaption></figure>
          <figure><img src="assets/recipe-atlas/images/obj00-area00-sub00-town-of-jova-night.png" alt="Town of Jova night render"><figcaption>Town of Jova, night palette.</figcaption></figure>
        </div>
        <p class="note">Same broad screen family, different palette selector output.</p>
      `
    },
    {
      id: 'nametables',
      chapter: 'Graphics Primitives',
      eyebrow: 'Nametable',
      title: 'A nametable is a tile-ID grid, not a bitmap',
      lede: 'A visible NES background page is 32 by 30 tile IDs plus 64 attribute bytes. The renderer’s job is to recreate those tile IDs from ROM tables, then paint them with CHR and palette data.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Tile area</strong><p><code>0x3C0</code> bytes select 960 8x8 tiles. These bytes are what the PPU uses as background tile IDs.</p></div>
          <div class="tile"><strong>Attribute area</strong><p><code>0x40</code> bytes select palette bits for 16x16-ish regions. A wrong attribute byte can make the geometry correct but the colors wrong.</p></div>
        </div>
        <figure class="figure-card">
          <img src="assets/rom-native/jova-woods.png" alt="ROM-native Jova Woods background">
          <figcaption>This 256x240 PNG is downstream of a nametable reconstruction, not a copied screenshot.</figcaption>
        </figure>
      `
    },
    {
      id: 'metatiles',
      chapter: 'Graphics Primitives',
      eyebrow: 'Metatiles',
      title: 'The game builds backgrounds from 4x4 tile blocks',
      lede: 'The ROM layout stream does not list every individual 8x8 tile. It lists block indexes. Each block index expands into 16 tile IDs plus palette quadrant information.',
      html: `
        <div class="code-card">
          <header><strong>src/background.js</strong><span>block-to-tile expansion</span></header>
          <pre><code>nametables[page * NAMETABLE_PAGE_SIZE + nametableRow * 32 + nametableColumn] =
  readPrgByte(
    rom,
    info,
    tileBaseAddress + blockIndex * 16 + tileRow * 4 + tileColumn,
    { bank: descriptor.tileBank }
  );</code></pre>
        </div>
        <div class="callout"><strong>Why this matters</strong><p>Once the renderer understands blocks, a compact layout table can become a much larger visible image. That is the first big unwinding move.</p></div>
      `
    },
    {
      id: 'screenshots-not-source',
      chapter: 'Graphics Primitives',
      eyebrow: 'Source Of Truth',
      title: 'Screenshots validate the decoder; they do not define the map',
      lede: 'The project uses emulator captures like test fixtures. They tell us whether decoded ROM logic matches the game, but the final renderer should not need to traverse every screen and paste screenshots together.',
      html: `
        <div class="compare">
          <figure><img src="assets/captures/jova-town-day/screenshot.png" alt="Mesen Jova town screenshot"><figcaption>Emulator screenshot with sprites and runtime state.</figcaption></figure>
          <figure><img src="assets/rom-native/jova-town-left.png" alt="ROM-native Jova background"><figcaption>ROM-native background render from decoded data.</figcaption></figure>
        </div>
        <div class="callout gold"><strong>Calibration oracle</strong><p>Mesen proves the renderer, but the renderer’s source art remains the ROM.</p></div>
      `
    },
    {
      id: 'section-backgrounds',
      chapter: 'Background Reconstruction',
      section: true,
      eyebrow: 'Part 3',
      title: 'Background reconstruction is table walking plus block expansion',
      lede: 'The core question becomes: given the game’s current map context, which ROM tables produce the visible nametable?'
    },
    {
      id: 'runtime-context',
      chapter: 'Background Reconstruction',
      eyebrow: 'Runtime Context',
      title: 'Three RAM bytes anchor the background lookup',
      lede: 'The decoder’s map context starts with live RAM: object set, area, and raw submap. These bytes connect the running game to the ROM’s area and screen-record tables.',
      html: `
        <div class="stat-row">
          <div class="stat"><strong>$30</strong><span>runtime object set</span></div>
          <div class="stat"><strong>$50</strong><span>runtime area</span></div>
          <div class="stat"><strong>$51</strong><span>raw submap plus flags</span></div>
          <div class="stat"><strong>$63/$64</strong><span>runtime tile-set pointer evidence</span></div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Location</th><th>Context</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td>Jova</td><td><code>0:0:$00</code></td><td>Town object set, first town area, base submap.</td></tr>
              <tr><td>Jova Woods</td><td><code>2:0:$00</code></td><td>Western overworld, first area, first submap.</td></tr>
              <tr><td>Dora Woods - Part 2</td><td><code>2:0:$83</code></td><td>Runtime palette-context alias with high-bit flags.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'pointer-path',
      chapter: 'Background Reconstruction',
      eyebrow: 'Pointer Path',
      title: 'The background path is a chain of table indirections',
      lede: 'The game does not say "render Dora Woods" in a friendly API. It walks tables: object set to area table, area to screen record, screen record to layout index, layout index to layout header, object set to tile set.',
      html: `
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node"><strong>objset</strong><span><code>$F7AB + objset * 2</code></span></div>
            <div class="diagram-node"><strong>area table</strong><span>area entry points at area record.</span></div>
            <div class="diagram-node"><strong>screen record</strong><span><code>$09 + submap * 2</code></span></div>
            <div class="diagram-node"><strong>layout index</strong><span>first screen-record byte.</span></div>
            <div class="diagram-node"><strong>layout header</strong><span><code>$F7FB</code> table path.</span></div>
            <div class="diagram-node"><strong>tile set</strong><span><code>$F7D1</code> table path.</span></div>
          </div>
        </div>
        <p class="note">Most reverse engineering progress in this repo comes from turning those paths into durable metadata instead of one-off notes.</p>
      `
    },
    {
      id: 'derive-context-code',
      chapter: 'Background Reconstruction',
      eyebrow: 'Code Reading',
      title: 'deriveBackgroundContext captures the common table walk',
      lede: 'This helper is the bridge from runtime tuple to descriptor fields. It centralizes the ROM table path so Jova, Jova Woods, and atlas candidates all speak the same language.',
      html: `
        <div class="code-card">
          <header><strong>src/background-context.js</strong><span>table path</span></header>
          <pre><code>const areaTablePointerAddress = AREA_TABLE_POINTERS + objset * 2;
const areaTableAddress = readBackgroundTableWord(rom, info, areaTablePointerAddress);
const areaRecordPointerAddress = areaTableAddress + area * 2;
const areaRecordAddress = readBackgroundTableWord(rom, info, areaRecordPointerAddress);
const screenRecordPointerAddress = areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + submap * 2;
const screenRecordAddress = readBackgroundTableWord(rom, info, screenRecordPointerAddress);
const layoutIndex = readBackgroundTableByte(rom, info, screenRecordAddress);</code></pre>
        </div>
      `
    },
    {
      id: 'screen-records',
      chapter: 'Background Reconstruction',
      eyebrow: 'Screen Records',
      title: 'A screen record is where map identity becomes render data',
      lede: 'The screen record gives the layout index and sometimes special markers. The atlas preserves those markers because a weird byte today can become tomorrow’s decoded rule.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Ordinary case</strong><p>Byte 0 can act as the layout index. The decoder follows that index into the layout-header table for the object set.</p></div>
          <div class="tile"><strong>Special marker case</strong><p>Markers like <code>FD</code>/<code>FE</code> are preserved in metadata. For the known exterior cases, byte 1 acts as the effective layout index.</p></div>
        </div>
        <div class="callout"><strong>Engineering habit</strong><p>Do not discard unexplained bytes just because the current image can render. Keep them near the generated artifact so future routines can be tied back to evidence.</p></div>
      `
    },
    {
      id: 'layout-headers',
      chapter: 'Background Reconstruction',
      eyebrow: 'Layout Headers',
      title: 'Layout headers describe a grid of column groups and sections',
      lede: 'The atlas breakthrough was realizing layout headers are two-dimensional: horizontal column-group count plus vertical section count. This is how multi-screen and multi-row areas stopped being cropped to one strip.',
      html: `
        <div class="compare">
          <figure><img src="assets/layouts/dora-top-row.png" alt="Dora top row layout before full grid"><figcaption>Dora Woods Part 2: top row only.</figcaption></figure>
          <figure><img src="assets/layouts/dora-full-grid.png" alt="Dora full grid layout"><figcaption>Dora Woods Part 2: decoded full grid.</figcaption></figure>
        </div>
        <p class="note">Header byte 0 gives horizontal column groups; header byte 1 gives vertical sections.</p>
      `
    },
    {
      id: 'jova-layout-bytes',
      chapter: 'Background Reconstruction',
      eyebrow: 'Concrete Layout',
      title: 'Jova town’s stable middle is an 8x8 block-index grid',
      lede: 'This table is not pixels. It is block indexes. Each value selects a 4x4 tile block from the tile-set data, which then expands into visible background tiles.',
      html: `
        <div class="code-card">
          <header><strong>Jova layout at bank 2:$8497</strong><span>block indexes</span></header>
          <pre><code>18 3c 3d 3d 3d 3d 3d 3e
18 12 21 1f 21 1f 21 13
18 12 2c 38 2c 38 2c 13
40 12 21 1f 15 38 21 13
40 12 2c 1f 20 37 2c 13
42 10 25 25 2b 25 25 11
01 01 02 0a 01 01 01 01
12 29 04 26 38 38 13 18</code></pre>
        </div>
        <div class="callout"><strong>Decoder intuition</strong><p>Once you can turn this grid into a nametable, the ROM has stopped being opaque. You can ask "which block index is wrong?" instead of staring at a broken image.</p></div>
      `
    },
    {
      id: 'tile-set-addresses',
      chapter: 'Background Reconstruction',
      eyebrow: 'Tile Set Data',
      title: 'The tile-set pointer gives both block geometry and palette bits',
      lede: 'The descriptor stores the tile-set CPU address and tile bank. At render time, the first byte acts as an offset to the tile definition base; neighboring bytes hold block attribute data.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Jova</strong><p>Tile set <code>4:$841D</code>, offset <code>$44</code>, tile base <code>4:$8461</code>, palette <code>4:$9EA2</code>.</p></div>
          <div class="tile"><strong>Jova Woods</strong><p>Screen <code>2:$A1A0</code>, layout header <code>2:$A23E</code>, visible layout <code>2:$A4DA</code>, tile set <code>4:$8CF4</code>.</p></div>
        </div>
        <figure class="figure-card">
          <img src="assets/rom-native/jova-town-right.png" alt="ROM-native Jova right screen">
          <figcaption>Jova right-side page uses the same descriptor path with a different column group.</figcaption>
        </figure>
      `
    },
    {
      id: 'row-streaming',
      chapter: 'Background Reconstruction',
      eyebrow: 'Row Streaming',
      title: 'Top and bottom rows come from the scrolling renderer, not hard-coded edge tiles',
      lede: 'The fixed-bank renderer streams rows into nametable space as the world scrolls. The decoder reproduces that row math so visible rows and hidden attribute bits line up with captures.',
      html: `
        <div class="code-card">
          <header><strong>src/background.js</strong><span>world row to layout row</span></header>
          <pre><code>let layoutRow = worldRow &gt;&gt; 2;
let section = 0;
while (layoutRow &gt;= descriptor.rowsPerLayoutSection) {
  layoutRow -= descriptor.rowsPerLayoutSection;
  section += 1;
}

return {
  section,
  layoutRow,
  tileRow: worldRow &amp; 0x03,
  nametableRow: ((worldRow % 30) + 30) % 30
};</code></pre>
        </div>
      `
    },
    {
      id: 'descriptors',
      chapter: 'Background Reconstruction',
      eyebrow: 'Descriptor Data',
      title: 'Descriptors preserve discoveries as reusable renderer inputs',
      lede: 'The committed descriptor file is intentionally small. It is not generated art. It is a durable record of ROM addresses, runtime context, palette mode, page selection, row streaming, and validation captures.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Descriptor field</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>runtimeContext</code></td><td>Ties a renderable background back to live game RAM.</td></tr>
              <tr><td><code>layoutHeaderAddress</code></td><td>Locates the layout pointer grid in PRG ROM.</td></tr>
              <tr><td><code>tileSetAddress</code></td><td>Locates block definitions and attribute bytes.</td></tr>
              <tr><td><code>paletteAddress</code></td><td>Provides background palette bytes for PNG output.</td></tr>
              <tr><td><code>pages</code></td><td>Describes which nametable pages and column groups to render.</td></tr>
              <tr><td><code>validation</code></td><td>Records known parity against Mesen-derived artifacts.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'native-checkpoints',
      chapter: 'Background Reconstruction',
      eyebrow: 'ROM-Native Output',
      title: 'The first checkpoints prove the renderer can draw real backgrounds',
      lede: 'Jova town and Jova Woods are not screenshots. They are produced from descriptor nametables, ROM CHR banks, and ROM palette bytes, then checked against captured PPU-background reconstructions.',
      html: `
        <div class="gallery">
          <figure class="figure-card"><img src="assets/rom-native/jova-town-left.png" alt="Jova town left"><figcaption>Jova town, left viewport.</figcaption></figure>
          <figure class="figure-card"><img src="assets/rom-native/jova-town-right.png" alt="Jova town right"><figcaption>Jova town, right viewport.</figcaption></figure>
          <figure class="figure-card"><img src="assets/rom-native/jova-woods.png" alt="Jova Woods"><figcaption>Jova Woods, overworld family.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'section-validation',
      chapter: 'Validation',
      section: true,
      eyebrow: 'Part 4',
      title: 'Validation keeps the romance of reverse engineering from becoming fan fiction',
      lede: 'The project uses emulator captures to prove hypotheses, not to replace decoding.'
    },
    {
      id: 'mesen-oracle',
      chapter: 'Validation',
      eyebrow: 'Mesen Role',
      title: 'Mesen is a calibration oracle',
      lede: 'A capture gives screenshot pixels, CPU RAM, PPU pattern memory, nametable memory, palette memory, sprite OAM, and state metadata. Those artifacts let the renderer compare bytes and images directly.',
      html: `
        <div class="grid three">
          <div class="tile"><strong>CPU RAM</strong><p>Context bytes, actor pointer, tile-set pointer, transition routine output.</p></div>
          <div class="tile"><strong>PPU memory</strong><p>Pattern tables, nametables, and palette bytes actually visible to the hardware.</p></div>
          <div class="tile"><strong>OAM</strong><p>Sprite clusters used to infer Simon placement during transition probes.</p></div>
        </div>
        <figure class="figure-card">
          <img src="assets/captures/dora-woods-part-2-day/screenshot.png" alt="Dora Woods Part 2 capture">
          <figcaption>Dora Woods Part 2 capture: a validation fixture, not the final source art.</figcaption>
        </figure>
      `
    },
    {
      id: 'capture-artifacts',
      chapter: 'Validation',
      eyebrow: 'Fixture Files',
      title: 'A good capture is a small forensic packet',
      lede: 'The save-state probes are valuable because they expose the exact state the game selected. A screenshot alone would hide the CHR banks, palette bytes, and runtime context that explain the image.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Artifact</th><th>What it proves</th></tr></thead>
            <tbody>
              <tr><td><code>screenshot.png</code></td><td>What the player sees, including sprites.</td></tr>
              <tr><td><code>cpu-0000-07ff.bin</code></td><td>Zero-page, low RAM, runtime context, routine bytes, staging RAM.</td></tr>
              <tr><td><code>ppu-0000-1fff-patterns.bin</code></td><td>Live pattern-table CHR bank fingerprint.</td></tr>
              <tr><td><code>ppu-2000-2fff-nametables.bin</code></td><td>Actual background tile ID and attribute state.</td></tr>
              <tr><td><code>ppu-3f00-3f1f-palettes.bin</code></td><td>Live background and sprite palette bytes.</td></tr>
              <tr><td><code>oam-0000-00ff-sprites.bin</code></td><td>Sprite placement evidence.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'reconstruction',
      chapter: 'Validation',
      eyebrow: 'Round Trip',
      title: 'PPU reconstruction creates the baseline the ROM renderer must match',
      lede: 'One renderer reconstructs what Mesen captured from PPU memory. The ROM-native renderer independently derives what should be there from ROM tables. A pixel diff between them is the hard check.',
      html: `
        <div class="compare">
          <figure><img src="assets/captures/jova-town-day/background.png" alt="PPU reconstructed Jova background"><figcaption>Background reconstructed from captured PPU state.</figcaption></figure>
          <figure><img src="assets/rom-native/jova-town-left.png" alt="ROM-native Jova background"><figcaption>Background rendered from ROM-native descriptor data.</figcaption></figure>
        </div>
        <div class="callout"><strong>Why two renderers?</strong><p>One proves what the emulator had in memory. The other proves the project understands how the ROM produced that memory.</p></div>
      `
    },
    {
      id: 'zero-diff',
      chapter: 'Validation',
      eyebrow: 'Pixel Parity',
      title: 'The key checkpoints round-trip exactly',
      lede: 'Exact parity is a huge confidence jump. It means the renderer is not merely visually close; for those pages, the nametable and PNG output match the captured evidence.',
      html: `
        <div class="stat-row">
          <div class="stat"><strong>0</strong><span>Jova left differing pixels</span></div>
          <div class="stat"><strong>0</strong><span>Jova right differing pixels</span></div>
          <div class="stat"><strong>0</strong><span>Jova Woods differing pixels</span></div>
          <div class="stat"><strong>0</strong><span>Visible-page nametable diffs for validated checkpoints</span></div>
        </div>
        <ul class="list">
          <li><strong>Byte parity</strong> catches structural mistakes before they become visual guesswork.</li>
          <li><strong>PNG parity</strong> proves CHR banks, palette bytes, and render assembly agree with the fixture.</li>
        </ul>
      `
    },
    {
      id: 'fixture-strategy',
      chapter: 'Validation',
      eyebrow: 'Scaling Strategy',
      title: 'Representative probes beat exhaustive traversal',
      lede: 'The project does not need a save state for every single screen before rendering broad coverage. It needs representative probes for each recipe family, then honest confidence labels for projected cases.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Validated</strong><p>This exact context and variant has fixture evidence. It can be used as a strong calibration point.</p></div>
          <div class="tile"><strong>Projected</strong><p>This context uses a recipe family validated elsewhere. It is useful output, but its confidence is different.</p></div>
        </div>
        <div class="callout red"><strong>Guardrail</strong><p>When a projected render looks wrong, that is evidence about a missing rule. It should not be patched with a one-off visual override.</p></div>
      `
    },
    {
      id: 'section-recipes',
      chapter: 'Recipes And Palettes',
      section: true,
      eyebrow: 'Part 5',
      title: 'Render recipes explain which CHR banks and palette bytes belong to each context',
      lede: 'Once backgrounds can render, the next problem is choosing the right graphics recipe for every location and variant.'
    },
    {
      id: 'recipe-definition',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Recipe Model',
      title: 'A render recipe is the missing state around layout data',
      lede: 'The layout tells you which blocks exist. The recipe tells you which CHR banks and palette bytes make those blocks look like the running game.',
      html: `
        <div class="grid three">
          <div class="tile"><strong>Layout source</strong><p>Screen records, layout headers, and column-group tables tell the renderer which block indexes to draw.</p></div>
          <div class="tile"><strong>CHR source</strong><p>Captured pattern memory is fingerprinted against CHR ROM banks to identify the live graphics banks.</p></div>
          <div class="tile"><strong>Palette source</strong><p>Runtime context and variant walk the ROM selector path to a raw 16-byte background palette.</p></div>
        </div>
      `
    },
    {
      id: 'chr-fingerprints',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Fingerprinting',
      title: 'CHR bank matching turns live PPU patterns into ROM evidence',
      lede: 'The audit slices captured PPU pattern memory into 4 KB slots and compares each slot to every CHR ROM bank slice. Exact matches promote bank choices from visual hunches to byte evidence.',
      html: `
        <div class="code-card">
          <header><strong>src/render-recipe-audit.js</strong><span>CHR matching</span></header>
          <pre><code>for (let slot = 0; slot &lt; 2; slot += 1) {
  const captured = capturedPatterns.subarray(slot * 0x1000, slot * 0x1000 + 0x1000);
  const matches = [];
  for (let bank = 0; bank &lt; totalBanks; bank += 1) {
    const source = rom.subarray(info.chrStart + bank * 0x1000, info.chrStart + bank * 0x1000 + 0x1000);
    if (sameBytes(captured, source)) matches.push(bank);
  }
}</code></pre>
        </div>
      `
    },
    {
      id: 'audit-summary',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Audit Artifact',
      title: 'The current audit resolves every configured probe',
      lede: 'The audit is not primarily about pretty images. It is a machine-readable evidence table saying which live contexts had exact CHR and palette selector matches.',
      html: `
        <div class="stat-row" id="audit-stats"></div>
        <div class="table-wrap">
          <table id="audit-sample">
            <thead><tr><th>Probe</th><th>Runtime context</th><th>CHR banks</th><th>Palette transfer</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      `
    },
    {
      id: 'palette-selector',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Palette Path',
      title: 'Palette selection is another ROM table walk',
      lede: 'For day/night backgrounds, the renderer follows the runtime context through palette index pointers, variant-specific lists, transfer IDs, and the bank 7 transfer pointer table.',
      html: `
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node"><strong>Context</strong><span><code>objset/area/submap</code></span></div>
            <div class="diagram-node"><strong><code>2:$F7C5</code></strong><span>palette table pointer by object set.</span></div>
            <div class="diagram-node"><strong>Index list</strong><span>area plus day/night offset.</span></div>
            <div class="diagram-node"><strong>Transfer ID</strong><span>submap selects transfer byte.</span></div>
            <div class="diagram-node"><strong><code>7:$8895</code></strong><span>transfer pointer table.</span></div>
            <div class="diagram-node"><strong>Palette bytes</strong><span>raw 16-byte background palette.</span></div>
          </div>
        </div>
        <div class="compare">
          <figure><img src="assets/palette-images/dabis-path-before.png" alt="Dabi's Path before palette fix"><figcaption>Before: wrong palette/recipe path.</figcaption></figure>
          <figure><img src="assets/palette-images/dabis-path-current.png" alt="Dabi's Path after palette fix"><figcaption>After: selector resolves transfer <code>$26</code> to palette <code>4:$A00A</code>.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'dora-alias',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Alias Case',
      title: 'Dora Woods proves layout context and palette context can diverge',
      lede: 'Dora Woods - Part 2 was the useful trap: the atlas layout candidate is <code>2:8:2</code>, while the live runtime palette selector context is <code>2:0:$83</code>.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Layout identity</strong><p>Used to find the screen record and layout-space segment.</p></div>
          <div class="tile"><strong>Runtime palette identity</strong><p>Used to resolve the palette selector path through live RAM bytes.</p></div>
        </div>
        <figure class="figure-card">
          <img src="assets/palette-images/dora-woods-part-2-current.png" alt="Dora Woods Part 2 current render">
          <figcaption>Dora Woods - Part 2: the alias is preserved instead of flattened away.</figcaption>
        </figure>
      `
    },
    {
      id: 'variants',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Variants',
      title: 'Day, night, and fixed variants are first-class outputs',
      lede: 'Outdoor areas usually have day and night palettes. Interiors and Castlevania final area behave differently, so the recipe resolver represents fixed variants rather than forcing a fake day/night pair.',
      html: `
        <div class="gallery">
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj02-area00-sub00-jova-woods-day.png" alt="Jova Woods day"><figcaption>Jova Woods day.</figcaption></figure>
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj02-area00-sub00-jova-woods-night.png" alt="Jova Woods night"><figcaption>Jova Woods night.</figcaption></figure>
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj05-area00-sub00-castlevania-fixed.png" alt="Castlevania fixed"><figcaption>Castlevania final area fixed palette.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'recipe-atlas',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Atlas Coverage',
      title: 'The recipe atlas applies validated families across the exterior inventory',
      lede: 'The atlas is where isolated probes become broad rendered coverage. It records whether each entry is exact validated evidence or a projected member of a validated family.',
      html: `
        <div class="stat-row" id="recipe-stats"></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>validated</code></td><td>Exact context and variant has a save-state probe.</td></tr>
              <tr><td><code>projected</code></td><td>Context uses recipe family validated by representative probes.</td></tr>
              <tr><td><code>blocked</code></td><td>Not enough recipe information to render safely.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'recipe-gallery',
      chapter: 'Recipes And Palettes',
      eyebrow: 'Rendered Families',
      title: 'When recipes are right, unrelated places become coherent',
      lede: 'The same machinery renders towns, woods, bridges, mansions, mountains, and the final area. The point is not hand-polishing each output; it is proving the families are explainable.',
      html: `
        <div class="gallery">
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj01-area01-sub00-berkeley-mansion-door-day.png" alt="Berkeley Mansion door"><figcaption>Mansion door family: CHR <code>08/09</code>.</figcaption></figure>
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj04-area03-sub01-castlevania-bridge-day.png" alt="Castlevania Bridge"><figcaption>Objset 4 family: CHR <code>06/07</code>.</figcaption></figure>
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj03-area00-sub00-camilla-cemetery-night.png" alt="Camilla Cemetery night"><figcaption>Objset 3 family, night variant.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'section-topology',
      chapter: 'Topology',
      section: true,
      eyebrow: 'Part 6',
      title: 'The world is a graph before it is a coordinate plane',
      lede: 'Rendered areas are inventory. Topology says which inventory items connect.'
    },
    {
      id: 'topology-model',
      chapter: 'Topology',
      eyebrow: 'Graph Model',
      title: 'Nodes, areas, edges, and routes separate identity from placement',
      lede: 'The topology pass turns atlas candidates into a connected graph. It does not claim final pixel coordinates; it records decoded adjacency and transition semantics.',
      html: `
        <div class="stat-row" id="topology-stats"></div>
        <div class="grid three">
          <div class="tile"><strong>Node</strong><p>One rendered exterior atlas candidate, usually a submap.</p></div>
          <div class="tile"><strong>Area</strong><p>An <code>objset/area</code> group with one or more submap nodes.</p></div>
          <div class="tile"><strong>Edge</strong><p>A submap sequence or decoded boundary transition.</p></div>
        </div>
      `
    },
    {
      id: 'area-records',
      chapter: 'Topology',
      eyebrow: 'Area Records',
      title: 'Area record bytes hold left and right boundary transitions',
      lede: 'For each area, bytes 3 through 8 describe left and right exits. The topology decoder preserves the raw three-byte tuples and the interpreted target.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Record field</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td>byte <code>2</code></td><td>Maximum submap index.</td></tr>
              <tr><td>bytes <code>3..5</code></td><td>Left boundary transition tuple.</td></tr>
              <tr><td>bytes <code>6..8</code></td><td>Right boundary transition tuple.</td></tr>
              <tr><td>bytes <code>9+</code></td><td>Screen record pointers for each submap.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'decode-transition-code',
      chapter: 'Topology',
      eyebrow: 'Code Reading',
      title: 'Transition marker bytes determine how to read the tuple',
      lede: 'The first byte is a marker when it is special; otherwise the tuple is interpreted in the current object set. This is enough for topology even before exact entrance coordinates are decoded.',
      html: `
        <div class="code-card">
          <header><strong>src/exterior-topology.js</strong><span>transition tuple decoder</span></header>
          <pre><code>if (marker === 0xff) {
  kind = 'objset-area';
  target = { objset: second, area: third };
} else if (marker === 0xfb) {
  kind = 'same-objset-area-submap';
  target = {
    objset: source.objset,
    area: second,
    submap: third &amp; 0x7f,
    submapRaw: third,
    submapFlags: third &amp; 0x80
  };
} else {
  kind = 'same-objset-area';
  target = { objset: source.objset, area: third };
}</code></pre>
        </div>
      `
    },
    {
      id: 'transition-marker-table',
      chapter: 'Topology',
      eyebrow: 'Markers',
      title: 'The marker table gives topology without overclaiming coordinates',
      lede: 'The decoded marker tells the graph which node or area is connected. It does not automatically tell the renderer where Simon appears or how the camera lands.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Marker</th><th>Decoded as</th><th>Example use</th></tr></thead>
            <tbody>
              <tr><td><code>$FF</code></td><td>target object set + area</td><td>Cross-family exterior boundary.</td></tr>
              <tr><td><code>$FC</code></td><td>target object set + area with load flag</td><td>Object-set load transition.</td></tr>
              <tr><td><code>$FB</code></td><td>same object set, explicit area + raw submap</td><td>Submap-specific boundary.</td></tr>
              <tr><td><code>$FA</code></td><td>same object set, area with load flag</td><td>Same-family load transition.</td></tr>
              <tr><td>other</td><td>same object set, target area in byte 2</td><td>Ordinary same-family boundary.</td></tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'connector-only',
      chapter: 'Topology',
      eyebrow: 'Transport Honesty',
      title: 'Connector-only edges say "endpoint known, coordinates unknown"',
      lede: 'Deborah Cliff to Bodley Mansion Door is the important example. The ROM transition tuple identifies the endpoint, but the source is special transport, so composition must not pretend it is ordinary left/right adjacency.',
      html: `
        <div class="grid two">
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj04-area01-sub00-deborah-cliff-in-tornado-day.png" alt="Deborah Cliff In Tornado"><figcaption>Deborah Cliff (In Tornado).</figcaption></figure>
          <figure class="figure-card"><img src="assets/recipe-atlas/images/obj01-area04-sub00-bodley-mansion-door-day.png" alt="Bodley Mansion Door"><figcaption>Bodley Mansion Door.</figcaption></figure>
        </div>
        <div class="callout red"><strong>Key distinction</strong><p>The edge is real topology. The world coordinate placement is not decoded yet.</p></div>
      `
    },
    {
      id: 'route-graph',
      chapter: 'Topology',
      eyebrow: 'Demo Route',
      title: 'The graph can already derive a Jova-to-Castlevania route',
      lede: 'The topology pass emits a shortest area-level path through resolved ROM transition edges. This is a schematic route through areas, not a final coordinate map.',
      html: `
        <ul class="list">
          <li><strong>Jova</strong> to Dead River / Belasco Marsh to Alba.</li>
          <li><strong>Sadam Woods</strong> to Ondol to Jam Wasteland / Deborah Cliff.</li>
          <li><strong>Bodley Mansion Door</strong> to Wicked Ditch to Doina.</li>
          <li><strong>North Bridge / Dora Woods</strong> to Yomi to Vrad Graveyard / Castlevania Bridge.</li>
          <li><strong>Castlevania</strong> as the fixed-palette final area.</li>
        </ul>
      `
    },
    {
      id: 'topology-atlas',
      chapter: 'Topology',
      eyebrow: 'Inventory To Graph',
      title: 'The atlas images become graph nodes',
      lede: 'A rendered atlas is still just a catalog until topology ties entries together. Once nodes have edge metadata, a composer can reason about constraints and unresolved classes.',
      html: `
        <div class="gallery">
          <figure class="figure-card"><img src="assets/exterior-atlas/images/obj00-area00-sub00-town-of-jova.png" alt="Town of Jova atlas"><figcaption>Node: Town of Jova.</figcaption></figure>
          <figure class="figure-card"><img src="assets/exterior-atlas/images/obj02-area08-sub00-north-bridge.png" alt="North Bridge atlas"><figcaption>Node: North Bridge.</figcaption></figure>
          <figure class="figure-card"><img src="assets/exterior-atlas/images/obj05-area00-sub00-castlevania.png" alt="Castlevania atlas"><figcaption>Node: Castlevania.</figcaption></figure>
        </div>
      `
    },
    {
      id: 'section-probes',
      chapter: 'Transition Probes',
      section: true,
      eyebrow: 'Part 7',
      title: 'Transition probes explain what topology alone cannot',
      lede: 'Topology says connected. Runtime probes start answering: where does Simon land, what does the camera do, and what routine bytes were written?'
    },
    {
      id: 'probe-harness',
      chapter: 'Transition Probes',
      eyebrow: 'Scripted Evidence',
      title: 'The probe harness drives transitions and records before/after state',
      lede: 'Each probe loads a save state, applies controller input until the expected context appears, waits for settling, and writes frame traces plus RAM/OAM deltas.',
      html: `
        <div class="stat-row" id="probe-stats"></div>
        <div class="grid two">
          <div class="tile"><strong>Why script it?</strong><p>Manual observations are too easy to misremember. Scripted probes make transition evidence repeatable and diffable.</p></div>
          <div class="tile"><strong>Why scoped?</strong><p>The probe set covers representative classes: horizontal edges, interiors, final-area movement, camera-plane deltas, and special transport.</p></div>
        </div>
      `
    },
    {
      id: 'probe-matrix',
      chapter: 'Transition Probes',
      eyebrow: 'Evidence Matrix',
      title: 'Each transition row keeps topology, Simon, camera, and routine bytes separate',
      lede: 'The lesson here is restraint. The analyzer records multiple evidence tracks, but it does not collapse them into a formula before the routine explains all fixture classes.',
      html: `
        <div class="table-wrap">
          <table id="probe-table">
            <thead><tr><th>Step</th><th>Topology</th><th>Simon X/Y</th><th>$70-$73 after</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      `
    },
    {
      id: 'simon-x',
      chapter: 'Transition Probes',
      eyebrow: 'Sprite Staging',
      title: '<code>$0348</code> is promoted as Simon screen-center X evidence',
      lede: 'Across the scoped transition set, sprite-staging RAM at <code>$0348</code> matches the OAM-derived Simon sprite-cluster center. That makes it useful placement evidence without claiming every other coordinate is solved.',
      html: `
        <div class="grid two">
          <div class="tile"><strong>Observed pattern</strong><p>Horizontal transitions land Simon near <code>$10</code> or <code>$E9</code>; interior entries often land near <code>$10</code> or <code>$80</code>.</p></div>
          <div class="tile"><strong>Promotion rule</strong><p>The project promotes the X evidence because it survives multiple transition families and agrees with OAM-derived sprite bounds.</p></div>
        </div>
        <div class="callout"><strong>Careful wording</strong><p>This is screen-center X evidence. It is not a complete world-coordinate system.</p></div>
      `
    },
    {
      id: 'routine-bytes',
      chapter: 'Transition Probes',
      eyebrow: 'Routine Bytes',
      title: '<code>$70-$73</code> are transition-routine outputs, not yet a coordinate formula',
      lede: 'The transition routine writes four low-RAM bytes from stable PCs in fixed bank 7. They are valuable because they tie runtime behavior back to ROM byte windows.',
      html: `
        <div class="stat-row" id="routine-stats"></div>
        <div class="table-wrap">
          <table id="routine-window-table">
            <thead><tr><th>Trace PC</th><th>Fixed bank</th><th>File offset</th><th>Window note</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      `
    },
    {
      id: 'camera-vs-player',
      chapter: 'Transition Probes',
      eyebrow: 'Two Outputs',
      title: 'Player placement and camera placement are separate facts',
      lede: 'Dora changes camera/nametable state while Simon Y stays stable. Castlevania and Deborah change visible Y. Those examples warn against deriving camera from broad area shape or player Y alone.',
      html: `
        <div class="grid three">
          <div class="tile"><strong>Castlevania to Bridge</strong><p>Simon center Y changes <code>8C -> BA</code>.</p></div>
          <div class="tile"><strong>Dora Part 3 to Part 2</strong><p>Camera plane changes while Simon center Y stays <code>6D -> 6D</code>.</p></div>
          <div class="tile"><strong>Deborah transport</strong><p>Special movement writes routine bytes twice before settling.</p></div>
        </div>
      `
    },
    {
      id: 'routine-decoder',
      chapter: 'Transition Probes',
      eyebrow: 'Decoder Artifact',
      title: 'The routine decoder packages evidence for the composer',
      lede: 'Instead of scraping demo tables, the world composer consumes a durable decoder artifact with ROM byte windows, raw write metadata, topology matches, Simon placement, camera state, and role hypotheses.',
      html: `
        <div class="grid two">
          <div class="artifact"><strong>Promoted</strong><p><code>$0348</code> as Simon screen-center X evidence. <code>$70-$73</code> as observed transition-routine output bytes.</p></div>
          <div class="artifact"><strong>Diagnostic</strong><p>Direct visible-Y and camera formulas remain unpromoted until the routine explains the contradictory-looking fixture classes.</p></div>
        </div>
        <div class="code-card">
          <header><strong>Current write PCs</strong><span>fixed bank 7 evidence</span></header>
          <pre><code>$0070 written at 7:$D19E
$0071 written at 7:$D1A3
$0072 written at 7:$D1A8
$0073 written at 7:$D1AD</code></pre>
        </div>
      `
    },
    {
      id: 'section-world',
      chapter: 'World Composition',
      section: true,
      eyebrow: 'Part 8',
      title: 'World composition is constraint solving with provenance labels',
      lede: 'The current full-world draft is useful because it refuses to hide what is solved, inferred, conflicted, connector-only, or unresolved.'
    },
    {
      id: 'composition-inputs',
      chapter: 'World Composition',
      eyebrow: 'Inputs',
      title: 'The composer consumes three evidence streams',
      lede: 'By the time world composition runs, the project has separated pixels, graph constraints, and routine evidence into independent artifacts.',
      html: `
        <div class="grid three">
          <div class="tile"><strong>Topology</strong><p>Exterior nodes, areas, submap edges, and boundary transition tuples.</p></div>
          <div class="tile"><strong>Recipe atlas</strong><p>Rendered segment images, dimensions, variants, and render confidence.</p></div>
          <div class="tile"><strong>Routine decoder</strong><p>Routine-observed edge evidence and placement/camera diagnostics.</p></div>
        </div>
        <div class="pipeline">
          <div><strong>Nodes</strong><span>55 exterior candidates.</span></div>
          <div><strong>Edges</strong><span>87 topology constraints.</span></div>
          <div><strong>Images</strong><span>Atlas PNGs and dimensions.</span></div>
          <div><strong>Evidence</strong><span>Routine-supported labels.</span></div>
          <div><strong>Draft</strong><span>One labeled composition.</span></div>
        </div>
      `
    },
    {
      id: 'world-draft',
      chapter: 'World Composition',
      eyebrow: 'World Draft',
      title: 'All exterior nodes now appear in one composition draft',
      lede: 'This image is not a final pixel-perfect world coordinate claim. It is a rendered graph draft with all exterior areas represented and placement provenance in the manifest.',
      html: `
        <figure class="world-frame">
          <img src="assets/exterior-world-composition/world.png" alt="Full exterior world composition draft">
        </figure>
      `
    },
    {
      id: 'world-provenance',
      chapter: 'World Composition',
      eyebrow: 'Provenance',
      title: 'The manifest says where each placement claim came from',
      lede: 'The high-value result is not that every edge is solved. It is that the output can distinguish solved constraints, routine-supported constraints, solver shifts, connector-only transitions, conflicts, and unresolved edges.',
      html: `
        <div class="stat-row" id="world-stats"></div>
        <div class="table-wrap">
          <table id="world-provenance-table">
            <thead><tr><th>Metric</th><th>Value</th><th>Meaning</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      `
    },
    {
      id: 'no-hand-placement',
      chapter: 'World Composition',
      eyebrow: 'Design Principle',
      title: 'Zero hand-placed coordinates is a research constraint',
      lede: 'Hand placement would make the image prettier faster, but it would also hide the exact unknowns the project needs to decode next.',
      html: `
        <div class="grid two">
          <div class="callout gold"><strong>Allowed</strong><p>ROM-derived topology, validated segment dimensions, routine-supported labels, deterministic overlap avoidance recorded as solver output.</p></div>
          <div class="callout red"><strong>Not allowed</strong><p>Per-area coordinate tweaks that make a problematic edge visually convenient without explaining the underlying rule.</p></div>
        </div>
        <div class="stat-row">
          <div class="stat"><strong>0</strong><span>hand-placed coordinates in the current world draft</span></div>
          <div class="stat"><strong>17</strong><span>conflict constraints preserved as clues</span></div>
          <div class="stat"><strong>1</strong><span>connector-only transition kept honest</span></div>
          <div class="stat"><strong>1</strong><span>unresolved target preserved in metadata</span></div>
        </div>
      `
    },
    {
      id: 'conflicts-as-clues',
      chapter: 'World Composition',
      eyebrow: 'Next Research',
      title: 'Conflicts are the best pointers to missing semantics',
      lede: 'A conflict is not just a broken layout. It is a concentrated clue that side-only topology is missing a vertical offset, special placement rule, camera rule, or transport semantic.',
      html: `
        <ul class="list">
          <li><strong>Decode conflict classes</strong> before promoting new composer rules.</li>
          <li><strong>Validate mansion-door crop/layout assumptions</strong> so template-pending nodes become stronger evidence.</li>
          <li><strong>Connect interior layers</strong> after exterior placement semantics are less ambiguous.</li>
          <li><strong>Keep day, night, and fixed variants</strong> as separate outputs through final map generation.</li>
        </ul>
      `
    },
    {
      id: 'glossary',
      chapter: 'World Composition',
      eyebrow: 'Glossary',
      title: 'The terms you will see everywhere in this repo',
      lede: 'If you remember only one thing: each term is a different layer, and collapsing layers too early is where false certainty comes from.',
      html: `
        <dl class="glossary">
          <div><dt>iNES</dt><dd>ROM container header that declares PRG/CHR sizes, mapper, trainer, and mirroring flags.</dd></div>
          <div><dt>PRG</dt><dd>CPU-visible program/data ROM banks: code, tables, pointers, and routines.</dd></div>
          <div><dt>CHR</dt><dd>PPU-visible pattern graphics, usually decoded as 8x8 indexed-color tiles.</dd></div>
          <div><dt>Nametable</dt><dd>PPU background tile-ID grid plus attribute bytes.</dd></div>
          <div><dt>Metatile</dt><dd>Game-level block that expands into multiple PPU tiles and palette quadrant bits.</dd></div>
          <div><dt>Runtime context</dt><dd>RAM tuple such as <code>$30/$50/$51</code> that tells the game which map context is active.</dd></div>
          <div><dt>Recipe</dt><dd>CHR/palette/render-state evidence needed to paint a decoded layout correctly.</dd></div>
          <div><dt>Topology</dt><dd>Graph of exterior areas and transitions before final pixel-coordinate placement.</dd></div>
        </dl>
      `
    },
    {
      id: 'closing',
      chapter: 'World Composition',
      eyebrow: 'Where To Read Next',
      title: 'The repo is now a trail of evidence, not just scripts',
      lede: 'The best way to dig deeper is to follow one location, such as Jova Woods or Dora Woods, across the docs, source, generated data, and images. Watch how the same bytes get promoted from mystery to descriptor to render to graph node.',
      html: `
        <div class="table-wrap">
          <table>
            <thead><tr><th>File</th><th>What to learn there</th></tr></thead>
            <tbody>
              <tr><td><code>docs/background-decoder-notes.md</code></td><td>How table paths, row streaming, and validated nametable checkpoints were decoded.</td></tr>
              <tr><td><code>docs/render-recipe-audit-notes.md</code></td><td>How CHR/palette evidence is audited from save-state probes.</td></tr>
              <tr><td><code>docs/exterior-topology-notes.md</code></td><td>How transition triples become graph edges.</td></tr>
              <tr><td><code>docs/transition-probe-notes.md</code></td><td>How scripted transitions expose Simon placement, camera evidence, and routine bytes.</td></tr>
              <tr><td><code>docs/exterior-world-composition-notes.md</code></td><td>How the current world draft labels solved, inferred, conflicted, and unresolved placement claims.</td></tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  const deck = document.getElementById('deck');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const chapterLabel = document.getElementById('chapter-label');
  const progressFill = document.getElementById('progress-fill');
  const chapterRail = document.getElementById('chapter-rail');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function summaryOf(value) {
    return value?.summary || {};
  }

  function stat(value, label) {
    return `<div class="stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
  }

  function formatContext(context) {
    if (!context) return 'n/a';
    const parts = [context.objset, context.area, context.submapRaw || context.submap].filter(Boolean);
    return parts.map((part) => String(part).replace(/^0x/i, '')).join('/');
  }

  function firstChrBanks(fixture) {
    const banks = fixture?.chr?.banks || [];
    const labels = banks.map((bank) => bank.matches?.[0]?.bankHex || bank.matches?.[0]?.bank).filter(Boolean);
    return labels.length ? labels.join(' / ') : 'n/a';
  }

  function paletteTransfer(fixture) {
    const selector = fixture?.palette?.selector;
    if (!selector) return 'n/a';
    const transfer = selector.transferId || 'n/a';
    const address = selector.paletteAddress || 'n/a';
    return `${transfer} -> ${address}`;
  }

  function renderDeck() {
    deck.innerHTML = slides.map((slide, index) => {
      const sectionClass = slide.section ? ' section-slide' : '';
      const titleTag = index === 0 ? 'h1' : 'h2';
      return [
        `<section class="slide${sectionClass}" id="${escapeHtml(slide.id)}" data-index="${index}" data-chapter="${escapeHtml(slide.chapter)}">`,
        '<div class="slide-inner">',
        '<header class="slide-header">',
        `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>`,
        slide.section ? `<p class="section-number">${String(chapterIndex(slide.chapter)).padStart(2, '0')}</p>` : '',
        `<${titleTag}>${slide.title}</${titleTag}>`,
        slide.lede ? `<p class="lede">${slide.lede}</p>` : '',
        '</header>',
        slide.html || '',
        '</div>',
        '</section>'
      ].join('');
    }).join('');
  }

  function chapterNames() {
    return [...new Set(slides.map((slide) => slide.chapter))];
  }

  function chapterIndex(name) {
    return chapterNames().indexOf(name) + 1;
  }

  function renderChapterRail() {
    const chapters = chapterNames();
    chapterRail.innerHTML = chapters.map((chapter, index) => {
      const target = slides.find((slide) => slide.chapter === chapter);
      return [
        `<button type="button" data-target="${escapeHtml(target.id)}">`,
        `<strong>${String(index + 1).padStart(2, '0')}</strong>`,
        `<span>${escapeHtml(chapter)}</span>`,
        '</button>'
      ].join('');
    }).join('');

    chapterRail.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-target]');
      if (!button) return;
      show(slides.findIndex((slide) => slide.id === button.dataset.target), true);
    });
  }

  function renderDynamicContent() {
    const auditSummary = summaryOf(data.audit);
    const recipeSummary = summaryOf(data.recipeAtlas);
    const topologySummary = summaryOf(data.topology);
    const probeSummary = summaryOf(data.probes);
    const routineSummary = summaryOf(data.routine);
    const worldSummary = summaryOf(data.world);

    const heroStats = document.getElementById('hero-stats');
    if (heroStats) {
      heroStats.innerHTML = [
        stat(recipeSummary.entries ?? 112, 'recipe atlas entries'),
        stat(topologySummary.nodes ?? 55, 'exterior nodes'),
        stat(topologySummary.edges ?? 87, 'topology edges'),
        stat(worldSummary.handPlacedCoordinates ?? 0, 'hand-placed coords')
      ].join('');
    }

    const auditStats = document.getElementById('audit-stats');
    if (auditStats) {
      auditStats.innerHTML = [
        stat(auditSummary.fixtures ?? 23, 'configured probes'),
        stat(auditSummary.chrExact ?? 23, 'exact CHR matches'),
        stat(auditSummary.paletteSelectorExact ?? 23, 'exact palette selector matches'),
        stat(auditSummary.deferred ?? 0, 'deferred probes')
      ].join('');
    }

    const auditSample = document.querySelector('#audit-sample tbody');
    if (auditSample) {
      const fixtures = (data.audit.fixtures || []).slice(0, 8);
      auditSample.innerHTML = fixtures.map((fixture) => [
        '<tr>',
        `<td><strong>${escapeHtml(fixture.label || fixture.id)}</strong><br><code>${escapeHtml(fixture.id)}</code></td>`,
        `<td><code>${escapeHtml(formatContext(fixture.live?.runtimeContext || fixture.atlasContext))}</code></td>`,
        `<td><code>${escapeHtml(firstChrBanks(fixture))}</code></td>`,
        `<td><code>${escapeHtml(paletteTransfer(fixture))}</code></td>`,
        '</tr>'
      ].join('')).join('');
    }

    const recipeStats = document.getElementById('recipe-stats');
    if (recipeStats) {
      recipeStats.innerHTML = [
        stat(recipeSummary.entries ?? 112, 'entries'),
        stat(recipeSummary.byRecipeStatus?.validated ?? 23, 'validated'),
        stat(recipeSummary.byRecipeStatus?.projected ?? 89, 'projected'),
        stat(recipeSummary.blocked ?? 0, 'blocked')
      ].join('');
    }

    const topologyStats = document.getElementById('topology-stats');
    if (topologyStats) {
      topologyStats.innerHTML = [
        stat(topologySummary.nodes ?? 55, 'nodes'),
        stat(topologySummary.areas ?? 32, 'areas'),
        stat(topologySummary.edges ?? 87, 'edges'),
        stat(topologySummary.boundaryTransitionEdges ?? 64, 'boundary transitions')
      ].join('');
    }

    const probeStats = document.getElementById('probe-stats');
    if (probeStats) {
      probeStats.innerHTML = [
        stat(probeSummary.probes ?? 6, 'scripted probes'),
        stat(probeSummary.transitions ?? 10, 'transitions'),
        stat(probeSummary.completeTransitions ?? 10, 'completed'),
        stat(probeSummary.timeoutTransitions ?? 0, 'timeouts')
      ].join('');
    }

    const probeTable = document.querySelector('#probe-table tbody');
    if (probeTable) {
      const transitions = (data.routine.transitions || []).slice(0, 10);
      probeTable.innerHTML = transitions.map((step) => {
        const routineBytes = (step.routineBytes || []).map((byte) => byte.after).join(' ');
        return [
          '<tr>',
          `<td><strong>${escapeHtml(step.label)}</strong><br><code>${escapeHtml(step.stepId)}</code></td>`,
          `<td><span class="tag">${escapeHtml(step.topology?.matchStatus || 'none')}</span><br><code>${escapeHtml(step.topology?.edgeId || 'no edge')}</code></td>`,
          `<td>X <code>${escapeHtml(step.simon?.beforeX)} -> ${escapeHtml(step.simon?.afterX)}</code><br>Y <code>${escapeHtml(step.simon?.beforeY)} -> ${escapeHtml(step.simon?.afterY)}</code></td>`,
          `<td><code>${escapeHtml(routineBytes || 'n/a')}</code></td>`,
          '</tr>'
        ].join('');
      }).join('');
    }

    const routineStats = document.getElementById('routine-stats');
    if (routineStats) {
      routineStats.innerHTML = [
        stat(routineSummary.transitions ?? 10, 'decoded transitions'),
        stat((routineSummary.routineAddresses || []).length || 4, 'routine bytes'),
        stat((routineSummary.writePcs || []).length || 4, 'write PCs'),
        stat(routineSummary.noHandPlacedCoordinates ? 0 : '?', 'hand-placed coords')
      ].join('');
    }

    const routineWindowTable = document.querySelector('#routine-window-table tbody');
    if (routineWindowTable) {
      const windows = data.routine.romWindows || [];
      routineWindowTable.innerHTML = windows.map((window) => [
        '<tr>',
        `<td><code>${escapeHtml(window.pc)}</code></td>`,
        `<td>${escapeHtml(window.fixedBank)}</td>`,
        `<td><code>${escapeHtml(window.fileOffset)}</code></td>`,
        `<td>${escapeHtml(window.note || `${window.start} to ${window.end}`)}</td>`,
        '</tr>'
      ].join('')).join('');
    }

    const worldStats = document.getElementById('world-stats');
    if (worldStats) {
      worldStats.innerHTML = [
        stat(`${worldSummary.areas ?? 32}/${worldSummary.topologyAreas ?? 32}`, 'areas placed'),
        stat(`${worldSummary.nodes ?? 55}/${worldSummary.topologyNodes ?? 55}`, 'nodes rendered'),
        stat(worldSummary.constraints ?? 87, 'constraints'),
        stat(worldSummary.handPlacedCoordinates ?? 0, 'hand-placed coords')
      ].join('');
    }

    const worldTable = document.querySelector('#world-provenance-table tbody');
    if (worldTable) {
      const rows = [
        ['Solved constraints', worldSummary.solvedConstraints, 'Satisfied or newly placed by topology/submap order.'],
        ['Routine-supported constraints', worldSummary.routineSupportedConstraints, 'Edges with matching transition routine probe evidence.'],
        ['Generic overlap shifts', worldSummary.genericOverlapShifts, 'Deterministic solver choices, not ROM world coordinates.'],
        ['Connector-only transitions', worldSummary.connectorOnlyTransitions, 'Known endpoints without decoded transport coordinates.'],
        ['Conflicts', worldSummary.conflictConstraints, 'Clues for missing vertical or special placement semantics.'],
        ['Unresolved', worldSummary.unresolvedConstraints, 'Edges preserved without spatial claims.']
      ];
      worldTable.innerHTML = rows.map(([label, value, meaning]) => [
        '<tr>',
        `<td><strong>${escapeHtml(label)}</strong></td>`,
        `<td>${escapeHtml(value ?? 'n/a')}</td>`,
        `<td>${escapeHtml(meaning)}</td>`,
        '</tr>'
      ].join('')).join('');
    }
  }

  function indexFromHash() {
    const id = window.location.hash.replace(/^#/, '');
    const index = slides.findIndex((slide) => slide.id === id);
    return index >= 0 ? index : 0;
  }

  function show(index, updateHash) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    document.querySelectorAll('.slide').forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === clamped);
    });

    const active = slides[clamped];
    prev.disabled = clamped === 0;
    next.disabled = clamped === slides.length - 1;
    counter.textContent = `${clamped + 1}/${slides.length}`;
    chapterLabel.textContent = active.chapter;
    progressFill.style.width = `${((clamped + 1) / slides.length) * 100}%`;

    chapterRail.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('active', button.dataset.target === slides.find((slide) => slide.chapter === active.chapter)?.id);
    });

    if (updateHash) {
      history.replaceState(null, '', `#${active.id}`);
      window.scrollTo(0, 0);
    }
  }

  renderDeck();
  renderChapterRail();
  renderDynamicContent();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      show(indexFromHash() - 1, true);
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      show(indexFromHash() + 1, true);
    }
  });

  show(indexFromHash(), false);
}());
