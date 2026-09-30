(() => {
  'use strict';
  const app = document.getElementById('app');
  const dialog = document.getElementById('detail');
  const money = n => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  const stores = [
    { name: 'Casa Norte', tag: 'Hogar & decoración', items: ['Lámpara de escritorio', 'Set de organizadores', 'Repisa de madera', 'Macetero de cerámica'], prices: [24990, 15990, 32990, 12990], stocks: [18, 42, 5, 27], color: '#c0f86b' },
    { name: 'Taller Sur', tag: 'Herramientas & taller', items: ['Taladro inalámbrico', 'Juego de brocas', 'Caja de herramientas', 'Lijadora orbital'], prices: [79990, 12990, 24990, 45990], stocks: [9, 65, 23, 4], color: '#a6b8f0' },
    { name: 'Estudio Uno', tag: 'Diseño & papelería', items: ['Cuaderno de bocetos', 'Set de marcadores', 'Agenda semanal', 'Estuche de lona'], prices: [11990, 22990, 14990, 8990], stocks: [36, 6, 51, 20], color: '#edb58d' }
  ];
  const shipmentStates = ['Entregado', 'En camino', 'Por preparar', 'En camino', 'Entregado', 'Por preparar'];
  const orders = stores.map((store, s) => Array.from({ length: 6 }, (_, i) => ({
    id: 'EP-' + (1000 + s * 100 + i), product: store.items[i % 4], amount: store.prices[i % 4] * (i % 2 + 1),
    quantity: i % 2 + 1, customer: ['Cliente demo A', 'Cliente demo B', 'Cliente demo C'][i % 3],
    destination: ['Santiago', 'Concepción', 'La Serena'][i % 3], day: i + 1,
    payment: i === 5 ? 'Pendiente' : 'Pagado', shipping: i === 5 ? 'Por preparar' : shipmentStates[(i + s) % 6]
  })));
  let state = { screen: 'login', store: 0, view: 'summary', filter: 'Todos', query: '', synced: false };
  let syncTimer;
  const icons = {
    summary: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    sales: '<path d="m4 17 6-6 4 3 6-9m-6 0h6v6"/>',
    shipping: '<path d="M3 5h11v12H3zM14 9h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    products: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8M12 13v9m-5-17 10 5"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[name] + '</svg>';
  const button = (text, action, cls = '') => '<button type="button" class="' + cls + '" data-action="' + action + '">' + text + '</button>';
  const badge = value => '<span class="badge ' + (['Pagado', 'Entregado'].includes(value) ? 'success' : value === 'Pendiente' || value === 'Por preparar' ? 'pending' : '') + '">' + value + '</span>';
  function auth() {
    const otp = state.screen === 'otp';
    app.innerHTML = '<section class="auth"><div class="auth-intro"><span class="logo">e<span>.</span></span><span class="overline">E-PRÁCTICAS</span><h1>Tu operación,<br>en un solo lugar.</h1><p>Explora una simulación de acceso seguro y gestión de tiendas.</p><div class="auth-tags"><span>3 tiendas demo</span><span>Recorrido libre</span></div></div><div class="auth-card"><div class="auth-icon">' + icon('lock') + '</div><p class="overline">PASO ' + (otp ? '02 / 02' : '01 / 02') + '</p><h2>' + (otp ? 'Verificación en dos pasos' : 'Bienvenido de vuelta') + '</h2><p>' + (otp ? 'Usa el código de ejemplo para completar el acceso.' : 'La cuenta de prueba ya está preparada.') + '</p><form id="auth-form" autocomplete="off">' + (otp
      ? '<label for="otp">Código de verificación</label><input id="otp" name="demo-code" class="otp" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required aria-describedby="otp-hint auth-error"><p id="otp-hint" class="hint">Código demo: <strong>246810</strong></p>' + button('Usar código demo', 'fill-code', 'text-button')
      : '<label for="demo-account">Usuario de demostración</label><input id="demo-account" value="visitante@demo.example" readonly><label for="demo-password">Contraseña de demostración</label><input id="demo-password" type="password" value="solo-demo" readonly><p class="hint">No necesitas introducir datos personales.</p>') +
      '<p id="auth-error" class="error" role="alert"></p><button class="primary" type="submit">' + (otp ? 'Verificar y entrar' : 'Continuar') + '<span>→</span></button></form>' +
      (otp ? button('← Volver al acceso', 'back-login', 'text-button') : button('Explorar directamente el panel ↗', 'skip', 'text-button')) + '</div></section>';
  }
  function dashboard(focusHeading = false) {
    const store = stores[state.store];
    const titles = { summary: 'Resumen de la tienda', sales: 'Ventas', shipping: 'Envíos', products: 'Productos' };
    app.innerHTML = '<div class="workspace"><aside class="sidebar"><div class="side-brand">e<span>.</span><small>OPERACIONES</small></div><nav aria-label="Secciones de la demo">' +
      Object.entries({ summary: 'Resumen', sales: 'Ventas', shipping: 'Envíos', products: 'Productos' }).map(([key, name]) =>
        '<button data-view="' + key + '" type="button" ' + (key === state.view ? 'aria-current="page"' : '') + '>' + icon(key) + '<span>' + name + '</span></button>').join('') +
      '</nav><div class="session"><span class="avatar">V</span><div>Visitante<small>Cuenta de prueba</small></div></div>' + button('Cerrar sesión', 'logout', 'logout') +
      '</aside><section class="main-panel"><header class="panel-header"><div><label for="store">TIENDA ACTIVA</label><select id="store">' + stores.map((s, i) => '<option value="' + i + '" ' + (i === state.store ? 'selected' : '') + '>' + s.name + '</option>').join('') + '</select></div><span class="connected"><i></i> Mercado Libre · Demo</span></header><div class="page-title"><div><p class="overline">' + store.tag + '</p><h1 id="view-title" tabindex="-1">' + titles[state.view] + '</h1></div>' + button('↻ Sincronizar', 'sync', 'secondary') + '</div><p id="sync-status" class="sync-status" role="status">' + (state.synced ? 'Datos demo sincronizados.' : 'Datos de ejemplo · Últimos 7 días') + '</p><div id="view">' + viewContent() + '</div><p class="panel-note">Simulación de portafolio. Ventas, envíos y métricas son ilustrativos.</p></section></div>';
    app.style.setProperty('--accent', store.color);
    if (focusHeading) document.getElementById('view-title').focus({ preventScroll: true });
  }
  function viewContent() {
    const rows = orders[state.store], paid = rows.filter(o => o.payment === 'Pagado');
    if (state.view === 'summary') {
      const days = Array.from({ length: 7 }, (_, i) => paid.filter(o => o.day === i).reduce((sum, o) => sum + o.amount, 0));
      const max = Math.max(...days, 1);
      return '<div class="metrics"><article><span>Ventas pagadas</span><strong>' + money(paid.reduce((sum, o) => sum + o.amount, 0)) + '</strong><small>' + paid.length + ' pedidos confirmados</small></article><article><span>Pedidos</span><strong>' + rows.length + '</strong><small>' + rows.filter(o => o.payment === 'Pendiente').length + ' pago pendiente</small></article><article><span>En camino</span><strong>' + rows.filter(o => o.shipping === 'En camino').length + '</strong><small>Seguimiento disponible</small></article></div><div class="summary-grid"><article class="card"><div class="card-title"><h2>Ventas de la semana</h2><span>CLP</span></div><div class="chart" role="img" aria-label="Ventas pagadas de la semana: ' + days.map((n, i) => ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i] + ': ' + money(n)).join(', ') + '">' + days.map((n, i) => '<div><span class="chart-value">' + (n ? money(n) : '—') + '</span><div class="bar-track"><i style="height:' + (n / max * 100) + '%"></i></div><small>' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'][i] + '</small></div>').join('') + '</div></article><article class="card activity"><h2>Operación de hoy</h2><div><i class="dot"></i><p>Catálogo conectado<small>' + stores[state.store].items.length + ' productos de ejemplo</small></p></div><div><i class="dot yellow"></i><p>Preparar pedidos<small>' + rows.filter(o => o.shipping === 'Por preparar').length + ' envíos pendientes</small></p></div>' + button('Ver ventas →', 'go-sales', 'text-button') + '</article></div><article class="card"><div class="card-title"><h2>Últimos pedidos</h2><span>Selecciona un pedido</span></div>' + salesTable(rows.slice(0, 3)) + '</article>';
    }
    if (state.view === 'products') return '<article class="card"><div class="card-title"><h2>Catálogo de productos</h2><span>Stock de ejemplo</span></div><label class="search-label" for="search">Buscar producto</label><input type="search" id="search" placeholder="Nombre o SKU"><div id="product-results">' + productsContent() + '</div></article>';
    const choices = state.view === 'sales' ? ['Todos', 'Pagado', 'Pendiente'] : ['Todos', 'Por preparar', 'En camino', 'Entregado'];
    const filtered = rows.filter(o => state.filter === 'Todos' || (state.view === 'sales' ? o.payment : o.shipping) === state.filter);
    return '<article class="card"><div class="filters" aria-label="Filtrar por estado">' + choices.map(f => '<button type="button" data-filter="' + f + '" aria-pressed="' + (state.filter === f) + '">' + f + '</button>').join('') + '</div>' + (state.view === 'sales' ? salesTable(filtered) : shippingTable(filtered)) + '</article>';
  }
  function salesTable(rows) {
    return '<div class="table-scroll"><table><caption class="sr-only">Pedidos de la tienda seleccionada</caption><thead><tr><th>Pedido / producto</th><th>Total</th><th>Pago</th><th>Detalle</th></tr></thead><tbody>' + rows.map(o => '<tr><td><b>' + o.id + '</b><small>' + o.product + '</small></td><td>' + money(o.amount) + '</td><td>' + badge(o.payment) + '</td><td><button type="button" class="row-button" data-order="' + o.id + '" aria-label="Ver pedido ' + o.id + '">Ver ↗</button></td></tr>').join('') + '</tbody></table>' + (!rows.length ? '<p class="empty">No hay pedidos con este estado.</p>' : '') + '</div>';
  }
  function shippingTable(rows) {
    return '<div class="shipping-list">' + rows.map(o => '<button type="button" class="shipment" data-order="' + o.id + '"><span class="shipment-icon">' + icon('shipping') + '</span><span><b>' + o.id + '</b><small>' + o.destination + ' · ' + o.customer + '</small></span>' + badge(o.shipping) + '<span aria-hidden="true">→</span></button>').join('') + (!rows.length ? '<p class="empty">No hay envíos con este estado.</p>' : '') + '</div>';
  }
  function productsContent() {
    const s = stores[state.store];
    const items = s.items.map((name, i) => ({ name, i, sku: 'SKU-' + (state.store + 1) + '0' + i })).filter(p => (p.name + p.sku).toLocaleLowerCase('es').includes(state.query.toLocaleLowerCase('es')));
    return '<div class="product-list">' + items.map(p => '<div class="product"><span class="product-icon">' + icon('products') + '</span><div><b>' + p.name + '</b><small>' + p.sku + '</small></div><strong>' + money(s.prices[p.i]) + '</strong><span class="badge ' + (s.stocks[p.i] < 10 ? 'pending' : '') + '">' + s.stocks[p.i] + ' en stock</span></div>').join('') + (!items.length ? '<p class="empty">No se encontraron productos.</p>' : '') + '</div>';
  }
  function showOrder(id) {
    const o = orders[state.store].find(row => row.id === id);
    if (!o) return;
    const step = ['Por preparar', 'En camino', 'Entregado'].indexOf(o.shipping);
    dialog.innerHTML = '<div class="dialog-top"><p class="overline">PEDIDO DEMO</p>' + button('×', 'close-detail', 'close') + '</div><h2 id="detail-title">' + o.id + '</h2><p class="detail-product">' + o.product + '</p><dl><div><dt>Tienda</dt><dd>' + stores[state.store].name + '</dd></div><div><dt>Cliente</dt><dd>' + o.customer + '</dd></div><div><dt>Unidades</dt><dd>' + o.quantity + '</dd></div><div><dt>Total</dt><dd>' + money(o.amount) + '</dd></div></dl><div class="detail-payment">' + badge(o.payment) + '<span>Destino: ' + o.destination + '</span></div><h3>Seguimiento del envío</h3><ol class="timeline">' + ['Por preparar', 'En camino', 'Entregado'].map((s, i) => '<li class="' + (i <= step ? 'done' : '') + '"><span>' + (i <= step ? '✓' : '○') + '</span>' + s + (i === step ? '<small>Estado actual</small>' : '') + '</li>').join('') + '</ol><p class="hint">Este pedido es ficticio; no representa una venta real.</p>';
    dialog.querySelector('.close').setAttribute('aria-label', 'Cerrar detalle');
    dialog.showModal();
  }
  app.addEventListener('submit', event => {
    if (event.target.id !== 'auth-form') return;
    event.preventDefault();
    if (state.screen === 'login') { state.screen = 'otp'; auth(); document.getElementById('otp').focus(); }
    else if (document.getElementById('otp').value === '246810') { state.screen = 'dashboard'; dashboard(true); }
    else { document.getElementById('auth-error').textContent = 'El código de esta demo es 246810. Inténtalo nuevamente.'; document.getElementById('otp').setAttribute('aria-invalid', 'true'); }
  });
  app.addEventListener('change', event => {
    if (event.target.id === 'store') {
      clearTimeout(syncTimer); state.store = Number(event.target.value); state.filter = 'Todos'; state.query = ''; state.synced = false;
      dashboard(); document.getElementById('store').focus({ preventScroll: true });
    }
  });
  app.addEventListener('input', event => {
    if (event.target.id === 'search') { state.query = event.target.value; document.getElementById('product-results').innerHTML = productsContent(); }
  });
  app.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.view) { state.view = target.dataset.view; state.filter = 'Todos'; state.query = ''; dashboard(true); }
    if (target.dataset.filter) { state.filter = target.dataset.filter; dashboard(); app.querySelector('[data-filter="' + state.filter + '"]').focus({ preventScroll: true }); }
    if (target.dataset.order) showOrder(target.dataset.order);
    switch (target.dataset.action) {
      case 'skip': state.screen = 'dashboard'; dashboard(true); break;
      case 'back-login': state.screen = 'login'; auth(); break;
      case 'fill-code': document.getElementById('otp').value = '246810'; document.getElementById('otp').removeAttribute('aria-invalid'); document.getElementById('auth-error').textContent = ''; document.getElementById('otp').focus(); break;
      case 'logout': clearTimeout(syncTimer); state = { screen: 'login', store: 0, view: 'summary', filter: 'Todos', query: '', synced: false }; app.style.removeProperty('--accent'); auth(); app.querySelector('button[type="submit"]').focus(); break;
      case 'go-sales': state.view = 'sales'; state.filter = 'Todos'; dashboard(true); break;
      case 'sync':
        target.disabled = true; target.textContent = 'Sincronizando…';
        document.getElementById('sync-status').textContent = 'Simulando sincronización del catálogo…';
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
          if (state.screen !== 'dashboard') return;
          state.synced = true;
          const syncButton = app.querySelector('[data-action="sync"]');
          syncButton.disabled = false; syncButton.textContent = '↻ Sincronizar';
          document.getElementById('sync-status').textContent = 'Simulación completada. El catálogo demo está actualizado.';
        }, 800);
        break;
    }
  });
  dialog.addEventListener('click', event => { if (event.target.closest('[data-action="close-detail"]') || event.target === dialog) dialog.close(); });
  auth();
})();
