"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateEmployeeInput = {
  id: string;
  name?: string;
  lastName?: string;
  rfc?: string;
  curp?: string;
  nss?: string;
  email?: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  salary?: number;
  paymentFreq?: string;
  bankAccount?: string;
  clabe?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  isActive?: boolean;
  notes?: string;
};

export async function updateEmployee(data: UpdateEmployeeInput) {
  try {
    const { id, name, lastName, hireDate, ...rest } = data;
    
    const updateData: any = { ...rest };
    
    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;
    if (name || lastName) {
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (employee) {
        updateData.fullName = `${name || employee.name} ${lastName || employee.lastName}`;
      }
    }
    if (hireDate) updateData.hireDate = new Date(hireDate);
    
    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath("/dashboard/payroll/employees");
    return { success: true, data: employee };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { success: false, error: "Failed to update employee" };
  }
}

