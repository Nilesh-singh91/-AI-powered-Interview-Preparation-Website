import Interview from "../models/Interview.js";
import InterviewResult from "../models/InterviewResult.js";
import generateResponse from "../services/geminiService.js";
import { extractTextFromResume } from "../utils/resumeParser.js";

// =========================================
// Helper: Normalize AI Feedback
// =========================================

const normalizeFeedback = (feedback) => {
  const score = Number(feedback?.score);

  return {
    score: Number.isFinite(score)
      ? Math.max(0, Math.min(10, score))
      : 0,

    strengths: Array.isArray(feedback?.strengths)
      ? feedback.strengths
      : [],

    weaknesses: Array.isArray(feedback?.weaknesses)
      ? feedback.weaknesses
      : [],

    correctAnswer:
      typeof feedback?.correctAnswer === "string"
        ? feedback.correctAnswer
        : "",

    overallFeedback:
      typeof feedback?.overallFeedback === "string"
        ? feedback.overallFeedback
        : "",
  };
};

// =========================================
// Generate Interview
// =========================================

const generateInterview = async (req, res) => {
  try {
    console.log("\n========== GENERATE INTERVIEW ==========");
    console.log("BODY RECEIVED:", req.body);
    console.log("FILE RECEIVED:", req.file ? req.file.originalname : "No file");

    let {
      interviewType = "Technical",
      role = "Frontend Developer",
      experience = "Fresher",
      difficulty = "Medium",
      questionCount = 10,
      resumeText = "",
    } = req.body;

    const totalQuestions = Number(questionCount);

    // Check if resume file was uploaded
    let isResumeBased = false;
    let extractedResumeText = "";

    if (req.file) {
      try {
        extractedResumeText = await extractTextFromResume(
          req.file.buffer,
          req.file.mimetype,
          req.file.originalname
        );
        isResumeBased = true;
        console.log("📄 Extracted resume text length:", extractedResumeText.length);
      } catch (parseErr) {
        console.error("Resume extraction failed:", parseErr);
        return res.status(400).json({
          success: false,
          message: `Failed to extract resume text: ${parseErr.message}`,
        });
      }
    } else if (resumeText && resumeText.trim().length > 10) {
      extractedResumeText = resumeText.trim();
      isResumeBased = true;
    }

    // =========================================
    // Validation
    // =========================================

    if (
      !difficulty ||
      !questionCount ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions <= 0
    ) {
      console.log("❌ VALIDATION FAILED");
      return res.status(400).json({
        success: false,
        message: "Valid difficulty and question count are required",
      });
    }

    if (!isResumeBased && !role) {
      return res.status(400).json({
        success: false,
        message: "Job role is required when not using a resume",
      });
    }

    // =========================================
    // Generate AI Prompt
    // =========================================

    let prompt = "";

    if (isResumeBased && extractedResumeText) {
      prompt = `
You are an expert technical interviewer conducting an in-depth interview based on the candidate's resume.

Candidate's Resume Content:
----------------------------------------
${extractedResumeText.slice(0, 8000)}
----------------------------------------

Interview Parameters:
- Interview Type: ${interviewType}
- Target Experience Level: ${experience}
- Difficulty Level: ${difficulty}
- Total Questions to Generate: ${totalQuestions}

CRITICAL RULES:
1. Generate exactly ${totalQuestions} interview questions based ONLY and STRICTLY on the information present in the resume.
2. Focus deeply on the candidate's:
   - Projects (ask specific questions about how they designed, built, or solved challenges in their listed projects)
   - Skills & Technologies explicitly mentioned
   - Work experience & contributions
   - Tools and education listed
3. DO NOT ask questions about technologies, tools, or libraries that are NOT mentioned in the resume.
4. Keep questions challenging, realistic, and matched to the "${difficulty}" difficulty level and "${experience}" experience.
5. Questions should not contain answers.
6. Avoid duplicate questions.
7. Return ONLY a valid JSON array of strings. Do not return markdown, code fences, or explanations.

Example format:
[
  "I noticed you built an e-commerce platform using React and Node.js. How did you handle state management and cart synchronization across pages?",
  "In your resume, you mentioned experience with MongoDB indexing. How did you optimize query performance for high-traffic endpoints?"
]
`;
    } else {
      prompt = `
You are an expert technical interviewer.

Generate exactly ${totalQuestions} interview questions.

Interview Type: ${interviewType}
Job Role: ${role}
Experience Level: ${experience}
Difficulty: ${difficulty}

Requirements:
- Generate exactly ${totalQuestions} questions.
- Questions should be relevant to the job role: ${role}.
- Questions should match the selected difficulty: ${difficulty}.
- Questions should be suitable for the candidate's experience level: ${experience}.
- Questions should not contain answers.
- Avoid duplicate questions.
- Return ONLY a valid JSON array.
- Do not return markdown.
- Do not return any explanation.

Example:
[
  "What is HTML?",
  "What is CSS?",
  "What is JavaScript?"
]
`;
    }

    // =========================================
    // Get AI Response
    // =========================================

    const aiResponse = await generateResponse(prompt);
    console.log("AI RESPONSE RAW:", aiResponse);

    let questions;

    try {
      questions = JSON.parse(aiResponse);
    } catch (error) {
      console.log("❌ AI JSON PARSE ERROR:", error);
      // Try to extract JSON array using regex if raw parse fails
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[0]);
        } catch (e) {
          return res.status(500).json({
            success: false,
            message: "AI returned invalid question format",
          });
        }
      } else {
        return res.status(500).json({
          success: false,
          message: "AI returned invalid question format",
        });
      }
    }

    // =========================================
    // Validate Questions
    // =========================================

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate the required questions",
      });
    }

    // =========================================
    // Create Interview
    // =========================================

    const displayTechnology = isResumeBased
      ? (role || "Resume Based")
      : role;

    const interview = await Interview.create({
      user: req.user._id,
      technology: displayTechnology,
      role: role || (isResumeBased ? "Resume Candidate" : "Developer"),
      interviewType: interviewType || "Technical",
      experience: experience || "Fresher",
      isResumeBased: isResumeBased,
      resumeText: extractedResumeText ? extractedResumeText.slice(0, 10000) : "",
      difficulty,
      questions,
      currentQuestion: 0,
      answers: [],
      score: 0,
      status: "generated",
    });

    console.log("✅ INTERVIEW CREATED:", interview._id, "Resume-based:", isResumeBased);

    // =========================================
    // Response
    // =========================================

    return res.status(201).json({
      success: true,
      message: "Interview generated successfully",
      interviewId: interview._id,
      interview: {
        id: interview._id,
        interviewType: interview.interviewType,
        role: interview.role,
        technology: interview.technology,
        experience: interview.experience,
        difficulty: interview.difficulty,
        isResumeBased: interview.isResumeBased,
        questionCount: questions.length,
        questions,
      },
    });
  } catch (error) {
    console.error("❌ GENERATE INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// =========================================
// Evaluate Interview Answer
// =========================================

const evaluateInterview = async (req, res) => {
  try {
    const {
      technology,
      question,
      answer,
      interviewId,
    } = req.body;

    // =========================================
    // Validation
    // =========================================

    if (!question || !answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question and Answer are required",
      });
    }

    // =========================================
    // AI Prompt
    // =========================================

    const prompt = `
You are an experienced Software Engineering interviewer.

Evaluate the candidate's answer fairly.

Question:
${question}

Candidate Answer:
${answer}

Scoring Rules:

10 = Perfect answer

8-9 = Correct answer with small missing points

6-7 = Mostly correct but missing important concepts

4-5 = Partially correct

1-3 = Very weak answer

0 = Completely wrong or irrelevant answer

Never give 0 if the answer contains any correct concept.

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "correctAnswer": "",
  "overallFeedback": ""
}

Do not return markdown.
`;

    // =========================================
    // Get AI Response
    // =========================================

    const aiResponse = await generateResponse(prompt);

    let feedback;

    try {
      feedback = JSON.parse(aiResponse);
    } catch (error) {
      console.log(
        "AI JSON Parse Error:",
        error
      );

      feedback = {
        score: 0,
        strengths: [],
        weaknesses: [],
        correctAnswer: "",
        overallFeedback: aiResponse,
      };
    }

    feedback = normalizeFeedback(feedback);

    // =========================================
    // Save Standalone Result
    // =========================================

    // interviewId optional hai kyunki normal
    // nextQuestion() already result save karta hai.
    // Agar evaluateInterview ko interviewId ke saath
    // call kiya gaya to history me bhi save hoga.

    if (interviewId) {
      await InterviewResult.create({
        user: req.user._id,

        interviewId,

        technology,

        question,

        candidateAnswer: answer,

        score: feedback.score,

        strengths: feedback.strengths,

        weaknesses: feedback.weaknesses,

        correctAnswer: feedback.correctAnswer,

        overallFeedback:
          feedback.overallFeedback,
      });
    }

    // =========================================
    // Response
    // =========================================

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.log(
      "Evaluate Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================================
// Get Interview History
// =========================================

const getInterviewHistory = async (req, res) => {
  try {
    const history = await InterviewResult.find({
      user: req.user._id,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    // =========================================
    // Group Results Interview-wise
    // =========================================

    const groupedHistory = {};

    history.forEach((item) => {
      const interviewId = item.interviewId
        ? item.interviewId.toString()
        : "unknown";

      if (!groupedHistory[interviewId]) {
        groupedHistory[interviewId] = {
          interviewId,

          technology: item.technology,

          questions: [],

          totalScore: 0,

          totalQuestions: 0,

          createdAt: item.createdAt,
        };
      }

      groupedHistory[interviewId].questions.push(
        item
      );

      groupedHistory[interviewId].totalScore +=
        Number(item.score) || 0;

      groupedHistory[interviewId]
        .totalQuestions++;
    });

    // =========================================
    // Create Final Interview Cards
    // =========================================

    const interviews = Object.values(
      groupedHistory
    ).map((interview) => {
      const maxScore =
        interview.totalQuestions * 10;

      const percentage =
        maxScore > 0
          ? Math.round(
              (interview.totalScore /
                maxScore) *
                100
            )
          : 0;

      const averageScore =
        interview.totalQuestions > 0
          ? Number(
              (
                interview.totalScore /
                interview.totalQuestions
              ).toFixed(1)
            )
          : 0;

      return {
        ...interview,

        averageScore,

        percentage,
      };
    });

    // Latest interview first
    interviews.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,

      total: interviews.length,

      history: interviews,
    });
  } catch (error) {
    console.log(
      "History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================================
// Dashboard Analytics
// =========================================

const getDashboardAnalytics = async (
  req,
  res
) => {
  try {
    // =========================================
    // Get Completed Interviews
    // =========================================

    const interviews =
      await Interview.find({
        user: req.user._id,

        status: "completed",
      }).sort({
        createdAt: -1,
      });

    // =========================================
    // No Completed Interviews
    // =========================================

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,

        analytics: {
          totalInterviews: 0,

          averageScore: 0,

          highestScore: 0,

          lowestScore: 0,

          latestTechnology: null,

          lastInterviewDate: null,
        },
      });
    }

    // =========================================
    // Total Interviews
    // =========================================

    const totalInterviews =
      interviews.length;

    // =========================================
    // Calculate Each Interview Score /10
    // =========================================

    const scores = interviews.map(
      (interview) => {
        const totalQuestions =
          interview.questions?.length || 0;

        if (totalQuestions === 0) {
          return 0;
        }

        const score =
          Number(interview.score) || 0;

        return Number(
          (
            score /
            totalQuestions
          ).toFixed(2)
        );
      }
    );

    // =========================================
    // Average Score
    // =========================================

    const totalScore = scores.reduce(
      (sum, score) =>
        sum + score,
      0
    );

    const averageScore = Number(
      (
        totalScore /
        totalInterviews
      ).toFixed(2)
    );

    // =========================================
    // Highest Score
    // =========================================

    const highestScore = Number(
      Math.max(...scores).toFixed(2)
    );

    // =========================================
    // Lowest Score
    // =========================================

    const lowestScore = Number(
      Math.min(...scores).toFixed(2)
    );

    // =========================================
    // Response
    // =========================================

    return res.status(200).json({
      success: true,

      analytics: {
        totalInterviews,

        averageScore,

        highestScore,

        lowestScore,

        latestTechnology:
          interviews[0].technology,

        lastInterviewDate:
          interviews[0].createdAt,
      },
    });
  } catch (error) {
    console.log(
      "Dashboard Analytics Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================================
// Next Question
// =========================================

const nextQuestion = async (req, res) => {
  try {
    const {
      interviewId,
      answer,
    } = req.body;

    // =========================================
    // Validation
    // =========================================

    if (
      !interviewId ||
      !answer ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID and Answer are required",
      });
    }

    // =========================================
    // Find Interview
    // =========================================

    const interview =
      await Interview.findOne({
        _id: interviewId,

        user: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found",
      });
    }

    // =========================================
    // Current Question Index
    // =========================================

    const currentIndex =
      interview.currentQuestion;

    // =========================================
    // Check Already Completed
    // =========================================

    if (
      currentIndex >=
      interview.questions.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview already completed",
      });
    }

    // =========================================
    // Current Question
    // =========================================

    const currentQuestion =
      interview.questions[
        currentIndex
      ];

    // =========================================
    // AI Evaluation Prompt
    // =========================================

    const prompt = `
You are an experienced Software Engineering interviewer.

Evaluate the candidate fairly.

Question:
${currentQuestion}

Candidate Answer:
${answer}

Scoring Rules:

10 = Perfect answer

8-9 = Correct answer with small missing points

6-7 = Mostly correct but missing important concepts

4-5 = Partially correct

1-3 = Very weak answer

0 = Completely wrong or irrelevant answer

Never give 0 if the answer contains any correct concept.

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "correctAnswer": "",
  "overallFeedback": ""
}

Do not return markdown.
`;

    // =========================================
    // Get AI Response
    // =========================================

    const aiResponse =
      await generateResponse(prompt);

    let feedback;

    try {
      feedback = JSON.parse(
        aiResponse
      );
    } catch (error) {
      console.log(
        "AI JSON Parse Error:",
        error
      );

      feedback = {
        score: 0,

        strengths: [],

        weaknesses: [],

        correctAnswer: "",

        overallFeedback:
          aiResponse,
      };
    }

    feedback =
      normalizeFeedback(feedback);

    // =========================================
    // Save Answer Inside Interview
    // =========================================

    interview.answers.push({
      question: currentQuestion,

      answer: answer,

      score: feedback.score,

      feedback:
        feedback.overallFeedback,

      correctAnswer:
        feedback.correctAnswer,

      strengths:
        feedback.strengths,

      weaknesses:
        feedback.weaknesses,
    });

    // =========================================
    // Add Score
    // =========================================

    interview.score +=
      feedback.score;

    // =========================================
    // Move To Next Question
    // =========================================

    interview.currentQuestion++;

    // =========================================
    // Check Interview Completed
    // =========================================

    if (
      interview.currentQuestion >=
      interview.questions.length
    ) {
      interview.status =
        "completed";
    }

    // =========================================
    // Save Interview
    // =========================================

    await interview.save();

    // =========================================
    // IMPORTANT:
    // Save Question Result
    // =========================================
    //
    // interviewId MUST be included because
    // InterviewResult schema requires it.
    //
    // This fixes:
    // "Path interviewId is required"
    // =========================================

    await InterviewResult.create({
      user: req.user._id,

      interviewId: interview._id,

      technology:
        interview.technology,

      question:
        currentQuestion,

      candidateAnswer:
        answer,

      score:
        feedback.score,

      strengths:
        feedback.strengths,

      weaknesses:
        feedback.weaknesses,

      correctAnswer:
        feedback.correctAnswer,

      overallFeedback:
        feedback.overallFeedback,
    });

    console.log(
      "✅ INTERVIEW RESULT SAVED:",
      interview._id
    );

    // =========================================
    // Interview Completed
    // =========================================

    if (
      interview.status ===
      "completed"
    ) {
      const average = Number(
        (
          interview.score /
          interview.questions.length
        ).toFixed(1)
      );

      // =========================================
      // Overall Level
      // =========================================

      let overallLevel = "";

      if (average >= 8.5) {
        overallLevel =
          "Excellent";
      } else if (average >= 7) {
        overallLevel =
          "Good";
      } else if (average >= 5) {
        overallLevel =
          "Average";
      } else {
        overallLevel =
          "Needs Improvement";
      }

      // =========================================
      // Percentage
      // =========================================

      const percentage =
        Math.round(
          (interview.score /
            (interview.questions.length *
              10)) *
            100
        );

      // =========================================
      // Completed Response
      // =========================================

      return res.status(200).json({
        success: true,

        completed: true,

        message:
          "Interview Completed Successfully",

        totalScore:
          interview.score,

        answers:
          interview.answers,

        summary: {
          averageScore:
            average,

          level:
            overallLevel,

          percentage,
        },
      });
    }

    // =========================================
    // More Questions Remaining
    // =========================================

    return res.status(200).json({
      success: true,

      completed: false,

      currentQuestionNumber:
        interview.currentQuestion + 1,

      question:
        interview.questions[
          interview.currentQuestion
        ],

      feedback,
    });
  } catch (error) {
    console.log(
      "Next Question Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Internal Server Error",

      error: error.message,
    });
  }
};

