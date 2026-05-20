(function () {
  const composition = window.EXTERIOR_COMPOSITION;
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

  function renderMetrics() {
    const summary = composition.summary || {};
    const metrics = [
      [summary.areas, 'route areas'],
      [summary.nodes, 'rendered nodes'],
      [summary.romDerivedPlacementConstraints, 'ROM constraints'],
      [summary.solverInferredPlacements, 'inferred shifts'],
      [summary.unresolvedPlacements, 'unresolved links']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function relationText(constraint) {
    const relation = constraint.relationship === 'next-area-right-of-current-area'
      ? 'right of'
      : 'left of';
    return `${constraint.nextAreaId} ${relation} ${constraint.currentAreaId}`;
  }

  function renderConstraintTable() {
    const constraints = composition.constraints || [];
    document.getElementById('constraint-table').innerHTML = constraints.map((constraint) => {
      const tagClass = constraint.solverAdjustment ? 'warn' : 'good';
      const tagText = constraint.solverAdjustment ? 'row shift inferred' : 'ROM transition';
      return [
        '<section>',
        `<span class="tag ${tagClass}">${escapeHtml(tagText)}</span>`,
        `<strong>${escapeHtml(relationText(constraint))}</strong>`,
        `<span>${escapeHtml(constraint.transition?.bytes?.join(' '))} / ${escapeHtml(constraint.transition?.kind)}</span>`,
        `<code>${escapeHtml(constraint.edgeId)}</code>`,
        '</section>'
      ].join('');
    }).join('');
  }

  function renderProvenance() {
    const summary = composition.summary || {};
    const groups = [
      {
        title: 'ROM decoded',
        tag: 'facts',
        tagClass: 'good',
        items: [
          'Area boundary transition triples',
          'Submap order within each area',
          'Layout header dimensions and pixels',
          'CHR and palette recipe families'
        ]
      },
      {
        title: 'Solver inferred',
        tag: `${summary.solverInferredPlacements || 0} shifts`,
        tagClass: summary.solverInferredPlacements ? 'warn' : 'good',
        items: [
          'Collision avoidance row placement',
          'No per-area coordinate tweak',
          'No visual hand placement',
          'Recorded in composition.json'
        ]
      },
      {
        title: 'Still ahead',
        tag: 'next',
        tagClass: 'neutral',
        items: [
          'Full topology graph composition',
          'Vertical and entrance-position decoding',
          'Mansion-door layout validation',
          'Selected live viewport checks'
        ]
      }
    ];

    document.getElementById('provenance-grid').innerHTML = groups.map((group) => [
      '<article>',
      `<span class="tag ${group.tagClass}">${escapeHtml(group.tag)}</span>`,
      `<h3>${escapeHtml(group.title)}</h3>`,
      '<ul>',
      group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join(''),
      '</ul>',
      '</article>'
    ].join('')).join('');
  }

  function renderNext() {
    const items = [
      ['Full graph', 'Place all exterior topology areas, not only the shortest Jova-to-Castlevania route.'],
      ['Vertical evidence', 'Decode or validate the ROM state that explains when route transitions should move vertically.'],
      ['Pixel checks', 'Compare selected composed windows against save states after the composition model gains coordinates.']
    ];
    document.getElementById('next-grid').innerHTML = items.map(([title, text]) => [
      '<article>',
      `<h3>${escapeHtml(title)}</h3>`,
      `<p>${escapeHtml(text)}</p>`,
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
  renderConstraintTable();
  renderProvenance();
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
