import express from "express";
import {
  DEMO_COMPETENCIES,
  DEMO_DOMAINS,
  DEMO_ROLES,
  DEMO_ROLE_COMPETENCIES,
  DEMO_SKILL_GAPS,
  DEMO_COURSE_CATALOG,
  DEMO_RECOMMENDATIONS,
  DEMO_ASSESSMENTS,
  DEMO_QUESTION_BANK,
  DEMO_LEARNER_PERFORMANCE
} from "../data/demoSeedData.js";
import { MASTER_ASSESSMENT_METADATA, MASTER_ASSESSMENT_QUESTIONS } from "../data/assessmentQuestions.js";
import { evaluateAssessment, STATISTICAL_OFFICER_REQUIREMENTS } from "../services/assessmentScoring.js";

const router = express.Router();

// Get domains and competencies
router.get("/domains", (req, res) => {
  res.json({ success: true, domains: DEMO_DOMAINS });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    total: DEMO_COMPETENCIES.length,
    competencies: DEMO_COMPETENCIES
  });
});

// Roles & Requirements
router.get("/roles", (req, res) => {
  res.json({
    success: true,
    roles: DEMO_ROLES,
    requirements: DEMO_ROLE_COMPETENCIES,
    statisticalOfficerBenchmarks: STATISTICAL_OFFICER_REQUIREMENTS
  });
});

// Master Assessment (22 questions covering all requested domains)
router.get("/master-assessment", (req, res) => {
  res.json({
    success: true,
    metadata: MASTER_ASSESSMENT_METADATA,
    totalQuestions: MASTER_ASSESSMENT_QUESTIONS.length,
    questions: MASTER_ASSESSMENT_QUESTIONS
  });
});

// Skill gaps for officer
router.get("/skill-gaps/:userId", (req, res) => {
  res.json({
    success: true,
    userId: req.params.userId,
    gaps: DEMO_SKILL_GAPS,
    highPriorityCount: DEMO_SKILL_GAPS.filter(g => g.priority === "HIGH" || g.priority === "CRITICAL").length
  });
});

// Course catalog
router.get("/courses", (req, res) => {
  res.json({
    success: true,
    total: DEMO_COURSE_CATALOG.length,
    courses: DEMO_COURSE_CATALOG
  });
});

// Recommendations
router.get("/recommendations/:userId", (req, res) => {
  res.json({
    success: true,
    recommendations: DEMO_RECOMMENDATIONS
  });
});

// Assessments list
router.get("/assessments", (req, res) => {
  res.json({
    success: true,
    assessments: [
      MASTER_ASSESSMENT_METADATA,
      ...DEMO_ASSESSMENTS
    ]
  });
});

router.get("/assessments/:id/questions", (req, res) => {
  if (req.params.id === MASTER_ASSESSMENT_METADATA.id) {
    return res.json({
      success: true,
      assessmentId: req.params.id,
      total: MASTER_ASSESSMENT_QUESTIONS.length,
      questions: MASTER_ASSESSMENT_QUESTIONS
    });
  }

  res.json({
    success: true,
    assessmentId: req.params.id,
    total: MASTER_ASSESSMENT_QUESTIONS.length,
    questions: MASTER_ASSESSMENT_QUESTIONS
  });
});

/**
 * Deterministic Assessment Submission & Scoring
 * Strict deterministic logic without AI approximations
 */
router.post("/assessments/submit", (req, res) => {
  const { userId, assessmentId, answers } = req.body;

  // Evaluate against master questions
  const evaluation = evaluateAssessment(MASTER_ASSESSMENT_QUESTIONS, answers || {});

  const attempt = {
    id: `att-${Date.now()}`,
    userId: userId || "officer_ananya_001",
    assessmentId: assessmentId || MASTER_ASSESSMENT_METADATA.id,
    overallScore: evaluation.overallScore,
    totalCorrect: evaluation.totalCorrect,
    totalQuestions: evaluation.totalQuestions,
    domainScores: evaluation.domainScores,
    competencyScores: evaluation.competencyScores,
    gaps: evaluation.gaps,
    strengths: evaluation.strengths,
    developmentAreas: evaluation.developmentAreas,
    questionDetails: evaluation.questionDetails,
    completedAt: evaluation.evaluatedAt,
    passingScore: 75,
    passed: evaluation.overallScore >= 75
  };

  res.json({
    success: true,
    message: attempt.passed
      ? "Official Statistical Assessment successfully passed! Competencies calibrated."
      : "Assessment completed. Specific capability gaps diagnosed for targeted learning.",
    attempt
  });
});

/**
 * Deterministic Practice Quiz Submission & Competency Recalibration
 * Formula: newScore = (previousScore * 0.6) + (quizScore * 0.4), capped at 100
 */
router.post("/quiz/submit", (req, res) => {
  const {
    userId,
    competencyId,
    competencyName,
    domain,
    answers = {},
    questions = [],
    previousScore = 50
  } = req.body;

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: "No questions provided in quiz payload." });
  }

  let correctCount = 0;
  const questionResults = [];

  questions.forEach((q) => {
    const userChoice = answers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    if (isCorrect) correctCount++;

    questionResults.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      userAnswer: userChoice,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation || "Official curriculum explanation.",
      sourceExcerpt: q.sourceExcerpt || ""
    });
  });

  const totalQuestions = questions.length;
  const quizScore = Math.round((correctCount / totalQuestions) * 100);

  // Deterministic 60/40 weighted formula
  const rawNewScore = (previousScore * 0.6) + (quizScore * 0.4);
  const newScore = Math.min(100, Math.max(0, Math.round(rawNewScore)));
  const improvement = newScore - previousScore;

  const quizAttempt = {
    id: `quiz-att-${Date.now()}`,
    userId: userId || "officer_ananya_001",
    competencyId: competencyId || "comp-tech-01",
    competencyName: competencyName || "Python",
    domain: domain || "Technical",
    quizScore,
    previousScore,
    newScore,
    improvement,
    correctCount,
    totalQuestions,
    questionResults,
    completedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: `Practice Quiz for ${competencyName} completed! Competency updated from ${previousScore}% to ${newScore}%.`,
    quizAttempt
  });
});

// Trainer cohort performance
router.get("/cohort-performance", (req, res) => {
  res.json({
    success: true,
    cohort: DEMO_LEARNER_PERFORMANCE
  });
});

export default router;
