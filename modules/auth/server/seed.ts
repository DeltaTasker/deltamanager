import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

async function main() {
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Acceso completo",
      permissions: JSON.stringify({ all: true }),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "admin@delta.local" },
    update: {},
    create: {
      email: "admin@delta.local",
      name: "Administrador",
      hashedPassword,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Empresa Demo",
      rfc: "DEMO010101AAA",
      users: {
        create: {
          userId: user.id,
          isDefault: true,
          roleId: (await prisma.role.findUnique({ where: { name: "admin" } }))!.id,
        },
      },
    },
  });

  await prisma.subscription.create({
    data: {
      companyId: company.id,
      plan: "enterprise",
      status: "active",
      seats: 5,
    },
  });

  // Crear datos de ingresos para el dashboard
  const incomeTransactions = [
    {
      description: "Venta de servicios contables",
      amount: 15000,
      date: new Date("2024-01-15"),
      category: "Servicios Profesionales",
      clientName: "Empresa ABC S.A.",
      invoiceNumber: "FAC-2024-001",
      status: "received"
    },
    {
      description: "Consultoría financiera",
      amount: 25000,
      date: new Date("2024-01-20"),
      category: "Consultoría",
      clientName: "Tech Solutions Inc.",
      invoiceNumber: "FAC-2024-002",
      status: "received"
    },
    {
      description: "Auditoría financiera",
      amount: 35000,
      date: new Date("2024-01-25"),
      category: "Auditoría",
      clientName: "Corporativo XYZ",
      invoiceNumber: "FAC-2024-003",
      status: "pending"
    },
    {
      description: "Servicios de nómina",
      amount: 8000,
      date: new Date("2024-01-28"),
      category: "Servicios Profesionales",
      clientName: "Startup Innovadora",
      invoiceNumber: "FAC-2024-004",
      status: "pending"
    }
  ];

  for (const transaction of incomeTransactions) {
    await prisma.transaction.create({
      data: {
        companyId: company.id,
        type: "income",
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        clientName: transaction.clientName,
        invoiceNumber: transaction.invoiceNumber,
        status: transaction.status,
      },
    });
  }

  console.warn("Seed data created with income transactions.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

