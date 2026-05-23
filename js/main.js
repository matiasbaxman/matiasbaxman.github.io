'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================
     i18n — Language Switching
     ======================================== */
  const i18n = {
    current: 'en',
    strings: {
      dock_about:      { es: 'Sobre mí', en: 'About' },
      dock_skills:     { es: 'Skills', en: 'Skills' },
      dock_projects:   { es: 'Proyectos', en: 'Projects' },
      dock_experience: { es: 'Experiencia', en: 'Experience' },
      dock_education:  { es: 'Educación', en: 'Education' },
      dock_contact:    { es: 'Contacto', en: 'Contact' },
      dock_lang:       { es: 'English', en: 'Español' },

      hero_role:    { es: 'Desarrollador de Software', en: 'Software Developer' },
      hero_tagline: { es: 'Construyo soluciones digitales limpias, eficientes y centradas en el usuario.', en: 'I build clean, efficient, user-centered digital solutions.' },
      hero_btn_projects: { es: 'Ver proyectos', en: 'View Projects' },
      hero_btn_contact:  { es: 'Contactarme', en: 'Contact Me' },

      about_title: { es: 'Sobre mí', en: 'About Me' },
      about_text:  { es: 'Soy desarrollador de software apasionado por construir soluciones digitales que marcan la diferencia. Disfruto convertir ideas en aplicaciones funcionales y bien elaboradas — desde experiencias móviles hasta plataformas web completas. Para mí, cada proyecto es una oportunidad para aprender algo nuevo y llevar mis habilidades más allá.', en: "I'm a software developer passionate about building digital solutions that make a difference. I enjoy turning ideas into functional, well-crafted applications — from mobile experiences to full-featured web platforms. For me, every project is a chance to learn something new and push my skills further." },

      skills_title:    { es: 'Skills', en: 'Skills' },
      skills_subtitle: { es: 'Tecnologías y herramientas con las que trabajo', en: 'Technologies and tools I work with' },
      skill_sql:       { es: 'SQL / Bases de Datos', en: 'SQL / Databases' },

      projects_title:    { es: 'Proyectos', en: 'Projects' },
      projects_subtitle: { es: 'Algunos trabajos que he realizado', en: "Some projects I've built" },
      project_inventory_desc:  { es: 'Primera app móvil funcional. Catálogo digital de muebles para taller familiar con autenticación, carga de fotos, filtros y PDF. Desarrollada con Ionic + Angular y Firebase.', en: 'First functional mobile app. Digital furniture catalog for a family workshop with authentication, photo upload, filters and PDF export. Built with Ionic + Angular and Firebase.' },
      project_ferremas_desc:   { es: 'E-commerce universitario con integración real de Webpay Plus (Transbank). Panel administrativo con roles, dashboard, y gestión completa de productos, pedidos y usuarios. Django + Bootstrap + Tailwind.', en: 'University e-commerce project with real Webpay Plus (Transbank) integration. Admin panel with roles, dashboard, and full management of products, orders, and users. Django + Bootstrap + Tailwind.' },
      project_stepmeter_desc:  { es: 'App móvil contador de pasos con GPS en tiempo real, mapas interactivos y almacenamiento en Firebase. Desarrollada con Ionic + Angular para Android y iOS con pedómetro nativo.', en: 'Step counter mobile app with real-time GPS tracking, interactive maps and Firebase storage. Built with Ionic + Angular for Android and iOS with native pedometer.' },
      project_btn_code: { es: 'Código', en: 'Code' },

      experience_title:    { es: 'Experiencia', en: 'Experience' },
      experience_subtitle: { es: 'Mi trayectoria profesional', en: 'My professional journey' },
      exp_date_1:  { es: '2023 — Presente', en: '2023 — Present' },
      exp_role_1:  { es: 'Desarrollador de Software', en: 'Software Developer' },
      exp_company_1: { es: 'Empresa Actual', en: 'Current Company' },
      exp_desc_1:  { es: 'Desarrollo de aplicaciones web escalables. Liderazgo técnico en proyectos frontend y backend. Implementación de arquitecturas modernas y optimización de rendimiento.', en: 'Building scalable web applications. Technical leadership in frontend and backend projects. Implementing modern architectures and performance optimization.' },
      exp_date_2:  { es: '2021 — 2023', en: '2021 — 2023' },
      exp_role_2:  { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
      exp_company_2: { es: 'Empresa Anterior', en: 'Previous Company' },
      exp_desc_2:  { es: 'Construcción de interfaces de usuario con React y TypeScript. Colaboración en equipo ágil, revisiones de código y diseño de componentes reutilizables.', en: 'Building user interfaces with React and TypeScript. Collaboration in agile teams, code reviews, and reusable component design.' },
      exp_date_3:  { es: '2019 — 2021', en: '2019 — 2021' },
      exp_role_3:  { es: 'Desarrollador Junior', en: 'Junior Developer' },
      exp_company_3: { es: 'Primera Experiencia', en: 'First Experience' },
      exp_desc_3:  { es: 'Desarrollo y mantenimiento de aplicaciones web. Soporte en backend con Node.js y bases de datos relacionales.', en: 'Web application development and maintenance. Backend support with Node.js and relational databases.' },

      education_title: { es: 'Educación', en: 'Education' },
      education_degree_1: { es: 'Ingeniería en informática', en: 'Computer Engineering' },
      education_institution_1: { es: 'Duoc UC, Viña del Mar', en: 'Duoc UC, Viña del Mar' },
      education_degree_2: { es: 'Curso / Certificación', en: 'Course / Certification' },
      education_institution_2: { es: 'Plataforma Online', en: 'Online Platform' },

      contact_title:    { es: 'Contacto', en: 'Contact' },
      contact_subtitle: { es: 'Conectemos', en: "Let's connect" },

      footer_text: { es: '© 2026 Matías Baxman. Todos los derechos reservados.', en: '© 2026 Matías Baxman. All rights reserved.' },
    },

    apply(lang) {
      this.current = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (this.strings[key]) el.textContent = this.strings[key][lang];
      });
      document.querySelectorAll('[data-i18n-label]').forEach(el => {
        const key = el.dataset.i18nLabel;
        if (this.strings[key]) el.dataset.label = this.strings[key][lang];
      });
      document.documentElement.lang = lang;
      localStorage.setItem('lang', lang);
    },

    toggle() {
      this.apply(this.current === 'en' ? 'es' : 'en');
    },

    init() {
      this.current = localStorage.getItem('lang') || 'en';
      this.apply(this.current);
    },
  };

  i18n.init();

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

  /* ---- Active dock link via IntersectionObserver ---- */
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
    rootMargin: '-40% 0px -40% 0px',
  });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Smooth scroll for dock items ---- */
  dockItems.forEach(item => {
    item.addEventListener('click', e => {
      const targetId = item.getAttribute('href');
      if (!targetId) return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Language toggle ---- */
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => i18n.toggle());
  }

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
