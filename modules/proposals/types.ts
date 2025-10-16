/**
 * Tipos y enums para el módulo de Propuestas
 */

export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Borrador",
  sent: "Enviada",
  viewed: "Vista",
  accepted: "Aceptada",
  rejected: "Rechazada",
  expired: "Expirada",
};

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, string> = {
  draft: "bg-gray-500",
  sent: "bg-blue-500",
  viewed: "bg-purple-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
  expired: "bg-orange-500",
};

export type ProposalFormData = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  title: string;
  description?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentTerms?: string;
  validityDays: number;
  notes?: string;
  internalNotes?: string;
  items: ProposalItemFormData[];
};

export type ProposalItemFormData = {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  satCode?: string;
  satUnit?: string;
};

export type ProposalWithItems = {
  id: string;
  companyId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  title: string;
  description?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: ProposalStatus;
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  pdfUrl?: string;
  documentUrl?: string;
  notes?: string;
  paymentTerms?: string;
  validityDays: number;
  convertedToSale: boolean;
  conceptId?: string;
  invoiceId?: string;
  internalNotes?: string;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
  items: ProposalItem[];
};

export type ProposalItem = {
  id: string;
  proposalId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  satCode?: string;
  satUnit?: string;
  createdAt: Date;
};

export type ProposalSummary = {
  total: number;
  draft: number;
  sent: number;
  accepted: number;
  rejected: number;
  expired: number;
  totalAmount: number;
  acceptedAmount: number;
  conversionRate: number;
};


