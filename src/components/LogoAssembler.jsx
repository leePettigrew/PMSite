import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Build a text mask and generate "wall chunks":
 * - grid of chunk centers (clean breakpoints)
 * - keep only centers inside text
 * - approximate distance-to-edge to keep outlines crisp/readable
 */
function buildWallChunks({
  text,
  font,
  canvasW = 2600,
  canvasH = 1000,
  cell = 12,
  pad = 8,
  threshold = 18,
  maxChunks = 2600,
}) {
  const c = document.createElement("canvas");
  c.width = canvasW;
  c.height = canvasH;
  const ctx = c.getContext("2d", { willReadFrequently: true });

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(text, canvasW / 2, canvasH / 2);

  const img = ctx.getImageData(0, 0, canvasW, canvasH).data;

  const isOn = (x, y) => {
    if (x < 0 || y < 0 || x >= canvasW || y >= canvasH) return false;
    const i = (y * canvasW + x) * 4;
    return img[i] > threshold;
  };

  const edgeDist = (x, y) => {
    const rays = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ];
    let best = 9999;
    for (const [dx, dy] of rays) {
      let d = 0;
      while (d < 120) {
        const xx = x + dx * d;
        const yy = y + dy * d;
        if (!isOn(xx, yy)) break;
        d += 2;
      }
      if (d < best) best = d;
    }
    return best;
  };

  const pts = [];
  for (let y = pad; y < canvasH - pad; y += cell) {
    for (let x = pad; x < canvasW - pad; x += cell) {
      if (!isOn(x, y)) continue;
      const nx = (x / canvasW - 0.5) * 2;
      const ny = (0.5 - y / canvasH) * 2;
      const ed = edgeDist(x, y);
      pts.push({ nx, ny, ed });
    }
  }

  // Keep a mix: interior + edge to preserve readability
  pts.sort((a, b) => b.ed - a.ed);
  const keep = [];
  const takeDeep = Math.floor(maxChunks * 0.72);
  const takeEdge = maxChunks - takeDeep;

  for (let i = 0; i < Math.min(takeDeep, pts.length); i++) keep.push(pts[i]);

  const edges = [...pts].sort((a, b) => a.ed - b.ed);
  for (let i = 0; i < Math.min(takeEdge, edges.length); i++) keep.push(edges[i]);

  return keep;
}

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function ShardWall({
  text,
  font,
  maxChunks,
  materialType,
  offsetX,
  offsetY,
  scaleX,
  scaleY,
  cursorForce = 6.0,
  cursorRadiusFactor = 0.22,
  cell = 12,
  // intro timing
  introDuration = 2.2, // swirl length
  settleDuration = 0.8, // extra settle after swirl
}) {
  const instRef = useRef();
  const { viewport, size: screen } = useThree();
  const cursor = useRef({ x: 0, y: 0 });

  // start time (per component)
  const startTimeRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      cursor.current.x = (e.clientX / screen.width) * 2 - 1;
      cursor.current.y = -((e.clientY / screen.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [screen.width, screen.height]);

  const chunks = useMemo(() => {
    return buildWallChunks({
      text,
      font,
      cell,
      maxChunks,
      threshold: 18,
    });
  }, [text, font, maxChunks, cell]);

  const count = chunks.length;

  const targets = useMemo(() => {
    return chunks.map((p) => {
      const x = p.nx * viewport.width * scaleX + offsetX;
      const y = p.ny * viewport.height * scaleY + offsetY;
      return new THREE.Vector3(x, y, 0);
    });
  }, [chunks, viewport.width, viewport.height, scaleX, scaleY, offsetX, offsetY]);

  // Per-instance state
  const state = useMemo(() => {
    const pos = [];
    const vel = [];
    const rot = [];
    const rotVel = [];
    const sca = [];

    // Swirl params per chunk (stable + looks intentional)
    const swirlPhase = new Float32Array(count);
    const swirlSpeed = new Float32Array(count);
    const swirlRadius = new Float32Array(count);
    const swirlZ = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const t = targets[i];

      // Spawn offscreen in a “ring” around the whole logo area
      const ang = Math.random() * Math.PI * 2;
      const rad =
        Math.max(viewport.width, viewport.height) *
        (0.85 + Math.random() * 0.55); // offscreen
      const spawn = new THREE.Vector3(
        Math.cos(ang) * rad,
        Math.sin(ang) * rad,
        (Math.random() - 0.5) * 1.2
      );

      pos.push(spawn);

      // Initial inward velocity (so it doesn't sit there)
      const toward = new THREE.Vector3().subVectors(t, spawn).normalize();
      vel.push(toward.multiplyScalar(0.15 + Math.random() * 0.20));

      rot.push(
        new THREE.Euler(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        )
      );
      rotVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.9,
          (Math.random() - 0.5) * 0.9,
          (Math.random() - 0.5) * 0.9
        )
      );

      // Tiny chunks => readable text
      const ed = chunks[i].ed;
      const edgeFactor = THREE.MathUtils.clamp(ed / 28, 0.25, 1.0);
      const base = materialType === "stone" ? 0.036 : 0.030;

      const sx = base * (0.55 + 0.9 * edgeFactor);
      const sy = base * (0.45 + 0.8 * edgeFactor);
      const sz = base * (0.40 + 0.7 * edgeFactor);
      sca.push(new THREE.Vector3(sx * 1.2, sy, sz * 0.7));

      // Swirl tuning (bigger for stone, tighter for steel)
      swirlPhase[i] = Math.random() * Math.PI * 2;
      swirlSpeed[i] = (0.9 + Math.random() * 0.9) * (materialType === "stone" ? 1.0 : 1.15);
      swirlRadius[i] = (0.18 + Math.random() * 0.28) * (materialType === "stone" ? 1.0 : 0.9);
      swirlZ[i] = (Math.random() - 0.5) * 0.18;
    }

    return { pos, vel, rot, rotVel, sca, swirlPhase, swirlSpeed, swirlRadius, swirlZ };
  }, [count, targets, viewport.width, viewport.height, chunks, materialType]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bounds = useMemo(() => {
    return {
      x: viewport.width * 0.62,
      y: viewport.height * 0.42,
      z: 0.95,
    };
  }, [viewport.width, viewport.height]);

  const geom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const mat = useMemo(() => {
    if (materialType === "stone") {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color("#9aa0a6"),
        roughness: 0.98,
        metalness: 0.04,
      });
    }
    // brighter, readable steel
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#eef3f8"),
      roughness: 0.18,
      metalness: 0.45,
      envMapIntensity: 1.2,
    });
  }, [materialType]);

  useFrame((renderState, dt) => {
    const m = instRef.current;
    if (!m) return;

    if (startTimeRef.current === null) startTimeRef.current = renderState.clock.elapsedTime;
    const tNow = renderState.clock.elapsedTime;
    const t0 = startTimeRef.current;
    const tElapsed = tNow - t0;

    // 0..1 swirl progress, then 0..1 settle progress
    const swirlProg = THREE.MathUtils.clamp(tElapsed / introDuration, 0, 1);
    const settleProg = THREE.MathUtils.clamp((tElapsed - introDuration) / settleDuration, 0, 1);

    // ease curves
    const swirlEase = smoothstep(0, 1, swirlProg); // ramps in
    const settleEase = smoothstep(0, 1, settleProg); // ramps out

    // During swirl: we "drive" chunks around their targets.
    // After swirl: we fully switch to spring assemble + cursor crumble.
    const inSwirl = swirlProg < 1;

    // Assemble physics
    const spring = inSwirl ? 9.0 : 18.0;
    const damping = inSwirl ? 4.8 : 9.5;

    const cx = cursor.current.x * viewport.width * 0.5;
    const cy = cursor.current.y * viewport.height * 0.5;
    const cursorRadius = Math.min(viewport.width, viewport.height) * cursorRadiusFactor;

    for (let i = 0; i < count; i++) {
      const p = state.pos[i];
      const v = state.vel[i];
      const target = targets[i];

      if (inSwirl) {
        // Swirl path around target: large radius at start -> tight spiral -> target
        const phase = state.swirlPhase[i];
        const speed = state.swirlSpeed[i];
        const baseR = state.swirlRadius[i];

        // start wide, end tight
        const R = THREE.MathUtils.lerp(
          Math.max(viewport.width, viewport.height) * 0.55,
          baseR * Math.min(viewport.width, viewport.height),
          swirlEase
        );

        const ang = phase + tElapsed * speed * 2.2;

        // swirl center is the final target (so letters remain readable early)
        const swirlTarget = new THREE.Vector3(
          target.x + Math.cos(ang) * R,
          target.y + Math.sin(ang) * R * 0.72,
          target.z + state.swirlZ[i]
        );

        // Drive towards swirlTarget (not exploding)
        v.x += (swirlTarget.x - p.x) * spring * dt;
        v.y += (swirlTarget.y - p.y) * spring * dt;
        v.z += (swirlTarget.z - p.z) * spring * dt;

        // Gentle rotational chaos early, then damp
        const rv = state.rotVel[i];
        const rotDamp = THREE.MathUtils.lerp(0.6, 3.2, swirlEase);
        rv.multiplyScalar(1 - rotDamp * dt);
        state.rot[i].x += rv.x * dt;
        state.rot[i].y += rv.y * dt;
        state.rot[i].z += rv.z * dt;
      } else {
        // Normal assemble
        v.x += (target.x - p.x) * spring * dt;
        v.y += (target.y - p.y) * spring * dt;
        v.z += (target.z - p.z) * spring * dt;

        // Cursor crumble (protected near edges for crisp letters)
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.0001;
        const k = Math.max(0, 1 - d / cursorRadius);

        const ed = chunks[i].ed;
        const edgeProtection = THREE.MathUtils.clamp(ed / 26, 0.20, 1.0);

        const push = cursorForce * (k * k) * edgeProtection;

        v.x += (dx / d) * push * dt;
        v.y += (dy / d) * push * dt;
        v.z += push * 0.10 * dt;

        // Rotation settles heavily post-intro
        const rv = state.rotVel[i];
        rv.multiplyScalar(1 - 3.2 * dt);
        state.rot[i].x += rv.x * dt;
        state.rot[i].y += rv.y * dt;
        state.rot[i].z += rv.z * dt;
      }

      // Damping + integrate
      v.multiplyScalar(1 - damping * dt);
      p.addScaledVector(v, 1);

      // Extra post-swirl settle “snap” (tightens readability)
      if (!inSwirl && settleProg < 1) {
        // blend to target a bit while settling
        const s = 0.14 * (1 - settleEase);
        p.lerp(target, s);
      }

      // Clamp so it never goes offscreen
      p.x = THREE.MathUtils.clamp(p.x, -bounds.x, bounds.x);
      p.y = THREE.MathUtils.clamp(p.y, -bounds.y, bounds.y);
      p.z = THREE.MathUtils.clamp(p.z, -bounds.z, bounds.z);

      dummy.position.copy(p);
      dummy.rotation.copy(state.rot[i]);
      dummy.scale.copy(state.sca[i]);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }

    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={instRef} args={[geom, mat, count]} />;
}

export default function LogoAssembler() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 2.45], fov: 55 }}
        dpr={[1.2, 2.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.18} />
        <directionalLight position={[2.5, 2.0, 2]} intensity={1.25} />
        <directionalLight position={[-2.0, -1.0, 2]} intensity={0.70} />
        <pointLight position={[0, 0.6, 1.6]} intensity={0.35} />

        {/* PM (STONE) */}
        <ShardWall
          text="PM"
          font="900 260px system-ui, -apple-system, Segoe UI, Inter, Arial"
          maxChunks={2000}
          cell={12}
          materialType="stone"
          offsetX={-0.60}
          offsetY={0.03}
          scaleX={0.40}
          scaleY={0.22}
          cursorForce={isTouch ? 0 : 6.0}
          cursorRadiusFactor={0.22}
          introDuration={2.4}
          settleDuration={0.9}
        />

        {/* SOLUTIONS (STEEL) */}
        <ShardWall
          text="SOLUTIONS"
          font="800 170px system-ui, -apple-system, Segoe UI, Inter, Arial"
          maxChunks={2600}
          cell={12}
          materialType="steel"
          offsetX={0.50}
          offsetY={-0.05}
          scaleX={0.46}
          scaleY={0.18}
          cursorForce={isTouch ? 0 : 5.0}
          cursorRadiusFactor={0.22}
          introDuration={2.4}
          settleDuration={0.9}
        />
      </Canvas>

      {/* cinematic overlays */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(120,119,198,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,8,12,0.0),rgba(7,8,12,1))]" />
      </div>
    </div>
  );
}
