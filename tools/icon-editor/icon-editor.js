const SIZE = 16;
const PALETTE = {
  W: [255, 254, 255, 255],
  G: [184, 184, 184, 255],
  Y: [234, 158, 34, 255]
};

const OPTIONS = {
  moon: [
    {
      id: 'moon-a',
      label: 'Crescent A',
      rows: [
        '................',
        '..........WW....',
        '........WWWW....',
        '.......WWWW.....',
        '......WWWW......',
        '.....WWWW.......',
        '....WWW.........',
        '....WWW.........',
        '....WWW.........',
        '....WWW.........',
        '.....WWWW.......',
        '......WWWW......',
        '.......WWWW.....',
        '........WWWW....',
        '..........WW....',
        '................'
      ]
    },
    {
      id: 'moon-b',
      label: 'Crescent B',
      rows: [
        '................',
        '.........WW.....',
        '.......WWWWW....',
        '......WWWWW.....',
        '.....WWWW.......',
        '....WWWW........',
        '....WWW.........',
        '...WWW..........',
        '...WWW..........',
        '....WWW.........',
        '....WWWW........',
        '.....WWWW.......',
        '......WWWWW.....',
        '.......WWWWW....',
        '.........WW.....',
        '................'
      ]
    },
    {
      id: 'moon-c',
      label: 'Crescent C',
      rows: [
        '................',
        '........WWW.....',
        '......WWWWWW....',
        '.....WWWWG......',
        '....WWWW........',
        '...WWWW.........',
        '...WWW..........',
        '..WWW...........',
        '..WWW...........',
        '...WWW..........',
        '...WWWW.........',
        '....WWWW........',
        '.....WWWWG......',
        '......WWWWWW....',
        '........WWW.....',
        '................'
      ]
    },
    {
      id: 'moon-d',
      label: 'Crescent D',
      rows: [
        '................',
        '..........W.....',
        '........WWWW....',
        '.......WWWWW....',
        '......WWWW......',
        '.....WWWW.......',
        '....WWWW........',
        '....WWW.........',
        '....WWW.........',
        '....WWWW........',
        '.....WWWW.......',
        '......WWWW......',
        '.......WWWWW....',
        '........WWWW....',
        '..........W.....',
        '................'
      ]
    },
    {
      id: 'moon-e',
      label: 'Crescent E',
      rows: [
        '................',
        '.........WWW....',
        '.......WWWWW....',
        '......WWWW......',
        '.....WWWW.......',
        '....WWWW........',
        '...WWW..........',
        '...WWW..........',
        '...WWW..........',
        '...WWW..........',
        '....WWWW........',
        '.....WWWW.......',
        '......WWWW......',
        '.......WWWWW....',
        '.........WWW....',
        '................'
      ]
    },
    {
      id: 'moon-f',
      label: 'Crescent F',
      rows: [
        '................',
        '..........W.....',
        '........WWWW....',
        '.......WWWWG....',
        '.....WWWWW......',
        '....WWWW........',
        '....WWW.........',
        '...WWWW.........',
        '...WWWW.........',
        '....WWW.........',
        '....WWWW........',
        '.....WWWWW......',
        '.......WWWWG....',
        '........WWWW....',
        '..........W.....',
        '................'
      ]
    }
  ],
  sun: [
    {
      id: 'sun-a',
      label: 'Sun A',
      rows: [
        '.......Y........',
        '..Y....Y....Y...',
        '...Y...Y...Y....',
        '....Y.....Y.....',
        '.....YYYYY......',
        '....YWWWWWY.....',
        '...YWWWWWWWY....',
        'YYYYWWGGGWWYYYY.',
        '...YWWGGGWWY....',
        '....YWWWWWY.....',
        '.....YYYYY......',
        '....Y.....Y.....',
        '...Y...Y...Y....',
        '..Y....Y....Y...',
        '.......Y........',
        '................'
      ]
    },
    {
      id: 'sun-b',
      label: 'Sun B',
      rows: [
        '.......Y........',
        '...Y...Y...Y....',
        '....Y..Y..Y.....',
        '.Y...YYYYY...Y..',
        '..Y.YWWWWWY.Y...',
        '....YWWWWWY.....',
        'YYYYWWGGGWWYYYY.',
        '....YWWGGWY.....',
        'YYYYWWGGGWWYYYY.',
        '....YWWWWWY.....',
        '..Y.YWWWWWY.Y...',
        '.Y...YYYYY...Y..',
        '....Y..Y..Y.....',
        '...Y...Y...Y....',
        '.......Y........',
        '................'
      ]
    },
    {
      id: 'sun-c',
      label: 'Sun C',
      rows: [
        '...Y...Y...Y....',
        '....Y..Y..Y.....',
        '.....Y.Y.Y......',
        '.Y....YYY....Y..',
        '..Y..YWWWY..Y...',
        '.....WWWWW......',
        'YYYYYWWGWWYYYYY.',
        '.....WWGWW......',
        'YYYYYWWGWWYYYYY.',
        '.....WWWWW......',
        '..Y..YWWWY..Y...',
        '.Y....YYY....Y..',
        '.....Y.Y.Y......',
        '....Y..Y..Y.....',
        '...Y...Y...Y....',
        '................'
      ]
    },
    {
      id: 'sun-d',
      label: 'Sun D',
      rows: [
        '.......Y........',
        '...Y.......Y....',
        '..Y...YYY...Y...',
        '.....YWWWY......',
        '.Y..YWWWWWY..Y..',
        '...YWWGGGWWY....',
        '..YWWGGGGGWWY...',
        'YYYWWGGGGGWWYYY.',
        '..YWWGGGGGWWY...',
        '...YWWGGGWWY....',
        '.Y..YWWWWWY..Y..',
        '.....YWWWY......',
        '..Y...YYY...Y...',
        '...Y.......Y....',
        '.......Y........',
        '................'
      ]
    },
    {
      id: 'sun-e',
      label: 'Sun E',
      rows: [
        '...Y.......Y....',
        '....Y..Y..Y.....',
        '..Y..Y.Y.Y..Y...',
        '.....YYYYY......',
        '....YWWWWWY.....',
        'Y..YWWGGGWWY..Y.',
        '..YWWGGGGGWWY...',
        'YYYYWGGGGGWYYYY.',
        '..YWWGGGGGWWY...',
        'Y..YWWGGGWWY..Y.',
        '....YWWWWWY.....',
        '.....YYYYY......',
        '..Y..Y.Y.Y..Y...',
        '....Y..Y..Y.....',
        '...Y.......Y....',
        '................'
      ]
    },
    {
      id: 'sun-f',
      label: 'Sun F',
      rows: [
        '.......Y........',
        '..Y....Y....Y...',
        '....Y..Y..Y.....',
        'Y....Y.Y.Y....Y.',
        '....YWWWWWY.....',
        '...YWWGGGWWY....',
        '..YWWGGGGGWWY...',
        'YYYYWGGGGGWYYYY.',
        '..YWWGGGGGWWY...',
        '...YWWGGGWWY....',
        '....YWWWWWY.....',
        'Y....Y.Y.Y....Y.',
        '....Y..Y..Y.....',
        '..Y....Y....Y...',
        '.......Y........',
        '................'
      ]
    }
  ],
  layers: [
    {
      id: 'layers-a',
      label: 'Layers A',
      rows: [
        '................',
        '................',
        '....WWWWWWW.....',
        '....W.....W.....',
        '....W.....W.....',
        '....WWWWWWW.....',
        '...GGGGGGGGG....',
        '...G.......G....',
        '...G.......G....',
        '...GGGGGGGGG....',
        '....WWWWWWW.....',
        '....W.....W.....',
        '....W.....W.....',
        '....WWWWWWW.....',
        '................',
        '................'
      ]
    },
    {
      id: 'layers-b',
      label: 'Layers B',
      rows: [
        '................',
        '................',
        '.....WWWWW......',
        '....WW...WW.....',
        '...WW.....WW....',
        '....WW...WW.....',
        '.....WWWWW......',
        '....GGGGGGG.....',
        '...GG.....GG....',
        '....GG...GG.....',
        '.....GGGGG......',
        '....WWWWWWW.....',
        '...WW.....WW....',
        '....WWWWWWW.....',
        '................',
        '................'
      ]
    },
    {
      id: 'layers-c',
      label: 'Layers C',
      rows: [
        '................',
        '................',
        '....WWWWWWWW....',
        '....W......W....',
        '....WWWWWWWW....',
        '................',
        '....GGGGGGGG....',
        '....G......G....',
        '....GGGGGGGG....',
        '................',
        '....WWWWWWWW....',
        '....W......W....',
        '....WWWWWWWW....',
        '................',
        '................',
        '................'
      ]
    },
    {
      id: 'layers-d',
      label: 'Layers D',
      rows: [
        '................',
        '................',
        '.....WWWWWW.....',
        '....WW....WW....',
        '...WW......WW...',
        '....WW....WW....',
        '.....WWWWWW.....',
        '....GGGGGGGG....',
        '...GG......GG...',
        '....GG....GG....',
        '.....GGGGGG.....',
        '.....WWWWWW.....',
        '....WW....WW....',
        '.....WWWWWW.....',
        '................',
        '................'
      ]
    },
    {
      id: 'layers-e',
      label: 'Layers E',
      rows: [
        '................',
        '................',
        '....WWWWWWWW....',
        '....W......W....',
        '....W......W....',
        '....WWWWWWWW....',
        '................',
        '....GGGGGGGG....',
        '....G......G....',
        '....GGGGGGGG....',
        '................',
        '....WWWWWWWW....',
        '....W......W....',
        '....WWWWWWWW....',
        '................',
        '................'
      ]
    },
    {
      id: 'layers-f',
      label: 'Layers F',
      rows: [
        '................',
        '................',
        '...WWWWWWWW.....',
        '...W......W.....',
        '...WWWWWWWW.....',
        '.....GGGGGGGG...',
        '.....G......G...',
        '.....GGGGGGGG...',
        '...WWWWWWWW.....',
        '...W......W.....',
        '...WWWWWWWW.....',
        '.....GGGGGGGG...',
        '.....G......G...',
        '.....GGGGGGGG...',
        '................',
        '................'
      ]
    }
  ]
};

