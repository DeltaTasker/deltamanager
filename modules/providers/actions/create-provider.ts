"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createProvider(data: CreateProviderInput) {
  try {
    const provider = await prisma.provider.create({
      data: {
        ...data,
        isActive: true,
      },
    });
    
    revalidatePath("/dashboard/expenses/providers");
    return { success: true, data: provider };
  } catch (error) {
    console.error("Error creating provider:", error);
    return { success: false, error: "Failed to create provider" };
  }
}

