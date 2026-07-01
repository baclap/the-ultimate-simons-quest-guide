# Overworld Section Label Audit

This report compares the current guide overworld section labels against two
published map sources:

- Nintendo Power *Castlevania II: Simon's Quest* Transylvania map:
  <https://www.castlevaniacrypt.com/wp-content/img/cv2/np/13.jpg>
- NES Game Atlas map, "Terror-tory of Transylvania":
  <https://www.castlevaniacrypt.com/wp-content/img/cv2/maps/nesmap-2.png>

It is a review artifact, not a naming-policy change. Ambiguous scan text is
called out rather than forced into a confident source claim.

## Current Project Rule

The documented rule in `docs/location-naming-policy.md` is:

- Use Nintendo Power names for human-facing labels where the scanned map text is
  readable.
- Preserve `tonylukasavage/cv2r` names as `sourceName`.
- Treat Fandom/design-map names as aliases unless they match Nintendo Power.
- Keep ambiguous labels unresolved instead of inventing precision.

The machine-readable version lives in `data/location-names.json`. Current guide
slice output also preserves `sourceName` beside each display `label`.

## Source Label Inventories

### Nintendo Power

The Nintendo Power map uses mostly broad region labels. It generally does not
number or split route submaps into Part 1 / Part 2 / Part 3. Legible labels
include:

Town of Jova, Jova Woods, South Bridge, Veros Woods, Town of Veros, Dabis Path,
Denis Woods, Berkeley Mansion, Aljiba Woods, Town of Aljiba, Camilla Cemetery,
Yuba Lake, Lauber Mansion, Belasco Marsh, Dead River, Brahm's Mansion, Vrad
Mountain, Castlevania, East Bridge, Vrad Graveyard, Town of Yomi, Dora Woods,
North Bridge, Town of Doina, Bodley Mansion, Wicked Ditch, Deborah Cliff, Jam
Wasteland, Sadam Woods, Storigoi Graveyard, Town of Ondol, Town of Alba, Bordia
Mountains, Debious Woods, Joma Marsh, Laruba Mansion, and Denis Marsh.

Bridge labels were partly tricky: the map visibly uses East Bridge, North Bridge,
and South Bridge, while the bridge near Castlevania was difficult to read in the
Nintendo Power scan. The guide now resolves that bridge as `West Bridge` by
following NES Atlas.

### NES Game Atlas

The NES Game Atlas map gives a numbered legend. Read from the scan:

| # | NES Atlas label |
| ---: | --- |
| 1 | Town of Jova |
| 2 | Jova Woods |
| 3 | South Bridge |
| 4 | Veros Woods |
| 5 | Veros Woods-2 |
| 6 | Berkeley Mansion |
| 7 | Town of Veros |
| 8 | Denis Woods |
| 9 | Dabi's Path |
| 10 | Dabi's Path-2 |
| 11 | Aljiba Woods |
| 12 | Aljiba Woods-2 |
| 13 | Lower Road |
| 14 | Yuba Lake |
| 15 | Rover Mansion |
| 16 | Town of Aljiba |
| 17 | Camilla Cemetery |
| 18 | Belasco Marsh |
| 19 | Dead River |
| 20 | Dead River-2 |
| 21 | Brahm's Mansion |
| 22 | Dead River-3 |
| 23 | Jam Wasteland |
| 24 | Dead River-4 |
| 25 | Town of Alba |
| 26 | Sadam Woods |
| 27 | Storigoi Graveyard |
| 28 | Sadam Woods-2 |
| 29 | Town of Ondol |
| 30 | Deborah Cliff |
| 31 | Bodley Mansion |
| 32 | Uta Lower Road |
| 33 | Uta Lower Road-2 |
| 34 | Debious Woods |
| 35 | Joma Marsh |
| 36 | Laruba Mansion |
| 37 | Joma Marsh-2 |
| 38 | Wicked Ditch |
| 39 | Town of Doina |
| 40 | North Bridge |
| 41 | Dora Woods |
| 42 | East Bridge |
| 43 | Denis Marsh |
| 44 | Town of Yomi |
| 45 | Vrad Graveyard |
| 46 | West Bridge |
| 47 | Castlevania |

Notable conflicts with the current Nintendo Power-primary policy:

