/**
 * Cliente API de FacturaloPlus para timbrado de CFDI 4.0
 * Documentación: https://dev.facturaloplus.com/api/rest
 */

import { config } from "@/lib/config";

export type FacturaloResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type TimbradoResponse = {
  uuid: string;
  fecha: string;
  xmlOriginal: string;
  xmlTimbrado: string;
  pdfBase64?: string;
  cadenaOriginal: string;
  sello: string;
  selloCFD: string;
  noCertificadoSAT: string;
};

export type CancelacionResponse = {
  uuid: string;
  acuse: string;
  fecha: string;
};

export class FacturaloPlusClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly cerPEM?: string;
  private readonly keyPEM?: string;

  constructor() {
    const { FACTURALO_API_KEY, FACTURALO_API_URL, FACTURALO_CER_PEM, FACTURALO_KEY_PEM } = config.env;
    
    if (!FACTURALO_API_KEY) {
      throw new Error("FACTURALO_API_KEY no configurada");
    }

    this.apiKey = FACTURALO_API_KEY;
    this.baseUrl = FACTURALO_API_URL || "https://dev.facturaloplus.com";
    this.cerPEM = FACTURALO_CER_PEM;
    this.keyPEM = FACTURALO_KEY_PEM;
  }

  /**
   * Timbra un CFDI en formato JSON (recomendado)
   * Usa el endpoint timbrarJSON3 que incluye soporte para plantillas
   */
  async timbrarJSON(jsonCFDI: object, plantilla: string = "1"): Promise<FacturaloResponse<TimbradoResponse>> {
    try {
      const jsonB64 = Buffer.from(JSON.stringify(jsonCFDI)).toString("base64");

      const formData = new URLSearchParams();
      formData.append("apikey", this.apiKey);
      formData.append("jsonB64", jsonB64);
      
      if (this.keyPEM) {
        formData.append("keyPEM", this.keyPEM);
      }
      
      if (this.cerPEM) {
        formData.append("cerPEM", this.cerPEM);
      }
      
      formData.append("plantilla", plantilla);

      const response = await fetch(`${this.baseUrl}/api/rest/servicio/timbrarJSON3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data as TimbradoResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al timbrar",
      };
    }
  }

  /**
   * Timbra un CFDI en formato XML (alternativa)
   */
  async timbrarXML(xmlCFDI: string): Promise<FacturaloResponse<TimbradoResponse>> {
    try {
      const formData = new URLSearchParams();
      formData.append("apikey", this.apiKey);
      formData.append("xmlCFDI", xmlCFDI);

      const response = await fetch(`${this.baseUrl}/api/rest/servicio/timbrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data as TimbradoResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al timbrar",
      };
    }
  }

  /**
   * Cancela un CFDI timbrado
   * Requiere certificados SAT (.cer y .key en formato PEM)
   */
  async cancelar(
    uuid: string,
    rfcEmisor: string,
    rfcReceptor: string,
    total: number,
    motivo: string = "02" // 02 = Comprobante emitido con errores con relación
  ): Promise<FacturaloResponse<CancelacionResponse>> {
    try {
      if (!this.keyPEM || !this.cerPEM) {
        return {
          success: false,
          error: "Certificados SAT no configurados (FACTURALO_CER_PEM y FACTURALO_KEY_PEM requeridos)",
        };
      }

      const formData = new URLSearchParams();
      formData.append("apikey", this.apiKey);
      formData.append("keyPEM", this.keyPEM);
      formData.append("cerPEM", this.cerPEM);
      formData.append("uuid", uuid);
      formData.append("rfcEmisor", rfcEmisor);
      formData.append("rfcReceptor", rfcReceptor);
      formData.append("total", total.toFixed(2));
      formData.append("motivo", motivo);

      const response = await fetch(`${this.baseUrl}/api/rest/servicio/cancelar2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data as CancelacionResponse,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al cancelar",
      };
    }
  }

  /**
   * Consulta el estado de un CFDI en el SAT
   */
  async consultarEstadoSAT(
    uuid: string,
    rfcEmisor: string,
    rfcReceptor: string,
    total: number
  ): Promise<FacturaloResponse<any>> {
    try {
      const formData = new URLSearchParams();
      formData.append("apikey", this.apiKey);
      formData.append("uuid", uuid);
      formData.append("rfcEmisor", rfcEmisor);
      formData.append("rfcReceptor", rfcReceptor);
      formData.append("total", total.toFixed(2));

      const response = await fetch(`${this.baseUrl}/api/rest/servicio/consultarEstadoSAT`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al consultar",
      };
    }
  }

  /**
   * Consulta los créditos disponibles en la cuenta de FacturaloPlus
   */
  async consultarCreditosDisponibles(): Promise<FacturaloResponse<{ creditos: number }>> {
    try {
      const formData = new URLSearchParams();
      formData.append("apikey", this.apiKey);

      const response = await fetch(`${this.baseUrl}/api/rest/servicio/consultarCreditosDisponibles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      
      return {
        success: true,
        data: { creditos: data.creditos || 0 },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido al consultar créditos",
      };
    }
  }
}

// Singleton instance
let clientInstance: FacturaloPlusClient | null = null;

export function getFacturaloPlusClient(): FacturaloPlusClient {
  if (!clientInstance) {
    clientInstance = new FacturaloPlusClient();
  }
  return clientInstance;
}

