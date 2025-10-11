"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/modules/auth/server/auth";

export async function switchCompanyAction(companyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async (tx) => {
    const membership = await tx.userCompany.findFirst({
      where: {
        userId: session.user.id,
        companyId,
      },
    });

    if (!membership) {
      throw new Error("Company not found for user");
    }

    await tx.userCompany.updateMany({
      where: {
        userId: session.user.id,
      },
      data: {
        isDefault: false,
      },
    });

    await tx.userCompany.update({
      where: { id: membership.id },
      data: { isDefault: true },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard", "layout");
}

