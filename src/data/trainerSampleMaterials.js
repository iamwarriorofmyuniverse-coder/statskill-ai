/**
 * StatSkill AI - Official MoSPI Training Material Presets
 * Authentic domain content for testing and demonstration of Gemini MCQ Generation
 */

export const SAMPLE_TRAINING_MATERIALS = [
  {
    id: "sample-txt-01",
    fileName: "MoSPI NSS 79th Round Operational Survey Guidelines.txt",
    fileType: "txt",
    domain: "Statistical",
    competency: "Survey Design",
    description: "Standardized field protocols, listing schedules, and non-sampling error minimization procedures for national socioeconomic surveys.",
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
NATIONAL STATISTICAL OFFICE (NSO) - FIELD OPERATIONS DIVISION (FOD)

OPERATIONAL GUIDELINES: NSS 79TH ROUND HOUSEHOLD SOCIO-ECONOMIC SURVEY

1. OBJECTIVES AND COVERAGE:
The primary objective of the 79th Round Socio-Economic Survey is to collect reliable, disaggregated data on AYUSH utilization, non-formal education participation, and household domestic tourism expenditure. The survey covers both rural and urban sectors across all States and Union Territories of India.

2. SAMPLE DESIGN AND SELECTION METHODOLOGY:
A stratified two-stage design is adopted for this survey.
- Primary Sampling Units (PSUs): The first stage units are Census Villages (Panchayat Wards) in rural areas and Urban Frame Survey (UFS) blocks in urban sectors.
- Ultimate Stage Units (USUs): Households are selected as second-stage sampling units using circular systematic sampling after comprehensive house listing.
- Large Village Sub-Division: In rural PSUs with population exceeding 1,200 individuals, the village must be subdivided into two or more equal hamlet-groups with equal population share to maintain field listing efficiency.

3. DATA QUALITY ASSURANCE AND CANVASSING PROTOCOL:
- Interviewers must conduct personal face-to-face interviews using Computer-Assisted Personal Interviewing (CAPI) tablets.
- In cases of temporary absence, a minimum of three callback visits must be conducted before categorizing a sample household as 'Casualty / Non-Response'.
- Substitution of sample households without prior written approval from the Senior Statistical Officer (SSO) is strictly prohibited.
- High-frequency automated data validation checks execute range, consistency, and logical skip checks during field data collection.

4. CONFIDENTIALITY AND ETHICAL DIRECTIVES:
All information collected during field enumeration is strictly confidential under the Collection of Statistics Act 2008. Individual microdata must never be divulged to local village authorities, tax departments, or private commercial agencies. Field investigators must obtain informed consent from the principal earner or knowledgeable adult household member prior to canvassing schedule questions.`
  },
  {
    id: "sample-txt-02",
    fileName: "DPDP Act 2023 Microdata Anonymization Standards.txt",
    fileType: "txt",
    domain: "Digital Governance",
    competency: "Data Privacy",
    description: "Statutory requirements under the Digital Personal Data Protection Act 2023 for statistical microdata anonymization and public dissemination.",
    content: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION (MoSPI)
GOVERNMENT OF INDIA

DIRECTIVE: DATA PRIVACY & PSEUDONYMIZATION PROTOCOLS UNDER DPDP ACT 2023

1. REGULATORY CONTEXT:
The Digital Personal Data Protection (DPDP) Act 2023 establishes mandatory obligations on Data Fiduciaries collecting or processing personal identifiers of citizens. Official statistical agencies acting as Data Fiduciaries must implement strict technical safeguards before archiving or releasing public-use microdata.

2. MANDATORY ANONYMIZATION PROTOCOLS:
- Direct Identifiers: Names, Aadhaar numbers, PAN identifiers, mobile phone numbers, exact postal addresses, and geo-coordinates must be permanently purged from all dissemination files.
- Quasi-Identifiers: Demographic variables such as Village Name, Precise Date of Birth, Rare Occupation Codes, and Exact Landholdings must undergo k-anonymity (minimum k = 5) and l-diversity algorithms.
- Extreme Value Top-Coding: In financial and income distributions, values exceeding the 99th percentile must be top-coded to prevent outlier identification.

3. DATA BREACH NOTIFICATION:
In accordance with CERT-In and DPDP mandates, any unauthorized access, accidental leakage, or cryptographic key compromise involving statistical microdata must be reported to the Data Protection Board of India and CERT-In within 6 hours of detection.

4. PENALTIES FOR NON-COMPLIANCE:
Failure to enforce reasonable security safeguards against data breaches carries statutory financial penalties up to INR 250 Crores under Section 33 of the DPDP Act 2023.`
  },
  {
    id: "sample-txt-03",
    fileName: "Python and SQL Modernization for National Accounts.txt",
    fileType: "txt",
    domain: "Technical",
    competency: "Python",
    description: "Technical instructions for automating GDP compilation pipelines, input-output tables, and database aggregation queries.",
    content: `NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)
TECHNICAL TRAINING MANUAL: COMPUTATIONAL STATISTICAL MODERNIZATION

MODULE: AUTOMATING PIPELINES USING PYTHON AND SQL IN OFFICIAL STATISTICAL SYSTEMS

1. DATA INGESTION AND WRANGLING WITH PYTHON:
- Python (specifically Pandas, Polars, and NumPy) is the standard computational tool for ingesting high-volume Administrative Data (GSTN transactions, MCA-21 company filings, and RBI banking data) for quarterly Gross Value Added (GVA) estimation.
- All ingestion scripts must validate schema data types and handle missing records using reproducible imputation pipelines (e.g. IterativeImputer or KNNImputer) rather than arbitrary deletion.
- Script outputs must be version-controlled with Git and accompanied by SHA-256 checksums to guarantee audit reproducibility.

2. SQL DATABASE AGGREGATION BEST PRACTICES:
- Official survey data stored in PostgreSQL / MySQL repositories must use indexed queries with EXPLAIN ANALYZE execution profiling.
- Window functions (ROW_NUMBER(), DENSE_RANK(), LAG(), LEAD()) must be utilized for multi-year panel analysis across ASI (Annual Survey of Industries) datasets.
- Common Table Expressions (CTEs) are preferred over deeply nested subqueries to enhance code maintainability and collaborative review.

3. DATA VISUALIZATION STANDARDS:
- Macroeconomic dashboards must follow the MoSPI Style Guide: consistent color palettes, explicit axes units (e.g., INR Crores at Constant 2011-12 Prices), and clear data source citations in chart footers.`
  }
];
