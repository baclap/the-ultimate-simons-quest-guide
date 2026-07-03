import initWasm, {
  decode_chr_atlas,
  expand_segment_tilemap
} from '../../guide/src/vendor/guide-map-wasm/guide_map_wasm.js';
import { NES_PALETTE } from '../../guide/src/dialog.js?v=mobile-control-demo';

const BUILD_LABEL = 'v22-corner-guard';
const CACHE_KEY = 'mobile-control-demo-rom-physics-v22-corner-guard';
const SCENE_URL = `../../guide/public/assets/scenes/berkeley-mansion/slice.json?v=${CACHE_KEY}`;
const SETTINGS_STORAGE_KEY = 'mobile-control-demo-control-settings-v2';
const VARIANT = 'fixed';
const URL_PARAMS = new URLSearchParams(window.location.search);
const DEBUG_START_ON_STAIR = URL_PARAMS.has('debug-stair');
const NES_SCREEN_WIDTH = 256;
const NES_SCREEN_HEIGHT = 224;
const PLAYER_START = {
  x: 1848,
  y: 401
};
const CONTROL_DEFAULTS = Object.freeze({
  tiltThreshold: 0.5,
  pitchRateThreshold: 80,
  accelerationThreshold: 5
});
const CONTROL_SETTING_LIMITS = Object.freeze({
  tiltThreshold: { min: 0.08, max: 0.5, digits: 2 },
  pitchRateThreshold: { min: 40, max: 130, digits: 0 },
  accelerationThreshold: { min: 2, max: 6, digits: 1 }
});
const PHYSICS_PROVENANCE = {
  status: 'rom-traced',
  source: 'tools/mesen/trace-player-physics.lua + tools/mesen/trace-player-stairs.lua',
  blocker: 'Walk, jump, fall, stair stepping, terrain classes, side probes, and upward torso probes are ported from ROM/runtime evidence. Ground support still uses the ROM-expanded Berkeley terrain layer as control-lab geometry; rendered jump contact includes decoded-head and side-edge guards.'
};
const ROM_SIMON_PHYSICS = {
  frameSeconds: 1 / 60,
  tiltThreshold: CONTROL_DEFAULTS.tiltThreshold,
  walkPixelsPerFrame: 1,
  stairStepPixelsPerFrame: 0.5,
  stairStepFrames: 16,
  initialSubY: 0x90,
  jumpVelocity: -0x0400,
  fallVelocity: 0x0038,
  gravity: 0x0038,
  maxFallVelocity: 0x0300,
  walkFrameDuration: 11,
  walkSelectors: ['0x01', '0x02', '0x03', '0x04'],
  stairUpSelectors: ['0x08', '0x09', '0x08'],
  stairDownSelectors: ['0x06', '0x07', '0x06'],
  idleSelector: '0x04',
  jumpSelector: '0x05'
};
const PLAYER_HORIZONTAL_MARGIN = 16;
const SIMON_ANCHOR_FROM_SUPPORT_TOP = -15;
const TERRAIN_COLLISION_THRESHOLDS = [0xe1, 0xe9, 0xfb];
const SOLID_TERRAIN_VALUES = new Set([1, 2]);
const PASSABLE_TERRAIN_VALUES = new Set([0, 3]);
const STAIR_METATILES_UP_RIGHT = new Set([0x03, 0x05]);
const STAIR_METATILES_UP_LEFT = new Set([0x02, 0x04]);
const STAIR_ANCHOR_X_OFFSET_UP_RIGHT = -8;
const STAIR_ANCHOR_X_OFFSET_UP_LEFT = 8;
const ROM_TERRAIN_LOOKUP_Y_BIAS = 0x0d;
const ROM_SIDE_PROBE_X_OFFSET = 0x08;
const ROM_WALL_PROBE_Y_OFFSETS_GROUND = [0x08, 0xf0, 0x00];
const ROM_WALL_PROBE_Y_OFFSETS_AIR = [0xf0, 0x00];
const ROM_UPWARD_PROBE_Y_OFFSETS = [0x12, 0x0a];
const ROM_SIDE_PROBE_UPPER_OFFSET = 0xf0;
const SIMON_JUMP_HEAD_Y_OFFSET = -12;
const SIMON_JUMP_BODY_BOTTOM_Y_OFFSET = 19;
const SIMON_JUMP_SIDE_X_OFFSET = 8;
const SIMON_HEAD_X_OFFSETS = [-7, 7];
const CAMERA_VERTICAL_DEAD_ZONE = 20;
const CAMERA_VERTICAL_MAX_STEP = 2;

const WHIP_ATTACK_DURATION_MS = 220;
const MOTION_JUMP = {
  cooldownMs: 520,
  pulseMs: 260,
  pitchRateThreshold: CONTROL_DEFAULTS.pitchRateThreshold,
  accelerationThreshold: CONTROL_DEFAULTS.accelerationThreshold,
  gravitySmoothing: 0.86
};

// ROM-derived from `out/actor-traces/berkeley-mansion-whip-b`, a B-button
// trace in Berkeley Mansion. This is visual attack evidence, not a complete
// decoded Simon combat state machine.
const ROM_TRACED_ATTACK_FRAMES = {
  '0x0B': {
    selector: '0x0B',
    pointer: '0xB1EB',
    status: '0x83',
    sprites: [
      { tile: '0x2D', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -15 },
      { tile: '0x07', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 1 },
      { tile: '0x09', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 1 }
    ]
  },
  '0x0C': {
    selector: '0x0C',
    pointer: '0xB1F1',
    status: '0x05',
    sprites: [
      { tile: '0x35', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -15 },
      { tile: '0x07', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 1 },
      { tile: '0x09', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 1 },
      { tile: '0x33', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -15 },
      { tile: '0x37', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -16, yOffset: -15 }
    ]
  },
  '0x6E': {
    selector: '0x6E',
    pointer: '0xB2C3',
    status: '0x82',
    sprites: [
      { tile: '0x2F', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -16 },
      { tile: '0x4F', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -8 }
    ]
  },
  '0x72': {
    selector: '0x72',
    pointer: '0xB2DE',
    status: '0x82',
    sprites: [
      { tile: '0x5F', attr: '0x01', palette: 1, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -16 },
      { tile: '0x5F', attr: '0x01', palette: 1, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -16 }
    ]
  },
  '0x71': {
    selector: '0x71',
    pointer: '0xB2D3',
    status: '0x03',
    sprites: [
      { tile: '0x5F', attr: '0x01', palette: 1, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -16 },
      { tile: '0x5F', attr: '0x01', palette: 1, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -16 },
      { tile: '0x5D', attr: '0x01', palette: 1, flipHorizontal: false, flipVertical: false, xOffset: -16, yOffset: -16 }
    ]
  }
};

const ROM_TRACED_ATTACK_SEQUENCE = [
  {
    maxElapsedMs: 44,
    bodySelector: '0x0B',
    weaponActors: [
      { selector: '0x6E', xOffset: -16, yOffset: 0 }
    ]
  },
  {
    maxElapsedMs: WHIP_ATTACK_DURATION_MS,
    bodySelector: '0x0C',
    weaponActors: [
      { selector: '0x72', xOffset: 22, yOffset: 0 },
      { selector: '0x71', xOffset: 38, yOffset: 0 }
    ]
  }
];

// Decoded with `decodeMetaspriteSelector(rom, info, selector)`. The Berkeley
// guide actor class currently carries only Simon's standing/walking selectors,
// so the control lab embeds these extra ROM metasprites for airborne and stair
// states.
const ROM_DECODED_SIMON_EXTRA_FRAMES = {
  '0x05': {
    selector: '0x05',
    pointer: '0xB198',
    status: '0x84',
    sprites: [
      { tile: '0x03', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -12 },
      { tile: '0x05', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -12 },
      { tile: '0x1B', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 4 },
      { tile: '0x1D', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 4 }
    ]
  },
  '0x06': {
    selector: '0x06',
    pointer: '0xB19F',
    status: '0x04',
    sprites: [
      { tile: '0x13', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -16 },
      { tile: '0x15', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -16 },
      { tile: '0x1F', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 0 },
      { tile: '0x1D', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 0 }
    ]
  },
  '0x07': {
    selector: '0x07',
    pointer: '0xB179',
    status: '0x84',
    sprites: [
      { tile: '0x0B', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -15 },
      { tile: '0x0D', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -15 },
      { tile: '0x0F', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 1 },
      { tile: '0x11', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 1 }
    ]
  },
  '0x08': {
    selector: '0x08',
    pointer: '0xB1AD',
    status: '0x84',
    sprites: [
      { tile: '0x13', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -16 },
      { tile: '0x15', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -16 },
      { tile: '0x21', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 0 },
      { tile: '0x23', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 0 }
    ]
  },
  '0x09': {
    selector: '0x09',
    pointer: '0xB179',
    status: '0x84',
    sprites: [
      { tile: '0x0B', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: -15 },
      { tile: '0x0D', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: -15 },
      { tile: '0x0F', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: -8, yOffset: 1 },
      { tile: '0x11', attr: '0x00', palette: 0, flipHorizontal: false, flipVertical: false, xOffset: 0, yOffset: 1 }
    ]
  }
};