- NES Atlas uses `Rover Mansion`; Nintendo Power uses `Lauber Mansion`.
- NES Atlas uses `Lower Road`, `Uta Lower Road`, and `Uta Lower Road-2`; the
  guide now uses `Lower Road` plus guide-numbered `Uta Lower Road 1` and
  `Uta Lower Road 2`.
- NES Atlas uses `West Bridge` for the Castlevania bridge area; the guide now
  follows that label.
- NES Atlas uses `Dabi's Path`; the Nintendo Power scan appears to use
  `Dabis Path`.

## Current Guide Segment Comparison

Status meanings:

- `match`: the current label matches the source label or only adds a structural
  guide suffix such as `Door`.
- `broad match`: the source map uses a broad region label, while the guide
  splits it into ROM/manifest sub-sections.
- `conflict`: at least one source map clearly uses a different name.
- `unlabeled/unclear`: the source map does not provide a clear label for this
  guide segment.

| Guide id | Current guide label | Nintendo Power comparison | NES Atlas comparison | Audit status |
| --- | --- | --- | --- | --- |
| `deborah-cliff` | Deborah Cliff | Deborah Cliff | #30 Deborah Cliff | match |
| `jam-wasteland` | Jam Wasteland | Jam Wasteland | #23 Jam Wasteland | match |
| `town-of-ondol` | Town of Ondol | Town of Ondol | #29 Town of Ondol | match |
| `sadam-woods-part-3` | Sadam Woods - Part 3 | Sadam Woods, broad region | Sadam Woods / Sadam Woods-2 only | broad match |
| `sadam-woods-part-2` | Sadam Woods - Part 2 | Sadam Woods, broad region | #28 Sadam Woods-2 is the closest numbered match | broad match |
| `sadam-woods-part-1` | Sadam Woods - Part 1 | Sadam Woods, broad region | #26 Sadam Woods is the closest numbered match | broad match |
| `town-of-alba` | Town of Alba | Town of Alba | #25 Town of Alba | match |
| `storigoi-graveyard` | Storigoi Graveyard | Storigoi Graveyard | #27 Storigoi Graveyard | match |
| `vrad-mountain-part-2` | Vrad Mountain - Part 2 | Vrad Mountain, broad region | No clear `Vrad Mountain` legend entry | conflict with Atlas / broad match with NP |
| `vrad-mountain-part-1` | Vrad Mountain - Part 1 | Vrad Mountain, broad region | No clear `Vrad Mountain` legend entry | conflict with Atlas / broad match with NP |
| `dead-river-part-2` | Dead River - Part 2 | Dead River, broad region | Dead River numbered family, likely #20 | broad match |
| `dead-river-part-1` | Dead River - Part 1 | Dead River, broad region | Dead River numbered family, likely #19 | broad match |
| `belasco-marsh` | Belasco Marsh | Belasco Marsh | #18 Belasco Marsh | match |
| `brahm-mansion-door` | Brahm's Mansion - Door | Brahm's Mansion | #21 Brahm's Mansion | match, guide suffix |
| `dead-river-to-brahm` | Dead River to Brahm | Dead River, broad region | Dead River numbered family, likely #22 | broad match |
| `town-of-jova` | Town of Jova | Town of Jova | #1 Town of Jova | match |
| `jova-woods` | Jova Woods | Jova Woods | #2 Jova Woods | match |
| `south-bridge` | South Bridge | South Bridge | #3 South Bridge | match |
| `veros-woods-part-1` | Veros Woods - Part 1 | Veros Woods, broad region | #4 Veros Woods | broad match |
| `veros-woods-part-2` | Veros Woods - Part 2 | Veros Woods, broad region | #5 Veros Woods-2 | match |
| `denis-woods-part-1` | Denis Woods - Part 1 | Denis Woods, broad region | #8 Denis Woods | broad match |
| `berkeley-mansion-door` | Berkeley Mansion - Door | Berkeley Mansion | #6 Berkeley Mansion | match, guide suffix |
| `denis-woods-part-2` | Denis Woods - Part 2 | Denis Woods, broad region | #8 Denis Woods is the closest numbered match | broad match |
| `denis-woods-part-3` | Denis Woods - Part 3 | Denis Woods, broad region | #8 Denis Woods is the closest numbered match | broad match |
| `town-of-veros` | Town of Veros | Town of Veros | #7 Town of Veros | match |
| `dabis-path-part-1` | Dabi's Path - Part 1 | Dabis Path, broad region | #9 Dabi's Path | match, punctuation differs |
| `dabis-path-part-2` | Dabi's Path - Part 2 | Dabis Path, broad region | #10 Dabi's Path-2 | match, punctuation differs |
| `aljiba-woods-part-1` | Aljiba Woods - Part 1 | Aljiba Woods, broad region | #11 Aljiba Woods | broad match |
| `aljiba-woods-part-2` | Aljiba Woods - Part 2 | Aljiba Woods, broad region | #12 Aljiba Woods-2 | match |
| `aljiba-woods-part-3` | Aljiba Woods - Part 3 | Aljiba Woods or unlabeled approach to Yuba Lake | #13 Lower Road appears to be the closest Atlas label | possible conflict |
| `town-of-aljiba` | Town of Aljiba | Town of Aljiba | #16 Town of Aljiba | match |
| `camilla-cemetery` | Camilla Cemetery | Camilla Cemetery | #17 Camilla Cemetery | match |
| `joma-marsh-part-1` | Joma Marsh - Part 1 | Joma Marsh, broad region | #35 Joma Marsh | broad match |
| `laruba-mansion-door` | Laruba Mansion - Door | Laruba Mansion | #36 Laruba Mansion | match, guide suffix |
| `joma-marsh-part-2` | Joma Marsh - Part 2 | Joma Marsh, broad region | #37 Joma Marsh-2 | match |
| `debious-woods` | Debious Woods | Joma Marsh / Debious boundary unclear | #34 Debious Woods is the closest resolved source label | resolved |
| `uta-lower-road-2` | Uta Lower Road 2 | Debious / Uta boundary unclear | #33 Uta Lower Road-2 | resolved toward NES Atlas |
| `uta-lower-road-1` | Uta Lower Road 1 | Debious / Uta boundary unclear | #32 Uta Lower Road, adapted to guide numbering | resolved toward NES Atlas |
| `uta-road` | Uta Road | Debious / Wicked Ditch boundary unclear | Between #32/#33 Uta Lower Road and #38 Wicked Ditch | guide-authored connector |
| `bodley-mansion-door` | Bodley Mansion - Door | Bodley Mansion | #31 Bodley Mansion | match, guide suffix |
| `wicked-ditch` | Wicked Ditch | Wicked Ditch | #38 Wicked Ditch | match |
| `town-of-doina` | Town of Doina | Town of Doina | #39 Town of Doina | match |
| `north-bridge` | North Bridge | North Bridge | #40 North Bridge | match |
| `dora-woods-part-1` | Dora Woods - Part 1 | Dora Woods, broad region | #41 Dora Woods | broad match |
| `dora-woods-part-2` | Dora Woods - Part 2 | Dora Woods, broad region | #41 Dora Woods is the closest numbered match | broad match |
| `town-of-yomi` | Town of Yomi | Town of Yomi | #44 Town of Yomi | match |
| `vrad-graveyard` | Vrad Graveyard | Vrad Graveyard | #45 Vrad Graveyard | match |
| `west-bridge` | West Bridge | Bridge label unclear | #46 West Bridge | resolved toward NES Atlas |
| `castlevania` | Castlevania | Castlevania | #47 Castlevania | match |
| `dora-woods-part-3` | Dora Woods - Part 3 | Dora Woods is visible on the central island, but this exact split is not labeled | Atlas has Dora Woods #41, then East Bridge #42 / Denis Marsh #43 / Uta Lower Road labels farther east | possible conflict |
| `east-bridge` | East Bridge | Probably near East Bridge / Denis Marsh / Bordia Mountains region | #42 East Bridge | resolved toward NES Atlas |
| `denis-marsh` | Denis Marsh | Bordia Mountains | #43 Denis Marsh is the closest numbered label | resolved toward NES Atlas |
| `lower-road` | Lower Road | Approach to Yuba Lake, not clearly separately labeled | #13 Lower Road appears to be the closest numbered label | resolved toward NES Atlas |
| `yuba-lake` | Yuba Lake | Yuba Lake | #14 Yuba Lake | match |
| `yuba-lake-revealed-route` | Yuba Lake revealed route | Guide-authored secret-route presentation, not a source-map label | Guide-authored secret-route presentation; adjacent to #14 Yuba Lake / #15 Rover Mansion | guide-authored |
| `lauber-mansion-door` | Lauber Mansion - Door | Lauber Mansion | #15 Rover Mansion | conflict, current policy chooses NP |

