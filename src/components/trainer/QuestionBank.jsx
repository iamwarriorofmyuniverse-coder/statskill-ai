import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Database,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit3,
  FileText,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import StatusBadge from "../common/StatusBadge.jsx";
import { getQuestionBank, deleteQuestionBankQuestion } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";

export default function QuestionBank({ onIngestNew }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // First try server API, fallback to firestoreService
      let data = [];
      try {
        const res = await api.getQuestionBank();
        if (res.success && res.questions) {
          data = res.questions;
        }
      } catch (e) {
        console.warn("Server question bank API unavailable, reading from local store:", e);
      }

      if (!data || data.length === 0) {
        data = await getQuestionBank();
      }
      setQuestions(data || []);
    } catch (err) {
      console.error("Failed to load question bank:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this question from the Question Bank?")) return;
    try {
      await api.deleteQuestionBankItem(id);
    } catch (e) {
      await deleteQuestionBankQuestion(id);
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `statskill_question_bank_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter & Search Logic
  const filtered = questions.filter((q) => {
    const matchesDomain = selectedDomain === "ALL" || q.domain === selectedDomain;
    const matchesDiff = selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      q.question.toLowerCase().includes(query) ||
      (q.competency && q.competency.toLowerCase().includes(query)) ||
      (q.topic && q.topic.toLowerCase().includes(query)) ||
      (q.sourceFile && q.sourceFile.toLowerCase().includes(query));

    return matchesDomain && matchesDiff && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <Database className="w-5 h-5 text-gov-accent" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "आधिकारिक मूल्यांकन भंडार" : "Official Assessment Repository"}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {isHi ? `संवर्ग प्रश्न बैंक एवं मूल्यांकन प्रश्न (${questions.length} प्रश्न)` : `Cadre Question Bank & Assessment Items (${questions.length} Items)`}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {t("questionBankSubtitle")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t("exportJson")}</span>
          </button>
          <button
            onClick={onIngestNew}
            className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("ingestNewMaterial")}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t("searchQuestionsPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gov-blue focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t("allDomains")}</option>
            <option value="Statistical">{t("Statistical")} {isHi ? "डोमेन" : "Domain"}</option>
            <option value="Technical">{t("Technical")} {isHi ? "डोमेन" : "Domain"}</option>
            <option value="Digital Governance">{t("Digital Governance")}</option>
            <option value="Behavioural & Managerial">{t("Behavioural & Managerial")}</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t("allDifficulties")}</option>
            <option value="Foundational">{t("foundationalDiff")}</option>
            <option value="Intermediate">{t("intermediateDiff")}</option>
            <option value="Advanced">{t("advancedDiff")}</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Database className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{t("noQuestionsFound")}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t("noQuestionsHint")}
          </p>
          <button
            onClick={onIngestNew}
            className="px-4 py-2 bg-gov-blue text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            {t("uploadMaterialNow")}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:border-gov-blue/50 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[11px] text-gov-blue dark:text-sky-300 bg-blue-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-sky-800">
                      #{idx + 1}
                    </span>
                    <StatusBadge type="domain" value={q.domain} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {t(q.competency, q.competency)}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {t(q.difficulty, q.difficulty)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isHi ? "स्रोत:" : "Source:"} {q.sourceFile || (isHi ? "आधिकारिक दस्तावेज़" : "Official Document")}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      title={isHi ? "प्रश्न हटाएं" : "Delete question"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {q.question}
                  </h4>
                </div>

                {/* Options (visible when expanded or compact preview) */}
                {isExpanded ? (
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${
                              isCorrect
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200"
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Source Excerpt */}
                    {q.sourceExcerpt && (
                      <div className="p-3 bg-blue-50/70 dark:bg-sky-950/50 border border-blue-200 dark:border-sky-800 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-gov-blue dark:text-sky-300 block">{t("sourceExcerptCitation")}</span>
                        <p className="text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed">
                          "{q.sourceExcerpt}"
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                          <strong>{t("officialExplanation")}:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                    <span>{isHi ? "सही विकल्प:" : "Correct Option:"} <strong className="text-emerald-700 dark:text-emerald-400">{String.fromCharCode(65 + (q.correctAnswer || 0))}</strong></span>
                    <button
                      onClick={() => setExpandedId(q.id)}
                      className="text-gov-blue dark:text-sky-400 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      {t("viewOptionsCitation")}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
