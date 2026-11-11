/* ==========================================================
   THE DIGITAL SIGNATURE — elemento 3D della hero
   La firma "Alessandro Radulescu", ricalcata dall'originale e
   estrusa in 3D. All'apertura si scrive da sinistra a destra
   con una linea di scansione; poi segue il puntatore e una luce
   la attraversa. Caricato solo quando serve (import dinamico).
   La forma è in signature.json: per cambiarla vedi il README.
   ========================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Shape, Path, Vector2, Vector3, ExtrudeGeometry,
  MeshPhysicalMaterial, MeshBasicMaterial, Mesh, Group, BufferGeometry, Float32BufferAttribute,
  PointsMaterial, Points, PlaneGeometry, AmbientLight, DirectionalLight, PointLight, Plane, Box3,
  PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace, Color,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import SHAPES from "./signature.json";

/* palette del sito: inchiostro, blu oltremare, ardesia */
const INK_0 = 0x17181c;
const BLUE_0 = 0x2c46c4;
const SLATE_0 = 0x9aa3b5;
/* winter edition: la firma diventa un nastro rosso ceralacca, con echi abete e oro */
const XM = { ink: 0xa81f1a, blue: 0x1f5a41, slate: 0xe3b877 };
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function buildShapes() {
  return SHAPES.map(s => {
    const shape = new Shape(s.o.map(([x, y]) => new Vector2(x, y)));
    s.h.forEach(h => shape.holes.push(new Path(h.map(([x, y]) => new Vector2(x, y)))));
    return shape;
  });
}

