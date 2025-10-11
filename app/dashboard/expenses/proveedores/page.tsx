"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Service = {
  id: string;
  name: string;
  provider: string;
  category: string;
  monthlyCost: number;
  renewalDate: string;
  status: "active" | "cancelled";
};

const mockServices: Service[] = [
  { id: "1", name: "Amazon Web Services", provider: "AWS", category: "Hosting", monthlyCost: 1200, renewalDate: "2024-02-01", status: "active" },
  { id: "2", name: "Microsoft 365", provider: "Microsoft", category: "Software", monthlyCost: 850, renewalDate: "2024-02-15", status: "active" },
  { id: "3", name: "Internet Empresarial", provider: "Telmex", category: "Telecomunicaciones", monthlyCost: 600, renewalDate: "2024-02-20", status: "active" }
];

const categories = ["Hosting", "Software", "Telecomunicaciones", "Licencias", "Mantenimiento", "Otros"];

const statuses = [
  { value: "active", label: "Activo", color: "bg-green-500/10 text-green-600" },
  { value: "cancelled", label: "Cancelado", color: "bg-red-500/10 text-red-600" }
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: "", provider: "", category: "", monthlyCost: "", renewalDate: "", status: "active" });

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || provider.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || provider.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetForm = () => setFormData({ name: "", provider: "", category: "", monthlyCost: "", renewalDate: "", status: "active" });

  const handleCreate = () => {
    setProviders(prev => [{
      id: Date.now().toString(),
      name: formData.name,
      provider: formData.provider,
      category: formData.category,
      monthlyCost: parseFloat(formData.monthlyCost),
      renewalDate: formData.renewalDate,
      status: formData.status as "active" | "cancelled"
    }, ...prev]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (provider: Service) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      provider: provider.provider,
      category: provider.category,
      monthlyCost: provider.monthlyCost.toString(),
      renewalDate: provider.renewalDate,
      status: provider.status
    });
  };

  const handleUpdate = () => {
    if (!editingProvider) return;
    setProviders(prev => prev.map(p => p.id === editingProvider.id ? {
      ...editingProvider,
      name: formData.name,
      provider: formData.provider,
      category: formData.category,
      monthlyCost: parseFloat(formData.monthlyCost),
      renewalDate: formData.renewalDate,
      status: formData.status as "active" | "cancelled"
    } : p));
    setEditingProvider(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setProviders(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return <Badge className={statusConfig?.color || "bg-gray-500/10 text-gray-600"}>{statusConfig?.label || status}</Badge>;
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX');

  const totalMonthlyCost = filteredProviders.filter(s => s.status === 'active').reduce((sum, s) => sum + s.monthlyCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Servicios</h1>
          <p className="text-gray-400">Administra suscripciones y servicios recurrentes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Servicio</DialogTitle>
              <DialogDescription className="text-gray-400">Registra una nueva suscripción o servicio recurrente.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nombre del Servicio</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del servicio" className="bg-gray-800 border-gray-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider" className="text-white">Proveedor</Label>
                  <Input id="provider" value={formData.provider} onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="Nombre del proveedor" className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {categories.map((category) => <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">{category}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyCost" className="text-white">Costo Mensual</Label>
                  <Input id="monthlyCost" type="number" step="0.01" value={formData.monthlyCost} onChange={(e) => setFormData(prev => ({ ...prev, monthlyCost: e.target.value }))}
                    placeholder="0.00" className="bg-gray-800 border-gray-600 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewalDate" className="text-white">Fecha de Renovación</Label>
                <Input id="renewalDate" type="date" value={formData.renewalDate} onChange={(e) => setFormData(prev => ({ ...prev, renewalDate: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">Crear Servicio</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Servicios Activos</CardDescription>
            <Zap className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredProviders.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-gray-400">proveedores activos</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Costo Mensual Total</CardDescription>
            <div className="h-5 w-5 rounded bg-green-500/10 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-green-500"></div></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyCost)}</div>
            <p className="text-xs text-gray-400">pagos recurrentes</p>
          </CardContent>
        </Card>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Costo Anual Proyectado</CardDescription>
            <div className="h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-purple-500"></div></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalMonthlyCost * 12)}</div>
            <p className="text-xs text-gray-400">estimado anual</p>
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
                <Input placeholder="Buscar por nombre o proveedor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400" />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Todas las categorías" /></SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">Todas las categorías</SelectItem>
                {categories.map((category) => <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">{category}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Todos los estados" /></SelectTrigger>
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
            <CardTitle className="text-white">Lista de Servicios</CardTitle>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700"><Download className="mr-2 h-4 w-4" />Exportar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Servicio</TableHead>
                <TableHead className="text-gray-400">Proveedor</TableHead>
                <TableHead className="text-gray-400">Categoría</TableHead>
                <TableHead className="text-gray-400">Costo Mensual</TableHead>
                <TableHead className="text-gray-400">Renovación</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id} className="border-gray-700">
                  <TableCell className="text-white">{provider.name}</TableCell>
                  <TableCell className="text-gray-300">{provider.provider}</TableCell>
                  <TableCell className="text-gray-300">{provider.category}</TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(provider.monthlyCost)}</TableCell>
                  <TableCell className="text-gray-300">{formatDate(provider.renewalDate)}</TableCell>
                  <TableCell>{getStatusBadge(provider.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(provider)} className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(provider.id)} className="text-red-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingProvider} onOpenChange={() => setEditingProvider(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Servicio</DialogTitle>
            <DialogDescription className="text-gray-400">Modifica los datos del servicio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-white">Nombre del Servicio</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-provider" className="text-white">Proveedor</Label>
                <Input id="edit-provider" value={formData.provider} onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-white">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white"><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((category) => <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">{category}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-monthlyCost" className="text-white">Costo Mensual</Label>
                <Input id="edit-monthlyCost" type="number" step="0.01" value={formData.monthlyCost} onChange={(e) => setFormData(prev => ({ ...prev, monthlyCost: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-renewalDate" className="text-white">Fecha de Renovación</Label>
                <Input id="edit-renewalDate" type="date" value={formData.renewalDate} onChange={(e) => setFormData(prev => ({ ...prev, renewalDate: e.target.value }))} className="bg-gray-800 border-gray-600 text-white" />
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingService(null)} className="border-gray-600 text-gray-300 hover:bg-gray-700">Cancelar</Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">Actualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

