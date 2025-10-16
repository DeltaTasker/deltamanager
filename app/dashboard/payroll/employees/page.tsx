"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, Briefcase } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import {
  loadEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type SerializedEmployee,
} from "@/app/actions/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<SerializedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    rfc: "",
    curp: "",
    nss: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    department: "",
    hireDate: "",
    salary: "",
    paymentFreq: "biweekly",
    bankAccount: "",
    clabe: "",
    regimenFiscal: "",
    codigoPostal: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      const data = await loadEmployees(companyId);
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
      toast.error("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const result = await createEmployee({
        companyId,
        name: formData.name,
        lastName: formData.lastName,
        rfc: formData.rfc || undefined,
        curp: formData.curp || undefined,
        nss: formData.nss || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        position: formData.position || undefined,
        department: formData.department || undefined,
        hireDate: formData.hireDate || undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        paymentFreq: formData.paymentFreq,
        bankAccount: formData.bankAccount || undefined,
        clabe: formData.clabe || undefined,
        regimenFiscal: formData.regimenFiscal || undefined,
        codigoPostal: formData.codigoPostal || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast.success("Empleado creado exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear empleado");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Error al crear empleado");
    }
  };

  const handleStartEdit = (employee: SerializedEmployee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      lastName: employee.lastName,
      rfc: employee.rfc || "",
      curp: employee.curp || "",
      nss: employee.nss || "",
      email: employee.email || "",
      phone: employee.phone || "",
      address: employee.address || "",
      position: employee.position || "",
      department: employee.department || "",
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : "",
      salary: employee.salary?.toString() || "",
      paymentFreq: employee.paymentFreq,
      bankAccount: employee.bankAccount || "",
      clabe: employee.clabe || "",
      regimenFiscal: employee.regimenFiscal || "",
      codigoPostal: employee.codigoPostal || "",
      notes: employee.notes || "",
    });
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateEmployee({
        id: editingId,
        name: formData.name,
        lastName: formData.lastName,
        rfc: formData.rfc || undefined,
        curp: formData.curp || undefined,
        nss: formData.nss || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        position: formData.position || undefined,
        department: formData.department || undefined,
        hireDate: formData.hireDate || undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        paymentFreq: formData.paymentFreq,
        bankAccount: formData.bankAccount || undefined,
        clabe: formData.clabe || undefined,
        regimenFiscal: formData.regimenFiscal || undefined,
        codigoPostal: formData.codigoPostal || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast.success("Empleado actualizado exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar empleado");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Error al actualizar empleado");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteEmployee(deleteTargetId);

      if (result.success) {
        toast.success("Empleado desactivado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al desactivar empleado");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error al desactivar empleado");
    } finally {
      setDeleteTargetId(null);
      setDeleteConfirmOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lastName: "",
      rfc: "",
      curp: "",
      nss: "",
      email: "",
      phone: "",
      address: "",
      position: "",
      department: "",
      hireDate: "",
      salary: "",
      paymentFreq: "biweekly",
      bankAccount: "",
      clabe: "",
      regimenFiscal: "",
      codigoPostal: "",
      notes: "",
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatSalary = (salary: number | null) => {
    if (!salary) return "-";
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(salary);
  };

  const formatFrequency = (freq: string) => {
    const freqs: Record<string, string> = {
      weekly: "Semanal",
      biweekly: "Quincenal",
      monthly: "Mensual"
    };
    return freqs[freq] || freq;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Empleados</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu equipo de trabajo y nómina
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Empleado" : "Nuevo Empleado"}</CardTitle>
            <CardDescription>
              {editingId ? "Actualiza la información del empleado." : "Agrega un nuevo empleado a tu nómina."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); editingId ? handleSaveEdit() : handleCreate(); }} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Personal</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellidos *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Pérez García"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input
                      id="rfc"
                      value={formData.rfc}
                      onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                      placeholder="PEPJ850101XYZ"
                      maxLength={13}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="curp">CURP</Label>
                    <Input
                      id="curp"
                      value={formData.curp}
                      onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                      placeholder="PEPJ850101HDFRRL09"
                      maxLength={18}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nss">NSS</Label>
                    <Input
                      id="nss"
                      value={formData.nss}
                      onChange={(e) => setFormData({ ...formData, nss: e.target.value })}
                      placeholder="12345678901"
                      maxLength={11}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="juan.perez@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(55) 1234-5678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, número, colonia, ciudad, estado"
                    rows={2}
                  />
                </div>
              </div>

              {/* Employment Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Laboral</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="position">Puesto</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Desarrollador"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Tecnología"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Fecha de Contratación</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salario</Label>
                    <Input
                      id="salary"
                      type="number"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="15000.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentFreq">Frecuencia de Pago</Label>
                    <Select value={formData.paymentFreq} onValueChange={(value) => setFormData({ ...formData, paymentFreq: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quincenal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Banco</Label>
                    <Input
                      id="bankAccount"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      placeholder="BBVA, Santander, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clabe">CLABE Interbancaria</Label>
                    <Input
                      id="clabe"
                      value={formData.clabe}
                      onChange={(e) => setFormData({ ...formData, clabe: e.target.value })}
                      placeholder="012345678901234567"
                      maxLength={18}
                    />
                  </div>
                </div>
              </div>

              {/* Tax Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información Fiscal</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="regimenFiscal">Régimen Fiscal SAT</Label>
                    <Input
                      id="regimenFiscal"
                      value={formData.regimenFiscal}
                      onChange={(e) => setFormData({ ...formData, regimenFiscal: e.target.value })}
                      placeholder="605 - Sueldos y Salarios"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      placeholder="01000"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales sobre el empleado"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Guardar Cambios" : "Crear Empleado"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Empleados Activos ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Cargando empleados...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No hay empleados registrados que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>RFC</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Salario</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {employee.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          {employee.position || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{employee.department || "-"}</TableCell>
                      <TableCell>
                        <code className="text-xs">{employee.rfc || "-"}</code>
                      </TableCell>
                      <TableCell className="text-sm">{employee.email || "-"}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatSalary(employee.salary)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatFrequency(employee.paymentFreq)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Desactivar Empleado"
        description="¿Estás seguro de que deseas desactivar este empleado? No se eliminará pero dejará de aparecer en la lista activa."
        confirmText="Desactivar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}

