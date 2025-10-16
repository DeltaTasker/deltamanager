"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createConcept(data: CreateConceptInput) {
  try {
    // Validaciones del servidor
    if (!data.name || data.name.trim() === "") {
      return { success: false, error: "El nombre del concepto es requerido" };
    }

    // Validar que las tasas de impuestos sean válidas
    if (data.tasaIVA !== undefined && (data.tasaIVA < 0 || data.tasaIVA > 100)) {
      return { success: false, error: "La tasa de IVA debe estar entre 0 y 100" };
    }

    if (data.tasaRetencionISR !== undefined && (data.tasaRetencionISR < 0 || data.tasaRetencionISR > 100)) {
      return { success: false, error: "La tasa de retención ISR debe estar entre 0 y 100" };
    }

    if (data.tasaRetencionIVA !== undefined && (data.tasaRetencionIVA < 0 || data.tasaRetencionIVA > 100)) {
      return { success: false, error: "La tasa de retención IVA debe estar entre 0 y 100" };
    }

    if (data.defaultAmount !== undefined && data.defaultAmount < 0) {
      return { success: false, error: "El precio por defecto no puede ser negativo" };
    }

    const concept = await prisma.concept.create({
      data: {
        ...data,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/concepts");

    return { success: true, concept };
  } catch (error) {
    console.error("Error creating concept:", error);
    return { success: false, error: "Error al crear el concepto" };
  }
}

