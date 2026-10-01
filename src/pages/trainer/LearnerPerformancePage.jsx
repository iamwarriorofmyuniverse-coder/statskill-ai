import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getCohortPerformance } from "../../services/firestoreService.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  Users,
  Award,
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Search
} from "lucide-react";

export default function LearnerPerformancePage() {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [cohort, setCohort] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = await getCohortPerformance();
      setCohort(list || []);
      if (list && list.length > 0) setSelectedOfficer(list[0]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
          <Users className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isHi ? "अधीनस्थ सांख्यिकी सेवा बैच विश्लेषण" : "Subordinate Statistical Service Cohort Analytics"}
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
          {t("learnerPerformanceTitle")}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
          {t("learnerPerformanceSubtitle")}
        </p>
      </div>

      {/* Main Grid: Cohort Table & Selected Officer Drill-Down */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Officers List */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            {t("enrolledOfficersList")}
          </h3>

          <div className="space-y-3">
            {cohort.map((officer) => {
              const isSelected = selectedOfficer?.officerId === officer.officerId;
              const officerName = t(officer.name, officer.name);
              const officerDesig = t(officer.designation, officer.designation);
              return (
                <div
                  key={officer.officerId}
                  onClick={() => setSelectedOfficer(officer)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-600/20 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
                      {officer.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{officerName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {officerDesig} • {officer.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      officer.overallScore >= 80 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300"
                    }`}>
                      {officer.overallScore}% {isHi ? "स्कोर" : "Score"}
                    </span>
                    <span className="block text-[11px] text-orange-600 dark:text-orange-400 font-bold mt-1">
                      {officer.highGapsCount} {isHi ? "प्राथमिकता अंतराल" : "Priority Gaps"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Officer Deep-Dive Profile */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
          {selectedOfficer ? (
            <>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {t("individualCadreDossier")}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                  {t(selectedOfficer.name, selectedOfficer.name)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t(selectedOfficer.designation, selectedOfficer.designation)} • {selectedOfficer.department}
                </p>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block">{t("overallCompetencyScore")}</span>
                  <strong className="text-lg text-slate-900 dark:text-white">{selectedOfficer.overallScore}%</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block">{t("assessedCompetencies")}</span>
                  <strong className="text-lg text-slate-900 dark:text-white">{selectedOfficer.assessedCompetencies} / 17</strong>
                </div>
              </div>

              {/* Domain Breakdown Progress */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                  {t("domainProficiencyBreakdown")}
                </h4>

                {Object.entries(selectedOfficer.domainAverages || {}).map(([domain, score]) => (
                  <div key={domain} className="space-y-1">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>{t(domain, domain)}</span>
                      <span className="font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          score >= 80 ? "bg-emerald-600" : score >= 65 ? "bg-gov-blue" : "bg-orange-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{t("facultyRecommendedAction")}</span>
                </p>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {t("facultyActionDesc")}
                </p>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-slate-400">
              {t("selectOfficerToInspect")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
