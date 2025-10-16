# 🧪 CHECKLIST DE PRUEBAS - DeltaManager

## ✅ **MÓDULOS AUDITADOS Y VALIDADOS**

### 1. **Clientes** ✅
- [x] Crear cliente con todos los campos
- [x] Crear cliente solo con campos requeridos (nombre, razón social)
- [x] Validar RFC (12-13 caracteres)
- [x] Validar email formato válido
- [x] Editar cliente
- [x] Eliminar cliente (soft delete)
- [x] Buscar clientes
- [x] Filtrar clientes activos/inactivos

**Edge Cases:**
- [x] RFC con menos de 12 caracteres → Error
- [x] RFC con más de 13 caracteres → Error
- [x] Email sin @ → Error
- [x] Nombre vacío → Error
- [x] Razón social vacía → Error

---

### 2. **Conceptos** ✅
- [x] Crear concepto con precio por defecto
- [x] Configurar IVA Incluido vs +IVA
- [x] Configurar retenciones ISR e IVA
- [x] Validar tasas de impuestos (0-100%)
- [x] Cálculos correctos en UI
- [x] Editar concepto
- [x] Eliminar concepto (soft delete)

**Edge Cases:**
- [x] Tasa IVA > 100% → Error
- [x] Tasa IVA < 0% → Error
- [x] Precio negativo → Error
- [x] Nombre vacío → Error

**Cálculos Verificados:**
- [x] +IVA: $12,000 → Subtotal: $12,000, IVA: $1,920, Total: $13,920
- [x] IVA Incluido: $12,000 → Subtotal: $10,344.83, IVA: $1,655.17, Total: $12,000
- [x] Retenciones ISR y IVA se calculan correctamente
- [x] Redondeo a 2 decimales

---

### 3. **Proveedores** ✅
- [x] Crear proveedor nacional con RFC
- [x] Crear proveedor extranjero sin RFC
- [x] Configurar pagos fijos (monto + frecuencia)
- [x] Configurar pagos variables
- [x] Validar RFC solo si no es extranjero
- [x] Editar proveedor
- [x] Eliminar proveedor (soft delete)

**Edge Cases:**
- [x] Proveedor extranjero con RFC → Permitido pero no requerido
- [x] Pago fijo sin monto → Error
- [x] Pago fijo sin frecuencia → Error
- [x] Nombre vacío → Error

---

### 4. **Empleados** ✅
- [x] Crear empleado con todos los campos
- [x] Validar RFC (12-13 caracteres)
- [x] Validar CURP (18 caracteres)
- [x] Validar NSS (11 dígitos)
- [x] Configurar salario y frecuencia de pago
- [x] Editar empleado
- [x] Eliminar empleado (soft delete)

**Edge Cases:**
- [x] CURP con longitud incorrecta → Error
- [x] NSS con longitud incorrecta → Error
- [x] Salario negativo → Error
- [x] Nombre o apellido vacío → Error

---

### 5. **Cobranza (Income)** ✅
- [x] Crear cobro simple
- [x] Crear proyecto con múltiples pagos
- [x] Seleccionar cliente y concepto
- [x] Cálculos automáticos de impuestos
- [x] Subir comprobantes de pago (PDF, XML, imágenes)
- [x] Seleccionar cuenta bancaria
- [x] Estados: paid, pending, debt
- [x] Editar cobro
- [x] Eliminar cobro
- [x] Filtros por período
- [x] Filtros por estado de pago
- [x] Filtros por cuenta bancaria

**Edge Cases:**
- [x] Proyecto sin nombre → Error
- [x] Proyecto con 0 pagos → Error
- [x] Cliente no seleccionado → Error
- [x] Concepto no seleccionado → Error
- [x] Cantidad <= 0 → Error
- [x] Precio unitario <= 0 → Error

**Proyectos:**
- [x] Se crea transacción padre
- [x] Se crean N transacciones hijas
- [x] Cada pago tiene su número (1/4, 2/4, etc.)
- [x] Montos se dividen correctamente
- [x] Acordeón muestra pagos del proyecto

---

### 6. **Pagos (Expenses)** ✅
- [x] Crear pago a proveedor
- [x] Crear pago a empleado
- [x] Subir comprobantes (PDF, XML, imágenes)
- [x] Subir facturas
- [x] Seleccionar cuenta bancaria
- [x] Estados de pago
- [x] Editar pago
- [x] Eliminar pago
- [x] Filtros funcionales

**Edge Cases:**
- [x] Sin proveedor ni empleado → Error
- [x] Monto <= 0 → Error
- [x] Descripción vacía → Error

---

### 7. **Propuestas** ✅
- [x] Crear propuesta
- [x] Seleccionar cliente y concepto
- [x] Subir archivos adjuntos (PDF, imágenes, ZIP)
- [x] Cálculos automáticos
- [x] Estados: draft, sent, viewed, accepted, rejected, expired
- [x] Botón "Aceptar" genera cobro automáticamente
- [x] Cobro generado hereda cliente, concepto, total
- [x] Cobro generado tiene estado "pending" e invoiceType "PUE"
- [x] Editar propuesta
- [x] Eliminar propuesta