const dom = {
  canvas: document.querySelector('#scene-canvas'),
  inputReadout: document.querySelector('#input-readout'),
  physicsReadout: document.querySelector('#physics-readout'),
  versionReadout: document.querySelector('#version-readout'),
  motionButton: document.querySelector('#motion-button'),
  tiltMeter: document.querySelector('#tilt-meter'),
  actionMeter: document.querySelector('#action-meter'),
  settingsButton: document.querySelector('#settings-button'),
  settingsModal: document.querySelector('#settings-modal'),
  settingsClose: document.querySelector('#settings-close'),
  settingsReset: document.querySelector('#settings-reset'),
  tiltThresholdInput: document.querySelector('#tilt-threshold'),
  tiltThresholdValue: document.querySelector('#tilt-threshold-value'),
  flickPitchThresholdInput: document.querySelector('#flick-pitch-threshold'),
  flickPitchThresholdValue: document.querySelector('#flick-pitch-threshold-value'),
  flickAccelerationThresholdInput: document.querySelector('#flick-acceleration-threshold'),
  flickAccelerationThresholdValue: document.querySelector('#flick-acceleration-threshold-value')
};

for (const [name, element] of Object.entries(dom)) {
  if (!element) {
    throw new Error(`Missing control demo element: ${name}`);
  }
}

dom.versionReadout.textContent = BUILD_LABEL;

function assertGl(value, label) {
  if (!value) {
    throw new Error(`Unable to create ${label}.`);
  }
  return value;
}

function numericByte(value) {
  if (Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.toLowerCase().startsWith('0x')) {
    return Number.parseInt(value.slice(2), 16);
  }
  return Number.parseInt(value, 10);
}

function rangeView(data, range) {
  return new Uint8Array(data, range.offset, range.length);
}

function terrainValueForTile(tileIndex) {
  if (tileIndex < TERRAIN_COLLISION_THRESHOLDS[0]) {
    return 0;
  }
  if (tileIndex < TERRAIN_COLLISION_THRESHOLDS[1]) {
    return 3;
  }
  if (tileIndex < TERRAIN_COLLISION_THRESHOLDS[2]) {
    return 2;
  }
  return 1;
}

function expandedTileIndex(tilemap, tileWidth, tileX, tileY) {
  const offset = (tileY * tileWidth + tileX) * 4;
  return tilemap[offset] + tilemap[offset + 2] * 256;
}

function isSolidTerrainTile(tilemap, tileWidth, tileHeight, tileX, tileY) {
  if (tileX < 0 || tileY < 0 || tileX >= tileWidth || tileY >= tileHeight) {
    return false;
  }
  const terrain = terrainValueForTile(expandedTileIndex(tilemap, tileWidth, tileX, tileY));
  return SOLID_TERRAIN_VALUES.has(terrain);
}

function signedByte(value) {
  const wrapped = value & 0xff;
  return wrapped >= 0x80 ? wrapped - 0x100 : wrapped;
}

function buildCollisionLayer(segment, tilemap) {
  return {
    x: segment.position.x,
    y: segment.position.y,
    width: segment.position.width,
    height: segment.position.height,
    tileWidth: segment.tileWidth,
    tileHeight: segment.tileHeight,
    tilemap,
    source: 'rom-expanded-terrain-thresholds'
  };
}

function buildSupportSurfaces(segment, tilemap) {
  const tileWidth = segment.tileWidth;
  const tileHeight = segment.tileHeight;
  const supports = [];

  for (let tileY = 0; tileY < tileHeight; tileY += 1) {
    let startTileX = null;
    for (let tileX = 0; tileX <= tileWidth; tileX += 1) {
      const startsSurface = tileX < tileWidth &&
        isSolidTerrainTile(tilemap, tileWidth, tileHeight, tileX, tileY) &&
        !isSolidTerrainTile(tilemap, tileWidth, tileHeight, tileX, tileY - 1);
      if (startsSurface && startTileX == null) {
        startTileX = tileX;
      }
      if ((!startsSurface || tileX === tileWidth) && startTileX != null) {
        supports.push({
          x: segment.position.x + startTileX * 8,
          y: segment.position.y + tileY * 8 + SIMON_ANCHOR_FROM_SUPPORT_TOP,
          width: (tileX - startTileX) * 8,
          source: 'rom-terrain-thresholds'
        });
        startTileX = null;
      }
    }
  }

  return supports;
}

function buildStairs(segment, layoutBlocks) {
  const stairs = [];
  for (let blockY = 0; blockY < segment.blockHeight; blockY += 1) {
    for (let blockX = 0; blockX < segment.blockWidth; blockX += 1) {
      const metatile = layoutBlocks[blockY * segment.blockWidth + blockX] || 0;
      const x = segment.position.x + blockX * 32;
      const y = segment.position.y + blockY * 32;
      if (STAIR_METATILES_UP_RIGHT.has(metatile)) {
        stairs.push({
          id: `${segment.id}:${blockX},${blockY}`,
          lowerX: x + STAIR_ANCHOR_X_OFFSET_UP_RIGHT,
          lowerY: y + 32 + SIMON_ANCHOR_FROM_SUPPORT_TOP,
          upperX: x + 32 + STAIR_ANCHOR_X_OFFSET_UP_RIGHT,
          upperY: y + SIMON_ANCHOR_FROM_SUPPORT_TOP,
          ascentX: 1,
          source: `metatile-${metatile.toString(16).padStart(2, '0')}`
        });
      } else if (STAIR_METATILES_UP_LEFT.has(metatile)) {
        stairs.push({
          id: `${segment.id}:${blockX},${blockY}`,
          lowerX: x + 32 + STAIR_ANCHOR_X_OFFSET_UP_LEFT,
          lowerY: y + 32 + SIMON_ANCHOR_FROM_SUPPORT_TOP,
          upperX: x + STAIR_ANCHOR_X_OFFSET_UP_LEFT,
          upperY: y + SIMON_ANCHOR_FROM_SUPPORT_TOP,
          ascentX: -1,
          source: `metatile-${metatile.toString(16).padStart(2, '0')}`
        });
      }
    }
  }
  return stairs;
}

function stairPointKey(x, y) {
  return `${x},${y}`;
}

function addStairEndpoint(map, key, segment) {
  if (!map.has(key)) {
    map.set(key, []);
  }
  map.get(key).push(segment);
}

function nextConnectedStair(map, key, ascentX, visited) {
  return (map.get(key) || []).find((segment) => (
    segment.ascentX === ascentX &&
    !visited.has(segment.id)
  )) || null;
}

function buildStairPaths(segments) {
  const byLowerPoint = new Map();
  const byUpperPoint = new Map();
  for (const segment of segments) {
    addStairEndpoint(byLowerPoint, stairPointKey(segment.lowerX, segment.lowerY), segment);
    addStairEndpoint(byUpperPoint, stairPointKey(segment.upperX, segment.upperY), segment);
  }

  const visited = new Set();
  const paths = [];
  for (const segment of segments) {
    if (visited.has(segment.id)) {
      continue;
    }

    let start = segment;
    while (true) {
      const previous = nextConnectedStair(
        byUpperPoint,
        stairPointKey(start.lowerX, start.lowerY),
        start.ascentX,
        new Set()
      );
      if (!previous || previous.id === start.id) {
        break;
      }
      start = previous;
    }

    const chain = [];
    let current = start;
    while (current && !visited.has(current.id)) {
      chain.push(current);
      visited.add(current.id);
      current = nextConnectedStair(
        byLowerPoint,
        stairPointKey(current.upperX, current.upperY),
        current.ascentX,
        visited
      );
    }

    const lower = chain[0];
    const upper = chain[chain.length - 1];
    const length = Math.max(
      Math.abs(upper.upperX - lower.lowerX),
      Math.abs(upper.upperY - lower.lowerY)
    );
    paths.push({
      id: `stair-path-${paths.length}`,
      lowerX: lower.lowerX,
      lowerY: lower.lowerY,
      upperX: upper.upperX,
      upperY: upper.upperY,
      ascentX: lower.ascentX,
      length,
      segments: chain,
      source: chain.map((record) => record.source).join('+')
    });
  }
  return paths;
}

