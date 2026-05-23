'use strict';

(function () {
  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0A0A0F, 0.006);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 22);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.id = 'space-canvas';
  document.body.prepend(renderer.domElement);

  const Y = {
    hero: 0, about: 6, skills: 12, projects: 18, experience: 24, education: 30, contact: 36,
  };
  const Y_RANGE = [-2, 44];

  const sections = [];

  /* ============================================================
     Starfield — full journey, deep background
     ============================================================ */
  function createStarfield() {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 200;
      pos[i3 + 1] = -10 + Math.random() * 60;
      pos[i3 + 2] = (Math.random() - 0.5) * 120 - 40;
      const c = 0.4 + Math.random() * 0.6;
      col[i3] = c; col[i3 + 1] = c; col[i3 + 2] = c;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.18, vertexColors: true, transparent: true, opacity: 0.45,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }

  /* ============================================================
     Ambient dust — particles across entire journey Z=-15..5
     ============================================================ */
  function createAmbientDust() {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = -5 + Math.random() * 52;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x8890A8, size: 0.06, transparent: true, opacity: 0.2,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }

  /* ============================================================
     Hero — Large nebula surrounding you, spread in XZ
     ============================================================ */
  function createHeroScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.hero, 0);

    const count = 1000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.35, 0.4, 0.7], [0.5, 0.45, 0.85],
      [0.4, 0.3, 0.65], [0.3, 0.35, 0.6],
      [0.45, 0.5, 0.8], [0.5, 0.35, 0.7],
    ];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.4) * 5;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi) * 0.6;
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 3;
      const p = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = p[0]; col[i3 + 1] = p[1]; col[i3 + 2] = p[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.3, vertexColors: true, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    g.add(new THREE.Points(geo, mat));

    const sCount = 50;
    const sPos = new Float32Array(sCount * 3);
    for (let i = 0; i < sCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * 4;
      sPos[i * 3] = Math.cos(a) * r;
      sPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      sPos[i * 3 + 2] = Math.sin(a) * r - 3;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      size: 0.08, color: 0xA5B4FC, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    g.add(new THREE.Points(sGeo, sMat));

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.hero, radius: 14 });
    return g;
  }

  /* ============================================================
     About — 3 comets at different depths & lateral positions
     ============================================================ */
  function createCometScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.about, 0);

    const configs = [
      { dx: 0, dz: -2, color: 0x818CF8, phase: 0 },
      { dx: -4, dz: -9, color: 0x93A0F0, phase: 2.1 },
      { dx: 5, dz: 3.5, color: 0xA5B4FC, phase: 4.2 },
    ];

    configs.forEach(cfg => {
      const cg = new THREE.Group();
      cg.position.set(cfg.dx, 0, cfg.dz);
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 12),
        new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.5 })
      );
      cg.add(head);
      const tCount = 30;
      const tPos = new Float32Array(tCount * 3);
      for (let i = 0; i < tCount; i++) {
        tPos[i * 3] = -i / tCount * 2.5;
        tPos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
        tPos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
      }
      const tGeo = new THREE.BufferGeometry();
      tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
      const tMat = new THREE.PointsMaterial({
        size: 0.1, color: cfg.color, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
      });
      cg.add(new THREE.Points(tGeo, tMat));
      cg.userData = { phase: cfg.phase };
      g.add(cg);
    });

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.about, radius: 12 });
    return g;
  }

  /* ============================================================
     Skills — 3 orbital rings at different tilts + depths
     ============================================================ */
  function createOrbitScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.skills, 0);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.5 })
    );
    sun.position.set(0, 0, -2);
    g.add(sun);

    const ringDefs = [
      { count: 8, radius: 3, tiltX: 0.4, tiltZ: 0, zOff: -2, speed: 0.08, hueOff: 0 },
      { count: 6, radius: 1.8, tiltX: 0, tiltZ: 0.5, zOff: -0.5, speed: 0.12, hueOff: 0.3 },
      { count: 5, radius: 4.5, tiltX: 0.6, tiltZ: 0.2, zOff: -8, speed: 0.05, hueOff: 0.6 },
    ];

    ringDefs.forEach(def => {
      for (let i = 0; i < def.count; i++) {
        const a = (i / def.count) * Math.PI * 2;
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 10, 10),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.65 + def.hueOff + i * 0.03, 0.35, 0.45),
            transparent: true, opacity: 0.4,
          })
        );
        const x = Math.cos(a) * def.radius;
        const z = Math.sin(a) * def.radius;
        m.position.set(x, 0, z + def.zOff);
        m.userData = {
          angle: a, speed: def.speed, radius: def.radius, tiltX: def.tiltX, tiltZ: def.tiltZ, zOff: def.zOff,
        };
        g.add(m);
      }
    });

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.skills, radius: 12 });
    return g;
  }

  /* ============================================================
     Projects — Saturn + rings + moons + asteroid belt
     ============================================================ */
  function createSaturnScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.projects, 0);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.45 })
    );
    const r1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.08, 16, 60),
      new THREE.MeshBasicMaterial({ color: 0xA5B4FC, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
    );
    r1.position.set(0, 0, -3);
    r1.rotation.x = Math.PI / 3;
    g.add(r1);

    const r2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.05, 16, 60),
      new THREE.MeshBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    r2.position.set(0, 0, -3);
    r2.rotation.x = Math.PI / 2.4;
    g.add(r2);

    const moonCount = 4;
    for (let i = 0; i < moonCount; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xA0A8C0, transparent: true, opacity: 0.4 })
      );
      const r = 2.8 + i * 0.4;
      m.position.set(r, (i - 1.5) * 0.2, -3);
      m.userData = { angle: (i / moonCount) * Math.PI * 2, speed: 0.1 + i * 0.02, radius: r };
      g.add(m);
    }

    const aCount = 60;
    const aPos = new Float32Array(aCount * 3);
    for (let i = 0; i < aCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 1.2;
      aPos[i * 3] = Math.cos(a) * r;
      aPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      aPos[i * 3 + 2] = Math.sin(a) * r - 3;
    }
    const aGeo = new THREE.BufferGeometry();
    aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
    const aMat = new THREE.PointsMaterial({
      size: 0.05, color: 0x8890A0, transparent: true, opacity: 0.2,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    g.add(new THREE.Points(aGeo, aMat));

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.projects, radius: 12 });
    return g;
  }

  /* ============================================================
     Experience — 3 constellations in different directions
     ============================================================ */
  function createConstellationScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.experience, 0);

    const constDefs = [
      {
        offset: [0, 0, -2],
        pts: [[-1.5, 0.5, 0], [0, 1.2, 0.3], [1.5, 0.8, -0.2], [-1, -0.5, 0.1], [1.2, -0.3, -0.1], [0, -1, 0.2]],
        conn: [[0, 1], [1, 2], [2, 4], [4, 3], [3, 0], [1, 5], [5, 3], [2, 5]],
      },
      {
        offset: [-5, 0.8, -10],
        pts: [[-0.8, 0.4, 0], [0.5, 0.9, 0.1], [0.8, -0.3, -0.1], [-0.3, -0.7, 0.1]],
        conn: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
      },
      {
        offset: [5, -0.5, 3.5],
        pts: [[-1, 0.6, 0], [0.2, 1, 0.2], [1.2, 0.4, -0.1], [0.5, -0.5, 0.1], [-0.6, -0.8, -0.1]],
        conn: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]],
      },
    ];

    constDefs.forEach(def => {
      const cg = new THREE.Group();
      cg.position.set(def.offset[0], def.offset[1], def.offset[2]);

      const pPos = new Float32Array(def.pts.length * 3);
      def.pts.forEach((p, i) => { pPos[i * 3] = p[0]; pPos[i * 3 + 1] = p[1]; pPos[i * 3 + 2] = p[2]; });
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.18, color: 0x818CF8, transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
      });
      cg.add(new THREE.Points(pGeo, pMat));

      const lp = [];
      def.conn.forEach(([a, b]) => {
        lp.push(def.pts[a][0], def.pts[a][1], def.pts[a][2], def.pts[b][0], def.pts[b][1], def.pts[b][2]);
      });
      const lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
      const lMat = new THREE.LineBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.1 });
      cg.add(new THREE.LineSegments(lGeo, lMat));

      g.add(cg);
    });

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.experience, radius: 12 });
    return g;
  }

  /* ============================================================
     Education — 3 star clusters at different depths
     ============================================================ */
  function createClusterScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.education, 0);

    const clusterDefs = [
      { count: 80, dx: 0, dy: 0, dz: -4, spread: 1.5, color: 0x8890B0 },
      { count: 60, dx: -6, dy: 0.4, dz: -9, spread: 1.2, color: 0x9098B8 },
      { count: 60, dx: 5.5, dy: -0.3, dz: 4, spread: 1.3, color: 0x8890B0 },
    ];

    clusterDefs.forEach(def => {
      const pos = new Float32Array(def.count * 3);
      for (let i = 0; i < def.count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 1.5) * def.spread;
        pos[i * 3] = Math.cos(a) * r + def.dx;
        pos[i * 3 + 1] = (Math.random() - 0.5) * def.spread + def.dy;
        pos[i * 3 + 2] = (Math.random() - 0.5) * def.spread + def.dz;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.1, color: def.color, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
      });
      g.add(new THREE.Points(geo, mat));
    });

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.education, radius: 12 });
    return g;
  }

  /* ============================================================
     Contact — Large spiral galaxy
     ============================================================ */
  function createGalaxyScene() {
    const g = new THREE.Group();
    g.position.set(0, Y.contact, 0);

    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = Math.pow(Math.random(), 0.7);
      const angle = t * Math.PI * 8;
      const radius = t * 5;
      const spread = (1 - t) * 0.6 + 0.05;
      pos[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * (1 - t * 0.7) * 1.2;
      pos[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread - 5;
      col[i3] = 0.2 + t * 0.4;
      col[i3 + 1] = 0.2 + t * 0.35;
      col[i3 + 2] = 0.4 + t * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.07, vertexColors: true, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    g.add(new THREE.Points(geo, mat));

    g.frustumCulled = false;
    scene.add(g);
    sections.push({ obj: g, y: Y.contact, radius: 14 });
    return g;
  }

  /* ---- Build scene ---- */
  const starfield = createStarfield();
  const dust = createAmbientDust();
  const heroScene = createHeroScene();
  const cometScene = createCometScene();
  const orbitScene = createOrbitScene();
  const saturnScene = createSaturnScene();
  const constellationScene = createConstellationScene();
  const clusterScene = createClusterScene();
  const galaxyScene = createGalaxyScene();

  /* ---- Store orbiters for animation ---- */
  let orbiters = [];
  orbitScene.children.forEach(c => {
    if (c.userData && c.userData.angle !== undefined) orbiters.push(c);
  });

  let moonOrbiters = [];
  saturnScene.children.forEach(c => {
    if (c.userData && c.userData.angle !== undefined) moonOrbiters.push(c);
  });

  /* ---- Animation ---- */
  let targetY = 0;
  let currentY = 0;
  let driftX = 0, driftY = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 1.2;
  });

  function animate() {
    const progress = scrollY / (document.documentElement.scrollHeight - innerHeight);
    targetY = Y_RANGE[0] + (Y_RANGE[1] - Y_RANGE[0]) * Math.min(1, Math.max(0, progress));
    currentY += (targetY - currentY) * 0.025;

    const t = Date.now() * 0.0003;
    driftX = Math.sin(t * 0.5) * 0.3;
    driftY = Math.sin(t * 0.3) * 0.15;

    camera.position.y = currentY;
    camera.position.x += (mx * 0.6 + driftX - camera.position.x) * 0.015;
    camera.position.z = 22 + my * 0.3 + driftY;
    camera.lookAt(0, currentY + 2, 0);

    /* ---- Proximity-based section visibility ---- */
    sections.forEach(({ obj, y, radius }) => {
      const dist = Math.abs(currentY - y);
      if (dist < radius) {
        const prox = 1 - dist / radius;
        const s = 0.05 + 0.95 * prox;
        obj.scale.setScalar(s);
        obj.traverse(c => {
          if (c.material) {
            c.material.transparent = true;
            c.material.opacity = (c.material.userData?.baseOpacity ?? prox) * prox * 0.55;
          }
        });
      } else {
        obj.scale.setScalar(0.01);
        obj.traverse(c => {
          if (c.material) c.material.opacity = 0;
        });
      }
      obj.rotation.y += 0.001;
    });

    /* ---- Animate orbiters ---- */
    orbiters.forEach(orb => {
      const d = orb.userData;
      d.angle += d.speed * 0.008;
      const x = Math.cos(d.angle) * d.radius;
      const z = Math.sin(d.angle) * d.radius;
      orb.position.x = x;
      orb.position.z = z + d.zOff;
      if (d.tiltX || d.tiltZ) {
        const xy = Math.sin(d.angle) * d.radius * Math.sin(d.tiltX || 0);
        orb.position.y = xy;
      }
    });

    /* ---- Animate moons ---- */
    moonOrbiters.forEach(moon => {
      const d = moon.userData;
      d.angle += d.speed * 0.008;
      moon.position.x = Math.cos(d.angle) * d.radius;
      moon.position.z = Math.sin(d.angle) * d.radius - 3;
    });

    /* ---- Animate comets ---- */
    const cometChildren = cometScene.children;
    cometChildren.forEach((cg, i) => {
      const phase = cg.userData?.phase || 0;
      cg.rotation.z = Math.sin(Date.now() * 0.0008 + phase) * 0.08;
      cg.position.x = Math.sin(Date.now() * 0.0004 + phase) * 0.4;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
