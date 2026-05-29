// src/app/dashboard/career/page.tsx
import { db } from "@/db";
import { careerPaths } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export const revalidate = 3600; // ISR: revalidate every hour

export default async function CareerPage() {
  const paths = await db.select().from(careerPaths).where(eq(careerPaths.isActive, true)).limit(30);

  const categories = Array.from(new Set(paths.map((p) => p.category).filter(Boolean)));

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
          <i className="fa-solid fa-compass text-[#C2410C] mr-3"></i>
          Career Explorer
        </h1>
        <p className="text-gray-500 text-sm">
          Discover career paths matched to your skills, interests, and exam results.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="search"
          placeholder="Search careers, fields, or skills..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#EDE3DC] bg-white text-sm focus:outline-none focus:border-[#0D4429] transition-colors"
        />
      </div>

      {paths.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#F5EFEB] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-compass text-[#0D4429] text-2xl"></i>
          </div>
          <p className="text-[#0D4429] font-semibold mb-2">Career paths coming soon!</p>
          <p className="text-gray-500 text-sm mb-4">
            Ask Zoe directly to explore career options tailored to your results.
          </p>
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center gap-2 bg-[#0D4429] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#155E38] transition-colors"
          >
            <i className="fa-solid fa-comment-dots"></i>
            Talk to Zoe
          </Link>
        </div>
      ) : (
        <>
          {/* Vocational Track CTA */}
          <div className="bg-gradient-to-r from-[#0D4429] to-[#155E38] rounded-2xl p-5 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-tools text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Vocational & Technical Paths</p>
              <p className="text-white/70 text-sm">Trades, apprenticeships, and creative economy tracks available for all grade levels.</p>
            </div>
            <i className="fa-solid fa-chevron-right text-white/50"></i>
          </div>

          {/* Career Grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-white rounded-2xl border border-[#EDE3DC] p-5 hover:shadow-[0_8px_40px_rgba(13,68,41,0.12)] transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-[#E8F4EE] rounded-xl flex items-center justify-center">
                    <i className={`fa-solid ${path.isVocational ? "fa-tools" : "fa-briefcase"} text-[#0D4429]`}></i>
                  </div>
                  {path.isVocational && (
                    <span className="text-xs font-semibold bg-[#FEF3C7] text-[#D97706] px-2 py-1 rounded-full">
                      Vocational
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[#0D4429] mb-1">{path.titleEn}</h3>
                {path.category && (
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{path.category}</p>
                )}
                {path.descriptionEn && (
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{path.descriptionEn}</p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/dashboard/career/${path.slug}`}
                    className="flex-1 text-center text-sm font-semibold text-[#0D4429] border border-[#0D4429] py-2 rounded-xl hover:bg-[#0D4429] hover:text-white transition-all"
                  >
                    View Path
                  </Link>
                  <Link
                    href={`/dashboard/chat?topic=${encodeURIComponent(path.titleEn)}`}
                    className="w-10 h-10 bg-[#E8F4EE] rounded-xl flex items-center justify-center text-[#0D4429] hover:bg-[#0D4429] hover:text-white transition-all"
                    title="Ask Zoe about this"
                  >
                    <i className="fa-solid fa-comment-dots text-sm"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}