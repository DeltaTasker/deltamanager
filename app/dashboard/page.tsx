"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown, Clock, Building, Users } from "lucide-react";
import { PeriodFilter, type PeriodValue } from "@/components/ui/period-filter";

export default function DashboardHomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("Mes");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400">Resumen general del sistema</p>
        </div>
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />
      </div>

      {/* Resumen Financiero */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-white">Resumen Financiero</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Ingresos */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all duration-300 group-hover:bg-green-500/20" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Ingresos</p>
                <p className="text-3xl font-black text-white">$125,430</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="font-semibold text-green-500">+15.3%</span>
                  <span className="text-gray-500">vs período anterior</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Egresos */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-red-500/10 blur-3xl transition-all duration-300 group-hover:bg-red-500/20" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Egresos</p>
                <p className="text-3xl font-black text-white">$85,200</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-red-500" />
                  <span className="font-semibold text-red-500">+8.2%</span>
                  <span className="text-gray-500">vs período anterior</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 ring-1 ring-red-500/30">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-blue-500/20" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Balance</p>
                <p className="text-3xl font-black text-white">$40,230</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-blue-500" />
                  <span className="font-semibold text-blue-500">+25.5%</span>
                  <span className="text-gray-500">margen de ganancia</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cobros y Pagos Pendientes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cobros Pendientes */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Cobros Pendientes</h3>
            <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-500">
              5 PENDIENTES
            </span>
          </div>
          <div className="space-y-4">
            {/* Empresa Demo S.A. */}
            <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all duration-200 hover:border-yellow-500/30 hover:bg-slate-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                <Building className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Empresa Demo S.A.</p>
                <p className="text-xs text-gray-400">Vence en 3 días</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">$15,000</p>
                <p className="text-xs text-gray-500">COB-2025-00001</p>
              </div>
            </div>

            {/* Tech Solutions Inc. */}
            <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all duration-200 hover:border-red-500/30 hover:bg-slate-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <Building className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Tech Solutions Inc.</p>
                <p className="text-xs text-gray-400">Vencido hace 2 días</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">$25,000</p>
                <p className="text-xs text-gray-500">COB-2025-00002</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Pagos Pendientes</h3>
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-500">
              3 PENDIENTES
            </span>
          </div>
          <div className="space-y-4">
            {/* Nómina Quincenal */}
            <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all duration-200 hover:border-pink-500/30 hover:bg-slate-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                <Users className="h-6 w-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Nómina Quincenal</p>
                <p className="text-xs text-gray-400">Vence mañana</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">$45,000</p>
                <p className="text-xs text-gray-500">5 empleados</p>
              </div>
            </div>

            {/* Hosting AWS */}
            <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-4 transition-all duration-200 hover:border-purple-500/30 hover:bg-slate-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Hosting AWS</p>
                <p className="text-xs text-gray-400">Vence en 5 días</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">$1,200</p>
                <p className="text-xs text-gray-500">Servicio mensual</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">Funcionalidades Disponibles</h3>
          <p className="mt-2 text-gray-400">Explora las diferentes secciones del sistema</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-blue-500"></div>
              </div>
              <h4 className="font-semibold text-white">Gestión de Ingresos</h4>
              <p className="text-xs text-gray-400">Registra y administra cobros</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-green-500"></div>
              </div>
              <h4 className="font-semibold text-white">Control de Egresos</h4>
              <p className="text-xs text-gray-400">Gestiona pagos y gastos</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full bg-purple-500"></div>
              </div>
              <h4 className="font-semibold text-white">Facturación CFDI</h4>
              <p className="text-xs text-gray-400">Timbrado automático</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
