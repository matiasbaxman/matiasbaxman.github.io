'use strict';

(function () {
  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 22);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.id = 'space-canvas';
  document.body.prepend(renderer.domElement);

  const Y = {
    hero: 0, about: 6, skills: 12, projects: 18, experience: 24, education: 30, contact: 36,
  };
  const Y_RANGE = [-2, 40];

  /* ---- Background starfield ---- */
  function createStarfield() {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 120;
      pos[i3 + 1] = (Math.random() - 0.5) * 60;
      pos[i3 + 2] = (Math.random() - 0.5) * 80 - 10;
      const c = 0.5 + Math.random() * 0.5;
      col[i3] = c; col[i3 + 1] = c; col[i3 + 2] = c;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const stars = new THREE.Points(geo, mat);
    stars.frustumCulled = false;
    scene.add(stars);
    return stars;
  }

  /* ---- Nebula (Hero) ---- */
  function createNebula() {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [[0.51, 0.55, 0.97], [0.55, 0.36, 0.96], [0.82, 0.42, 0.74], [0.42, 0.45, 0.85]];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 3.5;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi);
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 2;
      const p = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = p[0]; col[i3 + 1] = p[1]; col[i3 + 2] = p[2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const p = new THREE.Points(geo, mat);
    p.position.y = Y.hero;
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }

  /* ---- Comet (About) ---- */
  function createComet() {
    const g = new THREE.Group();
    g.position.y = Y.about;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({ color: 0xA5B4FC, transparent: true, opacity: 0.9 }));
    g.add(head);
    const tCount = 40;
    const pos = new Float32Array(tCount * 3);
    for (let i = 0; i < tCount; i++) {
      pos[i * 3] = -i / tCount * 3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const tMat = new THREE.PointsMaterial({ size: 0.12, color: 0xA5B4FC, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    g.add(new THREE.Points(tGeo, tMat));
    g.frustumCulled = false;
    scene.add(g);
    return g;
  }

  /* ---- Orbit System (Skills) ---- */
  function createOrbitSystem() {
    const g = new THREE.Group();
    g.position.y = Y.skills;
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), new THREE.MeshBasicMaterial({ color: 0xF59E0B })));
    const radius = 2.5;
    const orbiters = [];
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.65 + i * 0.05, 0.8, 0.6), transparent: true, opacity: 0.9 }));
      m.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      m.userData = { angle: a, speed: 0.3 + Math.random() * 0.2 };
      g.add(m);
      orbiters.push(m);
    }
    g.userData = { orbiters, radius };
    g.frustumCulled = false;
    scene.add(g);
    return g;
  }

  /* ---- Saturn (Projects) ---- */
  function createSaturn() {
    const g = new THREE.Group();
    g.position.y = Y.projects;
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.8, 24, 24), new THREE.MeshBasicMaterial({ color: 0x818CF8 })));
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.08, 16, 60), new THREE.MeshBasicMaterial({ color: 0xA5B4FC, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
    r1.rotation.x = Math.PI / 3;
    g.add(r1);
    const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 16, 60), new THREE.MeshBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
    r2.rotation.x = Math.PI / 2.5;
    g.add(r2);
    g.frustumCulled = false;
    scene.add(g);
    return g;
  }

  /* ---- Constellation (Experience) ---- */
  function createConstellation() {
    const g = new THREE.Group();
    g.position.y = Y.experience;
    const pts = [[-1.5, 0.5, 0], [0, 1.2, 0.3], [1.5, 0.8, -0.2], [-1, -0.5, 0.1], [1.2, -0.3, -0.1], [0, -1, 0.2]];
    const pos = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => { pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2]; });
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.2, color: 0x818CF8, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    g.add(new THREE.Points(pGeo, pMat));
    const conn = [[0, 1], [1, 2], [2, 4], [4, 3], [3, 0], [1, 5], [5, 3], [2, 5]];
    const lp = [];
    conn.forEach(([a, b]) => { lp.push(pts[a][0], pts[a][1], pts[a][2], pts[b][0], pts[b][1], pts[b][2]); });
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    const lMat = new THREE.LineBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.2 });
    g.add(new THREE.LineSegments(lGeo, lMat));
    g.frustumCulled = false;
    scene.add(g);
    return g;
  }

  /* ---- Cluster (Education) ---- */
  function createCluster() {
    const count = 100;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.5) * 1.5;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.12, color: 0xA5B4FC, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const p = new THREE.Points(geo, mat);
    p.position.y = Y.education;
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }

  /* ---- Galaxy (Contact) ---- */
  function createGalaxy() {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = Math.pow(Math.random(), 0.8);
      const angle = t * Math.PI * 6;
      const radius = t * 3.5;
      const spread = (1 - t) * 0.5 + 0.05;
      pos[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * (1 - t * 0.7) * 0.8;
      pos[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
      col[i3] = 0.3 + t * 0.4;
      col[i3 + 1] = 0.2 + t * 0.4;
      col[i3 + 2] = 0.5 + t * 0.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const p = new THREE.Points(geo, mat);
    p.position.y = Y.contact;
    p.frustumCulled = false;
    scene.add(p);
    return p;
  }

  /* ---- Build scene ---- */
  const starfield = createStarfield();
  const nebula = createNebula();
  const comet = createComet();
  const orbitSystem = createOrbitSystem();
  const saturn = createSaturn();
  const constellation = createConstellation();
  const cluster = createCluster();
  const galaxy = createGalaxy();

  const objects = [
    { obj: nebula, y: Y.hero },
    { obj: comet, y: Y.about },
    { obj: orbitSystem, y: Y.skills },
    { obj: saturn, y: Y.projects },
    { obj: constellation, y: Y.experience },
    { obj: cluster, y: Y.education },
    { obj: galaxy, y: Y.contact },
  ];

  /* ---- Animation ---- */
  let targetY = 0;
  let currentY = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 1.2;
  });

  function animate() {
    const progress = scrollY / (document.documentElement.scrollHeight - innerHeight);
    targetY = Y_RANGE[0] + (Y_RANGE[1] - Y_RANGE[0]) * Math.min(1, Math.max(0, progress));
    currentY += (targetY - currentY) * 0.05;

    camera.position.y = currentY;
    camera.position.x += (mx * 0.8 - camera.position.x) * 0.02;
    camera.position.z = 22 + my * 0.5;
    camera.lookAt(0, currentY, 0);

    objects.forEach(({ obj, y }) => {
      const dist = Math.abs(currentY - y);
      if (dist < 8) {
        const prox = 1 - dist / 8;
        const s = 0.1 + 0.9 * prox;
        obj.scale.setScalar(s);
        obj.traverse(c => {
          if (c.material) {
            c.material.transparent = true;
            c.material.opacity = prox * 0.85;
            if (c.material.needsUpdate) c.material.needsUpdate = true;
          }
        });
      } else {
        obj.scale.setScalar(0.01);
        obj.traverse(c => {
          if (c.material) c.material.opacity = 0;
        });
      }
      obj.rotation.y += 0.002;
    });

    if (orbitSystem.userData.orbiters) {
      const orbs = orbitSystem.userData.orbiters;
      const rad = orbitSystem.userData.radius;
      orbs.forEach(orb => {
        orb.userData.angle += orb.userData.speed * 0.01;
        orb.position.x = Math.cos(orb.userData.angle) * rad;
        orb.position.z = Math.sin(orb.userData.angle) * rad;
      });
    }

    comet.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
    comet.position.x = Math.sin(Date.now() * 0.0005) * 0.5;

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
