'use strict';

const fs = require('fs');
const path = require('path');
const { readPrgByte, readPrgWord, toHex } = require('./background');
const {
  AREA_TABLE_POINTERS,
  BACKGROUND_TABLE_BANK,
  SCREEN_RECORD_POINTERS_OFFSET
} = require('./background-context');
const {
  buildExteriorAtlas,
  locationId
} = require('./exterior-atlas');

const CATEGORY_BY_OBJSET = {
  0: 'town-exteriors',
  1: 'mansion-door-exteriors',
  2: 'western-overworld',
  3: 'eastern-overworld',
  4: 'mountains-and-castle-approach',
  5: 'castlevania-final-area'
};

function hex(value, width = 2) {
  if (value == null) {
    return undefined;
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`cannot format invalid hex value: ${value}`);
  }
  return `0x${number.toString(16).toUpperCase().padStart(width, '0')}`;
}

function areaId(context) {
  return [
    `obj${Number(context.objset).toString(16).padStart(2, '0')}`,
    `area${Number(context.area).toString(16).padStart(2, '0')}`
  ].join('-');
}

function nodeId(context) {
  return [
    areaId(context),
    `sub${Number(context.submap || 0).toString(16).padStart(2, '0')}`
  ].join('-');
}

function readBackgroundTableByte(rom, info, cpuAddress) {
  return readPrgByte(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readBackgroundTableWord(rom, info, cpuAddress) {
  return readPrgWord(rom, info, cpuAddress, { bank: BACKGROUND_TABLE_BANK });
}

function readAreaRecord(rom, info, objset, area) {
  const areaTablePointerAddress = AREA_TABLE_POINTERS + objset * 2;
  const areaTableAddress = readBackgroundTableWord(rom, info, areaTablePointerAddress);
  const areaRecordPointerAddress = areaTableAddress + area * 2;
  const areaRecordAddress = readBackgroundTableWord(rom, info, areaRecordPointerAddress);
  const maxSubmap = readBackgroundTableByte(rom, info, areaRecordAddress + 2);

  return {
    areaTablePointerAddress,
    areaTableAddress,
    areaRecordPointerAddress,
    areaRecordAddress,
    maxSubmap,
    leftBytes: [
      readBackgroundTableByte(rom, info, areaRecordAddress + 3),
      readBackgroundTableByte(rom, info, areaRecordAddress + 4),
      readBackgroundTableByte(rom, info, areaRecordAddress + 5)
    ],
    rightBytes: [
      readBackgroundTableByte(rom, info, areaRecordAddress + 6),
      readBackgroundTableByte(rom, info, areaRecordAddress + 7),
      readBackgroundTableByte(rom, info, areaRecordAddress + 8)
    ]
  };
}

function readScreenRecordPointer(rom, info, objset, area, submap) {
  const record = readAreaRecord(rom, info, objset, area);
  const pointerAddress = record.areaRecordAddress + SCREEN_RECORD_POINTERS_OFFSET + submap * 2;
  return {
    pointerAddress,
    address: readBackgroundTableWord(rom, info, pointerAddress)
  };
}

function decodeTransition(source, side, bytes) {
  const [marker, second, third] = bytes;
  let target;
  let kind;

  if (marker === 0xff) {
    kind = 'objset-area';
    target = { objset: second, area: third };
  } else if (marker === 0xfc) {
    kind = 'objset-area-load';
    target = { objset: second, area: third };
  } else if (marker === 0xfb) {
    kind = 'same-objset-area-submap';
    target = {
      objset: source.objset,
      area: second,
      submap: third & 0x7f,
      submapRaw: third,
      submapFlags: third & 0x80
    };
  } else if (marker === 0xfa) {
    kind = 'same-objset-area-load';
    target = { objset: source.objset, area: third };
  } else {
    kind = 'same-objset-area';
    target = { objset: source.objset, area: third };
  }

  return {
    side,
    kind,
    bytes: bytes.map((value) => hex(value, 2)),
    marker: hex(marker, 2),
    raw: { marker, second, third },
    target
  };
}

function publicAreaRecord(record) {
  return {
    areaTablePointerAddress: hex(record.areaTablePointerAddress, 4),
    areaTableAddress: hex(record.areaTableAddress, 4),
    areaRecordPointerAddress: hex(record.areaRecordPointerAddress, 4),
    areaRecordAddress: hex(record.areaRecordAddress, 4),
    maxSubmap: record.maxSubmap,
    leftBytes: record.leftBytes.map((value) => hex(value, 2)),
    rightBytes: record.rightBytes.map((value) => hex(value, 2))
  };
}

function groupLabel(nodes) {
  if (nodes.length === 1) {
    return nodes[0].name;
  }
  return `${nodes[0].name} -> ${nodes[nodes.length - 1].name}`;
}

function buildNodesAndAreas(rom, info, locations) {
  const nodes = locations.map((loc) => {
    const screenRecord = readScreenRecordPointer(rom, info, loc.objset, loc.area, loc.submap || 0);
    return {
      id: nodeId(loc),
      atlasId: locationId(loc),
      areaId: areaId(loc),
      name: loc.name,
      objset: loc.objset,
      objsetHex: hex(loc.objset, 2),
      area: loc.area,
      areaHex: hex(loc.area, 2),
      submap: loc.submap || 0,
      submapHex: hex(loc.submap || 0, 2),
      category: CATEGORY_BY_OBJSET[loc.objset] || 'other',
      atlasImage: `images/${locationId(loc)}.png`,
      screenRecordPointerAddress: hex(screenRecord.pointerAddress, 4),
      screenRecordAddress: hex(screenRecord.address, 4),
      templateStatus: loc.objset === 1 ? 'template-pending' : 'atlas-rendered'
    };
  });

  const areaMap = new Map();
  for (const node of nodes) {
    if (!areaMap.has(node.areaId)) {
      const record = readAreaRecord(rom, info, node.objset, node.area);
      areaMap.set(node.areaId, {
        id: node.areaId,
        objset: node.objset,
        objsetHex: node.objsetHex,
        area: node.area,
        areaHex: node.areaHex,
        category: node.category,
        record,
        nodes: []
      });
    }
    areaMap.get(node.areaId).nodes.push(node);
  }

  const areas = [...areaMap.values()].map((area) => {
    const sortedNodes = area.nodes.sort((left, right) => left.submap - right.submap);
    return {
      id: area.id,
      label: groupLabel(sortedNodes),
      objset: area.objset,
      objsetHex: area.objsetHex,
      area: area.area,
      areaHex: area.areaHex,
      category: area.category,
      nodeIds: sortedNodes.map((node) => node.id),
      atlasIds: sortedNodes.map((node) => node.atlasId),
      maxSubmap: area.record.maxSubmap,
      areaRecord: publicAreaRecord(area.record),
      transitions: {
        left: decodeTransition(area, 'left', area.record.leftBytes),
        right: decodeTransition(area, 'right', area.record.rightBytes)
      }
    };
  });

  return {
    nodes,
    areas
  };
}

function contextKey(context) {
  return `${context.objset}:${context.area}:${context.submap || 0}`;
}

function resolveTransitionTarget(side, transition, areasById, nodesByContext, nodesById) {
  if (transition.target.submap != null) {
    const node = nodesByContext.get(contextKey(transition.target));
    return {
      node,
      area: node && areasById.get(node.areaId),
      explicitSubmap: true
    };
  }

  const targetAreaId = areaId(transition.target);
  const area = areasById.get(targetAreaId);
  if (!area) {
    return {
      node: undefined,
      area: undefined,
      explicitSubmap: false
    };
  }

  const index = side === 'left' ? area.nodeIds.length - 1 : 0;
  const node = nodesById.get(area.nodeIds[index]);

  return {
    node,
    area,
    explicitSubmap: false
  };
}

function createEdgeId(kind, source, target, suffix) {
  const targetId = target || 'unresolved';
  return `${kind}:${source}->${targetId}:${suffix}`;
}

function evidence(source, value, note) {
  return {
    source,
    value,
    note
  };
}

function classifySubmapSequence(source, target) {
  return {
    transitionClass: 'same-area-submap-sequence',
    placementMode: 'ordinary-adjacency',
    ordinaryAdjacency: true,
    coordinateConfidence: 'submap-order-only',
    evidence: [
      evidence('cv2r-submap-order', `${source.id} -> ${target.id}`, 'Adjacent submaps in one area record.')
    ],
    note: 'Submap order indicates a layout sequence, not a complete world coordinate.'
  };
}

function hasTransportMetadata(source, target) {
  return /tornado/i.test(source.name) || (target && /tornado/i.test(target.name));
}

function classifyBoundaryTransition(source, target, transition, resolved) {
  if (!resolved.node) {
    return {
      transitionClass: 'unresolved-target',
      placementMode: 'unresolved',
      ordinaryAdjacency: false,
      coordinateConfidence: 'target-not-in-atlas',
      evidence: [
        evidence('rom-area-transition-bytes', transition.bytes.join(' '), 'Transition target is not currently represented by the exterior atlas.')
      ],
      note: 'The transition is preserved as metadata until the target is decoded or intentionally excluded.'
    };
  }

  if (hasTransportMetadata(source, target)) {
    return {
      transitionClass: 'special-transport-candidate',
      placementMode: 'connector-only',
      ordinaryAdjacency: false,
      coordinateConfidence: 'endpoint-known-position-unknown',
      evidence: [
        evidence('rom-area-transition-bytes', transition.bytes.join(' '), 'The edge target is decoded from the ROM transition table.'),
        evidence('cv2r-location-metadata', `${source.name} -> ${target.name}`, 'One endpoint is labeled as a tornado submap in the reverse-engineered source.')
      ],
      note: 'This edge should be rendered as a connector until the transport event coordinates are decoded.'
    };
  }

  const byKind = {
    'objset-area': {
      transitionClass: 'object-set-boundary',
      coordinateConfidence: 'horizontal-side-only',
      note: 'Transition crosses to an area that may use another object set.'
    },
    'objset-area-load': {
      transitionClass: 'object-set-load-boundary',
      coordinateConfidence: 'horizontal-side-plus-load-marker',
      note: 'Transition crosses object set/area and carries the load marker.'
    },
    'same-objset-area': {
      transitionClass: 'same-object-set-boundary',
      coordinateConfidence: 'horizontal-side-only',
      note: 'Transition stays in the current object set and changes area.'
    },
    'same-objset-area-load': {
      transitionClass: 'same-object-set-load-boundary',
      coordinateConfidence: 'horizontal-side-plus-load-marker',
      note: 'Transition stays in the current object set and carries the load marker.'
    },
    'same-objset-area-submap': {
      transitionClass: 'explicit-submap-boundary',
      coordinateConfidence: 'horizontal-side-plus-target-submap',
      note: 'Transition names a target submap explicitly.'
    }
  };
  const classified = byKind[transition.kind] || {
    transitionClass: 'unknown-boundary',
    coordinateConfidence: 'unknown',
    note: 'Transition marker is not classified yet.'
  };

  return {
    ...classified,
    placementMode: 'ordinary-adjacency',
    ordinaryAdjacency: true,
    evidence: [
      evidence('rom-area-transition-bytes', transition.bytes.join(' '), classified.note)
    ]
  };
}

function buildEdges(nodes, areas) {
  const areasById = new Map(areas.map((area) => [area.id, area]));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const nodesByContext = new Map(nodes.map((node) => [contextKey(node), node]));
  const edges = [];

  for (const area of areas) {
    for (let index = 0; index < area.nodeIds.length - 1; index += 1) {
      const source = nodesById.get(area.nodeIds[index]);
      const target = nodesById.get(area.nodeIds[index + 1]);
      edges.push({
        id: createEdgeId('submap-sequence', source.id, target.id, index),
        type: 'submap-sequence',
        confidence: 'cv2r-submap-order',
        direction: 'right',
        source: source.id,
        sourceArea: source.areaId,
        target: target.id,
        targetArea: target.areaId,
        transitionSemantics: classifySubmapSequence(source, target),
        note: 'Adjacent submaps in the same area record.'
      });
    }
  }

  for (const area of areas) {
    const leftSource = nodesById.get(area.nodeIds[0]);
    const rightSource = nodesById.get(area.nodeIds[area.nodeIds.length - 1]);
    for (const [side, source] of [['left', leftSource], ['right', rightSource]]) {
      const transition = area.transitions[side];
      const resolved = resolveTransitionTarget(side, transition, areasById, nodesByContext, nodesById);
      const targetAreaId = resolved.area?.id || areaId(transition.target);
      const semantics = classifyBoundaryTransition(source, resolved.node, transition, resolved);

      edges.push({
        id: createEdgeId('boundary-transition', source.id, resolved.node?.id, side),
        type: 'boundary-transition',
        confidence: resolved.node ? 'rom-area-transition' : 'unresolved-target',
        direction: side,
        source: source.id,
        sourceArea: source.areaId,
        target: resolved.node?.id,
        targetArea: targetAreaId,
        transition: {
          kind: transition.kind,
          marker: transition.marker,
          bytes: transition.bytes,
          target: {
            objset: transition.target.objset,
            objsetHex: hex(transition.target.objset, 2),
            area: transition.target.area,
            areaHex: hex(transition.target.area, 2),
            submap: transition.target.submap,
            submapHex: hex(transition.target.submap, 2),
            submapRaw: hex(transition.target.submapRaw, 2),
            submapFlags: hex(transition.target.submapFlags, 2)
          }
        },
        transitionSemantics: semantics,
        sourceRecord: area.areaRecord,
        note: resolved.node
          ? `${source.name} exits ${side} to ${resolved.node.name}.`
          : `${source.name} exits ${side} to non-atlas target ${targetAreaId}.`
      });
    }
  }

  return edges;
}

function undirectedAreaAdjacency(areas, edges) {
  const areaIds = new Set(areas.map((area) => area.id));
  const adjacency = new Map([...areaIds].map((id) => [id, []]));

  for (const edge of edges) {
    if (edge.type !== 'boundary-transition' || !edge.targetArea || !areaIds.has(edge.targetArea)) {
      continue;
    }
    if (edge.sourceArea === edge.targetArea) {
      continue;
    }
    adjacency.get(edge.sourceArea).push({ areaId: edge.targetArea, edgeId: edge.id });
    adjacency.get(edge.targetArea).push({ areaId: edge.sourceArea, edgeId: edge.id });
  }

  return adjacency;
}

function shortestAreaPath(areas, edges, startAreaId, targetAreaId) {
  const adjacency = undirectedAreaAdjacency(areas, edges);
  const queue = [{ areaId: startAreaId, path: [startAreaId], edgeIds: [] }];
  const seen = new Set([startAreaId]);

  while (queue.length) {
    const current = queue.shift();
    if (current.areaId === targetAreaId) {
      return current;
    }

    for (const next of adjacency.get(current.areaId) || []) {
      if (seen.has(next.areaId)) {
        continue;
      }
      seen.add(next.areaId);
      queue.push({
        areaId: next.areaId,
        path: [...current.path, next.areaId],
        edgeIds: [...current.edgeIds, next.edgeId]
      });
    }
  }

  return undefined;
}

function summarize(nodes, areas, edges, routes) {
  const boundaryEdges = edges.filter((edge) => edge.type === 'boundary-transition');
  const transitionClasses = {};
  const placementModes = {};
  for (const edge of edges) {
    const transitionClass = edge.transitionSemantics?.transitionClass || 'unclassified';
    const placementMode = edge.transitionSemantics?.placementMode || 'unclassified';
    transitionClasses[transitionClass] = (transitionClasses[transitionClass] || 0) + 1;
    placementModes[placementMode] = (placementModes[placementMode] || 0) + 1;
  }
  return {
    nodes: nodes.length,
    areas: areas.length,
    edges: edges.length,
    submapSequenceEdges: edges.filter((edge) => edge.type === 'submap-sequence').length,
    boundaryTransitionEdges: boundaryEdges.length,
    unresolvedBoundaryEdges: boundaryEdges.filter((edge) => !edge.target).length,
    connectorOnlyEdges: edges.filter((edge) => edge.transitionSemantics?.placementMode === 'connector-only').length,
    transitionClasses,
    placementModes,
    templatePendingNodes: nodes.filter((node) => node.templateStatus === 'template-pending').length,
    routeCount: routes.length
  };
}

function buildExteriorTopology(rom, info) {
  const atlas = buildExteriorAtlas(rom, info);
  const { nodes, areas } = buildNodesAndAreas(rom, info, atlas.candidates);
  const edges = buildEdges(nodes, areas);
  const mainPath = shortestAreaPath(areas, edges, 'obj00-area00', 'obj05-area00');
  const routes = mainPath
    ? [{
      id: 'jova-to-castlevania-area-path',
      label: 'Jova to Castlevania topology path',
      source: mainPath.path[0],
      target: mainPath.path[mainPath.path.length - 1],
      areaIds: mainPath.path,
      edgeIds: mainPath.edgeIds,
      status: 'rom-transition-derived',
      note: 'Shortest undirected area-level path through resolved ROM transition edges. This is topology, not final world coordinates.'
    }]
    : [];

  return {
    schemaVersion: 1,
    source: {
      rom: 'local iNES ROM',
      renderer: 'rom-area-transition-topology',
      notes: [
        'Topology edges come from area-record transition triples at offsets 3..8.',
        'Submap sequence edges come from cv2r submap order within one area record.',
        'Transition semantics separate ordinary adjacency from connector-only candidates such as tornado transport.',
        'This is an adjacency graph, not final world-coordinate placement.'
      ]
    },
    constants: {
      areaTablePointers: hex(AREA_TABLE_POINTERS, 4),
      screenRecordPointersOffset: hex(SCREEN_RECORD_POINTERS_OFFSET, 2)
    },
    summary: summarize(nodes, areas, edges, routes),
    nodes,
    areas,
    edges,
    routes
  };
}

function renderExteriorTopology(rom, info, opts = {}) {
  const outDir = path.resolve(opts.outDir || path.join('out', 'exterior-topology'));
  fs.mkdirSync(outDir, { recursive: true });

  const topology = buildExteriorTopology(rom, info);
  const manifestPath = path.join(outDir, 'topology.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(topology, null, 2)}\n`);
  fs.writeFileSync(
    path.join(outDir, 'topology-data.js'),
    `window.EXTERIOR_TOPOLOGY = ${JSON.stringify(topology, null, 2)};\n`
  );

  return {
    output: outDir,
    manifest: manifestPath,
    summary: topology.summary,
    routes: topology.routes.map((route) => ({
      id: route.id,
      label: route.label,
      areaCount: route.areaIds.length,
      status: route.status
    }))
  };
}

module.exports = {
  buildExteriorTopology,
  renderExteriorTopology
};
