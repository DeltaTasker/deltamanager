"use client";

import { useState } from "react";
import { Plus, Search, Check, X, Trash2, ChevronDown, ChevronUp, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Types
type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  salaryPeriod: "hourly" | "weekly" | "biweekly" | "monthly";
  startDate: string;
  status: "active" | "inactive" | "on_leave";
  rfc?: string;
  curp?: string;
  nss?: string; // Número de Seguro Social
  address?: string;
};

// Mock Data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Ana Martínez Torres",
    email: "ana.martinez@deltatasker.com",
    phone: "+52 55 1234 5678",
    position: "CEO & Co-Founder",
    department: "Dirección General",
    salary: 80000,
    salaryPeriod: "monthly",
    startDate: "2022-01-01",
    status: "active",
    rfc: "MATA901205KL8",
    curp: "MATA901205MDFRRN09",
    nss: "12345678901",
    address: "Av. Reforma 222, CDMX"
  },
  {
    id: "2",
    name: "Luis Hernández Ruiz",
    email: "luis.hernandez@deltatasker.com",
    phone: "+52 55 9876 5432",
    position: "Director de Automatización",
    department: "Automatización e IA",
    salary: 60000,
    salaryPeriod: "monthly",
    startDate: "2022-03-15",
    status: "active",
    rfc: "HERL880420RT4",
    curp: "HERL880420HDFRNS05",
    nss: "98765432109"
  },
  {
    id: "3",
    name: "Carlos Sánchez López",
    email: "carlos.sanchez@deltatasker.com",
    phone: "+52 55 5555 1111",
    position: "Ingeniero de Integración Senior",
    department: "Integración de Sistemas",
    salary: 45000,
    salaryPeriod: "monthly",
    startDate: "2023-01-10",
    status: "active",
    rfc: "SALC920815A45",
    curp: "SALC920815HDFRPN02",
    nss: "11223344556"
  },
  {
    id: "4",
    name: "Patricia Gómez Morales",
    email: "patricia.gomez@deltatasker.com",
    phone: "+52 55 4444 2222",
    position: "Especialista en Soporte Técnico",
    department: "Soporte Técnico",
    salary: 300,
    salaryPeriod: "hourly",
    startDate: "2023-06-01",
    status: "active",
    rfc: "GOMP950622B12",
    curp: "GOMP950622MDFRMT08"
  },
  {
    id: "5",
    name: "Roberto Díaz Fernández",
    email: "roberto.diaz@deltatasker.com",
    phone: "+52 55 3333 7777",
    position: "Coordinador de Operaciones",
    department: "Operaciones",
    salary: 35000,
    salaryPeriod: "monthly",
    startDate: "2022-09-01",
    status: "active",
    rfc: "DIFR870310RT4",
    curp: "DIFR870310HDFFBN04",
    nss: "22334455667"
  }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: 0,
    salaryPeriod: "monthly",
    startDate: new Date().toISOString().split('T')[0],
    status: "active",
    rfc: "",
    curp: "",
    nss: "",
    address: ""
  });

  const departments = [
    "Dirección General",
    "Automatización e IA",
    "Desarrollo de Software",
    "Integración de Sistemas",
    "Soporte Técnico",
    "Operaciones",
    "Administración",
    "Recursos Humanos",
    "Marketing y Ventas",
    "Finanzas"
  ];

  const salaryPeriods = [
    { value: "hourly", label: "Por Hora" },
    { value: "weekly", label: "Semanal" },
    { value: "biweekly", label: "Quincenal" },
    { value: "monthly", label: "Mensual" }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      salary: 0,
      salaryPeriod: "monthly",
      startDate: new Date().toISOString().split('T')[0],
      status: "active",
      rfc: "",
      curp: "",
      nss: "",
      address: ""
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.email || !formData.position) {
      alert("Por favor completa los campos obligatorios: Nombre, Email, Puesto");
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      position: formData.position,
      department: formData.department || "Sin Departamento",
      salary: formData.salary || 0,
      salaryPeriod: formData.salaryPeriod || "monthly",
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      status: formData.status || "active",
      rfc: formData.rfc,
      curp: formData.curp,
      nss: formData.nss,
      address: formData.address
    };

    setEmployees(prev => [newEmployee, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData(employee);
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.email || !formData.position) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setEmployees(prev => prev.map(emp => 
      emp.id === editingId ? { ...emp, ...formData } as Employee : emp
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX');

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Activo", className: "bg-green-500/20 text-green-500" },
      inactive: { label: "Inactivo", className: "bg-gray-500/20 text-gray-500" },
      on_leave: { label: "En permiso", className: "bg-yellow-500/20 text-yellow-500" }
    }[status] || { label: status, className: "bg-gray-500/20 text-gray-500" };
    
    return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
  };

  const getSalaryPeriodLabel = (period: string) => {
    const labels = {
      hourly: "Por Hora",
      weekly: "Semanal",
      biweekly: "Quincenal",
      monthly: "Mensual"
    };
    return labels[period as keyof typeof labels] || period;
  };

  const activeEmployees = employees.filter(e => e.status === "active").length;
  const totalPayroll = employees
    .filter(e => e.status === "active")
    .reduce((sum, e) => {
      // Normalize to monthly for total calculation
      const monthlySalary = e.salaryPeriod === "hourly" ? e.salary * 160 : 
                           e.salaryPeriod === "weekly" ? e.salary * 4 :
                           e.salaryPeriod === "biweekly" ? e.salary * 2 : e.salary;
      return sum + monthlySalary;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Empleados</h1>
          <p className="text-sm text-gray-400">Gestión de personal y nómina</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Empleado</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Empleados</CardTitle>
            <UserCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{employees.length}</div>
            <p className="text-xs text-gray-500">{activeEmployees} activos</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Nómina Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-gray-500">Estimado</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(employees.map(e => e.department)).size}</div>
            <p className="text-xs text-gray-500">Áreas activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, puesto o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-white">{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                <SelectItem value="active" className="text-white">Activo</SelectItem>
                <SelectItem value="inactive" className="text-white">Inactivo</SelectItem>
                <SelectItem value="on_leave" className="text-white">En permiso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lista de Empleados</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredEmployees.length} empleado(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[200px]">Nombre</TableHead>
                  <TableHead className="text-gray-400 w-[180px]">Puesto</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Departamento</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Email</TableHead>
                  <TableHead className="text-gray-400 w-[130px]">Teléfono</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Salario</TableHead>
                  <TableHead className="text-gray-400 w-[110px]">Periodo</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">RFC</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-green-500/5">
                    <TableCell className="p-2">
                      <Input
                        placeholder="Nombre completo *"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="Puesto *"
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                        <SelectTrigger className="bg-gray-800 border-green-500/30 text-white text-sm h-8">
                          <SelectValue placeholder="Departamento" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept} className="text-white text-sm">{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="email"
                        placeholder="email@empresa.com *"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="+52 55 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Salario"
                        value={formData.salary}
                        onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.salaryPeriod} onValueChange={(value: any) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}>
                        <SelectTrigger className="bg-gray-800 border-green-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {salaryPeriods.map((period) => (
                            <SelectItem key={period.value} value={period.value} className="text-white text-sm">{period.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="RFC"
                        value={formData.rfc}
                        onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                        className="bg-gray-800 border-green-500/30 text-white text-sm h-8 uppercase"
                        maxLength={13}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-gray-800 border-green-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="active" className="text-white text-sm">Activo</SelectItem>
                          <SelectItem value="inactive" className="text-white text-sm">Inactivo</SelectItem>
                          <SelectItem value="on_leave" className="text-white text-sm">En permiso</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleCreate} className="h-8 bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowNewForm(false); resetForm(); }} className="h-8 text-red-400 hover:bg-red-500/10">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Employees */}
                {filteredEmployees.map((employee) => {
                  const isEditing = editingId === employee.id;
                  
                  return (
                    <TableRow key={employee.id} className={`border-white/10 hover:bg-white/5 ${isEditing ? 'bg-blue-500/5' : ''}`}>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <div>
                            <div className="text-white text-sm font-medium">{employee.name}</div>
                            <div className="text-gray-400 text-xs">Desde {formatDate(employee.startDate)}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.position}
                            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-300 text-sm">{employee.position}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept} className="text-white text-sm">{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="text-xs">{employee.department}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-300 text-sm">{employee.email}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-300 text-sm">{employee.phone}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.salary}
                            onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) || 0 }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">{formatCurrency(employee.salary)}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Select value={formData.salaryPeriod} onValueChange={(value: any) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {salaryPeriods.map((period) => (
                                <SelectItem key={period.value} value={period.value} className="text-white text-sm">{period.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">{getSalaryPeriodLabel(employee.salaryPeriod)}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.rfc}
                            onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8 uppercase"
                            maxLength={13}
                          />
                        ) : (
                          <span className="text-gray-300 text-sm font-mono">{employee.rfc || "-"}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={handleUpdate} className="h-8 bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); resetForm(); }} className="h-8 text-gray-400 hover:bg-gray-700">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(employee)}
                              className="h-8 text-blue-400 hover:bg-blue-500/10"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                              className="h-8 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
