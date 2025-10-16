"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateClientInput = {
  id: string;
  name?: string;
  company?: string;
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

export async function updateClient(data: UpdateClientInput) {
  try {
    const { id, ...updateData } = data;
    
    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/clients");

    return { success: true, client };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Failed to update client" };
  }
}

