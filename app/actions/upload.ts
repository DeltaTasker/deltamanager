"use server";

/**
 * Server Actions para manejo de uploads de archivos
 */

import { saveFile, saveMultipleFiles, deleteFile, type UploadDirectory, type UploadResult } from "@/lib/upload";

/**
 * Sube un solo archivo
 */
export async function uploadFile(
  formData: FormData,
  directory: UploadDirectory
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No se proporcionó ningún archivo",
      };
    }

    return await saveFile(file, directory);
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
  directory: UploadDirectory
): Promise<UploadResult[]> {
  try {
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return [{
        success: false,
        error: "No se proporcionaron archivos",
      }];
    }

    return await saveMultipleFiles(files, directory);
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
    return await deleteFile(filepath);
  } catch (error) {
    console.error("Error en removeFile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al eliminar archivo",
    };
  }
}

