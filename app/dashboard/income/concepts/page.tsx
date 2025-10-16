"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { 
  loadConcepts, 
  createConcept, 
  updateConcept, 
  deleteConcept,
  type SerializedConcept 
} from "@/app/actions/concepts";

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<SerializedConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultAmount: "",
    claveProdServ: "",
    claveUnidad: "E48",
    objetoImp: "02",
    tasaIVA: "16",
    tasaRetencionISR: "10.67",
    tasaRetencionIVA: "0",
    ivaIncluded: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      const data = await loadConcepts(companyId);
      setConcepts(data);
    } catch (error) {
      console.error("Error loading concepts:", error);
      toast.error("Error al cargar conceptos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const result = await createConcept({
        companyId,
        name: formData.name,
        description: formData.description || undefined,
        defaultAmount: formData.defaultAmount ? parseFloat(formData.defaultAmount) : undefined,
        claveProdServ: formData.claveProdServ || undefined,
        claveUnidad: formData.claveUnidad || undefined,
        objetoImp: formData.objetoImp || undefined,
        tasaIVA: parseFloat(formData.tasaIVA),
        tasaRetencionISR: parseFloat(formData.tasaRetencionISR),
        tasaRetencionIVA: parseFloat(formData.tasaRetencionIVA),
        ivaIncluded: formData.ivaIncluded,
      });

      if (result.success) {
        toast.success("Concepto creado exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear concepto");
      }
    } catch (error) {
      console.error("Error creating concept:", error);
      toast.error("Error al crear concepto");
    }
  };

  const handleStartEdit = (concept: SerializedConcept) => {
    setEditingId(concept.id);
    setFormData({
      name: concept.name,
      description: concept.description || "",
      defaultAmount: concept.defaultAmount?.toString() || "",
      claveProdServ: concept.claveProdServ || "",
      claveUnidad: concept.claveUnidad || "E48",
      objetoImp: concept.objetoImp || "02",
      tasaIVA: concept.tasaIVA.toString(),
      tasaRetencionISR: concept.tasaRetencionISR.toString(),
      tasaRetencionIVA: concept.tasaRetencionIVA.toString(),
      ivaIncluded: concept.ivaIncluded || false,
    });
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateConcept({
        id: editingId,
        name: formData.name,
        description: formData.description || undefined,
        defaultAmount: formData.defaultAmount ? parseFloat(formData.defaultAmount) : undefined,
        claveProdServ: formData.claveProdServ || undefined,
        claveUnidad: formData.claveUnidad || undefined,
        objetoImp: formData.objetoImp || undefined,
        tasaIVA: parseFloat(formData.tasaIVA),
        tasaRetencionISR: parseFloat(formData.tasaRetencionISR),
        tasaRetencionIVA: parseFloat(formData.tasaRetencionIVA),
        ivaIncluded: formData.ivaIncluded,
      });

      if (result.success) {
        toast.success("Concepto actualizado exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar concepto");
      }
    } catch (error) {
      console.error("Error updating concept:", error);
      toast.error("Error al actualizar concepto");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteConcept(deleteTargetId);

      if (result.success) {
        toast.success("Concepto eliminado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar concepto");
      }
    } catch (error) {
      console.error("Error deleting concept:", error);
      toast.error("Error al eliminar concepto");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      defaultAmount: "",
      claveProdServ: "",
      claveUnidad: "E48",
      objetoImp: "02",
      tasaIVA: "16",
      tasaRetencionISR: "10.67",
      tasaRetencionIVA: "0",
      ivaIncluded: false,
    });
  };

  const filteredConcepts = concepts.filter((concept) =>
    concept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (concept.description && concept.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (concept.claveProdServ && concept.claveProdServ.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper function to calculate display values
  const calculateConceptDisplay = (concept: SerializedConcept) => {
    const price = concept.defaultAmount || 0;
    const tasaIVA = concept.tasaIVA / 100;
    
    if (concept.ivaIncluded) {
      // IVA Incluido: el precio ya incluye el IVA
      const subtotal = parseFloat((price / (1 + tasaIVA)).toFixed(2));
      const impuestos = parseFloat((price - subtotal).toFixed(2));
      return {
        precio: subtotal,
        impuestos,
        cobro: price,
        forma: "IVA Incluido"
      };
    } else {
      // +IVA: el precio es sin IVA, se suma
      const impuestos = parseFloat((price * tasaIVA).toFixed(2));
      const cobro = parseFloat((price + impuestos).toFixed(2));
      return {
        precio: price,
        impuestos,
        cobro,
        forma: "+IVA"
      };
    }
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Conceptos</h1>
          <p className="text-muted-foreground">Gestión de productos y servicios</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Nuevo Concepto"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Concepto" : "Nuevo Concepto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Nombre *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Desarrollo de Software"
                />
              </div>

              <div className="col-span-2">
                <Label>Descripción</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Servicios de desarrollo de software a medida"
                />
              </div>

              <div>
                <Label>Precio por Defecto</Label>
                <Input
                  type="number"
                  value={formData.defaultAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Clave Producto/Servicio SAT</Label>
                <Input
                  value={formData.claveProdServ}
                  onChange={(e) => setFormData(prev => ({ ...prev, claveProdServ: e.target.value }))}
                  placeholder="81111500"
                />
              </div>

              <div>
                <Label>Clave Unidad SAT</Label>
                <Input
                  value={formData.claveUnidad}
                  onChange={(e) => setFormData(prev => ({ ...prev, claveUnidad: e.target.value }))}
                  placeholder="E48"
                />
              </div>

              <div>
                <Label>Objeto de Impuestos</Label>
                <Input
                  value={formData.objetoImp}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetoImp: e.target.value }))}
                  placeholder="02"
                />
              </div>

              <div>
                <Label>Tasa IVA (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tasaIVA}
                  onChange={(e) => setFormData(prev => ({ ...prev, tasaIVA: e.target.value }))}
                />
              </div>

              <div>
                <Label>Tasa Retención ISR (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tasaRetencionISR}
                  onChange={(e) => setFormData(prev => ({ ...prev, tasaRetencionISR: e.target.value }))}
                />
              </div>

              <div>
                <Label>Tasa Retención IVA (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.tasaRetencionIVA}
                  onChange={(e) => setFormData(prev => ({ ...prev, tasaRetencionIVA: e.target.value }))}
                />
              </div>
            </div>

            {/* IVA Incluido Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ivaIncluded"
                checked={formData.ivaIncluded}
                onChange={(e) => setFormData(prev => ({ ...prev, ivaIncluded: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="ivaIncluded" className="cursor-pointer">
                <span className="font-semibold">IVA Incluido</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.ivaIncluded 
                    ? "(Precio incluye IVA - se divide entre 1.16)" 
                    : "(Precio + IVA - se multiplica por 1.16)"}
                </span>
              </Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingId ? handleSaveEdit : handleCreate}>
                {editingId ? "Guardar Cambios" : "Crear Concepto"}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, descripción o clave SAT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Conceptos ({filteredConcepts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Impuestos</TableHead>
                <TableHead>Cobro</TableHead>
                <TableHead>Forma</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConcepts.map((concept) => {
                const display = calculateConceptDisplay(concept);
                return (
                  <TableRow key={concept.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div>{concept.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {concept.description || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">${display.precio.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-orange-600">${display.impuestos.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold">${display.cobro.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={concept.ivaIncluded ? "default" : "secondary"}>
                        {display.forma}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(concept)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(concept.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Concepto"
        description="¿Estás seguro de que deseas eliminar este concepto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
