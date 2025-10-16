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

export async function getActiveCompany(userId: string) {
  const membership = await prisma.userCompany.findFirst({
    where: { userId, isDefault: true },
    include: {
      company: true,
    },
  });

  if (!membership) {
    // Si no hay default, tomar la primera
    const firstMembership = await prisma.userCompany.findFirst({
      where: { userId },
      include: {
        company: true,
      },
    });
    return firstMembership?.company ?? null;
  }

  return membership.company;
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


