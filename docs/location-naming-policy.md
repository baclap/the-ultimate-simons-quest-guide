# Location Naming Policy

Human-facing map labels currently use the Nintendo Power *Castlevania II:
Simon's Quest* Transylvania map as the source of truth where the scan is
legible.

Source image:
<https://i.etsystatic.com/63264078/r/il/5f4082/7590914027/il_1588xN.7590914027_ind8.jpg>

The project still preserves `cv2r` names as `sourceName` because those labels
are the metadata anchor we use to reach ROM contexts. Display names are resolved
through `data/location-names.json`; aliases record other names encountered in
published or fan sources.

## Decision

- Use Nintendo Power names for demos, manifests, docs, and save-state fixture
  labels where the map text is readable.
- Preserve `tonylukasavage/cv2r` labels in `sourceName`.
- Treat Fandom/design-map names as aliases unless they match Nintendo Power.
- Keep ambiguous labels unresolved instead of inventing precision.

## Notable Findings

- Nintendo Power uses `Vrad Graveyard`; Fandom uses `Vlad Graveyard` as primary
  and lists `Vrad Graveyard` as an alternate.
- Nintendo Power uses `Borgia Mountains`; `cv2r` currently uses
  `Bordia Mountains`.
- Nintendo Power uses `Debious Woods`, matching `cv2r`, while Fandom's
  design-map list uses `Devious Woods` with `Debious Woods` as an alternate.
- Nintendo Power uses `Storigoi Graveyard`, matching `cv2r`, while some
  sources use `Strigoi Graveyard`.
- Nintendo Power uses `Lauber Mansion`; `cv2r` currently uses `Rover Mansion`.
- Nintendo Power uses `Town of Alba`; some later references use
  `Town of Aldra`.
- The bridge label near Castlevania is not legible enough in the current scan to
  replace the existing `Castlevania Bridge` source label.

## Checked Secondary Sources

- Castlevania Wiki, Vlad Graveyard:
  <https://castlevania.fandom.com/wiki/Vlad_Graveyard>
- Castlevania Wiki, Simon's Quest World Map:
  <https://castlevania.fandom.com/wiki/Simon%27s_Quest_World_Map>
