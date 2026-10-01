import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getRecommendations,
  generateAndSaveRecommendations,
  updateLearningProgress
} from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import CourseRecommendationCard from "../../components/officer/CourseRecommendationCard.jsx";
import CoursePlayerModal from "../../components/officer/CoursePlayerModal.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  Sparkles,
  RefreshCw,
  Filter,
  Award,
  BookOpen,
  Info,
  CheckCircle2,
  Compass,
  Bot
} from "lucide-react";
import { PROTOTYPE_CATALOGUE_DISCLAIMER } from "../../data/igotCoursesCatalogue.js";

export default function RecommendationsPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [recommendations, setRecommendations] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const recs = await getRecommendations(uid);
      setRecommendations(recs || []);
    } catch (e) {
      console.error("Recommendations load error:", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const handleRefreshRecommendations = async () => {
    setRefreshing(true);
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const freshRecs = await generateAndSaveRecommendations(uid);
      setRecommendations(freshRecs || []);
    } catch (e) {
      console.error("Refresh error:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateRoadmap = async (competencyName, currentLvl, targetLvl) => {
    setLoadingRoadmap(true);
    try {
      const roadmap = await api.generateRoadmap({
        competencyName,
        currentLevel: currentLvl,
        targetLevel: targetLvl,
        careerMilestone: officerProfile?.careerGoal || "Senior Statistical Analyst"
      });
      setActiveRoadmap(roadmap);
    } catch (e) {
      console.error("Roadmap generation error:", e);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleEnroll = (rec) => {
    setActiveCourseModal(rec);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  // Filter recommendations
  const filteredRecs = recommendations.filter((r) => {
    const matchesPriority =
      selectedPriority === "ALL" || r.priority === selectedPriority;
    const matchesDomain =
      selectedDomain === "ALL" || r.domain === selectedDomain;
    return matchesPriority && matchesDomain;
  });

  const domains = ["ALL", "Statistical", "Technical", "Digital Governance", "Behavioural & Managerial"];
  const priorities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-accent">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("step3Learn")}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "व्यक्तिगत पाठ्यक्रम अनुशंसा इंजन" : "Personalized Course Recommendation Engine"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "अंतर-आधारित मिलान: 40% कौशल अंतराल + 20% पद प्रासंगिकता + 15% करियर प्रासंगिकता + 10% विभागीय प्राथमिकता + 10% पूर्व अध्ययन + 5% कठिनाई स्तर।"
              : "Deterministic weighted matching: 40% Skill Gap + 20% Role Relevance + 15% Career Relevance + 10% Dept Priority + 10% Previous Learning + 5% Difficulty Fit."
            }
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefreshRecommendations}
            disabled={refreshing}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gov-blue ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing
              ? (isHi ? "अंतरालों का पुनः मूल्यांकन..." : "Re-Evaluating Gaps...")
              : (isHi ? "अनुशंसाएं ताज़ा करें" : "Refresh Recommendations")
            }</span>
          </button>

          <button
            onClick={() => handleGenerateRoadmap("Data Privacy & AI Imputation in Official Statistics", 2.0, 4.0)}
            disabled={loadingRoadmap}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-gov-sky" />
            <span>{loadingRoadmap
              ? (isHi ? "संश्लेषण हो रहा है..." : "Synthesizing...")
              : (isHi ? "8-सप्ताह एआई रोडमैप" : "8-Week AI Roadmap")
            }</span>
          </button>
        </div>
      </div>

      {/* Prototype Catalogue Disclaimer Banner */}
      <div className="bg-blue-50 dark:bg-slate-800 border-2 border-gov-blue/30 dark:border-blue-700/40 rounded-xl p-4 shadow-xs flex items-start space-x-3 text-xs text-blue-950 dark:text-sky-200">
        <Info className="w-5 h-5 text-gov-blue dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-extrabold text-gov-navy dark:text-sky-300 text-sm uppercase tracking-wide">
              {PROTOTYPE_CATALOGUE_DISCLAIMER}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-gov-blue rounded border border-blue-200 dark:bg-blue-950 dark:text-sky-300 dark:border-blue-800">
              {isHi ? "मॉक कैटलॉग (17 मान्यता प्राप्त पाठ्यक्रम)" : "Mock Catalogue (17 Accredited Courses)"}
            </span>
          </div>
          <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
            {isHi
              ? "नीचे सूचीबद्ध पाठ्यक्रम स्मार्ट इंडिया हैकाथॉन समस्या विवरण 26101 हेतु iGOT कर्मयोगी, NSSTA, TPAC और MoSPI आंतरिक प्रशिक्षण रिपॉजिटरी से संकलित हैं।"
              : "Courses listed below are curated from prototype iGOT Karmayogi, NSSTA, TPAC, and MoSPI internal training repositories to demonstrate automated capability gap bridging for Smart India Hackathon Problem Statement 26101."
            }
          </p>
        </div>
      </div>

      {/* AI Roadmap Box */}
      {activeRoadmap && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-gov-blue/50 dark:border-sky-500/50 p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-gov-blue dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isHi ? "जेमिनी इंटरैक्शन एपीआई: 8-सप्ताह अध्ययन रोडमैप" : "Gemini Interactions API: 8-Week Bridging Curriculum Roadmap"}
              </h3>
            </div>
            <button
              onClick={() => setActiveRoadmap(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-300 font-bold"
            >
              ✕ {isHi ? "बंद करें" : "Close"}
            </button>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            {activeRoadmap.roadmap}
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{isHi ? "डोमेन:" : "Domain:"}</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? "bg-gov-blue text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {t(dom, dom)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{isHi ? "प्राथमिकता:" : "Priority:"}</span>
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPriority === p
                  ? "bg-slate-900 text-white font-bold dark:bg-sky-600"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {t(p, p)}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>
              {isHi
                ? `वरीयता प्राप्त अनुशंसाएं (${filteredRecs.length} पाठ्यक्रम मैप किए गए)`
                : `Ranked Recommendations (${filteredRecs.length} Courses Mapped)`
              }
            </span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {isHi
              ? "कमी की गंभीरता अनुसार क्रमबद्ध (अति महत्वपूर्ण → उच्च → मध्यम → अल्प)"
              : "Sorted by Gap Severity (Critical → High → Medium → Low)"
            }
          </span>
        </div>

        {filteredRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecs.map((rec) => (
              <CourseRecommendationCard
                key={rec.id}
                rec={rec}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs">{isHi ? "चयनित फिल्टर से कोई पाठ्यक्रम मेल नहीं खाता।" : "No courses match the selected filters."}</p>
          </div>
        )}
      </div>

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
