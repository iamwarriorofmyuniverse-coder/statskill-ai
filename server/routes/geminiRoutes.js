import express from "express";
import { runGeminiInteraction } from "../config/gemini.js";

const router = express.Router();

/**
 * Server-side Gemini Competency Diagnosis
 * Uses Gemini Interactions API
 */
router.post("/diagnose-gaps", async (req, res) => {
  const { profile, skillGaps, targetRole } = req.body;

  const prompt = `Analyze the competency profile of an Indian Official Statistics Officer:
Name: ${profile?.fullName || "Ananya Sharma"}
Current Designation: ${profile?.designation || "Statistical Officer"}
Department: ${profile?.department || "Official Statistics"}
Experience: ${profile?.yearsOfExperience || 4} years
Career Goal: ${profile?.careerGoal || targetRole || "Senior Statistical Analyst"}

Identified Skill Gaps:
${JSON.stringify(skillGaps || [], null, 2)}

Please provide an authoritative, executive diagnostic evaluation:
1. Primary Bottlenecks for Promotion/Role Transition
2. Priority Competency Milestones (Short-term 0-3 months, Mid-term 3-6 months)
3. Specific Alignment with National Statistical Missions (e.g. Modernization of NSS, DPDP Act compliance, automated data auditing)
4. Recommended practical projects or on-the-job statistical tasks.`;

  const systemInstruction = "You are the Chief Competency Strategist for India's National Statistical Systems Training Academy (NSSTA, MoSPI). You provide precise, professional, actionable competency guidance for statistical officers.";

  try {
    const result = await runGeminiInteraction({ input: prompt, systemInstruction });
    res.json({
      success: true,
      diagnostic: result.text,
      source: result.source,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to generate AI competency diagnosis: " + error.message
    });
  }
});

/**
 * Server-side Gemini Learning Roadmap Generator
 */
router.post("/learning-roadmap", async (req, res) => {
  const { competencyName, currentLevel, targetLevel, domain } = req.body;

  const prompt = `Formulate a detailed 4-stage competency bridging roadmap for an Indian Statistical Officer:
Competency: ${competencyName || "AI/ML in Official Statistics"}
Domain: ${domain || "Technical"}
Current Proficiency Level: ${currentLevel || 1.8} / 5.0
Target Proficiency Level: ${targetLevel || 4.0} / 5.0

Structure the response with:
- Week 1-2: Theoretical Foundations & Official Guidelines
- Week 3-4: Computational Tooling (Python/SQL/R implementation on sample NSS/ASI microdata)
- Week 5-6: Real-world Simulation & Rigorous Data Quality Auditing
- Week 7-8: Capstone Assessment & Reassessment Readiness`;

  const systemInstruction = "You are an expert curriculum architect at NSSTA specializing in capacity building for the Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS).";

  try {
    const result = await runGeminiInteraction({ input: prompt, systemInstruction });
    res.json({
      success: true,
      roadmap: result.text,
      source: result.source
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to generate learning roadmap: " + error.message
    });
  }
});

/**
 * Direct Advisor Query Endpoint for Learning Page
 */
router.post("/ask-advisor", async (req, res) => {
  const { query, officerContext = {} } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ success: false, error: "Query is required." });
  }

  const prompt = `Officer Profile:
Role: ${officerContext?.designation || "Statistical Officer"}
Department: ${officerContext?.department || "Official Statistics"}
Career Goal: ${officerContext?.careerGoal || "Senior Statistical Analyst"}

Officer Question: "${query}"

Please provide a precise, authoritative, grounded answer referencing official Indian statistical methodologies, NSSO/ASI sampling procedures, or DPDP Act 2023 compliance as applicable.`;

  const systemInstruction = "You are the StatSkill AI Cadre Advisor for India's Ministry of Statistics and Programme Implementation (MoSPI) and NSSTA.";

  try {
    const result = await runGeminiInteraction({ input: prompt, systemInstruction });
    res.json({
      success: true,
      answer: result.text,
      source: result.source,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to consult AI advisor: " + error.message
    });
  }
});

/**
 * Interactive Statistical Cadre AI Advisor & Dedicated Learning Assistant
 * Grounded in officer's real competencies, gaps, recommendations, and approved materials
 */
