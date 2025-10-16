"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export type UpdateTransactionInput = {
  id: string;
  date?: Date;
  description?: string;
  category?: string;
  
  // Relations
  clientId?: string;
  conceptId?: string;
  providerId?: string;
  employeeId?: string;
  
  // Amounts
  quantity?: number;
  unitPrice?: number;
  subtotal?: number;
  iva?: number;
  retencionISR?: number;
  total?: number;
  
  // Invoice
  invoiceNumber?: string;
  isBilled?: boolean;
  invoiceType?: string;
  paymentMethod?: string;
  paymentForm?: string;
  paymentConditions?: string;
  invoiceStatus?: string;
  invoiceXmlUrl?: string;
  invoicePdfUrl?: string;
  cfdiUuid?: string;
  
  // Status
  status?: string;
  paymentStatus?: string;
  
  // Files
  paymentProofFiles?: string[];
  invoiceFiles?: string[];
  
  // Bank account
  bankAccountId?: string;
};

export async function updateTransaction(data: UpdateTransactionInput) {
  try {
    const { id, paymentProofFiles, invoiceFiles, ...updateData } = data;
    
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.total && { amount: new Prisma.Decimal(updateData.total) }),
        ...(updateData.subtotal && { subtotal: new Prisma.Decimal(updateData.subtotal) }),
        ...(updateData.iva !== undefined && { iva: new Prisma.Decimal(updateData.iva) }),
        ...(updateData.retencionISR !== undefined && { retencionISR: new Prisma.Decimal(updateData.retencionISR) }),
        ...(updateData.unitPrice && { unitPrice: new Prisma.Decimal(updateData.unitPrice) }),
        ...(paymentProofFiles && { paymentProofFiles: JSON.stringify(paymentProofFiles) }),
        ...(invoiceFiles && { invoiceFiles: JSON.stringify(invoiceFiles) }),
      },
      include: {
        client: true,
        concept: true,
      },
    });

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/expenses");

    return { success: true, transaction };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}

