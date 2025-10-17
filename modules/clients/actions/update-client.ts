"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type UpdateClientInput = {
  id: string;
  name?: string;
  company?: string;
  razonSocial?: string;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  codigoPostal?: string;
  notes?: string;
  isActive?: boolean;
};

export async function updateClient(data: UpdateClientInput) {
  try {
    const { id, ...updateData } = data;
    
    // Validaciones del servidor
    if (updateData.name !== undefined && updateData.name.trim() === "") {
      return { success: false, error: "El nombre del cliente no puede estar vacío" };
    }

    if (updateData.company !== undefined && updateData.company.trim() === "") {
      return { success: false, error: "La razón social no puede estar vacía" };
    }

    // Validar RFC si se proporciona
    if (updateData.rfc && (updateData.rfc.length < 12 || updateData.rfc.length > 13)) {
      return { success: false, error: "El RFC debe tener 12 o 13 caracteres" };
    }

    // Validar email si se proporciona
    if (updateData.email && !updateData.email.includes("@")) {
      return { success: false, error: "El email no es válido" };
    }
    
    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/income/clients");

    return { success: true, client };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false, error: "Error al actualizar el cliente" };
  }
}

