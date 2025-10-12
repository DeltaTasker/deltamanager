"use client";

import { useState } from "react";
import { 
  Save, Building, CreditCard, FileText, Upload, Eye, EyeOff, 
  CheckCircle, AlertCircle, Settings, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type TabValue = "general" | "stripe" | "facturalo";

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showFacturaloKey, setShowFacturaloKey] = useState(false);
  const [showCertPassword, setShowCertPassword] = useState(false);

  // General Settings
  const [generalData, setGeneralData] = useState({
    companyLegalName: "",
    companyRFC: "",
    companyAddress: "",
    companyPostalCode: "",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",
    fiscalRegime: "612", // Default: Personas Físicas con Actividades Empresariales
  });

  // Stripe Settings
  const [stripeData, setStripeData] = useState({
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
  });

  // FacturaloPlus Settings
  const [facturaloData, setFacturaloData] = useState({
    facturaloApiKey: "",
    facturaloCerFile: null as File | null,
    facturaloKeyFile: null as File | null,
    facturaloKeyPass: "",
    companyLogoFile: null as File | null,
  });

  const [connectionStatus, setConnectionStatus] = useState({
    stripe: "not_configured", // "not_configured" | "connected" | "error"
    facturalo: "not_configured",
  });

  const regimenesFiscales = [
    { value: "601", label: "601 - General de Ley Personas Morales" },
    { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
    { value: "605", label: "605 - Sueldos y Salarios" },
    { value: "606", label: "606 - Arrendamiento" },
    { value: "607", label: "607 - Régimen de Enajenación o Adquisición de Bienes" },
    { value: "608", label: "608 - Demás ingresos" },
    { value: "612", label: "612 - Personas Físicas con Actividades Empresariales" },
    { value: "621", label: "621 - Incorporación Fiscal" },
    { value: "625", label: "625 - Plataformas Tecnológicas" },
    { value: "626", label: "626 - Régimen Simplificado de Confianza" },
  ];

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      // TODO: Implementar Server Action para guardar
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("✅ Configuración general guardada correctamente");
    } catch (error) {
      alert("❌ Error al guardar configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStripe = async () => {
    setIsSaving(true);
    try {
      // TODO: Implementar Server Action para guardar (encriptado)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectionStatus(prev => ({ ...prev, stripe: "connected" }));
      alert("✅ Configuración de Stripe guardada correctamente");
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, stripe: "error" }));
      alert("❌ Error al guardar configuración de Stripe");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFacturalo = async () => {
    setIsSaving(true);
    try {
      // TODO: Implementar Server Action para guardar (encriptado + upload de archivos)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectionStatus(prev => ({ ...prev, facturalo: "connected" }));
      alert("✅ Configuración de FacturaloPlus guardada correctamente");
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, facturalo: "error" }));
      alert("❌ Error al guardar configuración de FacturaloPlus");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabButton = (value: TabValue, icon: React.ReactNode, label: string, status?: string) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 border-l-4 ${
        activeTab === value
          ? "border-blue-500 bg-blue-500/10 text-white"
          : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{label}</div>
        {status && (
          <div className="text-xs">
            {status === "connected" && <Badge className="bg-green-500/20 text-green-500 text-xs mt-1">Conectado</Badge>}
            {status === "error" && <Badge className="bg-red-500/20 text-red-500 text-xs mt-1">Error</Badge>}
            {status === "not_configured" && <Badge className="bg-gray-500/20 text-gray-400 text-xs mt-1">No configurado</Badge>}
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-sm text-gray-400">Administra la configuración de tu empresa y servicios</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex flex-col">
                {renderTabButton("general", <Building className="h-5 w-5 text-blue-400" />, "General", undefined)}
                {renderTabButton("stripe", <CreditCard className="h-5 w-5 text-purple-400" />, "Stripe", connectionStatus.stripe)}
                {renderTabButton("facturalo", <FileText className="h-5 w-5 text-green-400" />, "FacturaloPlus", connectionStatus.facturalo)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="col-span-9">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                    <Building className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Configuración General</CardTitle>
                    <CardDescription className="text-gray-400">
                      Datos fiscales y de contacto de tu empresa
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Razón Social *</Label>
                    <Input
                      value={generalData.companyLegalName}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyLegalName: e.target.value }))}
                      placeholder="Empresa S.A. de C.V."
                      className="mt-1 bg-slate-900 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">RFC *</Label>
                    <Input
                      value={generalData.companyRFC}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyRFC: e.target.value.toUpperCase() }))}
                      placeholder="ABC123456XYZ"
                      maxLength={13}
                      className="mt-1 bg-slate-900 border-white/10 text-white uppercase"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400">Dirección Fiscal *</Label>
                  <Input
                    value={generalData.companyAddress}
                    onChange={(e) => setGeneralData(prev => ({ ...prev, companyAddress: e.target.value }))}
                    placeholder="Calle, Número, Colonia"
                    className="mt-1 bg-slate-900 border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-400">Código Postal *</Label>
                    <Input
                      value={generalData.companyPostalCode}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyPostalCode: e.target.value }))}
                      placeholder="01000"
                      maxLength={5}
                      className="mt-1 bg-slate-900 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Teléfono</Label>
                    <Input
                      value={generalData.companyPhone}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyPhone: e.target.value }))}
                      placeholder="55 1234 5678"
                      className="mt-1 bg-slate-900 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Régimen Fiscal *</Label>
                    <select
                      value={generalData.fiscalRegime}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, fiscalRegime: e.target.value }))}
                      className="mt-1 w-full rounded-md bg-slate-900 border border-white/10 text-white px-3 py-2 text-sm"
                    >
                      {regimenesFiscales.map(reg => (
                        <option key={reg.value} value={reg.value}>{reg.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Email de Contacto</Label>
                    <Input
                      type="email"
                      value={generalData.companyEmail}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyEmail: e.target.value }))}
                      placeholder="contacto@empresa.com"
                      className="mt-1 bg-slate-900 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Sitio Web</Label>
                    <Input
                      type="url"
                      value={generalData.companyWebsite}
                      onChange={(e) => setGeneralData(prev => ({ ...prev, companyWebsite: e.target.value }))}
                      placeholder="https://empresa.com"
                      className="mt-1 bg-slate-900 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">* Campos requeridos para facturación electrónica</p>
                  <Button
                    onClick={handleSaveGeneral}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Settings className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STRIPE TAB */}
          {activeTab === "stripe" && (
            <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Configuración de Stripe</CardTitle>
                    <CardDescription className="text-gray-400">
                      Integración para pagos y suscripciones
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-400 mb-1">Información Importante</p>
                      <p className="text-gray-300">
                        Las claves de Stripe se almacenan de forma segura y encriptada. 
                        Puedes obtenerlas desde tu <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Dashboard de Stripe</a>.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400">Publishable Key</Label>
                  <Input
                    value={stripeData.stripePublishableKey}
                    onChange={(e) => setStripeData(prev => ({ ...prev, stripePublishableKey: e.target.value }))}
                    placeholder="pk_test_..."
                    className="mt-1 bg-slate-900 border-white/10 text-white font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Esta clave es pública y se usa en el frontend</p>
                </div>

                <div>
                  <Label className="text-gray-400">Secret Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showStripeSecret ? "text" : "password"}
                      value={stripeData.stripeSecretKey}
                      onChange={(e) => setStripeData(prev => ({ ...prev, stripeSecretKey: e.target.value }))}
                      placeholder="sk_test_..."
                      className="bg-slate-900 border-white/10 text-white font-mono text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStripeSecret(!showStripeSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showStripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Esta clave es privada y se usa en el backend</p>
                </div>

                <div>
                  <Label className="text-gray-400">Webhook Secret (Opcional)</Label>
                  <div className="relative mt-1">
                    <Input
                      type="password"
                      value={stripeData.stripeWebhookSecret}
                      onChange={(e) => setStripeData(prev => ({ ...prev, stripeWebhookSecret: e.target.value }))}
                      placeholder="whsec_..."
                      className="bg-slate-900 border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Para validar eventos de webhooks de Stripe</p>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between pt-4">
                  {connectionStatus.stripe === "connected" && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Conectado correctamente</span>
                    </div>
                  )}
                  {connectionStatus.stripe === "error" && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Error de conexión</span>
                    </div>
                  )}
                  {connectionStatus.stripe === "not_configured" && <div />}
                  
                  <Button
                    onClick={handleSaveStripe}
                    disabled={isSaving}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Settings className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Guardar y Conectar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FACTURALOPLUS TAB */}
          {activeTab === "facturalo" && (
            <Card className="border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                    <FileText className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Configuración de FacturaloPlus</CardTitle>
                    <CardDescription className="text-gray-400">
                      Timbrado de CFDI 4.0 y certificados SAT
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-400 mb-1">Requisitos para Facturación</p>
                      <ul className="text-gray-300 space-y-1 list-disc list-inside">
                        <li>API Key de FacturaloPlus (obtenerla desde su panel)</li>
                        <li>Certificado SAT (.cer en formato PEM)</li>
                        <li>Llave privada SAT (.key en formato PEM)</li>
                        <li>Contraseña de la llave privada</li>
                        <li>Logo de empresa (opcional, para PDF)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400">API Key de FacturaloPlus *</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showFacturaloKey ? "text" : "password"}
                      value={facturaloData.facturaloApiKey}
                      onChange={(e) => setFacturaloData(prev => ({ ...prev, facturaloApiKey: e.target.value }))}
                      placeholder="Tu API Key de FacturaloPlus"
                      className="bg-slate-900 border-white/10 text-white font-mono text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFacturaloKey(!showFacturaloKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showFacturaloKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <Label className="text-gray-400 mb-3 block">Certificados SAT *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Certificado (.cer)</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".cer,.pem"
                          onChange={(e) => setFacturaloData(prev => ({ ...prev, facturaloCerFile: e.target.files?.[0] || null }))}
                          className="bg-slate-900 border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                        />
                      </div>
                      {facturaloData.facturaloCerFile && (
                        <p className="text-xs text-green-400 mt-1">✓ {facturaloData.facturaloCerFile.name}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm text-gray-500">Llave Privada (.key)</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".key,.pem"
                          onChange={(e) => setFacturaloData(prev => ({ ...prev, facturaloKeyFile: e.target.files?.[0] || null }))}
                          className="bg-slate-900 border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                        />
                      </div>
                      {facturaloData.facturaloKeyFile && (
                        <p className="text-xs text-green-400 mt-1">✓ {facturaloData.facturaloKeyFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400">Contraseña de Certificado *</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showCertPassword ? "text" : "password"}
                      value={facturaloData.facturaloKeyPass}
                      onChange={(e) => setFacturaloData(prev => ({ ...prev, facturaloKeyPass: e.target.value }))}
                      placeholder="Contraseña de tu certificado SAT"
                      className="bg-slate-900 border-white/10 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCertPassword(!showCertPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCertPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <Label className="text-gray-400 mb-2 block">Logo de Empresa (Opcional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={(e) => setFacturaloData(prev => ({ ...prev, companyLogoFile: e.target.files?.[0] || null }))}
                      className="bg-slate-900 border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-400 hover:file:bg-green-500/30"
                    />
                    {facturaloData.companyLogoFile && (
                      <p className="text-xs text-green-400">✓ {facturaloData.companyLogoFile.name}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">El logo aparecerá en los PDFs de facturas (recomendado: 300x100px, PNG)</p>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between pt-4">
                  {connectionStatus.facturalo === "connected" && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Conectado y listo para timbrar</span>
                    </div>
                  )}
                  {connectionStatus.facturalo === "error" && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Error de conexión o certificados</span>
                    </div>
                  )}
                  {connectionStatus.facturalo === "not_configured" && <div />}
                  
                  <Button
                    onClick={handleSaveFacturalo}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Configuración
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
