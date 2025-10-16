"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export type SerializedProposal = {
  id: string;
  companyId: string;
  clientId: string;
  clientName: string; // Computed from client relation
  conceptId: string;
  conceptName: string; // Computed from concept relation
  conceptPrice: number; // Computed from concept relation
  title: string;
  description: string | null;
  createdDate: Date;
  sentDate: Date | null;
  status: string;
  attachments: string | null;
  notes: string | null;
  convertedToSale: boolean;
  transactionId: string | null;
  internalNotes: string | null;
  tags: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SerializedFollowUp = {
  id: string;
  proposalId: string;
  date: Date;
  type: string;
  notes: string | null;
  createdAt: Date;
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
    include: {
      client: true,
      concept: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return proposals.map(p => ({
    id: p.id,
    companyId: p.companyId,
    clientId: p.clientId,
    clientName: p.client.name,
    conceptId: p.conceptId,
    conceptName: p.concept.name,
    conceptPrice: Number(p.concept.defaultAmount || 0),
    title: p.title,
    description: p.description,
    createdDate: p.createdDate,
    sentDate: p.sentDate,
    status: p.status,
    attachments: p.attachments,
    notes: p.notes,
    convertedToSale: p.convertedToSale,
    transactionId: p.transactionId,
    internalNotes: p.internalNotes,
    tags: p.tags,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export async function loadProposalFollowUps(proposalId: string): Promise<SerializedFollowUp[]> {
  const followUps = await prisma.proposalFollowUp.findMany({
    where: {
      proposalId,
    },
    orderBy: {
      date: "desc",
    },
  });

  return followUps;
}

export async function createProposal(data: {
  companyId: string;
  clientId: string;
  conceptId: string;
  title: string;
  description?: string;
  status?: string;
  sentDate?: Date;
  notes?: string;
  attachments?: string[];
}) {
  try {
    // Validaciones
    if (!data.title || data.title.trim() === "") {
      return { success: false, error: "El título es requerido" };
    }
    if (!data.clientId) {
      return { success: false, error: "El cliente es requerido" };
    }
    if (!data.conceptId) {
      return { success: false, error: "El concepto es requerido" };
    }

    const proposal = await prisma.proposal.create({
      data: {
        companyId: data.companyId,
        clientId: data.clientId,
        conceptId: data.conceptId,
        title: data.title,
        description: data.description,
        status: data.status || "sent",
        sentDate: data.sentDate || new Date(),
        notes: data.notes,
        attachments: data.attachments ? JSON.stringify(data.attachments) : null,
      },
      include: {
        client: true,
        concept: true,
      },
    });

    revalidatePath("/dashboard/proposals");
    
    return { 
      success: true, 
      proposal: {
        id: proposal.id,
        companyId: proposal.companyId,
        clientId: proposal.clientId,
        clientName: proposal.client.name,
        conceptId: proposal.conceptId,
        conceptName: proposal.concept.name,
        conceptPrice: Number(proposal.concept.defaultAmount || 0),
        title: proposal.title,
        description: proposal.description,
        createdDate: proposal.createdDate,
        sentDate: proposal.sentDate,
        status: proposal.status,
        attachments: proposal.attachments,
        notes: proposal.notes,
        convertedToSale: proposal.convertedToSale,
        transactionId: proposal.transactionId,
        internalNotes: proposal.internalNotes,
        tags: proposal.tags,
        createdAt: proposal.createdAt,
        updatedAt: proposal.updatedAt,
      }
    };
  } catch (error) {
    console.error("Error creating proposal:", error);
    return { success: false, error: "Error al crear la propuesta" };
  }
}

export async function updateProposal(data: {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  sentDate?: Date;
  notes?: string;
  attachments?: string[];
}) {
  try {
    const { id, attachments, ...updateData } = data;

    // Validaciones
    if (updateData.title !== undefined && updateData.title.trim() === "") {
      return { success: false, error: "El título no puede estar vacío" };
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        ...updateData,
        ...(attachments && { attachments: JSON.stringify(attachments) }),
      },
      include: {
        client: true,
        concept: true,
      },
    });

    revalidatePath("/dashboard/proposals");
    
    return { 
      success: true, 
      proposal: {
        id: proposal.id,
        companyId: proposal.companyId,
        clientId: proposal.clientId,
        clientName: proposal.client.name,
        conceptId: proposal.conceptId,
        conceptName: proposal.concept.name,
        conceptPrice: Number(proposal.concept.defaultAmount || 0),
        title: proposal.title,
        description: proposal.description,
        createdDate: proposal.createdDate,
        sentDate: proposal.sentDate,
        status: proposal.status,
        attachments: proposal.attachments,
        notes: proposal.notes,
        convertedToSale: proposal.convertedToSale,
        transactionId: proposal.transactionId,
        internalNotes: proposal.internalNotes,
        tags: proposal.tags,
        createdAt: proposal.createdAt,
        updatedAt: proposal.updatedAt,
      }
    };
  } catch (error) {
    console.error("Error updating proposal:", error);
    return { success: false, error: "Error al actualizar la propuesta" };
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
    return { success: false, error: "Error al eliminar la propuesta" };
  }
}

export async function addFollowUp(data: {
  proposalId: string;
  date: Date;
  type: string;
  notes?: string;
}) {
  try {
    const followUp = await prisma.proposalFollowUp.create({
      data: {
        proposalId: data.proposalId,
        date: data.date,
        type: data.type,
        notes: data.notes,
      },
    });

    revalidatePath("/dashboard/proposals");
    return { success: true, followUp };
  } catch (error) {
    console.error("Error adding follow-up:", error);
    return { success: false, error: "Error al agregar seguimiento" };
  }
}

export async function acceptProposal(id: string) {
  try {
    // Get proposal with related data
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        client: true,
        concept: true,
      },
    });

    if (!proposal) {
      return { success: false, error: "Propuesta no encontrada" };
    }

    // Calculate totals from concept
    const concept = proposal.concept;
    const price = Number(concept.defaultAmount || 0);
    const tasaIVA = concept.tasaIVA / 100;
    const tasaRetencionISR = concept.tasaRetencionISR / 100;
    const tasaRetencionIVA = concept.tasaRetencionIVA / 100;

    let subtotal: number;
    let iva: number;

    if (concept.ivaIncluded) {
      // IVA Incluido
      subtotal = parseFloat((price / (1 + tasaIVA)).toFixed(2));
      iva = parseFloat((price - subtotal).toFixed(2));
    } else {
      // +IVA
      subtotal = price;
      iva = parseFloat((price * tasaIVA).toFixed(2));
    }

    const retencionISR = parseFloat((subtotal * tasaRetencionISR).toFixed(2));
    const retencionIVA = parseFloat((iva * tasaRetencionIVA).toFixed(2));
    const total = parseFloat((subtotal + iva - retencionISR - retencionIVA).toFixed(2));

    // Create transaction (cobro) with status pending and invoiceType PUE
    const transaction = await prisma.transaction.create({
      data: {
        companyId: proposal.companyId,
        type: "income",
        date: new Date(),
        description: proposal.title,
        clientId: proposal.clientId,
        conceptId: proposal.conceptId,
        quantity: 1,
        unitPrice: new Prisma.Decimal(price),
        subtotal: new Prisma.Decimal(subtotal),
        iva: new Prisma.Decimal(iva),
        retencionISR: new Prisma.Decimal(retencionISR),
        retencionIVA: new Prisma.Decimal(retencionIVA),
        total: new Prisma.Decimal(total),
        amount: new Prisma.Decimal(total),
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
      },
    });

    revalidatePath("/dashboard/proposals");
    revalidatePath("/dashboard/income");
    
    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return { success: false, error: "Error al aceptar la propuesta" };
  }
}
