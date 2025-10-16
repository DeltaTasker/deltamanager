# 📋 Plan de Implementación Actualizado - DeltaManager

## ✅ FASE 1: COMPLETADA

### Logros:
- [x] Next.js 15 + TypeScript + TailwindCSS + Shadcn/UI
- [x] Auth con OTP por email (código de 6 dígitos)
- [x] Prisma schema multi-empresa con roles
- [x] Dashboard protegido con layout responsive
- [x] Selector de empresas funcional
- [x] Landing page y rutas de marketing
- [x] **Sesión persistente de 30 días** (ya no se pierde al reiniciar)
- [x] Middleware de protección de rutas
- [x] Sistema de emails con nodemailer + templates HTML
- [x] Seed scripts para datos demo

### Archivos clave:
- `/modules/auth/` - OTP, mailer, sesiones
- `/app/dashboard/` - Dashboard principal
- `/components/layout/dashboard/` - Sidebar, header, navegación
- `/prisma/schema.prisma` - Modelos completos

---

## 🎯 FASE 2: FACTURACIÓN CFDI (PRIORITARIA)

> **Cambio de plan:** FacturaloPlus ahora va ANTES que Stripe

### Objetivos:
1. **Integración FacturaloPlus API**
   - Cliente REST para timbrado, cancelación, notas de crédito
   - Manejo de certificados SAT (.cer + .key)
   - Validación de estructuras CFDI 4.0
   - Storage de XMLs timbrados (S3/local)

2. **Generador de CFDI**
   - Builder de XML con todos los nodos requeridos
   - Cálculo automático de impuestos (IVA, ISR, IEPS)
   - Validación contra esquemas XSD del SAT
   - Sellado digital

3. **UI de Facturación**
   - Página `/dashboard/invoicing`
   - Formulario de emisión de facturas
   - Catálogo de productos/servicios SAT
   - Búsqueda de RFC con validación
   - Preview de factura antes de timbrar
   - Descarga PDF + XML
   - Historial de facturas emitidas

4. **Gestión de Certificados**
   - Upload seguro de .cer y .key
   - Verificación de vigencia
   - Almacenamiento cifrado en DB
   - Alertas de vencimiento

5. **Cancelación y Notas de Crédito**
   - Flujo de cancelación con motivos SAT
   - Generación de notas de crédito
   - Relación con factura original
   - Acuse de cancelación

### Entregables:
```
modules/cfdi/
  ├── client.ts              # API client FacturaloPlus
  ├── generator.ts           # XML generator
  ├── validator.ts           # Schema validation
  ├── types.ts              # TypeScript types
  └── sat-catalogs.ts       # Catálogos SAT

app/dashboard/invoicing/
  ├── page.tsx              # Lista de facturas
  ├── new/page.tsx          # Nueva factura
  ├── [id]/page.tsx         # Detalle
  └── components/
      ├── invoice-form.tsx
      ├── certificate-uploader.tsx
      └── preview-modal.tsx

prisma/schema.prisma
  ├── Invoice (ya existe, ampliar)
  ├── InvoiceLineItem
  └── SatCertificate (nuevo)
```

---

## 💳 FASE 3: BILLING CON STRIPE

### Objetivos:
1. **Planes y Suscripciones**
   - 3 planes: Básico, Pro, Enterprise
   - Facturación mensual/anual
   - Manejo de seats (usuarios por empresa)

2. **Checkout y Pagos**
   - Stripe Checkout Sessions
   - Customer Portal para gestión
   - Webhook handling (payment success, failed, etc.)

3. **UI de Billing**
   - `/dashboard/billing`
   - Upgrade/downgrade de planes
   - Historial de pagos
   - Métodos de pago

---

## 📊 FASE 4: REPORTES E INDICADORES

### ¿Qué son "Tablas, Filtros y Gráficas"?

#### 1. **Tablas de Datos**
Listados interactivos con paginación, ordenamiento y búsqueda:

