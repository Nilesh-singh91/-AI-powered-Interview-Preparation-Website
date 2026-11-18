import mongoose from "mongoose";

const interviewResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Interview",
  required: true,
},

    technology: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    candidateAnswer: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    correctAnswer: {
      type: String,
    },

    overallFeedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewResult = mongoose.model(
  "InterviewResult",
  interviewResultSchema
);

export default InterviewResult;