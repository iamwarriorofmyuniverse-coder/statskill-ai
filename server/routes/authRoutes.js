import express from "express";
import crypto from "crypto";

const router = express.Router();

/**
 * Constant-time string comparison to prevent side-channel timing attacks
 */
function timingSafeCompare(userInput, expectedSecret) {
  if (typeof userInput !== "string" || typeof expectedSecret !== "string") {
    return false;
  }
  const cleanInput = userInput.trim();
  const cleanSecret = expectedSecret.trim();

  // Create SHA-256 digests to ensure fixed length buffers for timingSafeEqual
  const hashInput = crypto.createHash("sha256").update(cleanInput, "utf8").digest();
  const hashSecret = crypto.createHash("sha256").update(cleanSecret, "utf8").digest();

  return crypto.timingSafeEqual(hashInput, hashSecret);
}

/**
 * Validates Trainer Access Code server-side
 * Code is never exposed in client source code
 * Protected by timing-safe cryptographic equality and strict sanitization
 */
router.post("/validate-trainer", (req, res) => {
  const { accessCode, userId, email } = req.body;

  if (!accessCode || typeof accessCode !== "string") {
    return res.status(400).json({
      success: false,
      authorized: false,
      error: "Valid trainer access code is required."
    });
  }

  // Sanitize: reject suspiciously large strings to prevent resource exhaustion
  if (accessCode.length > 128) {
    return res.status(400).json({
      success: false,
      authorized: false,
      error: "Access code exceeds maximum allowed length."
    });
  }

  const validKey = (process.env.STATSKILL_TRAINER_KEY || "TRAINER-MOSPI-2025").trim();

  const isMatch = timingSafeCompare(accessCode, validKey);

  if (isMatch) {
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
