import { prisma } from "@/lib/prisma";
import type { Provider } from "@prisma/client";

export type ProviderWithStats = Provider & {
  _count: {
    transactions: number;
  };
};

export async function getProviders(companyId: string): Promise<ProviderWithStats[]> {
  return prisma.provider.findMany({
    where: { companyId, isActive: true },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getProviderById(providerId: string, companyId: string): Promise<ProviderWithStats | null> {
  return prisma.provider.findUnique({
    where: { id: providerId, companyId },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  });
}

