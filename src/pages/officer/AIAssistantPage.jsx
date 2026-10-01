import React from "react";
import AILearningAssistant from "../../components/officer/AILearningAssistant.jsx";

export default function AIAssistantPage({ setCurrentTab, onLaunchQuiz }) {
  return (
    <div className="space-y-6">
      <AILearningAssistant setCurrentTab={setCurrentTab} onLaunchQuiz={onLaunchQuiz} />
    </div>
  );
}
