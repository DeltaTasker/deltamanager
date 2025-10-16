"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle, Eye, MessageSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { FilePreviewModal } from "@/components/ui/file-preview-modal";
import { InlineTableRow } from "@/components/ui/inline-table-row";

import { 
  loadProposals, 
  createProposal, 
  updateProposal, 
  deleteProposal,
  acceptProposal,
  type SerializedProposal,
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

type EditingProposal = {
  id: string | null; // null = nuevo
  clientId: string;
  conceptId: string;
  title: string;
  sentDate: string;
  status: string;
  description: string;
  notes: string;
  attachments: string[];
};

export default function ProposalsPageInline() {
  const [proposals, setProposals] = useState<SerializedProposal[]>([]);
  const [clients, setClients] = useState<SerializedClient[]>([]);
  const [concepts, setConcepts] = useState<SerializedConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Estados para CRUD inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingProposal | null>(null);
  
  // Estados para modales
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [acceptConfirmOpen, setAcceptConfirmOpen] = useState(false);
  const [acceptTargetId, setAcceptTargetId] = useState<string | null>(null);
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

  const handleStartNew = () => {
    const newProposal: EditingProposal = {
      id: null,
      clientId: "",
      conceptId: "",
      title: "",
      sentDate: new Date().toISOString().split('T')[0],
      status: "sent",
      description: "",
      notes: "",
      attachments: [],
    };
    setEditingData(newProposal);
    setEditingId("__NEW__");
    setExpandedId("__NEW__");
  };

  const handleStartEdit = (proposal: SerializedProposal) => {
    const editData: EditingProposal = {
      id: proposal.id,
      clientId: proposal.clientId,
      conceptId: proposal.conceptId,
      title: proposal.title,
      sentDate: proposal.sentDate ? new Date(proposal.sentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: proposal.status,
      description: proposal.description || "",
      notes: proposal.notes || "",
      attachments: proposal.attachments ? JSON.parse(proposal.attachments) : [],
    };
    setEditingData(editData);
    setEditingId(proposal.id);
    setExpandedId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setExpandedId(null);
    setEditingData(null);
  };

  const handleSave = async () => {
    if (!editingData) return;

    try {
      // Validaciones
      if (!editingData.title || editingData.title.trim() === "") {
        toast.error("El título es requerido");
        return;
      }
      if (!editingData.clientId) {
        toast.error("Debes seleccionar un cliente");
        return;
      }
      if (!editingData.conceptId) {
        toast.error("Debes seleccionar un concepto");
        return;
      }

      if (editingData.id === null) {
        // Crear nuevo
        const result = await createProposal({
          companyId: "temp-company-id",
          clientId: editingData.clientId,
          conceptId: editingData.conceptId,
          title: editingData.title,
          description: editingData.description,
          status: editingData.status as any,
          sentDate: new Date(editingData.sentDate),
          notes: editingData.notes,
          attachments: editingData.attachments,
        });

        if (result.success) {
          toast.success("Propuesta creada exitosamente");
          handleCancelEdit();
          loadData();
        } else {
          toast.error(result.error || "Error al crear la propuesta");
        }
      } else {
        // Actualizar existente
        const result = await updateProposal({
          id: editingData.id,
          title: editingData.title,
          description: editingData.description,
          status: editingData.status as any,
          sentDate: new Date(editingData.sentDate),
          notes: editingData.notes,
          attachments: editingData.attachments,
        });

        if (result.success) {
          toast.success("Propuesta actualizada exitosamente");
          handleCancelEdit();
          loadData();
        } else {
          toast.error(result.error || "Error al actualizar la propuesta");
        }
      }
    } catch (error) {
      console.error("Error saving proposal:", error);
      toast.error("Error al guardar la propuesta");
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

  const handleFileUpload = (files: string[]) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        attachments: [...editingData.attachments, ...files],
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        attachments: editingData.attachments.filter((_, i) => i !== index),
      });
    }
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
    if (!editingData) return null;
    return concepts.find(c => c.id === editingData.conceptId);
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

  // Preparar lista de propuestas para mostrar (con nuevo row si está agregando)
  const displayProposals = editingId === "__NEW__" 
    ? [{ id: "__NEW__" } as any, ...filteredProposals]
    : filteredProposals;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propuestas</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tus propuestas comerciales (CRUD Inline)
          </p>
        </div>
        <Button onClick={handleStartNew} disabled={editingId !== null}>
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

      {/* Filters and Table */}
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
                <TableHead>Total</TableHead>
                <TableHead>Fecha Envío</TableHead>
                <TableHead>Estatus</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayProposals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No hay propuestas
                  </TableCell>
                </TableRow>
              ) : (
                displayProposals.map((proposal) => {
                  const isEditing = editingId === proposal.id;
                  const isExpanded = expandedId === proposal.id;
                  const isNew = proposal.id === "__NEW__";

                  if (isEditing && editingData) {
                    // Modo edición
                    return (
                      <InlineTableRow
                        key={proposal.id}
                        isEditing={true}
                        isExpanded={isExpanded}
                        onToggleExpand={() => setExpandedId(isExpanded ? null : proposal.id)}
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                        visibleFields={[
                          // Título
                          <Input
                            value={editingData.title}
                            onChange={(e) =>
                              setEditingData({ ...editingData, title: e.target.value })
                            }
                            placeholder="Título de la propuesta"
                            className="h-9"
                          />,
                          // Cliente
                          <Select
                            value={editingData.clientId}
                            onValueChange={(value) =>
                              setEditingData({ ...editingData, clientId: value })
                            }
                            disabled={!isNew}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>,
                          // Concepto
                          <Select
                            value={editingData.conceptId}
                            onValueChange={(value) =>
                              setEditingData({ ...editingData, conceptId: value })
                            }
                            disabled={!isNew}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Concepto" />
                            </SelectTrigger>
                            <SelectContent>
                              {concepts.map((concept) => (
                                <SelectItem key={concept.id} value={concept.id}>
                                  {concept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>,
                          // Total (calculado)
                          <span className="font-mono text-sm">
                            ${conceptTotal.total.toFixed(2)}
                          </span>,
                          // Fecha
                          <Input
                            type="date"
                            value={editingData.sentDate}
                            onChange={(e) =>
                              setEditingData({ ...editingData, sentDate: e.target.value })
                            }
                            className="h-9"
                          />,
                          // Estatus
                          <Select
                            value={editingData.status}
                            onValueChange={(value) =>
                              setEditingData({ ...editingData, status: value })
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Borrador</SelectItem>
                              <SelectItem value="sent">Enviada</SelectItem>
                              <SelectItem value="viewed">Vista</SelectItem>
                              <SelectItem value="accepted">Aceptada</SelectItem>
                              <SelectItem value="rejected">Rechazada</SelectItem>
                              <SelectItem value="expired">Expirada</SelectItem>
                            </SelectContent>
                          </Select>,
                        ]}
                        expandedContent={
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label>Descripción</Label>
                              <Textarea
                                value={editingData.description}
                                onChange={(e) =>
                                  setEditingData({ ...editingData, description: e.target.value })
                                }
                                placeholder="Describe los detalles de la propuesta..."
                                rows={3}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Notas Internas</Label>
                              <Textarea
                                value={editingData.notes}
                                onChange={(e) =>
                                  setEditingData({ ...editingData, notes: e.target.value })
                                }
                                placeholder="Notas internas (no visibles para el cliente)"
                                rows={2}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Archivos Adjuntos</Label>
                              <FileUpload
                                onUpload={handleFileUpload}
                                maxFiles={5}
                                acceptedTypes={["application/pdf", "image/*", "application/zip"]}
                              />
                              {editingData.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {editingData.attachments.map((file, index) => {
                                    const fileName = file.split("/").pop() || "archivo";
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between rounded border p-2 text-sm"
                                      >
                                        <span className="truncate">{fileName}</span>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePreviewFile(file, fileName)}
                                          >
                                            <Eye className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFile(index)}
                                          >
                                            <Trash2 className="h-3 w-3 text-destructive" />
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {editingData.conceptId && (
                              <div className="col-span-2">
                                <div className="rounded-lg border bg-gray-50 p-3">
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
                              </div>
                            )}
                          </div>
                        }
                      />
                    );
                  }

                  // Modo lectura
                  return (
                    <InlineTableRow
                      key={proposal.id}
                      isEditing={false}
                      isExpanded={false}
                      onToggleExpand={() => {}}
                      onSave={() => {}}
                      onCancel={() => {}}
                      visibleFields={[
                        <span className="font-medium">{proposal.title}</span>,
                        <span>{proposal.clientName}</span>,
                        <span>{proposal.conceptName}</span>,
                        <span className="font-mono">${proposal.conceptPrice.toFixed(2)}</span>,
                        <span>
                          {proposal.sentDate
                            ? new Date(proposal.sentDate).toLocaleDateString("es-MX")
                            : "-"}
                        </span>,
                        <Badge variant={STATUS_COLORS[proposal.status as keyof typeof STATUS_COLORS]}>
                          {STATUS_LABELS[proposal.status as keyof typeof STATUS_LABELS]}
                        </Badge>,
                      ]}
                      actionButtons={
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
                          {proposal.attachments && JSON.parse(proposal.attachments).length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const files = JSON.parse(proposal.attachments);
                                if (files[0]) {
                                  handlePreviewFile(files[0], files[0].split("/").pop() || "archivo");
                                }
                              }}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
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
                      }
                    />
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

