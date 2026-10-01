import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import DiagnosticReportModal from "./DiagnosticReportModal.jsx";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target,
  BookOpen,
  FileText,
  Printer,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import StatusBadge from "../common/StatusBadge.jsx";

export default function AssessmentResults({
  attempt,
  onRetake,
  onViewSkillGaps,
  onViewLearning
}) {
  const { officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!attempt) return null;

  const isPassed = attempt.overallScore >= 75;

  // Chart data: Comparing Current Score vs Required Level for each competency
  const chartData = (attempt.gaps || []).map((gap) => ({
    name: t(gap.competencyName, gap.competencyName),
    currentScore: gap.currentLevel,
    requiredLevel: gap.targetLevel,
    gap: gap.gapMagnitude
  }));

  // Domain score pills
  const domainList = Object.entries(attempt.domainScores || {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Overall Score & Cadre Validation */}
      <div className={`rounded-xl border p-6 md:p-8 shadow-xs relative overflow-hidden ${
        isPassed
          ? "bg-gradient-to-r from-emerald-900 to-teal-950 text-white border-emerald-700 dark:border-emerald-600"
          : "bg-gradient-to-r from-gov-navy to-gov-blue text-white border-blue-700 dark:border-sky-600"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                isPassed
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                  : "bg-amber-500/20 text-amber-200 border-amber-400/40"
              }`}>
                {isPassed ? (isHi ? "मानक बेंचमार्क प्राप्त" : "Standard Benchmark Achieved") : (isHi ? "संवर्ग मूल्यांकन पूर्ण" : "Cadre Diagnostic Completed")}
              </span>
              <span className="text-xs text-slate-300">• {isHi ? "लक्ष्य संवर्ग: सांख्यिकी अधिकारी (75%)" : "Target: Statistical Officer (Threshold 75%)"}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {t("overallCompetencyScore")}: {attempt.overallScore}%
            </h1>

            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {isPassed
                ? (isHi
                  ? "बधाई हो! आपकी मूल्यांकित प्रवीणता भारत की आधिकारिक सांख्यिकी प्रणाली के मुख्य मानकों को पूरा करती है।"
                  : "Congratulations! Your assessed proficiency meets the core threshold required for India's Official Statistical Cadre operations."
                )
                : (isHi
                  ? "मूल्यांकन पूर्ण हुआ। आपकी क्षमताओं का मानचित्रण कर लिया गया है और लक्षित अध्ययन मॉड्यूल नीचे अनुशंसित किए गए हैं।"
                  : "Diagnostic finished. Your capabilities have been mapped, and targeted skill development modules have been prioritized below."
                )
              }
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span>{isHi ? "सही उत्तर:" : "Correct:"} <strong>{attempt.totalCorrect} / {attempt.totalQuestions} {isHi ? "प्रश्न" : "Questions"}</strong></span>
              <span>•</span>
              <span>{isHi ? "मूल्यांकन समय:" : "Evaluated at:"} <strong>{new Date(attempt.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></span>
              <span>•</span>
              <span className="text-gov-sky font-semibold">{isHi ? "आधिकारिक सत्यापन एल्गोरिथम" : "Deterministic JavaScript Logic"}</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center space-x-2 border border-white/30 backdrop-blur-xs transition-colors cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{t("exportReport")}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center bg-white/10 p-5 rounded-2xl border border-white/20 text-center min-w-44 shadow-inner">
            <Award className="w-8 h-8 text-amber-300 mb-1" />
            <span className="text-3xl font-extrabold text-white">{attempt.overallScore}%</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded mt-1.5 ${
              isPassed ? "bg-emerald-500 text-white" : "bg-amber-500 text-slate-900"
            }`}>
              {isPassed ? (isHi ? "योग्य" : "QUALIFIED") : (isHi ? "अंतराल पहचाना गया" : "GAP DETECTED")}
            </span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {domainList.map(([domain, score]) => (
          <div key={domain} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <StatusBadge type="domain" value={domain} />
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{score}%</span>
              <span className={`text-xs font-bold ${score >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}>
                {score >= 75 ? (isHi ? "मानक पूर्ण" : "Target Met") : (isHi ? "अंतराल क्षेत्र" : "Gap Area")}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${score >= 75 ? "bg-emerald-600 dark:bg-emerald-500" : "bg-orange-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Bar Chart: Current vs Required Level */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gov-blue dark:text-sky-400" />
              <span>{isHi ? "दक्षता तुलना बनाम आधिकारिक आवश्यकता" : "Competency Comparison vs. Official Requirement"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? "नीला = आपका स्कोर (%) • नारंगी = सांख्यिकी अधिकारी मानक स्तर (%)"
                : "Blue = Your Score (%) • Orange = Statistical Officer Benchmark Level (%)"
              }
            </p>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.3} />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "#334155",
                  color: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar
                name={isHi ? "आपका स्कोर (%)" : "Your Score (%)"}
                dataKey="currentScore"
                fill="#134074"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name={isHi ? "अपेक्षित स्तर (%)" : "Required Level (%)"}
                dataKey="requiredLevel"
                fill="#ea580c"
                radius={[4, 4, 0, 0]}
              />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" label={isHi ? "संवर्ग मानक (75%)" : "Cadre Baseline (75%)"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Development Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? `संवर्ग की प्रमुख शक्तियां (${attempt.strengths?.length || 0})` : `Demonstrated Cadre Strengths (${attempt.strengths?.length || 0})`}</span>
          </h3>

          {attempt.strengths && attempt.strengths.length > 0 ? (
            <div className="space-y-2.5">
              {attempt.strengths.map((str) => (
                <div
                  key={str.competencyId}
                  className="p-3 bg-emerald-50/60 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">{t(str.competencyName, str.competencyName)}</strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t(str.domain, str.domain)}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-800 dark:text-emerald-300">{str.score}%</span>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400">
                      +{str.surplus}% {isHi ? "मानक से अधिक" : "above requirement"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
              {isHi ? "वर्तमान में कोई दक्षता मानक से अधिक नहीं है।" : "No competencies currently exceed the threshold. Continue learning to build strengths!"}
            </p>
          )}
        </div>

        {/* Development Areas */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>{isHi ? `प्राथमिकता विकास क्षेत्र (${attempt.developmentAreas?.length || 0})` : `Priority Development Areas (${attempt.developmentAreas?.length || 0})`}</span>
          </h3>

          {attempt.developmentAreas && attempt.developmentAreas.length > 0 ? (
            <div className="space-y-2.5">
              {attempt.developmentAreas.map((dev) => (
                <div
                  key={dev.competencyId}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <strong className="text-slate-900 dark:text-slate-100">{t(dev.competencyName, dev.competencyName)}</strong>
                      <StatusBadge type="priority" value={dev.priority} />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t("currentLabel")}: {dev.score}% • {t("requiredLabel")}: {dev.requiredLevel}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-orange-600 dark:text-orange-400">-{dev.gap}%</span>
                    <span className="block text-[10px] text-slate-400">{isHi ? "कमी का परिमाण" : "Gap Magnitude"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 py-3 text-center font-bold">
              {isHi ? "सभी मूल्यांकित दक्षताएँ सफलतापूर्वक आवश्यकता पूरी करती हैं!" : "All assessed competencies successfully meet requirement!"}
            </p>
          )}
        </div>
      </div>

      {/* Granular Gaps Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{isHi ? "गणना किए गए दक्षता अंतराल (कौशल अंतराल)" : "Calculated Competency Skill Gaps"}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {isHi ? "11 दक्षताएँ मूल्यांकित" : "11 Competencies Evaluated"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">{isHi ? "दक्षता" : "Competency"}</th>
                <th className="py-2.5 px-3">{isHi ? "डोमेन" : "Domain"}</th>
                <th className="py-2.5 px-3 text-center">{isHi ? "स्कोर" : "Score"}</th>
                <th className="py-2.5 px-3 text-center">{isHi ? "अपेक्षित" : "Required"}</th>
                <th className="py-2.5 px-3 text-center">{isHi ? "अंतर" : "Gap"}</th>
                <th className="py-2.5 px-3 text-center">{isHi ? "प्राथमिकता" : "Priority"}</th>
                <th className="py-2.5 px-3">{isHi ? "कार्रवाई" : "Cadre Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(attempt.gaps || []).map((gap) => (
                <tr key={gap.competencyId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {t(gap.competencyName, gap.competencyName)}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge type="domain" value={gap.domain} />
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-100">
                    {gap.currentLevel}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-500 dark:text-slate-400">
                    {gap.targetLevel}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`font-bold ${gap.rawGap <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}>
                      {gap.rawGap <= 0 ? `+${Math.abs(gap.rawGap)}%` : `-${gap.rawGap}%`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge type="priority" value={gap.priority} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                    {gap.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question Details Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowQuestionDetails(!showQuestionDetails)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 dark:text-white"
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{isHi ? "प्रश्न-वार ऑडिट एवं आधिकारिक व्याख्या (22 प्रश्न)" : "Question-by-Question Audit & Official Explanations (22 Items)"}</span>
          </div>
          {showQuestionDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showQuestionDetails && (
          <div className="space-y-4 pt-2">
            {attempt.questionDetails?.map((det, idx) => (
              <div
                key={det.questionId || idx}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  det.isCorrect
                    ? "bg-emerald-50/40 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                    : "bg-red-50/40 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {isHi ? `प्रश्न ${idx + 1}` : `Question ${idx + 1}`}: {t(det.competencyId, det.competencyId)}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    det.isCorrect
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  }`}>
                    {det.isCorrect ? (isHi ? "सही" : "CORRECT") : (isHi ? "गलत" : "INCORRECT")}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <p><strong className="text-gov-blue dark:text-sky-400">{isHi ? "आधिकारिक व्याख्या: " : "Official Explanation: "}</strong>{det.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={onRetake}
            className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("retakeDiagnostic")}</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{t("printReport")}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onViewSkillGaps}
            className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-gov-blue dark:text-sky-400 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>{t("viewSkillGaps")}</span>
          </button>
          <button
            onClick={onViewLearning}
            className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>{t("exploreCourses")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Diagnostic & APAR Report Modal */}
      {showReportModal && (
        <DiagnosticReportModal
          attempt={attempt}
          officerProfile={officerProfile}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
