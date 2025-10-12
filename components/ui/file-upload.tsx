"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, FileArchive } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  file: File;
  preview?: string;
  url?: string;
};

type FileUploadProps = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  className?: string;
};

export function FileUpload({
  label = "Subir archivos",
  accept = "image/*,application/pdf,application/xml,application/zip",
  multiple = true,
  maxSize = 10,
  files,
  onChange,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name} excede el tamaño máximo de ${maxSize}MB`);
        continue;
      }

      const uploadedFile: UploadedFile = { file };

      // Generar preview para imágenes
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(uploadedFile);
    }

    if (multiple) {
      onChange([...files, ...validFiles]);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-400" />;
    }
    if (file.type === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-400" />;
    }
    if (file.type.includes("xml")) {
      return <FileText className="h-8 w-8 text-green-400" />;
    }
    if (file.type.includes("zip")) {
      return <FileArchive className="h-8 w-8 text-yellow-400" />;
    }
    return <FileText className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-white/20 bg-slate-900/50 hover:border-blue-500/50 hover:bg-slate-800/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p className="text-xs text-gray-400">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Tamaño máximo: {maxSize}MB {multiple && "• Múltiples archivos permitidos"}
        </p>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-400">
            {files.length} archivo{files.length !== 1 ? "s" : ""} seleccionado{files.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {files.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/50 p-3"
              >
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-800">
                    {getFileIcon(uploadedFile.file)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(uploadedFile.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