const selected = {
  moon: 'moon-b',
  sun: 'sun-d',
  layers: 'layers-a'
};
const editor = {
  paint: 'W',
  rows: emptyRows(),
  cells: [],
  drawing: false
};

function emptyRows(value = '.') {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => value));
}

function copyRows(rows) {
  return rows.map((row) => [...row]);
}

function rowsFromText(text) {
  const lines = String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim().toUpperCase())
    .filter(Boolean);
  if (lines.length !== SIZE) {
    throw new Error(`Expected ${SIZE} rows, got ${lines.length}.`);
  }
  for (const line of lines) {
    if (line.length !== SIZE) {
      throw new Error(`Each row must be ${SIZE} characters.`);
    }
    if (/[^.WGY]/.test(line)) {
      throw new Error('Only ., W, G, and Y are supported.');
    }
  }
  return lines.map((line) => line.split(''));
}

function rowsToText(rows = editor.rows) {
  return rows.map((row) => row.join('')).join('\n');
}

function drawIcon(canvas, rows) {
  const context = canvas.getContext('2d', { alpha: true });
  canvas.width = SIZE;
  canvas.height = SIZE;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, SIZE, SIZE);

  for (let y = 0; y < SIZE; y += 1) {
    const row = rows[y] || '';
    for (let x = 0; x < SIZE; x += 1) {
      const color = PALETTE[row[x]];
      if (!color) continue;
      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
      context.fillRect(x, y, 1, 1);
    }
  }
}

