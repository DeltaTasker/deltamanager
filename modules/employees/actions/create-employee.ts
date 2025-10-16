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
    // Validaciones del servidor
    if (!data.name || data.name.trim() === "") {
      return { success: false, error: "El nombre del empleado es requerido" };
    }

    if (!data.lastName || data.lastName.trim() === "") {
      return { success: false, error: "El apellido del empleado es requerido" };
    }

    // Validar RFC si se proporciona
    if (data.rfc && (data.rfc.length < 12 || data.rfc.length > 13)) {
      return { success: false, error: "El RFC debe tener 12 o 13 caracteres" };
    }

    // Validar CURP si se proporciona (debe tener 18 caracteres)
    if (data.curp && data.curp.length !== 18) {
      return { success: false, error: "El CURP debe tener 18 caracteres" };
    }

    // Validar NSS si se proporciona (debe tener 11 dígitos)
    if (data.nss && data.nss.length !== 11) {
      return { success: false, error: "El NSS debe tener 11 dígitos" };
    }

    // Validar email si se proporciona
    if (data.email && !data.email.includes("@")) {
      return { success: false, error: "El email no es válido" };
    }

    // Validar salario si se proporciona
    if (data.salary !== undefined && data.salary < 0) {
      return { success: false, error: "El salario no puede ser negativo" };
    }

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
    return { success: false, error: "Error al crear el empleado" };
  }
}

