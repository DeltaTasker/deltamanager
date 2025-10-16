"use server";

import { prisma } from "@/lib/prisma";
import type { Transaction, Client, Concept } from "@prisma/client";

export type TransactionWithRelations = Transaction & {
  client?: Client | null;
  concept?: Concept | null;
  projectPayments?: Transaction[];
};

export type GetTransactionsParams = {
  companyId: string;
  type?: "income" | "expense";
  limit?: number;
  offset?: number;
  status?: string;
  paymentStatus?: string;
  bankAccountId?: string;
  clientId?: string;
  conceptId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

/**
 * Get transactions with filters and pagination
 */
export async function getTransactions(
  params: GetTransactionsParams
): Promise<TransactionWithRelations[]> {
  const {
    companyId,
    type,
    limit,
    offset,
    status,
    paymentStatus,
    bankAccountId,
    clientId,
    conceptId,
    startDate,
    endDate,
    search,
  } = params;

  const where: any = {
    companyId,
    ...(type && { type }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(bankAccountId && { bankAccountId }),
    ...(clientId && { clientId }),
    ...(conceptId && { conceptId }),
    ...(startDate && endDate && {
      date: {
        gte: startDate,
        lte: endDate,
      },
    }),
    ...(search && {
      OR: [
        { description: { contains: search } },
        { invoiceNumber: { contains: search } },
        { projectName: { contains: search } },
      ],
    }),
  };

  // Get main transactions (no parent projects - these are top level)
  const transactions = await prisma.transaction.findMany({
    where: {
      ...where,
      parentProjectId: null, // Only get top-level transactions
    },
    include: {
      client: true,
      concept: true,
    },
    orderBy: {
      date: "desc",
    },
    take: limit,
    skip: offset,
  });

  // For each project, get its payments
  const transactionsWithPayments = await Promise.all(
    transactions.map(async (transaction) => {
      if (transaction.isProject) {
        const projectPayments = await prisma.transaction.findMany({
          where: {
            parentProjectId: transaction.id,
          },
          include: {
            client: true,
            concept: true,
          },
          orderBy: {
            paymentNumber: "asc",
          },
        });

        return {
          ...transaction,
          projectPayments,
        };
      }

      return {
        ...transaction,
        projectPayments: [],
      };
    })
  );

  return transactionsWithPayments;
}

/**
 * Get single transaction by ID with all relations
 */
export async function getTransactionById(
  id: string
): Promise<TransactionWithRelations | null> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      client: true,
      concept: true,
    },
  });

  if (!transaction) return null;

  // If it's a project, get its payments
  if (transaction.isProject) {
    const projectPayments = await prisma.transaction.findMany({
      where: {
        parentProjectId: transaction.id,
      },
      include: {
        client: true,
        concept: true,
      },
      orderBy: {
        paymentNumber: "asc",
      },
    });

    return {
      ...transaction,
      projectPayments,
    };
  }

  return {
    ...transaction,
    projectPayments: [],
  };
}

/**
 * Get project payments for a specific project
 */
export async function getProjectPayments(
  projectId: string
): Promise<Transaction[]> {
  return await prisma.transaction.findMany({
    where: {
      parentProjectId: projectId,
    },
    include: {
      client: true,
      concept: true,
    },
    orderBy: {
      paymentNumber: "asc",
    },
  });
}

/**
 * Count transactions with filters
 */
export async function countTransactions(
  params: Omit<GetTransactionsParams, "limit" | "offset">
): Promise<number> {
  const {
    companyId,
    type,
    status,
    paymentStatus,
    bankAccountId,
    clientId,
    conceptId,
    startDate,
    endDate,
    search,
  } = params;

  const where: any = {
    companyId,
    parentProjectId: null, // Only count top-level transactions
    ...(type && { type }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(bankAccountId && { bankAccountId }),
    ...(clientId && { clientId }),
    ...(conceptId && { conceptId }),
    ...(startDate && endDate && {
      date: {
        gte: startDate,
        lte: endDate,
      },
    }),
    ...(search && {
      OR: [
        { description: { contains: search } },
        { invoiceNumber: { contains: search } },
        { projectName: { contains: search } },
      ],
    }),
  };

  return await prisma.transaction.count({ where });
}

