import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";

export default function ThemeToggle({ variant = "dropdown" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
      description: "Clean day mode"
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
      description: "Low-glare night mode"
    },
    {
      id: "system",
      label: "System Auto",
      icon: Laptop,
      description: `Follows OS theme (${resolvedTheme})`
    }
  ];

  // Active icon based on current choice
  const ActiveIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;

  // Segmented variant (compact horizontal buttons)
  if (variant === "segmented") {
    return (
      <div className="inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700">
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              title={`${opt.label} Mode — ${opt.description}`}
              className={`p-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
                isActive
                  ? "bg-white dark:bg-slate-700 text-gov-blue dark:text-sky-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default Dropdown button variant (fits seamlessly in Header)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 flex items-center space-x-1.5 text-xs font-semibold transition-colors shadow-xs"
        title={`Theme: ${theme.toUpperCase()} (Click to change)`}
        aria-expanded={isOpen}
      >
        <ActiveIcon className="w-4 h-4 text-gov-sky" />
        <span className="capitalize hidden sm:inline">{theme === "system" ? "Auto" : theme}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            Display Theme
          </div>

          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-slate-800/80 text-gov-blue dark:text-sky-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-gov-blue dark:text-sky-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <div>
                    <span className="block leading-tight">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      {opt.description}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-gov-blue dark:text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
