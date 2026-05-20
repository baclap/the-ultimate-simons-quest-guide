(function () {
  const VERSION = 'recipe-complete-1';
  const atlas = window.RENDER_RECIPE_ATLAS;
  const entries = atlas.entries || [];
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function image(entry) {
    return entry?.output ? `assets/recipe-atlas/${entry.output}?v=${VERSION}` : '';
  }

  function statusClass(status) {
    if (status === 'validated') return 'good';
    if (status === 'projected') return 'warn';
    if (status === 'diagnostic') return 'danger';
    return 'neutral';
  }

  function chrText(entry) {
    return (entry.recipe?.chrBanks || []).join('/');
  }

  function paletteText(entry) {
    const selector = entry.recipe?.palette?.selector;
    const transfer = selector?.transferId;
    const address = entry.recipe?.palette?.address;
    return transfer ? `${transfer} -> ${address}` : address;
  }

  function evidenceText(entry) {
    const exact = entry.recipe?.evidence?.exactFixture;
    const family = entry.recipe?.evidence?.familyFixture;
    if (exact) return exact.label;
    if (family) return `Family: ${family.label}`;
    return 'No representative probe';
  }

  function renderCard(entry) {
    if (!entry) return '';
    const status = entry.recipe?.status || entry.renderStatus;
    return [
      '<article class="render-card">',
      '<div class="image-wrap">',
      `<img src="${image(entry)}" alt="${escapeHtml(entry.name)} ${escapeHtml(entry.variant)} render">`,
      '</div>',
      '<div class="card-body">',
      `<div><h3>${escapeHtml(entry.name)}</h3><span>${escapeHtml(entry.variant)} / ${escapeHtml(entry.access)}</span></div>`,
      `<b class="status ${statusClass(status)}">${escapeHtml(status)}</b>`,
      `<p><strong>CHR</strong> ${escapeHtml(chrText(entry))}</p>`,
      `<p><strong>Palette</strong> ${escapeHtml(paletteText(entry))}</p>`,
      `<p><strong>Evidence</strong> ${escapeHtml(evidenceText(entry))}</p>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function compareCard(title, beforeSrc, afterEntry) {
    return [
      '<article class="compare-card">',
      `<h3>${escapeHtml(title)}</h3>`,
      '<div class="compare-images">',
      '<figure>',
      `<img src="${beforeSrc}?v=${VERSION}" alt="${escapeHtml(title)} old render">`,
      '<figcaption>Previous objset 5 assumption, CHR 06/07</figcaption>',
      '</figure>',
      '<figure>',
      `<img src="${image(afterEntry)}" alt="${escapeHtml(title)} corrected render">`,
      `<figcaption>Validated final-area recipe, CHR ${escapeHtml(chrText(afterEntry))}</figcaption>`,
      '</figure>',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderMetrics() {
    const summary = atlas.summary || {};
    const metrics = [
      [summary.entries, 'recipe entries'],
      [summary.byRecipeStatus?.validated, 'validated'],
      [summary.byRecipeStatus?.projected, 'projected'],
      [summary.byRecipeStatus?.diagnostic || 0, 'diagnostic'],
      [summary.byVariant?.fixed, 'fixed variants']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function renderHero() {
    const ids = [
      'obj02-area08-sub00-north-bridge-night',
      'obj05-area00-sub00-castlevania-fixed',
      'obj04-area03-sub01-castlevania-bridge-night'
    ];
    document.getElementById('hero-grid').innerHTML = ids.map((id) => renderCard(byId.get(id))).join('');
  }

  function renderCastlevania() {
    document.getElementById('castlevania-compare').innerHTML = compareCard(
      'Castlevania final area',
      'assets/before/castlevania-old-objset5-rule.png',
      byId.get('obj05-area00-sub00-castlevania-fixed')
    );
  }

  function renderBridge() {
    const entry = byId.get('obj02-area08-sub00-north-bridge-night');
    document.getElementById('bridge-feature').innerHTML = [
      renderCard(entry),
      '<article class="evidence-panel">',
      '<h3>Live audit evidence</h3>',
      '<dl>',
      '<dt>Runtime context</dt><dd>objset 02, area 08, submap 00</dd>',
      '<dt>Palette selector</dt><dd>night transfer $21 -> fixed:$CB15</dd>',
      '<dt>Capture parity</dt><dd>0-pixel composite diff for the immediate viewport</dd>',
      '</dl>',
      '</article>'
    ].join('');
  }

  function renderFamilies() {
    const familyEntries = [
      ['Objset 0', byId.get('obj00-area00-sub00-town-of-jova-day')],
      ['Objset 1', byId.get('obj01-area04-sub00-bodley-mansion-door-night')],
      ['Objset 2', byId.get('obj02-area08-sub00-north-bridge-night')],
      ['Objset 3', byId.get('obj03-area00-sub00-camilla-cemetery-night')],
      ['Objset 4', byId.get('obj04-area03-sub00-vrad-graveyard-night')],
      ['Objset 5', byId.get('obj05-area00-sub00-castlevania-fixed')]
    ];
    document.getElementById('family-grid').innerHTML = familyEntries.map(([label, entry]) => [
      '<article class="family-card">',
      `<span>${escapeHtml(label)}</span>`,
      `<img src="${image(entry)}" alt="${escapeHtml(label)} representative render">`,
      `<h3>${escapeHtml(entry?.name)}</h3>`,
      `<p>${escapeHtml(entry?.variant)} / CHR ${escapeHtml(chrText(entry))}</p>`,
      '</article>'
    ].join('')).join('');
  }

  function renderStatusTable() {
    const rows = [
      ['Fixture audit', '23 audited, 23 exact CHR, 23 exact palette selectors'],
      ['Recipe atlas', '112 rendered, 23 validated, 89 projected, 0 diagnostic'],
      ['Variant model', '56 day, 54 night, 2 fixed'],
      ['Remaining validation', 'Mansion-door layout/crop parity, then world placement'],
      ['Next output risk', 'Coordinates and adjacency, not broad CHR/palette recipe choice']
    ];
    document.getElementById('status-table').innerHTML = rows.map((row) => (
      `<section><strong>${escapeHtml(row[0])}</strong><span>${escapeHtml(row[1])}</span></section>`
    )).join('');
  }

  function renderNext() {
    const items = [
      ['World coordinates', 'Use the topology graph to place route and town segments into one exterior-world draft.'],
      ['Viewport checks', 'Compare selected windows from the composed map against representative captures.'],
      ['Interior catalog', 'Keep fixed interiors and Castlevania final area available as separate connected segments.']
    ];
    document.getElementById('next-grid').innerHTML = items.map((item) => [
      '<article>',
      `<strong>${escapeHtml(item[0])}</strong>`,
      `<p>${escapeHtml(item[1])}</p>`,
      '</article>'
    ].join('')).join('');
  }

  function indexFromHash() {
    const hash = window.location.hash.replace(/^#/, '');
    const index = slides.findIndex((slide) => slide.dataset.hash === hash);
    return index >= 0 ? index : 0;
  }

  function show(index, updateHash) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === clamped);
    });
    prev.disabled = clamped === 0;
    next.disabled = clamped === slides.length - 1;
    counter.textContent = `${clamped + 1}/${slides.length}`;
    if (updateHash) history.replaceState(null, '', `#${slides[clamped].dataset.hash}`);
  }

  renderMetrics();
  renderHero();
  renderCastlevania();
  renderBridge();
  renderFamilies();
  renderStatusTable();
  renderNext();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(indexFromHash() - 1, true);
    if (event.key === 'ArrowRight') show(indexFromHash() + 1, true);
  });

  show(indexFromHash(), false);
}());
