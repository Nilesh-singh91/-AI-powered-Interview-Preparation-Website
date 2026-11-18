import axiosInstance from "./axiosInstance";

// ==========================================
// Generate New Interview (Supports JSON or FormData)
// ==========================================
export const generateInterview = async (data) => {
  const headers = {};

  // If data is FormData, do NOT set Content-Type — axios sets it automatically with boundary
  if (data instanceof FormData) {
    // Let axios handle multipart/form-data boundary automatically
    headers["Content-Type"] = "multipart/form-data";
  }

  const response = await axiosInstance.post("/interview/generate", data, {
    headers,
  });

  return response.data;
};


// ==========================================
// Start Interview
// ==========================================
export const startInterview = async (id) => {
  const response = await axiosInstance.get(`/interview/start/${id}`);
  return response.data;
};


// ==========================================
// Evaluate Answer
// ==========================================
export const evaluateInterview = async (data) => {
  const response = await axiosInstance.post("/interview/evaluate", data);
  return response.data;
};


// ==========================================
// Next Question
// ==========================================
export const nextQuestion = async (data) => {
  const response = await axiosInstance.post("/interview/next", data);
  return response.data;
};


// ==========================================
// Interview History
// ==========================================
export const getInterviewHistory = async () => {
  const response = await axiosInstance.get("/interview/history");
  return response.data;
};


// ==========================================
// Dashboard Analytics
// ==========================================
export const getDashboardAnalytics = async () => {
  const response = await axiosInstance.get("/interview/dashboard");
  return response.data;
};


// ==========================================
// Get Single Interview Result by ID
// ==========================================
export const getInterviewResult = async (id) => {
  const response = await axiosInstance.get(`/interview/result/${id}`);
  return response.data;
};