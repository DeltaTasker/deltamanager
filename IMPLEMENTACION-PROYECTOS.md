# 🚀 IMPLEMENTACIÓN COMPLETA - Proyectos + Facturación Avanzada

## 📋 CAMBIOS A REALIZAR

### 1️⃣ **Agregar Checkbox para Formulario Extendido**

Después de la línea 730 (fin del formulario actual), agregar un Row expandible que muestre:

```tsx
{/* Extended Fields Row - Proyecto y Facturación */}
{showNewForm && (
  <TableRow className="border-white/10 bg-blue-500/5">
    <TableCell colSpan={11} className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Columna 1: Datos de Proyecto */}
        <Card className="bg-slate-800/50 border-blue-500/30">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isProject"
                checked={formData.isProject}
                onChange={(e) => setFormData(prev => ({ ...prev, isProject: e.target.checked }))}
                className="w-4 h-4"
              />
              <Label htmlFor="isProject" className="text-white text-sm font-medium">
                ¿Es un Proyecto con Pagos Parciales?
              </Label>
            </div>
            
            {formData.isProject && (
              <>
                <div>
                  <Label className="text-gray-400 text-xs">Nombre del Proyecto</Label>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Ej: Implementación Sistema ERP"
                    className="bg-gray-800 border-blue-500/30 text-white text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-400 text-xs">Número de Pagos</Label>
                  <Input
                    type="number"
                    min="2"
                    max="12"
                    value={formData.numberOfPayments}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfPayments: e.target.value }))}
                    className="bg-gray-800 border-blue-500/30 text-white text-sm mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTotals && formData.numberOfPayments 
                      ? `${formData.numberOfPayments} pagos de ${formatCurrency(currentTotals.total / parseInt(formData.numberOfPayments))}`
                      : 'Ingresa cantidad para calcular'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Columna 2: Datos de Facturación */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardContent className="pt-4 space-y-3">
            <Label className="text-white text-sm font-medium">Datos de Facturación</Label>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-gray-400 text-xs">Tipo de Comprobante</Label>
                <Select 
                  value={formData.invoiceType || "PUE"} 
                  onValueChange={(value: any) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      invoiceType: value,
                      paymentMethod: value === "PPD" ? "Por Definir" : prev.paymentMethod,
                      paymentForm: value === "PPD" ? "99" : prev.paymentForm
                    }));
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white text-sm h-8 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="PUE" className="text-white">PUE - Pago en Una Exhibición</SelectItem>
                    <SelectItem value="PPD" className="text-white">PPD - Pago en Parcialidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-400 text-xs">Forma de Pago SAT</Label>
                <Select 
                  value={formData.paymentForm} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentForm: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white text-sm h-8 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="01" className="text-white">01 - Efectivo</SelectItem>
                    <SelectItem value="02" className="text-white">02 - Cheque</SelectItem>
                    <SelectItem value="03" className="text-white">03 - Transferencia</SelectItem>
                    <SelectItem value="04" className="text-white">04 - Tarjeta de Crédito</SelectItem>
                    <SelectItem value="28" className="text-white">28 - Tarjeta de Débito</SelectItem>
                    <SelectItem value="99" className="text-white">99 - Por Definir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs">Método de Pago</Label>
              <Input
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                placeholder="Ej: Transferencia, Efectivo..."
                className="bg-gray-800 border-purple-500/30 text-white text-sm mt-1"
                disabled={formData.invoiceType === "PPD"}
              />
              {formData.invoiceType === "PPD" && (
                <p className="text-xs text-yellow-500 mt-1">PPD: Método se define al recibir cada pago</p>
              )}
            </div>

            <div>
              <Label className="text-gray-400 text-xs">Condiciones de Pago</Label>
              <Input
                value={formData.paymentConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentConditions: e.target.value }))}
                placeholder="Ej: Net 30, Inmediato..."
                className="bg-gray-800 border-purple-500/30 text-white text-sm mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TableCell>
  </TableRow>
)}
```

