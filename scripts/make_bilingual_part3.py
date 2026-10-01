import os

# 1. PracticeQuizPage.jsx
practice_quiz = """import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getQuestionBank,
  getSkillGaps,
  recordQuizAttempt
} from "../../services/firestoreService.js";
import { MASTER_ASSESSMENT_QUESTIONS } from "../../data/assessmentQuestions.js";
import { api } from "../../services/api.js";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Target,
  Layers,
  HelpCircle
} from "lucide-react";

export default function PracticeQuizPage({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [step, setStep] = useState("CONFIG"); // "CONFIG" | "RUNNING" | "RESULTS"
  const [skillGaps, setSkillGaps] = useState([]);
  const [selectedCompetencyId, setSelectedCompetencyId] = useState("comp-tech-01");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const gaps = await getSkillGaps(uid);
        setSkillGaps(gaps || []);
      } catch (e) {
        console.error("Practice quiz load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  const handleStartQuiz = () => {
    // Filter master questions by selected competency
    const matched = MASTER_ASSESSMENT_QUESTIONS.filter(
      (q) => q.competencyId === selectedCompetencyId
    );

    // If fewer questions than requested, fallback to any questions
    const pool = matched.length >= numQuestions
      ? matched
      : [...matched, ...MASTER_ASSESSMENT_QUESTIONS.filter((q) => q.competencyId !== selectedCompetencyId)];

    const selected = pool.slice(0, numQuestions);
    setQuizQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setStep("RUNNING");
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      let correctCount = 0;
      const questionBreakdown = quizQuestions.map((q) => {
        const selected = userAnswers[q.id];
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          question: isHi && q.questionHi ? q.questionHi : q.question,
          competencyName: t(q.competencyName, q.competencyName),
          selectedOption: selected,
          correctOption: q.correctAnswer,
          isCorrect,
          explanation: isHi && q.explanationHi ? q.explanationHi : q.explanation
        };
      });

      const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
      const uid = currentUser?.uid || "officer_ananya_001";

      const attemptRecord = {
        userId: uid,
        competencyId: selectedCompetencyId,
        scorePercent,
        totalQuestions: quizQuestions.length,
        correctCount,
        breakdown: questionBreakdown,
        completedAt: new Date().toISOString()
      };

      await recordQuizAttempt(uid, attemptRecord);
      setQuizResult(attemptRecord);
      setStep("RESULTS");
    } catch (e) {
      console.error("Quiz submission error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  // Current Running Question
  const currentQ = quizQuestions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6">
      {/* 1. CONFIG STEP */}
      {step === "CONFIG" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("step4Reassess")}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {isHi ? "अनुकूली अभ्यास प्रश्नोत्तरी एवं स्व-मूल्यांकन" : "Adaptive Practice Quiz & Self-Assessment"}
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                {isHi
                  ? "विशिष्ट सांख्यिकीय कार्यप्रणाली, पायथन, एसक्यूएल, डीपीडीपी 2023 और आधिकारिक प्रणालियों में दक्षता सुधारें।"
                  : "Calibrate and sharpen competencies in Official Statistics, Survey Sampling, Python, SQL, and Data Privacy with instant explanation."
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quiz Configuration Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-gov-blue" />
                <span>{isHi ? "प्रश्नोत्तरी सेटिंग्स चुनें" : "Select Quiz Parameters"}</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "लक्षित दक्षता चुनें" : "Target Competency to Practice"}
                </label>
                <select
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue"
                >
                  <option value="comp-stat-01">{t("Survey Design")}</option>
                  <option value="comp-stat-02">{t("Sampling Methods & Survey Design")}</option>
                  <option value="comp-stat-03">{t("Official Statistics")}</option>
                  <option value="comp-stat-04">{t("Data Quality")}</option>
                  <option value="comp-tech-01">{t("Python for Statistical Analysis")}</option>
                  <option value="comp-tech-02">{t("SQL Databases")}</option>
                  <option value="comp-tech-03">{t("AI/ML")}</option>
                  <option value="comp-tech-04">{t("Data Visualization")}</option>
                  <option value="comp-gov-01">{t("Data Privacy")}</option>
                  <option value="comp-gov-02">{t("Cybersecurity")}</option>
                  <option value="comp-gov-03">{t("Ethics")}</option>
                  <option value="comp-beh-01">{t("Project Mgmt")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "प्रश्नों की संख्या" : "Number of Questions"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumQuestions(num)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        numQuestions === num
                          ? "bg-gov-blue text-white border-gov-blue"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {num} {isHi ? "प्रश्न" : "Questions"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-gov-sky" />
                  <span>{isHi ? "प्रश्नोत्तरी प्रारंभ करें" : "Start Targeted Practice Quiz"}</span>
                </button>
              </div>
            </div>

            {/* Officer Skill Gap Focus Area */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span>{isHi ? "उच्च प्राथमिकता कौशल अंतराल (अनुशंसित)" : "High Priority Skill Gaps (Recommended)"}</span>
              </h3>

              <div className="space-y-2.5">
                {skillGaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.id}
                    onClick={() => setSelectedCompetencyId(gap.competencyId)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCompetencyId === gap.competencyId
                        ? "bg-blue-50/80 dark:bg-slate-800 border-gov-blue"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {t(gap.competencyName, gap.competencyName)}
                      </span>
                      <StatusBadge type="priority" value={gap.priority} />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t("currentLabel")}: {gap.currentLevel}% • {t("targetLabel")}: {gap.targetLevel}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RUNNING STEP */}
      {step === "RUNNING" && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gov-blue dark:text-sky-400 uppercase tracking-wider">
                  {isHi ? `प्रश्न ${currentIndex + 1} / ${quizQuestions.length}` : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t(currentQ.competencyName, currentQ.competencyName)}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                {isHi ? `${answeredCount} उत्तर दिए गए` : `${answeredCount} Answered`}
              </span>
            </div>

            {/* Question Body */}
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {isHi && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {(isHi && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options).map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs font-medium transition-all flex items-start space-x-3 ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 border-gov-blue dark:border-sky-500 text-gov-navy dark:text-sky-200 shadow-xs"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border ${
                      isSelected
                        ? "bg-gov-blue text-white border-gov-blue"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-normal">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg disabled:opacity-30 hover:bg-slate-50 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isHi ? "पिछला" : "Previous"}</span>
              </button>

              {currentIndex < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                  className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                >
                  <span>{isHi ? "अगला" : "Next"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={submitting || answeredCount === 0}
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? (isHi ? "सबमिट हो रहा है..." : "Submitting...") : (isHi ? "प्रश्नोत्तरी सबमिट करें" : "Submit Practice Quiz")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS STEP */}
      {step === "RESULTS" && quizResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
              <Award className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {isHi ? "अभ्यास प्रश्नोत्तरी परिणाम" : "Practice Quiz Performance Result"}
            </h2>

            <div className="text-3xl font-black text-gov-blue dark:text-sky-400">
              {quizResult.scorePercent}%
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? `${quizResult.totalQuestions} में से ${quizResult.correctCount} प्रश्न सही उत्तर दिए गए।`
                : `You correctly answered ${quizResult.correctCount} out of ${quizResult.totalQuestions} questions.`
              }
            </p>

            <div className="flex justify-center space-x-3 pt-3">
              <button
                onClick={() => setStep("CONFIG")}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isHi ? "पुनः अभ्यास करें" : "Practice Again"}</span>
              </button>

              <button
                onClick={() => setCurrentTab("dashboard")}
                className="px-4 py-2 bg-gov-blue text-white text-xs font-bold rounded-lg shadow-xs hover:bg-gov-navy flex items-center space-x-1.5"
              >
                <span>{isHi ? "डैशबोर्ड पर लौटें" : "Return to Dashboard"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              {isHi ? "विस्तृत प्रश्न समीक्षा एवं व्याख्या" : "Detailed Question Review & Explanation"}
            </h3>

            <div className="space-y-4">
              {quizResult.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Q{idx + 1}. {item.question}
                    </span>
                    {item.isCorrect ? (
                      <span className="flex items-center space-x-1 text-emerald-600 font-bold shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isHi ? "सही" : "Correct"}</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-600 font-bold shrink-0">
                        <XCircle className="w-4 h-4" />
                        <span>{isHi ? "गलत" : "Incorrect"}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border border-slate-100 dark:border-slate-700">
                    <strong className="text-gov-blue dark:text-sky-400 block mb-0.5">{isHi ? "आधिकारिक व्याख्या:" : "Official Explanation:"}</strong>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"""

