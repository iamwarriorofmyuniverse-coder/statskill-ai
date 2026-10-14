import React, { useState } from "react";
import { usePWA } from "../../hooks/usePWA.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { Smartphone, Download, WifiOff, MoreVertical, PlusSquare, CheckCircle2, X } from "lucide-react";

export default function InstallAppButton({ variant = "header" }) {
  const { isInstallable, isInstalled, isOffline, promptInstall } = usePWA();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [showGuide, setShowGuide] = useState(false);

  const handleClick = async () => {
    const res = await promptInstall();
    if (res === "SHOW_MANUAL_GUIDE") {
      setShowGuide(true);
    }
  };

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

  return (
    <>
      {variant === "sidebar" ? (
        <button
          onClick={handleClick}
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
      ) : (
        <button
          onClick={handleClick}
          title={isHi ? "StatSkill AI ऐप इंस्टॉल करें" : "Install StatSkill AI Mobile/Desktop App"}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gov-sky/20 hover:bg-gov-sky/30 text-gov-sky hover:text-white border border-gov-sky/50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-gov-sky" />
          <span className="hidden sm:inline">{isHi ? "ऐप इंस्टॉल" : "Install App"}</span>
        </button>
      )}

      {/* Visual Step-by-Step Install Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-slate-800 dark:text-slate-100">
            {/* Close button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gov-navy text-gov-sky flex items-center justify-center shadow-inner">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gov-navy dark:text-white">
                  {isHi ? "ऐप कैसे इंस्टॉल करें" : "How to Install StatSkill AI"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHi ? "अपने फोन में ऐप की तरह जोड़ें" : "Add directly to your Phone Home Screen"}
                </p>
              </div>
            </div>

            {/* Visual Steps */}
            <div className="space-y-3.5 my-4 text-xs">
              {/* Step 1 */}
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-sky-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>{isHi ? "ऊपर दाईं ओर" : "Look at top-right corner"}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px] font-bold">
                      <MoreVertical className="w-3 h-3 inline" /> 3 Dots
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {isHi ? "ब्राउज़र में सबसे ऊपर तीन बिंदुओं (⋮) पर टैप करें।" : "Tap the three dots (⋮) in Chrome right next to the tabs icon."}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1">
                    <span>{isHi ? "मेनू में चुनें" : "Tap"}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      {isHi ? "ऐप इंस्टॉल करें / Add to Home screen" : "Install app / Add to Home screen"}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {isHi ? "मेनू सूची में 'Install app' या 'Add to Home screen' विकल्प दबाएं।" : "Select 'Install app' or 'Add to Home screen' from the dropdown list."}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {isHi ? "'Install' की पुष्टि करें" : "Confirm 'Install'"}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {isHi ? "ऐप आपके फ़ोन की होम स्क्रीन पर आ जाएगा!" : "StatSkill AI will appear on your phone home screen just like a Play Store app!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={async () => {
                const res = await promptInstall();
                if (res === "INSTALLED") {
                  setShowGuide(false);
                }
              }}
              className="w-full mt-2 py-3 bg-gradient-to-r from-gov-navy to-gov-blue hover:from-gov-blue hover:to-sky-700 text-white font-bold rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center space-x-2 border border-white/20"
            >
              <Download className="w-4 h-4 text-gov-sky" />
              <span>{isHi ? "वेबसाइट से अभी इंस्टॉल करें" : "Direct 1-Click Install to Phone"}</span>
            </button>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full mt-2 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-xs transition-colors"
            >
              {isHi ? "बंद करें" : "Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
