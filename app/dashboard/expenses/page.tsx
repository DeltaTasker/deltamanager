"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Download, Check, X, FileText, UserCircle, Building, Eye, Upload } from "lucide-react";
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
import { FilePreviewModal } from "@/components/ui/file-preview-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PeriodFilter, type PeriodValue, filterByDateRange } from "@/components/ui/period-filter";
import { FileUpload } from "@/components/ui/file-upload";

import { loadExpenseData } from "@/app/actions/expenses";
import { loadBankAccounts } from "@/app/actions/bank-accounts";
import type { SerializedTransaction } from "@/app/actions/income";

// Types
type Provider = {
  id: string;
  name: string;
  company: string;
  rfc?: string;
};

type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  salaryPeriod: "hourly" | "weekly" | "biweekly" | "monthly";
};

type BankAccount = {
  id: string;
  name: string;
  accountType: string;
  last4?: string;
  bank?: string;
};

type ExpenseTransaction = {
  id: string;
  paymentType: "provider" | "employee";
  providerId?: string;
  providerName?: string;
  employeeId?: string;
  employeeName?: string;
  description: string;
  amount: number;
  date: string;
  // Para empleados por hora
  hoursWorked?: number;
  hourlyRate?: number;
  // Archivos
  paymentProofFiles: string[]; // Comprobantes de pago
  invoiceFiles: string[]; // Facturas PDF/XML/ZIP
  // Bank account and payment status
  bankAccountId?: string;
  bankAccountName?: string;
  paymentStatus: "paid" | "pending" | "debt";
  status: "pending" | "paid" | "cancelled";
};

// Mock Data
const mockProviders: Provider[] = [
  { id: "1", name: "Amazon Web Services", company: "AWS", rfc: "AWS850615RT4" },
  { id: "2", name: "Microsoft", company: "Microsoft 365", rfc: "MSF920312A45" }
];

const mockEmployees: Employee[] = [
  { id: "1", name: "Juan Pérez García", position: "Contador Senior", salary: 25000, salaryPeriod: "monthly" },
  { id: "2", name: "María López", position: "Auxiliar Contable", salary: 5000, salaryPeriod: "biweekly" },
  { id: "3", name: "Carlos Rodríguez", position: "Freelance Designer", salary: 500, salaryPeriod: "hourly" }
];

const mockBankAccounts: BankAccount[] = [
  { id: "1", name: "BBVA Empresarial", accountType: "bank", last4: "1234", bank: "BBVA" },
  { id: "2", name: "Santander Negocios", accountType: "bank", last4: "5678", bank: "Santander" },
  { id: "3", name: "Tarjeta Amex", accountType: "card", last4: "9012", bank: "American Express" },
  { id: "4", name: "Efectivo", accountType: "cash" }
];

const mockExpenseData: ExpenseTransaction[] = [
  {
    id: "1",
    paymentType: "employee",
    employeeId: "1",
    employeeName: "Juan Pérez García",
    description: "Nómina Mensual - Enero 2024",
    amount: 25000,
    date: "2024-01-31",
    paymentProofFiles: ["comprobante-nomina-enero.pdf"],
    invoiceFiles: [],
    bankAccountId: "1",
    bankAccountName: "BBVA Empresarial",
    paymentStatus: "paid",
    status: "paid"
  },
  {
    id: "2",
    paymentType: "provider",
    providerId: "1",
    providerName: "AWS",
    description: "Hosting mensual",
    amount: 1200,
    date: "2024-01-15",
    paymentProofFiles: [],
    invoiceFiles: ["factura-aws.pdf", "factura-aws.xml"],
    bankAccountId: "2",
    bankAccountName: "Santander Negocios",
    paymentStatus: "pending",
    status: "pending"
  }
];

