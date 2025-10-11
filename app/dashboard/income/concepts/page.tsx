"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Check, X, DollarSign } from "lucide-react";

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

type Concept = {
  id: string;
  name: string;
  description: string;
  defaultAmount: number;
  // Datos SAT para facturación
  claveProdServ: string; // Clave Producto/Servicio SAT
  claveUnidad: string; // Clave Unidad SAT
  unidad: string; // Descripción unidad
  objetoImp: string; // Objeto de impuesto
  tasaIVA: number; // 0, 8, 16
  tasaRetencionISR: number; // 0, 10.67, etc
  // Adicionales
  category: string;
  usageCount: number;
  status: "active" | "inactive";
};

const mockConcepts: Concept[] = [
  {
    id: "1",
    name: "Servicios Contables",
    description: "Servicios de contabilidad general mensual",
    defaultAmount: 15000,
    claveProdServ: "80101600",
    claveUnidad: "E48",
    unidad: "Servicio",
    objetoImp: "02",
    tasaIVA: 16,
    tasaRetencionISR: 0,
    category: "Servicios Profesionales",
    usageCount: 45,
    status: "active"
  },
  {
    id: "2",
    name: "Consultoría Financiera",
    description: "Asesoría en finanzas corporativas por hora",
    defaultAmount: 2500,
    claveProdServ: "80141600",
    claveUnidad: "HUR",
    unidad: "Hora",
    objetoImp: "02",
    tasaIVA: 16,
    tasaRetencionISR: 10.67,
    category: "Consultoría",
    usageCount: 32,
    status: "active"
  },
  {
    id: "3",
    name: "Auditoría Externa",
    description: "Auditoría de estados financieros",
    defaultAmount: 35000,
    claveProdServ: "80101700",
    claveUnidad: "E48",
    unidad: "Servicio",
    objetoImp: "02",
    tasaIVA: 16,
    tasaRetencionISR: 0,
    category: "Auditoría",
    usageCount: 18,
    status: "active"
  }
];

// Catálogo simplificado de Claves Producto/Servicio más comunes
const clavesProdServ = [
  { value: "80101600", label: "80101600 - Servicios de contabilidad" },
  { value: "80101700", label: "80101700 - Servicios de auditoría" },
  { value: "80141600", label: "80141600 - Servicios de consultoría de negocios y administración corporativa" },
  { value: "81112000", label: "81112000 - Servicios de asesoría legal" },
  { value: "84131800", label: "84131800 - Servicios de diseño gráfico" },
  { value: "81101500", label: "81101500 - Servicios de consultoría en administración" },
  { value: "43231500", label: "43231500 - Software de aplicación" },
  { value: "81111700", label: "81111700 - Servicios de preparación de impuestos" },
  { value: "10000000", label: "10000000 - Productos agrícolas vivos" },
  { value: "01010101", label: "01010101 - No existe en el catálogo" }
];

// Catálogo de Unidades SAT más comunes
const clavesUnidad = [
  { value: "E48", label: "E48 - Servicio" },
  { value: "ACT", label: "ACT - Actividad" },
  { value: "H87", label: "H87 - Pieza" },
  { value: "HUR", label: "HUR - Hora" },
  { value: "KGM", label: "KGM - Kilogramo" },
  { value: "MTR", label: "MTR - Metro" },
  { value: "LTR", label: "LTR - Litro" },
  { value: "XBX", label: "XBX - Caja" },
  { value: "XPK", label: "XPK - Paquete" },
  { value: "DAY", label: "DAY - Día" },
  { value: "MON", label: "MON - Mes" },
  { value: "ANN", label: "ANN - Año" }
];

// Catálogo Objeto de Impuesto
const objetosImpuesto = [
  { value: "01", label: "01 - No objeto de impuesto" },
  { value: "02", label: "02 - Sí objeto de impuesto" },
  { value: "03", label: "03 - Sí objeto del impuesto y no obligado al desglose" },
  { value: "04", label: "04 - Sí objeto del impuesto y no causa impuesto" }
];

// Tasas IVA
const tasasIVA = [
  { value: 0, label: "0% - Exento" },
  { value: 8, label: "8% - Zona fronteriza" },
  { value: 16, label: "16% - General" }
];

