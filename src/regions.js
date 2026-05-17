'use strict';

const fs = require('fs');
const path = require('path');
const { deriveBackgroundContext } = require('./background-context');
const { loadBackgroundDescriptor } = require('./descriptors');
const { renderNativeBackgroundImage } = require('./native-image');
const { writePng } = require('./png');

const DEFAULT_REGIONS_FILE = path.join(__dirname, '..', 'data', 'regions.json');

function parseInteger(value, label) {
  if (value == null) {
    return value;
  }
  if (Number.isInteger(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    throw new Error(`${label} must be an integer or numeric string`);
  }
  const trimmed = value.trim();
  const parsed = /^0x/i.test(trimmed)
    ? Number.parseInt(trimmed.slice(2), 16)
    : Number.parseInt(trimmed, 10);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be an integer or numeric string`);
  }
  return parsed;
}

function parseIntegerArray(values, label) {
  if (!Array.isArray(values)) {
    throw new Error(`${label} must be an array`);
  }
  return values.map((value, index) => parseInteger(value, `${label}[${index}]`));
}

function normalizeRuntimeContext(raw = {}, label = 'runtimeContext') {
  return {
    ...raw,
    objset: parseInteger(raw.objset, `${label}.objset`),
    area: parseInteger(raw.area, `${label}.area`),
    submap: parseInteger(raw.submap, `${label}.submap`)
  };
}

function normalizeTemplate(raw, id) {
  return {
    ...raw,
    id,
    chrBanks: parseIntegerArray(raw.chrBanks, `templates.${id}.chrBanks`),
    layoutBank: parseInteger(raw.layoutBank, `templates.${id}.layoutBank`),
    tileBank: parseInteger(raw.tileBank, `templates.${id}.tileBank`),
    paletteBank: parseInteger(raw.paletteBank, `templates.${id}.paletteBank`),
    paletteAddress: parseInteger(raw.paletteAddress, `templates.${id}.paletteAddress`),
    widthBlocks: parseInteger(raw.widthBlocks, `templates.${id}.widthBlocks`),
    heightBlocks: parseInteger(raw.heightBlocks, `templates.${id}.heightBlocks`),
    visiblePage: parseInteger(raw.visiblePage, `templates.${id}.visiblePage`),
    scrollX: parseInteger(raw.scrollX, `templates.${id}.scrollX`),
    scrollY: parseInteger(raw.scrollY, `templates.${id}.scrollY`)
  };
}

function normalizeRegionEntry(raw, index) {
  return {
    ...raw,
    visiblePage: parseInteger(raw.visiblePage, `layout[${index}].visiblePage`),
    scrollX: parseInteger(raw.scrollX, `layout[${index}].scrollX`),
    scrollY: parseInteger(raw.scrollY, `layout[${index}].scrollY`),
    runtimeContext: normalizeRuntimeContext(raw.runtimeContext, `layout[${index}].runtimeContext`)
  };
}

function loadRegionFile(filePath = DEFAULT_REGIONS_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  const templates = {};
  for (const [id, template] of Object.entries(data.templates || {})) {
    templates[id] = normalizeTemplate(template, id);
  }
  return {
    ...data,
    filePath: resolved,
    templates,
    regions: (data.regions || []).map((region) => ({
      ...region,
      tileWidth: parseInteger(region.tileWidth, `regions.${region.id}.tileWidth`) || 256,
      tileHeight: parseInteger(region.tileHeight, `regions.${region.id}.tileHeight`) || 240,
      layout: (region.layout || []).map(normalizeRegionEntry)
    }))
  };
}

function loadRegion(id, opts = {}) {
  const file = loadRegionFile(opts.filePath);
  const region = file.regions.find((candidate) => candidate.id === id);
  if (!region) {
    throw new Error(`unknown region "${id}" in ${file.filePath}`);
  }
  return {
    ...region,
    templates: file.templates,
    filePath: file.filePath
  };
}

function descriptorFromRegionEntry(rom, info, entry, template) {
  if (entry.descriptor) {
    return loadBackgroundDescriptor(entry.descriptor);
  }
  if (!template) {
    throw new Error(`region entry "${entry.id}" must define descriptor or template`);
  }

  const runtimeContext = normalizeRuntimeContext(entry.runtimeContext, `${entry.id}.runtimeContext`);
  const context = deriveBackgroundContext(rom, info, runtimeContext);
  return {
    id: `${entry.id}-candidate`,
    label: entry.label,
    location: entry.label,
    variant: template.variant,
    access: template.access,
    paletteMode: template.paletteMode,
    renderer: template.renderer,
    runtimeContext: {
      ...runtimeContext,
      chrBanks: template.chrBanks
    },
    layoutHeaderAddress: parseInteger(context.derivedDescriptorFields.layoutHeaderAddress, `${entry.id}.layoutHeaderAddress`),
    layoutHeaderBank: context.derivedDescriptorFields.layoutHeaderBank,
    layoutBank: template.layoutBank,
    tileBank: template.tileBank,
    tileSetAddress: parseInteger(context.derivedDescriptorFields.tileSetAddress, `${entry.id}.tileSetAddress`),
    paletteBank: template.paletteBank,
    paletteAddress: template.paletteAddress,
    widthBlocks: template.widthBlocks,
    heightBlocks: template.heightBlocks,
    nametableMirroring: template.nametableMirroring,
    pages: [{
      name: entry.id,
      page: template.visiblePage || 0,
      layoutSection: 0,
      columnGroup: 0
    }]
  };
}

function renderRegion(rom, info, region, opts = {}) {
  const tileWidth = region.tileWidth || 256;
  const tileHeight = region.tileHeight || 240;
  const columns = opts.columns || region.layout.length;
  const rows = Math.ceil(region.layout.length / columns);
  const width = tileWidth * columns;
  const height = tileHeight * rows;
  const rgba = Buffer.alloc(width * height * 4);
  const entries = [];

  for (let index = 0; index < region.layout.length; index += 1) {
    const entry = region.layout[index];
    const template = entry.template ? region.templates[entry.template] : undefined;
    const descriptor = descriptorFromRegionEntry(rom, info, entry, template);
    const visiblePage = entry.visiblePage ?? template?.visiblePage ?? descriptor.defaultVisiblePage ?? descriptor.pages[0]?.page ?? 0;
    const statePath = entry.state ? path.resolve(entry.state) : undefined;
    const image = renderNativeBackgroundImage(rom, info, {
      descriptor,
      visiblePage,
      statePath,
      scrollX: entry.scrollX ?? template?.scrollX,
      scrollY: entry.scrollY ?? template?.scrollY
    });
    const destX = (index % columns) * tileWidth;
    const destY = Math.floor(index / columns) * tileHeight;

    for (let y = 0; y < tileHeight; y += 1) {
      const sourceStart = y * image.width * 4;
      const destStart = ((destY + y) * width + destX) * 4;
      image.rgba.copy(rgba, destStart, sourceStart, sourceStart + tileWidth * 4);
    }

    entries.push({
      id: entry.id,
      label: entry.label,
      status: entry.status || 'unknown',
      validation: entry.validation,
      descriptor: descriptor.id,
      template: entry.template,
      source: entry.descriptor ? 'descriptor' : 'derived-context',
      position: { x: destX, y: destY, width: tileWidth, height: tileHeight },
      runtimeContext: descriptor.runtimeContext,
      layoutHeaderAddress: image.metadata.background.layoutHeaderAddress,
      layoutHeaderBank: image.metadata.background.layoutHeaderBank,
      tileSetAddress: image.metadata.background.tileSetAddress,
      paletteAddress: image.metadata.paletteAddress,
      chrBanks: image.metadata.chrBanks
    });
  }

  return {
    width,
    height,
    rgba,
    metadata: {
      id: region.id,
      label: region.label,
      summary: region.summary,
      tileWidth,
      tileHeight,
      columns,
      rows,
      entries
    }
  };
}

function renderRegionPng(rom, info, region, output, opts = {}) {
  const rendered = renderRegion(rom, info, region, opts);
  writePng(output, rendered.width, rendered.height, rendered.rgba);
  return {
    output: path.resolve(output),
    width: rendered.width,
    height: rendered.height,
    metadata: rendered.metadata
  };
}

module.exports = {
  DEFAULT_REGIONS_FILE,
  loadRegion,
  loadRegionFile,
  renderRegion,
  renderRegionPng
};
