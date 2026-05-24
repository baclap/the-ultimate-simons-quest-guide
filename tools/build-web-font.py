#!/usr/bin/env python3
"""Build a web font from Castlevania II CHR text tiles."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from PIL import Image


HEADER_SIZE = 16
PRG_BANK_SIZE = 16 * 1024
CHR_BANK_SIZE = 8 * 1024
TILE_SIZE = 8
TILE_BYTES = 16

UNITS_PER_EM = 1024
PIXEL_UNITS = UNITS_PER_EM // TILE_SIZE
ASCENT = UNITS_PER_EM
DESCENT = 0

DEFAULT_FAMILY = "CV2 Dialog"
DEFAULT_BASENAME = "cv2-dialog"
DEFAULT_BANK = 0x00

CHARACTER_TILES = {
    " ": 0x00,
    "A": 0x01,
    "B": 0x02,
    "C": 0x03,
    "D": 0x04,
    "E": 0x05,
    "F": 0x06,
    "G": 0x07,
    "H": 0x08,
    "I": 0x09,
    "J": 0x0A,
    "K": 0x0B,
    "L": 0x0C,
    "M": 0x0D,
    "N": 0x0E,
    "O": 0x0F,
    "P": 0x10,
    "Q": 0x11,
    "R": 0x12,
    "S": 0x13,
    "T": 0x14,
    "U": 0x15,
    "V": 0x16,
    "W": 0x17,
    "X": 0x18,
    "Y": 0x19,
    "Z": 0x1A,
    ".": 0x1B,
    "'": 0x1C,
    ",": 0x1E,
    "!": 0x40,
    "-": 0x46,
    "?": 0x5D,
    "0": 0x36,
    "1": 0x37,
    "2": 0x38,
    "3": 0x39,
    "4": 0x3A,
    "5": 0x3B,
    "6": 0x3C,
    "7": 0x3D,
    "8": 0x3E,
    "9": 0x3F,
}

CHARACTER_ORDER = (
    " "
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789"
    ".,'!-?"
)

GLYPH_NAMES = {
    " ": "space",
    ".": "period",
    ",": "comma",
    "'": "quotesingle",
    "!": "exclam",
    "-": "hyphen",
    "?": "question",
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a CSS-ready web font from Castlevania II CHR tiles."
    )
    parser.add_argument("--rom", default="roms/cv2.nes", help="source NES ROM")
    parser.add_argument("--out", default="web/fonts", help="output directory")
    parser.add_argument("--family", default=DEFAULT_FAMILY, help="CSS font family")
    parser.add_argument("--basename", default=DEFAULT_BASENAME, help="output basename")
    parser.add_argument(
        "--bank",
        default=hex(DEFAULT_BANK),
        help="8 KB CHR bank containing the in-game font",
    )
    return parser.parse_args()


def parse_int(value: str) -> int:
    value = str(value).strip()
    if value.lower().startswith("0x"):
        return int(value, 16)
    return int(value, 10)


def read_rom(path: Path) -> tuple[bytes, dict]:
    rom = path.read_bytes()
    if len(rom) < HEADER_SIZE:
        raise ValueError(f"ROM is too small to contain an iNES header: {path}")
    if rom[:4] != b"NES\x1a":
        raise ValueError(f"ROM does not start with an iNES header: {path}")

    prg_banks = rom[4]
    chr_banks = rom[5]
    flags6 = rom[6]
    trainer_size = 512 if flags6 & 0x04 else 0
    prg_start = HEADER_SIZE + trainer_size
    chr_start = prg_start + prg_banks * PRG_BANK_SIZE
    expected_size = chr_start + chr_banks * CHR_BANK_SIZE
    if len(rom) < expected_size:
        raise ValueError(f"ROM is truncated: expected {expected_size} bytes, got {len(rom)}")

    return rom, {
        "prg_banks": prg_banks,
        "chr_banks": chr_banks,
        "chr_start": chr_start,
        "sha256": hashlib.sha256(rom).hexdigest(),
    }


def decode_tile(rom: bytes, tile_offset: int) -> list[int]:
    pixels = [0] * (TILE_SIZE * TILE_SIZE)
    for y in range(TILE_SIZE):
        low = rom[tile_offset + y]
        high = rom[tile_offset + y + 8]
        for x in range(TILE_SIZE):
            bit = 7 - x
            pixels[y * TILE_SIZE + x] = ((low >> bit) & 1) | (((high >> bit) & 1) << 1)
    return pixels


def glyph_name(character: str) -> str:
    if character in GLYPH_NAMES:
        return GLYPH_NAMES[character]
    return character


def add_rect(pen: TTGlyphPen, x0: int, y0: int, x1: int, y1: int) -> None:
    pen.moveTo((x0, y0))
    pen.lineTo((x1, y0))
    pen.lineTo((x1, y1))
    pen.lineTo((x0, y1))
    pen.closePath()


def tile_to_glyph(tile: list[int]):
    pen = TTGlyphPen(None)
    for row in range(TILE_SIZE):
        for col in range(TILE_SIZE):
            if tile[row * TILE_SIZE + col] == 0:
                continue
            x0 = col * PIXEL_UNITS
            x1 = x0 + PIXEL_UNITS
            y0 = (TILE_SIZE - row - 1) * PIXEL_UNITS
            y1 = y0 + PIXEL_UNITS
            add_rect(pen, x0, y0, x1, y1)
    return pen.glyph()


def empty_glyph():
    return TTGlyphPen(None).glyph()


def build_font(rom: bytes, info: dict, bank: int, family: str) -> FontBuilder:
    if bank < 0 or bank >= info["chr_banks"]:
        raise ValueError(f"CHR bank {bank} is outside 0-{info['chr_banks'] - 1}")

    glyph_order = [".notdef"]
    glyphs = {".notdef": empty_glyph()}
    metrics = {".notdef": (UNITS_PER_EM, 0)}
    cmap = {}
    bank_offset = info["chr_start"] + bank * CHR_BANK_SIZE

    for character in CHARACTER_ORDER:
        name = glyph_name(character)
        if name in glyphs:
            continue
        tile_id = CHARACTER_TILES[character]
        tile = decode_tile(rom, bank_offset + tile_id * TILE_BYTES)
        glyph_order.append(name)
        glyphs[name] = tile_to_glyph(tile)
        metrics[name] = (UNITS_PER_EM, 0)

    for character in CHARACTER_ORDER:
        name = glyph_name(character)
        cmap[ord(character)] = name
        if "A" <= character <= "Z":
            cmap[ord(character.lower())] = name

    fb = FontBuilder(UNITS_PER_EM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT, lineGap=0)
    fb.setupNameTable({
        "familyName": family,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"{family} Regular; ROM {info['sha256'][:12]}",
        "fullName": f"{family} Regular",
        "psName": family.replace(" ", "") + "-Regular",
        "version": "Version 1.000",
        "copyright": "Generated locally from Castlevania II CHR tile graphics.",
    })
    fb.setupOS2(
        sTypoAscender=ASCENT,
        sTypoDescender=DESCENT,
        sTypoLineGap=0,
        usWinAscent=ASCENT,
        usWinDescent=abs(DESCENT),
        sxHeight=UNITS_PER_EM,
        sCapHeight=UNITS_PER_EM,
        achVendID="CV2 ",
    )
    fb.setupPost(
        italicAngle=0,
        underlinePosition=-100,
        underlineThickness=50,
        isFixedPitch=1,
    )
    return fb


def write_web_flavors(ttf_path: Path, woff_path: Path, woff2_path: Path) -> None:
    font = TTFont(ttf_path)
    font.flavor = "woff"
    font.save(woff_path)

    font = TTFont(ttf_path)
    font.flavor = "woff2"
    font.save(woff2_path)


def write_css(path: Path, family: str, basename: str) -> None:
    css = f"""@font-face {{
  font-family: "{family}";
  src:
    url("./{basename}.woff2") format("woff2"),
    url("./{basename}.woff") format("woff"),
    url("./{basename}.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}}

.cv2-dialog-font {{
  font-family: "{family}", monospace;
  font-weight: 400;
  letter-spacing: 0;
  text-rendering: geometricPrecision;
}}
"""
    path.write_text(css, encoding="utf-8")


def write_source_image(path: Path, rom: bytes, info: dict, bank: int) -> None:
    scale = 6
    columns = 16
    gap = 2
    rows = (len(CHARACTER_ORDER) + columns - 1) // columns
    cell = TILE_SIZE * scale
    width = columns * cell + (columns - 1) * gap
    height = rows * cell + (rows - 1) * gap
    image = Image.new("RGBA", (width, height), (9, 9, 12, 255))
    bank_offset = info["chr_start"] + bank * CHR_BANK_SIZE

    for index, character in enumerate(CHARACTER_ORDER):
        tile_id = CHARACTER_TILES[character]
        tile = decode_tile(rom, bank_offset + tile_id * TILE_BYTES)
        ox = (index % columns) * (cell + gap)
        oy = (index // columns) * (cell + gap)
        for row in range(TILE_SIZE):
            for col in range(TILE_SIZE):
                value = tile[row * TILE_SIZE + col]
                if value == 0:
                    continue
                shade = 190 if value == 1 else 245 if value == 2 else 255
                color = (shade, shade, shade, 255)
                for py in range(scale):
                    for px in range(scale):
                        image.putpixel((ox + col * scale + px, oy + row * scale + py), color)

    image.save(path)


def write_specimen(path: Path, family: str, basename: str) -> None:
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{family} Specimen</title>
  <link rel="stylesheet" href="./{basename}.css">
  <style>
    :root {{
      color-scheme: dark;
      --ink: #f8f0dc;
      --muted: #a7a0a0;
      --ground: #09090c;
      --panel: #151316;
      --line: #3b3034;
      --blood: #b42d34;
      --moss: #6f8d68;
    }}

    * {{
      box-sizing: border-box;
    }}

    body {{
      margin: 0;
      background: var(--ground);
      color: var(--ink);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }}

    header,
    main {{
      width: min(1120px, calc(100vw - 32px));
      margin: 0 auto;
    }}

    header {{
      min-height: 42vh;
      display: grid;
      align-content: end;
      padding: 56px 0 34px;
      border-bottom: 1px solid var(--line);
    }}

    h1,
    h2,
    p {{
      margin: 0;
    }}

    h1 {{
      color: var(--blood);
      font-size: clamp(14px, 2vw, 22px);
      text-transform: uppercase;
      letter-spacing: 0;
    }}

    .headline {{
      margin-top: 18px;
      font-size: clamp(28px, 8vw, 92px);
      line-height: 1.08;
      color: var(--ink);
      overflow-wrap: anywhere;
    }}

    main {{
      display: grid;
      gap: 34px;
      padding: 34px 0 56px;
    }}

    section {{
      display: grid;
      gap: 16px;
    }}

    h2 {{
      color: var(--moss);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0;
    }}

    .sample {{
      padding: 20px;
      background: var(--panel);
      border: 1px solid var(--line);
      font-size: clamp(22px, 6vw, 64px);
      line-height: 1.2;
      overflow-wrap: anywhere;
    }}

    .glyphs {{
      font-size: clamp(18px, 4vw, 42px);
      line-height: 1.45;
      color: var(--ink);
      overflow-wrap: anywhere;
    }}

    .source {{
      width: min(100%, 764px);
      height: auto;
      image-rendering: pixelated;
      border: 1px solid var(--line);
      background: var(--panel);
    }}

    code {{
      color: var(--muted);
      font-size: 13px;
    }}
  </style>
</head>
<body>
  <header>
    <h1 class="cv2-dialog-font">{family}</h1>
    <p class="headline cv2-dialog-font">WHAT A HORRIBLE NIGHT TO HAVE A CURSE!</p>
  </header>
  <main>
    <section>
      <h2>Glyphs</h2>
      <p class="glyphs cv2-dialog-font">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789<br>.,'!-?</p>
    </section>
    <section>
      <h2>Dialogue</h2>
      <p class="sample cv2-dialog-font">BUY A WHITE CRYSTAL? PRESS START. DRACULA'S RIDDLE WAITS IN TOWN.</p>
    </section>
    <section>
      <h2>Source Tiles</h2>
      <img class="source" src="./{basename}-source.png" alt="">
      <code>Generated from CHR bank 0x00 in roms/cv2.nes.</code>
    </section>
  </main>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")


def write_metadata(path: Path, rom_path: Path, info: dict, bank: int, family: str, basename: str) -> None:
    metadata = {
        "family": family,
        "basename": basename,
        "sourceRom": str(rom_path),
        "sourceRomSha256": info["sha256"],
        "chrBank": f"0x{bank:02X}",
        "unitsPerEm": UNITS_PER_EM,
        "tileSize": TILE_SIZE,
        "monospaceAdvance": UNITS_PER_EM,
        "characters": [
            {
                "character": character,
                "tileId": f"0x{CHARACTER_TILES[character]:02X}",
                "glyph": glyph_name(character),
            }
            for character in CHARACTER_ORDER
        ],
        "lowercaseAliases": True,
    }
    path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    rom_path = Path(args.rom)
    out_dir = Path(args.out)
    bank = parse_int(args.bank)
    family = args.family
    basename = args.basename

    out_dir.mkdir(parents=True, exist_ok=True)
    rom, info = read_rom(rom_path)

    ttf_path = out_dir / f"{basename}.ttf"
    woff_path = out_dir / f"{basename}.woff"
    woff2_path = out_dir / f"{basename}.woff2"

    font_builder = build_font(rom, info, bank, family)
    font_builder.save(ttf_path)
    write_web_flavors(ttf_path, woff_path, woff2_path)
    write_css(out_dir / f"{basename}.css", family, basename)
    write_source_image(out_dir / f"{basename}-source.png", rom, info, bank)
    write_specimen(out_dir / "specimen.html", family, basename)
    write_metadata(out_dir / f"{basename}.json", rom_path, info, bank, family, basename)

    print(json.dumps({
        "ttf": str(ttf_path),
        "woff": str(woff_path),
        "woff2": str(woff2_path),
        "css": str(out_dir / f"{basename}.css"),
        "specimen": str(out_dir / "specimen.html"),
        "metadata": str(out_dir / f"{basename}.json"),
        "sourceImage": str(out_dir / f"{basename}-source.png"),
    }, indent=2))


if __name__ == "__main__":
    main()
