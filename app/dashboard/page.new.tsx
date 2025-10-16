"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown, Building } from "lucide-react";
import { PeriodFilter, type PeriodValue, filterByDateRange } from "@/components/ui/period-filter";
import { loadDashboardData, type DashboardData } from "@/app/actions/dashboard";
import { toast } from "sonner";

export default function DashboardHomePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("month");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedPeriod, customStartDate, customEndDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      
      // Calculate date range based on period
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      const now = new Date();
      if (selectedPeriod === "custom") {
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
        }
      } else if (selectedPeriod === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
      } else if (selectedPeriod === "biweek") {
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        endDate = now;
      } else if (selectedPeriod === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
      } else if (selectedPeriod === "year") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
      }

      const dashboardData = await loadDashboardData(companyId, startDate, endDate);
      setData(dashboardData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden p-6">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-gray-400">Resumen general del sistema</p>
          </div>
          <PeriodFilter
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomDateChange={(start, end) => {
              setCustomStartDate(start);
              setCustomEndDate(end);
            }}
          />
        </div>
      </div>

      {/* Resumen Financiero - Fixed */}
      <div className="flex-shrink-0 pb-6">
        <h2 className="mb-4 text-lg font-bold text-white">Resumen Financiero</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Ingresos */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all duration-300 group-hover:bg-green-500/20" />
            <div className="relative flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Ingresos</p>
                <p className="text-3xl font-black text-white">${data.stats.totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="font-semibold text-green-500">+{data.stats.incomeChange}%</span>
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
                <p className="text-3xl font-black text-white">${data.stats.totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-red-500" />
                  <span className="font-semibold text-red-500">+{data.stats.expensesChange}%</span>
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
                <p className="text-3xl font-black text-white">${data.stats.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUp className="h-3 w-3 text-blue-500" />
                  <span className="font-semibold text-blue-500">+{data.stats.balanceChange}%</span>
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

      {/* Cobros y Pagos Pendientes - Scrollable */}
      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
        {/* Cobros Pendientes */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm">
          <div className="mb-5 flex flex-shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 ring-1 ring-yellow-500/30">
                <Building className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cobros Pendientes</h3>
                <p className="text-xs text-gray-400">{data.pendingIncome.length} PENDIENTES</p>
              </div>
            </div>
          </div>

          {/* Scrollable List with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto pr-2" style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `}</style>
            <div className="space-y-3">
              {data.pendingIncome.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No hay cobros pendientes
                </div>
              ) : (
                data.pendingIncome.map((item) => (
                  <a
                    key={item.id}
                    href={`/dashboard/income?id=${item.id}`}
                    className="group block rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-200 hover:border-yellow-500/30 hover:bg-yellow-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors">{item.clientName}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Vence en {Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} días
                        </p>
                        <p className="mt-1 text-xs font-mono text-gray-500">{item.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${item.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 backdrop-blur-sm">
          <div className="mb-5 flex flex-shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 ring-1 ring-orange-500/30">
                <TrendingDown className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pagos Pendientes</h3>
                <p className="text-xs text-gray-400">{data.pendingExpenses.length} PENDIENTES</p>
              </div>
            </div>
          </div>

          {/* Scrollable List with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto pr-2" style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `}</style>
            <div className="space-y-3">
              {data.pendingExpenses.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No hay pagos pendientes
                </div>
              ) : (
                data.pendingExpenses.map((item) => (
                  <a
                    key={item.id}
                    href={`/dashboard/expenses?id=${item.id}`}
                    className="group block rounded-xl border border-white/5 bg-white/5 p-4 transition-all duration-200 hover:border-orange-500/30 hover:bg-orange-500/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">{item.clientName}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          Vencido hace {Math.abs(Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} días
                        </p>
                        <p className="mt-1 text-xs font-mono text-gray-500">{item.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${item.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

