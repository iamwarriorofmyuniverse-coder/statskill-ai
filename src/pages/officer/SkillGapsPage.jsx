import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getSkillGaps, getCompetencies, getRecommendations } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import SkillGapCard from "../../components/officer/SkillGapCard.jsx";
import CompetencyDetailModal from "../../components/officer/CompetencyDetailModal.jsx";
import CoursePlayerModal from "../../components/officer/CoursePlayerModal.jsx";
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

export default function SkillGapsPage({ setCurrentTab, onLaunchQuiz }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [skillGaps, setSkillGaps] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [aiDiagnosis, setAiDiagnosis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeGapModal, setActiveGapModal] = useState(null);
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const uid = currentUser?.uid || "officer_ananya_001";
      const [gaps, comps, recs] = await Promise.all([
        getSkillGaps(uid),
        getCompetencies(),
        getRecommendations(uid)
      ]);
      setSkillGaps(gaps || []);
      setCompetencies(comps || []);
      setRecommendations(recs || []);
    } catch (e) {
      console.error("Skill gaps load error:", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

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
            onAction={() => setActiveGapModal(gap)}
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
