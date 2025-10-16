import "server-only";

import { prisma } from "@/lib/prisma";

export async function getBankAccounts(companyId: string, includeInactive = false) {
  return prisma.bankAccount.findMany({
    where: {
      companyId,
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getBankAccountById(id: string, companyId: string) {
  return prisma.bankAccount.findFirst({
    where: {
      id,
      companyId,
    },
  });
}


