import React, { useState } from "react";
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
    wordCount: SAMPLE_TRAINING_MATERIALS[0].content.split(/\s+/).length,
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
