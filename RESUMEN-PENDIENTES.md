# 📋 DeltaManager - Resumen de Pendientes y Progreso

**Fecha de actualización:** 14 de octubre, 2025  
**Estado general:** Fase 1 Completada + Módulo de Propuestas Agregado

---

## ✅ LO QUE YA ESTÁ FUNCIONANDO (COMPLETADO)

### **Fase 1: Base del Sistema** ✅
- [x] Next.js 15 + TypeScript + TailwindCSS + Shadcn/UI
- [x] Auth con OTP por email (sesión persistente 30 días)
- [x] Prisma schema multi-empresa completo
- [x] Dashboard protegido con layout responsive
- [x] Selector de empresas funcional
- [x] Landing page y rutas de marketing
- [x] Middleware de protección de rutas
- [x] Sistema de emails con SMTP (Hostinger configurado)
- [x] Seed scripts para datos demo

### **Módulo de Propuestas (NUEVO)** ✅
- [x] Modelos Prisma (`Proposal` y `ProposalItem`)
- [x] Server queries (lista, detalle, resumen)
- [x] Server actions (crear, actualizar status, convertir a venta)
- [x] Página básica de lista con métricas
- [x] Integración en sidebar del dashboard
- [x] Estados: draft, sent, viewed, accepted, rejected, expired
- [x] Conversión automática a concepto de ingreso cuando se acepta
- [x] Cálculo de tasa de conversión
- [x] Soporte para items con catálogo SAT (preparado para CFDI)

---

## 🔧 CORRECCIONES APLICADAS HOY

### **1. Validaciones de Entorno**
**Problema:** Sistema requería API keys de FacturaloPlus y Stripe aunque no se usan en Fase 1.

**Solución aplicada:**
- ✅ Eliminé validaciones estrictas de URL para variables opcionales
- ✅ `FACTURALO_API_URL`, `AUTH_URL`, `UPSTASH_REDIS_URL` ahora aceptan strings vacíos
- ✅ Comentadas las variables vacías en `.env.local`
- ✅ Sistema arranca sin errores aunque no tengas API keys de Fase 2/3

### **2. Módulos Incompletos de CFDI**
**Problema:** Archivo `app/actions/cfdi.ts` importaba código incompleto de FacturaloPlus.

**Solución aplicada:**
- ✅ Eliminé `app/actions/cfdi.ts` (será parte de Fase 2)
- ✅ Los módulos de CFDI quedan en carpeta `/modules/cfdi/` pero no se usan todavía
- ✅ No hay imports rotos en el código activo

### **3. Filtros de Periodo en Dashboard**
**Problema:** Componente `PeriodFilter` usaba props incorrectas.

**Solución aplicada:**
- ✅ Corregí `app/dashboard/page.tsx` para usar props correctas
- ✅ Exporté type `PeriodValue` como alias de `Period`
- ✅ Filtros ahora funcionan correctamente (semana, quincena, mes, año, personalizado)

---

## 🎯 PENDIENTES (EN ORDEN DE PRIORIDAD)

### **PRIORIDAD 1: Completar Módulo de Propuestas (UI)**
**Estado:** Estructura backend lista, falta UI completa

**Por hacer:**
- [ ] Formulario de creación/edición de propuesta
  - [ ] Datos del cliente (autocompletar de clientes existentes)
  - [ ] Items con tabla dinámica (agregar/eliminar/editar)
  - [ ] Cálculo automático de subtotales, impuestos, totales
  - [ ] Preview antes de guardar
- [ ] Página de detalle de propuesta
  - [ ] Ver todos los datos
  - [ ] Acciones: Enviar, Marcar como vista, Aceptar, Rechazar
  - [ ] Timeline de seguimiento
  - [ ] Botón "Convertir a Venta" para propuestas aceptadas
- [ ] Generación de PDF de propuesta
  - [ ] Template profesional
  - [ ] Datos de empresa y cliente
  - [ ] Tabla de items con totales
  - [ ] Términos y condiciones
- [ ] Envío por email
  - [ ] Template de email con link a propuesta
  - [ ] Tracking de apertura
  - [ ] Registro de fecha de envío y visualización

**Duración estimada:** 3-4 días

---

### **PRIORIDAD 2: Integración de FacturaloPlus (CFDI)**
**Estado:** Cliente API básico listo, falta integración completa