---

### 2️⃣ **Actualizar handleCreate para Proyectos**

Reemplazar la función `handleCreate` actual:

```tsx
const handleCreate = () => {
  if (!formData.clientId || !formData.conceptId || !formData.quantity || !formData.unitPrice) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  const concept = concepts.find(c => c.id === formData.conceptId);
  if (!concept) return;

  const quantity = parseFloat(formData.quantity);
  const unitPrice = parseFloat(formData.unitPrice);
  const totals = calculateTotals(formData.conceptId, quantity, unitPrice);
  const client = clients.find(c => c.id === formData.clientId);

  if (formData.isProject) {
    // Crear proyecto con pagos parciales
    const numberOfPayments = parseInt(formData.numberOfPayments);
    if (numberOfPayments < 2) {
      alert("Un proyecto debe tener al menos 2 pagos");
      return;
    }
    if (!formData.projectName) {
      alert("Ingresa el nombre del proyecto");
      return;
    }

    const projectId = `proj-${Date.now()}`;
    const paymentAmount = totals.total / numberOfPayments;

    // Crear el proyecto padre
    const projectTransaction: IncomeTransaction = {
      id: projectId,
      clientId: formData.clientId,
      clientName: client?.company || "",
      conceptId: formData.conceptId,
      conceptName: concept.name,
      quantity,
      unitPrice,
      subtotal: totals.subtotal,
      iva: totals.iva,
      retencionISR: totals.retencionISR,
      total: totals.total,
      date: formData.date,
      isProject: true,
      projectName: formData.projectName,
      totalProjectAmount: totals.total,
      numberOfPayments,
      invoiceType: formData.invoiceType || "PPD",
      paymentMethod: formData.paymentMethod || "Por Definir",
      paymentForm: formData.paymentForm,
      paymentConditions: formData.paymentConditions,
      invoiceStatus: "pending",
      isBilled: false,
      status: "pending"
    };

    // Crear pagos parciales
    const partialPayments: IncomeTransaction[] = [];
    for (let i = 1; i <= numberOfPayments; i++) {
      const paymentDate = new Date(formData.date);
      paymentDate.setMonth(paymentDate.getMonth() + (i - 1));

      partialPayments.push({
        id: `${projectId}-p${i}`,
        clientId: formData.clientId,
        clientName: client?.company || "",
        conceptId: formData.conceptId,
        conceptName: concept.name,
        quantity: quantity / numberOfPayments,
        unitPrice,
        subtotal: totals.subtotal / numberOfPayments,
        iva: totals.iva / numberOfPayments,
        retencionISR: totals.retencionISR / numberOfPayments,
        total: paymentAmount,
        date: paymentDate.toISOString().split('T')[0],
        parentProjectId: projectId,
        paymentNumber: i,
        isProject: false,
        invoiceType: formData.invoiceType || "PPD",
        paymentMethod: "Por Definir",
        paymentForm: "99",
        invoiceStatus: "pending",
        isBilled: false,
        status: "pending"
      });
    }

    setTransactions(prev => [...prev, projectTransaction, ...partialPayments]);
    alert(`✅ Proyecto "${formData.projectName}" creado con ${numberOfPayments} pagos parciales`);
  } else {
    // Crear cobro regular
    const newTransaction: IncomeTransaction = {
      id: `trans-${Date.now()}`,
      clientId: formData.clientId,
      clientName: client?.company || "",
      conceptId: formData.conceptId,
      conceptName: concept.name,
      quantity,
      unitPrice,
      subtotal: totals.subtotal,
      iva: totals.iva,
      retencionISR: totals.retencionISR,
      total: totals.total,
      date: formData.date,
      isProject: false,
      invoiceType: formData.invoiceType || "PUE",
      paymentMethod: formData.paymentMethod || "Transferencia",
      paymentForm: formData.paymentForm,
      paymentConditions: formData.paymentConditions,
      invoiceStatus: "pending",
      isBilled: false,
      status: formData.status
    };

    setTransactions(prev => [...prev, newTransaction]);
  }

  setShowNewForm(false);
  resetForm();
};
```

