import initWasm, { decode_chr_atlas, expand_segment_tilemap } from './vendor/guide-map-wasm/guide_map_wasm.js';
import {
  Cv2DialogLayout,
  NES_PALETTE,
  createGlyphMap,
  isCv2DialogRuleLine,
  renderCv2DialogFrameToRgba
} from './dialog.js?v=pan-inertia5';

const CACHE_KEY = 'pan-inertia5';
const SLICE_URL = `./assets/slices/jova-to-berkeley/slice.json?v=${CACHE_KEY}`;
const SCENE_URL = `./assets/scenes/berkeley-mansion-part-1/slice.json?v=${CACHE_KEY}`;
const FONT_URL = `./assets/fonts/cv2-dialog.json?v=${CACHE_KEY}`;

const ROUTE_SEGMENT_IDS = [
  'town-of-jova',
  'jova-woods',
  'south-bridge',
  'veros-woods-part-1',
  'veros-woods-part-2',
  'town-of-veros',
  'dabis-path-part-1',
  'dabis-path-part-2',
  'aljiba-woods-part-1',
  'aljiba-woods-part-2',
  'aljiba-woods-part-3',
  'denis-woods-part-1',
  'berkeley-mansion-door',
  'denis-woods-part-2',
  'denis-woods-part-3'
];

const OVERVIEW_LABEL_SCALE = 0.3;
const OVERVIEW_LABEL_TEXT = new Map([
  ['veros-woods-part-1', 'Veros Woods'],
  ['dabis-path-part-1', "Dabi's Path"],
  ['aljiba-woods-part-1', 'Aljiba Woods'],
  ['denis-woods-part-1', 'Denis Woods'],
  ['denis-woods-part-2', 'Denis Woods'],
  ['berkeley-mansion-door', 'Berkeley Mansion']
]);
const OVERVIEW_LABEL_HIDDEN_IDS = new Set([
  'veros-woods-part-2',
  'dabis-path-part-2',
  'aljiba-woods-part-2',
  'aljiba-woods-part-3',
  'denis-woods-part-3'
]);
const LABEL_BELOW_SEGMENT_IDS = new Set(['town-of-veros']);
const LABEL_COLLISION_PADDING = 6;
const LABEL_MAP_GAP = 10;
const LABEL_LEADER_THRESHOLD = 3;
const LABEL_DIALOG_SCALE = 1.25;
const LABEL_DIALOG_MAX_TEXT_COLUMNS = 16;
const LABEL_DIALOG_MIN_TEXT_COLUMNS = 6;
const LABEL_DIALOG_GREY_BORDER = [255, 255, 255, 61];
const GUIDE_AUTHORED_DIALOG_GREY_BORDER = [61, 61, 61, 255];
const GUIDE_AUTHORED_DIALOG_TONE = 'guide-authored';
const CHROME_ICON_SIZE = 16;
const CHROME_ICON_PALETTE = {
  W: [...NES_PALETTE[0x20], 255],
  G: [...NES_PALETTE[0x2d], 255],
  Y: [...NES_PALETTE[0x27], 255]
};
const CHROME_ICONS = {
  sun: [
    '................',
    '.......Y........',
    '..Y....Y....Y...',
    '...Y.......Y....',
    '.....YYYYY......',
    '....YYYYYYY.....',
    '...YYYYYYYYY....',
    'YY.YYYYYYYYY.YY.',
    '...YYYYYYYYY....',
    '...YYYYYYYYY....',
    '....YYYYYYY.....',
    '.....YYYYY......',
    '...Y.......Y....',
    '..Y....Y....Y...',
    '.......Y........',
    '................'
  ],
  moon: [
    '................',
    '........WWWW....',
    '......WWWW......',
    '.....WWWW.......',
    '....WWWWW.......',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '....WWWWW.......',
    '.....WWWW.......',
    '......WWWW......',
    '........WWWW....',
    '................'
  ],
  layers: [
    '................',
    '.WWWWWWWWWW.....',
    '.W........W.....',
    '.W........WGGGG.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.WWWWWWWWWW...G.',
    '.....G........G.',
    '.....GGGGGGGGGG.'
  ]
};

const MIN_CAMERA_SCALE = 0.03;
const PAN_INERTIA_DECAY_PER_SECOND = 5.2;
const PAN_INERTIA_MAX_SPEED = 7.5;
const PAN_INERTIA_STOP_SPEED = 0.018;
const PAN_RELEASE_MIN_SCREEN_SPEED = 0.42;
const PAN_RELEASE_HISTORY_MS = 100;
const PAN_RELEASE_STALE_MS = 180;
const FLOATING_VEROS_SEGMENT_ID = 'town-of-veros';
const FLOATING_VEROS_LEFT_SEGMENT_ID = 'veros-woods-part-2';
const FLOATING_VEROS_RIGHT_SEGMENT_ID = 'dabis-path-part-1';
const FLOATING_VEROS_SIDE_HYSTERESIS = 96;
const FLOATING_VEROS_EASE_MS = 180;
const FLOATING_VEROS_FRAME_MS = 48;
const FLOATING_VEROS_SNAP_EPSILON = 0.25;

const HOTSPOTS = [
  {
    id: 'berkeley-door',
    type: 'door',
    segmentId: 'berkeley-mansion-door',
    label: 'Enter Berkeley Mansion',
    tileRect: { x: 13, y: 16, width: 6, height: 8 },
    note: 'Door portal to Berkeley Mansion - Part 1.',
    opens: 'berkeley-mansion-part-1'
  }
];

const dom = {
  mapCanvas: document.querySelector('#map-canvas'),
  sceneCanvas: document.querySelector('#scene-canvas'),
  overlay: document.querySelector('#overlay-layer'),
  status: document.querySelector('#status'),
  guideCard: document.querySelector('#guide-card'),
  dialogBox: document.querySelector('#dialog-box'),
  dialogFrameCanvas: document.querySelector('#dialog-frame-canvas'),
  dialogCloseFrameCanvas: document.querySelector('#dialog-close-frame-canvas'),
  dialogText: document.querySelector('#dialog-text'),
  dialogClose: document.querySelector('#dialog-close'),
  guideInspector: document.querySelector('#guide-inspector'),
  guideInspectorTitle: document.querySelector('#guide-inspector-title'),
  guideInspectorSummary: document.querySelector('#guide-inspector-summary'),
  guideInspectorList: document.querySelector('#guide-inspector-list'),
  guideInspectorClose: document.querySelector('#guide-inspector-close'),
  paletteToggle: document.querySelector('#palette-toggle'),
  paletteToggleIcon: document.querySelector('#palette-toggle-icon'),
  optionsToggle: document.querySelector('#options-toggle'),
  optionsToggleIcon: document.querySelector('#options-toggle-icon'),
  optionsPanel: document.querySelector('#options-panel'),
  labelsToggle: document.querySelector('#toggle-labels'),
  sectionOutlinesToggle: document.querySelector('#toggle-section-outlines'),
  highlightDoorsToggle: document.querySelector('#toggle-highlight-doors'),
  showCharactersToggle: document.querySelector('#toggle-show-characters'),
  showSecretsToggle: document.querySelector('#toggle-show-secrets'),
  highlightCharactersToggle: document.querySelector('#toggle-highlight-characters'),
  highlightMapObjectsToggle: document.querySelector('#toggle-highlight-map-objects'),
  highlightSecretsToggle: document.querySelector('#toggle-highlight-secrets'),
  portalModal: document.querySelector('#portal-modal'),
  closePortal: document.querySelector('#close-portal')
};

for (const [name, element] of Object.entries(dom)) {
  if (!element) {
    throw new Error(`Missing guide DOM element: ${name}`);
  }
}

function setStatus(message) {
  dom.status.textContent = message;
}

function assertGl(value, label) {
  if (!value) {
    throw new Error(`Unable to create ${label}.`);
  }
  return value;
}

function rangeView(data, range) {
  return new Uint8Array(data, range.offset, range.length);
}

function drawChromeIcon(canvas, rows) {
  if (!canvas || !rows) return;
  if (canvas.width !== CHROME_ICON_SIZE || canvas.height !== CHROME_ICON_SIZE) {
    canvas.width = CHROME_ICON_SIZE;
    canvas.height = CHROME_ICON_SIZE;
  }

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, CHROME_ICON_SIZE, CHROME_ICON_SIZE);

  for (let y = 0; y < CHROME_ICON_SIZE; y += 1) {
    const row = rows[y] || '';
    for (let x = 0; x < CHROME_ICON_SIZE; x += 1) {
      const color = CHROME_ICON_PALETTE[row[x]];
      if (!color) {
        continue;
      }
      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
      context.fillRect(x, y, 1, 1);
    }
  }
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

