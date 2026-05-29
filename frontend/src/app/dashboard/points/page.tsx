// src/app/dashboard/points/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import FeedbackSheet from "@/components/FeedbackSheet";

const EARNING_ACTIVITIES = [
  { icon: "fa-user-check", color: "#0D4429", bg: "#E8F4EE", title: "Complete Your Profile", points: "+10", done: false },
  { icon: "fa-file-alt", color: "#D97706", bg: "#FEF3C7", title: "Add Exam Results", points: "+5", done: false },
  { icon: "fa-fire", color: "#C2410C", bg: "#FEE2E2", title: "7-Day Login Streak", points: "+15", done: false },
  { icon: "fa-book-open", color: "#7C3AED", bg: "#EDE9FE", title: "Complete a Career Module", points: "+8", done: false },
  { icon: "fa-comment-medical", color: "#0891B2", bg: "#E0F7FA", title: "Submit Platform Feedback", points: "+3", done: false },
  { icon: "fa-share-nodes", color: "#D97706", bg: "#FEF3C7", title: "Share Your Career Path", points: "+5", done: false },
];

export default async function PointsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let userData = null;
  if (userId) {
    const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    userData = rows[0] ?? null;
  }

  const points = userData?.danhoPoints ?? 0;
  const tokensLeft = (userData?.chatTokensDaily ?? 20) - (userData?.chatTokensUsedToday ?? 0);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
          <i className="fa-solid fa-coins text-[#D97706] mr-3"></i>
          Danho Points
        </h1>
        <p className="text-gray-500 text-sm">Earn points to unlock more chat tokens and premium features.</p>
      </div>

      {/* Points Balance */}
      <div className="bg-[#0D4429] rounded-3xl p-6 mb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-1/4 -translate-y-1/4"></div>
        </div>
        <div className="relative">
          <i className="fa-solid fa-coins text-[#D97706] text-3xl mb-3 block"></i>
          <p className="text-5xl font-bold text-white mb-1">{points}</p>
          <p className="text-white/60 text-sm mb-4">Total Danho Points</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white text-xl font-bold">{tokensLeft}</p>
              <p className="text-white/60 text-xs">Tokens Today</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white text-xl font-bold">{userData?.plan === "premium" ? "Pro" : "Free"}</p>
              <p className="text-white/60 text-xs">Your Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earn Points */}
      <h2 className="font-semibold text-[#0D4429] text-lg mb-3">
        <i className="fa-solid fa-bolt text-[#D97706] mr-2"></i>
        Ways to Earn Points
      </h2>
      <div className="space-y-3 mb-6">
        {EARNING_ACTIVITIES.map((activity) => (
          <div
            key={activity.title}
            className="flex items-center gap-4 bg-white rounded-2xl border border-[#EDE3DC] p-4 hover:shadow-card transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: activity.bg }}
            >
              <i className={`fa-solid ${activity.icon}`} style={{ color: activity.color }}></i>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#0D4429] text-sm">{activity.title}</p>
            </div>
            <div className="bg-[#E8F4EE] text-[#0D4429] text-xs font-bold px-2.5 py-1 rounded-full">
              {activity.points}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback CTA */}
      <div className="bg-[#FEF3C7] rounded-2xl p-5 border border-[#FDE68A] mb-6">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-lightbulb text-[#D97706] text-xl mt-0.5"></i>
          <div>
            <p className="font-semibold text-[#92400E] mb-1">Quick +3 Points!</p>
            <p className="text-sm text-[#92400E]/80 mb-3">
              Submit feedback about your experience and instantly earn 3 Danho Points, unlocking more chat tokens.
            </p>
            <FeedbackSheet />
          </div>
        </div>
      </div>

      {/* Premium Upgrade */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-crown text-yellow-300 text-xl mt-0.5"></i>
          <div>
            <p className="font-semibold mb-1">Upgrade to Premium</p>
            <p className="text-white/70 text-sm mb-3">Get unlimited chat tokens, advanced career reports, and priority Zoe access.</p>
            <button className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-purple-50 transition-colors">
              <i className="fa-solid fa-bolt mr-1.5"></i>
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}