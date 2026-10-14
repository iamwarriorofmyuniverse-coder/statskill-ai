import React from "react";
import { usePWA } from "../../hooks/usePWA.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { Smartphone, Download, WifiOff } from "lucide-react";

export default function InstallAppButton({ variant = "header" }) {
  const { isInstallable, isInstalled, isOffline, promptInstall } = usePWA();
  const { language } = useLanguage();
  const isHi = language === "hi";

  // If offline, display a subtle indicator
  if (isOffline) {
    return (
      <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 border border-amber-400 text-amber-300 text-xs rounded-full font-medium shadow-xs">
        <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>{isHi ? "ऑफ़लाइन मोड" : "Offline"}</span>
      </div>
    );
  }

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={promptInstall}
        className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-gov-navy to-gov-blue hover:from-gov-blue hover:to-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all duration-200 border border-white/20 cursor-pointer group"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Smartphone className="w-3.5 h-3.5 text-gov-sky" />
          </div>
          <span className="text-left leading-tight">
            {isHi ? "मोबाईल ऐप इंस्टॉल करें" : "Install Mobile App"}
          </span>
        </div>
        <Download className="w-3.5 h-3.5 text-gov-sky group-hover:translate-y-0.5 transition-transform" />
      </button>
    );
  }

  return (
    <button
      onClick={promptInstall}
      title={isHi ? "StatSkill AI ऐप इंस्टॉल करें" : "Install StatSkill AI Mobile/Desktop App"}
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gov-sky/20 hover:bg-gov-sky/30 text-gov-sky hover:text-white border border-gov-sky/50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
    >
      <Download className="w-3.5 h-3.5 text-gov-sky" />
      <span className="hidden sm:inline">{isHi ? "ऐप इंस्टॉल" : "Install App"}</span>
    </button>
  );
}
