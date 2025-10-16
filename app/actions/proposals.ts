"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export type SerializedProposal = {
  id: string;
  companyId: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string | null;
  title: string;
  description: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: string;
  sentAt: Date | null;
  viewedAt: Date | null;
  respondedAt: Date | null;
  expiresAt: Date | null;
  pdfUrl: string | null;
  documentUrl: string | null;
  attachments: string | null;
  notes: string | null;
  paymentTerms: string | null;
  validityDays: number;
  convertedToSale: boolean;
  transactionId: string | null;
  conceptId: string | null;
  invoiceId: string | null;
  internalNotes: string | null;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function convertDecimalsToNumbers(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'object' && obj.constructor && obj.constructor.name === 'Decimal') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertDecimalsToNumbers);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = convertDecimalsToNumbers(obj[key]);
    }
    return result;
  }
  
  return obj;
}

export async function loadProposals(companyId: string): Promise<SerializedProposal[]> {
  const proposals = await prisma.proposal.findMany({
    where: {
      companyId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return proposals.map(convertDecimalsToNumbers);
}

export async function createProposal(data: {
  companyId: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  conceptId?: string;
  title: string;
  description?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  validityDays: number;
  paymentTerms?: string;
  notes?: string;
  attachments?: string[];
}) {
  try {
    const proposal = await prisma.proposal.create({
      data: {
        companyId: data.companyId,
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        conceptId: data.conceptId,
        title: data.title,
        description: data.description,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: 0,
        total: data.total,
        currency: data.currency,
        status: data.status,
        validityDays: data.validityDays,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        attachments: data.attachments ? JSON.stringify(data.attachments) : null,
      },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true, proposal: convertDecimalsToNumbers(proposal) };
  } catch (error) {
    console.error("Error creating proposal:", error);
    return { success: false, error: "Failed to create proposal" };
  }
}

export async function updateProposal(data: {
  id: string;
  title?: string;
  description?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  status?: string;
  paymentTerms?: string;
  notes?: string;
  attachments?: string[];
}) {
  try {
    const { id, attachments, ...updateData } = data;

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        ...updateData,
        ...(attachments && { attachments: JSON.stringify(attachments) }),
      },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true, proposal: convertDecimalsToNumbers(proposal) };
  } catch (error) {
    console.error("Error updating proposal:", error);
    return { success: false, error: "Failed to update proposal" };
  }
}

export async function deleteProposal(id: string) {
  try {
    await prisma.proposal.delete({
      where: { id },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true };
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return { success: false, error: "Failed to delete proposal" };
  }
}

export async function acceptProposal(id: string) {
  try {
    // Get proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!proposal) {
      return { success: false, error: "Proposal not found" };
    }

    // Create transaction (cobro)
    const transaction = await prisma.transaction.create({
      data: {
        companyId: proposal.companyId,
        type: "income",
        date: new Date(),
        description: proposal.title,
        clientId: proposal.clientId,
        conceptId: proposal.conceptId,
        amount: new Prisma.Decimal(proposal.total),
        total: new Prisma.Decimal(proposal.total),
        subtotal: new Prisma.Decimal(proposal.subtotal),
        iva: new Prisma.Decimal(proposal.tax),
        quantity: 1,
        unitPrice: new Prisma.Decimal(proposal.subtotal),
        status: "pending",
        paymentStatus: "pending",
        invoiceType: "PUE",
        invoiceStatus: "pending",
        isBilled: false,
      },
    });

    // Update proposal
    await prisma.proposal.update({
      where: { id },
      data: {
        status: "accepted",
        convertedToSale: true,
        transactionId: transaction.id,
        respondedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/proposals");
    revalidatePath("/dashboard/income");
    
    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return { success: false, error: "Failed to accept proposal" };
  }
}