**Por hacer:**
- [ ] Configuración de certificados SAT
  - [ ] Upload y validación de .cer y .key
  - [ ] Conversión a formato PEM
  - [ ] Almacenamiento cifrado en DB
  - [ ] Alertas de vencimiento
- [ ] Generador de XML CFDI 4.0
  - [ ] Comprobante con todos los nodos obligatorios
  - [ ] Cálculo automático de impuestos (IVA, ISR, IEPS)
  - [ ] Validación contra esquemas XSD
  - [ ] Sellado digital
- [ ] Catálogos SAT
  - [ ] Productos/Servicios (c_ClaveProdServ)
  - [ ] Unidades de medida (c_ClaveUnidad)
  - [ ] Formas de pago (c_FormaPago)
  - [ ] Métodos de pago (c_MetodoPago)
  - [ ] Usos de CFDI (c_UsoCFDI)
  - [ ] Regímenes fiscales (c_RegimenFiscal)
- [ ] UI de Facturación
  - [ ] Formulario de nueva factura
  - [ ] Búsqueda y validación de RFC
  - [ ] Selector de productos/servicios SAT
  - [ ] Preview de XML antes de timbrar
  - [ ] Descarga de PDF y XML timbrados
  - [ ] Historial de facturas
- [ ] Cancelación y Notas de Crédito
  - [ ] Flujo de cancelación con motivos SAT
  - [ ] Generación de notas de crédito
  - [ ] Relación con factura original
  - [ ] Acuse de cancelación
- [ ] Storage de XMLs y PDFs
  - [ ] Decisión: S3 / Blob Storage / Local
  - [ ] Organización por empresa y año-mes
  - [ ] Backup automático

**Duración estimada:** 2-3 semanas

---

### **PRIORIDAD 3: Stripe Billing (SaaS)**
**Estado:** No iniciado

**Por hacer:**
- [ ] Definición de planes
  - [ ] Básico: 1 empresa, 2 usuarios, 50 facturas/mes
  - [ ] Pro: 5 empresas, 10 usuarios, 500 facturas/mes
  - [ ] Enterprise: Ilimitado
- [ ] Integración Stripe
  - [ ] Crear productos y precios en Stripe
  - [ ] Checkout Sessions
  - [ ] Customer Portal
  - [ ] Webhooks (payment success, failed, subscription updated)
- [ ] Lógica de negocio
  - [ ] Verificar límites de plan antes de crear empresas/usuarios/facturas
  - [ ] Bloqueo de funciones si plan vence
  - [ ] Upgrade/downgrade de planes
  - [ ] Cálculo prorrateado
- [ ] UI de Billing
  - [ ] Página de planes y precios
  - [ ] Dashboard de suscripción actual
  - [ ] Historial de pagos
  - [ ] Métodos de pago guardados

**Duración estimada:** 1-2 semanas

---

### **PRIORIDAD 4: Reportes e Indicadores**
**Estado:** Dashboard básico existe, faltan reportes detallados

**Por hacer:**
- [ ] Tablas interactivas
  - [ ] Implementar `@tanstack/react-table`
  - [ ] Paginación, ordenamiento, búsqueda
  - [ ] Filtros avanzados (fecha, cliente, estatus, monto)
  - [ ] Selección múltiple para acciones batch
  - [ ] Exportar a CSV/Excel con ExcelJS
- [ ] Gráficas
  - [ ] Implementar `recharts` o `chart.js`
  - [ ] Gráfica de línea: tendencia ingresos vs egresos
  - [ ] Gráfica de barras: gastos por categoría
  - [ ] Gráfica de pastel: distribución de ingresos
  - [ ] Heatmap: días con mayor actividad
- [ ] Reportes específicos
  - [ ] Estado de Resultados (P&L)
    - Ingresos totales por periodo
    - Egresos por categoría
    - Utilidad neta
    - Comparativa vs periodo anterior
  - [ ] Flujo de Efectivo (Cash Flow)
    - Entradas proyectadas
    - Salidas comprometidas
    - Balance disponible
    - Predicción 30/60/90 días
  - [ ] Obligaciones Fiscales
    - ISR por pagar
    - IVA por pagar/favor
    - Retenciones realizadas
    - Calendario de vencimientos SAT
  - [ ] Análisis por Cliente
    - Top 10 clientes por facturación
    - Ticket promedio
    - Días promedio de cobro
    - Cuentas por cobrar vencidas
  - [ ] Análisis por Proveedor
    - Gasto total por proveedor
    - Días promedio de pago
    - Cuentas por pagar

