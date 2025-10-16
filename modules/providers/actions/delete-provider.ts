"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProvider(providerId: string) {
  try {
    await prisma.provider.delete({
      where: { id: providerId },
    });
    
    revalidatePath("/dashboard/expenses/providers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting provider:", error);
    return { success: false, error: "Failed to delete provider" };
  }
}

