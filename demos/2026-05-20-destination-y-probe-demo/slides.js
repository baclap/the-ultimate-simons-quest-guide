(function () {
  const analysis = window.TRANSITION_PROBES || {};
  const summary = analysis.summary || {};
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

  function stepLabel(stepId) {
    const step = allSteps().find((item) => item.id === stepId);
    return step?.label || stepId;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function renderMetrics() {
    const xCandidate = (summary.xCenterCandidates || [])[0];
    const y = summary.destinationY || {};
    const cameraMatches = summary.camera?.changedMetrics || [];
    const metrics = [
      [summary.completeTransitions ?? 0, 'complete transitions'],
      [xCandidate?.addressHex || 'none', 'Simon X candidate'],
      [y.transitionsWithYDelta ?? 0, 'visible Y deltas'],
      [cameraMatches.length, 'camera metrics changed']
    ];

    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');

    const topY = (y.diagnosticCandidates || [])[0];
    document.getElementById('candidate-callout').innerHTML = [
      `<strong>${escapeHtml(xCandidate?.addressHex || 'No X candidate')} is high-confidence for Simon X</strong>`,
      `<p>${escapeHtml(xCandidate?.addressHex || 'No candidate')} matched all ${escapeHtml(summary.completeTransitions ?? 0)} completed transitions after the generic sorter began favoring written sprite-staging bytes. The lead Y clue is ${escapeHtml(topY?.addressHex || 'none')}, but it stays diagnostic because only Castlevania changes visible Y.</p>`
    ].join('');
  }

  function renderDeltaTable() {
    const observations = summary.destinationY?.observations || [];
    document.querySelector('#delta-table tbody').innerHTML = observations.map((observation) => {
      const delta = observation.afterCenter - observation.beforeCenter;
      const label = stepLabel(observation.stepId);
      const status = observation.changed
        ? 'visible Y delta'
        : observation.stepId === 'dora-part-3-to-part-2'
          ? 'camera plane changed'
          : 'same visible Y';
      return [
        '<tr>',
        `<td><strong>${escapeHtml(label)}</strong><br><code>${escapeHtml(observation.stepId)}</code></td>`,
        `<td><code>${escapeHtml(observation.beforeCenterHex)}</code><br>top <code>${escapeHtml(observation.beforeSpriteMinHex)}</code></td>`,
        `<td><code>${escapeHtml(observation.afterCenterHex)}</code><br>top <code>${escapeHtml(observation.afterSpriteMinHex)}</code></td>`,
        `<td>${delta === 0 ? '0' : escapeHtml(delta > 0 ? `+${delta}` : delta)}</td>`,
        `<td><span class="tag">${escapeHtml(status)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderCandidateTable() {
    const candidates = summary.destinationY?.diagnosticCandidates || [];
    document.querySelector('#candidate-table tbody').innerHTML = candidates.slice(0, 8).map((candidate) => {
      const matched = (candidate.steps || []).map((step) => {
        const metrics = (step.matches || []).map((match) => match.metric).join(', ');
        return `${step.stepId}: ${step.before} -> ${step.after}${metrics ? ` (${metrics})` : ''}`;
      }).join('<br>');
      const writePcs = unique((candidate.steps || []).map((step) => step.lastWritePc)).join(', ');
      return [
        '<tr>',
        `<td><code>${escapeHtml(candidate.addressHex)}</code><br>${escapeHtml(candidate.memoryRegion)}</td>`,
        `<td>${escapeHtml(candidate.candidateKind || 'candidate')}</td>`,
        `<td>${matched || 'none'}</td>`,
        `<td>${escapeHtml(candidate.totalTransitionRoutineWrites || 0)} transition writes<br><code>${escapeHtml(writePcs || 'no PC')}</code></td>`,
        `<td><span class="tag">${escapeHtml(candidate.confidence)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderScrollTable() {
    const candidates = summary.camera?.candidates || [];
    document.querySelector('#scroll-table tbody').innerHTML = candidates.slice(0, 10).map((candidate) => {
      const stepText = (candidate.steps || []).map((step) => (
        `${step.stepId}: ${step.before} -> ${step.after}`
      )).join('<br>');
      const writePcs = unique((candidate.steps || []).map((step) => step.lastWritePc)).join(', ');
      return [
        '<tr>',
        `<td><strong>${escapeHtml(candidate.metricLabel)}</strong><br><code>${escapeHtml(candidate.metric)}</code></td>`,
        `<td><code>${escapeHtml(candidate.addressHex)}</code><br>${escapeHtml(candidate.memoryRegion)}</td>`,
        `<td>${escapeHtml(candidate.matchedChangedSteps)} / ${escapeHtml(candidate.changedSteps)} changed steps<br>${stepText}</td>`,
        `<td><code>${escapeHtml(writePcs || 'no PC')}</code><br>${escapeHtml(candidate.totalScrollStagingWrites || 0)} scroll-staging writes</td>`,
        `<td><span class="tag">${escapeHtml(candidate.confidence)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderNext() {
    const items = [
      ['Decode `$70-$73` writes', 'Those bytes are written by the transition routine for each scoped edge. The next step is mapping them back to ROM transition data.'],
      ['Separate player and camera outputs', 'Castlevania changes Simon Y; Dora changes the camera plane without changing Simon Y. The renderer needs both outputs.'],
      ['Promote rules only when repeated', 'The solver should promote destination placement only after another true visible-Y delta or a ROM table explanation supports it.']
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
  renderDeltaTable();
  renderCandidateTable();
  renderScrollTable();
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
