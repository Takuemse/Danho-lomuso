// src/app/auth/signin/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefillEmail = searchParams.get("email") ?? "";
  const isNewAccount = searchParams.get("new") === "true";

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Could not send code. Please try again.");
      return;
    }

    setStatus("idle");
    setStep("otp");
    setResendTimer(60); // 60 second cooldown before resend
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  function handleOtpInput(index: number, value: string) {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setErrorMsg("");

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (digit && index === 5 && newOtp.every((d) => d !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerifyOTP(pasted);
    }
  }

  async function handleVerifyOTP(code?: string) {
    const finalCode = code ?? otp.join("");
    if (finalCode.length !== 6) {
      setErrorMsg("Please enter all 6 digits.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      // First verify the OTP via our API
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: finalCode }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setStatus("error");
        setErrorMsg(verifyData.error ?? "Invalid code. Please try again.");
        if (verifyData.error?.includes("expired") || verifyData.error?.includes("attempts")) {
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
        return;
      }

      // OTP verified — sign in with NextAuth credentials
      const result = await signIn("credentials", {
        email,
        otp: finalCode,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setStatus("error");
        setErrorMsg("Sign in failed. Please try again.");
        return;
      }

      setStatus("success");
      router.push("/dashboard");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setErrorMsg("");
    setStatus("loading");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Could not resend code.");
      return;
    }

    setStatus("idle");
    setResendTimer(60);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#F5EFEB] to-[#EDE3DC] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-[#0D4429] rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white"></i>
            </div>
            <span className="font-serif font-bold text-[#0D4429] text-xl">Danho Lomuso</span>
          </Link>

          {isNewAccount && step === "email" && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-green-700">
              <i className="fa-solid fa-circle-check text-green-500"></i>
              Account created! Sign in below to get started.
            </div>
          )}
        </div>

        {/* ── STEP 1: Email Entry ── */}
        {step === "email" && (
          <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-[0_4px_24px_rgba(13,68,41,0.08)] p-6 page-enter">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#E8F4EE] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-envelope text-[#0D4429] text-2xl"></i>
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#0D4429] mb-1">
                Sign In
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your email and we'll send you a 6-digit code.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0D4429] mb-1.5">
                  <i className="fa-solid fa-at mr-2"></i>Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-[#EDE3DC] focus:outline-none focus:border-[#0D4429] bg-[#FFFDF9] text-sm transition-colors"
                  required
                />
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <i className="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0"></i>
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-3.5 rounded-xl hover:bg-[#155E38] transition-all disabled:opacity-60"
              >
                {status === "loading" ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Sending Code...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> Send Verification Code</>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#EDE3DC]"></div>
              <span className="text-xs text-gray-400">New here?</span>
              <div className="flex-1 h-px bg-[#EDE3DC]"></div>
            </div>

            <Link
              href="/auth/signup"
              className="w-full flex items-center justify-center gap-2 border-2 border-[#0D4429] text-[#0D4429] font-semibold py-3 rounded-xl hover:bg-[#0D4429]/5 transition-colors text-sm"
            >
              <i className="fa-solid fa-user-plus"></i>
              Create a New Account
            </Link>
          </div>
        )}

        {/* ── STEP 2: OTP Entry ── */}
        {step === "otp" && (
          <div className="bg-white rounded-2xl border border-[#EDE3DC] shadow-[0_4px_24px_rgba(13,68,41,0.08)] p-6 page-enter">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#E8F4EE] rounded-2xl flex items-center justify-center mx-auto mb-3">
                {status === "success" ? (
                  <i className="fa-solid fa-circle-check text-green-500 text-2xl"></i>
                ) : (
                  <i className="fa-solid fa-key text-[#0D4429] text-2xl"></i>
                )}
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0D4429] mb-1">
                Enter Your Code
              </h2>
              <p className="text-gray-500 text-sm">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-[#0D4429] text-sm mt-0.5">{email}</p>
            </div>

            {/* 6-Digit OTP Input */}
            <div
              className="flex items-center justify-center gap-2 mb-5"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={status === "loading" || status === "success"}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-all
                    ${digit ? "border-[#0D4429] bg-[#E8F4EE] text-[#0D4429]" : "border-[#EDE3DC] bg-[#FFFDF9] text-gray-800"}
                    ${status === "error" ? "border-red-400 bg-red-50" : ""}
                    ${status === "success" ? "border-green-400 bg-green-50 text-green-700" : ""}
                    focus:border-[#0D4429] focus:bg-[#E8F4EE] disabled:opacity-60`}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                <i className="fa-solid fa-triangle-exclamation mt-0.5 flex-shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {status === "success" && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                <i className="fa-solid fa-circle-check flex-shrink-0"></i>
                <span>Verified! Signing you in...</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerifyOTP()}
              disabled={
                status === "loading" ||
                status === "success" ||
                otp.some((d) => d === "")
              }
              className="w-full flex items-center justify-center gap-2 bg-[#0D4429] text-white font-semibold py-3.5 rounded-xl hover:bg-[#155E38] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {status === "loading" ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Verifying...</>
              ) : status === "success" ? (
                <><i className="fa-solid fa-circle-check"></i> Verified!</>
              ) : (
                <><i className="fa-solid fa-shield-halved"></i> Verify Code</>
              )}
            </button>

            {/* Resend & Back */}
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => {
                  setStep("email");
                  setOtp(["", "", "", "", "", ""]);
                  setErrorMsg("");
                  setStatus("idle");
                }}
                className="text-gray-400 hover:text-[#0D4429] transition-colors flex items-center gap-1"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
                Change email
              </button>

              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || status === "loading"}
                className="text-[#0D4429] font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline transition-all"
              >
                {resendTimer > 0 ? (
                  <span className="flex items-center gap-1 text-gray-400">
                    <i className="fa-solid fa-clock text-xs"></i>
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-rotate-right text-xs"></i>
                    Resend Code
                  </span>
                )}
              </button>
            </div>

            {/* Expiry hint */}
            <p className="text-center text-xs text-gray-400 mt-4">
              <i className="fa-solid fa-clock mr-1"></i>
              Code expires in 10 minutes
            </p>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
          <i className="fa-solid fa-lock text-[#0D4429]"></i>
          6-digit OTP · Expires in 10 min · Zero-Trust Security
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
          <i className="fa-solid fa-spinner fa-spin text-[#0D4429] text-2xl"></i>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}