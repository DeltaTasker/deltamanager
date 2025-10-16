"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CreateEmployeeInput = {
  companyId: string;
  name: string;
  lastName: string;
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
  notes?: string;
};

export async function createEmployee(data: CreateEmployeeInput) {
  try {
    const fullName = `${data.name} ${data.lastName}`;
    
    const employee = await prisma.employee.create({
      data: {
        ...data,
        fullName,
        hireDate: data.hireDate ? new Date(data.hireDate) : null,
      },
    });
    
    revalidatePath("/dashboard/payroll/employees");
    return { success: true, data: employee };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { success: false, error: "Failed to create employee" };
  }
}

