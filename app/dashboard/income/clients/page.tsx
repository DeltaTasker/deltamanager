"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Building } from "lucide-react";
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
  loadClients, 
  createClient, 
  updateClient, 
  deleteClient,
  type SerializedClient 
} from "@/app/actions/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState<SerializedClient[]>([]);
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
    usoCFDI: "G03",
    codigoPostal: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      const data = await loadClients(companyId);
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const result = await createClient({
        companyId,
        ...formData,
      });

      if (result.success) {
        toast.success("Cliente creado exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear cliente");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Error al crear cliente");
    }
  };

  const handleStartEdit = (client: SerializedClient) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      company: client.company,
      rfc: client.rfc || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      regimenFiscal: client.regimenFiscal || "",
      usoCFDI: client.usoCFDI || "G03",
      codigoPostal: client.codigoPostal || "",
      notes: client.notes || "",
    });
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateClient({
        id: editingId,
        ...formData,
      });

      if (result.success) {
        toast.success("Cliente actualizado exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar cliente");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error al actualizar cliente");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteClient(deleteTargetId);

      if (result.success) {
        toast.success("Cliente eliminado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar cliente");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar cliente");
    } finally {
      setDeleteTargetId(null);
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
      usoCFDI: "G03",
      codigoPostal: "",
      notes: "",
    });
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.rfc && client.rfc.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Nuevo Cliente"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <Label>Empresa *</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <Label>RFC</Label>
                <Input
                  value={formData.rfc}
                  onChange={(e) => setFormData(prev => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                  placeholder="PEXJ800101XXX"
                  maxLength={13}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="cliente@empresa.com"
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="555-1234"
                />
              </div>

              <div>
                <Label>Código Postal</Label>
                <Input
                  value={formData.codigoPostal}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigoPostal: e.target.value }))}
                  placeholder="01000"
                  maxLength={5}
                />
              </div>

              <div>
                <Label>Régimen Fiscal</Label>
                <Input
                  value={formData.regimenFiscal}
                  onChange={(e) => setFormData(prev => ({ ...prev, regimenFiscal: e.target.value }))}
                  placeholder="601, 612, etc."
                />
              </div>

              <div>
                <Label>Uso CFDI</Label>
                <Input
                  value={formData.usoCFDI}
                  onChange={(e) => setFormData(prev => ({ ...prev, usoCFDI: e.target.value }))}
                  placeholder="G03"
                />
              </div>

              <div className="col-span-2">
                <Label>Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Calle, Colonia, Ciudad"
                />
              </div>

              <div className="col-span-2">
                <Label>Notas</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingId ? handleSaveEdit : handleCreate}>
                {editingId ? "Guardar Cambios" : "Crear Cliente"}
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
              placeholder="Buscar por nombre, empresa, RFC o email..."
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
          <CardTitle>Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>RFC</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Transacciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      {client.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{client.rfc || "-"}</code>
                  </TableCell>
                  <TableCell className="text-sm">{client.email || "-"}</TableCell>
                  <TableCell className="text-sm">{client.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {client._count?.transactions || 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(client.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
