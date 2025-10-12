"use client";

import { useState, Fragment } from "react";
import { Plus, Search, Edit, Trash2, Download, Filter, Check, X, FileText, UserPlus, TagIcon, ChevronDown, ChevronRight, FolderOpen, Eye, FileCheck } from "lucide-react";

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
  
  // Project fields
  isProject: boolean;
  projectName?: string;
  totalProjectAmount?: number;
  numberOfPayments?: number;
  parentProjectId?: string;
  paymentNumber?: number;
  
  // Invoice fields
  invoiceNumber?: string;
  isBilled: boolean;
  invoiceType: "PPD" | "PUE" | null;
  paymentMethod: string; // Efectivo, Transferencia, Cheque, etc.
  paymentForm: string; // Código SAT: 01, 03, 04, etc.
  paymentConditions?: string;
  
  // Invoice status
  invoiceStatus: "pending" | "preview" | "stamped";
  invoicePreviewUrl?: string;
  invoiceXmlUrl?: string;
  invoiceStampedPdfUrl?: string;
  
  // Payment complements (for PPD)
  paymentComplements?: Array<{
    id: string;
    date: string;
    amount: number;
    xmlUrl: string;
  }>;
  
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
  // Cobro regular (no proyecto)
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
    isProject: false,
    invoiceType: "PUE",
    paymentMethod: "Transferencia",
    paymentForm: "03",
    paymentConditions: "Pago inmediato",
    invoiceStatus: "stamped",
    invoiceStampedPdfUrl: "/invoices/FAC-2024-001.pdf",
    invoiceXmlUrl: "/invoices/FAC-2024-001.xml",
    status: "received"
  },
  // Proyecto con 4 pagos parciales
  {
    id: "proj-1",
    clientId: "2",
    clientName: "Tech Solutions Inc.",
    conceptId: "2",
    conceptName: "Consultoría Financiera",
    quantity: 1,
    unitPrice: 12000,
    subtotal: 12000,
    iva: 1920,
    retencionISR: 1280.4,
    total: 12639.6,
    date: "2024-01-20",
    isProject: true,
    projectName: "Implementación Sistema Contable",
    totalProjectAmount: 12639.6,
    numberOfPayments: 4,
    invoiceType: "PPD",
    paymentMethod: "Por Definir",
    paymentForm: "99",
    paymentConditions: "4 pagos mensuales",
    invoiceStatus: "stamped",
    invoiceNumber: "FAC-2024-002",
    isBilled: true,
    invoiceStampedPdfUrl: "/invoices/FAC-2024-002.pdf",
    invoiceXmlUrl: "/invoices/FAC-2024-002.xml",
    status: "pending"
  },
  // Pago parcial 1/4
  {
    id: "proj-1-p1",
    clientId: "2",
    clientName: "Tech Solutions Inc.",
    conceptId: "2",
    conceptName: "Consultoría Financiera",
    quantity: 1,
    unitPrice: 3000,
    subtotal: 3000,
    iva: 480,
    retencionISR: 320.1,
    total: 3159.9,
    date: "2024-01-20",
    parentProjectId: "proj-1",
    paymentNumber: 1,
    isProject: false,
    invoiceType: "PPD",
    paymentMethod: "Transferencia",
    paymentForm: "03",
    invoiceStatus: "pending",
    isBilled: false,
    paymentComplements: [
      {
        id: "comp-1",
        date: "2024-01-25",
        amount: 3159.9,
        xmlUrl: "/complements/COMP-2024-002-001.xml"
      }
    ],
    status: "received"
  },
  // Pago parcial 2/4
  {
    id: "proj-1-p2",
    clientId: "2",
    clientName: "Tech Solutions Inc.",
    conceptId: "2",
    conceptName: "Consultoría Financiera",
    quantity: 1,
    unitPrice: 3000,
    subtotal: 3000,
    iva: 480,
    retencionISR: 320.1,
    total: 3159.9,
    date: "2024-02-20",
    parentProjectId: "proj-1",
    paymentNumber: 2,
    isProject: false,
    invoiceType: "PPD",
    paymentMethod: "Por Definir",
    paymentForm: "99",
    invoiceStatus: "pending",
    isBilled: false,
    status: "pending"
  },
  // Pago parcial 3/4
  {
    id: "proj-1-p3",
    clientId: "2",
    clientName: "Tech Solutions Inc.",
    conceptId: "2",
    conceptName: "Consultoría Financiera",
    quantity: 1,
    unitPrice: 3000,
    subtotal: 3000,
    iva: 480,
    retencionISR: 320.1,
    total: 3159.9,
    date: "2024-03-20",
    parentProjectId: "proj-1",
    paymentNumber: 3,
    isProject: false,
    invoiceType: "PPD",
    paymentMethod: "Por Definir",
    paymentForm: "99",
    invoiceStatus: "pending",
    isBilled: false,
    status: "pending"
  },
  // Pago parcial 4/4
  {
    id: "proj-1-p4",
    clientId: "2",
    clientName: "Tech Solutions Inc.",
    conceptId: "2",
    conceptName: "Consultoría Financiera",
    quantity: 1,
    unitPrice: 3000,
    subtotal: 3000,
    iva: 480,
    retencionISR: 320.1,
    total: 3159.9,
    date: "2024-04-20",
    parentProjectId: "proj-1",
    paymentNumber: 4,
    isProject: false,
    invoiceType: "PPD",
    paymentMethod: "Por Definir",
    paymentForm: "99",
    invoiceStatus: "pending",
    isBilled: false,
    status: "pending"
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
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    clientId: "",
    conceptId: "",
    quantity: "1",
    unitPrice: "",
    date: new Date().toISOString().split('T')[0],
    status: "pending" as "pending" | "received" | "cancelled",
    // Project fields
    isProject: false,
    projectName: "",
    numberOfPayments: "1",
    // Invoice fields
    invoiceType: null as "PPD" | "PUE" | null,
    paymentMethod: "Por Definir",
    paymentForm: "99",
    paymentConditions: ""
  });

  // Search/filter for clients in select
  const [clientSearch, setClientSearch] = useState("");
  const [conceptSearch, setConceptSearch] = useState("");

  // Filter top-level transactions (exclude partial payments, they'll be shown inside projects)
  const filteredTransactions = transactions.filter(transaction => {
    // Exclude partial payments from top level
    if (transaction.parentProjectId) return false;
    
    const matchesSearch = transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.conceptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.projectName && transaction.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Function to get partial payments for a project
  const getProjectPayments = (projectId: string) => {
    return transactions
      .filter(t => t.parentProjectId === projectId)
      .sort((a, b) => (a.paymentNumber || 0) - (b.paymentNumber || 0));
  };
  
  // Toggle project expansion
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
      status: "pending",
      isProject: false,
      projectName: "",
      numberOfPayments: "1",
      invoiceType: null,
      paymentMethod: "Por Definir",
      paymentForm: "99",
      paymentConditions: ""
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
    const totals = calculateTotals(formData.conceptId, quantity, unitPrice);

    if (formData.isProject) {
      // Crear proyecto con pagos parciales
      const numberOfPayments = parseInt(formData.numberOfPayments);
      if (numberOfPayments < 2) {
        alert("Un proyecto debe tener al menos 2 pagos");
        return;
      }
      if (!formData.projectName) {
        alert("Ingresa el nombre del proyecto");
        return;
      }

      const projectId = `proj-${Date.now()}`;
      const paymentAmount = totals.total / numberOfPayments;

      // Crear el proyecto padre
      const projectTransaction: IncomeTransaction = {
        id: projectId,
        clientId: formData.clientId,
        clientName: client.company,
        conceptId: formData.conceptId,
        conceptName: concept.name,
        quantity,
        unitPrice,
        subtotal: totals.subtotal,
        iva: totals.iva,
        retencionISR: totals.retencionISR,
        total: totals.total,
        date: formData.date,
        isProject: true,
        projectName: formData.projectName,
        totalProjectAmount: totals.total,
        numberOfPayments,
        invoiceType: formData.invoiceType || "PPD",
        paymentMethod: formData.paymentMethod || "Por Definir",
        paymentForm: formData.paymentForm,
        paymentConditions: formData.paymentConditions,
        invoiceStatus: "pending",
        isBilled: false,
        status: "pending"
      };

      // Crear pagos parciales
      const partialPayments: IncomeTransaction[] = [];
      for (let i = 1; i <= numberOfPayments; i++) {
        const paymentDate = new Date(formData.date);
        paymentDate.setMonth(paymentDate.getMonth() + (i - 1));

        partialPayments.push({
          id: `${projectId}-p${i}`,
          clientId: formData.clientId,
          clientName: client.company,
          conceptId: formData.conceptId,
          conceptName: concept.name,
          quantity: quantity / numberOfPayments,
          unitPrice,
          subtotal: totals.subtotal / numberOfPayments,
          iva: totals.iva / numberOfPayments,
          retencionISR: totals.retencionISR / numberOfPayments,
          total: paymentAmount,
          date: paymentDate.toISOString().split('T')[0],
          parentProjectId: projectId,
          paymentNumber: i,
          isProject: false,
          invoiceType: formData.invoiceType || "PPD",
          paymentMethod: "Por Definir",
          paymentForm: "99",
          invoiceStatus: "pending",
          isBilled: false,
          status: "pending"
        });
      }

      setTransactions(prev => [projectTransaction, ...partialPayments, ...prev]);
      alert(`✅ Proyecto "${formData.projectName}" creado con ${numberOfPayments} pagos parciales`);
    } else {
      // Crear cobro regular
      const newTransaction: IncomeTransaction = {
        id: `trans-${Date.now()}`,
        clientId: formData.clientId,
        clientName: client.company,
        conceptId: formData.conceptId,
        conceptName: concept.name,
        quantity,
        unitPrice,
        subtotal: totals.subtotal,
        iva: totals.iva,
        retencionISR: totals.retencionISR,
        total: totals.total,
        date: formData.date,
        isProject: false,
        invoiceType: formData.invoiceType || "PUE",
        paymentMethod: formData.paymentMethod || "Transferencia",
        paymentForm: formData.paymentForm,
        paymentConditions: formData.paymentConditions,
        invoiceStatus: "pending",
        isBilled: false,
        status: formData.status
      };

      setTransactions(prev => [newTransaction, ...prev]);
    }

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

  const handlePreviewInvoice = (id: string) => {
    const previewUrl = `/invoices/preview-${id}.pdf`;
    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { ...t, invoiceStatus: "preview" as const, invoicePreviewUrl: previewUrl }
        : t
    ));
    alert(`✅ Preview de factura generado\n(Se abrirá en nueva ventana cuando se integre FacturaloPlus)`);
  };

  const handleStampInvoice = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
    const xmlUrl = `/invoices/${invoiceNumber}.xml`;
    const pdfUrl = `/invoices/${invoiceNumber}.pdf`;

    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { 
            ...t, 
            invoiceStatus: "stamped" as const, 
            isBilled: true,
            invoiceNumber,
            invoiceXmlUrl: xmlUrl,
            invoiceStampedPdfUrl: pdfUrl
          }
        : t
    ));

    alert(`✅ Factura timbrada: ${invoiceNumber}\nXML y PDF generados\n(Integración con FacturaloPlus pendiente)`);
  };

  const handleGenerateComplement = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const complementId = `comp-${Date.now()}`;
    const complementXml = `/complements/COMP-${transaction.invoiceNumber}-${complementId}.xml`;

    const newComplement = {
      id: complementId,
      date: new Date().toISOString().split('T')[0],
      amount: transaction.total,
      xmlUrl: complementXml
    };

    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { 
            ...t, 
            paymentComplements: [...(t.paymentComplements || []), newComplement]
          }
        : t
    ));

    alert(`✅ Complemento de pago generado\nFolio: ${complementId}\n(Integración con FacturaloPlus pendiente)`);
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
                  <TableHead className="text-gray-400 w-[40px]"></TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Fecha</TableHead>
                  <TableHead className="text-gray-400 w-[250px]">Cliente/Proyecto</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Concepto</TableHead>
                  <TableHead className="text-gray-400 w-[80px]">Cant.</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">P. Unit.</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Subtotal</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">IVA</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Total</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-blue-500/5">
                    <TableCell className="p-2 w-[40px]"></TableCell>
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

                {/* Extended Fields Row - Proyecto y Facturación */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-blue-500/5">
                    <TableCell colSpan={10} className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Columna 1: Datos de Proyecto */}
                        <Card className="bg-slate-800/50 border-blue-500/30">
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="isProject"
                                checked={formData.isProject}
                                onChange={(e) => setFormData(prev => ({ ...prev, isProject: e.target.checked }))}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="isProject" className="text-white text-sm font-medium">
                                ¿Es un Proyecto con Pagos Parciales?
                              </Label>
                            </div>
                            
                            {formData.isProject && (
                              <>
                                <div>
                                  <Label className="text-gray-400 text-xs">Nombre del Proyecto</Label>
                                  <Input
                                    value={formData.projectName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                                    placeholder="Ej: Implementación Sistema ERP"
                                    className="bg-gray-800 border-blue-500/30 text-white text-sm mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-400 text-xs">Número de Pagos</Label>
                                  <Input
                                    type="number"
                                    min="2"
                                    max="12"
                                    value={formData.numberOfPayments}
                                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfPayments: e.target.value }))}
                                    className="bg-gray-800 border-blue-500/30 text-white text-sm mt-1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    {currentTotals && formData.numberOfPayments 
                                      ? `${formData.numberOfPayments} pagos de ${formatCurrency(currentTotals.total / parseInt(formData.numberOfPayments))}`
                                      : 'Ingresa cantidad para calcular'}
                                  </p>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>

                        {/* Columna 2: Datos de Facturación */}
                        <Card className="bg-slate-800/50 border-purple-500/30">
                          <CardContent className="pt-4 space-y-3">
                            <Label className="text-white text-sm font-medium">Datos de Facturación</Label>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-gray-400 text-xs">Tipo de Comprobante</Label>
                                <Select 
                                  value={formData.invoiceType || "PUE"} 
                                  onValueChange={(value: any) => {
                                    setFormData(prev => ({ 
                                      ...prev, 
                                      invoiceType: value,
                                      paymentMethod: value === "PPD" ? "Por Definir" : prev.paymentMethod,
                                      paymentForm: value === "PPD" ? "99" : prev.paymentForm
                                    }));
                                  }}
                                >
                                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white text-sm h-8 mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="PUE" className="text-white">PUE - Pago en Una Exhibición</SelectItem>
                                    <SelectItem value="PPD" className="text-white">PPD - Pago en Parcialidades</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-gray-400 text-xs">Forma de Pago SAT</Label>
                                <Select 
                                  value={formData.paymentForm} 
                                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentForm: value }))}
                                >
                                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white text-sm h-8 mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="01" className="text-white">01 - Efectivo</SelectItem>
                                    <SelectItem value="02" className="text-white">02 - Cheque</SelectItem>
                                    <SelectItem value="03" className="text-white">03 - Transferencia</SelectItem>
                                    <SelectItem value="04" className="text-white">04 - Tarjeta de Crédito</SelectItem>
                                    <SelectItem value="28" className="text-white">28 - Tarjeta de Débito</SelectItem>
                                    <SelectItem value="99" className="text-white">99 - Por Definir</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label className="text-gray-400 text-xs">Método de Pago</Label>
                              <Input
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                placeholder="Ej: Transferencia, Efectivo..."
                                className="bg-gray-800 border-purple-500/30 text-white text-sm mt-1"
                                disabled={formData.invoiceType === "PPD"}
                              />
                              {formData.invoiceType === "PPD" && (
                                <p className="text-xs text-yellow-500 mt-1">PPD: Método se define al recibir cada pago</p>
                              )}
                            </div>

                            <div>
                              <Label className="text-gray-400 text-xs">Condiciones de Pago</Label>
                              <Input
                                value={formData.paymentConditions}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentConditions: e.target.value }))}
                                placeholder="Ej: Net 30, Inmediato..."
                                className="bg-gray-800 border-purple-500/30 text-white text-sm mt-1"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Transactions with Accordion */}
                {filteredTransactions.map((transaction) => (
                  <Fragment key={transaction.id}>
                    {/* Main Transaction Row */}
                    <TableRow 
                      className={`border-white/10 hover:bg-white/5 ${transaction.isProject ? 'cursor-pointer' : ''}`}
                      onClick={() => transaction.isProject && toggleProject(transaction.id)}
                    >
                      {/* Columna expandir/contraer */}
                      <TableCell className="p-3 w-[40px]">
                        {transaction.isProject && (
                          <div className="text-gray-400">
                            {expandedProjects.has(transaction.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="p-3 text-gray-300 text-sm">{formatDate(transaction.date)}</TableCell>
                      
                      <TableCell className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {transaction.isProject && <FolderOpen className="h-4 w-4 text-blue-400" />}
                            <div className="text-white font-medium text-sm">
                              {transaction.isProject ? transaction.projectName : transaction.clientName}
                            </div>
                          </div>
                          {/* Segunda línea: Datos fiscales */}
                          <div className="text-xs text-gray-500">
                            {transaction.invoiceType && (
                              <>
                                <span className={transaction.invoiceType === "PPD" ? "text-yellow-400" : "text-green-400"}>
                                  {transaction.invoiceType}
                                </span>
                                {' • '}
                                {transaction.paymentMethod}
                                {' • '}
                                Forma: {transaction.paymentForm}
                                {transaction.paymentConditions && (
                                  <>
                                    {' • '}
                                    {transaction.paymentConditions}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="p-3">
                        <div className="text-gray-300 text-sm">{transaction.conceptName}</div>
                        {transaction.isProject && (
                          <div className="text-xs text-blue-400">
                            {transaction.numberOfPayments} pagos • {formatCurrency(transaction.total / (transaction.numberOfPayments || 1))}/pago
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="p-3 text-white text-sm text-center">{transaction.quantity}</TableCell>
                      <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.unitPrice)}</TableCell>
                      <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.subtotal)}</TableCell>
                      <TableCell className="p-3 text-green-400 text-sm">+{formatCurrency(transaction.iva)}</TableCell>
                      <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(transaction.total)}</TableCell>
                      
                      <TableCell className="p-3">
                        <div className="space-y-1">
                          {getStatusBadge(transaction.status)}
                          {transaction.invoiceNumber && (
                            <div className="text-xs text-blue-400">{transaction.invoiceNumber}</div>
                          )}
                          {transaction.invoiceStatus === "preview" && (
                            <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Preview</Badge>
                          )}
                          {transaction.invoiceStatus === "stamped" && (
                            <Badge className="bg-green-500/20 text-green-500 text-xs">Timbrado</Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="p-3">
                        <div className="flex items-center gap-1">
                          {/* Botón Preview */}
                          {!transaction.isBilled && transaction.invoiceStatus === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handlePreviewInvoice(transaction.id); }}
                              className="h-8 text-blue-400 hover:bg-blue-500/10"
                              title="Preview Factura"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Botón Timbrar */}
                          {transaction.invoiceStatus === "preview" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleStampInvoice(transaction.id); }}
                              className="h-8 text-green-400 hover:bg-green-500/10"
                              title="Timbrar"
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Botón Complemento (solo para PPD timbrados y pagados) */}
                          {transaction.invoiceType === "PPD" && 
                           transaction.invoiceStatus === "stamped" && 
                           transaction.status === "received" && 
                           !transaction.parentProjectId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleGenerateComplement(transaction.id); }}
                              className="h-8 text-purple-400 hover:bg-purple-500/10"
                              title="Complemento de Pago"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleDelete(transaction.id); }}
                            className="h-8 text-red-400 hover:bg-red-500/10"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Pagos Parciales (si el proyecto está expandido) */}
                    {transaction.isProject && expandedProjects.has(transaction.id) && (
                      <>
                        {getProjectPayments(transaction.id).map((payment) => (
                          <TableRow 
                            key={payment.id} 
                            className="border-white/10 bg-slate-800/40 hover:bg-slate-800/60"
                          >
                            {/* Sangría visual */}
                            <TableCell className="p-3 w-[40px]"></TableCell>
                            <TableCell className="p-3 pl-12 text-gray-400 text-sm">
                              {formatDate(payment.date)}
                            </TableCell>
                            
                            <TableCell className="p-3 pl-12">
                              <div className="space-y-1">
                                <div className="text-gray-300 text-sm flex items-center gap-2">
                                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                    Pago {payment.paymentNumber}/{transaction.numberOfPayments}
                                  </span>
                                  {payment.clientName}
                                </div>
                                {/* Segunda línea: Datos fiscales del pago parcial */}
                                <div className="text-xs text-gray-500">
                                  {payment.paymentMethod !== "Por Definir" ? (
                                    <>
                                      {payment.paymentMethod}
                                      {' • '}
                                      Forma: {payment.paymentForm}
                                    </>
                                  ) : (
                                    <span className="text-yellow-500">Método de pago pendiente</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="p-3 pl-12 text-gray-400 text-sm">{payment.conceptName}</TableCell>
                            <TableCell className="p-3 text-gray-300 text-sm text-center">{payment.quantity.toFixed(2)}</TableCell>
                            <TableCell className="p-3 text-gray-300 text-sm">{formatCurrency(payment.unitPrice)}</TableCell>
                            <TableCell className="p-3 text-gray-300 text-sm">{formatCurrency(payment.subtotal)}</TableCell>
                            <TableCell className="p-3 text-green-400 text-sm">+{formatCurrency(payment.iva)}</TableCell>
                            <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(payment.total)}</TableCell>
                            
                            <TableCell className="p-3">
                              <div className="space-y-1">
                                {getStatusBadge(payment.status)}
                                {payment.paymentComplements && payment.paymentComplements.length > 0 && (
                                  <div className="text-xs text-purple-400">
                                    {payment.paymentComplements.length} complemento(s)
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell className="p-3">
                              <div className="flex items-center gap-1">
                                {/* Botón Complemento para pago parcial */}
                                {payment.status === "received" && transaction.invoiceStatus === "stamped" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleGenerateComplement(payment.id)}
                                    className="h-8 text-purple-400 hover:bg-purple-500/10"
                                    title="Complemento de Pago"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
