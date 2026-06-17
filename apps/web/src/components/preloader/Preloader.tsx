"use client";
import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

type Phase = "loading" | "complete" | "revealing" | "revealed";

const BRAND = "GRIPTIX";
const LETTER_DELAY_MS = 95; // time between each typed letter

interface PreloaderProps {
  progress: number;
  phase: Phase;
}

export default function Preloader({ progress, phase }: PreloaderProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const isExiting = phase === "revealing";
  const isTyping = visibleCount < BRAND.length;

  // Typewriter — chain of timeouts, one letter per LETTER_DELAY_MS
  useEffect(() => {
    if (!isTyping) return;
    const id = setTimeout(() => setVisibleCount((n) => n + 1), LETTER_DELAY_MS);
    return () => clearTimeout(id);
  }, [visibleCount, isTyping]);

  return (
    <div className={`${styles.overlay} ${isExiting ? styles.overlayExit : ""}`}>
      <div className={styles.content}>

        {/* Brand wordmark with typewriter effect */}
        <div className={styles.wordmarkRow}>
          <span className={styles.wordmark}>
            {BRAND.slice(0, visibleCount)}
          </span>
          {isTyping && <span className={styles.cursor} aria-hidden />}
        </div>

        {/* Percentage + progress line */}
        <div className={`${styles.indicators} ${isExiting ? styles.indicatorsExit : ""}`}>
          <span className={styles.percentage}>{Math.round(progress)} %</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
        </div>

      </div>
    </div>
  );
}
