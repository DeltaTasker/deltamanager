export default function DashboardHomePage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Financiero</h1>
          <p className="text-gray-400">Panel de control general del sistema</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/5 p-1">
          {(["Semana", "Quincena", "Mes", "Año"] as const).map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-md px-3 py-1 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white">¡Bienvenido a DeltaManager!</h2>
        <p className="mt-2 text-gray-300">
          Tu plataforma contable integral está lista. Gestiona ingresos, egresos, facturación CFDI y más desde un solo lugar.
        </p>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Sistema operativo
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            Base de datos conectada
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            Funcionalidades activas
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-white">$83,000</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cobros Pendientes</p>
              <p className="text-2xl font-bold text-white">$43,000</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-amber-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Balance Actual</p>
              <p className="text-2xl font-bold text-white">$40,000</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-blue-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Cobro recibido de Empresa ABC</p>
                <p className="text-xs text-gray-400">$15,000 • hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Factura emitida a Tech Solutions</p>
                <p className="text-xs text-gray-400">$25,000 • hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Auditoría completada</p>
                <p className="text-xs text-gray-400">Corporativo XYZ • hace 1 día</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white">Próximos Vencimientos</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Cobro pendiente Empresa Demo</p>
                <p className="text-xs text-gray-400">$15,000 • vence en 3 días</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Nómina quincenal</p>
                <p className="text-xs text-gray-400">$45,000 • vence mañana</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Renovación hosting</p>
                <p className="text-xs text-gray-400">$1,200 • vence en 5 días</p>
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
