// src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    province: "",
    role: "student",
    language: "en",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setErrorMsg("");
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      errors.age = "Please enter a valid age between 10 and 100.";
    }

    if (!formData.province) {
      errors.province = "Please select your province.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      // Redirect to signin after 2 seconds so user can sign in with magic link
      setTimeout(() => {
        router.push(`/auth/signin?email=${encodeURIComponent(formData.email)}&new=true`);
      }, 2000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  const PROVINCES = [
    "Harare", "Bulawayo", "Mashonaland East", "Mashonaland West",
    "Mashonaland Central", "Manicaland", "Masvingo", "Midlands",
    "Matabeleland North", "Matabeleland South",
  ];

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center page-enter">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-circle-check text-green-500 text-4xl"></i>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0D4429] mb-2">
            Account Created!
          </h2>
          <p className="text-gray-500 mb-1">
            Welcome to Danho Lomuso, <strong>{formData.fullName.split(" ")[0]}</strong>!
          </p>
          <p className="text-gray-400 text-sm">
            Redirecting you to sign in...
          </p>
          <div className="mt-4 flex justify-center">
            <i className="fa-solid fa-spinner fa-spin text-[#0D4429] text-xl"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white"></i>
            </div>
            <span className="font-serif font-bold text-[#0D4429] text-xl">Danho Lomuso</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D4429] mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm">
            Join thousands of Zimbabwean students building their futures.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-[0_4px_24px_rgba(13,68,41,0.08)] p-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-user mr-2"></i>Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="e.g. Takudzwa Moyo"
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FFFDF9] focus:outline-none transition-colors ${
                  fieldErrors.fullName
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EDE3DC] focus:border-[#0D4429]"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-envelope mr-2"></i>Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FFFDF9] focus:outline-none transition-colors ${
                  fieldErrors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EDE3DC] focus:border-[#0D4429]"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-calendar mr-2"></i>Age
              </label>
              <input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="e.g. 17"
                min="10"
                max="100"
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FFFDF9] focus:outline-none transition-colors ${
                  fieldErrors.age
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EDE3DC] focus:border-[#0D4429]"
                }`}
              />
              {fieldErrors.age && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {fieldErrors.age}
                </p>
              )}
            </div>

            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-map-location-dot mr-2"></i>Province
              </label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => update("province", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#FFFDF9] focus:outline-none transition-colors ${
                  fieldErrors.province
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#EDE3DC] focus:border-[#0D4429]"
                }`}
              >
                <option value="">Select your province...</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {fieldErrors.province && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {fieldErrors.province}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-id-badge mr-2"></i>I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "student", icon: "fa-graduation-cap", label: "Student" },
                  { key: "parent", icon: "fa-heart", label: "Parent / Guardian" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => update("role", option.key)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                      formData.role === option.key
                        ? "border-[#0D4429] bg-[#0D4429] text-white"
                        : "border-[#EDE3DC] text-gray-500 hover:border-[#0D4429]/40"
                    }`}
                  >
                    <i className={`fa-solid ${option.icon}`}></i>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                <i className="fa-solid fa-language mr-2"></i>Preferred Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: "en", label: "English" },
                  { code: "sn", label: "chiShona" },
                  { code: "nd", label: "isiNdebele" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => update("language", lang.code)}
                    className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      formData.language === lang.code
                        ? "border-[#C2410C] bg-[#C2410C] text-white"
                        : "border-[#EDE3DC] text-gray-500 hover:border-[#C2410C]/40"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Global Error */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <i className="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-4 rounded-xl hover:bg-[#155E38] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2"
            >
              {status === "loading" ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rocket"></i>
                  Create My Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#EDE3DC]"></div>
            <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-[#EDE3DC]"></div>
          </div>

          <Link
            href="/auth/signin"
            className="w-full flex items-center justify-center gap-2 border-2 border-[#0D4429] text-[#0D4429] font-semibold py-3 rounded-xl hover:bg-[#0D4429]/5 transition-colors text-sm"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            Sign In Instead
          </Link>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
          <i className="fa-solid fa-lock text-[#0D4429]"></i>
          Your data is encrypted and never sold · Zero-Trust Security
        </div>
      </div>
    </div>
  );
}