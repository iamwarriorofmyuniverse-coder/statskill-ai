import os

# 1. LearningPage.jsx
learning_page = """import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getLearningProgress, updateLearningProgress } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlayCircle,
  Sparkles,
  Send,
  Bot,
  ExternalLink,
  Mic,
  MicOff,
  Info
} from "lucide-react";

export default function LearningPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [learningProgress, setLearningProgress] = useState([]);
  const [advisorQuery, setAdvisorQuery] = useState("");
  const [advisorAnswer, setAdvisorAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState(null);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const prog = await getLearningProgress(uid);
        setLearningProgress(prog || []);
      } catch (e) {
        console.error("Learning progress load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  // Initialize Web Speech API for voice question asking
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHi ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAdvisorQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isHi]);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert(isHi ? "आपका ब्राउज़र ध्वनि पहचान का समर्थन नहीं करता है।" : "Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = isHi ? "hi-IN" : "en-IN";
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleAskAdvisor = async (e) => {
    e.preventDefault();
    if (!advisorQuery.trim()) return;
    setAsking(true);
    try {
      const res = await api.askAdvisor({
        question: advisorQuery,
        officerProfile,
        courseContext: activeCourse ? activeCourse.title : "National Statistical System & Methodology"
      });
      setAdvisorAnswer(res);
    } catch (err) {
      console.error("Advisor ask error:", err);
    } finally {
      setAsking(false);
    }
  };

  const handleUpdateProgress = async (courseId, currentProg) => {
    const newProg = Math.min(100, currentProg + 25);
    const uid = currentUser?.uid || "officer_ananya_001";
    await updateLearningProgress(uid, courseId, newProg);
    const updated = await getLearningProgress(uid);
    setLearningProgress(updated);
  };

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
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("step3Learn")}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "अध्ययन एवं पाठ्यक्रम पोर्टल" : "Learning & Courses Portal"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "MoSPI और iGOT कर्मयोगी मान्यता प्राप्त मॉड्यूल के माध्यम से अपने दक्षता अंतराल को पाटें।"
              : "Bridge your competency gaps through MoSPI and iGOT Karmayogi accredited modules."
            }
          </p>
        </div>

        <button
          onClick={() => setCurrentTab("recommendations")}
          className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <span>{t("exploreCourses")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Enrolled Courses & AI Statistical Tutor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Enrolled Courses */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PlayCircle className="w-4 h-4 text-gov-blue dark:text-sky-400" />
              <span>{isHi ? "नामांकित सक्रिय पाठ्यक्रम" : "Active Enrolled Courses"} ({learningProgress.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {learningProgress.map((item) => {
              const compName = t(item.course?.competencyName, item.course?.competencyName);
              const isDone = item.progressPercent >= 100;
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-xs transition-all ${
                    activeCourse?.id === item.id
                      ? "border-gov-blue dark:border-sky-500 ring-2 ring-gov-blue/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <StatusBadge type="domain" value={item.course?.domain || "Statistical"} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.course?.provider || "MoSPI / NSSTA"}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                        {item.course?.title || "Statistical Methodology"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t("competencyLabel")}: <strong className="text-slate-700 dark:text-slate-300">{compName}</strong>
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-blue-100 text-gov-blue dark:bg-blue-950 dark:text-sky-300"
                    }`}>
                      {isDone ? (isHi ? "पूर्ण" : "COMPLETED") : `${item.progressPercent}%`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDone ? "bg-emerald-500" : "bg-gov-blue dark:bg-sky-500"
                        }`}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveCourse(item.course)}
                      className="text-xs text-gov-blue dark:text-sky-400 font-semibold hover:underline flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isHi ? "एआई सांख्यिकीय ट्यूटर से पूछें" : "Ask AI Tutor on this Topic"}</span>
                    </button>

                    {!isDone && (
                      <button
                        onClick={() => handleUpdateProgress(item.courseId, item.progressPercent)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isHi ? "+25% अध्ययन पूरा करें" : "+25% Progress"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Statistical Tutor & Voice Assistant */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Bot className="w-5 h-5 text-gov-blue dark:text-sky-400" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isHi ? "जेमिनी आधिकारिक सांख्यिकी ट्यूटर" : "Gemini Statistical Tutor"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isHi ? "MoSPI कार्यप्रणाली, PLFS, ASI एवं DPDP 2023 से तुरंत सहायता पाएं" : "Instant guidance on MoSPI standards, PLFS, ASI & DPDP 2023"}
                </p>
              </div>
            </div>

            {/* Voice listening pulse indicator */}
            {isListening && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-900 dark:text-red-300 flex items-center space-x-2 animate-pulse">
                <Mic className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-bold">{t("listening")}</span>
              </div>
            )}

            {/* Active Course Context indicator */}
            {activeCourse && (
              <div className="p-2.5 bg-blue-50/70 dark:bg-slate-800/80 rounded-lg border border-blue-100 dark:border-slate-700 text-xs text-blue-900 dark:text-sky-200 flex items-center justify-between">
                <span>{isHi ? "सक्रिय संदर्भ" : "Context"}: <strong>{activeCourse.title}</strong></span>
                <button
                  onClick={() => setActiveCourse(null)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Answer Display */}
            {advisorAnswer && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center space-x-1.5 text-gov-blue dark:text-sky-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-gov-accent" />
                  <span>{isHi ? "ट्यूटर प्रतिक्रिया" : "Tutor Response"}</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-[11px]">
                  {advisorAnswer.answer}
                </div>
              </div>
            )}

            {/* Input Form with Voice Button */}
            <form onSubmit={handleAskAdvisor} className="space-y-2">
              <div className="relative">
                <textarea
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  placeholder={isHi ? "सांख्यिकीय कार्यप्रणाली, सूत्र अथवा अवधारणा पर प्रश्न पूछें..." : "Ask a question on official methodology, formula, or concept..."}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? t("stopListening") : t("speakQuery")}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isListening
                      ? "bg-red-600 text-white shadow-md animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-gov-blue" />}
                  <span className="text-[11px]">{isListening ? (isHi ? "सुनना रोकें" : "Stop Mic") : (isHi ? "बोलकर पूछें" : "Voice Input")}</span>
                </button>

                <button
                  type="submit"
                  disabled={asking || !advisorQuery.trim()}
                  className="px-4 py-2 bg-gov-blue hover:bg-gov-navy disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <span>{asking ? (isHi ? "सोच रहे हैं..." : "Thinking...") : t("send")}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

with open("src/pages/officer/LearningPage.jsx", "w", encoding="utf-8") as f:
    f.write(learning_page)
print("Updated LearningPage.jsx")

# 2. ProgressPage.jsx
progress_page = """import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getCompetencyHistory, getSkillGaps } from "../../services/firestoreService.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function ProgressPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [history, setHistory] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [hist, gaps] = await Promise.all([
          getCompetencyHistory(uid),
          getSkillGaps(uid)
        ]);
        setHistory(hist || []);
        setSkillGaps(gaps || []);
      } catch (e) {
        console.error("Progress load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const targetRole = officerProfile?.careerGoal ? t(officerProfile.careerGoal, officerProfile.careerGoal) : t("seniorAnalyst");
  const assessedCount = skillGaps && skillGaps.length > 0 ? skillGaps.length : 14;
  const overallScore = skillGaps && skillGaps.length > 0
    ? Math.round(skillGaps.reduce((acc, g) => acc + (g.currentLevel !== undefined ? g.currentLevel : 70), 0) / skillGaps.length)
    : 74;

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
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "दक्षता संवर्धन एवं विकास इतिहास" : "Competency Evolution & Growth History"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "दक्षता संवर्धन एवं करियर मील का पत्थर ट्रैकिंग" : "Competency Evolution & Career Milestone Tracking"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? `समय के साथ अपनी प्रवीणता वृद्धि और लक्ष्य पद ${targetRole} की दिशा में प्रगति का निरीक्षण करें।`
              : `Track your proficiency growth over time towards your target milestone: ${targetRole}.`
            }
          </p>
        </div>

        <button
          onClick={() => setCurrentTab("assessment")}
          className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-2 transition-colors shrink-0"
        >
          <Zap className="w-4 h-4 text-gov-sky" />
          <span>{t("takeDiagnosticBtn")}</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t("overallCompetencyScore")}</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{overallScore}%</h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{t("trendQuarter")}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t("assessedCompetencies")}</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{assessedCount} / 17</h3>
          <span className="text-[11px] text-slate-400">{t("pendingDiagnostics")}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{isHi ? "लक्ष्य संवर्ग मानक" : "Target Milestone Benchmark"}</span>
          <h3 className="text-2xl font-black text-gov-blue dark:text-sky-400 mt-1">85%</h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{targetRole}</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-gov-blue dark:text-sky-400" />
          <span>{isHi ? "दक्षता अंशांकन एवं मूल्यांकन ऑडिट लॉग" : "Competency Calibration & Assessment Audit Log"}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">{isHi ? "दिनांक" : "Date"}</th>
                <th className="py-2.5 px-3">{isHi ? "दक्षता" : "Competency"}</th>
                <th className="py-2.5 px-3">{isHi ? "पूर्व स्तर" : "Previous Level"}</th>
                <th className="py-2.5 px-3">{isHi ? "नया स्तर" : "New Level"}</th>
                <th className="py-2.5 px-3">{isHi ? "सुधार" : "Improvement"}</th>
                <th className="py-2.5 px-3">{isHi ? "सत्यापन स्रोत" : "Verification Source"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {new Date(item.assessedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">
                    {t(item.competencyName, item.competencyName)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {isHi ? `स्तर ${item.previousScore}` : `Level ${item.previousScore}`}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-gov-blue dark:text-sky-400">
                    {isHi ? `स्तर ${item.newScore}` : `Level ${item.newScore}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                      {item.improvement}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {item.source}
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

with open("src/pages/officer/ProgressPage.jsx", "w", encoding="utf-8") as f:
    f.write(progress_page)
print("Updated ProgressPage.jsx")

print("Part 2 updates completed successfully!")