---

### 3️⃣ **Renderizar Tabla con Acordeón**

Reemplazar la sección de `{/* Existing Transactions */}` (línea 733) con:

```tsx
{/* Existing Transactions with Accordion */}
{filteredTransactions.map((transaction) => (
  <React.Fragment key={transaction.id}>
    {/* Main Transaction Row */}
    <TableRow 
      className={`border-white/10 hover:bg-white/5 ${transaction.isProject ? 'cursor-pointer' : ''}`}
      onClick={() => transaction.isProject && toggleProject(transaction.id)}
    >
      {/* Columna expandir/contraer */}
      <TableCell className="p-3 w-[40px]">
        {transaction.isProject && (
          <div className="text-gray-400">
            {expandedProjects.has(transaction.id) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </TableCell>

      <TableCell className="p-3 text-gray-300 text-sm">{formatDate(transaction.date)}</TableCell>
      
      <TableCell className="p-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {transaction.isProject && <FolderOpen className="h-4 w-4 text-blue-400" />}
            <div className="text-white font-medium text-sm">
              {transaction.isProject ? transaction.projectName : transaction.clientName}
            </div>
          </div>
          {/* Segunda línea: Datos fiscales */}
          <div className="text-xs text-gray-500">
            {transaction.invoiceType && (
              <>
                <span className={transaction.invoiceType === "PPD" ? "text-yellow-400" : "text-green-400"}>
                  {transaction.invoiceType}
                </span>
                {' • '}
                {transaction.paymentMethod}
                {' • '}
                Forma: {transaction.paymentForm}
                {transaction.paymentConditions && (
                  <>
                    {' • '}
                    {transaction.paymentConditions}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="p-3">
        <div className="text-gray-300 text-sm">{transaction.conceptName}</div>
        {transaction.isProject && (
          <div className="text-xs text-blue-400">
            {transaction.numberOfPayments} pagos • {formatCurrency(transaction.total / (transaction.numberOfPayments || 1))}/pago
          </div>
        )}
      </TableCell>

      <TableCell className="p-3 text-white text-sm text-center">{transaction.quantity}</TableCell>
      <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.unitPrice)}</TableCell>
      <TableCell className="p-3 text-white text-sm">{formatCurrency(transaction.subtotal)}</TableCell>
      <TableCell className="p-3 text-green-400 text-sm">+{formatCurrency(transaction.iva)}</TableCell>
      <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(transaction.total)}</TableCell>
      
      <TableCell className="p-3">
        <div className="space-y-1">
          {getStatusBadge(transaction.status)}
          {transaction.invoiceNumber && (
            <div className="text-xs text-blue-400">{transaction.invoiceNumber}</div>
          )}
          {transaction.invoiceStatus === "preview" && (
            <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">Preview</Badge>
          )}
          {transaction.invoiceStatus === "stamped" && (
            <Badge className="bg-green-500/20 text-green-500 text-xs">Timbrado</Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell className="p-3">
        <div className="flex items-center gap-1">
          {/* Botón Preview */}
          {!transaction.isBilled && transaction.invoiceStatus === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handlePreviewInvoice(transaction.id); }}
              className="h-8 text-blue-400 hover:bg-blue-500/10"
              title="Preview Factura"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {/* Botón Timbrar */}
          {transaction.invoiceStatus === "preview" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleStampInvoice(transaction.id); }}
              className="h-8 text-green-400 hover:bg-green-500/10"
              title="Timbrar"
            >
              <FileCheck className="h-4 w-4" />
            </Button>
          )}

          {/* Botón Complemento (solo para PPD timbrados y pagados) */}
          {transaction.invoiceType === "PPD" && 
           transaction.invoiceStatus === "stamped" && 
           transaction.status === "received" && 
           !transaction.parentProjectId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleGenerateComplement(transaction.id); }}
              className="h-8 text-purple-400 hover:bg-purple-500/10"
              title="Complemento de Pago"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleDelete(transaction.id); }}
            className="h-8 text-red-400 hover:bg-red-500/10"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>

    {/* Pagos Parciales (si el proyecto está expandido) */}
    {transaction.isProject && expandedProjects.has(transaction.id) && (
      <>
        {getProjectPayments(transaction.id).map((payment) => (
          <TableRow 
            key={payment.id} 
            className="border-white/10 bg-slate-800/40 hover:bg-slate-800/60"
          >
            {/* Sangría visual */}
            <TableCell className="p-3 w-[40px]"></TableCell>
            <TableCell className="p-3 pl-12 text-gray-400 text-sm">
              {formatDate(payment.date)}
            </TableCell>
            
            <TableCell className="p-3 pl-12">
              <div className="space-y-1">
                <div className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                    Pago {payment.paymentNumber}/{transaction.numberOfPayments}
                  </span>
                  {payment.clientName}
                </div>
                {/* Segunda línea: Datos fiscales del pago parcial */}
                <div className="text-xs text-gray-500">
                  {payment.paymentMethod !== "Por Definir" ? (
                    <>
                      {payment.paymentMethod}
                      {' • '}
                      Forma: {payment.paymentForm}
                    </>
                  ) : (
                    <span className="text-yellow-500">Método de pago pendiente</span>
                  )}
                </div>
              </div>
            </TableCell>

            <TableCell className="p-3 pl-12 text-gray-400 text-sm">{payment.conceptName}</TableCell>
            <TableCell className="p-3 text-gray-300 text-sm text-center">{payment.quantity.toFixed(2)}</TableCell>
            <TableCell className="p-3 text-gray-300 text-sm">{formatCurrency(payment.unitPrice)}</TableCell>
            <TableCell className="p-3 text-gray-300 text-sm">{formatCurrency(payment.subtotal)}</TableCell>
            <TableCell className="p-3 text-green-400 text-sm">+{formatCurrency(payment.iva)}</TableCell>
            <TableCell className="p-3 text-white font-semibold text-sm">{formatCurrency(payment.total)}</TableCell>
            
            <TableCell className="p-3">
              <div className="space-y-1">
                {getStatusBadge(payment.status)}
                {payment.paymentComplements && payment.paymentComplements.length > 0 && (
                  <div className="text-xs text-purple-400">
                    {payment.paymentComplements.length} complemento(s)
                  </div>
                )}
              </div>
            </TableCell>
            
            <TableCell className="p-3">
              <div className="flex items-center gap-1">
                {/* Botón Complemento para pago parcial */}
                {payment.status === "received" && transaction.invoiceStatus === "stamped" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateComplement(payment.id)}
                    className="h-8 text-purple-400 hover:bg-purple-500/10"
                    title="Complemento de Pago"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </>
    )}
  </React.Fragment>
))}
```

