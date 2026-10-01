# StatSkill AI (Smart India Hackathon Problem Statement 26101)

> **AI-Powered Competency Intelligence & Personalized Learning Platform for India'\''s Official Statistical System (MoSPI / NSO / NSSTA)**

StatSkill AI is an enterprise-grade web application that implements an end-to-end competency loop for the Subordinate Statistical Service (SSS) and Indian Statistical Service (ISS):

$$\text{MEASURE} \longrightarrow \text{DIAGNOSE} \longrightarrow \text{LEARN} \longrightarrow \text{REASSESS}$$

---

## Key Features

1. **Role-Based Workflows**:
   - **Officer Experience**: Tailored for statistical cadre members (demonstrated with officer **Ananya Sharma**). Features an overall competency benchmark, Recharts Radar chart across 4 domains, priority gap cards, AI course recommendations, and career milestone tracking towards **Senior Statistical Analyst**.
   - **Trainer / Faculty Experience**: Tailored for NSSTA / MoSPI instructors (demonstrated with **Dr. Rajesh Verma**). Features cohort psychometrics, curriculum material ingestion, AI MCQ generation foundation, faculty question verification queue, and question bank management.

2. **Server-Side Security & Trainer Validation**:
   - Arbitrary users cannot become trainers without authorization.
   - The trainer access code is stored strictly in server-side environment variables (`STATSKILL_TRAINER_KEY=TRAINER-MOSPI-2025`) and validated via `POST /api/auth/validate-trainer`. It is never exposed in client source code.

3. **Dual-Engine Persistence & 17 Firestore Collections**:
   - Built with the modular Firebase SDK (`firebase/auth`, `firebase/firestore`).
   - Implements all 17 specified collections: `users`, `officer_profiles`, `competencies`, `roles`, `role_competencies`, `assessments`, `assessment_questions`, `assessment_attempts`, `skill_gaps`, `course_catalog`, `recommendations`, `learning_progress`, `uploaded_materials`, `generated_questions`, `question_bank`, `quiz_attempts`, `competency_history`.
   - Incorporates a local demo state engine that seeds the complete MoSPI dataset immediately, ensuring out-of-the-box testability even before live cloud credentials are provided.

4. **Gemini Interactions API Integration (`@google/genai`)**:
   - Server-side integration using the official `@google/genai` SDK and the current **Gemini Interactions API** (`client.interactions.create` with `model: "gemini-3.7-flash"`).
   - `GEMINI_API_KEY` is kept server-side only.

---

## 4 Competency Domains (17 Competencies)

1. **Statistical**: Survey Design, Sampling, Data Quality, Official Statistics
2. **Technical**: Python, SQL, Data Visualization, GIS, AI/ML
3. **Digital Governance**: Data Privacy (DPDP Act 2023), Cybersecurity, Digital Governance
4. **Behavioural & Managerial**: Communication, Leadership, Ethics, Decision Making, Project Management

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Inspect `.env` (pre-configured with defaults):
- `STATSKILL_TRAINER_KEY=TRAINER-MOSPI-2025`
- `PORT=5000`
- `GEMINI_API_KEY=` *(Optional: add your Gemini API key)*
- `VITE_FIREBASE_API_KEY=` *(Optional: add live Firebase credentials)*

### 3. Run Development Server
```bash
# Starts both Backend API (Port 5000) and Frontend (Port 3000):
npm run dev
```

Or run separately:
```bash
# Terminal 1: Backend Express API Server
npm run dev:server

# Terminal 2: Frontend Vite Dev Server
npm run dev:client
```

### 4. Build for Production
```bash
npm run build
```

---

## Prototype Evaluation Accounts

- **Officer**: Ananya Sharma (Statistical Officer, Official Statistics)
- **Trainer**: Dr. Rajesh Verma (NSSTA Senior Faculty, Access Code: `TRAINER-MOSPI-2025`)
