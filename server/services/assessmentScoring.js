/**
 * StatSkill AI - Deterministic Competency Assessment Scoring Engine
 *
 * Implements strict deterministic calculation for SIH Problem Statement 26101.
 * DO NOT use AI or heuristics for score calculations.
 */

export const STATISTICAL_OFFICER_REQUIREMENTS = {
  "comp-stat-01": { name: "Survey Design", domain: "Statistical", requiredLevel: 80 },
  "comp-stat-02": { name: "Sampling", domain: "Statistical", requiredLevel: 75 },
  "comp-stat-03": { name: "Data Quality", domain: "Statistical", requiredLevel: 75 },
  "comp-stat-04": { name: "Official Statistics", domain: "Statistical", requiredLevel: 75 },
  "comp-tech-01": { name: "Python", domain: "Technical", requiredLevel: 75 },
  "comp-tech-02": { name: "SQL", domain: "Technical", requiredLevel: 75 },
  "comp-tech-03": { name: "Data Visualization", domain: "Technical", requiredLevel: 70 },
  "comp-gov-01": { name: "Data Privacy", domain: "Digital Governance", requiredLevel: 80 },
  "comp-gov-02": { name: "Cybersecurity", domain: "Digital Governance", requiredLevel: 75 },
  "comp-mgt-03": { name: "Ethics", domain: "Behavioural & Managerial", requiredLevel: 85 },
  "comp-mgt-01": { name: "Communication", domain: "Behavioural & Managerial", requiredLevel: 75 }
};

/**
 * Classify gap according to prompt specification:
 * gap <= 0 = Meets Requirement
 * 1-10 = Low
 * 11-25 = Medium
 * 26-50 = High
 * 51+ = Critical
 */
export function classifyGap(gap) {
  if (gap <= 0) return { priority: "MEETS_REQUIREMENT", label: "Meets Requirement", severity: 0 };
  if (gap <= 10) return { priority: "LOW", label: "Low Priority", severity: 1 };
  if (gap <= 25) return { priority: "MEDIUM", label: "Medium Priority", severity: 2 };
  if (gap <= 50) return { priority: "HIGH", label: "High Priority", severity: 3 };
  return { priority: "CRITICAL", label: "Critical Priority", severity: 4 };
}

/**
 * Deterministic scoring algorithm
 * @param {Array} questions - All questions in the assessment
 * @param {Object} answers - User answers mapped by questionId { [questionId]: optionIndex }
 * @returns {Object} Full score breakdown, competency scores, domain scores, gaps, strengths, development areas
 */
export function evaluateAssessment(questions, answers = {}) {
  let totalCorrect = 0;
  const questionDetails = [];

  // Track per-competency stats
  const competencyStats = {};
  // Track per-domain stats
  const domainStats = {};

  questions.forEach((q) => {
    const userAnswer = answers[q.id] !== undefined ? answers[q.id] : null;
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) totalCorrect++;

    questionDetails.push({
      questionId: q.id,
      competencyId: q.competencyId,
      domain: q.domain,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      weight: q.weight || 1.0
    });

    // Competency bucket
    if (!competencyStats[q.competencyId]) {
      competencyStats[q.competencyId] = {
        competencyId: q.competencyId,
        competencyName: q.competencyName,
        domain: q.domain,
        totalQuestions: 0,
        correctAnswers: 0
      };
    }
    competencyStats[q.competencyId].totalQuestions += 1;
    if (isCorrect) {
      competencyStats[q.competencyId].correctAnswers += 1;
    }

    // Domain bucket
    if (!domainStats[q.domain]) {
      domainStats[q.domain] = {
        domain: q.domain,
        totalQuestions: 0,
        correctAnswers: 0
      };
    }
    domainStats[q.domain].totalQuestions += 1;
    if (isCorrect) {
      domainStats[q.domain].correctAnswers += 1;
    }
  });

  // Calculate Overall Score
  const totalQuestions = questions.length;
  const overallScore = totalQuestions > 0
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  // Calculate Domain Scores
  const domainScores = {};
  Object.keys(domainStats).forEach((d) => {
    const ds = domainStats[d];
    domainScores[d] = ds.totalQuestions > 0
      ? Math.round((ds.correctAnswers / ds.totalQuestions) * 100)
      : 0;
  });

  // Calculate Competency Scores and Skill Gaps
  const competencyScores = {};
  const calculatedGaps = [];
  const strengths = [];
  const developmentAreas = [];

  Object.keys(competencyStats).forEach((compId) => {
    const cs = competencyStats[compId];
    // competencyScore = correctAnswers / totalQuestionsForCompetency * 100
    const score = cs.totalQuestions > 0
      ? Math.round((cs.correctAnswers / cs.totalQuestions) * 100)
      : 0;

    competencyScores[compId] = score;

    const requirement = STATISTICAL_OFFICER_REQUIREMENTS[compId] || {
      name: cs.competencyName,
      domain: cs.domain,
      requiredLevel: 75
    };

    // gap = requiredLevel - currentLevel
    const gap = requirement.requiredLevel - score;
    const classification = classifyGap(gap);

    const gapRecord = {
      id: `gap-${compId}-${Date.now()}`,
      competencyId: compId,
      competencyName: cs.competencyName,
      domain: cs.domain,
      currentLevel: score, // score out of 100
      targetLevel: requirement.requiredLevel,
      gapMagnitude: Math.max(0, gap),
      rawGap: gap,
      priority: classification.priority,
      priorityLabel: classification.label,
      status: gap <= 0 ? "COMPLETED" : "IN_PROGRESS",
      notes: gap <= 0
        ? "Exceeds or meets baseline standard."
        : `Requires capacity building of ${gap} percentage points to achieve Statistical Officer threshold.`
    };

    calculatedGaps.push(gapRecord);

    if (gap <= 0) {
      strengths.push({
        competencyId: compId,
        competencyName: cs.competencyName,
        domain: cs.domain,
        score,
        requiredLevel: requirement.requiredLevel,
        surplus: Math.abs(gap)
      });
    } else {
      developmentAreas.push({
        competencyId: compId,
        competencyName: cs.competencyName,
        domain: cs.domain,
        score,
        requiredLevel: requirement.requiredLevel,
        gap,
        priority: classification.priority,
        priorityLabel: classification.label,
        severity: classification.severity
      });
    }
  });

  // Sort development areas by severity (Critical / High first)
  developmentAreas.sort((a, b) => b.gap - a.gap);
  strengths.sort((a, b) => b.score - a.score);

  return {
    overallScore,
    totalCorrect,
    totalQuestions,
    domainScores,
    competencyScores,
    gaps: calculatedGaps,
    strengths,
    developmentAreas,
    questionDetails,
    evaluatedAt: new Date().toISOString()
  };
}