---

### 4️⃣ **Agregar Handlers de Facturación**

Después de `handleDelete`, agregar:

```tsx
const handlePreviewInvoice = (id: string) => {
  const previewUrl = `/invoices/preview-${id}.pdf`;
  setTransactions(prev => prev.map(t => 
    t.id === id 
      ? { ...t, invoiceStatus: "preview" as const, invoicePreviewUrl: previewUrl }
      : t
  ));
  alert(`✅ Preview de factura generado\n(Se abrirá en nueva ventana cuando se integre FacturaloPlus)`);
};

const handleStampInvoice = (id: string) => {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
  const xmlUrl = `/invoices/${invoiceNumber}.xml`;
  const pdfUrl = `/invoices/${invoiceNumber}.pdf`;

  setTransactions(prev => prev.map(t => 
    t.id === id 
      ? { 
          ...t, 
          invoiceStatus: "stamped" as const, 
          isBilled: true,
          invoiceNumber,
          invoiceXmlUrl: xmlUrl,
          invoiceStampedPdfUrl: pdfUrl
        }
      : t
  ));

  alert(`✅ Factura timbrada: ${invoiceNumber}\nXML y PDF generados\n(Integración con FacturaloPlus pendiente)`);
};

const handleGenerateComplement = (id: string) => {
  const transaction = transactions.find(t => t.id === id);
  if (!transaction) return;

  const complementId = `comp-${Date.now()}`;
  const complementXml = `/complements/COMP-${transaction.invoiceNumber}-${complementId}.xml`;

  const newComplement = {
    id: complementId,
    date: new Date().toISOString().split('T')[0],
    amount: transaction.total,
    xmlUrl: complementXml
  };

  setTransactions(prev => prev.map(t => 
    t.id === id 
      ? { 
          ...t, 
          paymentComplements: [...(t.paymentComplements || []), newComplement]
        }
      : t
  ));

  alert(`✅ Complemento de pago generado\nFolio: ${complementId}\n(Integración con FacturaloPlus pendiente)`);
};
```

