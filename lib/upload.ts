import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = {
  pdf: "application/pdf",
  xml: ["application/xml", "text/xml"],
  zip: ["application/zip", "application/x-zip-compressed"],
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

export type UploadCategory = "invoices" | "expenses" | "proposals" | "general" | "payment-proofs";

export async function ensureUploadDir(category: UploadCategory) {
  const categoryDir = path.join(UPLOAD_DIR, category);
  if (!existsSync(categoryDir)) {
    await mkdir(categoryDir, { recursive: true });
  }
  return categoryDir;
}

export async function saveUploadedFile(
  file: File,
  category: UploadCategory,
  customName?: string
): Promise<{ success: boolean; path?: string; url?: string; error?: string }> {
  try {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Archivo demasiado grande (máx 10MB)" };
    }

    // Validar tipo de archivo
    const isValidType = Object.values(ALLOWED_FILE_TYPES).some((types) => {
      if (Array.isArray(types)) {
        return types.includes(file.type);
      }
      return types === file.type;
    });

    if (!isValidType) {
      return { success: false, error: "Tipo de archivo no permitido" };
    }

    // Preparar directorio
    const categoryDir = await ensureUploadDir(category);

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.name);
    const fileName = customName
      ? `${customName}-${timestamp}${ext}`
      : `${timestamp}-${randomString}${ext}`;

    // Guardar archivo
    const filePath = path.join(categoryDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retornar URL pública
    const publicUrl = `/uploads/${category}/${fileName}`;

    return {
      success: true,
      path: filePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al guardar archivo",
    };
  }
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().slice(1);
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "webp"].includes(ext);
}

export function isPDFFile(filename: string): boolean {
  return getFileExtension(filename) === "pdf";
}

export function isXMLFile(filename: string): boolean {
  return getFileExtension(filename) === "xml";
}

export function isZIPFile(filename: string): boolean {
  return getFileExtension(filename) === "zip";
}
