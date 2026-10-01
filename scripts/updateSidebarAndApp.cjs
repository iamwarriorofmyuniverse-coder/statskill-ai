const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '..', 'src', 'components', 'common', 'Sidebar.jsx');
const sidebarContent = `import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Target,
  Sparkles,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  UploadCloud,
  Cpu,
  CheckCircle,
  Database,
  Users,
  Shield,
  Layers,
  Bot
} from "lucide-react";

export default function Sidebar({ currentTab, setCurrentTab, mobileOpen, setMobileOpen }) {
  const { currentUser } = useAuth();
  const isOfficer = currentUser?.role === "OFFICER";
  const isTrainer = currentUser?.role === "TRAINER";

  const officerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "profile", label: "Officer Profile", icon: User, badge: null },
    { id: "assessment", label: "Assessment", icon: ClipboardCheck, badge: "MEASURE" },
    { id: "skill-gaps", label: "Skill Gaps", icon: Target, badge: "DIAGNOSE" },
    { id: "recommendations", label: "Recommendations", icon: Sparkles, badge: "AI" },
    { id: "learning", label: "Learning", icon: BookOpen, badge: "LEARN" },
    { id: "practice-quiz", label: "Practice Quiz", icon: BrainCircuit, badge: "REASSESS" },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot, badge: "Gemini" },
    { id: "progress", label: "Progress", icon: TrendingUp, badge: null }
  ];

  const trainerNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "upload-material", label: "Upload Material", icon: UploadCloud, badge: null },
    { id: "ai-mcq-generator", label: "AI MCQ Generator", icon: Cpu, badge: "Gemini" },
    { id: "question-review", label: "Question Review", icon: CheckCircle, badge: "3 Pending" },
    { id: "question-bank", label: "Question Bank", icon: Database, badge: null },
    { id: "learner-performance", label: "Learner Performance", icon: Users, badge: "Cohort" }
  ];

  const items = isOfficer ? officerNavItems : isTrainer ? trainerNavItems : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={\`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 \${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }\`}
      >
        {/* Core Loop Indicator for Officer */}
        {isOfficer && (
          <div className="p-3 m-3 bg-gov-sky/50 rounded-lg border border-gov-sky text-gov-blue text-xs">
            <div className="font-bold flex items-center space-x-1 mb-1">
              <Layers className="w-3.5 h-3.5 text-gov-accent" />
              <span>Competency Growth Loop</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium">
              <span className="bg-white py-0.5 rounded shadow-xs border border-slate-200">1. Measure</span>
              <span className="bg-white py-0.5 rounded shadow-xs border border-slate-200">2. Diagnose</span>
              <span className="bg-white py-0.5 rounded shadow-xs border border-slate-200">3. Learn</span>
              <span className="bg-white py-0.5 rounded shadow-xs border border-slate-200">4. Reassess</span>
            </div>
          </div>
        )}

        {isTrainer && (
          <div className="p-3 m-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
            <div className="font-bold flex items-center space-x-1 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trainer Authority Console</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Authorized evaluation, curriculum curation, and cohort psychometrics.
            </p>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
                className={\`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors \${
                  isActive
                    ? "bg-gov-blue text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }\`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={\`w-5 h-5 \${isActive ? "text-white" : "text-slate-500"}\`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={\`text-[10px] font-bold px-1.5 py-0.5 rounded \${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }\`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Cadre System Info Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">India Official Statistics</span>
          </div>
          <p className="text-[11px] mt-1 text-slate-400">
            NSSO • CSO • State DES • NSSTA
          </p>
        </div>
      </aside>
    </>
  );
}
`;

fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('Sidebar.jsx successfully written');

const appPath = path.join(__dirname, '..', 'src', 'App.jsx');
const appContent = `import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue"></div>
          <p className="text-xs font-semibold text-slate-500">Initializing StatSkill AI Cadre System...</p>
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
              {currentTab === "dashboard" && <OfficerDashboard setCurrentTab={setCurrentTab} />}
              {currentTab === "profile" && <OfficerProfile />}
              {currentTab === "assessment" && <AssessmentPage setCurrentTab={setCurrentTab} />}
              {currentTab === "skill-gaps" && <SkillGapsPage setCurrentTab={setCurrentTab} />}
              {currentTab === "recommendations" && <RecommendationsPage setCurrentTab={setCurrentTab} />}
              {currentTab === "learning" && <LearningPage setCurrentTab={setCurrentTab} />}
              {currentTab === "practice-quiz" && <PracticeQuizPage setCurrentTab={setCurrentTab} />}
              {currentTab === "ai-assistant" && <AIAssistantPage setCurrentTab={setCurrentTab} />}
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
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
`;

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.jsx successfully written');
