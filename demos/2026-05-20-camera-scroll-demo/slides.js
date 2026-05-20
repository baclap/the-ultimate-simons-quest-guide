(function () {
  const analysis = window.TRANSITION_PROBES;
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

  function allSteps() {
    return (analysis.probes || []).flatMap((probe) => (
      (probe.steps || []).map((step) => ({ ...step, probe }))
    ));
  }

  function highCameraCandidates() {
    return (analysis.summary?.camera?.candidates || [])
      .filter((candidate) => candidate.confidence === 'high');
  }

  function renderMetrics() {
    const summary = analysis.summary || {};
    const xCandidate = (summary.xCenterCandidates || []).find((candidate) => candidate.confidence === 'high');
    const camera = highCameraCandidates();
    const y = summary.destinationY || {};
    const metrics = [
      [summary.completeTransitions, 'complete transitions'],
      [xCandidate?.addressHex || 'none', 'Simon X field'],
      [camera.length, 'high scroll candidates'],
      [y.status || 'unknown', 'destination Y status']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');

    const names = camera.map((candidate) => `${candidate.addressHex} ${candidate.metric}`).join(', ');
    document.getElementById('candidate-callout').innerHTML = [
      '<strong>Camera low-byte evidence is now separated from player position</strong>',
      `<p>High-confidence matches: ${escapeHtml(names || 'none')}. Simon X remains resolved at ${escapeHtml(xCandidate?.addressHex)}; Simon Y is held until the fixture set varies vertically.</p>`
    ].join('');
  }

  function renderScrollTable() {
    document.querySelector('#scroll-table tbody').innerHTML = (analysis.summary?.camera?.candidates || []).slice(0, 8).map((candidate) => {
      const lastPcs = [...new Set((candidate.steps || []).map((step) => step.lastWritePc).filter(Boolean))].join(', ');
      const stepText = (candidate.steps || []).map((step) => (
        `${step.stepId}: ${step.before} -> ${step.after}`
      )).join('<br>');
      return [
        '<tr>',
        `<td><strong>${escapeHtml(candidate.metricLabel)}</strong><br><code>${escapeHtml(candidate.metric)}</code></td>`,
        `<td><code>${escapeHtml(candidate.addressHex)}</code><br>${escapeHtml(candidate.memoryRegion)}</td>`,
        `<td>${stepText}</td>`,
        `<td><code>${escapeHtml(lastPcs || 'none')}</code><br>${escapeHtml(candidate.totalScrollStagingWrites)} scroll-staging writes</td>`,
        `<td><span class="tag">${escapeHtml(candidate.confidence)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderStepGrid() {
    document.getElementById('step-grid').innerHTML = allSteps().map((step) => {
      const changed = step.cameraEvidence?.changedMetrics || [];
      const strong = (step.cameraCandidates || []).filter((candidate) => candidate.strength === 'strong').slice(0, 3);
      const scroll = step.finalPpu?.scroll || {};
      return [
        '<article class="routine-card">',
        `<span class="tag">${escapeHtml(step.type)}</span>`,
        `<h3>${escapeHtml(step.id)}</h3>`,
        `<p>Final scroll: X ${escapeHtml(scroll.scrollX)}, Y ${escapeHtml(scroll.scrollY)}. Changed metrics: ${escapeHtml(changed.map((metric) => metric.name).join(', ') || 'none')}.</p>`,
        '<ul>',
        strong.map((candidate) => (
          `<li><code>${escapeHtml(candidate.addressHex)}</code> ${escapeHtml(candidate.metric)} ${escapeHtml(candidate.beforeHex)} -> ${escapeHtml(candidate.afterHex)}</li>`
        )).join(''),
        '</ul>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderYGrid() {
    const y = analysis.summary?.destinationY || {};
    const observations = y.observations || [];
    const diagnostics = y.diagnosticCandidates || [];
    const items = [
      ['Observed Y', `Every scoped transition landed Simon at center ${y.observedAfterCenters?.join(', ') || 'unknown'}; ${y.transitionsWithYDelta || 0} transitions changed Y.`],
      ['Candidate status', diagnostics.length === 0 ? 'No diagnostic Y candidates were found.' : `${diagnostics.length} weak diagnostic candidates exist, but none have writes or repeated support.`],
      ['Fixture needed', y.nextFixtureNeeded || 'The current fixture set can continue to be expanded with more transition families.']
    ];
    document.getElementById('y-grid').innerHTML = items.map(([title, text]) => [
      '<article>',
      `<h3>${escapeHtml(title)}</h3>`,
      `<p>${escapeHtml(text)}</p>`,
      '</article>'
    ].join('')).join('');

    const rows = observations.map((observation) => (
      `${observation.stepId}: ${observation.beforeCenterHex} -> ${observation.afterCenterHex}`
    ));
    if (rows.length > 0) {
      document.getElementById('y-grid').insertAdjacentHTML('beforeend', [
        '<article>',
        '<h3>Y observations</h3>',
        `<p>${escapeHtml(rows.join(' | '))}</p>`,
        '</article>'
      ].join(''));
    }
  }

  function renderNext() {
    const items = [
      ['Safe vertical fixture', 'A stair, ladder-like path, or vertical screen transition where Simon lands at another visible Y.'],
      ['Round-trip if possible', 'A return transition lets the analyzer check whether the same Y field reverses cleanly.'],
      ['Coordinate placement', 'Once X, Y, and scroll are resolved, topology edges can become coordinate-aware placement constraints.']
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
  renderScrollTable();
  renderStepGrid();
  renderYGrid();
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
