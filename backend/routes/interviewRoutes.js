import express from "express";

import protect from "../middleware/authMiddleware.js";
import { uploadMemory } from "../middleware/uploadMiddleware.js";

import {
  generateInterview,
  getInterviewHistory,
  getDashboardAnalytics,
  nextQuestion,
  startInterview,
  getInterviewResult,
} from "../controllers/interviewController.js";

const router = express.Router();

// =========================================
// Generate Interview (Optional Resume Upload)
// =========================================

router.post(
  "/generate",
  protect,
  uploadMemory.single("resume"),
  generateInterview
);

// =========================================
// Next Question + AI Evaluation
// =========================================

router.post(
  "/next",
  protect,
  nextQuestion
);

// =========================================
// Start Interview
// =========================================

router.get(
  "/start/:id",
  protect,
  startInterview
);

// =========================================
// Get Single Interview Result
// =========================================

router.get(
  "/result/:id",
  protect,
  getInterviewResult
);

// =========================================
// Interview History
// =========================================

router.get(
  "/history",
  protect,
  getInterviewHistory
);

// =========================================
// Dashboard Analytics
// =========================================

router.get(
  "/dashboard",
  protect,
  getDashboardAnalytics
);

export default router;