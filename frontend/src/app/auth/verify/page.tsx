// src/app/auth/verify/page.tsx
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] to-[#F5EFEB] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#0D4429] rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-envelope-open-text text-white text-3xl"></i>
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#0D4429] mb-3">Magic link sent!</h1>
        <p className="text-gray-500 mb-6">
          Check your email inbox and click the sign-in link. You can close this tab once signed in.
        </p>
        <Link href="/" className="text-[#0D4429] text-sm hover:underline">
          <i className="fa-solid fa-arrow-left mr-1"></i>Back to home
        </Link>
      </div>
    </div>
  );
}