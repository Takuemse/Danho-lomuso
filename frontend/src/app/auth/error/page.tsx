// src/app/auth/error/page.tsx
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] to-[#F5EFEB] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-circle-xmark text-red-500 text-3xl"></i>
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#0D4429] mb-3">Authentication Error</h1>
        <p className="text-gray-500 mb-6">
          Something went wrong during sign in. Your link may have expired. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="bg-[#0D4429] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#155E38] transition-colors"
        >
          <i className="fa-solid fa-rotate-left mr-2"></i>Try Again
        </Link>
      </div>
    </div>
  );
}