import './styles.css';
import initWasm, { decode_chr_atlas, expand_segment_tilemap } from './wasm/guide_map_wasm.js';

type BinaryRange = {
  offset: number;
  length: number;
};

type ChrSet = {
  id: string;
  data: BinaryRange;
  decodedAtlas: {
    width: number;
    height: number;
  };
};

type TileSet = {
  id: string;
  metatileTiles: BinaryRange;
  metatileAttributes: BinaryRange;
};

type PaletteRecord = {
  id: string;
  variant: 'day' | 'night';
  data: BinaryRange;
};

type SegmentRecord = {
  id: string;
  label: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  blockWidth: number;
  blockHeight: number;
  tileWidth: number;
  tileHeight: number;
  chrSet: string;
  tileSet: string;
  layoutBlocks: BinaryRange;
  palettes: {
    day: string;
    night: string;
  };
};

type SliceManifest = {
  id: string;
  label: string;
  dataFile: string;
  world: {
    width: number;
    height: number;
  };
  chrSets: ChrSet[];
  tileSets: TileSet[];
  palettes: PaletteRecord[];
  segments: SegmentRecord[];
};

type Camera = {
  x: number;
  y: number;
  scale: number;
};

type RenderSegment = {
  record: SegmentRecord;
  vertexBuffer: WebGLBuffer;
  tilemapTexture: WebGLTexture;
  chrTexture: WebGLTexture;
  paletteTextures: Record<'day' | 'night', WebGLTexture>;
};

