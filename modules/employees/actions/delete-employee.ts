"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(employeeId: string) {
  try {
    // Soft delete: mark as inactive instead of removing
    await prisma.employee.update({
      where: { id: employeeId },
      data: { isActive: false },
    });
    
    revalidatePath("/dashboard/payroll/employees");
    return { success: true };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { success: false, error: "Failed to delete employee" };
  }
}

