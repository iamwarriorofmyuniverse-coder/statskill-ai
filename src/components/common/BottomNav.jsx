import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  BrainCircuit,
  Bot,
  UploadCloud,
  Cpu,
  CheckCircle,
  Users
} from "lucide-react";

export default function BottomNav({ currentTab, setCurrentTab }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  if (!currentUser || !currentUser.role) return null;

  const isOfficer = currentUser.role === "OFFICER";
  const isTrainer = currentUser.role === "TRAINER";

  const officerTabs = [
    { id: "dashboard", label: t("dashboard", "Home"), icon: LayoutDashboard },
    { id: "assessment", label: t("assessment", "Diagnostic"), icon: ClipboardCheck },
    { id: "learning", label: t("learning", "Learn"), icon: BookOpen },
    { id: "practice-quiz", label: t("practiceQuiz", "Quiz"), icon: BrainCircuit },
    { id: "ai-assistant", label: t("aiAssistant", "AI Bot"), icon: Bot }
  ];

  const trainerTabs = [
    { id: "dashboard", label: t("dashboard", "Home"), icon: LayoutDashboard },
    { id: "upload-material", label: t("uploadMaterial", "Curate"), icon: UploadCloud },
    { id: "ai-mcq-generator", label: t("aiMcqGenerator", "AI Gen"), icon: Cpu },
    { id: "question-review", label: t("questionReview", "Review"), icon: CheckCircle },
    { id: "learner-performance", label: t("learnerPerformance", "Cohort"), icon: Users }
  ];

  const tabs = isOfficer ? officerTabs : isTrainer ? trainerTabs : [];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id);
                // Subtle haptic vibration on supporting mobile devices
                if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
                  window.navigator.vibrate(12);
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 relative cursor-pointer active:scale-90 ${
                isActive
                  ? "text-gov-blue dark:text-sky-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              }`}
            >
              {/* Active Pill Glow */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-gradient-to-r from-gov-saffron to-gov-blue dark:from-sky-400 dark:to-blue-500 animate-pulse" />
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? "bg-gov-sky/30 dark:bg-sky-950/60 text-gov-blue dark:text-sky-300 scale-110"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-[10px] tracking-tight leading-none mt-0.5 truncate max-w-[62px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
