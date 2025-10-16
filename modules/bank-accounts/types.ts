export type BankAccountType = "bank" | "card" | "cash" | "other";

export const BANK_ACCOUNT_TYPE_LABELS: Record<BankAccountType, string> = {
  bank: "Cuenta Bancaria",
  card: "Tarjeta",
  cash: "Efectivo",
  other: "Otro",
};

export type BankAccountFormData = {
  name: string;
  accountType: BankAccountType;
  last4?: string;
  bank?: string;
  currency: string;
  notes?: string;
};

export type BankAccount = {
  id: string;
  companyId: string;
  name: string;
  accountType: BankAccountType;
  last4?: string;
  bank?: string;
  currency: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};


