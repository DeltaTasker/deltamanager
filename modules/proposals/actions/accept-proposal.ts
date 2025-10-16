"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";

type AcceptProposalInput = {
  proposalId: string;
  clientId: string;
  conceptId: string;
};

export async function acceptProposal(input: AcceptProposalInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const { proposalId, clientId, conceptId } = input;

    // Obtener la propuesta
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { items: true },
    });

    if (!proposal) {
      return { success: false, error: "Propuesta no encontrada" };
    }

    if (proposal.status === "accepted") {
      return { success: false, error: "Esta propuesta ya fue aceptada" };
    }

    // Crear transacción de ingreso (cobro)
    const transaction = await prisma.transaction.create({
      data: {
        companyId: proposal.companyId,
        type: "income",
        description: `Cobro generado de propuesta: ${proposal.title}`,
        amount: proposal.total,
        date: new Date(),
        category: "proposal", // o el concepto que corresponda
        clientName: proposal.clientName,
        status: "pending",
        paymentStatus: "pending",
      },
    });

    // Actualizar propuesta
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: "accepted",
        convertedToSale: true,
        transactionId: transaction.id,
        conceptId,
        respondedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/proposals");
    revalidatePath(`/dashboard/proposals/${proposalId}`);
    revalidatePath("/dashboard/income");

    return {
      success: true,
      transactionId: transaction.id,
      message: "Propuesta aceptada y cobro generado exitosamente",
    };
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al aceptar propuesta",
    };
  }
}

