import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/10 dark:bg-slate-800/80 p-0.5 rounded-lg border border-white/20 dark:border-slate-700 shadow-inner">
      <div className="flex items-center space-x-0.5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
            language === "en"
              ? "bg-white text-slate-900 shadow-xs font-extrabold"
              : "text-slate-200 hover:text-white hover:bg-white/10"
          }`}
          title="Switch to English"
        >
          <span>EN</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 cursor-pointer ${
            language === "hi"
              ? "bg-gov-saffron text-slate-900 shadow-xs font-extrabold"
              : "text-slate-200 hover:text-white hover:bg-white/10"
          }`}
          title="हिन्दी में बदलें (Switch to Hindi)"
        >
          <span>हिं</span>
        </button>
      </div>
    </div>
  );
}
