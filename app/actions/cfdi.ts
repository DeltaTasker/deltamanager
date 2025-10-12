"use server";

/**
 * Server Actions para operaciones de CFDI (Timbrado, Cancelación, Consultas)
 */

import { facturaloPlusClient } from "@/modules/cfdi/client";
import {
  generateCFDIComprobante,
  generateFacturaloPlusBase64,
  validateTransactionForCFDI,
  getEmisorDataFromSettings,
  type IncomeTransactionForCFDI,
} from "@/modules/cfdi/generator";
import type { TimbrarJSONResponse, CancelarResponse, ConsultarEstadoSATResponse } from "@/modules/cfdi/types";

/**
 * Resultado genérico para operaciones CFDI
 */
export type CFDIActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Timbrar una factura (genera CFDI oficial con SAT)
 */
export async function timbrarCFDI(
  transaction: IncomeTransactionForCFDI,
  companySettings: any // TODO: Tipar con CompanySettings cuando esté conectado con DB
): Promise<CFDIActionResult<TimbrarJSONResponse["cfdi"]>> {
  try {
    // Validar datos de la transacción
    const validation = validateTransactionForCFDI(transaction);
    if (!validation.valid) {
      return {
        success: false,
        error: `Datos inválidos: ${validation.errors.join(", ")}`,
      };
    }

    // Obtener datos del emisor
    const emisor = getEmisorDataFromSettings(companySettings);

    // Generar JSON Base64
    const jsonB64 = generateFacturaloPlusBase64(transaction, emisor);

    // Llamar a la API de FacturaloPlus
    const response = await facturaloPlusClient.timbrarJSON({
      jsonB64,
      // Los certificados ya están configurados en el cliente
    });

    if (response.success && response.data?.cfdi) {
      return {
        success: true,
        data: response.data.cfdi,
      };
    }

    return {
      success: false,
      error: response.error || "Error desconocido al timbrar CFDI",
    };
  } catch (error) {
    console.error("Error en timbrarCFDI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al timbrar CFDI",
    };
  }
}

/**
 * Generar preview de factura (sin timbrar)
 * Retorna el JSON del comprobante para generar PDF localmente
 */
export async function previewCFDI(
  transaction: IncomeTransactionForCFDI,
  companySettings: any
): Promise<CFDIActionResult<any>> {
  try {
    // Validar datos
    const validation = validateTransactionForCFDI(transaction);
    if (!validation.valid) {
      return {
        success: false,
        error: `Datos inválidos: ${validation.errors.join(", ")}`,
      };
    }

    // Obtener datos del emisor
    const emisor = getEmisorDataFromSettings(companySettings);

    // Generar comprobante
    const comprobante = generateCFDIComprobante(transaction, emisor);

    return {
      success: true,
      data: comprobante,
    };
  } catch (error) {
    console.error("Error en previewCFDI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al generar preview",
    };
  }
}

/**
 * Cancelar una factura timbrada
 */
export async function cancelarCFDI(
  uuid: string,
  rfcEmisor: string,
  rfcReceptor: string,
  total: string,
  motivo: string,
  folioSustitucion?: string
): Promise<CFDIActionResult<CancelarResponse>> {
  try {
    const response = await facturaloPlusClient.cancelar({
      uuid,
      rfcEmisor,
      rfcReceptor,
      total,
      motivo,
      folioSustitucion,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || "Error desconocido al cancelar CFDI",
    };
  } catch (error) {
    console.error("Error en cancelarCFDI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al cancelar CFDI",
    };
  }
}

/**
 * Consultar estado de un CFDI en el SAT
 */
export async function consultarEstadoCFDI(
  uuid: string,
  rfcEmisor: string,
  rfcReceptor: string,
  total: string
): Promise<CFDIActionResult<ConsultarEstadoSATResponse>> {
  try {
    const response = await facturaloPlusClient.consultarEstadoSAT({
      uuid,
      rfcEmisor,
      rfcReceptor,
      total,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: response.error || "Error desconocido al consultar estado",
    };
  } catch (error) {
    console.error("Error en consultarEstadoCFDI:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al consultar estado",
    };
  }
}

/**
 * Consultar créditos disponibles en FacturaloPlus
 */
export async function consultarCreditosDisponibles(): Promise<CFDIActionResult<number>> {
  try {
    const response = await facturaloPlusClient.consultarCreditosDisponibles();

    if (response.success && response.data?.creditos !== undefined) {
      return {
        success: true,
        data: response.data.creditos,
      };
    }

    return {
      success: false,
      error: response.error || "Error desconocido al consultar créditos",
    };
  } catch (error) {
    console.error("Error en consultarCreditosDisponibles:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al consultar créditos",
    };
  }
}

/**
 * Generar complemento de pago para facturas PPD
 * (Simplificado por ahora, la implementación completa requiere más campos)
 */
export async function generarComplementoPago(
  uuidFacturaRelacionada: string,
  montoPagado: number,
  fechaPago: string,
  formaPago: string,
  transaction: IncomeTransactionForCFDI,
  companySettings: any
): Promise<CFDIActionResult<any>> {
  try {
    // TODO: Implementar generación completa de complemento de pago
    // Por ahora, retornamos un placeholder
    return {
      success: false,
      error: "Complementos de pago aún no implementados. Requiere estructura completa de Pagos 2.0",
    };
  } catch (error) {
    console.error("Error en generarComplementoPago:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al generar complemento",
    };
  }
}