function status(message) {
  const element = document.querySelector('#copy-status');
  if (element) {
    element.textContent = message;
  }
}

function iconById(id) {
  return Object.values(OPTIONS).flat().find((option) => option.id === id);
}

function optionEntries() {
  return Object.entries(OPTIONS).flatMap(([group, options]) => options.map((option) => ({ group, option })));
}

function assertIconRows() {
  for (const [group, options] of Object.entries(OPTIONS)) {
    for (const option of options) {
      if (option.rows.length !== SIZE || option.rows.some((row) => row.length !== SIZE)) {
        throw new Error(`${group}/${option.id} must be ${SIZE}x${SIZE}.`);
      }
    }
  }
}

function updateEditor() {
  for (const cell of editor.cells) {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    const value = editor.rows[y][x];
    cell.dataset.value = value;
    cell.setAttribute('aria-label', `Column ${x + 1}, row ${y + 1}, ${value === '.' ? 'transparent' : value}`);
  }
  const output = document.querySelector('#grid-output');
  if (output) {
    output.value = rowsToText();
  }
  const preview = document.querySelector('#editor-preview-icon');
  if (preview) {
    drawIcon(preview, editor.rows.map((row) => row.join('')));
  }
}

function setEditorRows(rows, message = '') {
  editor.rows = copyRows(rows);
  updateEditor();
  status(message);
}

function paintCell(cell) {
  if (!cell?.dataset) return;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return;
  editor.rows[y][x] = editor.paint;
  updateEditor();
}

function syncSwatches() {
  for (const swatch of document.querySelectorAll('.swatch')) {
    swatch.setAttribute('aria-pressed', swatch.dataset.value === editor.paint ? 'true' : 'false');
  }
}

