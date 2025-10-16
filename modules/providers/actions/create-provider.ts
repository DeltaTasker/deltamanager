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
    // Validaciones del servidor
    if (!data.name || data.name.trim() === "") {
      return { success: false, error: "El nombre del proveedor es requerido" };
    }

    if (!data.company || data.company.trim() === "") {
      return { success: false, error: "La razón social es requerida" };
    }

    // Validar RFC solo si no es extranjero
    if (!data.isForeign && data.rfc && (data.rfc.length < 12 || data.rfc.length > 13)) {
      return { success: false, error: "El RFC debe tener 12 o 13 caracteres" };
    }

    // Validar email si se proporciona
    if (data.email && !data.email.includes("@")) {
      return { success: false, error: "El email no es válido" };
    }

    // Validar monto de pago si es fijo
    if (data.paymentType === "fixed" && (!data.paymentAmount || data.paymentAmount <= 0)) {
      return { success: false, error: "El monto de pago debe ser mayor a 0" };
    }

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
    return { success: false, error: "Error al crear el proveedor" };
  }
}

