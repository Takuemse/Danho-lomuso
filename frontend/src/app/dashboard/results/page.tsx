"use client";

import { useState } from "react";
import Link from "next/link"; // Added for routing

interface ResultEntry {
  subject: string;
  grade: string;
}

const ZIMSEC_SUBJECTS = [
  "Mathematics", "English Language", "Shona", "History", "Geography",
  "Combined Science", "Physics", "Chemistry", "Biology", "Commerce",
  "Accounts", "Agriculture", "Art", "Music", "Physical Education",
  "Religious Studies", "Literature in English", "French", "Food & Nutrition",
];

const GRADES_OLEVEL = ["A", "B", "C", "D", "E", "F", "U"];
const GRADES_ALEVEL = ["A", "B", "C", "D", "E", "U"];

export default function ResultsPage() {
  const [examBoard, setExamBoard] = useState<"zimsec" | "cambridge">("zimsec");
  const [level, setLevel] = useState<"olevel" | "alevel">("olevel");
  const [year, setYear] = useState("2024");
  const [results, setResults] = useState<ResultEntry[]>([{ subject: "", grade: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function addSubject() {
    setResults([...results, { subject: "", grade: "" }]);
  }

  function removeSubject(idx: number) {
    setResults(results.filter((_, i) => i !== idx));
  }

  function updateResult(idx: number, field: "subject" | "grade", value: string) {
    const updated = [...results];
    updated[idx] = { ...updated[idx], [field]: value };
    setResults(updated);
  }

  async function handleSubmit() {
    const valid = results.filter((r) => r.subject && r.grade);
    if (valid.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examBoard, level, year: parseInt(year), results: valid }),
      });
      if (res.ok) {
        setSubmitted(true);
        // Auto-trigger AI analysis
        setIsAnalyzing(true);
        const analysisRes = await fetch("/api/analyze-results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results: valid }),
        });
        const analysisData = await analysisRes.json();
        setAiAnalysis(analysisData.analysis ?? "");
        setIsAnalyzing(false);
      }
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  const grades = level === "alevel" ? GRADES_ALEVEL : GRADES_OLEVEL;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
          <i className="fa-solid fa-file-alt text-[#D97706] mr-3"></i>
          Add Your Exam Results
        </h1>
        <p className="text-gray-500 text-sm">
          Zoe will analyze your results and suggest the best career paths for you.
        </p>
      </div>

      {submitted && aiAnalysis ? (
        <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-6 mb-6 page-enter">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-brain text-white"></i>
            </div>
            <div>
              <p className="font-semibold text-[#0D4429]">Zoe's Analysis</p>
              <p className="text-xs text-gray-500">Personalized career guidance</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
          <div className="mt-4 flex gap-3">
            {/* Fixed Link 1 */}
            <Link 
              href="/dashboard/chat"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-3 rounded-xl hover:bg-[#155E38] transition-colors text-sm"
            >
              <i className="fa-solid fa-comment-dots"></i>
              Talk to Zoe More
            </Link>
            
            {/* Fixed Link 2 */}
            <Link 
              href="/dashboard/career"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0D4429] text-[#0D4429] font-semibold py-3 rounded-xl hover:bg-[#0D4429]/5 transition-colors text-sm"
            >
              <i className="fa-solid fa-compass"></i>
              Explore Careers
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Exam Board Selector */}
          <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5 mb-4">
            <p className="text-sm font-semibold text-[#0D4429] mb-3">
              <i className="fa-solid fa-school mr-2"></i>Exam Board
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["zimsec", "cambridge"] as const).map((board) => (
                <button
                  key={board}
                  onClick={() => setExamBoard(board)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    examBoard === board
                      ? "bg-[#0D4429] text-white"
                      : "bg-[#F5EFEB] text-gray-600 hover:bg-[#EDE3DC]"
                  }`}
                >
                  {board === "zimsec" ? "ZIMSEC" : "Cambridge"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {(["olevel", "alevel"] as const).map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    level === lv
                      ? "bg-[#C2410C] text-white"
                      : "bg-[#F5EFEB] text-gray-600 hover:bg-[#EDE3DC]"
                  }`}
                >
                  {lv === "olevel" ? "O-Level" : "A-Level"}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-500 mb-1 block">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EDE3DC] text-sm bg-[#FFFDF9] focus:outline-none focus:border-[#0D4429]"
              >
                {["2024", "2023", "2022", "2021", "2020"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Entry */}
          <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5 mb-4">
            <p className="text-sm font-semibold text-[#0D4429] mb-3">
              <i className="fa-solid fa-list-check mr-2"></i>Subject Results
            </p>

            <div className="space-y-2">
              {results.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={r.subject}
                    onChange={(e) => updateResult(idx, "subject", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#EDE3DC] text-sm bg-[#FFFDF9] focus:outline-none focus:border-[#0D4429]"
                  >
                    <option value="">Select subject...</option>
                    {ZIMSEC_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    value={r.grade}
                    onChange={(e) => updateResult(idx, "grade", e.target.value)}
                    className="w-20 px-3 py-2 rounded-xl border border-[#EDE3DC] text-sm bg-[#FFFDF9] focus:outline-none focus:border-[#0D4429]"
                  >
                    <option value="">Grade</option>
                    {grades.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {results.length > 1 && (
                    <button onClick={() => removeSubject(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addSubject}
              className="mt-3 flex items-center gap-2 text-sm text-[#0D4429] font-medium hover:underline"
            >
              <i className="fa-solid fa-plus-circle"></i>
              Add Another Subject
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || results.every((r) => !r.subject || !r.grade)}
            className="w-full flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-4 rounded-xl hover:bg-[#155E38] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting || isAnalyzing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                {isAnalyzing ? "Zoe is analyzing..." : "Saving..."}
              </>
            ) : (
              <>
                <i className="fa-solid fa-brain"></i>
                Save & Get Zoe's Analysis
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}