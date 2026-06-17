"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const LS_KEY = "griptix-theme";

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

export function useTheme() {
  // Default to dark so SSR and first client paint match the dark canvas
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved: Theme = stored ?? (prefersDark ? "dark" : "light");
    applyTheme(resolved);
    setTheme(resolved);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    localStorage.setItem(LS_KEY, next);
  }

  return { theme, toggle };
}
