(function () {
  const VERSION = 'objset4-1';
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
    const palette = entry.recipe?.palette;
    const transfer = palette?.selector?.transferId;
    return transfer ? `${transfer} -> ${palette.address}` : palette?.address;
  }

  function evidence(entry) {
    const recipeEvidence = entry.recipe?.evidence || {};
    if (recipeEvidence.exactFixture) return recipeEvidence.exactFixture.label;
    if (recipeEvidence.familyFixture) return `Family: ${recipeEvidence.familyFixture.label}`;
    return 'No representative probe yet';
  }

  function card(entry) {
    if (!entry) return '';
    const status = entry.recipe?.status || entry.renderStatus;
    return [
      '<article class="render-card">',
      '<div class="image-wrap">',
      `<img src="${image(entry)}" alt="${escapeHtml(entry.name)} ${escapeHtml(entry.variant)} render">`,
      '</div>',
      '<div class="card-body">',
      `<div><h3>${escapeHtml(entry.name)}</h3><span>${escapeHtml(entry.variant)} / ${escapeHtml(entry.width)}x${escapeHtml(entry.height)}</span></div>`,
      `<b class="status ${statusClass(status)}">${escapeHtml(status)}</b>`,
      `<p><strong>CHR</strong> ${escapeHtml(chrText(entry))}</p>`,
      `<p><strong>Palette</strong> ${escapeHtml(paletteText(entry))}</p>`,
      `<p><strong>Evidence</strong> ${escapeHtml(evidence(entry))}</p>`,
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
      `<img src="${beforeSrc}?v=${VERSION}" alt="${escapeHtml(title)} previous diagnostic render">`,
      '<figcaption>Previous diagnostic fallback, CHR 08/09</figcaption>',
      '</figure>',
      '<figure>',
      `<img src="${image(afterEntry)}" alt="${escapeHtml(title)} current recipe render">`,
      `<figcaption>Current validated recipe, CHR ${escapeHtml(chrText(afterEntry))}</figcaption>`,
      '</figure>',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderMetrics() {
    const metrics = [
      [atlas.summary.entries, 'recipe entries'],
      [atlas.summary.byRecipeStatus.validated, 'validated'],
      [atlas.summary.byRecipeStatus.projected, 'projected'],
      [atlas.summary.byRecipeStatus.diagnostic, 'diagnostic']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function renderHero() {
    const ids = [
      'obj04-area03-sub00-vrad-graveyard-day',
      'obj04-area03-sub01-castlevania-bridge-day',
      'obj02-area08-sub00-north-bridge-day'
    ];
    document.getElementById('hero-grid').innerHTML = ids.map((id) => card(byId.get(id))).join('');
  }

  function renderNamingTable() {
    const rows = [
      ['Nintendo Power', 'Vrad Graveyard', 'cv2r/Fandom alias: Vrad/Vlad conflict recorded'],
      ['Nintendo Power', 'Borgia Mountains', 'cv2r sourceName: Bordia Mountains'],
      ['Nintendo Power', 'Lauber Mansion', 'cv2r sourceName: Rover Mansion'],
      ['Nintendo Power', 'Town of Alba', 'Alias recorded: Town of Aldra'],
      ['Ambiguous in scan', 'Castlevania Bridge', 'Kept as cv2r label until clearer evidence']
    ];
    document.getElementById('naming-table').innerHTML = [
      '<section class="table-row table-head"><span>Basis</span><span>Display Name</span><span>Metadata Handling</span></section>',
      ...rows.map((row) => (
        `<section class="table-row"><span>${escapeHtml(row[0])}</span><span>${escapeHtml(row[1])}</span><span>${escapeHtml(row[2])}</span></section>`
      ))
    ].join('');
  }

  function renderCompare() {
    document.getElementById('compare-grid').innerHTML = [
      compareCard(
        'Vrad Graveyard',
        'assets/before/vrad-graveyard-day-before.png',
        byId.get('obj04-area03-sub00-vrad-graveyard-day')
      ),
      compareCard(
        'Castlevania Bridge',
        'assets/before/castlevania-bridge-day-before.png',
        byId.get('obj04-area03-sub01-castlevania-bridge-day')
      )
    ].join('');
  }

  function renderValidated() {
    const ids = [
      'obj04-area03-sub00-vrad-graveyard-day',
      'obj04-area03-sub00-vrad-graveyard-night',
      'obj04-area03-sub01-castlevania-bridge-day',
      'obj04-area03-sub01-castlevania-bridge-night',
      'obj02-area08-sub00-north-bridge-day',
      'obj01-area04-sub00-bodley-mansion-door-night'
    ];
    document.getElementById('validated-grid').innerHTML = ids.map((id) => card(byId.get(id))).join('');
  }

  function renderProjected() {
    const ids = [
      'obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day',
      'obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-night',
      'obj04-area01-sub01-jam-wasteland-deborah-cliff-day',
      'obj04-area02-sub00-wicked-ditch-day',
      'obj04-area02-sub00-wicked-ditch-night',
      'obj05-area00-sub00-castlevania-day'
    ];
    document.getElementById('projected-grid').innerHTML = ids.map((id) => card(byId.get(id))).join('');
  }

  function renderNext() {
    const items = [
      ['Deferred', 'North Bridge night', 'Needed for final confidence on the night palette of that bridge family.'],
      ['Deferred', 'Castlevania exterior day', 'Still the only diagnostic render in the recipe atlas.'],
      ['Next map goal', 'Coordinate-aware composition', 'Use the exterior topology to place validated layout-space segments into one world map.']
    ];
    document.getElementById('next-grid').innerHTML = items.map((item) => [
      '<article>',
      `<strong>${escapeHtml(item[1])}</strong>`,
      `<span>${escapeHtml(item[0])}</span>`,
      `<p>${escapeHtml(item[2])}</p>`,
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
  renderNamingTable();
  renderCompare();
  renderValidated();
  renderProjected();
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
