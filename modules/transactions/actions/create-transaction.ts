"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export type CreateTransactionInput = {
  companyId: string;
  type: "income" | "expense";
  date: Date;
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
  retencionIVA?: number;
  total: number;
  
  // Project
  isProject?: boolean;
  projectName?: string;
  numberOfPayments?: number;
  
  // Invoice
  invoiceType?: string;
  paymentMethod?: string;
  paymentForm?: string;
  paymentConditions?: string;
  
  // Status
  status?: string;
  paymentStatus?: string;
  
  // Files
  paymentProofFiles?: string[];
  invoiceFiles?: string[];
  
  // Bank account
  bankAccountId?: string;
};

export async function createTransaction(data: CreateTransactionInput) {
  try {
    // Validaciones del servidor
    if (!data.total || data.total <= 0) {
      return { success: false, error: "El monto total debe ser mayor a 0" };
    }

    if (data.type === "income" && !data.clientId) {
      return { success: false, error: "El cliente es requerido para ingresos" };
    }

    if (data.type === "expense" && !data.providerId && !data.employeeId) {
      return { success: false, error: "El proveedor o empleado es requerido para gastos" };
    }

    if (data.isProject && !data.projectName) {
      return { success: false, error: "El nombre del proyecto es requerido" };
    }

    if (data.isProject && (!data.numberOfPayments || data.numberOfPayments < 1)) {
      return { success: false, error: "El número de pagos debe ser mayor a 0" };
    }

    const {
      isProject,
      numberOfPayments,
      projectName,
      paymentProofFiles,
      invoiceFiles,
      ...transactionData
    } = data;

    // Create main transaction
    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        amount: new Prisma.Decimal(data.total),
        subtotal: data.subtotal ? new Prisma.Decimal(data.subtotal) : null,
        iva: data.iva ? new Prisma.Decimal(data.iva) : null,
        retencionISR: data.retencionISR ? new Prisma.Decimal(data.retencionISR) : null,
        unitPrice: data.unitPrice ? new Prisma.Decimal(data.unitPrice) : null,
        totalProjectAmount: data.total ? new Prisma.Decimal(data.total) : null,
        isProject: isProject || false,
        projectName,
        numberOfPayments,
        paymentProofFiles: paymentProofFiles ? JSON.stringify(paymentProofFiles) : null,
        invoiceFiles: invoiceFiles ? JSON.stringify(invoiceFiles) : null,
      },
      include: {
        client: true,
        concept: true,
      },
    });

    // If it's a project, create the partial payments
    if (isProject && numberOfPayments && numberOfPayments > 1) {
      const paymentAmount = data.total / numberOfPayments;
      const paymentSubtotal = data.subtotal ? data.subtotal / numberOfPayments : paymentAmount;
      const paymentIVA = data.iva ? data.iva / numberOfPayments : 0;
      const paymentISR = data.retencionISR ? data.retencionISR / numberOfPayments : 0;

      const partialPayments = [];
      for (let i = 1; i <= numberOfPayments; i++) {
        partialPayments.push({
          companyId: data.companyId,
          type: data.type,
          date: data.date,
          description: data.description,
          category: data.category,
          clientId: data.clientId,
          conceptId: data.conceptId,
          providerId: data.providerId,
          employeeId: data.employeeId,
          quantity: data.quantity,
          unitPrice: data.unitPrice ? new Prisma.Decimal(data.unitPrice) : null,
          subtotal: new Prisma.Decimal(paymentSubtotal),
          iva: new Prisma.Decimal(paymentIVA),
          retencionISR: new Prisma.Decimal(paymentISR),
          total: new Prisma.Decimal(paymentAmount),
          amount: new Prisma.Decimal(paymentAmount),
          isProject: false,
          parentProjectId: transaction.id,
          paymentNumber: i,
          invoiceType: data.invoiceType,
          paymentMethod: data.paymentMethod,
          paymentForm: data.paymentForm,
          status: "pending",
          paymentStatus: "pending",
          bankAccountId: data.bankAccountId,
        });
      }

      await prisma.transaction.createMany({
        data: partialPayments,
      });
    }

    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/expenses");

    return { success: true, transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}

