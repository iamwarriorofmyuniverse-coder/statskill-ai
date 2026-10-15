import React from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    // Subtle mobile haptic feedback
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 flex items-center space-x-1.5 text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer active:scale-95 shrink-0"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-sky-300 transition-transform duration-300" />
      )}
      <span className="hidden sm:inline text-[11px] font-bold">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
