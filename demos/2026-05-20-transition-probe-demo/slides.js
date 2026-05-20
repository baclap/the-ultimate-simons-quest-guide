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

  function formatKnownFields(step) {
    const fields = step.changedBytes?.knownFields || [];
    if (fields.length === 0) {
      return 'none';
    }
    return fields.map((field) => (
      `<code>${escapeHtml(field.addressHex)}</code> ${escapeHtml(field.label)} ${escapeHtml(field.beforeHex)} -> ${escapeHtml(field.afterHex)}`
    )).join('<br>');
  }

  function contextText(context) {
    if (!context) {
      return 'unavailable';
    }
    return `objset ${context.objset}, area ${context.area}, submap ${context.submapRaw}`;
  }

  function renderMetrics() {
    const summary = analysis.summary || {};
    const metrics = [
      [summary.probes, 'probes'],
      [summary.transitions, 'transitions'],
      [summary.completeTransitions, 'complete'],
      [summary.timeoutTransitions, 'timeouts']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');
  }

  function renderProbeGrid(targetId, probeId) {
    const probe = (analysis.probes || []).find((item) => item.id === probeId);
    const maxDuration = Math.max(...(probe?.steps || []).map((step) => step.durationFrames || 1), 1);
    document.getElementById(targetId).innerHTML = (probe?.steps || []).map((step) => {
      const targetPct = Math.max(2, Math.round(((step.framesToTarget || 0) / maxDuration) * 100));
      const known = step.changedBytes?.knownFields || [];
      const tagClass = step.type.includes('return') || step.type.includes('entry') ? 'warn' : '';
      return [
        '<article class="probe-card">',
        `<span class="tag ${tagClass}">${escapeHtml(step.type)}</span>`,
        `<h3>${escapeHtml(step.label)}</h3>`,
        `<p>${escapeHtml(probe.reason)}</p>`,
        '<div class="timeline" aria-hidden="true">',
        `<span style="width:${targetPct}%"></span>`,
        '</div>',
        '<dl class="probe-meta">',
        `<div><dt>Input</dt><dd>${escapeHtml(step.input)}</dd></div>`,
        `<div><dt>Frames to target</dt><dd>${escapeHtml(step.framesToTarget)}</dd></div>`,
        `<div><dt>Start</dt><dd>${escapeHtml(contextText(step.startContext))}</dd></div>`,
        `<div><dt>Final</dt><dd>${escapeHtml(contextText(step.finalContext))}</dd></div>`,
        '</dl>',
        '<ul class="field-list">',
        known.slice(0, 4).map((field) => (
          `<li><code>${escapeHtml(field.addressHex)}</code> ${escapeHtml(field.label)} ${escapeHtml(field.beforeHex)} -> ${escapeHtml(field.afterHex)}</li>`
        )).join(''),
        '</ul>',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderEvidenceTable() {
    const rows = allSteps();
    document.querySelector('#evidence-table tbody').innerHTML = rows.map(({ probe, ...step }) => {
      const candidates = step.changedBytes?.zeroPageCandidates || [];
      const firstCandidates = candidates.slice(0, 8).map((candidate) => (
        `<code>${escapeHtml(candidate.addressHex)}</code> ${escapeHtml(candidate.beforeHex)} -> ${escapeHtml(candidate.afterHex)}`
      )).join('<br>');
      return [
        '<tr>',
        `<td><strong>${escapeHtml(step.id)}</strong><br>${escapeHtml(probe.label)}</td>`,
        `<td>${formatKnownFields(step)}</td>`,
        `<td>${firstCandidates || 'none'}</td>`,
        `<td>${escapeHtml(step.changedBytes?.count ?? 'unknown')}</td>`,
        '</tr>'
      ].join('');
    }).join('');
  }

  function renderNext() {
    const items = [
      ['Find position bytes', 'Use the before/after snapshots to identify Simon and camera destination state across transition types.'],
      ['Trace ROM writes', 'Once candidate bytes are known, trace the writes back to the transition routine and any destination tables.'],
      ['Promote rules', 'Convert decoded destination data into composition rules for horizontal, vertical, door, and special transport edges.']
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
    if (updateHash) {
      history.replaceState(null, '', `#${slides[clamped].dataset.hash}`);
    }
  }

  renderMetrics();
  renderProbeGrid('outdoor-grid', 'jova-woods-left-round-trip');
  renderProbeGrid('interior-grid', 'doina-church-round-trip');
  renderEvidenceTable();
  renderNext();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      show(indexFromHash() - 1, true);
    }
    if (event.key === 'ArrowRight') {
      show(indexFromHash() + 1, true);
    }
  });

  show(indexFromHash(), false);
}());
