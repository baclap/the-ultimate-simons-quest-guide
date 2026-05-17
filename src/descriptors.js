'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_BACKGROUND_DESCRIPTORS = path.join(__dirname, '..', 'data', 'background-descriptors.json');
const SUPPORTED_RENDERER = 'native-background-v1';

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

function requiredInteger(value, label) {
  const parsed = parseInteger(value, label);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} is required`);
  }
  return parsed;
}

function parseIntegerArray(values, label) {
  if (values == null) {
    return values;
  }
  if (!Array.isArray(values)) {
    throw new Error(`${label} must be an array`);
  }
  return values.map((value, index) => parseInteger(value, `${label}[${index}]`));
}

function normalizeRuntimeContext(raw = {}) {
  return {
    ...raw,
    objset: parseInteger(raw.objset, 'runtimeContext.objset'),
    area: parseInteger(raw.area, 'runtimeContext.area'),
    submap: parseInteger(raw.submap, 'runtimeContext.submap'),
    actorPointer: parseInteger(raw.actorPointer, 'runtimeContext.actorPointer'),
    chrBanks: parseIntegerArray(raw.chrBanks, 'runtimeContext.chrBanks')
  };
}

function normalizeRowStream(raw, label) {
  if (raw == null) {
    return undefined;
  }
  return {
    startWorldRow: requiredInteger(raw.startWorldRow, `${label}.startWorldRow`),
    rowCount: requiredInteger(raw.rowCount, `${label}.rowCount`),
    columnGroup: requiredInteger(raw.columnGroup, `${label}.columnGroup`),
    columnCount: requiredInteger(raw.columnCount, `${label}.columnCount`),
    hiddenAttributeHighNibbles: parseIntegerArray(raw.hiddenAttributeHighNibbles, `${label}.hiddenAttributeHighNibbles`)
  };
}

function normalizePage(raw, index) {
  const label = `pages[${index}]`;
  return {
    ...raw,
    page: requiredInteger(raw.page, `${label}.page`),
    layoutSection: parseInteger(raw.layoutSection, `${label}.layoutSection`),
    columnGroup: parseInteger(raw.columnGroup, `${label}.columnGroup`),
    layoutAddress: parseInteger(raw.layoutAddress, `${label}.layoutAddress`),
    expectedLayoutAddress: parseInteger(raw.expectedLayoutAddress, `${label}.expectedLayoutAddress`),
    rowStream: normalizeRowStream(raw.rowStream, `${label}.rowStream`)
  };
}

function normalizeValidation(raw, index) {
  return {
    ...raw,
    visiblePage: parseInteger(raw.visiblePage, `validation[${index}].visiblePage`),
    exactPages: parseIntegerArray(raw.exactPages, `validation[${index}].exactPages`)
  };
}

function normalizeBackgroundDescriptor(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('background descriptor must be an object');
  }
  if (!raw.id) {
    throw new Error('background descriptor is missing id');
  }
  if (raw.renderer !== SUPPORTED_RENDERER) {
    throw new Error(`background descriptor "${raw.id}" uses unsupported renderer "${raw.renderer}"`);
  }
  if (!Array.isArray(raw.pages) || raw.pages.length === 0) {
    throw new Error(`background descriptor "${raw.id}" must define at least one page`);
  }

  const descriptor = {
    ...raw,
    name: raw.name || raw.id,
    runtimeContext: normalizeRuntimeContext(raw.runtimeContext),
    layoutHeaderAddress: parseInteger(raw.layoutHeaderAddress, 'layoutHeaderAddress'),
    layoutHeaderBank: parseInteger(raw.layoutHeaderBank, 'layoutHeaderBank'),
    layoutBank: requiredInteger(raw.layoutBank, 'layoutBank'),
    tileBank: requiredInteger(raw.tileBank, 'tileBank'),
    tileSetAddress: requiredInteger(raw.tileSetAddress, 'tileSetAddress'),
    widthBlocks: requiredInteger(raw.widthBlocks, 'widthBlocks'),
    heightBlocks: requiredInteger(raw.heightBlocks, 'heightBlocks'),
    rowsPerLayoutSection: parseInteger(raw.rowsPerLayoutSection, 'rowsPerLayoutSection'),
    defaultVisiblePage: parseInteger(raw.defaultVisiblePage, 'defaultVisiblePage'),
    pages: raw.pages.map(normalizePage),
    validation: (raw.validation || []).map(normalizeValidation)
  };

  if (descriptor.pages.some((page) => page.layoutAddress == null) && descriptor.layoutHeaderAddress == null) {
    throw new Error(`background descriptor "${raw.id}" has pointer-based pages but no layoutHeaderAddress`);
  }
  if (descriptor.pages.some((page) => page.rowStream) && !Number.isInteger(descriptor.rowsPerLayoutSection)) {
    throw new Error(`background descriptor "${raw.id}" has rowStream pages but no rowsPerLayoutSection`);
  }

  return descriptor;
}

function loadBackgroundDescriptorFile(filePath = DEFAULT_BACKGROUND_DESCRIPTORS) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  if (!Array.isArray(data.descriptors)) {
    throw new Error(`${resolved} must contain a descriptors array`);
  }
  return {
    ...data,
    filePath: resolved,
    descriptors: data.descriptors.map(normalizeBackgroundDescriptor)
  };
}

function loadBackgroundDescriptors(filePath) {
  return loadBackgroundDescriptorFile(filePath).descriptors;
}

function loadBackgroundDescriptor(id, opts = {}) {
  const descriptorFile = opts.filePath || DEFAULT_BACKGROUND_DESCRIPTORS;
  const descriptor = loadBackgroundDescriptors(descriptorFile).find((candidate) => candidate.id === id);
  if (!descriptor) {
    throw new Error(`unknown background descriptor "${id}" in ${path.resolve(descriptorFile)}`);
  }
  return descriptor;
}

module.exports = {
  DEFAULT_BACKGROUND_DESCRIPTORS,
  loadBackgroundDescriptor,
  loadBackgroundDescriptorFile,
  loadBackgroundDescriptors,
  normalizeBackgroundDescriptor
};
