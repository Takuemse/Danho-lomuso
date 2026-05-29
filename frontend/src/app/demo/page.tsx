// src/app/demo/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_STEPS = [
  {
    step: 1,
    icon: "fa-language",
    color: "#0D4429",
    bg: "#E8F4EE",
    title: "Choose Your Language",
    description:
      "Select English, chiShona, or isiNdebele. Zoe adapts her entire conversation style to your language — even understanding code-switching.",
    demo: (
      <div className="flex gap-2 flex-wrap">
        {["English", "chiShona", "isiNdebele"].map((lang) => (
          <span
            key={lang}
            className="px-3 py-1.5 rounded-full text-sm font-semibold border-2 border-[#0D4429] text-[#0D4429]"
          >
            {lang}
          </span>
        ))}
      </div>
    ),
  },
  {
    step: 2,
    icon: "fa-file-alt",
    color: "#C2410C",
    bg: "#FEE2E2",
    title: "Enter Your Exam Results",
    description:
      "Input your ZIMSEC or Cambridge results. Zoe accepts all grades — A through U — with zero judgement. Every result leads somewhere.",
    demo: (
      <div className="space-y-2">
        {[
          { subject: "Mathematics", grade: "B", color: "#0D4429" },
          { subject: "English Language", grade: "A", color: "#0D4429" },
          { subject: "Combined Science", grade: "C", color: "#D97706" },
        ].map((r) => (
          <div key={r.subject} className="flex items-center justify-between bg-[#F5EFEB] rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-700">{r.subject}</span>
            <span className="font-bold" style={{ color: r.color }}>{r.grade}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 3,
    icon: "fa-brain",
    color: "#7C3AED",
    bg: "#EDE9FE",
    title: "Zoe Analyzes Your Profile",
    description:
      "Zoe instantly processes your results, interests, and location to generate personalized career recommendations using Gemini AI.",
    demo: (
      <div className="bg-[#0D4429] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-brain text-white text-xs"></i>
          </div>
          <span className="text-white text-sm font-semibold">Zoe</span>
          <span className="text-white/50 text-xs">is analyzing...</span>
        </div>
        <div className="space-y-1.5">
          {["Reading exam results...", "Matching career paths...", "Preparing your report..."].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <i className="fa-solid fa-check-circle text-green-400 text-xs"></i>
              <span className="text-white/80 text-xs">{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: 4,
    icon: "fa-compass",
    color: "#D97706",
    bg: "#FEF3C7",
    title: "Explore Your Career Paths",
    description:
      "Receive 3–5 personalized career paths with clear steps, partner institutions, and honest salary expectations within Zimbabwe's economy.",
    demo: (
      <div className="space-y-2">
        {[
          { title: "Software Engineering", badge: "Top Match", badgeColor: "#0D4429" },
          { title: "Agri-Business", badge: "Vocational", badgeColor: "#D97706" },
          { title: "Healthcare / Nursing", badge: "University", badgeColor: "#C2410C" },
        ].map((path) => (
          <div key={path.title} className="flex items-center justify-between bg-white border border-[#EDE3DC] rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-arrow-right text-[#0D4429] text-xs"></i>
              <span className="text-sm font-medium text-gray-700">{path.title}</span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: path.badgeColor }}
            >
              {path.badge}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 5,
    icon: "fa-comment-dots",
    color: "#0891B2",
    bg: "#E0F7FA",
    title: "Chat With Zoe Anytime",
    description:
      "Got more questions? Chat with Zoe in your language. Earn Danho Points by learning — points unlock more free chat tokens.",
    demo: (
      <div className="space-y-2">
        <div className="bg-[#0D4429] text-white text-xs px-3 py-2 rounded-xl rounded-tl-sm max-w-[85%]">
          Mwanangu, your Maths grade shows strong analytical thinking — perfect for engineering!
        </div>
        <div className="bg-[#F5EFEB] text-gray-700 text-xs px-3 py-2 rounded-xl rounded-tr-sm max-w-[85%] ml-auto">
          What universities in Zimbabwe offer engineering?
        </div>
        <div className="bg-[#0D4429] text-white text-xs px-3 py-2 rounded-xl rounded-tl-sm max-w-[85%]">
          Great question! UZ, NUST, and HIT all have strong engineering programs...
        </div>
      </div>
    ),
  },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#FFFDF9]/90 backdrop-blur-sm border-b border-[#EDE3DC]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-xs"></i>
            </div>
            <span className="font-serif font-bold text-[#0D4429]">Danho Lomuso</span>
          </Link>
          <Link
            href="/onboarding"
            className="bg-[#0D4429] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#155E38] transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0D4429]/10 text-[#0D4429] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <i className="fa-solid fa-play-circle"></i>
            How It Works
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4429] mb-3">
            Your journey in 5 simple steps
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From your first visit to a clear career plan — here&apos;s exactly how Danho Lomuso works.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Step Tabs */}
          <div className="space-y-3">
            {DEMO_STEPS.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeStep === idx
                    ? "border-[#0D4429] bg-white shadow-[0_4px_20px_rgba(13,68,41,0.1)]"
                    : "border-[#EDE3DC] bg-white/50 hover:border-[#0D4429]/30"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activeStep === idx ? step.bg : "#F5EFEB" }}
                >
                  <i
                    className={`fa-solid ${step.icon} text-sm`}
                    style={{ color: activeStep === idx ? step.color : "#9CA3AF" }}
                  ></i>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: activeStep === idx ? step.color : "#9CA3AF" }}
                    >
                      Step {step.step}
                    </span>
                  </div>
                  <p className={`font-semibold text-sm ${activeStep === idx ? "text-[#0D4429]" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
                {activeStep === idx && (
                  <i className="fa-solid fa-chevron-right text-[#0D4429] ml-auto mt-1 flex-shrink-0"></i>
                )}
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl border border-[#EDE3DC] shadow-[0_8px_40px_rgba(13,68,41,0.1)] p-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: DEMO_STEPS[activeStep].bg }}
              >
                <i
                  className={`fa-solid ${DEMO_STEPS[activeStep].icon} text-2xl`}
                  style={{ color: DEMO_STEPS[activeStep].color }}
                ></i>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: DEMO_STEPS[activeStep].color }}
                >
                  Step {DEMO_STEPS[activeStep].step} of {DEMO_STEPS.length}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0D4429] mb-3">
                {DEMO_STEPS[activeStep].title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                {DEMO_STEPS[activeStep].description}
              </p>

              {/* Demo Preview */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#EDE3DC] p-4 mb-5">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">Preview</p>
                {DEMO_STEPS[activeStep].demo}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2">
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep((s) => s - 1)}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-[#0D4429] text-[#0D4429] font-semibold py-2.5 rounded-xl hover:bg-[#0D4429]/5 transition-colors text-sm"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    Previous
                  </button>
                )}
                {activeStep < DEMO_STEPS.length - 1 ? (
                  <button
                    onClick={() => setActiveStep((s) => s + 1)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-2.5 rounded-xl hover:bg-[#155E38] transition-colors text-sm"
                  >
                    Next Step
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                ) : (
                  <Link
                    href="/onboarding"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-2.5 rounded-xl hover:bg-[#155E38] transition-colors text-sm"
                  >
                    <i className="fa-solid fa-rocket"></i>
                    Start For Free!
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#0D4429] rounded-3xl p-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to find your path?
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Join thousands of Zimbabwean students already using Danho Lomuso — completely free to start.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-white text-[#0D4429] font-bold px-8 py-3.5 rounded-xl hover:bg-[#F5EFEB] transition-colors"
          >
            <i className="fa-solid fa-seedling"></i>
            Begin Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
}