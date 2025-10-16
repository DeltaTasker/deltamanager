"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, Eye, Upload, FileText, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { FilePreviewModal } from "@/components/ui/file-preview-modal";

import { 
  loadProposals, 
  createProposal, 
  updateProposal, 
  deleteProposal,
  acceptProposal,
  type SerializedProposal 
} from "@/app/actions/proposals";
import { loadClients, type SerializedClient } from "@/app/actions/clients";
import { loadConcepts, type SerializedConcept } from "@/app/actions/concepts";

const STATUS_LABELS = {
  draft: "Borrador",
  sent: "Enviada",
  viewed: "Vista",
  accepted: "Aceptada",
  rejected: "Rechazada",
  expired: "Expirada",
};

const STATUS_COLORS = {
  draft: "secondary",
  sent: "default",
  viewed: "default",
  accepted: "default",
  rejected: "destructive",
  expired: "secondary",
} as const;

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<SerializedProposal[]>([]);
  const [clients, setClients] = useState<SerializedClient[]>([]);
  const [concepts, setConcepts] = useState<SerializedConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false);
  const [acceptTargetId, setAcceptTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientEmail: "",
    conceptId: "",
    title: "",
    description: "",
    quantity: "1",
    unitPrice: "",
    validityDays: "30",
    paymentTerms: "",
    notes: "",
    status: "draft" as "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired",
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      
      const [proposalsData, clientsData, conceptsData] = await Promise.all([
        loadProposals(companyId),
        loadClients(companyId),
        loadConcepts(companyId),
      ]);

      setProposals(proposalsData);
      setClients(clientsData);
      setConcepts(conceptsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const subtotal = quantity * unitPrice;
    
    const concept = concepts.find(c => c.id === formData.conceptId);
    const tasaIVA = concept?.tasaIVA || 16;
    
    const tax = subtotal * (tasaIVA / 100);
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const totals = calculateTotals();
      
      const client = clients.find(c => c.id === formData.clientId);
      if (!client) {
        toast.error("Selecciona un cliente");
        return;
      }

      const result = await createProposal({
        companyId,
        clientId: formData.clientId,
        clientName: client.name,
        clientEmail: client.email || "",
        conceptId: formData.conceptId,
        title: formData.title,
        description: formData.description,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        currency: "MXN",
        status: formData.status,
        validityDays: parseInt(formData.validityDays),
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        attachments,
      });

      if (result.success) {
        toast.success("Propuesta creada exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear propuesta");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error("Error al crear propuesta");
    }
  };

  const handleStartEdit = (proposal: SerializedProposal) => {
    setEditingId(proposal.id);
    setFormData({
      clientId: proposal.clientId || "",
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail || "",
      conceptId: proposal.conceptId || "",
      title: proposal.title,
      description: proposal.description || "",
      quantity: "1",
      unitPrice: (proposal.subtotal || 0).toString(),
      validityDays: proposal.validityDays.toString(),
      paymentTerms: proposal.paymentTerms || "",
      notes: proposal.notes || "",
      status: proposal.status as any,
    });
    
    if (proposal.attachments) {
      try {
        setAttachments(JSON.parse(proposal.attachments));
      } catch {
        setAttachments([]);
      }
    }
    
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const totals = calculateTotals();

      const result = await updateProposal({
        id: editingId,
        title: formData.title,
        description: formData.description,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        status: formData.status,
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
        attachments,
      });

      if (result.success) {
        toast.success("Propuesta actualizada exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar propuesta");
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Error al actualizar propuesta");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteProposal(deleteTargetId);

      if (result.success) {
        toast.success("Propuesta eliminada exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar propuesta");
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("Error al eliminar propuesta");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleAcceptClick = (id: string) => {
    setAcceptTargetId(id);
    setAcceptConfirmOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!acceptTargetId) return;

    try {
      const result = await acceptProposal(acceptTargetId);

      if (result.success) {
        toast.success("Propuesta aceptada y cobro generado exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al aceptar propuesta");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error("Error al aceptar propuesta");
    } finally {
      setAcceptTargetId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      clientName: "",
      clientEmail: "",
      conceptId: "",
      title: "",
      description: "",
      quantity: "1",
      unitPrice: "",
      validityDays: "30",
      paymentTerms: "",
      notes: "",
      status: "draft",
    });
    setAttachments([]);
  };

  const handleViewFile = (fileUrl: string, fileName: string) => {
    setPreviewFileUrl(fileUrl);
    setPreviewFileName(fileName);
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchTerm === "" ||
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || proposal.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalProposals = filteredProposals.length;
  const sentProposals = filteredProposals.filter(p => p.status === "sent" || p.status === "viewed").length;
  const acceptedProposals = filteredProposals.filter(p => p.status === "accepted").length;
  const conversionRate = sentProposals > 0 ? (acceptedProposals / sentProposals) * 100 : 0;

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Propuestas</h1>
          <p className="text-muted-foreground">Gestiona propuestas comerciales previo a cobranza</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Nueva Propuesta"}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Propuestas</CardDescription>
            <CardTitle className="text-3xl">{totalProposals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Enviadas</CardDescription>
            <CardTitle className="text-3xl">{sentProposals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Aceptadas</CardDescription>
            <CardTitle className="text-3xl text-green-600">{acceptedProposals}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Tasa de Conversión</CardDescription>
            <CardTitle className="text-3xl">{conversionRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Propuesta" : "Nueva Propuesta"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cliente *</Label>
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
                <Label>Concepto *</Label>
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

              <div className="col-span-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Desarrollo de Sistema de Gestión"
                />
              </div>

              <div className="col-span-2">
                <Label>Descripción</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada de la propuesta..."
                />
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
                <Label>Precio Unitario *</Label>
                <Input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>Días de Validez</Label>
                <Input
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, validityDays: e.target.value }))}
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="viewed">Vista</SelectItem>
                    <SelectItem value="accepted">Aceptada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Términos de Pago</Label>
                <Input
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  placeholder="Ej: 50% anticipo, 50% contra entrega"
                />
              </div>

              <div className="col-span-2">
                <Label>Notas Internas</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notas internas (no visibles para el cliente)"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label>Archivos Adjuntos (PDF, Imágenes, ZIP)</Label>
              <FileUpload
                accept="application/pdf,image/*,application/zip"
                category="proposals"
                maxSize={10 * 1024 * 1024}
                onUploadComplete={(url) => setAttachments(prev => [...prev, url])}
                onUploadError={(error) => toast.error(error)}
              />
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                      <span className="truncate">{file.split('/').pop()}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewFile(file, file.split('/').pop() || '')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {formData.unitPrice && formData.quantity && (
              <div className="bg-muted p-4 rounded space-y-1">
                <div>Subtotal: ${calculateTotals().subtotal.toFixed(2)}</div>
                <div>IVA: ${calculateTotals().tax.toFixed(2)}</div>
                <div className="font-bold">Total: ${calculateTotals().total.toFixed(2)}</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={editingId ? handleSaveEdit : handleCreate}>
                {editingId ? "Guardar Cambios" : "Crear Propuesta"}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="viewed">Vista</SelectItem>
                <SelectItem value="accepted">Aceptada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Propuestas ({filteredProposals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Archivos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {proposal.title}
                    </div>
                  </TableCell>
                  <TableCell>{proposal.clientName}</TableCell>
                  <TableCell>${(proposal.total || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_COLORS[proposal.status as keyof typeof STATUS_COLORS]}>
                      {STATUS_LABELS[proposal.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {proposal.attachments && JSON.parse(proposal.attachments).length > 0 ? (
                      <Badge variant="secondary">{JSON.parse(proposal.attachments).length}</Badge>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {proposal.status !== "accepted" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAcceptClick(proposal.id)}
                          title="Aceptar propuesta"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(proposal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(proposal.id)}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Propuesta"
        description="¿Estás seguro de que deseas eliminar esta propuesta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />

      {/* Accept Confirmation */}
      <ConfirmDialog
        isOpen={acceptConfirmOpen}
        onClose={() => setAcceptConfirmOpen(false)}
        onConfirm={handleConfirmAccept}
        title="Aceptar Propuesta"
        description="Se generará automáticamente un cobro pendiente en el módulo de Cobranza. ¿Continuar?"
        confirmText="Aceptar y Generar Cobro"
        cancelText="Cancelar"
        variant="default"
      />
    </div>
  );
}

