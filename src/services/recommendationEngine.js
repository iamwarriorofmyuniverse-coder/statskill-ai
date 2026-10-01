/**
 * StatSkill AI - Personalized Course Recommendation Engine
 *
 * Implements deterministic matching and scoring based on actual assessment results and skill gaps.
 * Formula:
 * Recommendation Score = 40% Skill Gap + 20% Role Relevance + 15% Career Relevance
 *                       + 10% Department Priority + 10% Previous Learning + 5% Difficulty Fit
 * Normalized to 0-100.
 */

import { IGOT_COURSE_CATALOGUE, PROTOTYPE_CATALOGUE_DISCLAIMER } from "../data/igotCoursesCatalogue.js";

// Role & Department weights
const ROLE_CORE_COMPETENCIES = {
  "comp-stat-01": 100, // Survey Design
  "comp-stat-02": 100, // Sampling
  "comp-stat-03": 100, // Data Quality
  "comp-stat-04": 95,  // Official Statistics
  "comp-tech-01": 95,  // Python
  "comp-tech-02": 90,  // SQL
  "comp-tech-03": 85,  // Data Visualization
  "comp-gov-01": 85,   // Data Privacy
  "comp-gov-02": 80,   // Cybersecurity
  "comp-mgt-03": 90,   // Ethics
  "comp-mgt-01": 85    // Communication
};

const CAREER_GOAL_COMPETENCIES = {
  // Senior Statistical Analyst priorities
  "comp-tech-01": 100, // Python
  "comp-tech-05": 100, // AI/ML
  "comp-stat-02": 95,  // Sampling
  "comp-stat-03": 95,  // Data Quality
  "comp-stat-04": 95,  // Official Statistics (National Accounts)
  "comp-gov-01": 90,   // Data Privacy (DPDP Act)
  "comp-tech-02": 90,  // SQL
  "comp-mgt-05": 90    // Project Management
};

const DEPT_PRIORITY_COMPETENCIES = {
  // MoSPI Strategic Modernization priorities
  "comp-gov-01": 100, // DPDP Act 2023 Compliance
  "comp-stat-03": 95,  // Data Quality Frameworks
  "comp-stat-04": 95,  // National Accounts & SDG Indicators
  "comp-stat-02": 90,  // Sampling Modernization
  "comp-tech-01": 90,  // Python Data Pipelines
  "comp-tech-05": 90   // AI in Government
};

/**
 * Calculate Gap Score Component (0-100)
 */
function calculateGapScore(gap) {
  if (gap >= 51) return 100; // Critical gap
  if (gap >= 26) return 80 + ((gap - 25) / 25) * 15; // High gap: 80 - 95
  if (gap >= 11) return 60 + ((gap - 10) / 15) * 15; // Medium gap: 60 - 75
  if (gap >= 1) return 35 + (gap / 10) * 15; // Low gap: 35 - 50
  return 10; // Meets requirement (refresher)
}

/**
 * Calculate Difficulty Fit Component (0-100)
 */
function calculateDifficultyFit(currentScore, difficulty) {
  if (currentScore < 40) {
    if (difficulty === "Foundational") return 100;
    if (difficulty === "Intermediate") return 70;
    return 40; // Advanced is too steep for beginner
  } else if (currentScore <= 75) {
    if (difficulty === "Intermediate") return 100;
    if (difficulty === "Advanced") return 85;
    return 60; // Foundational is too basic
  } else {
    if (difficulty === "Advanced") return 100;
    if (difficulty === "Intermediate") return 75;
    return 40;
  }
}

/**
 * Generate deterministic personalized course recommendations
 * @param {Array} skillGaps - User's active skill gaps
 * @param {Object} officerProfile - User profile (role, career goal, department, previous training)
 * @param {Array} learningProgress - User's enrolled/completed courses
 * @param {Array} courseCatalogue - Available iGOT-compatible course catalogue
 * @returns {Array} Ranked recommendations with deterministic scores and explanations
 */
