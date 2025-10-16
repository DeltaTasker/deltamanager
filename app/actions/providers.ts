"use server";

import { getProviders as getProvidersQuery, type ProviderWithStats } from "@/modules/providers/server/queries";
import { createProvider as createProviderAction } from "@/modules/providers/actions/create-provider";
import { updateProvider as updateProviderAction } from "@/modules/providers/actions/update-provider";
import { deleteProvider as deleteProviderAction } from "@/modules/providers/actions/delete-provider";

export type CreateProviderInput = {
  companyId: string;
  name: string;
  company: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  notes?: string;
  isForeign?: boolean;
  paymentType?: string;
  paymentAmount?: number;
  paymentFrequency?: string;
};

export type UpdateProviderInput = {
  id: string;
  name?: string;
  company?: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  isActive?: boolean;
  notes?: string;
  isForeign?: boolean;
  paymentType?: string;
  paymentAmount?: number;
  paymentFrequency?: string;
};

export type SerializedProvider = Omit<ProviderWithStats, '_count'> & {
  _count?: { transactions: number };
};

export async function loadProviders(companyId: string): Promise<SerializedProvider[]> {
  const providers = await getProvidersQuery(companyId);
  return providers.map(p => ({
    ...p,
    _count: p._count,
  }));
}

export { createProviderAction as createProvider, updateProviderAction as updateProvider, deleteProviderAction as deleteProvider };
