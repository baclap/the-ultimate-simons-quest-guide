'use strict';

const fs = require('fs');
const path = require('path');
const { readPng, writePng } = require('./png');

const DEFAULT_TOPOLOGY_FILE = path.join('out', 'exterior-topology', 'topology.json');
const DEFAULT_RECIPE_ATLAS_FILE = path.join('out', 'render-recipe-atlas', 'manifest.json');
const DEFAULT_ROUTE_ID = 'jova-to-castlevania-area-path';
const DEFAULT_VARIANT = 'day';
const DEFAULT_OUT_DIR = path.join('out', 'exterior-composition');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function asRelative(root, filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function entryKey(locationId, variant) {
  return `${locationId}:${variant}`;
}

function buildEntryIndex(recipeAtlas) {
  const byLocationVariant = new Map();
  const byId = new Map();
  for (const entry of recipeAtlas.entries || []) {
    byId.set(entry.id, entry);
    byLocationVariant.set(entryKey(entry.locationId, entry.variant), entry);
  }
  return {
    byId,
    byLocationVariant
  };
}

function preferredVariants(node, requestedVariant) {
  if (node.category === 'castlevania-final-area' || node.objset === 5) {
    return ['fixed'];
  }
  return [requestedVariant, DEFAULT_VARIANT, 'fixed'].filter((variant, index, variants) => (
    variant && variants.indexOf(variant) === index
  ));
}

function resolveRecipeEntry(node, entryIndex, requestedVariant) {
  for (const variant of preferredVariants(node, requestedVariant)) {
    const entry = entryIndex.byLocationVariant.get(entryKey(node.atlasId, variant));
    if (entry) {
      return entry;
    }
  }
  return undefined;
}

function loadImage(entry, recipeAtlasRoot) {
  const imagePath = path.resolve(recipeAtlasRoot, entry.output);
  const image = readPng(imagePath);
  return {
    ...image,
    imagePath
  };
}

function createAreaGroup(area, opts) {
  const {
    nodesById,
    entryIndex,
    recipeAtlasRoot,
    requestedVariant,
    projectRoot
  } = opts;
  const nodePlacements = [];
  const images = [];
  let width = 0;
  let height = 0;

  for (const nodeId of area.nodeIds) {
    const node = nodesById.get(nodeId);
    if (!node) {
      throw new Error(`topology area ${area.id} references missing node ${nodeId}`);
    }

    const entry = resolveRecipeEntry(node, entryIndex, requestedVariant);
    if (!entry) {
      throw new Error(`no recipe atlas entry for ${node.atlasId} variant ${requestedVariant}`);
    }

    const image = loadImage(entry, recipeAtlasRoot);
    const relativeX = width;
    const placement = {
      nodeId: node.id,
      atlasId: node.atlasId,
      entryId: entry.id,
      name: entry.name || node.name,
      access: entry.access,
      variant: entry.variant,
      recipeStatus: entry.recipe?.status,
      renderStatus: entry.renderStatus,
      width: image.width,
      height: image.height,
      relativeX,
      relativeY: 0,
      output: entry.output,
      sourceFile: asRelative(projectRoot, image.imagePath),
      derivation: {
        source: 'recipe-atlas-entry',
        layoutContext: entry.recipe?.layoutContext,
        paletteContext: entry.recipe?.paletteContext,
        chrBanks: entry.recipe?.chrBanks,
        palette: entry.recipe?.palette && {
          status: entry.recipe.palette.status,
          variant: entry.recipe.palette.variant,
          address: entry.recipe.palette.address,
          selector: entry.recipe.palette.selector
        }
      }
    };

    nodePlacements.push(placement);
    images.push({
      placement,
      image
    });
    width += image.width;
    height = Math.max(height, image.height);
  }

  return {
    id: area.id,
    label: area.label,
    category: area.category,
    objset: area.objsetHex,
    area: area.areaHex,
    width,
    height,
    source: {
      areaGrouping: 'rom-topology-area',
      submapOrder: 'cv2r-submap-order',
      dimensions: 'recipe-atlas-layout-header'
    },
    nodePlacements,
    images
  };
}

function hasOverlap(candidate, placed) {
  return placed.some((existing) => !(
    candidate.x + candidate.width <= existing.x ||
    existing.x + existing.width <= candidate.x ||
    candidate.y + candidate.height <= existing.y ||
    existing.y + existing.height <= candidate.y
  ));
}

function relationFromEdge(edge, currentAreaId, nextAreaId) {
  if (edge.sourceArea === currentAreaId && edge.targetArea === nextAreaId) {
    return {
      side: edge.direction,
      traversal: 'forward'
    };
  }

  if (edge.targetArea === currentAreaId && edge.sourceArea === nextAreaId) {
    return {
      side: edge.direction === 'right' ? 'left' : 'right',
      traversal: 'reverse'
    };
  }

  return undefined;
}

function isConnectorOnly(edge) {
  return edge.transitionSemantics?.placementMode === 'connector-only';
}

function firstFreeRouteBreak(placed, referenceGroup, nextGroup, rowStep, rowGap) {
  const maxY = Math.max(...placed.map((placement) => placement.y + placement.height));
  let candidate = {
    x: referenceGroup.x,
    y: maxY + rowGap,
    width: nextGroup.width,
    height: nextGroup.height
  };

  while (hasOverlap(candidate, placed)) {
    candidate = {
      ...candidate,
      y: candidate.y + rowStep
    };
  }

  return candidate;
}

function placeRouteGroups(route, groupsByArea, edgesById, opts = {}) {
  const horizontalGap = opts.horizontalGap ?? 0;
  const rowGap = opts.rowGap ?? 64;
  const placements = [];
  const constraints = [];
  const unresolved = [];
  const placedByArea = new Map();

  const firstAreaId = route.areaIds[0];
  const firstGroup = groupsByArea.get(firstAreaId);
  if (!firstGroup) {
    throw new Error(`route ${route.id} starts with missing group ${firstAreaId}`);
  }

  firstGroup.x = 0;
  firstGroup.y = 0;
  placements.push(firstGroup);
  placedByArea.set(firstGroup.id, firstGroup);

  const rowStep = Math.max(...[...groupsByArea.values()].map((group) => group.height)) + rowGap;

  for (let index = 1; index < route.areaIds.length; index += 1) {
    const currentAreaId = route.areaIds[index - 1];
    const nextAreaId = route.areaIds[index];
    const currentGroup = placedByArea.get(currentAreaId);
    const nextGroup = groupsByArea.get(nextAreaId);
    const edgeId = route.edgeIds[index - 1];
    const edge = edgesById.get(edgeId);

    if (!currentGroup || !nextGroup || !edge) {
      unresolved.push({
        index,
        currentAreaId,
        nextAreaId,
        edgeId,
        reason: !edge ? 'missing-route-edge' : 'missing-area-group'
      });
      continue;
    }

    const relation = relationFromEdge(edge, currentAreaId, nextAreaId);
    if (isConnectorOnly(edge)) {
      const candidate = firstFreeRouteBreak(placements, currentGroup, nextGroup, rowStep, rowGap);
      nextGroup.x = candidate.x;
      nextGroup.y = candidate.y;
      placements.push(nextGroup);
      placedByArea.set(nextGroup.id, nextGroup);

      constraints.push({
        index,
        edgeId,
        source: 'transition-semantics',
        confidence: edge.confidence,
        traversal: relation?.traversal || 'inferred',
        direction: edge.direction,
        relationship: 'connector-only-not-adjacent',
        currentAreaId,
        nextAreaId,
        edgeSourceArea: edge.sourceArea,
        edgeTargetArea: edge.targetArea,
        sourceNode: edge.source,
        targetNode: edge.target,
        transitionClass: edge.transitionSemantics?.transitionClass,
        transitionSemantics: edge.transitionSemantics,
        transition: edge.transition && {
          kind: edge.transition.kind,
          marker: edge.transition.marker,
          bytes: edge.transition.bytes,
          target: edge.transition.target
        },
        proposedPlacement: undefined,
        appliedPlacement: {
          x: nextGroup.x,
          y: nextGroup.y
        },
        solverAdjustment: {
          source: 'connector-only-route-break',
          shifts: 1,
          rowStep,
          note: 'Transition semantics say this edge should be a connector, not an ordinary left/right adjacency. Exact transport coordinates remain unresolved.'
        }
      });
      continue;
    }

    let side = relation?.side;
    let relationshipSource = 'rom-boundary-transition';
    if (!side) {
      side = 'right';
      relationshipSource = 'solver-inferred-fallback';
      unresolved.push({
        index,
        currentAreaId,
        nextAreaId,
        edgeId,
        reason: 'route edge does not directly connect current and next area'
      });
    }

    const proposedX = side === 'right'
      ? currentGroup.x + currentGroup.width + horizontalGap
      : currentGroup.x - nextGroup.width - horizontalGap;
    let proposedY = currentGroup.y;
    let solverShifts = 0;
    let candidate = {
      x: proposedX,
      y: proposedY,
      width: nextGroup.width,
      height: nextGroup.height
    };

    while (hasOverlap(candidate, placements)) {
      proposedY += rowStep;
      solverShifts += 1;
      candidate = {
        ...candidate,
        y: proposedY
      };
    }

    nextGroup.x = candidate.x;
    nextGroup.y = candidate.y;
    placements.push(nextGroup);
    placedByArea.set(nextGroup.id, nextGroup);

    constraints.push({
      index,
      edgeId,
      source: relationshipSource,
      confidence: edge.confidence,
      traversal: relation?.traversal || 'inferred',
      direction: edge.direction,
      relationship: side === 'right' ? 'next-area-right-of-current-area' : 'next-area-left-of-current-area',
      transitionClass: edge.transitionSemantics?.transitionClass,
      transitionSemantics: edge.transitionSemantics,
      currentAreaId,
      nextAreaId,
      edgeSourceArea: edge.sourceArea,
      edgeTargetArea: edge.targetArea,
      sourceNode: edge.source,
      targetNode: edge.target,
      transition: edge.transition && {
        kind: edge.transition.kind,
        marker: edge.transition.marker,
        bytes: edge.transition.bytes,
        target: edge.transition.target
      },
      proposedPlacement: {
        x: proposedX,
        y: currentGroup.y
      },
      appliedPlacement: {
        x: nextGroup.x,
        y: nextGroup.y
      },
      solverAdjustment: solverShifts > 0
        ? {
          source: 'generic-overlap-avoidance',
          shifts: solverShifts,
          rowStep,
          note: 'The route relation came from ROM transition direction; only the row shift is inferred to avoid reusing the same layout space.'
        }
        : undefined
    });
  }

  return {
    placements,
    constraints,
    unresolved
  };
}

function normalizePlacements(placements, margin) {
  const minX = Math.min(...placements.map((placement) => placement.x));
  const minY = Math.min(...placements.map((placement) => placement.y));
  const shiftX = margin - minX;
  const shiftY = margin - minY;

  for (const placement of placements) {
    placement.x += shiftX;
    placement.y += shiftY;
    for (const nodePlacement of placement.nodePlacements) {
      nodePlacement.x = placement.x + nodePlacement.relativeX;
      nodePlacement.y = placement.y + nodePlacement.relativeY;
    }
  }

  return {
    shiftX,
    shiftY
  };
}

function normalizeConstraintCoordinates(constraints, shift) {
  for (const constraint of constraints) {
    if (constraint.proposedPlacement) {
      constraint.proposedPlacement.x += shift.shiftX;
      constraint.proposedPlacement.y += shift.shiftY;
    }
    if (constraint.appliedPlacement) {
      constraint.appliedPlacement.x += shift.shiftX;
      constraint.appliedPlacement.y += shift.shiftY;
    }
  }
}

function composeImage(placements, outPath, margin) {
  const width = Math.ceil(Math.max(...placements.map((placement) => placement.x + placement.width)) + margin);
  const height = Math.ceil(Math.max(...placements.map((placement) => placement.y + placement.height)) + margin);
  const rgba = Buffer.alloc(width * height * 4, 0);

  for (const group of placements) {
    for (const item of group.images) {
      const destX = group.x + item.placement.relativeX;
      const destY = group.y + item.placement.relativeY;
      for (let y = 0; y < item.image.height; y += 1) {
        const srcStart = y * item.image.width * 4;
        const srcEnd = srcStart + item.image.width * 4;
        const destStart = ((destY + y) * width + destX) * 4;
        item.image.rgba.copy(rgba, destStart, srcStart, srcEnd);
      }
    }
  }

  writePng(outPath, width, height, rgba);
  return {
    width,
    height
  };
}

function publicPlacements(placements) {
  return placements.map((placement) => ({
    id: placement.id,
    label: placement.label,
    category: placement.category,
    objset: placement.objset,
    area: placement.area,
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height,
    source: placement.source,
    nodePlacements: placement.nodePlacements
  }));
}

function renderExteriorComposition(opts = {}) {
  const projectRoot = path.resolve(opts.projectRoot || process.cwd());
  const topologyFile = path.resolve(opts.topologyFile || DEFAULT_TOPOLOGY_FILE);
  const recipeAtlasFile = path.resolve(opts.recipeAtlasFile || DEFAULT_RECIPE_ATLAS_FILE);
  const recipeAtlasRoot = path.dirname(recipeAtlasFile);
  const routeId = opts.routeId || DEFAULT_ROUTE_ID;
  const requestedVariant = opts.variant || DEFAULT_VARIANT;
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  const margin = opts.margin ?? 32;

  const topology = readJson(topologyFile);
  const recipeAtlas = readJson(recipeAtlasFile);
  const route = (topology.routes || []).find((candidate) => candidate.id === routeId);
  if (!route) {
    throw new Error(`topology route not found: ${routeId}`);
  }

  const nodesById = new Map((topology.nodes || []).map((node) => [node.id, node]));
  const areasById = new Map((topology.areas || []).map((area) => [area.id, area]));
  const edgesById = new Map((topology.edges || []).map((edge) => [edge.id, edge]));
  const entryIndex = buildEntryIndex(recipeAtlas);
  const groupsByArea = new Map();

  for (const areaId of route.areaIds) {
    const area = areasById.get(areaId);
    if (!area) {
      throw new Error(`route ${route.id} references missing area ${areaId}`);
    }
    groupsByArea.set(areaId, createAreaGroup(area, {
      nodesById,
      entryIndex,
      recipeAtlasRoot,
      requestedVariant,
      projectRoot
    }));
  }

  const placed = placeRouteGroups(route, groupsByArea, edgesById, {
    horizontalGap: opts.horizontalGap ?? 0,
    rowGap: opts.rowGap ?? 64
  });
  const normalized = normalizePlacements(placed.placements, margin);
  normalizeConstraintCoordinates(placed.constraints, normalized);

  fs.mkdirSync(outDir, { recursive: true });
  const imagePath = path.join(outDir, 'composition.png');
  const image = composeImage(placed.placements, imagePath, margin);

  const solverInferred = placed.constraints.filter((constraint) => (
    constraint.solverAdjustment || constraint.source !== 'rom-boundary-transition'
  )).length;
  const genericOverlapShifts = placed.constraints.filter((constraint) => (
    constraint.solverAdjustment?.source === 'generic-overlap-avoidance'
  )).length;
  const connectorOnlyTransitions = placed.constraints.filter((constraint) => (
    constraint.relationship === 'connector-only-not-adjacent'
  )).length;
  const nodeCount = placed.placements.reduce((count, placement) => count + placement.nodePlacements.length, 0);
  const composition = {
    schemaVersion: 1,
    source: {
      renderer: 'rom-topology-route-composition',
      topologyFile: asRelative(projectRoot, topologyFile),
      recipeAtlasFile: asRelative(projectRoot, recipeAtlasFile),
      routeSource: 'shortest route over ROM-derived boundary-transition edges',
      notes: [
        'Area adjacency comes from ROM area transition triples decoded by the exterior topology pass.',
        'Transition semantics classify connector-only edges before placement.',
        'Within one area, submap order comes from the topology area record order.',
        'Segment dimensions and pixels come from the ROM-derived recipe atlas.',
        'Connector route breaks and collision row shifts are not claimed as ROM world coordinates.'
      ]
    },
    route: {
      id: route.id,
      label: route.label,
      variant: requestedVariant,
      status: 'draft-composition',
      note: 'This draft composes the route with ROM-derived left/right constraints, but exact world coordinates still need deeper scroll/entrance decoding.'
    },
    summary: {
      areas: placed.placements.length,
      nodes: nodeCount,
      constraints: placed.constraints.length,
      romDerivedPlacementConstraints: placed.constraints.filter((constraint) => constraint.source === 'rom-boundary-transition').length,
      connectorOnlyTransitions,
      genericOverlapShifts,
      solverInferredPlacements: solverInferred,
      unresolvedPlacements: placed.unresolved.length,
      width: image.width,
      height: image.height,
      margin,
      normalizedShift: normalized,
      output: 'composition.png'
    },
    placements: publicPlacements(placed.placements),
    constraints: placed.constraints,
    unresolved: placed.unresolved
  };

  const manifestPath = path.join(outDir, 'composition.json');
  writeJson(manifestPath, composition);
  fs.writeFileSync(
    path.join(outDir, 'composition-data.js'),
    `window.EXTERIOR_COMPOSITION = ${JSON.stringify(composition, null, 2)};\n`
  );

  return {
    output: outDir,
    image: imagePath,
    manifest: manifestPath,
    summary: composition.summary,
    route: composition.route
  };
}

module.exports = {
  renderExteriorComposition
};
