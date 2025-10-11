"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, Search, Edit, Trash2, Download, Filter } from "lucide-react";

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

type IncomeTransaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  clientName?: string;
  invoiceNumber?: string;
  status: "pending" | "received" | "cancelled";
};

// Datos de ejemplo para mostrar funcionalidad
const mockIncomeData: IncomeTransaction[] = [
  {
    id: "1",
    description: "Venta de servicios contables",
    amount: 15000,
    date: "2024-01-15",
    category: "Servicios Profesionales",
    clientName: "Empresa ABC S.A.",
    invoiceNumber: "FAC-2024-001",
    status: "received"
  },
  {
    id: "2",
    description: "Consultoría financiera",
    amount: 25000,
    date: "2024-01-20",
    category: "Consultoría",
    clientName: "Tech Solutions Inc.",
    invoiceNumber: "FAC-2024-002",
    status: "received"
  },
  {
    id: "3",
    description: "Auditoría financiera",
    amount: 35000,
    date: "2024-01-25",
    category: "Auditoría",
    clientName: "Corporativo XYZ",
    invoiceNumber: "FAC-2024-003",
    status: "pending"
  },
  {
    id: "4",
    description: "Servicios de nómina",
    amount: 8000,
    date: "2024-01-28",
    category: "Servicios Profesionales",
    clientName: "Startup Innovadora",
    invoiceNumber: "FAC-2024-004",
    status: "pending"
  }
];

const categories = [
  "Servicios Profesionales",
  "Consultoría",
  "Auditoría",
  "Asesoría Fiscal",
  "Contabilidad",
  "Otros"
];

const statuses = [
  { value: "pending", label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "received", label: "Cobrado", color: "bg-green-500/10 text-green-600" },
  { value: "cancelled", label: "Cancelado", color: "bg-red-500/10 text-red-600" }
];

export default function IncomePage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<IncomeTransaction[]>(mockIncomeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<IncomeTransaction | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    clientName: "",
    invoiceNumber: "",
    status: "pending"
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      date: "",
      category: "",
      clientName: "",
      invoiceNumber: "",
      status: "pending"
    });
  };

  const handleCreate = () => {
    const newTransaction: IncomeTransaction = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      clientName: formData.clientName,
      invoiceNumber: formData.invoiceNumber,
      status: formData.status as "pending" | "received" | "cancelled"
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (transaction: IncomeTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category,
      clientName: transaction.clientName || "",
      invoiceNumber: transaction.invoiceNumber || "",
      status: transaction.status
    });
  };

  const handleUpdate = () => {
    if (!editingTransaction) return;

    const updatedTransaction: IncomeTransaction = {
      ...editingTransaction,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      clientName: formData.clientName,
      invoiceNumber: formData.invoiceNumber,
      status: formData.status as "pending" | "received" | "cancelled"
    };

    setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
    setEditingTransaction(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este ingreso?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
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

  const totalIncome = filteredTransactions
    .filter(t => t.status === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Ingresos</h1>
          <p className="text-gray-400">Administra y registra todos los ingresos de tu empresa</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ingreso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Nuevo Registro de Ingreso</DialogTitle>
              <DialogDescription className="text-gray-400">
                Registra un nuevo ingreso o cobro recibido.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del ingreso"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Monto</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-white">Cliente</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Nombre del cliente"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber" className="text-white">Número de Factura</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="FAC-2024-XXX"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
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
                Crear Ingreso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-gray-400">Total Ingresos</CardDescription>
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-gray-400">
              {filteredTransactions.filter(t => t.status === 'received').length} cobros recibidos
            </p>
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
                  placeholder="Buscar por descripción, cliente o factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Transactions Table */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Lista de Ingresos</CardTitle>
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
                <TableHead className="text-gray-400">Descripción</TableHead>
                <TableHead className="text-gray-400">Cliente</TableHead>
                <TableHead className="text-gray-400">Monto</TableHead>
                <TableHead className="text-gray-400">Fecha</TableHead>
                <TableHead className="text-gray-400">Categoría</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-gray-700">
                  <TableCell className="text-white">{transaction.description}</TableCell>
                  <TableCell className="text-gray-300">{transaction.clientName || '-'}</TableCell>
                  <TableCell className="text-white font-medium">{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell className="text-gray-300">{formatDate(transaction.date)}</TableCell>
                  <TableCell className="text-gray-300">{transaction.category}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
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
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Registro de Ingreso</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica los datos del registro de ingreso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white">Descripción</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del ingreso"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount" className="text-white">Monto</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="text-white">Fecha</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-white">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clientName" className="text-white">Cliente</Label>
                <Input
                  id="edit-clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Nombre del cliente"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-invoiceNumber" className="text-white">Número de Factura</Label>
                <Input
                  id="edit-invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  placeholder="FAC-2024-XXX"
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
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-white hover:bg-gray-700">
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingTransaction(null)}
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
