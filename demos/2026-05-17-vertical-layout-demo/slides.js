(function () {
  'use strict';

  const atlas = window.VERTICAL_ATLAS;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const current = document.getElementById('slide-number');
  const total = document.getElementById('slide-total');
  const previous = document.getElementById('previous-slide');
  const next = document.getElementById('next-slide');

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

  function renderAtlasStats() {
    if (!atlas) {
      return;
    }
    setText('rendered-count', atlas.summary.rendered);
    setText('vertical-count', atlas.summary.multiSectionLayouts);
    setText('error-count', atlas.summary.renderErrors);

    const verticalList = document.getElementById('vertical-list');
    const verticalCandidates = atlas.verticalCandidates
      .sort((a, b) => {
        const areaA = (a.layoutGrid?.rows || 1) * (a.layoutGrid?.columns || 1);
        const areaB = (b.layoutGrid?.rows || 1) * (b.layoutGrid?.columns || 1);
        return areaB - areaA || a.name.localeCompare(b.name);
      });

    verticalList.innerHTML = '';
    for (const candidate of verticalCandidates.slice(0, 8)) {
      const row = document.createElement('div');
      row.innerHTML = `
        <strong>${candidate.name}</strong>
        <span>${candidate.layoutGrid.columns}x${candidate.layoutGrid.rows} / ${candidate.width}x${candidate.height}</span>
      `;
      verticalList.appendChild(row);
    }
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
  }, { threshold: [0.5, 0.75] });

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

  renderAtlasStats();
  const initialIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
  setActive(initialIndex === -1 ? 0 : initialIndex);
}());
