import { db } from "../firebase/config.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import * as demoData from "../data/mockDataset.js";
import { MASTER_ASSESSMENT_METADATA, MASTER_ASSESSMENT_QUESTIONS } from "../data/assessmentQuestions.js";
import { IGOT_COURSE_CATALOGUE, PROTOTYPE_CATALOGUE_DISCLAIMER } from "../data/igotCoursesCatalogue.js";
import { generateCourseRecommendations } from "./recommendationEngine.js";
import { classifyGap, STATISTICAL_OFFICER_REQUIREMENTS } from "./assessmentScoring.js";

// Helper to safely load localStorage if in browser environment
function loadSaved(key, fallback) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const v = window.localStorage.getItem(key);
      if (v) return JSON.parse(v);
    } catch (e) {
      console.warn("localStorage read failed:", e);
    }
  }
  return fallback;
}

function saveLocal(key, value) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage write failed:", e);
    }
  }
}

// Initial recommendation generation
const initialRecs = generateCourseRecommendations({
  skillGaps: demoData.DEMO_SKILL_GAPS,
  officerProfile: demoData.DEMO_OFFICER_PROFILE,
  learningProgress: demoData.DEMO_LEARNING_PROGRESS,
  courseCatalogue: IGOT_COURSE_CATALOGUE
});

// In-memory / browser persistent prototype store
let localStore = {
  users: [demoData.DEMO_OFFICER_USER, demoData.DEMO_TRAINER_USER],
  officer_profiles: [demoData.DEMO_OFFICER_PROFILE],
  competencies: [...demoData.DEMO_COMPETENCIES],
  roles: [...demoData.DEMO_ROLES],
  role_competencies: [...demoData.DEMO_ROLE_COMPETENCIES],
  assessments: [
    MASTER_ASSESSMENT_METADATA,
    ...demoData.DEMO_ASSESSMENTS
  ],
  assessment_questions: [...MASTER_ASSESSMENT_QUESTIONS],
  assessment_attempts: loadSaved("statskill_attempts", [...demoData.DEMO_ASSESSMENT_ATTEMPTS]),
  skill_gaps: loadSaved("statskill_skill_gaps", [...demoData.DEMO_SKILL_GAPS]),
  course_catalog: [...IGOT_COURSE_CATALOGUE],
  recommendations: loadSaved("statskill_recommendations", initialRecs),
  learning_progress: [...demoData.DEMO_LEARNING_PROGRESS],
  uploaded_materials: [...demoData.DEMO_UPLOADED_MATERIALS],
  generated_questions: [...demoData.DEMO_GENERATED_QUESTIONS],
  question_bank: [...demoData.DEMO_QUESTION_BANK],
  quiz_attempts: [
    { id: "quiz-att-1", userId: "officer_ananya_001", quizTitle: "Sampling & PPSWOR Check", score: 85, completedAt: "2026-08-20T10:00:00Z" }
  ],
  competency_history: loadSaved("statskill_competency_history", [...demoData.DEMO_COMPETENCY_HISTORY])
};

// 1. Users
export async function getFirestoreUser(uid) {
  if (db) {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.users.find(u => u.uid === uid) || null;
}

export async function saveFirestoreUser(userData) {
  if (db) {
    try {
      await setDoc(doc(db, "users", userData.uid), userData, { merge: true });
    } catch (e) {
      console.warn("Firestore write failed, saving to prototype store:", e);
    }
  }
  const idx = localStore.users.findIndex(u => u.uid === userData.uid);
  if (idx >= 0) {
    localStore.users[idx] = { ...localStore.users[idx], ...userData };
  } else {
    localStore.users.push(userData);
  }
  return userData;
}

// 2. Officer Profiles
export async function getOfficerProfile(userId) {
  if (db) {
    try {
      const snap = await getDoc(doc(db, "officer_profiles", userId));
      if (snap.exists()) return snap.data();
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.officer_profiles.find(p => p.userId === userId) || demoData.DEMO_OFFICER_PROFILE;
}

export async function saveOfficerProfile(userId, profileData) {
  const payload = {
    ...profileData,
    userId,
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      await setDoc(doc(db, "officer_profiles", userId), payload, { merge: true });
    } catch (e) {
      console.warn("Firestore write failed, saving to prototype store:", e);
    }
  }

  const idx = localStore.officer_profiles.findIndex(p => p.userId === userId);
  if (idx >= 0) {
    localStore.officer_profiles[idx] = { ...localStore.officer_profiles[idx], ...payload };
  } else {
    localStore.officer_profiles.push(payload);
  }
  return payload;
}

// 3. Competencies & Radar Data
export async function getCompetencies() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "competencies"));
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.competencies;
}

