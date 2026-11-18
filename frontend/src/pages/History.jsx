import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  Trophy,
  Target,
  ArrowLeft,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getInterviewHistory } from "../services/interviewService";

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Interview History
  // =========================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getInterviewHistory();

        console.log("INTERVIEW HISTORY:", response);

        setHistory(response.history || []);
      } catch (error) {
        console.error("History Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load interview history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =========================
  // Format Date
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // Get Score
  // =========================

  const getScore = (item) => {
    if (typeof item.score === "number") {
      return item.score;
    }

    if (typeof item.totalScore === "number") {
      return item.totalScore;
    }

    return 0;
  };

  // =========================
  // Get Total Questions
  // =========================

  const getTotalQuestions = (item) => {
    if (item.totalQuestions) {
      return item.totalQuestions;
    }

    if (item.answers?.length) {
      return item.answers.length;
    }

    return 0;
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading interview history...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // Empty History
  // =========================

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Header */}

        <header className="border-b border-gray-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

          </div>

        </header>


        {/* Empty State */}

        <main className="mx-auto max-w-4xl px-6 py-16">

          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

              <HistoryIcon
                size={40}
                className="text-blue-600"
              />

            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              No Interview History
            </h1>

            <p className="mt-3 text-gray-500">
              You haven't completed any interviews yet.
              Start your first AI interview and your results
              will appear here.
            </p>

            <button
              onClick={() => navigate("/generate")}
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-semibold
                text-white
                shadow-lg
                transition
                hover:bg-blue-700
                hover:-translate-y-1
              "
            >
              Start Interview
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =========================
  // History UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          Header
      ========================= */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-4">

          <div className="flex items-center justify-between">

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

            <div className="flex items-center gap-2 text-blue-600">

              <HistoryIcon size={21} />

              <span className="font-bold">
                Interview History
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =========================
          Main
      ========================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Page Header */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >

          <h1 className="text-3xl font-bold text-gray-900">
            Interview History
          </h1>

          <p className="mt-2 text-gray-500">
            Review your previous AI interview performances.
          </p>

        </motion.div>


        {/* =========================
            Summary
        ========================= */}

        <div className="grid gap-5 sm:grid-cols-3 mb-8">

          {/* Total */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Interviews
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {history.length}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                <HistoryIcon
                  size={24}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>


          {/* Latest Score */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Latest Score
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {getScore(history[0])}/
                  {getTotalQuestions(history[0]) * 10}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">

                <Target
                  size={24}
                  className="text-purple-600"
                />

              </div>

            </div>

          </div>


          {/* Best Score */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Best Score
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">

                  {Math.max(
                    ...history.map((item) =>
                      getScore(item)
                    )
                  )}

                  /10

                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">

                <Trophy
                  size={24}
                  className="text-yellow-600"
                />

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            Interview List
        ========================= */}

        <div className="space-y-5">

          {history.map((item, index) => {

            const score = getScore(item);

            const totalQuestions =
              getTotalQuestions(item);

            const scoreOutOf =
              totalQuestions > 0
                ? totalQuestions * 10
                : 10;

            const percentage =
              scoreOutOf > 0
                ? Math.round(
                    (score / scoreOutOf) * 100
                  )
                : 0;

            return (
              <motion.div
                key={item._id || item.id || index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  hover:shadow-lg
                "
              >

                {/* Top */}

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                      <FileText
                        size={23}
                        className="text-blue-600"
                      />

                    </div>


                    <div>

                      <h2 className="text-lg font-bold text-gray-900">
                        {item.role ||
                          item.technology ||
                          "AI Interview"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.interviewType ||
                          "Technical"}
                        {item.experience
                          ? ` • ${item.experience}`
                          : ""}
                        {item.isResumeBased ? " • Resume Tailored" : ""}
                      </p>

                    </div>

                  </div>


                  {/* Score */}

                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 font-bold ${
                      percentage >= 80
                        ? "bg-green-100 text-green-700"
                        : percentage >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    <Trophy size={17} />

                    {score}/{scoreOutOf}

                  </div>

                </div>


                {/* Details */}

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">

                  {/* Technology */}

                  <div className="flex items-center gap-3">

                    <Target
                      size={18}
                      className="text-blue-600"
                    />

                    <div>

                      <p className="text-xs text-gray-400">
                        Technology
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        {item.technology ||
                          item.role ||
                          "Not specified"}
                      </p>

                    </div>

                  </div>


                  {/* Questions */}

                  <div className="flex items-center gap-3">

                    <FileText
                      size={18}
                      className="text-purple-600"
                    />

                    <div>

                      <p className="text-xs text-gray-400">
                        Questions
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        {totalQuestions}
                      </p>

                    </div>

                  </div>


                  {/* Date */}

                  <div className="flex items-center gap-3">

                    <Calendar
                      size={18}
                      className="text-green-600"
                    />

                    <div>

                      <p className="text-xs text-gray-400">
                        Completed
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        {formatDate(
                          item.createdAt
                        )}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Progress */}

                <div className="mt-5">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-gray-500">
                      Performance
                    </span>

                    <span className="font-semibold text-gray-700">
                      {percentage}%
                    </span>

                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">

                    <div
                      className={`h-full rounded-full ${
                        percentage >= 80
                          ? "bg-green-500"
                          : percentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>


                {/* View Result */}

                <div className="mt-5 flex justify-end">

                  <button
                    onClick={() => {
                      const targetId = item.interviewId || item._id || item.id;
                      if (targetId) {
                        navigate(`/result/${targetId}`);
                      } else {
                        toast.error(
                          "Result ID not found"
                        );
                      }
                    }}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-2.5
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >

                    <Eye size={17} />

                    View Result

                  </button>

                </div>

              </motion.div>
            );
          })}

        </div>

      </main>

    </div>
  );
};

export default History;