const SLICE_URL = '/assets/slices/dead-river-1-to-berkeley/slice.json';
const NES_PALETTE: Array<[number, number, number]> = [
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

const maybeCanvas = document.querySelector<HTMLCanvasElement>('#map');
const maybeStatusEl = document.querySelector<HTMLDivElement>('#status');
const maybeToggleEl = document.querySelector<HTMLButtonElement>('#variant-toggle');
const maybeResetEl = document.querySelector<HTMLButtonElement>('#reset-view');

if (!maybeCanvas || !maybeStatusEl || !maybeToggleEl || !maybeResetEl) {
  throw new Error('Guide map DOM is incomplete.');
}

const canvas = maybeCanvas;
const statusEl = maybeStatusEl;
const toggleEl = maybeToggleEl;
const resetEl = maybeResetEl;

const maybeGl = canvas.getContext('webgl2', {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false
});

if (!maybeGl) {
  statusEl.textContent = 'WebGL2 is required for this guide map.';
  throw new Error('WebGL2 is not available.');
}

const gl = maybeGl;

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

function setStatus(message: string): void {
  statusEl.textContent = message;
}

function assertGl<T>(value: T | null, label: string): T {
  if (!value) {
    throw new Error(`Unable to create ${label}.`);
  }
  return value;
}

function compileShader(type: number, source: string): WebGLShader {
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

function createProgram(): WebGLProgram {
  const program = assertGl(gl.createProgram(), 'program');
  const vertex = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
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

function rangeView(data: ArrayBuffer, range: BinaryRange): Uint8Array {
  return new Uint8Array(data, range.offset, range.length);
}

function createTexture(width: number, height: number, internalFormat: number, format: number, data: ArrayBufferView): WebGLTexture {
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

function paletteTexture(paletteBytes: Uint8Array): WebGLTexture {
  const rgba = new Uint8Array(16 * 4);
  for (let index = 0; index < 16; index += 1) {
    const [r, g, b] = NES_PALETTE[paletteBytes[index] & 0x3f] || [0, 0, 0];
    rgba[index * 4] = r;
    rgba[index * 4 + 1] = g;
    rgba[index * 4 + 2] = b;
    rgba[index * 4 + 3] = 255;
  }
  return createTexture(16, 1, gl.RGBA8, gl.RGBA, rgba);
}

function createVertexBuffer(segment: SegmentRecord): WebGLBuffer {
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

async function loadSlice(): Promise<{ manifest: SliceManifest; data: ArrayBuffer }> {
  const manifestResponse = await fetch(SLICE_URL);
  if (!manifestResponse.ok) {
    throw new Error(`Unable to load ${SLICE_URL}`);
  }
  const manifest = await manifestResponse.json() as SliceManifest;
  const dataResponse = await fetch(`/assets/slices/dead-river-1-to-berkeley/${manifest.dataFile}`);
  if (!dataResponse.ok) {
    throw new Error(`Unable to load slice data.`);
  }
  return {
    manifest,
    data: await dataResponse.arrayBuffer()
  };
}

function resizeCanvas(): number {
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

function resetCamera(camera: Camera, manifest: SliceManifest): void {
  resizeCanvas();
  camera.x = manifest.world.width / 2;
  camera.y = manifest.world.height / 2;
  camera.scale = Math.min(
    canvas.width / manifest.world.width,
    canvas.height / manifest.world.height
  ) * 0.86;
  camera.scale = Math.max(0.08, camera.scale);
}

function zoomAt(camera: Camera, screenX: number, screenY: number, nextScale: number): void {
  const beforeX = camera.x + (screenX - canvas.width / 2) / camera.scale;
  const beforeY = camera.y + (screenY - canvas.height / 2) / camera.scale;
  camera.scale = Math.max(0.08, Math.min(24, nextScale));
  camera.x = beforeX - (screenX - canvas.width / 2) / camera.scale;
  camera.y = beforeY - (screenY - canvas.height / 2) / camera.scale;
}

async function main(): Promise<void> {
  await initWasm();
  const { manifest, data } = await loadSlice();
  const program = createProgram();
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const uvLocation = gl.getAttribLocation(program, 'a_uv');
  const resolutionLocation = assertGl(gl.getUniformLocation(program, 'u_resolution'), 'u_resolution');
  const cameraLocation = assertGl(gl.getUniformLocation(program, 'u_camera'), 'u_camera');
  const segmentSizeLocation = assertGl(gl.getUniformLocation(program, 'u_segment_size'), 'u_segment_size');
  const tilemapLocation = assertGl(gl.getUniformLocation(program, 'u_tilemap'), 'u_tilemap');
  const chrLocation = assertGl(gl.getUniformLocation(program, 'u_chr'), 'u_chr');
  const paletteLocation = assertGl(gl.getUniformLocation(program, 'u_palette'), 'u_palette');

  const chrTextures = new Map<string, WebGLTexture>();
  const tileSetById = new Map(manifest.tileSets.map((tileSet) => [tileSet.id, tileSet]));
  const chrSetById = new Map(manifest.chrSets.map((chrSet) => [chrSet.id, chrSet]));
  const paletteById = new Map(manifest.palettes.map((palette) => [palette.id, palette]));
  const paletteTextures = new Map<string, WebGLTexture>();

  for (const chrSet of manifest.chrSets) {
    const decoded = decode_chr_atlas(rangeView(data, chrSet.data));
    chrTextures.set(chrSet.id, createTexture(
      chrSet.decodedAtlas.width,
      chrSet.decodedAtlas.height,
      gl.R8,
      gl.RED,
      decoded
    ));
  }

  const renderSegments: RenderSegment[] = manifest.segments.map((record) => {
    const tileSet = tileSetById.get(record.tileSet);
    const chrSet = chrSetById.get(record.chrSet);
    const dayPalette = paletteById.get(record.palettes.day);
    const nightPalette = paletteById.get(record.palettes.night);
    if (!tileSet || !chrSet || !dayPalette || !nightPalette) {
      throw new Error(`Segment ${record.id} has incomplete texture references.`);
    }
    const tilemap = expand_segment_tilemap(
      rangeView(data, record.layoutBlocks),
      rangeView(data, tileSet.metatileTiles),
      rangeView(data, tileSet.metatileAttributes),
      record.blockWidth,
      record.blockHeight
    );
    const tilemapTexture = createTexture(record.tileWidth, record.tileHeight, gl.RGBA8, gl.RGBA, tilemap);
    const dayTexture = paletteTexture(rangeView(data, dayPalette.data));
    const nightTexture = paletteTexture(rangeView(data, nightPalette.data));
    paletteTextures.set(dayPalette.id, dayTexture);
    paletteTextures.set(nightPalette.id, nightTexture);
    return {
      record,
      vertexBuffer: createVertexBuffer(record),
      tilemapTexture,
      chrTexture: assertGl(chrTextures.get(chrSet.id) || null, `CHR texture ${chrSet.id}`),
      paletteTextures: {
        day: dayTexture,
        night: nightTexture
      }
    };
  });

  const camera: Camera = { x: 0, y: 0, scale: 1 };
  let variant: 'day' | 'night' = 'day';
  resetCamera(camera, manifest);

  toggleEl.addEventListener('click', () => {
    variant = variant === 'day' ? 'night' : 'day';
    toggleEl.textContent = variant === 'day' ? 'Night' : 'Day';
  });
  resetEl.addEventListener('click', () => resetCamera(camera, manifest));
  window.addEventListener('resize', () => resetCamera(camera, manifest));

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let activePinchDistance = 0;
  let activePinchScale = 1;

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    camera.x -= ((event.clientX - lastX) * dpr) / camera.scale;
    camera.y -= ((event.clientY - lastY) * dpr) / camera.scale;
    lastX = event.clientX;
    lastY = event.clientY;
  });
  canvas.addEventListener('pointerup', (event) => {
    canvas.releasePointerCapture(event.pointerId);
    dragging = false;
  });
  canvas.addEventListener('pointercancel', () => {
    dragging = false;
  });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const dpr = window.devicePixelRatio || 1;
    const factor = Math.exp(-event.deltaY * 0.0012);
    zoomAt(camera, event.clientX * dpr, event.clientY * dpr, camera.scale * factor);
  }, { passive: false });
  canvas.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      activePinchDistance = Math.hypot(dx, dy);
      activePinchScale = camera.scale;
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2 && activePinchDistance > 0) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const centerX = ((event.touches[0].clientX + event.touches[1].clientX) / 2) * (window.devicePixelRatio || 1);
      const centerY = ((event.touches[0].clientY + event.touches[1].clientY) / 2) * (window.devicePixelRatio || 1);
      zoomAt(camera, centerX, centerY, activePinchScale * (distance / activePinchDistance));
    }
  }, { passive: true });

  function render(): void {
    resizeCanvas();
    gl.clearColor(0.02, 0.02, 0.02, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform3f(cameraLocation, camera.x, camera.y, camera.scale);
    gl.uniform1i(tilemapLocation, 0);
    gl.uniform1i(chrLocation, 1);
    gl.uniform1i(paletteLocation, 2);

    for (const segment of renderSegments) {
      gl.bindBuffer(gl.ARRAY_BUFFER, segment.vertexBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);
      gl.uniform2f(segmentSizeLocation, segment.record.position.width, segment.record.position.height);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, segment.tilemapTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, segment.chrTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, segment.paletteTextures[variant]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }

  setStatus(`${manifest.label}: ${manifest.segments.length} ROM-derived tile segments, rendered through Rust WASM + WebGL2.`);
  render();
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  setStatus(message);
  throw error;
});
