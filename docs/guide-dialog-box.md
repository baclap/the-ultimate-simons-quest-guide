# Guide Dialog Box Proof

The guide dialog box is modeled from the in-game Jova NPC dialog captured in
`out/states/jova-dialog-box.mss`. Regenerate the local proof fixture with:

```sh
node src/index.js mesen-capture-screen \
  --rom roms/cv2.nes \
  --name jova-dialog-box \
  --location Jova \
  --variant day \
  --access outdoor \
  --state out/states/jova-dialog-box.mss \
  --settle-frames 8 \
  --out out/captures/jova-dialog-box \
  --timeout 30

node src/index.js render-ppu-capture \
  --capture out/captures/jova-dialog-box \
  --out out/captures/jova-dialog-box/background.png
```

The PPU composite should compare at `0` differing pixels against Mesen's native
screenshot. The native dialog frame is a `16 x 12` tile box. In the captured
nametable, it uses background palette slot `3` and these tiles:

```text
$47 top-left corner
$48 horizontal border
$49 top-right corner
$4A vertical side
$4B bottom-left corner
$4C bottom-right corner
$00 fill / space
```

The captured palette bytes for slot `3` are:

```text
$0F $11 $20 $15
```

In the visible dialog, `$11` is the blue frame color and `$20` is the white text
color. The guide runtime renders the frame art from decoded CHR tile pixels and
these palette bytes. PNG screenshots are only validation artifacts.

## Start Menu Rules

The horizontal rules used by the in-game Start menu were checked with a Jova
woods save state:

```sh
node src/index.js mesen-capture-screen \
  --rom roms/cv2.nes \
  --name game-menu-jova-woods-start \
  --state out/states/jova-woods.mss \
  --settle-frames 140 \
  --inputs start:50:16 \
  --out out/captures/game-menu-jova-woods-start
```

In that capture, the menu box is drawn in nametable page `0` from tile columns
`4..19` and tile rows `2..19`. Internal separator rows `9`, `11`, and `14` keep
the side tiles `$4A` at columns `4` and `19`, then draw `$48` across the interior
columns `5..18`. Attribute samples across those rows all select background
palette slot `3`. Guide-authored dashed separator lines therefore render as
repeated dialog horizontal-border tile `$48` across the dialog interior, not as
font hyphen glyphs.

## Layout Rules

The browser dialog keeps the frame tile language exact, but can grow by whole
tiles for guide text:

- cell size is fixed at `8 x 8` native pixels;
- text starts two tiles from the left edge and two tiles below the top edge;
- one blank tile row is left between text rows;
- total tile width is `text columns + 4`;
- total tile height is `line count * 2 + 2`;
- text lines containing only three or more hyphens reserve a text row and render
  a Start-menu-style `$48` rule across the interior columns;
- text is display-normalized against `guide/assets/fonts/cv2-dialog.json`.

Dialogs intentionally do not paginate for short viewports. The box should render
all wrapped lines in one game-style frame and rely on anchored placement,
clamping, and the map's normal zoom/pan behavior to keep the selection
recoverable.

The live guide renders the full frame and fill to a canvas at the active tile
dimensions, then overlays normal HTML text in the `CV2 Dialog` font for
selection/copy behavior. The verification renderer still tile-renders the native
sample so the frame, spacing, glyph mapping, and palette can be compared against
the capture.

The close control is guide-authored UI, not an original game widget. It uses a
small runtime-rendered dialog frame and the `CV2 Dialog` `X` glyph so it stays
visually attached to the game dialog surface without implying ROM evidence for
the control itself.

Map labels also reuse the same runtime-rendered dialog frame tiles, but with a
guide-authored grey border palette override matching the former modern label
stroke. Their text stays in HTML using the `CV2 Dialog` font so labels remain
layout-aware and accessible while the frame language stays game-derived.

Guide-authored dialog boxes use the same grey visual tone as labels, but with an
opaque palette override. Labels stay translucent because they sit over the map;
dialogs need an opaque frame so the map cannot show through the detached close
button. Blue remains reserved for real game dialog text decoded from the guide
data; grey identifies game-style guide presentation such as enemy HP and
breakable-block guidance.

Unsupported display glyphs become `?` in the displayed dialog. Manifest text is
not mutated.

## Runtime Use Policy

The CV2 dialog surface is reserved for concise player-facing text that benefits
from looking like in-game information. This includes NPC, merchant, and sign
messages decoded from the guide data, plus short enemy HP summaries that use the
fixed template:

```text
<Enemy Name>
----------
Day HP - #
Night HP - #
```

Secret pickup/clue actors that combine ROM text with guide explanation render as
a stacked dialog bundle. The guide-authored grey box comes first; the decoded
blue game dialog sits below it and overlaps by one tile so the blue top border
replaces the grey bottom border. The bundle has one shared close control.
Low-level evidence and provenance stay outside the game-style boxes.

Item merchants use the same stacked bundle. The grey box names the merchant role
and cost, while the decoded blue box preserves the ROM merchant line. Currency
is rendered with the start-menu heart tile, not with a text substitute; durable
item-icon evidence lives in `docs/guide-item-affordances.md`.

Promoted item names inside guide-authored grey dialog body text remain
selectable HTML text, but render in the guide item accent color and get a
ROM-rendered start-menu icon directly after the item phrase. The treatment does
not apply to decoded blue game dialogs or to grey dialog titles above the
horizontal rule. This is presentation only: the dialog layout still normalizes
and wraps the source text deterministically, and the manifest text is not
mutated.

Breakable terrain uses the concise game-dialog template:

```text
Breakable blocks
----------
Break these blocks with...
```

Door portals should open their destination UI directly instead of showing a game
dialog first.

## Pretext Decision

[Pretext demos](https://somnai-dreams.github.io/pretext-demos/) and the
[Pretext repository](https://github.com/chenglou/pretext) are useful references
for fast, accurate proportional text measurement. The CV2 dialog is a fixed NES
tile grid: width, height, wrapping, and line spacing are known from tile counts
before the frame is rendered. The guide does not add `@chenglou/pretext` as a
runtime dependency for this component. Revisit it only for future rich modern
guide text, not the game-faithful dialog box.
