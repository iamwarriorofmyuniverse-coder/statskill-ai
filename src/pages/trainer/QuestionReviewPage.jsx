import React, { useState, useEffect } from "react";
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
