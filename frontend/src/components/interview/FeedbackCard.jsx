import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Lightbulb } from "lucide-react";

const FeedbackCard = ({ feedback, onNext }) => {
  if (!feedback) return null;

  const score = Number(feedback.score) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mt-6"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Feedback & Evaluation</h3>
            <p className="text-xs text-gray-500">Instant AI analysis for your answer</p>
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-2xl font-extrabold text-base flex items-center gap-1.5 ${
            score >= 8
              ? "bg-green-100 text-green-700"
              : score >= 5
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span>Score:</span>
          <span>{score}/10</span>
        </div>
      </div>

      {/* Overall Feedback */}
      {feedback.overallFeedback && (
        <div className="mb-5 bg-slate-50 border border-slate-200/70 rounded-2xl p-4 md:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Detailed Feedback
          </p>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {feedback.overallFeedback}
          </p>
        </div>
      )}

      {/* Correct / Ideal Answer */}
      {feedback.correctAnswer && (
        <div className="mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 md:p-5">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1.5">
            <Lightbulb size={18} />
            <span>Key Concepts & Ideal Answer</span>
          </div>
          <p className="text-sm md:text-base text-blue-900 leading-relaxed">
            {feedback.correctAnswer}
          </p>
        </div>
      )}

      {/* Strengths & Weaknesses Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
              <CheckCircle2 size={16} />
              <span>Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs md:text-sm text-emerald-900">
              {feedback.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.weaknesses && feedback.weaknesses.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
              <AlertCircle size={16} />
              <span>Areas to Improve</span>
            </div>
            <ul className="space-y-1.5 text-xs md:text-sm text-amber-900">
              {feedback.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Next Question Button */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
      >
        <span>Next Question</span>
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
};

export default FeedbackCard;