function buildEditor() {
  const grid = document.querySelector('#pixel-editor');
  grid.replaceChildren();
  editor.cells = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const cell = document.createElement('button');
      cell.className = 'pixel-cell';
      cell.type = 'button';
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.setAttribute('role', 'gridcell');
      cell.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        editor.drawing = true;
        cell.setPointerCapture?.(event.pointerId);
        paintCell(cell);
      });
      cell.addEventListener('pointerenter', () => {
        if (editor.drawing) {
          paintCell(cell);
        }
      });
      cell.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          paintCell(cell);
        }
      });
      grid.append(cell);
      editor.cells.push(cell);
    }
  }
  window.addEventListener('pointerup', () => {
    editor.drawing = false;
  });
}

function bindEditorControls() {
  for (const swatch of document.querySelectorAll('.swatch')) {
    swatch.addEventListener('click', () => {
      editor.paint = swatch.dataset.value || '.';
      syncSwatches();
    });
  }

  const select = document.querySelector('#candidate-select');
  for (const { group, option } of optionEntries()) {
    const item = document.createElement('option');
    item.value = option.id;
    item.textContent = `${group} / ${option.id}`;
    select.append(item);
  }
  select.value = selected.moon;

  document.querySelector('#load-candidate').addEventListener('click', () => {
    const option = iconById(select.value);
    if (option) {
      setEditorRows(option.rows.map((row) => row.split('')), `${option.id} loaded`);
    }
  });
  document.querySelector('#clear-editor').addEventListener('click', () => {
    setEditorRows(emptyRows(), 'Cleared');
  });
  document.querySelector('#fill-editor').addEventListener('click', () => {
    setEditorRows(emptyRows(editor.paint), `Filled with ${editor.paint}`);
  });
  document.querySelector('#apply-output').addEventListener('click', () => {
    try {
      setEditorRows(rowsFromText(document.querySelector('#grid-output').value), 'Applied text');
    } catch (error) {
      status(error.message);
    }
  });
  document.querySelector('#copy-output').addEventListener('click', async () => {
    const output = document.querySelector('#grid-output');
    const text = rowsToText();
    output.value = text;
    try {
      await navigator.clipboard.writeText(text);
      status('Copied grid to clipboard');
    } catch {
      output.focus();
      output.select();
      const copied = document.execCommand?.('copy');
      status(copied ? 'Copied grid to clipboard' : 'Select the text and copy it');
    }
  });
}

function renderPreview() {
  const row = document.querySelector('#preview-row');
  row.replaceChildren();
  const previewItems = [
    ['Night active', selected.moon],
    ['Day active', selected.sun],
    ['Layers', selected.layers]
  ];

  for (const [label, iconId] of previewItems) {
    const wrap = document.createElement('div');
    const button = document.createElement('button');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('span');
    wrap.className = 'preview-item';
    button.className = 'chrome-button frame-soft';
    button.type = 'button';
    button.setAttribute('aria-label', `${label} preview`);
    canvas.className = 'chrome-icon';
    canvas.setAttribute('aria-hidden', 'true');
    caption.className = 'caption';
    caption.textContent = `${label}: ${iconId}`;
    button.append(canvas);
    wrap.append(button, caption);
    row.append(wrap);
    drawIcon(canvas, iconById(iconId).rows);
  }

  for (const canvas of document.querySelectorAll('[data-icon]')) {
    drawIcon(canvas, iconById(canvas.dataset.icon).rows);
  }
}

function renderGroup(group) {
  const container = document.querySelector(`#${group}-options`);
  container.replaceChildren();
  for (const option of OPTIONS[group]) {
    const card = document.createElement('button');
    const button = document.createElement('span');
    const canvas = document.createElement('canvas');
    const id = document.createElement('span');
    card.className = 'option-card';
    card.type = 'button';
    card.setAttribute('aria-pressed', selected[group] === option.id ? 'true' : 'false');
    card.setAttribute('aria-label', `${option.label} option`);
    button.className = 'chrome-button frame-soft';
    canvas.className = 'chrome-icon';
    canvas.setAttribute('aria-hidden', 'true');
    id.className = 'option-id';
    id.textContent = option.id;
    button.append(canvas);
    card.append(button, id);
    card.addEventListener('click', () => {
      selected[group] = option.id;
      document.querySelector('#candidate-select').value = option.id;
      setEditorRows(option.rows.map((row) => row.split('')), `${option.id} loaded`);
      renderAll();
    });
    container.append(card);
    drawIcon(canvas, option.rows);
  }
}

function renderAll() {
  renderPreview();
  for (const group of Object.keys(OPTIONS)) {
    renderGroup(group);
  }
}

assertIconRows();
buildEditor();
bindEditorControls();
syncSwatches();
setEditorRows(iconById(selected.moon).rows.map((row) => row.split('')), 'moon-b loaded');
renderAll();
