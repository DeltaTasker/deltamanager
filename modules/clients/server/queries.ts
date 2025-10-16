"use server";

import { prisma } from "@/lib/prisma";
import type { Client } from "@prisma/client";

export type ClientWithStats = Client & {
  _count?: {
    transactions: number;
  };
};

/**
 * Get all clients for a company
 */
export async function getClients(companyId: string): Promise<ClientWithStats[]> {
  return await prisma.client.findMany({
    where: {
      companyId,
      isActive: true,
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Get client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  return await prisma.client.findUnique({
    where: { id },
  });
}

/**
 * Search clients by name, RFC, or email
 */
export async function searchClients(
  companyId: string,
  query: string
): Promise<Client[]> {
  return await prisma.client.findMany({
    where: {
      companyId,
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { rfc: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
}