// Tasas Retención ISR
const tasasRetencionISR = [
  { value: 0, label: "0% - Sin retención" },
  { value: 10, label: "10% - Arrendamiento" },
  { value: 10.67, label: "10.67% - Honorarios" }
];

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>(mockConcepts);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultAmount: "",
    claveProdServ: "80101600",
    claveUnidad: "E48",
    unidad: "Servicio",
    objetoImp: "02",
    tasaIVA: 16,
    tasaRetencionISR: 0,
    category: "",
    status: "active" as "active" | "inactive"
  });

  const filteredConcepts = concepts.filter(concept =>
    concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.claveProdServ.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      defaultAmount: "",
      claveProdServ: "80101600",
      claveUnidad: "E48",
      unidad: "Servicio",
      objetoImp: "02",
      tasaIVA: 16,
      tasaRetencionISR: 0,
      category: "",
      status: "active"
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.defaultAmount) {
      alert("Por favor completa los campos obligatorios: Nombre y Precio");
      return;
    }
    const newConcept: Concept = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      defaultAmount: parseFloat(formData.defaultAmount),
      claveProdServ: formData.claveProdServ,
      claveUnidad: formData.claveUnidad,
      unidad: formData.unidad,
      objetoImp: formData.objetoImp,
      tasaIVA: formData.tasaIVA,
      tasaRetencionISR: formData.tasaRetencionISR,
      category: formData.category,
      usageCount: 0,
      status: formData.status
    };
    setConcepts(prev => [newConcept, ...prev]);
    setShowNewForm(false);
    resetForm();
  };

  const handleStartEdit = (concept: Concept) => {
    setEditingId(concept.id);
    setFormData({
      name: concept.name,
      description: concept.description,
      defaultAmount: concept.defaultAmount.toString(),
      claveProdServ: concept.claveProdServ,
      claveUnidad: concept.claveUnidad,
      unidad: concept.unidad,
      objetoImp: concept.objetoImp,
      tasaIVA: concept.tasaIVA,
      tasaRetencionISR: concept.tasaRetencionISR,
      category: concept.category,
      status: concept.status
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const updatedConcept: Concept = {
      ...concepts.find(c => c.id === editingId)!,
      name: formData.name,
      description: formData.description,
      defaultAmount: parseFloat(formData.defaultAmount),
      claveProdServ: formData.claveProdServ,
      claveUnidad: formData.claveUnidad,
      unidad: formData.unidad,
      objetoImp: formData.objetoImp,
      tasaIVA: formData.tasaIVA,
      tasaRetencionISR: formData.tasaRetencionISR,
      category: formData.category,
      status: formData.status
    };
    setConcepts(prev => prev.map(c => c.id === editingId ? updatedConcept : c));
    setEditingId(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este concepto?")) {
      setConcepts(prev => prev.filter(c => c.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const totalRevenue = concepts.reduce((sum, c) => sum + (c.defaultAmount * c.usageCount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Conceptos</h1>
          <p className="text-sm text-gray-400">Catálogo de productos/servicios con datos fiscales SAT</p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          {showNewForm ? <><X className="mr-2 h-4 w-4" /> Cancelar</> : <><Plus className="mr-2 h-4 w-4" /> Nuevo Concepto</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Conceptos</CardTitle>
            <Tag className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{concepts.length}</div>
            <p className="text-xs text-green-500">
              {concepts.filter(c => c.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(concepts.reduce((sum, c) => sum + c.defaultAmount, 0) / (concepts.length || 1))}
            </div>
            <p className="text-xs text-gray-500">Por concepto</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Usos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {concepts.reduce((sum, c) => sum + c.usageCount, 0)}
            </div>
            <p className="text-xs text-gray-500">Veces facturado</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ingresos Generados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">Histórico</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción, categoría o clave SAT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Concepts Table */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Catálogo de Conceptos</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredConcepts.length} concepto(s) encontrado(s) - Edición inline con datos SAT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-400 w-[200px]">Concepto</TableHead>
                  <TableHead className="text-gray-400 w-[140px]">Clave Prod/Serv</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Unidad</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Precio</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">IVA</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Ret. ISR</TableHead>
                  <TableHead className="text-gray-400 w-[120px]">Obj. Impuesto</TableHead>
                  <TableHead className="text-gray-400 w-[100px]">Usos</TableHead>
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
                          placeholder="Nombre del concepto *"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                        <Input
                          placeholder="Descripción"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                        <Input
                          placeholder="Categoría"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.claveProdServ} onValueChange={(value) => setFormData(prev => ({ ...prev, claveProdServ: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                          {clavesProdServ.map((clave) => (
                            <SelectItem key={clave.value} value={clave.value} className="text-white text-xs hover:bg-gray-700">
                              {clave.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.claveUnidad} onValueChange={(value) => {
                        const unidadSeleccionada = clavesUnidad.find(u => u.value === value);
                        setFormData(prev => ({ 
                          ...prev, 
                          claveUnidad: value,
                          unidad: unidadSeleccionada?.label.split(' - ')[1] || value
                        }));
                      }}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                          {clavesUnidad.map((unidad) => (
                            <SelectItem key={unidad.value} value={unidad.value} className="text-white text-xs hover:bg-gray-700">
                              {unidad.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Precio *"
                        value={formData.defaultAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, defaultAmount: e.target.value }))}
                        className="bg-gray-800 border-blue-500/30 text-white text-sm h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.tasaIVA.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, tasaIVA: parseInt(value) }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {tasasIVA.map((tasa) => (
                            <SelectItem key={tasa.value} value={tasa.value.toString()} className="text-white text-sm hover:bg-gray-700">
                              {tasa.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.tasaRetencionISR.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, tasaRetencionISR: parseFloat(value) }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {tasasRetencionISR.map((tasa) => (
                            <SelectItem key={tasa.value} value={tasa.value.toString()} className="text-white text-sm hover:bg-gray-700">
                              {tasa.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2">
                      <Select value={formData.objetoImp} onValueChange={(value) => setFormData(prev => ({ ...prev, objetoImp: value }))}>
                        <SelectTrigger className="bg-gray-800 border-blue-500/30 text-white text-sm h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {objetosImpuesto.map((obj) => (
                            <SelectItem key={obj.value} value={obj.value} className="text-white text-sm hover:bg-gray-700">
                              {obj.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-2 text-center text-gray-500 text-sm">0</TableCell>
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

                {/* Existing Concepts */}
                {filteredConcepts.map((concept) => (
                  editingId === concept.id ? (
                    // Editing Row
                    <TableRow key={concept.id} className="border-white/10 bg-yellow-500/5">
                      <TableCell className="p-2">
                        <div className="space-y-1">
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                          <Input
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                          <Input
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.claveProdServ} onValueChange={(value) => setFormData(prev => ({ ...prev, claveProdServ: value }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                            {clavesProdServ.map((clave) => (
                              <SelectItem key={clave.value} value={clave.value} className="text-white text-xs hover:bg-gray-700">
                                {clave.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.claveUnidad} onValueChange={(value) => {
                          const unidadSeleccionada = clavesUnidad.find(u => u.value === value);
                          setFormData(prev => ({ 
                            ...prev, 
                            claveUnidad: value,
                            unidad: unidadSeleccionada?.label.split(' - ')[1] || value
                          }));
                        }}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                            {clavesUnidad.map((unidad) => (
                              <SelectItem key={unidad.value} value={unidad.value} className="text-white text-xs hover:bg-gray-700">
                                {unidad.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.defaultAmount}
                          onChange={(e) => setFormData(prev => ({ ...prev, defaultAmount: e.target.value }))}
                          className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.tasaIVA.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, tasaIVA: parseInt(value) }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {tasasIVA.map((tasa) => (
                              <SelectItem key={tasa.value} value={tasa.value.toString()} className="text-white text-sm hover:bg-gray-700">
                                {tasa.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.tasaRetencionISR.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, tasaRetencionISR: parseFloat(value) }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {tasasRetencionISR.map((tasa) => (
                              <SelectItem key={tasa.value} value={tasa.value.toString()} className="text-white text-sm hover:bg-gray-700">
                                {tasa.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select value={formData.objetoImp} onValueChange={(value) => setFormData(prev => ({ ...prev, objetoImp: value }))}>
                          <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white text-sm h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {objetosImpuesto.map((obj) => (
                              <SelectItem key={obj.value} value={obj.value} className="text-white text-sm hover:bg-gray-700">
                                {obj.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2 text-white text-sm">{concept.usageCount}</TableCell>
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
                    <TableRow key={concept.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="p-3">
                        <div className="space-y-1">
                          <div className="text-white font-medium text-sm">{concept.name}</div>
                          <div className="text-gray-400 text-xs">{concept.description}</div>
                          {concept.category && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">{concept.category}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-3 text-gray-300 font-mono text-xs">{concept.claveProdServ}</TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">
                        <div className="font-mono">{concept.claveUnidad}</div>
                        <div className="text-gray-500">{concept.unidad}</div>
                      </TableCell>
                      <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(concept.defaultAmount)}</TableCell>
                      <TableCell className="p-3 text-green-400 text-sm">{concept.tasaIVA}%</TableCell>
                      <TableCell className="p-3 text-orange-400 text-sm">{concept.tasaRetencionISR}%</TableCell>
                      <TableCell className="p-3 text-gray-300 text-xs">{objetosImpuesto.find(o => o.value === concept.objetoImp)?.label}</TableCell>
                      <TableCell className="p-3 text-white text-sm text-center">{concept.usageCount}</TableCell>
                      <TableCell className="p-3">
                        <Badge className={concept.status === 'active' ? 'bg-green-500/20 text-green-500 text-xs' : 'bg-gray-500/20 text-gray-500 text-xs'}>
                          {concept.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(concept)}
                            className="h-8 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(concept.id)}
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
