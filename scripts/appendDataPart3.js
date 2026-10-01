import fs from 'fs';

const part3 = `
export const DEMO_ASSESSMENTS = [
  {
    id: "assess-diag-01",
    title: "National Statistical Capacity Diagnostic (Full)",
    domain: "Multi-Domain",
    targetRole: "Senior Statistical Analyst",
    totalQuestions: 5,
    durationMinutes: 20,
    description: "Comprehensive diagnostic benchmarking proficiency across Statistical, Technical, Digital Governance, and Managerial domains."
  },
  {
    id: "assess-stat-01",
    title: "Survey Sampling & Data Quality Certification",
    domain: "Statistical",
    targetRole: "Statistical Officer",
    totalQuestions: 5,
    durationMinutes: 15,
    description: "Validates PPSWOR design, stratification formulas, and non-sampling error handling protocols."
  },
  {
    id: "assess-tech-01",
    title: "AI & Computational Imputation in Official Data",
    domain: "Technical",
    targetRole: "Senior Statistical Analyst",
    totalQuestions: 5,
    durationMinutes: 15,
    description: "Evaluates machine learning imputation, k-anonymity validation, and reproducible statistical pipelines."
  }
];

export const DEMO_ASSESSMENT_QUESTIONS = [
  {
    id: "q-01",
    assessmentId: "assess-diag-01",
    competencyId: "comp-stat-02",
    competencyName: "Sampling",
    question: "In a stratified two-stage sampling design for an urban survey, what is the primary purpose of selecting Primary Sampling Units (PSUs) with Probability Proportional to Size (PPS)?",
    options: [
      "To guarantee equal selection probability for all households across different city sizes",
      "To ensure equal probability of selection for households within each stratum while stabilizing sample workload",
      "To eliminate the need for calculating post-stratification sampling weights",
      "To minimize non-response bias in high-income census enumeration blocks"
    ],
    correctAnswer: 1,
    difficulty: "Intermediate",
    explanation: "Selecting PSUs with PPS combined with selecting a fixed number of households per PSU produces a self-weighting sample within each stratum, ensuring uniform overall inclusion probabilities and balanced fieldwork workloads."
  },
  {
    id: "q-02",
    assessmentId: "assess-diag-01",
    competencyId: "comp-tech-05",
    competencyName: "AI/ML",
    question: "When applying machine learning for missing value imputation in official survey data (e.g., Annual Survey of Industries), why is multiple imputation (MICE) generally preferred over single mean/mode replacement?",
    options: [
      "Single replacement always creates synthetic values that violate regulatory accounting bounds",
      "Multiple imputation reflects the statistical uncertainty of missing values and avoids artificially deflating variance",
      "Machine learning models cannot process numerical floats unless multiple imputation is conducted",
      "Single replacement increases the computational time exponentially on datasets with over 50,000 records"
    ],
    correctAnswer: 1,
    difficulty: "Advanced",
    explanation: "Single imputation artificially deflates standard errors and variance because it treats imputed values as known facts. Multiple imputation accounts for imputation uncertainty and yields valid confidence intervals."
  },
  {
    id: "q-03",
    assessmentId: "assess-diag-01",
    competencyId: "comp-gov-01",
    competencyName: "Data Privacy",
    question: "Under the Digital Personal Data Protection (DPDP) Act 2023, which measure is essential before publishing public-use microdata from official household surveys?",
    options: [
      "Removing direct identifiers only, retaining exact coordinates and high-resolution age/income attributes",
      "Conducting robust anonymization (such as k-anonymity and l-diversity) so individuals cannot be re-identified even when combined with auxiliary datasets",
      "Obtaining written consent from every sampled household after publishing the dataset online",
      "Encrypting the file with a password sent to pre-approved researchers only"
    ],
    correctAnswer: 1,
    difficulty: "Advanced",
    explanation: "Under the DPDP Act and global statistical best practices, de-identification requires addressing quasi-identifiers via k-anonymity and cell suppression to prevent linkage and re-identification attacks."
  },
  {
    id: "q-04",
    assessmentId: "assess-diag-01",
    competencyId: "comp-stat-03",
    competencyName: "Data Quality",
    question: "Which of the following describes a non-sampling error in national official statistics?",
    options: [
      "Variation arising from inspecting a subset rather than the entire target population",
      "Inaccuracy due to respondent recall bias, ambiguous questionnaire phrasing, or data entry errors",
      "Standard error reduction resulting from increased sample size allocation",
      "Margin of error inherent in a 95% confidence interval estimation"
    ],
    correctAnswer: 1,
    difficulty: "Foundational",
    explanation: "Non-sampling errors arise from survey design flaws, interviewer bias, faulty measurement instruments, respondent inaccuracies, or processing defects, independent of sample size."
  },
  {
    id: "q-05",
    assessmentId: "assess-diag-01",
    competencyId: "comp-mgt-05",
    competencyName: "Project Management",
    question: "During a nationwide quarterly survey round, 12% of field enumerator tablets fail to sync due to remote connectivity constraints. What is the recommended project management intervention?",
    options: [
      "Discard all unsynced schedules and recalculate national estimates with adjusted weights",
      "Activate the offline store-and-forward protocol with weekly batch cryptographic validation checkpoints",
      "Pause nationwide survey fieldwork until 5G towers are installed in affected rural areas",
      "Substitute non-responding rural clusters with adjacent urban enumeration blocks"
    ],
    correctAnswer: 1,
    difficulty: "Intermediate",
    explanation: "Robust CAPI/CATI operations must incorporate fault-tolerant offline data capture with cryptographic integrity checks and batch syncing to prevent field operational halt."
  }
];

export const DEMO_ASSESSMENT_ATTEMPTS = [
  {
    id: "attempt-01",
    userId: "officer_ananya_001",
    assessmentId: "assess-diag-01",
    score: 74,
    maxScore: 100,
    completedAt: "2026-08-25T15:30:00.000Z",
    domainScores: {
      "Statistical": 82,
      "Technical": 58,
      "Digital Governance": 64,
      "Behavioural & Managerial": 76
    }
  }
];

export const DEMO_QUESTION_BANK = [
  {
    id: "qb-01",
    question: "Which index in India is released by the NSO to measure short-term changes in the volume of industrial production?",
    domain: "Statistical",
    competencyId: "comp-stat-04",
    options: ["Consumer Price Index (CPI)", "Index of Industrial Production (IIP)", "Wholesale Price Index (WPI)", "Gross Domestic Product Deflator"],
    correctAnswer: 1,
    difficulty: "Foundational",
    verifiedByTrainer: true,
    usageCount: 142
  },
  {
    id: "qb-02",
    question: "In Python, which vectorization technique avoids slow Python loops when calculating weighted averages over 10 million census rows?",
    domain: "Technical",
    competencyId: "comp-tech-01",
    options: ["Using nested for-in statements", "NumPy np.average with weights array or Pandas dot product", "Iterating with iterrows()", "Converting DataFrame to a JSON string"],
    correctAnswer: 1,
    difficulty: "Intermediate",
    verifiedByTrainer: true,
    usageCount: 98
  },
  {
    id: "qb-03",
    question: "What is the primary objective of the National Data Governance Framework Policy (NDGFP)?",
    domain: "Digital Governance",
    competencyId: "comp-gov-03",
    options: ["Privatize all official statistical databases", "Modernize government data collection, promote non-personal data sharing, and spur AI research", "Mandate quarterly paper census publications across all districts", "Replace Central Statistical Office with commercial polling firms"],
    correctAnswer: 1,
    difficulty: "Intermediate",
    verifiedByTrainer: true,
    usageCount: 85
  },
  {
    id: "qb-04",
    question: "Which of the UN Fundamental Principles of Official Statistics emphasizes that official statistical agencies decide according to strictly professional considerations on methods and procedures?",
    domain: "Behavioural & Managerial",
    competencyId: "comp-mgt-03",
    options: ["Principle 1 - Relevance and Equal Access", "Principle 2 - Professionalism and Ethics", "Principle 5 - Sources of Official Statistics", "Principle 10 - International Cooperation"],
    correctAnswer: 1,
    difficulty: "Intermediate",
    verifiedByTrainer: true,
    usageCount: 110
  }
];

export const DEMO_UPLOADED_MATERIALS = [
  {
    id: "mat-01",
    trainerId: "trainer_rajesh_001",
    title: "MoSPI Guidelines on Non-Sampling Errors in Household Surveys (2025)",
    domain: "Statistical",
    fileName: "MoSPI_Guidelines_Non_Sampling_Errors_2025.pdf",
    fileSize: "4.2 MB",
    status: "PROCESSED",
    uploadDate: "2026-08-10T10:00:00.000Z",
    generatedCount: 18
  },
  {
    id: "mat-02",
    trainerId: "trainer_rajesh_001",
    title: "National Data Governance Framework Policy (NDGFP) Handbook",
    domain: "Digital Governance",
    fileName: "NDGFP_Handbook_v3.pdf",
    fileSize: "2.8 MB",
    status: "PROCESSED",
    uploadDate: "2026-08-18T14:30:00.000Z",
    generatedCount: 14
  },
  {
    id: "mat-03",
    trainerId: "trainer_rajesh_001",
    title: "AI and Machine Learning for Survey Data Validation",
    domain: "Technical",
    fileName: "AI_ML_Survey_Validation_Draft.pdf",
    fileSize: "6.1 MB",
    status: "PENDING_GENERATION",
    uploadDate: "2026-09-02T09:15:00.000Z",
    generatedCount: 0
  }
];

export const DEMO_GENERATED_QUESTIONS = [
  {
    id: "gen-01",
    materialId: "mat-01",
    competencyId: "comp-stat-03",
    question: "According to the MoSPI 2025 Guidelines, what is the most effective operational mechanism to curb interviewer fabrication in CAPI surveys?",
    options: [
      "Post-survey telephone confirmation audits on 10% randomly audited Primary Sampling Units",
      "Increasing surveyor daily stipend without monitoring",
      "Removing GPS timestamp capture to reduce battery consumption",
      "Conducting surveys only on weekends"
    ],
    correctAnswer: 0,
    status: "APPROVED",
    trainerFeedback: "High fidelity question; directly assesses CAPI data integrity checks."
  },
  {
    id: "gen-02",
    materialId: "mat-02",
    competencyId: "comp-gov-03",
    question: "Under NDGFP standards, which entity is designated as the repository for anonymized datasets curated for public AI research?",
    options: [
      "India Datasets Platform (IDP)",
      "Centralized Commercial Stock Exchange",
      "Private Vendor Cloud Silos",
      "District Collectorate Archives"
    ],
    correctAnswer: 0,
    status: "APPROVED",
    trainerFeedback: "Accurate alignment with MeitY and MoSPI data initiatives."
  },
  {
    id: "gen-03",
    materialId: "mat-01",
    competencyId: "comp-stat-01",
    question: "What is the recommended maximum duration for a household questionnaire module to avoid fatigue-induced respondent error?",
    options: ["45 to 60 minutes", "180 minutes", "240 minutes", "No limit exists"],
    correctAnswer: 0,
    status: "PENDING",
    trainerFeedback: "Review wording to align with 2026 NSSO standard schedule specifications."
  }
];

export const DEMO_LEARNER_PERFORMANCE = [
  {
    officerId: "officer_ananya_001",
    name: "Ananya Sharma",
    designation: "Statistical Officer",
    department: "Official Statistics",
    overallScore: 74,
    assessedCompetencies: 14,
    highGapsCount: 3,
    coursesEnrolled: 3,
    lastActive: "2026-09-08T16:40:00.000Z",
    domainAverages: {
      Statistical: 82,
      Technical: 58,
      "Digital Governance": 64,
      "Behavioural & Managerial": 76
    }
  },
  {
    officerId: "officer_vikram_002",
    name: "Vikram Sengupta",
    designation: "Junior Statistical Officer",
    department: "Field Operations Division (FOD)",
    overallScore: 68,
    assessedCompetencies: 12,
    highGapsCount: 5,
    coursesEnrolled: 2,
    lastActive: "2026-09-07T12:10:00.000Z",
    domainAverages: {
      Statistical: 75,
      Technical: 52,
      "Digital Governance": 60,
      "Behavioural & Managerial": 72
    }
  },
  {
    officerId: "officer_priya_003",
    name: "Priya Nair",
    designation: "Statistical Officer",
    department: "Price Statistics Division (CPI)",
    overallScore: 86,
    assessedCompetencies: 16,
    highGapsCount: 1,
    coursesEnrolled: 4,
    lastActive: "2026-09-09T08:50:00.000Z",
    domainAverages: {
      Statistical: 90,
      Technical: 78,
      "Digital Governance": 82,
      "Behavioural & Managerial": 84
    }
  },
  {
    officerId: "officer_rohit_004",
    name: "Rohit Meena",
    designation: "Senior Statistical Officer",
    department: "National Accounts Division (NAD)",
    overallScore: 81,
    assessedCompetencies: 15,
    highGapsCount: 2,
    coursesEnrolled: 3,
    lastActive: "2026-09-06T15:20:00.000Z",
    domainAverages: {
      Statistical: 88,
      Technical: 68,
      "Digital Governance": 74,
      "Behavioural & Managerial": 82
    }
  }
];

export const DEMO_COMPETENCY_HISTORY = [
  {
    id: "ch-01",
    userId: "officer_ananya_001",
    competencyId: "comp-stat-02",
    competencyName: "Sampling",
    previousScore: 3.0,
    newScore: 3.5,
    assessedAt: "2026-08-25T15:30:00.000Z",
    source: "DIAGNOSTIC",
    improvement: "+0.5 Level"
  },
  {
    id: "ch-02",
    userId: "officer_ananya_001",
    competencyId: "comp-tech-01",
    competencyName: "Python",
    previousScore: 2.5,
    newScore: 3.1,
    assessedAt: "2026-08-20T14:10:00.000Z",
    source: "QUIZ",
    improvement: "+0.6 Level"
  },
  {
    id: "ch-03",
    userId: "officer_ananya_001",
    competencyId: "comp-mgt-03",
    competencyName: "Ethics",
    previousScore: 4.2,
    newScore: 4.8,
    assessedAt: "2026-08-15T11:00:00.000Z",
    source: "TRAINING",
    improvement: "+0.6 Level"
  }
];

export const DEMO_RADAR_DATA = [
  { domain: "Survey Design", current: 3.8, target: 4.0, fullMark: 5 },
  { domain: "Sampling", current: 3.5, target: 4.0, fullMark: 5 },
  { domain: "Data Quality", current: 4.2, target: 5.0, fullMark: 5 },
  { domain: "Official Stats", current: 4.0, target: 4.0, fullMark: 5 },
  { domain: "Python", current: 3.1, target: 4.0, fullMark: 5 },
  { domain: "SQL", current: 3.4, target: 4.0, fullMark: 5 },
  { domain: "Visualization", current: 3.6, target: 4.0, fullMark: 5 },
  { domain: "GIS", current: 2.2, target: 3.0, fullMark: 5 },
  { domain: "AI/ML", current: 1.8, target: 4.0, fullMark: 5 },
  { domain: "Data Privacy", current: 2.1, target: 4.0, fullMark: 5 },
  { domain: "Cybersecurity", current: 2.8, target: 3.0, fullMark: 5 },
  { domain: "Digital Gov", current: 3.2, target: 4.0, fullMark: 5 },
  { domain: "Communication", current: 3.6, target: 4.0, fullMark: 5 },
  { domain: "Leadership", current: 3.0, target: 3.0, fullMark: 5 },
  { domain: "Ethics", current: 4.8, target: 5.0, fullMark: 5 },
  { domain: "Decision Making", current: 3.5, target: 4.0, fullMark: 5 },
  { domain: "Project Mgmt", current: 2.4, target: 4.0, fullMark: 5 }
];
`;

fs.appendFileSync('server/data/demoSeedData.js', part3, 'utf8');

// Also copy to client-side mockDataset.js
fs.copyFileSync('server/data/demoSeedData.js', 'src/data/mockDataset.js');
console.log('All demo seed data generated and synced to both server and client!');
