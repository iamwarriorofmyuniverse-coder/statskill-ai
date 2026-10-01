import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Read stored preference: 'light' | 'dark' | 'system', default to 'system'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("statskill_theme_mode");
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch (e) {
      console.warn("Failed to read theme from localStorage:", e);
    }
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Apply theme class and listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "light") {
        isDark = false;
      } else {
        // system mode
        isDark = mediaQuery.matches;
      }

      const activeResolved = isDark ? "dark" : "light";
      setResolvedTheme(activeResolved);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const updateTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
      setTheme(newTheme);
      try {
        localStorage.setItem("statskill_theme_mode", newTheme);
      } catch (e) {
        console.warn("Failed to persist theme to localStorage:", e);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
