"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Download, Filter, Check, X, FileText, UserPlus, TagIcon } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Types
type Client = {
  id: string;
  name: string;
  company: string;
  rfc: string;
  regimenFiscal: string;
  usoCFDI: string;
};

type Concept = {
  id: string;
  name: string;
  claveProdServ: string;
  claveUnidad: string;
  defaultAmount: number;
  tasaIVA: number;
  tasaRetencionISR: number;
};

type IncomeTransaction = {
  id: string;
  clientId: string;
  clientName: string;
  conceptId: string;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  retencionISR: number;
  total: number;
  date: string;
  invoiceNumber?: string;
  isBilled: boolean;
  status: "pending" | "received" | "cancelled";
};

// Mock Data
const mockClients: Client[] = [
  { id: "1", name: "Juan Pérez", company: "Empresa ABC S.A.", rfc: "EAB970312A45", regimenFiscal: "601", usoCFDI: "G03" },
  { id: "2", name: "María González", company: "Tech Solutions Inc.", rfc: "TSI850615RT4", regimenFiscal: "601", usoCFDI: "G03" }
];

const mockConcepts: Concept[] = [
  { id: "1", name: "Servicios Contables", claveProdServ: "80101600", claveUnidad: "E48", defaultAmount: 15000, tasaIVA: 16, tasaRetencionISR: 0 },
  { id: "2", name: "Consultoría Financiera", claveProdServ: "80141600", claveUnidad: "HUR", defaultAmount: 2500, tasaIVA: 16, tasaRetencionISR: 10.67 }
];

const mockIncomeData: IncomeTransaction[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "Empresa ABC S.A.",
    conceptId: "1",
    conceptName: "Servicios Contables",
    quantity: 1,
    unitPrice: 15000,
    subtotal: 15000,
    iva: 2400,
    retencionISR: 0,
    total: 17400,
    date: "2024-01-15",
    invoiceNumber: "FAC-2024-001",
    isBilled: true,
    status: "received"
  }
];

