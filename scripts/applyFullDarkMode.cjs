const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
  const fullPath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${relativePath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const [target, replacement] of replacements) {
    content = content.replaceAll(target, replacement);
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated: ${relativePath}`);
}

// 1. AuthPage.jsx
const authPagePath = path.join(__dirname, '..', 'src', 'pages', 'AuthPage.jsx');
let authContent = fs.readFileSync(authPagePath, 'utf8');
if (!authContent.includes('ThemeToggle')) {
  authContent = `import ThemeToggle from "../components/common/ThemeToggle.jsx";\n` + authContent;
}
authContent = authContent.replace(
  '<div className="min-h-screen bg-slate-50 flex flex-col justify-between">',
  '<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">'
);
authContent = authContent.replace(
  '<header className="bg-gov-navy text-white border-b-4 border-gov-saffron py-4 px-6 shadow-md">',
  '<header className="bg-gov-navy dark:bg-slate-900 text-white border-b-4 border-gov-saffron py-4 px-6 shadow-md transition-colors duration-200">\n        <div className="max-w-7xl mx-auto flex items-center justify-between">'
);
// Make sure ThemeToggle is in the header of AuthPage
if (!authContent.includes('<ThemeToggle />') && authContent.includes('Government of India')) {
  authContent = authContent.replace(
    '</div>\n    </header>',
    '  <ThemeToggle />\n        </div>\n      </div>\n    </header>'
  );
}
// Card backgrounds
authContent = authContent.replace(/bg-white rounded-2xl border border-slate-200 p-8 shadow-xl/g, 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl');
authContent = authContent.replace(/bg-white p-3 rounded-lg border border-slate-200/g, 'bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800');
authContent = authContent.replace(/bg-slate-50 rounded-xl border border-slate-100/g, 'bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800');
authContent = authContent.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
authContent = authContent.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
authContent = authContent.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
authContent = authContent.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
authContent = authContent.replace(/bg-slate-50 p-3 rounded-lg border border-slate-200/g, 'bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800');
authContent = authContent.replace(/bg-white border-t border-slate-200/g, 'bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800');
authContent = authContent.replace(/border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/g, 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700');

fs.writeFileSync(authPagePath, authContent, 'utf8');
console.log('Updated: src/pages/AuthPage.jsx');

// 2. RoleSelectionModal.jsx
replaceInFile('src/components/common/RoleSelectionModal.jsx', [
  ['bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200', 'bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'],
  ['bg-gov-navy text-white px-6 py-4 border-b-2 border-gov-saffron', 'bg-gov-navy dark:bg-slate-800 text-white px-6 py-4 border-b-2 border-gov-saffron'],
  ['border-slate-200 hover:border-slate-300', 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'],
  ['border-gov-blue bg-blue-50/70 ring-2 ring-gov-blue/20', 'border-gov-blue dark:border-sky-500 bg-blue-50/70 dark:bg-slate-800 ring-2 ring-gov-blue/20'],
  ['border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20', 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-slate-800 ring-2 ring-emerald-600/20'],
  ['bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs', 'bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs'],
  ['border-slate-300 rounded-md focus:ring-1 focus:ring-gov-blue bg-white text-xs', 'border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs'],
  ['text-slate-900', 'text-slate-900 dark:text-white'],
  ['text-slate-600', 'text-slate-600 dark:text-slate-300'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['text-slate-700', 'text-slate-700 dark:text-slate-200'],
  ['bg-emerald-50/60 p-4 rounded-lg border border-emerald-200', 'bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800'],
  ['text-emerald-950', 'text-emerald-950 dark:text-emerald-200'],
  ['border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-600 text-sm bg-white', 'border-emerald-300 dark:border-emerald-700 rounded-md focus:ring-1 focus:ring-emerald-600 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white']
]);

// 3. CompetencyRadarChart.jsx
replaceInFile('src/components/officer/CompetencyRadarChart.jsx', [
  ['stroke="#cbd5e1"', 'stroke="#64748b" strokeOpacity={0.5}'],
  ['tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}', 'tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}'],
  ['backgroundColor: "#ffffff",\n              borderColor: "#e2e8f0",', 'backgroundColor: "rgba(15, 23, 42, 0.95)",\n              borderColor: "#334155",\n              color: "#f8fafc",']
]);

// 4. ActivityTimeline.jsx
replaceInFile('src/components/officer/ActivityTimeline.jsx', [
  ['bg-white rounded-xl border border-slate-200 p-5 shadow-xs', 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs'],
  ['text-slate-900', 'text-slate-900 dark:text-white'],
  ['text-slate-800', 'text-slate-800 dark:text-slate-200'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['border-slate-100', 'border-slate-100 dark:border-slate-800'],
  ['bg-slate-100 h-1.5', 'bg-slate-100 dark:bg-slate-800 h-1.5'],
  ['bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200', 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800'],
  ['bg-blue-50 text-gov-blue flex items-center justify-center shrink-0 border border-blue-200', 'bg-blue-50 dark:bg-blue-950/60 text-gov-blue dark:text-sky-300 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800']
]);

// 5. OfficerDashboard.jsx
replaceInFile('src/pages/officer/OfficerDashboard.jsx', [
  ['bg-white rounded-xl border border-slate-200', 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'],
  ['bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900', 'bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-lg text-xs text-blue-900 dark:text-sky-200'],
  ['text-slate-900', 'text-slate-900 dark:text-white'],
  ['text-slate-700', 'text-slate-700 dark:text-slate-200'],
  ['text-slate-600', 'text-slate-600 dark:text-slate-300'],
  ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
  ['bg-orange-50 px-2 py-0.5 rounded border border-orange-200', 'bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800/60 text-gov-saffron dark:text-orange-300']
]);

// 6. Generic card updates across all Officer and Trainer Pages
const pagesToUpdate = [
  'src/pages/officer/AssessmentPage.jsx',
  'src/components/officer/AssessmentEngine.jsx',
  'src/components/officer/AssessmentResults.jsx',
  'src/pages/officer/SkillGapsPage.jsx',
  'src/pages/officer/RecommendationsPage.jsx',
  'src/pages/officer/LearningPage.jsx',
  'src/pages/officer/PracticeQuizPage.jsx',
  'src/components/officer/AILearningAssistant.jsx',
  'src/pages/officer/ProgressPage.jsx',
  'src/pages/officer/OfficerProfile.jsx',
  'src/pages/trainer/TrainerDashboard.jsx',
  'src/pages/trainer/UploadMaterialPage.jsx',
  'src/pages/trainer/AiMcqGeneratorPage.jsx',
  'src/pages/trainer/QuestionReviewPage.jsx',
  'src/pages/trainer/QuestionBankPage.jsx',
  'src/pages/trainer/LearnerPerformancePage.jsx',
  'src/components/trainer/TrainerUpload.jsx',
  'src/components/trainer/MCQGenerator.jsx',
  'src/components/trainer/QuestionReview.jsx',
  'src/components/trainer/QuestionBank.jsx'
];

for (const p of pagesToUpdate) {
  replaceInFile(p, [
    ['bg-white rounded-xl border border-slate-200', 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800'],
    ['bg-white rounded-2xl border border-slate-200', 'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800'],
    ['bg-slate-50 p-', 'bg-slate-50 dark:bg-slate-800/60 p-'],
    ['bg-slate-50 rounded-', 'bg-slate-50 dark:bg-slate-800/60 rounded-'],
    ['border-slate-200', 'border-slate-200 dark:border-slate-800'],
    ['border-slate-100', 'border-slate-100 dark:border-slate-800/80'],
    ['text-slate-900', 'text-slate-900 dark:text-white'],
    ['text-slate-800', 'text-slate-800 dark:text-slate-100'],
    ['text-slate-700', 'text-slate-700 dark:text-slate-300'],
    ['text-slate-600', 'text-slate-600 dark:text-slate-300'],
    ['text-slate-500', 'text-slate-500 dark:text-slate-400'],
    ['border-slate-300 rounded-', 'border-slate-300 dark:border-slate-700 rounded-'],
    ['bg-white border', 'bg-white dark:bg-slate-900 border']
  ]);
}

console.log('All dark mode styles applied successfully!');
