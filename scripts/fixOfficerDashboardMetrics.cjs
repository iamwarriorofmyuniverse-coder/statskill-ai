const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'officer', 'OfficerDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace static derivations with real dynamic calculations
content = content.replace(
  `  // Derived metrics from Firestore data
  const highGaps = skillGaps.filter((g) => g.priority === "HIGH");
  const overallScore = 74; // Calculated overall weighted competency score
  const assessedCount = 14;
  const totalCount = 17;
  const avgProgress = learningProgress.length > 0
    ? Math.round(learningProgress.reduce((acc, c) => acc + c.progressPercent, 0) / learningProgress.length)
    : 62;`,
  `  // Derived metrics dynamically from active Firestore / state data
  const highGaps = skillGaps.filter((g) => g.priority === "HIGH" || g.priority === "CRITICAL");
  const overallScore = skillGaps && skillGaps.length > 0
    ? Math.round(skillGaps.reduce((acc, g) => acc + (g.currentLevel !== undefined ? g.currentLevel : 70), 0) / skillGaps.length)
    : 74;
  const assessedCount = skillGaps && skillGaps.length > 0 ? skillGaps.length : 14;
  const totalCount = 17;
  const avgProgress = learningProgress.length > 0
    ? Math.round(learningProgress.reduce((acc, c) => acc + (c.progressPercent || 0), 0) / learningProgress.length)
    : 62;`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('OfficerDashboard.jsx metrics dynamically wired!');
