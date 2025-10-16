import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos de prueba...");

  // 1. Crear compañía de prueba
  const company = await prisma.company.upsert({
    where: { id: "temp-company-id" },
    update: {},
    create: {
      id: "temp-company-id",
      name: "Empresa Demo",
      rfc: "XAXX010101000",
      country: "MX",
      timezone: "America/Mexico_City",
    },
  });

  console.log("✅ Compañía creada:", company.name);

  // 2. Crear clientes de prueba
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: "client-1" },
      update: {},
      create: {
        id: "client-1",
        companyId: company.id,
        name: "Juan Pérez",
        company: "Comercializadora XYZ",
        rfc: "PEXJ850101ABC",
        email: "juan@xyz.com",
        phone: "5551234567",
        regimenFiscal: "612",
        usoCFDI: "G03",
        isActive: true,
      },
    }),
    prisma.client.upsert({
      where: { id: "client-2" },
      update: {},
      create: {
        id: "client-2",
        companyId: company.id,
        name: "María García",
        company: "Servicios Tech SA",
        rfc: "GARM900202DEF",
        email: "maria@tech.com",
        phone: "5559876543",
        regimenFiscal: "601",
        usoCFDI: "P01",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Clientes creados:", clients.length);

  // 3. Crear conceptos de prueba
  const concepts = await Promise.all([
    prisma.concept.upsert({
      where: { id: "concept-1" },
      update: {},
      create: {
        id: "concept-1",
        companyId: company.id,
        name: "Consultoría de Software",
        description: "Servicios de desarrollo y consultoría",
        defaultAmount: 15000,
        claveProdServ: "81112000",
        claveUnidad: "E48",
        objetoImp: "02",
        tasaIVA: 16,
        tasaRetencionISR: 0,
        tasaRetencionIVA: 0,
        ivaIncluded: false,
        isActive: true,
      },
    }),
    prisma.concept.upsert({
      where: { id: "concept-2" },
      update: {},
      create: {
        id: "concept-2",
        companyId: company.id,
        name: "Diseño Gráfico",
        description: "Servicios de diseño y branding",
        defaultAmount: 8000,
        claveProdServ: "81111600",
        claveUnidad: "E48",
        objetoImp: "02",
        tasaIVA: 16,
        tasaRetencionISR: 10,
        tasaRetencionIVA: 10.66,
        ivaIncluded: true,
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Conceptos creados:", concepts.length);

  // 4. Crear proveedores de prueba
  const providers = await Promise.all([
    prisma.provider.upsert({
      where: { id: "provider-1" },
      update: {},
      create: {
        id: "provider-1",
        companyId: company.id,
        name: "Amazon Web Services",
        company: "AWS",
        rfc: "AWS8501010001",
        email: "billing@aws.com",
        isForeign: false,
        paymentType: "fixed",
        paymentAmount: 1500,
        paymentFrequency: "monthly",
        isActive: true,
      },
    }),
    prisma.provider.upsert({
      where: { id: "provider-2" },
      update: {},
      create: {
        id: "provider-2",
        companyId: company.id,
        name: "Google Cloud",
        company: "GCP",
        isForeign: true,
        paymentType: "variable",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Proveedores creados:", providers.length);

  // 5. Crear empleados de prueba
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { id: "employee-1" },
      update: {},
      create: {
        id: "employee-1",
        companyId: company.id,
        name: "Carlos",
        lastName: "Ramírez López",
        fullName: "Carlos Ramírez López",
        rfc: "RALC900101ABC",
        curp: "RALC900101HDFRRL01",
        nss: "12345678901",
        email: "carlos@empresa.com",
        phone: "5551112222",
        position: "Desarrollador Senior",
        department: "Tecnología",
        salary: 25000,
        paymentFreq: "biweekly",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Empleados creados:", employees.length);

  // 6. Crear cuentas bancarias
  const bankAccounts = await Promise.all([
    prisma.bankAccount.upsert({
      where: { id: "bank-1" },
      update: {},
      create: {
        id: "bank-1",
        companyId: company.id,
        name: "BBVA Empresarial",
        accountType: "bank",
        last4: "1234",
        bank: "BBVA",
        currency: "MXN",
        isActive: true,
      },
    }),
    prisma.bankAccount.upsert({
      where: { id: "bank-2" },
      update: {},
      create: {
        id: "bank-2",
        companyId: company.id,
        name: "Santander Negocios",
        accountType: "bank",
        last4: "5678",
        bank: "Santander",
        currency: "MXN",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Cuentas bancarias creadas:", bankAccounts.length);

  // 7. Crear transacciones de ingreso
  const incomeTransactions = await Promise.all([
    prisma.transaction.create({
      data: {
        companyId: company.id,
        type: "income",
        date: new Date("2024-01-15"),
        clientId: clients[0].id,
        conceptId: concepts[0].id,
        description: "Consultoría enero 2024",
        quantity: 1,
        unitPrice: new Prisma.Decimal(15000),
        subtotal: new Prisma.Decimal(15000),
        iva: new Prisma.Decimal(2400),
        total: new Prisma.Decimal(17400),
        amount: new Prisma.Decimal(17400),
        invoiceType: "PUE",
        paymentMethod: "Transferencia",
        paymentForm: "03",
        status: "received",
        paymentStatus: "paid",
        bankAccountId: bankAccounts[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        companyId: company.id,
        type: "income",
        date: new Date("2024-01-20"),
        clientId: clients[1].id,
        conceptId: concepts[1].id,
        description: "Diseño logo corporativo",
        quantity: 1,
        unitPrice: new Prisma.Decimal(8000),
        subtotal: new Prisma.Decimal(6896.55),
        iva: new Prisma.Decimal(1103.45),
        total: new Prisma.Decimal(8000),
        amount: new Prisma.Decimal(8000),
        invoiceType: "PUE",
        paymentMethod: "Transferencia",
        paymentForm: "03",
        status: "pending",
        paymentStatus: "pending",
        bankAccountId: bankAccounts[1].id,
      },
    }),
  ]);

  console.log("✅ Transacciones de ingreso creadas:", incomeTransactions.length);

  // 8. Crear transacciones de gasto
  const expenseTransactions = await Promise.all([
    prisma.transaction.create({
      data: {
        companyId: company.id,
        type: "expense",
        date: new Date("2024-01-10"),
        providerId: providers[0].id,
        description: "Hosting mensual AWS",
        amount: new Prisma.Decimal(1500),
        total: new Prisma.Decimal(1500),
        status: "paid",
        paymentStatus: "paid",
        bankAccountId: bankAccounts[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        companyId: company.id,
        type: "expense",
        date: new Date("2024-01-31"),
        employeeId: employees[0].id,
        description: "Nómina quincena 2",
        amount: new Prisma.Decimal(12500),
        total: new Prisma.Decimal(12500),
        status: "paid",
        paymentStatus: "paid",
        bankAccountId: bankAccounts[1].id,
      },
    }),
  ]);

  console.log("✅ Transacciones de gasto creadas:", expenseTransactions.length);

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log(`- Compañía: ${company.name}`);
  console.log(`- Clientes: ${clients.length}`);
  console.log(`- Conceptos: ${concepts.length}`);
  console.log(`- Proveedores: ${providers.length}`);
  console.log(`- Empleados: ${employees.length}`);
  console.log(`- Cuentas bancarias: ${bankAccounts.length}`);
  console.log(`- Ingresos: ${incomeTransactions.length}`);
  console.log(`- Gastos: ${expenseTransactions.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