**Ejemplo - Tabla de Ingresos:**
```
┌──────────────┬──────────────┬──────────┬──────────┬──────────┐
│ Fecha        │ Cliente      │ Concepto │ Monto    │ Estado   │
├──────────────┼──────────────┼──────────┼──────────┼──────────┤
│ 14 Oct 2025  │ Acme Corp    │ Servicios│ $15,000  │ Pagado   │
│ 13 Oct 2025  │ Tech SA      │ Consulta │ $8,500   │ Pendiente│
│ 12 Oct 2025  │ Global Inc   │ Desarrollo│$45,000  │ Pagado   │
└──────────────┴──────────────┴──────────┴──────────┴──────────┘
```

Características:
- Columnas ordenables (clic en encabezado)
- Filtros por fecha, cliente, estatus
- Búsqueda en tiempo real
- Exportar a CSV/Excel
- Selección múltiple para acciones batch

**Tecnología:** `@tanstack/react-table` + Shadcn UI

#### 2. **Filtros Avanzados**
Panel lateral o dropdown con opciones:

```
🔍 Filtros
├─ 📅 Periodo
│  ├─ Esta semana
│  ├─ Este mes
│  ├─ Personalizado (del X al Y)
│  └─ Año fiscal 2025
│
├─ 💰 Rango de monto
│  └─ De $0 a $100,000
│
├─ 👤 Cliente/Proveedor
│  └─ Búsqueda o selector
│
├─ 🏢 Empresa
│  └─ Acme Corp / Tech SA
│
└─ 📊 Estatus
   └─ ☑ Pagado ☑ Pendiente ☐ Vencido
```

#### 3. **Gráficas e Indicadores**
Visualizaciones de datos financieros:

**A. Cards de métricas:**
```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ 💰 Ingresos del mes │  │ 📊 Egresos del mes  │  │ 🎯 Balance neto     │
│                     │  │                     │  │                     │
│   $125,430 MXN      │  │   $85,200 MXN       │  │   $40,230 MXN       │
│   ↑ +15.3% vs ant.  │  │   ↑ +8.2% vs ant.   │  │   ↑ +25.5% margen   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**B. Gráficas de línea (tendencias):**
Evolución de ingresos/egresos mes a mes

**C. Gráficas de barras:**
Comparativa por categorías de gasto

**D. Gráficas de pastel (donut):**
Distribución de ingresos por cliente o concepto

**E. Heatmaps:**
Días con mayor actividad financiera

**Tecnología:** `recharts` o `chart.js`

### Reportes específicos que implementaremos:

1. **Estado de Resultados (P&L)**
   - Ingresos totales
   - Egresos por categoría
   - Utilidad neta
   - Comparativa periodos

2. **Flujo de Efectivo (Cash Flow)**
   - Entradas proyectadas
   - Salidas comprometidas
   - Balance disponible
   - Predicción 30/60/90 días

3. **Obligaciones Fiscales**
   - ISR por pagar
   - IVA por pagar/favor
   - Retenciones realizadas
   - Próximos vencimientos SAT

4. **Análisis por Cliente**
   - Top 10 clientes
   - Ticket promedio
   - Días promedio de cobro
   - Cuentas por cobrar vencidas

5. **Análisis por Proveedor**
   - Gasto total por proveedor
   - Días promedio de pago
   - Cuentas por pagar

6. **Nómina**
   - Costo total de nómina
   - Desglose por empleado
   - Préstamos activos
   - Descuentos aplicados

---

## 🤖 FASE 5: IA Y OPTIMIZACIÓN

- Asistente contable con GPT
- Predicciones de flujo de caja
- Detección de anomalías
- Migración a PostgreSQL
- Observabilidad (Sentry, logging)
- Performance optimization

---

## 📝 Resumen de cambios respecto al plan original:

1. ✅ **Sesión persistente** ya implementada (30 días)
2. ✅ **Auth con OTP** ya funcional (solo falta configurar SMTP)
3. 🔄 **Prioridad cambiada:** FacturaloPlus (Fase 2) → Stripe (Fase 3)
4. 📊 **Reportes definidos** con ejemplos visuales claros

---

## 🚀 Siguiente paso inmediato:

**Configura tu `.env` con credenciales SMTP** siguiendo la guía en `ENV-SETUP.md` para que funcione el login con código por email.

Una vez probado el auth, continuamos con la **Fase 2: CFDI**.


