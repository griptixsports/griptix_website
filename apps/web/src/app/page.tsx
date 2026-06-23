"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Preloader from "@/components/preloader/Preloader";
import FrameAnimation from "@/components/scene/FrameAnimation";
import { useTheme } from "@/hooks/useTheme";
import styles from "./page.module.css";

type Phase = "loading" | "complete" | "revealing" | "revealed";


function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const advancedRef = useRef(false);
  const { theme, toggle } = useTheme();

  const handleLoaded = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setPhase("complete");
    setTimeout(() => setPhase("revealing"), 400);
    setTimeout(() => setPhase("revealed"), 1500);
  }, []);

  // Fallback: auto-reveal after 4 s if frames are slow to load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!advancedRef.current) handleLoaded();
    }, 4000);
    return () => clearTimeout(timer);
  }, [handleLoaded]);

  const isUIVisible = phase === "revealed";
  const bgColor = theme === "dark" ? "#1A1613" : "#FAF6F0";

  return (
    <div className={styles.page}>

      {/* ── Frame animation background (always mounted — preloading starts immediately) ── */}
      <FrameAnimation
        onProgress={setProgress}
        onLoaded={handleLoaded}
        bgColor={bgColor}
      />

      {/* ── Black overlay above frames ── */}
      <div className={styles.frameOverlay} />

      {/* ── Preloader (sits above canvas) ── */}
      {phase !== "revealed" && (
        <Preloader progress={progress} phase={phase} />
      )}

      {/* ── Main UI (fades in after reveal) ── */}
      <div className={`${styles.ui} ${isUIVisible ? styles.uiVisible : ""}`}>

        {/* Navigation */}
        <header className={styles.header}>
          <span className={styles.brand}>GRIPTIX</span>
          <nav className={styles.nav}>
            <a href="#" className={styles.navLink}>Products</a>
            <a href="#" className={styles.navLink}>About</a>
            <a href="#" className={styles.navLink}>Contact</a>
          </nav>
          <div className={styles.headerActions}>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              Explore Grips
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Order Now
            </button>
            <button
              onClick={toggle}
              className={styles.btnTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className={styles.main}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>Olympic-Grade Custom Grips</p>
            <h1 className={styles.headline}>
              Precision in Every Pull
            </h1>
            <p className={styles.subheadline}>
              3D-scanned to the exact contours of your hand.
              Engineered for competition. Built to last.
            </p>
          </section>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>35+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>200+</span>
              <span className={styles.statLabel}>Athletes</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>12</span>
              <span className={styles.statLabel}>Countries</span>
            </div>
          </div>
        </main>

      </div>

    </div>
  );
}
