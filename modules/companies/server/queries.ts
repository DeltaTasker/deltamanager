import { prisma } from "@/lib/prisma";

export type UserCompanySummary = {
  id: string;
  name: string;
  role: string;
  isDefault: boolean;
};

export async function getUserCompanies(userId: string): Promise<UserCompanySummary[]> {
  const memberships = await prisma.userCompany.findMany({
    where: { userId },
    include: {
      company: {
        select: { id: true, name: true },
      },
      role: {
        select: { name: true },
      },
    },
    orderBy: {
      company: { name: "asc" },
    },
  });

  return memberships.map((membership) => ({
    id: membership.company.id,
    name: membership.company.name,
    role: membership.role.name,
    isDefault: membership.isDefault,
  }));
}

export async function getActiveCompany(userId: string): Promise<UserCompanySummary | null> {
  const companies = await getUserCompanies(userId);
  if (companies.length === 0) {
    return null;
  }

  return (
    companies.find((company) => company.isDefault) ?? companies[0]
  );
}

export async function ensureCompanyAccess(userId: string, companyId: string) {
  const membership = await prisma.userCompany.findFirst({
    where: { userId, companyId },
  });

  if (!membership) {
    throw new Error("Unauthorized access to company");
  }

  return membership;
}


