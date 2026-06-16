import initWasm, { decode_chr_atlas, expand_segment_tilemap } from './vendor/guide-map-wasm/guide_map_wasm.js';

const SLICE_URL = './assets/slices/jova-to-berkeley/slice.json?v=layer-simplify6';
const SCENE_URL = './assets/scenes/berkeley-mansion-part-1/slice.json';

const NES_PALETTE = [
  [102, 102, 102], [0, 42, 136], [20, 18, 167], [59, 0, 164],
  [92, 0, 126], [110, 0, 64], [108, 6, 0], [86, 29, 0],
  [51, 53, 0], [11, 72, 0], [0, 82, 0], [0, 79, 8],
  [0, 64, 77], [0, 0, 0], [0, 0, 0], [0, 0, 0],
  [173, 173, 173], [21, 95, 217], [66, 64, 255], [117, 39, 254],
  [160, 26, 204], [183, 30, 123], [181, 49, 32], [153, 78, 0],
  [107, 109, 0], [56, 135, 0], [12, 147, 0], [0, 143, 50],
  [0, 124, 141], [0, 0, 0], [0, 0, 0], [0, 0, 0],
  [255, 254, 255], [100, 176, 255], [146, 144, 255], [198, 118, 255],
  [243, 106, 255], [254, 110, 204], [254, 129, 112], [234, 158, 34],
  [188, 190, 0], [136, 216, 0], [92, 228, 48], [69, 224, 130],
  [72, 205, 222], [79, 79, 79], [0, 0, 0], [0, 0, 0],
  [255, 254, 255], [192, 223, 255], [211, 210, 255], [232, 200, 255],
  [251, 194, 255], [254, 196, 234], [254, 204, 197], [247, 216, 165],
  [228, 229, 148], [207, 239, 150], [189, 244, 171], [179, 243, 204],
  [181, 235, 242], [184, 184, 184], [0, 0, 0], [0, 0, 0]
];

const ROUTE_SEGMENT_IDS = [
  'town-of-jova',
  'jova-woods',
  'south-bridge',
  'veros-woods-part-1',
  'veros-woods-part-2',
  'denis-woods-part-1',
  'berkeley-mansion-door'
];

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
  paletteToggle: document.querySelector('#palette-toggle'),
  resetView: document.querySelector('#reset-view'),
  optionsToggle: document.querySelector('#options-toggle'),
  optionsPanel: document.querySelector('#options-panel'),
  labelsToggle: document.querySelector('#toggle-labels'),
  highlightDoorsToggle: document.querySelector('#toggle-highlight-doors'),
  showCharactersToggle: document.querySelector('#toggle-show-characters'),
  highlightCharactersToggle: document.querySelector('#toggle-highlight-characters'),
  highlightMapObjectsToggle: document.querySelector('#toggle-highlight-map-objects'),
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
out vec2 v_uv;

