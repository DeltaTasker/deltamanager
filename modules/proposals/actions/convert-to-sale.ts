"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";

import { getProposalById } from "../server/queries";

/**
 * Convierte una propuesta aceptada en un concepto de ingreso
 * Esto crea un registro de Transaction que luego puede ser facturado
 */
export async function convertProposalToSale(proposalId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const proposal = await getProposalById(proposalId, session.user.id);
    if (!proposal) {
      return { success: false, error: "Propuesta no encontrada" };
    }

    if (proposal.status !== "accepted") {
      return { success: false, error: "Solo se pueden convertir propuestas aceptadas" };
    }

    if (proposal.convertedToSale) {
      return { success: false, error: "Esta propuesta ya fue convertida a venta" };
    }

    // Crear transacción de ingreso basada en la propuesta
    const transaction = await prisma.transaction.create({
      data: {
        companyId: proposal.companyId,
        type: "income",
        amount: proposal.total,
        description: `${proposal.title} - ${proposal.clientName}`,
        category: "Ventas",
        date: new Date(),
        status: "pending", // Pendiente de facturar/cobrar
      },
    });

    // Actualizar propuesta como convertida
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        convertedToSale: true,
        conceptId: transaction.id,
      },
    });

    revalidatePath("/dashboard/proposals");
    revalidatePath("/dashboard/income");
    
    return { success: true, data: transaction };
  } catch (error) {
    console.error("Error converting proposal to sale:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al convertir propuesta",
    };
  }
}


