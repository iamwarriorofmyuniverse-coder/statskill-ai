import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { ArrowRight } from "lucide-react";

export default function SkillGapCard({ gap, onAction }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const isPercentScale = gap.targetLevel > 5;
  const currentPct = isPercentScale ? gap.currentLevel : Math.round((gap.currentLevel / 5) * 100);
  const targetPct = isPercentScale ? gap.targetLevel : Math.round((gap.targetLevel / 5) * 100);

  const displayCurrent = isPercentScale ? `${gap.currentLevel}%` : `${Number(gap.currentLevel).toFixed(1)} / 5`;
  const displayTarget = isPercentScale ? `${gap.targetLevel}%` : `${Number(gap.targetLevel).toFixed(1)} / 5`;
  const displayGap = isPercentScale ? `${gap.gapMagnitude}%` : Number(gap.gapMagnitude).toFixed(1);

  const competencyName = t(gap.competencyName, gap.competencyName);
  const domain = t(gap.domain, gap.domain);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-gov-blue/50 dark:hover:border-sky-500/50 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{competencyName}</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {domain} {isHi ? "डोमेन" : "Domain"}
            </p>
          </div>
          <StatusBadge type="priority" value={gap.priority} />
        </div>

        {/* Level comparison bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>{t("currentLabel")}: <strong className="text-gov-blue dark:text-sky-400">{displayCurrent}</strong></span>
            <span>{t("targetLabel")}: <strong className="text-slate-900 dark:text-slate-100">{displayTarget}</strong></span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            {/* Target indicator */}
            <div
              className="absolute top-0 bottom-0 bg-slate-300 dark:bg-slate-700"
              style={{ width: `${Math.min(100, targetPct)}%` }}
            />
            {/* Current fill */}
            <div
              className={`absolute top-0 bottom-0 rounded-full ${
                gap.priority === "CRITICAL"
                  ? "bg-red-500"
                  : gap.priority === "HIGH"
                  ? "bg-orange-500"
                  : gap.priority === "MEDIUM"
                  ? "bg-amber-500"
                  : "bg-gov-blue dark:bg-sky-500"
              }`}
              style={{ width: `${Math.min(100, currentPct)}%` }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {gap.rawGap <= 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {t("meetsRequirement")} (+{Math.abs(gap.rawGap)}%)
                </span>
              ) : (
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {t("deficiencyLabel")}: -{displayGap}
                </span>
              )}
            </span>
          </div>
        </div>

        {gap.notes && (
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg mt-3 border border-slate-100 dark:border-slate-800">
            {gap.notes}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <StatusBadge type="status" value={gap.status} />
        {onAction && (
          <button
            onClick={() => onAction(gap)}
            className="text-xs font-bold text-gov-blue dark:text-sky-400 hover:text-gov-navy dark:hover:text-sky-300 flex items-center space-x-1"
          >
            <span>{t("bridgeGapBtn")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
