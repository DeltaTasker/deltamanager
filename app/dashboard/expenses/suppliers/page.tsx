"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Download, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  totalExpenses: number;
  status: "active" | "inactive";
};

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Amazon Web Services", contact: "Juan Pérez", email: "aws@example.com", phone: "555-0001", totalExpenses: 15000, status: "active" },
  { id: "2", name: "Office Depot", contact: "María López", email: "od@example.com", phone: "555-0002", totalExpenses: 8500, status: "active" },
  { id: "3", name: "Proveedor Servicios TI", contact: "Carlos García", email: "it@example.com", phone: "555-0003", totalExpenses: 12000, status: "active" }
];

const statuses = [
  { value: "active", label: "Activo", color: "bg-green-500/10 text-green-600" },
  { value: "inactive", label: "Inactivo", color: "bg-gray-500/10 text-gray-600" }
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({ name: "", contact: "", email: "", phone: "", status: "active" });

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => setFormData({ name: "", contact: "", email: "", phone: "", status: "active" });

  const handleCreate = () => {
    setSuppliers(prev => [{ id: Date.now().toString(), ...formData, totalExpenses: 0, status: formData.status as "active" | "inactive" }, ...prev]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ name: supplier.name, contact: supplier.contact, email: supplier.email, phone: supplier.phone, status: supplier.status });
  };

  const handleUpdate = () => {
    if (!editingSupplier) return;
    setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...editingSupplier, ...formData, status: formData.status as "active" | "inactive" } : s));
    setEditingSupplier(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return <Badge className={statusConfig?.color || "bg-gray-500/10 text-gray-600"}>{statusConfig?.label || status}</Badge>;
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);

  const totalExpenses = filteredSuppliers.reduce((sum, s) => sum + s.totalExpenses, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Proveedores</h1>
          <p className="text-gray-400">Administra tus proveedores y relaciones comerciales</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Proveedor</DialogTitle>
              <DialogDescription className="text-gray-400">Registra un nuevo proveedor en el sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre/Empresa</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del proveedor" className="bg-gray-800 border-gray-600 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-white">Contacto</Label>
                  <Input id="contact" value={formData.contact} onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Nombre del contacto" className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Teléfono</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="555-0000" className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="correo@proveedor.com" className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">Crear Proveedor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Total Proveedores</CardDescription>
            <Building className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredSuppliers.length}</div>
            <p className="text-xs text-gray-400">{filteredSuppliers.filter(s => s.status === 'active').length} activos</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Gastos Totales</CardDescription>
            <div className="h-5 w-5 rounded bg-green-500/10 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-green-500"></div></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-400">acumulado</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Gasto Promedio</CardDescription>
            <div className="h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-purple-500"></div></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(filteredSuppliers.length > 0 ? totalExpenses / filteredSuppliers.length : 0)}</div>
            <p className="text-xs text-gray-400">por proveedor</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-white">Filtros y Búsqueda</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Buscar por nombre, contacto o correo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400" />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">Todos los estados</SelectItem>
                {statuses.map((status) => <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">{status.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Proveedores</CardTitle>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700"><Download className="mr-2 h-4 w-4" />Exportar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Nombre</TableHead>
                <TableHead className="text-gray-400">Contacto</TableHead>
                <TableHead className="text-gray-400">Correo</TableHead>
                <TableHead className="text-gray-400">Teléfono</TableHead>
                <TableHead className="text-gray-400">Total Gastos</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-gray-700">
                  <TableCell className="text-white">{supplier.name}</TableCell>
                  <TableCell className="text-gray-300">{supplier.contact}</TableCell>
                  <TableCell className="text-gray-300">{supplier.email}</TableCell>
                  <TableCell className="text-gray-300">{supplier.phone}</TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(supplier.totalExpenses)}</TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)} className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(supplier.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Proveedor</DialogTitle>
            <DialogDescription className="text-gray-400">Modifica los datos del proveedor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-white">Nombre/Empresa</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact" className="text-white">Contacto</Label>
                <Input id="edit-contact" value={formData.contact} onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-white">Teléfono</Label>
                <Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-white">Correo Electrónico</Label>
              <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-white">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {statuses.map((status) => <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingSupplier(null)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

