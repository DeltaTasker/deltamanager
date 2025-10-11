"use client";

import { useState } from "react";
import { X, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FilePreviewModalProps {
  files: string[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function FilePreviewModal({ files, isOpen, onClose, title = "Archivos" }: FilePreviewModalProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (files.length === 0) return null;

  const currentFile = files[selectedFileIndex];
  const fileExtension = currentFile.split('.').pop()?.toLowerCase() || '';

  const canPreview = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension);
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension);
  const isPDF = fileExtension === 'pdf';

  const handleDownload = (fileName: string) => {
    // En producción, esto sería una URL real del servidor
    console.log("Downloading:", fileName);
    alert(`Descargando: ${fileName}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700 overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* File Tabs */}
          {files.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFileIndex(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    index === selectedFileIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {file.endsWith('.pdf') ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <span className="truncate max-w-[150px]">{file}</span>
                </button>
              ))}
            </div>
          )}

          {/* File Preview */}
          <div className="rounded-lg border border-gray-700 bg-gray-950 p-4">
            {canPreview ? (
              <>
                {isImage && (
                  <div className="flex items-center justify-center min-h-[400px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/placeholder-files/${currentFile}`}
                      alt={currentFile}
                      className="max-w-full max-h-[600px] object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23374151" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-family="sans-serif">Sin Preview</text></svg>';
                      }}
                    />
                  </div>
                )}

                {isPDF && (
                  <div className="min-h-[600px] rounded-lg overflow-hidden">
                    <iframe
                      src={`/placeholder-files/${currentFile}`}
                      className="w-full h-[600px] rounded-lg"
                      title={currentFile}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                <FileText className="h-16 w-16 mb-4 text-gray-600" />
                <p className="text-lg mb-2">No se puede previsualizar este archivo</p>
                <p className="text-sm text-gray-500 mb-4">
                  {currentFile} ({fileExtension.toUpperCase()})
                </p>
                <Button
                  onClick={() => handleDownload(currentFile)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Archivo
                </Button>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <span className="font-semibold text-white">{currentFile}</span>
              <span className="mx-2">•</span>
              <span>Archivo {selectedFileIndex + 1} de {files.length}</span>
            </div>
            {canPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(currentFile)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

