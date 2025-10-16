"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";
import { getActiveCompany } from "@/modules/companies/server/queries";

import type { BankAccountFormData } from "../types";

export async function createBankAccount(data: BankAccountFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado" };
    }

    const activeCompany = await getActiveCompany(session.user.id);
    if (!activeCompany) {
      return { success: false, error: "No hay empresa activa" };
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        companyId: activeCompany.id,
        name: data.name,
        accountType: data.accountType,
        last4: data.last4,
        bank: data.bank,
        currency: data.currency,
        notes: data.notes,
      },
    });

    revalidatePath("/dashboard/config");
    return { success: true, data: bankAccount };
  } catch (error) {
    console.error("Error creating bank account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear cuenta",
    };
  }
}


