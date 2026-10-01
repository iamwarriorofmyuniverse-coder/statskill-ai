const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request("/health"),

  // Authentication & Role Validation
  validateTrainerCode: (accessCode, userMeta = {}) =>
    request("/auth/validate-trainer", {
      method: "POST",
      body: JSON.stringify({ accessCode, ...userMeta }),
    }),

  getRolesMeta: () => request("/auth/roles-meta"),

  // Competency Management
  getDomains: () => request("/competencies/domains"),
  getCompetencies: () => request("/competencies/all"),
  getRoles: () => request("/competencies/roles"),
  getMasterAssessment: () => request("/competencies/master-assessment"),
  getSkillGaps: (userId) => request(`/competencies/skill-gaps/${userId}`),
  getCourses: () => request("/competencies/courses"),
  getAssessments: () => request("/competencies/assessments"),
  getAssessmentQuestions: (id) => request(`/competencies/assessments/${id}/questions`),
  submitAssessment: (data) =>
    request("/competencies/assessments/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submitQuiz: (data) =>
    request("/competencies/quiz/submit", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getCohortPerformance: () => request("/competencies/cohort-performance"),

  // Recommendations Engine
  getRecommendations: (userId) => request(`/recommendations/${userId}`),
  generateRecommendations: (data) =>
    request("/recommendations/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  refreshRecommendations: (data) =>
    request("/recommendations/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getIgotCatalogue: () => request("/recommendations/catalogue"),

  // Gemini AI Interactions API
  diagnoseGaps: (data) =>
    request("/gemini/diagnose-gaps", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getLearningRoadmap: (data) =>
    request("/gemini/learning-roadmap", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  askAdvisor: (query, officerContext) =>
    request("/gemini/ask-advisor", {
      method: "POST",
      body: JSON.stringify({ query, officerContext }),
    }),

  sendAssistantChat: (data) =>
    request("/gemini/assistant-chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  askAssistantChat: (data) =>
    request("/gemini/assistant-chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // AI MCQ Generation (Flagship Trainer Engine)
  generateMCQsFromText: (payload) =>
    request("/ai/generate-mcqs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  generateMCQsFromFile: async (formData) => {
    const url = `${API_BASE}/ai/generate-mcqs`;
    const response = await fetch(url, {
      method: "POST",
      body: formData, // fetch will automatically set multipart/form-data with boundary
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  },

  // Trainer Material & Question Bank Management
  uploadTrainerMaterial: async (formData) => {
    const url = `${API_BASE}/trainer/upload-material`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  },

  getTrainerMaterials: () => request("/trainer/materials"),
  
  getQuestionBank: (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`/trainer/question-bank${searchParams ? `?${searchParams}` : ""}`);
  },

  saveApprovedQuestions: (questions, approvedBy) =>
    request("/trainer/question-bank/save", {
      method: "POST",
      body: JSON.stringify({ questions, approvedBy }),
    }),

  updateQuestionBankItem: (id, data) =>
    request(`/trainer/question-bank/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteQuestionBankItem: (id) =>
    request(`/trainer/question-bank/${id}`, {
      method: "DELETE",
    }),

  // Seeding
  getSeedStatus: () => request("/seed/status"),
  executeSeed: () => request("/seed/execute", { method: "POST" }),
};
