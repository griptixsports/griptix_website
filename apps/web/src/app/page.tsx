"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  isMetal: boolean;
}

interface MaterialOption {
  id: string;
  name: string;
  roughness: number;
  metalness: number;
}

const COLOR_OPTIONS: ColorOption[] = [
  { id: "matte-black", name: "Matte Black", hex: "#1a1a1a", isMetal: false },
  { id: "dark-brown", name: "Dark Brown", hex: "#4b3621", isMetal: false },
  { id: "gunmetal", name: "Gunmetal", hex: "#5c6266", isMetal: true },
  { id: "desert-sand", name: "Desert Sand", hex: "#c6a682", isMetal: false },
  { id: "olive-drab", name: "Olive Drab", hex: "#4b5320", isMetal: false },
];

const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "aluminum", name: "Aluminum", roughness: 0.2, metalness: 0.9 },
  { id: "carbon-fiber", name: "Carbon Fiber", roughness: 0.4, metalness: 0.1 },
  { id: "polymer", name: "Polymer", roughness: 0.6, metalness: 0.1 },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isNightMode, setIsNightMode] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Customizer Drawer state
  const [openDrawer, setOpenDrawer] = useState<"colors" | "materials" | "weights" | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[1]); // Default dark brown
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_OPTIONS[0]); // Default aluminum
  const [selectedWeight, setSelectedWeight] = useState("standard");
  const [isExitOpen, setIsExitOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Apply base color factor, roughness, and metalness to model-viewer materials
  const applyModelChanges = useCallback((color: ColorOption, materialOpt: MaterialOption) => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer || !(modelViewer as any).model) return;

    const model = (modelViewer as any).model;
    if (model.materials && model.materials.length > 0) {
      const material = model.materials[0];

      // Convert Hex to normalized RGB [0-1]
      const r = parseInt(color.hex.slice(1, 3), 16) / 255;
      const g = parseInt(color.hex.slice(3, 5), 16) / 255;
      const b = parseInt(color.hex.slice(5, 7), 16) / 255;

      material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);

      if (color.isMetal) {
        material.pbrMetallicRoughness.setMetallicFactor(0.9);
        material.pbrMetallicRoughness.setRoughnessFactor(0.25);
      } else {
        material.pbrMetallicRoughness.setMetallicFactor(materialOpt.metalness);
        material.pbrMetallicRoughness.setRoughnessFactor(materialOpt.roughness);
      }
    }
  }, []);

  // Handle Model Loading Progress & Initial Material setup
  useEffect(() => {
    if (!mounted) return;

    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const onProgress = (event: any) => {
      const progress = Math.round(event.detail.totalProgress * 100);
      setLoadProgress(progress);
      if (progress === 100) {
        setTimeout(() => {
          setLoading(false);
        }, 600);
      }
    };

    const onLoad = () => {
      applyModelChanges(selectedColor, selectedMaterial);
    };

    modelViewer.addEventListener("progress", onProgress);
    modelViewer.addEventListener("load", onLoad);

    // Fallback load timeout
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => {
      modelViewer.removeEventListener("progress", onProgress);
      modelViewer.removeEventListener("load", onLoad);
      clearTimeout(fallbackTimeout);
    };
  }, [mounted, applyModelChanges, selectedColor, selectedMaterial]);

  // Trigger model updates when selections change
  useEffect(() => {
    if (mounted) {
      applyModelChanges(selectedColor, selectedMaterial);
    }
  }, [selectedColor, selectedMaterial, mounted, applyModelChanges]);

  // Handle Scroll Animations (linking scroll offset to 3D model camera angles)
  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    const modelViewer = modelViewerRef.current;
    if (!container || !modelViewer) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      if (clientHeight === 0) return;

      const totalScroll = clientHeight * 2;
      const fraction = Math.min(Math.max(scrollTop / totalScroll, 0), 1);

      // Determine active section index
      const currentSection = Math.round(scrollTop / clientHeight);
      setActiveSection(currentSection);

      // Calculate camera orbit interpolation
      let theta = 0;
      let phi = 75;
      let radius = 55;
      let xOffset = 0;

      if (fraction <= 0.5) {
        // Section 1 -> Section 2 (t goes from 0 to 1)
        const t = fraction * 2;
        theta = t * 120; // 0 to 120 deg
        phi = 75 + t * 10; // 75 to 85 deg
        radius = 75 - t * 10; // 75% to 65% (zooms in slightly as we scroll to about)
        xOffset = 20 + t * 5; // Shift right (20% to 25%) to make room for text on the left
      } else {
        // Section 2 -> Section 3 (t goes from 0 to 1)
        const t = (fraction - 0.5) * 2;
        theta = 120 + t * 120; // 120 to 240 deg
        phi = 85 - t * 20; // 85 to 65 deg
        radius = 65 + t * 5; // 65% to 70% (zooms out slightly)
        xOffset = 25 - t * 5; // Maintain right shift (25% to 20%) to keep room for text on the left
      }

      // Update model-viewer parameters directly in DOM for smooth 60fps performance
      modelViewer.setAttribute("camera-orbit", `${theta}deg ${phi}deg ${radius}%`);
      modelViewer.style.transform = `translateX(${xOffset}%)`;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  // Dot Navigation Click Handler
  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clientHeight = container.clientHeight;
    container.scrollTo({
      top: index * clientHeight,
      behavior: "smooth",
    });
  };

  // Toggle Night Mode (swapping color themes)
  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
    const root = document.documentElement;
    if (isNightMode) {
      root.style.setProperty("--color-dark-bg", "#D4B895");
      root.style.setProperty("--color-sand", "#52322B");
      root.style.setProperty("--color-dark-surface", "rgba(255, 255, 255, 0.7)");
      root.style.setProperty("color", "#52322B");
    } else {
      root.style.setProperty("--color-dark-bg", "#16110f");
      root.style.setProperty("--color-sand", "#D4B895");
      root.style.setProperty("--color-dark-surface", "rgba(22, 17, 15, 0.7)");
      root.style.setProperty("color", "#D4B895");
    }
  };

  // Toggle Music
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlayingMusic) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        console.log("Audio play blocked by browser policy.");
      });
    }
    setIsPlayingMusic(!isPlayingMusic);
  };

  // Customizer actions
  const openCustomizerDrawer = (drawer: "colors" | "materials" | "weights") => {
    setOpenDrawer(openDrawer === drawer ? null : drawer);
  };

  return (
    <>
      {/* Loading Overlay */}
      <div className={`loader ${!loading ? "hide" : ""}`}>
        <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="a" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="9" y="3" width="32" height="42">
            <path d="M25 44a15 15 0 1 0 0-30 15 15 0 0 0 0 30Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m18 8 3-4h8l3 4-7 6-7-6Z" fill="#555" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
          </mask>
          <g mask="url(#a)">
            <path d="M0 0h48v48H0V0Z" fill="#52322B" />
          </g>
        </svg>
        <p>Loading Showcase... {loadProgress}%</p>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${loadProgress}%` }} />
        </div>
      </div>

      {/* Header bar */}
      <section className="header">
        <div className="header--container">
          <h1 className="header--brand">
            <Image
              src="/images/logo.jpeg"
              alt="Griptix Logo"
              width={32}
              height={32}
              className="rounded-full border border-sand/30"
              style={{ objectFit: "cover" }}
            />
            GRIPTIX
            <span>BY MOHIT MALIK</span>
          </h1>
          <ul className="header--menu">
            <li className="know--more">
              <a href="https://griptix.in" target="_blank" rel="noopener noreferrer">
                Know more
              </a>
            </li>
            <li className="music--control" onClick={toggleMusic}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ opacity: isPlayingMusic ? 1 : 0.5 }}
              >
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#D4B895" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M19.07 4.92999C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.45999C16.4774 9.39763 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53"
                  stroke="#D4B895"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
            <li className="night--mode" onClick={toggleNightMode}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20.9999 12.79C20.8426 14.4922 20.2038 16.1144 19.1581 17.4668C18.1125 18.8192 16.7034 19.8458 15.0956 20.4265C13.4878 21.0073 11.7479 21.1181 10.0794 20.7461C8.41092 20.3741 6.8829 19.5345 5.67413 18.3258C4.46536 17.117 3.62584 15.589 3.25381 13.9205C2.88178 12.252 2.99262 10.5121 3.57336 8.9043C4.15411 7.29651 5.18073 5.88737 6.53311 4.84175C7.8855 3.79614 9.5077 3.15731 11.2099 3C10.2133 4.34827 9.73375 6.00945 9.85843 7.68141C9.98312 9.35338 10.7038 10.9251 11.8893 12.1106C13.0748 13.2961 14.6465 14.0168 16.3185 14.1415C17.9905 14.2662 19.6516 13.7866 20.9999 12.79V12.79Z"
                  stroke="#D4B895"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          </ul>
        </div>
      </section>

      {/* Sidebar Dots Navigation */}
      <div className="side-bar">
        <nav className="navigation">
          <ul>
            <li className={activeSection === 0 ? "active" : ""} onClick={() => scrollToSection(0)} title="Hero" />
            <li className={activeSection === 1 ? "active" : ""} onClick={() => scrollToSection(1)} title="About" />
            <li className={activeSection === 2 ? "active" : ""} onClick={() => scrollToSection(2)} title="Measurements" />
          </ul>
        </nav>
      </div>

      {/* Scrollable layout container */}
      <div className="scroll-container" ref={containerRef}>
        {/* Section 1: Hero Section */}
        <section className="section cam-view-1">
          <div className="hero--content">
            <h1>GRIPTIX<br />COLLECTION</h1>
            <div className="hero--text">
              <p>Explore the latest editorial campaigns, runway looks, and high-fashion collections.</p>
              <button
                tabIndex={-1}
                className="button button-scroll"
                onClick={() => scrollToSection(1)}
              >
                Explore collection
                <svg width="46" height="46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 42.2a19.2 19.2 0 1 0 0-38.4 19.2 19.2 0 0 0 0 38.4Z" stroke="#52322B" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m15.3 23 7.7 7.7 7.7-7.7M23 15.3v15.4" stroke="#52322B" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="hero--scroller--container" onClick={() => scrollToSection(1)}>
            <div className="hero--scroller">
              <p className="hero--scroller--text">Start scrolling to explore</p>
              <svg className="bounce" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12L12 16L16 12" stroke="#D4B895" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V16" stroke="#D4B895" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* Section 2: About Section */}
        <section className="section cam-view-2">
          <div className="forever--container">
            <div className="forever--text-bg">About</div>
            <div className="forever--content">
              <div className="forever--title">
                <h2>get to know</h2>
                <h1>About<br />Me</h1>
              </div>
              <p>
                Designed for Olympic athletes and sport shooters, Griptix combines 3D anatomical scanning with precision additive manufacturing. Every grip is custom-scanned to fit the contours of your hand, ensuring perfect alignment, reduced recoil response, and unmatched consistency in competition.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Measurements Section */}
        <section className="section cam-view-3">
          <div className="emotions--container">
            <div className="emotions--text-bg">Measurements</div>
            <div className="emotions--content">
              <div className="emotions--text">
                <h2>discover the</h2>
                <h1>Details</h1>
                <p>{"Weight: 250g | Resistance: 50-150 lbs | Material: High-Grade Aluminum | Finish: Matte Brown"}</p>
              </div>
              <button
                tabIndex={-1}
                className="btn-customize"
                onClick={() => setIsExitOpen(true)}
              >
                Find your size(of grip)
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.1511C13.6569 15.1511 15 13.808 15 12.1511C15 10.4943 13.6569 9.15112 12 9.15112C10.3431 9.15112 9 10.4943 9 12.1511C9 13.808 10.3431 15.1511 12 15.1511Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19.4 15.1511C19.2669 15.4527 19.2272 15.7873 19.286 16.1117C19.3448 16.4361 19.4995 16.7354 19.73 16.9711L19.79 17.0311C19.976 17.2169 20.1235 17.4374 20.2241 17.6802C20.3248 17.923 20.3766 18.1833 20.3766 18.4461C20.3766 18.709 20.3248 18.9692 20.2241 19.212C20.1235 19.4548 19.976 19.6754 19.79 19.8611C19.6043 20.0471 19.3837 20.1946 19.1409 20.2952C18.8981 20.3959 18.6378 20.4477 18.375 20.4477C18.1122 20.4477 17.8519 20.3959 17.6091 20.2952C17.3663 20.1946 17.1457 20.0471 16.96 19.8611L16.9 19.8011C16.6643 19.5706 16.365 19.4159 16.0406 19.3571C15.7162 19.2983 15.3816 19.338 15.08 19.4711C14.7842 19.5979 14.532 19.8084 14.3543 20.0767C14.1766 20.3449 14.0813 20.6593 14.08 20.9811V21.1511C14.08 21.6816 13.8693 22.1903 13.4942 22.5653C13.1191 22.9404 12.6104 23.1511 12.08 23.1511C11.5496 23.1511 11.0409 22.9404 10.6658 22.5653C10.2907 22.1903 10.08 21.6816 10.08 21.1511V21.0611C10.0723 20.7301 9.96512 20.4091 9.77251 20.1398C9.5799 19.8705 9.31074 19.6654 9 19.5511C8.69838 19.418 8.36381 19.3783 8.03941 19.4371C7.71502 19.4959 7.41568 19.6506 7.18 19.8811L7.12 19.9411C6.93425 20.1271 6.71368 20.2746 6.47088 20.3752C6.22808 20.4759 5.96783 20.5277 5.705 20.5277C5.44217 20.5277 5.18192 20.4759 4.93912 20.3752C4.69632 20.2746 4.47575 20.1271 4.29 19.9411C4.10405 19.7554 3.95653 19.5348 3.85588 19.292C3.75523 19.0492 3.70343 18.789 3.70343 18.5261C3.70343 18.2633 3.75523 18.003 3.85588 17.7602C3.95653 17.5174 4.10405 17.2969 4.29 17.1111L4.35 17.0511C4.58054 16.8154 4.73519 16.5161 4.794 16.1917C4.85282 15.8673 4.81312 15.5327 4.68 15.2311C4.55324 14.9354 4.34276 14.6831 4.07447 14.5054C3.80618 14.3278 3.49179 14.2324 3.17 14.2311H3C2.46957 14.2311 1.96086 14.0204 1.58579 13.6453C1.21071 13.2703 1 12.7616 1 12.2311C1 11.7007 1.21071 11.192 1.58579 10.8169C1.96086 10.4418 2.46957 10.2311 3 10.2311H3.09C3.42099 10.2234 3.742 10.1162 4.0113 9.92363C4.28059 9.73103 4.48572 9.46186 4.6 9.15112C4.73312 8.84951 4.77282 8.51493 4.714 8.19053C4.65519 7.86614 4.50054 7.5668 4.27 7.33112L4.21 7.27112C4.02405 7.08538 3.87653 6.8648 3.77588 6.622C3.67523 6.37921 3.62343 6.11895 3.62343 5.85612C3.62343 5.59329 3.67523 5.33304 3.77588 5.09024C3.87653 4.84745 4.02405 4.62687 4.21 4.44112C4.39575 4.25517 4.61632 4.10765 4.85912 4.007C5.10192 3.90635 5.36217 3.85455 5.625 3.85455C5.88783 3.85455 6.14808 3.90635 6.39088 4.007C6.63368 4.10765 6.85425 4.25517 7.04 4.44112L7.1 4.50112C7.33568 4.73166 7.63502 4.88631 7.95941 4.94513C8.28381 5.00395 8.61838 4.96424 8.92 4.83112H9C9.29577 4.70436 9.54802 4.49388 9.72569 4.22559C9.90337 3.9573 9.99872 3.64291 10 3.32112V3.15112C10 2.62069 10.2107 2.11198 10.5858 1.73691C10.9609 1.36184 11.4696 1.15112 12 1.15112C12.5304 1.15112 13.0391 1.36184 13.4142 1.73691C13.7893 2.11198 14 2.62069 14 3.15112V3.24112C14.0013 3.56291 14.0966 3.8773 14.2743 4.14559C14.452 4.41388 14.7042 4.62436 15 4.75112C15.3016 4.88424 15.6362 4.92395 15.9606 4.86513C16.285 4.80631 16.5843 4.65166 16.82 4.42112L16.88 4.36112C17.0657 4.17517 17.2863 4.02765 17.5291 3.927C17.7719 3.82636 18.0322 3.77455 18.295 3.77455C18.5578 3.77455 18.8181 3.82636 19.0609 3.927C19.3037 4.02765 19.5243 4.17517 19.71 4.36112C19.896 4.54687 20.0435 4.76745 20.1441 5.01024C20.2448 5.25304 20.2966 5.51329 20.2966 5.77612C20.2966 6.03895 20.2448 6.29921 20.1441 6.542C20.0435 6.7848 19.896 7.00538 19.71 7.19112L19.65 7.25112C19.4195 7.4868 19.2648 7.78614 19.206 8.11053C19.1472 8.43493 19.1869 8.76951 19.32 9.07112V9.15112C19.4468 9.44689 19.6572 9.69914 19.9255 9.87682C20.1938 10.0545 20.5082 10.1498 20.83 10.1511H21C21.5304 10.1511 22.0391 10.3618 22.4142 10.7369C22.7893 11.112 23 11.6207 23 12.1511C23 12.6816 22.7893 13.1903 22.4142 13.5653C22.0391 13.9404 21.5304 14.1511 21 14.1511H20.91C20.5882 14.1524 20.2738 14.2478 20.0055 14.4254C19.7372 14.6031 19.5268 14.8554 19.4 15.1511V15.1511Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Customization Menus Footer */}
      <div className="footer--container">
        {/* Color configuration Drawer */}
        <div className={`gem--menu ${openDrawer === "colors" ? "open" : ""}`}>
          <ul className="colors--list">
            {COLOR_OPTIONS.map((c) => (
              <li
                key={c.id}
                className={`${c.id} ${selectedColor.id === c.id ? "active" : ""}`}
                onClick={() => setSelectedColor(c)}
                title={c.name}
              />
            ))}
            <li className="close-gems" onClick={() => setOpenDrawer(null)}>
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          </ul>
        </div>

        {/* Material configuration Drawer */}
        <div className={`materials--menu ${openDrawer === "materials" ? "open" : ""}`}>
          <ul className="materials--list">
            {MATERIAL_OPTIONS.map((m) => (
              <li
                key={m.id}
                className={selectedMaterial.id === m.id ? "active" : ""}
                onClick={() => setSelectedMaterial(m)}
              >
                {m.name}
              </li>
            ))}
            <li className="close-materials" onClick={() => setOpenDrawer(null)}>
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          </ul>
        </div>

        {/* Weights configuration Drawer */}
        <div className={`materials--menu ${openDrawer === "weights" ? "open" : ""}`}>
          <ul className="materials--list">
            <li className={selectedWeight === "light" ? "active" : ""} onClick={() => setSelectedWeight("light")}>Light (200g)</li>
            <li className={selectedWeight === "standard" ? "active" : ""} onClick={() => setSelectedWeight("standard")}>Standard (250g)</li>
            <li className={selectedWeight === "heavy" ? "active" : ""} onClick={() => setSelectedWeight("heavy")}>Heavy (300g)</li>
            <li className="close-materials" onClick={() => setOpenDrawer(null)}>
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          </ul>
        </div>

        {/* Customization Control Footer menu */}
        <div className="footer--menu">
          <ul>
            <li className={openDrawer === "weights" ? "active" : ""} onClick={() => openCustomizerDrawer("weights")} title="Weight options">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {/* Weight/Scale SVG */}
                <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M12 7v10M9 12h6" />
              </svg>
            </li>
            <li className={openDrawer === "materials" ? "active" : ""} onClick={() => openCustomizerDrawer("materials")} title="Material options">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {/* Spring/Mesh SVG */}
                <path d="M5 3h14M5 21h14M19 3v18M5 3v18M12 3v18M5 12h14" />
              </svg>
            </li>
            <li className={openDrawer === "colors" ? "active" : ""} onClick={() => openCustomizerDrawer("colors")} title="Color options">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {/* Palette SVG */}
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03456 19.176 5.0999 19.4363 5.02324 19.6811C4.78168 20.4523 4.88723 21.2828 5.41421 21.8098C5.9412 22.3368 6.77169 22.4423 7.54289 22.2008C7.78772 22.1241 8.04797 22.1894 8.22396 22.3654C10.0278 24.1693 11.9722 22 12 22Z" />
                <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
                <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
                <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
              </svg>
            </li>
          </ul>
        </div>
      </div>

      {/* Exit customization panel */}
      <div className={`exit--container ${isExitOpen ? "open" : ""}`}>
        <h3 className="customize--title">Customize your grip</h3>
        <p className="copyright">Created by Mohit Malik. All rights reserved.</p>
        <button className="button--secondary button--exit" onClick={() => setIsExitOpen(false)}>
          Done
        </button>
      </div>

      {/* 3D Model Background */}
      <div id="webgi-canvas-container">
        {mounted && (
          <model-viewer
            ref={modelViewerRef as any}
            src="/model/full_grip.obj.glb"
            poster="/model/poster.webp"
            alt="3D model of the Griptix custom match grip"
            camera-controls
            interaction-prompt="none"
            tone-mapping="neutral"
            shadow-intensity="1.33"
            exposure="0.14"
            shadow-softness="0.47"
            camera-orbit="0deg 75deg 75%"
            min-camera-orbit="auto auto auto"
            max-camera-orbit="auto auto auto"
            field-of-view="50deg"
            min-field-of-view="25deg"
            max-field-of-view="85deg"
            camera-target="auto auto auto"
            style={{ transition: "transform 0.1s ease-out" }}
          />
        )}
      </div>

      {/* Ambient Audio */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-ambient-dream-15.mp3"
        loop
      />
    </>
  );
}
