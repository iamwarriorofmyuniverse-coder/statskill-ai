import express from "express";
import multer from "multer";
import { extractTextFromBuffer } from "../utils/textExtractor.js";
import { generateMCQsFromMaterial } from "../services/mcqGeneratorService.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

/**
 * POST /api/ai/generate-mcqs
 * Generates structured MCQs from uploaded file or raw text
 */
router.post("/generate-mcqs", upload.single("file"), async (req, res) => {
  try {
    let extractedText = "";
    let fileName = "Uploaded Document";
    let fileType = "txt";
    let numQuestions = 10;
    let domainHint = "Statistical";
    let competencyHint = "";

    // 1. If file uploaded via multipart
    if (req.file) {
      fileName = req.file.originalname || "document";
      const ext = fileName.split(".").pop().toLowerCase();
      fileType = ext;
      const extraction = await extractTextFromBuffer(req.file.buffer, ext, fileName);
      extractedText = extraction.text;

      if (req.body.numQuestions) numQuestions = parseInt(req.body.numQuestions, 10) || 10;
      if (req.body.domainHint) domainHint = req.body.domainHint;
      if (req.body.competencyHint) competencyHint = req.body.competencyHint;
    } else if (req.body.text) {
      // 2. If text provided directly in JSON body
      extractedText = req.body.text;
      if (req.body.fileName) fileName = req.body.fileName;
      if (req.body.fileType) fileType = req.body.fileType;
      if (req.body.numQuestions) numQuestions = parseInt(req.body.numQuestions, 10) || 10;
      if (req.body.domainHint) domainHint = req.body.domainHint;
      if (req.body.competencyHint) competencyHint = req.body.competencyHint;
    } else {
      return res.status(400).json({
        success: false,
        error: "No file or text payload provided for MCQ generation."
      });
    }

    if (!extractedText || extractedText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error: "Extracted text content is empty or too short to formulate assessment questions."
      });
    }

    const startTime = Date.now();
    const questions = await generateMCQsFromMaterial({
      text: extractedText,
      numQuestions,
      domainHint,
      competencyHint,
      fileName
    });

    const elapsedMs = Date.now() - startTime;

    res.json({
      success: true,
      metadata: {
        fileName,
        fileType,
        textLength: extractedText.length,
        wordCount: extractedText.split(/\s+/).length,
        numQuestionsRequested: numQuestions,
        numQuestionsGenerated: questions.length,
        processingTimeMs: elapsedMs,
        domainHint,
        competencyHint,
        generatedAt: new Date().toISOString()
      },
      textPreview: extractedText.substring(0, 500) + (extractedText.length > 500 ? "..." : ""),
      questions
    });
  } catch (error) {
    console.error("MCQ Generation API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate assessment MCQs."
    });
  }
});

export default router;
