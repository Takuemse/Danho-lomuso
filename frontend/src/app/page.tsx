// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#FFFDF9]/90 backdrop-blur-sm border-b border-[#EDE3DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-xs"></i>
            </div>
            <span className="font-serif font-bold text-[#0D4429] text-lg">Danho Lomuso</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-[#0D4429] hover:text-[#155E38] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-[#0D4429] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#155E38] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="page-enter">
            <div className="inline-flex items-center gap-2 bg-[#0D4429]/10 text-[#0D4429] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <i className="fa-solid fa-star text-[#D97706]"></i>
              Built for Zimbabwe's Youth
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0D4429] leading-tight mb-6">
              Danho Lomuso
              <span className="block text-[#C2410C] italic">Bridge to Your Future</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Meet <strong>Zoe</strong> — your personal AI guide who understands ZIMSEC, Cambridge,
              and the real opportunities available to you right here in Zimbabwe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/onboarding"
                className="flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#155E38] transition-all hover:shadow-lg"
              >
                <i className="fa-solid fa-rocket"></i>
                Start Your Journey — Free
              </Link>
              <Link
                href="/demo"
                className="flex items-center justify-center gap-2 border-2 border-[#0D4429] text-[#0D4429] font-semibold px-6 py-3.5 rounded-xl hover:bg-[#0D4429]/5 transition-all"
              >
                <i className="fa-solid fa-play"></i>
                See How It Works
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-[#EDE3DC]">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <i className="fa-solid fa-shield-halved text-[#0D4429]"></i>
                Zero-Trust Security
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <i className="fa-solid fa-language text-[#0D4429]"></i>
                English, Shona & Ndebele
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <i className="fa-solid fa-wifi text-[#0D4429]"></i>
                Works Offline
              </div>
            </div>
          </div>

          {/* Zoe Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(13,68,41,0.15)] p-6 border border-[#EDE3DC]">
                {/* Zoe Avatar */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-forest-gradient rounded-full flex items-center justify-center relative">
                    <i className="fa-solid fa-brain text-white text-lg"></i>
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D4429]">Zoe</p>
                    <p className="text-xs text-gray-500">Your AI Career Guide</p>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-3">
                  <div className="bg-[#0D4429] text-white text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                    Mwanangu! Ndinofara kukusangana. Ndinokubatsira nenzira yako yeramangwana.
                  </div>
                  <div className="bg-[#F5EFEB] text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto">
                    I got 5 Bs and 3 Cs at O-Level. What are my options?
                  </div>
                  <div className="bg-[#0D4429] text-white text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                    Those results open many doors! Let&apos;s explore A-Level science, polytechnic programs, and some exciting tech bootcamps...
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 ml-1">
                    <div className="zoe-thinking">
                      <i className="fa-solid fa-circle text-[#0D4429]" style={{ fontSize: "6px" }}></i>
                    </div>
                    <span>Zoe is typing...</span>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card px-3 py-2 border border-[#EDE3DC]">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-fire text-[#C2410C] text-sm"></i>
                  <span className="text-xs font-semibold text-gray-700">2,847 students guided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4429] mb-4">
            Everything You Need
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built for real Zimbabwean students, by people who understand your journey.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {[
  {
    icon: "fa-graduation-cap",
    color: "#0D4429",
    bg: "#C5E1CE",
    title: "ZIMSEC & Cambridge",
    desc: "Full support for both exam boards. Input your results and get instant, personalized career guidance.",
  },
  {
    icon: "fa-language",
    color: "#C2410C",
    bg: "#FECACA",
    title: "Shona & Ndebele",
    desc: "Talk to Zoe in English, chiShona, or isiNdebele. Even mix them — Zoe understands code-switching.",
  },
  {
    icon: "fa-coins",
    color: "#D97706",
    bg: "#FDE68A",
    title: "Free to Use",
    desc: "Daily free chat tokens. Earn more Danho Points by learning. No student is locked out.",
  },
  {
    icon: "fa-map-location-dot",
    color: "#0D4429",
    bg: "#C5E1CE",
    title: "Local Career Paths",
    desc: "Real opportunities — local universities, TOFARA Trust, Uncommon.org, and vocational centers.",
  },
  {
    icon: "fa-users",
    color: "#C2410C",
    bg: "#FECACA",
    title: "Vabereki Portal",
    desc: "Parents track progress and understand recommendations in their own language.",
  },
  {
    icon: "fa-wifi",
    color: "#D97706",
    bg: "#FDE68A",
    title: "Works Offline",
    desc: "Service worker caching means you can use Danho Lomuso even on unstable network connections.",
  },
].map((feature) => (
  <div
    key={feature.title}
    className="bg-white rounded-2xl p-6 border border-[#EDE3DC] hover:shadow-[0_8px_40px_rgba(13,68,41,0.12)] transition-all duration-300"
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
      style={{ backgroundColor: feature.bg }}
    >
      <i
        className={`fa-solid ${feature.icon} text-xl`}
        style={{ color: feature.color }}
      ></i>
    </div>
    <h3 className="font-semibold text-[#0D4429] text-lg mb-2">{feature.title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
  </div>
))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-[#0D4429] rounded-3xl px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-1/3 translate-y-1/3"></div>
          </div>
          <div className="relative">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              Your future starts today.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
              Join thousands of Zimbabwean students already using Danho Lomuso to shape their futures.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-white text-[#0D4429] font-bold px-8 py-4 rounded-xl hover:bg-[#F5EFEB] transition-colors text-lg"
            >
              <i className="fa-solid fa-arrow-right"></i>
              Begin For Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDE3DC] py-8 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-xs"></i>
            </div>
            <span className="font-serif font-bold text-[#0D4429]">Danho Lomuso</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Danho Lomuso · Built with love for Zimbabwe
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-[#0D4429]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#0D4429]">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}