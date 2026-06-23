"use client";
import { useEffect, useRef, useCallback } from "react";
import styles from "./FrameAnimation.module.css";

const FRAME_COUNT = 216;
const FPS = 32;
const REVEAL_THRESHOLD = 30; // fire onLoaded after first N frames so the site reveals quickly

interface FrameAnimationProps {
  onProgress: (p: number) => void;
  onLoaded: () => void;
  bgColor: string;
}

export default function FrameAnimation({ onProgress, onLoaded, bgColor }: FrameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const firedRef = useRef(false);
  const bgColorRef = useRef(bgColor);
  bgColorRef.current = bgColor;

  const drawFrame = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 720;
    const ih = img.naturalHeight || 1280;
    const ir = iw / ih;  // ~0.5625 — portrait
    const cr = cw / ch;  // viewport ratio

    if (cr >= ir) {
      // Landscape / wide viewport (desktop): cover center-crop
      // Fill canvas width; crop a vertical slice from the center of the portrait image
      const sh = iw / cr;
      const sy = (ih - sh) / 2;
      ctx.drawImage(img, 0, sy, iw, sh, 0, 0, cw, ch);
    } else {
      // Portrait viewport (mobile): contain — full frame, letterbox left/right
      const dw = ch * ir;
      const dx = (cw - dw) / 2;
      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, dx, 0, dw, ch);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    syncSize();
    window.addEventListener("resize", syncSize);

    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    framesRef.current = frames;
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(4, "0");
      img.onload = () => {
        loadedCount++;
        // Progress tracks the reveal threshold so the bar fills 0→100% quickly
        if (loadedCount <= REVEAL_THRESHOLD) {
          onProgress(Math.round((loadedCount / REVEAL_THRESHOLD) * 100));
        }
        if (loadedCount === REVEAL_THRESHOLD && !firedRef.current) {
          firedRef.current = true;
          onLoaded(); // reveal the site; rest of frames load in the background
        }
        // Safety fallback: fire when all frames load if threshold never triggered
        if (loadedCount === FRAME_COUNT && !firedRef.current) {
          firedRef.current = true;
          onLoaded();
        }
      };
      img.src = `/images/frames/frame_${frameNum}.webp`;
      frames[i] = img;
    }

    const animate = (now: number) => {
      const interval = 1000 / FPS;
      if (now - lastTimeRef.current >= interval) {
        const frame = frames[currentFrameRef.current];
        if (frame?.complete) {
          drawFrame(canvas, frame);
        }
        // Advance only when next frame is ready; otherwise hold current frame
        const next = (currentFrameRef.current + 1) % FRAME_COUNT;
        if (frames[next]?.complete) {
          currentFrameRef.current = next;
        }
        lastTimeRef.current = now;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", syncSize);
    };
  }, [drawFrame, onProgress, onLoaded]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
