import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/layout/dashboard/header";
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar";
import { auth } from "@/modules/auth/server/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/access");
  }

  const { getUserCompanies } = await import("@/modules/companies/server/queries");
  const companies = await getUserCompanies(session.user.id);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <DashboardSidebar companies={companies} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader userId={session.user.id} />
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