void main() {
  vec2 screen = (a_position - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
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
  return new URL(dataFile, new URL(manifestUrl, window.location.href)).toString();
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

function pushSprite(vertices, actor, actorClass, frame, chrSet) {
  const spriteHeight = actorClass.largeSprites ? 16 : 8;
  for (const sprite of frame.sprites || []) {
    const tile = numericByte(sprite.tile);
    const palette = Number.isFinite(sprite.palette) ? sprite.palette : numericByte(sprite.attr) & 0x03;
    const x = actor.worldX + sprite.xOffset;
    const y = actor.worldY + sprite.yOffset;

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

  render(camera, variant, shouldRenderActor) {
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
      pushSprite(batches.get(key).vertices, actor, actorClass, frame, chrSet);
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
    this.locations = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      uv: this.gl.getAttribLocation(this.program, 'a_uv'),
      resolution: assertGl(this.gl.getUniformLocation(this.program, 'u_resolution'), 'u_resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.program, 'u_camera'), 'u_camera'),
      segmentSize: assertGl(this.gl.getUniformLocation(this.program, 'u_segment_size'), 'u_segment_size'),
      tilemap: assertGl(this.gl.getUniformLocation(this.program, 'u_tilemap'), 'u_tilemap'),
      chr: assertGl(this.gl.getUniformLocation(this.program, 'u_chr'), 'u_chr'),
      palette: assertGl(this.gl.getUniformLocation(this.program, 'u_palette'), 'u_palette')
    };
    this.manifest = null;
    this.segments = [];
    this.segmentById = new Map();
    this.actorClassById = new Map();
    this.chrTextures = new Map();
    this.spritePaletteTextures = new Map();
    this.actorRenderer = new ActorRenderer(this.gl);
    this.camera = { x: 0, y: 0, scale: 1 };
  }

  async load(manifestUrl) {
    const manifestResponse = await fetch(manifestUrl);
    if (!manifestResponse.ok) {
      throw new Error(`Unable to load ${manifestUrl}`);
    }
    const manifest = await manifestResponse.json();
    const dataResponse = await fetch(loadDataUrl(manifestUrl, manifest.dataFile));
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
    this.camera.scale = Math.max(0.08, this.camera.scale);
  }

  zoomAt(screenX, screenY, nextScale) {
    const beforeX = this.camera.x + (screenX - this.canvas.width / 2) / this.camera.scale;
    const beforeY = this.camera.y + (screenY - this.canvas.height / 2) / this.camera.scale;
    this.camera.scale = Math.max(0.08, Math.min(26, nextScale));
    this.camera.x = beforeX - (screenX - this.canvas.width / 2) / this.camera.scale;
    this.camera.y = beforeY - (screenY - this.canvas.height / 2) / this.camera.scale;
  }

  render(variant, shouldRenderSegment = () => true) {
    if (!this.manifest) return;
    const gl = this.gl;
    resizeCanvas(gl, this.canvas);
    gl.clearColor(0.015, 0.015, 0.014, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
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
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, segment.tilemapTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, segment.chrTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, palette);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}

const state = {
  variant: 'day',
  labels: true,
  highlightDoors: true,
  showCharacters: true,
  highlightCharacters: true,
  highlightMapObjects: true,
  portalOpen: false
};

let mapRenderer;
let sceneRenderer;
let labels = [];
let hotspots = [];
let actorHotspots = [];

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
  mapRenderer.camera.scale = Math.max(0.08, Math.min(12, mapRenderer.camera.scale));
}

function compactViewport() {
  return window.innerWidth <= 760;
}

function focusVisibleRoute() {
  const openingBounds = visibleBounds(ROUTE_SEGMENT_IDS);
  focusBounds(openingBounds, compactViewport() ? 0.78 : 0.88);
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

function hotspotWorldRect(hotspot) {
  if (!hotspot.tileRect) {
    return hotspot;
  }
  const segment = mapRenderer.segmentById.get(hotspot.segmentId);
  if (!segment) {
    return null;
  }
  const tileSize = segment.tileSize || 8;
  return {
    x: segment.position.x + hotspot.tileRect.x * tileSize,
    y: segment.position.y + hotspot.tileRect.y * tileSize,
    width: hotspot.tileRect.width * tileSize,
    height: hotspot.tileRect.height * tileSize
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
      return {
        x: segment.position.x + actor.visualTileRect.x * tileSize,
        y: segment.position.y + actor.visualTileRect.y * tileSize,
        width: actor.visualTileRect.width * tileSize,
        height: actor.visualTileRect.height * tileSize
      };
    }
  }

  const actorClass = actorClassFor(actor);
  const bounds = actorClass?.opaqueBounds || actorClass?.bounds;
  if (bounds) {
    return {
      x: actor.worldX + bounds.minX,
      y: actor.worldY + bounds.minY,
      width: bounds.width,
      height: bounds.height
    };
  }

  return {
    x: actor.worldX - 8,
    y: actor.worldY - 20,
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

function actorLayerVisible(actor) {
  return actorIsMapObject(actor) || state.showCharacters;
}

function actorHighlightVisible(actor) {
  return actorIsMapObject(actor)
    ? state.highlightMapObjects
    : state.highlightCharacters;
}

function shouldRenderActor(actor) {
  return Boolean(actor.classId)
    && actorMatchesVariant(actor)
    && actorLayerVisible(actor);
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

function buildOverlays() {
  dom.overlay.replaceChildren();
  labels = [];
  hotspots = [];
  actorHotspots = [];

  for (let index = 0; index < ROUTE_SEGMENT_IDS.length; index += 1) {
    const segmentId = ROUTE_SEGMENT_IDS[index];
    const segment = mapRenderer.segmentById.get(segmentId);
    if (!segment) continue;
    const label = makeElement('label-chip');
    label.textContent = segment.label;
    labels.push({ element: label, segment, index });

  }

  for (const hotspot of HOTSPOTS) {
    const element = makeElement(`hotspot is-${hotspot.type}`, 'button');
    element.type = 'button';
    element.title = hotspot.label;
    element.setAttribute('aria-label', hotspot.label);
    if (hotspot.opens) {
      element.classList.add('is-clickable');
      element.addEventListener('click', () => openPortal());
    } else {
      element.addEventListener('click', () => updateGuideCard(hotspot.label, hotspot.note));
    }
    hotspots.push({ element, hotspot });
  }

  for (const actor of mapRenderer.manifest.actors || []) {
    const element = makeElement(`actor-hotspot is-${actor.kind}`, 'button');
    element.type = 'button';
    element.title = actor.label;
    element.setAttribute('aria-label', actor.label);
    element.addEventListener('click', () => showActorCard(actor));
    actorHotspots.push({ element, actor });
  }
}

function setRect(element, rect) {
  element.style.left = `${rect.left}px`;
  element.style.top = `${rect.top}px`;
  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}

function updateOverlays() {
  if (!mapRenderer?.manifest) return;

  for (const item of labels) {
    item.element.hidden = !state.labels;
    if (!state.labels) continue;
    const position = item.segment.position;
    const above = item.index % 2 === 0;
    const y = above ? position.y - 8 : position.y + position.height + 10;
    const screen = worldToScreen(mapRenderer, position.x + position.width / 2, y);
    item.element.style.left = `${screen.x}px`;
    item.element.style.top = `${screen.y}px`;
    item.element.style.transform = above ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
  }

  for (const item of hotspots) {
    const worldRect = hotspotWorldRect(item.hotspot);
    if (!worldRect) {
      item.element.hidden = true;
      continue;
    }
    item.element.hidden = false;
    const rect = worldRectToScreen(mapRenderer, worldRect);
    setRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightDoors);
  }

  for (const item of actorHotspots) {
    const visible = shouldShowActorHotspot(item.actor);
    item.element.hidden = !visible;
    if (!visible) continue;
    setRect(item.element, worldRectToScreen(mapRenderer, actorWorldRect(item.actor)));
    item.element.classList.toggle('is-highlight-hidden', !actorHighlightVisible(item.actor));
  }
}

function updateGuideCard(title, text) {
  const paragraphs = Array.isArray(text) ? text : [text];
  const heading = document.createElement('strong');
  heading.textContent = title;
  const nodes = [heading];
  for (const paragraphText of paragraphs) {
    const paragraph = document.createElement('p');
    paragraph.textContent = paragraphText;
    nodes.push(paragraph);
  }
  dom.guideCard.hidden = false;
  dom.guideCard.replaceChildren(...nodes);
}

function actorHpText(actor) {
  const hp = actor.hp || {};
  const currentHp = hp[state.variant];
  const day = hp.day == null ? 'none' : hp.day;
  const night = hp.night == null ? 'none' : hp.night;
  if (currentHp == null) {
    return `HP: not present in ${state.variant}. Day HP ${day}; night HP ${night}.`;
  }
  return `HP: ${currentHp} in ${state.variant}. Day HP ${day}; night HP ${night}.`;
}

function showActorCard(actor) {
  const lines = [];
  if (actor.kind === 'enemy') {
    lines.push(actorHpText(actor));
  } else if (actor.text) {
    lines.push(`Text: "${actor.text}"`);
  } else {
    lines.push('No dialogue text has been decoded for this actor row.');
  }

  updateGuideCard(actor.label, lines);
}

function syncControls() {
  dom.labelsToggle.checked = state.labels;
  dom.highlightDoorsToggle.checked = state.highlightDoors;
  dom.showCharactersToggle.checked = state.showCharacters;
  dom.highlightCharactersToggle.checked = state.highlightCharacters;
  dom.highlightMapObjectsToggle.checked = state.highlightMapObjects;
  dom.paletteToggle.textContent = state.variant === 'day' ? 'Night' : 'Day';
}

function openPortal() {
  state.portalOpen = true;
  dom.portalModal.hidden = false;
  sceneRenderer.resetCamera(0.92);
  updateGuideCard('Berkeley Mansion Door', 'A graph transition opens a separate mansion interior scene. The modal scene is also WebGL-rendered from raw data.');
}

function closePortal() {
  state.portalOpen = false;
  dom.portalModal.hidden = true;
}

function attachInput(renderer) {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let activePinchDistance = 0;
  let activePinchScale = 1;

  renderer.canvas.addEventListener('pointerdown', (event) => {
    renderer.canvas.setPointerCapture(event.pointerId);
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  renderer.canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    renderer.camera.x -= ((event.clientX - lastX) * dpr) / renderer.camera.scale;
    renderer.camera.y -= ((event.clientY - lastY) * dpr) / renderer.camera.scale;
    lastX = event.clientX;
    lastY = event.clientY;
  });

  renderer.canvas.addEventListener('pointerup', (event) => {
    renderer.canvas.releasePointerCapture(event.pointerId);
    dragging = false;
  });

  renderer.canvas.addEventListener('pointercancel', () => {
    dragging = false;
  });

  renderer.canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const factor = Math.exp(-event.deltaY * 0.0012);
    renderer.zoomAt(event.clientX * dpr, event.clientY * dpr, renderer.camera.scale * factor);
  }, { passive: false });

  renderer.canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      activePinchDistance = Math.hypot(dx, dy);
      activePinchScale = renderer.camera.scale;
    }
  }, { passive: true });

  renderer.canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2 && activePinchDistance > 0) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const centerX = ((event.touches[0].clientX + event.touches[1].clientX) / 2) * (window.devicePixelRatio || 1);
      const centerY = ((event.touches[0].clientY + event.touches[1].clientY) / 2) * (window.devicePixelRatio || 1);
      renderer.zoomAt(centerX, centerY, activePinchScale * (distance / activePinchDistance));
    }
  }, { passive: true });
}

