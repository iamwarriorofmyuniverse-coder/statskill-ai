import fs from 'fs';

const part2 = `
export const DEMO_SKILL_GAPS = [
  {
    id: "gap-01",
    userId: "officer_ananya_001",
    competencyId: "comp-tech-05",
    competencyName: "AI/ML",
    domain: "Technical",
    currentLevel: 1.8,
    targetLevel: 4.0,
    gapMagnitude: 2.2,
    priority: "HIGH",
    status: "IN_PROGRESS",
    notes: "Critical requirement for automated imputation in large NSS survey rounds."
  },
  {
    id: "gap-02",
    userId: "officer_ananya_001",
    competencyId: "comp-gov-01",
    competencyName: "Data Privacy",
    domain: "Digital Governance",
    currentLevel: 2.1,
    targetLevel: 4.0,
    gapMagnitude: 1.9,
    priority: "HIGH",
    status: "NOT_STARTED",
    notes: "Compliance with Digital Personal Data Protection (DPDP) Act 2023 for microdata releases."
  },
  {
    id: "gap-03",
    userId: "officer_ananya_001",
    competencyId: "comp-mgt-05",
    competencyName: "Project Management",
    domain: "Behavioural & Managerial",
    currentLevel: 2.4,
    targetLevel: 4.0,
    gapMagnitude: 1.6,
    priority: "HIGH",
    status: "IN_PROGRESS",
    notes: "Managing multi-state field enumerator teams and survey logistics."
  },
  {
    id: "gap-04",
    userId: "officer_ananya_001",
    competencyId: "comp-tech-01",
    competencyName: "Python",
    domain: "Technical",
    currentLevel: 3.1,
    targetLevel: 4.0,
    gapMagnitude: 0.9,
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    notes: "Enhance automation pipelines using modern pandas and polars workflows."
  },
  {
    id: "gap-05",
    userId: "officer_ananya_001",
    competencyId: "comp-tech-04",
    competencyName: "GIS",
    domain: "Technical",
    currentLevel: 2.2,
    targetLevel: 3.0,
    gapMagnitude: 0.8,
    priority: "MEDIUM",
    status: "NOT_STARTED",
    notes: "Geospatial boundary verification for primary sampling units (PSUs)."
  },
  {
    id: "gap-06",
    userId: "officer_ananya_001",
    competencyId: "comp-stat-02",
    competencyName: "Sampling",
    domain: "Statistical",
    currentLevel: 3.5,
    targetLevel: 4.0,
    gapMagnitude: 0.5,
    priority: "LOW",
    status: "COMPLETED",
    notes: "Well-grounded; minor refresh required on variance estimation."
  }
];

export const DEMO_COURSE_CATALOG = [
  {
    id: "course-01",
    title: "AI & Modern Machine Learning in Official Statistics",
    domain: "Technical",
    competenciesCovered: ["comp-tech-05", "comp-tech-01"],
    provider: "NSSTA & UN-DESA",
    durationHours: 24,
    level: "Intermediate",
    rating: 4.8,
    enrollmentCount: 340,
    description: "Hands-on implementation of automated missing value imputation (MICE, Random Forest), outlier identification, and record linkage for national statistical censuses.",
    modulesCount: 6,
    link: "https://nssta.gov.in/courses/ai-ml-statistics"
  },
  {
    id: "course-02",
    title: "DPDP Act 2023 & Statistical Data Privacy Architecture",
    domain: "Digital Governance",
    competenciesCovered: ["comp-gov-01", "comp-gov-03"],
    provider: "MeitY & MoSPI",
    durationHours: 16,
    level: "Advanced",
    rating: 4.9,
    enrollmentCount: 512,
    description: "Comprehensive guide to microdata de-identification, k-anonymity, differential privacy algorithms, and statutory compliance under the DPDP Act 2023.",
    modulesCount: 4,
    link: "https://igotkarmayogi.gov.in/learn/dpdp-official-data"
  },
  {
    id: "course-03",
    title: "Project Management for Large-Scale Survey Rounds",
    domain: "Behavioural & Managerial",
    competenciesCovered: ["comp-mgt-05", "comp-mgt-02"],
    provider: "Indian Institute of Public Administration (IIPA)",
    durationHours: 20,
    level: "Intermediate",
    rating: 4.7,
    enrollmentCount: 220,
    description: "Milestone planning, field team allocation, real-time CAPI data monitoring dashboards, and quality audit workflows for NSS/PLFS operations.",
    modulesCount: 5,
    link: "https://iipa.org.in/survey-management"
  },
  {
    id: "course-04",
    title: "Advanced Survey Sampling & Variance Estimation",
    domain: "Statistical",
    competenciesCovered: ["comp-stat-02", "comp-stat-01"],
    provider: "Indian Statistical Institute (ISI) Kolkata",
    durationHours: 30,
    level: "Advanced",
    rating: 4.9,
    enrollmentCount: 680,
    description: "Stratified multi-stage designs, PPS sampling, jackknife and bootstrap variance estimators for complex administrative data.",
    modulesCount: 8,
    link: "https://isical.ac.in/programs/survey-sampling-adv"
  },
  {
    id: "course-05",
    title: "Geospatial Analysis & GIS for Survey Sampling Units",
    domain: "Technical",
    competenciesCovered: ["comp-tech-04", "comp-tech-03"],
    provider: "ISRO - Indian Institute of Remote Sensing (IIRS)",
    durationHours: 18,
    level: "Intermediate",
    rating: 4.6,
    enrollmentCount: 190,
    description: "Integration of QGIS, village shapefiles, and satellite imagery for delineating Primary Sampling Units (PSUs) and urban frame surveys.",
    modulesCount: 4,
    link: "https://iirs.gov.in/edusat-gis-statistics"
  },
  {
    id: "course-06",
    title: "Ethics and Objectivity in National Statistical Reporting",
    domain: "Behavioural & Managerial",
    competenciesCovered: ["comp-mgt-03", "comp-mgt-01"],
    provider: "National Statistical Commission (NSC)",
    durationHours: 10,
    level: "Foundational",
    rating: 4.9,
    enrollmentCount: 850,
    description: "United Nations Fundamental Principles of Official Statistics, conflict of interest avoidance, transparent metadata documentation, and public accountability.",
    modulesCount: 3,
    link: "https://mospi.gov.in/nsc-ethics-module"
  }
];

export const DEMO_RECOMMENDATIONS = [
  {
    id: "rec-01",
    userId: "officer_ananya_001",
    courseId: "course-01",
    competencyId: "comp-tech-05",
    relevanceScore: 96,
    priority: "HIGH",
    aiRationale: "Directly bridges your #1 High Priority Gap in AI/ML (Current: 1.8 -> Target: 4.0) required for Senior Statistical Analyst eligibility.",
    status: "ENROLLED"
  },
  {
    id: "rec-02",
    userId: "officer_ananya_001",
    courseId: "course-02",
    competencyId: "comp-gov-01",
    relevanceScore: 92,
    priority: "HIGH",
    aiRationale: "Mandatory statutory knowledge for anonymizing NSS microdata under the DPDP Act 2023.",
    status: "RECOMMENDED"
  },
  {
    id: "rec-03",
    userId: "officer_ananya_001",
    courseId: "course-03",
    competencyId: "comp-mgt-05",
    relevanceScore: 88,
    priority: "HIGH",
    aiRationale: "Strengthens managerial oversight for field enumerators, essential for upcoming 79th Round survey leadership.",
    status: "IN_PROGRESS"
  },
  {
    id: "rec-04",
    userId: "officer_ananya_001",
    courseId: "course-05",
    competencyId: "comp-tech-04",
    relevanceScore: 78,
    priority: "MEDIUM",
    aiRationale: "Expands GIS spatial sampling techniques for urban frame survey digitization.",
    status: "RECOMMENDED"
  }
];

export const DEMO_LEARNING_PROGRESS = [
  {
    id: "lp-01",
    userId: "officer_ananya_001",
    courseId: "course-01",
    progressPercent: 65,
    status: "IN_PROGRESS",
    completedModules: 4,
    totalModules: 6,
    timeSpentHours: 15.5,
    lastAccessed: "2026-09-08T16:40:00.000Z"
  },
  {
    id: "lp-02",
    userId: "officer_ananya_001",
    courseId: "course-03",
    progressPercent: 40,
    status: "IN_PROGRESS",
    completedModules: 2,
    totalModules: 5,
    timeSpentHours: 8.0,
    lastAccessed: "2026-09-06T11:20:00.000Z"
  },
  {
    id: "lp-03",
    userId: "officer_ananya_001",
    courseId: "course-06",
    progressPercent: 100,
    status: "COMPLETED",
    completedModules: 3,
    totalModules: 3,
    timeSpentHours: 10.0,
    lastAccessed: "2026-08-20T14:10:00.000Z"
  }
];
`;

fs.appendFileSync('server/data/demoSeedData.js', part2, 'utf8');
console.log('Part 2 appended successfully');
