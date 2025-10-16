"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateProvider(data: UpdateProviderInput) {
  try {
    const { id, ...updateData } = data;
    
    const provider = await prisma.provider.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath("/dashboard/expenses/providers");
    return { success: true, data: provider };
  } catch (error) {
    console.error("Error updating provider:", error);
    return { success: false, error: "Failed to update provider" };
  }
}

