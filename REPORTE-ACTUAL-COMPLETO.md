# 📊 REPORTE COMPLETO - DeltaManager
**Fecha:** 17 de octubre, 2025  
**Estado:** Etapa 1 en progreso (varias fases completadas)

---

## ✅ COMPLETADO RECIENTEMENTE

### **Propuestas - Sistema Completo**
- [x] **Fase 1.17**: Propuestas - Quitar cantidad/precio unitario, usar concepto
- [x] **Fase 1.18**: Propuestas - Fecha editable, fecha enviada, historial de seguimientos
- [x] **Fase 1.22**: CRUD Inline - Editar en rows con acordeón (implementado en Propuestas)
- [x] Sistema de seguimientos completo:
  - Nueva columna "Último Seguimiento" (fecha + nota)
  - Formulario para agregar seguimientos (fecha, tipo, notas)
  - Tipos: Llamada, Correo, WhatsApp, Reunión, Otro
  - Lista completa de seguimientos por propuesta
  - Acordeón funcional en modo lectura y edición
- [x] Flechita del acordeón SIEMPRE visible (sin necesidad de editar)
- [x] Alineación perfecta entre modo lectura y edición
- [x] Conversión de propuesta a cobranza al cambiar status a "accepted"
- [x] Link bidireccional entre propuesta y cobranza generada
- [x] FileUpload y FilePreview funcionando correctamente

### **Dashboard y Filtros**
- [x] Filtros de periodo funcionando (semana, quincena, mes, año, personalizado)
- [x] Fix de `RangeError: Invalid time value` en fechas
- [x] Métricas calculadas correctamente

### **Seed Data**
- [x] Script completo de datos de prueba para desarrollo
- [x] Propuestas, seguimientos, clientes, conceptos, cuentas bancarias

---

## 🚧 ETAPA 1 - PENDIENTES (ORDEN DE PRIORIDAD)

### **📋 Fase 1.19: Cobranza - Precio Unitario Automático**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Al seleccionar un concepto en cobranza, debe llenar automáticamente el precio unitario desde el concepto seleccionado.

**Tareas:**
- [ ] Al cambiar `conceptId` en formulario de cobranza, cargar `defaultAmount` del concepto
- [ ] Aplicar en formulario de nueva cobranza
- [ ] Aplicar en modo edición inline
- [ ] Permitir sobrescribir el precio si es necesario

---

### **💰 Fase 1.20: Retención IVA según Régimen Fiscal SAT**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Investigar y aplicar retenciones de IVA e ISR según el régimen fiscal del cliente/proveedor (México).

**Investigación necesaria:**
- [ ] ¿Qué regímenes fiscales aplican retención de IVA? (Generalmente: persona moral a persona física por servicios profesionales)
- [ ] ¿Qué porcentajes de retención aplican? (IVA: 10.67% del IVA, ISR: 10% del monto)
- [ ] ¿Cómo se refleja en CFDI? (Nodo `Retenciones` con `RetencionDR`)
- [ ] ¿Cómo afecta al cálculo del total?

**Tareas:**
- [ ] Agregar campos de retención a modelos `Transaction`, `Concept`, `Client`
- [ ] Lógica de cálculo de retenciones según régimen fiscal
- [ ] UI para mostrar retenciones en formularios
- [ ] Incluir en cálculo de totales
- [ ] Preparar para integración con CFDI

**Duración estimada:** 2-3 días

---

### **📄 Fase 1.21: Pagos - Action Buttons Comprobante y Factura**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Agregar botones de acción en cada pago para gestionar comprobantes y facturas.

**Tareas:**
- [ ] **Comprobante:**
  - [ ] Botón "Cargar Comprobante" (si no tiene)
  - [ ] Botón "Ver Comprobante" (si tiene)
  - [ ] Botón "Eliminar Comprobante"
  - [ ] Usar `FileUpload` y `FilePreviewModal`
- [ ] **Factura:**
  - [ ] Botón "Generar Factura (Preview)" (abre modal con datos a timbrar)
  - [ ] Botón "Timbrar Factura" (llama a FacturaloPlus API - Fase 2)
  - [ ] Botón "Ver Factura" (si ya está timbrada)
  - [ ] Indicador visual de estado de factura (pendiente/timbrada/cancelada)
- [ ] **Complemento de Pago (PPD):**
  - [ ] Detectar si la factura original es PPD (Pago en Parcialidades)
  - [ ] Generar complemento de pago al registrar el pago
  - [ ] Relacionar con factura original

**Duración estimada:** 3-4 días

