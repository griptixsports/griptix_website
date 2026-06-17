"use client";
import { Component, ReactNode, Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import styles from "./GriptixScene.module.css";

const GLB_PATH = "/3d/grip.glb";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(t, 1), 3);
}

interface GripCfg {
  id: number;
  target: [number, number, number];
  rotSpeed: [number, number, number];
  initRot: [number, number, number];
  scale: number;
  maxOpacity: number;
  burstDelay: number;
}

function buildConfigs(): GripCfg[] {
  // Camera sits at z=12 looking toward origin. fov=50 → half-angle=25°.
  const TAN25 = Math.tan(25 * (Math.PI / 180)); // ≈ 0.4663
  const ASPECT = 16 / 9;
  // Y-scale = halfH/halfW = 1/aspect — makes every angle land uniformly on the screen edge at r=halfW
  const Y_SCALE = 1 / ASPECT; // ≈ 0.5625

  return Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const z = -(i % 4) * 2;             // z in {0, -2, -4, -6}
    const depth = Math.abs(z) / 6;
    const camDist = 12 - z;             // perspective distance: 12, 14, 16, 18
    const halfW = camDist * TAN25 * ASPECT; // world-space screen half-width at this depth

    // Spread: innermost at 85% of screen edge, outermost at 115% (partially cut off)
    const r = halfW * (0.85 + (i % 4) * 0.1);

    return {
      id: i,
      target: [
        Math.cos(angle) * r + (i % 2 ? 0.5 : -0.5),
        Math.sin(angle) * r * Y_SCALE + (i % 3 ? 0.35 : -0.35),
        z,
      ],
      rotSpeed: [
        (i % 2 ? 0.006 : -0.006) + i * 0.001,
        (i % 2 ? -0.005 : 0.005) + i * 0.0008,
        (i % 3 ? 0.003 : -0.003),
      ],
      initRot: [i * 0.63, i * 0.97, i * 1.31],
      scale: (0.82 - depth * 0.3) * 0.25,
      maxOpacity: 1 - depth * 0.65,
      burstDelay: i * 0.06,
    };
  });
}

// Individual grip — bursts to final position then keeps spinning forever
function GripInstance({
  cfg,
  burst,
  scene,
}: {
  cfg: GripCfg;
  burst: boolean;
  scene: THREE.Group;
}) {
  const ref = useRef<THREE.Group>(null!);
  const burstT = useRef(0);
  const delayAcc = useRef(-cfg.burstDelay);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = (obj.material as THREE.Material).clone();
        (obj.material as THREE.MeshStandardMaterial).transparent = true;
        (obj.material as THREE.MeshStandardMaterial).opacity = 0;
        obj.material.needsUpdate = true;
      }
    });
    return c;
  }, [scene]);

  useFrame((_state, delta) => {
    if (!burst) return;
    delayAcc.current += delta;
    if (delayAcc.current < 0) return;

    burstT.current = Math.min(burstT.current + delta * 0.5, 1); // 2-second burst
    const ease = easeOutCubic(burstT.current);

    // Move toward final resting position
    ref.current.position.set(
      cfg.target[0] * ease,
      cfg.target[1] * ease,
      cfg.target[2] * ease
    );

    // Spin continuously — never stops
    ref.current.rotation.x += cfg.rotSpeed[0];
    ref.current.rotation.y += cfg.rotSpeed[1];
    ref.current.rotation.z += cfg.rotSpeed[2];

    // Fade in
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.opacity = Math.min(mat.opacity + delta * 2.5, cfg.maxOpacity);
      }
    });
  });

  return (
    <group
      ref={ref}
      scale={cfg.scale}
      rotation={cfg.initRot as [number, number, number]}
    >
      <primitive object={cloned} />
    </group>
  );
}

function ProgressBridge({
  onProgress,
  onLoaded,
}: {
  onProgress: (p: number) => void;
  onLoaded: () => void;
}) {
  const { progress } = useProgress();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    onProgress(progress);
    if (progress === 100 && !firedRef.current) {
      timerRef.current = setTimeout(() => {
        if (!firedRef.current) {
          firedRef.current = true;
          onLoaded();
        }
      }, 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [progress, onProgress, onLoaded]);

  return null;
}

class SceneBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

function Scene({ burst }: { burst: boolean }) {
  const { scene } = useGLTF(GLB_PATH);
  const [configs] = [useMemo(buildConfigs, [])];

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 5]} intensity={1.6} />
      <pointLight position={[-4, 3, -5]} color="#C29B74" intensity={1.4} />
      {configs.map((cfg) => (
        <GripInstance
          key={cfg.id}
          cfg={cfg}
          burst={burst}
          scene={scene as THREE.Group}
        />
      ))}
    </>
  );
}

interface GriptixSceneProps {
  burst: boolean;
  onProgress: (p: number) => void;
  onLoaded: () => void;
  bgColor: string;
}

export default function GriptixScene({
  burst,
  onProgress,
  onLoaded,
  bgColor,
}: GriptixSceneProps) {
  return (
    <div className={styles.wrapper}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* scene.background — picked up by EffectComposer's RenderPass clear */}
        <color attach="background" args={[bgColor]} />
        <ProgressBridge onProgress={onProgress} onLoaded={onLoaded} />
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene burst={burst} />
          </Suspense>
        </SceneBoundary>
      </Canvas>
    </div>
  );
}

useGLTF.preload(GLB_PATH);
