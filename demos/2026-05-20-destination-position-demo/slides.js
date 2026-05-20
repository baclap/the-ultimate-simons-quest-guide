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

  function xCandidate(step) {
    return (step.positionCandidates || []).find((candidate) => candidate.addressHex === '0x0348');
  }

  function renderMetrics() {
    const summary = analysis.summary || {};
    const highCandidate = (summary.xCenterCandidates || []).find((candidate) => candidate.confidence === 'high');
    const metrics = [
      [summary.probes, 'probes'],
      [summary.transitions, 'transitions'],
      [summary.completeTransitions, 'complete'],
      [highCandidate?.addressHex || 'none', 'resolved X field']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');

    document.getElementById('candidate-callout').innerHTML = [
      `<strong>${escapeHtml(highCandidate?.addressHex || 'No high-confidence candidate')}</strong>`,
      `<p>Matched ${escapeHtml(highCandidate?.matchedSteps || 0)} of ${escapeHtml(summary.transitions || 0)} scoped transitions, with last writes observed at ${escapeHtml([...new Set((highCandidate?.steps || []).map((step) => step.lastWritePc).filter(Boolean))].join(', '))}.</p>`
    ].join('');
  }

  function renderPositionTable() {
    document.querySelector('#position-table tbody').innerHTML = allSteps().map((step) => {
      const candidate = xCandidate(step);
      const after = step.spriteEvidence?.afterSimon;
      const center = after?.bounds?.xCenter;
      return [
        '<tr>',
        `<td><strong>${escapeHtml(step.id)}</strong><br>${escapeHtml(step.label)}</td>`,
        `<td><code>${escapeHtml(center == null ? 'unknown' : `0x${center.toString(16).toUpperCase().padStart(2, '0')}`)}</code><br>${escapeHtml(after?.spriteCount)} sprites, ${escapeHtml(after?.hintTiles)} Simon tile hints</td>`,
        `<td><code>${escapeHtml(candidate?.afterHex)}</code><br>${escapeHtml(candidate?.beforeHex)} -> ${escapeHtml(candidate?.afterHex)}</td>`,
        `<td><code>${escapeHtml(candidate?.lastWrite?.pc)}</code><br>step frame ${escapeHtml(candidate?.lastWrite?.stepFrame)}</td>`,
        `<td><span class="tag">${escapeHtml(after?.confidence)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderRoutine() {
    document.getElementById('routine-grid').innerHTML = allSteps().slice(0, 3).map((step) => {
      const details = step.ramWriteEvidence?.transitionRoutineDetails || [];
      return [
        '<article class="routine-card">',
        `<span class="tag">${escapeHtml(step.id)}</span>`,
        `<h3>${escapeHtml(step.framesToTarget)} frames to target</h3>`,
        `<p>${escapeHtml(step.ramWriteEvidence?.transitionRoutineWrites)} writes came from the focused transition-routine range.</p>`,
        '<ul>',
        details.slice(-8).map((detail) => (
          `<li><code>${escapeHtml(detail.pc)}</code> ${escapeHtml(detail.address)} = ${escapeHtml(detail.value)}</li>`
        )).join(''),
        '</ul>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderGrids() {
    const meaning = [
      ['Runtime observed', 'The value comes from Mesen-observed CPU RAM and OAM after the game performs the transition.'],
      ['ROM path visible', 'The trace records transition-routine writes, including context and loader bytes, with PC addresses.'],
      ['No per-area placement', 'The demo does not encode special X values for Jova or Doina by hand.']
    ];
    document.getElementById('meaning-grid').innerHTML = meaning.map(([title, text]) => [
      '<article>',
      `<h3>${escapeHtml(title)}</h3>`,
      `<p>${escapeHtml(text)}</p>`,
      '</article>'
    ].join('')).join('');

    const nextItems = [
      ['Destination Y', 'Add the same confidence path for Simon vertical placement, especially stairs and vertical screens.'],
      ['Camera state', 'Separate player position from scroll and nametable state so route composition can place viewports correctly.'],
      ['More transition families', 'Run this probe against mansion doors, vertical paths, and special transport edges.']
    ];
    document.getElementById('next-grid').innerHTML = nextItems.map(([title, text]) => [
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
  renderPositionTable();
  renderRoutine();
  renderGrids();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(indexFromHash() - 1, true);
    if (event.key === 'ArrowRight') show(indexFromHash() + 1, true);
  });

  show(indexFromHash(), false);
}());
