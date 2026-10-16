import React, { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Header from "./components/common/Header.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import BottomNav from "./components/common/BottomNav.jsx";
import RoleSelectionModal from "./components/common/RoleSelectionModal.jsx";
import AuthPage from "./pages/AuthPage.jsx";

// Officer Pages (Code-split with React.lazy for instant initial bundle loading)
const OfficerDashboard = lazy(() => import("./pages/officer/OfficerDashboard.jsx"));
const OfficerProfile = lazy(() => import("./pages/officer/OfficerProfile.jsx"));
const AssessmentPage = lazy(() => import("./pages/officer/AssessmentPage.jsx"));
const FlightSimulatorPage = lazy(() => import("./pages/officer/FlightSimulatorPage.jsx"));
const VivaVocePage = lazy(() => import("./pages/officer/VivaVocePage.jsx"));
const SkillGapsPage = lazy(() => import("./pages/officer/SkillGapsPage.jsx"));
const RecommendationsPage = lazy(() => import("./pages/officer/RecommendationsPage.jsx"));
const LearningPage = lazy(() => import("./pages/officer/LearningPage.jsx"));
const PracticeQuizPage = lazy(() => import("./pages/officer/PracticeQuizPage.jsx"));
const AIAssistantPage = lazy(() => import("./pages/officer/AIAssistantPage.jsx"));
const ProgressPage = lazy(() => import("./pages/officer/ProgressPage.jsx"));

// Trainer Pages (Code-split with React.lazy)
const TrainerDashboard = lazy(() => import("./pages/trainer/TrainerDashboard.jsx"));
const NationalWarRoomPage = lazy(() => import("./pages/trainer/NationalWarRoomPage.jsx"));
const UploadMaterialPage = lazy(() => import("./pages/trainer/UploadMaterialPage.jsx"));
const AiMcqGeneratorPage = lazy(() => import("./pages/trainer/AiMcqGeneratorPage.jsx"));
const QuestionReviewPage = lazy(() => import("./pages/trainer/QuestionReviewPage.jsx"));
const QuestionBankPage = lazy(() => import("./pages/trainer/QuestionBankPage.jsx"));
const LearnerPerformancePage = lazy(() => import("./pages/trainer/LearnerPerformancePage.jsx"));

const OFFICER_TABS = [
  "dashboard", "profile", "assessment", "flight-simulator", "viva-voce", "skill-gaps",
  "recommendations", "learning", "practice-quiz", "ai-assistant", "progress"
];

const TRAINER_TABS = [
  "dashboard", "national-war-room", "upload-material", "ai-mcq-generator",
  "question-review", "question-bank", "learner-performance"
];

function getCleanHash() {
  return window.location.hash.replace(/^#\/?/, "").trim();
}

function MainLayout() {
  const { currentUser, loading } = useAuth();
  
  const getInitialTab = (role) => {
    const raw = getCleanHash();
    const allowed = role === "TRAINER" ? TRAINER_TABS : OFFICER_TABS;
    return allowed.includes(raw) ? raw : "dashboard";
  };

  const [currentTab, setCurrentTabState] = useState(() => getInitialTab(currentUser?.role));
  const [practiceCompetencyId, setPracticeCompetencyId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Synchronize tab changes to URL hash and browser history stack
  const setCurrentTab = (newTab, replace = false) => {
    setCurrentTabState(newTab);
    const targetHash = `#${newTab}`;
    if (window.location.hash !== targetHash) {
      if (replace) {
        window.history.replaceState({ tab: newTab }, "", targetHash);
      } else {
        window.history.pushState({ tab: newTab }, "", targetHash);
      }
    }
  };

  // Listen to browser Back/Forward (popstate / hashchange)
  // This prevents browser back button or undo gesture from exiting/closing the app
  useEffect(() => {
    const handleHashNavigation = () => {
      const target = getCleanHash() || "dashboard";
      const allowed = currentUser?.role === "TRAINER" ? TRAINER_TABS : OFFICER_TABS;
      if (allowed.includes(target)) {
        setCurrentTabState(target);
      } else {
        setCurrentTabState("dashboard");
      }
    };

    window.addEventListener("popstate", handleHashNavigation);
    window.addEventListener("hashchange", handleHashNavigation);

    // If starting with no hash, initialize to #dashboard
    if (!getCleanHash()) {
      window.history.replaceState({ tab: "dashboard" }, "", "#dashboard");
    }

    return () => {
      window.removeEventListener("popstate", handleHashNavigation);
      window.removeEventListener("hashchange", handleHashNavigation);
    };
  }, [currentUser?.role]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 w-full overflow-x-hidden">
      <Header toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-x-hidden min-w-0">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto overflow-x-hidden max-w-full pb-20 md:pb-6 w-full min-w-0">
          <Suspense
            fallback={
              <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-gov-blue dark:border-sky-400 border-t-transparent animate-spin" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading section...</span>
              </div>
            }
          >
            {/* Officer Navigation Routing */}
            {isOfficer && (
              <>
                {currentTab === "dashboard" && <OfficerDashboard setCurrentTab={setCurrentTab} onLaunchQuiz={handleLaunchQuiz} />}
                {currentTab === "profile" && <OfficerProfile />}
                {currentTab === "assessment" && <AssessmentPage setCurrentTab={setCurrentTab} />}
                {currentTab === "flight-simulator" && <FlightSimulatorPage />}
                {currentTab === "viva-voce" && <VivaVocePage />}
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
                {currentTab === "national-war-room" && <NationalWarRoomPage />}
                {currentTab === "upload-material" && <UploadMaterialPage setCurrentTab={setCurrentTab} />}
                {currentTab === "ai-mcq-generator" && <AiMcqGeneratorPage setCurrentTab={setCurrentTab} />}
                {currentTab === "question-review" && <QuestionReviewPage setCurrentTab={setCurrentTab} />}
                {currentTab === "question-bank" && <QuestionBankPage />}
                {currentTab === "learner-performance" && <LearnerPerformancePage />}
              </>
            )}
          </Suspense>
        </main>
      </div>

      {/* Native Mobile Bottom Navigation Bar */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

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