function createProgram(gl) {
  const vertexSource = `#version 300 es
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
`;

  const fragmentSource = `#version 300 es
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
`;

  const program = assertGl(gl.createProgram(), 'program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createSpriteProgram(gl) {
  const vertexSource = `#version 300 es
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
`;

  const fragmentSource = `#version 300 es
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
`;

  const program = assertGl(gl.createProgram(), 'sprite program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown sprite program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createProjectionProgram(gl) {
  const vertexSource = `#version 300 es
in vec2 a_position;
uniform vec2 u_resolution;
uniform vec3 u_camera;
uniform vec4 u_rect;
out vec2 v_world;

void main() {
  v_world = u_rect.xy + a_position * u_rect.zw;
  vec2 screen = (v_world - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

  const fragmentSource = `#version 300 es
precision highp float;

in vec2 v_world;
out vec4 out_color;

void main() {
  float diagonal = mod(v_world.x + v_world.y, 64.0);
  float stripe = step(diagonal, 32.0);
  vec3 base = vec3(0.032, 0.032, 0.030);
  vec3 mark = vec3(0.230, 0.230, 0.214);
  out_color = vec4(mix(base, mark, stripe * 0.42), 1.0);
}
`;

  const program = assertGl(gl.createProgram(), 'projection program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown projection program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
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

function createVertexBuffer(gl, segment) {
  const { x, y, width, height } = segment.position;
  const vertices = new Float32Array([
    x, y, 0, 0,
    x + width, y, 1, 0,
    x, y + height, 0, 1,
    x, y + height, 0, 1,
    x + width, y, 1, 0,
    x + width, y + height, 1, 1
  ]);
  const buffer = assertGl(gl.createBuffer(), 'vertex buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}

function createUnitQuadBuffer(gl) {
  const vertices = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
  ]);
  const buffer = assertGl(gl.createBuffer(), 'unit quad buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}

function resizeCanvas(gl, canvas) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
  return dpr;
}

function loadDataUrl(manifestUrl, dataFile) {
  const manifest = new URL(manifestUrl, window.location.href);
  const dataUrl = new URL(dataFile, manifest);
  dataUrl.search = manifest.search;
  return dataUrl.toString();
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

function pushSprite(vertices, actor, actorClass, frame, chrSet, displayOffset = { x: 0, y: 0 }) {
  const spriteHeight = actorClass.largeSprites ? 16 : 8;
  const staticOffset = frame.staticPreviewOffset || { x: 0, y: 0 };
  for (const sprite of frame.sprites || []) {
    const tile = numericByte(sprite.tile);
    const palette = Number.isFinite(sprite.palette) ? sprite.palette : numericByte(sprite.attr) & 0x03;
    const x = actor.worldX + displayOffset.x + staticOffset.x + sprite.xOffset;
    const y = actor.worldY + displayOffset.y + staticOffset.y + sprite.yOffset;

    if (!actorClass.largeSprites) {
      pushSpriteQuad(
        vertices,
        x,
        y,
        tile,
        palette,
        sprite.flipHorizontal,
        sprite.flipVertical,
        chrSet
      );
      continue;
    }

    const tableOffset = (tile & 0x01) ? 256 : 0;
    const baseTile = tableOffset + (tile & 0xfe);
    const topTile = sprite.flipVertical ? baseTile + 1 : baseTile;
    const bottomTile = sprite.flipVertical ? baseTile : baseTile + 1;
    pushSpriteQuad(
      vertices,
      x,
      y,
      topTile,
      palette,
      sprite.flipHorizontal,
      sprite.flipVertical,
      chrSet
    );
    pushSpriteQuad(
      vertices,
      x,
      y + spriteHeight / 2,
      bottomTile,
      palette,
      sprite.flipHorizontal,
      sprite.flipVertical,
      chrSet
    );
  }
}

class ActorRenderer {
  constructor(gl) {
    this.gl = gl;
    this.program = createSpriteProgram(gl);
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      uv: gl.getAttribLocation(this.program, 'a_uv'),
      palette: gl.getAttribLocation(this.program, 'a_palette'),
      resolution: assertGl(gl.getUniformLocation(this.program, 'u_resolution'), 'sprite u_resolution'),
      camera: assertGl(gl.getUniformLocation(this.program, 'u_camera'), 'sprite u_camera'),
      chr: assertGl(gl.getUniformLocation(this.program, 'u_chr'), 'sprite u_chr'),
      paletteTexture: assertGl(gl.getUniformLocation(this.program, 'u_palette'), 'sprite u_palette')
    };
    this.buffer = assertGl(gl.createBuffer(), 'sprite vertex buffer');
    this.manifest = null;
    this.chrTextures = new Map();
    this.spritePaletteTextures = new Map();
    this.actorClassById = new Map();
    this.chrSetById = new Map();
  }

  prepare(manifest, chrTextures, spritePaletteTextures) {
    this.manifest = manifest;
    this.chrTextures = chrTextures;
    this.spritePaletteTextures = spritePaletteTextures;
    this.actorClassById = new Map((manifest.actorClasses || []).map((actorClass) => [actorClass.id, actorClass]));
    this.chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
  }

  render(camera, variant, shouldRenderActor, displayOffsetForSegment = () => ({ x: 0, y: 0 })) {
    const actors = this.manifest?.actors || [];
    if (actors.length === 0) {
      return;
    }

    const batches = new Map();
    const frameIndex = Math.floor(performance.now() / 360);
    for (const actor of actors) {
      if (!actor.classId || !shouldRenderActor(actor)) {
        continue;
      }
      const actorClass = this.actorClassById.get(actor.classId);
      if (!actorClass || actorClass.frames.length === 0) {
        continue;
      }
      const paletteId = actor.paletteByVariant?.[variant]
        || actor.paletteByVariant?.day
        || actor.paletteByVariant?.night;
      const paletteTexture = this.spritePaletteTextures.get(paletteId);
      const chrTexture = this.chrTextures.get(actorClass.chrSet);
      const chrSet = this.chrSetById.get(actorClass.chrSet);
      if (!paletteTexture || !chrTexture || !chrSet) {
        continue;
      }

      const key = `${actorClass.chrSet}\0${paletteId}`;
      if (!batches.has(key)) {
        batches.set(key, {
          vertices: [],
          chrTexture,
          paletteTexture
        });
      }
      const frame = actorClass.frames[frameIndex % actorClass.frames.length];
      pushSprite(
        batches.get(key).vertices,
        actor,
        actorClass,
        frame,
        chrSet,
        displayOffsetForSegment(actor.segmentId)
      );
    }

    if (batches.size === 0) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(this.locations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(this.locations.camera, camera.x, camera.y, camera.scale);
    gl.uniform1i(this.locations.chr, 0);
    gl.uniform1i(this.locations.paletteTexture, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(this.locations.uv);
    gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 20, 8);
    gl.enableVertexAttribArray(this.locations.palette);
    gl.vertexAttribPointer(this.locations.palette, 1, gl.FLOAT, false, 20, 16);

    for (const batch of batches.values()) {
      const data = new Float32Array(batch.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, batch.chrTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, batch.paletteTexture);
      gl.drawArrays(gl.TRIANGLES, 0, data.length / 5);
    }
  }
}

class TileRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = assertGl(canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false
    }), 'WebGL2 context');
    this.program = createProgram(this.gl);
    this.projectionProgram = createProjectionProgram(this.gl);
    this.locations = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      uv: this.gl.getAttribLocation(this.program, 'a_uv'),
      resolution: assertGl(this.gl.getUniformLocation(this.program, 'u_resolution'), 'u_resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.program, 'u_camera'), 'u_camera'),
      segmentOffset: assertGl(this.gl.getUniformLocation(this.program, 'u_segment_offset'), 'u_segment_offset'),
      segmentSize: assertGl(this.gl.getUniformLocation(this.program, 'u_segment_size'), 'u_segment_size'),
      tilemap: assertGl(this.gl.getUniformLocation(this.program, 'u_tilemap'), 'u_tilemap'),
      chr: assertGl(this.gl.getUniformLocation(this.program, 'u_chr'), 'u_chr'),
      palette: assertGl(this.gl.getUniformLocation(this.program, 'u_palette'), 'u_palette')
    };
    this.projectionLocations = {
      position: this.gl.getAttribLocation(this.projectionProgram, 'a_position'),
      resolution: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_resolution'), 'projection u_resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_camera'), 'projection u_camera'),
      rect: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_rect'), 'projection u_rect')
    };
    this.projectionVertexBuffer = createUnitQuadBuffer(this.gl);
    this.manifest = null;
    this.segments = [];
    this.segmentById = new Map();
    this.segmentDisplayOffsets = new Map();
    this.projectionRects = [];
    this.actorClassById = new Map();
    this.chrTextures = new Map();
    this.decodedChrAtlases = new Map();
    this.spritePaletteTextures = new Map();
    this.actorRenderer = new ActorRenderer(this.gl);
    this.camera = { x: 0, y: 0, scale: 1 };
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
    const chrTextures = new Map();
    const chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
    const tileSetById = new Map((manifest.tileSets || []).map((tileSet) => [tileSet.id, tileSet]));
    const paletteById = new Map((manifest.palettes || []).map((palette) => [palette.id, palette]));
    const spritePaletteTextures = new Map();

    for (const chrSet of manifest.chrSets || []) {
      const decoded = decode_chr_atlas(rangeView(data, chrSet.data));
      this.decodedChrAtlases.set(chrSet.id, {
        width: chrSet.decodedAtlas.width,
        height: chrSet.decodedAtlas.height,
        tilesPerRow: chrSet.decodedAtlas.tilesPerRow,
        pixels: decoded
      });
      chrTextures.set(chrSet.id, createTexture(
        gl,
        chrSet.decodedAtlas.width,
        chrSet.decodedAtlas.height,
        gl.R8,
        gl.RED,
        decoded
      ));
    }

    for (const palette of manifest.spritePalettes || []) {
      spritePaletteTextures.set(palette.id, paletteTexture(gl, rangeView(data, palette.data)));
    }

    this.manifest = manifest;
    this.chrTextures = chrTextures;
    this.spritePaletteTextures = spritePaletteTextures;
    this.actorClassById = new Map((manifest.actorClasses || []).map((actorClass) => [actorClass.id, actorClass]));
    this.segments = (manifest.segments || []).map((record) => {
      const tileSet = tileSetById.get(record.tileSet);
      const chrSet = chrSetById.get(record.chrSet);
      if (!tileSet || !chrSet) {
        throw new Error(`Segment ${record.id} has incomplete texture references.`);
      }
      const tilemap = expand_segment_tilemap(
        rangeView(data, record.layoutBlocks),
        rangeView(data, tileSet.metatileTiles),
        rangeView(data, tileSet.metatileAttributes),
        record.blockWidth,
        record.blockHeight
      );
      const paletteTextures = {};
      for (const [variant, paletteId] of Object.entries(record.palettes || {})) {
        const palette = paletteById.get(paletteId);
        if (!palette) {
          throw new Error(`Segment ${record.id} is missing palette ${paletteId}.`);
        }
        paletteTextures[variant] = paletteTexture(gl, rangeView(data, palette.data));
      }
      const renderSegment = {
        record,
        vertexBuffer: createVertexBuffer(gl, record),
        tilemapTexture: createTexture(gl, record.tileWidth, record.tileHeight, gl.RGBA8, gl.RGBA, tilemap),
        chrTexture: assertGl(chrTextures.get(chrSet.id) || null, `CHR texture ${chrSet.id}`),
        paletteTextures
      };
      this.segmentById.set(record.id, record);
      return renderSegment;
    });
    this.actorRenderer.prepare(manifest, chrTextures, spritePaletteTextures);
  }

  resetCamera(padding = 0.88) {
    if (!this.manifest) return;
    resizeCanvas(this.gl, this.canvas);
    this.camera.x = this.manifest.world.width / 2;
    this.camera.y = this.manifest.world.height / 2;
    this.camera.scale = Math.min(
      this.canvas.width / this.manifest.world.width,
      this.canvas.height / this.manifest.world.height
    ) * padding;
    this.camera.scale = Math.max(MIN_CAMERA_SCALE, this.camera.scale);
  }

  zoomAt(screenX, screenY, nextScale) {
    const beforeX = this.camera.x + (screenX - this.canvas.width / 2) / this.camera.scale;
    const beforeY = this.camera.y + (screenY - this.canvas.height / 2) / this.camera.scale;
    this.camera.scale = Math.max(MIN_CAMERA_SCALE, Math.min(26, nextScale));
    this.camera.x = beforeX - (screenX - this.canvas.width / 2) / this.camera.scale;
    this.camera.y = beforeY - (screenY - this.canvas.height / 2) / this.camera.scale;
  }

  render(variant, shouldRenderSegment = () => true) {
    if (!this.manifest) return;
    const gl = this.gl;
    resizeCanvas(gl, this.canvas);
    gl.disable(gl.BLEND);
    gl.clearColor(0.015, 0.015, 0.014, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.renderProjectionRects();
    gl.useProgram(this.program);
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(this.locations.camera, this.camera.x, this.camera.y, this.camera.scale);
    gl.uniform1i(this.locations.tilemap, 0);
    gl.uniform1i(this.locations.chr, 1);
    gl.uniform1i(this.locations.palette, 2);

    for (const segment of this.segments) {
      if (!shouldRenderSegment(segment.record)) {
        continue;
      }
      const preferredVariant = segment.paletteTextures[variant]
        ? variant
        : segment.record.defaultVariant || Object.keys(segment.paletteTextures)[0];
      const palette = segment.paletteTextures[preferredVariant];
      if (!palette) continue;

      gl.bindBuffer(gl.ARRAY_BUFFER, segment.vertexBuffer);
      gl.enableVertexAttribArray(this.locations.position);
      gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(this.locations.uv);
      gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 16, 8);
      gl.uniform2f(this.locations.segmentSize, segment.record.position.width, segment.record.position.height);
      const displayOffset = this.displayOffsetForSegment(segment.record.id);
      gl.uniform2f(this.locations.segmentOffset, displayOffset.x, displayOffset.y);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, segment.tilemapTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, segment.chrTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, palette);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  renderProjectionRects() {
    if (!this.projectionRects.length) {
      return;
    }
    const gl = this.gl;
    gl.useProgram(this.projectionProgram);
    gl.uniform2f(this.projectionLocations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(this.projectionLocations.camera, this.camera.x, this.camera.y, this.camera.scale);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.projectionVertexBuffer);
    gl.enableVertexAttribArray(this.projectionLocations.position);
    gl.vertexAttribPointer(this.projectionLocations.position, 2, gl.FLOAT, false, 8, 0);

    for (const rect of this.projectionRects) {
      if (rect.width <= 0 || rect.height <= 0) {
        continue;
      }
      gl.uniform4f(this.projectionLocations.rect, rect.x, rect.y, rect.width, rect.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  displayOffsetForSegment(segmentId) {
    return this.segmentDisplayOffsets.get(segmentId) || { x: 0, y: 0 };
  }
}

const state = {
  variant: 'day',
  labels: true,
  sectionOutlines: false,
  highlightDoors: true,
  showCharacters: true,
  showSecrets: true,
  highlightCharacters: true,
  highlightMapObjects: true,
  highlightSecrets: true,
  portalOpen: false
};

let mapRenderer;
let sceneRenderer;
let dialogRenderer;
let labelRenderer;
let activeGuideModel = null;
let activeInspectorModel = null;
let portalReturnFocus = null;
let labels = [];
let sectionOutlines = [];
let hotspots = [];
let destructibleHotspots = [];
let actorHotspots = [];
let labelLeaderSvg;
const overlayActionByElement = new WeakMap();
const floatingProjection = {
  currentX: null,
  lastFrameMs: null,
  side: null,
  targetX: null
};
const panInertia = {
  active: false,
  lastFrameMs: null,
  vx: 0,
  vy: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function visibleBounds(segmentIds) {
  const segments = segmentIds
    .map((segmentId) => mapRenderer.segmentById.get(segmentId))
    .filter(Boolean);
  if (segments.length === 0) {
    return undefined;
  }
  const minX = Math.min(...segments.map((segment) => segment.position.x));
  const minY = Math.min(...segments.map((segment) => segment.position.y));
  const maxX = Math.max(...segments.map((segment) => segment.position.x + segment.position.width));
  const maxY = Math.max(...segments.map((segment) => segment.position.y + segment.position.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function focusBounds(bounds, padding = 0.84) {
  if (!bounds) return;
  resizeCanvas(mapRenderer.gl, mapRenderer.canvas);
  const safeWidth = Math.max(1, bounds.width);
  const safeHeight = Math.max(1, bounds.height);
  mapRenderer.camera.x = bounds.x + bounds.width / 2;
  mapRenderer.camera.y = bounds.y + bounds.height / 2;
  mapRenderer.camera.scale = Math.min(
    mapRenderer.canvas.width / safeWidth,
    mapRenderer.canvas.height / safeHeight
  ) * padding;
  mapRenderer.camera.scale = Math.max(MIN_CAMERA_SCALE, Math.min(12, mapRenderer.camera.scale));
}

function compactViewport() {
  return window.innerWidth <= 760;
}

function focusVisibleRoute() {
  stopPanInertia();
  const openingBounds = visibleBounds(ROUTE_SEGMENT_IDS);
  focusBounds(openingBounds, compactViewport() ? 0.78 : 0.88);
  clampGuideCamera();
}

function clampGuideCamera() {
  if (!mapRenderer?.manifest) return;
  const bounds = visibleBounds(ROUTE_SEGMENT_IDS) || {
    x: 0,
    y: 0,
    width: mapRenderer.manifest.world.width,
    height: mapRenderer.manifest.world.height
  };
  resizeCanvas(mapRenderer.gl, mapRenderer.canvas);
  const safeScale = Math.max(0.0001, mapRenderer.camera.scale);
  const viewWidth = mapRenderer.canvas.width / safeScale;
  const viewHeight = mapRenderer.canvas.height / safeScale;
  const marginX = Math.max(viewWidth * 0.42, bounds.width * 0.08);
  const marginY = Math.max(viewHeight * 0.42, bounds.height * 0.24);
  mapRenderer.camera.x = clamp(
    mapRenderer.camera.x,
    bounds.x - marginX,
    bounds.x + bounds.width + marginX
  );
  mapRenderer.camera.y = clamp(
    mapRenderer.camera.y,
    bounds.y - marginY,
    bounds.y + bounds.height + marginY
  );
}

function stopPanInertia() {
  panInertia.active = false;
  panInertia.lastFrameMs = null;
  panInertia.vx = 0;
  panInertia.vy = 0;
}

function startPanInertia(vx, vy) {
  const speed = Math.hypot(vx, vy);
  if (speed < PAN_INERTIA_STOP_SPEED) {
    stopPanInertia();
    return;
  }

  const speedScale = Math.min(speed, PAN_INERTIA_MAX_SPEED) / speed;
  panInertia.active = true;
  panInertia.lastFrameMs = null;
  panInertia.vx = vx * speedScale;
  panInertia.vy = vy * speedScale;
}

function applyPanInertia(now = performance.now()) {
  if (!panInertia.active || !mapRenderer) {
    return;
  }

  if (panInertia.lastFrameMs === null) {
    panInertia.lastFrameMs = now;
    return;
  }

  const dt = Math.min(48, Math.max(0, now - panInertia.lastFrameMs));
  panInertia.lastFrameMs = now;
  if (dt <= 0) {
    return;
  }

  const expectedX = mapRenderer.camera.x + panInertia.vx * dt;
  const expectedY = mapRenderer.camera.y + panInertia.vy * dt;
  mapRenderer.camera.x = expectedX;
  mapRenderer.camera.y = expectedY;
  clampGuideCamera();

  if (Math.abs(mapRenderer.camera.x - expectedX) > 0.001) {
    panInertia.vx = 0;
  }
  if (Math.abs(mapRenderer.camera.y - expectedY) > 0.001) {
    panInertia.vy = 0;
  }

  const decay = Math.exp((-PAN_INERTIA_DECAY_PER_SECOND * dt) / 1000);
  panInertia.vx *= decay;
  panInertia.vy *= decay;

  if (Math.hypot(panInertia.vx, panInertia.vy) < PAN_INERTIA_STOP_SPEED) {
    stopPanInertia();
  }
}

function worldToScreen(renderer, x, y) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  return {
    x: ((x - renderer.camera.x) * renderer.camera.scale + renderer.canvas.width / 2) / dpr,
    y: ((y - renderer.camera.y) * renderer.camera.scale + renderer.canvas.height / 2) / dpr
  };
}

function worldRectToScreen(renderer, rect) {
  const start = worldToScreen(renderer, rect.x, rect.y);
  const end = worldToScreen(renderer, rect.x + rect.width, rect.y + rect.height);
  return {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

function anchorWorldRect(model) {
  if (!model) {
    return null;
  }
  return typeof model.anchorWorldRect === 'function'
    ? model.anchorWorldRect()
    : model.anchorWorldRect || null;
}

function panelPlacementOptions(anchorRect, panelRect, margin, safeTop) {
  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;
  return [
    {
      name: 'above',
      left: centerX - panelRect.width / 2,
      top: anchorRect.top - panelRect.height - 10
    },
    {
      name: 'below',
      left: centerX - panelRect.width / 2,
      top: anchorRect.top + anchorRect.height + 10
    },
    {
      name: 'right',
      left: anchorRect.left + anchorRect.width + 10,
      top: centerY - panelRect.height / 2
    },
    {
      name: 'left',
      left: anchorRect.left - panelRect.width - 10,
      top: centerY - panelRect.height / 2
    }
  ].map((option) => ({
    ...option,
    fits: option.left >= margin
      && option.left + panelRect.width <= window.innerWidth - margin
      && option.top >= safeTop
      && option.top + panelRect.height <= window.innerHeight - margin
  }));
}

function placeAnchoredPanel(panel, model, preferred = 'above') {
  const worldRect = anchorWorldRect(model);
  if (!worldRect || panel.hidden) {
    return;
  }
  const anchorRect = worldRectToScreen(mapRenderer, worldRect);
  const panelRect = panel.getBoundingClientRect();
  if (panelRect.width <= 0 || panelRect.height <= 0) {
    return;
  }

  const margin = compactViewport() ? 8 : 14;
  const safeTop = compactViewport() ? 66 : 76;
  const placements = panelPlacementOptions(anchorRect, panelRect, margin, safeTop);
  const placement = placements.find((item) => item.name === preferred && item.fits)
    || placements.find((item) => item.fits)
    || placements.find((item) => item.name === preferred)
    || placements[0];

  const left = clamp(placement.left, margin, Math.max(margin, window.innerWidth - panelRect.width - margin));
  const top = clamp(placement.top, safeTop, Math.max(safeTop, window.innerHeight - panelRect.height - margin));
  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;
}

function dialogScaleForMap() {
  if (!mapRenderer?.canvas) {
    return compactViewport() ? 1.25 : 1;
  }
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const mapCssScale = mapRenderer.camera.scale / dpr;
  const snapped = Math.round(mapCssScale * 2) / 2;
  return clamp(snapped, compactViewport() ? 1.25 : 1, compactViewport() ? 2 : 2);
}

function visibleWorldRect(renderer) {
  const safeScale = Math.max(0.0001, renderer.camera.scale);
  return {
    x: renderer.camera.x - renderer.canvas.width / (2 * safeScale),
    y: renderer.camera.y - renderer.canvas.height / (2 * safeScale),
    width: renderer.canvas.width / safeScale,
    height: renderer.canvas.height / safeScale
  };
}

function segmentDisplayOffset(segmentId) {
  return mapRenderer?.displayOffsetForSegment(segmentId) || { x: 0, y: 0 };
}

function segmentDisplayPosition(segment) {
  const offset = segmentDisplayOffset(segment.id);
  return {
    x: segment.position.x + offset.x,
    y: segment.position.y + offset.y,
    width: segment.position.width,
    height: segment.position.height
  };
}

function updateFloatingProjection() {
  if (!mapRenderer?.manifest) return;
  resizeCanvas(mapRenderer.gl, mapRenderer.canvas);
  mapRenderer.projectionRects = [];

  const floating = mapRenderer.segmentById.get(FLOATING_VEROS_SEGMENT_ID);
  const left = mapRenderer.segmentById.get(FLOATING_VEROS_LEFT_SEGMENT_ID);
  const right = mapRenderer.segmentById.get(FLOATING_VEROS_RIGHT_SEGMENT_ID);
  if (!floating || !left || !right) {
    return;
  }

  const corridorLeft = left.position.x + left.position.width;
  const corridorRight = right.position.x;
  mapRenderer.projectionRects = [{
    x: corridorLeft,
    y: floating.position.y,
    width: corridorRight - corridorLeft,
    height: floating.position.height
  }];

  const minX = corridorLeft;
  const maxX = corridorRight - floating.position.width;
  if (maxX < minX) {
    mapRenderer.projectionRects = [];
    mapRenderer.segmentDisplayOffsets.delete(floating.id);
    floatingProjection.currentX = null;
    floatingProjection.lastFrameMs = null;
    floatingProjection.side = null;
    floatingProjection.targetX = null;
    return;
  }

  const corridorMidpoint = (corridorLeft + corridorRight) / 2;
  let targetSide = floatingProjection.side
    || (mapRenderer.camera.x >= corridorMidpoint ? 'right' : 'left');
  if (mapRenderer.camera.x > corridorMidpoint + FLOATING_VEROS_SIDE_HYSTERESIS) {
    targetSide = 'right';
  } else if (mapRenderer.camera.x < corridorMidpoint - FLOATING_VEROS_SIDE_HYSTERESIS) {
    targetSide = 'left';
  }

  const targetX = targetSide === 'right' ? maxX : minX;
  const now = performance.now();
  if (floatingProjection.currentX === null || floatingProjection.targetX === null) {
    floatingProjection.currentX = targetX;
  } else {
    const lastFrameMs = floatingProjection.lastFrameMs ?? now;
    const elapsedMs = clamp(now - lastFrameMs, 0, FLOATING_VEROS_FRAME_MS);
    const blend = 1 - Math.exp(-elapsedMs / FLOATING_VEROS_EASE_MS);
    floatingProjection.currentX += (targetX - floatingProjection.currentX) * blend;
    if (Math.abs(targetX - floatingProjection.currentX) < FLOATING_VEROS_SNAP_EPSILON) {
      floatingProjection.currentX = targetX;
    }
  }
  floatingProjection.lastFrameMs = now;
  floatingProjection.side = targetSide;
  floatingProjection.targetX = targetX;

  const displayX = clamp(floatingProjection.currentX, minX, maxX);
  const displayY = floating.position.y;

  mapRenderer.segmentDisplayOffsets.set(floating.id, {
    x: displayX - floating.position.x,
    y: displayY - floating.position.y
  });
}

function hotspotWorldRect(hotspot) {
  if (!hotspot.tileRect) {
    return hotspot;
  }
  const segment = mapRenderer.segmentById.get(hotspot.segmentId);
  if (!segment) {
    return null;
  }
  const tileSize = segment.tileSize || 8;
  const position = segmentDisplayPosition(segment);
  return {
    x: position.x + hotspot.tileRect.x * tileSize,
    y: position.y + hotspot.tileRect.y * tileSize,
    width: hotspot.tileRect.width * tileSize,
    height: hotspot.tileRect.height * tileSize
  };
}

function destructibleFixtureWorldRect(fixture) {
  const segment = mapRenderer.segmentById.get(fixture.segmentId);
  if (!segment) {
    return null;
  }
  const tileSize = segment.tileSize || 8;
  const position = segmentDisplayPosition(segment);
  return {
    x: position.x + fixture.tileRect.x * tileSize,
    y: position.y + fixture.tileRect.y * tileSize,
    width: fixture.tileRect.width * tileSize,
    height: fixture.tileRect.height * tileSize
  };
}

function actorClassFor(actor) {
  return actor.classId ? mapRenderer.actorClassById.get(actor.classId) : null;
}

function actorWorldRect(actor) {
  if (actor.visualTileRect) {
    const segment = mapRenderer.segmentById.get(actor.segmentId);
    if (segment) {
      const tileSize = segment.tileSize || 8;
      const position = segmentDisplayPosition(segment);
      return {
        x: position.x + actor.visualTileRect.x * tileSize,
        y: position.y + actor.visualTileRect.y * tileSize,
        width: actor.visualTileRect.width * tileSize,
        height: actor.visualTileRect.height * tileSize
      };
    }
  }

  const actorClass = actorClassFor(actor);
  const bounds = actorClass?.previewOpaqueBounds || actorClass?.opaqueBounds || actorClass?.bounds;
  const offset = segmentDisplayOffset(actor.segmentId);
  if (bounds) {
    return {
      x: actor.worldX + offset.x + bounds.minX,
      y: actor.worldY + offset.y + bounds.minY,
      width: bounds.width,
      height: bounds.height
    };
  }

  return {
    x: actor.worldX + offset.x - 8,
    y: actor.worldY + offset.y - 20,
    width: 16,
    height: 28
  };
}

function actorMatchesVariant(actor) {
  return (actor.variants || ['day', 'night']).includes(state.variant);
}

function actorIsMapObject(actor) {
  return actor.kind === 'fixture';
}

function actorIsSecret(actor) {
  return actor.kind === 'secret';
}

function actorLayerVisible(actor) {
  return actorIsMapObject(actor) || actorIsSecret(actor) || state.showCharacters;
}

function actorHighlightVisible(actor) {
  if (actorIsMapObject(actor)) {
    return state.highlightMapObjects;
  }
  if (actorIsSecret(actor)) {
    return state.highlightSecrets;
  }
  return state.highlightCharacters;
}

function shouldRenderActor(actor) {
  return Boolean(actor.classId)
    && actorMatchesVariant(actor)
    && actorLayerVisible(actor)
    && (!actorIsSecret(actor) || state.showSecrets);
}

function shouldShowActorHotspot(actor) {
  return actorMatchesVariant(actor)
    && actorLayerVisible(actor);
}

function makeElement(className, tag = 'div') {
  const element = document.createElement(tag);
  element.className = className;
  dom.overlay.append(element);
  return element;
}

function makeSvgElement(tagName, className) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  if (className) {
    element.setAttribute('class', className);
  }
  return element;
}

function cssPixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function overlayElements() {
  return [
    ...hotspots.map((item) => item.element),
    ...destructibleHotspots.map((item) => item.element),
    ...actorHotspots.map((item) => item.element)
  ].filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function visualRectForOverlay(element) {
  const hitRect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const x = cssPixelValue(style.getPropertyValue('--hotspot-x'));
  const y = cssPixelValue(style.getPropertyValue('--hotspot-y'));
  const width = cssPixelValue(style.getPropertyValue('--hotspot-width'), hitRect.width);
  const height = cssPixelValue(style.getPropertyValue('--hotspot-height'), hitRect.height);
  return {
    left: hitRect.left + x,
    top: hitRect.top + y,
    right: hitRect.left + x + width,
    bottom: hitRect.top + y + height,
    width,
    height
  };
}

function containsPoint(rect, x, y) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function distanceToRect(rect, x, y) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

function overlayPriority(element) {
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-npc')) {
    return 50;
  }
  if (element.classList.contains('hotspot') && element.classList.contains('is-clickable')) {
    return 40;
  }
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-secret')) {
    return 32;
  }
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-fixture')) {
    return 30;
  }
  if (element.classList.contains('destructible-hotspot')) {
    return 24;
  }
  return 10;
}

function resolveOverlayClickTarget(event, fallback) {
  if (event.detail === 0 || (event.clientX === 0 && event.clientY === 0)) {
    return fallback;
  }

  const candidates = overlayElements().map((element) => ({
    element,
    rect: visualRectForOverlay(element),
    priority: overlayPriority(element)
  }));
  const visualHits = candidates.filter((candidate) => containsPoint(candidate.rect, event.clientX, event.clientY));
  if (visualHits.length > 0) {
    visualHits.sort((a, b) => b.priority - a.priority || (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height));
    return visualHits[0].element;
  }

  const hitRect = fallback.getBoundingClientRect();
  if (!containsPoint(hitRect, event.clientX, event.clientY)) {
    return fallback;
  }

  candidates.sort((a, b) => (
    distanceToRect(a.rect, event.clientX, event.clientY) - distanceToRect(b.rect, event.clientX, event.clientY)
    || b.priority - a.priority
  ));
  return candidates[0]?.element || fallback;
}

function addGuardedClick(element, handler) {
  overlayActionByElement.set(element, handler);
  let startX = 0;
  let startY = 0;
  let moved = false;
  element.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
  });
  element.addEventListener('pointermove', (event) => {
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 8) {
      moved = true;
    }
  });
  element.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const target = resolveOverlayClickTarget(event, element);
    const action = overlayActionByElement.get(target) || handler;
    action(event);
  });
}

function buildOverlays() {
  dom.overlay.replaceChildren();
  labels = [];
  sectionOutlines = [];
  hotspots = [];
  destructibleHotspots = [];
  actorHotspots = [];
  labelLeaderSvg = makeSvgElement('svg', 'label-leaders');
  dom.overlay.append(labelLeaderSvg);

  for (const segment of mapRenderer.segments) {
    const element = makeElement('segment-outline');
    element.setAttribute('aria-hidden', 'true');
    element.hidden = !state.sectionOutlines;
    sectionOutlines.push({ element, segment: segment.record });
  }

  for (let index = 0; index < ROUTE_SEGMENT_IDS.length; index += 1) {
    const segmentId = ROUTE_SEGMENT_IDS[index];
    const segment = mapRenderer.segmentById.get(segmentId);
    if (!segment) continue;
    const label = makeElement('label-chip');
    const frame = document.createElement('canvas');
    const text = document.createElement('span');
    const leader = makeSvgElement('line', 'label-leader-line');
    frame.className = 'label-frame-canvas';
    text.className = 'label-chip-text';
    frame.setAttribute('aria-hidden', 'true');
    label.append(frame, text);
    labelLeaderSvg.append(leader);
    labels.push({ element: label, canvas: frame, textElement: text, leader, segment, index });

  }

  for (const hotspot of HOTSPOTS) {
    const element = makeElement(`hotspot is-${hotspot.type}`, 'button');
    element.type = 'button';
    element.title = hotspot.label;
    element.setAttribute('aria-label', hotspot.label);
    if (hotspot.opens) {
      element.classList.add('is-clickable');
      addGuardedClick(element, () => openPortal());
    } else {
      addGuardedClick(element, () => showGuideInspector({
        title: hotspot.label,
        summary: hotspot.note,
        anchorWorldRect: () => hotspotWorldRect(hotspot),
        details: [{ label: 'Relationship', value: 'Guide-authored door link for this proof slice.' }]
      }));
    }
    hotspots.push({ element, hotspot });
  }

  for (const fixture of mapRenderer.manifest.destructibleFixtures || []) {
    if (fixture.role === 'secret-reward') {
      continue;
    }
    const element = makeElement('destructible-hotspot', 'button');
    element.type = 'button';
    element.title = fixture.label;
    element.setAttribute('aria-label', fixture.label);
    addGuardedClick(element, () => showDestructibleFixtureCard(fixture));
    destructibleHotspots.push({ element, fixture });
  }

  for (const actor of mapRenderer.manifest.actors || []) {
    const element = makeElement(`actor-hotspot is-${actor.kind}`, 'button');
    element.type = 'button';
    element.title = actor.label;
    element.setAttribute('aria-label', actor.label);
    addGuardedClick(element, () => showActorCard(actor));
    actorHotspots.push({ element, actor });
  }
}

function setHitRect(element, rect) {
  const hitWidth = Math.max(44, rect.width);
  const hitHeight = Math.max(44, rect.height);
  const left = rect.left + rect.width / 2 - hitWidth / 2;
  const top = rect.top + rect.height / 2 - hitHeight / 2;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.width = `${hitWidth}px`;
  element.style.height = `${hitHeight}px`;
  element.style.setProperty('--hotspot-x', `${(hitWidth - rect.width) / 2}px`);
  element.style.setProperty('--hotspot-y', `${(hitHeight - rect.height) / 2}px`);
  element.style.setProperty('--hotspot-width', `${rect.width}px`);
  element.style.setProperty('--hotspot-height', `${rect.height}px`);
}

function paddedRect(rect, padding) {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding
  };
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function labelSide(segment) {
  return LABEL_BELOW_SEGMENT_IDS.has(segment.id) ? 'below' : 'above';
}

function labelPlacement(segment) {
  const position = segmentDisplayPosition(segment);
  const side = labelSide(segment);
  const centerX = position.x + position.width / 2;
  const mapY = side === 'above' ? position.y : position.y + position.height;
  const labelY = side === 'above'
    ? position.y - LABEL_MAP_GAP
    : position.y + position.height + LABEL_MAP_GAP;
  return {
    side,
    labelAnchor: worldToScreen(mapRenderer, centerX, labelY),
    mapAnchor: worldToScreen(mapRenderer, centerX, mapY)
  };
}

function labelTransform(side, offsetY = 0) {
  const base = side === 'above' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
  return `${base} translateY(${offsetY}px)`;
}

function guideLabelText(label) {
  return String(label)
    .replace(/\s+-\s+Door$/i, '')
    .replace(/\s+-\s+Part\s+(\d+)$/i, ' $1');
}

function shiftedRect(rect, offsetY) {
  return {
    left: rect.left,
    top: rect.top + offsetY,
    right: rect.right,
    bottom: rect.bottom + offsetY
  };
}

function updateLabelLeader(item) {
  const line = item.leader;
  if (!line) return;
  if (item.element.hidden || Math.abs(item.offsetY || 0) < LABEL_LEADER_THRESHOLD) {
    line.setAttribute('visibility', 'hidden');
    return;
  }

  const rect = item.element.getBoundingClientRect();
  const edgeY = item.side === 'above' ? rect.bottom : rect.top;
  line.setAttribute('x1', `${rect.left + rect.width / 2}`);
  line.setAttribute('y1', `${edgeY}`);
  line.setAttribute('x2', `${item.mapAnchor.x}`);
  line.setAttribute('y2', `${item.mapAnchor.y}`);
  line.setAttribute('visibility', 'visible');
}

function separateOverlappingLabels() {
  const accepted = [];
  const visibleLabels = labels
    .filter((item) => !item.element.hidden)
    .sort((a, b) => (
      a.labelAnchor.y - b.labelAnchor.y
      || a.labelAnchor.x - b.labelAnchor.x
      || a.index - b.index
    ));

  for (const item of visibleLabels) {
    let offsetY = 0;
    const direction = item.side === 'above' ? -1 : 1;
    let rect = paddedRect(item.element.getBoundingClientRect(), LABEL_COLLISION_PADDING);

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const overlap = accepted.find((acceptedRect) => rectsOverlap(rect, acceptedRect));
      if (!overlap) break;
      const nextOffset = direction < 0
        ? overlap.top - rect.bottom - LABEL_COLLISION_PADDING
        : overlap.bottom - rect.top + LABEL_COLLISION_PADDING;
      offsetY += nextOffset || direction * (LABEL_COLLISION_PADDING + 1);
      rect = shiftedRect(rect, nextOffset || direction * (LABEL_COLLISION_PADDING + 1));
    }

    item.offsetY = Math.round(offsetY);
    item.element.style.transform = labelTransform(item.side, item.offsetY);
    accepted.push(paddedRect(item.element.getBoundingClientRect(), LABEL_COLLISION_PADDING));
  }

  for (const item of labels) {
    updateLabelLeader(item);
  }
}

function updateOverlays() {
  if (!mapRenderer?.manifest) return;

  for (const item of sectionOutlines) {
    item.element.hidden = !state.sectionOutlines;
    if (!state.sectionOutlines) {
      continue;
    }
    const rect = worldRectToScreen(mapRenderer, segmentDisplayPosition(item.segment));
    item.element.style.left = `${Math.round(rect.left)}px`;
    item.element.style.top = `${Math.round(rect.top)}px`;
    item.element.style.width = `${Math.max(0, Math.round(rect.width))}px`;
    item.element.style.height = `${Math.max(0, Math.round(rect.height))}px`;
  }

  const overviewLabels = mapRenderer.camera.scale < OVERVIEW_LABEL_SCALE;

  for (const item of labels) {
    const hiddenInOverview = overviewLabels && OVERVIEW_LABEL_HIDDEN_IDS.has(item.segment.id);
    item.element.hidden = !state.labels || hiddenInOverview;
    if (!state.labels || hiddenInOverview) {
      item.leader?.setAttribute('visibility', 'hidden');
      continue;
    }
    const labelText = guideLabelText(overviewLabels
      ? OVERVIEW_LABEL_TEXT.get(item.segment.id) || item.segment.label
      : item.segment.label);
    labelRenderer?.render(item, labelText);
    const placement = labelPlacement(item.segment);
    item.side = placement.side;
    item.labelAnchor = placement.labelAnchor;
    item.mapAnchor = placement.mapAnchor;
    item.offsetY = 0;
    item.element.style.left = `${placement.labelAnchor.x}px`;
    item.element.style.top = `${placement.labelAnchor.y}px`;
    item.element.style.transform = labelTransform(placement.side);
  }
  if (state.labels) {
    separateOverlappingLabels();
  }

  for (const item of hotspots) {
    const worldRect = hotspotWorldRect(item.hotspot);
    if (!worldRect) {
      item.element.hidden = true;
      continue;
    }
    item.element.hidden = false;
    const rect = worldRectToScreen(mapRenderer, worldRect);
    setHitRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightDoors);
  }

  for (const item of destructibleHotspots) {
    const worldRect = destructibleFixtureWorldRect(item.fixture);
    if (!worldRect) {
      item.element.hidden = true;
      continue;
    }
    item.element.hidden = false;
    setHitRect(item.element, worldRectToScreen(mapRenderer, worldRect));
    item.element.classList.toggle('is-highlight-hidden', !state.highlightSecrets);
  }

  for (const item of actorHotspots) {
    const visible = shouldShowActorHotspot(item.actor);
    item.element.hidden = !visible;
    if (!visible) continue;
    setHitRect(item.element, worldRectToScreen(mapRenderer, actorWorldRect(item.actor)));
    item.element.classList.toggle('is-highlight-hidden', !actorHighlightVisible(item.actor));
  }
}

class Cv2DialogRenderer {
  constructor(box, frameCanvas, closeFrameCanvas, textElement, glyphs, atlas) {
    this.box = box;
    this.frameCanvas = frameCanvas;
    this.closeFrameCanvas = closeFrameCanvas;
    this.textElement = textElement;
    this.glyphs = glyphs;
    this.atlas = atlas;
    this.warnedGlyphs = new Set();
    this.frameContext = this.frameCanvas.getContext('2d', { alpha: false });
    this.closeFrameContext = this.closeFrameCanvas.getContext('2d', { alpha: false });
    this.surfaces = [{
      box: this.box,
      frameCanvas: this.frameCanvas,
      frameContext: this.frameContext,
      closeFrameCanvas: this.closeFrameCanvas,
      closeFrameContext: this.closeFrameContext,
      textElement: this.textElement
    }];
  }

  reset() {
    this.ensureSurfaceCount(1);
    this.textElement.textContent = '';
    this.box.removeAttribute('aria-label');
    this.box.parentElement?.classList.remove('is-dialog-bundle');
    this.box.parentElement?.removeAttribute('aria-label');
  }

  createSurface() {
    const box = document.createElement('div');
    const frameCanvas = document.createElement('canvas');
    const textElement = document.createElement('p');
    box.className = 'dialog-box dialog-box-secondary';
    box.setAttribute('role', 'status');
    frameCanvas.className = 'dialog-frame-canvas';
    frameCanvas.setAttribute('aria-hidden', 'true');
    textElement.className = 'dialog-text';
    box.append(frameCanvas, textElement);
    this.box.parentElement?.append(box);
    return {
      box,
      frameCanvas,
      frameContext: frameCanvas.getContext('2d', { alpha: false }),
      closeFrameCanvas: null,
      closeFrameContext: null,
      textElement
    };
  }

  ensureSurfaceCount(count) {
    while (this.surfaces.length < count) {
      this.surfaces.push(this.createSurface());
    }
    while (this.surfaces.length > count) {
      const surface = this.surfaces.pop();
      surface?.box.remove();
    }
  }

  drawFrameToCanvas(
    canvas,
    context,
    tileColumns,
    tileRows,
    scale,
    horizontalRuleTileRows = [],
    paletteOverrides = {}
  ) {
    const rendered = renderCv2DialogFrameToRgba({
      atlas: this.atlas,
      tileColumns,
      tileRows,
      horizontalRuleTileRows,
      paletteOverrides
    });
    if (canvas.width !== rendered.width) {
      canvas.width = rendered.width;
    }
    if (canvas.height !== rendered.height) {
      canvas.height = rendered.height;
    }
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(rendered.rgba, rendered.width, rendered.height), 0, 0);

    const cssWidth = rendered.width * scale;
    const cssHeight = rendered.height * scale;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    return { cssWidth, cssHeight };
  }

  drawFrame(surface, tileColumns, tileRows, scale, horizontalRuleTileRows = [], paletteOverrides = {}, renderClose = false) {
    const { cssWidth, cssHeight } = this.drawFrameToCanvas(
      surface.frameCanvas,
      surface.frameContext,
      tileColumns,
      tileRows,
      scale,
      horizontalRuleTileRows,
      paletteOverrides
    );
    surface.box.style.width = `${cssWidth}px`;
    surface.box.style.height = `${cssHeight}px`;
    if (renderClose && surface.closeFrameCanvas && surface.closeFrameContext) {
      this.drawFrameToCanvas(surface.closeFrameCanvas, surface.closeFrameContext, 3, 3, scale, [], paletteOverrides);
    }
  }

  renderSurface(surface, model, constraints, renderClose) {
    const layout = Cv2DialogLayout.layout(model.dialogText, this.glyphs, constraints);
    const scale = Math.max(1, Math.min(constraints.desiredScale, constraints.maxCssWidth / ((layout.textColumns + 4) * 8)));
    const tileColumns = layout.textColumns + 4;
    const tileRows = layout.lines.length * 2 + 2;
    const horizontalRuleTileRows = layout.lines
      .map((line, index) => (isCv2DialogRuleLine(line) ? 2 + index * 2 : null))
      .filter((tileY) => tileY != null);
    surface.box.style.setProperty('--dialog-scale', String(scale));
    surface.box.style.setProperty('--dialog-text-columns', String(layout.textColumns));
    surface.box.dataset.tileColumns = String(tileColumns);
    surface.box.dataset.tileRows = String(tileRows);
    surface.box.dataset.dialogTone = model.dialogTone || 'game';
    const paletteOverrides = model.dialogTone === GUIDE_AUTHORED_DIALOG_TONE
      ? { 1: GUIDE_AUTHORED_DIALOG_GREY_BORDER }
      : {};
    this.drawFrame(surface, tileColumns, tileRows, scale, horizontalRuleTileRows, paletteOverrides, renderClose);

    if (layout.unsupported.length > 0) {
      const key = layout.unsupported.join('');
      if (!this.warnedGlyphs.has(key)) {
        this.warnedGlyphs.add(key);
        console.warn(`CV2 dialog replaced unsupported glyphs: ${layout.unsupported.join(' ')}`);
      }
    }

    const displayLines = layout.lines.map((line) => (isCv2DialogRuleLine(line) ? '' : line));
    const spokenLines = layout.lines.filter((line) => !isCv2DialogRuleLine(line));
    const dialogText = spokenLines.join(' ');
    surface.textElement.textContent = displayLines.join('\n');
    const spokenText = dialogText.replace(/[.?!]+$/, '');
    surface.box.setAttribute('aria-label', `${model.title}. ${spokenText}.`);
    return {
      dialogText,
      fullText: layout.lines.join(' ')
    };
  }

  render(model, desiredScale = undefined) {
    const dialogModels = (model.dialogs?.length ? model.dialogs : [model])
      .map((dialogModel) => ({
        ...dialogModel,
        title: dialogModel.title || model.title,
        anchorWorldRect: dialogModel.anchorWorldRect || model.anchorWorldRect
      }));
    this.ensureSurfaceCount(dialogModels.length);
    const bundle = dialogModels.length > 1;
    this.box.parentElement?.classList.toggle('is-dialog-bundle', bundle);
    const constraints = Cv2DialogLayout.constraints(window.innerWidth, window.innerHeight, { desiredScale });
    const results = dialogModels.map((dialogModel, index) => this.renderSurface(
      this.surfaces[index],
      dialogModel,
      constraints,
      index === 0
    ));
    const scale = this.surfaces[0]?.box.style.getPropertyValue('--dialog-scale') || String(constraints.desiredScale);
    this.box.dataset.cssScale = scale;
    this.box.parentElement?.setAttribute('aria-label', results.map((result) => result.dialogText).join(' '));
    return results[0] || { dialogText: '', fullText: '' };
  }
}

class Cv2LabelRenderer {
  constructor(glyphs, atlas) {
    this.glyphs = glyphs;
    this.atlas = atlas;
    this.frameCache = new Map();
    this.warnedGlyphs = new Set();
  }

  frame(tileColumns, tileRows) {
    const key = `${tileColumns}x${tileRows}`;
    if (!this.frameCache.has(key)) {
      this.frameCache.set(key, renderCv2DialogFrameToRgba({
        atlas: this.atlas,
        tileColumns,
        tileRows,
        paletteOverrides: {
          1: LABEL_DIALOG_GREY_BORDER
        }
      }));
    }
    return this.frameCache.get(key);
  }

  render(item, sourceText) {
    if (!item.canvas || !item.textElement || item.renderedLabelText === sourceText) {
      return;
    }

    const layout = Cv2DialogLayout.layout(sourceText, this.glyphs, {
      textColumns: LABEL_DIALOG_MAX_TEXT_COLUMNS
    });
    const textColumns = Math.max(
      LABEL_DIALOG_MIN_TEXT_COLUMNS,
      Math.max(...layout.lines.map((line) => line.length))
    );
    const tileColumns = textColumns + 4;
    const tileRows = layout.lines.length * 2 + 2;
    const frame = this.frame(tileColumns, tileRows);
    const context = item.canvas.getContext('2d', { alpha: true });
    if (item.canvas.width !== frame.width) {
      item.canvas.width = frame.width;
    }
    if (item.canvas.height !== frame.height) {
      item.canvas.height = frame.height;
    }
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(frame.rgba, frame.width, frame.height), 0, 0);

    const cssWidth = frame.width * LABEL_DIALOG_SCALE;
    const cssHeight = frame.height * LABEL_DIALOG_SCALE;
    item.element.style.setProperty('--label-scale', String(LABEL_DIALOG_SCALE));
    item.element.style.setProperty('--label-text-columns', String(textColumns));
    item.element.style.width = `${cssWidth}px`;
    item.element.style.height = `${cssHeight}px`;
    item.canvas.style.width = `${cssWidth}px`;
    item.canvas.style.height = `${cssHeight}px`;
    item.textElement.textContent = layout.lines.join('\n');
    item.element.setAttribute('aria-label', layout.lines.join(' '));
    item.element.title = layout.lines.join(' ');
    item.renderedLabelText = sourceText;

    if (layout.unsupported.length > 0) {
      const key = layout.unsupported.join('');
      if (!this.warnedGlyphs.has(key)) {
        this.warnedGlyphs.add(key);
        console.warn(`CV2 label replaced unsupported glyphs: ${layout.unsupported.join(' ')}`);
      }
    }
  }
}

function renderDefinitionList(list, rows = []) {
  const nodes = [];
  for (const row of rows) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = row.label;
    dd.textContent = row.value;
    nodes.push(dt, dd);
  }
  list.replaceChildren(...nodes);
}

function hideGuideCard() {
  activeGuideModel = null;
  dom.guideCard.hidden = true;
  dialogRenderer?.reset();
}

function renderGuideCard() {
  if (!activeGuideModel || !dialogRenderer) {
    dom.guideCard.hidden = true;
    return;
  }
  const dialogScale = dialogScaleForMap();
  dialogRenderer.render(activeGuideModel, dialogScale);
  dom.dialogBox.dataset.cssScale = String(dialogScale);
  dom.guideCard.hidden = false;
  placeAnchoredPanel(dom.guideCard, activeGuideModel, 'above');
}

function showGuideCard(model) {
  activeInspectorModel = null;
  dom.guideInspector.hidden = true;
  activeGuideModel = model;
  renderGuideCard();
}

function hideGuideInspector() {
  activeInspectorModel = null;
  dom.guideInspector.hidden = true;
  dom.guideInspectorTitle.textContent = '';
  dom.guideInspectorSummary.textContent = '';
  dom.guideInspectorList.replaceChildren();
}

function renderGuideInspector() {
  if (!activeInspectorModel) {
    dom.guideInspector.hidden = true;
    return;
  }
  if (activeInspectorModel.refresh) {
    Object.assign(activeInspectorModel, activeInspectorModel.refresh());
  }
  dom.guideInspector.hidden = false;
  dom.guideInspectorTitle.textContent = activeInspectorModel.title;
  dom.guideInspectorSummary.textContent = activeInspectorModel.summary || '';
  renderDefinitionList(dom.guideInspectorList, activeInspectorModel.details || []);
  placeAnchoredPanel(dom.guideInspector, activeInspectorModel, 'right');
}

function showGuideInspector(model) {
  hideGuideCard();
  activeInspectorModel = model;
  renderGuideInspector();
}

function hpDialogValue(value) {
  return value == null ? 'none' : String(value);
}

function enemyDialogText(actor) {
  const hp = actor.hp || {};
  return `${actor.label}\n----------\nDay HP - ${hpDialogValue(hp.day)}\nNight HP - ${hpDialogValue(hp.night)}`;
}

function showDestructibleFixtureCard(fixture) {
  const action = fixture.action || "Break these blocks with Holy Water, or equip Dracula's Nail and whip them.";
  showGuideCard({
    title: fixture.label,
    dialogText: `${fixture.label}\n----------\n${action}`,
    dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect: () => destructibleFixtureWorldRect(fixture)
  });
}

function secretGuideDialogText(actor) {
  const secret = actor.secret || {};
  const lines = [actor.label, '----------'];
  if (secret.action) {
    lines.push(secret.action);
  }
  return lines.join('\n');
}

function showActorCard(actor) {
  if (actor.kind === 'secret') {
    showSecretCard(actor);
    return;
  }

  if (actor.kind === 'enemy') {
    showGuideCard({
      title: actor.label,
      dialogText: enemyDialogText(actor),
      dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
      anchorWorldRect: () => actorWorldRect(actor)
    });
    return;
  }

  if (!actor.text) {
    showGuideInspector({
      title: actor.label,
      summary: 'No decoded dialogue text is attached to this actor row.',
      anchorWorldRect: () => actorWorldRect(actor),
      details: []
    });
    return;
  }

  showGuideCard({
    title: actor.label,
    dialogText: actor.text,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function showSecretCard(actor) {
  const secret = actor.secret || {};
  const hasGuideText = Boolean(secret.action);
  const lines = [];
  if (secret.action) {
    lines.push(secret.action);
  }
  if (secret.reward) {
    lines.push(`Reward ${secret.reward}.`);
  }
  if (actor.text) {
    lines.push(actor.text);
  }
  if (actor.text && hasGuideText) {
    showGuideCard({
      title: actor.label,
      anchorWorldRect: () => actorWorldRect(actor),
      dialogs: [
        {
          title: actor.label,
          dialogText: secretGuideDialogText(actor),
          dialogTone: GUIDE_AUTHORED_DIALOG_TONE
        },
        {
          title: actor.label,
          dialogText: actor.text
        }
      ]
    });
    return;
  }

  if (actor.text) {
    showGuideCard({
      title: actor.label,
      dialogText: actor.text,
      anchorWorldRect: () => actorWorldRect(actor)
    });
    return;
  }

  showGuideCard({
    title: actor.label,
    dialogText: lines.length ? [actor.label, '----------', ...lines].join('\n') : 'Secret details are attached to this actor row.',
    dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function syncControls() {
  dom.labelsToggle.checked = state.labels;
  dom.sectionOutlinesToggle.checked = state.sectionOutlines;
  dom.highlightDoorsToggle.checked = state.highlightDoors;
  dom.showCharactersToggle.checked = state.showCharacters;
  dom.showSecretsToggle.checked = state.showSecrets;
  dom.highlightCharactersToggle.checked = state.highlightCharacters;
  dom.highlightMapObjectsToggle.checked = state.highlightMapObjects;
  dom.highlightSecretsToggle.checked = state.highlightSecrets;
  const nextVariant = state.variant === 'day' ? 'night' : 'day';
  const currentLabel = state.variant === 'day' ? 'Day' : 'Night';
  const nextLabel = nextVariant === 'day' ? 'day' : 'night';
  const paletteLabel = `${currentLabel} palette active. Switch to ${nextLabel} palette`;
  drawChromeIcon(dom.paletteToggleIcon, state.variant === 'night' ? CHROME_ICONS.moon : CHROME_ICONS.sun);
  drawChromeIcon(dom.optionsToggleIcon, CHROME_ICONS.layers);
  dom.paletteToggle.setAttribute('aria-label', paletteLabel);
  dom.paletteToggle.title = paletteLabel;
  dom.paletteToggle.setAttribute('aria-pressed', state.variant === 'night' ? 'true' : 'false');
  const layersLabel = dom.optionsPanel.hidden ? 'Show guide layers' : 'Hide guide layers';
  dom.optionsToggle.setAttribute('aria-label', layersLabel);
  dom.optionsToggle.title = layersLabel;
  dom.optionsToggle.setAttribute('aria-expanded', dom.optionsPanel.hidden ? 'false' : 'true');
}

function openPortal() {
  portalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  state.portalOpen = true;
  dom.portalModal.hidden = false;
  sceneRenderer.resetCamera(0.92);
  hideGuideCard();
  hideGuideInspector();
  dom.closePortal.focus();
}

function closePortal() {
  state.portalOpen = false;
  dom.portalModal.hidden = true;
  if (portalReturnFocus && document.contains(portalReturnFocus)) {
    portalReturnFocus.focus();
  }
  portalReturnFocus = null;
}

function attachInput(renderer) {
  const pointers = new Map();
  let lastCentroid = null;
  let pinchStartDistance = 0;
  let pinchStartScale = renderer.camera.scale;
  let dragHistory = [];
  const mapInteractionTargets = [renderer.canvas, dom.overlay];
  const modernUiSelector = '.map-chrome, .options-panel, .guide-card, .guide-inspector, .portal-modal, .status';

  function canStartMapGesture(target) {
    if (!(target instanceof Element)) {
      return false;
    }
    return target === renderer.canvas
      || Boolean(target.closest('.hotspot, .destructible-hotspot, .actor-hotspot'));
  }

  function canWheelZoomMap(target) {
    if (!(target instanceof Element) || target.closest(modernUiSelector)) {
      return false;
    }
    return target === renderer.canvas
      || target === dom.overlay
      || Boolean(target.closest('#overlay-layer, .hotspot, .destructible-hotspot, .actor-hotspot'));
  }

  function pointerList() {
    return [...pointers.values()];
  }

  function centroid(points) {
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length
    };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function eventTimeMs(event) {
    return Number.isFinite(event.timeStamp) ? event.timeStamp : performance.now();
  }

  function resetDragHistory(time = performance.now()) {
    dragHistory = [{
      time,
      x: renderer.camera.x,
      y: renderer.camera.y
    }];
  }

  function recordDragSample(time) {
    dragHistory.push({
      time,
      x: renderer.camera.x,
      y: renderer.camera.y
    });
    const cutoff = time - PAN_RELEASE_HISTORY_MS;
    while (dragHistory.length > 2 && dragHistory[1].time < cutoff) {
      dragHistory.shift();
    }
  }

  function releaseVelocity(time = performance.now()) {
    if (dragHistory.length < 2 || time - dragHistory[dragHistory.length - 1].time > PAN_RELEASE_STALE_MS) {
      return { x: 0, y: 0 };
    }

    const cutoff = time - PAN_RELEASE_HISTORY_MS;
    const first = dragHistory.find((sample) => sample.time >= cutoff) || dragHistory[0];
    const last = dragHistory[dragHistory.length - 1];
    const dt = Math.max(1, last.time - first.time);
    const velocity = {
      x: (last.x - first.x) / dt,
      y: (last.y - first.y) / dt
    };
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const screenSpeed = Math.hypot(velocity.x, velocity.y) * renderer.camera.scale / dpr;
    if (screenSpeed < PAN_RELEASE_MIN_SCREEN_SPEED) {
      return { x: 0, y: 0 };
    }
    return {
      x: velocity.x,
      y: velocity.y
    };
  }

  function resetGesture(points = pointerList()) {
    lastCentroid = points.length ? centroid(points) : null;
    if (points.length >= 2) {
      pinchStartDistance = Math.max(1, distance(points[0], points[1]));
      pinchStartScale = renderer.camera.scale;
    } else {
      pinchStartDistance = 0;
      pinchStartScale = renderer.camera.scale;
    }
  }

  function moveByCentroid(nextCentroid, time = performance.now()) {
    if (!lastCentroid) {
      lastCentroid = nextCentroid;
      recordDragSample(time);
      return;
    }
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cameraDeltaX = -((nextCentroid.x - lastCentroid.x) * dpr) / renderer.camera.scale;
    const cameraDeltaY = -((nextCentroid.y - lastCentroid.y) * dpr) / renderer.camera.scale;
    renderer.camera.x += cameraDeltaX;
    renderer.camera.y += cameraDeltaY;
    lastCentroid = nextCentroid;
    if (pointers.size === 1) {
      clampGuideCamera();
      recordDragSample(time);
    } else {
      resetDragHistory(time);
    }
  }

  function onPointerDown(event) {
    if (event.button !== 0 || !canStartMapGesture(event.target)) {
      return;
    }
    stopPanInertia();
    resetDragHistory(eventTimeMs(event));
    const captureTarget = event.target instanceof Element ? event.target : renderer.canvas;
    if (captureTarget.setPointerCapture) {
      captureTarget.setPointerCapture(event.pointerId);
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    resetGesture();
  }

  function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    const events = pointers.size === 1 && typeof event.getCoalescedEvents === 'function'
      ? event.getCoalescedEvents()
      : [];
    const samples = events.length > 0 ? [...events, event] : [event];
    for (const sample of samples) {
      pointers.set(event.pointerId, { x: sample.clientX, y: sample.clientY });
      const points = pointerList();
      if (points.length === 0) return;
      const nextCentroid = centroid(points);
      moveByCentroid(nextCentroid, eventTimeMs(sample));
    }

    const points = pointerList();
    if (points.length >= 2) {
      const nextCentroid = centroid(points);
      const nextDistance = Math.max(1, distance(points[0], points[1]));
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      renderer.zoomAt(nextCentroid.x * dpr, nextCentroid.y * dpr, pinchStartScale * (nextDistance / pinchStartDistance));
      resetDragHistory(eventTimeMs(event));
    }
    clampGuideCamera();
  }

  function onPointerEnd(event) {
    const wasSinglePointer = pointers.size === 1;
    const captureTarget = event.target instanceof Element ? event.target : renderer.canvas;
    if (captureTarget.hasPointerCapture?.(event.pointerId)) {
      captureTarget.releasePointerCapture(event.pointerId);
    }
    pointers.delete(event.pointerId);
    if (event.type === 'pointerup' && wasSinglePointer && pointers.size === 0) {
      const velocity = releaseVelocity(eventTimeMs(event));
      startPanInertia(velocity.x, velocity.y);
    } else {
      stopPanInertia();
      resetDragHistory(eventTimeMs(event));
    }
    resetGesture();
  }

  for (const target of mapInteractionTargets) {
    target.addEventListener('pointerdown', onPointerDown);
  }
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  renderer.canvas.addEventListener('lostpointercapture', (event) => {
    pointers.delete(event.pointerId);
  });

  window.addEventListener('wheel', (event) => {
    if (!canWheelZoomMap(event.target)) {
      return;
    }
    event.preventDefault();
    stopPanInertia();
    resetDragHistory(eventTimeMs(event));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const factor = Math.exp(-event.deltaY * 0.0012);
    renderer.zoomAt(event.clientX * dpr, event.clientY * dpr, renderer.camera.scale * factor);
    clampGuideCamera();
  }, { passive: false });

  renderer.canvas.addEventListener('keydown', (event) => {
    const panStep = 72 / renderer.camera.scale;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const centerX = renderer.canvas.width / (2 * dpr);
    const centerY = renderer.canvas.height / (2 * dpr);
    if (event.key === 'ArrowLeft') {
      renderer.camera.x -= panStep;
    } else if (event.key === 'ArrowRight') {
      renderer.camera.x += panStep;
    } else if (event.key === 'ArrowUp') {
      renderer.camera.y -= panStep;
    } else if (event.key === 'ArrowDown') {
      renderer.camera.y += panStep;
    } else if (event.key === '+' || event.key === '=') {
      renderer.zoomAt(centerX * dpr, centerY * dpr, renderer.camera.scale * 1.18);
    } else if (event.key === '-' || event.key === '_') {
      renderer.zoomAt(centerX * dpr, centerY * dpr, renderer.camera.scale / 1.18);
    } else if (event.key === 'Home' || event.key === '0') {
      focusVisibleRoute();
    } else {
      return;
    }
    event.preventDefault();
    stopPanInertia();
    resetDragHistory(eventTimeMs(event));
    clampGuideCamera();
  });
}

function attachControls() {
  dom.paletteToggle.addEventListener('click', () => {
    state.variant = state.variant === 'day' ? 'night' : 'day';
    syncControls();
    renderGuideInspector();
  });
  dom.optionsToggle.addEventListener('click', () => {
    dom.optionsPanel.hidden = !dom.optionsPanel.hidden;
    syncControls();
  });
  dom.labelsToggle.addEventListener('change', () => {
    state.labels = dom.labelsToggle.checked;
  });
  dom.sectionOutlinesToggle.addEventListener('change', () => {
    state.sectionOutlines = dom.sectionOutlinesToggle.checked;
  });
  dom.highlightDoorsToggle.addEventListener('change', () => {
    state.highlightDoors = dom.highlightDoorsToggle.checked;
  });
  dom.showCharactersToggle.addEventListener('change', () => {
    state.showCharacters = dom.showCharactersToggle.checked;
  });
  dom.showSecretsToggle.addEventListener('change', () => {
    state.showSecrets = dom.showSecretsToggle.checked;
  });
  dom.highlightCharactersToggle.addEventListener('change', () => {
    state.highlightCharacters = dom.highlightCharactersToggle.checked;
  });
  dom.highlightMapObjectsToggle.addEventListener('change', () => {
    state.highlightMapObjects = dom.highlightMapObjectsToggle.checked;
  });
  dom.highlightSecretsToggle.addEventListener('change', () => {
    state.highlightSecrets = dom.highlightSecretsToggle.checked;
  });
  dom.dialogClose.addEventListener('click', () => {
    hideGuideCard();
  });
  dom.guideInspectorClose.addEventListener('click', () => {
    hideGuideInspector();
  });
  dom.closePortal.addEventListener('click', closePortal);
  dom.portalModal.addEventListener('click', (event) => {
    if (event.target?.hasAttribute?.('data-close-portal')) {
      closePortal();
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.portalOpen) {
      closePortal();
    } else if (event.key === 'Escape' && !dom.optionsPanel.hidden) {
      dom.optionsPanel.hidden = true;
      syncControls();
      dom.optionsToggle.focus();
    } else if (event.key === 'Escape' && !dom.guideCard.hidden) {
      hideGuideCard();
    } else if (event.key === 'Escape' && !dom.guideInspector.hidden) {
      hideGuideInspector();
    }
  });
  window.addEventListener('resize', () => {
    stopPanInertia();
    clampGuideCamera();
    renderGuideCard();
    renderGuideInspector();
    if (state.portalOpen) {
      sceneRenderer.resetCamera(0.92);
    }
  });
}

function renderLoop() {
  applyPanInertia();
  updateFloatingProjection();
  mapRenderer.render(state.variant);
  mapRenderer.actorRenderer.render(
    mapRenderer.camera,
    state.variant,
    shouldRenderActor,
    (segmentId) => mapRenderer.displayOffsetForSegment(segmentId)
  );
  if (state.portalOpen) {
    sceneRenderer.render('fixed');
  }
  updateOverlays();
  if (activeGuideModel && dom.dialogBox.dataset.cssScale !== String(dialogScaleForMap())) {
    renderGuideCard();
  } else {
    placeAnchoredPanel(dom.guideCard, activeGuideModel, 'above');
  }
  placeAnchoredPanel(dom.guideInspector, activeInspectorModel, 'right');
  requestAnimationFrame(renderLoop);
}

async function main() {
  await initWasm();
  mapRenderer = new TileRenderer(dom.mapCanvas);
  sceneRenderer = new TileRenderer(dom.sceneCanvas);
  await mapRenderer.load(SLICE_URL);
  await sceneRenderer.load(SCENE_URL);
  const fontResponse = await fetch(FONT_URL, { cache: 'no-store' });
  if (!fontResponse.ok) {
    throw new Error(`Unable to load ${FONT_URL}`);
  }
  const fontManifest = await fontResponse.json();
  const glyphs = createGlyphMap(fontManifest);
  const dialogAtlas = mapRenderer.decodedChrAtlases.get('chr-00-01')
    || mapRenderer.decodedChrAtlases.values().next().value;
  if (!dialogAtlas) {
    throw new Error('Guide slice does not include decoded CHR data for the CV2 dialog renderer.');
  }
  dialogRenderer = new Cv2DialogRenderer(
    dom.dialogBox,
    dom.dialogFrameCanvas,
    dom.dialogCloseFrameCanvas,
    dom.dialogText,
    glyphs,
    dialogAtlas
  );
  labelRenderer = new Cv2LabelRenderer(glyphs, dialogAtlas);
  focusVisibleRoute();
  sceneRenderer.resetCamera(0.92);
  attachInput(mapRenderer);
  attachControls();
  buildOverlays();
  syncControls();
  setStatus('');
  if (window.location.hash === '#berkeley-mansion') {
    openPortal();
  }
  renderLoop();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  setStatus(message);
  throw error;
});
