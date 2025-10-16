import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const companyId = "temp-company-id";

  // Create a test company
  const company = await prisma.company.upsert({
    where: { id: companyId },
    update: {},
    create: {
      id: companyId,
      name: "Empresa de Prueba",
      rfc: "TEST123456XXX",
      country: "MX",
    },
  });

  console.log("✅ Company created:", company.name);

  // Create test clients
  const client1 = await prisma.client.upsert({
    where: { id: "client-1" },
    update: {},
    create: {
      id: "client-1",
      companyId,
      name: "Juan Pérez",
      company: "Acme Corp",
      rfc: "PEXJ800101XXX",
      email: "juan@acme.com",
      regimenFiscal: "612",
      usoCFDI: "G03",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: "client-2" },
    update: {},
    create: {
      id: "client-2",
      companyId,
      name: "María García",
      company: "Tech Solutions Inc.",
      rfc: "GAXM850202XXX",
      email: "maria@techsolutions.com",
      regimenFiscal: "601",
      usoCFDI: "G03",
    },
  });

  console.log("✅ Clients created:", client1.name, client2.name);

  // Create test concepts
  const concept1 = await prisma.concept.upsert({
    where: { id: "concept-1" },
    update: {},
    create: {
      id: "concept-1",
      companyId,
      name: "Desarrollo de Software",
      description: "Servicios de desarrollo de software a medida",
      claveProdServ: "81111500",
      claveUnidad: "E48",
      objetoImp: "02",
      tasaIVA: 16,
      tasaRetencionISR: 10.67,
    },
  });

  const concept2 = await prisma.concept.upsert({
    where: { id: "concept-2" },
    update: {},
    create: {
      id: "concept-2",
      companyId,
      name: "Consultoría Financiera",
      description: "Servicios de asesoría y consultoría financiera",
      claveProdServ: "85121601",
      claveUnidad: "E48",
      objetoImp: "02",
      tasaIVA: 16,
      tasaRetencionISR: 10.67,
    },
  });

  console.log("✅ Concepts created:", concept1.name, concept2.name);

  // Create test bank accounts
  const bank1 = await prisma.bankAccount.upsert({
    where: { id: "bank-1" },
    update: {},
    create: {
      id: "bank-1",
      companyId,
      name: "Cuenta BBVA Empresarial",
      accountType: "bank",
      last4: "1234",
      bank: "BBVA",
    },
  });

  const bank2 = await prisma.bankAccount.upsert({
    where: { id: "bank-2" },
    update: {},
    create: {
      id: "bank-2",
      companyId,
      name: "Tarjeta Santander",
      accountType: "card",
      last4: "5678",
      bank: "Santander",
    },
  });

  console.log("✅ Bank accounts created:", bank1.name, bank2.name);

  // Create a test project with payments
  const project = await prisma.transaction.upsert({
    where: { id: "proj-1" },
    update: {},
    create: {
      id: "proj-1",
      companyId,
      type: "income",
      date: new Date("2024-01-20"),
      clientId: client2.id,
      conceptId: concept1.id,
      quantity: 1,
      unitPrice: 10000,
      subtotal: 10000,
      iva: 1600,
      retencionISR: 1067,
      total: 10533,
      amount: 10533,
      isProject: true,
      projectName: "Sistema de Gestión Empresarial",
      numberOfPayments: 4,
      totalProjectAmount: 10533,
      invoiceType: "PPD",
      paymentMethod: "Transferencia",
      paymentForm: "03",
      paymentConditions: "4 pagos mensuales",
      status: "pending",
      paymentStatus: "pending",
      bankAccountId: bank1.id,
    },
  });

  console.log("✅ Project created:", project.projectName);

  // Create project payments
  for (let i = 1; i <= 4; i++) {
    await prisma.transaction.upsert({
      where: { id: `proj-1-p${i}` },
      update: {},
      create: {
        id: `proj-1-p${i}`,
        companyId,
        type: "income",
        date: new Date(`2024-0${i}-20`),
        clientId: client2.id,
        conceptId: concept1.id,
        quantity: 1,
        unitPrice: 2500,
        subtotal: 2500,
        iva: 400,
        retencionISR: 266.75,
        total: 2633.25,
        amount: 2633.25,
        isProject: false,
        parentProjectId: project.id,
        paymentNumber: i,
        invoiceType: "PPD",
        paymentMethod: "Transferencia",
        paymentForm: "03",
        status: i === 1 ? "received" : "pending",
        paymentStatus: i === 1 ? "paid" : "pending",
        bankAccountId: bank1.id,
      },
    });
  }

  console.log("✅ Project payments created: 4 payments");

  // Create regular transactions
  await prisma.transaction.upsert({
    where: { id: "trans-1" },
    update: {},
    create: {
      id: "trans-1",
      companyId,
      type: "income",
      date: new Date("2024-01-15"),
      clientId: client1.id,
      conceptId: concept2.id,
      quantity: 1,
      unitPrice: 5000,
      subtotal: 5000,
      iva: 800,
      retencionISR: 533.5,
      total: 5266.5,
      amount: 5266.5,
      invoiceType: "PUE",
      paymentMethod: "Transferencia",
      paymentForm: "03",
      status: "received",
      paymentStatus: "paid",
      bankAccountId: bank2.id,
    },
  });

  console.log("✅ Regular transaction created");

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

