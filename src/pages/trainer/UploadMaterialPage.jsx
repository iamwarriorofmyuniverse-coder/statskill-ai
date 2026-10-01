import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getUploadedMaterials, addUploadedMaterial, saveApprovedQuestionsToBank } from "../../services/firestoreService.js";
import TrainerUpload from "../../components/trainer/TrainerUpload.jsx";
import MCQGenerator from "../../components/trainer/MCQGenerator.jsx";
import QuestionReview from "../../components/trainer/QuestionReview.jsx";
import { api } from "../../services/api.js";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Database,
  Sparkles,
  Layers,
  Award
} from "lucide-react";

export default function UploadMaterialPage({ setCurrentTab }) {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [materials, setMaterials] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generationMetadata, setGenerationMetadata] = useState({});
  const [step, setStep] = useState("UPLOAD"); // "UPLOAD" | "GENERATE" | "REVIEW"

  useEffect(() => {
    async function load() {
      try {
        const matList = await getUploadedMaterials();
        setMaterials(matList || []);
      } catch (err) {
        console.error("Failed to load uploaded materials:", err);
      }
    }
    load();
  }, []);

  const handleMaterialReady = async (matData) => {
    setActiveMaterial(matData);
    try {
      await addUploadedMaterial({
        fileName: matData.fileName,
        fileType: matData.fileType,
        uploadedBy: currentUser?.displayName || "Dr. Rajesh Verma",
        domain: matData.domain,
        competency: matData.competency,
        textLength: matData.charCount,
        wordCount: matData.wordCount,
        status: "PROCESSED",
        processingStatus: "COMPLETED"
      });
      const updatedList = await getUploadedMaterials();
      setMaterials(updatedList || []);
    } catch (e) {
      console.warn("Material metadata save error:", e);
    }
    setStep("GENERATE");
  };

  const handleGenerated = (questions, metadata) => {
    setGeneratedQuestions(questions);
    setGenerationMetadata(metadata);
    setStep("REVIEW");
  };

  const handleSaveToBank = async (approvedQuestions) => {
    try {
      await api.saveApprovedQuestions(approvedQuestions, currentUser?.displayName || "Dr. Rajesh Verma");
    } catch (e) {
      await saveApprovedQuestionsToBank(approvedQuestions, currentUser?.displayName || "Dr. Rajesh Verma");
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Navigator Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold">
          <button
            onClick={() => setStep("UPLOAD")}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center space-x-1.5 ${
              step === "UPLOAD"
                ? "bg-gov-blue text-white shadow-xs"
                : "bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{t("step1UploadNav")}</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            onClick={() => activeMaterial && setStep("GENERATE")}
            disabled={!activeMaterial}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              step === "GENERATE"
                ? "bg-gov-blue text-white shadow-xs"
                : activeMaterial
                ? "bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("step2GenerateNav")}</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            onClick={() => generatedQuestions.length > 0 && setStep("REVIEW")}
            disabled={generatedQuestions.length === 0}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              step === "REVIEW"
                ? "bg-gov-blue text-white shadow-xs"
                : generatedQuestions.length > 0
                ? "bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("step3ReviewNav")}</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentTab("question-bank")}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-gov-blue dark:text-sky-400" />
          <span>{isHi ? `प्रश्न बैंक खोलें (${materials.length} सामग्रियां)` : `Open Question Bank (${materials.length} Materials)`}</span>
        </button>
      </div>

      {step === "UPLOAD" && (
        <TrainerUpload onMaterialReady={handleMaterialReady} />
      )}

      {step === "GENERATE" && activeMaterial && (
        <MCQGenerator
          material={activeMaterial}
          onGenerated={handleGenerated}
          onBack={() => setStep("UPLOAD")}
        />
      )}

      {step === "REVIEW" && (
        <QuestionReview
          questions={generatedQuestions}
          metadata={generationMetadata}
          onSaveToBank={handleSaveToBank}
          onRetakeOrRegenerate={() => setStep("UPLOAD")}
        />
      )}
    </div>
  );
}