function attachControls() {
  dom.paletteToggle.addEventListener('click', () => {
    state.variant = state.variant === 'day' ? 'night' : 'day';
    syncControls();
  });
  dom.resetView.addEventListener('click', () => focusVisibleRoute());
  dom.optionsToggle.addEventListener('click', () => {
    dom.optionsPanel.hidden = !dom.optionsPanel.hidden;
  });
  dom.labelsToggle.addEventListener('change', () => {
    state.labels = dom.labelsToggle.checked;
  });
  dom.highlightDoorsToggle.addEventListener('change', () => {
    state.highlightDoors = dom.highlightDoorsToggle.checked;
  });
  dom.showCharactersToggle.addEventListener('change', () => {
    state.showCharacters = dom.showCharactersToggle.checked;
  });
  dom.highlightCharactersToggle.addEventListener('change', () => {
    state.highlightCharacters = dom.highlightCharactersToggle.checked;
  });
  dom.highlightMapObjectsToggle.addEventListener('change', () => {
    state.highlightMapObjects = dom.highlightMapObjectsToggle.checked;
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
    }
  });
  window.addEventListener('resize', () => {
    focusVisibleRoute();
    if (state.portalOpen) {
      sceneRenderer.resetCamera(0.92);
    }
  });
}

function renderLoop() {
  mapRenderer.render(state.variant);
  mapRenderer.actorRenderer.render(mapRenderer.camera, state.variant, shouldRenderActor);
  if (state.portalOpen) {
    sceneRenderer.render('fixed');
  }
  updateOverlays();
  requestAnimationFrame(renderLoop);
}

async function main() {
  await initWasm();
  mapRenderer = new TileRenderer(dom.mapCanvas);
  sceneRenderer = new TileRenderer(dom.sceneCanvas);
  const mapManifest = await mapRenderer.load(SLICE_URL);
  const sceneManifest = await sceneRenderer.load(SCENE_URL);
  focusVisibleRoute();
  sceneRenderer.resetCamera(0.92);
  attachInput(mapRenderer);
  attachControls();
  buildOverlays();
  syncControls();
  setStatus(`${mapManifest.label}: ${mapManifest.segments.length} exterior segments, ${mapManifest.actorSummary?.placements || 0} actors, and ${sceneManifest.label} scene rendered from raw data through WebGL.`);
  updateGuideCard('Opening Slice', 'Raw ROM-derived tile data is rendered through WebGL. Use the highlighted Berkeley door to open the first mansion interior.');
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