## Main Findings

1. Most current guide labels are consistent with Nintendo Power at the broad
   region level. The guide's `Part 1`, `Part 2`, `Part 3`, and `Door` suffixes
   usually come from ROM/manifest sectioning rather than from the published map
   labels.

2. NES Atlas is not just an alias source. It makes several different naming
   choices: `Rover Mansion`, `West Bridge`, `Lower Road`, `Uta Lower Road`,
   `Denis Marsh`, and numbered Dead River / Sadam Woods / Joma Marsh splits.

3. The former `Debious Woods - Part 1/2/3` concern is resolved by moving the
   single `Debious Woods` label to `debious-woods`, mapping the next two
   sections to `Uta Lower Road 1/2`, and using `Uta Road` as a
   guide-authored connector label.

4. `Castlevania Bridge`, `Long Bridge to Bordia Mountains`, and `Bordia
   Mountains` are resolved toward NES Atlas as `West Bridge`, `East Bridge`, and
   `Denis Marsh`.

5. `Aljiba Woods - Part 3` and `Dora Woods - Part 3` remain possible future
   review points if the guide continues moving toward NES Atlas for fine-grained
   route labels.

## Resolved Naming Decisions

These guide labels now reflect the naming pass:

| Segment id | Current guide label | Decision |
| --- | --- | --- |
| `debious-woods` | `Debious Woods` | Move the printed-map Debious label to the best-fitting section. |
| `uta-lower-road-2` | `Uta Lower Road 2` | Follow NES Atlas `Uta Lower Road-2`, using guide numbering style. |
| `uta-lower-road-1` | `Uta Lower Road 1` | Follow NES Atlas `Uta Lower Road`, using guide numbering style. |
| `uta-road` | `Uta Road` | Use a short guide-authored connector label rather than inventing `Uta Lower Road 3`. |
| `west-bridge` | `West Bridge` | Follow NES Atlas. |
| `east-bridge` | `East Bridge` | Follow NES Atlas. |
| `denis-marsh` | `Denis Marsh` | Follow NES Atlas. |
| `lower-road` | `Lower Road` | Follow NES Atlas for the nearby route family. |

