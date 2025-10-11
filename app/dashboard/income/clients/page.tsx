"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Mail, Phone, Building, Check, X, ChevronDown, ChevronUp } from "lucide-react";

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

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  // Datos fiscales
  rfc: string;
  regimenFiscal: string;
  usoCFDI: string;
  codigoPostal: string;
  // Adicionales
  totalInvoiced: number;
  status: "active" | "inactive";
};

const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@empresaabc.com",
    phone: "+52 55 1234 5678",
    company: "Empresa ABC S.A. de C.V.",
    rfc: "EAB970312A45",
    regimenFiscal: "601",
    usoCFDI: "G03",
    codigoPostal: "01000",
    totalInvoiced: 125000,
    status: "active"
  },
  {
    id: "2",
    name: "María González",
    email: "maria@techsolutions.com",
    phone: "+52 55 8765 4321",
    company: "Tech Solutions Inc.",
    rfc: "TSI850615RT4",
    regimenFiscal: "601",
    usoCFDI: "G03",
    codigoPostal: "03100",
    totalInvoiced: 250000,
    status: "active"
  }
];

const regimenesFiscales = [
  { value: "601", label: "601 - General de Ley Personas Morales" },
  { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { value: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { value: "606", label: "606 - Arrendamiento" },
  { value: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
  { value: "621", label: "621 - Incorporación Fiscal" },
  { value: "625", label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
  { value: "626", label: "626 - Régimen Simplificado de Confianza" }
];

const usosCFDI = [
  { value: "G01", label: "G01 - Adquisición de mercancías" },
  { value: "G02", label: "G02 - Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "G03 - Gastos en general" },
  { value: "I01", label: "I01 - Construcciones" },
  { value: "I02", label: "I02 - Mobilario y equipo de oficina por inversiones" },
  { value: "I03", label: "I03 - Equipo de transporte" },
  { value: "I04", label: "I04 - Equipo de computo y accesorios" },
  { value: "I05", label: "I05 - Dados, troqueles, moldes, matrices y herramental" },
  { value: "I08", label: "I08 - Otra maquinaria y equipo" },
  { value: "D01", label: "D01 - Honorarios médicos, dentales y gastos hospitalarios" },
  { value: "D04", label: "D04 - Donativos" },
  { value: "P01", label: "P01 - Por definir" }
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    rfc: "",
    regimenFiscal: "612",
    usoCFDI: "G03",
    codigoPostal: "",
    status: "active" as "active" | "inactive"
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      rfc: "",
      regimenFiscal: "612",
      usoCFDI: "G03",
      codigoPostal: "",
      status: "active"
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.company || !formData.rfc) {
      alert("Por favor completa los campos obligatorios: Nombre, Empresa y RFC");
      return;
    }
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      rfc: formData.rfc.toUpperCase(),
      regimenFiscal: formData.regimenFiscal,
      usoCFDI: formData.usoCFDI,
      codigoPostal: formData.codigoPostal,
      totalInvoiced: 0,
      status: formData.status
    };
    setClients(prev => [newClient, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleStartEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      rfc: client.rfc,
      regimenFiscal: client.regimenFiscal,
      usoCFDI: client.usoCFDI,
      codigoPostal: client.codigoPostal,
      status: client.status
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updatedClient: Client = {
      ...clients.find(c => c.id === editingId)!,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      rfc: formData.rfc.toUpperCase(),
      regimenFiscal: formData.regimenFiscal,
      usoCFDI: formData.usoCFDI,
      codigoPostal: formData.codigoPostal,
      status: formData.status
    };
    setClients(prev => prev.map(c => c.id === editingId ? updatedClient : c));
    setEditingId(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
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
          <p className="text-sm text-gray-400">Gestiona tu cartera de clientes con datos fiscales</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Cliente</>}
        </Button>
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
              placeholder="Buscar por nombre, empresa, email o RFC..."
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
            {filteredClients.length} cliente(s) encontrado(s) - Edición inline estilo Excel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[180px]">Cliente / Empresa</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Contacto</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">RFC</TableHead>
                  <TableHead className="text-gray-400 w-[180px]">Régimen Fiscal</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Uso CFDI</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">C.P.</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Total Facturado</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-blue-500/5">
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <Input
                          placeholder="Nombre completo *"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                        <Input
                          placeholder="Empresa *"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                        <Input
                          placeholder="Teléfono"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="RFC *"
                        value={formData.rfc}
                        onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                        maxLength={13}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.regimenFiscal} onValueChange={(value) => setFormData(prev => ({ ...prev, regimenFiscal: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {regimenesFiscales.map((regimen) => (
                            <SelectItem key={regimen.value} value={regimen.value} className="text-white text-sm hover:bg-gray-700">
                              {regimen.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.usoCFDI} onValueChange={(value) => setFormData(prev => ({ ...prev, usoCFDI: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                          {usosCFDI.map((uso) => (
                            <SelectItem key={uso.value} value={uso.value} className="text-white text-sm hover:bg-gray-700">
                              {uso.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="C.P."
                        value={formData.codigoPostal}
                        onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
                        maxLength={5}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2 text-center text-gray-500 text-sm">
                      $0.00
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="active" className="text-white text-sm hover:bg-gray-700">Activo</SelectItem>
                          <SelectItem value="inactive" className="text-white text-sm hover:bg-gray-700">Inactivo</SelectItem>
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

                {/* Existing Clients */}
                {filteredClients.map((client) => (
                  editingId === client.id ? (
                    // Editing Row
                    <TableRow key={client.id} className="border-white/10 bg-yellow-500/5">
                      <TableCell className="p-2">
                        <div className="space-y-1">
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                          <Input
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="space-y-1">
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          value={formData.rfc}
                          onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                          maxLength={13}
                          className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.regimenFiscal} onValueChange={(value) => setFormData(prev => ({ ...prev, regimenFiscal: value }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {regimenesFiscales.map((regimen) => (
                              <SelectItem key={regimen.value} value={regimen.value} className="text-white text-sm hover:bg-gray-700">
                                {regimen.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.usoCFDI} onValueChange={(value) => setFormData(prev => ({ ...prev, usoCFDI: value }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                            {usosCFDI.map((uso) => (
                              <SelectItem key={uso.value} value={uso.value} className="text-white text-sm hover:bg-gray-700">
                                {uso.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          value={formData.codigoPostal}
                          onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
                          maxLength={5}
                          className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                        />
                      </TableCell>
                      <TableCell className="p-2 text-white font-semibold text-sm">
                        {formatCurrency(client.totalInvoiced)}
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="active" className="text-white text-sm hover:bg-gray-700">Activo</SelectItem>
                            <SelectItem value="inactive" className="text-white text-sm hover:bg-gray-700">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleSaveEdit} className="h-8 bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 text-red-400 hover:bg-red-500/10">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // View Row
                    <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="p-3">
                        <div className="space-y-1">
                          <div className="text-white font-medium text-sm">{client.name}</div>
                          <div className="flex items-center gap-1 text-gray-400 text-xs">
                            <Building className="h-3 w-3" />
                            {client.company}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">
                        <div className="space-y-1">
                          {client.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-white font-mono text-xs">{client.rfc}</TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">
                        {regimenesFiscales.find(r => r.value === client.regimenFiscal)?.label || client.regimenFiscal}
                      </TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">
                        {usosCFDI.find(u => u.value === client.usoCFDI)?.label || client.usoCFDI}
                      </TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">{client.codigoPostal}</TableCell>
                      <TableCell className="p-3 text-white font-semibold text-sm">
                        {formatCurrency(client.totalInvoiced)}
                      </TableCell>
                      <TableCell className="p-3">
                        <Badge className={client.status === 'active' ? 'bg-green-500/20 text-green-500 text-xs' : 'bg-gray-500/20 text-gray-500 text-xs'}>
                          {client.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(client)}
                            className="h-8 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            className="h-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
