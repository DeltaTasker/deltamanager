"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

type Concept = {
  id: string;
  name: string;
  description: string;
  defaultAmount: number;
  category: string;
  usageCount: number;
  status: "active" | "inactive";
};

const mockConcepts: Concept[] = [
  {
    id: "1",
    name: "Servicios Contables",
    description: "Servicios de contabilidad general",
    defaultAmount: 15000,
    category: "Servicios Profesionales",
    usageCount: 45,
    status: "active"
  },
  {
    id: "2",
    name: "Consultoría Financiera",
    description: "Asesoría en finanzas corporativas",
    defaultAmount: 25000,
    category: "Consultoría",
    usageCount: 32,
    status: "active"
  },
  {
    id: "3",
    name: "Auditoría Externa",
    description: "Auditoría de estados financieros",
    defaultAmount: 35000,
    category: "Auditoría",
    usageCount: 18,
    status: "active"
  },
  {
    id: "4",
    name: "Declaración Fiscal",
    description: "Preparación y presentación de declaraciones",
    defaultAmount: 5000,
    category: "Servicios Fiscales",
    usageCount: 67,
    status: "active"
  },
  {
    id: "5",
    name: "Nómina Mensual",
    description: "Cálculo y procesamiento de nómina",
    defaultAmount: 8000,
    category: "Servicios de Nómina",
    usageCount: 52,
    status: "inactive"
  }
];

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<Concept[]>(mockConcepts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConcepts = concepts.filter(concept =>
    concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-white">Conceptos de Ingreso</h1>
          <p className="text-sm text-gray-400">Define y gestiona los conceptos de facturación</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Concepto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Conceptos</CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-400">Más Usado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {Math.max(...concepts.map(c => c.usageCount))}
            </div>
            <p className="text-xs text-gray-500">veces facturado</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monto Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(concepts.reduce((sum, c) => sum + c.defaultAmount, 0) / concepts.length)}
            </div>
            <p className="text-xs text-gray-500">por concepto</p>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Usos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {concepts.reduce((sum, c) => sum + c.usageCount, 0)}
            </div>
            <p className="text-xs text-gray-500">facturas generadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción o categoría..."
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
          <CardTitle className="text-white">Lista de Conceptos</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredConcepts.length} concepto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-400">Concepto</TableHead>
                <TableHead className="text-gray-400">Categoría</TableHead>
                <TableHead className="text-gray-400">Monto Predeterminado</TableHead>
                <TableHead className="text-gray-400">Usos</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
                <TableHead className="text-gray-400">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConcepts.map((concept) => (
                <TableRow key={concept.id} className="border-white/10">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{concept.name}</p>
                      <p className="text-xs text-gray-400">{concept.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-purple-400" />
                      {concept.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-white font-semibold">
                    {formatCurrency(concept.defaultAmount)}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      {concept.usageCount} veces
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={concept.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                      {concept.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
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
    </div>
  );
}

