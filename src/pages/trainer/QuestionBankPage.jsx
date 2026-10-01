import React from "react";
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
