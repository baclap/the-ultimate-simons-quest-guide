(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const current = document.getElementById('slide-number');
  const total = document.getElementById('slide-total');
  const previous = document.getElementById('previous-slide');
  const next = document.getElementById('next-slide');
  let activeIndex = 0;

  total.textContent = String(slides.length);

  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setActive(index) {
    activeIndex = index;
    current.textContent = String(index + 1);
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    history.replaceState(null, '', `#${slides[index].id}`);
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

  previous.addEventListener('click', () => goTo(activeIndex - 1));
  next.addEventListener('click', () => goTo(activeIndex + 1));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  });

  const initialIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
  setActive(initialIndex === -1 ? 0 : initialIndex);
}());
