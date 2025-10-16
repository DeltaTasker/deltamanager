"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteClient(id: string) {
  try {
    // Soft delete
    await prisma.client.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/clients");

    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, error: "Failed to delete client" };
  }
}

