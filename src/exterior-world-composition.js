'use strict';

const fs = require('fs');
const path = require('path');
const { readPng, writePng } = require('./png');

const DEFAULT_TOPOLOGY_FILE = path.join('out', 'exterior-topology', 'topology.json');
const DEFAULT_RECIPE_ATLAS_FILE = path.join('out', 'render-recipe-atlas', 'manifest.json');
const DEFAULT_TRANSITION_RULES_FILE = path.join('out', 'transition-routine', 'decoder.json');
const DEFAULT_OUT_DIR = path.join('out', 'exterior-world-composition');
const DEFAULT_VARIANT = 'day';

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
  for (const entry of recipeAtlas.entries || []) {
    byLocationVariant.set(entryKey(entry.locationId, entry.variant), entry);
  }
  return { byLocationVariant };
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
      return {
        skipped: true,
        reason: `no recipe atlas entry for ${node.atlasId}`,
        areaId: area.id,
        nodeId
      };
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
    images.push({ placement, image });
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

function maxPlacedY(placed) {
  if (placed.length === 0) return 0;
  return Math.max(...placed.map((placement) => placement.y + placement.height));
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

function placementFromSide(currentGroup, nextGroup, side, horizontalGap) {
  return {
    x: side === 'right'
      ? currentGroup.x + currentGroup.width + horizontalGap
      : currentGroup.x - nextGroup.width - horizontalGap,
    y: currentGroup.y,
    width: nextGroup.width,
    height: nextGroup.height
  };
}

function isConnectorOnly(edge) {
  return edge.transitionSemantics?.placementMode === 'connector-only';
}

function isOrdinary(edge) {
  return edge.transitionSemantics?.placementMode === 'ordinary-adjacency';
}

function routineEvidenceForEdge(routineEvidenceByEdge, edge) {
  return routineEvidenceByEdge.get(edge.id);
}

function publicRoutineEvidence(evidence) {
  if (!evidence) {
    return {
      status: 'not-observed'
    };
  }
  return {
    status: evidence.status === 'complete' ? 'routine-observed' : 'routine-diagnostic',
    stepId: evidence.stepId,
    matchStatus: evidence.matchStatus,
    routineAfterBytes: evidence.routineAfterBytes,
    routineWriteCounts: evidence.routineWriteCounts,
    simon: evidence.simon,
    cameraChangedMetrics: evidence.cameraChangedMetrics
  };
}

function buildSubmapSequenceConstraints(topology, placements) {
  const nodePlacements = new Map();
  const groupsByNode = new Map();
  for (const group of placements) {
    for (const nodePlacement of group.nodePlacements) {
      nodePlacements.set(nodePlacement.nodeId, nodePlacement);
      groupsByNode.set(nodePlacement.nodeId, group);
    }
  }

  return (topology.edges || [])
    .filter((edge) => edge.type === 'submap-sequence')
    .map((edge) => {
      const source = nodePlacements.get(edge.source);
      const target = nodePlacements.get(edge.target);
      const group = groupsByNode.get(edge.source);
      const expectedTargetX = group && source ? group.x + source.relativeX + source.width : undefined;
      const expectedTargetY = group && source ? group.y + source.relativeY : undefined;
      const actualTargetX = group && target ? group.x + target.relativeX : undefined;
      const actualTargetY = group && target ? group.y + target.relativeY : undefined;
      const satisfied = expectedTargetX === actualTargetX && expectedTargetY === actualTargetY;
      return {
        edgeId: edge.id,
        edgeType: edge.type,
        confidence: edge.confidence,
        traversal: 'forward',
        direction: edge.direction,
        currentAreaId: edge.sourceArea,
        nextAreaId: edge.targetArea,
        edgeSourceArea: edge.sourceArea,
        edgeTargetArea: edge.targetArea,
        sourceNode: edge.source,
        targetNode: edge.target,
        transitionClass: edge.transitionSemantics?.transitionClass,
        transitionSemantics: edge.transitionSemantics,
        routineEvidence: { status: 'not-applicable' },
        status: satisfied ? 'satisfied' : 'conflict',
        relationship: 'target-submap-right-of-source-submap',
        placementSource: 'cv2r-submap-order',
        spatialClaim: satisfied ? 'submap-order-relative-layout' : 'none',
        proposedPlacement: expectedTargetX == null ? undefined : {
          x: expectedTargetX,
          y: expectedTargetY
        },
        appliedPlacement: actualTargetX == null ? undefined : {
          x: actualTargetX,
          y: actualTargetY
        },
        conflict: satisfied ? undefined : {
          reason: 'Submap sequence was not represented by adjacent node placement.'
        }
      };
    });
}

function addPlacement(group, x, y, placementSource, placed, placedByArea) {
  group.x = x;
  group.y = y;
  group.placementSource = placementSource;
  placed.push(group);
  placedByArea.set(group.id, group);
}

function firstFreeBreak(placed, nextGroup, rowGap, rowStep) {
  let candidate = {
    x: 0,
    y: maxPlacedY(placed) + rowGap,
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

function buildAreaAdjacency(edges) {
  const adjacency = new Map();
  for (const edge of edges) {
    if (edge.type !== 'boundary-transition' || !edge.sourceArea || !edge.targetArea) {
      continue;
    }
    if (!adjacency.has(edge.sourceArea)) adjacency.set(edge.sourceArea, []);
    if (!adjacency.has(edge.targetArea)) adjacency.set(edge.targetArea, []);
    adjacency.get(edge.sourceArea).push(edge);
    adjacency.get(edge.targetArea).push(edge);
  }
  for (const list of adjacency.values()) {
    list.sort((left, right) => left.id.localeCompare(right.id));
  }
  return adjacency;
}

function sortedRootOrder(topology, groupsByArea) {
  const ordered = [];
  const seen = new Set();
  const route = (topology.routes || [])[0];
  for (const areaId of route?.areaIds || []) {
    if (groupsByArea.has(areaId) && !seen.has(areaId)) {
      ordered.push(areaId);
      seen.add(areaId);
    }
  }
  for (const areaId of [...groupsByArea.keys()].sort()) {
    if (!seen.has(areaId)) {
      ordered.push(areaId);
      seen.add(areaId);
    }
  }
  return ordered;
}

function constraintBase(edge, currentAreaId, nextAreaId, relation, routineEvidence) {
  return {
    edgeId: edge.id,
    edgeType: edge.type,
    confidence: edge.confidence,
    traversal: relation?.traversal || 'inferred',
    direction: edge.direction,
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
    routineEvidence: publicRoutineEvidence(routineEvidence)
  };
}

function placeWorld(topology, groupsByArea, routineEvidenceByEdge, opts = {}) {
  const horizontalGap = opts.horizontalGap ?? 0;
  const rowGap = opts.rowGap ?? 64;
  const placed = [];
  const constraints = [];
  const unresolved = [];
  const placedByArea = new Map();
  const processedEdges = new Set();
  const edges = topology.edges || [];
  const boundaryEdges = edges.filter((edge) => edge.type === 'boundary-transition');
  const adjacency = buildAreaAdjacency(boundaryEdges);
  const rowStep = Math.max(...[...groupsByArea.values()].map((group) => group.height)) + rowGap;

  function processEdge(edge, currentAreaId, queue) {
    if (processedEdges.has(edge.id)) {
      return;
    }
    const currentGroup = placedByArea.get(currentAreaId);
    const nextAreaId = edge.sourceArea === currentAreaId ? edge.targetArea : edge.sourceArea;
    const nextGroup = groupsByArea.get(nextAreaId);
    const relation = relationFromEdge(edge, currentAreaId, nextAreaId);
    const routineEvidence = routineEvidenceForEdge(routineEvidenceByEdge, edge);
    const base = constraintBase(edge, currentAreaId, nextAreaId, relation, routineEvidence);
    processedEdges.add(edge.id);

    if (!nextGroup) {
      unresolved.push({
        ...base,
        status: 'unresolved',
        reason: 'target area is not renderable in the recipe atlas',
        spatialClaim: 'none'
      });
      return;
    }

    if (isConnectorOnly(edge)) {
      if (!placedByArea.has(nextAreaId)) {
        const candidate = firstFreeBreak(placed, nextGroup, rowGap, rowStep);
        addPlacement(nextGroup, candidate.x, candidate.y, 'deterministic-connector-layout', placed, placedByArea);
        queue.push(nextAreaId);
      }
      constraints.push({
        ...base,
        status: 'connector-only',
        relationship: 'connector-only-not-adjacent',
        placementSource: 'deterministic-connector-layout',
        spatialClaim: 'none',
        appliedPlacement: {
          x: nextGroup.x,
          y: nextGroup.y
        },
        solverAdjustment: {
          source: 'connector-only-route-break',
          note: 'Transition rules do not provide true transport coordinates, so this edge remains a connector.'
        }
      });
      return;
    }

    if (!isOrdinary(edge) || !relation) {
      unresolved.push({
        ...base,
        status: 'unresolved',
        reason: relation ? 'edge placement mode is not ordinary adjacency' : 'edge does not relate current and next areas',
        spatialClaim: 'none'
      });
      return;
    }

    const proposed = placementFromSide(currentGroup, nextGroup, relation.side, horizontalGap);
    if (!placedByArea.has(nextAreaId)) {
      let candidate = proposed;
      let solverShifts = 0;
      while (hasOverlap(candidate, placed)) {
        solverShifts += 1;
        candidate = {
          ...candidate,
          y: proposed.y + solverShifts * rowStep
        };
      }
      const placementSource = solverShifts > 0
        ? 'rom-topology-side-plus-deterministic-overlap-solver'
        : 'rom-topology-side';
      addPlacement(nextGroup, candidate.x, candidate.y, placementSource, placed, placedByArea);
      queue.push(nextAreaId);
      constraints.push({
        ...base,
        status: 'placed',
        relationship: relation.side === 'right' ? 'next-area-right-of-current-area' : 'next-area-left-of-current-area',
        placementSource,
        spatialClaim: solverShifts > 0 ? 'solver-derived-layout' : 'rom-topology-side',
        proposedPlacement: { x: proposed.x, y: proposed.y },
        appliedPlacement: { x: nextGroup.x, y: nextGroup.y },
        solverAdjustment: solverShifts > 0
          ? {
            source: 'deterministic-overlap-avoidance',
            shifts: solverShifts,
            rowStep,
            note: 'The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate.'
          }
          : undefined
      });
      return;
    }

    const actual = {
      x: nextGroup.x,
      y: nextGroup.y
    };
    const satisfied = actual.x === proposed.x && actual.y === proposed.y;
    constraints.push({
      ...base,
      status: satisfied ? 'satisfied' : 'conflict',
      relationship: relation.side === 'right' ? 'next-area-right-of-current-area' : 'next-area-left-of-current-area',
      placementSource: satisfied ? 'rom-topology-side' : 'existing-placement-conflict',
      spatialClaim: satisfied ? 'rom-topology-side' : 'none',
      proposedPlacement: { x: proposed.x, y: proposed.y },
      appliedPlacement: actual,
      conflict: satisfied ? undefined : {
        reason: 'Existing deterministic graph placement does not satisfy this additional ROM edge.',
        dx: actual.x - proposed.x,
        dy: actual.y - proposed.y
      }
    });
  }

  for (const rootAreaId of sortedRootOrder(topology, groupsByArea)) {
    if (placedByArea.has(rootAreaId)) {
      continue;
    }
    const rootGroup = groupsByArea.get(rootAreaId);
    const rootCandidate = placed.length === 0
      ? { x: 0, y: 0 }
      : firstFreeBreak(placed, rootGroup, rowGap, rowStep);
    addPlacement(rootGroup, rootCandidate.x, rootCandidate.y, 'deterministic-component-root', placed, placedByArea);
    const queue = [rootAreaId];
    for (let index = 0; index < queue.length; index += 1) {
      const areaId = queue[index];
      for (const edge of adjacency.get(areaId) || []) {
        processEdge(edge, areaId, queue);
      }
    }
  }

  for (const edge of boundaryEdges) {
    if (!processedEdges.has(edge.id)) {
      const routineEvidence = routineEvidenceForEdge(routineEvidenceByEdge, edge);
      unresolved.push({
        ...constraintBase(edge, edge.sourceArea, edge.targetArea, { traversal: 'unvisited', side: edge.direction }, routineEvidence),
        status: 'unresolved',
        reason: 'edge was not reachable through renderable area placement',
        spatialClaim: 'none'
      });
    }
  }

  return {
    placements: placed,
    constraints,
    unresolved,
    rowStep
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
  return { shiftX, shiftY };
}

function normalizeConstraintCoordinates(constraints, shift) {
  for (const constraint of constraints) {
    for (const key of ['proposedPlacement', 'appliedPlacement']) {
      if (constraint[key]) {
        constraint[key].x += shift.shiftX;
        constraint[key].y += shift.shiftY;
      }
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
  return { width, height };
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
    placementSource: placement.placementSource,
    source: placement.source,
    nodePlacements: placement.nodePlacements
  }));
}

function buildRoutineEvidenceIndex(transitionRules) {
  const byEdge = new Map();
  for (const evidence of transitionRules.edgeEvidence || transitionRules.compositionHints?.edgeEvidence || []) {
    if (evidence.edgeId) {
      byEdge.set(evidence.edgeId, evidence);
    }
  }
  return byEdge;
}

function summarizeComposition(topology, groupsByArea, placed, constraints, unresolved, skipped, image, normalized, margin) {
  const allConstraints = [...constraints, ...unresolved];
  const submapSequenceConstraints = constraints.filter((constraint) => constraint.edgeType === 'submap-sequence');
  const boundaryConstraints = constraints.filter((constraint) => constraint.edgeType === 'boundary-transition');
  const solverAdjusted = constraints.filter((constraint) => constraint.solverAdjustment?.source === 'deterministic-overlap-avoidance');
  const connectorOnly = constraints.filter((constraint) => constraint.status === 'connector-only');
  const routineSupported = allConstraints.filter((constraint) => constraint.routineEvidence?.status === 'routine-observed');
  const conflicts = constraints.filter((constraint) => constraint.status === 'conflict');
  const solved = constraints.filter((constraint) => constraint.status === 'placed' || constraint.status === 'satisfied');
  return {
    areas: placed.length,
    topologyAreas: topology.areas?.length || 0,
    nodes: placed.reduce((count, placement) => count + placement.nodePlacements.length, 0),
    topologyNodes: topology.nodes?.length || 0,
    constraints: allConstraints.length,
    submapSequenceConstraints: submapSequenceConstraints.length,
    boundaryConstraints: boundaryConstraints.length + unresolved.filter((constraint) => constraint.edgeType === 'boundary-transition').length,
    solvedConstraints: solved.length,
    connectorOnlyTransitions: connectorOnly.length,
    unresolvedConstraints: unresolved.length,
    conflictConstraints: conflicts.length,
    routineSupportedConstraints: routineSupported.length,
    deterministicSolverPlacements: placed.filter((placement) => /deterministic/.test(placement.placementSource || '')).length,
    genericOverlapShifts: solverAdjusted.length,
    handPlacedCoordinates: 0,
    skippedAreas: skipped.length,
    skippedNodes: skipped.reduce((count, item) => count + (item.nodeId ? 1 : 0), 0),
    width: image.width,
    height: image.height,
    margin,
    normalizedShift: normalized,
    output: 'world.png',
    groupsByArea: groupsByArea.size
  };
}

function renderExteriorWorldComposition(opts = {}) {
  const projectRoot = path.resolve(opts.projectRoot || process.cwd());
  const topologyFile = path.resolve(opts.topologyFile || DEFAULT_TOPOLOGY_FILE);
  const recipeAtlasFile = path.resolve(opts.recipeAtlasFile || DEFAULT_RECIPE_ATLAS_FILE);
  const transitionRulesFile = path.resolve(opts.transitionRulesFile || DEFAULT_TRANSITION_RULES_FILE);
  const recipeAtlasRoot = path.dirname(recipeAtlasFile);
  const requestedVariant = opts.variant || DEFAULT_VARIANT;
  const outDir = path.resolve(opts.outDir || DEFAULT_OUT_DIR);
  const margin = opts.margin ?? 32;

  const topology = readJson(topologyFile);
  const recipeAtlas = readJson(recipeAtlasFile);
  const transitionRules = fs.existsSync(transitionRulesFile) ? readJson(transitionRulesFile) : { edgeEvidence: [] };
  const nodesById = new Map((topology.nodes || []).map((node) => [node.id, node]));
  const entryIndex = buildEntryIndex(recipeAtlas);
  const groupsByArea = new Map();
  const skipped = [];

  for (const area of topology.areas || []) {
    const group = createAreaGroup(area, {
      nodesById,
      entryIndex,
      recipeAtlasRoot,
      requestedVariant,
      projectRoot
    });
    if (group.skipped) {
      skipped.push(group);
    } else {
      groupsByArea.set(area.id, group);
    }
  }

  const routineEvidenceByEdge = buildRoutineEvidenceIndex(transitionRules);
  const placed = placeWorld(topology, groupsByArea, routineEvidenceByEdge, {
    horizontalGap: opts.horizontalGap ?? 0,
    rowGap: opts.rowGap ?? 64
  });
  const constraints = [
    ...buildSubmapSequenceConstraints(topology, placed.placements),
    ...placed.constraints
  ];
  const normalized = normalizePlacements(placed.placements, margin);
  normalizeConstraintCoordinates(constraints, normalized);
  normalizeConstraintCoordinates(placed.unresolved, normalized);

  fs.mkdirSync(outDir, { recursive: true });
  const imagePath = path.join(outDir, 'world.png');
  const image = composeImage(placed.placements, imagePath, margin);
  const summary = summarizeComposition(
    topology,
    groupsByArea,
    placed.placements,
    constraints,
    placed.unresolved,
    skipped,
    image,
    normalized,
    margin
  );

  const composition = {
    schemaVersion: 1,
    source: {
      renderer: 'rom-derived-exterior-world-composition',
      topologyFile: asRelative(projectRoot, topologyFile),
      recipeAtlasFile: asRelative(projectRoot, recipeAtlasFile),
      transitionRulesFile: fs.existsSync(transitionRulesFile) ? asRelative(projectRoot, transitionRulesFile) : undefined,
      notes: [
        'Every rendered area comes from topology nodes and recipe-atlas images.',
        'No per-area hand coordinates are used.',
        'Routine decoder evidence changes confidence labels, not coordinates, unless a decoded spatial rule exists.',
        'Generic solver row shifts are labeled as solver-derived layout choices, not ROM-derived world coordinates.'
      ]
    },
    world: {
      variant: requestedVariant,
      status: 'constraint-composition-draft',
      note: 'Full exterior graph composition driven by ROM topology, recipe-atlas dimensions, transition routine evidence, and deterministic solver layout.'
    },
    summary,
    placements: publicPlacements(placed.placements),
    constraints,
    unresolved: placed.unresolved,
    skipped
  };

  const manifestPath = path.join(outDir, 'world-composition.json');
  writeJson(manifestPath, composition);
  fs.writeFileSync(
    path.join(outDir, 'world-composition-data.js'),
    `window.EXTERIOR_WORLD_COMPOSITION = ${JSON.stringify(composition, null, 2)};\n`
  );

  return {
    output: outDir,
    image: imagePath,
    manifest: manifestPath,
    summary
  };
}

module.exports = {
  renderExteriorWorldComposition
};
