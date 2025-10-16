import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Image as ImageIcon, CheckCircle, XCircle, Send, Eye } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/modules/auth/server/auth";
import { prisma } from "@/lib/prisma";
import { PROPOSAL_STATUS_LABELS } from "@/modules/proposals/types";
import { ProposalActions } from "./proposal-actions";
import { ProposalFileUpload } from "./proposal-file-upload";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      items: true,
      company: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!proposal) {
    redirect("/dashboard/proposals");
  }

  const attachments = proposal.attachments ? JSON.parse(proposal.attachments) as string[] : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { label: "Borrador", className: "bg-gray-500/20 text-gray-400" },
      sent: { label: "Enviada", className: "bg-blue-500/20 text-blue-400" },
      viewed: { label: "Vista", className: "bg-purple-500/20 text-purple-400" },
      accepted: { label: "Aceptada", className: "bg-green-500/20 text-green-400" },
      rejected: { label: "Rechazada", className: "bg-red-500/20 text-red-400" },
      expired: { label: "Expirada", className: "bg-orange-500/20 text-orange-400" },
    };

    const { label, className } = config[status as keyof typeof config] || config.draft;
    return <Badge className={className}>{label}</Badge>;
  };

  const canAccept = proposal.status !== "accepted" && proposal.status !== "rejected";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/proposals">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{proposal.title}</h1>
            <p className="text-sm text-muted-foreground">
              Propuesta #{proposal.id.slice(0, 8)} • {formatDate(proposal.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(proposal.status)}
        </div>
      </div>

      {/* Actions */}
      {canAccept && (
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold">Acciones Disponibles</h3>
              <p className="text-sm text-muted-foreground">
                Esta propuesta está pendiente de respuesta
              </p>
            </div>
            <ProposalActions proposalId={proposal.id} currentStatus={proposal.status} />
          </CardContent>
        </Card>
      )}

      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium">{proposal.clientName}</p>
          </div>
          {proposal.clientEmail && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{proposal.clientEmail}</p>
            </div>
          )}
          {proposal.clientPhone && (
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{proposal.clientPhone}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Empresa</p>
            <p className="font-medium">{proposal.company.name}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de la Propuesta */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Propuesta</CardTitle>
          {proposal.description && (
            <CardDescription>{proposal.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items */}
          <div>
            <h3 className="mb-3 font-semibold">Items</h3>
            <div className="space-y-2">
              {proposal.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {index + 1}. {item.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(proposal.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA ({((proposal.tax / proposal.subtotal) * 100).toFixed(0)}%):</span>
              <span>{formatCurrency(proposal.tax)}</span>
            </div>
            {proposal.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descuento:</span>
                <span className="text-red-500">-{formatCurrency(proposal.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(proposal.total)}</span>
            </div>
          </div>

          {/* Términos */}
          {proposal.paymentTerms && (
            <div>
              <h4 className="mb-2 font-semibold">Términos de Pago</h4>
              <p className="text-sm text-muted-foreground">{proposal.paymentTerms}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Validez</p>
              <p className="font-medium">{proposal.validityDays} días</p>
            </div>
            {proposal.expiresAt && (
              <div>
                <p className="text-sm text-muted-foreground">Expira</p>
                <p className="font-medium">{formatDate(proposal.expiresAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Archivos Adjuntos */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos Adjuntos</CardTitle>
          <CardDescription>
            Documentos, imágenes y archivos relacionados con esta propuesta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProposalFileUpload proposalId={proposal.id} />

          {attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Archivos Subidos</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {attachments.map((url, index) => {
                  const fileName = url.split("/").pop() || `archivo-${index + 1}`;
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        {isImage ? (
                          <ImageIcon className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm">{fileName}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <a href={url} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-500/20 p-2">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Propuesta creada</p>
                <p className="text-sm text-muted-foreground">{formatDate(proposal.createdAt)}</p>
              </div>
            </div>

            {proposal.sentAt && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-500/20 p-2">
                  <Send className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Propuesta enviada</p>
                  <p className="text-sm text-muted-foreground">{formatDate(proposal.sentAt)}</p>
                </div>
              </div>
            )}

            {proposal.viewedAt && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-500/20 p-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Propuesta vista por el cliente</p>
                  <p className="text-sm text-muted-foreground">{formatDate(proposal.viewedAt)}</p>
                </div>
              </div>
            )}

            {proposal.respondedAt && (
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${proposal.status === "accepted" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {proposal.status === "accepted" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    Propuesta {proposal.status === "accepted" ? "aceptada" : "rechazada"}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(proposal.respondedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notas Internas */}
      {proposal.internalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Internas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{proposal.internalNotes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

