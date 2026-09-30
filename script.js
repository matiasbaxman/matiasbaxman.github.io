const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('nav a');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => {
        const isSection = link.pathname === window.location.pathname && link.hash === '#' + entry.target.id;
        link.classList.toggle('active', isSection);
      });
    });
  }, { rootMargin: '-15% 0px -45% 0px' });
  sections.forEach(section => observer.observe(section));
}

const services = { landing: 'Landing page', web: 'Sitio web', app: 'Web app / móvil' };
const serviceKey = new URLSearchParams(window.location.search).get('servicio');
const service = Object.hasOwn(services, serviceKey) ? services[serviceKey] : null;
const context = document.getElementById('service-context');
const email = document.getElementById('contact-email');
if (service && context && email) {
  context.textContent = 'Conversemos sobre: ' + service;
  context.hidden = false;
  const subject = 'Cotización: ' + service;
  const body = 'Hola Matías, me interesa conversar sobre un proyecto de ' + service.toLowerCase() + '.\n\nMi idea / problema a resolver:\n\nFuncionalidades que necesito:\n\nFecha objetivo:\n\nPresupuesto aproximado (si lo tengo definido):\n';
  email.href = 'mailto:matiasbaxman@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}
