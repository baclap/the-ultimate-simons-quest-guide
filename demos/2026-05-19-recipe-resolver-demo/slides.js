(function () {
  const VERSION = 'recipe-resolver-1';
  const atlas = window.RENDER_RECIPE_ATLAS;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const entries = atlas.entries || [];
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function entryImage(entry) {
    return entry?.output
      ? `assets/recipe-atlas/${entry.output}?v=${VERSION}`
      : '';
  }

  function statusClass(status) {
    if (status === 'validated') return 'good';
    if (status === 'projected') return 'warn';
    if (status === 'diagnostic') return 'danger';
    return 'neutral';
  }

  function contextText(context) {
    if (!context) return '?';
    return `${context.objset}:${context.area}:${context.submap || '0x00'}`;
  }

  function chrText(entry) {
    return (entry.recipe?.chrBanks || []).join('/');
  }

  function paletteText(entry) {
    const palette = entry.recipe?.palette;
    const transfer = palette?.selector?.transferId;
    return transfer ? `${transfer} -> ${palette.address}` : palette?.address;
  }

  function evidenceText(entry) {
    const evidence = entry.recipe?.evidence || {};
    if (evidence.exactFixture) return evidence.exactFixture.label;
    if (evidence.familyFixture) return `Family: ${evidence.familyFixture.label}`;
    return 'No representative probe yet';
  }

  function card(entry, opts = {}) {
    if (!entry) return '';
    const status = entry.recipe?.status || entry.renderStatus;
    const size = `${entry.width || '?'}x${entry.height || '?'}`;
    return [
      `<article class="render-card ${opts.large ? 'large' : ''}">`,
      '<div class="image-wrap">',
      `<img src="${entryImage(entry)}" alt="${escapeHtml(entry.name)} ${escapeHtml(entry.variant)} ROM render">`,
      '</div>',
      '<div class="card-body">',
      `<div><h3>${escapeHtml(entry.name)}</h3><span>${escapeHtml(entry.variant)} / ${escapeHtml(entry.access)} / ${escapeHtml(size)}</span></div>`,
      `<b class="status ${statusClass(status)}">${escapeHtml(status)}</b>`,
      `<p><strong>CHR</strong> ${escapeHtml(chrText(entry))}</p>`,
      `<p><strong>Palette</strong> ${escapeHtml(paletteText(entry))}</p>`,
      `<p><strong>Evidence</strong> ${escapeHtml(evidenceText(entry))}</p>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function pairCard(dayId, nightId) {
    const day = byId.get(dayId);
    const night = byId.get(nightId);
    const title = day?.name || night?.name || dayId;
    return [
      '<article class="pair-card">',
      `<h3>${escapeHtml(title)}</h3>`,
      '<div class="pair-images">',
      imagePanel(day, 'Day'),
      imagePanel(night, 'Night'),
      '</div>',
      '<div class="pair-meta">',
      `<span>${escapeHtml(day?.recipe?.status || '?')}</span>`,
      `<span>${escapeHtml(night?.recipe?.status || '?')}</span>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function imagePanel(entry, label) {
    if (!entry) {
      return `<figure><div class="missing">Missing</div><figcaption>${escapeHtml(label)}</figcaption></figure>`;
    }
    return [
      '<figure>',
      `<img src="${entryImage(entry)}" alt="${escapeHtml(entry.name)} ${escapeHtml(label)} render">`,
      `<figcaption>${escapeHtml(label)} / ${escapeHtml(paletteText(entry))}</figcaption>`,
      '</figure>'
    ].join('');
  }

  function renderMetrics() {
    const metrics = [
      [atlas.summary.entries, 'atlas recipe entries'],
      [atlas.summary.byRecipeStatus.validated, 'validated by save states'],
      [atlas.summary.byRecipeStatus.projected, 'projected from families'],
      [atlas.summary.byRecipeStatus.diagnostic, 'diagnostic renders']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function renderHero() {
    const ids = [
      'obj00-area00-sub00-jova-night',
      'obj02-area08-sub02-dora-woods-part-2-day',
      'obj01-area07-sub00-berkeley-mansion-part-1-day'
    ];
    document.getElementById('hero-grid').innerHTML = ids.map((id) => card(byId.get(id), { large: true })).join('');
  }

  function renderValidated() {
    const validated = entries.filter((entry) => entry.recipe?.status === 'validated');
    document.getElementById('validated-grid').innerHTML = validated.map((entry) => card(entry)).join('');
  }

  function renderPairs() {
    const pairs = [
      ['obj00-area00-sub00-jova-day', 'obj00-area00-sub00-jova-night'],
      ['obj00-area01-sub00-veros-day', 'obj00-area01-sub00-veros-night'],
      ['obj02-area00-sub00-jova-woods-day', 'obj02-area00-sub00-jova-woods-night'],
      ['obj02-area08-sub02-dora-woods-part-2-day', 'obj02-area08-sub02-dora-woods-part-2-night'],
      ['obj03-area00-sub00-camilla-cemetery-day', 'obj03-area00-sub00-camilla-cemetery-night'],
      ['obj03-area02-sub00-sadam-woods-part-2-day', 'obj03-area02-sub00-sadam-woods-part-2-night']
    ];
    document.getElementById('pair-grid').innerHTML = pairs.map(([day, night]) => pairCard(day, night)).join('');
  }

  function renderProjected() {
    const ids = [
      'obj02-area08-sub00-north-bridge-day',
      'obj02-area08-sub00-north-bridge-night',
      'obj01-area02-sub00-rover-mansion-door-day',
      'obj04-area03-sub00-vrad-graveyard-day',
      'obj04-area03-sub01-castlevania-bridge-day',
      'obj05-area00-sub00-castlevania-day'
    ];
    document.getElementById('projected-grid').innerHTML = ids.map((id) => card(byId.get(id), { large: true })).join('');
  }

  function renderTable() {
    const header = [
      '<section class="table-row table-head">',
      '<span>Entry</span><span>Context</span><span>Recipe</span><span>CHR</span><span>Palette</span><span>Evidence</span>',
      '</section>'
    ].join('');
    const rows = entries.map((entry) => {
      const status = entry.recipe?.status || entry.renderStatus;
      return [
        '<section class="table-row">',
        `<span><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.variant)} / ${escapeHtml(entry.access)}</small></span>`,
        `<span>${escapeHtml(contextText(entry.recipe?.layoutContext))}</span>`,
        `<span><b class="status ${statusClass(status)}">${escapeHtml(status)}</b></span>`,
        `<span>${escapeHtml(chrText(entry))}</span>`,
        `<span>${escapeHtml(paletteText(entry))}</span>`,
        `<span>${escapeHtml(evidenceText(entry))}</span>`,
        '</section>'
      ].join('');
    }).join('');
    document.getElementById('inventory-table').innerHTML = header + rows;
  }

  function renderNext() {
    const deferred = (atlas.deferred || []).map((item) => [
      '<article>',
      `<strong>${escapeHtml(item.label)}</strong>`,
      `<span>${escapeHtml(item.state)}</span>`,
      `<p>${escapeHtml(item.reason)}</p>`,
      '</article>'
    ].join('')).join('');
    const goals = [
      '<article>',
      '<strong>Immediate next check</strong>',
      '<span>Projected areas with visual suspicion</span>',
      '<p>Use North Bridge and Vrad/Castlevania states to decide whether diagnostic CHR/tile families can be promoted or need deeper ROM decoding.</p>',
      '</article>',
      '<article>',
      '<strong>Following milestone</strong>',
      '<span>Coordinate-aware world composition</span>',
      '<p>Once recipe families are validated, use the transition topology to place layout-space segments into a continuous exterior world map.</p>',
      '</article>'
    ].join('');
    document.getElementById('next-grid').innerHTML = goals + deferred;
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
  renderValidated();
  renderPairs();
  renderProjected();
  renderTable();
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
