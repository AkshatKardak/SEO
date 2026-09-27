/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  /** The raw persisted user choice. */
  theme: Theme;
  /** What is actually applied to <html> right now. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export const THEME_STORAGE_KEY = "serpoai-theme";
const LEGACY_STORAGE_KEY = "rankpilot-theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(fallback: Theme): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isTheme(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return fallback;
}

function applyThemeToRoot(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === "system" ? getSystemTheme() : (theme as ResolvedTheme)
  );

  // Apply whenever the raw choice changes.
  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    applyThemeToRoot(resolved);
    setResolvedTheme(resolved);
  }, [theme]);

  // Live-follow OS changes while in system mode.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = getSystemTheme();
      applyThemeToRoot(resolved);
      setResolvedTheme(resolved);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next);
        // Clear the legacy key so it can never win again.
        if (storageKey === THEME_STORAGE_KEY) {
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      } catch {
        /* storage unavailable */
      }
      setThemeState(next);
    },
    [storageKey]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
