// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, studentProfiles, userMilestones } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { getGreeting } from "@/lib/i18n";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let userData = null;
  let profile = null;
  let milestones: { id: string; milestoneKey: string; titleEn: string; earnedAt: Date; pointsAwarded: number | null }[] = [];

  if (userId) {
    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    userData = userRows[0] ?? null;
    const profileRows = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
    profile = profileRows[0] ?? null;
    milestones = await db.select().from(userMilestones).where(eq(userMilestones.userId, userId)).limit(5);
  }

  const lang = (userData?.language ?? "en") as "en" | "sn" | "nd";
  const greeting = getGreeting(lang);
  const displayName = userData?.displayName ?? session?.user?.email?.split("@")[0] ?? "Friend";

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto page-enter">
      {/* Greeting Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429]">
          {greeting}, {displayName}!
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {lang === "sn"
            ? "Rwendo rwako rweramangwana runomirira pano."
            : lang === "nd"
            ? "Uhambo lwakho lweikusasa luqalisa lapha."
            : "Your journey to the future continues here."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            icon: "fa-coins",
            color: "#D97706",
            bg: "#FEF3C7",
            label: lang === "sn" ? "Mapoinzi" : lang === "nd" ? "Amaphuzu" : "Danho Points",
            value: userData?.danhoPoints ?? 0,
          },
          {
            icon: "fa-comment-dots",
            color: "#0D4429",
            bg: "#E8F4EE",
            label: lang === "sn" ? "Matokeni" : lang === "nd" ? "Amatokeni" : "Chat Tokens",
            value: `${(userData?.chatTokensDaily ?? 20) - (userData?.chatTokensUsedToday ?? 0)}`,
          },
          {
            icon: "fa-trophy",
            color: "#C2410C",
            bg: "#FEE2E2",
            label: lang === "sn" ? "Mafambiro" : lang === "nd" ? "Izinto" : "Milestones",
            value: milestones.length,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-[#EDE3DC] shadow-card">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
              style={{ backgroundColor: stat.bg }}
            >
              <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }}></i>
            </div>
            <p className="text-2xl font-bold text-[#0D4429]">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Onboarding incomplete banner */}
      {!profile?.onboardingComplete && (
        <div className="bg-[#0D4429] rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-seedling text-white text-lg"></i>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">
              {lang === "sn" ? "Pedza Profile Yako" : lang === "nd" ? "Qedela i-Profile Yakho" : "Complete Your Profile"}
            </p>
            <p className="text-white/70 text-sm mb-3">
              {lang === "sn"
                ? "Tipa mhinduro dzako kuti Zoe akupe mazano akanaka."
                : lang === "nd"
                ? "Faka imiphumela yakho ukuze uZoe akunike izeluleko ezikhethiwe."
                : "Add your exam results so Zoe can give you personalized guidance."}
            </p>
            <Link
              href="/dashboard/results"
              className="inline-flex items-center gap-2 bg-white text-[#0D4429] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#F5EFEB] transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
              {lang === "sn" ? "Isa Mhinduro" : lang === "nd" ? "Faka Imiphumela" : "Add Results"}
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="font-semibold text-[#0D4429] text-lg mb-3">
        {lang === "sn" ? "Mabasa Okumhanya" : lang === "nd" ? "Izenzo Ezisheshayo" : "Quick Actions"}
      </h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {[
          {
            href: "/dashboard/chat",
            icon: "fa-comment-dots",
            color: "#0D4429",
            bg: "#E8F4EE",
            title: lang === "sn" ? "Taura naZoe" : lang === "nd" ? "Khuluma loZoe" : "Talk to Zoe",
            desc: lang === "sn" ? "Bvunza mubvunzo chero upi" : lang === "nd" ? "Buza umbuzo owuwuphi" : "Ask any career question",
          },
          {
            href: "/dashboard/career",
            icon: "fa-compass",
            color: "#C2410C",
            bg: "#FEE2E2",
            title: lang === "sn" ? "Tsvaga Basa" : lang === "nd" ? "Hlola Imisebenzi" : "Career Explorer",
            desc: lang === "sn" ? "Tsvaga nzira dzakasiyana" : lang === "nd" ? "Hlola izindlela ezikhethiwe" : "Browse career paths",
          },
          {
            href: "/dashboard/results",
            icon: "fa-file-alt",
            color: "#D97706",
            bg: "#FEF3C7",
            title: lang === "sn" ? "Isa Mhinduro" : lang === "nd" ? "Faka Imiphumela" : "Add Results",
            desc: lang === "sn" ? "ZIMSEC / Cambridge" : lang === "nd" ? "ZIMSEC / Cambridge" : "ZIMSEC / Cambridge",
          },
          {
            href: "/dashboard/points",
            icon: "fa-gift",
            color: "#7C3AED",
            bg: "#EDE9FE",
            title: lang === "sn" ? "Wana Mapoinzi" : lang === "nd" ? "Thola Amaphuzu" : "Earn More Points",
            desc: lang === "sn" ? "Unlock matokeni ewedzerwa" : lang === "nd" ? "Vula amatokeni amaningi" : "Unlock more tokens",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#EDE3DC] hover:shadow-card-hover transition-all group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: action.bg }}
            >
              <i className={`fa-solid ${action.icon} text-xl`} style={{ color: action.color }}></i>
            </div>
            <div>
              <p className="font-semibold text-[#0D4429]">{action.title}</p>
              <p className="text-sm text-gray-500">{action.desc}</p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto group-hover:text-[#0D4429] transition-colors"></i>
          </Link>
        ))}
      </div>

      {/* Recent Milestones */}
      {milestones.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#0D4429] text-lg mb-3">
            <i className="fa-solid fa-trophy text-[#D97706] mr-2"></i>
            {lang === "sn" ? "Zvaukabudirira" : lang === "nd" ? "Izinto Oziphumelelileyo" : "Your Milestones"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="inline-flex items-center gap-2 bg-white border border-[#EDE3DC] text-[#0D4429] text-sm font-medium px-3 py-1.5 rounded-full"
              >
                <i className="fa-solid fa-medal text-[#D97706] text-xs"></i>
                {m.titleEn}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}