---

### **📂 Fase 1.22: CRUD Inline en TODAS las Tablas**
**Estado:** 🟡 EN PROGRESO (Solo Propuestas completado)  
**Descripción:** Aplicar el sistema de edición inline con acordeón a TODAS las tablas del sistema.

**Módulos pendientes:**
- [ ] **Cobranza (Income)** - Aplicar `InlineTableRow` con acordeón
- [ ] **Pagos (Expenses)** - Aplicar `InlineTableRow` con acordeón
- [ ] **Clientes** - Aplicar `InlineTableRow` con acordeón
- [ ] **Proveedores** - Aplicar `InlineTableRow` con acordeón
- [ ] **Empleados** - Aplicar `InlineTableRow` con acordeón
- [ ] **Conceptos** - Aplicar `InlineTableRow` con acordeón
- [ ] **Cuentas Bancarias** - Aplicar `InlineTableRow` con acordeón

**Por cada módulo:**
- [ ] Identificar campos visibles en tabla
- [ ] Identificar campos del acordeón
- [ ] Implementar modo lectura con acordeón
- [ ] Implementar modo edición con acordeón
- [ ] Agregar validaciones
- [ ] Probar CRUD completo

**Duración estimada:** 1-2 días por módulo = **7-14 días total**

---

### **📚 Fase 1.23: Catálogos SAT Completos**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Base de datos completa de catálogos SAT con Select autocomplete.

**Catálogos necesarios:**
- [ ] **c_RegimenFiscal** - Régimen fiscal (obligatorio en CFDI)
  - Base de datos con todos los regímenes
  - Select con búsqueda (autocomplete)
  - Validación de compatibilidad (PF vs PM)
- [ ] **c_UsoCFDI** - Uso del CFDI (obligatorio)
  - Base de datos completa
  - Select con descripción clara
  - Filtrado por régimen fiscal del receptor
- [ ] **c_ClaveProdServ** - Clave de producto o servicio (obligatorio)
  - Base de datos con +52,000 claves
  - Select con búsqueda avanzada (por código o descripción)
  - Implementar paginación o virtualización
- [ ] **c_ClaveUnidad** - Clave de unidad de medida (obligatorio)
  - Base de datos completa
  - Select con búsqueda
  - Valores comunes destacados
- [ ] **c_FormaPago** - Forma de pago (obligatorio)
  - Base de datos (Efectivo, Transferencia, Cheque, etc.)
  - Select simple
- [ ] **c_MetodoPago** - Método de pago (obligatorio)
  - PUE (Pago en una sola exhibición)
  - PPD (Pago en parcialidades o diferido)
  - Select simple

**Implementación:**
- [ ] Crear modelo `SatCatalog` en Prisma
- [ ] Script de seed con datos oficiales del SAT
- [ ] Componente `SatCatalogSelect` reutilizable con autocomplete
- [ ] Caché en memoria para mejorar performance
- [ ] Actualización periódica de catálogos (SAT los actualiza)

**Duración estimada:** 3-4 días

---

### **🧾 Fase 1.24: Múltiples Conceptos por Factura**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Permitir agregar múltiples conceptos (líneas) en una sola factura.

**Cambios en el modelo:**
- [ ] Crear modelo `InvoiceLineItem` (relación 1:N con `Transaction`)
- [ ] Campos: `conceptId`, `quantity`, `unitPrice`, `subtotal`, `tax`, `discount`, `total`
- [ ] Snapshot de precios (copiar datos del concepto al momento de facturar)
- [ ] Calcular totales de factura sumando todas las líneas

**UI:**
- [ ] Tabla dinámica de conceptos en formulario de factura
- [ ] Botones "Agregar concepto", "Eliminar concepto"
- [ ] Edición inline de cantidad, precio unitario, descuento
- [ ] Cálculo automático de subtotales y total general
- [ ] Mostrar resumen: Subtotal, IVA, Retenciones, Total

**Validaciones:**
- [ ] Al menos 1 concepto obligatorio
- [ ] Cantidad > 0
- [ ] Precio unitario > 0
- [ ] Total de factura debe coincidir con suma de líneas

**Duración estimada:** 2-3 días

---

### **👤 Fase 1.25: Clientes - Campo "Razón Social"**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Agregar campo de razón social aparte de nombre y empresa.

**Cambios:**
- [ ] Agregar campo `razonSocial` a modelo `Client` (opcional)
- [ ] Actualizar formularios de clientes
- [ ] Mostrar en tabla de clientes
- [ ] Usar en generación de facturas (si está presente, sino usar `name`)

