// src/app/dashboard/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <DashboardNav user={session.user} />
      <main className="pb-20 md:pb-0 md:pl-64">{children}</main>
    </div>
  );
}