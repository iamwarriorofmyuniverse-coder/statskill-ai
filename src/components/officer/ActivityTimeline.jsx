import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { TrendingUp, BookOpen, CheckCircle2, Clock } from "lucide-react";

export default function ActivityTimeline({ history = [], learningProgress = [] }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-gov-blue" />
        <span>{t("activityTimeline")}</span>
      </h3>

      <div className="space-y-4">
        {history.map((item, idx) => {
          const compName = t(item.competencyName, item.competencyName);
          return (
            <div key={item.id || idx} className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {compName} {t("calibration")}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    {item.improvement}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isHi
                    ? `${item.source} द्वारा स्तर ${item.previousScore} से ${item.newScore} में उन्नत`
                    : `Upgraded from Level ${item.previousScore} to ${item.newScore} via ${item.source}`
                  }
                </p>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.assessedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </span>
              </div>
            </div>
          );
        })}

        {learningProgress.slice(0, 2).map((lp, idx) => (
          <div key={lp.id || idx} className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-gov-blue dark:text-sky-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {lp.course?.title || t("enrolledCourse")}
                </p>
                <span className="text-[10px] font-bold text-gov-blue dark:text-sky-400">
                  {lp.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gov-blue dark:bg-sky-500 h-full rounded-full"
                  style={{ width: `${lp.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
