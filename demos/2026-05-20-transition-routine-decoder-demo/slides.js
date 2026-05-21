(function () {
  const decoder = window.TRANSITION_ROUTINE_DECODER || {};
  const summary = decoder.summary || {};
  const transitions = decoder.transitions || [];
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

  function byteValues(step) {
    return (step.routineBytes || []).map((byte) => byte.after).join(' ');
  }

  function writeCounts(step) {
    return (step.routineBytes || []).map((byte) => `${byte.address}:${byte.transitionRoutineWriteCount}`).join(' ');
  }

  function renderMetrics() {
    const metrics = [
      [summary.probes ?? 0, 'scripted probes'],
      [summary.transitions ?? 0, 'transitions'],
      [summary.writePcs?.length ?? 0, 'routine write PCs'],
      [summary.noHandPlacedCoordinates ? 0 : '?', 'hand-placed coords']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
    document.getElementById('overview-callout').innerHTML = [
      '<strong>The decoder creates a reusable evidence model.</strong>',
      `<p>It promotes <code>$70-$73</code> only as observed transition routine output bytes. Visible-Y and camera formulas stay diagnostic, which is exactly what lets the next composer avoid false precision.</p>`
    ].join('');
  }

  function renderWindows() {
    document.querySelector('#window-table tbody').innerHTML = (decoder.romWindows || []).map((window) => {
      const bytes = (window.bytes || []).map((byte) => (
        byte.isTracePc
          ? `<strong><code>${escapeHtml(byte.value)}</code></strong>`
          : `<code>${escapeHtml(byte.value)}</code>`
      )).join(' ');
      return [
        '<tr>',
        `<td><code>${escapeHtml(window.pc)}</code></td>`,
        `<td>${escapeHtml(window.fixedBank)}</td>`,
        `<td><code>${escapeHtml(window.fileOffset)}</code></td>`,
        `<td>${bytes}<br><span class="muted">${escapeHtml(window.start)} to ${escapeHtml(window.end)}</span></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderTransitionMatrix() {
    document.querySelector('#transition-table tbody').innerHTML = transitions.map((step) => {
      const topology = step.topology || {};
      const camera = (step.camera?.changedMetrics || []).map((metric) => metric.metric).join(', ') || 'none';
      return [
        '<tr>',
        `<td><strong>${escapeHtml(step.label)}</strong><br><code>${escapeHtml(step.stepId)}</code><br><span class="tag">${escapeHtml(step.status)}</span></td>`,
        `<td><span class="tag">${escapeHtml(topology.matchStatus)}</span><br><code>${escapeHtml(topology.edgeId || 'no edge')}</code><br>${escapeHtml((topology.transitionBytes || []).join(' '))}</td>`,
        `<td>X <code>${escapeHtml(step.simon.beforeX)}</code> to <code>${escapeHtml(step.simon.afterX)}</code><br>Y <code>${escapeHtml(step.simon.beforeY)}</code> to <code>${escapeHtml(step.simon.afterY)}</code></td>`,
        `<td>${escapeHtml(camera)}</td>`,
        `<td><code>${escapeHtml(byteValues(step))}</code></td>`,
        `<td><code>${escapeHtml(writeCounts(step))}</code></td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderRoles() {
    const roleItems = [
      ...(decoder.byteRoleHypotheses?.promoted || []),
      ...(decoder.byteRoleHypotheses?.diagnostic || []),
      ...(decoder.byteRoleHypotheses?.unresolved || [])
    ];
    document.getElementById('role-grid').innerHTML = roleItems.map((item) => [
      '<article>',
      `<h3>${escapeHtml(item.id)}</h3>`,
      `<strong>${escapeHtml(item.status)}</strong>`,
      `<span>${escapeHtml(item.evidence || item.note || '')}</span>`,
      '</article>'
    ].join('')).join('');
  }

  function renderNext() {
    const items = [
      ['Routine-observed edges', 'The world composer can mark probed exterior transitions as routine-supported instead of topology-only.'],
      ['Connector-only honesty', 'Deborah remains a connector unless the routine explains true transport coordinates.'],
      ['No coordinate overrides', 'The next map can be assembled by constraints and provenance labels, with zero per-area hand placement.']
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
  renderWindows();
  renderTransitionMatrix();
  renderRoles();
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
