"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";

import type { ProposalStatus } from "../types";
import { proposalExists } from "../server/queries";

export async function updateProposalStatus(proposalId: string, status: ProposalStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que la propuesta exista
    const exists = await proposalExists(proposalId, session.user.id);
    if (!exists) {
      return { success: false, error: "Propuesta no encontrada" };
    }

    const updateData: any = { status };

    // Actualizar timestamps según el status
    switch (status) {
      case "sent":
        updateData.sentAt = new Date();
        break;
      case "viewed":
        updateData.viewedAt = new Date();
        break;
      case "accepted":
      case "rejected":
        updateData.respondedAt = new Date();
        break;
    }

    const proposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: updateData,
      include: { items: true },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true, data: proposal };
  } catch (error) {
    console.error("Error updating proposal status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar propuesta",
    };
  }
}


