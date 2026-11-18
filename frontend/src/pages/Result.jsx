import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Trophy,
  Target,
  CheckCircle,
  ArrowLeft,
  Home,
  Award,
  FileCheck,
  Code2,
} from "lucide-react";
import toast from "react-hot-toast";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result && Boolean(id));

  useEffect(() => {
    if (!result && id) {
      const fetchResult = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:5000/api/interview/result/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data?.success && response.data?.result) {
            setResult(response.data.result);
          } else {
            toast.error("Could not find this interview result.");
          }
        } catch (err) {
          console.error("Fetch Result Error:", err);
          toast.error("Failed to load interview result.");
        } finally {
          setLoading(false);
        }
      };

      fetchResult();
    }
  }, [id, result]);

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500 font-medium">Loading interview results...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Result Not Found
  // =========================
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <Target className="text-red-500" size={40} />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Result Not Found
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            We couldn't find your interview result. Start a new interview to see your performance.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Result Data
  // =========================
  const answers = Array.isArray(result.answers) ? result.answers : [];
  const totalQuestions = Number(result.totalQuestions) || answers.length || 1;
  const totalScore = Number(result.totalScore) || 0;

  // Average score out of 10
  const averageScore =
    totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(1) : "0.0";

  // Percentage
  const percentage =
    totalQuestions > 0
      ? Math.round((totalScore / (totalQuestions * 10)) * 100)
      : 0;

  // =========================
  // Performance Message
  // =========================
  let performanceMessage = "";
  if (percentage >= 80) {
    performanceMessage = "Excellent performance! You're interview ready ??";
  } else if (percentage >= 60) {
    performanceMessage = "Good performance! Keep practicing to refine your skills ??";
  } else {
    performanceMessage = "Keep practicing! Every interview makes you stronger ??";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* =========================
            Top Navigation
        ========================= */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="flex items-center gap-2 text-blue-600 font-bold">
            {result.isResumeBased ? (
              <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
                <FileCheck size={14} /> Resume Interview
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full">
                <Code2 size={14} /> Role Interview
              </span>
            )}
          </div>
        </div>

        {/* =========================
            Main Result Header Banner
        ========================= */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 md:p-10 text-white">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Trophy size={42} className="text-yellow-300" />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold mt-5">
              Interview Completed ??
            </h1>

            <p className="text-blue-100 mt-2 text-sm md:text-base">
              {result.role || result.technology || "AI Interview"} • Performance Breakdown
            </p>

            <p className="mt-4 text-base md:text-lg font-semibold bg-white/15 inline-block px-5 py-2 rounded-full backdrop-blur-sm">
              {performanceMessage}
            </p>
          </div>
        </div>

        {/* =========================
            Score Overview
        ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          {/* Total Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Trophy className="text-blue-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mt-4 font-medium">Total Score</p>
            <p className="text-4xl font-extrabold text-blue-600 mt-1">{totalScore}</p>
            <p className="text-xs text-gray-400 mt-1">out of {totalQuestions * 10}</p>
          </div>

          {/* Average */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
              <Target className="text-purple-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mt-4 font-medium">Average Score</p>
            <p className="text-4xl font-extrabold text-purple-600 mt-1">{averageScore}</p>
            <p className="text-xs text-gray-400 mt-1">out of 10</p>
          </div>

          {/* Percentage */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <Award className="text-green-600" size={24} />
            </div>
            <p className="text-gray-500 text-sm mt-4 font-medium">Overall Grade</p>
            <p className="text-4xl font-extrabold text-green-600 mt-1">{percentage}%</p>
            <p className="text-xs text-gray-400 mt-1">Total Accuracy</p>
          </div>
        </div>

        {/* =========================
            Progress Bar
        ========================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Overall Accuracy Rate</h2>
            <span className="font-bold text-blue-600">{percentage}%</span>
          </div>

          <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* =========================
            Question Results
        ========================= */}
        <div className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Question-wise AI Evaluation
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Review each question, your answer, and the AI feedback.
            </p>
          </div>

          <div className="space-y-6">
            {answers.map((item, index) => {
              const score = Number(item.score) || 0;
              const candidateAnswer =
                item.answer ||
                item.candidateAnswer ||
                "No answer provided.";

              const feedbackText = item.feedback || item.overallFeedback || "";

              return (
                <div
                  key={item._id || index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between bg-slate-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">
                        Question {index + 1}
                      </span>
                    </div>

                    <div
                      className={`px-3.5 py-1.5 rounded-full font-bold text-xs ${
                        score >= 8
                          ? "bg-green-100 text-green-700"
                          : score >= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Score: {score}/10
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Question */}
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                      {item.question}
                    </h3>

                    {/* Candidate Answer */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-blue-600" />
                        <p className="font-bold text-xs uppercase tracking-wider text-gray-600">
                          Your Answer
                        </p>
                      </div>

                      <div className="mt-2 bg-slate-50/80 border border-slate-200/60 rounded-xl p-4">
                        <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">
                          {candidateAnswer}
                        </p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    {feedbackText && (
                      <div className="mt-4 bg-purple-50/70 border border-purple-100 rounded-xl p-4">
                        <p className="font-bold text-purple-700 text-xs uppercase tracking-wider mb-1.5">
                          ?? AI Evaluation & Feedback
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {feedbackText}
                        </p>
                      </div>
                    )}

                    {/* Correct Answer */}
                    {item.correctAnswer && (
                      <div className="mt-4 bg-blue-50/70 border border-blue-100 rounded-xl p-4">
                        <p className="font-bold text-blue-700 text-xs uppercase tracking-wider mb-1.5">
                          ?? Ideal Answer / Key Concepts
                        </p>
                        <p className="text-blue-950 text-sm leading-relaxed">
                          {item.correctAnswer}
                        </p>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {item.strengths && item.strengths.length > 0 && (
                        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
                          <p className="font-bold text-emerald-700 text-xs uppercase tracking-wider mb-1.5">
                            ? Strengths
                          </p>
                          <ul className="space-y-1 text-xs text-emerald-900 pl-4 list-disc">
                            {item.strengths.map((str, sIdx) => (
                              <li key={sIdx}>{str}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.weaknesses && item.weaknesses.length > 0 && (
                        <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5">
                          <p className="font-bold text-amber-700 text-xs uppercase tracking-wider mb-1.5">
                            ?? Areas to Improve
                          </p>
                          <ul className="space-y-1 text-xs text-amber-900 pl-4 list-disc">
                            {item.weaknesses.map((weak, wIdx) => (
                              <li key={wIdx}>{weak}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================
            Bottom Action Buttons
        ========================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition shadow-sm"
          >
            <Home size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/generate")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-500/20"
          >
            <span>Practice Another Interview</span>
            <ArrowLeft size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
