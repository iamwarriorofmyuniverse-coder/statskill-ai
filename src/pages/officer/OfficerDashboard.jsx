import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import CompetencyRadarChart from "../../components/officer/CompetencyRadarChart.jsx";
import SkillGapCard from "../../components/officer/SkillGapCard.jsx";
import CourseRecommendationCard from "../../components/officer/CourseRecommendationCard.jsx";
import ActivityTimeline from "../../components/officer/ActivityTimeline.jsx";
import CompetencyDetailModal from "../../components/officer/CompetencyDetailModal.jsx";
import CoursePlayerModal from "../../components/officer/CoursePlayerModal.jsx";
import {
  getSkillGaps,
  getRecommendations,
  getRadarCompetencyData,
  getCompetencyHistory,
  getLearningProgress
} from "../../services/firestoreService.js";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers
} from "lucide-react";

export default function OfficerDashboard({ setCurrentTab, onLaunchQuiz }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const { showSuccess } = useToast();
  const isHi = language === "hi";
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [history, setHistory] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeGapModal, setActiveGapModal] = useState(null);
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const [gaps, recs, radar, hist, progress] = await Promise.all([
        getSkillGaps(uid),
        getRecommendations(uid),
        getRadarCompetencyData(uid),
        getCompetencyHistory(uid),
        getLearningProgress(uid)
      ]);
      setSkillGaps(gaps || []);
      setRecommendations(recs || []);
      setRadarData(radar || []);
      setHistory(hist || []);
      setLearningProgress(progress || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  // Derived metrics dynamically from active Firestore / state data
  const [simulatedTargetBoost, setSimulatedTargetBoost] = useState(0); // 0 = standard, 10 = Senior Analyst (+10%), 20 = Director (+20%)

  const highGaps = skillGaps.filter((g) => g.priority === "HIGH" || g.priority === "CRITICAL");
  const baseOverallScore = skillGaps && skillGaps.length > 0
    ? Math.round(skillGaps.reduce((acc, g) => acc + (g.currentLevel !== undefined ? g.currentLevel : 70), 0) / skillGaps.length)
    : 74;
  const overallScore = Math.max(10, Math.min(100, baseOverallScore - Math.round(simulatedTargetBoost * 0.4)));
  const assessedCount = skillGaps && skillGaps.length > 0 ? skillGaps.length : 14;
  const totalCount = 17;
  const avgProgress = learningProgress.length > 0
    ? Math.round(learningProgress.reduce((acc, c) => acc + (c.progressPercent || 0), 0) / learningProgress.length)
    : 62;

  const officerName = officerProfile?.fullName ? t(officerProfile.fullName, officerProfile.fullName) : (isHi ? "अनन्या शर्मा" : "Ananya Sharma");
  const designation = officerProfile?.designation ? t(officerProfile.designation, officerProfile.designation) : t("statisticalOfficer");
  const careerGoal = officerProfile?.careerGoal ? t(officerProfile.careerGoal, officerProfile.careerGoal) : t("seniorAnalyst");

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (isHi) {
      if (hour < 12) return "शुभ प्रभात";
      if (hour < 17) return "शुभ दोपहर";
      return "शुभ संध्या";
    }
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Officer Welcome Banner */}
      <div className="bg-gradient-to-r from-white via-blue-50/40 to-amber-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-gov-sky/30 dark:from-sky-900/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/60 text-gov-saffron dark:text-orange-300">
                {t("officialCadre")}
              </span>
              
              {/* Live Cadre Sync Beacon */}
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{isHi ? "MoSPI एनएसएसओ/एएसआई संवर्ग लाइव सिंक" : "MoSPI NSSO/ASI Cadre Live Sync"}</span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {getGreeting()}, {officerName}!
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t("designationLabel")}: <strong>{designation}</strong> | {t("careerTargetLabel")}: <strong className="text-gov-blue dark:text-sky-400">{careerGoal}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentTab("assessment")}
              className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{t("takeDiagnosticBtn")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Career Target Goal Scrubber (What-If Readiness Slider) */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {isHi ? "संवर्ग लक्ष्य सिमुलेशन (What-If Target Benchmark):" : "Cadre Benchmark Simulation:"}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={() => {
                setSimulatedTargetBoost(0);
                showSuccess(isHi ? "मानक सांख्यिकी अधिकारी संवर्ग स्तर लागू" : "Standard Statistical Officer benchmark active", isHi ? "लक्ष्य अपडेट" : "Target Active");
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                simulatedTargetBoost === 0
                  ? "bg-gov-blue text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              🎯 {isHi ? "वर्तमान पद (75%)" : "Statistical Officer (75%)"}
            </button>

            <button
              onClick={() => {
                setSimulatedTargetBoost(10);
                showSuccess(isHi ? "वरिष्ठ विश्लेषक पदोन्नति बेंचमार्क (+10%) सक्रिय" : "Senior Analyst Target benchmark (+10%) simulated", isHi ? "लक्ष्य अनुकरण" : "Target Simulated");
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                simulatedTargetBoost === 10
                  ? "bg-gov-blue text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              ⭐ {isHi ? "वरिष्ठ विश्लेषक (85%)" : "Senior Analyst (85%)"}
            </button>

            <button
              onClick={() => {
                setSimulatedTargetBoost(20);
                showSuccess(isHi ? "निदेशक/प्रमुख सांख्यिकीविद बेंचमार्क (+20%) सक्रिय" : "Director Cadre benchmark (+20%) simulated", isHi ? "लक्ष्य अनुकरण" : "Target Simulated");
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                simulatedTargetBoost === 20
                  ? "bg-gov-blue text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              🚀 {isHi ? "निदेशक विशेषज्ञ (95%)" : "Director Cadre (95%)"}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("overallCompetencyScore")}
          value={`${overallScore}%`}
          subtitle={t("targetRoleBenchmark")}
          trend={t("trendQuarter")}
          icon={Award}
          color="blue"
          cascadeClass="cascade-1"
        />
        <StatCard
          title={t("assessedCompetencies")}
          value={`${assessedCount} / ${totalCount}`}
          subtitle={t("pendingDiagnostics")}
          icon={CheckCircle2}
          color="emerald"
          cascadeClass="cascade-2"
        />
        <StatCard
          title={t("highPriorityGaps")}
          value={highGaps.length + (simulatedTargetBoost > 0 ? 2 : 0)}
          subtitle={t("requiresImmediateAction")}
          icon={AlertTriangle}
          color="amber"
          cascadeClass="cascade-3"
        />
        <StatCard
          title={t("learningProgress")}
          value={`${avgProgress}%`}
          subtitle={`${learningProgress.length} ${t("coursesActive")}`}
          icon={BookOpen}
          color="purple"
          cascadeClass="cascade-4"
        />
      </div>

      {/* Middle Section: Radar Chart & High Priority Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Radar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-gov-blue" />
                <span>{t("competencyRadarAnalysis")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("radarSubtitle")}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab("skill-gaps")}
              className="text-xs text-gov-blue hover:underline font-semibold"
            >
              {t("viewFullMatrix")}
            </button>
          </div>
          <CompetencyRadarChart data={radarData} />
        </div>

        {/* High Priority Gaps */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span>{t("prioritySkillGapsTitle")}</span>
            </h3>
            <button
              onClick={() => setCurrentTab("skill-gaps")}
              className="text-xs text-gov-blue hover:underline font-semibold"
            >
              {t("viewAll")} ({skillGaps.length})
            </button>
          </div>

          <div className="space-y-3">
            {highGaps.slice(0, 2).map((gap) => (
              <SkillGapCard
                key={gap.id}
                gap={gap}
                onAction={() => setActiveGapModal(gap)}
              />
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-lg text-xs text-blue-900 dark:text-sky-200 flex items-center justify-between">
            <div>
              <span className="font-bold block">{t("needAiDiagnostic")}</span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">{t("generatePsychometric")}</span>
            </div>
            <button
              onClick={() => setCurrentTab("skill-gaps")}
              className="px-3 py-1.5 bg-gov-blue text-white rounded text-xs font-bold hover:bg-gov-navy transition-colors shrink-0"
            >
              {t("diagnoseBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recommended Courses & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Courses */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gov-accent" />
                <span>{t("aiRecommendedLearning")}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("curatedGapsSubtitle")}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab("recommendations")}
              className="text-xs text-gov-blue hover:underline font-semibold"
            >
              {t("exploreCatalog")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec) => (
              <CourseRecommendationCard
                key={rec.id}
                rec={rec}
                onEnroll={() => setActiveCourseModal(rec)}
              />
            ))}
          </div>
        </div>

        {/* Activity & Recent Improvement Timeline */}
        <div className="lg:col-span-4">
          <ActivityTimeline
            history={history}
            learningProgress={learningProgress}
          />
        </div>
      </div>

      {/* Interactive Competency Remediation Modal */}
      <CompetencyDetailModal
        isOpen={Boolean(activeGapModal)}
        onClose={() => setActiveGapModal(null)}
        gap={activeGapModal}
        onLaunchQuiz={(compId) => {
          setActiveGapModal(null);
          if (onLaunchQuiz) onLaunchQuiz(compId);
          else setCurrentTab("practice-quiz");
        }}
        onLaunchCourse={(gap) => {
          setActiveGapModal(null);
          const matchedCourse = recommendations.find(r => r.competencyName === gap.competencyName) || {
            title: gap.competencyName,
            competencyName: gap.competencyName,
            provider: "NSSTA / iGOT Karmayogi",
            domain: gap.domain
          };
          setActiveCourseModal(matchedCourse);
        }}
      />

      {/* Interactive iGOT Course Player Modal */}
      <CoursePlayerModal
        isOpen={Boolean(activeCourseModal)}
        onClose={() => setActiveCourseModal(null)}
        course={activeCourseModal}
        onCourseCompleted={() => {
          loadData();
        }}
      />
    </div>
  );
}
