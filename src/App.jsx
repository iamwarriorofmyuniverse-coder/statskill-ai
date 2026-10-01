import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Header from "./components/common/Header.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RoleSelectionModal from "./components/common/RoleSelectionModal.jsx";
import AuthPage from "./pages/AuthPage.jsx";

// Officer Pages
import OfficerDashboard from "./pages/officer/OfficerDashboard.jsx";
import OfficerProfile from "./pages/officer/OfficerProfile.jsx";
import AssessmentPage from "./pages/officer/AssessmentPage.jsx";
import SkillGapsPage from "./pages/officer/SkillGapsPage.jsx";
import RecommendationsPage from "./pages/officer/RecommendationsPage.jsx";
import LearningPage from "./pages/officer/LearningPage.jsx";
import PracticeQuizPage from "./pages/officer/PracticeQuizPage.jsx";
import AIAssistantPage from "./pages/officer/AIAssistantPage.jsx";
import ProgressPage from "./pages/officer/ProgressPage.jsx";

// Trainer Pages
import TrainerDashboard from "./pages/trainer/TrainerDashboard.jsx";
import UploadMaterialPage from "./pages/trainer/UploadMaterialPage.jsx";
import AiMcqGeneratorPage from "./pages/trainer/AiMcqGeneratorPage.jsx";
import QuestionReviewPage from "./pages/trainer/QuestionReviewPage.jsx";
import QuestionBankPage from "./pages/trainer/QuestionBankPage.jsx";
import LearnerPerformancePage from "./pages/trainer/LearnerPerformancePage.jsx";

function MainLayout() {
  const { currentUser, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [practiceCompetencyId, setPracticeCompetencyId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLaunchQuiz = (compId) => {
    setPracticeCompetencyId(compId);
    setCurrentTab("practice-quiz");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue dark:border-sky-400"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Initializing StatSkill AI Cadre System...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or no role selected
  if (!currentUser || !currentUser.role) {
    return (
      <>
        <AuthPage />
        <RoleSelectionModal />
      </>
    );
  }

  const isOfficer = currentUser.role === "OFFICER";
  const isTrainer = currentUser.role === "TRAINER";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {/* Officer Navigation Routing */}
          {isOfficer && (
            <>
              {currentTab === "dashboard" && <OfficerDashboard setCurrentTab={setCurrentTab} onLaunchQuiz={handleLaunchQuiz} />}
              {currentTab === "profile" && <OfficerProfile />}
              {currentTab === "assessment" && <AssessmentPage setCurrentTab={setCurrentTab} />}
              {currentTab === "skill-gaps" && <SkillGapsPage setCurrentTab={setCurrentTab} onLaunchQuiz={handleLaunchQuiz} />}
              {currentTab === "recommendations" && <RecommendationsPage setCurrentTab={setCurrentTab} />}
              {currentTab === "learning" && <LearningPage setCurrentTab={setCurrentTab} />}
              {currentTab === "practice-quiz" && <PracticeQuizPage setCurrentTab={setCurrentTab} initialCompetencyId={practiceCompetencyId} />}
              {currentTab === "ai-assistant" && <AIAssistantPage setCurrentTab={setCurrentTab} onLaunchQuiz={handleLaunchQuiz} />}
              {currentTab === "progress" && <ProgressPage setCurrentTab={setCurrentTab} />}
            </>
          )}

          {/* Trainer Navigation Routing */}
          {isTrainer && (
            <>
              {currentTab === "dashboard" && <TrainerDashboard setCurrentTab={setCurrentTab} />}
              {currentTab === "upload-material" && <UploadMaterialPage setCurrentTab={setCurrentTab} />}
              {currentTab === "ai-mcq-generator" && <AiMcqGeneratorPage setCurrentTab={setCurrentTab} />}
              {currentTab === "question-review" && <QuestionReviewPage setCurrentTab={setCurrentTab} />}
              {currentTab === "question-bank" && <QuestionBankPage />}
              {currentTab === "learner-performance" && <LearnerPerformancePage />}
            </>
          )}
        </main>
      </div>

      <RoleSelectionModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <MainLayout />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
