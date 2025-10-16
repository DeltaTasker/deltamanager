"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTransaction(id: string) {
  try {
    // Check if it's a project
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      select: { isProject: true },
    });

    if (transaction?.isProject) {
      // Delete all project payments first
      await prisma.transaction.deleteMany({
        where: {
          parentProjectId: id,
        },
      });
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/expenses");

    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

