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

import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// 1. Comprehensive HTTP Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite and external CDNs handled via browser CSP
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Required for Google Auth Popup
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false
  })
);

// 2. Strict CORS Origin Whitelist
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
  "https://statskill-ai-five.vercel.app"
];

const vercelPreviewRegex = /^https:\/\/statskill(-[a-z0-9-]+)?(-ultron-6b74)?\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin) || vercelPreviewRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Access from origin denied."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

// 3. Rate Limiting (Brute-Force & DDoS Defense)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP. Please try again after 15 minutes."
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // max 15 attempts to prevent brute force
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication verification attempts. Rate limit exceeded."
  }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI Generation rate limit reached. Please wait before generating more questions or assessments."
  }
});

app.use(generalLimiter);
app.use("/api/auth/validate-trainer", authLimiter);
app.use("/api/ai", aiLimiter);
app.use("/api/gemini", aiLimiter);

// 4. Strict Body Payload Bounds (Protection against memory exhaustion)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Disable x-powered-by header
app.disable("x-powered-by");

// 5. API Routes
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
    sihProblemStatement: "21121",
    targetSystem: "India's Official Workforce & Statistical System",
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"),
    securityHardened: true,
    serverTime: new Date().toISOString()
  });
});

// 6. Defensive Sanitized Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Security / Application Error:", err.message);
  const statusCode = err.status || (err.message?.includes("CORS") ? 403 : 500);
  res.status(statusCode).json({
    success: false,
    error: isProd
      ? (statusCode === 403 ? "Forbidden by CORS policy." : "Internal Server Error occurred.")
      : err.message || "Internal Server Error"
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` StatSkill AI Server running on http://localhost:${PORT}`);
    console.log(` Smart India Hackathon: Idea / PS ID 21121 (AIZENIX - 176704)`);
    console.log(` Recommendation Engine: Deterministic (40% Gap, 20% Role, 15% Career, 10% Dept, 10% Prev, 5% Diff)`);
    console.log(`=======================================================`);
  });
}

export default app;
