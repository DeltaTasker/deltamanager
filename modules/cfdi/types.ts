/**
 * Tipos para CFDI 4.0 según estándar SAT
 */

export type TipoComprobante = "I" | "E" | "T" | "N" | "P"; // Ingreso, Egreso, Traslado, Nómina, Pago

export type MetodoPago = "PUE" | "PPD" | "PIP"; // Pago en Una Exhibición, Pago en Parcialidades o Diferido, Pago Inicial y Parcialidades

export type FormaPago =
  | "01" // Efectivo
  | "02" // Cheque nominativo
  | "03" // Transferencia electrónica de fondos
  | "04" // Tarjeta de crédito
  | "05" // Monedero electrónico
  | "06" // Dinero electrónico
  | "08" // Vales de despensa
  | "12" // Dación en pago
  | "13" // Pago por subrogación
  | "14" // Pago por consignación
  | "15" // Condonación
  | "17" // Compensación
  | "23" // Novación
  | "24" // Confusión
  | "25" // Remisión de deuda
  | "26" // Prescripción o caducidad
  | "27" // A satisfacción del acreedor
  | "28" // Tarjeta de débito
  | "29" // Tarjeta de servicios
  | "30" // Aplicación de anticipos
  | "31" // Intermediario pagos
  | "99"; // Por definir

export type RegimenFiscal =
  | "601" // General de Ley Personas Morales
  | "603" // Personas Morales con Fines no Lucrativos
  | "605" // Sueldos y Salarios e Ingresos Asimilados a Salarios
  | "606" // Arrendamiento
  | "607" // Régimen de Enajenación o Adquisición de Bienes
  | "608" // Demás ingresos
  | "610" // Residentes en el Extranjero sin Establecimiento Permanente en México
  | "611" // Ingresos por Dividendos (socios y accionistas)
  | "612" // Personas Físicas con Actividades Empresariales y Profesionales
  | "614" // Ingresos por intereses
  | "615" // Régimen de los ingresos por obtención de premios
  | "616" // Sin obligaciones fiscales
  | "620" // Sociedades Cooperativas de Producción que optan por diferir sus ingresos
  | "621" // Incorporación Fiscal
  | "622" // Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras
  | "623" // Opcional para Grupos de Sociedades
  | "624" // Coordinados
  | "625" // Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas
  | "626"; // Régimen Simplificado de Confianza

export type UsoCFDI =
  | "G01" // Adquisición de mercancías
  | "G02" // Devoluciones, descuentos o bonificaciones
  | "G03" // Gastos en general
  | "I01" // Construcciones
  | "I02" // Mobilario y equipo de oficina por inversiones
  | "I03" // Equipo de transporte
  | "I04" // Equipo de cómputo y accesorios
  | "I05" // Dados, troqueles, moldes, matrices y herramental
  | "I06" // Comunicaciones telefónicas
  | "I07" // Comunicaciones satelitales
  | "I08" // Otra maquinaria y equipo
  | "D01" // Honorarios médicos, dentales y gastos hospitalarios
  | "D02" // Gastos médicos por incapacidad o discapacidad
  | "D03" // Gastos funerales
  | "D04" // Donativos
  | "D05" // Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)
  | "D06" // Aportaciones voluntarias al SAR
  | "D07" // Primas por seguros de gastos médicos
  | "D08" // Gastos de transportación escolar obligatoria
  | "D09" // Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones
  | "D10" // Pagos por servicios educativos (colegiaturas)
  | "S01" // Sin efectos fiscales
  | "CP01" // Pagos
  | "CN01"; // Nómina

export type ObjetoImp = "01" | "02" | "03" | "04"; // 01 = No objeto de impuesto, 02 = Sí objeto de impuesto, 03 = Sí objeto del impuesto y no obligado al desglose, 04 = Sí objeto del impuesto y no causa impuesto

export interface CFDIEmisor {
  Rfc: string;
  Nombre: string;
  RegimenFiscal: RegimenFiscal;
}

export interface CFDIReceptor {
  Rfc: string;
  Nombre: string;
  UsoCFDI: UsoCFDI;
  DomicilioFiscalReceptor: string; // Código postal
  RegimenFiscalReceptor: RegimenFiscal;
}

export interface CFDIConcepto {
  ClaveProdServ: string; // Catálogo SAT de productos y servicios
  Cantidad: string;
  ClaveUnidad: string; // Catálogo SAT de unidades
  Unidad?: string; // Descripción de la unidad
  Descripcion: string;
  ValorUnitario: string;
  Importe: string;
  Descuento?: string;
  ObjetoImp: ObjetoImp;
  NoIdentificacion?: string;
  Impuestos?: {
    Traslados?: Array<{
      Base: string;
      Impuesto: "002" | "003"; // 002 = IVA, 003 = IEPS
      TipoFactor: "Tasa" | "Cuota" | "Exento";
      TasaOCuota: string;
      Importe: string;
    }>;
    Retenciones?: Array<{
      Base: string;
      Impuesto: "001" | "002"; // 001 = ISR, 002 = IVA
      TipoFactor: "Tasa";
      TasaOCuota: string;
      Importe: string;
    }>;
  };
}

export interface CFDIImpuestos {
  TotalImpuestosTrasladados?: string;
  TotalImpuestosRetenidos?: string;
  Traslados?: Array<{
    Base: string;
    Impuesto: "002" | "003";
    TipoFactor: "Tasa";
    TasaOCuota: string;
    Importe: string;
  }>;
  Retenciones?: Array<{
    Impuesto: "001" | "002";
    Importe: string;
  }>;
}

export interface CFDIComprobante {
  Version: "4.0";
  Serie?: string;
  Folio?: string;
  Fecha: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ss
  NoCertificado?: string;
  SubTotal: string;
  Descuento?: string;
  Moneda: "MXN" | "USD" | "EUR"; // Catálogo SAT de monedas
  TipoCambio?: string;
  Total: string;
  TipoDeComprobante: TipoComprobante;
  Exportacion: "01" | "02" | "03" | "04"; // 01 = No aplica, 02 = Definitiva, 03 = Temporal, 04 = Autorización
  MetodoPago?: MetodoPago;
  FormaPago?: FormaPago;
  CondicionesDePago?: string;
  LugarExpedicion: string; // Código postal
  Emisor: CFDIEmisor;
  Receptor: CFDIReceptor;
  Conceptos: CFDIConcepto[];
  Impuestos?: CFDIImpuestos;
  CfdiRelacionados?: {
    TipoRelacion: string;
    CfdiRelacionado: string | string[];
  };
}

/**
 * Estructura JSON para enviar a FacturaloPlus
 */
export interface FacturaloPlusJSON {
  Comprobante: CFDIComprobante;
  CamposPDF?: {
    tipoComprobante?: string;
    Comentarios?: string;
    [key: string]: any;
  };
  logo?: string; // Base64
}

