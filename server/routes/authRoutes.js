import express from "express";

const router = express.Router();

/**
 * Validates Trainer Access Code server-side
 * Code is never exposed in client source code
 */
router.post("/validate-trainer", (req, res) => {
  const { accessCode, userId, email } = req.body;

  const validKey = (process.env.STATSKILL_TRAINER_KEY || "TRAINER-MOSPI-2025").trim();

  if (!accessCode) {
    return res.status(400).json({
      success: false,
      authorized: false,
      error: "Trainer access code is required."
    });
  }

  if (accessCode.trim() === validKey) {
    return res.json({
      success: true,
      authorized: true,
      role: "TRAINER",
      message: "Trainer authorization successful. Access granted to Trainer portal.",
      validatedAt: new Date().toISOString()
    });
  } else {
    return res.status(403).json({
      success: false,
      authorized: false,
      error: "Invalid trainer access code. Access restricted to authorized MoSPI / NSSTA faculty."
    });
  }
});

/**
 * Role metadata verification endpoint
 */
router.get("/roles-meta", (req, res) => {
  res.json({
    availableRoles: [
      { id: "OFFICER", label: "Statistical Officer", requiresCode: false, description: "Official statistical cadre (NSSO, CSO, State DES)" },
      { id: "TRAINER", label: "Faculty / Trainer", requiresCode: true, description: "NSSTA / MoSPI authorized instructors and evaluators" }
    ]
  });
});

export default router;