export async function getRadarCompetencyData(userId) {
  const currentGaps = localStore.skill_gaps.filter(g => !userId || g.userId === userId);
  if (currentGaps.length > 0) {
    return currentGaps.map(g => {
      const currentLevel5 = g.targetLevel > 5
        ? Number(((g.currentLevel / 100) * 5).toFixed(1))
        : Number(Number(g.currentLevel).toFixed(1));
      const targetLevel5 = g.targetLevel > 5
        ? Number(((g.targetLevel / 100) * 5).toFixed(1))
        : Number(Number(g.targetLevel).toFixed(1));
      return {
        domain: g.competencyName,
        current: currentLevel5,
        target: targetLevel5,
        fullMark: 5
      };
    });
  }
  return demoData.DEMO_RADAR_DATA;
}

// 4. Skill Gaps (DIAGNOSE Phase)
export async function getSkillGaps(userId) {
  if (db) {
    try {
      const q = query(collection(db, "skill_gaps"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.skill_gaps.filter(g => !userId || g.userId === userId);
}

export async function saveSkillGaps(userId, gaps) {
  if (db) {
    try {
      for (const gap of gaps) {
        await setDoc(doc(db, "skill_gaps", gap.id), { ...gap, userId }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore batch write for skill_gaps failed:", e);
    }
  }

  localStore.skill_gaps = [
    ...gaps.map(g => ({ ...g, userId })),
    ...localStore.skill_gaps.filter(g => g.userId !== userId && !gaps.some(ng => ng.competencyId === g.competencyId))
  ];
  saveLocal("statskill_skill_gaps", localStore.skill_gaps);
  return localStore.skill_gaps;
}

// 5. Course Catalog & Recommendations (LEARN Phase)
export async function getCourseCatalog() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "course_catalog"));
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.course_catalog;
}

/**
 * Generate and store personalized recommendations in Firestore
 */
export async function generateAndSaveRecommendations(userId, profile, customGaps, customProgress) {
  const currentGaps = customGaps || await getSkillGaps(userId);
  const currentProfile = profile || await getOfficerProfile(userId);
  const currentProgress = customProgress || await getLearningProgress(userId);

  const recs = generateCourseRecommendations({
    skillGaps: currentGaps,
    officerProfile: currentProfile,
    learningProgress: currentProgress,
    courseCatalogue: localStore.course_catalog
  });

  // Store in Firestore collection 'recommendations'
  if (db) {
    try {
      for (const rec of recs) {
        await setDoc(doc(db, "recommendations", rec.id), { ...rec, userId }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore write for recommendations failed:", e);
    }
  }

  localStore.recommendations = recs;
  saveLocal("statskill_recommendations", recs);
  return recs;
}

export async function getRecommendations(userId) {
  if (db) {
    try {
      const q = query(collection(db, "recommendations"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }

  if (localStore.recommendations && localStore.recommendations.length > 0) {
    return localStore.recommendations;
  }

  return await generateAndSaveRecommendations(userId);
}

// 6. Learning Progress
export async function getLearningProgress(userId) {
  if (db) {
    try {
      const q = query(collection(db, "learning_progress"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore read failed, checking prototype store:", e);
    }
  }
  return localStore.learning_progress.map(lp => {
    const course = localStore.course_catalog.find(c => c.courseId === lp.courseId || c.id === lp.courseId) || {};
    return { ...lp, course };
  });
}

export async function updateLearningProgress(userId, courseId, progressIncrement) {
  const item = localStore.learning_progress.find(lp => lp.userId === userId && lp.courseId === courseId);
  if (item) {
    item.progressPercent = Math.min(100, item.progressPercent + progressIncrement);
    if (item.progressPercent === 100) item.status = "COMPLETED";
    item.lastAccessed = new Date().toISOString();
    return item;
  }
  const newItem = {
    id: `lp-${Date.now()}`,
    userId,
    courseId,
    progressPercent: progressIncrement,
    status: progressIncrement >= 100 ? "COMPLETED" : "IN_PROGRESS",
    completedModules: 1,
    totalModules: 5,
    timeSpentHours: 2.0,
    lastAccessed: new Date().toISOString()
  };
  localStore.learning_progress.push(newItem);
  return newItem;
}

// 7. Assessments & Master Assessment Engine
export async function getAssessments() {
  return localStore.assessments;
}

export async function getMasterAssessment() {
  return {
    metadata: MASTER_ASSESSMENT_METADATA,
    questions: MASTER_ASSESSMENT_QUESTIONS
  };
}

export async function getAssessmentQuestions(assessmentId) {
  if (assessmentId === MASTER_ASSESSMENT_METADATA.id) {
    return MASTER_ASSESSMENT_QUESTIONS;
  }
  return localStore.assessment_questions.filter(q => q.assessmentId === assessmentId);
}

/**
 * Record assessment attempt in Firestore and localStore
 * Automatically regenerates recommendations dynamically based on new gaps!
 */
export async function recordAssessmentAttempt(attemptData) {
  const attempt = {
    id: attemptData.id || `att-${Date.now()}`,
    ...attemptData,
    completedAt: attemptData.completedAt || new Date().toISOString()
  };

  // 1. Write to Firestore if connected
  if (db) {
    try {
      await setDoc(doc(db, "assessment_attempts", attempt.id), attempt, { merge: true });
    } catch (e) {
      console.warn("Firestore attempt write failed:", e);
    }
  }

  // 2. Save in localStore & localStorage
  localStore.assessment_attempts.unshift(attempt);
  saveLocal("statskill_attempts", localStore.assessment_attempts);
  saveLocal("statskill_last_attempt", attempt);

  // 3. Persist all calculated skill gaps to Firestore and localStore
  if (attempt.gaps && attempt.gaps.length > 0) {
    await saveSkillGaps(attempt.userId, attempt.gaps);

    // 4. Automatically regenerate recommendations based on newly diagnosed skill gaps!
    await generateAndSaveRecommendations(attempt.userId, null, attempt.gaps, null);
  }

  // 5. Update competency history
  if (attempt.competencyScores) {
    Object.keys(attempt.competencyScores).forEach(compId => {
      const score = attempt.competencyScores[compId];
      const prevHist = localStore.competency_history.find(h => h.competencyId === compId);
      const prevScore = prevHist ? prevHist.newScore : 2.5;
      const compMeta = demoData.DEMO_COMPETENCIES.find(c => c.id === compId);

      const histRecord = {
        id: `ch-${compId}-${Date.now()}`,
        userId: attempt.userId,
        competencyId: compId,
        competencyName: compMeta?.name || compId,
        previousScore: prevScore,
        newScore: Number(((score / 100) * 5).toFixed(1)),
        assessedAt: attempt.completedAt,
        source: "DIAGNOSTIC",
        improvement: `Score: ${score}%`
      };
      localStore.competency_history.unshift(histRecord);
    });
    saveLocal("statskill_competency_history", localStore.competency_history);
  }

  return attempt;
}

export async function getLatestAssessmentAttempt(userId) {
  const savedLast = loadSaved("statskill_last_attempt", null);
  if (savedLast && (!userId || savedLast.userId === userId)) {
    return savedLast;
  }
  return localStore.assessment_attempts.find(a => !userId || a.userId === userId) || null;
}

// 8. Question Bank & Trainer Uploads
export async function getQuestionBank() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "question_bank"));
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore question_bank read failed:", e);
    }
  }
  return loadSaved("statskill_question_bank", localStore.question_bank);
}

export async function saveApprovedQuestionsToBank(questions = [], approvedBy = "trainer_rajesh_sharma") {
  const savedItems = [];
  for (const q of questions) {
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
      status: "APPROVED",
      approvedBy,
      approvedAt: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, "question_bank", item.id), item, { merge: true });
      } catch (e) {
        console.warn("Firestore question_bank write failed:", e);
      }
    }

    const idx = localStore.question_bank.findIndex(existing => existing.id === item.id);
    if (idx >= 0) {
      localStore.question_bank[idx] = item;
    } else {
      localStore.question_bank.unshift(item);
    }
    savedItems.push(item);
  }

  saveLocal("statskill_question_bank", localStore.question_bank);
  return savedItems;
}

export async function updateQuestionBankQuestion(id, updatedData) {
  if (db) {
    try {
      await updateDoc(doc(db, "question_bank", id), updatedData);
    } catch (e) {
      console.warn("Firestore question_bank update failed:", e);
    }
  }

  const idx = localStore.question_bank.findIndex(q => q.id === id);
  if (idx >= 0) {
    localStore.question_bank[idx] = {
      ...localStore.question_bank[idx],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    saveLocal("statskill_question_bank", localStore.question_bank);
    return localStore.question_bank[idx];
  }
  return null;
}

export async function deleteQuestionBankQuestion(id) {
  if (db) {
    try {
      // deleteDoc(doc(db, "question_bank", id));
    } catch (e) {
      console.warn("Firestore question_bank delete failed:", e);
    }
  }

  localStore.question_bank = localStore.question_bank.filter(q => q.id !== id);
  saveLocal("statskill_question_bank", localStore.question_bank);
  return true;
}

export async function getUploadedMaterials() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "learning_materials"));
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore learning_materials read failed:", e);
    }
  }
  return loadSaved("statskill_uploaded_materials", localStore.uploaded_materials);
}

