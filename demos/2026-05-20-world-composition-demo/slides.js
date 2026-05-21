(function () {
  const composition = window.EXTERIOR_WORLD_COMPOSITION || {};
  const summary = composition.summary || {};
  const constraints = composition.constraints || [];
  const unresolved = composition.unresolved || [];
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
    const metrics = [
      [`${summary.areas}/${summary.topologyAreas}`, 'areas placed'],
      [`${summary.nodes}/${summary.topologyNodes}`, 'nodes rendered'],
      [summary.constraints ?? 0, 'edge constraints'],
      [summary.handPlacedCoordinates ?? '?', 'hand-placed coords']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
    document.getElementById('overview-callout').innerHTML = [
      '<strong>The full exterior graph is now renderable as one draft.</strong>',
      `<p>The manifest reports ${escapeHtml(summary.solvedConstraints)} solved constraints, ${escapeHtml(summary.conflictConstraints)} conflicts, ${escapeHtml(summary.connectorOnlyTransitions)} connector-only transition, and ${escapeHtml(summary.unresolvedConstraints)} unresolved transition. That honesty is the point: no hidden hand placement.</p>`
    ].join('');
  }

  function renderProvenance() {
    const rows = [
      ['Solved constraints', summary.solvedConstraints, 'Satisfied or newly placed by ROM topology/submap order.'],
      ['Routine-supported constraints', summary.routineSupportedConstraints, 'Edges with matching transition routine probe evidence.'],
      ['Generic overlap shifts', summary.genericOverlapShifts, 'Deterministic solver layout choices, not ROM world coordinates.'],
      ['Connector-only transitions', summary.connectorOnlyTransitions, 'Known endpoints without true decoded transport coordinates.'],
      ['Conflicts', summary.conflictConstraints, 'Useful clues for missing vertical/special placement semantics.'],
      ['Unresolved', summary.unresolvedConstraints, 'Edges preserved without spatial claims.']
    ];
    document.querySelector('#provenance-table tbody').innerHTML = rows.map(([metric, value, meaning]) => [
      '<tr>',
      `<td><strong>${escapeHtml(metric)}</strong></td>`,
      `<td>${escapeHtml(value)}</td>`,
      `<td>${escapeHtml(meaning)}</td>`,
      '</tr>'
    ].join('')).join('');
  }

  function renderRoutine() {
    const rows = constraints
      .filter((constraint) => constraint.routineEvidence?.status === 'routine-observed')
      .concat(unresolved.filter((constraint) => constraint.routineEvidence?.status === 'routine-observed'));
    document.querySelector('#routine-table tbody').innerHTML = rows.map((constraint) => {
      const evidence = constraint.routineEvidence || {};
      const bytes = evidence.routineAfterBytes
        ? Object.entries(evidence.routineAfterBytes).map(([address, value]) => `${address}:${value}`).join(' ')
        : 'none';
      return [
        '<tr>',
        `<td><code>${escapeHtml(constraint.edgeId)}</code><br>${escapeHtml(constraint.transitionClass)}</td>`,
        `<td><code>${escapeHtml(evidence.stepId)}</code><br>${escapeHtml(evidence.matchStatus)}</td>`,
        `<td><span class="tag">${escapeHtml(constraint.status)}</span><br>${escapeHtml(constraint.spatialClaim)}</td>`,
        `<td>${escapeHtml(constraint.placementSource || 'none')}</td>`,
        `<td><code>${escapeHtml(bytes)}</code></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderNext() {
    const items = [
      ['Decode conflict classes', 'The 17 conflicts are not failures; they identify where side-only topology is missing vertical or special coordinate semantics.'],
      ['Promote only explained rules', 'When the routine explains a conflict, promote that transition class into the composer.'],
      ['Keep interiors separate', 'Town and mansion interiors can become a connected layer after exterior placement semantics are stronger.']
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
  renderProvenance();
  renderRoutine();
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
