import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getCompetencyHistory, getSkillGaps } from "../../services/firestoreService.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function ProgressPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [history, setHistory] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [hist, gaps] = await Promise.all([
          getCompetencyHistory(uid),
          getSkillGaps(uid)
        ]);
        setHistory(hist || []);
        setSkillGaps(gaps || []);
      } catch (e) {
        console.error("Progress load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const targetRole = officerProfile?.careerGoal ? t(officerProfile.careerGoal, officerProfile.careerGoal) : t("seniorAnalyst");
  const assessedCount = skillGaps && skillGaps.length > 0 ? skillGaps.length : 14;
  const overallScore = skillGaps && skillGaps.length > 0
    ? Math.round(skillGaps.reduce((acc, g) => acc + (g.currentLevel !== undefined ? g.currentLevel : 70), 0) / skillGaps.length)
    : 74;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "दक्षता संवर्धन एवं विकास इतिहास" : "Competency Evolution & Growth History"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "दक्षता संवर्धन एवं करियर मील का पत्थर ट्रैकिंग" : "Competency Evolution & Career Milestone Tracking"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? `समय के साथ अपनी प्रवीणता वृद्धि और लक्ष्य पद ${targetRole} की दिशा में प्रगति का निरीक्षण करें।`
              : `Track your proficiency growth over time towards your target milestone: ${targetRole}.`
            }
          </p>
        </div>

        <button
          onClick={() => setCurrentTab("assessment")}
          className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-2 transition-colors shrink-0"
        >
          <Zap className="w-4 h-4 text-gov-sky" />
          <span>{t("takeDiagnosticBtn")}</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t("overallCompetencyScore")}</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{overallScore}%</h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{t("trendQuarter")}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t("assessedCompetencies")}</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{assessedCount} / 17</h3>
          <span className="text-[11px] text-slate-400">{t("pendingDiagnostics")}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{isHi ? "लक्ष्य संवर्ग मानक" : "Target Milestone Benchmark"}</span>
          <h3 className="text-2xl font-black text-gov-blue dark:text-sky-400 mt-1">85%</h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{targetRole}</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-gov-blue dark:text-sky-400" />
          <span>{isHi ? "दक्षता अंशांकन एवं मूल्यांकन ऑडिट लॉग" : "Competency Calibration & Assessment Audit Log"}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">{isHi ? "दिनांक" : "Date"}</th>
                <th className="py-2.5 px-3">{isHi ? "दक्षता" : "Competency"}</th>
                <th className="py-2.5 px-3">{isHi ? "पूर्व स्तर" : "Previous Level"}</th>
                <th className="py-2.5 px-3">{isHi ? "नया स्तर" : "New Level"}</th>
                <th className="py-2.5 px-3">{isHi ? "सुधार" : "Improvement"}</th>
                <th className="py-2.5 px-3">{isHi ? "सत्यापन स्रोत" : "Verification Source"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {new Date(item.assessedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">
                    {t(item.competencyName, item.competencyName)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {isHi ? `स्तर ${item.previousScore}` : `Level ${item.previousScore}`}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-gov-blue dark:text-sky-400">
                    {isHi ? `स्तर ${item.newScore}` : `Level ${item.newScore}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      {item.improvement}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
