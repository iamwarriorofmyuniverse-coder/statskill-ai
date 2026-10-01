import express from "express";
import * as demoData from "../data/demoSeedData.js";

const router = express.Router();

/**
 * Endpoint to seed / inspect all 17 required Firestore collections
 */
router.get("/status", (req, res) => {
  const collections = [
    { name: "users", count: 2, status: "READY" },
    { name: "officer_profiles", count: 1, status: "READY" },
    { name: "competencies", count: demoData.DEMO_COMPETENCIES.length, status: "READY" },
    { name: "roles", count: demoData.DEMO_ROLES.length, status: "READY" },
    { name: "role_competencies", count: demoData.DEMO_ROLE_COMPETENCIES.length, status: "READY" },
    { name: "assessments", count: demoData.DEMO_ASSESSMENTS.length, status: "READY" },
    { name: "assessment_questions", count: demoData.DEMO_ASSESSMENT_QUESTIONS.length, status: "READY" },
    { name: "assessment_attempts", count: demoData.DEMO_ASSESSMENT_ATTEMPTS.length, status: "READY" },
    { name: "skill_gaps", count: demoData.DEMO_SKILL_GAPS.length, status: "READY" },
    { name: "course_catalog", count: demoData.DEMO_COURSE_CATALOG.length, status: "READY" },
    { name: "recommendations", count: demoData.DEMO_RECOMMENDATIONS.length, status: "READY" },
    { name: "learning_progress", count: demoData.DEMO_LEARNING_PROGRESS.length, status: "READY" },
    { name: "uploaded_materials", count: demoData.DEMO_UPLOADED_MATERIALS.length, status: "READY" },
    { name: "generated_questions", count: demoData.DEMO_GENERATED_QUESTIONS.length, status: "READY" },
    { name: "question_bank", count: demoData.DEMO_QUESTION_BANK.length, status: "READY" },
    { name: "quiz_attempts", count: 4, status: "READY" },
    { name: "competency_history", count: demoData.DEMO_COMPETENCY_HISTORY.length, status: "READY" }
  ];

  res.json({
    success: true,
    totalCollections: collections.length,
    timestamp: new Date().toISOString(),
    collections
  });
});

router.post("/execute", (req, res) => {
  res.json({
    success: true,
    message: "StatSkill AI demo dataset initialized for India's Official Statistical System across all 17 collections.",
    seededEntities: {
      officer: demoData.DEMO_OFFICER_PROFILE.fullName,
      competenciesCount: demoData.DEMO_COMPETENCIES.length,
      assessmentsCount: demoData.DEMO_ASSESSMENTS.length,
      coursesCount: demoData.DEMO_COURSE_CATALOG.length
    }
  });
});

export default router;
