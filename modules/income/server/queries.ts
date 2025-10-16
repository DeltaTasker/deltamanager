import { prisma } from "@/lib/prisma";
import { ensureCompanyAccess } from "@/modules/companies/server/queries";

export type IncomeTransaction = {
  id: string;
  companyId: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  clientName?: string;
  invoiceNumber?: string;
  status: "pending" | "received" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

export type CreateIncomeInput = {
  description: string;
  amount: number;
  date: Date;
  category: string;
  clientName?: string;
  invoiceNumber?: string;
};

export type UpdateIncomeInput = Partial<CreateIncomeInput> & {
  status?: "pending" | "received" | "cancelled";
};

// Mock data for testing
const mockIncomeData: IncomeTransaction[] = [
  {
    id: "1",
    companyId: "company1",
    description: "Venta de servicios contables",
    amount: 15000,
    date: new Date("2024-01-15"),
    category: "Servicios Profesionales",
    clientName: "Empresa ABC S.A.",
    invoiceNumber: "FAC-2024-001",
    status: "received",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    companyId: "company1",
    description: "Consultoría financiera",
    amount: 25000,
    date: new Date("2024-01-20"),
    category: "Consultoría",
    clientName: "Tech Solutions Inc.",
    invoiceNumber: "FAC-2024-002",
    status: "received",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    companyId: "company1",
    description: "Auditoría financiera",
    amount: 35000,
    date: new Date("2024-01-25"),
    category: "Auditoría",
    clientName: "Corporativo XYZ",
    invoiceNumber: "FAC-2024-003",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getCompanyIncomeTransactions(
  userId: string,
  companyId: string,
  limit?: number,
  offset?: number
): Promise<IncomeTransaction[]> {
  await ensureCompanyAccess(userId, companyId);

  // Return mock data for now
  return mockIncomeData.slice(offset || 0, limit ? (offset || 0) + limit : undefined);
}

export async function createIncomeTransaction(
  userId: string,
  companyId: string,
  input: CreateIncomeInput
): Promise<IncomeTransaction> {
  await ensureCompanyAccess(userId, companyId);

  // For now, just return a mock transaction
  return {
    id: Date.now().toString(),
    companyId,
    description: input.description,
    amount: input.amount,
    date: input.date,
    category: input.category,
    clientName: input.clientName,
    invoiceNumber: input.invoiceNumber,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function updateIncomeTransaction(
  userId: string,
  companyId: string,
  transactionId: string,
  input: UpdateIncomeInput
): Promise<IncomeTransaction> {
  await ensureCompanyAccess(userId, companyId);

  // For now, just return a mock updated transaction
  return {
    id: transactionId,
    companyId,
    description: input.description || "Updated transaction",
    amount: input.amount || 1000,
    date: input.date || new Date(),
    category: input.category || "Updated",
    clientName: input.clientName,
    invoiceNumber: input.invoiceNumber,
    status: input.status || "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function deleteIncomeTransaction(
  userId: string,
  companyId: string,
  transactionId: string
): Promise<void> {
  await ensureCompanyAccess(userId, companyId);
  // Mock delete operation
}

export async function getIncomeSummary(
  userId: string,
  companyId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  total: number;
  count: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}> {
  await ensureCompanyAccess(userId, companyId);

  // Return mock summary data
  return {
    total: 83000,
    count: 4,
    byCategory: {
      "Servicios Profesionales": 23000,
      "Consultoría": 25000,
      "Auditoría": 35000,
    },
    byStatus: {
      "received": 2,
      "pending": 2,
      "cancelled": 0,
    },
  };
}
