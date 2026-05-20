(function () {
  const analysis = window.TRANSITION_PROBES || {};
  const summary = analysis.summary || {};
  const steps = summary.routineBytes?.steps || [];
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

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function contextText(context) {
    if (!context) return 'unknown';
    return `${context.objset}/${context.area}/${context.submap}`;
  }

  function signedDelta(beforeHex, afterHex) {
    const before = Number.parseInt(String(beforeHex).replace(/^0x/i, ''), 16);
    const after = Number.parseInt(String(afterHex).replace(/^0x/i, ''), 16);
    if (!Number.isFinite(before) || !Number.isFinite(after)) return 'unknown';
    const delta = after - before;
    return delta === 0 ? '0' : delta > 0 ? `+${delta}` : String(delta);
  }

  function byteByAddress(step, addressHex) {
    return (step.bytes || []).find((byte) => byte.addressHex === addressHex);
  }

  function byteValues(step) {
    return (step.bytes || []).map((byte) => byte.afterHex).join(' ');
  }

  function byteCell(byte) {
    if (!byte) return 'missing';
    const pc = byte.lastTransitionRoutineWrite?.pc || 'no PC';
    return [
      `<code>${escapeHtml(byte.beforeHex)}</code> to <code>${escapeHtml(byte.afterHex)}</code>`,
      `<br><span class="muted">${escapeHtml(byte.transitionRoutineWriteCount)} write(s) at <code>${escapeHtml(pc)}</code></span>`
    ].join('');
  }

  function topologyEdge(step) {
    const evidence = step.topologyEdge || {};
    return evidence.edge || (evidence.candidateEdges || [])[0];
  }

  function topologyText(step) {
    const evidence = step.topologyEdge || {};
    const edge = topologyEdge(step);
    if (!edge) {
      return `<span class="tag">${escapeHtml(evidence.matchStatus || 'none')}</span>`;
    }
    const bytes = edge.transition?.bytes ? edge.transition.bytes.join(' ') : 'none';
    return [
      `<span class="tag">${escapeHtml(evidence.matchStatus)}</span>`,
      `<br><code>${escapeHtml(edge.id)}</code>`,
      `<br><span class="muted">${escapeHtml(bytes)} ${escapeHtml(edge.semantics?.placementMode || '')}</span>`
    ].join('');
  }

  function simonText(step) {
    return [
      `X <code>${escapeHtml(step.simon?.beforeX)}</code> to <code>${escapeHtml(step.simon?.afterX)}</code>`,
      `<br>Y <code>${escapeHtml(step.simon?.beforeY)}</code> to <code>${escapeHtml(step.simon?.afterY)}</code>`,
      `<br><span class="muted">Y delta ${escapeHtml(signedDelta(step.simon?.beforeY, step.simon?.afterY))}</span>`
    ].join('');
  }

  function cameraText(step) {
    const camera = step.camera || {};
    const changed = (camera.changedMetrics || []).map((metric) => metric.metric).join(', ');
    return changed || 'no camera metric change';
  }

  function renderMetrics() {
    const pcs = unique(steps.flatMap((step) => (
      (step.bytes || []).map((byte) => byte.lastTransitionRoutineWrite?.pc)
    )));
    const deborah = steps.find((step) => step.stepId === 'deborah-cliff-to-bodley-door');
    const metrics = [
      [summary.probes ?? 0, 'scripted probes'],
      [summary.transitions ?? 0, 'transition steps'],
      [summary.completeTransitions ?? 0, 'completed steps'],
      [pcs.length, '$70-$73 write PCs']
    ];

    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`
    )).join('');

    document.getElementById('overview-callout').innerHTML = [
      '<strong>The transition byte writes are now explicit evidence.</strong>',
      `<p>Across ${escapeHtml(summary.completeTransitions ?? 0)} completed transitions, <code>$70-$73</code> are written at <code>${escapeHtml(pcs.join(', '))}</code>. Deborah Cliff completed in ${escapeHtml(deborah?.framesToTarget ?? 'unknown')} frames and is labeled diagnostic because its ROM edge is a special transport candidate.</p>`
    ].join('');
  }

  function renderMatrix() {
    document.querySelector('#matrix-table tbody').innerHTML = steps.map((step) => [
      '<tr>',
      `<td><strong>${escapeHtml(step.label || step.stepId)}</strong><br><code>${escapeHtml(step.stepId)}</code><br><span class="tag">${escapeHtml(step.status)}</span></td>`,
      `<td><code>${escapeHtml(contextText(step.startContext))}</code><br>to<br><code>${escapeHtml(contextText(step.finalContext))}</code></td>`,
      `<td>${simonText(step)}<br><span class="muted">${escapeHtml(cameraText(step))}</span></td>`,
      `<td>${topologyText(step)}</td>`,
      `<td>${byteCell(byteByAddress(step, '0x0070'))}</td>`,
      `<td>${byteCell(byteByAddress(step, '0x0071'))}</td>`,
      `<td>${byteCell(byteByAddress(step, '0x0072'))}</td>`,
      `<td>${byteCell(byteByAddress(step, '0x0073'))}</td>`,
      '</tr>'
    ].join('')).join('');
  }

  function renderCastlevania() {
    const rows = steps.filter((step) => step.stepId.startsWith('castlevania') || step.stepId === 'bridge-to-castlevania');
    document.querySelector('#castlevania-table tbody').innerHTML = rows.map((step) => [
      '<tr>',
      `<td><strong>${escapeHtml(step.label)}</strong><br><code>${escapeHtml(step.stepId)}</code></td>`,
      `<td><span class="tag">${escapeHtml(step.status)}</span><br>${escapeHtml(step.framesToTarget)} frame(s)</td>`,
      `<td><code>${escapeHtml(contextText(step.startContext))}</code><br>to <code>${escapeHtml(contextText(step.finalContext))}</code></td>`,
      `<td>${simonText(step)}</td>`,
      `<td><code>${escapeHtml(byteValues(step))}</code></td>`,
      `<td>${topologyText(step)}</td>`,
      '</tr>'
    ].join('')).join('');
  }

  function renderDeborah() {
    const step = steps.find((item) => item.stepId === 'deborah-cliff-to-bodley-door') || {};
    const edge = topologyEdge(step);
    const gridItems = [
      ['Status', step.status || 'missing', `${step.framesToTarget ?? 'unknown'} frames to target`],
      ['Context', contextText(step.startContext), `to ${contextText(step.finalContext)}`],
      ['Simon Y', `${step.simon?.beforeY || '?'} to ${step.simon?.afterY || '?'}`, `delta ${signedDelta(step.simon?.beforeY, step.simon?.afterY)}`],
      ['Topology', step.topologyEdge?.matchStatus || 'none', edge?.semantics?.placementMode || 'no ROM edge'],
      ['ROM bytes', edge?.transition?.bytes?.join(' ') || 'unresolved', edge?.id || 'no edge id'],
      ['Routine writes', `${(step.bytes || [])[0]?.transitionRoutineWriteCount ?? 0} per byte`, 'written inside 7:$D0B0-$D260']
    ];
    document.getElementById('deborah-grid').innerHTML = gridItems.map(([title, value, detail]) => [
      '<article>',
      `<h3>${escapeHtml(title)}</h3>`,
      `<strong>${escapeHtml(value)}</strong>`,
      `<span>${escapeHtml(detail)}</span>`,
      '</article>'
    ].join('')).join('');

    document.querySelector('#deborah-table tbody').innerHTML = (step.bytes || []).map((byte) => [
      '<tr>',
      `<td><code>${escapeHtml(byte.addressHex)}</code></td>`,
      `<td><code>${escapeHtml(byte.beforeHex)}</code></td>`,
      `<td><code>${escapeHtml(byte.afterHex)}</code></td>`,
      `<td>${escapeHtml(byte.transitionRoutineWriteCount)} transition write(s)<br>${escapeHtml(byte.writeCount)} total write(s)</td>`,
      `<td><code>${escapeHtml(byte.lastTransitionRoutineWrite?.pc || 'none')}</code></td>`,
      '</tr>'
    ].join('')).join('');
  }

  function renderInteriors() {
    const interiorSteps = steps.filter((step) => step.type === 'interior-exit' || step.type === 'interior-entry');
    document.querySelector('#interior-table tbody').innerHTML = interiorSteps.map((step) => [
      '<tr>',
      `<td><strong>${escapeHtml(step.label)}</strong><br><code>${escapeHtml(step.stepId)}</code></td>`,
      `<td><code>${escapeHtml(step.input)}</code></td>`,
      `<td>${escapeHtml(step.framesToTarget)} frame(s)</td>`,
      `<td><code>${escapeHtml(contextText(step.startContext))}</code><br>to <code>${escapeHtml(contextText(step.finalContext))}</code></td>`,
      `<td>${simonText(step)}</td>`,
      `<td><code>${escapeHtml(byteValues(step))}</code></td>`,
      '</tr>'
    ].join('')).join('');
  }

  function renderNext() {
    const items = [
      ['Read the routine around the writes', 'The write PCs are stable: D19E, D1A3, D1A8, and D1AD. The next job is decoding what inputs feed those stores.'],
      ['Map byte values back to ROM tables', 'Direct topology edges already carry ROM transition triples. We need to learn how those triples become placement and scroll state.'],
      ['Promote renderer rules only after decoding', 'This milestone stays evidence-first. Composition rules should change only when the ROM routine explains the player and camera outputs.']
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
  renderMatrix();
  renderCastlevania();
  renderDeborah();
  renderInteriors();
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
