'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_LOCATION_NAMES_FILE = path.join(__dirname, '..', 'data', 'location-names.json');

function loadLocationNames(filePath = DEFAULT_LOCATION_NAMES_FILE) {
  const resolved = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
  return {
    ...data,
    file: resolved,
    overrides: data.overrides || {},
    ambiguous: data.ambiguous || []
  };
}

function resolveLocationName(sourceName, opts = {}) {
  const names = opts.names || loadLocationNames(opts.filePath);
  const override = names.overrides[sourceName];
  const ambiguous = names.ambiguous.find((entry) => entry.sourceName === sourceName);
  const aliases = [
    ...(override?.aliases || []),
    ...(ambiguous?.aliases || [])
  ].filter((value, index, list) => value && list.indexOf(value) === index);

  return {
    name: override?.name || sourceName,
    sourceName,
    aliases,
    namingSource: override ? names.policy?.primarySource : 'tonylukasavage/cv2r',
    namingNote: ambiguous?.observedMapText
  };
}

module.exports = {
  DEFAULT_LOCATION_NAMES_FILE,
  loadLocationNames,
  resolveLocationName
};
