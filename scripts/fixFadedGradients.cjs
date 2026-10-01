const fs = require('fs');
const path = require('path');

// 1. Fix OfficerDashboard.jsx
const dashPath = path.join(__dirname, '..', 'src', 'pages', 'officer', 'OfficerDashboard.jsx');
let dashContent = fs.readFileSync(dashPath, 'utf8');
dashContent = dashContent.replace(
  '<div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-gov-sky/40 to-transparent pointer-events-none" />',
  '<div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-gov-sky/40 dark:from-sky-950/20 to-transparent pointer-events-none" />'
);
dashContent = dashContent.replace(' MoSPI', '• MoSPI');
dashContent = dashContent.replace('text-gov-blue">{officerProfile?.careerGoal', 'text-gov-blue dark:text-sky-400">{officerProfile?.careerGoal');
fs.writeFileSync(dashPath, dashContent, 'utf8');
console.log('Fixed OfficerDashboard.jsx');

// 2. Fix SkillGapsPage.jsx
const skillGapsPath = path.join(__dirname, '..', 'src', 'pages', 'officer', 'SkillGapsPage.jsx');
let skillContent = fs.readFileSync(skillGapsPath, 'utf8');
skillContent = skillContent.replace(
  'bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 rounded-xl border-2 border-gov-blue/40 p-6 shadow-md space-y-3',
  'bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90 rounded-xl border-2 border-gov-blue/40 dark:border-sky-500/40 p-6 shadow-md space-y-3'
);
fs.writeFileSync(skillGapsPath, skillContent, 'utf8');
console.log('Fixed SkillGapsPage.jsx');

// 3. Fix AssessmentPage.jsx
const assessPath = path.join(__dirname, '..', 'src', 'pages', 'officer', 'AssessmentPage.jsx');
let assessContent = fs.readFileSync(assessPath, 'utf8');
assessContent = assessContent.replace(
  'bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4',
  'bg-gradient-to-r from-blue-50 to-sky-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-blue-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4'
);
fs.writeFileSync(assessPath, assessContent, 'utf8');
console.log('Fixed AssessmentPage.jsx');

// 4. Fix TrainerUpload.jsx
const trainerUploadPath = path.join(__dirname, '..', 'src', 'components', 'trainer', 'TrainerUpload.jsx');
let uploadContent = fs.readFileSync(trainerUploadPath, 'utf8');
uploadContent = uploadContent.replace(
  'bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3',
  'bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3'
);
fs.writeFileSync(trainerUploadPath, uploadContent, 'utf8');
console.log('Fixed TrainerUpload.jsx');
