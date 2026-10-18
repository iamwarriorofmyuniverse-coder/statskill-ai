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
  getLearningProgress,
  getInitialSkillGaps,
  getInitialRecommendations,
  getInitialRadarData,
  getInitialCompetencyHistory,
  getInitialLearningProgress
} from "../../services/firestoreService.js";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Flame,
  Zap,
  Trophy,
  BrainCircuit,
  Compass,
  Binary,
  Mic,
  Globe2,
  FileCheck2,
  Terminal
} from "lucide-react";
import IrtAnalyticsModal from "../../components/officer/IrtAnalyticsModal.jsx";

export default function OfficerDashboard({ setCurrentTab, onLaunchQuiz }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const { showSuccess } = useToast();
  const isHi = language === "hi";

  // Instant Hydration State: Renders in 0ms with local cache, updates via background SWR
  const [skillGaps, setSkillGaps] = useState(() => getInitialSkillGaps(currentUser?.uid));
  const [recommendations, setRecommendations] = useState(() => getInitialRecommendations(currentUser?.uid));
  const [radarData, setRadarData] = useState(() => getInitialRadarData(currentUser?.uid));
  const [history, setHistory] = useState(() => getInitialCompetencyHistory(currentUser?.uid));
  const [learningProgress, setLearningProgress] = useState(() => getInitialLearningProgress(currentUser?.uid));
  const [loading, setLoading] = useState(false);
  const [mobileSection, setMobileSection] = useState("overview"); // "overview" | "gaps" | "courses"

  // Modals state
  const [activeGapModal, setActiveGapModal] = useState(null);
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [showIrtModal, setShowIrtModal] = useState(false);

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
      if (gaps && gaps.length > 0) setSkillGaps(gaps);
      if (recs && recs.length > 0) setRecommendations(recs);
      if (radar && radar.length > 0) setRadarData(radar);
      if (hist && hist.length > 0) setHistory(hist);
      if (progress && progress.length > 0) setLearningProgress(progress);
    } catch (err) {
      console.warn("Background dashboard data sync error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // Non-blocking background sync
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

  if (loading && skillGaps.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE COMMAND DECK (Hero Intelligence Console)                      */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-gov-navy to-slate-950 text-white border border-slate-700/80 shadow-xl p-5 sm:p-6 transition-all">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Officer Cadre Identity & Status */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>MoSPI SSS/ISS LIVE CADRE</span>
              </span>

              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Level 4 Cadre • 840 XP</span>
              </span>

              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[10px] font-bold">
                <Flame className="w-3 h-3 text-orange-400 fill-orange-400 animate-pulse" />
                <span>7-Day Streak</span>
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                {getGreeting()}, {officerName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center space-x-2">
                <span>{designation}</span>
                <span className="text-slate-500">•</span>
                <span>Target: <strong className="text-sky-300 font-bold">{careerGoal}</strong></span>
              </p>
            </div>

            {/* Target Role Benchmark Scrubber */}
            <div className="flex items-center space-x-2 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Benchmark:</span>
              <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] font-semibold">
                <button
                  onClick={() => {
                    setSimulatedTargetBoost(0);
                    showSuccess(isHi ? "मानक सांख्यिकी अधिकारी संवर्ग स्तर लागू" : "Standard Statistical Officer benchmark active", isHi ? "लक्ष्य अपडेट" : "Target Active");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    simulatedTargetBoost === 0
                      ? "bg-sky-500 text-white font-bold shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🎯 Current (75%)
                </button>
                <button
                  onClick={() => {
                    setSimulatedTargetBoost(10);
                    showSuccess(isHi ? "वरिष्ठ विश्लेषक पदोन्नति बेंचमार्क (+10%) सक्रिय" : "Senior Analyst Target benchmark (+10%) simulated", isHi ? "लक्ष्य अनुकरण" : "Target Simulated");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    simulatedTargetBoost === 10
                      ? "bg-sky-500 text-white font-bold shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  ⭐ Sr Analyst (85%)
                </button>
                <button
                  onClick={() => {
                    setSimulatedTargetBoost(20);
                    showSuccess(isHi ? "निदेशक/प्रमुख सांख्यिकीविद बेंचमार्क (+20%) सक्रिय" : "Director Cadre benchmark (+20%) simulated", isHi ? "लक्ष्य अनुकरण" : "Target Simulated");
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    simulatedTargetBoost === 20
                      ? "bg-sky-500 text-white font-bold shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🚀 Director (95%)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Circular Competency Radial Gauge & Diagnostic Action */}
          <div className="flex items-center justify-between sm:justify-end space-x-5 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${overallScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg font-black text-white font-mono leading-none">
                    {overallScore}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
                    Score
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block">Cadre Readiness</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% this quarter</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {assessedCount} of {totalCount} verified
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentTab("assessment")}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-sky-500/25 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span>{t("takeDiagnosticBtn")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FLAGSHIP CADRE SIMULATION DECK (3 Distinct High-Impact Cards)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Flight Simulator */}
        <div
          onClick={() => setCurrentTab("flight-simulator")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-4 sm:p-5 border border-blue-500/30 hover:border-sky-400 shadow-md hover:shadow-sky-500/10 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Data Forensics
              </span>
              <Binary className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
              {isHi ? "सर्वेक्षण माइक्रोडाटा फ्लाइट सिम्युलेटर" : "Survey Microdata Flight Simulator"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "NSSO व PLFS माइक्रोडाटा में फर्जीवाड़ा, प्रतिचयन विषमता और DPDP 2023 गोपनीयता उल्लंघनों की लाइव फोरेंसिक जांच करें।"
                : "Audit live synthetic NSSO & PLFS microdata for sampling skew, fabrications, and DPDP Act 2023 PII breaches."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-300 font-bold">
            <span>{isHi ? "सिमुलेटर लॉन्च करें →" : "Launch Simulator Lab →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">NSSTA Sandbox</span>
          </div>
        </div>

        {/* Card 2: AI Oral Viva-Voce */}
        <div
          onClick={() => setCurrentTab("viva-voce")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 sm:p-5 border border-indigo-500/30 hover:border-indigo-400 shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Voice AI Board
              </span>
              <Mic className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              {isHi ? "एआई कैडर मौखिक बोर्ड परीक्षा (Viva-Voce)" : "AI Cadre Viva-Voce Board Exam"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "UPSC/NSSTA बोर्ड साक्षात्कार परिदृश्य: परीक्षक का प्रश्न सुनें, बोलकर उत्तर दें और रीयल-टाइम अंक प्राप्त करें।"
                : "UPSC/NSSTA Oral Board Simulation: Listen to audio prompts, speak your field strategy, and get instant statutory grading."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-bold">
            <span>{isHi ? "मौखिक साक्षात्कार शुरू करें →" : "Start Oral Interview →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">Speech Evaluation</span>
          </div>
        </div>

        {/* Card 3: Deep-Tech Architecture & Psychometrics */}
        <div
          onClick={() => setCurrentTab("engineering")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 p-4 sm:p-5 border border-emerald-500/30 hover:border-emerald-400 shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Applied Systems & Math
              </span>
              <Terminal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              {isHi ? "डीप-टेक सिस्टम आर्किटेक्चर एवं आईआरटी" : "Deep-Tech Specs & 2PL IRT Engine"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "मुख्य तकनीकी विनिर्देश: 2PL IRT क्षमता मॉडल (θ = +1.84), ऑफलाइन CRDT सिंक, 768-D वेक्टर्स एवं C4 इकोनॉमिक्स।"
                : "Hard-core systems specs: 2PL IRT latent ability (θ = +1.84), offline CRDT sync, 768-D vector search & C4 unit economics."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300 font-bold">
            <span>{isHi ? "सिस्टम कॉकपिट खोलें →" : "Open Systems Specs →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">C4 / CRDT / IRT</span>
          </div>
        </div>
      </div>

      {/* Metric Cards - Horizontal Swipeable Carousel on Mobile, Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-2 w-full max-w-full snap-x snap-mandatory no-scrollbar">
        <div className="min-w-[190px] sm:min-w-0 snap-start flex-1 shrink-0">
          <StatCard
            title={t("overallCompetencyScore")}
            value={`${overallScore}%`}
            subtitle={t("targetRoleBenchmark")}
            trend={t("trendQuarter")}
            icon={Award}
            color="blue"
            cascadeClass="cascade-1"
          />
        </div>
        <div className="min-w-[190px] sm:min-w-0 snap-start flex-1 shrink-0">
          <StatCard
            title={t("assessedCompetencies")}
            value={`${assessedCount} / ${totalCount}`}
            subtitle={t("pendingDiagnostics")}
            icon={CheckCircle2}
            color="emerald"
            cascadeClass="cascade-2"
          />
        </div>
        <div className="min-w-[190px] sm:min-w-0 snap-start flex-1 shrink-0">
          <StatCard
            title={t("highPriorityGaps")}
            value={highGaps.length + (simulatedTargetBoost > 0 ? 2 : 0)}
            subtitle={t("requiresImmediateAction")}
            icon={AlertTriangle}
            color="amber"
            cascadeClass="cascade-3"
          />
        </div>
        <div className="min-w-[190px] sm:min-w-0 snap-start flex-1 shrink-0">
          <StatCard
            title={t("learningProgress")}
            value={`${avgProgress}%`}
            subtitle={`${learningProgress.length} ${t("coursesActive")}`}
            icon={BookOpen}
            color="purple"
            cascadeClass="cascade-4"
          />
        </div>
      </div>

      {/* Universal Executive Segment Filter Switcher - Eliminates Endless Scrolling on Both Web & Mobile */}
      <div className="flex items-center p-1 bg-slate-200/90 dark:bg-slate-800 rounded-xl text-xs font-bold shadow-xs max-w-2xl w-full">
        <button
          onClick={() => setMobileSection("overview")}
          className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
            mobileSection === "overview"
              ? "bg-white dark:bg-slate-900 text-gov-blue dark:text-sky-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          📊 {isHi ? "रडार चार्ट एवं टाइमलाइन" : "Radar & Timeline"}
        </button>
        <button
          onClick={() => setMobileSection("gaps")}
          className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
            mobileSection === "gaps"
              ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          ⚠️ {isHi ? "प्राथमिकता गैप्स" : "Priority Gaps"} ({highGaps.length})
        </button>
        <button
          onClick={() => setMobileSection("courses")}
          className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
            mobileSection === "courses"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          📚 {isHi ? "अनुशंसित कोर्स" : "iGOT Courses"} ({recommendations.length})
        </button>
        <button
          onClick={() => setMobileSection("all")}
          className={`hidden sm:block px-3 py-2 text-center rounded-lg transition-all cursor-pointer ${
            mobileSection === "all"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          🔍 {isHi ? "सभी" : "All Stacked"}
        </button>
      </div>

      {/* Middle & Bottom Sections: Switchable with Zero-Scroll */}
      <div className="space-y-5">
        {/* Radar Chart & Activity */}
        <div className={`${mobileSection === "overview" || mobileSection === "all" ? "block" : "hidden"} space-y-4 animate-in fade-in duration-200`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-gov-blue" />
                    <span>{t("competencyRadarAnalysis")}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
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

            <div className="lg:col-span-5">
              <ActivityTimeline
                history={history}
                learningProgress={learningProgress}
              />
            </div>
          </div>
        </div>

        {/* High Priority Gaps */}
        <div className={`${mobileSection === "gaps" || mobileSection === "all" ? "block" : "hidden"} animate-in fade-in duration-200`}>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {highGaps.slice(0, 4).map((gap) => (
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

        {/* Recommended Courses */}
        <div className={`${mobileSection === "courses" || mobileSection === "all" ? "block" : "hidden"} animate-in fade-in duration-200`}>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-gov-accent" />
                  <span>{t("aiRecommendedLearning")}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.slice(0, 4).map((rec) => (
                <CourseRecommendationCard
                  key={rec.id}
                  rec={rec}
                  onEnroll={() => setActiveCourseModal(rec)}
                />
              ))}
            </div>
          </div>
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

      {/* 2PL Item Response Theory (IRT) Bayesian Psychometric Modal */}
      <IrtAnalyticsModal
        isOpen={showIrtModal}
        onClose={() => setShowIrtModal(false)}
        currentTheta={1.84}
      />
    </div>
  );
}