function unionBounds(records) {
  const minX = Math.min(...records.map((record) => record.position.x));
  const minY = Math.min(...records.map((record) => record.position.y));
  const maxX = Math.max(...records.map((record) => record.position.x + record.position.width));
  const maxY = Math.max(...records.map((record) => record.position.y + record.position.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function loadDataUrl(manifestUrl, dataFile) {
  const manifest = new URL(manifestUrl, window.location.href);
  const dataUrl = new URL(dataFile, manifest);
  dataUrl.search = manifest.search;
  return dataUrl.toString();
}

function compileShader(gl, type, source) {
  const shader = assertGl(gl.createShader(type), 'shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'unknown shader error';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function linkProgram(gl, vertexSource, fragmentSource, label) {
  const program = assertGl(gl.createProgram(), label);
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || `unknown ${label} link error`;
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createTileProgram(gl) {
  return linkProgram(gl, `#version 300 es
in vec2 a_position;
in vec2 a_uv;
uniform vec2 u_resolution;
uniform vec3 u_camera;
uniform vec2 u_segment_offset;
out vec2 v_uv;

void main() {
  vec2 world_position = a_position + u_segment_offset;
  vec2 screen = (world_position - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
}
`, `#version 300 es
precision highp float;

uniform sampler2D u_tilemap;
uniform sampler2D u_chr;
uniform sampler2D u_palette;
uniform vec2 u_segment_size;
in vec2 v_uv;
out vec4 out_color;

void main() {
  ivec2 pixel = ivec2(floor(v_uv * u_segment_size));
  ivec2 tile_coord = pixel / 8;
  ivec2 in_tile = pixel - (tile_coord * 8);
  vec4 tile_sample = texelFetch(u_tilemap, tile_coord, 0);
  int tile_index = int(round(tile_sample.r * 255.0)) + int(round(tile_sample.b * 255.0)) * 256;
  int palette_id = int(round(tile_sample.g * 255.0));
  int atlas_x = (tile_index % 16) * 8 + in_tile.x;
  int atlas_y = (tile_index / 16) * 8 + in_tile.y;
  int color_id = int(round(texelFetch(u_chr, ivec2(atlas_x, atlas_y), 0).r * 255.0));
  int palette_index = color_id == 0 ? 0 : palette_id * 4 + color_id;
  out_color = texelFetch(u_palette, ivec2(palette_index, 0), 0);
}
`, 'tile program');
}

function createSpriteProgram(gl) {
  return linkProgram(gl, `#version 300 es
in vec2 a_position;
in vec2 a_uv;
in float a_palette;
uniform vec2 u_resolution;
uniform vec3 u_camera;
out vec2 v_uv;
out float v_palette;

void main() {
  vec2 screen = (a_position - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
  v_palette = a_palette;
}
`, `#version 300 es
precision highp float;

uniform sampler2D u_chr;
uniform sampler2D u_palette;
in vec2 v_uv;
in float v_palette;
out vec4 out_color;

void main() {
  int color_id = int(round(texture(u_chr, v_uv).r * 255.0));
  if (color_id == 0) {
    discard;
  }
  int palette_index = int(round(v_palette)) * 4 + color_id;
  out_color = texelFetch(u_palette, ivec2(palette_index, 0), 0);
}
`, 'sprite program');
}

function createTexture(gl, width, height, internalFormat, format, data) {
  const texture = assertGl(gl.createTexture(), 'texture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.UNSIGNED_BYTE, data);
  return texture;
}

function paletteTexture(gl, paletteBytes) {
  const rgba = new Uint8Array(16 * 4);
  for (let index = 0; index < 16; index += 1) {
    const [red, green, blue] = NES_PALETTE[paletteBytes[index] & 0x3f] || [0, 0, 0];
    rgba[index * 4] = red;
    rgba[index * 4 + 1] = green;
    rgba[index * 4 + 2] = blue;
    rgba[index * 4 + 3] = 255;
  }
  return createTexture(gl, 16, 1, gl.RGBA8, gl.RGBA, rgba);
}

function createSegmentBuffer(gl, segment) {
  const { x, y, width, height } = segment.position;
  const vertices = new Float32Array([
    x, y, 0, 0,
    x + width, y, 1, 0,
    x, y + height, 0, 1,
    x, y + height, 0, 1,
    x + width, y, 1, 0,
    x + width, y + height, 1, 1
  ]);
  const buffer = assertGl(gl.createBuffer(), 'segment buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}

function pushSpriteQuad(vertices, x, y, tileIndex, paletteIndex, flipHorizontal, flipVertical, chrSet) {
  const atlas = chrSet.decodedAtlas;
  const tileSize = 8;
  const tileX = (tileIndex % atlas.tilesPerRow) * tileSize;
  const tileY = Math.floor(tileIndex / atlas.tilesPerRow) * tileSize;
  const left = tileX / atlas.width;
  const right = (tileX + tileSize) / atlas.width;
  const top = tileY / atlas.height;
  const bottom = (tileY + tileSize) / atlas.height;
  const u0 = flipHorizontal ? right : left;
  const u1 = flipHorizontal ? left : right;
  const v0 = flipVertical ? bottom : top;
  const v1 = flipVertical ? top : bottom;

  vertices.push(
    x, y, u0, v0, paletteIndex,
    x + tileSize, y, u1, v0, paletteIndex,
    x, y + tileSize, u0, v1, paletteIndex,
    x, y + tileSize, u0, v1, paletteIndex,
    x + tileSize, y, u1, v0, paletteIndex,
    x + tileSize, y + tileSize, u1, v1, paletteIndex
  );
}

function pushSprite(vertices, actor, actorClass, frame, chrSet) {
  const spriteHeight = actorClass.largeSprites ? 16 : 8;
  for (const sprite of frame.sprites || []) {
    const tile = numericByte(sprite.tile);
    const palette = Number.isFinite(sprite.palette) ? sprite.palette : numericByte(sprite.attr) & 0x03;
    const flipHorizontal = actor.flipHorizontal ? !sprite.flipHorizontal : sprite.flipHorizontal;
    const xOffset = actor.flipHorizontal ? -sprite.xOffset - 8 : sprite.xOffset;
    const x = actor.worldX + xOffset;
    const y = actor.worldY + sprite.yOffset;

    if (!actorClass.largeSprites) {
      pushSpriteQuad(vertices, x, y, tile, palette, flipHorizontal, sprite.flipVertical, chrSet);
      continue;
    }

    const tableOffset = (tile & 0x01) ? 256 : 0;
    const baseTile = tableOffset + (tile & 0xfe);
    const topTile = sprite.flipVertical ? baseTile + 1 : baseTile;
    const bottomTile = sprite.flipVertical ? baseTile : baseTile + 1;
    pushSpriteQuad(vertices, x, y, topTile, palette, flipHorizontal, sprite.flipVertical, chrSet);
    pushSpriteQuad(vertices, x, y + spriteHeight / 2, bottomTile, palette, flipHorizontal, sprite.flipVertical, chrSet);
  }
}

class ControlDemoRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = assertGl(canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false
    }), 'WebGL2 context');
    this.tileProgram = createTileProgram(this.gl);
    this.spriteProgram = createSpriteProgram(this.gl);
    this.tileLocations = {
      position: this.gl.getAttribLocation(this.tileProgram, 'a_position'),
      uv: this.gl.getAttribLocation(this.tileProgram, 'a_uv'),
      resolution: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_resolution'), 'tile resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_camera'), 'tile camera'),
      segmentOffset: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_segment_offset'), 'segment offset'),
      segmentSize: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_segment_size'), 'segment size'),
      tilemap: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_tilemap'), 'tilemap'),
      chr: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_chr'), 'tile chr'),
      palette: assertGl(this.gl.getUniformLocation(this.tileProgram, 'u_palette'), 'tile palette')
    };
    this.spriteLocations = {
      position: this.gl.getAttribLocation(this.spriteProgram, 'a_position'),
      uv: this.gl.getAttribLocation(this.spriteProgram, 'a_uv'),
      palette: this.gl.getAttribLocation(this.spriteProgram, 'a_palette'),
      resolution: assertGl(this.gl.getUniformLocation(this.spriteProgram, 'u_resolution'), 'sprite resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.spriteProgram, 'u_camera'), 'sprite camera'),
      chr: assertGl(this.gl.getUniformLocation(this.spriteProgram, 'u_chr'), 'sprite chr'),
      paletteTexture: assertGl(this.gl.getUniformLocation(this.spriteProgram, 'u_palette'), 'sprite palette')
    };
    this.spriteBuffer = assertGl(this.gl.createBuffer(), 'sprite buffer');
    this.segments = [];
    this.chrTextures = new Map();
    this.chrSetById = new Map();
    this.spritePaletteTextures = new Map();
    this.actorClassById = new Map();
    this.worldGeometry = {
      bounds: { x: 0, y: 0, width: NES_SCREEN_WIDTH, height: NES_SCREEN_HEIGHT },
      platforms: [],
      stairs: [],
      collisionLayers: []
    };
  }

  async load(manifestUrl) {
    const manifestResponse = await fetch(manifestUrl, { cache: 'no-store' });
    if (!manifestResponse.ok) {
      throw new Error(`Unable to load ${manifestUrl}`);
    }
    const manifest = await manifestResponse.json();
    const dataResponse = await fetch(loadDataUrl(manifestUrl, manifest.dataFile), { cache: 'no-store' });
    if (!dataResponse.ok) {
      throw new Error(`Unable to load ${manifest.dataFile}`);
    }
    const data = await dataResponse.arrayBuffer();
    this.prepare(manifest, data);
    return manifest;
  }

  prepare(manifest, data) {
    const gl = this.gl;
    this.manifest = manifest;
    this.chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
    this.actorClassById = new Map((manifest.actorClasses || []).map((actorClass) => [actorClass.id, actorClass]));
    const tileSetById = new Map((manifest.tileSets || []).map((tileSet) => [tileSet.id, tileSet]));
    const paletteById = new Map((manifest.palettes || []).map((palette) => [palette.id, palette]));

    for (const chrSet of manifest.chrSets || []) {
      const decoded = decode_chr_atlas(rangeView(data, chrSet.data));
      this.chrTextures.set(chrSet.id, createTexture(
        gl,
        chrSet.decodedAtlas.width,
        chrSet.decodedAtlas.height,
        gl.R8,
        gl.RED,
        decoded
      ));
    }

    for (const palette of manifest.spritePalettes || []) {
      this.spritePaletteTextures.set(palette.id, paletteTexture(gl, rangeView(data, palette.data)));
    }

    this.worldGeometry = {
      bounds: unionBounds(manifest.segments || []),
      platforms: [],
      stairs: [],
      collisionLayers: []
    };

    this.segments = (manifest.segments || []).map((record) => {
      const tileSet = tileSetById.get(record.tileSet);
      const chrTexture = this.chrTextures.get(record.chrSet);
      if (!tileSet || !chrTexture) {
        throw new Error(`Segment ${record.id} has incomplete ROM-derived texture references.`);
      }
      const layoutBlocks = rangeView(data, record.layoutBlocks);
      const tilemap = expand_segment_tilemap(
        layoutBlocks,
        rangeView(data, tileSet.metatileTiles),
        rangeView(data, tileSet.metatileAttributes),
        record.blockWidth,
        record.blockHeight
      );
      this.worldGeometry.collisionLayers.push(buildCollisionLayer(record, tilemap));
      this.worldGeometry.platforms.push(...buildSupportSurfaces(record, tilemap));
      this.worldGeometry.stairs.push(...buildStairs(record, layoutBlocks));
      const paletteTextures = {};
      for (const [variant, paletteId] of Object.entries(record.palettes || {})) {
        const palette = paletteById.get(paletteId);
        if (!palette) {
          throw new Error(`Segment ${record.id} is missing palette ${paletteId}.`);
        }
        paletteTextures[variant] = paletteTexture(gl, rangeView(data, palette.data));
      }
      return {
        record,
        vertexBuffer: createSegmentBuffer(gl, record),
        tilemapTexture: createTexture(gl, record.tileWidth, record.tileHeight, gl.RGBA8, gl.RGBA, tilemap),
        chrTexture,
        paletteTextures
      };
    });

    this.worldGeometry.stairs = buildStairPaths(this.worldGeometry.stairs);
  }

  resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
  }

  render(camera, player, pose) {
    this.resize();
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.clearColor(0.02, 0.02, 0.016, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.renderTiles(camera);
    this.renderSimon(camera, player, pose);
  }

  renderTiles(camera) {
    const gl = this.gl;
    gl.useProgram(this.tileProgram);
    gl.uniform2f(this.tileLocations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(this.tileLocations.camera, camera.x, camera.y, camera.scale);
    gl.uniform1i(this.tileLocations.tilemap, 0);
    gl.uniform1i(this.tileLocations.chr, 1);
    gl.uniform1i(this.tileLocations.palette, 2);
    gl.enableVertexAttribArray(this.tileLocations.position);
    gl.enableVertexAttribArray(this.tileLocations.uv);

    for (const segment of this.segments) {
      const paletteTextureForVariant = segment.paletteTextures[VARIANT] || segment.paletteTextures.day;
      if (!paletteTextureForVariant) {
        continue;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, segment.vertexBuffer);
      gl.vertexAttribPointer(this.tileLocations.position, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(this.tileLocations.uv, 2, gl.FLOAT, false, 16, 8);
      gl.uniform2f(this.tileLocations.segmentOffset, 0, 0);
      gl.uniform2f(this.tileLocations.segmentSize, segment.record.position.width, segment.record.position.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, segment.tilemapTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, segment.chrTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, paletteTextureForVariant);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  renderSimon(camera, player, pose) {
    const actorClass = this.actorClassById.get('simon-belmont');
    const chrSet = actorClass && this.chrSetById.get(actorClass.chrSet);
    const chrTexture = actorClass && this.chrTextures.get(actorClass.chrSet);
    const paletteTextureForVariant = this.spritePaletteTextures.get('mansion-fixed-sprites');
    const bodyFrame = pose?.bodyFrame || pose;
    if (!actorClass || !chrSet || !chrTexture || !paletteTextureForVariant || !bodyFrame) {
      return;
    }

    const vertices = [];
    const actorX = snapScreenPixel(player.x);
    const actorY = snapScreenPixel(player.y);
    pushSprite(vertices, {
      worldX: actorX,
      worldY: actorY,
      flipHorizontal: player.facing > 0
    }, actorClass, bodyFrame, chrSet);

    for (const weapon of pose?.weaponActors || []) {
      if (!weapon.frame) {
        continue;
      }
      const directionalX = player.facing > 0 ? weapon.xOffset : -weapon.xOffset;
      pushSprite(vertices, {
        worldX: actorX + directionalX,
        worldY: actorY + weapon.yOffset,
        flipHorizontal: player.facing > 0
      }, actorClass, weapon.frame, chrSet);
    }

    if (vertices.length === 0) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.spriteProgram);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(this.spriteLocations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(this.spriteLocations.camera, camera.x, camera.y, camera.scale);
    gl.uniform1i(this.spriteLocations.chr, 0);
    gl.uniform1i(this.spriteLocations.paletteTexture, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(this.spriteLocations.position);
    gl.vertexAttribPointer(this.spriteLocations.position, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(this.spriteLocations.uv);
    gl.vertexAttribPointer(this.spriteLocations.uv, 2, gl.FLOAT, false, 20, 8);
    gl.enableVertexAttribArray(this.spriteLocations.palette);
    gl.vertexAttribPointer(this.spriteLocations.palette, 1, gl.FLOAT, false, 20, 16);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, chrTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, paletteTextureForVariant);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 5);
  }
}

const controls = {
  tilt: 0,
  stairIntent: 0,
  jumpQueued: false,
  whipStart: 0,
  whipUntil: 0,
  tapJumpUntil: 0,
  motionWhipCooldownUntil: 0,
  motionSignal: 0,
  gravityEstimate: { x: 0, y: 0, z: 0 },
  hasGravityEstimate: false,
  lastAction: 'idle',
  pointer: null,
  touchActive: false
};

let worldGeometry = {
  bounds: { x: 0, y: 0, width: 2048, height: 672 },
  platforms: [],
  stairs: [],
  collisionLayers: []
};

const player = {
  x: PLAYER_START.x,
  y: PLAYER_START.y,
  vx: 0,
  ySub: ROM_SIMON_PHYSICS.initialSubY,
  vyFixed: 0,
  facing: 1,
  grounded: true,
  onStairs: false,
  stairPath: null,
  stairProgress: 0,
  stairStepRemaining: 0,
  stairStepFrame: 0,
  stairStepDirection: 0,
  stairPoseGroup: 'up',
  airMoveIntent: 0,
  airState: 'ground',
  cameraAnchorY: PLAYER_START.y,
  walkFrame: 0
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function approachValue(current, target, maxStep) {
  const delta = target - current;
  if (Math.abs(delta) <= maxStep) {
    return target;
  }
  return current + Math.sign(delta) * maxStep;
}

function snapScreenPixel(value) {
  return Math.floor(value);
}

function settingNumber(name, rawValue) {
  const limits = CONTROL_SETTING_LIMITS[name];
  const fallback = CONTROL_DEFAULTS[name];
  const value = Number(rawValue);
  if (!limits || !Number.isFinite(value)) {
    return fallback;
  }
  return clamp(value, limits.min, limits.max);
}

function formatSetting(name, value) {
  const limits = CONTROL_SETTING_LIMITS[name];
  return settingNumber(name, value).toFixed(limits?.digits ?? 0);
}

function currentControlSettings() {
  return {
    tiltThreshold: ROM_SIMON_PHYSICS.tiltThreshold,
    pitchRateThreshold: MOTION_JUMP.pitchRateThreshold,
    accelerationThreshold: MOTION_JUMP.accelerationThreshold
  };
}

function syncSettingsControls(settings = currentControlSettings()) {
  dom.tiltThresholdInput.value = formatSetting('tiltThreshold', settings.tiltThreshold);
  dom.tiltThresholdValue.value = formatSetting('tiltThreshold', settings.tiltThreshold);
  dom.flickPitchThresholdInput.value = formatSetting('pitchRateThreshold', settings.pitchRateThreshold);
  dom.flickPitchThresholdValue.value = formatSetting('pitchRateThreshold', settings.pitchRateThreshold);
  dom.flickAccelerationThresholdInput.value = formatSetting(
    'accelerationThreshold',
    settings.accelerationThreshold
  );
  dom.flickAccelerationThresholdValue.value = formatSetting(
    'accelerationThreshold',
    settings.accelerationThreshold
  );
}

function persistControlSettings(settings) {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Some private browsing modes reject localStorage; live settings still work.
  }
}

function applyControlSettings(settings, options = {}) {
  const next = {
    ...currentControlSettings(),
    ...settings
  };
  const normalized = {
    tiltThreshold: settingNumber('tiltThreshold', next.tiltThreshold),
    pitchRateThreshold: settingNumber('pitchRateThreshold', next.pitchRateThreshold),
    accelerationThreshold: settingNumber('accelerationThreshold', next.accelerationThreshold)
  };

  ROM_SIMON_PHYSICS.tiltThreshold = normalized.tiltThreshold;
  MOTION_JUMP.pitchRateThreshold = normalized.pitchRateThreshold;
  MOTION_JUMP.accelerationThreshold = normalized.accelerationThreshold;

  if (options.persist !== false) {
    persistControlSettings(normalized);
  }
  if (options.syncControls !== false) {
    syncSettingsControls(normalized);
  }
}

function loadControlSettings() {
  let stored = null;
  try {
    stored = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null');
  } catch {
    stored = null;
  }
  applyControlSettings(stored || CONTROL_DEFAULTS, { persist: false });
}

function openSettings() {
  syncSettingsControls();
  dom.settingsModal.hidden = false;
  dom.settingsButton.setAttribute('aria-expanded', 'true');
}

function closeSettings() {
  dom.settingsModal.hidden = true;
  dom.settingsButton.setAttribute('aria-expanded', 'false');
}

function installSettingsControls() {
  const inputs = [
    ['tiltThreshold', dom.tiltThresholdInput],
    ['pitchRateThreshold', dom.flickPitchThresholdInput],
    ['accelerationThreshold', dom.flickAccelerationThresholdInput]
  ];

  dom.settingsButton.setAttribute('aria-expanded', 'false');
  dom.settingsButton.addEventListener('click', (event) => {
    event.preventDefault();
    openSettings();
  });
  dom.settingsClose.addEventListener('click', (event) => {
    event.preventDefault();
    closeSettings();
  });
  dom.settingsModal.addEventListener('click', (event) => {
    if (event.target === dom.settingsModal) {
      closeSettings();
    }
  });
  dom.settingsReset.addEventListener('click', (event) => {
    event.preventDefault();
    applyControlSettings(CONTROL_DEFAULTS);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dom.settingsModal.hidden) {
      closeSettings();
    }
  });

  for (const [name, input] of inputs) {
    input.addEventListener('input', () => {
      applyControlSettings({ [name]: input.value });
    });
  }

  syncSettingsControls();
}

function signed16(value) {
  const wrapped = value & 0xffff;
  return wrapped >= 0x8000 ? wrapped - 0x10000 : wrapped;
}

function tiltMoveIntent() {
  if (controls.tilt <= -ROM_SIMON_PHYSICS.tiltThreshold) {
    return -1;
  }
  if (controls.tilt >= ROM_SIMON_PHYSICS.tiltThreshold) {
    return 1;
  }
  return 0;
}

function facingFromSign(sign) {
  return sign > 0 ? 1 : 0;
}

function addFixedYStep() {
  const total = player.ySub + signed16(player.vyFixed);
  const whole = Math.floor(total / 256);
  player.ySub = ((total % 256) + 256) % 256;
  return whole;
}

function applyRomGravity() {
  player.vyFixed = Math.min(
    ROM_SIMON_PHYSICS.maxFallVelocity,
    signed16(player.vyFixed) + ROM_SIMON_PHYSICS.gravity
  );
}

function updateMeter(element, value) {
  const normalized = clamp(value, -1, 1);
  element.style.setProperty('--meter-width', `${Math.abs(normalized) * 50}%`);
  element.style.setProperty('--meter-offset', normalized < 0 ? '-100%' : '0%');
}

function positionOnStair(stair, progress) {
  const snappedProgress = clamp(progress, 0, stair.length);
  return {
    x: stair.lowerX + stair.ascentX * snappedProgress,
    y: stair.lowerY - snappedProgress,
    progress: snappedProgress
  };
}

function terrainClassAtWorldPixel(x, y) {
  for (const layer of worldGeometry.collisionLayers) {
    if (
      x < layer.x ||
      y < layer.y ||
      x >= layer.x + layer.width ||
      y >= layer.y + layer.height
    ) {
      continue;
    }
    const tileX = Math.floor((x - layer.x) / 8);
    const tileY = Math.floor((y - layer.y) / 8);
    if (tileX < 0 || tileY < 0 || tileX >= layer.tileWidth || tileY >= layer.tileHeight) {
      continue;
    }
    return terrainValueForTile(expandedTileIndex(layer.tilemap, layer.tileWidth, tileX, tileY));
  }
  return 0;
}

function terrainClassForRomProbe(anchorX, anchorY, offsetX, offsetY) {
  return terrainClassAtWorldPixel(
    anchorX + signedByte(offsetX),
    anchorY + signedByte(offsetY) - ROM_TERRAIN_LOOKUP_Y_BIAS
  );
}

function terrainBlocksBody(terrainClass) {
  return !PASSABLE_TERRAIN_VALUES.has(terrainClass);
}

function renderedJumpSideCollisionAt(anchorX, anchorY, direction) {
  if (direction === 0) {
    return false;
  }
  const sideX = anchorX + (direction > 0 ? SIMON_JUMP_SIDE_X_OFFSET : -SIMON_JUMP_SIDE_X_OFFSET);
  for (
    let y = anchorY + SIMON_JUMP_HEAD_Y_OFFSET;
    y <= anchorY + SIMON_JUMP_BODY_BOTTOM_Y_OFFSET;
    y += 1
  ) {
    if (terrainBlocksBody(terrainClassAtWorldPixel(sideX, y))) {
      return true;
    }
  }
  return false;
}

function sideCollisionAt(anchorX, anchorY, direction, grounded) {
  if (direction === 0) {
    return false;
  }
  const offsetX = direction > 0 ? ROM_SIDE_PROBE_X_OFFSET : -ROM_SIDE_PROBE_X_OFFSET;
  const offsets = grounded
    ? ROM_WALL_PROBE_Y_OFFSETS_GROUND
    : ROM_WALL_PROBE_Y_OFFSETS_AIR;
  const probeResults = offsets.map((offsetY) => ({
    offsetY,
    blocked: terrainBlocksBody(terrainClassForRomProbe(anchorX, anchorY, offsetX, offsetY))
  }));
  if (grounded) {
    const bodyBlocked = probeResults.some((result) => (
      result.offsetY !== ROM_SIDE_PROBE_UPPER_OFFSET &&
      result.blocked
    ));
    if (!bodyBlocked) {
      return false;
    }
  } else if (renderedJumpSideCollisionAt(anchorX, anchorY, direction)) {
    return true;
  }
  return probeResults.some((result) => result.blocked);
}

function resolveHorizontalPosition(currentX, desiredX, anchorY, direction, grounded) {
  if (direction === 0 || desiredX === currentX) {
    return desiredX;
  }
  const step = Math.sign(desiredX - currentX);
  let resolvedX = currentX;
  for (let x = currentX + step; step > 0 ? x <= desiredX : x >= desiredX; x += step) {
    if (sideCollisionAt(x, anchorY, direction, grounded)) {
      return resolvedX;
    }
    resolvedX = x;
  }
  return resolvedX;
}

function sideCollisionAlongVerticalMotion(anchorX, currentY, desiredY, direction) {
  if (direction === 0) {
    return false;
  }
  const verticalStep = Math.sign(desiredY - currentY);
  if (verticalStep === 0) {
    return sideCollisionAt(anchorX, currentY, direction, false);
  }
  for (
    let y = currentY;
    verticalStep > 0 ? y <= desiredY : y >= desiredY;
    y += verticalStep
  ) {
    if (sideCollisionAt(anchorX, y, direction, false)) {
      return true;
    }
  }
  return false;
}

function resolveAirborneHorizontalPosition(currentX, desiredX, currentY, desiredY, direction) {
  if (direction === 0 || desiredX === currentX) {
    return desiredX;
  }
  const step = Math.sign(desiredX - currentX);
  let resolvedX = currentX;
  for (let x = currentX + step; step > 0 ? x <= desiredX : x >= desiredX; x += step) {
    if (sideCollisionAlongVerticalMotion(x, currentY, desiredY, direction)) {
      return resolvedX;
    }
    resolvedX = x;
  }
  return resolvedX;
}

function upwardCollisionAt(anchorX, anchorY) {
  const romProbeBlocked = ROM_UPWARD_PROBE_Y_OFFSETS.some((offsetY) => terrainBlocksBody(
    terrainClassForRomProbe(anchorX, anchorY, 0, offsetY)
  ));
  if (romProbeBlocked) {
    return true;
  }
  const headY = anchorY + SIMON_JUMP_HEAD_Y_OFFSET;
  return SIMON_HEAD_X_OFFSETS.some((offsetX) => terrainBlocksBody(
    terrainClassAtWorldPixel(anchorX + offsetX, headY)
  ));
}

function resolveAscendingPosition(anchorX, currentY, desiredY) {
  if (desiredY >= currentY) {
    return { y: desiredY, blocked: false };
  }
  let resolvedY = currentY;
  for (let y = currentY - 1; y >= desiredY; y -= 1) {
    if (upwardCollisionAt(anchorX, y)) {
      return { y: resolvedY, blocked: true };
    }
    resolvedY = y;
  }
  return { y: resolvedY, blocked: false };
}

function nearestStair(x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const stair of worldGeometry.stairs) {
    const progress = clamp((x - stair.lowerX) * stair.ascentX, 0, stair.length);
    const position = positionOnStair(stair, progress);
    const distance = Math.hypot(position.x - x, position.y - y);
    if (distance < bestDistance && distance < 28) {
      best = {
        stair,
        progress: position.progress,
        x: position.x,
        y: position.y
      };
      bestDistance = distance;
    }
  }
  return best;
}

function platformAt(x, y, nextY) {
  for (const platform of worldGeometry.platforms) {
    const withinX = x >= platform.x - 8 && x <= platform.x + platform.width + 8;
    if (withinX && y <= platform.y && nextY >= platform.y) {
      return platform;
    }
  }
  return null;
}

function supportingPlatformAt(x, y) {
  return worldGeometry.platforms.find((platform) => (
    x >= platform.x - 8 &&
    x <= platform.x + platform.width + 8 &&
    Math.abs(y - platform.y) < 0.5
  )) || null;
}

function nearestSupportAt(x, y) {
  let best = null;
  let bestDistance = Infinity;
  for (const platform of worldGeometry.platforms) {
    const withinX = x >= platform.x - 8 && x <= platform.x + platform.width + 8;
    const distance = Math.abs(platform.y - y);
    if (withinX && distance < bestDistance) {
      best = platform;
      bestDistance = distance;
    }
  }
  return bestDistance <= 96 ? best : null;
}

function placePlayerAtStart() {
  const support = nearestSupportAt(PLAYER_START.x, PLAYER_START.y);
  player.x = PLAYER_START.x;
  player.y = support?.y ?? PLAYER_START.y;
  player.vx = 0;
  player.ySub = ROM_SIMON_PHYSICS.initialSubY;
  player.vyFixed = 0;
  player.grounded = Boolean(support);
  player.onStairs = false;
  player.stairPath = null;
  player.stairProgress = 0;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.stairPoseGroup = 'up';
  player.airMoveIntent = 0;
  player.airState = player.grounded ? 'ground' : 'fall';
  player.cameraAnchorY = player.y;
  player.walkFrame = 0;
}

function placePlayerOnDebugStair() {
  const mode = URL_PARAMS.get('debug-stair');
  const target = mode === 'up-left'
    ? { x: 1352, y: 289 }
    : { x: 1424, y: 385 };
  const nearest = nearestStair(target.x, target.y);
  if (!nearest) {
    return;
  }
  const position = positionOnStair(nearest.stair, nearest.progress);
  player.x = position.x;
  player.y = position.y;
  player.vx = 0;
  player.ySub = 0;
  player.vyFixed = 0;
  player.facing = facingFromSign(nearest.stair.ascentX);
  player.grounded = false;
  player.onStairs = true;
  player.stairPath = nearest.stair;
  player.stairProgress = position.progress;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.stairPoseGroup = 'up';
  player.airMoveIntent = 0;
  player.airState = 'ground';
  player.cameraAnchorY = player.y;
  player.walkFrame = 0;
  controls.stairIntent = 0;
  controls.lastAction = 'debug stair';
}

function startJump() {
  if (!player.grounded || player.onStairs) {
    return;
  }
  const moveIntent = tiltMoveIntent();
  player.vx = moveIntent * ROM_SIMON_PHYSICS.walkPixelsPerFrame / ROM_SIMON_PHYSICS.frameSeconds;
  player.airMoveIntent = moveIntent;
  if (moveIntent !== 0) {
    player.facing = facingFromSign(moveIntent);
  }
  player.vyFixed = ROM_SIMON_PHYSICS.jumpVelocity;
  player.grounded = false;
  player.onStairs = false;
  player.stairPath = null;
  player.stairProgress = 0;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.cameraAnchorY = player.y;
  player.airState = 'jump';
  controls.lastAction = 'jump';
}

function startWhip(now = performance.now()) {
  controls.whipStart = now;
  controls.whipUntil = now + WHIP_ATTACK_DURATION_MS;
  controls.lastAction = 'whip';
}

function queueTapJump(now = performance.now()) {
  if (!player.grounded || player.onStairs) {
    return;
  }
  controls.jumpQueued = true;
  controls.tapJumpUntil = now + MOTION_JUMP.pulseMs;
  controls.lastAction = 'tap jump';
}

function queueMotionWhip(now = performance.now()) {
  if (now < controls.motionWhipCooldownUntil) {
    return;
  }
  startWhip(now);
  controls.motionWhipCooldownUntil = now + MOTION_JUMP.cooldownMs;
  controls.lastAction = 'motion whip';
}

function startStair(direction) {
  const nearest = nearestStair(player.x, player.y);
  if (!nearest) {
    controls.lastAction = direction < 0 ? 'up' : 'down';
    return;
  }
  const progressDirection = direction < 0 ? 1 : -1;
  const position = positionOnStair(nearest.stair, nearest.progress);
  player.onStairs = true;
  player.grounded = false;
  player.vyFixed = 0;
  player.stairPath = nearest.stair;
  player.stairProgress = position.progress;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.stairPoseGroup = direction < 0 ? 'up' : 'down';
  player.x = position.x;
  player.y = position.y;
  player.vx = 0;
  player.facing = facingFromSign(nearest.stair.ascentX * progressDirection);
  controls.stairIntent = direction;
  controls.lastAction = direction < 0 ? 'stairs up' : 'stairs down';
}

function startStairStep(stair, direction) {
  const progressDirection = direction < 0 ? 1 : -1;
  const nextProgress = player.stairProgress + ROM_SIMON_PHYSICS.stairStepPixelsPerFrame * progressDirection;
  if (nextProgress < 0 || nextProgress > stair.length) {
    controls.stairIntent = 0;
    return false;
  }
  player.stairStepRemaining = ROM_SIMON_PHYSICS.stairStepFrames;
  player.stairStepFrame = 0;
  player.stairStepDirection = direction;
  player.stairPoseGroup = direction < 0 ? 'up' : 'down';
  player.facing = facingFromSign(stair.ascentX * progressDirection);
  controls.lastAction = direction < 0 ? 'stairs up' : 'stairs down';
  return true;
}

function exitStairAsGrounded() {
  player.grounded = true;
  player.onStairs = false;
  player.stairPath = null;
  player.stairProgress = 0;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.vx = 0;
  player.vyFixed = 0;
  player.airMoveIntent = 0;
  player.airState = 'ground';
  controls.stairIntent = 0;
}

function finishStairStepIfNeeded(stair) {
  const atEndpoint = player.stairProgress <= 0 || player.stairProgress >= stair.length;
  if (!atEndpoint) {
    return;
  }
  const platform = supportingPlatformAt(player.x, player.y);
  if (platform) {
    landOn(platform);
    controls.stairIntent = 0;
    return;
  }
  exitStairAsGrounded();
}

function landOn(platform) {
  player.y = platform.y;
  player.vx = 0;
  player.vyFixed = 0;
  player.grounded = true;
  player.onStairs = false;
  player.stairPath = null;
  player.stairProgress = 0;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.airMoveIntent = 0;
  player.airState = 'ground';
}

function startFall() {
  player.grounded = false;
  player.onStairs = false;
  player.stairPath = null;
  player.stairProgress = 0;
  player.stairStepRemaining = 0;
  player.stairStepFrame = 0;
  player.stairStepDirection = 0;
  player.airMoveIntent = 0;
  player.vyFixed = ROM_SIMON_PHYSICS.fallVelocity;
  player.airState = 'fall';
}

function updateCameraAnchorY() {
  if (player.grounded || player.onStairs) {
    player.cameraAnchorY = approachValue(
      player.cameraAnchorY,
      player.y,
      CAMERA_VERTICAL_MAX_STEP
    );
    return;
  }

  const fallFollowTarget = player.y - CAMERA_VERTICAL_DEAD_ZONE;
  if (fallFollowTarget > player.cameraAnchorY) {
    player.cameraAnchorY = approachValue(
      player.cameraAnchorY,
      fallFollowTarget,
      CAMERA_VERTICAL_MAX_STEP
    );
  }
}

function stepPlayer(dt) {
  controls.motionSignal = Math.max(0, controls.motionSignal - dt * 2.5);

  if (controls.jumpQueued) {
    controls.jumpQueued = false;
    startJump();
  }

  const moveIntent = tiltMoveIntent();

  if (player.onStairs) {
    const stair = player.stairPath || nearestStair(player.x, player.y)?.stair;
    if (!stair) {
      startFall();
    } else if (player.stairStepRemaining > 0) {
      const previousX = player.x;
      const previousY = player.y;
      const progressDirection = player.stairStepDirection < 0 ? 1 : -1;
      const nextProgress = player.stairProgress + ROM_SIMON_PHYSICS.stairStepPixelsPerFrame * progressDirection;
      const position = positionOnStair(stair, nextProgress);
      player.stairPath = stair;
      player.stairProgress = position.progress;
      player.x = position.x;
      player.y = position.y;
      player.vx = (player.x - previousX) / ROM_SIMON_PHYSICS.frameSeconds;
      player.vyFixed = Math.round((player.y - previousY) * 256);
      player.stairStepRemaining -= 1;
      player.stairStepFrame += 1;
      finishStairStepIfNeeded(stair);
    } else if (controls.stairIntent !== 0) {
      player.vx = 0;
      player.vyFixed = 0;
      if (!startStairStep(stair, controls.stairIntent)) {
        finishStairStepIfNeeded(stair);
      }
    } else {
      player.vx = 0;
      player.vyFixed = 0;
    }
  } else {
    const bounds = worldGeometry.bounds;
    const horizontalIntent = player.grounded ? moveIntent : player.airMoveIntent;
    if (player.grounded && moveIntent !== 0) {
      player.facing = facingFromSign(moveIntent);
    }
    player.vx = horizontalIntent * ROM_SIMON_PHYSICS.walkPixelsPerFrame / ROM_SIMON_PHYSICS.frameSeconds;
    const desiredX = clamp(
      player.x + horizontalIntent * ROM_SIMON_PHYSICS.walkPixelsPerFrame,
      bounds.x + PLAYER_HORIZONTAL_MARGIN,
      bounds.x + bounds.width - PLAYER_HORIZONTAL_MARGIN
    );
    if (player.grounded) {
      const nextX = resolveHorizontalPosition(
        player.x,
        desiredX,
        player.y,
        horizontalIntent,
        true
      );
      if (nextX === player.x && horizontalIntent !== 0) {
        player.vx = 0;
      }
      player.x = nextX;
      if (!supportingPlatformAt(player.x, player.y)) {
        startFall();
      }
    } else {
      const currentY = player.y;
      const verticalStep = addFixedYStep();
      const nextY = currentY + verticalStep;
      const nextX = resolveAirborneHorizontalPosition(
        player.x,
        desiredX,
        currentY,
        nextY,
        horizontalIntent
      );
      if (nextX === player.x && horizontalIntent !== 0) {
        player.vx = 0;
      }
      player.x = nextX;
      if (verticalStep >= 0) {
        const platform = platformAt(player.x, currentY, nextY);
        if (platform) {
          landOn(platform);
        } else {
          player.y = clamp(nextY, bounds.y, bounds.y + bounds.height + 32);
          applyRomGravity();
        }
      } else {
        const resolved = resolveAscendingPosition(player.x, currentY, nextY);
        player.y = clamp(resolved.y, bounds.y, bounds.y + bounds.height + 32);
        if (resolved.blocked) {
          player.ySub = 0;
          player.vyFixed = ROM_SIMON_PHYSICS.fallVelocity;
          player.airState = 'fall';
        } else {
          applyRomGravity();
        }
      }
    }
  }

  if (Math.abs(player.vx) > 0.1 && (player.grounded || player.onStairs)) {
    player.walkFrame += 1;
  }
  updateCameraAnchorY();
}

function frameBySelector(renderer, selector) {
  const key = typeof selector === 'number'
    ? `0x${selector.toString(16).padStart(2, '0').toUpperCase()}`
    : selector;
  const actorClass = renderer.actorClassById.get('simon-belmont');
  return actorClass?.frames?.find((frame) => frame.selector === key) ||
    ROM_DECODED_SIMON_EXTRA_FRAMES[key] ||
    ROM_TRACED_ATTACK_FRAMES[key] ||
    null;
}

function currentWhipPose(renderer, now) {
  if (now >= controls.whipUntil) {
    return null;
  }
  const elapsed = now - controls.whipStart;
  const phase = ROM_TRACED_ATTACK_SEQUENCE.find((record) => elapsed <= record.maxElapsedMs);
  if (!phase) {
    return null;
  }
  return {
    bodyFrame: frameBySelector(renderer, phase.bodySelector),
    weaponActors: phase.weaponActors.map((weapon) => ({
      ...weapon,
      frame: frameBySelector(renderer, weapon.selector)
    }))
  };
}

function currentStairSelector() {
  const selectors = player.stairPoseGroup === 'down'
    ? ROM_SIMON_PHYSICS.stairDownSelectors
    : ROM_SIMON_PHYSICS.stairUpSelectors;
  if (player.stairStepRemaining <= 0) {
    return selectors[0];
  }
  const frame = player.stairStepFrame;
  if (frame <= 5) {
    return selectors[0];
  }
  if (frame <= 14) {
    return selectors[1];
  }
  return selectors[2];
}

function currentSimonPose(renderer) {
  const now = performance.now();
  const whipPose = currentWhipPose(renderer, now);
  if (whipPose) {
    return whipPose;
  }

  const actorClass = renderer.actorClassById.get('simon-belmont');
  const frames = actorClass?.frames || [];
  if (frames.length === 0) {
    return null;
  }
  if (player.onStairs) {
    return {
      bodyFrame: frameBySelector(renderer, currentStairSelector()) || frames[0],
      weaponActors: []
    };
  }
  if (!player.grounded && !player.onStairs) {
    return {
      bodyFrame: frameBySelector(renderer, ROM_SIMON_PHYSICS.jumpSelector) || frames[0],
      weaponActors: []
    };
  }
  if (Math.abs(player.vx) > 0.1 || player.onStairs) {
    const index = Math.floor(player.walkFrame / ROM_SIMON_PHYSICS.walkFrameDuration) %
      ROM_SIMON_PHYSICS.walkSelectors.length;
    return {
      bodyFrame: frameBySelector(renderer, ROM_SIMON_PHYSICS.walkSelectors[index]) || frames[0],
      weaponActors: []
    };
  }
  return {
    bodyFrame: frameBySelector(renderer, ROM_SIMON_PHYSICS.idleSelector) || frames[0],
    weaponActors: []
  };
}

function cameraForPlayer(renderer) {
  renderer.resize();
  const gl = renderer.gl;
  const scale = Math.max(1, Math.min(
    gl.canvas.width / NES_SCREEN_WIDTH,
    (gl.canvas.height - 148) / NES_SCREEN_HEIGHT
  ));
  const visibleWidth = gl.canvas.width / scale;
  const visibleHeight = gl.canvas.height / scale;
  const clampAxis = (center, start, length, visibleLength) => {
    const min = start + visibleLength / 2;
    const max = start + length - visibleLength / 2;
    return min <= max ? clamp(center, min, max) : start + length / 2;
  };
  const bounds = worldGeometry.bounds;
  return {
    x: snapScreenPixel(clampAxis(player.x, bounds.x, bounds.width, visibleWidth)),
    y: snapScreenPixel(clampAxis(player.cameraAnchorY - 45, bounds.y, bounds.height, visibleHeight)),
    scale
  };
}

function setReadouts() {
  const now = performance.now();
  const tiltLabel = Math.abs(controls.tilt) >= ROM_SIMON_PHYSICS.tiltThreshold
    ? controls.tilt < 0 ? 'tilt left' : 'tilt right'
    : 'idle';
  const action = now < controls.whipUntil
    ? controls.lastAction === 'motion whip' ? 'motion whip' : 'whip'
    : now < controls.tapJumpUntil
      ? 'tap jump'
      : controls.lastAction;
  dom.inputReadout.textContent = action === 'idle' ? tiltLabel : action;
  dom.physicsReadout.textContent = PHYSICS_PROVENANCE.status;
  updateMeter(dom.tiltMeter, controls.tilt);
  updateMeter(
    dom.actionMeter,
    now < controls.whipUntil
      ? 1
      : now < controls.tapJumpUntil
        ? 0.9
        : controls.stairIntent * 0.75
  );
}

function eventPoint(event) {
  const touch = event.changedTouches?.[0] || event.touches?.[0];
  return {
    x: touch ? touch.clientX : event.clientX,
    y: touch ? touch.clientY : event.clientY,
    time: performance.now()
  };
}

function beginGesture(event) {
  event.preventDefault();
  controls.pointer = eventPoint(event);
  if (!player.onStairs) {
    controls.stairIntent = 0;
  }
}

function endGesture(event) {
  event.preventDefault();
  if (!controls.pointer) {
    return;
  }
  const end = eventPoint(event);
  const dx = end.x - controls.pointer.x;
  const dy = end.y - controls.pointer.y;
  const elapsed = end.time - controls.pointer.time;
  const distance = Math.hypot(dx, dy);
  controls.pointer = null;

  if (elapsed < 520 && distance > 30 && Math.abs(dy) > Math.abs(dx) * 1.1) {
    startStair(dy < 0 ? -1 : 1);
    return;
  }

  if (elapsed < 260 && distance < 16) {
    queueTapJump(end.time);
  }
}

function finiteNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

function motionVector(vector) {
  return {
    x: finiteNumber(vector?.x),
    y: finiteNumber(vector?.y),
    z: finiteNumber(vector?.z)
  };
}

function linearAccelerationFromMotion(event) {
  const direct = event.acceleration;
  if (Number.isFinite(direct?.x) || Number.isFinite(direct?.y) || Number.isFinite(direct?.z)) {
    return motionVector(direct);
  }

  const raw = event.accelerationIncludingGravity;
  if (!raw || (!Number.isFinite(raw.x) && !Number.isFinite(raw.y) && !Number.isFinite(raw.z))) {
    return { x: 0, y: 0, z: 0 };
  }

  const current = motionVector(raw);
  if (!controls.hasGravityEstimate) {
    controls.gravityEstimate = current;
    controls.hasGravityEstimate = true;
    return { x: 0, y: 0, z: 0 };
  }

  const smooth = MOTION_JUMP.gravitySmoothing;
  controls.gravityEstimate = {
    x: controls.gravityEstimate.x * smooth + current.x * (1 - smooth),
    y: controls.gravityEstimate.y * smooth + current.y * (1 - smooth),
    z: controls.gravityEstimate.z * smooth + current.z * (1 - smooth)
  };
  return {
    x: current.x - controls.gravityEstimate.x,
    y: current.y - controls.gravityEstimate.y,
    z: current.z - controls.gravityEstimate.z
  };
}

function handleDeviceMotion(event) {
  const now = performance.now();
  const pitchRate = finiteNumber(event.rotationRate?.beta);
  const acceleration = linearAccelerationFromMotion(event);
  const accelerationMagnitude = Math.hypot(acceleration.x, acceleration.y, acceleration.z);
  const pitchSignal = Math.abs(pitchRate) / MOTION_JUMP.pitchRateThreshold;
  const accelerationSignal = accelerationMagnitude / MOTION_JUMP.accelerationThreshold;
  const signal = Math.max(pitchSignal, accelerationSignal);
  controls.motionSignal = Math.max(controls.motionSignal, clamp(signal, 0, 1));

  if (
    Math.abs(pitchRate) >= MOTION_JUMP.pitchRateThreshold ||
    accelerationMagnitude >= MOTION_JUMP.accelerationThreshold
  ) {
    queueMotionWhip(now);
  }
}

async function requestSensorPermission(eventConstructor) {
  const requestPermission = eventConstructor?.requestPermission;
  if (typeof requestPermission !== 'function') {
    return 'granted';
  }
  return requestPermission.call(eventConstructor);
}

function installControls() {
  installSettingsControls();

  dom.canvas.addEventListener('touchstart', (event) => {
    controls.touchActive = true;
    beginGesture(event);
  }, { passive: false });
  dom.canvas.addEventListener('touchend', (event) => {
    endGesture(event);
    window.setTimeout(() => {
      controls.touchActive = false;
    }, 80);
  }, { passive: false });
  dom.canvas.addEventListener('touchcancel', () => {
    controls.pointer = null;
    if (!player.onStairs) {
      controls.stairIntent = 0;
    }
    controls.touchActive = false;
  }, { passive: true });

  dom.canvas.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && controls.touchActive) return;
    beginGesture(event);
  }, { passive: false });
  dom.canvas.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch' && controls.touchActive) return;
    endGesture(event);
  }, { passive: false });
  dom.canvas.addEventListener('pointercancel', () => {
    controls.pointer = null;
    if (!player.onStairs) {
      controls.stairIntent = 0;
    }
  }, { passive: true });

  window.addEventListener('deviceorientation', (event) => {
    if (typeof event.gamma !== 'number') {
      return;
    }
    controls.tilt = clamp(event.gamma / 24, -1, 1);
  });
  window.addEventListener('devicemotion', handleDeviceMotion);

  dom.motionButton.addEventListener('click', async () => {
    try {
      const permissionRequests = [
        requestSensorPermission(globalThis.DeviceOrientationEvent),
        requestSensorPermission(globalThis.DeviceMotionEvent)
      ];
      const [orientationResult, motionResult] = await Promise.all(permissionRequests);
      dom.motionButton.textContent = orientationResult === 'granted' && motionResult === 'granted'
        ? 'Ready'
        : 'Blocked';
    } catch {
      dom.motionButton.textContent = 'Blocked';
    }
  });
}

async function main() {
  dom.physicsReadout.title = PHYSICS_PROVENANCE.blocker;
  await initWasm();
  const renderer = new ControlDemoRenderer(dom.canvas);
  await renderer.load(SCENE_URL);
  worldGeometry = renderer.worldGeometry;
  placePlayerAtStart();
  if (DEBUG_START_ON_STAIR) {
    placePlayerOnDebugStair();
  }
  loadControlSettings();
  installControls();

  let lastTime = performance.now();
  let accumulator = 0;
  function frame(time) {
    const elapsed = Math.min(0.12, Math.max(0, (time - lastTime) / 1000));
    lastTime = time;
    accumulator += elapsed;
    while (accumulator >= ROM_SIMON_PHYSICS.frameSeconds) {
      stepPlayer(ROM_SIMON_PHYSICS.frameSeconds);
      accumulator -= ROM_SIMON_PHYSICS.frameSeconds;
    }
    setReadouts();
    renderer.render(cameraForPlayer(renderer), player, currentSimonPose(renderer));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

main().catch((error) => {
  console.error(error);
  dom.inputReadout.textContent = 'load failed';
  dom.physicsReadout.textContent = 'error';
  dom.physicsReadout.title = error?.stack || error?.message || String(error);
});