export async function addUploadedMaterial(material) {
  const newMat = {
    id: material.id || `mat-${Date.now()}`,
    fileName: material.fileName || "learning_material.txt",
    fileType: material.fileType || "txt",
    uploadedBy: material.uploadedBy || "trainer_rajesh_sharma",
    uploadedAt: new Date().toISOString(),
    status: "PROCESSED",
    processingStatus: "COMPLETED",
    textLength: material.textLength || 1000,
    questionsGenerated: material.questionsGenerated || 10,
    ...material
  };

  if (db) {
    try {
      await setDoc(doc(db, "learning_materials", newMat.id), newMat, { merge: true });
    } catch (e) {
      console.warn("Firestore learning_materials write failed:", e);
    }
  }

  localStore.uploaded_materials.unshift(newMat);
  saveLocal("statskill_uploaded_materials", localStore.uploaded_materials);
  return newMat;
}

export async function getGeneratedQuestions() {
  return localStore.generated_questions;
}

export async function updateGeneratedQuestionStatus(questionId, status, trainerFeedback = "") {
  const q = localStore.generated_questions.find(item => item.id === questionId);
  if (q) {
    q.status = status;
    if (trainerFeedback) q.trainerFeedback = trainerFeedback;
    return q;
  }
  return null;
}

// 9. Learner Performance (Trainer View)
export async function getCohortPerformance() {
  return demoData.DEMO_LEARNER_PERFORMANCE;
}