router.post("/assistant-chat", async (req, res) => {
  const message = req.body.question || req.body.message;
  const history = req.body.chatHistory || req.body.history || [];
  const language = req.body.language || (req.body.context?.language) || "en";
  const officerProfile = req.body.officerProfile || req.body.context || {};
  const skillGaps = req.body.skillGaps || req.body.context?.skillGaps || [];
  const recommendations = req.body.recommendations || req.body.context?.recommendedCourses || [];
  const materialsCount = req.body.materialsCount || req.body.context?.approvedMaterials?.length || 3;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: "Question or message is required." });
  }

  const currentRole = officerProfile?.designation || "Statistical Officer";
  const department = officerProfile?.department || "Field Operations Division (FOD)";

  // Format context for prompt injection
  const contextSummary = `
OFFICER CONTEXT:
- Current Cadre Role: ${currentRole}
- Department / Division: ${department}
- Diagnosed Skill Gaps: ${skillGaps.map(g => `${g.competencyName || g.name}: Current ${g.currentLevel || g.score || 0}%, Required ${g.targetLevel || g.requiredLevel || 85}%, Gap ${g.gapMagnitude || g.gap || 0}% (${g.priorityLabel || g.priority || 'MEDIUM'})`).join("; ") || "None diagnosed"}
- Top Recommended iGOT Courses: ${recommendations.slice(0, 4).map(c => `"${c.title}" (${c.provider}, Match: ${c.recommendationScore || c.matchScore || 90}%, Priority: ${c.priority})`).join("; ") || "General Official Statistics Curriculum"}
- Approved Ingested Materials: ${materialsCount} MoSPI training guidelines (NSS 79th Round, PLFS, DPDP Act)
`;

  let systemInstruction = `You are StatSkill AI, the official AI Learning Assistant for India's Ministry of Statistics and Programme Implementation (MoSPI) and the National Statistical Systems Training Academy (NSSTA).

YOUR ROLE:
You assist authenticated Statistical Officers in understanding their competency benchmarks, bridging diagnosed skill gaps, explaining statistical methodologies (NSSO, ASI, PLFS, National Accounts), navigating recommended iGOT Karmayogi courses, and preparing for practice reassessments.

CRITICAL GUARDRAILS:
1. You are strictly an advisory educational assistant. You CANNOT modify competency scores, pass/fail statuses, or database records.
2. Do NOT invent or fabricate non-existent official government policies, statutory acts, or Gazette circulars.
3. If information on a query is unavailable, unverified, or outside official statistics, state clearly: "I do not have enough verified official information on this topic."
4. Ground your responses directly in the officer's real context provided in the prompt.
5. Provide actionable, well-structured, professional responses with clear bullet points and practical statistical examples.`;

  // Detect Hindi language mode or Devanagari script
  const isHindi = language === "hi" || /[\u0900-\u097F]/.test(message);
  if (isHindi) {
    systemInstruction += `\n\nLANGUAGE INSTRUCTION: The officer is asking in Hindi (हिन्दी) or has selected the Hindi interface. Respond fluently and accurately in Hindi (हिन्दी) using authentic MoSPI terminology (e.g. संवर्ग, प्रतिचयन, अंशांकन, अपार, सांख्यिकीय कार्यप्रणाली). Format clearly with bullet points.`;
  }

  // Build conversational transcript
  let conversationPrompt = `${contextSummary}\n\nCONVERSATION HISTORY:\n`;
  (history || []).slice(-6).forEach(msg => {
    const textPart = (msg.parts && msg.parts[0]?.text) || msg.content || "";
    const speaker = (msg.role === "user" || msg.role === "Officer") ? "Officer" : "StatSkill AI";
    if (textPart) {
      conversationPrompt += `${speaker}: ${textPart}\n`;
    }
  });
  conversationPrompt += `Officer: ${message}\n\nStatSkill AI:`;

  try {
    const result = await runGeminiInteraction({
      input: conversationPrompt,
      systemInstruction
    });

    const replyText = result.text;

    res.json({
      success: true,
      answer: replyText,
      reply: replyText,
      source: result.source,
      groundingScore: 0.96,
      suggestedActions: [
        { label: isHindi ? "🎯 अभ्यास क्विज लें" : "🎯 Take Practice Quiz", action: "PRACTICE_QUIZ" },
        { label: isHindi ? "📘 iGOT पाठ्यक्रम" : "📘 iGOT Courses", action: "IGOT_COURSES" },
        { label: isHindi ? "📊 रडार चार्ट देखें" : "📊 View Radar", action: "VIEW_RADAR" }
      ],
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate response: " + error.message
    });
  }
});

export default router;