**Diferencias:**
- **Nombre:** "Juan Pérez" (persona física) o "Carlos Martínez" (representante legal)
- **Empresa:** "Tech Solutions SA de CV" (nombre comercial)
- **Razón Social:** "TECNOLOGÍAS Y SOLUCIONES DIGITALES SA DE CV" (legal, va en factura)

**Duración estimada:** 1 día

---

### **👷 Fase 1.26: Empleados - Conectar CRUD a BD**
**Estado:** ⏳ PENDIENTE  
**Descripción:** El CRUD de empleados tiene datos hardcoded, conectar correctamente a Prisma.

**Tareas:**
- [ ] Revisar `app/actions/employees.ts` (probablemente no existe)
- [ ] Crear server actions: `loadEmployees`, `createEmployee`, `updateEmployee`, `deleteEmployee`
- [ ] Conectar formularios a estas actions
- [ ] Agregar validaciones (nombre, email, salario, fecha ingreso, RFC)
- [ ] Seed data para pruebas
- [ ] Aplicar CRUD inline con acordeón (Fase 1.22)

**Duración estimada:** 1 día

---

### **🏢 Fase 1.27: Proveedores - Verificar CRUD**
**Estado:** ⏳ PENDIENTE (Verificación)  
**Descripción:** Verificar que el CRUD de proveedores esté correctamente conectado a BD.

**Tareas:**
- [ ] Revisar `app/actions/providers.ts`
- [ ] Probar CRUD completo (crear, editar, eliminar)
- [ ] Verificar campos especiales:
  - [ ] Extranjero (checkbox)
  - [ ] Tipo de Pago (checkbox "Pagos variables")
  - [ ] Monto fijo (si no es variable)
  - [ ] Frecuencia (mensual, quincenal, anual, etc.)
- [ ] Agregar validaciones
- [ ] Aplicar CRUD inline con acordeón (Fase 1.22)

**Duración estimada:** 0.5-1 día

---

### **👁️ Fase 1.28: Viewers de Imágenes y PDF**
**Estado:** ✅ COMPLETADO en Propuestas, ⏳ PENDIENTE en otros módulos  
**Descripción:** Implementar visor de archivos (imágenes y PDF) en cobranza y pagos.

**Módulos pendientes:**
- [ ] **Cobranza:**
  - [ ] Botón "Ver Comprobante" en acordeón
  - [ ] Usar `FilePreviewModal`
  - [ ] Soportar múltiples archivos (si aplica)
- [ ] **Pagos:**
  - [ ] Botón "Ver Comprobante" en acordeón
  - [ ] Botón "Ver Factura" (si está timbrada)
  - [ ] Usar `FilePreviewModal`

**Nota:** El componente `FilePreviewModal` ya está listo y funciona en Propuestas.

**Duración estimada:** 0.5-1 día

---

### **🔍 Fase 1.29: Filtros y Counters en Tiempo Real**
**Estado:** ⏳ PENDIENTE (Verificación)  
**Descripción:** Verificar que los contadores (KPIs) en la parte superior de las tablas se actualicen en tiempo real según los filtros aplicados.

**Módulos a verificar:**
- [ ] **Dashboard:**
  - [ ] Contadores de ingresos/egresos se actualizan con filtro de periodo
  - [ ] Tablas "Cobros Recientes" y "Pendientes" se filtran correctamente
- [ ] **Cobranza:**
  - [ ] Contadores de total cobrado, pendiente, vencido
  - [ ] Se actualizan con filtros de fecha, cliente, estatus
  - [ ] Se actualizan con búsqueda en tiempo real
- [ ] **Pagos:**
  - [ ] Contadores de total pagado, pendiente
  - [ ] Se actualizan con filtros
- [ ] **Propuestas:**
  - [ ] Contadores por estatus (enviadas, aceptadas, rechazadas)
  - [ ] Tasa de conversión se actualiza

**Si no funcionan:**
- [ ] Mover lógica de contadores a función que reciba datos filtrados
- [ ] Recalcular contadores después de aplicar filtros
- [ ] Usar `useMemo` para optimizar

**Duración estimada:** 1 día

---

### **📊 Fase 1.30: Dashboard - Proporciones y Márgenes**
**Estado:** ⏳ PENDIENTE  
**Descripción:** Ajustar dashboard para que no tenga scroll y las tablas no se salgan de la pantalla.

