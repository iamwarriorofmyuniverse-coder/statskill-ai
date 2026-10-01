import { recordQuizAttempt, getQuizAttempts, getSkillGaps, getRecommendations, getCompetencyHistory } from "../src/services/firestoreService.js";

console.log("=================================================================");
console.log(" STATSKILL AI - LEARNER PRACTICE QUIZ & RECALIBRATION LOOP TEST");
console.log("=================================================================\n");

async function runQuizFlowTest() {
  const userId = "officer_ananya_001";
  const competencyId = "comp-tech-01"; // Python
  const competencyName = "Python";
  const domain = "Technical";
  const previousScore = 42;

  console.log("1. INITIAL OFFICER STATE:");
  console.log(`- Officer: ${userId}`);
  console.log(`- Target Competency: ${competencyName} (${competencyId})`);
  console.log(`- Previous Competency Score (Before): ${previousScore}%`);
  console.log(`- Required Cadre Standard: 75%`);
  console.log(`- Initial Gap: ${75 - previousScore} points (High Priority)\n`);

  // 2. Simulate Practice Quiz Submission (e.g. 4 out of 5 correct = 80%)
  console.log("2. SIMULATING QUIZ SUBMISSION (4/5 CORRECT = 80%):");
  const quizScore = 80;
  const totalQuestions = 5;
  const correctCount = 4;

  // Formula: newScore = (previousScore * 0.6) + (quizScore * 0.4), max 100
  const expectedNewScore = Math.min(100, Math.round((previousScore * 0.6) + (quizScore * 0.4)));
  const expectedImprovement = expectedNewScore - previousScore;
  console.log(`- Formula: (${previousScore} * 0.6) + (${quizScore} * 0.4) = ${expectedNewScore}%`);
  console.log(`- Expected Net Improvement: +${expectedImprovement}%`);

  if (expectedNewScore !== 57 || expectedImprovement !== 15) {
    throw new Error(`Formula check failed! Expected 57% and +15%, got ${expectedNewScore}%`);
  }
  console.log("✓ Deterministic calculation formula verified.\n");

  // 3. Record Quiz Attempt in Firestore and local store
  console.log("3. RECORDING QUIZ ATTEMPT & TRIGGERING STATE RECALIBRATION:");
  const attemptPayload = {
    id: `quiz-test-${Date.now()}`,
    userId,
    competencyId,
    competencyName,
    domain,
    previousScore,
    quizScore,
    newScore: expectedNewScore,
    improvement: expectedImprovement,
    correctCount,
    totalQuestions,
    questionResults: [
      { question: "Q1", isCorrect: true, explanation: "Valid" },
      { question: "Q2", isCorrect: true, explanation: "Valid" },
      { question: "Q3", isCorrect: true, explanation: "Valid" },
      { question: "Q4", isCorrect: true, explanation: "Valid" },
      { question: "Q5", isCorrect: false, explanation: "Missed" }
    ]
  };

  const recorded = await recordQuizAttempt(attemptPayload);
  console.log(`- Recorded Quiz Attempt ID: ${recorded.id}`);
  console.log(`- Saved New Score: ${recorded.newScore}%`);

  // 4. Verify Quiz Attempts Retrieval
  const attempts = await getQuizAttempts(userId);
  console.log(`- Total Quiz Attempts in Store: ${attempts.length}`);
  if (attempts.length === 0) throw new Error("Quiz attempt was not saved!");
  console.log("✓ Quiz attempt persisted and retrieved successfully.\n");

  // 5. Verify Competency History
  console.log("5. VERIFYING COMPETENCY HISTORY TIMELINE:");
  const history = await getCompetencyHistory(userId);
  const latestHist = history[0];
  console.log(`- Latest History Entry: ${latestHist.competencyName} | Change: ${latestHist.change} | Source: ${latestHist.source}`);
  console.log(`- Calibration Note: "${latestHist.improvement}"`);
  if (!latestHist || latestHist.scoreAfter !== 57) {
    throw new Error("Competency history not properly updated!");
  }
  console.log("✓ Competency history timeline entry verified.\n");

  // 6. Verify Updated Skill Gaps
  console.log("6. VERIFYING SKILL GAP RECALIBRATION:");
  const gaps = await getSkillGaps(userId);
  const pythonGap = gaps.find(g => g.competencyId === competencyId || g.competencyName === "Python");
  console.log(`- Updated Python Gap: Current=${pythonGap?.currentLevel}%, Target=${pythonGap?.targetLevel}%, GapMagnitude=${pythonGap?.gapMagnitude}, Priority=${pythonGap?.priority}`);
  
  if (pythonGap?.currentLevel !== 57 || pythonGap?.gapMagnitude !== 18) {
    throw new Error(`Expected Python gap to be 18 points (level 57%), got ${pythonGap?.gapMagnitude} (level ${pythonGap?.currentLevel}%)`);
  }
  console.log("✓ Skill gap successfully reduced from 33 points to 18 points!\n");

  // 7. Verify Automatic Recommendation Engine Regeneration
  console.log("7. VERIFYING AUTOMATIC COURSE RECOMMENDATION REGENERATION:");
  const recs = await getRecommendations(userId);
  console.log(`- Total Recommendations in Store: ${recs.length}`);
  const pythonRec = recs.find(r => r.competencyId === competencyId || r.competencyName === "Python");
  console.log(`- Python Course Recommendation: "${pythonRec?.title}"`);
  console.log(`  Current Competency displayed in Course Card: ${pythonRec?.currentCompetency}%`);
  console.log(`  Updated Gap displayed in Course Card: ${pythonRec?.gap} pts`);
  console.log(`  Updated Match Score: ${pythonRec?.recommendationScore}%`);
  console.log(`  Updated Reason: "${pythonRec?.reason}"`);

  if (pythonRec?.currentCompetency !== 57 || pythonRec?.gap !== 18) {
    throw new Error(`Recommendation did not auto-update to 57% current level! Got: ${pythonRec?.currentCompetency}%`);
  }
  console.log("✓ Course Recommendations automatically recalibrated and synced!\n");

  console.log("=================================================================");
  console.log(" ✓ COMPLETE CORE LOOP: LEARN → REASSESS → UPDATE → RECOMMEND");
  console.log(" ✓ ALL QUIZ ENGINE & RECALIBRATION TESTS PASSED 100%!");
  console.log("=================================================================\n");
}

runQuizFlowTest().catch(err => {
  console.error("Quiz Flow Test Error:", err);
  process.exit(1);
});
