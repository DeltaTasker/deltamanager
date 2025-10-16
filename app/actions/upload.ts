"use server";

/**
 * Server Actions para manejo de uploads de archivos
 */

import { saveUploadedFile, type UploadCategory } from "@/lib/upload";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export type UploadResult = {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
};

/**
 * Sube un solo archivo
 */
export async function uploadFile(
  formData: FormData,
  category: UploadCategory
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No se proporcionó ningún archivo",
      };
    }

    return await saveUploadedFile(file, category);
  } catch (error) {
    console.error("Error en uploadFile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al subir archivo",
    };
  }
}

/**
 * Sube múltiples archivos
 */
export async function uploadMultipleFiles(
  formData: FormData,
  category: UploadCategory
): Promise<UploadResult[]> {
  try {
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return [{
        success: false,
        error: "No se proporcionaron archivos",
      }];
    }

    const results = await Promise.all(
      files.map(file => saveUploadedFile(file, category))
    );

    return results;
  } catch (error) {
    console.error("Error en uploadMultipleFiles:", error);
    return [{
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al subir archivos",
    }];
  }
}

/**
 * Elimina un archivo
 */
export async function removeFile(filepath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPath = path.join(process.cwd(), "public", filepath);
    
    if (!existsSync(fullPath)) {
      return {
        success: false,
        error: "El archivo no existe",
      };
    }

    await unlink(fullPath);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error en removeFile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al eliminar archivo",
    };
  }
}

