import fs from 'fs';
import path from 'path';

const data = `// Comprehensive Demo Data for India's Official Statistical System (SIH 26101)

export const DEMO_DOMAINS = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial"
];

export const DEMO_COMPETENCIES = [
  // 1. Statistical
  {
    id: "comp-stat-01",
    name: "Survey Design",
    domain: "Statistical",
    description: "Formulation of survey schedules, questionnaire design, pilot testing, and survey protocols for nationwide statistical operations (e.g., NSS, PLFS).",
    maxLevel: 5
  },
  {
    id: "comp-stat-02",
    name: "Sampling",
    domain: "Statistical",
    description: "Stratified multi-stage sampling design, probability proportional to size (PPS), sample allocation, and sampling weight calculation.",
    maxLevel: 5
  },
  {
    id: "comp-stat-03",
    name: "Data Quality",
    domain: "Statistical",
    description: "Statistical data auditing, outlier detection, logical consistency checks, non-sampling error minimization, and validation protocols.",
    maxLevel: 5
  },
  {
    id: "comp-stat-04",
    name: "Official Statistics",
    domain: "Statistical",
    description: "Understanding National Accounts Statistics, CPI, IIP, Annual Survey of Industries (ASI), and international statistical standards (UN-SDGs, SNA 2008).",
    maxLevel: 5
  },

  // 2. Technical
  {
    id: "comp-tech-01",
    name: "Python",
    domain: "Technical",
    description: "Scientific computing, pandas, numpy, automated data cleaning, and statistical scripting for large census/survey datasets.",
    maxLevel: 5
  },
  {
    id: "comp-tech-02",
    name: "SQL",
    domain: "Technical",
    description: "Relational database querying, aggregation, indexing, and management of massive administrative and survey databases.",
    maxLevel: 5
  },
  {
    id: "comp-tech-03",
    name: "Data Visualization",
    domain: "Technical",
    description: "Communicating statistical insights using dashboards, geospatial heatmaps, thematic charts, and publications.",
    maxLevel: 5
  },
  {
    id: "comp-tech-04",
    name: "GIS",
    domain: "Technical",
    description: "Geographic Information Systems, spatial sampling, village/ward boundary shapefiles, remote sensing integration with official surveys.",
    maxLevel: 5
  },
  {
    id: "comp-tech-05",
    name: "AI/ML",
    domain: "Technical",
    description: "Machine learning for automated imputation, record linkage, synthetic data generation, and anomaly detection in national accounts.",
    maxLevel: 5
  },

  // 3. Digital Governance
  {
    id: "comp-gov-01",
    name: "Data Privacy",
    domain: "Digital Governance",
    description: "Anonymization techniques, k-anonymity, differential privacy, and compliance with the Digital Personal Data Protection (DPDP) Act 2023.",
    maxLevel: 5
  },
  {
    id: "comp-gov-02",
    name: "Cybersecurity",
    domain: "Digital Governance",
    description: "Data security protocols, access control, encrypted transmission of field data, and CERT-In guidelines for statistical portals.",
    maxLevel: 5
  },
  {
    id: "comp-gov-03",
    name: "Digital Governance",
    domain: "Digital Governance",
    description: "National Data Governance Framework Policy (NDGFP), India Datasets program, open government data standards (data.gov.in), and e-Office.",
    maxLevel: 5
  },

  // 4. Behavioural & Managerial
  {
    id: "comp-mgt-01",
    name: "Communication",
    domain: "Behavioural & Managerial",
    description: "Drafting press releases, statistical briefs, policy synthesis, and presenting findings to administrative ministries.",
    maxLevel: 5
  },
  {
    id: "comp-mgt-02",
    name: "Leadership",
    domain: "Behavioural & Managerial",
    description: "Leading field survey teams, mentoring junior statistical officers, fostering inter-departmental collaboration.",
    maxLevel: 5
  },
  {
    id: "comp-mgt-03",
    name: "Ethics",
    domain: "Behavioural & Managerial",
    description: "Adherence to the UN Fundamental Principles of Official Statistics, integrity in data reporting, objectivity, and impartiality.",
    maxLevel: 5
  },
  {
    id: "comp-mgt-04",
    name: "Decision Making",
    domain: "Behavioural & Managerial",
    description: "Evidence-based decision frameworks, statistical hypothesis interpretation, resolving field operational bottlenecks.",
    maxLevel: 5
  },
  {
    id: "comp-mgt-05",
    name: "Project Management",
    domain: "Behavioural & Managerial",
    description: "Managing timelines, resource allocation, field surveyor logistics, and quality assurance milestones for large-scale survey rounds.",
    maxLevel: 5
  }
];

export const DEMO_ROLES = [
  {
    id: "role-so",
    title: "Statistical Officer",
    department: "Official Statistics",
    description: "Conducts data validation, preliminary sampling audits, field supervision, and survey report synthesis.",
    targetLevel: 3
  },
  {
    id: "role-ssa",
    title: "Senior Statistical Analyst",
    department: "National Accounts & Survey Analytics",
    description: "Leads econometric modeling, advanced survey sampling designs, AI-assisted imputation, and inter-ministerial statistical advisories.",
    targetLevel: 4
  },
  {
    id: "role-trainer",
    title: "Senior Statistical Trainer / Faculty",
    department: "National Statistical Systems Training Academy (NSSTA)",
    description: "Curates competency frameworks, evaluates statistical capacity, reviews question banks, and designs modernization curricula.",
    targetLevel: 5
  }
];

export const DEMO_ROLE_COMPETENCIES = [
  { roleId: "role-ssa", competencyId: "comp-stat-01", targetLevel: 4, weight: 1.2 },
  { roleId: "role-ssa", competencyId: "comp-stat-02", targetLevel: 4, weight: 1.3 },
  { roleId: "role-ssa", competencyId: "comp-stat-03", targetLevel: 5, weight: 1.4 },
  { roleId: "role-ssa", competencyId: "comp-stat-04", targetLevel: 4, weight: 1.2 },
  { roleId: "role-ssa", competencyId: "comp-tech-01", targetLevel: 4, weight: 1.3 },
  { roleId: "role-ssa", competencyId: "comp-tech-02", targetLevel: 4, weight: 1.2 },
  { roleId: "role-ssa", competencyId: "comp-tech-03", targetLevel: 4, weight: 1.1 },
  { roleId: "role-ssa", competencyId: "comp-tech-04", targetLevel: 3, weight: 1.0 },
  { roleId: "role-ssa", competencyId: "comp-tech-05", targetLevel: 4, weight: 1.4 },
  { roleId: "role-ssa", competencyId: "comp-gov-01", targetLevel: 4, weight: 1.3 },
  { roleId: "role-ssa", competencyId: "comp-gov-02", targetLevel: 3, weight: 1.0 },
  { roleId: "role-ssa", competencyId: "comp-gov-03", targetLevel: 4, weight: 1.1 },
  { roleId: "role-ssa", competencyId: "comp-mgt-01", targetLevel: 4, weight: 1.1 },
  { roleId: "role-ssa", competencyId: "comp-mgt-02", targetLevel: 3, weight: 1.0 },
  { roleId: "role-ssa", competencyId: "comp-mgt-03", targetLevel: 5, weight: 1.2 },
  { roleId: "role-ssa", competencyId: "comp-mgt-04", targetLevel: 4, weight: 1.1 },
  { roleId: "role-ssa", competencyId: "comp-mgt-05", targetLevel: 4, weight: 1.2 }
];

export const DEMO_OFFICER_USER = {
  uid: "officer_ananya_001",
  email: "ananya.sharma@mospi.gov.in",
  displayName: "Ananya Sharma",
  role: "OFFICER",
  photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  createdAt: "2025-01-15T09:00:00.000Z",
  lastLogin: "2026-09-09T10:30:00.000Z"
};

export const DEMO_OFFICER_PROFILE = {
  userId: "officer_ananya_001",
  fullName: "Ananya Sharma",
  designation: "Statistical Officer",
  department: "Official Statistics",
  yearsOfExperience: 4,
  education: "Master's in Statistics (Indian Statistical Institute)",
  currentRole: "Statistical Officer (Survey Quality & Analysis)",
  careerGoal: "Senior Statistical Analyst",
  previousTraining: "National Accounts & Macroeconomic Aggregates, Basic Sampling Techniques (NASA), Advance Excel & R in Official Statistics (CSO)",
  phone: "+91 98765 43210",
  employeeId: "MOSPI-SO-2022-841",
  cadre: "Subordinate Statistical Service (SSS)",
  officeLocation: "Sardar Patel Bhawan, New Delhi",
  updatedAt: "2026-09-01T12:00:00.000Z"
};

export const DEMO_TRAINER_USER = {
  uid: "trainer_rajesh_001",
  email: "dr.rajesh.verma@nssta.gov.in",
  displayName: "Dr. Rajesh Verma",
  role: "TRAINER",
  photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  createdAt: "2024-06-01T08:00:00.000Z",
  lastLogin: "2026-09-09T14:15:00.000Z"
};
`;

fs.writeFileSync('server/data/demoSeedData.js', data, 'utf8');
console.log('Part 1 written successfully');
