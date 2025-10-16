"use server";

import { getConcepts as getConceptsQuery, type ConceptWithStats } from "@/modules/concepts/server/queries";
import { createConcept as createConceptAction } from "@/modules/concepts/actions/create-concept";
import { updateConcept as updateConceptAction } from "@/modules/concepts/actions/update-concept";
import { deleteConcept as deleteConceptAction } from "@/modules/concepts/actions/delete-concept";

// Re-export types inline to avoid build issues
export type CreateConceptInput = {
  companyId: string;
  name: string;
  description?: string;
  defaultAmount?: number;
  claveProdServ?: string;
  claveUnidad?: string;
  objetoImp?: string;
  tasaIVA?: number;
  tasaRetencionISR?: number;
  tasaRetencionIVA?: number;
  ivaIncluded?: boolean;
};

export type UpdateConceptInput = {
  id: string;
  name?: string;
  description?: string;
  defaultAmount?: number;
  claveProdServ?: string;
  claveUnidad?: string;
  objetoImp?: string;
  tasaIVA?: number;
  tasaRetencionISR?: number;
  tasaRetencionIVA?: number;
  ivaIncluded?: boolean;
  isActive?: boolean;
};

export type SerializedConcept = Omit<ConceptWithStats, 'defaultAmount' | 'tasaIVA' | 'tasaRetencionISR' | 'tasaRetencionIVA' | '_count'> & {
  defaultAmount: number | null;
  tasaIVA: number;
  tasaRetencionISR: number;
  tasaRetencionIVA: number;
  ivaIncluded: boolean;
  _count?: { transactions: number };
};

export async function loadConcepts(companyId: string): Promise<SerializedConcept[]> {
  const concepts = await getConceptsQuery(companyId);
  return concepts.map(c => ({
    ...c,
    defaultAmount: c.defaultAmount ? Number(c.defaultAmount) : null,
    tasaIVA: Number(c.tasaIVA),
    tasaRetencionISR: Number(c.tasaRetencionISR),
    tasaRetencionIVA: Number(c.tasaRetencionIVA),
    ivaIncluded: c.ivaIncluded || false,
    _count: c._count,
  }));
}

export { createConceptAction as createConcept, updateConceptAction as updateConcept, deleteConceptAction as deleteConcept };

