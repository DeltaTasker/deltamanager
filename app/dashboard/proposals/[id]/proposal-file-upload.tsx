"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  proposalId: string;
};

export function ProposalFileUpload({ proposalId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Por favor selecciona al menos un archivo");
      return;
    }

    startTransition(async () => {
      try {
        const uploadedUrls: string[] = [];

        // Subir cada archivo
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", "proposals");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error al subir ${file.name}`);
          }

          const data = await response.json();
          uploadedUrls.push(data.url);
        }

        // Actualizar propuesta con las nuevas URLs
        const updateResponse = await fetch(`/api/proposals/${proposalId}/attachments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urls: uploadedUrls }),
        });

        if (!updateResponse.ok) {
          throw new Error("Error al actualizar propuesta");
        }

        toast.success(`${uploadedUrls.length} archivo(s) subido(s) exitosamente`);
        setSelectedFiles(null);
        
        // Reset input
        const input = document.getElementById("file-upload") as HTMLInputElement;
        if (input) input.value = "";

        router.refresh();
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error(error instanceof Error ? error.message : "Error al subir archivos");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Subir Archivos</Label>
        <Input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.zip"
          onChange={handleFileChange}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Formatos permitidos: PDF, imágenes (JPG, PNG, GIF, WEBP), ZIP. Máximo 10MB por archivo.
        </p>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="rounded-lg border p-3">
          <p className="text-sm font-medium">
            {selectedFiles.length} archivo(s) seleccionado(s)
          </p>
          <ul className="mt-2 space-y-1">
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="text-xs text-muted-foreground">
                • {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={isPending || !selectedFiles || selectedFiles.length === 0}
        className="w-full"
      >
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Subir Archivos
          </>
        )}
      </Button>
    </div>
  );
}

