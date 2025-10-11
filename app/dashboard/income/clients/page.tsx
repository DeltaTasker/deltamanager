"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Mail, Phone, Building } from "lucide-react";

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

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalInvoiced: number;
  status: "active" | "inactive";
};

const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@empresaabc.com",
    phone: "+52 55 1234 5678",
    company: "Empresa ABC S.A.",
    totalInvoiced: 125000,
    status: "active"
  },
  {
    id: "2",
    name: "María González",
    email: "maria@techsolutions.com",
    phone: "+52 55 8765 4321",
    company: "Tech Solutions Inc.",
    totalInvoiced: 250000,
    status: "active"
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@corporativoxyz.com",
    phone: "+52 55 9876 5432",
    company: "Corporativo XYZ",
    totalInvoiced: 85000,
    status: "inactive"
  }
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active"
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "active"
    });
  };

  const handleCreate = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      totalInvoiced: 0,
      status: formData.status as "active" | "inactive"
    };
    setClients(prev => [newClient, ...prev]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status
    });
  };

  const handleUpdate = () => {
    if (!editingClient) return;
    const updatedClient: Client = {
      ...editingClient,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      status: formData.status as "active" | "inactive"
    };
    setClients(prev => prev.map(c => c.id === editingClient.id ? updatedClient : c));
    setEditingClient(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-sm text-gray-400">Gestiona tu cartera de clientes</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Cliente</DialogTitle>
              <DialogDescription className="text-gray-400">
                Agrega un nuevo cliente a tu cartera.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Empresa ABC S.A."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+52 55 1234 5678"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="active" className="text-white hover:bg-gray-700">Activo</SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
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
                Crear Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{clients.length}</div>
            <p className="text-xs text-green-500">
              {clients.filter(c => c.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Facturación Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(clients.reduce((sum, c) => sum + c.totalInvoiced, 0))}
            </div>
            <p className="text-xs text-gray-500">Acumulado histórico</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Promedio por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(clients.reduce((sum, c) => sum + c.totalInvoiced, 0) / (clients.length || 1))}
            </div>
            <p className="text-xs text-gray-500">Facturación media</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, empresa o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lista de Clientes</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredClients.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-400">Cliente</TableHead>
                <TableHead className="text-gray-400">Contacto</TableHead>
                <TableHead className="text-gray-400">Empresa</TableHead>
                <TableHead className="text-gray-400">Total Facturado</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="border-white/10">
                  <TableCell className="text-white font-medium">{client.name}</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-400" />
                      {client.company}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    {formatCurrency(client.totalInvoiced)}
                  </TableCell>
                  <TableCell>
                    <Badge className={client.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(client)}
                        className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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
      <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Cliente</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica los datos del cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-white">Nombre Completo</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Juan Pérez"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company" className="text-white">Empresa</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Empresa ABC S.A."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="edit-phone" className="text-white">Teléfono</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+52 55 1234 5678"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-white">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="active" className="text-white hover:bg-gray-700">Activo</SelectItem>
                  <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingClient(null)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              Actualizar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