**Tareas:**
- [ ] Remover porcentajes hardcodeados (o calcularlos correctamente)
- [ ] Ajustar altura de tablas "Cobros Recientes" y "Pendientes"
- [ ] Usar `max-h-[calc(100vh-XXpx)]` para evitar scroll
- [ ] Responsive: ajustar en móvil, tablet, desktop
- [ ] Agregar margen inferior a las tablas
- [ ] Probar en diferentes resoluciones

**Duración estimada:** 0.5-1 día

---

## 📈 RESUMEN DE ETAPA 1

### **Estado General:**
- **Completadas:** 6 fases
- **Pendientes:** 12 fases
- **Progreso:** ~33%

### **Tiempo Estimado Restante:**
- **Rápidas (0.5-1 día):** Fases 1.25, 1.26, 1.27, 1.28, 1.30 = **3-5 días**
- **Medias (2-4 días):** Fases 1.19, 1.20, 1.21, 1.24, 1.29 = **10-15 días**
- **Grandes (7-14 días):** Fase 1.22 (CRUD inline en todas las tablas), 1.23 (Catálogos SAT) = **10-18 días**

**Total Etapa 1:** ~**23-38 días** (4-8 semanas trabajando)

---

## 🎯 ETAPAS SIGUIENTES (POST ETAPA 1)

### **Etapa 2: Integración de FacturaloPlus (CFDI)**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 2-3 semanas  
**Dependencias:** Requiere Fase 1.23 (Catálogos SAT) y Fase 1.24 (Múltiples conceptos)

**Fases:**
- [ ] 2.1: Configuración de certificados SAT (.cer + .key)
- [ ] 2.2: Cliente API FacturaloPlus completo
- [ ] 2.3: Generador de XML CFDI 4.0
- [ ] 2.4: Validación contra esquemas XSD
- [ ] 2.5: Sellado digital y timbrado
- [ ] 2.6: UI de facturación completa
- [ ] 2.7: Preview de factura antes de timbrar
- [ ] 2.8: Descarga de PDF y XML timbrados
- [ ] 2.9: Cancelación de facturas
- [ ] 2.10: Notas de crédito
- [ ] 2.11: Complemento de pago (PPD)
- [ ] 2.12: Storage de XMLs y PDFs
- [ ] 2.13: Historial y reportes de facturas

---

### **Etapa 3: Integración de Stripe (SaaS)**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 1-2 semanas

**Fases:**
- [ ] 3.1: Definición de planes (Básico, Pro, Enterprise)
- [ ] 3.2: Crear productos y precios en Stripe
- [ ] 3.3: Checkout Sessions
- [ ] 3.4: Customer Portal
- [ ] 3.5: Webhooks (payment success, failed, subscription updated)
- [ ] 3.6: Lógica de límites por plan
- [ ] 3.7: Upgrade/downgrade de planes
- [ ] 3.8: UI de Billing
- [ ] 3.9: Historial de pagos
- [ ] 3.10: Métodos de pago guardados

---

### **Etapa 4: Integración de Usuarios y Roles**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 1 semana

**Fases:**
- [ ] 4.1: Roles: Admin, Accountant, Viewer (ya en schema)
- [ ] 4.2: Middleware de permisos por rol
- [ ] 4.3: UI de gestión de usuarios por empresa
- [ ] 4.4: Invitaciones por email
- [ ] 4.5: Aceptar/rechazar invitaciones
- [ ] 4.6: Permisos granulares por módulo
- [ ] 4.7: Auditoría de acciones por usuario

---

### **Etapa 5: Super Usuarios y Membresías SaaS**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 1 semana

**Fases:**
- [ ] 5.1: Rol "SuperAdmin" para gestión de plataforma
- [ ] 5.2: Dashboard de super admin
- [ ] 5.3: Ver todas las empresas registradas
- [ ] 5.4: Métricas globales de la plataforma
- [ ] 5.5: Gestión de suscripciones de empresas
- [ ] 5.6: Soporte y mensajería interna
- [ ] 5.7: Reportes de uso de la plataforma

---

### **Etapa 6: Landing Page y SEO**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 1-2 semanas

**Fases:**
- [ ] 6.1: Diseño de landing page profesional
- [ ] 6.2: Secciones: Hero, Features, Pricing, Testimonials, FAQ, CTA
- [ ] 6.3: Blog con MDX para contenido
- [ ] 6.4: SEO: meta tags, sitemap.xml, robots.txt
- [ ] 6.5: Open Graph y Twitter Cards
- [ ] 6.6: Schema.org markup (JSON-LD)
- [ ] 6.7: Performance: Lighthouse 90+
- [ ] 6.8: Analytics (Google Analytics / Plausible)
- [ ] 6.9: Formulario de contacto
- [ ] 6.10: Integración con CRM (Hubspot / Pipedrive)

