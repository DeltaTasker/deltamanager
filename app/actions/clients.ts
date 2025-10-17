"use server";

import { getClients as getClientsQuery, type ClientWithStats } from "@/modules/clients/server/queries";
import { createClient as createClientAction } from "@/modules/clients/actions/create-client";
import { updateClient as updateClientAction } from "@/modules/clients/actions/update-client";
import { deleteClient as deleteClientAction } from "@/modules/clients/actions/delete-client";

// Re-export types inline to avoid build issues
export type CreateClientInput = {
  companyId: string;
  name: string;
  company: string;
  razonSocial?: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  codigoPostal?: string;
  notes?: string;
};

export type UpdateClientInput = {
  id: string;
  name?: string;
  company?: string;
  razonSocial?: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  codigoPostal?: string;
  notes?: string;
  isActive?: boolean;
};

export type SerializedClient = Omit<ClientWithStats, '_count'> & {
  _count?: { transactions: number };
};

export async function loadClients(companyId: string): Promise<SerializedClient[]> {
  const clients = await getClientsQuery(companyId);
  return clients.map(c => ({
    ...c,
    _count: c._count,
  }));
}

export { createClientAction as createClient, updateClientAction as updateClient, deleteClientAction as deleteClient };

