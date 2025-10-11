import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayoutWrapper } from "@/components/layout/dashboard/dashboard-layout-wrapper";
import { DashboardHeader } from "@/components/layout/dashboard/header";
import { auth } from "@/modules/auth/server/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/access");
  }

  const { getUserCompanies } = await import("@/modules/companies/server/queries");
  const companies = await getUserCompanies(session.user.id);

  return (
    <DashboardLayoutWrapper 
      companies={companies} 
      headerSlot={<DashboardHeader userId={session.user.id} />}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}

