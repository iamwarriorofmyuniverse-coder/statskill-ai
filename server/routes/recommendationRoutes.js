import express from "express";
import { IGOT_COURSE_CATALOGUE, PROTOTYPE_CATALOGUE_DISCLAIMER } from "../data/igotCoursesCatalogue.js";
import { generateCourseRecommendations } from "../services/recommendationEngine.js";
import { DEMO_SKILL_GAPS, DEMO_OFFICER_PROFILE, DEMO_LEARNING_PROGRESS } from "../data/demoSeedData.js";

const router = express.Router();

// Get Catalogue
router.get("/catalogue", (req, res) => {
  res.json({
    success: true,
    disclaimer: PROTOTYPE_CATALOGUE_DISCLAIMER,
    totalCourses: IGOT_COURSE_CATALOGUE.length,
    courses: IGOT_COURSE_CATALOGUE
  });
});

// Retrieve Recommendations for User
router.get("/:userId", (req, res) => {
  const recommendations = generateCourseRecommendations({
    skillGaps: DEMO_SKILL_GAPS,
    officerProfile: DEMO_OFFICER_PROFILE,
    learningProgress: DEMO_LEARNING_PROGRESS,
    courseCatalogue: IGOT_COURSE_CATALOGUE
  });

  res.json({
    success: true,
    userId: req.params.userId,
    disclaimer: PROTOTYPE_CATALOGUE_DISCLAIMER,
    totalRecommendations: recommendations.length,
    recommendations
  });
});

// Generate or Refresh Recommendations (Deterministic backend scoring)
router.post("/generate", (req, res) => {
  const { userId, skillGaps, officerProfile, learningProgress } = req.body;

  const gapsToUse = (skillGaps && skillGaps.length > 0) ? skillGaps : DEMO_SKILL_GAPS;
  const profileToUse = officerProfile || DEMO_OFFICER_PROFILE;
  const progressToUse = learningProgress || DEMO_LEARNING_PROGRESS;

  const recommendations = generateCourseRecommendations({
    skillGaps: gapsToUse,
    officerProfile: profileToUse,
    learningProgress: progressToUse,
    courseCatalogue: IGOT_COURSE_CATALOGUE
  });

  res.json({
    success: true,
    userId: userId || "officer_ananya_001",
    disclaimer: PROTOTYPE_CATALOGUE_DISCLAIMER,
    message: "Personalized course recommendations successfully computed using deterministic engine.",
    formula: "40% Skill Gap + 20% Role Relevance + 15% Career Relevance + 10% Dept Priority + 10% Previous Learning + 5% Difficulty Fit",
    totalRecommendations: recommendations.length,
    recommendations,
    generatedAt: new Date().toISOString()
  });
});

router.post("/refresh", (req, res) => {
  const { userId, skillGaps, officerProfile, learningProgress } = req.body;

  const recommendations = generateCourseRecommendations({
    skillGaps: skillGaps || DEMO_SKILL_GAPS,
    officerProfile: officerProfile || DEMO_OFFICER_PROFILE,
    learningProgress: learningProgress || DEMO_LEARNING_PROGRESS,
    courseCatalogue: IGOT_COURSE_CATALOGUE
  });

  res.json({
    success: true,
    message: "Recommendations successfully refreshed against latest capability diagnostics.",
    disclaimer: PROTOTYPE_CATALOGUE_DISCLAIMER,
    recommendations
  });
});

export default router;