with open("src/pages/officer/PracticeQuizPage.jsx", "w", encoding="utf-8") as f:
    f.write(practice_quiz)
print("Updated PracticeQuizPage.jsx")

# 2. AILearningAssistant.jsx
ai_assistant = """import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { api } from "../../services/api.js";
import {
  getSkillGaps,
  getRecommendations,
  getUploadedMaterials
} from "../../services/firestoreService.js";
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Target,
  GraduationCap,
  ShieldCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  UserCheck,
  Mic,
  MicOff
} from "lucide-react";

export default function AILearningAssistant({ setCurrentTab }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const defaultWelcome = isHi
    ? `नमस्ते, **${officerProfile?.fullName || "सांख्यिकी अधिकारी"}**! मैं आपका **स्टेटस्किल एआई संवर्ग अध्ययन सहायक** हूँ, जो जेमिनी इंटरैक्शन मॉडल द्वारा संचालित है।\\n\\nआपके संवर्ग का विवरण:\\n- **पद एवं विभाग:** ${t(officerProfile?.designation || "सांख्यिकी अधिकारी")}, ${officerProfile?.department || "आधिकारिक सांख्यिकी"}\\n- **मुख्य लक्ष्य:** पहचाने गए कौशल अंतरालों को पाटना, एनएसएसओ/एएसआई/पीएलएफएस कार्यप्रणाली को समझना, और iGOT कर्मयोगी पाठ्यक्रमों की तैयारी।\\n\\nआज आपकी सांख्यिकीय अध्ययन यात्रा में मैं किस प्रकार सहायता कर सकता हूँ?`
    : `Namaste, **${officerProfile?.fullName || currentUser?.displayName || "Statistical Officer"}**! I am your **StatSkill AI Cadre Learning Assistant**, powered by server-side Gemini intelligence.\\n\\nI have loaded your active cadre context:\\n- **Role & Dept:** ${officerProfile?.designation || "Statistical Officer"}, ${officerProfile?.department || "Official Statistics"}\\n- **Core Focus:** Bridging diagnosed skill gaps, explaining statistical survey concepts (NSSO, ASI, PLFS), navigating iGOT Karmayogi courses, and preparing for practice reassessments.\\n\\nHow may I assist your statistical learning journey today?`;

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      content: defaultWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const messagesEndRef = useRef(null);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    async function loadOfficerContext() {
      setLoadingContext(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [gaps, recs, mats] = await Promise.all([
          getSkillGaps(uid),
          getRecommendations(uid),
          getUploadedMaterials()
        ]);
        setSkillGaps(gaps || []);
        setRecommendations(recs || []);
        setMaterials(mats || []);
      } catch (err) {
        console.error("Context load error:", err);
      } finally {
        setLoadingContext(false);
      }
    }
    loadOfficerContext();
  }, [currentUser]);

  // Speech Recognition hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHi ? "hi-IN" : "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== "welcome-msg")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      const response = await api.askAssistantChat({
        question: text,
        chatHistory,
        officerProfile,
        skillGaps,
        recommendations,
        materialsCount: materials.length,
        language: isHi ? "hi" : "en"
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer || (isHi ? "मुझे उत्तर देने में कठिनाई हो रही है।" : "I apologize, but I could not formulate a response at this moment."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingScore: response.groundingScore,
        suggestedActions: response.suggestedActions || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat response error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: isHi
            ? "⚠️ एआई ट्यूटर से कनेक्ट करने में त्रुटि। कृपया पुनः प्रयास करें।"
            : "⚠️ I encountered an error connecting to the AI assistant service. Please retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-msg-reset",
        role: "assistant",
        content: defaultWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
  };

  const quickPrompts = isHi ? [
    { title: "कौशल अंतराल सारांश", query: "मेरे शीर्ष कौशल अंतराल क्या हैं और मुझे पहले किस पर ध्यान देना चाहिए?" },
    { title: "डीपीडीपी अधिनियम 2023", query: "डीपीडीपी अधिनियम 2023 के तहत आधिकारिक सांख्यिकी में माइक्रोडाटा अनामीकरण के प्रमुख नियम क्या हैं?" },
    { title: "पायथन बनाम एसक्यूएल", query: "बड़े एनएसएसओ सर्वेक्षण डेटासेट को फ़िल्टर करने के लिए पायथन पांडा का उपयोग कैसे करें?" }
  ] : [
    { title: "Skill Gap Summary", query: "What are my top skill gaps and what should I focus on first?" },
    { title: "DPDP Act 2023 Rules", query: "Explain microdata anonymization and consent protocols under DPDP Act 2023 for MoSPI." },
    { title: "Python vs SQL in NSSO", query: "How do I use Python Pandas and SQL together to scrub microdata for PLFS rounds?" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <Bot className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "संवर्ग अध्ययन एवं संदर्भ सहायक" : "Cadre Intelligence & Learning Assistant"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "स्टेटस्किल एआई अध्ययन सहायक" : "StatSkill AI Learning Assistant"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "MoSPI दिशानिर्देश, सांख्यिकीय सर्वेक्षण कार्यप्रणाली और अनुशंसित पाठ्यक्रमों पर 24/7 संवादात्मक मार्गदर्शन।"
              : "24/7 conversational assistance grounded in MoSPI guidelines, statistical methodology, and your personalized competency profile."
            }
          </p>
        </div>

        <button
          onClick={clearChat}
          className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isHi ? "चैट साफ़ करें" : "Clear Chat"}</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-gov-blue text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-gov-navy dark:text-sky-300 border border-slate-200 dark:border-slate-700"
              }`}>
                {msg.role === "user" ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-gov-blue text-white"
                  : msg.isError
                  ? "bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-pre-line"
              }`}>
                <div>{msg.content}</div>
                <div className={`text-[10px] mt-1.5 flex items-center justify-end ${
                  msg.role === "user" ? "text-blue-200" : "text-slate-400"
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-gov-blue animate-pulse" />
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                <span className="animate-pulse">{isHi ? "एआई सहायक सोच रहा है..." : "AI Assistant is analyzing official statistical context..."}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-5 py-2 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">{isHi ? "त्वरित विषय:" : "Quick Topics:"}</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.query)}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-full text-[11px] text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors shrink-0"
            >
              {qp.title}
            </button>
          ))}
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="px-5 py-2 bg-red-50 dark:bg-red-950/60 border-t border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-300 flex items-center justify-between animate-pulse">
            <span className="font-bold">{t("listening")}</span>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
            >
              {isHi ? "रोकें" : "Stop"}
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? t("stopListening") : t("speakQuery")}
            className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-600 text-white shadow-md animate-pulse"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-gov-blue" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder={isHi ? "सांख्यिकी, पाठ्यक्रम अथवा करियर संबंधी प्रश्न पूछें..." : "Ask questions about survey design, DPDP Act, Python, SQL, or learning paths..."}
            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputQuery.trim()}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <span>{t("send")}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
"""

with open("src/components/officer/AILearningAssistant.jsx", "w", encoding="utf-8") as f:
    f.write(ai_assistant)
print("Updated AILearningAssistant.jsx")

print("Part 3 completed successfully!")