export function generateCourseRecommendations({
  skillGaps = [],
  officerProfile = {},
  learningProgress = [],
  courseCatalogue = IGOT_COURSE_CATALOGUE
}) {
  const recommendations = [];

  // Map skill gaps by competencyId for fast lookup
  const gapMap = {};
  skillGaps.forEach((g) => {
    gapMap[g.competencyId] = g;
  });

  const enrolledCourseIds = new Set(
    (learningProgress || []).map((lp) => lp.courseId)
  );

  courseCatalogue.forEach((course) => {
    if (!course.active) return;

    // Find primary competency addressed by the course
    const primaryCompId = course.competencies?.[0] || "comp-stat-01";
    const gapInfo = gapMap[primaryCompId] || {
      competencyId: primaryCompId,
      competencyName: course.competencyName || course.title,
      domain: course.domain,
      currentLevel: 50,
      targetLevel: 75,
      gapMagnitude: 25,
      rawGap: 25,
      priority: "MEDIUM"
    };

    const currentScore = gapInfo.currentLevel !== undefined ? gapInfo.currentLevel : 50;
    const requiredScore = gapInfo.targetLevel !== undefined ? gapInfo.targetLevel : 75;
    const gapValue = gapInfo.rawGap !== undefined ? gapInfo.rawGap : (requiredScore - currentScore);

    // 1. Skill Gap Score (40%)
    const sGap = calculateGapScore(gapValue);

    // 2. Role Relevance Score (20%)
    const sRole = ROLE_CORE_COMPETENCIES[primaryCompId] || 80;

    // 3. Career Relevance Score (15%)
    const sCareer = CAREER_GOAL_COMPETENCIES[primaryCompId] || 75;

    // 4. Department Priority Score (10%)
    const sDept = DEPT_PRIORITY_COMPETENCIES[primaryCompId] || 80;

    // 5. Previous Learning Score (10%)
    const isEnrolled = enrolledCourseIds.has(course.courseId);
    let sLearning = 75;
    if (isEnrolled) {
      sLearning = 40; // De-prioritize already enrolled courses in new recommendations
    } else if (
      officerProfile.previousTraining &&
      officerProfile.previousTraining.toLowerCase().includes(course.domain.toLowerCase())
    ) {
      sLearning = 95; // Builds on demonstrated background
    }

    // 6. Difficulty Fit Score (5%)
    const sDifficulty = calculateDifficultyFit(currentScore, course.difficulty);

    // Deterministic Weighted Recommendation Score (0-100)
    const rawScore =
      0.40 * sGap +
      0.20 * sRole +
      0.15 * sCareer +
      0.10 * sDept +
      0.10 * sLearning +
      0.05 * sDifficulty;

    const recommendationScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Deterministic Reason Generation
    let reason = "";
    if (gapValue > 0) {
      reason = `Your ${gapInfo.competencyName} competency is ${gapValue} points below the requirement (Current: ${currentScore}%, Required: ${requiredScore}%) for your role as ${officerProfile.designation || "Statistical Officer"}. This course directly addresses the identified gap.`;
    } else {
      reason = `You meet the baseline requirement for ${gapInfo.competencyName} (${currentScore}% vs ${requiredScore}%). This advanced module provides capability enhancement for your career goal as ${officerProfile.careerGoal || "Senior Statistical Analyst"}.`;
    }

    // Determine Priority Tier for sorting
    let priorityTier = 4; // Low
    if (gapValue >= 51) priorityTier = 1; // Critical
    else if (gapValue >= 26) priorityTier = 2; // High
    else if (gapValue >= 11) priorityTier = 3; // Medium

    recommendations.push({
      id: `rec-${course.courseId}-${Date.now()}`,
      courseId: course.courseId,
      title: course.title,
      provider: course.provider,
      description: course.description,
      competencyId: primaryCompId,
      competencyName: gapInfo.competencyName,
      domain: course.domain,
      difficulty: course.difficulty,
      durationHours: course.durationHours,
      courseType: course.courseType,
      catalogueSource: course.catalogueSource || PROTOTYPE_CATALOGUE_DISCLAIMER,
      url: course.url,
      currentCompetency: currentScore,
      requiredCompetency: requiredScore,
      gap: gapValue,
      recommendationScore,
      priority: gapInfo.priority || (gapValue >= 51 ? "CRITICAL" : gapValue >= 26 ? "HIGH" : gapValue >= 11 ? "MEDIUM" : "LOW"),
      priorityTier,
      reason,
      scoreBreakdown: {
        skillGap: Math.round(sGap),
        role: Math.round(sRole),
        career: Math.round(sCareer),
        dept: Math.round(sDept),
        previousLearning: Math.round(sLearning),
        difficulty: Math.round(sDifficulty)
      },
      status: isEnrolled ? "ENROLLED" : "RECOMMENDED",
      generatedAt: new Date().toISOString()
    });
  });

  // Sort strictly by Priority Tier (Critical -> High -> Medium -> Low), then by Recommendation Score descending
  recommendations.sort((a, b) => {
    if (a.priorityTier !== b.priorityTier) {
      return a.priorityTier - b.priorityTier;
    }
    return b.recommendationScore - a.recommendationScore;
  });

  return recommendations;
}
