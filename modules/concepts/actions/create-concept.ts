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
    return { success: false, error: "Failed to create concept" };
  }
}

