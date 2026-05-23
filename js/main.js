'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');
  const header = document.getElementById('header');

  /* ---- Mobile nav toggle ---- */
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('nav__list--open');
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('nav__list--open');
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observerOptions = {
    rootMargin: `-${header.offsetHeight}px 0px -55% 0px`,
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Scroll reveal animations ---- */
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
