import os

# 1. ActivityTimeline.jsx
activity_timeline = """import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { TrendingUp, BookOpen, CheckCircle2, Clock } from "lucide-react";

export default function ActivityTimeline({ history = [], learningProgress = [] }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-gov-blue" />
        <span>{t("activityTimeline")}</span>
      </h3>

      <div className="space-y-4">
        {history.map((item, idx) => {
          const compName = t(item.competencyName, item.competencyName);
          return (
            <div key={item.id || idx} className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {compName} {t("calibration")}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    {item.improvement}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isHi
                    ? `${item.source} द्वारा स्तर ${item.previousScore} से ${item.newScore} में उन्नत`
                    : `Upgraded from Level ${item.previousScore} to ${item.newScore} via ${item.source}`
                  }
                </p>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.assessedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </span>
              </div>
            </div>
          );
        })}

        {learningProgress.slice(0, 2).map((lp, idx) => (
          <div key={lp.id || idx} className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-gov-blue dark:text-sky-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {lp.course?.title || t("enrolledCourse")}
                </p>
                <span className="text-[10px] font-bold text-gov-blue dark:text-sky-400">
                  {lp.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gov-blue dark:bg-sky-500 h-full rounded-full"
                  style={{ width: `${lp.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

with open("src/components/officer/ActivityTimeline.jsx", "w", encoding="utf-8") as f:
    f.write(activity_timeline)
print("Updated ActivityTimeline.jsx")

# 2. CourseRecommendationCard.jsx
course_card = """import React from "react";
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
"""

with open("src/components/officer/CourseRecommendationCard.jsx", "w", encoding="utf-8") as f:
    f.write(course_card)
print("Updated CourseRecommendationCard.jsx")

# 3. SkillGapsPage.jsx
skill_gaps_page = """import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getSkillGaps, getCompetencies } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SkillGapCard from "../../components/officer/SkillGapCard.jsx";
import {
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Filter,
  BrainCircuit,
  Bot,
  ArrowRight
} from "lucide-react";

