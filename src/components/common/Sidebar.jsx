import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Target,
  Sparkles,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  UploadCloud,
  Cpu,
  CheckCircle,
  Database,
  Users,
  Shield,
  Layers,
  Bot
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const isOfficer = currentUser?.role === "OFFICER";
  const isTrainer = currentUser?.role === "TRAINER";

  const officerNavItems = [
    { id: "dashboard", label: t("dashboard", "Dashboard"), icon: LayoutDashboard, badge: null },
    { id: "profile", label: t("officerProfile", "Officer Profile"), icon: User, badge: null },
    { id: "assessment", label: t("assessment", "Assessment"), icon: ClipboardCheck, badge: t("loopMeasure", "MEASURE") },
    { id: "skill-gaps", label: t("skillGaps", "Skill Gaps"), icon: Target, badge: t("loopDiagnose", "DIAGNOSE") },
    { id: "recommendations", label: t("recommendations", "Recommendations"), icon: Sparkles, badge: "AI" },
    { id: "learning", label: t("learning", "Learning"), icon: BookOpen, badge: t("loopLearn", "LEARN") },
    { id: "practice-quiz", label: t("practiceQuiz", "Practice Quiz"), icon: BrainCircuit, badge: t("loopReassess", "REASSESS") },
    { id: "ai-assistant", label: t("aiAssistant", "AI Assistant"), icon: Bot, badge: "Gemini" },
    { id: "progress", label: t("progress", "Progress"), icon: TrendingUp, badge: null }
  ];

  const trainerNavItems = [
    { id: "dashboard", label: t("dashboard", "Dashboard"), icon: LayoutDashboard, badge: null },
    { id: "upload-material", label: t("uploadMaterial", "Upload Material"), icon: UploadCloud, badge: null },
    { id: "ai-mcq-generator", label: t("aiMcqGenerator", "AI MCQ Generator"), icon: Cpu, badge: "Gemini" },
    { id: "question-review", label: t("questionReview", "Question Review"), icon: CheckCircle, badge: "3 Pending" },
    { id: "question-bank", label: t("questionBank", "Question Bank"), icon: Database, badge: null },
    { id: "learner-performance", label: t("learnerPerformance", "Learner Performance"), icon: Users, badge: "Cohort" }
  ];

  const items = isOfficer ? officerNavItems : isTrainer ? trainerNavItems : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Core Loop Indicator for Officer */}
        {isOfficer && (
          <div className="p-3 m-3 bg-gov-sky/50 dark:bg-slate-800/80 rounded-lg border border-gov-sky dark:border-slate-700 text-gov-blue dark:text-sky-300 text-xs">
            <div className="font-bold flex items-center space-x-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-gov-accent dark:text-sky-400" />
              <span>{t("competencyGrowthLoop", "Competency Growth Loop")}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { num: "1", label: t("loopMeasure", "Measure") },
                { num: "2", label: t("loopDiagnose", "Diagnose") },
                { num: "3", label: t("loopLearn", "Learn") },
                { num: "4", label: t("loopReassess", "Reassess") }
              ].map((step) => (
                <div
                  key={step.num}
                  className="bg-white dark:bg-slate-900 py-1 px-0.5 rounded-md shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[38px]"
                >
                  <span className="text-[10px] font-bold text-gov-accent dark:text-sky-400 leading-none">{step.num}.</span>
                  <span className="text-[9px] font-semibold leading-tight mt-0.5 text-slate-700 dark:text-slate-200">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isTrainer && (
          <div className="p-3 m-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs">
            <div className="font-bold flex items-center space-x-1 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t("trainerConsole", "Trainer Authority Console")}</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Authorized evaluation, curriculum curation, and cohort psychometrics.
            </p>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gov-blue dark:bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cadre System Info Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">India Official Statistics</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-400 dark:text-slate-500">
            NSSO • CSO • State DES • NSSTA
          </p>
        </div>
      </aside>
    </>
  );
}
