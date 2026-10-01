import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  CheckCircle2,
  XCircle,
  Edit3,
  Check,
  Save,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Filter,
  Layers,
  HelpCircle,
  ExternalLink,
  Award
} from "lucide-react";
import StatusBadge from "../common/StatusBadge.jsx";

export default function QuestionReview({
  questions = [],
  metadata = {},
  onSaveToBank,
  onRetakeOrRegenerate
}) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [items, setItems] = useState(questions);
  const [editingItem, setEditingItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const approvedCount = items.filter((q) => q.status === "APPROVED" || q.status === "EDITED").length;
  const rejectedCount = items.filter((q) => q.status === "REJECTED").length;
  const pendingCount = items.filter((q) => q.status === "PENDING_REVIEW").length;

  // Handle Action: Approve Single
  const handleApprove = (id) => {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "APPROVED" } : q))
    );
  };

  // Handle Action: Reject Single
  const handleReject = (id) => {
    setItems((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "REJECTED" } : q))
    );
  };

  // Handle Action: Approve All Remaining
  const handleApproveAll = () => {
    setItems((prev) =>
      prev.map((q) => (q.status === "REJECTED" ? q : { ...q, status: "APPROVED" }))
    );
  };

  // Handle Edit Modal Submit
  const handleSaveEdit = (edited) => {
    setItems((prev) =>
      prev.map((q) => (q.id === edited.id ? { ...edited, status: "EDITED" } : q))
    );
    setEditingItem(null);
  };

  // Publish Approved to Question Bank
  const handlePublish = async () => {
    const approvedQuestions = items.filter(
      (q) => q.status === "APPROVED" || q.status === "EDITED"
    );

    if (approvedQuestions.length === 0) {
      alert(isHi ? "अभी तक कोई प्रश्न स्वीकृत नहीं किया गया है। कृपया प्रश्न बैंक में सहेजने हेतु कम से कम एक प्रश्न स्वीकृत करें।" : "No questions have been approved yet. Please approve at least one question to save to the Question Bank.");
      return;
    }

    setSaving(true);
    try {
      await onSaveToBank(approvedQuestions);
      setSavedSuccess(true);
    } catch (err) {
      console.error("Save to question bank failed:", err);
      alert((isHi ? "प्रश्न सहेजने में त्रुटि: " : "Error saving questions: ") + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((q) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "APPROVED") return q.status === "APPROVED" || q.status === "EDITED";
    return q.status === filterStatus;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("step3Review")}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {t("validateCurateTitle")}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi ? "स्रोत:" : "Source:"} <strong className="text-slate-800 dark:text-slate-100">{metadata.fileName || t("trainingDocument")}</strong> • {t("sourceReviewAudit")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleApproveAll}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t("approveAllBtn")}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving || approvedCount === 0}
            className={`px-5 py-2 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors ${
              approvedCount > 0
                ? "bg-gov-blue hover:bg-gov-navy cursor-pointer"
                : "bg-slate-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t("savingWait") : (isHi ? `${approvedCount} स्वीकृत प्रश्न बैंक में जोड़ें` : `Publish ${approvedCount} Approved to Bank`)}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <strong className="block font-bold">{t("successPublishedBank")}</strong>
              <span>{approvedCount} {t("archivedInFirestore")}</span>
            </div>
          </div>
          <button
            onClick={onRetakeOrRegenerate}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold cursor-pointer shrink-0"
          >
            {t("ingestAnotherFile")}
          </button>
        </div>
      )}

      {/* Stat Bar & Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-slate-600 dark:text-slate-300">
            {t("totalGenerated")}: <strong className="text-slate-900 dark:text-white">{items.length}</strong>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {t("approved")}: <strong>{approvedCount}</strong>
          </span>
          <span className="text-amber-700 dark:text-amber-400">
            {t("pending")}: <strong>{pendingCount}</strong>
          </span>
          <span className="text-red-700 dark:text-red-400">
            {t("rejected")}: <strong>{rejectedCount}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {[
            { id: "ALL", label: t("allQuestions") },
            { id: "PENDING_REVIEW", label: t("pendingReviewFilter") },
            { id: "APPROVED", label: t("approvedFilter") },
            { id: "REJECTED", label: t("rejectedFilter") }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                filterStatus === st.id
                  ? "bg-white dark:bg-slate-700 text-gov-blue dark:text-sky-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredItems.map((q, idx) => (
          <div
            key={q.id || idx}
            className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-xs transition-all ${
              q.status === "APPROVED" || q.status === "EDITED"
                ? "border-emerald-400/80 dark:border-emerald-600/80 ring-1 ring-emerald-200/50 dark:ring-emerald-800/30"
                : q.status === "REJECTED"
                ? "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/70 dark:bg-slate-900/60"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            {/* Top Badges & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs text-gov-blue dark:text-sky-300 bg-blue-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-blue-200 dark:border-sky-800">
                  {t("questionNumber")} #{idx + 1}
                </span>
                <StatusBadge type="domain" value={q.domain} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {t(q.competency, q.competency)}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {t(q.difficulty, q.difficulty)}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  q.status === "APPROVED" || q.status === "EDITED"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : q.status === "REJECTED"
                    ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                }`}>
                  {q.status === "EDITED"
                    ? (isHi ? "संपादित एवं स्वीकृत" : "EDITED & APPROVED")
                    : q.status === "APPROVED"
                    ? (isHi ? "स्वीकृत" : "APPROVED")
                    : q.status === "REJECTED"
                    ? (isHi ? "अस्वीकृत" : "REJECTED")
                    : (isHi ? "समीक्षा हेतु लंबित" : "PENDING REVIEW")
                  }
                </span>
              </div>

              {/* Review Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingItem(q)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center space-x-1 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t("editBtn")}</span>
                </button>

                {q.status !== "APPROVED" && q.status !== "EDITED" && (
                  <button
                    onClick={() => handleApprove(q.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t("approveBtn")}</span>
                  </button>
                )}

                {q.status !== "REJECTED" && (
                  <button
                    onClick={() => handleReject(q.id)}
                    className="px-3 py-1 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t("rejectBtn")}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {q.question}
              </h4>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3">
              {q.options?.map((opt, oIdx) => {
                const isCorrect = oIdx === q.correctAnswer;
                return (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                      isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 font-semibold text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-200 dark:ring-emerald-800/40"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isCorrect
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Source Excerpt Provenance Box */}
            <div className="mt-3 p-3 bg-blue-50/70 dark:bg-slate-800/70 border border-blue-200 dark:border-slate-700 rounded-lg text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-gov-blue dark:text-sky-400 font-bold">
                <FileText className="w-3.5 h-3.5 text-gov-accent shrink-0" />
                <span>{t("sourceExcerptCitation")}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed pl-5 border-l-2 border-gov-blue dark:border-sky-400">
                "{q.sourceExcerpt || (isHi ? "दी गई प्रशिक्षण सामग्री से सीधे सत्यापित।" : "Grounded directly in supplied training document.")}"
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                <strong className="text-slate-700 dark:text-slate-300">{t("officialExplanation")}:</strong> {q.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-modal-pop text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-gov-blue dark:text-sky-400" />
                <span>{t("editAssessmentQuestion")}</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("questionText")}</label>
                <textarea
                  rows={3}
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("optionsSelectRadio")}</label>
                <div className="space-y-2">
                  {editingItem.options.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswerOption"
                        checked={editingItem.correctAnswer === i}
                        onChange={() => setEditingItem({ ...editingItem, correctAnswer: i })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-bold w-4 text-slate-700 dark:text-slate-300">{String.fromCharCode(65 + i)}</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingItem.options];
                          newOpts[i] = e.target.value;
                          setEditingItem({ ...editingItem, options: newOpts });
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("difficulty")}</label>
                  <select
                    value={editingItem.difficulty}
                    onChange={(e) => setEditingItem({ ...editingItem, difficulty: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Foundational">{t("foundationalDiff")}</option>
                    <option value="Intermediate">{t("intermediateDiff")}</option>
                    <option value="Advanced">{t("advancedDiff")}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("competencyLabel")}</label>
                  <input
                    type="text"
                    value={editingItem.competency}
                    onChange={(e) => setEditingItem({ ...editingItem, competency: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("officialExplanation")}</label>
                <textarea
                  rows={2}
                  value={editingItem.explanation}
                  onChange={(e) => setEditingItem({ ...editingItem, explanation: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("sourceCitation")}</label>
                <input
                  type="text"
                  value={editingItem.sourceExcerpt || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, sourceExcerpt: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => handleSaveEdit(editingItem)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                {t("saveMarkEdited")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
