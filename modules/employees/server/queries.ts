import { prisma } from "@/lib/prisma";
import type { Employee } from "@prisma/client";

export type EmployeeWithStats = Employee & {
  _count: {
    transactions: number;
    payrolls: number;
  };
};

export async function getEmployees(companyId: string): Promise<EmployeeWithStats[]> {
  return prisma.employee.findMany({
    where: { companyId, isActive: true },
    include: {
      _count: {
        select: { 
          transactions: true,
          payrolls: true,
        },
      },
    },
    orderBy: { fullName: "asc" },
  });
}

export async function getEmployeeById(employeeId: string, companyId: string): Promise<EmployeeWithStats | null> {
  return prisma.employee.findUnique({
    where: { id: employeeId, companyId },
    include: {
      _count: {
        select: { 
          transactions: true,
          payrolls: true,
        },
      },
    },
  });
}

