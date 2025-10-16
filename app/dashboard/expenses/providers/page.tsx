"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  loadProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  type SerializedProvider,
  type CreateProviderInput,
  type UpdateProviderInput
} from "@/app/actions/providers";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<SerializedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    rfc: "",
    email: "",
    phone: "",
    address: "",
    regimenFiscal: "",
    codigoPostal: "",
    notes: "",
    isForeign: false,
    paymentType: "variable" as "fixed" | "variable",
    paymentAmount: "",
    paymentFrequency: "biweekly" as "weekly" | "biweekly" | "monthly" | "annual",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id"; // TODO: Get from session
      const data = await loadProviders(companyId);
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
      toast.error("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const result = await createProvider({
        companyId,
        name: formData.name,
        company: formData.company,
        rfc: formData.isForeign ? undefined : (formData.rfc || undefined),
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        regimenFiscal: formData.regimenFiscal || undefined,
        codigoPostal: formData.codigoPostal || undefined,
        notes: formData.notes || undefined,
        isForeign: formData.isForeign,
        paymentType: formData.paymentType,
        paymentAmount: formData.paymentType === "fixed" && formData.paymentAmount ? parseFloat(formData.paymentAmount) : undefined,
        paymentFrequency: formData.paymentType === "fixed" ? formData.paymentFrequency : undefined,
      });

      if (result.success) {
        toast.success("Proveedor creado exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear proveedor");
      }
    } catch (error) {
      console.error("Error creating provider:", error);
      toast.error("Error al crear proveedor");
    }
  };

  const handleStartEdit = (provider: SerializedProvider) => {
    setEditingId(provider.id);
    setFormData({
      name: provider.name,
      company: provider.company,
      rfc: provider.rfc || "",
      email: provider.email || "",
      phone: provider.phone || "",
      address: provider.address || "",
      regimenFiscal: provider.regimenFiscal || "",
      codigoPostal: provider.codigoPostal || "",
      notes: provider.notes || "",
      isForeign: provider.isForeign || false,
      paymentType: (provider.paymentType || "variable") as "fixed" | "variable",
      paymentAmount: provider.paymentAmount?.toString() || "",
      paymentFrequency: (provider.paymentFrequency || "biweekly") as "weekly" | "biweekly" | "monthly" | "annual",
    });
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateProvider({
        id: editingId,
        name: formData.name,
        company: formData.company,
        rfc: formData.isForeign ? undefined : (formData.rfc || undefined),
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        regimenFiscal: formData.regimenFiscal || undefined,
        codigoPostal: formData.codigoPostal || undefined,
        notes: formData.notes || undefined,
        isForeign: formData.isForeign,
        paymentType: formData.paymentType,
        paymentAmount: formData.paymentType === "fixed" && formData.paymentAmount ? parseFloat(formData.paymentAmount) : undefined,
        paymentFrequency: formData.paymentType === "fixed" ? formData.paymentFrequency : undefined,
      });

      if (result.success) {
        toast.success("Proveedor actualizado exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar proveedor");
      }
    } catch (error) {
      console.error("Error updating provider:", error);
      toast.error("Error al actualizar proveedor");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteProvider(deleteTargetId);

      if (result.success) {
        toast.success("Proveedor eliminado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar proveedor");
      }
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast.error("Error al eliminar proveedor");
    } finally {
      setDeleteTargetId(null);
      setDeleteConfirmOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      rfc: "",
      email: "",
      phone: "",
      address: "",
      regimenFiscal: "",
      codigoPostal: "",
      notes: "",
      isForeign: false,
      paymentType: "variable" as "fixed" | "variable",
      paymentAmount: "",
      paymentFrequency: "biweekly" as "weekly" | "biweekly" | "monthly" | "annual",
    });
  };

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.rfc && provider.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Proveedores</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los proveedores para tus gastos y compras
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Proveedor" : "Nuevo Proveedor"}</CardTitle>
            <CardDescription>
              {editingId ? "Actualiza los detalles del proveedor." : "Agrega un nuevo proveedor a tu catálogo."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); editingId ? handleSaveEdit() : handleCreate(); }} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de Contacto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Razón Social *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ej: Proveedor S.A. de C.V."
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input
                    id="rfc"
                    value={formData.rfc}
                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                    placeholder="Ej: ABC123456XYZ"
                    maxLength={13}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@proveedor.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(55) 1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                    placeholder="01000"
                    maxLength={5}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, número, colonia, ciudad, estado"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regimenFiscal">Régimen Fiscal SAT</Label>
                <Input
                  id="regimenFiscal"
                  value={formData.regimenFiscal}
                  onChange={(e) => setFormData({ ...formData, regimenFiscal: e.target.value })}
                  placeholder="Ej: 601 - General de Ley Personas Morales"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales sobre el proveedor"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? "Guardar Cambios" : "Crear Proveedor"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Proveedores ({filteredProviders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Cargando proveedores...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No hay proveedores registrados que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Razón Social</TableHead>
                    <TableHead>RFC</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-right">Transacciones</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {provider.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">{provider.rfc || "-"}</code>
                      </TableCell>
                      <TableCell className="text-sm">{provider.email || "-"}</TableCell>
                      <TableCell className="text-sm">{provider.phone || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{provider._count?.transactions || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(provider)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(provider.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Proveedor"
        description="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
