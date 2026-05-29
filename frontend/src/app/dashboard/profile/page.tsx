// src/app/dashboard/profile/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, studentProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  let userData = null;
  let profile = null;

  if (userId) {
    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    userData = userRows[0] ?? null;
    const profileRows = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
    profile = profileRows[0] ?? null;
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
          <i className="fa-solid fa-user-circle text-[#C2410C] mr-3"></i>
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">
          A complete profile helps Zoe give you better guidance.
        </p>
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-card p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-[#0D4429]">Profile Completion</p>
          <span className="text-sm font-bold text-[#0D4429]">{profile?.profileCompletionPct ?? 0}%</span>
        </div>
        <div className="w-full bg-[#EDE3DC] rounded-full h-2.5">
          <div
            className="bg-[#0D4429] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${profile?.profileCompletionPct ?? 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Complete your profile to unlock better AI recommendations
        </p>
      </div>

      <ProfileForm
        initialData={{
          displayName: userData?.displayName ?? "",
          language: userData?.language ?? "en",
          province: profile?.province ?? "",
          schoolName: profile?.schoolName ?? "",
          examBoard: profile?.examBoard ?? "zimsec",
          currentLevel: profile?.currentLevel ?? "",
          aspirations: profile?.aspirations ?? "",
        }}
      />
    </div>
  );
}