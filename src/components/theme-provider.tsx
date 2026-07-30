"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: Theme;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  enableSystem?: boolean;
  forcedTheme?: Exclude<Theme, "system">;
  storageKey?: string;
  themes?: Exclude<Theme, "system">[];
};

type ThemeContextValue = {
  forcedTheme?: Exclude<Theme, "system">;
  resolvedTheme: Exclude<Theme, "system">;
  setTheme: (theme: Theme) => void;
  systemTheme: Exclude<Theme, "system">;
  theme: Theme;
  themes: Theme[];
};

const DEFAULT_THEMES: Exclude<Theme, "system">[] = ["light", "dark"];
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Exclude<Theme, "system"> {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}"),
  );
  document.head.appendChild(style);

  return () => {
    // Force a style recalculation before removing the override.
    window.getComputedStyle(document.body);
    setTimeout(() => {
      document.head.removeChild(style);
    }, 0);
  };
}

function applyThemeToDocument({
  attribute,
  disableTransitionOnChange,
  enableColorScheme,
  theme,
  themes,
}: {
  attribute: "class" | `data-${string}`;
  disableTransitionOnChange: boolean;
  enableColorScheme: boolean;
  theme: Exclude<Theme, "system">;
  themes: Exclude<Theme, "system">[];
}) {
  const restoreTransitions = disableTransitionOnChange
    ? disableTransitionsTemporarily()
    : undefined;

  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove(...themes);
    root.classList.add(theme);
  } else {
    root.setAttribute(attribute, theme);
  }

  if (enableColorScheme) {
    root.style.colorScheme = theme;
  }

  restoreTransitions?.();
}

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
  enableColorScheme = true,
  enableSystem = true,
  forcedTheme,
  storageKey = "theme",
  themes = DEFAULT_THEMES,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const persistedTheme = window.localStorage.getItem(
      storageKey,
    ) as Theme | null;

    return persistedTheme ?? defaultTheme;
  });

  const [systemTheme, setSystemTheme] = React.useState<
    Exclude<Theme, "system">
  >(() => getSystemTheme());

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(getSystemTheme());

    onChange();
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      setThemeState((event.newValue as Theme | null) ?? defaultTheme);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [defaultTheme, storageKey]);

  const resolvedTheme = React.useMemo<Exclude<Theme, "system">>(() => {
    const activeTheme = forcedTheme ?? theme;

    if (activeTheme === "system") {
      return enableSystem ? systemTheme : "light";
    }

    return activeTheme;
  }, [enableSystem, forcedTheme, systemTheme, theme]);

  React.useEffect(() => {
    applyThemeToDocument({
      attribute,
      disableTransitionOnChange,
      enableColorScheme,
      theme: resolvedTheme,
      themes,
    });
  }, [
    attribute,
    disableTransitionOnChange,
    enableColorScheme,
    resolvedTheme,
    themes,
  ]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (forcedTheme) {
        return;
      }

      setThemeState(nextTheme);
      window.localStorage.setItem(storageKey, nextTheme);
    },
    [forcedTheme, storageKey],
  );

  const contextValue = React.useMemo<ThemeContextValue>(
    () => ({
      forcedTheme,
      resolvedTheme,
      setTheme,
      systemTheme,
      theme,
      themes: enableSystem ? [...themes, "system"] : themes,
    }),
    [
      enableSystem,
      forcedTheme,
      resolvedTheme,
      setTheme,
      systemTheme,
      theme,
      themes,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
