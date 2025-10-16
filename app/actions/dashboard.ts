"use server";

import { getTransactions } from "@/modules/transactions/server/queries";
import { SerializedTransaction } from "./income";

export type DashboardStats = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeChange: number;
  expensesChange: number;
  balanceChange: number;
};

export type PendingItem = {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  reference: string;
  type: "income" | "expense";
};

export type DashboardData = {
  stats: DashboardStats;
  pendingIncome: PendingItem[];
  pendingExpenses: PendingItem[];
};

// Helper to convert Decimal to number recursively
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

export async function loadDashboardData(
  companyId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardData> {
  // Get all transactions for the period
  const [incomeTransactionsRaw, expenseTransactionsRaw] = await Promise.all([
    getTransactions({
      companyId,
      type: "income",
      startDate,
      endDate,
    }),
    getTransactions({
      companyId,
      type: "expense",
      startDate,
      endDate,
    }),
  ]);

  // Convert all Decimals to numbers
  const incomeTransactions = incomeTransactionsRaw.map(convertDecimalsToNumbers);
  const expenseTransactions = expenseTransactionsRaw.map(convertDecimalsToNumbers);

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const balance = totalIncome - totalExpenses;

  // Get pending items (status = pending or paymentStatus = pending)
  const pendingIncome: PendingItem[] = incomeTransactions
    .filter(t => t.paymentStatus === "pending" && !t.parentProjectId) // Only top-level, no sub-payments
    .map(t => ({
      id: t.id,
      clientName: t.client?.name || "Cliente desconocido",
      amount: Number(t.total || 0),
      dueDate: new Date(t.date).toISOString(),
      reference: t.invoiceNumber || t.projectName || `COB-${t.id.slice(-6).toUpperCase()}`,
      type: "income" as const,
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 8); // Limit to 8 items

  const pendingExpenses: PendingItem[] = expenseTransactions
    .filter(t => t.paymentStatus === "pending" && !t.parentProjectId)
    .map(t => ({
      id: t.id,
      clientName: t.description || "Proveedor/Empleado",
      amount: Number(t.total || 0),
      dueDate: new Date(t.date).toISOString(),
      reference: t.invoiceNumber || `PAG-${t.id.slice(-6).toUpperCase()}`,
      type: "expense" as const,
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 8);

  // TODO: Calculate changes vs previous period (for now, hardcoded)
  const incomeChange = 15.3;
  const expensesChange = 8.2;
  const balanceChange = 25.5;

  return {
    stats: {
      totalIncome,
      totalExpenses,
      balance,
      incomeChange,
      expensesChange,
      balanceChange,
    },
    pendingIncome,
    pendingExpenses,
  };
}

