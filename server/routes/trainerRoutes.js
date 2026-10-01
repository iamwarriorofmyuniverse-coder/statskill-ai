import express from "express";
import multer from "multer";
import { extractTextFromBuffer } from "../utils/textExtractor.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

// In-memory / persistent seed state for materials & question bank
let learningMaterials = [
  {
    id: "mat-001",
    fileName: "NSS 79th Round Operational Manual.pdf",
    fileType: "pdf",
    uploadedBy: "trainer_rajesh_sharma",
    uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: "PROCESSED",
    processingStatus: "COMPLETED",
    textLength: 14250,
    questionsGenerated: 12,
    domain: "Statistical",
    competency: "Survey Design"
  },
  {
    id: "mat-002",
    fileName: "DPDP Act 2023 Statistical Microdata Guidelines.docx",
    fileType: "docx",
    uploadedBy: "trainer_rajesh_sharma",
    uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "PROCESSED",
    processingStatus: "COMPLETED",
    textLength: 9800,
    questionsGenerated: 10,
    domain: "Digital Governance",
    competency: "Data Privacy"
  }
];

let questionBank = [
  {
    id: "qb-001",
    question: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the mandatory protocol before releasing survey microdata for academic research?",
    options: [
      "Direct release with original respondent phone numbers",
      "Cryptographic anonymization and removal of direct/quasi-identifiers",
      "Publishing raw tabular aggregates without masking",
      "Manual phone verification with every respondent"
    ],
    correctAnswer: 1,
    explanation: "Under the DPDP Act 2023, personal data must undergo irreversible anonymization or perturbation before public dissemination.",
    difficulty: "Intermediate",
    competency: "Data Privacy",
    domain: "Digital Governance",
    topic: "DPDP Compliance",
    sourceExcerpt: "Microdata files must be stripped of direct and quasi-identifiers using k-anonymity protocols prior to publication.",
    sourceFile: "DPDP Act 2023 Statistical Microdata Guidelines.docx",
    status: "APPROVED",
    approvedBy: "trainer_rajesh_sharma",
    approvedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "qb-002",
    question: "What is the primary technical objective of applying Probability Proportional to Size (PPS) sampling in agricultural crop-cutting surveys?",
    options: [
      "To give larger agricultural clusters a proportionally higher probability of selection, reducing estimator variance",
      "To eliminate the need for field enumeration staff",
      "To replace standard deviation calculations with simple averages",
      "To guarantee equal selection probabilities regardless of land acreage"
    ],
    correctAnswer: 0,
    explanation: "PPS sampling assigns higher selection probabilities to larger primary sampling units, yielding more efficient estimators.",
    difficulty: "Advanced",
    competency: "Sampling",
    domain: "Statistical",
    topic: "PPSWOR Methodology",
    sourceExcerpt: "PPS selection minimizes the variance of aggregate crop yield estimators across heterogeneous village sizes.",
    sourceFile: "NSS 79th Round Operational Manual.pdf",
    status: "APPROVED",
    approvedBy: "trainer_rajesh_sharma",
    approvedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

/**
 * POST /api/trainer/upload-material
 * Extracts text and records material metadata
 */
router.post("/upload-material", upload.single("file"), async (req, res) => {
  try {
    let fileName = "learning_material.txt";
    let fileType = "txt";
    let extractedText = "";

    if (req.file) {
      fileName = req.file.originalname;
      const ext = fileName.split(".").pop().toLowerCase();
      fileType = ext;
      const extraction = await extractTextFromBuffer(req.file.buffer, ext, fileName);
      extractedText = extraction.text;
    } else if (req.body.text) {
      extractedText = req.body.text;
      fileName = req.body.fileName || "Pasted Material";
      fileType = req.body.fileType || "txt";
    } else {
      return res.status(400).json({ success: false, error: "No file or text payload provided." });
    }

    const materialRecord = {
      id: `mat-${Date.now()}`,
      fileName,
      fileType,
      uploadedBy: req.body.uploadedBy || "trainer_rajesh_sharma",
      uploadedAt: new Date().toISOString(),
      status: "PROCESSED",
      processingStatus: "COMPLETED",
      textLength: extractedText.length,
      wordCount: extractedText.split(/\s+/).length,
      extractedTextPreview: extractedText.substring(0, 1000),
      domain: req.body.domain || "Statistical",
      competency: req.body.competency || "Official Statistics"
    };

    learningMaterials.unshift(materialRecord);

    res.json({
      success: true,
      material: materialRecord,
      extractedText
    });
  } catch (error) {
    console.error("Material upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/trainer/materials
 */
router.get("/materials", (req, res) => {
  res.json({
    success: true,
    total: learningMaterials.length,
    materials: learningMaterials
  });
});

/**
 * GET /api/trainer/question-bank
 */
router.get("/question-bank", (req, res) => {
  const { domain, competency, status } = req.query;
  let filtered = [...questionBank];

  if (domain && domain !== "ALL") {
    filtered = filtered.filter(q => q.domain === domain);
  }
  if (competency && competency !== "ALL") {
    filtered = filtered.filter(q => q.competency === competency);
  }
  if (status && status !== "ALL") {
    filtered = filtered.filter(q => q.status === status);
  }

  res.json({
    success: true,
    total: filtered.length,
    questions: filtered
  });
});

/**
 * POST /api/trainer/question-bank/save
 * Batch saves approved/edited questions
 */
router.post("/question-bank/save", (req, res) => {
  const { questions, approvedBy } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, error: "No questions provided to save." });
  }

  const savedItems = [];
  questions.forEach((q) => {
    const item = {
      id: q.id || `qb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty || "Intermediate",
      competency: q.competency || "Official Statistics",
      domain: q.domain || "Statistical",
      topic: q.topic || "Core Practice",
      sourceExcerpt: q.sourceExcerpt || "",
      sourceFile: q.sourceFile || "Training Material",
      status: q.status || "APPROVED",
      approvedBy: approvedBy || "trainer_rajesh_sharma",
      approvedAt: new Date().toISOString()
    };

    // Replace if exists, else prepend
    const existingIndex = questionBank.findIndex(existing => existing.id === item.id);
    if (existingIndex >= 0) {
      questionBank[existingIndex] = item;
    } else {
      questionBank.unshift(item);
    }
    savedItems.push(item);
  });

  res.json({
    success: true,
    message: `Successfully published ${savedItems.length} questions to official Question Bank.`,
    savedCount: savedItems.length,
    totalInBank: questionBank.length,
    questions: savedItems
  });
});

/**
 * PUT /api/trainer/question-bank/:id
 */
router.put("/question-bank/:id", (req, res) => {
  const { id } = req.params;
  const index = questionBank.findIndex(q => q.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: "Question not found in question bank." });
  }

  questionBank[index] = {
    ...questionBank[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    question: questionBank[index]
  });
});

/**
 * DELETE /api/trainer/question-bank/:id
 */
router.delete("/question-bank/:id", (req, res) => {
  const { id } = req.params;
  const prevCount = questionBank.length;
  questionBank = questionBank.filter(q => q.id !== id);

  res.json({
    success: true,
    deleted: prevCount !== questionBank.length,
    totalRemaining: questionBank.length
  });
});

export default router;
