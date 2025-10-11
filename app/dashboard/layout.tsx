import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardLayoutWrapper } from "@/components/layout/dashboard/dashboard-layout-wrapper";
import { auth } from "@/modules/auth/server/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/access");
  }

  const { getUserCompanies } = await import("@/modules/companies/server/queries");
  const companies = await getUserCompanies(session.user.id);

  return (
    <DashboardLayoutWrapper userId={session.user.id} companies={companies}>
      {children}
    </DashboardLayoutWrapper>
  );
}

