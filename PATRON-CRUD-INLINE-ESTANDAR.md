# 📐 PATRÓN ESTÁNDAR - CRUD INLINE CON ACORDEÓN

**Basado en:** `app/dashboard/proposals/page.tsx` (Implementación de referencia)  
**Aplicar a:** TODAS las tablas (Cobranza, Pagos, Clientes, Proveedores, Empleados, Conceptos, Cuentas)

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### **1. Edición Inline (En el mismo Row)**
- ✅ Al hacer clic en "Editar", el row se convierte en inputs
- ✅ Botones: Guardar (✓) y Cancelar (✗)
- ✅ Flechita (⬇️/⬆️) para expandir acordeón
- ✅ Fondo azul claro para distinguir modo edición

### **2. Acordeón Expandible**
- ✅ **SIEMPRE visible** (modo lectura y modo edición)
- ✅ Flechita en la última columna (junto a botones de acción)
- ✅ Al expandir: muestra campos adicionales
- ✅ En modo lectura: información + acciones (ej: seguimientos en Propuestas)
- ✅ En modo edición: inputs adicionales (descripción, notas, archivos, etc.)

### **3. Estados del Row**
1. **Lectura Normal:** Datos + Botones (Editar, Ver, Eliminar)
2. **Lectura Expandida:** Datos + Acordeón con detalles
3. **Edición Normal:** Inputs + Botones (Guardar, Cancelar, Expandir)
4. **Edición Expandida:** Inputs + Acordeón con más inputs

---

## 🏗️ ESTRUCTURA DEL COMPONENTE

### **States Necesarios:**
```typescript
const [editingId, setEditingId] = useState<string | null>(null);
const [expandedId, setExpandedId] = useState<string | null>(null);
const [editingData, setEditingData] = useState<EditingDataType>({
  // Campos editables
});
```

### **Tipos de Datos:**
```typescript
type EditingDataType = {
  id?: string;
  // Campos visibles en row (inputs principales)
  campo1: string;
  campo2: string;
  // Campos en acordeón (inputs secundarios)
  descripcion: string;
  notas: string;
  archivos: string[];
  // etc...
};
```

---

## 📋 PATRÓN DE IMPLEMENTACIÓN

### **Paso 1: Definir Columnas de la Tabla**

**Columnas VISIBLES (inputs principales):**
- Fecha
- Cliente/Proveedor/Nombre
- Concepto/Categoría
- Monto/Total
- Estado/Estatus
- **Última columna:** Flechita + Botones de acción

**Campos EN ACORDEÓN (inputs secundarios):**
- Descripción
- Notas internas
- Archivos adjuntos
- Campos fiscales (RFC, régimen, etc.)
- Campos de pago (método, banco, etc.)
- Otros datos menos frecuentes

---

### **Paso 2: Usar InlineTableRow**

```typescript
<InlineTableRow
  key={item.id}
  isEditing={editingId === item.id}
  isExpanded={expandedId === item.id}
  onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
  onSave={handleSave}
  onCancel={handleCancelEdit}
  visibleFields={[
    // Campos visibles (inputs en modo edición, texto en modo lectura)
  ]}
  expandedContent={
    // Contenido del acordeón (diferente en lectura vs edición)
  }
  actionButtons={
    // Botones de acción (Editar, Ver, Eliminar, etc.)
  }
/>
```

---

### **Paso 3: Modo Lectura (visibleFields)**

```typescript
visibleFields={[
  // Fecha
  <span key="date">{new Date(item.date).toLocaleDateString()}</span>,
  
  // Cliente
  <span key="client">{item.client?.name || "-"}</span>,
  
  // Concepto
  <span key="concept">{item.concept?.name || "-"}</span>,
  
  // Total
  <span key="total" className="font-mono">${item.total.toFixed(2)}</span>,
  
  // Estado
  <Badge key="status">{item.status}</Badge>,
]}
```

---

### **Paso 4: Modo Edición (visibleFields)**

