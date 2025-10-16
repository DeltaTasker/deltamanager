"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, Upload, Download, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  addFollowUp,
  loadProposalFollowUps,
  type SerializedProposal,
  type SerializedFollowUp 
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

const FOLLOWUP_TYPES = [
  { value: "llamada", label: "Llamada" },
  { value: "correo", label: "Correo" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reunion", label: "Reunión" },
  { value: "otro", label: "Otro" },
];

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
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [followUpProposalId, setFollowUpProposalId] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState<SerializedFollowUp[]>([]);

  const [formData, setFormData] = useState({
    clientId: "",
    conceptId: "",
    title: "",
    description: "",
    sentDate: new Date().toISOString().split('T')[0],
    notes: "",
    status: "sent" as "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired",
  });

  const [followUpData, setFollowUpData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "llamada",
    notes: "",
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
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setFormData({
      clientId: "",
      conceptId: "",
      title: "",
      description: "",
      sentDate: new Date().toISOString().split('T')[0],
      notes: "",
      status: "sent",
    });
    setAttachments([]);
    setEditingId(null);
    setShowForm(true);
  };

  const handleStartEdit = (proposal: SerializedProposal) => {
    setFormData({
      clientId: proposal.clientId,
      conceptId: proposal.conceptId,
      title: proposal.title,
      description: proposal.description || "",
      sentDate: proposal.sentDate ? new Date(proposal.sentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: proposal.notes || "",
      status: proposal.status as any,
    });
    setAttachments(proposal.attachments ? JSON.parse(proposal.attachments) : []);
    setEditingId(proposal.id);
    setShowForm(true);
  };

  const handleCreate = async () => {
    try {
      // Validaciones del cliente
      if (!formData.title || formData.title.trim() === "") {
        toast.error("El título es requerido");
        return;
      }
      if (!formData.clientId) {
        toast.error("Debes seleccionar un cliente");
        return;
      }
      if (!formData.conceptId) {
        toast.error("Debes seleccionar un concepto");
        return;
      }

      const result = await createProposal({
        companyId: "temp-company-id",
        clientId: formData.clientId,
        conceptId: formData.conceptId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        sentDate: new Date(formData.sentDate),
        notes: formData.notes,
        attachments,
      });

      if (result.success) {
        toast.success("Propuesta creada exitosamente");
        setShowForm(false);
        loadData();
      } else {
        toast.error(result.error || "Error al crear la propuesta");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast.error("Error al crear la propuesta");
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      // Validaciones del cliente
      if (formData.title && formData.title.trim() === "") {
        toast.error("El título no puede estar vacío");
        return;
      }

      const result = await updateProposal({
        id: editingId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        sentDate: new Date(formData.sentDate),
        notes: formData.notes,
        attachments,
      });

      if (result.success) {
        toast.success("Propuesta actualizada exitosamente");
        setShowForm(false);
        loadData();
      } else {
        toast.error(result.error || "Error al actualizar la propuesta");
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
      toast.error("Error al actualizar la propuesta");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteProposal(deleteTargetId);

      if (result.success) {
        toast.success("Propuesta eliminada exitosamente");
        loadData();
      } else {
        toast.error(result.error || "Error al eliminar la propuesta");
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("Error al eliminar la propuesta");
    }

    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const handleAccept = async () => {
    if (!acceptTargetId) return;

    try {
      const result = await acceptProposal(acceptTargetId);

      if (result.success) {
        toast.success("Propuesta aceptada y cobro generado");
        loadData();
      } else {
        toast.error(result.error || "Error al aceptar la propuesta");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast.error("Error al aceptar la propuesta");
    }

    setAcceptConfirmOpen(false);
    setAcceptTargetId(null);
  };

  const handleOpenFollowUp = async (proposalId: string) => {
    setFollowUpProposalId(proposalId);
    
    // Load follow-ups for this proposal
    const followUpsData = await loadProposalFollowUps(proposalId);
    setFollowUps(followUpsData);
    
    setFollowUpData({
      date: new Date().toISOString().split('T')[0],
      type: "llamada",
      notes: "",
    });
    setFollowUpDialogOpen(true);
  };

  const handleAddFollowUp = async () => {
    if (!followUpProposalId) return;

    try {
      const result = await addFollowUp({
        proposalId: followUpProposalId,
        date: new Date(followUpData.date),
        type: followUpData.type,
        notes: followUpData.notes,
      });

      if (result.success) {
        toast.success("Seguimiento agregado");
        
        // Reload follow-ups
        const followUpsData = await loadProposalFollowUps(followUpProposalId);
        setFollowUps(followUpsData);
        
        // Reset form
        setFollowUpData({
          date: new Date().toISOString().split('T')[0],
          type: "llamada",
          notes: "",
        });
      } else {
        toast.error("Error al agregar seguimiento");
      }
    } catch (error) {
      console.error("Error adding follow-up:", error);
      toast.error("Error al agregar seguimiento");
    }
  };

  const handleFileUpload = (files: string[]) => {
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewFile = (fileUrl: string, fileName: string) => {
    setPreviewFileUrl(fileUrl);
    setPreviewFileName(fileName);
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.conceptName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || proposal.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getSelectedConcept = () => {
    return concepts.find(c => c.id === formData.conceptId);
  };

  const calculateConceptTotal = () => {
    const concept = getSelectedConcept();
    if (!concept) return { subtotal: 0, iva: 0, total: 0 };

    const price = concept.defaultAmount || 0;
    const tasaIVA = concept.tasaIVA / 100;

    if (concept.ivaIncluded) {
      const subtotal = parseFloat((price / (1 + tasaIVA)).toFixed(2));
      const iva = parseFloat((price - subtotal).toFixed(2));
      return { subtotal, iva, total: price };
    } else {
      const iva = parseFloat((price * tasaIVA).toFixed(2));
      const total = parseFloat((price + iva).toFixed(2));
      return { subtotal: price, iva, total };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">Cargando...</div>
      </div>
    );
  }

  const conceptTotal = calculateConceptTotal();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propuestas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus propuestas comerciales y su seguimiento
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Propuesta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {proposals.filter(p => p.status === "sent" || p.status === "viewed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === "accepted").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {proposals.filter(p => p.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por título, cliente o concepto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estatus</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="viewed">Vista</SelectItem>
                <SelectItem value="accepted">Aceptada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fecha Envío</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No hay propuestas
                  </TableCell>
                </TableRow>
              ) : (
                filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">{proposal.title}</TableCell>
                    <TableCell>{proposal.clientName}</TableCell>
                    <TableCell>{proposal.conceptName}</TableCell>
                    <TableCell>
                      <span className="font-mono">${proposal.conceptPrice.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {proposal.sentDate
                        ? new Date(proposal.sentDate).toLocaleDateString("es-MX")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_COLORS[proposal.status as keyof typeof STATUS_COLORS]}>
                        {STATUS_LABELS[proposal.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {proposal.status !== "accepted" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(proposal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAcceptTargetId(proposal.id);
                                setAcceptConfirmOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenFollowUp(proposal.id)}
                        >
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteTargetId(proposal.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Propuesta" : "Nueva Propuesta"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Actualiza los datos de la propuesta"
                : "Completa los datos para crear una nueva propuesta"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cliente */}
            <div>
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientId: value })
                }
                disabled={!!editingId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} - {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Concepto */}
            <div>
              <Label htmlFor="conceptId">Concepto *</Label>
              <Select
                value={formData.conceptId}
                onValueChange={(value) =>
                  setFormData({ ...formData, conceptId: value })
                }
                disabled={!!editingId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar concepto" />
                </SelectTrigger>
                <SelectContent>
                  {concepts.map((concept) => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name} - ${(concept.defaultAmount || 0).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview de cálculo */}
            {formData.conceptId && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-sm font-semibold mb-2">Vista previa del monto:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">${conceptTotal.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA:</span>
                    <span className="font-mono">${conceptTotal.iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-semibold">
                    <span>Total:</span>
                    <span className="font-mono">${conceptTotal.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Título */}
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ej: Propuesta de Desarrollo Web"
              />
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe los detalles de la propuesta..."
                rows={3}
              />
            </div>

            {/* Fecha de Envío */}
            <div>
              <Label htmlFor="sentDate">Fecha de Envío</Label>
              <Input
                id="sentDate"
                type="date"
                value={formData.sentDate}
                onChange={(e) =>
                  setFormData({ ...formData, sentDate: e.target.value })
                }
              />
            </div>

            {/* Estatus */}
            <div>
              <Label htmlFor="status">Estatus</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as any,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="viewed">Vista</SelectItem>
                  <SelectItem value="accepted">Aceptada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                  <SelectItem value="expired">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div>
              <Label htmlFor="notes">Notas Internas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notas internas (no visibles para el cliente)"
                rows={2}
              />
            </div>

            {/* Archivos Adjuntos */}
            <div>
              <Label>Archivos Adjuntos</Label>
              <FileUpload
                onUpload={handleFileUpload}
                maxFiles={5}
                acceptedTypes={["application/pdf", "image/*", "application/zip"]}
              />
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, index) => {
                    const fileName = file.split("/").pop() || "archivo";
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <span className="text-sm truncate">{fileName}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewFile(file, fileName)}
                          >
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadFile(file, fileName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={editingId ? handleSaveEdit : handleCreate}>
              {editingId ? "Guardar Cambios" : "Crear Propuesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Seguimiento</DialogTitle>
            <DialogDescription>
              Registra las actividades de seguimiento de esta propuesta
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Agregar Nuevo Seguimiento */}
            <div className="rounded-lg border p-4 space-y-3">
              <p className="font-semibold text-sm">Nuevo Seguimiento</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="followUpDate">Fecha</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={followUpData.date}
                    onChange={(e) =>
                      setFollowUpData({ ...followUpData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="followUpType">Tipo</Label>
                  <Select
                    value={followUpData.type}
                    onValueChange={(value) =>
                      setFollowUpData({ ...followUpData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FOLLOWUP_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="followUpNotes">Notas</Label>
                <Textarea
                  id="followUpNotes"
                  value={followUpData.notes}
                  onChange={(e) =>
                    setFollowUpData({ ...followUpData, notes: e.target.value })
                  }
                  placeholder="Describe el seguimiento realizado..."
                  rows={2}
                />
              </div>
              <Button onClick={handleAddFollowUp} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Seguimiento
              </Button>
            </div>

            {/* Lista de Seguimientos */}
            <div className="space-y-2">
              <p className="font-semibold text-sm">Historial</p>
              {followUps.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay seguimientos registrados
                </p>
              ) : (
                <div className="space-y-2">
                  {followUps.map((followUp) => (
                    <div
                      key={followUp.id}
                      className="rounded-lg border p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {FOLLOWUP_TYPES.find((t) => t.value === followUp.type)?.label ||
                            followUp.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(followUp.date).toLocaleDateString("es-MX")}
                        </span>
                      </div>
                      {followUp.notes && (
                        <p className="text-sm text-gray-700">{followUp.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFileUrl}
        onClose={() => {
          setPreviewFileUrl(null);
          setPreviewFileName("");
        }}
        fileUrl={previewFileUrl || ""}
        fileName={previewFileName}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        title="¿Eliminar propuesta?"
        description="Esta acción no se puede deshacer. La propuesta será eliminada permanentemente."
        confirmText="Eliminar"
        variant="destructive"
      />

      {/* Confirm Accept Dialog */}
      <ConfirmDialog
        open={acceptConfirmOpen}
        onOpenChange={setAcceptConfirmOpen}
        onConfirm={handleAccept}
        title="¿Aceptar propuesta?"
        description="Se creará un cobro (transacción de ingreso) vinculado a esta propuesta con el total del concepto."
        confirmText="Aceptar Propuesta"
        variant="default"
      />
    </div>
  );
}
