import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Flag,
  AlertTriangle,
  Send,
  HelpCircle,
  Award,
  Languages,
  Command
} from "lucide-react";
import StatusBadge from "../common/StatusBadge.jsx";

export default function AssessmentEngine({
  assessmentMetadata,
  questions,
  onSubmit,
  onCancel
}) {
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(
    (assessmentMetadata.durationMinutes || 30) * 60
  );

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation & option selection
  useEffect(() => {
    function handleKeyDown(e) {
      if (showConfirmModal) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === "a" || key === "1") {
        handleSelectOption(0);
      } else if (key === "b" || key === "2") {
        handleSelectOption(1);
      } else if (key === "c" || key === "3") {
        handleSelectOption(2);
      } else if (key === "d" || key === "4") {
        handleSelectOption(3);
      } else if (key === "f") {
        handleToggleFlag();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((idx) => Math.max(0, idx - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1));
      } else if (e.key === "Enter") {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1));
        } else {
          setShowConfirmModal(true);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQ, totalQuestions, showConfirmModal]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Format time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Prevent accidental duplicate answers: atomic state update
  const handleSelectOption = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    onSubmit(answers);
  };

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Status Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-gov-blue px-2 py-0.5 rounded border border-blue-200">
              Official Assessment in Progress
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">� {assessmentMetadata.targetRole}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {assessmentMetadata.title}
          </h2>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          {/* Timer */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold ${
            timeLeftSeconds < 300
              ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
              : "bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 underline"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar & Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:border-slate-800 p-4 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Progress: <strong>{answeredCount} of {totalQuestions} Answered</strong> ({progressPercent}%)</span>
          <span className="text-slate-500 dark:text-slate-400">
            {Object.values(flagged).filter(Boolean).length > 0 && (
              <span className="text-amber-600 font-bold mr-2">
                ? {Object.values(flagged).filter(Boolean).length} Flagged
              </span>
            )}
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gov-blue h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Navigator Palette */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 max-w-2xl">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              const isFlagged = flagged[q.id];

              let bg = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700";
              if (isAnswered) bg = "bg-gov-blue dark:bg-sky-700 text-white border-gov-blue dark:border-sky-600 font-bold";
              if (isCurrent) bg = "ring-2 ring-gov-saffron ring-offset-1 dark:ring-offset-slate-900 " + (isAnswered ? "bg-gov-blue dark:bg-sky-700 text-white" : "bg-white dark:bg-slate-800 text-gov-blue dark:text-sky-400 font-black border-gov-blue dark:border-sky-500");

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded text-[11px] border flex items-center justify-center transition-all relative ${bg}`}
                  title={`Question ${idx + 1}: ${q.competencyName}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <span>Finish & Submit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Question Display (One Question at a Time) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        {/* Question Metadata Bar with Bilingual Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              {isHi ? `प्रश्न ${currentIndex + 1}` : `Question ${currentIndex + 1}`}
            </span>
            <StatusBadge type="domain" value={currentQ.domain} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {isHi ? "दक्षता:" : "Competency:"} <strong>{currentQ.competencyName}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick in-quiz Question Language Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded ${language === "en" ? "bg-gov-blue text-white shadow-2xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded ${language === "hi" ? "bg-gov-saffron text-slate-900 font-bold shadow-2xs" : "text-slate-600 dark:text-slate-300 hover:text-slate-900"}`}
              >
                हिं
              </button>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-sky-950 text-gov-blue dark:text-sky-300 border border-blue-200 dark:border-sky-800">
              {currentQ.difficulty}
            </span>

            <button
              type="button"
              onClick={handleToggleFlag}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 border transition-colors cursor-pointer ${
                flagged[currentQ.id]
                  ? "bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{flagged[currentQ.id] ? (isHi ? "चिह्नित" : "Flagged") : (isHi ? "चिह्नित करें" : "Flag")}</span>
            </button>
          </div>
        </div>

        {/* Question Statement (Bilingual) */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
            {isHi && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
          </h3>
        </div>

        {/* Keyboard shortcut banner */}
        <div className="py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Command className="w-3.5 h-3.5 text-gov-blue dark:text-sky-400" />
            <span><strong>Shortcuts:</strong> [A/B/C/D] Select • [←/→] Navigate • [F] Flag • [Enter] Next</span>
          </span>
        </div>

        {/* Options Selection (Radio Cards - Bilingual) */}
        <div className="space-y-3">
          {(isHi && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options).map((opt, optIdx) => {
            const isSelected = answers[currentQ.id] === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-gov-blue bg-blue-50/80 dark:bg-blue-950/40 text-gov-navy dark:text-sky-200 font-bold ring-2 ring-gov-blue/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                    isSelected
                      ? "bg-gov-blue text-white border-gov-blue"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-gov-blue dark:text-sky-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Question Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              currentIndex === 0
                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? "पिछला प्रश्न" : "Previous"}</span>
          </button>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isHi
              ? `प्रश्न ${currentIndex + 1} / ${questions.length}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </span>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>{isHi ? "अगला प्रश्न" : "Next Question"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>{isHi ? "समीक्षा एवं जमा करें" : "Review & Submit"}</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-modal-pop text-slate-900 dark:text-slate-100">
            <div className="bg-gov-navy dark:bg-slate-800 text-white px-6 py-4 border-b-2 border-gov-saffron">
              <h3 className="font-bold text-base">
                {isHi ? "मूल्यांकन परिणाम हेतु जमा करें?" : "Submit Assessment for Calibration?"}
              </h3>
              <p className="text-xs text-slate-300">StatSkill AI Deterministic Scoring Engine</p>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">{isHi ? "उत्तर दिए गए" : "Answered"}</span>
                  <strong className="text-lg text-emerald-900 dark:text-emerald-100">{answeredCount}</strong>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-lg border border-amber-200 dark:border-amber-800">
                  <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block">{isHi ? "अनुत्तरित प्रश्न" : "Unanswered"}</span>
                  <strong className="text-lg text-amber-900 dark:text-amber-100">{unansweredCount}</strong>
                </div>
              </div>

              {unansweredCount > 0 ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    {isHi ? (
                      <>आपके <strong>{unansweredCount} प्रश्न अनुत्तरित</strong> हैं। किसी भी अनुत्तरित प्रश्न को गलत माना जाएगा।</>
                    ) : (
                      <>You have <strong>{unansweredCount} unanswered questions</strong>. Any unanswered questions will be marked incorrect.</>
                    )}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p>{isHi ? "सभी 22 प्रश्नों के उत्तर दर्ज हैं! मूल्यांकन हेतु तैयार।" : "All 22 questions answered! Ready for deterministic capability evaluation."}</p>
                </div>
              )}

              <p className="text-slate-500 dark:text-slate-400">
                {isHi
                  ? "जमा करने पर आपके दक्षता स्कोर, डोमेन विश्लेषण और कौशल अंतराल की गणना की जाएगी।"
                  : "Upon submission, your competency scores, domain breakdowns, and skill gaps will be computed and stored in Firestore."}
              </p>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isHi ? "उत्तर देना जारी रखें" : "Continue Answering"}
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>{isHi ? "प्रस्तुत करें (Submit)" : "Confirm Submission"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