// 10. Competency History Timeline
export async function getCompetencyHistory(userId) {
  return localStore.competency_history;
}

// 11. Practice Quiz Engine & Competency Recalibration (Deterministic)
export async function recordQuizAttempt(attemptData) {
  const attempt = {
    id: attemptData.id || `quiz-att-${Date.now()}`,
    ...attemptData,
    completedAt: attemptData.completedAt || new Date().toISOString()
  };

  // 1. Write to Firestore quiz_attempts
  if (db) {
    try {
      await setDoc(doc(db, "quiz_attempts", attempt.id), attempt, { merge: true });
    } catch (e) {
      console.warn("Firestore quiz_attempts write failed:", e);
    }
  }

  // 2. Save in localStore.quiz_attempts & localStorage
  if (!localStore.quiz_attempts) localStore.quiz_attempts = [];
  localStore.quiz_attempts.unshift(attempt);
  saveLocal("statskill_quiz_attempts", localStore.quiz_attempts);

  // 3. Update competency_history
  const histRecord = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: attempt.userId,
    competencyId: attempt.competencyId,
    competencyName: attempt.competencyName,
    domain: attempt.domain || "Statistical",
    date: attempt.completedAt,
    scoreBefore: attempt.previousScore,
    scoreAfter: attempt.newScore,
    change: attempt.improvement >= 0 ? `+${attempt.improvement}%` : `${attempt.improvement}%`,
    source: "PRACTICE_QUIZ",
    improvement: `Quiz Score: ${attempt.quizScore}% (Calibration: ${attempt.previousScore}% → ${attempt.newScore}%)`
  };

  if (db) {
    try {
      await setDoc(doc(db, "competency_history", histRecord.id), histRecord, { merge: true });
    } catch (e) {
      console.warn("Firestore competency_history write failed:", e);
    }
  }
  localStore.competency_history.unshift(histRecord);
  saveLocal("statskill_competency_history", localStore.competency_history);

  // 4. Update the competency's currentLevel in skill_gaps
  const targetReq = STATISTICAL_OFFICER_REQUIREMENTS[attempt.competencyId] || { requiredLevel: 75 };
  const targetLevel = targetReq.requiredLevel || 75;
  const newGap = targetLevel - attempt.newScore;
  const classification = classifyGap(newGap);

  const updatedGaps = (localStore.skill_gaps || []).map((gap) => {
    if (gap.competencyId === attempt.competencyId || gap.competencyName === attempt.competencyName) {
      return {
        ...gap,
        currentLevel: attempt.newScore,
        targetLevel,
        gapMagnitude: Math.max(0, newGap),
        rawGap: newGap,
        priority: classification.priority,
        priorityLabel: classification.label,
        status: newGap <= 0 ? "COMPLETED" : "IN_PROGRESS",
        notes: newGap <= 0
          ? "Exceeds or meets baseline standard."
          : `Requires capacity building of ${newGap} percentage points to achieve Statistical Officer threshold.`
      };
    }
    return gap;
  });

  localStore.skill_gaps = updatedGaps;
  await saveSkillGaps(attempt.userId, updatedGaps);

  // 5. Automatically regenerate course recommendations based on the newly calibrated competency!
  await generateAndSaveRecommendations(attempt.userId, null, updatedGaps, null);

  return attempt;
}

