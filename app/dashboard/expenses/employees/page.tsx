"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Download, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  salaryPeriod: "hourly" | "weekly" | "biweekly" | "monthly";
  hireDate: string;
  status: "active" | "inactive";
};

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Juan Pérez García",
    email: "juan.perez@empresa.com",
    position: "Contador Senior",
    salary: 25000,
    salaryPeriod: "monthly",
    hireDate: "2023-01-15",
    status: "active"
  },
  {
    id: "2",
    name: "María López Hernández",
    email: "maria.lopez@empresa.com",
    position: "Auxiliar Contable",
    salary: 5000,
    salaryPeriod: "biweekly",
    hireDate: "2023-06-01",
    status: "active"
  },
  {
    id: "3",
    name: "Carlos Rodríguez Sánchez",
    email: "carlos.rodriguez@empresa.com",
    position: "Gerente Financiero",
    salary: 35000,
    salaryPeriod: "monthly",
    hireDate: "2022-08-10",
    status: "active"
  }
];

const salaryPeriods = [
  { value: "hourly", label: "Por Hora" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" }
];

const statuses = [
  { value: "active", label: "Activo", color: "bg-green-500/10 text-green-600" },
  { value: "inactive", label: "Inactivo", color: "bg-gray-500/10 text-gray-600" }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    salary: "",
    salaryPeriod: "monthly",
    hireDate: "",
    status: "active"
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      position: "",
      salary: "",
      salaryPeriod: "monthly",
      hireDate: "",
      status: "active"
    });
  };

  const handleCreate = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      position: formData.position,
      salary: parseFloat(formData.salary),
      salaryPeriod: formData.salaryPeriod as "hourly" | "weekly" | "biweekly" | "monthly",
      hireDate: formData.hireDate,
      status: formData.status as "active" | "inactive"
    };

    setEmployees(prev => [newEmployee, ...prev]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary.toString(),
      salaryPeriod: employee.salaryPeriod,
      hireDate: employee.hireDate,
      status: employee.status
    });
  };

  const handleUpdate = () => {
    if (!editingEmployee) return;

    const updatedEmployee: Employee = {
      ...editingEmployee,
      name: formData.name,
      email: formData.email,
      position: formData.position,
      salary: parseFloat(formData.salary),
      salaryPeriod: formData.salaryPeriod as "hourly" | "weekly" | "biweekly" | "monthly",
      hireDate: formData.hireDate,
      status: formData.status as "active" | "inactive"
    };

    setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? updatedEmployee : e));
    setEditingEmployee(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-500/10 text-gray-600"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const totalPayroll = filteredEmployees
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Empleados</h1>
          <p className="text-gray-400">Administra el personal y nómina de tu empresa</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Empleado</DialogTitle>
              <DialogDescription className="text-gray-400">
                Registra un nuevo empleado en el sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre completo del empleado"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="correo@empresa.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-white">Puesto</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Ej: Contador, Gerente, Auxiliar..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-white">Salario</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryPeriod" className="text-white">Periodo de Pago</Label>
                  <Select value={formData.salaryPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Periodo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {salaryPeriods.map((period) => (
                        <SelectItem key={period.value} value={period.value} className="text-white hover:bg-gray-700">
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-white">Fecha de Contratación</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                Crear Empleado
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Total Empleados</CardDescription>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredEmployees.length}</div>
            <p className="text-xs text-gray-400">
              {filteredEmployees.filter(e => e.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Nómina Total</CardDescription>
            <div className="h-5 w-5 rounded bg-green-500/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-gray-400">mensual activa</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Salario Promedio</CardDescription>
            <div className="h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(filteredEmployees.length > 0 ? totalPayroll / filteredEmployees.filter(e => e.status === 'active').length : 0)}
            </div>
            <p className="text-xs text-gray-400">por empleado activo</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, correo o puesto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">Todos los estados</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Empleados</CardTitle>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Nombre</TableHead>
                <TableHead className="text-gray-400">Correo</TableHead>
                <TableHead className="text-gray-400">Puesto</TableHead>
                <TableHead className="text-gray-400">Salario</TableHead>
                <TableHead className="text-gray-400">Fecha de Contratación</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="border-gray-700">
                  <TableCell className="text-white">{employee.name}</TableCell>
                  <TableCell className="text-gray-300">{employee.email}</TableCell>
                  <TableCell className="text-gray-300">{employee.position}</TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(employee.salary)}</TableCell>
                  <TableCell className="text-gray-300">{formatDate(employee.hireDate)}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Empleado</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica los datos del empleado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-white">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo del empleado"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-white">Correo Electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="correo@empresa.com"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position" className="text-white">Puesto</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Ej: Contador, Gerente, Auxiliar..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salary" className="text-white">Salario</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-salaryPeriod" className="text-white">Periodo de Pago</Label>
                <Select value={formData.salaryPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {salaryPeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value} className="text-white hover:bg-gray-700">
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hireDate" className="text-white">Fecha de Contratación</Label>
                <Input
                  id="edit-hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-white">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingEmployee(null)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

