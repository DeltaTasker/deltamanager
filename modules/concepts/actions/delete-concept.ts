"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteConcept(id: string) {
  try {
    // Soft delete
    await prisma.concept.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/concepts");

    return { success: true };
  } catch (error) {
    console.error("Error deleting concept:", error);
    return { success: false, error: "Failed to delete concept" };
  }
}

