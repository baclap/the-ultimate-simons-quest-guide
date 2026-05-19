(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const audit = window.RENDER_RECIPE_AUDIT;
  const fixtureById = new Map(audit.fixtures.map((fixture) => [fixture.id, fixture]));

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function captureImage(fixture, file) {
    return `assets/captures/${fixture.id}/${file}?v=recipe-audit-1`;
  }

  function atlasImage(fixture) {
    return fixture.atlasCandidate
      ? `assets/current-atlas/${fixture.atlasCandidate.image}?v=recipe-audit-1`
      : undefined;
  }

  function chrText(fixture) {
    return fixture.chr.banks
      .map((bank) => bank.matches.map((match) => match.bankHex).join('/') || '?')
      .join(' ');
  }

  function paletteText(fixture) {
    const selector = fixture.palette.selector;
    return `${selector.transferId} -> ${selector.paletteAddress}`;
  }

  function statusClass(value) {
    if (/exact|present|matches/.test(value)) return 'good';
    if (/deferred|diagnostic|differs|unresolved/.test(value)) return 'warn';
    return 'neutral';
  }

  function fixtureCard(fixture) {
    return [
      '<article class="fixture-card">',
      '<div class="image-pair">',
      `<img src="${captureImage(fixture, 'screenshot.png')}" alt="${escapeHtml(fixture.label)} live screenshot">`,
      `<img src="${captureImage(fixture, 'background.png')}" alt="${escapeHtml(fixture.label)} PPU background reconstruction">`,
      '</div>',
      '<div class="fixture-body">',
      `<h3>${escapeHtml(fixture.label)}</h3>`,
      `<span>${escapeHtml(fixture.variant)} / ${escapeHtml(fixture.access)}</span>`,
      `<p><strong>CHR</strong> ${escapeHtml(chrText(fixture))}</p>`,
      `<p><strong>Palette</strong> ${escapeHtml(paletteText(fixture))}</p>`,
      `<p><strong>Runtime</strong> ${escapeHtml(fixture.live.runtimeContext.objset)}:${escapeHtml(fixture.live.runtimeContext.area)}:${escapeHtml(fixture.live.runtimeContext.submapRaw)}</p>`,
      `<b class="status ${statusClass(fixture.evidenceStatus.renderRecipe)}">${escapeHtml(fixture.evidenceStatus.renderRecipe)}</b>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function renderMetrics() {
    const metrics = [
      [audit.summary.fixtures, 'captured probes'],
      [audit.summary.chrExact, 'exact CHR matches'],
      [audit.summary.paletteSelectorExact, 'selector palette matches'],
      [audit.summary.deferred, 'deferred states']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${value}</strong><span>${label}</span></div>`
    )).join('');
  }

  function renderHero() {
    const ids = ['jova-town-night', 'camilla-cemetery-night', 'berkeley-mansion-door-day'];
    document.getElementById('hero-grid').innerHTML = ids.map((id) => {
      const fixture = fixtureById.get(id);
      return [
        '<figure>',
        `<img src="${captureImage(fixture, 'background.png')}" alt="${escapeHtml(fixture.label)} background evidence">`,
        `<figcaption>${escapeHtml(fixture.label)} / ${escapeHtml(paletteText(fixture))}</figcaption>`,
        '</figure>'
      ].join('');
    }).join('');
  }

  function renderPaletteGrid() {
    const ids = [
      'jova-town-day',
      'jova-town-night',
      'jova-woods-day',
      'jova-woods-night',
      'camilla-cemetery-day',
      'camilla-cemetery-night'
    ];
    document.getElementById('palette-grid').innerHTML = ids
      .map((id) => fixtureCard(fixtureById.get(id)))
      .join('');
  }

  function renderMansionDoor() {
    const fixture = fixtureById.get('berkeley-mansion-door-day');
    const atlas = atlasImage(fixture);
    document.getElementById('mansion-door-grid').innerHTML = [
      '<figure>',
      `<img src="${captureImage(fixture, 'background.png')}" alt="Berkeley Mansion door live PPU background">`,
      '<figcaption>Live PPU background from save-state probe</figcaption>',
      '</figure>',
      '<figure>',
      atlas
        ? `<img src="${atlas}" alt="Berkeley Mansion door current atlas render">`
        : '<div class="missing">No atlas render</div>',
      '<figcaption>Current atlas render after CHR 08/09 correction</figcaption>',
      '</figure>',
      '<article class="evidence-panel">',
      '<h3>Evidence</h3>',
      `<p><strong>Runtime</strong> ${escapeHtml(fixture.live.runtimeContext.objset)}:${escapeHtml(fixture.live.runtimeContext.area)}:${escapeHtml(fixture.live.runtimeContext.submapRaw)}</p>`,
      `<p><strong>CHR</strong> ${escapeHtml(chrText(fixture))}</p>`,
      `<p><strong>Palette</strong> ${escapeHtml(paletteText(fixture))}</p>`,
      `<p><strong>Status</strong> ${escapeHtml(fixture.evidenceStatus.renderRecipe)}</p>`,
      '</article>'
    ].join('');
  }

  function renderInteriorGrid() {
    const ids = ['jova-town-interior-day', 'berkeley-mansion-interior-day'];
    document.getElementById('interior-grid').innerHTML = ids
      .map((id) => fixtureCard(fixtureById.get(id)))
      .join('');
  }

  function renderAuditTable() {
    const header = [
      '<section class="table-row table-head">',
      '<span>Fixture</span><span>Runtime</span><span>CHR</span><span>Palette</span><span>Status</span>',
      '</section>'
    ].join('');
    const rows = audit.fixtures.map((fixture) => [
      '<section class="table-row">',
      `<span><strong>${escapeHtml(fixture.label)}</strong><small>${escapeHtml(fixture.variant)} / ${escapeHtml(fixture.access)}</small></span>`,
      `<span>${escapeHtml(fixture.live.runtimeContext.objset)}:${escapeHtml(fixture.live.runtimeContext.area)}:${escapeHtml(fixture.live.runtimeContext.submapRaw)}</span>`,
      `<span>${escapeHtml(chrText(fixture))}</span>`,
      `<span>${escapeHtml(paletteText(fixture))}</span>`,
      `<span><b class="status ${statusClass(fixture.evidenceStatus.renderRecipe)}">${escapeHtml(fixture.evidenceStatus.renderRecipe)}</b></span>`,
      '</section>'
    ].join('')).join('');
    document.getElementById('audit-table').innerHTML = header + rows;
  }

  function renderDeferred() {
    document.getElementById('deferred-grid').innerHTML = audit.deferred.map((item) => [
      '<article>',
      `<strong>${escapeHtml(item.label)}</strong>`,
      `<span>${escapeHtml(item.state)}</span>`,
      `<p>${escapeHtml(item.reason)}</p>`,
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

    if (updateHash) {
      history.replaceState(null, '', `#${slides[clamped].dataset.hash}`);
    }
  }

  renderMetrics();
  renderHero();
  renderPaletteGrid();
  renderMansionDoor();
  renderInteriorGrid();
  renderAuditTable();
  renderDeferred();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(indexFromHash() - 1, true);
    if (event.key === 'ArrowRight') show(indexFromHash() + 1, true);
  });

  show(indexFromHash(), false);
}());