**Edge Cases:**
- [x] Título vacío → Error
- [x] Cliente no seleccionado → Error
- [x] Concepto no seleccionado → Error
- [x] Precio unitario <= 0 → Error

---

### 8. **Cuentas Bancarias** ✅
- [x] Crear cuenta bancaria
- [x] Tipos: bank, card, cash, other
- [x] Últimos 4 dígitos
- [x] Nombre del banco
- [x] Moneda
- [x] Activa/Inactiva
- [x] Editar cuenta
- [x] Eliminar cuenta
- [x] Filtros en Income y Expenses funcionan

---

### 9. **Dashboard** ✅
- [x] KPIs de Ingresos, Egresos, Balance
- [x] Filtros de período (semana, quincena, mes, año, custom)
- [x] Cobros pendientes (top 8)
- [x] Pagos pendientes (top 8)
- [x] Tablas con scroll bonito
- [x] Diseño responsive
- [x] Altura de pantalla sin scroll de plataforma
- [x] Márgenes correctos

---

## 🔍 **CASOS DE USO SECUNDARIOS**

### **Flujo Completo: Propuesta → Cobro → Factura**
1. [x] Crear cliente
2. [x] Crear concepto con impuestos
3. [x] Crear propuesta para cliente
4. [x] Aceptar propuesta
5. [x] Verificar que se creó cobro automáticamente
6. [x] Cobro tiene estado "pending"
7. [x] Cobro tiene invoiceType "PUE"
8. [ ] Timbrar factura (Pendiente Etapa 2)

### **Flujo Completo: Proyecto de Cobranza**
1. [x] Crear cliente
2. [x] Crear concepto
3. [x] Crear proyecto con 4 pagos
4. [x] Verificar que se crearon 4 transacciones hijas
5. [x] Cada pago tiene paymentNumber 1, 2, 3, 4
6. [x] Acordeón muestra todos los pagos
7. [x] Editar pago individual
8. [x] Marcar pago como "paid"
9. [x] Verificar que KPIs se actualizan

### **Flujo Completo: Proveedor con Pago Fijo**
1. [x] Crear proveedor con pago fijo quincenal de $5,000
2. [x] Crear pago a proveedor
3. [x] Verificar que aparece en Dashboard
4. [x] Subir factura PDF
5. [x] Visualizar factura en modal

---

## 🚨 **VALIDACIONES DEL SERVIDOR**

### **Clientes**
- [x] Nombre requerido
- [x] Razón social requerida
- [x] RFC 12-13 caracteres si se proporciona
- [x] Email válido si se proporciona

### **Conceptos**
- [x] Nombre requerido
- [x] Tasas de impuestos 0-100%
- [x] Precio >= 0

### **Proveedores**
- [x] Nombre requerido
- [x] Razón social requerida
- [x] RFC solo si no es extranjero
- [x] Monto de pago fijo > 0 si es fijo

### **Empleados**
- [x] Nombre y apellido requeridos
- [x] RFC 12-13 caracteres
- [x] CURP 18 caracteres
- [x] NSS 11 dígitos
- [x] Salario >= 0

### **Transacciones**
- [x] Total > 0
- [x] Cliente requerido para income
- [x] Proveedor/Empleado requerido para expense
- [x] Nombre de proyecto requerido si isProject
- [x] Número de pagos > 0 si isProject

### **Propuestas**
- [x] Título requerido
- [x] Cliente requerido
- [x] Concepto requerido
- [x] Precio unitario > 0

---

## 📊 **RENDIMIENTO Y OPTIMIZACIÓN**

- [x] Queries con índices en Prisma
- [x] Serialización de Decimals a Numbers
- [x] Filtros funcionan en tiempo real
- [x] No hay N+1 queries
- [x] Includes optimizados en Prisma
- [x] Revalidación de paths después de mutaciones

---

## 🎨 **UX Y DISEÑO**

- [x] Toasts en lugar de alerts nativos
- [x] Mensajes de error claros en español
- [x] Loading states
- [x] Modales de confirmación personalizados
- [x] Scroll personalizado en tablas
- [x] Diseño responsive
- [x] Dark mode consistente
- [x] Iconos coherentes
- [x] Badges con colores semánticos

---

## 🔐 **SEGURIDAD**

- [x] Validaciones del lado del servidor
- [x] Validaciones del lado del cliente
- [x] Soft delete en lugar de hard delete
- [x] Sanitización de inputs
- [x] Validación de formatos (RFC, CURP, NSS, email)
- [x] Prevención de datos inválidos en DB

---

## ✅ **ESTADO FINAL**

**Total de Módulos Auditados:** 9/9 (100%)
**Total de Validaciones:** 50+ implementadas
**Total de Edge Cases Verificados:** 30+
**Total de Flujos Completos:** 3/3

**ETAPA 1 COMPLETADA AL 100%** 🎉

---

## 📝 **NOTAS PARA ETAPA 2**

- Integrar FacturaloPlus para timbrado CFDI
- Implementar preview de factura antes de timbrar
- Implementar cancelación de facturas
- Implementar complementos de pago (PPD)
- Configuración de certificados SAT
- Validación con SAT
- Reportes de facturación

