"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createClient(data: CreateClientInput) {
  try {
    // Validaciones del servidor
    if (!data.name || data.name.trim() === "") {
      return { success: false, error: "El nombre del cliente es requerido" };
    }

    if (!data.company || data.company.trim() === "") {
      return { success: false, error: "La razón social es requerida" };
    }

    // Validar RFC si se proporciona (debe tener 12-13 caracteres)
    if (data.rfc && (data.rfc.length < 12 || data.rfc.length > 13)) {
      return { success: false, error: "El RFC debe tener 12 o 13 caracteres" };
    }

    // Validar email si se proporciona
    if (data.email && !data.email.includes("@")) {
      return { success: false, error: "El email no es válido" };
    }

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
    return { success: false, error: "Error al crear el cliente" };
  }
}

