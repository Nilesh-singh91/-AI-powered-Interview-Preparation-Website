import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    technology: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "",
    },

    interviewType: {
      type: String,
      default: "Technical",
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    isResumeBased: {
      type: Boolean,
      default: false,
    },

    resumeText: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    questions: {
      type: [String],
      default: [],
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    answers: {
  type: [
    {
      question: {
        type: String,
        default: "",
      },

      answer: {
        type: String,
        default: "",
      },

      score: {
        type: Number,
        default: 0,
      },

      feedback: {
        type: String,
        default: "",
      },

      correctAnswer: {
        type: String,
        default: "",
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },
    },
  ],

  default: [],
},

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["generated", "in-progress", "completed"],
      default: "generated",
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;