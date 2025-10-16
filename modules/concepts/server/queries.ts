"use server";

import { prisma } from "@/lib/prisma";
import type { Concept } from "@prisma/client";

export type ConceptWithStats = Concept & {
  _count?: {
    transactions: number;
  };
};

/**
 * Get all concepts for a company
 */
export async function getConcepts(companyId: string): Promise<ConceptWithStats[]> {
  return await prisma.concept.findMany({
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
 * Get concept by ID
 */
export async function getConceptById(id: string): Promise<Concept | null> {
  return await prisma.concept.findUnique({
    where: { id },
  });
}

/**
 * Search concepts by name or description
 */
export async function searchConcepts(
  companyId: string,
  query: string
): Promise<Concept[]> {
  return await prisma.concept.findMany({
    where: {
      companyId,
      isActive: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
}

