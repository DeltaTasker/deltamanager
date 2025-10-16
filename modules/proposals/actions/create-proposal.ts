"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";
import { getActiveCompany } from "@/modules/companies/server/queries";

import type { ProposalFormData } from "../types";

export async function createProposal(data: ProposalFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const activeCompany = await getActiveCompany(session.user.id);
    if (!activeCompany) {
      return { success: false, error: "No hay empresa activa" };
    }

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.validityDays);

    const proposal = await prisma.proposal.create({
      data: {
        companyId: activeCompany.id,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        title: data.title,
        description: data.description,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        total: data.total,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        validityDays: data.validityDays,
        expiresAt,
        notes: data.notes,
        internalNotes: data.internalNotes,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            tax: item.tax,
            discount: item.discount,
            total: item.total,
            satCode: item.satCode,
            satUnit: item.satUnit,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true, data: proposal };
  } catch (error) {
    console.error("Error creating proposal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear propuesta",
    };
  }
}


