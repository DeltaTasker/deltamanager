"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, File as FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  accept?: string;
  category?: "invoices" | "expenses" | "proposals" | "general" | "payment-proofs";
  maxSize?: number;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
};

export function FileUpload({
  accept = ".pdf,.xml,.zip,.jpg,.jpeg,.png,.webp",
  category = "general",
  maxSize = 10 * 1024 * 1024,
  onUploadComplete,
  onUploadError,
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      onUploadError?.("Archivo demasiado grande (máx 10MB)");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir archivo");
      }

      const data = await response.json();
      setUploadedFile({ name: file.name, url: data.url });
      onUploadComplete?.(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error instanceof Error ? error.message : "Error al subir archivo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    if (ext === "pdf") {
      return <FileText className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {!uploadedFile ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Subiendo..." : "Subir Archivo"}
        </Button>
      ) : (
        <div className="flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-2">
            {getFileIcon(uploadedFile.name)}
            <span className="text-sm">{uploadedFile.name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
