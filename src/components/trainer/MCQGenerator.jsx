import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Sparkles,
  Bot,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  FileText,
  HelpCircle
} from "lucide-react";
import { api } from "../../services/api.js";

export default function MCQGenerator({ material, onGenerated, onBack }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [numQuestions, setNumQuestions] = useState(10);
  const [domainHint, setDomainHint] = useState(material.domain || "Statistical");
  const [competencyHint, setCompetencyHint] = useState(material.competency || "Survey Design");
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    setProgressStep(1);

    try {
      // Step 1: Processing text
      await new Promise((r) => setTimeout(r, 400));
      setProgressStep(2);

      let result = null;

      // If raw file exists and is PDF/DOCX, send via multipart formData; else send JSON payload
      if (material.rawFile && (material.fileType === "pdf" || material.fileType === "docx")) {
        const formData = new FormData();
        formData.append("file", material.rawFile);
        formData.append("numQuestions", numQuestions.toString());
        formData.append("domainHint", domainHint);
        formData.append("competencyHint", competencyHint);
        result = await api.generateMCQsFromFile(formData);
      } else {
        result = await api.generateMCQsFromText({
          text: material.text,
          fileName: material.fileName,
          fileType: material.fileType,
          numQuestions,
          domainHint,
          competencyHint
        });
      }

      setProgressStep(3);
      await new Promise((r) => setTimeout(r, 400));

      if (result && result.success && result.questions) {
        onGenerated(result.questions, result.metadata || {});
      } else {
        throw new Error(result.error || (isHi ? "मूल्यांकन प्रश्न बनाने में विफल।" : "Failed to generate assessment questions."));
      }
    } catch (err) {
      console.error("MCQ generation failed:", err);
      setErrorMsg(err.message || (isHi ? "अपलोड की गई सामग्री से प्रश्न बनाने में विफल।" : "Failed to generate assessment questions from the uploaded material."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <Bot className="w-5 h-5 text-gov-accent" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("step2McqEngine")}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {t("groundedAssessmentGen")}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi ? (
              <><strong>{material.fileName}</strong> {t("strictlyGrounded")}</>
            ) : (
              <>{t("strictlyGrounded")} <strong>{material.fileName}</strong>.</>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {t("changeMaterial")}
          </button>
        </div>
      </div>

      {/* Configuration Box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{t("generationParams")}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {material.wordCount} {t("wordsParsed")} / {material.charCount} {t("charsParsed")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("numQuestionsFormulate")}
            </label>
            <select
              value={numQuestions}
              disabled={loading}
              onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
            >
              <option value={5}>{t("rapidCheck")}</option>
              <option value={10}>{t("standardBatch")}</option>
              <option value={15}>{t("comprehensiveDiag")}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("targetDomainHint")}</label>
            <select
              value={domainHint}
              disabled={loading}
              onChange={(e) => setDomainHint(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
            >
              <option value="Statistical">{t("Statistical")} {isHi ? "डोमेन" : "Domain"}</option>
              <option value="Technical">{t("Technical")} {isHi ? "डोमेन" : "Domain"}</option>
              <option value="Digital Governance">{t("Digital Governance")}</option>
              <option value="Behavioural & Managerial">{t("Behavioural & Managerial")}</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("competencyAlignment")}</label>
            <input
              type="text"
              value={competencyHint}
              disabled={loading}
              onChange={(e) => setCompetencyHint(e.target.value)}
              placeholder={isHi ? "उदा. सर्वेक्षण प्रारूप, प्रतिचयन, डेटा गोपनीयता" : "e.g., Survey Design, Sampling, Data Privacy"}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* AI Prompt Directives & Grounding Assurance */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("strictGroundingGuardrails")}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {isHi ? "एआई मॉडल को सख्त नियमावली दिशानिर्देशों के साथ प्रॉम्प्ट किया गया है:" : "The AI engine is prompted with strict grounding rules:"}
            <code className="block bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 mt-1 font-mono text-[10.5px]">
              "{isHi
                ? "आप प्रदान की गई प्रशिक्षण सामग्री से मूल्यांकन प्रश्न बना रहे हैं। बाहरी ज्ञान का उपयोग न करें। प्रत्येक प्रश्न दी गई सामग्री से उत्तर योग्य होना चाहिए। केवल मान्य संरचित JSON लौटाएं।"
                : "You are generating assessment questions from the supplied training material. Do not use external knowledge unless explicitly requested. Every question must be answerable from the supplied material. Return valid structured JSON only."
              }"
            </code>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t("verifiableTextExcerpt")}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t("zeroInventedFacts")}</span>
            </div>
          </div>
        </div>

        {/* Loading Progress State */}
        {loading && (
          <div className="p-5 bg-blue-50/60 dark:bg-sky-950/60 rounded-xl border border-blue-200 dark:border-sky-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gov-blue dark:text-sky-300 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-gov-accent dark:text-sky-400" />
                <span>{isHi ? `जेमिनी द्वारा ${numQuestions} प्रामाणिक प्रश्न बनाए जा रहे हैं...` : `Generating ${numQuestions} Grounded MCQs via Gemini...`}</span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                {progressStep === 1 && t("chunkingText")}
                {progressStep === 2 && t("runningGeminiApi")}
                {progressStep === 3 && t("verifyingSourceExcerpts")}
              </span>
            </div>

            <div className="w-full bg-blue-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gov-blue dark:bg-sky-500 h-full transition-all duration-500 rounded-full"
                style={{
                  width: progressStep === 1 ? "30%" : progressStep === 2 ? "70%" : "100%"
                }}
              />
            </div>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between text-xs text-red-700 dark:text-red-300">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={handleGenerate}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors cursor-pointer"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* Action Button */}
        {!loading && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              className="px-8 py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gov-sky" />
              <span>{isHi ? `जेमिनी द्वारा ${numQuestions} प्रश्न बनाएं` : `Generate ${numQuestions} Questions with Gemini`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
