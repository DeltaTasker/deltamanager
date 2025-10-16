"use server";

import { getEmployees as getEmployeesQuery, type EmployeeWithStats } from "@/modules/employees/server/queries";
import { createEmployee as createEmployeeAction } from "@/modules/employees/actions/create-employee";
import { updateEmployee as updateEmployeeAction } from "@/modules/employees/actions/update-employee";
import { deleteEmployee as deleteEmployeeAction } from "@/modules/employees/actions/delete-employee";

export type CreateEmployeeInput = {
  companyId: string;
  name: string;
  lastName: string;
  rfc?: string;
  curp?: string;
  nss?: string;
  email?: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  salary?: number;
  paymentFreq?: string;
  bankAccount?: string;
  clabe?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  notes?: string;
};

export type UpdateEmployeeInput = {
  id: string;
  name?: string;
  lastName?: string;
  rfc?: string;
  curp?: string;
  nss?: string;
  email?: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  salary?: number;
  paymentFreq?: string;
  bankAccount?: string;
  clabe?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  isActive?: boolean;
  notes?: string;
};

export type SerializedEmployee = Omit<EmployeeWithStats, 'salary' | '_count'> & {
  salary: number | null;
  _count?: { transactions: number; payrolls: number };
};

export async function loadEmployees(companyId: string): Promise<SerializedEmployee[]> {
  const employees = await getEmployeesQuery(companyId);
  return employees.map(e => ({
    ...e,
    salary: e.salary || null,
    _count: e._count,
  }));
}

export { createEmployeeAction as createEmployee, updateEmployeeAction as updateEmployee, deleteEmployeeAction as deleteEmployee };

