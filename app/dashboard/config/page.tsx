"use client";

import { useState } from "react";
import { Save, User, Building, Bell, Shield, Database, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function ConfigPage() {
  const [profileData, setProfileData] = useState({
    name: "Usuario Demo",
    email: "usuario@demo.com",
    phone: "555-0000",
    position: "Administrador"
  });

  const [companyData, setCompanyData] = useState({
    name: "Empresa Demo S.A. de C.V.",
    rfc: "EDM000101ABC",
    address: "Calle Principal #123",
    city: "Ciudad de México",
    postalCode: "01000"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: "enabled",
    invoiceReminders: "enabled",
    paymentAlerts: "enabled"
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "es",
    currency: "MXN",
    dateFormat: "dd/MM/yyyy"
  });

  const handleSaveProfile = () => {
    alert("Perfil actualizado correctamente");
  };

  const handleSaveCompany = () => {
    alert("Datos de empresa actualizados correctamente");
  };

  const handleSaveNotifications = () => {
    alert("Preferencias de notificaciones actualizadas");
  };

  const handleSavePreferences = () => {
    alert("Preferencias generales actualizadas");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>
        <p className="text-gray-400">Administra las preferencias y ajustes de tu cuenta</p>
      </div>

      {/* Profile Settings */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle className="text-white">Perfil de Usuario</CardTitle>
              <CardDescription className="text-gray-400">Información personal y de contacto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nombre Completo</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Teléfono</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-white">Puesto</Label>
              <Input
                id="position"
                value={profileData.position}
                onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Settings */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-500" />
            <div>
              <CardTitle className="text-white">Datos de la Empresa</CardTitle>
              <CardDescription className="text-gray-400">Información fiscal y de contacto de la empresa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white">Razón Social</Label>
            <Input
              id="companyName"
              value={companyData.name}
              onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rfc" className="text-white">RFC</Label>
              <Input
                id="rfc"
                value={companyData.rfc}
                onChange={(e) => setCompanyData(prev => ({ ...prev, rfc: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-white">Código Postal</Label>
              <Input
                id="postalCode"
                value={companyData.postalCode}
                onChange={(e) => setCompanyData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">Dirección</Label>
            <Input
              id="address"
              value={companyData.address}
              onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-white">Ciudad</Label>
            <Input
              id="city"
              value={companyData.city}
              onChange={(e) => setCompanyData(prev => ({ ...prev, city: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveCompany} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            <div>
              <CardTitle className="text-white">Notificaciones</CardTitle>
              <CardDescription className="text-gray-400">Configura cómo y cuándo recibir alertas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailNotifications" className="text-white">Notificaciones por Correo</Label>
            <Select value={notificationSettings.emailNotifications} onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, emailNotifications: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="enabled" className="text-white hover:bg-gray-700">Habilitadas</SelectItem>
                <SelectItem value="disabled" className="text-white hover:bg-gray-700">Deshabilitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceReminders" className="text-white">Recordatorios de Facturas</Label>
            <Select value={notificationSettings.invoiceReminders} onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, invoiceReminders: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="enabled" className="text-white hover:bg-gray-700">Habilitados</SelectItem>
                <SelectItem value="disabled" className="text-white hover:bg-gray-700">Deshabilitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentAlerts" className="text-white">Alertas de Pagos</Label>
            <Select value={notificationSettings.paymentAlerts} onValueChange={(value) => setNotificationSettings(prev => ({ ...prev, paymentAlerts: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="enabled" className="text-white hover:bg-gray-700">Habilitadas</SelectItem>
                <SelectItem value="disabled" className="text-white hover:bg-gray-700">Deshabilitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            <div>
              <CardTitle className="text-white">Preferencias Generales</CardTitle>
              <CardDescription className="text-gray-400">Personaliza la apariencia y comportamiento del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-white">Tema</Label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="dark" className="text-white hover:bg-gray-700">Oscuro</SelectItem>
                  <SelectItem value="light" className="text-white hover:bg-gray-700">Claro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-white">Idioma</Label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="es" className="text-white hover:bg-gray-700">Español</SelectItem>
                  <SelectItem value="en" className="text-white hover:bg-gray-700">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white">Moneda</Label>
              <Select value={preferences.currency} onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="MXN" className="text-white hover:bg-gray-700">MXN (Peso Mexicano)</SelectItem>
                  <SelectItem value="USD" className="text-white hover:bg-gray-700">USD (Dólar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="text-white">Formato de Fecha</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences(prev => ({ ...prev, dateFormat: value }))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="dd/MM/yyyy" className="text-white hover:bg-gray-700">DD/MM/AAAA</SelectItem>
                  <SelectItem value="MM/dd/yyyy" className="text-white hover:bg-gray-700">MM/DD/AAAA</SelectItem>
                  <SelectItem value="yyyy-MM-dd" className="text-white hover:bg-gray-700">AAAA-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSavePreferences} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle className="text-white">Seguridad</CardTitle>
              <CardDescription className="text-gray-400">Gestiona tu contraseña y opciones de seguridad</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Tu cuenta está protegida con autenticación por código OTP. Para cambiar tu correo electrónico o configuración de acceso, contacta al administrador del sistema.
            </p>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Sesiones Activas</p>
              <p className="text-sm text-gray-400">1 dispositivo conectado</p>
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Ver Detalles
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-500" />
            <div>
              <CardTitle className="text-white">Gestión de Datos</CardTitle>
              <CardDescription className="text-gray-400">Exporta o elimina tu información</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Exportar Datos</p>
              <p className="text-sm text-gray-400">Descarga una copia de toda tu información</p>
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Exportar
            </Button>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-400">Eliminar Cuenta</p>
              <p className="text-sm text-gray-400">Esta acción no se puede deshacer</p>
            </div>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/10">
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

