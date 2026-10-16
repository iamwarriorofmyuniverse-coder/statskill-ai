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
  Layers,
  Flame,
  Zap,
  Trophy,
  BrainCircuit,
  Compass,
  Binary,
  Mic,
  Globe2,
  FileCheck2
} from "lucide-react";
import IrtAnalyticsModal from "../../components/officer/IrtAnalyticsModal.jsx";

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
      <div className="bg-gradient-to-r from-white via-blue-50/40 to-amber-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm relative overflow-hidden transition-all">
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

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 bg-white dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs w-full sm:w-auto">
            <button
              onClick={() => {
                setSimulatedTargetBoost(0);
                showSuccess(isHi ? "मानक सांख्यिकी अधिकारी संवर्ग स्तर लागू" : "Standard Statistical Officer benchmark active", isHi ? "लक्ष्य अपडेट" : "Target Active");
              }}
              className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer text-center whitespace-nowrap ${
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
              className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer text-center whitespace-nowrap ${
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
              className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer text-center whitespace-nowrap ${
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

      {/* Gamified Mobile XP & Streak Strip (Exciting & Interactive) */}
      <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-blue text-white rounded-2xl p-4 shadow-md border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-lg shrink-0">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-xs font-black tracking-wide text-amber-300 uppercase truncate">
                  {isHi ? "स्तर 4 अधिकारी" : "Level 4 Cadre Officer"}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-bold text-sky-200 shrink-0">
                  840 XP
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                {isHi ? "संवर्ग लक्ष्य तैयारी: 74% पूर्ण" : "Target Competency: 74% Ready"}
              </h2>
            </div>
          </div>

          {/* Daily Streak Pill */}
          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 shrink-0">
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              <span className="font-extrabold text-sm text-white">7</span>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-orange-200">
              {isHi ? "दिन स्ट्रीक" : "Streak"}
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-2.5">
          <div className="flex justify-between text-[10px] text-slate-300 mb-1">
            <span>{isHi ? "वरिष्ठ विश्लेषक संवर्ग स्तर की ओर" : "Towards Senior Analyst Promotion"}</span>
            <span className="font-bold text-sky-300">160 XP to Lv 5</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: "74%" }}
            />
          </div>
        </div>

        {/* 1-Tap Quick Action Chips (Swipeable Horizontal Strip) */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setCurrentTab("flight-simulator")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-sm shrink-0 active:scale-95 cursor-pointer ring-1 ring-white/30"
          >
            <Binary className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? "🔬 फ्लाइट सिम्युलेटर (नया)" : "🔬 Flight Simulator (Live)"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("viva-voce")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-sm shrink-0 active:scale-95 cursor-pointer ring-1 ring-white/30"
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? "🎙️ मौखिक बोर्ड परीक्षा" : "🎙️ AI Oral Viva-Voce"}</span>
          </button>

          <button
            onClick={() => setShowIrtModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold shrink-0 active:scale-95 cursor-pointer border border-white/20"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? "मनोमितीय IRT क्षमता (θ)" : "2PL IRT Engine (θ = +1.84)"}</span>
          </button>

          <button
            onClick={() => {
              if (onLaunchQuiz) onLaunchQuiz(null);
              else setCurrentTab("practice-quiz");
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-sm shrink-0 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{isHi ? "3-मिनट प्रश्नोत्तरी (+50 XP)" : "Quick 3-Min Quiz (+50 XP)"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("assessment")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold shrink-0 active:scale-95 cursor-pointer border border-white/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
            <span>{isHi ? "दक्षता निदान (10 प्रश्न)" : "Diagnostic (10 Qs)"}</span>
          </button>

          <button
            onClick={() => setCurrentTab("ai-assistant")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold shrink-0 active:scale-95 cursor-pointer border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? "AI सलाहकार से पूछें" : "Ask AI Advisor"}</span>
          </button>
        </div>
      </div>

      {/* Flagship Innovation Spotlight: What sets StatSkill AI apart from any generic app */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div
          onClick={() => setCurrentTab("flight-simulator")}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-gov-navy to-slate-900 text-white border border-blue-500/30 shadow-md hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Next-Gen Simulation
              </span>
              <Binary className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
              {isHi ? "सर्वेक्षण माइक्रोडाटा फ्लाइट सिम्युलेटर" : "Survey Microdata Flight Simulator"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "केवल बहुविकल्पीय प्रश्न नहीं! वास्तविक NSSO, PLFS एवं DPDP 2023 माइक्रोडाटा में विसंगतियों और पीआईआई लीकेज की फोरेंसिक जांच करें।"
                : "No mere MCQs! Audit live synthetic NSSO & PLFS microdata for sampling skew, fabrications, and DPDP Act 2023 PII breaches."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-300 font-bold">
            <span>{isHi ? "सिमुलेटर लैब खोलें →" : "Launch Simulator Lab →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">NSSTA Sandbox</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab("viva-voce")}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white border border-indigo-500/30 shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Real-Time Voice AI
              </span>
              <Mic className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              {isHi ? "एआई कैडर मौखिक बोर्ड परीक्षा (Viva-Voce)" : "AI Cadre Viva-Voce Board Exam"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "सिविल सेवा साक्षात्कार परिदृश्य! एआई बोर्ड परीक्षक का प्रश्न सुनें, बोलकर उत्तर दें और बहु-आयामी विधिक व सांख्यिकीय स्कोर प्राप्त करें।"
                : "UPSC/NSSTA Oral Board Simulation! Listen to audio prompts, speak your field strategy aloud, and receive real-time statutory & technical grading."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-bold">
            <span>{isHi ? "मौखिक साक्षात्कार शुरू करें →" : "Start Oral Interview →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">Speech Evaluation</span>
          </div>
        </div>

        <div
          onClick={() => setShowIrtModal(true)}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-500/30 shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Psychometric Math
              </span>
              <BrainCircuit className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              {isHi ? "2PL आइटम रिस्पांस थ्योरी (IRT) इंजन" : "2PL Item Response Theory (IRT) Engine"}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHi
                ? "कच्चे प्रतिशत को त्यागें! अनुकूली गुप्त क्षमता (θ), वस्तु कठिनाई (b) और भेदभाव शक्ति (a) के वैज्ञानिक गणितीय मॉडल का निरीक्षण करें।"
                : "Beyond crude percentages! Inspect latent cadre ability (θ = +1.84), item difficulty (b), and Fisher information curves."}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300 font-bold">
            <span>{isHi ? "आईआरटी गणितीय विश्लेषण देखें →" : "Inspect IRT Math Model →"}</span>
            <span className="text-[10px] text-slate-400 font-normal">Bayesian Scoring</span>
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
