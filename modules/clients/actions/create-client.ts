"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateClientInput = {
  companyId: string;
  name: string;
  company: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  codigoPostal?: string;
  notes?: string;
};

export async function createClient(data: CreateClientInput) {
  try {
    const client = await prisma.client.create({
      data: {
        ...data,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/clients");

    return { success: true, client };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

