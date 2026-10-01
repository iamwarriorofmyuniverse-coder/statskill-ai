import fs from 'fs';

// 1. UploadMaterialPage.jsx
const uploadPage = `import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUploadedMaterials, addUploadedMaterial } from "../../services/firestoreService.js";
import TrainerUpload from "../../components/trainer/TrainerUpload.jsx";
import MCQGenerator from "../../components/trainer/MCQGenerator.jsx";
import QuestionReview from "../../components/trainer/QuestionReview.jsx";
import { saveApprovedQuestionsToBank } from "../../services/firestoreService.js";
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold">
          <button
            onClick={() => setStep("UPLOAD")}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center space-x-1.5 ${
              step === "UPLOAD"
                ? "bg-gov-blue text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>1. Upload & Ingest</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            onClick={() => activeMaterial && setStep("GENERATE")}
            disabled={!activeMaterial}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              step === "GENERATE"
                ? "bg-gov-blue text-white shadow-xs"
                : activeMaterial
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. AI Generation</span>
          </button>

          <span className="text-slate-300">→</span>

          <button
            onClick={() => generatedQuestions.length > 0 && setStep("REVIEW")}
            disabled={generatedQuestions.length === 0}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              step === "REVIEW"
                ? "bg-gov-blue text-white shadow-xs"
                : generatedQuestions.length > 0
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                : "bg-slate-50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Review & Validate</span>
          </button>
        </div>

        <button
          onClick={() => setCurrentTab("question-bank")}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <Database className="w-3.5 h-3.5 text-gov-blue" />
          <span>Open Question Bank ({materials.length} Materials)</span>
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
`;

// 2. AiMcqGeneratorPage.jsx
const generatorPage = `import React, { useState, useEffect } from "react";
import TrainerUpload from "../../components/trainer/TrainerUpload.jsx";
import MCQGenerator from "../../components/trainer/MCQGenerator.jsx";
import QuestionReview from "../../components/trainer/QuestionReview.jsx";
import { saveApprovedQuestionsToBank } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";
import { SAMPLE_TRAINING_MATERIALS } from "../../data/trainerSampleMaterials.js";

export default function AiMcqGeneratorPage({ setCurrentTab }) {
  const [activeMaterial, setActiveMaterial] = useState({
    fileName: SAMPLE_TRAINING_MATERIALS[0].fileName,
    fileType: SAMPLE_TRAINING_MATERIALS[0].fileType,
    text: SAMPLE_TRAINING_MATERIALS[0].content,
    domain: SAMPLE_TRAINING_MATERIALS[0].domain,
    competency: SAMPLE_TRAINING_MATERIALS[0].competency,
    wordCount: SAMPLE_TRAINING_MATERIALS[0].content.split(/\\s+/).length,
    charCount: SAMPLE_TRAINING_MATERIALS[0].content.length
  });

  const [step, setStep] = useState("GENERATE"); // "UPLOAD" | "GENERATE" | "REVIEW"
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generationMetadata, setGenerationMetadata] = useState({});

  const handleMaterialReady = (matData) => {
    setActiveMaterial(matData);
    setStep("GENERATE");
  };

  const handleGenerated = (questions, metadata) => {
    setGeneratedQuestions(questions);
    setGenerationMetadata(metadata);
    setStep("REVIEW");
  };

  const handleSaveToBank = async (approvedQuestions) => {
    try {
      await api.saveApprovedQuestions(approvedQuestions, "Dr. Rajesh Verma");
    } catch (e) {
      await saveApprovedQuestionsToBank(approvedQuestions, "Dr. Rajesh Verma");
    }
  };

  return (
    <div className="space-y-6">
      {step === "UPLOAD" && (
        <TrainerUpload onMaterialReady={handleMaterialReady} />
      )}

      {step === "GENERATE" && (
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
          onRetakeOrRegenerate={() => setStep("GENERATE")}
        />
      )}
    </div>
  );
}
`;

// 3. QuestionReviewPage.jsx
const reviewPage = `import React, { useState, useEffect } from "react";
import QuestionReview from "../../components/trainer/QuestionReview.jsx";
import { getGeneratedQuestions, saveApprovedQuestionsToBank } from "../../services/firestoreService.js";
import { api } from "../../services/api.js";

export default function QuestionReviewPage({ setCurrentTab }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function load() {
      const q = await getGeneratedQuestions();
      setQuestions(q || []);
    }
    load();
  }, []);

  const handleSaveToBank = async (approvedQuestions) => {
    try {
      await api.saveApprovedQuestions(approvedQuestions, "Dr. Rajesh Verma");
    } catch (e) {
      await saveApprovedQuestionsToBank(approvedQuestions, "Dr. Rajesh Verma");
    }
  };

  return (
    <div className="space-y-6">
      <QuestionReview
        questions={questions}
        metadata={{ fileName: "Recent Generated Assessment Queue" }}
        onSaveToBank={handleSaveToBank}
        onRetakeOrRegenerate={() => setCurrentTab("upload-material")}
      />
    </div>
  );
}
`;

// 4. QuestionBankPage.jsx
const bankPage = `import React from "react";
import QuestionBank from "../../components/trainer/QuestionBank.jsx";

export default function QuestionBankPage({ setCurrentTab }) {
  return (
    <div className="space-y-6">
      <QuestionBank
        onIngestNew={() => {
          if (setCurrentTab) setCurrentTab("upload-material");
        }}
      />
    </div>
  );
}
`;

fs.writeFileSync('src/pages/trainer/UploadMaterialPage.jsx', uploadPage, 'utf8');
fs.writeFileSync('src/pages/trainer/AiMcqGeneratorPage.jsx', generatorPage, 'utf8');
fs.writeFileSync('src/pages/trainer/QuestionReviewPage.jsx', reviewPage, 'utf8');
fs.writeFileSync('src/pages/trainer/QuestionBankPage.jsx', bankPage, 'utf8');

console.log('Successfully written all 4 Trainer pages with clean UTF-8.');
