# Guide Item Offer Affordances

Item-bearing NPCs use a reusable guide overlay:

- a small blue CV2 dialog-frame badge floats above the actor;
- the badge contains the exact start-menu item icon tile rendered from ROM CHR;
- clicking the badge opens a grey guide-authored item explanation;
- clicking the NPC opens a stacked grey/blue merchant dialog when the NPC also
  has decoded game text.

Guide-authored grey dialog boxes also promote item mentions inline, but only in
the body text below the horizontal rule. When body copy names a promoted item,
the browser keeps the text as selectable HTML, colors that item name with the
guide item accent, and places the item's ROM-rendered start-menu icon directly
after the item phrase. Decoded blue game text and grey dialog titles are left
unadorned so ROM text remains visually distinct. This does not mutate the
underlying ROM text or manifest copy.

The blue badge frame is guide-authored UI, but it is built from the same dialog
frame tiles documented in `docs/guide-dialog-box.md`. The item art is not an
image asset. It is rendered at runtime from decoded CHR banks `$00/$01` using
the start-menu background palette slot `3` bytes:

```text
$0F $11 $20 $15
```

Current promoted menu item tiles:

| Item | Tile | Evidence |
| --- | --- | --- |
| Dracula's Rib | `$4E` | Fixed-bank start-menu body-part table `7:$F033` orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring. |
| Dracula's Eyeball | `$50` | Fixed-bank start-menu body-part table `7:$F033` orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring. |
| Dracula's Nail | `$51` | Fixed-bank start-menu body-part table `7:$F033` orders Dracula part icons as Rib, Heart, Eyeball, Nail, Ring. |
| Dagger | `$54` | Fixed-bank weapon/crystal start-menu table `7:$F038`; ROM sale-table triple at file offset `$1ED31` is `$54 $00 $50`. |
| Silver Knife | `$55` | Fixed-bank weapon/crystal start-menu table `7:$F038`; Camilla Cemetery secret merchant text pointer `$0CED8` gives the Silver Knife reward. |
| Gold Knife | `$6F` | Fixed-bank weapon/crystal start-menu table `7:$F038`; Brahm Mansion Death row `$05CDE` text pointer `$0DCC0` gives the Golden Knife reward. |
| Holy Water | `$57` | Fixed-bank weapon/crystal start-menu table `7:$F038`; the guide secret proof decodes Holy Water as the block-breaking projectile path. |
| Laurels | `$58` | Fixed-bank carry-item menu branch loads tile `$58` before drawing through `7:$EB9C`. |
| Oak Stake | `$59` | Start-menu PPU capture `out/captures/game-menu-jova-woods-start`; ROM sale-table triple at file offset `$1ED37` is `$59 $00 $50`. |
| Thorn Whip | `$5B` | Fixed-bank weapon/crystal start-menu table `7:$F038`; ROM sale-table triple at file offset `$1ED3D` is `$5B $01 $00`. |
| Chain Whip | `$5B` | Fixed-bank weapon/crystal start-menu table `7:$F038`; ROM sale-table triple at file offset `$1ED40` is `$5B $01 $50`. |
| Morning Star | `$5B` | Fixed-bank weapon/crystal start-menu table `7:$F038`; ROM sale-table triple at file offset `$1ED43` is `$5B $02 $00`. |
| Silk Bag | `$5C` | Fixed-bank start-menu branch `7:$F199` checks RAM `$92` bit `0`; when set, it loads tile `$5C` and draws through `7:$EB9C`. Storigoi Graveyard reward routine `$06E17` sets the same bit. |
| White Crystal | `$5E` | Start-menu PPU capture `out/captures/game-menu-jova-woods-start`; ROM sale-table triple at file offset `$1ED3A` is `$5E $00 $50`. |
| Heart currency | `$61` | Start-menu PPU capture `out/captures/game-menu-jova-woods-start` shows the heart glyph in the menu price/status row. |
| Sacred Flame | `$69` | Fixed-bank weapon/crystal start-menu table `7:$F038`. |
| Garlic | `$6D` | Fixed-bank carry-item menu branch loads tile `$6D` before drawing through `7:$EB9C`. |
| Blue Crystal | `$6E` | Fixed-bank weapon/crystal start-menu table `7:$F038`. |
| Diamond | `$70` | Vrad Mountain row `$0684F` sets RAM `$4A` bit `4`; the fixed-bank weapon/item menu table at file offset `$1F048` maps that bit to tile `$70`. |
| Red Crystal | `$5F` | Fixed-bank weapon/crystal start-menu table `7:$F038`. |

The current inline matcher treats the Jova "magic potion" line as a Holy Water
reference because the ROM-backed guide proof identifies Holy Water as the
block-breaking weapon used for that player-facing behavior.

The current merchant prices come from the ROM sale table, not from the manual.
The promoted rows currently decode `$00 $50` as `50` hearts and `$01 $00` as
`100` hearts; Veros adds `$01 $50` as `150` hearts.

The current item explanation text comes from the Nintendo-hosted English NES
manual PDF:

```text
https://www.nintendo.co.jp/clv/manuals/en/pdf/CLV-P-NABXE.pdf
```

- Magic Weapons, page 10: Dagger, Gold Knife, Oak Stake.
- Magic Weapons, page 10: Thorn Whip, Holy Water, Oak Stake.
- Magic Weapons, page 10: Chain Whip.
- Magic Items, page 11: White Crystal.

Future item-giver work should add an `itemOffer` or `itemReward` to the
promoted actor/source definition, not hand-code browser-only UI. At minimum,
each item affordance should name the item, the menu icon tile, the merchant/item
role when applicable, the price evidence when a price exists, and the manual or
ROM text evidence used for the item explanation.
