(function () {
  'use strict';

  const catalog = window.ROM_ACTOR_CATALOG || {};
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

  function textLines(value) {
    return escapeHtml(value || '').replace(/\n/g, '<br>');
  }

  function byteHex(value) {
    if (value == null || Number.isNaN(Number(value))) return '';
    return `0x${Number(value).toString(16).toUpperCase().padStart(2, '0')}`;
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

  function table(headers, rows, className = '') {
    return [
      `<div class="table-wrap ${escapeHtml(className)}">`,
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

  function codeCard(title, code) {
    return [
      '<div class="code-card">',
      `<header><strong>${escapeHtml(title)}</strong></header>`,
      `<pre><code>${escapeHtml(code)}</code></pre>`,
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

  function bulletList(items, className = 'list') {
    return [
      `<ul class="${escapeHtml(className)}">`,
      ...items.map((item) => `<li>${item}</li>`),
      '</ul>'
    ].join('');
  }

  function statusForActor(actor) {
    const tags = [];
    tags.push(actor.day ? tag('day', 'green') : tag('no day', 'muted-tag'));
    tags.push(actor.night ? tag('night', 'blue') : tag('no night', 'muted-tag'));
    if (actor.kind === 'enemy') {
      tags.push(tag(`HP ${actor.hpDayValues.length ? actor.hpDayValues.join('/') : '-'} -> ${actor.hpNightValues.length ? actor.hpNightValues.join('/') : '-'}`, 'red'));
    }
    if (actor.textCount) tags.push(tag(`${actor.textCount} text`, 'gold'));
    if (actor.rowMismatchCount) tags.push(tag('ROM id mismatch', 'bad'));
    if (actor.selectorStatuses.includes('merchant-routine-needed')) tags.push(tag('selector gap', 'bad'));
    return tags.join('');
  }

  function rosterCards() {
    return [
      '<div class="actor-grid">',
      ...catalog.uniqueActors.map((actor) => [
        `<article class="actor-card ${escapeHtml(actor.kind)}">`,
        '<div class="actor-id">',
        `<strong>${escapeHtml(actor.idHex)}</strong>`,
        `<span>${escapeHtml(actor.kind)}</span>`,
        '</div>',
        `<h3>${escapeHtml(actor.label)}</h3>`,
        `<p>${escapeHtml(actor.placementCount)} placement${actor.placementCount === 1 ? '' : 's'} in ${escapeHtml(actor.locations.join(', '))}</p>`,
        `<div class="tag-row">${statusForActor(actor)}</div>`,
        `<p class="micro">${escapeHtml(actor.nameConfidence)}</p>`,
        '</article>'
      ].join('')),
      '</div>'
    ].join('');
  }

  function pinTooltip(pin, variant) {
    const parts = [
      `${pin.label} ${pin.idHex}`,
      `${pin.pointerHex}: ${pin.rawBytesHex}`,
      `tile (${pin.x}, ${pin.y}) -> pixel (${pin.pixelX}, ${pin.pixelY})`
    ];
    if (pin.dayHp != null || pin.nightHp != null) {
      parts.push(`${variant === 'night' ? 'night' : 'day'} HP ${variant === 'night' ? pin.nightHp : pin.dayHp}`);
    }
    if (pin.text) parts.push(pin.text.replace(/\n/g, ' / '));
    return parts.join('\n');
  }

  function mapPanel(panel, variant, opts = {}) {
    const image = panel?.[variant];
    if (!image) return '';
    return [
      `<article class="map-card ${opts.compact ? 'compact' : ''}">`,
      '<header>',
      `<div><strong>${escapeHtml(panel.label)}</strong><span>${escapeHtml(variant)} - ${escapeHtml(panel.context)}</span></div>`,
      `<span>${escapeHtml(image.pins.length)} pin${image.pins.length === 1 ? '' : 's'}</span>`,
      '</header>',
      '<div class="map-stage">',
      `<img src="${escapeHtml(image.demoSrc)}" alt="${escapeHtml(panel.label)} ${escapeHtml(variant)} render">`,
      ...image.pins.map((pin) => [
        `<button class="pin ${escapeHtml(pin.kind)}" type="button" style="left:${pin.leftPct}%;top:${pin.topPct}%;" title="${escapeHtml(pinTooltip(pin, variant))}" aria-label="${escapeHtml(pinTooltip(pin, variant))}">`,
        `<span>${escapeHtml(pin.idHex)}</span>`,
        '</button>'
      ].join('')),
      '</div>',
      '</article>'
    ].join('');
  }

  function routeMapGrid(variant = 'day') {
    const panels = catalog.mapPanels.filter((panel) => panel.label !== 'Town of Jova' && panel.label !== 'Berkeley Mansion - Door');
    return [
      '<div class="map-grid">',
      ...panels.map((panel) => mapPanel(panel, variant, { compact: true })),
      '</div>'
    ].join('');
  }

  function actorRowsTable() {
    const rows = catalog.routeLocations.flatMap((loc) => (
      loc.actors.map((actor) => [
        '<tr>',
        `<td><strong>${escapeHtml(loc.label)}</strong><br><code>${escapeHtml(loc.context)}</code></td>`,
        `<td><code>${escapeHtml(actor.pointerHex)}</code></td>`,
        `<td><code>${escapeHtml(actor.rawBytesHex)}</code></td>`,
        `<td>${escapeHtml(actor.effectiveLabel)}<br><code>${escapeHtml(actor.rawIdHex)}</code></td>`,
        `<td>${escapeHtml(actor.x)}, ${escapeHtml(actor.y)}<br><span class="muted">${escapeHtml(actor.pixelX)}, ${escapeHtml(actor.pixelY)} px</span></td>`,
        `<td>${actor.rowMatchesRom ? tag('match', 'green') : tag('ROM wins', 'bad')}</td>`,
        '</tr>'
      ].join(''))
    ));
    return table(['Segment', 'Offset', 'ROM bytes', 'Decoded actor', 'Position', 'Row'], rows, 'dense');
  }

  function hpTable() {
    return table(
      ['Actor', 'Placements', 'Day', 'Night', 'Day HP', 'Night HP', 'Proof'],
      catalog.hpRows.map((row) => [
        '<tr>',
        `<td><strong>${escapeHtml(row.label)}</strong><br><code>${escapeHtml(row.idHex)}</code></td>`,
        `<td>${escapeHtml(row.placements)}<br><span class="muted">${escapeHtml(row.locations)}</span></td>`,
        `<td>${escapeHtml(row.day)}</td>`,
        `<td>${escapeHtml(row.night)}</td>`,
        `<td>${escapeHtml(row.dayHp)}</td>`,
        `<td>${escapeHtml(row.nightHp)}</td>`,
        `<td>${escapeHtml(row.proof)}</td>`,
        '</tr>'
      ].join('')),
      'dense'
    );
  }

  function textTable() {
    return table(
      ['Actor row', 'Selector', 'Text pointer', 'ROM text', 'Status'],
      catalog.textRows.map((row) => [
        '<tr>',
        `<td><strong>${escapeHtml(row.label)}</strong> <code>${escapeHtml(row.idHex)}</code><br><code>${escapeHtml(row.pointerHex)}</code> <code>${escapeHtml(row.rawBytesHex)}</code></td>`,
        `<td>data <code>${escapeHtml(row.dataHex)}</code><br>index <code>${escapeHtml(row.textPointerIndexHex || 'n/a')}</code></td>`,
        `<td><code>${escapeHtml(row.textPointerHex)}</code><br><span class="muted">${escapeHtml(row.textTableOffsetHex || 'merchant routine pending')}</span></td>`,
        `<td class="text-sample">${textLines(row.decoded)}</td>`,
        `<td>${row.selectorStatus === 'row-data-index-proven' ? tag('proven', 'green') : tag('routine gap', 'bad')}<p class="micro">${escapeHtml(row.selectorProof)}</p></td>`,
        '</tr>'
      ].join('')),
      'dense'
    );
  }

  function pointerExamplesTable() {
    return table(
      ['Index', 'Pointer table offset', 'RAM pointer', 'ROM text offset', 'Decoded start'],
      catalog.textPointerTable.examples.map((example) => [
        '<tr>',
        `<td><code>${escapeHtml(example.indexHex)}</code></td>`,
        `<td><code>${escapeHtml(example.tableOffsetHex)}</code></td>`,
        `<td><code>${escapeHtml(example.ramPointerHex)}</code></td>`,
        `<td><code>${escapeHtml(example.fileOffsetHex)}</code></td>`,
        `<td class="text-sample">${textLines(example.decoded)}</td>`,
        '</tr>'
      ].join('')),
      'dense'
    );
  }

  function runtimePointerTable() {
    return table(
      ['Capture', 'Context', '$3D/$3E', 'Mapped file offset', 'Result'],
      catalog.runtimeCaptures.map((capture) => [
        '<tr>',
        `<td><strong>${escapeHtml(capture.label)}</strong><br><code>${escapeHtml(capture.id)}</code></td>`,
        `<td>objset <code>${escapeHtml(capture.runtime.objsetHex || byteHex(capture.runtime.objset))}</code>, area <code>${escapeHtml(capture.runtime.areaHex || byteHex(capture.runtime.area))}</code>, submap raw <code>${escapeHtml(capture.runtime.submapRawHex || byteHex(capture.runtime.submapRaw))}</code></td>`,
        `<td><code>${escapeHtml(capture.cpuPointerHex)}</code></td>`,
        `<td>bank ${escapeHtml(capture.mappedBank)} -> <code>${escapeHtml(capture.mappedFileOffsetHex)}</code></td>`,
        `<td>${capture.matchesFirstActor ? tag('first row matches', 'green') : tag('check needed', 'bad')}</td>`,
        '</tr>'
      ].join('')),
      'dense'
    );
  }

  function shortcutCards() {
    return [
      '<div class="grid two">',
      ...catalog.shortcuts.map((item) => [
        '<article class="callout warn">',
        `<strong>${escapeHtml(item.title)}</strong>`,
        `<p>${escapeHtml(item.detail)}</p>`,
        '</article>'
      ].join('')),
      '</div>'
    ].join('');
  }

  const coordinateSnippet = [
    'lda ($3d),y        ; row byte 0: x tile',
    'asl / rol $00      ; x * 16',
    'sbc $53 / sbc $54  ; subtract camera',
    'sta $01            ; visible X',
    '',
    'iny',
    'lda ($3d),y        ; row byte 1: y tile',
    'asl / rol $08      ; y * 16',
    'sbc $8c / sbc $8d  ; subtract vertical origin',
    'sta $09            ; visible Y'
  ].join('\n');

  const gateSnippet = [
    'lda $17            ; actor id byte',
    'bmi npc_path       ; ids >= 0x80 are NPC/fixture path',
    'lda $30',
    'bne enemy_load     ; non-town enemies load',
    'lda $82',
    'bne enemy_load     ; town enemies load at night',
    'jmp skip_actor     ; town enemies skipped by day',
    '',
    'npc_path:',
    'cmp #$a4',
    'beq npc_load       ; sign survives night',
    'lda $82',
    'bne skip_actor     ; other town NPCs skipped at night'
  ].join('\n');

  const hpSnippet = [
    'lda ($3d),y        ; row byte 3',
    'sta $93            ; enemy HP/data',
    'lda $82',
    'beq store_hp       ; day: keep base value',
    '... exception checks ...',
    'lda $93',
    "asl                ; night: double this route's enemy HP",
    'sta $93',
    'store_hp:',
    'sta $04c2,x'
  ].join('\n');

  const slides = [
    {
      id: 'overview',
      chapter: 'Answer',
      eyebrow: 'Take 2',
      title: 'The actor catalog is now a real review artifact',
      lede: 'This version stops treating “figure out enemies and NPCs” as a future checklist item. It lists the route actors, their ROM rows, exact map coordinates, active day/night behavior, HP rules, and NPC text. It also names the remaining shortcuts instead of quietly folding them into the guide.',
      html: () => [
        statRow([
          [catalog.summary.actorRows, 'actor rows'],
          [catalog.summary.uniqueActorIds, 'unique actor IDs'],
          [`${catalog.summary.rowMatches}/${catalog.summary.actorRows}`, 'rows byte-match ROM'],
          [`${catalog.summary.rowDataTextRowsProven}/${catalog.summary.textRows}`, 'text selectors proven']
        ]),
        '<div class="grid two">',
        figure('assets/images/town-of-jova-day.png', 'Town of Jova day render with actor pins in later slides.'),
        figure('assets/images/jova-woods-day.png', 'Jova Woods day render with enemy pins in later slides.'),
        '</div>'
      ].join('')
    },
    {
      id: 'what-is-proven',
      chapter: 'Answer',
      eyebrow: 'End Result',
      title: 'What this demo can honestly claim',
      lede: 'For the Jova-to-Berkeley slice, the useful guide data is no longer vague. The deck can say where each row places an actor, whether the actor appears in day or night, and what HP/text should be exposed.',
      html: () => [
        '<div class="grid two">',
        '<article class="callout green"><strong>Proven enough for guide planning</strong>',
        bulletList(catalog.accomplishments.map(escapeHtml)),
        '</article>',
        '<article class="callout warn"><strong>Not proven yet</strong><p>The big missing piece is full sprite/metasprite identity. This demo is therefore not permission to fake character art. It is permission to build map-data UI around ROM-proven actor rows while scheduling sprite decode as the next research milestone.</p></article>',
        '</div>'
      ].join('')
    },
    {
      id: 'actor-roster',
      chapter: 'Catalog',
      eyebrow: 'Roster',
      title: 'Nine unique actor IDs appear in the slice',
      lede: 'These are grouped by the ID byte in the ROM row, not by imported object identity. That matters for the Jova row at 0x50EC: the ROM byte is 0xA8, so the catalog treats it as 0xA8 even though the imported metadata currently calls it 0xAA/man.',
      html: rosterCards
    },
    {
      id: 'jova-day-map',
      chapter: 'Maps',
      eyebrow: 'Town of Jova',
      title: 'Daytime Jova: NPCs, sign, and merchant rows',
      lede: 'Each pin is at row x/y multiplied by 16 pixels. In town during day, the loader keeps NPC/fixture rows and skips the zombie rows.',
      html: () => mapPanel(catalog.mapPanels[0], 'day')
    },
    {
      id: 'jova-night-map',
      chapter: 'Maps',
      eyebrow: 'Town of Jova',
      title: 'Nighttime Jova: zombies replace the townspeople',
      lede: 'The same ROM actor list contains both the day NPC rows and the night zombie rows. The loader uses the night flag at $82 to decide which side survives. The sign is the one town fixture in this slice that remains active at night.',
      html: () => mapPanel(catalog.mapPanels[0], 'night')
    },
    {
      id: 'outdoor-day-map',
      chapter: 'Maps',
      eyebrow: 'Outdoor Segments',
      title: 'Outdoor day pins: enemies are already present',
      lede: 'Outside town, the route enemies are not suppressed during the day. These pins are not sprite bounding boxes; they are spawn/loader coordinates derived from the row bytes.',
      html: () => routeMapGrid('day')
    },
    {
      id: 'outdoor-night-map',
      chapter: 'Maps',
      eyebrow: 'Outdoor Segments',
      title: 'Outdoor night pins: same placements, stronger enemies',
      lede: 'The outdoor placements do not move at night in this slice. What changes is the HP value the loader stores after applying the night doubling branch.',
      html: () => routeMapGrid('night')
    },
    {
      id: 'hp-matrix',
      chapter: 'HP',
      eyebrow: 'Enemy Data',
      title: 'Enemy HP is the row data byte plus the night branch',
      lede: 'For this route, the enemy classes all use the normal night-doubling path. Zombies are town-only in this slice, so they are hidden by day and enter with doubled HP at night.',
      html: hpTable
    },
    {
      id: 'npc-text',
      chapter: 'Text',
      eyebrow: 'NPC Text',
      title: 'Jova dialog resolved from ROM text bytes',
      lede: 'For ordinary NPCs and the sign, the row data byte indexes the ROM pointer table at 0xCB92. The merchant is deliberately marked as a routine gap because its row byte 0x07 does not select the “buy a white crystal?” pointer through that same table path.',
      html: textTable
    },
    {
      id: 'text-pointer-proof',
      chapter: 'Text',
      eyebrow: 'Pointer Table',
      title: 'The text pointer table is anchored in the ROM',
      lede: `The pointer table prefix from the cv2r custom-text patch exists in the ROM at ${catalog.textPointerTable.romOffsetHex}. That lets the deck verify normal Jova text selectors without trusting the JavaScript metadata as truth.`,
      html: () => [
        statRow([
          [catalog.textPointerTable.romOffsetHex, 'ROM table offset'],
          [catalog.textPointerTable.rawLengthBytes, 'table bytes'],
          [catalog.textPointerTable.prefixFoundAt.join(', '), 'prefix found at'],
          ['0x4010', 'RAM/ROM pointer delta']
        ]),
        pointerExamplesTable()
      ].join('')
    },
    {
      id: 'raw-row-table',
      chapter: 'Rows',
      eyebrow: 'Raw Rows',
      title: 'All 52 route actor rows, decoded but not prettified',
      lede: 'This is the audit surface. If a pin appears in the guide, it should be possible to land back here and point to a four-byte ROM row.',
      html: actorRowsTable
    },
    {
      id: 'loader-rules',
      chapter: 'Rules',
      eyebrow: 'Loader Routine',
      title: 'The important behavior comes from the loader, not from a hand-authored table',
      lede: 'The code snippets are shortened, but they preserve the proof: row coordinate bytes become pixel placement, $82 gates day/night actor loading, and row byte 3 becomes HP with a night doubling branch.',
      html: () => [
        '<div class="grid three">',
        codeCard('Placement', coordinateSnippet),
        codeCard('Day/Night Gate', gateSnippet),
        codeCard('HP', hpSnippet),
        '</div>'
      ].join('')
    },
    {
      id: 'runtime-pointers',
      chapter: 'Rules',
      eyebrow: 'Runtime Calibration',
      title: 'Representative captures prove the game selects these lists',
      lede: 'The static rows matter, but runtime captures close the loop: the game writes the actor-list pointer into $3D/$3E for the current objset/area/submap context, and the mapped file offset lands on the expected first row.',
      html: runtimePointerTable
    },
    {
      id: 'sprite-status',
      chapter: 'Sprites',
      eyebrow: 'No Pretending',
      title: 'Sprite art is the main remaining no-shortcut milestone',
      lede: 'The capture overlays below are useful evidence that the runtime can draw actors from PPU/OAM state. They are not yet a complete ROM metasprite catalog for every actor ID in the slice.',
      html: () => [
        '<div class="grid three">',
        figure('assets/captures/jova-day/background.sprites.png', 'Jova day sprite overlay capture.'),
        figure('assets/captures/jova-right-day/background.sprites.png', 'Jova right-side sprite overlay capture.'),
        figure('assets/captures/jova-town-night/background.sprites.png', 'Jova night sprite overlay capture.'),
        '</div>',
        '<div class="callout warn"><strong>Current sprite shortcut</strong><p>The deck proves rows, positions, text, and HP. It does not yet decode each actor ID through the metasprite/tile/palette routines, so exact rendered character art is still a blocker for the final guide feature.</p></div>'
      ].join('')
    },
    {
      id: 'shortcuts',
      chapter: 'Review',
      eyebrow: 'Shortcuts',
      title: 'Every shortcut is called out explicitly',
      lede: 'This is the list I would not want to disappear into implementation. It should either become new ROM research or be visibly marked in any prototype built from this catalog.',
      html: shortcutCards
    },
    {
      id: 'review-checklist',
      chapter: 'Review',
      eyebrow: 'Stakeholder Review',
      title: 'What I would review next',
      lede: 'The intended review is no longer “did we make slides?” It is “are these the right claims to let into the guide, and are the remaining gaps scoped correctly?”',
      html: () => [
        '<div class="grid two">',
        '<article class="panel"><strong>Ready to use for guide data</strong><p>Actor row offsets, raw bytes, x/y placement, day/night active state, route enemy HP, and ordinary Jova NPC/sign text.</p></article>',
        '<article class="panel"><strong>Needs another ROM milestone</strong><p>Actor sprite/metasprite decode, palette selection for each actor class, merchant row-to-text routine, and the two low-priority/control chunks in Veros.</p></article>',
        '</div>',
        '<div class="callout"><strong>Bottom line</strong><p>The original goal is much closer now, but the demo is still honest: it achieved the map-data and text/HP catalog, not the full exact character art catalog.</p></div>'
      ].join('')
    }
  ];

  let currentIndex = 0;

  function renderSlides() {
    slidesRoot.innerHTML = slides.map((slide) => [
      `<section class="slide" id="${escapeHtml(slide.id)}" tabindex="-1">`,
      '<div class="slide-copy">',
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