export default function SkillGapsPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [skillGaps, setSkillGaps] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [gaps, comps] = await Promise.all([
          getSkillGaps(uid),
          getCompetencies()
        ]);
        setSkillGaps(gaps || []);
        setCompetencies(comps || []);
      } catch (e) {
        console.error("Skill gaps load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const handleRequestAiDiagnosis = async () => {
    setLoadingAi(true);
    try {
      const res = await api.diagnoseGaps({
        profile: officerProfile,
        skillGaps,
        targetRole: officerProfile?.careerGoal || "Senior Statistical Analyst"
      });
      setAiDiagnosis(res);
    } catch (err) {
      console.error("AI diagnosis error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const domains = ["ALL", "Statistical", "Technical", "Digital Governance", "Behavioural & Managerial"];

  const filteredGaps = selectedDomain === "ALL"
    ? skillGaps
    : skillGaps.filter((g) => g.domain === selectedDomain);

  const targetRole = officerProfile?.careerGoal ? t(officerProfile.careerGoal, officerProfile.careerGoal) : t("seniorAnalyst");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-orange-600">
            <Target className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("step2Diagnose")}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "दक्षता अंतराल विश्लेषण एवं निदान" : "Competency Gap Analysis & Diagnostics"}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? `लक्ष्य पद ${targetRole} के बेंचमार्क प्रोफाइल के सापेक्ष वर्तमान दक्षता का विस्तृत कमी विश्लेषण।`
              : `Detailed deficiency mapping comparing current capability against the benchmark profile for ${targetRole}.`
            }
          </p>
        </div>

        <button
          onClick={handleRequestAiDiagnosis}
          disabled={loadingAi}
          className="px-4 py-2.5 bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-2 hover:opacity-95 transition-opacity shrink-0"
        >
          <Sparkles className="w-4 h-4 text-gov-sky" />
          <span>{loadingAi
            ? (isHi ? "एआई निदान तैयार हो रहा है..." : "Generating AI Diagnosis...")
            : (isHi ? "जेमिनी एआई निदान चलाएं" : "Run Gemini AI Diagnosis")
          }</span>
        </button>
      </div>

      {/* Gemini AI Diagnostic Modal / Panel */}
      {aiDiagnosis && (
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 rounded-xl border-2 border-gov-blue/40 dark:border-sky-500/40 p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-gov-blue dark:text-sky-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isHi ? "जेमिनी इंटरैक्शन एपीआई: आधिकारिक दक्षता मूल्यांकन" : "Gemini Interactions API: Official Competency Intelligence Assessment"}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-gov-blue border border-blue-200 dark:bg-blue-950 dark:text-sky-300 dark:border-blue-800">
              {isHi ? "स्रोत" : "Source"}: {aiDiagnosis.source}
            </span>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white/80 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            {aiDiagnosis.diagnostic}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setCurrentTab("recommendations")}
              className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <span>{isHi ? "लक्षित अध्ययन पथ देखें" : "View Targeted Learning Paths"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Domain Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
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

      {/* Skill Gap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGaps.map((gap) => (
          <SkillGapCard
            key={gap.id}
            gap={gap}
            onAction={() => setCurrentTab("recommendations")}
          />
        ))}
      </div>

      {/* 4 Domains Overview Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          {isHi ? "राष्ट्रीय सांख्यिकी संवर्ग दक्षता ढांचा (सभी 17 दक्षताएँ)" : "National Statistical Cadre Competency Framework (All 17 Competencies)"}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">{isHi ? "डोमेन" : "Domain"}</th>
                <th className="py-2.5 px-3">{isHi ? "दक्षता" : "Competency"}</th>
                <th className="py-2.5 px-3">{isHi ? "विवरण" : "Description"}</th>
                <th className="py-2.5 px-3 text-center">{isHi ? "मानक स्तर" : "Benchmark Level"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {competencies.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3">
                    <StatusBadge type="domain" value={comp.domain} />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">
                    {t(comp.name, comp.name)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-md">
                    {comp.description}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-gov-blue dark:text-sky-400">
                    {isHi ? `स्तर ${comp.maxLevel} / 5` : `Level ${comp.maxLevel} / 5`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
"""

with open("src/pages/officer/SkillGapsPage.jsx", "w", encoding="utf-8") as f:
    f.write(skill_gaps_page)
print("Updated SkillGapsPage.jsx")

# 4. RecommendationsPage.jsx
recommendations_page = """import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getRecommendations,
  refreshRecommendations,
  updateLearningProgress
} from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import CourseRecommendationCard from "../../components/officer/CourseRecommendationCard.jsx";
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
import { PROTOTYPE_CATALOGUE_DISCLAIMER } from "../../data/prototypeData.js";

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

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const recs = await getRecommendations(uid);
        setRecommendations(recs || []);
      } catch (e) {
        console.error("Recommendations load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const handleRefreshRecommendations = async () => {
    setRefreshing(true);
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const freshRecs = await refreshRecommendations(uid);
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

  const handleEnroll = async (rec) => {
    const uid = currentUser?.uid || "officer_ananya_001";
    await updateLearningProgress(uid, rec.courseId, 10);
    setCurrentTab("learning");
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
    </div>
  );
}
"""

with open("src/pages/officer/RecommendationsPage.jsx", "w", encoding="utf-8") as f:
    f.write(recommendations_page)
print("Updated RecommendationsPage.jsx")

# 5. OfficerProfile.jsx
officer_profile_page = """import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getLatestAssessmentAttempt } from "../../services/firestoreService.js";
import DiagnosticReportModal from "../../components/officer/DiagnosticReportModal.jsx";
import { User, Award, BookOpen, Briefcase, Target, Shield, Check, Save, FileText, Printer } from "lucide-react";

export default function OfficerProfile() {
  const { currentUser, officerProfile, updateProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [fullName, setFullName] = useState(officerProfile?.fullName || "Ananya Sharma");
  const [designation, setDesignation] = useState(officerProfile?.designation || "Statistical Officer");
  const [cadre, setCadre] = useState(officerProfile?.cadre || "Subordinate Statistical Service");
  const [department, setDepartment] = useState(officerProfile?.department || "National Statistical Systems Training Academy (NSSTA)");
  const [careerGoal, setCareerGoal] = useState(officerProfile?.careerGoal || "Senior Statistical Analyst");
  const [saved, setSaved] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState(null);

  useEffect(() => {
    if (officerProfile) {
      setFullName(officerProfile.fullName || "Ananya Sharma");
      setDesignation(officerProfile.designation || "Statistical Officer");
      setCadre(officerProfile.cadre || "Subordinate Statistical Service");
      setDepartment(officerProfile.department || "National Statistical Systems Training Academy (NSSTA)");
      setCareerGoal(officerProfile.careerGoal || "Senior Statistical Analyst");
    }
  }, [officerProfile]);

  useEffect(() => {
    async function loadAttempt() {
      const uid = currentUser?.uid || "officer_ananya_001";
      const att = await getLatestAssessmentAttempt(uid);
      if (att) {
        setLatestAttempt(att);
      }
    }
    loadAttempt();
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      fullName,
      designation,
      cadre,
      department,
      careerGoal
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = t(fullName, fullName);
  const displayDesig = t(designation, designation);
  const displayGoal = t(careerGoal, careerGoal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <User className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "आधिकारिक सांख्यिकी संवर्ग प्रोफाइल" : "Official Statistical Cadre Profile"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "अधिकारी कार्मिक रिकॉर्ड एवं प्रोफाइल" : "Officer Personnel Record & Profile"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "MoSPI अधीनस्थ सांख्यिकी सेवा संवर्ग हेतु योग्यता और सेवा विवरण प्रबंधित करें।"
              : "Manage competency alignment, role milestones, and service particulars for MoSPI Subordinate Statistical Service cadre."
            }
          </p>
        </div>

        {/* Action button to export / print diagnostic report */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-2 hover:opacity-95 transition-opacity shrink-0"
        >
          <FileText className="w-4 h-4 text-gov-sky" />
          <span>{t("exportReport")}</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "व्यक्तिगत एवं सेवा विवरण" : "Personal & Service Details"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "अधिकारी का पूरा नाम" : "Full Name of Officer"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "आधिकारिक ईमेल" : "Official Email Address"}
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || "ananya.sharma@mospi.gov.in"}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "वर्तमान पदनाम" : "Current Designation"}
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue"
                >
                  <option value="Statistical Officer">{t("statisticalOfficer")}</option>
                  <option value="Senior Statistical Analyst">{t("seniorAnalyst")}</option>
                  <option value="Junior Statistical Officer">{t("Junior Statistical Officer", "Junior Statistical Officer")}</option>
                  <option value="Assistant Director">{t("Assistant Director", "Assistant Director")}</option>
                  <option value="Deputy Director">{t("Deputy Director", "Deputy Director")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "करियर मील का पत्थर लक्ष्य" : "Career Milestone Target"}
                </label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue"
                >
                  <option value="Senior Statistical Analyst">{t("seniorAnalyst")}</option>
                  <option value="Assistant Director">{t("Assistant Director", "Assistant Director")}</option>
                  <option value="Deputy Director">{t("Deputy Director", "Deputy Director")}</option>
                  <option value="Director">{t("Director", "Director")}</option>
                  <option value="Director General">{t("Director General", "Director General")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHi ? "संवर्ग / सेवा" : "Cadre / Statistical Service"}
              </label>
              <input
                type="text"
                value={cadre}
                onChange={(e) => setCadre(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHi ? "मंत्रालय / विभाग / प्रभाग" : "Ministry / Department / Division"}
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? "परिवर्तन तुरंत आपकी सिफारिशों और रडार बेंचमार्क को पुनः कैलिब्रेट करेंगे।" : "Changes will immediately recalibrate your recommendations and radar benchmarks."}
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-2 transition-colors"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-white" />}
                <span>{saved ? (isHi ? "परिवर्तन सहेजे गए!" : "Changes Saved!") : t("saveChanges")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cadre Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-gov-navy to-gov-blue rounded-xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded">
                {t("officialCadre")}
              </span>
              <Shield className="w-5 h-5 text-gov-sky" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold">{displayName}</h3>
              <p className="text-xs text-sky-200 mt-0.5">{displayDesig}</p>
            </div>

            <div className="pt-3 border-t border-white/15 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "संवर्ग आईडी" : "Cadre ID"}:</span>
                <span className="font-mono font-bold">SSS-2024-ND-491</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "सत्यापन स्थिति" : "Status"}:</span>
                <span className="text-emerald-300 font-bold">{isHi ? "सत्यापित अधिकारी" : "Active Officer"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "लक्ष्य पद" : "Target Role"}:</span>
                <span className="text-amber-300 font-bold">{displayGoal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isReportOpen && (
        <DiagnosticReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          assessmentAttempt={latestAttempt}
        />
      )}
    </div>
  );
}
"""

with open("src/pages/officer/OfficerProfile.jsx", "w", encoding="utf-8") as f:
    f.write(officer_profile_page)
print("Updated OfficerProfile.jsx")

print("All bilingual updates executed successfully!")
