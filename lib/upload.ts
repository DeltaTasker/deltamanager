/**
 * Utilidades para manejo de archivos en almacenamiento local
 * Compatible con Hostinger/VPS con CyberPanel
 */

import { writeFile, mkdir, unlink, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { nanoid } from "nanoid";

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  documents: ["application/pdf"],
  xml: ["application/xml", "text/xml"],
  zip: ["application/zip", "application/x-zip-compressed"],
} as const;

export const ALL_ALLOWED_TYPES = [
  ...ALLOWED_FILE_TYPES.images,
  ...ALLOWED_FILE_TYPES.documents,
  ...ALLOWED_FILE_TYPES.xml,
  ...ALLOWED_FILE_TYPES.zip,
];

// Tamaño máximo: 10MB por defecto
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Directorio base para uploads (relativo al root del proyecto)
export const UPLOAD_BASE_DIR = path.join(process.cwd(), "public", "uploads");

// Subdirectorios organizados
export const UPLOAD_DIRS = {
  invoices: path.join(UPLOAD_BASE_DIR, "invoices"),
  proofs: path.join(UPLOAD_BASE_DIR, "proofs"),
  certificates: path.join(UPLOAD_BASE_DIR, "certificates"),
  logos: path.join(UPLOAD_BASE_DIR, "logos"),
  temp: path.join(UPLOAD_BASE_DIR, "temp"),
} as const;

export type UploadDirectory = keyof typeof UPLOAD_DIRS;

/**
 * Resultado de un upload
 */
export type UploadResult = {
  success: boolean;
  filename?: string;
  path?: string;
  url?: string;
  size?: number;
  error?: string;
};

/**
 * Inicializa los directorios de upload si no existen
 */
export async function initUploadDirs(): Promise<void> {
  for (const dir of Object.values(UPLOAD_DIRS)) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

/**
 * Valida un archivo según tipo y tamaño
 */
export function validateFile(
  file: File,
  maxSize: number = MAX_FILE_SIZE,
  allowedTypes: string[] = ALL_ALLOWED_TYPES
): { valid: boolean; error?: string } {
  // Validar tamaño
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido: ${file.type}`,
    };
  }

  return { valid: true };
}

/**
 * Genera un nombre único para el archivo
 */
export function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = nanoid(8);
  return `${timestamp}-${random}${ext}`;
}

/**
 * Guarda un archivo en el sistema de archivos local
 */
export async function saveFile(
  file: File,
  directory: UploadDirectory,
  customFilename?: string
): Promise<UploadResult> {
  try {
    // Inicializar directorios si no existen
    await initUploadDirs();

    // Validar archivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generar nombre de archivo
    const filename = customFilename || generateUniqueFilename(file.name);
    const targetDir = UPLOAD_DIRS[directory];
    const filePath = path.join(targetDir, filename);

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Generar URL pública
    const publicUrl = `/uploads/${directory}/${filename}`;

    return {
      success: true,
      filename,
      path: filePath,
      url: publicUrl,
      size: file.size,
    };
  } catch (error) {
    console.error("Error al guardar archivo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al guardar archivo",
    };
  }
}

/**
 * Guarda múltiples archivos
 */
export async function saveMultipleFiles(
  files: File[],
  directory: UploadDirectory
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await saveFile(file, directory);
    results.push(result);
  }

  return results;
}

/**
 * Elimina un archivo del sistema
 */
export async function deleteFile(filepath: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (existsSync(filepath)) {
      await unlink(filepath);
      return { success: true };
    }
    return { success: false, error: "Archivo no encontrado" };
  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al eliminar archivo",
    };
  }
}

/**
 * Elimina múltiples archivos
 */
export async function deleteMultipleFiles(filepaths: string[]): Promise<void> {
  await Promise.all(filepaths.map(fp => deleteFile(fp)));
}

/**
 * Convierte un archivo a Base64 (útil para logos en PDFs)
 */
export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

/**
 * Lee un archivo del sistema y lo convierte a Base64
 */
export async function readFileAsBase64(filepath: string): Promise<string> {
  const buffer = await readFile(filepath);
  return buffer.toString("base64");
}

/**
 * Obtiene la extensión de un archivo
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().replace(".", "");
}

/**
 * Determina si un archivo es una imagen
 */
export function isImage(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
}

/**
 * Determina si un archivo es un PDF
 */
export function isPDF(filename: string): boolean {
  return getFileExtension(filename) === "pdf";
}

/**
 * Determina si un archivo es XML
 */
export function isXML(filename: string): boolean {
  return getFileExtension(filename) === "xml";
}

/**
 * Determina si un archivo es ZIP
 */
export function isZIP(filename: string): boolean {
  return getFileExtension(filename) === "zip";
}

