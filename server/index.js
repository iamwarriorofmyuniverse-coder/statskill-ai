import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import competencyRoutes from "./routes/competencyRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/competencies", competencyRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/seed", seedRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "StatSkill AI Backend API",
    version: "1.0.0",
    sihProblemStatement: "26101",
    targetSystem: "India's Official Statistical System (MoSPI)",
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"),
    serverTime: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` StatSkill AI Server running on http://localhost:${PORT}`);
    console.log(` Problem Statement: SIH 26101 - Official Statistical System`);
    console.log(` Recommendation Engine: Deterministic (40% Gap, 20% Role, 15% Career, 10% Dept, 10% Prev, 5% Diff)`);
    console.log(`=======================================================`);
  });
}

export default app;
