import { IGOT_COURSE_CATALOGUE, PROTOTYPE_CATALOGUE_DISCLAIMER } from '../src/data/igotCoursesCatalogue.js';
import { MASTER_ASSESSMENT_QUESTIONS } from '../src/data/assessmentQuestions.js';
import { evaluateAssessment } from '../src/services/assessmentScoring.js';
import { generateCourseRecommendations } from '../src/services/recommendationEngine.js';

console.log('===============================================================');
console.log(' STATSKILL AI - RECOMMENDATION ENGINE END-TO-END PIPELINE TEST');
console.log('===============================================================\n');

// 1. Check Catalogue Requirements
console.log('1. VERIFYING iGOT COURSE CATALOGUE:');
console.log(`- Course Count: ${IGOT_COURSE_CATALOGUE.length} (Requirement: at least 15)`);
if (IGOT_COURSE_CATALOGUE.length < 15) {
  throw new Error(`Catalogue must have at least 15 courses, found ${IGOT_COURSE_CATALOGUE.length}`);
}
console.log(`- Prototype Disclaimer: "${PROTOTYPE_CATALOGUE_DISCLAIMER}"`);
console.log('✓ Course catalogue validated.\n');

// 2. Simulate Officer Assessment Submission
console.log('2. EVALUATING OFFICER ASSESSMENT SUBMISSION:');
// Simulate user missing Python & Sampling questions, but getting Data Privacy & Ethics correct
const userAnswers = {};
MASTER_ASSESSMENT_QUESTIONS.forEach(q => {
  if (q.competencyId === 'comp-tech-01') {
    // Intentionally get Python wrong (triggers Critical gap: 0% vs 75% required = 75pt gap)
    userAnswers[q.id] = (q.correctAnswer + 1) % 4;
  } else if (q.competencyId === 'comp-stat-02') {
    // 50% on Sampling (1 correct, 1 wrong = 50% vs 75% required = 25pt gap => Medium priority)
    if (q.id.endsWith('01')) userAnswers[q.id] = q.correctAnswer;
    else userAnswers[q.id] = (q.correctAnswer + 1) % 4;
  } else {
    // All other competencies 100%
    userAnswers[q.id] = q.correctAnswer;
  }
});

const evaluation = evaluateAssessment(MASTER_ASSESSMENT_QUESTIONS, userAnswers);
console.log(`- Overall Assessment Score: ${evaluation.overallScore}% (${evaluation.totalCorrect}/${evaluation.totalQuestions} correct)`);

const pythonGap = evaluation.gaps.find(g => g.competencyId === 'comp-tech-01');
const samplingGap = evaluation.gaps.find(g => g.competencyId === 'comp-stat-02');
const ethicsGap = evaluation.gaps.find(g => g.competencyId === 'comp-mgt-03');

console.log(`- Python Gap: current=${pythonGap.currentLevel}%, target=${pythonGap.targetLevel}%, gap=${pythonGap.gapMagnitude}, priority=${pythonGap.priority}`);
console.log(`- Sampling Gap: current=${samplingGap.currentLevel}%, target=${samplingGap.targetLevel}%, gap=${samplingGap.gapMagnitude}, priority=${samplingGap.priority}`);
console.log(`- Ethics Gap: current=${ethicsGap.currentLevel}%, target=${ethicsGap.targetLevel}%, gap=${ethicsGap.gapMagnitude}, priority=${ethicsGap.priority}`);

if (pythonGap.priority !== 'CRITICAL') {
  throw new Error(`Expected Python priority to be CRITICAL, got ${pythonGap.priority}`);
}
console.log('✓ Assessment scoring and 5-tier gap classification validated.\n');

// 3. Generate Personalized Recommendations
console.log('3. GENERATING PERSONALIZED COURSE RECOMMENDATIONS:');
const officerProfile = {
  role: 'Statistical Officer',
  department: 'Field Operations Division (FOD)',
  careerGoal: 'Senior Statistical Officer',
};

const recommendations = generateCourseRecommendations({
  skillGaps: evaluation.gaps,
  officerProfile,
  learningProgress: [],
  courseCatalogue: IGOT_COURSE_CATALOGUE
});

console.log(`- Total Recommendations Generated: ${recommendations.length}`);
console.log('\nTop 5 Prioritized Recommendations:');
recommendations.slice(0, 5).forEach((rec, idx) => {
  console.log(`\n  [#${idx + 1}] ${rec.title}`);
  console.log(`      Provider: ${rec.provider} | Duration: ${rec.durationHours} hrs | Difficulty: ${rec.difficulty}`);
  console.log(`      Match Score: ${rec.recommendationScore}% | Priority Tier: ${rec.priority} | Gap Points: ${rec.gap}`);
  console.log(`      Score Breakdown: Gap=${rec.scoreBreakdown.skillGap}, Role=${rec.scoreBreakdown.role}, Career=${rec.scoreBreakdown.career}, Dept=${rec.scoreBreakdown.dept}, Prev=${rec.scoreBreakdown.previousLearning}, Diff=${rec.scoreBreakdown.difficulty}`);
  console.log(`      Why Recommended: "${rec.reason}"`);
});

// 4. Validate Prioritization & Formula
console.log('\n4. VERIFYING PRIORITIZATION RULES:');
const topRec = recommendations[0];
console.log(`- Top Course: "${topRec.title}" addressing competency ${topRec.competencyId} (${topRec.priority})`);

if (topRec.priority !== 'CRITICAL') {
  throw new Error(`Top recommendation should be CRITICAL tier, got ${topRec.priority}`);
}
if (topRec.competencyId !== 'comp-tech-01') {
  throw new Error(`Top recommendation should address Python (comp-tech-01), got ${topRec.competencyId}`);
}
console.log('✓ Top recommendation correctly targets the CRITICAL Python skill gap!');

console.log('\n===============================================================');
console.log(' ✓ ALL RECOMMENDATION ENGINE PIPELINE TESTS PASSED 100%!');
console.log('===============================================================\n');
