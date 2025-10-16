"use client";

import { useState, useEffect, Fragment } from "react";
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronRight, Eye, Upload } from "lucide-react";
import { toast } from "sonner";

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
import { PeriodFilter, type PeriodValue, filterByDateRange } from "@/components/ui/period-filter";
import { FileUpload } from "@/components/ui/file-upload";
import { FilePreviewModal } from "@/components/ui/file-preview-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Actions and queries
import { createTransaction } from "@/modules/transactions/actions/create-transaction";
import { updateTransaction } from "@/modules/transactions/actions/update-transaction";
import { deleteTransaction } from "@/modules/transactions/actions/delete-transaction";
import { 
  loadIncomeData, 
  refreshIncomeTransactions, 
  type SerializedTransaction,
  type SerializedClient,
  type SerializedConcept
} from "@/app/actions/income";

export default function IncomePage() {
  // State
  const [transactions, setTransactions] = useState<SerializedTransaction[]>([]);
  const [clients, setClients] = useState<SerializedClient[]>([]);
  const [concepts, setConcepts] = useState<SerializedConcept[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterBankAccount, setFilterBankAccount] = useState("all");
  const [period, setPeriod] = useState<PeriodValue>("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    clientId: "",
    conceptId: "",
    quantity: "1",
    unitPrice: "",
    date: new Date().toISOString().split("T")[0],
    isProject: false,
    projectName: "",
    numberOfPayments: "1",
    invoiceType: "PUE" as "PPD" | "PUE",
    paymentMethod: "Transferencia",
    paymentForm: "03",
    paymentConditions: "",
    bankAccountId: "",
    paymentStatus: "pending" as "paid" | "pending" | "debt",
    status: "pending" as "pending" | "received" | "cancelled",
  });
  
  // File uploads
  const [paymentProofFiles, setPaymentProofFiles] = useState<string[]>([]);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // TODO: Get companyId from session
      const companyId = "temp-company-id";
      
      const data = await loadIncomeData(companyId);

      setTransactions(data.transactions);
      setClients(data.clients);
      setConcepts(data.concepts);
      setBankAccounts(data.bankAccounts);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Toggle project accordion
  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  // Calculate totals with proper tax handling
  const calculateAmounts = () => {
    const selectedConcept = concepts.find(c => c.id === formData.conceptId);
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    
    const tasaIVA = selectedConcept?.tasaIVA || 16;
    const tasaISR = selectedConcept?.tasaRetencionISR || 0;
    const tasaRetIVA = selectedConcept?.tasaRetencionIVA || 0;
    const ivaIncluded = selectedConcept?.ivaIncluded || false;

    let subtotal: number;
    let iva: number;
    let retencionISR: number;
    let retencionIVA: number;
    let total: number;

    if (ivaIncluded) {
      // IVA Incluido: Precio ya incluye IVA
      const totalBruto = quantity * unitPrice;
      subtotal = parseFloat((totalBruto / (1 + tasaIVA / 100)).toFixed(2));
      iva = parseFloat((totalBruto - subtotal).toFixed(2));
      
      // Retenciones
      retencionISR = parseFloat((subtotal * (tasaISR / 100)).toFixed(2));
      retencionIVA = parseFloat((iva * (tasaRetIVA / 100)).toFixed(2));
      
      // Total Neto = Total Bruto - Retenciones
      total = parseFloat((totalBruto - retencionISR - retencionIVA).toFixed(2));
    } else {
      // +IVA: Precio no incluye IVA
      subtotal = parseFloat((quantity * unitPrice).toFixed(2));
      iva = parseFloat((subtotal * (tasaIVA / 100)).toFixed(2));
      
      // Retenciones
      retencionISR = parseFloat((subtotal * (tasaISR / 100)).toFixed(2));
      retencionIVA = parseFloat((iva * (tasaRetIVA / 100)).toFixed(2));
      
      // Total = Subtotal + IVA - Retenciones
      total = parseFloat((subtotal + iva - retencionISR - retencionIVA).toFixed(2));
    }

    return { subtotal, iva, retencionISR, retencionIVA, total };
  };

  // Handle create
  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const totals = calculateAmounts();
      
      const client = clients.find(c => c.id === formData.clientId);
      const concept = concepts.find(c => c.id === formData.conceptId);

      if (!client || !concept) {
        toast.error("Selecciona cliente y concepto");
        return;
      }

      const result = await createTransaction({
        companyId,
        type: "income",
        date: new Date(formData.date),
        clientId: formData.clientId,
        conceptId: formData.conceptId,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        subtotal: totals.subtotal,
        iva: totals.iva,
        retencionISR: totals.retencionISR,
        retencionIVA: totals.retencionIVA,
        total: totals.total,
        isProject: formData.isProject,
        projectName: formData.isProject ? formData.projectName : undefined,
        numberOfPayments: formData.isProject ? parseInt(formData.numberOfPayments) : undefined,
        invoiceType: formData.invoiceType,
        paymentMethod: formData.paymentMethod,
        paymentForm: formData.paymentForm,
        paymentConditions: formData.paymentConditions,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        bankAccountId: formData.bankAccountId || undefined,
        paymentProofFiles,
      });

      if (result.success) {
        toast.success("Cobro creado exitosamente");
        setShowNewForm(false);
        setPaymentProofFiles([]);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear el cobro");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Error al crear el cobro");
    }
  };

  // Handle edit
  const handleStartEdit = (transaction: SerializedTransaction) => {
    setEditingId(transaction.id);
    setFormData({
      clientId: transaction.clientId || "",
      conceptId: transaction.conceptId || "",
      quantity: transaction.quantity?.toString() || "1",
      unitPrice: transaction.unitPrice?.toString() || "",
      date: new Date(transaction.date).toISOString().split("T")[0],
      isProject: transaction.isProject,
      projectName: transaction.projectName || "",
      numberOfPayments: transaction.numberOfPayments?.toString() || "1",
      invoiceType: (transaction.invoiceType as "PPD" | "PUE") || "PUE",
      paymentMethod: transaction.paymentMethod || "Transferencia",
      paymentForm: transaction.paymentForm || "03",
      paymentConditions: transaction.paymentConditions || "",
      bankAccountId: transaction.bankAccountId || "",
      paymentStatus: (transaction.paymentStatus as "paid" | "pending" | "debt") || "pending",
      status: (transaction.status as "pending" | "received" | "cancelled") || "pending",
    });
    
    if (transaction.paymentProofFiles) {
      try {
        setPaymentProofFiles(JSON.parse(transaction.paymentProofFiles));
      } catch {
        setPaymentProofFiles([]);
      }
    }
    
    setShowNewForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const totals = calculateAmounts();

      const result = await updateTransaction({
        id: editingId,
        date: new Date(formData.date),
        clientId: formData.clientId,
        conceptId: formData.conceptId,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        subtotal: totals.subtotal,
        iva: totals.iva,
        retencionISR: totals.retencionISR,
        total: totals.total,
        invoiceType: formData.invoiceType,
        paymentMethod: formData.paymentMethod,
        paymentForm: formData.paymentForm,
        paymentConditions: formData.paymentConditions,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        bankAccountId: formData.bankAccountId || undefined,
        paymentProofFiles,
      });

      if (result.success) {
        toast.success("Cobro actualizado exitosamente");
        setShowNewForm(false);
        setEditingId(null);
        setPaymentProofFiles([]);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar el cobro");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Error al actualizar el cobro");
    }
  };

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteTransaction(deleteTargetId);

      if (result.success) {
        toast.success("Cobro eliminado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar el cobro");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error al eliminar el cobro");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      conceptId: "",
      quantity: "1",
      unitPrice: "",
      date: new Date().toISOString().split("T")[0],
      isProject: false,
      projectName: "",
      numberOfPayments: "1",
      invoiceType: "PUE",
      paymentMethod: "Transferencia",
      paymentForm: "03",
      paymentConditions: "",
      bankAccountId: "",
      paymentStatus: "pending",
      status: "pending",
    });
  };

  // Filtering
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      transaction.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.concept?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.projectName?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    // Payment status filter
    const matchesPaymentStatus = filterPaymentStatus === "all" || transaction.paymentStatus === filterPaymentStatus;

    // Bank account filter
    const matchesBankAccount = filterBankAccount === "all" || transaction.bankAccountId === filterBankAccount;

    // Date filter
    const matchesDate = filterByDateRange(new Date(transaction.date), period, customStartDate, customEndDate);

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesBankAccount && matchesDate;
  });

  // KPIs
  const totalIncome = filteredTransactions.reduce((sum, t) => sum + Number(t.total || 0), 0);
  const pendingIncome = filteredTransactions
    .filter(t => t.paymentStatus === "pending")
    .reduce((sum, t) => sum + Number(t.total || 0), 0);
  const receivedIncome = filteredTransactions
    .filter(t => t.paymentStatus === "paid")
    .reduce((sum, t) => sum + Number(t.total || 0), 0);
  const billedCount = filteredTransactions.filter(t => t.isBilled).length;

  // File handling
  const handleViewFile = (fileUrl: string, fileName: string) => {
    setPreviewFileUrl(fileUrl);
    setPreviewFileName(fileName);
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cobranza</h1>
          <p className="text-muted-foreground">Gestión de ingresos y cobros</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showNewForm ? "Cancelar" : "Nuevo Cobro"}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Cobros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recibidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${receivedIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Facturados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* New/Edit Form */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Cobro" : "Nuevo Cobro"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente</Label>
                <Select value={formData.clientId} onValueChange={(v) => setFormData(prev => ({ ...prev, clientId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Concepto</Label>
                <Select value={formData.conceptId} onValueChange={(v) => setFormData(prev => ({ ...prev, conceptId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar concepto" />
                  </SelectTrigger>
                  <SelectContent>
                    {concepts.map(concept => (
                      <SelectItem key={concept.id} value={concept.id}>
                        {concept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              <div>
                <Label>Precio Unitario</Label>
                <Input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                />
              </div>

              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div>
                <Label>Cuenta Bancaria</Label>
                <Select
                  value={formData.bankAccountId || "none"}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, bankAccountId: v === "none" ? "" : v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {bankAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} {account.last4 ? `****${account.last4}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado de Pago</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, paymentStatus: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="paid">Pagado</SelectItem>
                    <SelectItem value="debt">Deuda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="received">Recibido</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Project checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isProject}
                onChange={(e) => setFormData(prev => ({ ...prev, isProject: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label>Es un proyecto con múltiples pagos</Label>
            </div>

            {formData.isProject && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Proyecto</Label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Número de Pagos</Label>
                  <Input
                    type="number"
                    value={formData.numberOfPayments}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfPayments: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* File upload */}
            <div>
              <Label>Comprobantes de Pago</Label>
              <FileUpload
                accept="image/*,application/pdf"
                category="payment-proofs"
                maxSize={10 * 1024 * 1024}
                onUploadComplete={(url) => setPaymentProofFiles(prev => [...prev, url])}
                onUploadError={(error) => toast.error(error)}
              />
              {paymentProofFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {paymentProofFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="truncate">{file.split('/').pop()}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewFile(file, file.split('/').pop() || '')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {formData.unitPrice && formData.quantity && (
              <div className="bg-muted p-4 rounded space-y-1">
                <div>Subtotal: ${calculateAmounts().subtotal.toFixed(2)}</div>
                <div>IVA ({concepts.find(c => c.id === formData.conceptId)?.tasaIVA || 16}%): ${calculateAmounts().iva.toFixed(2)}</div>
                {calculateAmounts().retencionISR > 0 && (
                  <div className="text-red-500">Ret. ISR ({concepts.find(c => c.id === formData.conceptId)?.tasaRetencionISR || 0}%): -${calculateAmounts().retencionISR.toFixed(2)}</div>
                )}
                {calculateAmounts().retencionIVA > 0 && (
                  <div className="text-red-500">Ret. IVA ({concepts.find(c => c.id === formData.conceptId)?.tasaRetencionIVA || 0}%): -${calculateAmounts().retencionIVA.toFixed(2)}</div>
                )}
                <div className="font-bold text-lg border-t pt-2 mt-2">Total a Cobrar: ${calculateAmounts().total.toFixed(2)}</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={editingId ? handleSaveEdit : handleCreate}>
                {editingId ? "Guardar Cambios" : "Crear Cobro"}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowNewForm(false);
                setEditingId(null);
                resetForm();
                setPaymentProofFiles([]);
              }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cliente, concepto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label>Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="received">Recibido</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pago</Label>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="debt">Deuda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cuenta</Label>
              <Select value={filterBankAccount} onValueChange={setFilterBankAccount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {bankAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} {account.last4 ? `****${account.last4}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Período</Label>
              <PeriodFilter
                value={period}
                onChange={setPeriod}
                customStartDate={customStartDate}
                customEndDate={customEndDate}
                onCustomDateChange={(start, end) => {
                  setCustomStartDate(start);
                  setCustomEndDate(end);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cobros ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead>Comprobante</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <Fragment key={transaction.id}>
                  {/* Main Transaction Row */}
                  <TableRow
                    className={`${transaction.isProject ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                    onClick={() => transaction.isProject && toggleProject(transaction.id)}
                  >
                    <TableCell>
                      {transaction.isProject && (
                        expandedProjects.has(transaction.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      )}
                    </TableCell>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {transaction.client?.name || "-"}
                      {transaction.isProject && (
                        <Badge variant="outline" className="ml-2">Proyecto</Badge>
                      )}
                    </TableCell>
                    <TableCell>{transaction.concept?.name || "-"}</TableCell>
                    <TableCell>
                      {bankAccounts.find(a => a.id === transaction.bankAccountId)?.name || "-"}
                    </TableCell>
                    <TableCell className="text-right">${Number(transaction.total || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        transaction.paymentStatus === "paid" ? "default" :
                        transaction.paymentStatus === "pending" ? "secondary" : "destructive"
                      }>
                        {transaction.paymentStatus === "paid" ? "Pagado" :
                         transaction.paymentStatus === "pending" ? "Pendiente" : "Deuda"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.paymentProofFiles && JSON.parse(transaction.paymentProofFiles).length > 0 ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            const files = JSON.parse(transaction.paymentProofFiles!);
                            handleViewFile(files[0], files[0].split('/').pop() || '');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(transaction);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(transaction.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Project Payments */}
                  {transaction.isProject && expandedProjects.has(transaction.id) && transaction.projectPayments?.map((payment, idx) => (
                    <TableRow key={payment.id} className="bg-muted/30">
                      <TableCell></TableCell>
                      <TableCell className="pl-8">
                        {new Date(payment.date).toLocaleDateString()}
                        <Badge variant="outline" className="ml-2">
                          Pago {payment.paymentNumber}/{transaction.numberOfPayments}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.client?.name || "-"}</TableCell>
                      <TableCell>{payment.concept?.name || "-"}</TableCell>
                      <TableCell>
                        {bankAccounts.find(a => a.id === payment.bankAccountId)?.name || "-"}
                      </TableCell>
                      <TableCell className="text-right">${Number(payment.total || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          payment.paymentStatus === "paid" ? "default" :
                          payment.paymentStatus === "pending" ? "secondary" : "destructive"
                        }>
                          {payment.paymentStatus === "paid" ? "Pagado" :
                           payment.paymentStatus === "pending" ? "Pendiente" : "Deuda"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paymentProofFiles && JSON.parse(payment.paymentProofFiles).length > 0 ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const files = JSON.parse(payment.paymentProofFiles!);
                              handleViewFile(files[0], files[0].split('/').pop() || '');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(payment);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      {previewFileUrl && (
        <FilePreviewModal
          fileUrl={previewFileUrl}
          fileName={previewFileName}
          isOpen={!!previewFileUrl}
          onClose={() => {
            setPreviewFileUrl(null);
            setPreviewFileName("");
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cobro"
        description="¿Estás seguro de que deseas eliminar este cobro? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}

