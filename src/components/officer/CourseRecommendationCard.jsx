import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import { Sparkles, Clock, ExternalLink } from "lucide-react";

export default function CourseRecommendationCard({ rec, onEnroll }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  if (!rec) return null;

  const currentScore = rec.currentCompetency !== undefined ? rec.currentCompetency : 50;
  const requiredScore = rec.requiredCompetency !== undefined ? rec.requiredCompetency : 75;
  const gapValue = rec.gap !== undefined ? rec.gap : (requiredScore - currentScore);

  const competencyName = t(rec.competencyName, rec.competencyName);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-gov-blue/50 dark:hover:border-sky-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges: Domain, Priority & Recommendation Score */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <StatusBadge type="domain" value={rec.domain || "Technical"} />
            <StatusBadge type="priority" value={rec.priority} />
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-black text-white bg-gov-blue px-2.5 py-1 rounded-lg shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gov-sky" />
            <span>{rec.recommendationScore}% {t("matchScore")}</span>
          </div>
        </div>

        {/* Title and Provider */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base leading-snug hover:text-gov-blue transition-colors">
            {rec.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("providerLabel")}: <strong className="text-slate-700 dark:text-slate-200">{rec.provider}</strong>
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
            {rec.catalogueSource || (isHi ? "प्रोटोटाइप कैटलॉग - iGOT-संगत मॉक डेटा" : "Prototype Catalogue - iGOT-compatible mock data")}
          </span>
        </div>

        {/* Competency Gap Metric Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>{t("competencyLabel")}: <strong className="text-slate-900 dark:text-white">{competencyName}</strong></span>
            <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
              gapValue > 0 ? "bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
            }`}>
              {gapValue > 0 ? `${t("gapLabel")}: -${gapValue} pts` : t("meetsRequirement")}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{t("currentLabel")}: <strong>{currentScore}%</strong></span>
            <span>{t("requiredLabel")}: <strong>{requiredScore}%</strong></span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${gapValue > 0 ? "bg-orange-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(100, currentScore)}%` }}
            />
          </div>
        </div>

        {/* Why this was recommended (Reason Box) */}
        <div className="p-3 bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 rounded-lg text-xs text-blue-950 dark:text-sky-200 space-y-1">
          <div className="flex items-center space-x-1.5 text-gov-blue dark:text-sky-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gov-accent shrink-0" />
            <span>{t("whyRecommended")}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
            {rec.reason || (isHi
              ? `आपकी ${competencyName} दक्षता आवश्यकता से ${gapValue} अंक कम है। यह पाठ्यक्रम इस अंतर को पाटने हेतु लक्षित है।`
              : `Your ${competencyName} competency is ${gapValue} points below the requirement. This course directly addresses the identified gap.`
            )}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{rec.durationHours || 20} {t("durationLabel")}</span>
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">
            {rec.courseType ? t(rec.courseType, rec.courseType) : t("selfPaced")}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <StatusBadge type="status" value={rec.status || "RECOMMENDED"} />
        <button
          onClick={() => onEnroll && onEnroll(rec)}
          className="px-4 py-2 rounded-lg bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
        >
          <span>{rec.status === "ENROLLED" ? t("continueLearningBtn") : t("enrollBtn")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