export default function IncomePage() {
  const [clients] = useState<Client[]>(mockClients);
  const [concepts] = useState<Concept[]>(mockConcepts);
  const [transactions, setTransactions] = useState<IncomeTransaction[]>(mockIncomeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: "",
    conceptId: "",
    quantity: "1",
    unitPrice: "",
    date: new Date().toISOString().split('T')[0],
    status: "pending" as "pending" | "received" | "cancelled"
  });

  // Search/filter for clients in select
  const [clientSearch, setClientSearch] = useState("");
  const [conceptSearch, setConceptSearch] = useState("");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.conceptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.company.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.rfc.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredConcepts = concepts.filter(c =>
    c.name.toLowerCase().includes(conceptSearch.toLowerCase()) ||
    c.claveProdServ.includes(conceptSearch)
  );

  const calculateTotals = (conceptId: string, quantity: number, unitPrice: number) => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return { subtotal: 0, iva: 0, retencionISR: 0, total: 0 };

    const subtotal = quantity * unitPrice;
    const iva = subtotal * (concept.tasaIVA / 100);
    const retencionISR = subtotal * (concept.tasaRetencionISR / 100);
    const total = subtotal + iva - retencionISR;

    return { subtotal, iva, retencionISR, total };
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      conceptId: "",
      quantity: "1",
      unitPrice: "",
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    });
    setClientSearch("");
    setConceptSearch("");
  };

  const handleConceptChange = (conceptId: string) => {
    const concept = concepts.find(c => c.id === conceptId);
    setFormData(prev => ({
      ...prev,
      conceptId,
      unitPrice: concept ? concept.defaultAmount.toString() : ""
    }));
  };

  const handleCreate = () => {
    if (!formData.clientId || !formData.conceptId || !formData.quantity || !formData.unitPrice) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    const client = clients.find(c => c.id === formData.clientId);
    const concept = concepts.find(c => c.id === formData.conceptId);
    if (!client || !concept) return;

    const quantity = parseFloat(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);
    const { subtotal, iva, retencionISR, total } = calculateTotals(formData.conceptId, quantity, unitPrice);

    const newTransaction: IncomeTransaction = {
      id: Date.now().toString(),
      clientId: formData.clientId,
      clientName: client.company,
      conceptId: formData.conceptId,
      conceptName: concept.name,
      quantity,
      unitPrice,
      subtotal,
      iva,
      retencionISR,
      total,
      date: formData.date,
      isBilled: false,
      status: formData.status
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleStartEdit = (transaction: IncomeTransaction) => {
    setEditingId(transaction.id);
    setFormData({
      clientId: transaction.clientId,
      conceptId: transaction.conceptId,
      quantity: transaction.quantity.toString(),
      unitPrice: transaction.unitPrice.toString(),
      date: transaction.date,
      status: transaction.status
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const client = clients.find(c => c.id === formData.clientId);
    const concept = concepts.find(c => c.id === formData.conceptId);
    if (!client || !concept) return;

    const quantity = parseFloat(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);
    const { subtotal, iva, retencionISR, total } = calculateTotals(formData.conceptId, quantity, unitPrice);

    const transaction = transactions.find(t => t.id === editingId);
    const updatedTransaction: IncomeTransaction = {
      ...transaction!,
      clientId: formData.clientId,
      clientName: client.company,
      conceptId: formData.conceptId,
      conceptName: concept.name,
      quantity,
      unitPrice,
      subtotal,
      iva,
      retencionISR,
      total,
      date: formData.date,
      status: formData.status
    };

    setTransactions(prev => prev.map(t => t.id === editingId ? updatedTransaction : t));
    setEditingId(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este cobro?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleBill = (id: string) => {
    // Aquí irá la integración con facturación
    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, isBilled: true, invoiceNumber } : t
    ));
    alert(`Factura generada: ${invoiceNumber}\n(Integración con SAT pendiente)`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX');

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "Pendiente", className: "bg-yellow-500/20 text-yellow-500" },
      received: { label: "Cobrado", className: "bg-green-500/20 text-green-500" },
      cancelled: { label: "Cancelado", className: "bg-red-500/20 text-red-500" }
    }[status] || { label: status, className: "bg-gray-500/20 text-gray-500" };
    
    return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
  };

  const totalIncome = transactions.filter(t => t.status !== 'cancelled').reduce((sum, t) => sum + t.total, 0);
  const pendingIncome = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.total, 0);
  const selectedClient = clients.find(c => c.id === formData.clientId);
  const selectedConcept = concepts.find(c => c.id === formData.conceptId);
  const currentTotals = formData.conceptId && formData.quantity && formData.unitPrice 
    ? calculateTotals(formData.conceptId, parseFloat(formData.quantity), parseFloat(formData.unitPrice))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cobranza</h1>
          <p className="text-sm text-gray-400">Gestión de ingresos con datos fiscales integrados</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Cobro</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Cobros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{transactions.length}</div>
            <p className="text-xs text-gray-500">{transactions.filter(t => t.isBilled).length} facturados</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-gray-500">Cobrado y pendiente</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pendiente de Cobro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{formatCurrency(pendingIncome)}</div>
            <p className="text-xs text-gray-500">Por cobrar</p>
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
                placeholder="Buscar por cliente, concepto o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                <SelectItem value="pending" className="text-white">Pendiente</SelectItem>
                <SelectItem value="received" className="text-white">Cobrado</SelectItem>
                <SelectItem value="cancelled" className="text-white">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lista de Cobros</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredTransactions.length} cobro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[150px]">Fecha</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Cliente</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Concepto</TableHead>
                  <TableHead className="text-gray-400 w-[80px]">Cant.</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">P. Unit.</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Subtotal</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">IVA</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Total</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-blue-500/5">
                    <TableCell className="p-2">
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue placeholder="Seleccionar cliente..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <div className="p-2">
                                <Input
                                  placeholder="Buscar cliente..."
                                  value={clientSearch}
                                  onChange={(e) => setClientSearch(e.target.value)}
                                  className="bg-gray-900 border-gray-600 text-white text-sm h-7 mb-2"
                                />
                              </div>
                              {filteredClients.map((client) => (
                                <SelectItem key={client.id} value={client.id} className="text-white text-sm hover:bg-gray-700">
                                  {client.company} ({client.rfc})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-blue-500/30" title="Nuevo cliente">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {selectedClient && (
                          <div className="text-xs text-gray-400">RFC: {selectedClient.rfc}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          <Select value={formData.conceptId} onValueChange={handleConceptChange}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue placeholder="Seleccionar concepto..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <div className="p-2">
                                <Input
                                  placeholder="Buscar concepto..."
                                  value={conceptSearch}
                                  onChange={(e) => setConceptSearch(e.target.value)}
                                  className="bg-gray-900 border-gray-600 text-white text-sm h-7 mb-2"
                                />
                              </div>
                              {filteredConcepts.map((concept) => (
                                <SelectItem key={concept.id} value={concept.id} className="text-white text-sm hover:bg-gray-700">
                                  {concept.name} - {formatCurrency(concept.defaultAmount)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-blue-500/30" title="Nuevo concepto">
                            <TagIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {selectedConcept && (
                          <div className="text-xs text-gray-400">
                            IVA: {selectedConcept.tasaIVA}% | Ret: {selectedConcept.tasaRetencionISR}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2 text-white text-sm">
                      {currentTotals ? formatCurrency(currentTotals.subtotal) : '$0.00'}
                    </TableCell>
                    <TableCell className="p-2 text-green-400 text-sm">
                      {currentTotals ? formatCurrency(currentTotals.iva) : '$0.00'}
                    </TableCell>
                    <TableCell className="p-2 text-white font-semibold text-sm">
                      {currentTotals ? formatCurrency(currentTotals.total) : '$0.00'}
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="pending" className="text-white">Pendiente</SelectItem>
                          <SelectItem value="received" className="text-white">Cobrado</SelectItem>
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

                {/* Existing Transactions */}
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="p-3 text-gray-300 text-sm">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="p-3">
                      <div className="text-white font-medium text-sm">{transaction.clientName}</div>
                    </TableCell>
                    <TableCell className="p-3 text-gray-300 text-sm">{transaction.conceptName}</TableCell>
                    <TableCell className="p-3 text-white text-sm text-center">{transaction.quantity}</TableCell>
                    <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.unitPrice)}</TableCell>
                    <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.subtotal)}</TableCell>
                    <TableCell className="p-3 text-green-400 text-sm">+{formatCurrency(transaction.iva)}</TableCell>
                    <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(transaction.total)}</TableCell>
                    <TableCell className="p-3">
                      <div className="space-y-1">
                        {getStatusBadge(transaction.status)}
                        {transaction.isBilled && (
                          <div className="text-xs text-blue-400">{transaction.invoiceNumber}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center gap-1">
                        {!transaction.isBilled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBill(transaction.id)}
                            className="h-8 text-green-400 hover:bg-green-500/10"
                            title="Facturar"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(transaction)}
                          className="h-8 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction.id)}
                          className="h-8 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