---

### **Etapa 7: Reportes Avanzados**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 2 semanas

**Fases:**
- [ ] 7.1: Implementar @tanstack/react-table
- [ ] 7.2: Filtros avanzados (fecha, cliente, monto, estatus)
- [ ] 7.3: Exportar a CSV/Excel con ExcelJS
- [ ] 7.4: Implementar recharts o chart.js
- [ ] 7.5: Reporte: Estado de Resultados (P&L)
- [ ] 7.6: Reporte: Flujo de Efectivo (Cash Flow)
- [ ] 7.7: Reporte: Obligaciones Fiscales
- [ ] 7.8: Reporte: Análisis por Cliente
- [ ] 7.9: Reporte: Análisis por Proveedor
- [ ] 7.10: Reporte: Nómina
- [ ] 7.11: Dashboard ejecutivo con gráficas

---

### **Etapa 8: IA y Optimización**
**Estado:** ⏳ NO INICIADA  
**Duración estimada:** 2-3 semanas

**Fases:**
- [ ] 8.1: Asistente contable con GPT
- [ ] 8.2: Predicción de flujo de caja
- [ ] 8.3: Detección de anomalías en gastos
- [ ] 8.4: Alertas inteligentes de vencimientos
- [ ] 8.5: Migración a PostgreSQL
- [ ] 8.6: Prisma Accelerate / Connection pooling
- [ ] 8.7: Sentry para error tracking
- [ ] 8.8: Pino logger estructurado
- [ ] 8.9: Upstash Redis para rate limiting
- [ ] 8.10: Optimización de queries Prisma
- [ ] 8.11: CDN para assets estáticos
- [ ] 8.12: Lazy loading y code splitting

---

## 🎯 PRIORIDADES INMEDIATAS (PARA HOY/MAÑANA)

### **1. Cobranza - Fase 1.19 (Precio Unitario Automático)**
**Impacto:** 🟢 ALTO - Mejora UX significativamente  
**Duración:** 2-3 horas  
**Beneficio:** Menos errores al crear cobros

### **2. Cobranza - CRUD Inline (Parte de Fase 1.22)**
**Impacto:** 🟢 ALTO - Consistencia con Propuestas  
**Duración:** 4-6 horas  
**Beneficio:** UX unificada en toda la plataforma

### **3. Pagos - CRUD Inline (Parte de Fase 1.22)**
**Impacto:** 🟢 ALTO - Consistencia con Propuestas  
**Duración:** 4-6 horas  
**Beneficio:** UX unificada en toda la plataforma

### **4. Clientes - Campo Razón Social (Fase 1.25)**
**Impacto:** 🟡 MEDIO - Necesario para CFDI correcto  
**Duración:** 1-2 horas  
**Beneficio:** Datos correctos para facturación

---

## 📊 CRONOGRAMA SUGERIDO (PRÓXIMAS 2 SEMANAS)

### **Semana 1 (18-24 Oct):**
- Lunes: Fase 1.19 (Precio automático) + Fase 1.25 (Razón social)
- Martes: Fase 1.22 - CRUD Inline Cobranza
- Miércoles: Fase 1.22 - CRUD Inline Pagos
- Jueves: Fase 1.22 - CRUD Inline Clientes + Proveedores
- Viernes: Fase 1.26 + 1.27 (Empleados y Proveedores BD)

### **Semana 2 (25-31 Oct):**
- Lunes: Fase 1.22 - CRUD Inline Conceptos + Cuentas Bancarias
- Martes-Miércoles: Fase 1.20 (Retenciones IVA/ISR)
- Jueves-Viernes: Fase 1.21 (Action buttons comprobantes/facturas)

**Al final de estas 2 semanas:**
- ✅ CRUD Inline en TODOS los módulos
- ✅ Cobranza/Pagos completamente funcionales
- ✅ Retenciones fiscales implementadas
- ✅ Action buttons para comprobantes

---

## ❓ PREGUNTAS PARA TI

1. **¿Empezamos con Cobranza (Fase 1.19 + CRUD Inline)?**
2. **¿Hay alguna fase que quieras priorizar antes?**
3. **¿Prefieres terminar toda la Etapa 1 antes de pasar a CFDI (Etapa 2)?**
4. **¿Tienes alguna fecha límite o demo que necesites mostrar?**

---

**Dime por dónde empezamos y le metemos con todo! 🚀**

