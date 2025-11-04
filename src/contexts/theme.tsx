"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function detectPreferredTheme(): Theme {
  if (typeof window == "undefined") return "light";

  try {
    const stored = localStorage.getItem("theme");
    if (stored == "light" || stored == "dark") return stored;
  } catch {}

  const prefersDark = window.matchMedia?.(
    "(prefers-color-scheme: dark)"
  ).matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(newTheme: Theme) {
  if (typeof document == "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", newTheme == "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => detectPreferredTheme());

  const toggleTheme = () => {
    if (typeof document != "undefined") {
      const root = document.documentElement;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 300);
    }
    setTheme((t) => (t == "light" ? "dark" : "light"));
  };

  useEffect(() => {
    applyTheme(theme);
    try {
      if (typeof window != "undefined") localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (typeof window == "undefined") return;

    if (localStorage.getItem("theme")) return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx == undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
