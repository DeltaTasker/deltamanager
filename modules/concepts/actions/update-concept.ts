"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function updateConcept(data: UpdateConceptInput) {
  try {
    const { id, ...updateData } = data;
    
    const concept = await prisma.concept.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/concepts");

    return { success: true, concept };
  } catch (error) {
    console.error("Error updating concept:", error);
    return { success: false, error: "Failed to update concept" };
  }
}

