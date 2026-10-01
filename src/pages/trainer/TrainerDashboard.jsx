import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { getCohortPerformance, getUploadedMaterials, getQuestionBank, getGeneratedQuestions } from "../../services/firestoreService.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  Users,
  Award,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Cpu,
  Layers
} from "lucide-react";

export default function TrainerDashboard({ setCurrentTab }) {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [cohort, setCohort] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [pendingGen, setPendingGen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [c, m, q, g] = await Promise.all([
          getCohortPerformance(),
          getUploadedMaterials(),
          getQuestionBank(),
          getGeneratedQuestions()
        ]);
        setCohort(c || []);
        setMaterials(m || []);
        setQuestions(q || []);
        setPendingGen(g?.filter(item => item.status === "PENDING") || []);
      } catch (e) {
        console.error("Trainer dashboard load error:", e);
      } finally {
        setLoading(false);
      }
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

  const avgScore = cohort.length > 0
    ? Math.round(cohort.reduce((acc, o) => acc + o.overallScore, 0) / cohort.length)
    : 77;

  return (
    <div className="space-y-6">
      {/* Trainer Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {t("nsstaFacultyConsole")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">• {t("statisticalCapacityOversight")}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t("welcome")}, {currentUser?.displayName || (isHi ? "डॉ. राजेश वर्मा" : "Dr. Rajesh Verma")}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              {t("supervisingBatch")} • <strong>{cohort.length} {t("enrolledCadreOfficers")}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentTab("upload-material")}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t("uploadMaterialNow")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cohort Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("cohortOfficers")}
          value={cohort.length}
          subtitle={t("allActiveCadre")}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t("batchAverageScore")}
          value={`${avgScore}%`}
          subtitle={t("benchmarkLabel")}
          trend={t("trendMonth")}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title={t("uploadedMaterials")}
          value={materials.length}
          subtitle={isHi ? `${materials.length} नियमावली प्रविष्ट` : `${materials.length} Handbooks Ingested`}
          icon={UploadCloud}
          color="purple"
        />
        <StatCard
          title={t("verifiedQuestions")}
          value={questions.length}
          subtitle={`${pendingGen.length} ${t("pendingReview")}`}
          icon={Database}
          color="amber"
        />
      </div>

      {/* Main Grid: Cohort Roster & Question Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cohort Performance Overview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{t("cohortPerformanceTitle")}</span>
            </h3>
            <button
              onClick={() => setCurrentTab("learner-performance")}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              {t("viewFullAnalytics")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">{isHi ? "अधिकारी" : "Officer"}</th>
                  <th className="py-2.5 px-3">{isHi ? "विभाग" : "Department"}</th>
                  <th className="py-2.5 px-3 text-center">{isHi ? "स्कोर" : "Score"}</th>
                  <th className="py-2.5 px-3 text-center">{isHi ? "प्राथमिकता अंतराल" : "High Gaps"}</th>
                  <th className="py-2.5 px-3 text-right">{isHi ? "कार्रवाई" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {cohort.map((officer) => (
                  <tr key={officer.officerId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{officer.name}</p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{t(officer.designation, officer.designation)}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{officer.department}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-slate-900 dark:text-white">
                      <span className={`px-2 py-0.5 rounded ${
                        officer.overallScore >= 80 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300"
                      }`}>
                        {officer.overallScore}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                        {officer.highGapsCount} {isHi ? "अंतराल" : "Gaps"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setCurrentTab("learner-performance")}
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {isHi ? "डोजियर देखें" : "Inspect"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Review & Upload Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{isHi ? "समीक्षा हेतु लंबित प्रश्न" : "Pending Question Reviews"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? `अपलोड की गई सांख्यिकीय सामग्री से निर्मित ${pendingGen.length} प्रश्न संकाय सत्यापन की प्रतीक्षा कर रहे हैं।`
                : `${pendingGen.length} questions generated from uploaded statistical materials await faculty verification.`
              }
            </p>
            <button
              onClick={() => setCurrentTab("question-review")}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>{isHi ? `प्रश्नों की समीक्षा करें (${pendingGen.length})` : `Review Questions (${pendingGen.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-gov-blue dark:text-sky-400" />
              <span>{t("aiMcqGenerator")}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? "स्वचालित प्रश्न निर्माण हेतु जेमिनी एपीआई का उपयोग करके पाठ्यक्रम निष्कर्षण पैरामीटर कॉन्फ़िगर करें।"
                : "Configure curriculum extraction parameters using Gemini API for automatic item writing."
              }
            </p>
            <button
              onClick={() => setCurrentTab("ai-mcq-generator")}
              className="w-full py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>{isHi ? "जेनरेटर कंसोल खोलें" : "Open Generator Console"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
