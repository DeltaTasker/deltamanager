"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

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
  const ext = fileName?.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext);
  const isPDF = ext === "pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{fileName}</DialogTitle>
            <div className="flex gap-2">
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
        <div className="mt-4">
          {isImage && (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-h-[600px] w-full object-contain"
            />
          )}
          {isPDF && (
            <iframe
              src={fileUrl}
              className="h-[600px] w-full"
              title={fileName}
            />
          )}
          {!isImage && !isPDF && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                Preview no disponible para este tipo de archivo
              </p>
              <Button variant="outline" className="mt-4" onClick={handleDownload}>
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