export async function getQuizAttempts(userId) {
  if (db) {
    try {
      const q = query(collection(db, "quiz_attempts"), where("userId", "==", userId));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs.map(d => d.data());
    } catch (e) {
      console.warn("Firestore quiz_attempts read failed:", e);
    }
  }
  return loadSaved("statskill_quiz_attempts", localStore.quiz_attempts || []);
}


// 12. Interactive Course Player Progress & Real-time Competency Recalibration
export async function recordCourseProgress(userId, courseId, chapterIndex, totalChapters = 4) {
  const course = (localStore.course_catalog || []).find(c => c.courseId === courseId || c.id === courseId) || {};
  const progressPercent = Math.min(100, Math.round(((chapterIndex + 1) / totalChapters) * 100));
  const isCompleted = progressPercent === 100;

  // 1. Update learning_progress record
  let item = localStore.learning_progress.find(lp => lp.userId === userId && lp.courseId === courseId);
  if (item) {
    item.progressPercent = progressPercent;
    item.completedModules = chapterIndex + 1;
    item.totalModules = totalChapters;
    item.status = isCompleted ? "COMPLETED" : "IN_PROGRESS";
    item.lastAccessed = new Date().toISOString();
  } else {
    item = {
      id: `lp-${Date.now()}`,
      userId,
      courseId,
      progressPercent,
      completedModules: chapterIndex + 1,
      totalModules: totalChapters,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      timeSpentHours: Number(((chapterIndex + 1) * 1.5).toFixed(1)),
      lastAccessed: new Date().toISOString(),
      course
    };
    localStore.learning_progress.push(item);
  }

  saveLocal("statskill_learning_progress", localStore.learning_progress);

  // 2. If course reached a milestone or completion, recalibrate the matched competency!
  const targetCompName = course.competencyName || course.competency;
  let calibratedComp = null;

  if (targetCompName) {
    // Find matching gap
    const gapIdx = (localStore.skill_gaps || []).findIndex(
      g => g.competencyName?.toLowerCase() === targetCompName.toLowerCase() ||
           g.competencyId === course.competencyId
    );

    if (gapIdx >= 0) {
      const existingGap = localStore.skill_gaps[gapIdx];
      const prevScore = existingGap.currentLevel || 60;
      // Boost score proportionally to course progress (up to +15 points upon 100%)
      const boostAmount = isCompleted ? 15 : 4;
      const newScore = Math.min(95, prevScore + boostAmount);
      const targetLevel = existingGap.targetLevel || 75;
      const newGapVal = targetLevel - newScore;
      const classification = classifyGap(newGapVal);

      localStore.skill_gaps[gapIdx] = {
        ...existingGap,
        currentLevel: newScore,
        gapMagnitude: Math.max(0, newGapVal),
        rawGap: newGapVal,
        priority: classification.priority,
        priorityLabel: classification.label,
        status: newGapVal <= 0 ? "COMPLETED" : "IN_PROGRESS",
        notes: newGapVal <= 0
          ? "Competency requirement fulfilled via iGOT course module mastery."
          : `Requires ${newGapVal} more points to reach Statistical Officer benchmark.`
      };

      calibratedComp = localStore.skill_gaps[gapIdx];

      // Save skill gaps
      await saveSkillGaps(userId, localStore.skill_gaps);

      // Add to competency history
      const histRecord = {
        id: `hist-course-${Date.now()}`,
        userId,
        competencyId: existingGap.competencyId || course.competencyId || "comp-igot",
        competencyName: existingGap.competencyName || targetCompName,
        domain: existingGap.domain || "Statistical",
        date: new Date().toISOString(),
        scoreBefore: prevScore,
        scoreAfter: newScore,
        change: `+${newScore - prevScore}%`,
        source: "IGOT_COURSE",
        improvement: `Completed Chapter ${chapterIndex + 1}/${totalChapters} of ${course.title || "iGOT Course"} (Score: ${prevScore}% → ${newScore}%)`
      };

      localStore.competency_history.unshift(histRecord);
      saveLocal("statskill_competency_history", localStore.competency_history);

      // Regenerate recommendations
      await generateAndSaveRecommendations(userId, null, localStore.skill_gaps, null);
    }
  }

  return {
    progress: item,
    calibratedComp,
    isCompleted,
    certificateId: isCompleted ? `CERT-MOSPI-${Date.now().toString().slice(-6)}` : null
  };
}