---

### 5️⃣ **Actualizar TableHeader**

Agregar columna de expansión:

```tsx
<TableHeader>
  <TableRow className="border-white/10">
    <TableHead className="text-gray-400 w-[40px]"></TableHead> {/* Expansión */}
    <TableHead className="text-gray-400 w-[120px]">Fecha</TableHead>
    <TableHead className="text-gray-400 w-[250px]">Cliente/Proyecto</TableHead>
    <TableHead className="text-gray-400 w-[200px]">Concepto</TableHead>
    <TableHead className="text-gray-400 w-[80px]">Cant.</TableHead>
    <TableHead className="text-gray-400 w-[100px]">P. Unit.</TableHead>
    <TableHead className="text-gray-400 w-[100px]">Subtotal</TableHead>
    <TableHead className="text-gray-400 w-[100px]">IVA</TableHead>
    <TableHead className="text-gray-400 w-[120px]">Total</TableHead>
    <TableHead className="text-gray-400 w-[120px]">Estado</TableHead>
    <TableHead className="text-gray-400 w-[150px]">Acciones</TableHead>
  </TableRow>
</TableHeader>
```

---

### 6️⃣ **Actualizar resetForm**

```tsx
const resetForm = () => {
  setFormData({
    clientId: "",
    conceptId: "",
    quantity: "1",
    unitPrice: "",
    date: new Date().toISOString().split('T')[0],
    status: "pending",
    isProject: false,
    projectName: "",
    numberOfPayments: "1",
    invoiceType: null,
    paymentMethod: "Por Definir",
    paymentForm: "99",
    paymentConditions: ""
  });
  setClientSearch("");
  setConceptSearch("");
};
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Agregar Row de campos extendidos después del formulario principal
- [ ] Actualizar `handleCreate` para manejar proyectos
- [ ] Reemplazar renderizado de tabla con acordeón
- [ ] Agregar handlers de facturación (preview, timbrar, complemento)
- [ ] Actualizar TableHeader con columna de expansión
- [ ] Actualizar `resetForm` con nuevos campos
- [ ] Importar `React` para Fragment
- [ ] Probar creación de proyecto
- [ ] Probar expansión/contracción de proyectos
- [ ] Probar preview/timbrado/complemento

---

## 🎯 RESULTADO ESPERADO

1. ✅ Formulario con toggle para proyectos
2. ✅ Campos de facturación (PPD/PUE, método, forma SAT)
3. ✅ Creación de proyectos con N pagos parciales automáticos
4. ✅ Acordeón funcional (expandir/contraer)
5. ✅ Pagos parciales con sangría visual y color diferente
6. ✅ UI de 2 renglones (datos + fiscales)
7. ✅ Botones Preview/Timbrar/Complemento funcionales (mock)
8. ✅ Estados visuales de factura