export function mountSignature(host, { reduced = false, natale = false } = {}) {
  const INK = natale ? XM.ink : INK_0;
  const BLUE = natale ? XM.blue : BLUE_0;
  const SLATE = natale ? XM.slate : SLATE_0;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.localClippingEnabled = true;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  /* taglio che "scrive" la firma: mostra solo ciò che sta a sinistra di clip.constant */
  const clip = new Plane(new Vector3(-1, 0, 0), 10);

  /* firma estrusa */
  const shapes = buildShapes();
  const geo = new ExtrudeGeometry(shapes, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.008, bevelSegments: 2, curveSegments: 4 });
  geo.translate(0, 0, -0.035);
  const front = new MeshPhysicalMaterial({
    color: new Color(INK),
    roughness: 0.22,
    metalness: 0.55,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.1,
    clippingPlanes: [clip],
  });
  const side = new MeshPhysicalMaterial({ color: new Color(natale ? 0x6e1512 : 0x2a2c33), roughness: 0.4, metalness: 0.4, envMapIntensity: 0.5, clippingPlanes: [clip] });
  const sig = new Mesh(geo, [front, side]);

  /* eco della firma: un'ombra blu e una ardesia, per la profondità */
  const flat = new ExtrudeGeometry(shapes, { depth: 0.01, bevelEnabled: false, curveSegments: 4 });
  const pinkMat = new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.55, clippingPlanes: [clip] });
  const violetMat = new MeshBasicMaterial({ color: SLATE, transparent: true, opacity: 0.35, clippingPlanes: [clip] });
  const echoPink = new Mesh(flat, pinkMat);
  echoPink.position.set(0.05, -0.05, -0.32);
  const echoViolet = new Mesh(flat, violetMat);
  echoViolet.position.set(0.1, -0.1, -0.64);

  /* polvere luminosa attorno */
  const N = 260;
  const dust = new Float32Array(N * 3);
  const dustCol = new Float32Array(N * 3);
  const palette = [new Color(INK), new Color(BLUE), new Color(SLATE)];
  for (let i = 0; i < N; i++) {
    dust[i * 3] = (Math.random() - 0.5) * 7.6;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
    dust[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
    const c = palette[i % palette.length];
    dustCol.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute("position", new Float32BufferAttribute(dust, 3));
  dustGeo.setAttribute("color", new Float32BufferAttribute(dustCol, 3));
  const dustMat = new PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false });
  const dustPts = new Points(dustGeo, dustMat);

  const inner = new Group();
  inner.add(sig, echoPink, echoViolet, dustPts);
  inner.rotation.z = 0.09; // leggera salita verso destra, come una firma vera
  const group = new Group();
  group.add(inner);
  scene.add(group);

  /* linea di scansione che accompagna la scrittura */
  const scanGeo = new PlaneGeometry(0.035, 2.2);
  const scanMat = new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false });
  const scan = new Mesh(scanGeo, scanMat);
  const glowGeo = new PlaneGeometry(0.5, 2.2);
  const glowMat = new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false });
  const glow = new Mesh(glowGeo, glowMat);
  scan.add(glow);
  scene.add(scan);

  scene.add(new AmbientLight(0xffffff, 0.4));
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(2, 3, 6);
  scene.add(key);
  const rimV = new PointLight(BLUE, 30, 14, 1.4);
  rimV.position.set(-4, -1.5, 3);
  scene.add(rimV);
  const rimP = new PointLight(0xffffff, 20, 12, 1.4);
  rimP.position.set(4, -1.5, 2.5);
  scene.add(rimP);
  const sweep = new PointLight(0xffffff, 18, 5, 1.5);
  sweep.position.set(0, 0.2, 1.2);
  scene.add(sweep);

  /* dimensioni e limiti della firma sullo schermo */
  let left = -4, right = 4;
  function resize() {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, r.width);
    const h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const visW = visH * camera.aspect;
    group.scale.setScalar(Math.min(visW / 7.1, visH / 1.9));
    group.rotation.set(0, 0, 0);
    group.updateMatrixWorld(true);
    const box = new Box3().setFromObject(sig);
    left = box.min.x - 0.2;
    right = box.max.x + 0.2;
    scan.scale.y = group.scale.x;
  }

  /* stato */
  const WRITE = 2600;
  let writeStart = performance.now() + 300;
  let progress = reduced ? 1 : 0;
  const rot = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  function frame(now) {
    const t = now / 1000;
    if (progress < 1) {
      const k = Math.max(0, Math.min(1, (now - writeStart) / WRITE));
      progress = easeInOut(k);
      const x = left + (right - left) * progress;
      clip.constant = x;
      scan.position.set(x, 0, 0.3);
      const fade = k < 0.08 ? k / 0.08 : k > 0.9 ? (1 - k) / 0.1 : 1;
      scanMat.opacity = 0.9 * fade;
      glowMat.opacity = 0.1 * fade;
      sweep.position.x = x;
    } else {
      clip.constant = 100;
      scanMat.opacity = 0;
      glowMat.opacity = 0;
      sweep.position.x = Math.sin(t * 0.6) * (right - left) * 0.5;
    }
    rot.x += (target.x - rot.x) * 0.05;
    rot.y += (target.y - rot.y) * 0.05;
    group.rotation.x = rot.x + Math.sin(t * 0.5) * 0.04;
    group.rotation.y = rot.y + Math.sin(t * 0.33) * 0.14;
    dustPts.rotation.y = t * 0.03;
    renderer.render(scene, camera);
  }

  /* loop solo se visibile */
  let raf = 0;
  let visible = true;
  const loop = now => {
    frame(now);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (!raf && !reduced && visible && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? start() : stop();
  });
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  const onPointer = e => {
    target.y = (e.clientX / window.innerWidth - 0.5) * 0.6;
    target.x = (e.clientY / window.innerHeight - 0.5) * 0.5;
  };
  if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });

  const onResize = () => {
    resize();
    if (reduced || !raf) frame(performance.now());
  };
  window.addEventListener("resize", onResize);

  /* "ri-firma" */
  const redraw = () => {
    if (reduced) return;
    progress = 0;
    writeStart = performance.now();
  };
  window.addEventListener("signature:redraw", redraw);

  resize();
  if (reduced) frame(performance.now());
  else start();

  return () => {
    stop();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("signature:redraw", redraw);
    [geo, flat, dustGeo, scanGeo, glowGeo].forEach(g => g.dispose());
    [front, side, pinkMat, violetMat, dustMat, scanMat, glowMat].forEach(m => m.dispose());
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
