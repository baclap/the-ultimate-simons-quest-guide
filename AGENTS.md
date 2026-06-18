# Castlevania II Project Instructions

This project is building toward the perfect interactive Castlevania II:
Simon's Quest guide: a ROM-faithful, explorable game-map experience that feels
like looking at the real game, enhanced with guide knowledge only where evidence
supports it.

## Project North Star

- Treat the long-term goal as a definitive interactive game guide, not a generic
  map viewer, article, or asset gallery.
- The primary guide surface should look like the real game wherever game
  graphics are involved.
- Modern UI is welcome for overlays, options, labels, modals, and navigation,
  but it must not blur what is game data versus guide presentation.

## Project Structure

- `src/`: ROM decoding, extraction, validation, and build pipeline code.
- `guide/`: interactive WebGL guide app. Game graphics here must render from
  ROM-derived data at runtime.
- `guide/source/`: authored guide slice definitions and presentation layout
  inputs.
- `guide/assets/`: generated guide slice packs consumed by the runtime app.
- `docs/`: durable reverse-engineering notes, proof writeups, schemas, and
  technical explanations.
- `demos/`: sprint-demo slideshows and milestone artifacts for review.
- `out/`: generated research/build outputs. Treat as evidence/output, not source
  truth unless explicitly committed for a demo or guide asset.
- `roms/`: local ROM inputs. Do not commit ROM files.
- `web/`: older WASM/WebGL webapp work. Do not touch unless the task explicitly
  calls for it.

## Where To Put Work

- Put reusable ROM decoding logic in `src/`.
- Put durable discoveries and low-level proof in `docs/`.
- Put guide product code, UI, and runtime data packs in `guide/`.
- Put milestone review artifacts in `demos/`.
- Do not leave important discoveries only in temporary scripts, chat, or
  untracked `out/` files.

## ROM Truth Standard

- The ROM is the source of truth for game facts.
- Do not invent gameplay data, placements, sprites, palettes, HP values, text,
  transitions, item requirements, or map relationships.
- External projects, screenshots, magazines, maps, wikis, and memory are useful
  leads, not final proof.
- Final guide claims should be backed by ROM decoding, emulator/runtime
  evidence, generated manifests, validation artifacts, or explicitly labeled
  guide-authored presentation logic.
- "Good enough" is not a standard for game facts. A fact is either proven,
  unproven, or intentionally out of scope.

## Graphics Rule

- In the interactive guide, game graphics must be rendered at runtime from
  ROM-derived data: CHR, metatiles, layout blocks, palettes, nametables, actor
  sprite records, and related decoded structures.
- Do not use PNG screenshots or pre-rendered map images as game-art sources in
  the guide app.
- PNGs, screenshots, and generated images are acceptable for demos, docs,
  validation, debugging, and explanatory artifacts.

## Evidence And Presentation

- Keep decoded game facts separate from presentation choices.
- Examples of ROM-derived data: map pixels, CHR tiles, actor rows, text bytes,
  sprite selectors, palette bytes, HP values, and transition routines.
- Examples of guide-authored presentation: consolidated world placement,
  label positions, overlay colors, modal layout, click target styling, and
  explanatory copy.
- When useful, carry provenance through data files, docs, and UI copy so future
  work can distinguish ROM evidence from guide design.

## Completeness And Unknowns

- Do not silently fill gaps with guesses.
- If a layer cannot be completed truthfully, either omit that layer, mark the
  gap clearly, or create a research/demo milestone to close it.
- No silent omissions: when expanding a route or mechanic, account for all
  relevant rows/fixtures/entities in that slice, including why any are excluded.
- Control rows, rendering artifacts, or non-visible rows should be documented
  when they are intentionally excluded from guide-facing layers.

## Milestone Demos

- A milestone may be delivered as a static sprint-demo slideshow under `demos/`
  when the work is primarily discovery, proof, explanation, or stakeholder
  review.
- Sprint demos should focus on meaningful high-level results, visual evidence,
  and what the discovery unlocks.
- Dense low-level proof belongs in `docs/`, generated manifests, source code,
  or focused appendices rather than overwhelming the main demo narrative.
- Demos should be self-contained where practical, using committed assets rather
  than requiring a ROM or emulator at review time.

## Durable Reverse Engineering

- When a ROM mechanism is understood, encode it in the pipeline or document it
  in `docs/`; do not leave important knowledge only in chat or a one-off script.
- Prefer reusable decoders, validators, generated manifests, fixture scans, and
  provenance records over manual annotations.
- If a one-off investigation is necessary, turn durable findings into project
  documentation or production pipeline logic before treating the milestone as
  complete.

## Guide UX Expectations

- The guide must be usable on desktop and phone-sized screens.
- Pan/zoom, overlays, labels, modals, options, and tap/click targets should be
  designed with mobile review in mind.
- Layer controls should separate visibility from highlighting where appropriate;
  for example, showing a sprite and showing its outline may be different user
  choices.
- UI overlays should be clearly modern guide UI and should not be mistaken for
  original game pixels.

## Incremental Scope

- Build small slices when that helps, but hold every slice to final-guide truth
  standards.
- A narrow route with complete, ROM-backed actors/secrets/transitions is better
  than a broad route with guessed or partial data.
- Expanding the map should include the supporting actor, fixture, secret,
  transition, and provenance work needed for that slice unless explicitly scoped
  as a layout-only pass.

## Validation

- Prefer pipelines that cross-check themselves using multiple kinds of evidence:
  ROM table decoding, generated manifests, fixture signatures, emulator
  savestates/traces, rendered comparisons, and browser verification.
- If a visual overlay highlights something, there should be a path back to the
  bytes or runtime behavior that justify it.
- Run focused syntax/build checks for touched code and browser-check guide UI
  changes when practical.
