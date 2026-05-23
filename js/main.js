'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================
     Splash Screen
     ======================================== */
  const splash = document.getElementById('splash');

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('splash--hidden');
    }, 800);
  });

  /* ========================================
     Custom Cursor + Trail
     ======================================== */
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  const TRAIL_COUNT = 8;
  const trailDots = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    const size = (1 - i / TRAIL_COUNT) * 6 + 2;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.opacity = (1 - i / TRAIL_COUNT) * 0.5;
    document.body.appendChild(dot);
    trailDots.push({ el: dot, x: 0, y: 0 });
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    trailDots[0].x += (cursorX - trailDots[0].x) * 0.25;
    trailDots[0].y += (cursorY - trailDots[0].y) * 0.25;

    for (let i = 1; i < TRAIL_COUNT; i++) {
      trailDots[i].x += (trailDots[i - 1].x - trailDots[i].x) * 0.25;
      trailDots[i].y += (trailDots[i - 1].y - trailDots[i].y) * 0.25;
    }

    trailDots.forEach(d => {
      d.el.style.left = d.x + 'px';
      d.el.style.top = d.y + 'px';
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .btn, .skill-card, .project-card, .education-card, .contact__link').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--lg'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--lg'));
  });

  /* ========================================
     Dock Navigation
     ======================================== */
  const dock = document.getElementById('dock');
  const dockItems = document.querySelectorAll('.dock__item');
  let lastScrollY = window.scrollY;
  let dockTimer = null;

  const handleDockVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollUp = currentScrollY < lastScrollY;

    if (currentScrollY <= 100) {
      dock.classList.remove('dock--hidden');
    } else if (scrollUp) {
      dock.classList.remove('dock--hidden');
      clearTimeout(dockTimer);
      dockTimer = setTimeout(() => {
        dock.classList.add('dock--hidden');
      }, 2500);
    } else {
      dock.classList.add('dock--hidden');
    }

    lastScrollY = currentScrollY;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleDockVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ---- Active dock link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dockItems.forEach(item => {
          item.classList.remove('dock__item--active');
          if (item.getAttribute('href') === `#${entry.target.id}`) {
            item.classList.add('dock__item--active');
          }
        });
      }
    });
  }, {
    rootMargin: '0px 0px -55% 0px',
  });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Smooth scroll for dock items ---- */
  dockItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ========================================
     Scroll Reveal Animations
     ======================================== */
  const revealElements = document.querySelectorAll(
    '.hero__content, .section__title, .section__subtitle, ' +
    '.about__content, .skills__grid, .projects__grid, ' +
    '.timeline, .education__grid, .contact__links'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});
