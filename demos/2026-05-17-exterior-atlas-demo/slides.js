(function () {
  'use strict';

  const atlas = window.EXTERIOR_ATLAS;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const current = document.getElementById('slide-number');
  const total = document.getElementById('slide-total');
  const previous = document.getElementById('previous-slide');
  const next = document.getElementById('next-slide');
  const assetRoot = 'assets/exterior-atlas/';
  let activeIndex = 0;
  let activeFilter = 'all';

  total.textContent = String(slides.length);

  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function visibleIndex() {
    return slides
      .map((slide, index) => ({ index, distance: Math.abs(slide.getBoundingClientRect().top) }))
      .sort((a, b) => a.distance - b.distance)[0].index;
  }

  function setActive(index) {
    activeIndex = index;
    current.textContent = String(index + 1);
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    history.replaceState(null, '', `#${slides[index].id}`);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = String(value);
    }
  }

  function confidenceClass(candidate) {
    return candidate.confidence === 'validated-template' ? 'validated' : 'inferred';
  }

  function niceCategory(category) {
    return category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function renderHeroSamples() {
    const ids = [
      'obj00-area00-sub00-jova',
      'obj02-area00-sub00-jova-woods',
      'obj03-area00-sub00-camilla-cemetery',
      'obj05-area00-sub00-castlevania'
    ];
    const samples = ids
      .map((id) => atlas.candidates.find((candidate) => candidate.id === id))
      .filter(Boolean);
    const container = document.getElementById('hero-samples');
    container.innerHTML = '';
    for (const sample of samples) {
      const card = document.createElement('div');
      card.className = 'sample-card';
      card.innerHTML = `
        <img src="${assetRoot}${sample.output}" alt="${sample.name} rendered from ROM layout data">
        <span>${sample.name}</span>
      `;
      container.appendChild(card);
    }
  }

  function renderCoverage() {
    const validated = atlas.summary.byConfidence['validated-template'] || 0;
    const inferred = atlas.summary.byConfidence['inferred-template'] || 0;
    setText('total-candidates', atlas.summary.candidates);
    setText('rendered-candidates', atlas.summary.rendered);
    setText('special-records', atlas.summary.specialScreenRecords);

    const stats = document.getElementById('coverage-stats');
    stats.innerHTML = `
      <div><strong>${atlas.summary.candidates}</strong><span>inventory entries</span></div>
      <div><strong>${validated}</strong><span>validated-template renders</span></div>
      <div><strong>${inferred}</strong><span>inferred-template renders</span></div>
    `;

    const maxCount = Math.max(...Object.values(atlas.summary.byCategory));
    const bars = document.getElementById('category-bars');
    bars.innerHTML = '';
    for (const [category, count] of Object.entries(atlas.summary.byCategory)) {
      const row = document.createElement('div');
      row.innerHTML = `
        <strong>${niceCategory(category)}: ${count}</strong>
        <div class="bar-track"><div class="bar-fill" style="width: ${(count / maxCount) * 100}%"></div></div>
      `;
      bars.appendChild(row);
    }
  }

  function renderFilters() {
    const categories = ['all', ...Object.keys(atlas.summary.byCategory)];
    const bar = document.getElementById('filter-bar');
    bar.innerHTML = '';
    for (const category of categories) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = category === 'all' ? 'All' : niceCategory(category);
      button.dataset.filter = category;
      button.className = category === activeFilter ? 'active' : '';
      button.addEventListener('click', () => {
        activeFilter = category;
        renderFilters();
        renderAtlasGrid();
      });
      bar.appendChild(button);
    }
  }

  function renderAtlasGrid() {
    const grid = document.getElementById('atlas-grid');
    const candidates = atlas.candidates.filter((candidate) => {
      return candidate.renderStatus === 'rendered' && (activeFilter === 'all' || candidate.category === activeFilter);
    });
    grid.innerHTML = '';
    for (const candidate of candidates) {
      const card = document.createElement('article');
      card.className = 'atlas-card';
      const statusLabel = candidate.confidence === 'validated-template' ? 'validated template' : 'inferred template';
      card.innerHTML = `
        <img src="${assetRoot}${candidate.output}" alt="${candidate.name} rendered from ROM layout data">
        <div class="atlas-card-body">
          <h3>${candidate.name}</h3>
          <div><span class="pill ${confidenceClass(candidate)}">${statusLabel}</span></div>
          <div class="atlas-meta">
            <span>${candidate.objsetHex}</span>
            <span>${candidate.areaHex}/${candidate.submapHex}</span>
            <span>${candidate.width}x${candidate.height}</span>
            <span>${candidate.columnGroupCount} groups</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  function renderSpecialList() {
    const list = document.getElementById('special-list');
    const specials = atlas.candidates.filter((candidate) => {
      return candidate.screenRecord.layoutIndexSource !== 'screen-record-byte-0';
    });
    list.innerHTML = '';
    for (const candidate of specials) {
      const row = document.createElement('div');
      row.innerHTML = `
        <strong>${candidate.name}</strong>
        <span>${candidate.screenRecord.firstBytes.slice(0, 3).join(' ')} -> layout ${candidate.screenRecord.layoutIndex}</span>
      `;
      list.appendChild(row);
    }
  }

  if (atlas) {
    renderHeroSamples();
    renderCoverage();
    renderFilters();
    renderAtlasGrid();
    renderSpecialList();
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) {
      return;
    }
    const index = slides.indexOf(visible.target);
    if (index !== -1) {
      setActive(index);
    }
  }, { threshold: [0.55, 0.75] });

  slides.forEach((slide) => observer.observe(slide));

  previous.addEventListener('click', () => goTo(visibleIndex() - 1));
  next.addEventListener('click', () => goTo(visibleIndex() + 1));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goTo(visibleIndex() + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(visibleIndex() - 1);
    }
  });

  const initialIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
  setActive(initialIndex === -1 ? 0 : initialIndex);
}());
