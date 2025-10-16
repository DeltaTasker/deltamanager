"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, AlertCircle } from "lucide-react";

type FilePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
};

export function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: FilePreviewModalProps) {
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const ext = fileName?.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext);
  const isPDF = ext === "pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageError = () => {
    console.error("Error loading image:", fileUrl);
    setImageError(true);
  };

  const handlePdfError = () => {
    console.error("Error loading PDF:", fileUrl);
    setPdfError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{fileName}</DialogTitle>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Descargar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 min-h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          {isImage && !imageError && (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-h-[600px] max-w-full object-contain rounded"
              onError={handleImageError}
            />
          )}
          {isImage && imageError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-muted-foreground mb-2">
                Error al cargar la imagen
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                La imagen puede estar corrupta o la URL es incorrecta
              </p>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Descargar archivo
              </Button>
            </div>
          )}
          {isPDF && !pdfError && (
            <iframe
              src={fileUrl}
              className="h-[600px] w-full rounded"
              title={fileName}
              onError={handlePdfError}
            />
          )}
          {isPDF && pdfError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-muted-foreground mb-2">
                Error al cargar el PDF
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Intenta descargarlo para verlo
              </p>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          )}
          {!isImage && !isPDF && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Preview no disponible para este tipo de archivo (.{ext})
              </p>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Descargar {fileName}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
