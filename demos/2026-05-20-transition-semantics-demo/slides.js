(function () {
  const topology = window.EXTERIOR_TOPOLOGY;
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
    const top = topology.summary || {};
    const comp = composition.summary || {};
    const metrics = [
      [top.edges, 'topology edges'],
      [top.connectorOnlyEdges, 'connector edges'],
      [comp.romDerivedPlacementConstraints, 'ordinary route edges'],
      [comp.genericOverlapShifts, 'generic overlap shifts'],
      [comp.unresolvedPlacements, 'unresolved route links']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function renderClasses() {
    const classes = topology.summary?.transitionClasses || {};
    const rows = Object.entries(classes).sort((left, right) => right[1] - left[1]);
    document.getElementById('class-grid').innerHTML = rows.map(([name, count]) => {
      const tagClass = name === 'special-transport-candidate' ? 'warn' : name === 'unresolved-target' ? 'neutral' : 'good';
      const mode = (topology.edges || []).find((edge) => edge.transitionSemantics?.transitionClass === name)
        ?.transitionSemantics?.placementMode || 'unknown';
      return [
        '<article class="class-card">',
        `<span class="tag ${tagClass}">${escapeHtml(mode)}</span>`,
        `<strong>${escapeHtml(name)}</strong>`,
        `<span>${escapeHtml(count)} edge${count === 1 ? '' : 's'}</span>`,
        '</article>'
      ].join('');
    }).join('');
  }

  function detailRow(label, value) {
    return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
  }

  function renderFeature() {
    const special = (topology.edges || []).find((edge) => edge.transitionSemantics?.transitionClass === 'special-transport-candidate');
    const constraint = (composition.constraints || []).find((item) => item.transitionClass === 'special-transport-candidate');
    const evidence = special?.transitionSemantics?.evidence || [];
    document.getElementById('feature-grid').innerHTML = [
      [
        '<article class="feature-card">',
        '<span class="tag warn">connector-only</span>',
        '<h3>Detected edge</h3>',
        '<dl class="detail-list">',
        detailRow('Edge', special?.id),
        detailRow('Bytes', special?.transition?.bytes?.join(' ')),
        detailRow('Source', special?.source),
        detailRow('Target', special?.target),
        '</dl>',
        '</article>'
      ].join(''),
      [
        '<article class="feature-card">',
        '<span class="tag neutral">evidence</span>',
        '<h3>Why it is special</h3>',
        `<p>${escapeHtml(evidence.map((item) => `${item.source}: ${item.note}`).join(' '))}</p>`,
        '</article>'
      ].join(''),
      [
        '<article class="feature-card">',
        '<span class="tag good">composition</span>',
        '<h3>What changed</h3>',
        '<dl class="detail-list">',
        detailRow('Relationship', constraint?.relationship),
        detailRow('Generic shifts', composition.summary?.genericOverlapShifts),
        detailRow('Row source', constraint?.solverAdjustment?.source),
        detailRow('Coordinate status', special?.transitionSemantics?.coordinateConfidence),
        '</dl>',
        '</article>'
      ].join('')
    ].join('');
  }

  function renderNext() {
    const items = [
      ['Transition routine', 'Find the routine/data that writes runtime context and destination position during area changes.'],
      ['Vertical placement', 'Replace connector row breaks with decoded vertical offsets where the ROM provides them.'],
      ['Full graph', 'Apply the same semantics to all exterior edges before composing the entire exterior world.']
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
  renderClasses();
  renderFeature();
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
