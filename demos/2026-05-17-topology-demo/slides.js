(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');
  const topology = window.EXTERIOR_TOPOLOGY;

  const areaById = new Map(topology.areas.map((area) => [area.id, area]));
  const nodeById = new Map(topology.nodes.map((node) => [node.id, node]));
  const edgeById = new Map(topology.edges.map((edge) => [edge.id, edge]));
  const route = topology.routes[0];

  function imagePath(node) {
    return `assets/exterior-atlas/${node.atlasImage}?v=topology-1`;
  }

  function categoryLabel(value) {
    return String(value)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function shortAreaLabel(area) {
    const parts = area.label.split(' -> ');
    if (parts.length <= 2) {
      return area.label;
    }
    return `${parts[0]} -> ${parts[parts.length - 1]}`;
  }

  function edgeDescription(edge, fromAreaId, toAreaId) {
    if (!edge) {
      return 'no edge metadata';
    }
    const bytes = edge.transition?.bytes?.join(' ') || 'sequence';
    const direction = edge.sourceArea === fromAreaId && edge.targetArea === toAreaId
      ? edge.direction
      : `${edge.direction} reverse`;
    const kind = edge.transition?.kind || edge.type;
    return `${bytes} / ${kind} / ${direction}`;
  }

  function renderMetrics() {
    const metrics = [
      [topology.summary.nodes, 'exterior nodes'],
      [topology.summary.areas, 'area groups'],
      [topology.summary.edges, 'topology edges'],
      [topology.summary.unresolvedBoundaryEdges, 'unresolved boundary']
    ];
    document.getElementById('metric-row').innerHTML = metrics.map(([value, label]) => (
      `<div><strong>${value}</strong><span>${label}</span></div>`
    )).join('');
  }

  function renderRoutePath() {
    const html = route.areaIds.map((areaId, index) => {
      const area = areaById.get(areaId);
      const previousArea = route.areaIds[index - 1];
      const edge = route.edgeIds[index - 1] ? edgeById.get(route.edgeIds[index - 1]) : undefined;
      const edgeText = index === 0 ? 'start' : edgeDescription(edge, previousArea, areaId);
      return [
        `<section class="area-node" data-category="${area.category}">`,
        `<span class="step-number">${index + 1}</span>`,
        `<strong>${shortAreaLabel(area)}</strong>`,
        `<span>${categoryLabel(area.category)}</span>`,
        `<div class="edge-note muted">${edgeText}</div>`,
        `</section>`
      ].join('');
    }).join('');
    document.getElementById('route-path').innerHTML = html;
  }

  function renderSegmentStrip() {
    const html = route.areaIds.map((areaId, index) => {
      const area = areaById.get(areaId);
      const submaps = area.nodeIds.map((nodeId) => {
        const node = nodeById.get(nodeId);
        return [
          '<div class="submap">',
          `<img src="${imagePath(node)}" alt="${node.name} rendered from ROM data">`,
          `<span>${node.name}</span>`,
          '</div>'
        ].join('');
      }).join('');

      return [
        '<section class="segment-card">',
        `<span class="muted">Step ${index + 1} / ${area.id}</span>`,
        `<h3>${shortAreaLabel(area)}</h3>`,
        `<div class="submap-strip">${submaps}</div>`,
        '</section>'
      ].join('');
    }).join('');
    document.getElementById('segment-strip').innerHTML = html;
  }

  function renderTransitionTable() {
    const rows = route.edgeIds.map((edgeId, index) => {
      const edge = edgeById.get(edgeId);
      const fromArea = areaById.get(route.areaIds[index]);
      const toArea = areaById.get(route.areaIds[index + 1]);
      const reversed = edge.sourceArea !== fromArea.id || edge.targetArea !== toArea.id;
      return [
        '<section class="transition-row">',
        `<div><strong>${shortAreaLabel(fromArea)}</strong><br><span>${fromArea.id}</span></div>`,
        `<div><code>${edge.transition.bytes.join(' ')}</code><br><span>${edge.transition.kind}${reversed ? ' / reverse traversal' : ''}</span></div>`,
        `<div><strong>${shortAreaLabel(toArea)}</strong><br><span>${toArea.id}</span></div>`,
        '</section>'
      ].join('');
    }).join('');
    document.getElementById('transition-table').innerHTML = rows;
  }

  function renderMansions() {
    const mansions = topology.areas.filter((area) => area.category === 'mansion-door-exteriors');
    const html = mansions.map((area) => {
      const node = nodeById.get(area.nodeIds[0]);
      const transitions = topology.edges
        .filter((edge) => edge.sourceArea === area.id && edge.type === 'boundary-transition')
        .map((edge) => {
          const target = areaById.get(edge.targetArea);
          return `${edge.direction}: ${target ? shortAreaLabel(target) : edge.targetArea}`;
        })
        .join('<br>');
      return [
        '<section class="mansion-card">',
        `<img src="${imagePath(node)}" alt="${node.name} rendered from ROM data">`,
        '<div class="mansion-body">',
        `<h3>${node.name}</h3>`,
        `<span>${transitions}</span>`,
        '<p>The topology connection is useful now; the art template still needs its own fix.</p>',
        '<span class="status-pill">template pending</span>',
        '</div>',
        '</section>'
      ].join('');
    }).join('');
    document.getElementById('mansion-grid').innerHTML = html;
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
      const hash = slides[clamped].dataset.hash;
      history.replaceState(null, '', `#${hash}`);
    }
  }

  renderMetrics();
  renderRoutePath();
  renderSegmentStrip();
  renderTransitionTable();
  renderMansions();

  prev.addEventListener('click', () => show(indexFromHash() - 1, true));
  next.addEventListener('click', () => show(indexFromHash() + 1, true));
  window.addEventListener('hashchange', () => show(indexFromHash(), false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      show(indexFromHash() - 1, true);
    } else if (event.key === 'ArrowRight') {
      show(indexFromHash() + 1, true);
    }
  });

  show(indexFromHash(), false);
}());
