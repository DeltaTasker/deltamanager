import "server-only";

import { prisma } from "@/lib/prisma";
import type { ProposalStatus, ProposalSummary } from "../types";

/**
 * Obtener todas las propuestas de una empresa con filtros
 */
export async function getProposals(params: {
  companyId: string;
  status?: ProposalStatus;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { companyId, status, search, limit = 50, offset = 0 } = params;

  const where: any = {
    companyId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { clientName: { contains: search } },
        { clientEmail: { contains: search } },
        { title: { contains: search } },
      ],
    }),
  };

  const [proposals, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    }),
    prisma.proposal.count({ where }),
  ]);

  return { proposals, total };
}

/**
 * Obtener una propuesta por ID con items
 */
export async function getProposalById(proposalId: string, companyId: string) {
  return prisma.proposal.findFirst({
    where: {
      id: proposalId,
      companyId,
    },
    include: {
      items: true,
    },
  });
}

/**
 * Obtener resumen de propuestas para dashboard
 */
export async function getProposalsSummary(companyId: string): Promise<ProposalSummary> {
  const proposals = await prisma.proposal.findMany({
    where: { companyId },
    select: {
      status: true,
      total: true,
    },
  });

  const summary = proposals.reduce(
    (acc, p) => {
      acc.total++;
      acc.totalAmount += p.total;

      switch (p.status) {
        case "draft":
          acc.draft++;
          break;
        case "sent":
          acc.sent++;
          break;
        case "accepted":
          acc.accepted++;
          acc.acceptedAmount += p.total;
          break;
        case "rejected":
          acc.rejected++;
          break;
        case "expired":
          acc.expired++;
          break;
      }

      return acc;
    },
    {
      total: 0,
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
      totalAmount: 0,
      acceptedAmount: 0,
      conversionRate: 0,
    } as ProposalSummary
  );

  // Calcular tasa de conversión
  const responded = summary.accepted + summary.rejected;
  summary.conversionRate = responded > 0 ? (summary.accepted / responded) * 100 : 0;

  return summary;
}

/**
 * Verificar si una propuesta existe y pertenece a la empresa
 */
export async function proposalExists(proposalId: string, companyId: string): Promise<boolean> {
  const count = await prisma.proposal.count({
    where: {
      id: proposalId,
      companyId,
    },
  });
  return count > 0;
}


