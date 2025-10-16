"use server";

import { getTransactions, type TransactionWithRelations, type GetTransactionsParams } from "@/modules/transactions/server/queries";
import { getProviders, type ProviderWithStats } from "@/modules/providers/server/queries";
import { getConcepts, type ConceptWithStats } from "@/modules/concepts/server/queries";
import { getBankAccounts } from "@/modules/bank-accounts/server/queries";
import type { Prisma } from "@prisma/client";

// Serializable types (without Decimal)
export type SerializedTransaction = {
  id: string;
  companyId: string;
  type: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  clientId: string | null;
  clientName: string | null;
  conceptId: string | null;
  providerId: string | null;
  employeeId: string | null;
  quantity: number | null;
  unitPrice: number | null;
  subtotal: number | null;
  iva: number | null;
  retencionISR: number | null;
  retencionIVA: number | null;
  total: number | null;
  isProject: boolean;
  projectName: string | null;
  totalProjectAmount: number | null;
  numberOfPayments: number | null;
  parentProjectId: string | null;
  paymentNumber: number | null;
  invoiceNumber: string | null;
  isBilled: boolean;
  invoiceType: string | null;
  paymentMethod: string | null;
  paymentForm: string | null;
  paymentConditions: string | null;
  invoiceStatus: string | null;
  invoiceXmlUrl: string | null;
  invoicePdfUrl: string | null;
  cfdiUuid: string | null;
  status: string;
  paymentStatus: string | null;
  paymentProofFiles: string | null;
  invoiceFiles: string | null;
  bankAccountId: string | null;
  createdAt: Date;
  updatedAt: Date;
  provider?: any;
  concept?: any;
  projectPayments?: SerializedTransaction[];
};

export type SerializedProvider = Omit<ProviderWithStats, '_count'> & {
  _count?: { transactions: number };
};

export type SerializedConcept = Omit<ConceptWithStats, 'defaultAmount' | 'tasaIVA' | 'tasaRetencionISR' | 'tasaRetencionIVA' | '_count'> & {
  defaultAmount: number | null;
  tasaIVA: number;
  tasaRetencionISR: number;
  tasaRetencionIVA: number;
  ivaIncluded: boolean;
  _count?: { transactions: number };
};

export type ExpensePageData = {
  transactions: SerializedTransaction[];
  providers: SerializedProvider[];
  concepts: SerializedConcept[];
  bankAccounts: any[];
};

function serializeTransaction(t: any): SerializedTransaction {
  return {
    id: t.id,
    companyId: t.companyId,
    type: t.type,
    date: t.date,
    description: t.description,
    amount: Number(t.amount),
    category: t.category,
    clientId: t.clientId,
    clientName: t.clientName,
    conceptId: t.conceptId,
    providerId: t.providerId,
    employeeId: t.employeeId,
    quantity: t.quantity,
    unitPrice: t.unitPrice ? Number(t.unitPrice) : null,
    subtotal: t.subtotal ? Number(t.subtotal) : null,
    iva: t.iva ? Number(t.iva) : null,
    retencionISR: t.retencionISR ? Number(t.retencionISR) : null,
    retencionIVA: t.retencionIVA ? Number(t.retencionIVA) : null,
    total: t.total ? Number(t.total) : null,
    isProject: t.isProject,
    projectName: t.projectName,
    totalProjectAmount: t.totalProjectAmount ? Number(t.totalProjectAmount) : null,
    numberOfPayments: t.numberOfPayments,
    parentProjectId: t.parentProjectId,
    paymentNumber: t.paymentNumber,
    invoiceNumber: t.invoiceNumber,
    isBilled: t.isBilled,
    invoiceType: t.invoiceType,
    paymentMethod: t.paymentMethod,
    paymentForm: t.paymentForm,
    paymentConditions: t.paymentConditions,
    invoiceStatus: t.invoiceStatus,
    invoiceXmlUrl: t.invoiceXmlUrl,
    invoicePdfUrl: t.invoicePdfUrl,
    cfdiUuid: t.cfdiUuid,
    status: t.status,
    paymentStatus: t.paymentStatus,
    paymentProofFiles: t.paymentProofFiles,
    invoiceFiles: t.invoiceFiles,
    bankAccountId: t.bankAccountId,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    provider: t.provider,
    concept: t.concept,
    projectPayments: t.projectPayments?.map(serializeTransaction),
  };
}

export async function loadExpenseData(companyId: string): Promise<ExpensePageData> {
  const [transactions, providers, concepts, bankAccounts] = await Promise.all([
    getTransactions({ companyId, type: "expense" }),
    getProviders(companyId),
    getConcepts(companyId),
    getBankAccounts(companyId),
  ]);

  return {
    transactions: transactions.map(serializeTransaction),
    providers: providers.map(p => ({
      ...p,
      _count: p._count,
    })),
    concepts: concepts.map(c => ({
      ...c,
      defaultAmount: c.defaultAmount ? Number(c.defaultAmount) : null,
      tasaIVA: Number(c.tasaIVA),
      tasaRetencionISR: Number(c.tasaRetencionISR),
      tasaRetencionIVA: Number(c.tasaRetencionIVA),
      ivaIncluded: c.ivaIncluded || false,
      _count: c._count,
    })),
    bankAccounts,
  };
}

export async function refreshExpenseTransactions(companyId: string): Promise<SerializedTransaction[]> {
  const transactions = await getTransactions({ companyId, type: "expense" });
  return transactions.map(serializeTransaction);
}
