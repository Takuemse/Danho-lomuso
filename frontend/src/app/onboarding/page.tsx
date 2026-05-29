// src/app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Language } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const LANGUAGES = [
  {
    code: "en" as Language,
    name: "English",
    greeting: "Hello! I'm Zoe.",
    flag: "🇬🇧",
    description: "Communicate in English",
  },
  {
    code: "sn" as Language,
    name: "chiShona",
    greeting: "Mhoroi! Ndini Zoe.",
    flag: "🇿🇼",
    description: "Taura nechiShona",
  },
  {
    code: "nd" as Language,
    name: "isiNdebele",
    greeting: "Sawubona! NginguZoe.",
    flag: "🇿🇼",
    description: "Khuluma ngesiNdebele",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [role, setRole] = useState<"student" | "parent" | null>(null);

  function handleLangSelect(lang: Language) {
    setSelectedLang(lang);
  }

  function handleNext() {
    if (step === 1 && selectedLang) {
      setStep(2);
    } else if (step === 2 && role) {
      setStep(3);
    } else if (step === 3) {
      router.push(`/auth/signin?lang=${selectedLang}&role=${role}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC] flex flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center gap-2 justify-center mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-[#0D4429]" : "bg-[#EDE3DC]"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400">Step {step} of 3</p>
      </div>

      {/* Step 1: Language Selection */}
      {step === 1 && (
        <div className="w-full max-w-md page-enter">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0D4429] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-earth-africa text-white text-2xl"></i>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
              Welcome to Danho Lomuso
            </h1>
            <p className="text-gray-500">Choose your preferred language to get started.</p>
          </div>

          <div className="space-y-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangSelect(lang.code)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedLang === lang.code
                    ? "border-[#0D4429] bg-[#0D4429]/5"
                    : "border-[#EDE3DC] bg-white hover:border-[#0D4429]/40"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#0D4429]">{lang.name}</p>
                  <p className="text-sm text-gray-500">{lang.description}</p>
                  <p className="text-xs text-[#C2410C] font-medium mt-0.5 italic">{lang.greeting}</p>
                </div>
                {selectedLang === lang.code && (
                  <i className="fa-solid fa-circle-check text-[#0D4429] text-xl"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Role Selection */}
      {step === 2 && selectedLang && (
        <div className="w-full max-w-md page-enter">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#C2410C] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user text-white text-2xl"></i>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
              {selectedLang === "sn"
                ? "Ndiwe ani?"
                : selectedLang === "nd"
                ? "Ungubani?"
                : "Who are you?"}
            </h2>
            <p className="text-gray-500">
              {selectedLang === "sn"
                ? "Tinogadzirira experience yakakurudzira yako."
                : selectedLang === "nd"
                ? "Silungisa experience efanele wena."
                : "We'll personalize your experience."}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "student" as const,
                icon: "fa-graduation-cap",
                en: "I'm a Student",
                sn: "Ndiri Mudzidzi",
                nd: "NgingumFundi",
                desc_en: "Explore career paths & talk to Zoe",
                desc_sn: "Tsvaga nzira yebasa & taura naZoe",
                desc_nd: "Hlola izindlela & khuluma loZoe",
              },
              {
                key: "parent" as const,
                icon: "fa-heart",
                en: "I'm a Parent / Guardian",
                sn: "Ndiri Mubereki",
                nd: "NgumZali",
                desc_en: "Track your child's journey",
                desc_sn: "Teerereza rwendo rwemwana wako",
                desc_nd: "Landela uhambo lwendodana/ntombazana",
              },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setRole(option.key)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                  role === option.key
                    ? "border-[#0D4429] bg-[#0D4429]/5"
                    : "border-[#EDE3DC] bg-white hover:border-[#0D4429]/40"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#0D4429]/10 flex items-center justify-center flex-shrink-0">
                  <i className={`fa-solid ${option.icon} text-[#0D4429] text-xl`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0D4429] text-lg">
                    {selectedLang === "sn" ? option.sn : selectedLang === "nd" ? option.nd : option.en}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedLang === "sn" ? option.desc_sn : selectedLang === "nd" ? option.desc_nd : option.desc_en}
                  </p>
                </div>
                {role === option.key && (
                  <i className="fa-solid fa-circle-check text-[#0D4429] text-xl"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Privacy Consent */}
      {step === 3 && selectedLang && (
        <div className="w-full max-w-md page-enter">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-shield-halved text-white text-2xl"></i>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0D4429] mb-2">
              {selectedLang === "sn" ? "Chengetedza Ruzivo Rwako" : selectedLang === "nd" ? "Gcina Ulwazi Lwakho" : "Your Data is Protected"}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE3DC] p-5 space-y-3 mb-6">
            {[
              { icon: "fa-lock", text: "Your exam results are encrypted with AES-256" },
              { icon: "fa-eye-slash", text: "We never sell or share your personal data" },
              { icon: "fa-shield-virus", text: "Military-grade Zero-Trust security architecture" },
              { icon: "fa-globe", text: "Your data stays within secure, compliant servers" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <i className={`fa-solid ${item.icon} text-[#0D4429] mt-0.5 flex-shrink-0`}></i>
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="w-full max-w-md mt-6">
        <button
          onClick={handleNext}
          disabled={
            (step === 1 && !selectedLang) ||
            (step === 2 && !role)
          }
          className="w-full flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-4 rounded-xl hover:bg-[#155E38] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg"
        >
          {step === 3 ? (
            <>
              <i className="fa-solid fa-rocket"></i>
              {selectedLang === "sn" ? "Tanga Ino!" : selectedLang === "nd" ? "Qalisa!" : "Get Started!"}
            </>
          ) : (
            <>
              {t(selectedLang ?? "en", "next")}
              <i className="fa-solid fa-arrow-right"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
}