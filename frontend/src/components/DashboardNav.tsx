// src/components/DashboardNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: "fa-house", label: "Dashboard" },
  { href: "/dashboard/chat", icon: "fa-comment-dots", label: "Talk to Zoe" },
  { href: "/dashboard/career", icon: "fa-compass", label: "Career Explorer" },
  { href: "/dashboard/results", icon: "fa-file-alt", label: "My Results" },
  { href: "/dashboard/points", icon: "fa-coins", label: "Danho Points" },
  { href: "/dashboard/profile", icon: "fa-user-circle", label: "Profile" },
  { href: "/dashboard/parents", icon: "fa-heart", label: "Vabereki" },
];

export default function DashboardNav({ user }: { user: NavUser }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#0D4429] flex-col z-40">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="font-serif font-bold text-white">Danho Lomuso</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname === item.href
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-bold">
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE3DC] z-40 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all",
                pathname === item.href ? "text-[#0D4429]" : "text-gray-400"
              )}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-[10px] leading-none">
                {item.label.split(" ")[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}