// =========================================
// Start Interview
// =========================================

const startInterview = async (
  req,
  res
) => {
  try {
    // =========================================
    // Find Only User's Interview
    // =========================================

    const interview =
      await Interview.findOne({
        _id: req.params.id,

        user: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,

        message:
          "Interview not found",
      });
    }

    // =========================================
    // Start Interview
    // =========================================

    interview.status =
      "in-progress";

    await interview.save();

    // =========================================
    // Response
    // =========================================

    return res.status(200).json({
      success: true,

      interview: {
        id: interview._id,

        technology:
          interview.technology,

        role:
          interview.role || interview.technology,

        interviewType:
          interview.interviewType || "Technical",

        experience:
          interview.experience || "Fresher",

        isResumeBased:
          Boolean(interview.isResumeBased),

        difficulty:
          interview.difficulty,

        questions:
          interview.questions,

        currentQuestion:
          interview.currentQuestion,

        status:
          interview.status,
      },
    });
  } catch (error) {
    console.log(
      "Start Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Internal Server Error",
    });
  }
};

// =========================================
// Get Single Interview Result
// =========================================

const getInterviewResult = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview result not found",
      });
    }

    const results = await InterviewResult.find({
      interviewId: req.params.id,
      user: req.user._id,
    }).sort({ createdAt: 1 });

    const answers =
      interview.answers && interview.answers.length > 0
        ? interview.answers
        : results.map((r) => ({
            question: r.question,
            answer: r.candidateAnswer,
            score: r.score,
            overallFeedback: r.overallFeedback,
            correctAnswer: r.correctAnswer,
            strengths: r.strengths,
            weaknesses: r.weaknesses,
          }));

    return res.status(200).json({
      success: true,
      result: {
        interviewId: interview._id,
        technology: interview.technology,
        role: interview.role || interview.technology,
        isResumeBased: Boolean(interview.isResumeBased),
        difficulty: interview.difficulty,
        totalScore: interview.score,
        totalQuestions: interview.questions?.length || answers.length,
        answers,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Interview Result Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =========================================
// Export
// =========================================

export {
  generateInterview,
  evaluateInterview,
  getInterviewHistory,
  getDashboardAnalytics,
  nextQuestion,
  startInterview,
  getInterviewResult,
};