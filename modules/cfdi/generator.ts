/**
 * Generador de CFDI 4.0 desde transacciones de DeltaManager
 * Convierte datos de Cobranza a formato JSON compatible con FacturaloPlus
 */

import type { 
  CFDIComprobante, 
  CFDIEmisor, 
  CFDIReceptor, 
  CFDIConcepto,
  FacturaloPlusJSON
} from "./types";

// Tipos de transacciones (temporales hasta conectar con DB)
export type IncomeTransactionForCFDI = {
  id: string;
  clientName: string;
  clientRFC: string;
  clientRegimenFiscal: string;
  clientUsoCFDI: string;
  clientDomicilioFiscal: string;
  conceptName: string;
  conceptClaveProdServ: string;
  conceptClaveUnidad: string;
  conceptObjetoImp: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ivaRate: number;
  iva: number;
  isrRate: number;
  isr: number;
  total: number;
  date: string;
  invoiceType: "PUE" | "PPD";
  paymentMethod: string; // 01-99 SAT
  paymentForm: string; // 01-99 SAT
  paymentConditions?: string;
  serie?: string;
  folio?: string;
};

export type EmisorData = {
  rfc: string;
  nombre: string;
  regimenFiscal: string;
  codigoPostal: string;
};

/**
 * Genera un comprobante CFDI 4.0 desde una transacción
 */
export function generateCFDIComprobante(
  transaction: IncomeTransactionForCFDI,
  emisor: EmisorData
): CFDIComprobante {
  const fecha = new Date(transaction.date).toISOString().replace("Z", "");

  const emisorData: CFDIEmisor = {
    Rfc: emisor.rfc,
    Nombre: emisor.nombre,
    RegimenFiscal: emisor.regimenFiscal as any,
  };

  const receptorData: CFDIReceptor = {
    Rfc: transaction.clientRFC,
    Nombre: transaction.clientName,
    DomicilioFiscalReceptor: transaction.clientDomicilioFiscal,
    RegimenFiscalReceptor: transaction.clientRegimenFiscal as any,
    UsoCFDI: transaction.clientUsoCFDI as any,
  };

  const concepto: CFDIConcepto = {
    ClaveProdServ: transaction.conceptClaveProdServ,
    Cantidad: transaction.quantity.toString(),
    ClaveUnidad: transaction.conceptClaveUnidad,
    Descripcion: transaction.conceptName,
    ValorUnitario: transaction.unitPrice.toFixed(2),
    Importe: transaction.subtotal.toFixed(2),
    ObjetoImp: transaction.conceptObjetoImp as any,
  };

  // Agregar impuestos al concepto si aplica
  if (transaction.conceptObjetoImp === "02") {
    const traslados = [];
    const retenciones = [];

    // IVA (Traslado)
    if (transaction.iva > 0) {
      traslados.push({
        Base: transaction.subtotal.toFixed(2),
        Impuesto: "002", // IVA
        TipoFactor: "Tasa" as const,
        TasaOCuota: transaction.ivaRate.toFixed(6),
        Importe: transaction.iva.toFixed(2),
      });
    }

    // ISR (Retención)
    if (transaction.isr > 0) {
      retenciones.push({
        Base: transaction.subtotal.toFixed(2),
        Impuesto: "001", // ISR
        TipoFactor: "Tasa" as const,
        TasaOCuota: transaction.isrRate.toFixed(6),
        Importe: transaction.isr.toFixed(2),
      });
    }

    concepto.Impuestos = {};

    if (traslados.length > 0) {
      (concepto.Impuestos as any).Traslados = { Traslado: traslados };
    }

    if (retenciones.length > 0) {
      (concepto.Impuestos as any).Retenciones = { Retencion: retenciones };
    }
  }

  const comprobante: CFDIComprobante = {
    Version: "4.0",
    Serie: transaction.serie,
    Folio: transaction.folio,
    Fecha: fecha,
    FormaPago: transaction.paymentForm as any,
    CondicionesDePago: transaction.paymentConditions,
    SubTotal: transaction.subtotal.toFixed(2),
    Moneda: "MXN",
    Total: transaction.total.toFixed(2),
    TipoDeComprobante: "I" as any, // Ingreso
    Exportacion: "01" as any, // No aplica
    MetodoPago: transaction.invoiceType === "PUE" ? ("PUE" as any) : ("PPD" as any),
    LugarExpedicion: emisor.codigoPostal,
    Emisor: emisorData,
    Receptor: receptorData,
    Conceptos: [concepto] as any,
  };

  // Agregar impuestos globales si aplica
  if (transaction.conceptObjetoImp === "02") {
    const impuestos: any = {};

    if (transaction.iva > 0) {
      impuestos.TotalImpuestosTrasladados = transaction.iva.toFixed(2);
      impuestos.Traslados = {
        Traslado: [{
          Impuesto: "002",
          TipoFactor: "Tasa" as const,
          TasaOCuota: transaction.ivaRate.toFixed(6),
          Importe: transaction.iva.toFixed(2),
        }],
      };
    }

    if (transaction.isr > 0) {
      impuestos.TotalImpuestosRetenidos = transaction.isr.toFixed(2);
      impuestos.Retenciones = {
        Retencion: [{
          Impuesto: "001",
          Importe: transaction.isr.toFixed(2),
        }],
      };
    }

    comprobante.Impuestos = impuestos;
  }

  return comprobante;
}

