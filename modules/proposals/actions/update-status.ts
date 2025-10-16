"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";

type UpdateStatusInput = {
  proposalId: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
};

export async function updateProposalStatus(input: UpdateStatusInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const { proposalId, status } = input;

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    // Actualizar timestamps según el estado
    if (status === "sent" && !updateData.sentAt) {
      updateData.sentAt = new Date();
    }
    if (status === "viewed" && !updateData.viewedAt) {
      updateData.viewedAt = new Date();
    }
    if (status === "rejected") {
      updateData.respondedAt = new Date();
    }

    await prisma.proposal.update({
      where: { id: proposalId },
      data: updateData,
    });

    revalidatePath("/dashboard/proposals");
    revalidatePath(`/dashboard/proposals/${proposalId}`);

    return { success: true, message: "Estado actualizado exitosamente" };
  } catch (error) {
    console.error("Error updating proposal status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar estado",
    };
  }
}