**Duración estimada:** 2 semanas

---

### **PRIORIDAD 5: IA y Optimización**
**Estado:** No iniciado

**Por hacer:**
- [ ] Asistente contable con GPT
  - [ ] Proxy endpoint para OpenAI
  - [ ] Prompts especializados en contabilidad MX
  - [ ] Contexto de empresa y transacciones
  - [ ] Sugerencias automáticas
- [ ] Predicciones
  - [ ] Flujo de caja futuro
  - [ ] Detección de anomalías en gastos
  - [ ] Alertas de vencimientos
- [ ] Migración a PostgreSQL
  - [ ] Script de migración SQLite → Postgres
  - [ ] Ajustes en schema (Decimal, Json, índices)
  - [ ] Prisma Accelerate / Connection pooling
  - [ ] Testing completo
- [ ] Observabilidad
  - [ ] Sentry para error tracking
  - [ ] Pino logger estructurado
  - [ ] Métricas de performance
  - [ ] Upstash Redis para rate limiting
- [ ] Performance
  - [ ] Lazy loading de componentes pesados
  - [ ] ISR para páginas públicas
  - [ ] Optimización de queries Prisma
  - [ ] CDN para assets estáticos

**Duración estimada:** 2-3 semanas

---

## 📊 ESTADO ACTUAL DEL CÓDIGO

### **✅ Sin errores críticos**
- Servidor arranca correctamente
- TypeScript compila (con warnings menores en módulos incompletos)
- ESLint pasa
- Rutas principales funcionan

### **⚠️ Warnings menores (no bloquean)**
- Algunos errores TypeScript en archivos de CFDI (Fase 2, no se usan)
- Algunos errores TypeScript en páginas de income/expenses avanzadas (Fase 4, no se usan)

### **✅ Configuración correcta**
- `.env.local` con SMTP de Hostinger configurado
- Base de datos SQLite funcionando
- Modelos Prisma actualizados (incluye Proposal y ProposalItem)
- Sesión persistente de 30 días habilitada

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

### **Opción A: Completar Propuestas (más rápido)**
Si quieres tener un módulo completamente funcional pronto:
1. Implementar formulario de creación de propuestas (1 día)
2. Página de detalle y acciones (1 día)
3. Generación de PDF (1 día)
4. Envío por email y tracking (1 día)

**Total:** 4 días para módulo completo y funcional

### **Opción B: Ir directo a CFDI (más valor)**
Si la facturación electrónica es prioritaria para el negocio:
1. Configuración de certificados SAT (2 días)
2. Catálogos SAT y validaciones (3 días)
3. Generador de XML y timbrado (5 días)
4. UI de facturación (4 días)
5. Cancelación y notas de crédito (3 días)

**Total:** 2-3 semanas para CFDI completo

---

## 💡 RECOMENDACIÓN FINAL

**Mi sugerencia:** Terminar el módulo de Propuestas primero (4 días) y luego ir full a CFDI (3 semanas).

**Razones:**
1. Propuestas ya tiene la estructura lista, solo falta UI
2. Te da un módulo completo y funcional rápido para mostrar progreso
3. Las propuestas generan datos que luego se convertirán en facturas
4. CFDI requiere más tiempo y concentración sin distracciones

**¿Qué prefieres?**
- [ ] Terminar Propuestas primero
- [ ] Ir directo a CFDI
- [ ] Otra prioridad que tengas en mente

---

## 📝 Notas Importantes

### **Sobre Validaciones**
- ✅ El sistema ya NO requiere API keys de FacturaloPlus ni Stripe para funcionar
- ✅ Solo se validan cuando intentas usar esas funciones específicas
- ✅ Puedes operar completamente sin esas integraciones

### **Sobre el Auth**
- ✅ Login con OTP por email funciona
- ✅ Emails se envían desde verify@deltatasker.com (Hostinger)
- ✅ Sesión dura 30 días, no se pierde al reiniciar

### **Sobre la Base de Datos**
- ✅ SQLite funciona perfecto para desarrollo
- ⏳ Migración a PostgreSQL será en Fase 5 (producción)

---

**¿Dudas o cambios?** Dime y ajustamos el plan. 🚀


