// src/components/FeedbackSheet.tsx
"use client";

import { useState } from "react";

const CATEGORIES = [
  { key: "bug", icon: "fa-bug", label: "Bug Report" },
  { key: "feature", icon: "fa-lightbulb", label: "Feature Idea" },
  { key: "content", icon: "fa-file-alt", label: "Content Issue" },
  { key: "general", icon: "fa-comment", label: "General" },
];

export default function FeedbackSheet() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "cooldown">("idle");

  async function handleSubmit() {
    if (!message.trim() || message.length < 10) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message }),
      });

      if (res.status === 429) {
        setStatus("cooldown");
        return;
      }

      if (res.ok) {
        setStatus("success");
        setMessage("");
        setTimeout(() => {
          setOpen(false);
          setStatus("idle");
        }, 2500);
      }
    } catch {
      setStatus("idle");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-[#D97706] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#B45309] transition-colors"
      >
        <i className="fa-solid fa-comment-medical"></i>
        Give Feedback (+3 pts)
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 page-enter">
            {status === "success" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-circle-check text-green-500 text-3xl"></i>
                </div>
                <p className="font-semibold text-[#0D4429] text-xl mb-2">Thank you!</p>
                <p className="text-gray-500 text-sm">You earned <strong>+3 Danho Points</strong> for your feedback!</p>
              </div>
            ) : status === "cooldown" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-clock text-[#D97706] text-3xl"></i>
                </div>
                <p className="font-semibold text-[#0D4429] mb-2">Cooldown Active</p>
                <p className="text-gray-500 text-sm">You can submit feedback once every 6 hours. Come back later!</p>
                <button onClick={() => setOpen(false)} className="mt-4 text-sm text-[#0D4429] hover:underline">Close</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-[#0D4429] text-lg">Share Feedback</h3>
                    <p className="text-xs text-gray-500">Earn +3 Danho Points instantly</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>

                {/* Category Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        category === cat.key
                          ? "bg-[#0D4429] text-white"
                          : "bg-[#F5EFEB] text-gray-600 hover:bg-[#EDE3DC]"
                      }`}
                    >
                      <i className={`fa-solid ${cat.icon}`}></i>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think, what's broken, or what you'd love to see..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] bg-[#FFFDF9] text-sm resize-none focus:outline-none focus:border-[#0D4429] transition-colors mb-1"
                />
                <p className="text-xs text-gray-400 text-right mb-4">{message.length}/500</p>

                <button
                  onClick={handleSubmit}
                  disabled={status === "submitting" || message.trim().length < 10}
                  className="w-full flex items-center justify-center gap-2 bg-[#D97706] text-white font-semibold py-3.5 rounded-xl hover:bg-[#B45309] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {status === "submitting" ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i>Submitting...</>
                  ) : (
                    <><i className="fa-solid fa-paper-plane"></i>Submit & Earn +3 Points</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}