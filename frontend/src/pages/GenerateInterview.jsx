import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Code2,
  GraduationCap,
  Sparkles,
  Target,
  Users,
  ChevronDown,
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { generateInterview } from "../services/interviewService";

const GenerateInterview = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active Mode: 'resume' or 'custom'
  const [activeTab, setActiveTab] = useState("resume");

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    interviewType: "Technical",
    role: "Frontend Developer",
    experience: "Fresher",
    difficulty: "Medium",
    questions: "10",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle File Selection
  const handleFileChange = (file) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || lowerName.endsWith(".pdf");
    const isDocx =
      file.type.includes("wordprocessingml") ||
      file.type.includes("msword") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc");

    if (!isPdf && !isDocx) {
      toast.error("Please upload a PDF or DOCX resume.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB.");
      return;
    }

    setResumeFile(file);
    toast.success(`Resume "${file.name}" ready!`);
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle Generate
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (activeTab === "resume" && !resumeFile) {
      toast.error("Please upload your resume or switch to 'Continue Without Resume'.");
      return;
    }

    try {
      setLoading(true);

      let payload;

      if (activeTab === "resume" && resumeFile) {
        payload = new FormData();
        payload.append("resume", resumeFile);
        payload.append("interviewType", formData.interviewType);
        payload.append("role", formData.role || "Resume Candidate");
        payload.append("experience", formData.experience);
        payload.append("difficulty", formData.difficulty);
        payload.append("questionCount", formData.questions);
      } else {
        payload = {
          interviewType: formData.interviewType,
          role: formData.role,
          experience: formData.experience,
          difficulty: formData.difficulty,
          questionCount: Number(formData.questions),
        };
      }

      console.log("Generating interview with payload mode:", activeTab);
      const response = await generateInterview(payload);
      console.log("Backend Response:", response);

      if (response.success) {
        const interviewId = response.interviewId || response.interview?.id || response.interview?._id;
        toast.success("Interview Generated Successfully! ??");
        navigate(`/interview/${interviewId}`);
      } else {
        toast.error(response.message || "Failed to generate interview");
      }
    } catch (error) {
      console.error("Generate Interview Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while generating the interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format File Size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60 px-4 py-8">
      {/* Back Button */}
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20">
            <Sparkles size={30} />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Create Your AI Interview
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-gray-600">
            Tailor your interview by uploading your resume or choosing your target role.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-10"
        >
          {/* Mode Selector Tabs */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3 rounded-2xl bg-slate-100/80 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("resume")}
              className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 px-4 font-bold text-sm transition-all duration-300 ${
                activeTab === "resume"
                  ? "bg-white text-blue-600 shadow-md shadow-slate-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileCheck size={18} />
              <span>A. Upload Resume & Start Interview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl py-3 px-4 font-bold text-sm transition-all duration-300 ${
                activeTab === "custom"
                  ? "bg-white text-blue-600 shadow-md shadow-slate-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Briefcase size={18} />
              <span>B. Continue Without Resume</span>
            </button>
          </div>

          <form onSubmit={handleGenerate}>
            <AnimatePresence mode="wait">
              {activeTab === "resume" ? (
                <motion.div
                  key="resume-tab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Resume Upload Box */}
                  <div className="mb-8">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
                          <FileText size={18} />
                        </div>
                        <h2 className="font-bold text-gray-900">Upload Your Resume</h2>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        PDF or DOCX (Max 10MB)
                      </span>
                    </div>

                    {!resumeFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 ${
                          isDragging
                            ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                            : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleFileChange(e.target.files?.[0])}
                          className="hidden"
                        />

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600 transition group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                          <UploadCloud size={32} />
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-gray-800">
                          Drag & drop your resume here, or{" "}
                          <span className="text-blue-600 underline">Browse</span>
                        </h3>

                        <p className="mt-1.5 text-xs md:text-sm text-gray-500 max-w-md">
                          AI will parse your skills, technologies, projects, and work experience to create questions tailored exclusively to your background.
                        </p>
                      </div>
                    ) : (
                      /* File Selected Card */
                      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 p-5 md:p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                              <FileText size={28} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900 text-base line-clamp-1">
                                  {resumeFile.name}
                                </h4>
                                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500">
                                {formatFileSize(resumeFile.size)} • Ready for AI extraction
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3.5 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition"
                            >
                              Replace File
                            </button>
                            <button
                              type="button"
                              onClick={() => setResumeFile(null)}
                              className="p-2 text-red-500 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition"
                              title="Remove Resume"
                            >
                              <Trash2 size={16} />
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={(e) => handleFileChange(e.target.files?.[0])}
                              className="hidden"
                            />
                          </div>
                        </div>

                        {/* Resume AI Badge */}
                        <div className="mt-4 flex items-start gap-2 text-xs text-blue-800 bg-blue-100/60 p-3 rounded-xl">
                          <AlertCircle size={16} className="shrink-0 text-blue-600 mt-0.5" />
                          <span>
                            <strong>Resume Mode Active:</strong> Questions will only be generated from technologies, projects, and skills present in your uploaded resume.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="custom-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Interview Type Selection */}
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                        <Users size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">Interview Type</h2>
                        <p className="text-xs text-gray-500">
                          Choose the interview style you want to practice.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {["Technical", "HR"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, interviewType: type })}
                          className={`rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                            formData.interviewType === type
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                              {type === "Technical" ? <Code2 size={24} /> : <Users size={24} />}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{type} Interview</h3>
                              <p className="mt-1 text-xs text-gray-500">
                                {type === "Technical"
                                  ? "Coding, DSA & technical architecture"
                                  : "Behavioral & situational questions"}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Target Job Role
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        <option>Frontend Developer</option>
                        <option>Backend Developer</option>
                        <option>Full Stack Developer</option>
                        <option>React Developer</option>
                        <option>Node.js Developer</option>
                        <option>Software Engineer</option>
                        <option>MERN Stack Developer</option>
                        <option>Python Developer</option>
                      </select>
                      <ChevronDown
                        size={18}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Shared Parameters: Experience, Difficulty, Questions */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Experience Level
                </label>
                <div className="relative">
                  <GraduationCap
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Fresher</option>
                    <option>1–2 Years</option>
                    <option>3–5 Years</option>
                    <option>5+ Years</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Difficulty Level
                </label>
                <div className="relative">
                  <Target
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Number of Questions
                </label>
                <div className="relative">
                  <Target
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="questions"
                    value={formData.questions}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-10 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-600 p-2 text-white shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Interview Summary</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {activeTab === "resume" ? (
                      <>
                        Generating a <strong>{formData.difficulty.toLowerCase()}</strong> level interview with{" "}
                        <strong>{formData.questions}</strong> personalized questions based on{" "}
                        <strong>{resumeFile ? resumeFile.name : "your uploaded resume"}</strong>.
                      </>
                    ) : (
                      <>
                        Generating a <strong>{formData.difficulty.toLowerCase()}</strong> level{" "}
                        <strong>{formData.interviewType}</strong> interview for a{" "}
                        <strong>{formData.role}</strong> with <strong>{formData.questions}</strong> questions.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              disabled={loading || (activeTab === "resume" && !resumeFile)}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Generating AI Interview...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>
                    {activeTab === "resume"
                      ? "Start Resume-Based Interview"
                      : "Generate AI Interview"}
                  </span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GenerateInterview;
