import { getActiveCompany, getUserCompanies } from "@/modules/companies/server/queries";

import { DashboardHeaderClient } from "./header.client";

interface DashboardHeaderProps {
  userId: string;
}

export async function DashboardHeader({ userId }: DashboardHeaderProps) {
  const [companies, activeCompany] = await Promise.all([
    getUserCompanies(userId),
    getActiveCompany(userId),
  ]);

  return (
    <DashboardHeaderClient
      companies={companies}
      activeCompanyId={activeCompany?.id}
    />
  );
}