/**
 * Convierte un comprobante CFDI a formato FacturaloPlus JSON
 */
export function cfdiToFacturaloPlusJSON(
  comprobante: CFDIComprobante
): FacturaloPlusJSON {
  return {
    Comprobante: comprobante,
  } as any;
}

/**
 * Genera el JSON Base64 para enviar a FacturaloPlus
 */
export function generateFacturaloPlusBase64(
  transaction: IncomeTransactionForCFDI,
  emisor: EmisorData
): string {
  const comprobante = generateCFDIComprobante(transaction, emisor);
  const facturaloPlusJSON = cfdiToFacturaloPlusJSON(comprobante);
  const jsonString = JSON.stringify(facturaloPlusJSON);
  
  // Convertir a Base64
  if (typeof btoa !== "undefined") {
    return btoa(jsonString);
  } else {
    return Buffer.from(jsonString).toString("base64");
  }
}

/**
 * Valida los datos de una transacción antes de generar CFDI
 */
export function validateTransactionForCFDI(
  transaction: IncomeTransactionForCFDI
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar RFC (13 caracteres alfanuméricos)
  if (!transaction.clientRFC || transaction.clientRFC.length !== 13) {
    errors.push("RFC del cliente debe tener 13 caracteres");
  }

  // Validar régimen fiscal
  if (!transaction.clientRegimenFiscal) {
    errors.push("Régimen fiscal del cliente es requerido");
  }

  // Validar uso CFDI
  if (!transaction.clientUsoCFDI) {
    errors.push("Uso CFDI es requerido");
  }

  // Validar código postal (5 dígitos)
  if (!transaction.clientDomicilioFiscal || !/^\d{5}$/.test(transaction.clientDomicilioFiscal)) {
    errors.push("Código postal debe tener 5 dígitos");
  }

  // Validar clave producto/servicio (8 dígitos)
  if (!transaction.conceptClaveProdServ || !/^\d{8}$/.test(transaction.conceptClaveProdServ)) {
    errors.push("Clave de producto/servicio debe tener 8 dígitos");
  }

  // Validar montos
  if (transaction.subtotal <= 0) {
    errors.push("Subtotal debe ser mayor a 0");
  }

  if (transaction.total <= 0) {
    errors.push("Total debe ser mayor a 0");
  }

  // Validar tipo de comprobante
  if (!["PUE", "PPD"].includes(transaction.invoiceType)) {
    errors.push("Tipo de comprobante debe ser PUE o PPD");
  }

  // Validar forma de pago
  if (!transaction.paymentForm || !/^\d{2}$/.test(transaction.paymentForm)) {
    errors.push("Forma de pago debe ser un código de 2 dígitos");
  }

  // Validar método de pago
  if (!transaction.paymentMethod) {
    errors.push("Método de pago es requerido");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extrae información del emisor desde CompanySettings (temporal)
 */
export function getEmisorDataFromSettings(settings: any): EmisorData {
  return {
    rfc: settings.companyRFC || "",
    nombre: settings.companyLegalName || "",
    regimenFiscal: settings.fiscalRegime || "601",
    codigoPostal: settings.companyPostalCode || "00000",
  };
}


