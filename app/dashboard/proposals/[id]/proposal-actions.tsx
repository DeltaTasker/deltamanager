"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { acceptProposal } from "@/modules/proposals/actions/accept-proposal";
import { updateProposalStatus } from "@/modules/proposals/actions/update-status";

type Props = {
  proposalId: string;
  currentStatus: string;
};

export function ProposalActions({ proposalId, currentStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [clientId, setClientId] = useState("");
  const [conceptId, setConceptId] = useState("");

  const handleAccept = () => {
    if (!clientId || !conceptId) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    startTransition(async () => {
      const result = await acceptProposal({
        proposalId,
        clientId,
        conceptId,
      });

      if (result.success) {
        toast.success(result.message || "Propuesta aceptada y cobro generado");
        setShowAcceptDialog(false);
        router.refresh();
      } else {
        toast.error(result.error || "Error al aceptar propuesta");
      }
    });
  };

  const handleReject = () => {
    if (!confirm("¿Estás seguro de rechazar esta propuesta?")) return;

    startTransition(async () => {
      const result = await updateProposalStatus({
        proposalId,
        status: "rejected",
      });

      if (result.success) {
        toast.success("Propuesta rechazada");
        router.refresh();
      } else {
        toast.error(result.error || "Error al rechazar propuesta");
      }
    });
  };

  const handleSend = () => {
    startTransition(async () => {
      const result = await updateProposalStatus({
        proposalId,
        status: "sent",
      });

      if (result.success) {
        toast.success("Propuesta marcada como enviada");
        router.refresh();
      } else {
        toast.error(result.error || "Error al enviar propuesta");
      }
    });
  };

  return (
    <>
      <div className="flex gap-2">
        {currentStatus === "draft" && (
          <Button onClick={handleSend} disabled={isPending} variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Marcar como Enviada
          </Button>
        )}

        <Button
          onClick={() => setShowAcceptDialog(true)}
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Aceptar Propuesta
        </Button>

        <Button
          onClick={handleReject}
          disabled={isPending}
          variant="destructive"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Rechazar
        </Button>
      </div>

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aceptar Propuesta</DialogTitle>
            <DialogDescription>
              Al aceptar esta propuesta se generará automáticamente un cobro en el módulo de ingresos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">ID del Cliente *</Label>
              <Input
                id="clientId"
                placeholder="Ingresa el ID del cliente"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                El cliente debe existir en el sistema
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conceptId">ID del Concepto *</Label>
              <Input
                id="conceptId"
                placeholder="Ingresa el ID del concepto"
                value={conceptId}
                onChange={(e) => setConceptId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                El concepto debe existir en el sistema
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPending ? "Procesando..." : "Aceptar y Generar Cobro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

