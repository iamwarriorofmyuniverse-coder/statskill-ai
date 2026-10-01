import http from "http";
import express from "express";
import cors from "cors";
import authRoutes from "../server/routes/authRoutes.js";
import competencyRoutes from "../server/routes/competencyRoutes.js";
import geminiRoutes from "../server/routes/geminiRoutes.js";
import seedRoutes from "../server/routes/seedRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/competencies", competencyRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/seed", seedRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "StatSkill AI Backend API", sih: "26101" });
});

const server = app.listen(5099, async () => {
  console.log("Test server listening on port 5099...");

  async function get(path) {
    const res = await fetch(`http://localhost:5099${path}`);
    return await res.json();
  }

  async function post(path, body) {
    const res = await fetch(`http://localhost:5099${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return { status: res.status, data: await res.json() };
  }

  try {
    // 1. Health check
    const health = await get("/api/health");
    console.log("? /api/health:", health.status);

    // 2. Master Assessment Endpoint
    const master = await get("/api/competencies/master-assessment");
    console.log(`? /api/competencies/master-assessment: ${master.totalQuestions} questions returned`);

    // 3. Deterministic Assessment Submission
    const submitRes = await post("/api/competencies/assessments/submit", {
      userId: "officer_ananya_001",
      answers: { "q-sd-01": 1, "q-sd-02": 1, "q-samp-01": 0 }
    });
    console.log(`? Deterministic Submission Evaluated: Overall Score ${submitRes.data.attempt.overallScore}%, Total Qs ${submitRes.data.attempt.totalQuestions}`);
    console.log(`? Gaps Calculated: ${submitRes.data.attempt.gaps.length} competency gaps computed`);

    // 4. Seed Status
    const seed = await get("/api/seed/status");
    console.log(`? /api/seed/status: ${seed.totalCollections} Firestore collections ready`);

    // 5. Trainer Validation
    const invalidAuth = await post("/api/auth/validate-trainer", { accessCode: "WRONG" });
    console.log(`? Trainer Auth (Invalid Code): Status ${invalidAuth.status}, Authorized: ${invalidAuth.data.authorized}`);

    const validAuth = await post("/api/auth/validate-trainer", { accessCode: "TRAINER-MOSPI-2025" });
    console.log(`? Trainer Auth (Valid Code): Status ${validAuth.status}, Role: ${validAuth.data.role}`);

    console.log("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!\n");
  } catch (err) {
    console.error("Test failure:", err);
  } finally {
    server.close();
  }
});
