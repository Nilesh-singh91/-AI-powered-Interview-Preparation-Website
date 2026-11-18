import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  FileCheck,
  Code2,
  Volume2,
  AlertCircle,
} from "lucide-react";

import CameraComponent from "../components/interview/Camera";
import PhoneDetector from "../components/interview/PhoneDetector";
import FeedbackCard from "../components/interview/FeedbackCard";

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Video Reference for Camera & Phone Detector
  const videoRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  // =========================
  // Initialize Speech Recognition
  // =========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setAnswer((prev) => {
              const separator = prev && !prev.endsWith(" ") ? " " : "";
              return `${prev}${separator}${transcript.trim()}`;
            });
          } else {
            currentTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Please check your browser permissions.");
        } else if (event.error !== "no-speech") {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("Speech recognition initialization failed:", err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (!speechSupported) {
      toast.error(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or type your answer manually."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast("Stopped listening", { icon: "?" });
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success("Listening... Speak your answer now! ???");
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        toast.error("Could not start microphone. Please try again.");
      }
    }
  };

  // =========================
  // Fetch Interview Data
  // =========================
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/interview/start/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInterview(response.data.interview);
        if (typeof response.data.interview?.currentQuestion === "number") {
          setCurrentQuestion(response.data.interview.currentQuestion);
        }
      } catch (error) {
        console.error("INTERVIEW LOAD ERROR:", error);
        toast.error(
          error.response?.data?.message || "Failed to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id]);

  // =========================
  // Next Question / Submit Answer
  // =========================
  const handleNext = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer by typing or speaking first.");
      return;
    }

    // Stop speech recognition if still active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/interview/next",
        {
          interviewId: id,
          answer: answer.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("NEXT QUESTION RESPONSE:", response.data);

      // Interview Completed
      if (response.data.completed) {
        toast.success("Interview completed! ??");
        navigate("/result", {
          state: {
            result: {
              totalScore: response.data.totalScore,
              totalQuestions: interview.questions.length,
              answers: response.data.answers,
              summary: response.data.summary,
            },
          },
        });
        return;
      }

      // Feedback for current question
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Next Question Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit answer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Continue to Next Question after reviewing Feedback
  const handleProceedNextQuestion = () => {
    setFeedback(null);
    setAnswer("");
    setCurrentQuestion((prev) => prev + 1);
  };

  // =========================
  // Loading & Error States
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-base font-semibold text-gray-700">
            Setting up your AI Interview room...
          </p>
        </div>
      </div>
    );
  }

  if (!interview || !interview.questions?.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Interview Not Found</h2>
          <p className="text-sm text-gray-500 mt-2">
            We couldn't retrieve the questions for this interview session.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = interview.questions[currentQuestion] || "All questions completed!";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/40 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* =========================
            Header
        ========================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  AI Interview Session
                </h1>
                {interview.isResumeBased ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                    <FileCheck size={14} /> Resume-Tailored
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                    <Code2 size={14} /> Role-Based
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {interview.role || interview.technology} • {interview.difficulty} Difficulty • {interview.experience}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 self-start sm:self-auto">
              <Sparkles size={16} className="text-blue-600" />
              <span>AI Evaluator Active</span>
            </div>
          </div>
        </div>

        {/* =========================
            Camera & Proctoring
        ========================= */}
        <div className="grid md:grid-cols-2 gap-4">
          <CameraComponent videoRef={videoRef} />
          <PhoneDetector videoRef={videoRef} />
        </div>

        {/* =========================
            Progress Tracker
        ========================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 mb-6">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-bold text-sm text-gray-800">
              Question {currentQuestion + 1} of {interview.questions.length}
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {Math.round(((currentQuestion + 1) / interview.questions.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / interview.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* =========================
            Question & Answer Box
        ========================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              Question #{currentQuestion + 1}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-snug">
            {question}
          </h2>

          {/* Answer Controls: Type or Speak */}
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Your Answer (Type or Speak)
            </label>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                isListening
                  ? "bg-red-500 text-white shadow-md shadow-red-500/30 animate-pulse hover:bg-red-600"
                  : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              {isListening ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  <MicOff size={15} />
                  <span>Stop Speaking</span>
                </>
              ) : (
                <>
                  <Mic size={15} />
                  <span>Speak Answer (Voice Input)</span>
                </>
              )}
            </button>
          </div>

          {/* Live Listening Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="w-1.5 h-5 bg-red-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-2.5 bg-red-500 rounded-full animate-pulse delay-150" />
                </div>
                <span>Listening actively... Speak clearly into your microphone. You can edit the text anytime.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer Textarea */}
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or click 'Speak Answer' to speak using your microphone..."
              rows={7}
              disabled={submitting || Boolean(feedback)}
              className="w-full border border-gray-300 rounded-2xl p-4 text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none disabled:bg-gray-50 text-sm md:text-base leading-relaxed"
            />
            {answer && !feedback && (
              <div className="absolute bottom-3 right-3 text-[11px] text-gray-400">
                {answer.split(/\s+/).filter(Boolean).length} words
              </div>
            )}
          </div>

          {/* Submit Answer Button */}
          {!feedback && (
            <button
              onClick={handleNext}
              disabled={submitting || !answer.trim()}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Evaluating Answer with AI...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* =========================
            Feedback Card Component
        ========================= */}
        {feedback && (
          <FeedbackCard
            feedback={feedback}
            onNext={handleProceedNextQuestion}
          />
        )}
      </div>
    </div>
  );
};

export default Interview;
