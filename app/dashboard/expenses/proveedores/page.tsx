"use client";

import { useState } from "react";
import { Plus, Search, Check, X, Trash2, ChevronDown, Building } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
type Provider = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  category: string;
  status: "active" | "inactive";
  paymentTerms?: string; // Términos de pago (ej: 30 días)
  contactPerson?: string;
  notes?: string;
};

// Mock Data
const mockProviders: Provider[] = [
  {
    id: "1",
    name: "Amazon Web Services Mexico",
    company: "AWS",
    email: "aws-mexico@amazon.com",
    phone: "+52 55 5000 0000",
    address: "Av. Reforma 222",
    city: "Ciudad de México",
    state: "CDMX",
    category: "Cloud & Hosting",
    status: "active",
    paymentTerms: "Pago inmediato",
    contactPerson: "Soporte AWS México"
  },
  {
    id: "2",
    name: "Microsoft Corporation",
    company: "Microsoft 365",
    email: "mexico@microsoft.com",
    phone: "+52 55 9000 0000",
    address: "Paseo de la Reforma 505",
    city: "Ciudad de México",
    state: "CDMX",
    category: "Software y Licencias",
    status: "active",
    paymentTerms: "30 días",
    contactPerson: "Equipo Comercial MX"
  },
  {
    id: "3",
    name: "Papelería y Suministros SA de CV",
    company: "Papelería El Águila",
    email: "ventas@papelaaguila.com",
    phone: "+52 55 1234 5678",
    address: "Calle Juárez 123",
    city: "Guadalajara",
    state: "Jalisco",
    category: "Suministros de Oficina",
    status: "active",
    paymentTerms: "15 días",
    contactPerson: "Laura González"
  },
  {
    id: "4",
    name: "OpenAI LP",
    company: "OpenAI",
    email: "support@openai.com",
    phone: "+1 415 555 0100",
    address: "3180 18th Street",
    city: "San Francisco",
    state: "California",
    category: "APIs de IA",
    status: "active",
    paymentTerms: "Pago inmediato",
    contactPerson: "OpenAI Support"
  }
];

