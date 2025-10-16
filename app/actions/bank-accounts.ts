"use server";

import { getBankAccounts as getBankAccountsQuery } from "@/modules/bank-accounts/server/queries";
import { createBankAccount as createAction } from "@/modules/bank-accounts/actions/create-bank-account";
import type { BankAccount } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function loadBankAccounts(companyId: string): Promise<BankAccount[]> {
  return await getBankAccountsQuery(companyId);
}

export async function createBankAccount(data: {
  companyId: string;
  name: string;
  accountType: string;
  last4?: string;
  bank?: string;
  currency: string;
  notes?: string;
  isActive?: boolean;
}) {
  return await createAction(data);
}

export async function updateBankAccount(data: {
  id: string;
  name?: string;
  accountType?: string;
  last4?: string;
  bank?: string;
  currency?: string;
  notes?: string;
  isActive?: boolean;
}) {
  try {
    const { id, ...updateData } = data;
    
    const account = await prisma.bankAccount.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/config/bank-accounts");
    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/expenses");

    return { success: true, account };
  } catch (error) {
    console.error("Error updating bank account:", error);
    return { success: false, error: "Failed to update bank account" };
  }
}

export async function deleteBankAccount(id: string) {
  try {
    await prisma.bankAccount.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/dashboard/config/bank-accounts");
    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/expenses");

    return { success: true };
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return { success: false, error: "Failed to delete bank account" };
  }
}