export default function ExpensesPage() {
  const [providers] = useState<Provider[]>(mockProviders);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [bankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [transactions, setTransactions] = useState<ExpenseTransaction[]>(() => {
    // Cargar desde localStorage al inicializar
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deltamanager_expense_transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing localStorage:', e);
        }
      }
    }
    return mockExpenseData;
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Guardar en localStorage cuando cambian las transacciones
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deltamanager_expense_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedBankAccount, setSelectedBankAccount] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState({
    paymentType: "provider" as "provider" | "employee",
    providerId: "",
    employeeId: "",
    description: "",
    amount: "",
    hoursWorked: "",
    date: new Date().toISOString().split('T')[0],
    // Simulación de archivos (en producción serían File[])
    paymentProofFiles: [] as string[],
    invoiceFiles: [] as string[],
    bankAccountId: "",
    paymentStatus: "pending" as "paid" | "pending" | "debt",
    status: "pending" as "pending" | "paid" | "cancelled"
  });

  const [providerSearch, setProviderSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  
  // File upload state
  const [paymentProofFiles, setPaymentProofFiles] = useState<string[]>([]);
  const [invoiceFiles, setInvoiceFiles] = useState<string[]>([]);
  
  // File preview state
  const [previewFileUrl, setPreviewFileUrl] = useState("");
  const [previewFileName, setPreviewFileName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // First apply date filter
  const dateFilteredTransactions = filterByDateRange(transactions, selectedPeriod, customStartDate, customEndDate);
  
  // Then apply other filters
  const filteredTransactions = dateFilteredTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    const matchesType = selectedPaymentType === "all" || transaction.paymentType === selectedPaymentType;
    const matchesPaymentStatus = selectedPaymentStatus === "all" || transaction.paymentStatus === selectedPaymentStatus;
    const matchesBankAccount = selectedBankAccount === "all" || transaction.bankAccountId === selectedBankAccount;
    
    return matchesSearch && matchesStatus && matchesType && matchesPaymentStatus && matchesBankAccount;
  });

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.company.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    e.position.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const calculateEmployeePayment = (employeeId: string, hours?: number) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return 0;

    if (employee.salaryPeriod === "hourly" && hours) {
      return employee.salary * hours;
    }
    return employee.salary;
  };

  const getEmployeePaymentDescription = (employeeId: string, period?: "week" | "biweek" | "month") => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return "";

    const periodLabels = {
      hourly: "horas trabajadas",
      weekly: "semanal",
      biweekly: "quincenal",
      monthly: "mensual"
    };

    return `Pago ${periodLabels[employee.salaryPeriod]} - ${employee.name}`;
  };

  const resetForm = () => {
    setFormData({
      paymentType: "provider",
      providerId: "",
      employeeId: "",
      description: "",
      amount: "",
      hoursWorked: "",
      date: new Date().toISOString().split('T')[0],
      paymentProofFiles: [],
      invoiceFiles: [],
      bankAccountId: "",
      paymentStatus: "pending",
      status: "pending"
    });
    setProviderSearch("");
    setEmployeeSearch("");
    setPaymentProofFiles([]);
    setInvoiceFiles([]);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    setFormData(prev => ({
      ...prev,
      employeeId,
      description: getEmployeePaymentDescription(employeeId),
      amount: employee.salaryPeriod === "hourly" ? "" : employee.salary.toString(),
      hoursWorked: employee.salaryPeriod === "hourly" ? "" : "0"
    }));
  };

  const handleHoursChange = (hours: string) => {
    setFormData(prev => {
      const hoursNum = parseFloat(hours) || 0;
      const amount = formData.employeeId ? calculateEmployeePayment(formData.employeeId, hoursNum) : 0;
      return {
        ...prev,
        hoursWorked: hours,
        amount: amount.toString()
      };
    });
  };

  const handleFileUpload = (type: "payment" | "invoice", event: React.ChangeEvent<HTMLInputElement>) => {
    // En producción, aquí subirías los archivos a un servidor
    const files = event.target.files;
    if (!files) return;

    const fileNames = Array.from(files).map(f => f.name);
    
    setFormData(prev => ({
      ...prev,
      [type === "payment" ? "paymentProofFiles" : "invoiceFiles"]: [
        ...prev[type === "payment" ? "paymentProofFiles" : "invoiceFiles"],
        ...fileNames
      ],
      // Auto-marcar como pagado si sube comprobante
      status: type === "payment" && fileNames.length > 0 ? "paid" : prev.status
    }));
  };

  const removeFile = (type: "payment" | "invoice", fileName: string) => {
    setFormData(prev => ({
      ...prev,
      [type === "payment" ? "paymentProofFiles" : "invoiceFiles"]: 
        prev[type === "payment" ? "paymentProofFiles" : "invoiceFiles"].filter(f => f !== fileName)
    }));
  };

  const handleCreate = async () => {
    // Validaciones
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    
    if (!formData.providerId && !formData.employeeId) {
      toast.error("Selecciona un proveedor o empleado");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    const provider = providers.find(p => p.id === formData.providerId);
    const employee = employees.find(e => e.id === formData.employeeId);

    // Use the uploaded file URLs directly
    const paymentProofUrls = paymentProofFiles;
    const invoiceUrls = invoiceFiles;

    const selectedBankAccount = bankAccounts.find(a => a.id === formData.bankAccountId);
    const newTransaction: ExpenseTransaction = {
      id: Date.now().toString(),
      paymentType: formData.paymentType,
      providerId: formData.providerId || undefined,
      providerName: provider?.company,
      employeeId: formData.employeeId || undefined,
      employeeName: employee?.name,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      hourlyRate: employee?.salaryPeriod === "hourly" ? employee.salary : undefined,
      paymentProofFiles: paymentProofUrls,
      invoiceFiles: invoiceUrls,
      bankAccountId: formData.bankAccountId || undefined,
      bankAccountName: selectedBankAccount?.name,
      paymentStatus: formData.paymentStatus,
      status: formData.status
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleStartEdit = (transaction: ExpenseTransaction) => {
    setEditingId(transaction.id);
    setShowNewForm(true);
    setFormData({
      paymentType: transaction.paymentType,
      providerId: transaction.providerId || "",
      employeeId: transaction.employeeId || "",
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      hoursWorked: transaction.hoursWorked?.toString() || "",
      paymentProofFiles: transaction.paymentProofFiles,
      invoiceFiles: transaction.invoiceFiles,
      status: transaction.status,
      bankAccountId: transaction.bankAccountId || "",
      paymentStatus: transaction.paymentStatus
    });
    setPaymentProofFiles(transaction.paymentProofFiles);
    setInvoiceFiles(transaction.invoiceFiles);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    // Validaciones
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }
    
    if (!formData.providerId && !formData.employeeId) {
      toast.error("Selecciona un proveedor o empleado");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    const provider = providers.find(p => p.id === formData.providerId);
    const employee = employees.find(e => e.id === formData.employeeId);
    const selectedBankAccount = bankAccounts.find(a => a.id === formData.bankAccountId);

    const transaction = transactions.find(t => t.id === editingId);
    const updatedTransaction: ExpenseTransaction = {
      ...transaction!,
      paymentType: formData.paymentType,
      providerId: formData.providerId || undefined,
      providerName: provider?.company,
      employeeId: formData.employeeId || undefined,
      employeeName: employee?.name,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : undefined,
      hourlyRate: employee?.salaryPeriod === "hourly" ? employee.salary : undefined,
      paymentProofFiles: paymentProofFiles,
      invoiceFiles: invoiceFiles,
      bankAccountId: formData.bankAccountId || undefined,
      bankAccountName: selectedBankAccount?.name,
      paymentStatus: formData.paymentStatus,
      status: formData.status
    };

    setTransactions(prev => prev.map(t => t.id === editingId ? updatedTransaction : t));
    setEditingId(null);
    setShowNewForm(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este pago?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleViewFile = (fileUrl: string, fileName: string) => {
    setPreviewFileUrl(fileUrl);
    setPreviewFileName(fileName);
    setIsPreviewOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-MX');

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "Pendiente", className: "bg-yellow-500/20 text-yellow-500" },
      paid: { label: "Pagado", className: "bg-green-500/20 text-green-500" },
      cancelled: { label: "Cancelado", className: "bg-red-500/20 text-red-500" }
    }[status] || { label: status, className: "bg-gray-500/20 text-gray-500" };
    
    return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
  };

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);
  
  // Check if any transaction has hourly payment
  const hasHourlyPayments = filteredTransactions.some(t => t.hoursWorked !== undefined);

  // Calculated metrics based on filtered transactions
  const totalExpenses = filteredTransactions.filter(t => t.status !== 'cancelled').reduce((sum, t) => sum + t.amount, 0);
  const pendingExpenses = filteredTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const employeePayments = filteredTransactions.filter(t => t.paymentType === 'employee' && t.status !== 'cancelled').reduce((sum, t) => sum + t.amount, 0);
  const providerPayments = filteredTransactions.filter(t => t.paymentType === 'provider' && t.status !== 'cancelled').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Pagos (Egresos)</h1>
          <p className="text-sm text-gray-400">Gestión de pagos a proveedores y empleados</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Pago</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{filteredTransactions.length}</div>
            <p className="text-xs text-gray-500">{filteredTransactions.filter(t => t.status === 'paid').length} completados</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Egresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-500">
              {selectedPaymentType === 'employee' && 'Empleados'}
              {selectedPaymentType === 'provider' && 'Proveedores'}
              {selectedPaymentType === 'all' && 'Todos'}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">A Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{formatCurrency(employeePayments)}</div>
            <p className="text-xs text-gray-500">Nómina total</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">A Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{formatCurrency(providerPayments)}</div>
            <p className="text-xs text-gray-500">Servicios total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por proveedor, empleado o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              <Select value={selectedPaymentType} onValueChange={setSelectedPaymentType}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                  <SelectValue placeholder="Tipo de Pago" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="employee" className="text-white">Empleados</SelectItem>
                  <SelectItem value="provider" className="text-white">Proveedores</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="pending" className="text-white">Pendiente</SelectItem>
                  <SelectItem value="paid" className="text-white">Pagado</SelectItem>
                  <SelectItem value="cancelled" className="text-white">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                  <SelectValue placeholder="Estado de Pago" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">Todos</SelectItem>
                  <SelectItem value="paid" className="text-white">Pagado</SelectItem>
                  <SelectItem value="pending" className="text-white">Pendiente</SelectItem>
                  <SelectItem value="debt" className="text-white">Deuda</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBankAccount} onValueChange={setSelectedBankAccount}>
                <SelectTrigger className="w-[200px] bg-slate-900 border-white/10 text-white">
                  <SelectValue placeholder="Cuenta" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">Todas las cuentas</SelectItem>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="text-white">
                      {account.name} {account.last4 ? `(*${account.last4})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <PeriodFilter
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lista de Pagos</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredTransactions.length} pago(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[100px]">Fecha</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Tipo</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Beneficiario</TableHead>
                  <TableHead className="text-gray-400 w-[250px]">Descripción</TableHead>
                  {hasHourlyPayments && <TableHead className="text-gray-400 w-[100px]">Horas</TableHead>}
                  <TableHead className="text-gray-400 w-[120px]">Monto</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Cuenta</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Estado Pago</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Archivos</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-orange-500/5">
                    <TableCell className="p-2">
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-800 border-orange-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.paymentType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentType: value, providerId: "", employeeId: "" }))}>
                        <SelectTrigger className="bg-gray-800 border-orange-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="provider" className="text-white">Proveedor</SelectItem>
                          <SelectItem value="employee" className="text-white">Empleado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      {formData.paymentType === "provider" ? (
                        <div className="flex gap-1">
                          <Select value={formData.providerId} onValueChange={(value) => setFormData(prev => ({ ...prev, providerId: value }))}>
                            <SelectTrigger className="bg-gray-800 border-orange-500/30 text-white text-sm h-8">
                              <SelectValue placeholder="Seleccionar proveedor..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <div className="p-2">
                                <Input
                                  placeholder="Buscar proveedor..."
                                  value={providerSearch}
                                  onChange={(e) => setProviderSearch(e.target.value)}
                                  className="bg-gray-900 border-gray-600 text-white text-sm h-7 mb-2"
                                />
                              </div>
                              {filteredProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id} className="text-white text-sm hover:bg-gray-700">
                                  {provider.company}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-orange-500/30" title="Nuevo proveedor">
                            <Building className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
                              <SelectTrigger className="bg-gray-800 border-orange-500/30 text-white text-sm h-8">
                                <SelectValue placeholder="Seleccionar empleado..." />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <div className="p-2">
                                  <Input
                                    placeholder="Buscar empleado..."
                                    value={employeeSearch}
                                    onChange={(e) => setEmployeeSearch(e.target.value)}
                                    className="bg-gray-900 border-gray-600 text-white text-sm h-7 mb-2"
                                  />
                                </div>
                                {filteredEmployees.map((employee) => (
                                  <SelectItem key={employee.id} value={employee.id} className="text-white text-sm hover:bg-gray-700">
                                    {employee.name} - {employee.salaryPeriod === "hourly" ? `${formatCurrency(employee.salary)}/hr` : formatCurrency(employee.salary)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-orange-500/30" title="Nuevo empleado">
                              <UserCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          {selectedEmployee && (
                            <div className="text-xs text-gray-400">
                              Tipo: {selectedEmployee.salaryPeriod === "hourly" ? "Por hora" : selectedEmployee.salaryPeriod === "weekly" ? "Semanal" : selectedEmployee.salaryPeriod === "biweekly" ? "Quincenal" : "Mensual"}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="Descripción del pago"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-gray-800 border-orange-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    {hasHourlyPayments && (
                      <TableCell className="p-2">
                        {selectedEmployee?.salaryPeriod === "hourly" ? (
                          <Input
                            type="number"
                            step="0.5"
                            placeholder="Horas"
                            value={formData.hoursWorked}
                            onChange={(e) => handleHoursChange(e.target.value)}
                            className="bg-gray-800 border-orange-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Monto"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="bg-gray-800 border-orange-500/30 text-white text-sm h-8"
                        disabled={selectedEmployee?.salaryPeriod === "hourly"}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.bankAccountId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, bankAccountId: value === "none" ? "" : value }))}>
                        <SelectTrigger className="bg-gray-800 border-orange-500/30 text-white text-sm h-8">
                          <SelectValue placeholder="Cuenta..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="none" className="text-white">Sin asignar</SelectItem>
                          {bankAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id} className="text-white text-sm">
                              {account.name} {account.last4 ? `(*${account.last4})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.paymentStatus} onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentStatus: value }))}>
                        <SelectTrigger className="bg-gray-800 border-orange-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="pending" className="text-white">Pendiente</SelectItem>
                          <SelectItem value="paid" className="text-white">Pagado</SelectItem>
                          <SelectItem value="debt" className="text-white">Deuda</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <label className="cursor-pointer">
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload("payment", e)}
                            className="hidden"
                            id="payment-upload"
                          />
                          <div className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                            <Upload className="h-3 w-3" />
                            <span>Comprobante</span>
                          </div>
                        </label>
                        <label className="cursor-pointer">
                          <Input
                            type="file"
                            multiple
                            accept=".pdf,.xml,.zip"
                            onChange={(e) => handleFileUpload("invoice", e)}
                            className="hidden"
                            id="invoice-upload"
                          />
                          <div className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                            <Upload className="h-3 w-3" />
                            <span>Factura</span>
                          </div>
                        </label>
                        {formData.paymentProofFiles.length > 0 && (
                          <div className="text-xs text-gray-400">{formData.paymentProofFiles.length} comp.</div>
                        )}
                        {formData.invoiceFiles.length > 0 && (
                          <div className="text-xs text-gray-400">{formData.invoiceFiles.length} fact.</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Badge className={formData.status === "paid" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}>
                        {formData.status === "paid" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex gap-1">
                        <Button size="sm" onClick={editingId ? handleSaveEdit : handleCreate} className="h-8 bg-green-600 hover:bg-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowNewForm(false); setEditingId(null); resetForm(); }} className="h-8 text-red-400 hover:bg-red-500/10">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Fila adicional para uploads de archivos */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-orange-500/5">
                    <TableCell colSpan={hasHourlyPayments ? 11 : 10} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white mb-2 block">Comprobantes de Pago</Label>
                          <FileUpload
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            category="expenses"
                            maxSize={10 * 1024 * 1024}
                            onUploadComplete={(url) => {
                              setPaymentProofFiles(prev => [...prev, url]);
                              // Auto-marcar como pagado si sube comprobante
                              setFormData(prev => ({ ...prev, status: "paid" }));
                            }}
                            onUploadError={(error) => console.error("Error uploading file:", error)}
                          />
                          {paymentProofFiles.length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                              {paymentProofFiles.length} archivo(s) subido(s)
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="text-white mb-2 block">Facturas (PDF, XML, ZIP)</Label>
                          <FileUpload
                            accept=".pdf,.xml,.zip"
                            category="expenses"
                            maxSize={10 * 1024 * 1024}
                            onUploadComplete={(url) => setInvoiceFiles(prev => [...prev, url])}
                            onUploadError={(error) => console.error("Error uploading file:", error)}
                          />
                          {invoiceFiles.length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                              {invoiceFiles.length} archivo(s) subido(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Transactions */}
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="p-3 text-gray-300 text-sm">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {transaction.paymentType === "provider" ? "Proveedor" : "Empleado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-3 text-white text-sm">
                      {transaction.providerName || transaction.employeeName}
                    </TableCell>
                    <TableCell className="p-3 text-gray-300 text-sm">{transaction.description}</TableCell>
                    {hasHourlyPayments && (
                      <TableCell className="p-3 text-white text-sm text-center">
                        {transaction.hoursWorked ? `${transaction.hoursWorked}h` : "-"}
                      </TableCell>
                    )}
                    <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell className="p-3">
                      {transaction.bankAccountName ? (
                        <div className="text-gray-300 text-sm">
                          <div>{transaction.bankAccountName}</div>
                          {bankAccounts.find(a => a.id === transaction.bankAccountId)?.last4 && (
                            <div className="text-xs text-gray-500">
                              *{bankAccounts.find(a => a.id === transaction.bankAccountId)?.last4}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell className="p-3">
                      {transaction.paymentStatus === "paid" && (
                        <Badge className="bg-green-500/20 text-green-500 text-xs">Pagado</Badge>
                      )}
                      {transaction.paymentStatus === "pending" && (
                        <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Pendiente</Badge>
                      )}
                      {transaction.paymentStatus === "debt" && (
                        <Badge className="bg-red-500/20 text-red-500 text-xs">Deuda</Badge>
                      )}
                    </TableCell>
                    <TableCell className="p-3 text-xs space-y-1">
                      {transaction.paymentProofFiles.length > 0 && (
                        <button
                          onClick={() => handleViewFile(transaction.paymentProofFiles[0], `Comprobante ${transaction.id}`)}
                          className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{transaction.paymentProofFiles.length} comprobante(s)</span>
                        </button>
                      )}
                      {transaction.invoiceFiles.length > 0 && (
                        <button
                          onClick={() => handleViewFile(transaction.invoiceFiles[0], `Factura ${transaction.id}`)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{transaction.invoiceFiles.length} factura(s)</span>
                        </button>
                      )}
                      {transaction.paymentProofFiles.length === 0 && transaction.invoiceFiles.length === 0 && (
                        <div className="text-gray-500">Sin archivos</div>
                      )}
                    </TableCell>
                    <TableCell className="p-3">{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center gap-1">
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

      {/* File Preview Modal */}
      <FilePreviewModal
        fileUrl={previewFileUrl}
        fileName={previewFileName}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