```typescript
visibleFields={[
  // Fecha
  <Input
    key="date"
    type="date"
    value={editingData.date}
    onChange={(e) => setEditingData({...editingData, date: e.target.value})}
    className="h-9"
  />,
  
  // Cliente
  <Select
    key="client"
    value={editingData.clientId}
    onValueChange={(v) => setEditingData({...editingData, clientId: v})}
  >
    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
    <SelectContent>
      {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
    </SelectContent>
  </Select>,
  
  // Concepto
  <Select key="concept" value={editingData.conceptId} onValueChange={...}>
    {/* Similar a Cliente */}
  </Select>,
  
  // Total (calculado, solo lectura)
  <span key="total" className="font-mono text-sm">${calculateTotal().toFixed(2)}</span>,
  
  // Estado
  <Select key="status" value={editingData.status} onValueChange={...}>
    {/* Opciones de estado */}
  </Select>,
]}
```

---

### **Paso 5: Acordeón en Modo Lectura**

```typescript
expandedContent={
  editingId === item.id ? (
    // MODO EDICIÓN (ver paso 6)
  ) : (
    // MODO LECTURA
    <div className="space-y-4">
      {/* Descripción */}
      <div>
        <Label>Descripción</Label>
        <p className="text-sm text-gray-600">{item.description || "Sin descripción"}</p>
      </div>
      
      {/* Notas */}
      <div>
        <Label>Notas Internas</Label>
        <p className="text-sm text-gray-600">{item.notes || "Sin notas"}</p>
      </div>
      
      {/* Archivos */}
      <div>
        <Label>Archivos Adjuntos</Label>
        {item.attachments && JSON.parse(item.attachments).length > 0 ? (
          <div className="space-y-2">
            {JSON.parse(item.attachments).map((file, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleViewFile(file, file.split('/').pop())}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver archivo {idx + 1}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Sin archivos</p>
        )}
      </div>
      
      {/* Secciones específicas (ej: Seguimientos en Propuestas) */}
    </div>
  )
}
```

---

### **Paso 6: Acordeón en Modo Edición**

```typescript
expandedContent={
  editingId === item.id ? (
    // MODO EDICIÓN
    <div className="grid grid-cols-2 gap-4">
      {/* Descripción */}
      <div className="col-span-2">
        <Label>Descripción</Label>
        <Textarea
          value={editingData.description}
          onChange={(e) => setEditingData({...editingData, description: e.target.value})}
          rows={3}
        />
      </div>
      
      {/* Notas */}
      <div className="col-span-2">
        <Label>Notas Internas</Label>
        <Textarea
          value={editingData.notes}
          onChange={(e) => setEditingData({...editingData, notes: e.target.value})}
          rows={2}
        />
      </div>
      
      {/* File Upload */}
      <div className="col-span-2">
        <Label>Archivos Adjuntos</Label>
        <FileUpload
          accept="image/*,application/pdf,.xml,.zip"
          category="transaction-attachments"
          maxSize={10 * 1024 * 1024}
          onUploadComplete={(url) => {
            setEditingData({
              ...editingData,
              attachments: [...editingData.attachments, url]
            });
          }}
          onUploadError={(error) => toast.error(error)}
        />
        {/* Mostrar archivos actuales */}
        {editingData.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {editingData.attachments.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm truncate">{file.split('/').pop()}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingData({
                      ...editingData,
                      attachments: editingData.attachments.filter((_, i) => i !== idx)
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Preview de Totales (si aplica) */}
      <div className="col-span-2 bg-gray-50 dark:bg-gray-900 p-4 rounded">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-mono">${calculateAmounts().subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA:</span>
            <span className="font-mono">${calculateAmounts().iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>Total:</span>
            <span className="font-mono">${calculateAmounts().total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // MODO LECTURA (ver paso 5)
  )
}
```

---

### **Paso 7: Action Buttons**

