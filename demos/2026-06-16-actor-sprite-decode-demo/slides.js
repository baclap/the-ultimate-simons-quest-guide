(function () {
  'use strict';

  const evidence = window.ACTOR_SPRITE_EVIDENCE || {};
  const slidesRoot = document.getElementById('slides');
  const chapterEl = document.getElementById('chapter');
  const counterEl = document.getElementById('counter');
  const progressEl = document.getElementById('progress');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tag(label, type = '') {
    return `<span class="tag ${escapeHtml(type)}">${escapeHtml(label)}</span>`;
  }

  function statRow(items) {
    return [
      '<div class="stat-row">',
      ...items.map(([value, label]) => (
        `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
      )),
      '</div>'
    ].join('');
  }

  function figure(src, caption, extraClass = '') {
    return [
      `<figure class="figure-card ${escapeHtml(extraClass)}">`,
      `<img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}">`,
      `<figcaption>${escapeHtml(caption)}</figcaption>`,
      '</figure>'
    ].join('');
  }

  function codeCard(title, code) {
    return [
      '<div class="code-card">',
      `<header><strong>${escapeHtml(title)}</strong></header>`,
      `<pre><code>${escapeHtml(code)}</code></pre>`,
      '</div>'
    ].join('');
  }

  function table(headers, rows) {
    return [
      '<div class="table-wrap">',
      '<table>',
      '<thead><tr>',
      ...headers.map((header) => `<th>${escapeHtml(header)}</th>`),
      '</tr></thead>',
      '<tbody>',
      ...rows,
      '</tbody>',
      '</table>',
      '</div>'
    ].join('');
  }

  function bulletList(items) {
    return [
      '<ul class="list">',
      ...items.map((item) => `<li>${item}</li>`),
      '</ul>'
    ].join('');
  }

  function selectorByKey(key) {
    return (evidence.selectors || []).find((selector) => selector.key === key) || {};
  }

  function spriteCard(selector) {
    const attrs = Array.from(new Set((selector.sprites || []).map((sprite) => sprite.attrHex))).join(', ');
    const tiles = (selector.sprites || []).map((sprite) => sprite.tileHex).join(' ');
    return [
      '<article class="sprite-card">',
      `<img src="${escapeHtml(selector.image)}" alt="${escapeHtml(selector.label)}">`,
      '<div>',
      `<h3>${escapeHtml(selector.label)}</h3>`,
      `<div class="tag-row">${tag(selector.selectorHex, 'gold')}${tag(selector.status, selector.status.includes('proven') ? 'green' : 'blue')}${tag(`${selector.count} OAM entries`)}</div>`,
      `<p class="micro">Pointer <code>${escapeHtml(selector.pointerHex)}</code>, tiles <code>${escapeHtml(tiles)}</code>, attrs <code>${escapeHtml(attrs)}</code>.</p>`,
      `<p class="micro">${escapeHtml(selector.proof)}</p>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function selectorTable() {
    return table(
      ['Selector', 'Pointer', 'Count', 'Tiles', 'Attrs', 'Status'],
      (evidence.selectors || []).map((selector) => [
        '<tr>',
        `<td><code>${escapeHtml(selector.selectorHex)}</code><br>${escapeHtml(selector.label)}</td>`,
        `<td><code>${escapeHtml(selector.tableOffsetHex)}</code> -> <code>${escapeHtml(selector.pointerHex)}</code><br><span class="muted">${escapeHtml(selector.fileOffsetHex)}</span></td>`,
        `<td>${escapeHtml(selector.count)}</td>`,
        `<td><code>${escapeHtml(selector.sprites.map((sprite) => sprite.tileHex).join(' '))}</code></td>`,
        `<td><code>${escapeHtml(Array.from(new Set(selector.sprites.map((sprite) => sprite.attrHex))).join(' '))}</code></td>`,
        `<td>${tag(selector.status, selector.status.includes('proven') ? 'green' : 'blue')}</td>`,
        '</tr>'
      ].join(''))
    );
  }

  function classMatrix() {
    return table(
      ['Actor', 'Rows', 'Behavior', 'Art status', 'Evidence'],
      (evidence.classSummary || []).map((actor) => [
        '<tr>',
        `<td><strong>${escapeHtml(actor.label)}</strong><br><code>${escapeHtml(actor.idHex)}</code></td>`,
        `<td>${escapeHtml(actor.placements)}<br><span class="muted">${escapeHtml(actor.locations.join(', '))}</span></td>`,
        `<td>${actor.day ? tag('day', 'green') : tag('no day')}${actor.night ? tag('night', 'blue') : tag('no night')} ${actor.hpNight.length ? tag(`HP ${actor.hpDay.join('/') || '-'} -> ${actor.hpNight.join('/')}`, 'gold') : ''}</td>`,
        `<td>${actor.selectorHex ? tag(actor.selectorHex, 'green') : tag(actor.artStatus, 'bad')}</td>`,
        `<td>${escapeHtml(actor.evidence)}</td>`,
        '</tr>'
      ].join(''))
    );
  }

  function spriteRows(selector) {
    return (selector.sprites || []).map((sprite) => (
      `${sprite.index}: tile ${sprite.tileHex}, attr ${sprite.attrHex}, x ${sprite.xOffset}, y ${sprite.yOffset}`
    )).join('\n');
  }

  function merchantTable() {
    const ordinary = evidence.ordinaryTextRows || [];
    const merchant = evidence.merchantRows || [];
    return table(
      ['Row', 'Path', 'Text offset', 'Decoded text'],
      [
        ...ordinary.slice(0, 5).map((row) => [
          '<tr>',
          `<td><code>${escapeHtml(row.pointerHex)}</code><br><code>${escapeHtml(row.rawBytesHex)}</code></td>`,
          `<td>${tag('row-data text index', 'green')}<br>data <code>${escapeHtml(row.dataHex)}</code></td>`,
          `<td><code>${escapeHtml(row.textOffsetHex)}</code></td>`,
          `<td>${escapeHtml(row.text).replace(/\n/g, '<br>')}</td>`,
          '</tr>'
        ].join('')),
        ...merchant.map((row) => [
          '<tr>',
          `<td><code>${escapeHtml(row.pointerHex)}</code><br><code>${escapeHtml(row.rawBytesHex)}</code></td>`,
          `<td>${tag('merchant routine', 'gold')}<br>row data <code>${escapeHtml(row.dataHex)}</code> is not the text index</td>`,
          `<td><code>${escapeHtml(row.textOffsetHex)}</code><br><span class="muted">text-table index 0x32</span></td>`,
          `<td>${escapeHtml(row.text).replace(/\n/g, '<br>')}</td>`,
          '</tr>'
        ].join(''))
      ]
    );
  }

  function verosTable() {
    return table(
      ['Location', 'Offset', 'Bytes', 'Pixel position', 'Current interpretation'],
      (evidence.verosChunks || []).map((chunk) => [
        '<tr>',
        `<td>${escapeHtml(chunk.location)}</td>`,
        `<td><code>${escapeHtml(chunk.offsetHex)}</code></td>`,
        `<td><code>${escapeHtml(chunk.rawBytesHex)}</code></td>`,
        `<td>${escapeHtml(chunk.pixelX)}, ${escapeHtml(chunk.pixelY)}</td>`,
        `<td>${escapeHtml(chunk.interpretation)}</td>`,
        '</tr>'
      ].join(''))
    );
  }

  function routeRowsTable() {
    return table(
      ['Location', 'Offset', 'Bytes', 'Actor', 'Position', 'Text/HP payload'],
      (evidence.routeRows || []).map((row) => [
        '<tr>',
        `<td>${escapeHtml(row.locationLabel)}</td>`,
        `<td><code>${escapeHtml(row.pointerHex)}</code></td>`,
        `<td><code>${escapeHtml(row.rawBytesHex)}</code></td>`,
        `<td>${escapeHtml(row.label)}<br><code>${escapeHtml(row.idHex)}</code></td>`,
        `<td>tile ${escapeHtml(row.x)}, ${escapeHtml(row.y)}<br><span class="muted">pixel ${escapeHtml(row.pixelX)}, ${escapeHtml(row.pixelY)}</span></td>`,
        `<td><code>${escapeHtml(row.dataHex)}</code>${row.text ? `<br>${escapeHtml(row.text).replace(/\n/g, '<br>')}` : ''}</td>`,
        '</tr>'
      ].join(''))
    );
  }

  const simon = selectorByKey('simon-stand');
  const shepherd = selectorByKey('jova-shepherd');
  const merchant = selectorByKey('jova-merchant');

  const slides = [
    {
      id: 'overview',
      chapter: 'Answer',
      eyebrow: 'Sprint Demo',
      title: 'Actor sprites are partly unwound now, with the gaps left visible',
      lede: 'This milestone adds a real metasprite decoder and proves two Jova NPC sprite bindings from runtime CPU/OAM state. It also tightens the merchant-text story and reclassifies the Veros mystery bytes as row-like control chunks, not ignored debris.',
      html: () => [
        statRow([
          [evidence.summary.routeActorRows, 'route actor rows'],
          [evidence.summary.uniqueActorIds, 'unique actor ids'],
          [evidence.summary.provenRuntimeSpriteBindings, 'sprite bindings proven'],
          [evidence.summary.verosControlChunks, 'Veros chunks isolated']
        ]),
        '<div class="map-strip">',
        figure(evidence.images.townDay, 'Town of Jova day: rows and text are already ROM-backed.'),
        figure(evidence.images.townNight, 'Town of Jova night: zombie rows replace most NPC rows.'),
        '</div>'
      ].join('')
    },
    {
      id: 'takeaway',
      chapter: 'Answer',
      eyebrow: 'Plain English',
      title: 'What changed since the prior actor catalog',
      lede: 'The prior deck proved where actors are and what many of them say or how much HP they have. This one starts proving how the game decides what those actors look like.',
      html: () => [
        '<div class="grid two">',
        '<article class="callout green"><strong>Now proven</strong>',
        bulletList([
          'A decoded metasprite stream can reproduce known OAM tile output.',
          'The Jova shepherd-style NPC row binds to selector <code>0x24</code> in a live capture.',
          'The Jova white-crystal merchant row binds to selector <code>0x1E</code> in a live capture.',
          'Sprite palette choice is read from the metasprite/OAM attribute byte, not guessed from screenshots.'
        ]),
        '</article>',
        '<article class="callout warn"><strong>Still not promoted</strong><p>Route enemy art is not marked final yet. The common enemy selector routine has been located, but the actor-id-to-selector binding still needs targeted runtime capture or instruction tracing.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'pipeline',
      chapter: 'Model',
      eyebrow: 'Mental Model',
      title: 'An actor is a row first, then a slot, then a sprite',
      lede: 'This is the key web-developer translation: the four-byte row is like compact immutable data. Runtime code expands it into RAM fields, and the renderer turns those fields into OAM sprite entries.',
      html: () => [
        '<div class="pipeline">',
        '<div class="step"><strong>ROM row</strong><p><code>x y id data</code><br>Example: <code>34 12 AE 07</code></p></div>',
        '<div class="step"><strong>Actor slot</strong><p>The loader writes position, active id, data/HP, and state into low RAM.</p></div>',
        '<div class="step"><strong>Behavior code</strong><p>The actor routine writes a metasprite selector into <code>$0300,x</code>.</p></div>',
        '<div class="step"><strong>Metasprite stream</strong><p>The selector points into <code>$AC30</code> or <code>$AD30</code>.</p></div>',
        '<div class="step"><strong>OAM</strong><p>The game emits Y, tile, attr, and X bytes into sprite memory.</p></div>',
        '</div>'
      ].join('')
    },
    {
      id: 'selector-loader',
      chapter: 'ROM',
      eyebrow: 'ROM Path',
      title: 'The selector path is anchored at $AB93',
      lede: 'The draw path copies each actor slot’s palette/position/facing fields, then uses $0300,x as an index into the low or high metasprite pointer table.',
      html: () => [
        '<div class="grid two">',
        codeCard('Selector Loader', evidence.sourceSnippets.selectorLoader),
        '<article class="callout"><strong>Why this matters</strong><p>Once an actor class writes <code>$0300,x</code>, the art is no longer a mystery. The remaining task is binding each actor id to the selector it actually writes at runtime.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'simon-calibration',
      chapter: 'Decoder',
      eyebrow: 'Calibration',
      title: 'Simon proves the metasprite decoder is reading the stream correctly',
      lede: 'A Jova capture gives Simon selector 0x04. The decoder follows $AC30 to $B172, reuses the shared shape stream at $B161, and emits tiles 03/05/07/09, matching the captured OAM pattern.',
      html: () => [
        '<div class="grid two">',
        spriteCard(simon),
        codeCard('Decoded OAM entries', spriteRows(simon)),
        '</div>'
      ].join('')
    },
    {
      id: 'proven-npcs',
      chapter: 'Sprites',
      eyebrow: 'Runtime Bindings',
      title: 'Two Jova NPC sprite bindings are now ROM-and-runtime backed',
      lede: 'These are the strongest new end results: the sprite art is rendered from PPU pattern/palette memory plus decoded metasprite streams, and the selector binding comes from live actor slots.',
      html: () => [
        '<div class="sprite-grid">',
        spriteCard(shepherd),
        spriteCard(merchant),
        figure(evidence.images.runtimeShepherd, 'Runtime sprite overlay that contains the Jova shepherd-style actor.', 'sprite'),
        '</div>'
      ].join('')
    },
    {
      id: 'palette-attributes',
      chapter: 'Sprites',
      eyebrow: 'Palette',
      title: 'Palette selection rides in the sprite attribute byte',
      lede: 'The metasprite stream does not merely name tiles. Each OAM entry also carries an attribute byte. The low two bits select one of the four sprite palettes in PPU palette memory; the higher bits carry priority and flips.',
      html: () => [
        '<div class="grid two">',
        selectorTable(),
        '<article class="callout green"><strong>Useful consequence</strong><p>The shepherd selector emits attr <code>0x02</code>, so it uses sprite palette 2. The merchant emits attr <code>0x03</code>, so it uses sprite palette 3. That is a ROM/PPU-backed color choice, not a screenshot color pick.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'class-matrix',
      chapter: 'Catalog',
      eyebrow: 'Actor Classes',
      title: 'Which actor classes are guide-ready, and which are not',
      lede: 'This table is intentionally conservative. Location, text, and HP can be guide-ready while art remains blocked for that same actor id.',
      wide: true,
      html: classMatrix
    },
    {
      id: 'merchant-exception',
      chapter: 'Text',
      eyebrow: 'Merchant Text',
      title: 'The Jova merchant is not an ordinary text-row lookup',
      lede: 'The row is 34 12 AE 07. If 07 were a normal text-table index, it would not land on “buy a white crystal?” The prompt is text-table index 0x32 at file D24A, so the merchant path has to be treated as a sale/dialog routine.',
      html: () => [
        '<div class="grid two">',
        codeCard('Merchant evidence', evidence.sourceSnippets.merchantRows),
        '<article class="callout warn"><strong>No shortcut rule</strong><p>The guide may show the white-crystal prompt because the bytes are in the ROM and the row is a merchant row. It should not claim the ordinary row-data text path for that merchant.</p></article>',
        '</div>',
        merchantTable()
      ].join('')
    },
    {
      id: 'enemy-routine',
      chapter: 'Enemies',
      eyebrow: 'Enemy Art',
      title: 'The shared enemy selector routine is found, but not closed',
      lede: 'The common enemy path reads $0456,x, chooses data from $82E9 or $830F, ORs in the high bit, and stores the result in $0300,x. That explains how enemies flow into the high selector table, but the route id-to-selector binding still needs proof.',
      html: () => [
        '<div class="grid two">',
        codeCard('Enemy selector routine', evidence.sourceSnippets.enemySelector),
        '<article class="callout bad"><strong>Why enemies stay unresolved here</strong><p>The route rows prove skeleton/fishman/werewolf/zombie ids and HP. The art still needs a targeted capture or instruction trace that catches those actor slots after their behavior routine writes <code>$0300,x</code>.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'selector-atlas',
      chapter: 'Enemies',
      eyebrow: 'Decoded Candidates',
      title: 'The high-selector atlas shows real decoded sprites without naming them yet',
      lede: 'This atlas is generated from selectors 0x80 through 0xAF using Jova Woods PPU pattern/palette memory. It is evidence that the decoder works broadly, not evidence that every image has been assigned to a route actor.',
      html: () => [
        figure(evidence.images.highSelectorAtlas, 'Decoded high-table selector atlas, intentionally unlabeled.', 'atlas'),
        '<div class="callout warn"><strong>Review point</strong><p>It would be easy to eyeball these and label enemies by resemblance. This deck does not do that. The binding has to come from runtime slots or traced ROM control flow.</p></div>'
      ].join('')
    },
    {
      id: 'veros-chunks',
      chapter: 'Rows',
      eyebrow: 'Veros Chunks',
      title: 'The Veros chunks are row-like, but still not promoted to actors',
      lede: 'The two chunks sit inside the actor-list windows exactly where ordinary rows live. Their bytes parse cleanly as x, y, id 0x43, data 0x00. The safe claim is that they are actor-stream records with an unresolved id 0x43 behavior.',
      html: () => [
        codeCard('Raw chunks', evidence.sourceSnippets.verosRows),
        verosTable()
      ].join('')
    },
    {
      id: 'raw-rows',
      chapter: 'Audit',
      eyebrow: 'Audit Surface',
      title: 'The full route row table remains the source of truth',
      lede: 'Every actor overlay in the future guide should be traceable back to a row here, plus any additional selector/text routine proof needed for the thing being rendered.',
      wide: true,
      html: routeRowsTable
    },
    {
      id: 'ready',
      chapter: 'Review',
      eyebrow: 'Guide Impact',
      title: 'What can move toward the guide now',
      lede: 'The useful thing about this milestone is that it narrows the next guide work instead of making the whole feature feel foggy.',
      html: () => [
        '<div class="grid two">',
        '<article class="callout green"><strong>Ready to model</strong><p>Actor rows, exact map positions, day/night visibility, enemy HP values, ordinary NPC/sign text, and two NPC sprite bindings for Jova review UI.</p></article>',
        '<article class="callout warn"><strong>Still research-gated</strong><p>Enemy sprite identity, all remaining town-person sprite variants, exact sign/fixture rendering, and the final merchant row-data-to-dialog selector routine.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'next-step',
      chapter: 'Review',
      eyebrow: 'Next Step',
      title: 'The next no-shortcut move is targeted runtime actor tracing',
      lede: 'The fastest honest path is not more manual labeling. It is a small set of captures/traces that places each route actor class on screen and records its active id, $0300 selector, $0312 attributes, $0324/$0348 position, and OAM output.',
      html: () => [
        '<div class="grid three">',
        '<article class="card"><strong>1. Enemy slots</strong><p>Capture Jova Woods, bridge fishmen, and Jova night zombies while each actor is visible and active.</p></article>',
        '<article class="card"><strong>2. NPC variants</strong><p>Move through Jova to bind 0xA8, 0xAA, and all B5 rows to selectors, not just the two captured examples.</p></article>',
        '<article class="card"><strong>3. Merchant routine</strong><p>Trace the sale/dialog code path far enough to explain how merchant row data becomes the text selector.</p></article>',
        '</div>',
        '<div class="callout"><strong>Bottom line</strong><p>This demo advances the sprite pipeline from “unknown” to “decoder working, two bindings proven, enemy bindings explicitly pending.” That is progress, but it is not permission to fake the remaining actor art.</p></div>'
      ].join('')
    }
  ];

  let currentIndex = 0;

  function renderSlides() {
    slidesRoot.innerHTML = slides.map((slide) => [
      `<section class="slide" id="${escapeHtml(slide.id)}" tabindex="-1">`,
      `<div class="slide-copy ${slide.wide ? 'wide' : ''}">`,
      `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>`,
      `<h1>${escapeHtml(slide.title)}</h1>`,
      `<p class="lede">${escapeHtml(slide.lede)}</p>`,
      slide.html(),
      '</div>',
      '</section>'
    ].join('')).join('');
  }

  function showSlide(index, pushHash = true) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    const sections = Array.from(document.querySelectorAll('.slide'));
    sections.forEach((section, sectionIndex) => {
      section.classList.toggle('active', sectionIndex === currentIndex);
    });
    const slide = slides[currentIndex];
    chapterEl.textContent = slide.chapter;
    counterEl.textContent = `${currentIndex + 1}/${slides.length}`;
    progressEl.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    if (pushHash && window.location.hash !== `#${slide.id}`) {
      history.pushState(null, '', `#${slide.id}`);
    }
    sections[currentIndex]?.focus({ preventScroll: true });
  }

  function indexFromHash() {
    const id = window.location.hash.replace(/^#/, '');
    const index = slides.findIndex((slide) => slide.id === id);
    return index >= 0 ? index : 0;
  }

  prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') showSlide(currentIndex - 1);
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') showSlide(currentIndex + 1);
  });
  window.addEventListener('hashchange', () => showSlide(indexFromHash(), false));

  renderSlides();
  showSlide(indexFromHash(), false);
}());
