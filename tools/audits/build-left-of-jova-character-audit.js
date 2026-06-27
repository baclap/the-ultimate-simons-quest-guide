'use strict';

const fs = require('fs');
const path = require('path');

const { NES_PALETTE } = require('../../src/palette');
const { writePng } = require('../../src/png');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'out', 'audits');
const SPRITE_DIR = path.join(OUT_DIR, 'left-of-jova-sprites');
const SPRITE_SCALE = 3;

const LEFT_SEGMENT_IDS = new Set([
  'deborah-cliff',
  'jam-wasteland',
  'town-of-ondol',
  'sadam-woods-part-3',
  'sadam-woods-part-2',
  'sadam-woods-part-1',
  'town-of-alba',
  'storigoi-graveyard',
  'vrad-mountain-part-2',
  'vrad-mountain-part-1',
  'dead-river-part-2',
  'dead-river-part-1',
  'belasco-marsh',
  'brahm-mansion-door',
  'dead-river-to-brahm'
]);

const SCENE_PATHS = [
  'guide/assets/scenes/alba-garlic-room/slice.json',
  'guide/assets/scenes/alba-church/slice.json',
  'guide/assets/scenes/alba-laurels-room/slice.json',
  'guide/assets/scenes/ondol-morning-star-room/slice.json',
  'guide/assets/scenes/ondol-death-star-lady-room/slice.json',
  'guide/assets/scenes/ondol-laurels-room/slice.json'
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function numericByte(value) {
  if (Number.isFinite(value)) {
    return value & 0xff;
  }
  if (typeof value === 'string' && value.toLowerCase().startsWith('0x')) {
    return Number.parseInt(value.slice(2), 16) & 0xff;
  }
  return Number.parseInt(String(value), 10) & 0xff;
}

function hexKey(value) {
  return String(value ?? '').replace(/^0x/i, '').toUpperCase().padStart(2, '0');
}

function hexId(value) {
  return `0x${hexKey(value)}`;
}

function dollarId(value) {
  return `$${hexKey(value)}`;
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function slug(value) {
  return String(value ?? 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function dataRange(data, range) {
  return data.subarray(range.offset, range.offset + range.length);
}

function decodeTilePixel(chrBytes, tileIndex, x, y) {
  const offset = tileIndex * 16;
  if (offset + y + 8 >= chrBytes.length) {
    return 0;
  }
  const low = chrBytes[offset + y];
  const high = chrBytes[offset + y + 8];
  const bit = 7 - x;
  return ((low >> bit) & 1) | (((high >> bit) & 1) << 1);
}

function paletteBytesForActor(manifest, data, actor) {
  const paletteId = actor.paletteByVariant?.day
    || actor.paletteByVariant?.night
    || Object.values(actor.paletteByVariant || {})[0];
  const paletteRecord = (manifest.spritePalettes || []).find((palette) => palette.id === paletteId)
    || manifest.spritePalettes?.[0];
  if (!paletteRecord) {
    return [0x0f, 0x0f, 0x20, 0x30, 0x0f, 0x0f, 0x20, 0x30, 0x0f, 0x0f, 0x20, 0x30, 0x0f, 0x0f, 0x20, 0x30];
  }
  if (Array.isArray(paletteRecord.bytes)) {
    return paletteRecord.bytes.map(numericByte);
  }
  return Array.from(dataRange(data, paletteRecord.data)).map((byte) => byte & 0x3f);
}

function spritePlacement(actor, sprite) {
  const actorFlipped = Boolean(actor.flipHorizontal);
  return {
    xOffset: actorFlipped ? -sprite.xOffset - 8 : sprite.xOffset,
    yOffset: sprite.yOffset,
    flipHorizontal: actorFlipped ? !sprite.flipHorizontal : Boolean(sprite.flipHorizontal),
    flipVertical: Boolean(sprite.flipVertical)
  };
}

function frameSprites(frame) {
  const staticOffset = frame.staticPreviewOffset || { x: 0, y: 0 };
  return (frame.sprites || []).map((sprite) => ({
    ...sprite,
    xOffset: Number(sprite.xOffset || 0) + Number(staticOffset.x || 0),
    yOffset: Number(sprite.yOffset || 0) + Number(staticOffset.y || 0)
  }));
}

function spriteBounds(actor, actorClass, frame) {
  const spriteHeight = actorClass.largeSprites ? 16 : 8;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const sprite of frameSprites(frame)) {
    const placed = spritePlacement(actor, sprite);
    minX = Math.min(minX, placed.xOffset);
    minY = Math.min(minY, placed.yOffset);
    maxX = Math.max(maxX, placed.xOffset + 8);
    maxY = Math.max(maxY, placed.yOffset + spriteHeight);
  }

  if (!Number.isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: 8, maxY: 8 };
  }
  return { minX, minY, maxX, maxY };
}

function writeScaledPixel(rgba, width, x, y, scale, rgb, alpha = 0xff) {
  for (let sy = 0; sy < scale; sy += 1) {
    for (let sx = 0; sx < scale; sx += 1) {
      const offset = ((y * scale + sy) * width + (x * scale + sx)) * 4;
      rgba[offset] = rgb[0];
      rgba[offset + 1] = rgb[1];
      rgba[offset + 2] = rgb[2];
      rgba[offset + 3] = alpha;
    }
  }
}

function drawTile(rgba, width, chrBytes, paletteBytes, tileIndex, destX, destY, opts) {
  for (let row = 0; row < 8; row += 1) {
    const tileY = opts.flipVertical ? 7 - row : row;
    const outY = destY + row;
    for (let col = 0; col < 8; col += 1) {
      const tileX = opts.flipHorizontal ? 7 - col : col;
      const outX = destX + col;
      const colorId = decodeTilePixel(chrBytes, tileIndex, tileX, tileY);
      if (colorId === 0) {
        continue;
      }
      const nesColor = paletteBytes[(opts.paletteIndex * 4) + colorId] ?? paletteBytes[colorId] ?? 0x0f;
      const rgb = NES_PALETTE[nesColor & 0x3f] || [0, 0, 0];
      writeScaledPixel(rgba, width, outX, outY, SPRITE_SCALE, rgb);
    }
  }
}

function drawSprite(rgba, width, chrBytes, paletteBytes, actorClass, sprite, destX, destY, placed) {
  const tile = numericByte(sprite.tile);
  const paletteIndex = Number.isFinite(sprite.palette) ? sprite.palette : (numericByte(sprite.attr) & 0x03);

  if (!actorClass.largeSprites) {
    drawTile(rgba, width, chrBytes, paletteBytes, tile, destX, destY, {
      paletteIndex,
      flipHorizontal: placed.flipHorizontal,
      flipVertical: placed.flipVertical
    });
    return;
  }

  const tableOffset = (tile & 0x01) ? 256 : 0;
  const baseTile = tableOffset + (tile & 0xfe);
  const topTile = placed.flipVertical ? baseTile + 1 : baseTile;
  const bottomTile = placed.flipVertical ? baseTile : baseTile + 1;
  drawTile(rgba, width, chrBytes, paletteBytes, topTile, destX, destY, {
    paletteIndex,
    flipHorizontal: placed.flipHorizontal,
    flipVertical: placed.flipVertical
  });
  drawTile(rgba, width, chrBytes, paletteBytes, bottomTile, destX, destY + 8, {
    paletteIndex,
    flipHorizontal: placed.flipHorizontal,
    flipVertical: placed.flipVertical
  });
}

function renderActorSprite(manifest, data, actor, actorClass, outputName) {
  const frame = actorClass.frames?.[0];
  const chrSet = (manifest.chrSets || []).find((entry) => entry.id === actorClass.chrSet);
  if (!frame || !chrSet) {
    return null;
  }

  const chrBytes = dataRange(data, chrSet.data);
  const paletteBytes = paletteBytesForActor(manifest, data, actor);
  const padding = 3;
  const bounds = spriteBounds(actor, actorClass, frame);
  const nativeWidth = Math.max(8, bounds.maxX - bounds.minX + padding * 2);
  const nativeHeight = Math.max(8, bounds.maxY - bounds.minY + padding * 2);
  const width = nativeWidth * SPRITE_SCALE;
  const height = nativeHeight * SPRITE_SCALE;
  const rgba = Buffer.alloc(width * height * 4);

  for (const sprite of frameSprites(frame)) {
    const placed = spritePlacement(actor, sprite);
    const destX = placed.xOffset - bounds.minX + padding;
    const destY = placed.yOffset - bounds.minY + padding;
    drawSprite(rgba, width, chrBytes, paletteBytes, actorClass, sprite, destX, destY, placed);
  }

  const outputFile = path.join(SPRITE_DIR, `${outputName}.png`);
  writePng(outputFile, width, height, rgba);
  return {
    relative: `left-of-jova-sprites/${path.basename(outputFile)}`,
    width,
    height
  };
}

function spriteImageHtml(sprite, alt) {
  if (!sprite) {
    return '<div class="sprite-missing" aria-hidden="true"></div>';
  }
  return `<img class="sprite" src="${htmlEscape(sprite.relative)}" width="${sprite.width}" height="${sprite.height}" alt="${htmlEscape(alt)} sprite">`;
}

function spriteImageMarkdown(sprite, alt) {
  return sprite ? `![${markdownEscape(alt)}](${sprite.relative})` : '';
}

function rawRow(actor) {
  const offset = actor.provenance?.rowOffset || 'unknown offset';
  const raw = Array.isArray(actor.provenance?.rawBytes) ? actor.provenance.rawBytes.join(' ') : 'unknown bytes';
  return `${offset} = ${raw}`;
}

function hpText(actor) {
  if (!actor.hp) {
    return 'No HP shown';
  }
  const parts = [];
  if (actor.hp.day != null) parts.push(`Day HP ${actor.hp.day}`);
  if (actor.hp.night != null) parts.push(`Night HP ${actor.hp.night}`);
  return parts.join(' / ') || 'No HP shown';
}

function hpProof(actor) {
  const evidence = actor.hpEvidence;
  if (!evidence) {
    return 'No HP evidence attached.';
  }
  return [
    evidence.policy,
    evidence.rowData ? `base row byte ${evidence.rowData}` : null,
    evidence.rom?.routine
  ].filter(Boolean).join('; ');
}

function classProof(actor, manifest, fallbackClassById) {
  return (manifest.actorClasses || []).find((entry) => entry.id === actor.classId)?.proof
    || fallbackClassById.get(actor.classId)?.proof
    || 'No actor-class proof string found.';
}

function nameSource(actor, atlasById) {
  const entry = atlasById.get(hexKey(actor.actorId));
  if (!entry) {
    return {
      status: 'missing',
      short: 'No enemy atlas entry',
      detail: 'No enemy atlas entry found for this actor id.'
    };
  }
  if (entry.manualNameStatus === 'manual-match-proven') {
    return {
      status: 'manual',
      short: `Manual-proven: ${entry.manualName}`,
      detail: `${entry.manualNameEvidence} Source: Nintendo Castlevania II: Simon's Quest English NES manual, "Count Dracula's Best Buddies" pages, preserved from out/manuals/CLV-P-NABXE.pdf.`
    };
  }
  const candidates = (entry.manualNameCandidates || []).length
    ? ` Candidate(s) kept out of UI: ${entry.manualNameCandidates.join(', ')}.`
    : '';
  return {
    status: 'generic',
    short: `Generic fallback: ${entry.displayName}`,
    detail: `${entry.manualNameEvidence || 'No manual name is applied until the manual illustration/name is matched to this ROM actor class with sprite evidence.'}${candidates}`
  };
}

function textSummary(actor) {
  const bits = [];
  if (actor.text) bits.push(`ROM dialog: "${actor.text}"`);
  if (actor.romDialogVariants) {
    for (const variant of actor.romDialogVariants) {
      bits.push(`${variant.label || variant.id}: "${variant.text}"`);
    }
  }
  if (actor.guideDialog?.text) bits.push(`Guide text: ${actor.guideDialog.text.replace(/\n/g, ' / ')}`);
  if (actor.itemOffer) {
    const price = actor.itemOffer.priceText
      || (actor.itemOffer.priceHearts != null ? `${actor.itemOffer.priceHearts} hearts` : actor.itemOffer.costText);
    bits.push(`Item offer: ${actor.itemOffer.label || actor.itemOffer.itemLabel}${price ? `; ${price}` : ''}${actor.itemOffer.iconTile ? `; icon ${actor.itemOffer.iconTile}` : ''}`);
    if (actor.itemOffer.manualText) bits.push(`Manual item copy: ${actor.itemOffer.manualText}`);
  }
  if (actor.itemReward) {
    bits.push(`Item reward: ${actor.itemReward.label || actor.itemReward.itemLabel}${actor.itemReward.iconTile ? `; icon ${actor.itemReward.iconTile}` : ''}`);
    if (actor.itemReward.manualText) bits.push(`Manual item copy: ${actor.itemReward.manualText}`);
  }
  if (actor.secret?.summary) bits.push(`Secret behavior: ${actor.secret.summary}`);
  return bits.join('\n') || 'No dialog/details shown.';
}

function proofSummary(actor) {
  const bits = [];
  if (actor.textEvidence?.source) bits.push(`text ${actor.textEvidence.source}`);
  if (actor.textEvidence?.pointer) bits.push(`text pointer ${actor.textEvidence.pointer}`);
  if (actor.guideDialog?.source) bits.push(`guide text source ${actor.guideDialog.source}`);
  for (const item of [actor.itemOffer, actor.itemReward].filter(Boolean)) {
    if (item.priceEvidence?.summary) bits.push(`price ${item.priceEvidence.summary}`);
    if (item.manualSource) bits.push(`manual ${item.manualSource}`);
    if (Array.isArray(item.provenance)) {
      for (const provenance of item.provenance) {
        bits.push(`${provenance.kind || 'item'} ${provenance.summary || provenance.source || ''}`.trim());
      }
    }
  }
  if (actor.secret?.proof) bits.push(`secret ${actor.secret.proof}`);
  return bits.join('\n') || 'ROM row and generated manifest proof only.';
}

function detailParagraphs(lines) {
  return lines.filter(Boolean).map((line) => `<p>${htmlEscape(line)}</p>`).join('');
}

function buildManualReference(atlas) {
  return atlas.source.manual.pages.map((page) => {
    const image = `../manuals/check-pages/page-${String(page.page).padStart(2, '0')}.png`;
    return {
      ...page,
      image
    };
  });
}

function main() {
  fs.rmSync(SPRITE_DIR, { recursive: true, force: true });
  fs.mkdirSync(SPRITE_DIR, { recursive: true });
  const atlas = readJson('data/enemy-atlas.json');
  const exterior = readJson('guide/assets/slices/jova-to-berkeley/slice.json');
  const exteriorData = fs.readFileSync(path.join(ROOT, 'guide/assets/slices/jova-to-berkeley/slice-data.bin'));
  const scenes = SCENE_PATHS.map((relativePath) => {
    const manifest = readJson(relativePath);
    const dataPath = path.join(path.dirname(path.join(ROOT, relativePath)), manifest.dataFile);
    return {
      manifest,
      data: fs.readFileSync(dataPath)
    };
  });

  const atlasById = new Map(atlas.classes.map((entry) => [hexKey(entry.actorId), entry]));
  const segmentLabels = new Map(exterior.segments.map((segment) => [segment.id, segment.label]));
  const classById = new Map(exterior.actorClasses.map((entry) => [entry.id, entry]));
  const exteriorActors = exterior.actors.filter((actor) => LEFT_SEGMENT_IDS.has(actor.segmentId));
  const exteriorEnemies = exteriorActors.filter((actor) => actor.kind === 'enemy');
  const exteriorCharacters = exteriorActors.filter((actor) => (
    actor.kind === 'npc' || (actor.kind === 'secret' && actor.secret?.type === 'garlic-revealed-merchant')
  ));

  const sceneCharacters = [];
  for (const scene of scenes) {
    const labels = new Map((scene.manifest.segments || []).map((segment) => [segment.id, segment.label || scene.manifest.label]));
    for (const actor of scene.manifest.actors || []) {
      if (actor.kind === 'npc') {
        sceneCharacters.push({
          actor,
          manifest: scene.manifest,
          data: scene.data,
          location: labels.get(actor.segmentId) || scene.manifest.label
        });
      }
    }
  }

  const characters = [
    ...exteriorCharacters.map((actor) => ({
      actor,
      manifest: exterior,
      data: exteriorData,
      location: segmentLabels.get(actor.segmentId) || actor.segmentId
    })),
    ...sceneCharacters
  ].sort((a, b) => a.location.localeCompare(b.location) || a.actor.id.localeCompare(b.actor.id));

  const renderedSpriteByKey = new Map();
  function spriteForActor(manifest, data, actor, key) {
    if (renderedSpriteByKey.has(key)) {
      return renderedSpriteByKey.get(key);
    }
    const actorClass = (manifest.actorClasses || []).find((entry) => entry.id === actor.classId)
      || classById.get(actor.classId);
    const sprite = actorClass
      ? renderActorSprite(manifest, data, actor, actorClass, key)
      : null;
    renderedSpriteByKey.set(key, sprite);
    return sprite;
  }

  const enemyMap = new Map();
  for (const actor of exteriorEnemies) {
    const location = segmentLabels.get(actor.segmentId) || actor.segmentId;
    const key = `${location}::${actor.classId}`;
    if (!enemyMap.has(key)) {
      const spriteKey = `enemy-${slug(location)}-${slug(actor.classId)}-${hexKey(actor.actorId)}`;
      enemyMap.set(key, {
        location,
        classId: actor.classId,
        label: actor.label,
        actorId: actor.actorId,
        actors: [],
        sprite: spriteForActor(exterior, exteriorData, actor, spriteKey),
        name: nameSource(actor, atlasById),
        classProof: classProof(actor, exterior, classById),
        hpProof: hpProof(actor)
      });
    }
    enemyMap.get(key).actors.push(actor);
  }
  const enemyGroups = [...enemyMap.values()]
    .sort((a, b) => a.location.localeCompare(b.location) || a.label.localeCompare(b.label));

  for (const entry of characters) {
    entry.sprite = spriteForActor(
      entry.manifest,
      entry.data,
      entry.actor,
      `character-${slug(entry.location)}-${slug(entry.actor.id)}`
    );
  }

  const failures = [];
  for (const group of enemyGroups) {
    const atlasEntry = atlasById.get(hexKey(group.actorId));
    if (!atlasEntry) {
      failures.push(`No atlas entry for ${hexId(group.actorId)} ${group.label}`);
    } else if (group.label !== atlasEntry.displayName) {
      failures.push(`Guide label mismatch for ${hexId(group.actorId)}: ${group.label} vs atlas ${atlasEntry.displayName}`);
    }
    if (!group.sprite) {
      failures.push(`No sprite rendered for ${group.location} ${group.label}`);
    }
  }
  for (const entry of characters) {
    if (!entry.sprite) {
      failures.push(`No sprite rendered for ${entry.location} ${entry.actor.label}`);
    }
  }

  const manualIds = new Set(enemyGroups.filter((group) => group.name.status === 'manual').map((group) => hexId(group.actorId)));
  const genericIds = new Set(enemyGroups.filter((group) => group.name.status === 'generic').map((group) => hexId(group.actorId)));
  const rawIds = new Map();
  for (const actor of [...characters.map((entry) => entry.actor), ...exteriorEnemies]) {
    const key = hexId(actor.actorId);
    if (!rawIds.has(key)) rawIds.set(key, new Set());
    rawIds.get(key).add(`${actor.label} (${actor.classId})`);
  }

  const manualReference = buildManualReference(atlas);
  const generatedAt = new Date().toISOString();
  const css = `:root{color-scheme:dark;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#050505;color:#f4f4f4}body{margin:0;padding:18px;line-height:1.45}main{max-width:980px;margin:0 auto}h1{font-size:1.55rem;margin:0 0 6px}h2{font-size:1.15rem;margin:28px 0 10px}.summary{color:#cfcfcf;margin:0 0 14px}.grid{display:grid;gap:12px}.card{border:1px solid #3a3a3a;background:#101010;padding:12px;border-radius:8px}.card h3{margin:0 0 6px;font-size:1rem}.entry-head{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center}.sprite-wrap{display:grid;place-items:center;min-width:64px;min-height:64px;background:#050505;border:1px solid #303030;border-radius:6px;padding:6px}.sprite{image-rendering:pixelated;max-width:112px;max-height:112px;object-fit:contain}.sprite-missing{width:48px;height:48px;border:1px dashed #555}.meta{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.chip{border:1px solid #555;color:#ddd;border-radius:999px;padding:2px 8px;font-size:.78rem}.manual{border-color:#65a9ff;color:#b9d9ff}.generic{border-color:#ffd36a;color:#ffe09a}.fail{border-color:#ff6f6f;color:#ffb4b4}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#080808;padding:8px;border-radius:6px;border:1px solid #252525;font-size:.82rem}details{margin-top:8px}summary{cursor:pointer;color:#9fd0ff}table{width:100%;border-collapse:collapse;font-size:.86rem}th,td{border-bottom:1px solid #333;text-align:left;vertical-align:top;padding:6px}.manual-page{margin:0 0 16px}.manual-page img{display:block;width:100%;max-width:752px;height:auto;border:1px solid #333;border-radius:6px;background:#111}.manual-names{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 10px}.manual-names span{border:1px solid #444;border-radius:999px;padding:2px 8px;color:#ddd;font-size:.78rem}@media(max-width:640px){body{padding:12px}.entry-head{grid-template-columns:72px 1fr;gap:10px}.sprite-wrap{min-width:58px;min-height:58px}.sprite{max-width:90px;max-height:90px}table,thead,tbody,tr,th,td{display:block}thead{display:none}tr{border:1px solid #333;border-radius:8px;margin:0 0 10px;padding:8px;background:#101010}td{border:0;padding:3px 0}td::before{content:attr(data-label)": ";color:#aaa;font-weight:600}}`;

  const nameSummaryGroups = [...new Map(enemyGroups.map((group) => [hexId(group.actorId), group])).values()]
    .sort((a, b) => parseInt(hexKey(a.actorId), 16) - parseInt(hexKey(b.actorId), 16));
  const nameRowsHtml = nameSummaryGroups.map((group) => `<tr><td data-label="Sprite">${spriteImageHtml(group.sprite, group.label)}</td><td data-label="Actor">${htmlEscape(dollarId(group.actorId))}</td><td data-label="Guide label">${htmlEscape(group.label)}</td><td data-label="Source">${htmlEscape(group.name.short)}</td><td data-label="Evidence">${htmlEscape(group.name.detail)}</td></tr>`).join('\n');
  const enemyHtml = enemyGroups.map((group) => {
    const hpLines = [...new Set(group.actors.map(hpText))].join('\n');
    const nameClass = group.name.status === 'manual' ? 'manual' : 'generic';
    return `<article class="card"><div class="entry-head"><div class="sprite-wrap">${spriteImageHtml(group.sprite, group.label)}</div><div><h3>${htmlEscape(group.location)} · ${htmlEscape(group.label)}</h3><div class="meta"><span class="chip">${group.actors.length} placement${group.actors.length === 1 ? '' : 's'}</span><span class="chip">actor ${htmlEscape(hexId(group.actorId))}</span><span class="chip ${nameClass}">${htmlEscape(group.name.short)}</span></div></div></div><pre>${htmlEscape(hpLines)}</pre><details open><summary>Name source</summary>${detailParagraphs([group.name.detail])}</details><details><summary>ROM rows</summary><pre>${htmlEscape(group.actors.map(rawRow).join('\n'))}</pre></details><details><summary>HP and sprite proof</summary>${detailParagraphs([group.hpProof, group.classProof])}</details></article>`;
  }).join('\n');
  const characterHtml = characters.map(({ actor, manifest, location, sprite }) => `<article class="card"><div class="entry-head"><div class="sprite-wrap">${spriteImageHtml(sprite, actor.label)}</div><div><h3>${htmlEscape(location)} · ${htmlEscape(actor.label)}</h3><div class="meta"><span class="chip">${htmlEscape(actor.id)}</span><span class="chip">actor ${htmlEscape(hexId(actor.actorId))}</span><span class="chip">${htmlEscape(rawRow(actor))}</span></div></div></div><pre>${htmlEscape(textSummary(actor))}</pre><details><summary>Proof</summary>${detailParagraphs([proofSummary(actor), classProof(actor, manifest, classById)])}</details></article>`).join('\n');
  const manualHtml = manualReference.map((page) => `<section class="manual-page"><h3>Manual page ${page.page}: ${htmlEscape(page.heading)}</h3><div class="manual-names">${page.names.map((name) => `<span>${htmlEscape(name)}</span>`).join('')}</div><img src="${htmlEscape(page.image)}" alt="Castlevania II manual enemy page ${page.page}"></section>`).join('\n');
  const rawRowsHtml = [...rawIds.entries()]
    .sort((a, b) => parseInt(hexKey(a[0]), 16) - parseInt(hexKey(b[0]), 16))
    .map(([id, labels]) => `<tr><td data-label="Actor id">${htmlEscape(id)}</td><td data-label="Guide labels">${htmlEscape([...labels].sort().join('; '))}</td></tr>`)
    .join('\n');

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Left-of-Jova Character Audit</title><style>${css}</style></head><body><main><h1>Left-of-Jova Character Audit</h1><p class="summary">Generated ${htmlEscape(generatedAt)}. Scope: exterior guide sections added left of Jova plus Alba and Ondol interiors. Simon, signs, doors, clue books, moving platforms, and non-character secret effects are excluded; the Storigoi hidden merchant is included because it is a character.</p><section class="card"><h2>Validation Summary</h2><p>Actors audited: ${characters.length + exteriorEnemies.length} (${exteriorEnemies.length} enemy placements, ${characters.length} NPC/secret-character rows).</p><p>Enemy groups: ${enemyGroups.length}. Enemy actor ids with manual-proven names in this scope: ${manualIds.size}. Enemy actor ids still using generic fallback names in this scope: ${genericIds.size}.</p><p>Whole-ROM enemy atlas manual-name statuses: ${atlas.summary.manualNameStatuses['manual-match-proven']} proven, ${atlas.summary.manualNameStatuses['manual-match-unproven']} unproven. Report failures: ${failures.length}.</p>${failures.length ? `<pre>${htmlEscape(failures.join('\n'))}</pre>` : ''}</section><h2>Enemy Name Sources</h2><table><thead><tr><th>Sprite</th><th>Actor</th><th>Guide label</th><th>Source</th><th>Evidence</th></tr></thead><tbody>${nameRowsHtml}</tbody></table><h2>Enemies</h2><div class="grid">${enemyHtml}</div><h2>NPCs And Secret Characters</h2><div class="grid">${characterHtml}</div><h2>Manual Enemy Reference</h2>${manualHtml}<h2>Raw Actor IDs Audited</h2><table><thead><tr><th>Actor id</th><th>Guide labels in scope</th></tr></thead><tbody>${rawRowsHtml}</tbody></table></main></body></html>`;
  fs.writeFileSync(path.join(OUT_DIR, 'left-of-jova-character-audit-mobile.html'), html);

  const markdown = [];
  markdown.push('# Left-of-Jova Character Audit', '', `Generated: ${generatedAt}`, '', 'Scope: exterior guide sections newly added to the left of Jova plus the new Alba and Ondol interiors. Simon, signs, doors, clue books, moving platforms, and non-character secret effects are excluded; the Storigoi hidden merchant is included because it is a character.', '', '## Validation Summary', '', `- Actors audited: ${characters.length + exteriorEnemies.length} (${exteriorEnemies.length} enemy placements, ${characters.length} NPC/secret-character rows).`, `- Enemy groups: ${enemyGroups.length}.`, `- Enemy actor ids with manual-proven names in this scope: ${manualIds.size}.`, `- Enemy actor ids still using generic fallback names in this scope: ${genericIds.size}.`, `- Whole-ROM enemy atlas manual-name statuses: ${atlas.summary.manualNameStatuses['manual-match-proven']} proven, ${atlas.summary.manualNameStatuses['manual-match-unproven']} unproven.`, `- Failures: ${failures.length}${failures.length ? ` (${failures.join('; ')})` : ''}.`, '', '## Enemy Name Sources', '', '| Sprite | Actor id | Guide label | Source | Evidence |', '|---|---|---|---|---|');
  for (const group of nameSummaryGroups) {
    markdown.push(`| ${spriteImageMarkdown(group.sprite, group.label)} | ${dollarId(group.actorId)} | ${markdownEscape(group.label)} | ${markdownEscape(group.name.short)} | ${markdownEscape(group.name.detail)} |`);
  }
  markdown.push('', '## Enemy Placements', '', '| Sprite | Location | Enemy | Count and ROM rows | HP/details | Name source | HP and sprite proof |', '|---|---|---|---:|---|---|---|');
  for (const group of enemyGroups) {
    markdown.push(`| ${spriteImageMarkdown(group.sprite, group.label)} | ${markdownEscape(group.location)} | ${markdownEscape(group.label)}<br>${markdownEscape(group.classId)} | ${group.actors.length}<br>${markdownEscape(group.actors.map(rawRow).join('\n'))} | ${markdownEscape([...new Set(group.actors.map(hpText))].join('\n'))} | ${markdownEscape(group.name.short)}<br>${markdownEscape(group.name.detail)} | ${markdownEscape(group.hpProof)}<br>${markdownEscape(group.classProof)} |`);
  }
  markdown.push('', '## NPCs And Secret Characters', '', '| Sprite | Location | Guide label / id | ROM actor row | Dialog and guide details shown | Proof | Sprite proof |', '|---|---|---|---|---|---|---|');
  for (const { actor, manifest, location, sprite } of characters) {
    markdown.push(`| ${spriteImageMarkdown(sprite, actor.label)} | ${markdownEscape(location)} | ${markdownEscape(actor.label)}<br>${markdownEscape(actor.id)}<br>actor ${markdownEscape(hexId(actor.actorId))} data ${markdownEscape(actor.data)} | ${markdownEscape(rawRow(actor))} | ${markdownEscape(textSummary(actor))} | ${markdownEscape(proofSummary(actor))} | ${markdownEscape(classProof(actor, manifest, classById))} |`);
  }
  markdown.push('', '## Manual Enemy Reference', '');
  for (const page of manualReference) {
    markdown.push(`### Manual page ${page.page}: ${page.heading}`, '', page.names.map((name) => `- ${name}`).join('\n'), '', `![Manual page ${page.page}](${page.image})`, '');
  }
  markdown.push('', '## Raw Actor IDs Audited', '', '| Actor id | Guide labels in this scope |', '|---|---|');
  for (const [id, labels] of [...rawIds.entries()].sort((a, b) => parseInt(hexKey(a[0]), 16) - parseInt(hexKey(b[0]), 16))) {
    markdown.push(`| ${markdownEscape(id)} | ${markdownEscape([...labels].sort().join('\n'))} |`);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'left-of-jova-character-audit.md'), markdown.join('\n'));

  console.log(JSON.stringify({
    html: path.relative(ROOT, path.join(OUT_DIR, 'left-of-jova-character-audit-mobile.html')),
    markdown: path.relative(ROOT, path.join(OUT_DIR, 'left-of-jova-character-audit.md')),
    spriteDir: path.relative(ROOT, SPRITE_DIR),
    sprites: renderedSpriteByKey.size,
    characters: characters.length,
    enemyPlacements: exteriorEnemies.length,
    enemyGroups: enemyGroups.length,
    manualProvenActorIds: manualIds.size,
    genericActorIds: genericIds.size,
    atlasManualStatuses: atlas.summary.manualNameStatuses,
    failures
  }, null, 2));
}

main();