## Policy Questions Raised

If the naming policy changes, the important choice is not "Nintendo Power or NES
Atlas" in the abstract. It is which source should win for each kind of label:

- Broad region names: Nintendo Power currently wins where legible.
- Fine-grained route splits: NES Atlas often provides numbered names where
  Nintendo Power gives only a broad region.
- ROM/manifest submaps: current guide labels preserve source segmentation even
  when no published map has the same split.
- Guide-authored presentation paths: labels like `Yuba Lake revealed route` and
  `Uta Road` explain guide composition, not necessarily a
  printed source label.

Possible policy directions:

1. Keep Nintendo Power primary, but add NES Atlas conflicts as aliases and notes.
2. Use Nintendo Power for broad regions and NES Atlas for fine-grained route
   splits where Nintendo Power is silent.
3. Keep source-map names for broad labels, but use neutral guide labels for
   visually confusing ROM sections until topology proof maps them to a printed
   source label.

The former `Debious Woods - Part 1` section is the clearest example of option 3:
it now uses the connector label `Uta Road`.

## Rendered-Art Spot Check

The visual concern is supported by the current ROM-derived atlas renders:

- `obj03-area03-sub04-debious-woods-part-1-day.png` renders mountain/bridge-like
  terrain with no visible tree or woods tiles.
- `obj03-area03-sub03-debious-woods-part-2-day.png` renders cliff, water,
  stairs, and stone platforms, again with no woods-like tile art.
- `obj03-area03-sub02-debious-woods-part-3-day.png` renders a large
  blue-and-magenta interior-like or marsh-like layout rather than ordinary
  overworld forest.

This does not by itself prove that the ROM/manifest label is wrong, because
printed maps sometimes name a broader region while individual game screens use
different tiles. It does mean the guide's player-facing label can feel
misleading even if it follows the existing source-name policy.