const categories = [
  "Cloud & Hosting",
  "Software y Licencias",
  "APIs de IA",
  "Hardware y Equipos",
  "Suministros de Oficina",
  "Servicios Profesionales",
  "Marketing Digital",
  "Capacitación y Formación",
  "Telecomunicaciones",
  "Mantenimiento",
  "Transporte y Logística",
  "Otros"
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Provider>>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    category: "",
    status: "active",
    paymentTerms: "",
    contactPerson: "",
    notes: ""
  });

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || provider.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      category: "",
      status: "active",
      paymentTerms: "",
      contactPerson: "",
      notes: ""
    });
  };

  const handleCreate = () => {
    if (!formData.company || !formData.email) {
      alert("Por favor completa los campos obligatorios: Empresa, Email");
      return;
    }

    const newProvider: Provider = {
      id: Date.now().toString(),
      name: formData.name || formData.company || "",
      company: formData.company || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      category: formData.category || "Otros",
      status: formData.status || "active",
      paymentTerms: formData.paymentTerms,
      contactPerson: formData.contactPerson,
      notes: formData.notes
    };

    setProviders(prev => [newProvider, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleEdit = (provider: Provider) => {
    setEditingId(provider.id);
    setFormData(provider);
  };

  const handleUpdate = () => {
    if (!formData.company || !formData.email) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setProviders(prev => prev.map(prov => 
      prov.id === editingId ? { ...prov, ...formData } as Provider : prov
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setProviders(prev => prev.filter(prov => prov.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Activo", className: "bg-green-500/20 text-green-500" },
      inactive: { label: "Inactivo", className: "bg-gray-500/20 text-gray-500" }
    }[status] || { label: status, className: "bg-gray-500/20 text-gray-500" };
    
    return <Badge className={`${config.className} text-xs`}>{config.label}</Badge>;
  };

  const activeProviders = providers.filter(p => p.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Proveedores</h1>
          <p className="text-sm text-gray-400">Gestión de proveedores y servicios</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Proveedores</CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{providers.length}</div>
            <p className="text-xs text-gray-500">{activeProviders} activos</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(providers.map(p => p.category)).size}</div>
            <p className="text-xs text-gray-500">Tipos de servicio</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{new Set(providers.map(p => p.state)).size}</div>
            <p className="text-xs text-gray-500">Ubicaciones</p>
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
                placeholder="Buscar por empresa, email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px] bg-slate-900 border-white/10 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white">Todos</SelectItem>
                <SelectItem value="active" className="text-white">Activo</SelectItem>
                <SelectItem value="inactive" className="text-white">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Lista de Proveedores</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredProviders.length} proveedor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[200px]">Empresa</TableHead>
                  <TableHead className="text-gray-400 w-[200px]">Email</TableHead>
                  <TableHead className="text-gray-400 w-[140px]">Teléfono</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Categoría</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Contacto</TableHead>
                  <TableHead className="text-gray-400 w-[150px]">Ciudad/Estado</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Términos Pago</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Estado</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* New Form Row */}
                {showNewForm && (
                  <TableRow className="border-white/10 bg-indigo-500/5">
                    <TableCell className="p-2">
                      <Input
                        placeholder="Nombre de la empresa *"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="RFC *"
                        value={formData.rfc}
                        onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                        className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8 uppercase"
                        maxLength={13}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="email"
                        placeholder="email@empresa.com *"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="+52 55 1234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="text-white text-sm">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.taxRegime} onValueChange={(value) => setFormData(prev => ({ ...prev, taxRegime: value }))}>
                        <SelectTrigger className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 max-h-[300px]">
                          {taxRegimes.map((regime) => (
                            <SelectItem key={regime.value} value={regime.value} className="text-white text-sm">{regime.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="space-y-1">
                        <Input
                          placeholder="Ciudad"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-gray-800 border-indigo-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="active" className="text-white text-sm">Activo</SelectItem>
                          <SelectItem value="inactive" className="text-white text-sm">Inactivo</SelectItem>
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

                {/* Existing Providers */}
                {filteredProviders.map((provider) => {
                  const isEditing = editingId === provider.id;
                  
                  return (
                    <TableRow key={provider.id} className={`border-white/10 hover:bg-white/5 ${isEditing ? 'bg-blue-500/5' : ''}`}>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <div>
                            <div className="text-white text-sm font-medium">{provider.company}</div>
                            {provider.name !== provider.company && (
                              <div className="text-gray-400 text-xs">{provider.name}</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.rfc}
                            onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8 uppercase"
                            maxLength={13}
                          />
                        ) : (
                          <span className="text-gray-300 text-sm font-mono">{provider.rfc}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-300 text-sm">{provider.email}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <span className="text-gray-300 text-sm">{provider.phone}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat} className="text-white text-sm">{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="text-xs">{provider.category}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Select value={formData.taxRegime} onValueChange={(value) => setFormData(prev => ({ ...prev, taxRegime: value }))}>
                            <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600 max-h-[300px]">
                              {taxRegimes.map((regime) => (
                                <SelectItem key={regime.value} value={regime.value} className="text-white text-sm">{regime.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-gray-300 text-sm">{provider.taxRegime}</span>
                        )}
                      </TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                            className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                          />
                        ) : (
                          <div className="text-gray-300 text-sm">
                            <div>{provider.city}</div>
                            <div className="text-gray-500 text-xs">{provider.state}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="p-3">{getStatusBadge(provider.status)}</TableCell>
                      <TableCell className="p-3">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={handleUpdate} className="h-8 bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); resetForm(); }} className="h-8 text-gray-400 hover:bg-gray-700">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(provider)}
                              className="h-8 text-blue-400 hover:bg-blue-500/10"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(provider.id)}
                              className="h-8 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
