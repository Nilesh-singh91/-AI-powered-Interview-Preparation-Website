import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  History,
  Trophy,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import StatsCard from "../components/dashboard/StatsCard";
import { useNavigate } from "react-router-dom";
import { getDashboardAnalytics } from "../services/interviewService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Dashboard Analytics
  // =========================

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getDashboardAnalytics();

        console.log("DASHBOARD ANALYTICS:", response);

        setAnalytics(response.analytics);
      } catch (error) {
        console.error(
          "Dashboard Analytics Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // =========================
  // Format Last Interview Date
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "No interview yet";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          Header
      ========================= */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Interview
            </h1>

            <p className="text-xs text-gray-500">
              Preparation Platform
            </p>
          </div>

          {/* User + Logout */}

          <div className="flex items-center gap-3">

            {/* Name (hidden on mobile) */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </p>
            </div>

            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* =========================
          Main Content
      ========================= */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* =========================
            Welcome Banner
        ========================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-purple-600
            p-8
            text-white
            shadow-xl
          "
        >

          {/* Glow */}

          <div
            className="
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div className="relative">

            <p className="mb-2 text-sm font-medium text-blue-100">
              Welcome back 👋
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              {user?.name || "Future Developer"}
            </h2>

            <p className="mt-3 max-w-xl text-blue-100">
              Ready to improve your interview skills?
              Practice with our AI interviewer and become
              interview-ready.
            </p>

            <button
              onClick={() => navigate("/generate")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                font-semibold
                text-blue-700
                shadow-lg
                transition
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              <Mic size={18} />

              Start New Interview

              <ArrowRight size={18} />

            </button>

          </div>

        </motion.div>


        {/* =========================
            Statistics
        ========================= */}

        <section className="mt-8">

          <div className="mb-5">

            <h3 className="text-xl font-bold text-gray-900">
              Your Performance
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Track your interview preparation progress.
            </p>

          </div>


          <div
            className="
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            {/* Total Interviews */}

            <StatsCard
              title="Total Interviews"
              value={analytics?.totalInterviews || 0}
              subtitle={
                analytics?.totalInterviews
                  ? "Interviews completed"
                  : "Start your first interview"
              }
              icon={Mic}
            />


            {/* Average Score */}

            <StatsCard
              title="Average Score"
              value={`${analytics?.averageScore || 0}/10`}
              subtitle="Your average performance"
              icon={Target}
            />


            {/* Best Score */}

            <StatsCard
              title="Best Score"
              value={`${analytics?.highestScore || 0}/10`}
              subtitle="Your highest score"
              icon={Trophy}
            />


            {/* Last Interview */}

            <StatsCard
              title="Last Interview"
              value={
                analytics?.lastInterviewDate
                  ? formatDate(
                      analytics.lastInterviewDate
                    )
                  : "None"
              }
              subtitle={
                analytics?.latestTechnology
                  ? analytics.latestTechnology
                  : "No interview completed"
              }
              icon={Clock}
            />

          </div>

        </section>


        {/* =========================
            Quick Actions
        ========================= */}

        <section className="mt-10">

          <h3 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">


            {/* Start Interview */}

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate("/generate")}
              className="
                cursor-pointer
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

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >

                <Mic size={22} />

              </div>

              <div className="flex items-center justify-between">

                <div>

                  <h4 className="mt-5 text-lg font-bold text-gray-900">
                    Start Interview
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Generate a personalized AI interview
                    based on your skills.
                  </p>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 mt-5"
                />

              </div>

            </motion.div>


            {/* Interview History */}

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate("/history")}
              className="
                cursor-pointer
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

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-50
                  text-purple-600
                "
              >

                <History size={22} />

              </div>

              <div className="flex items-center justify-between">

                <div>

                  <h4 className="mt-5 text-lg font-bold text-gray-900">
                    Interview History
                  </h4>

                  <p className="mt-2 text-sm text-gray-500">
                    Review your previous interviews,
                    scores and feedback.
                  </p>

                </div>

                <ArrowRight
                  size={20}
                  className="text-gray-400 mt-5"
                />

              </div>

            </motion.div>

          </div>

        </section>


        {/* =========================
            Performance Summary
        ========================= */}

        <section className="mt-10 mb-10">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold text-gray-900">
                  Performance Summary
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your current interview preparation status.
                </p>

              </div>

              <Trophy
                size={28}
                className="text-yellow-500"
              />

            </div>


            <div className="mt-6 grid gap-5 sm:grid-cols-3">

              {/* Average */}

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Average
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {analytics?.averageScore || 0}/10
                </p>

              </div>


              {/* Best */}

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Best Score
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {analytics?.highestScore || 0}/10
                </p>

              </div>


              {/* Completed */}

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {analytics?.totalInterviews || 0}
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;