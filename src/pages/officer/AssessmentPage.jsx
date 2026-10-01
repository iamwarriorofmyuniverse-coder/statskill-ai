import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getMasterAssessment,
  recordAssessmentAttempt,
  getLatestAssessmentAttempt
} from "../../services/firestoreService.js";
import { evaluateAssessment } from "../../services/assessmentScoring.js";
import AssessmentEngine from "../../components/officer/AssessmentEngine.jsx";
import AssessmentResults from "../../components/officer/AssessmentResults.jsx";
import DiagnosticReportModal from "../../components/officer/DiagnosticReportModal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  ClipboardCheck,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  BarChart2,
  Layers,
  BookOpen,
  FileText,
  Printer
} from "lucide-react";

export default function AssessmentPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [mode, setMode] = useState("LANDING"); // "LANDING" | "RUNNING" | "RESULTS"
  const [assessmentData, setAssessmentData] = useState(null);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLandingReportModal, setShowLandingReportModal] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [master, lastAttempt] = await Promise.all([
          getMasterAssessment(),
          getLatestAssessmentAttempt(uid)
        ]);
        setAssessmentData(master);
        if (lastAttempt) {
          setLatestAttempt(lastAttempt);
        }
      } catch (err) {
        console.error("Failed to load assessment data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  // Handle assessment completion with deterministic JavaScript scoring
  const handleAssessmentSubmit = async (userAnswers) => {
    setLoading(true);
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const questions = assessmentData.questions;

      // 1. Pure deterministic JavaScript evaluation
      const evaluation = evaluateAssessment(questions, userAnswers);

      const attemptRecord = {
        id: `att-master-${Date.now()}`,
        userId: uid,
        assessmentId: assessmentData.metadata.id,
        assessmentTitle: assessmentData.metadata.title,
        overallScore: evaluation.overallScore,
        totalCorrect: evaluation.totalCorrect,
        totalQuestions: evaluation.totalQuestions,
        domainScores: evaluation.domainScores,
        competencyScores: evaluation.competencyScores,
        gaps: evaluation.gaps,
        strengths: evaluation.strengths,
        developmentAreas: evaluation.developmentAreas,
        questionDetails: evaluation.questionDetails,
        completedAt: evaluation.evaluatedAt
      };

      // 2. Persist to Firestore and local persistent store
      await recordAssessmentAttempt(attemptRecord);

      setLatestAttempt(attemptRecord);
      setMode("RESULTS");
    } catch (e) {
      console.error("Assessment submit error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  // Active Runner State
  if (mode === "RUNNING" && assessmentData) {
    return (
      <AssessmentEngine
        assessmentMetadata={assessmentData.metadata}
        questions={assessmentData.questions}
        onSubmit={handleAssessmentSubmit}
        onCancel={() => setMode("LANDING")}
      />
    );
  }

  // Results State
  if (mode === "RESULTS" && latestAttempt) {
    return (
      <AssessmentResults
        attempt={latestAttempt}
        onRetake={() => setMode("RUNNING")}
        onViewSkillGaps={() => setCurrentTab("skill-gaps")}
        onViewLearning={() => setCurrentTab("learning")}
      />
    );
  }

  // Landing State: Overview, competencies covered & launch button
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
          <ClipboardCheck className="w-5 h-5 text-gov-accent" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {t("step1Measure")}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          {t("nationalCadreDiagEngine")}
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
          {t("deterministicBenchmarking")}
        </p>
      </div>

      {/* Latest Attempt Card if available */}
      {latestAttempt && (
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gov-blue text-white flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gov-blue bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-700">
                {t("latestCompletedDiag")}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {t("score")}: {latestAttempt.overallScore}% ({latestAttempt.totalCorrect} {t("of")} {latestAttempt.totalQuestions} {t("correct")})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("completedOn")} {new Date(latestAttempt.completedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowLandingReportModal(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-gov-blue dark:text-sky-400" />
              <span>{t("printPdfReport")}</span>
            </button>
            <button
              onClick={() => setMode("RESULTS")}
              className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <BarChart2 className="w-4 h-4" />
              <span>{t("viewFullBreakdown")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Diagnostic Specification Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {t("officialCertInstrument")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t("mospiNsstaStandard")}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {assessmentData?.metadata?.title ? (isHi ? "आधिकारिक सांख्यिकी संवर्ग दक्षता मूल्यांकन" : assessmentData.metadata.title) : (isHi ? "आधिकारिक सांख्यिकी संवर्ग दक्षता मूल्यांकन" : "Official Statistical Cadre Competency Diagnostic")}
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{assessmentData?.metadata?.durationMinutes || 30} {t("minutes")}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <span>{assessmentData?.questions?.length || 22} {t("questions")}</span>
            </span>
          </div>
        </div>

        {/* Competencies Evaluated Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {t("dimensionsEvaluated")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <strong className="text-gov-blue dark:text-sky-400 block">{t("domainStatistical")}</strong>
              <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• {t("Survey Design")} ({isHi ? "80% लक्ष्य" : "80% target"})</li>
                <li>• {t("Sampling")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
                <li>• {t("Data Quality")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
                <li>• {t("Official Statistics")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <strong className="text-cyan-800 dark:text-cyan-300 block">{t("domainTechnical")}</strong>
              <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• {t("Python for Statistical Analysis")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
                <li>• {t("SQL Databases")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
                <li>• {t("Data Visualization")} ({isHi ? "70% लक्ष्य" : "70% target"})</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <strong className="text-indigo-800 dark:text-indigo-300 block">{t("domainGovernance")}</strong>
              <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• {t("Data Privacy")} ({isHi ? "80% लक्ष्य" : "80% target"})</li>
                <li>• {t("Cybersecurity")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <strong className="text-emerald-800 dark:text-emerald-300 block">{t("domainBehavioural")}</strong>
              <ul className="mt-1 space-y-0.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <li>• {t("Ethics")} ({isHi ? "85% लक्ष्य" : "85% target"})</li>
                <li>• {t("Communication")} ({isHi ? "75% लक्ष्य" : "75% target"})</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Evaluation Engine Notice */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{isHi ? "निश्चित स्कोरिंग प्रोटोकॉल एवं संवर्ग अंतराल एल्गोरिदम" : "Deterministic Scoring Protocol & Cadre Gap Algorithm"}</span>
          </h4>
          <p className="leading-relaxed">
            {isHi
              ? "मूल्यांकन इंजन निश्चित जावास्क्रिप्ट संगणनाओं का उपयोग करके प्रतिक्रियाओं का विश्लेषण करता है:"
              : "The assessment engine evaluates responses using deterministic JavaScript calculations:"
            }
            <code className="block bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-gov-navy dark:text-sky-300 mt-1">
              competencyScore = (correctAnswers / totalQuestionsForCompetency) * 100
              <br />
              gap = requiredLevel - currentLevel (Classified: Meets Requirement, Low, Medium, High, Critical)
            </code>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isHi
              ? "सभी मूल्यांकित स्कोर और कौशल अंतराल स्वचालित रूप से स्टोर किए जाते हैं ताकि आपके डैशबोर्ड रडार और सिफारिशों को तुरंत कैलिब्रेट किया जा सके।"
              : "All evaluated scores and skill gaps are automatically saved to Firestore collections (`assessment_attempts`, `skill_gaps`, `competency_history`) to immediately calibrate your dashboard radar and recommendations."
            }
          </p>
        </div>

        {/* Start Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setMode("RUNNING")}
            className="w-full sm:w-auto px-8 py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <span>{t("startDiagnostic")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Landing State Report Modal */}
      {showLandingReportModal && latestAttempt && (
        <DiagnosticReportModal
          attempt={latestAttempt}
          officerProfile={officerProfile}
          onClose={() => setShowLandingReportModal(false)}
        />
      )}
    </div>
  );
}