```typescript
actionButtons={
  editingId === item.id ? (
    // Modo edición: NO mostrar botones aquí (ya están en InlineTableRow)
    <></>
  ) : (
    // Modo lectura: Botones de acción
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit(item);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {/* Botón Ver Archivos (si tiene) */}
      {item.attachments && JSON.parse(item.attachments).length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            const files = JSON.parse(item.attachments);
            handleViewFile(files[0], files[0].split('/').pop());
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {/* Botones específicos (ej: Ver Cobranza en Propuesta aceptada) */}
      
      {/* Eliminar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(item.id);
        }}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}
```

---

## 🔄 FUNCIONES NECESARIAS

### **handleStartEdit:**
```typescript
const handleStartEdit = (item: ItemType) => {
  setEditingId(item.id);
  setExpandedId(item.id); // Auto-expandir al editar
  setEditingData({
    id: item.id,
    // Mapear TODOS los campos necesarios
    campo1: item.campo1,
    campo2: item.campo2,
    attachments: item.attachments ? JSON.parse(item.attachments) : [],
    // etc...
  });
};
```

### **handleCancelEdit:**
```typescript
const handleCancelEdit = () => {
  setEditingId(null);
  setExpandedId(null);
  resetForm();
};
```

### **handleSave:**
```typescript
const handleSave = async () => {
  try {
    // Validaciones
    if (!editingData.campo1) {
      toast.error("Campo requerido");
      return;
    }
    
    const companyId = "temp-company-id";
    
    if (editingData.id) {
      // UPDATE
      const result = await updateItem({
        id: editingData.id,
        ...editingData,
        attachments: JSON.stringify(editingData.attachments),
      });
      
      if (result.success) {
        toast.success("Actualizado exitosamente");
        setEditingId(null);
        setExpandedId(null);
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar");
      }
    } else {
      // CREATE
      const result = await createItem({
        companyId,
        ...editingData,
        attachments: JSON.stringify(editingData.attachments),
      });
      
      if (result.success) {
        toast.success("Creado exitosamente");
        setShowNewForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear");
      }
    }
  } catch (error) {
    console.error("Error saving:", error);
    toast.error("Error al guardar");
  }
};
```

---

## 📝 CASOS ESPECIALES

### **Cobranza: Proyectos con Sub-Pagos**

Cada pago (padre e hijos) se edita independientemente:

```typescript
{/* Pago Principal (Proyecto) */}
<InlineTableRow
  key={project.id}
  // ... configuración normal
/>

{/* Sub-Pagos (si está expandido el proyecto) */}
{isProjectExpanded(project.id) && project.projectPayments?.map(payment => (
  <InlineTableRow
    key={payment.id}
    // ... cada sub-pago es editable independiente
    className="bg-muted/30" // Fondo diferente para distinguir
  />
))}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Para cada tabla, verificar:

- [ ] `InlineTableRow` importado y usado
- [ ] Estados: `editingId`, `expandedId`, `editingData`
- [ ] Funciones: `handleStartEdit`, `handleCancelEdit`, `handleSave`
- [ ] `visibleFields` correctos (lectura y edición)
- [ ] `expandedContent` completo (lectura y edición)
- [ ] `actionButtons` con todos los botones necesarios
- [ ] Flechita SIEMPRE visible (modo lectura y edición)
- [ ] Validaciones en `handleSave`
- [ ] Toast notifications
- [ ] File upload funcionando (si aplica)
- [ ] Preview de cálculos (si aplica)
- [ ] Casos especiales manejados (proyectos, seguimientos, etc.)

---

## 🎨 ESTILOS Y UX

### **Modo Edición:**
- Fondo: `bg-blue-50 dark:bg-blue-950`
- Inputs: `h-9` (altura consistente)
- Botones: Guardar (verde), Cancelar (rojo), Expandir (normal)

### **Modo Lectura:**
- Fondo: Normal (blanco/dark)
- Hover: `hover:bg-muted/50`
- Botones: Ghost variant

### **Acordeón:**
- **Lectura:** `bg-gray-50 dark:bg-gray-900`
- **Edición:** `bg-blue-50 dark:bg-blue-950`
- Border: `rounded-lg border`

---

**Este es el estándar. Toda tabla DEBE seguir este patrón.** 📐
