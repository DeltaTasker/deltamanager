# 🧪 Guía de Prueba: Sistema de Auth con OTP

## ✅ Estado Actual

### Servidor
- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ Configuración SMTP lista (Hostinger - verify@deltatasker.com)
- ✅ Base de datos configurada
- ✅ Sesión persistente de 30 días habilitada

### Variables de Entorno (`.env.local`)
```env
✅ DATABASE_URL - Configurado
✅ AUTH_SECRET - Configurado
✅ SMTP_HOST - smtp.hostinger.com
✅ SMTP_PORT - 465
✅ SMTP_USER - verify@deltatasker.com
✅ SMTP_PASSWORD - Configurado
✅ SMTP_FROM - DeltaManager <verify@deltatasker.com>
✅ OTP_CODE_LENGTH - 6 dígitos
✅ OTP_EXPIRATION_MINUTES - 5 minutos
✅ OTP_MAX_ATTEMPTS - 3 intentos
```

---

## 🎯 Cómo Probar el Sistema

### **PASO 1: Abrir la página de acceso**
1. Abre tu navegador
2. Ve a: **http://localhost:3000/access**
3. Deberías ver una pantalla elegante con:
   - Logo "DeltaManager"
   - Título: "Acceso seguro con código OTP"
   - Campo para ingresar email

### **PASO 2: Solicitar código OTP**
1. Ingresa un email válido (por ejemplo: `tu-email@gmail.com`)
2. Haz clic en **"Enviar código"**
3. Deberías ver:
   - ✅ Mensaje: "Código enviado. Revisa tu bandeja y carpeta de spam."
   - 📧 La pantalla cambia para mostrar un campo de 6 dígitos
   - ⏱️ Contador de 60 segundos para reenvío

### **PASO 3: Revisar el email**
Revisa tu bandeja de entrada (y **spam**) del email que ingresaste.

Deberías recibir un email con:
- **Asunto:** "Tu código de acceso a DeltaManager"
- **De:** DeltaManager <verify@deltatasker.com>
- **Contenido:** 
  - Código de 6 dígitos (números)
  - Mensaje de que expira en 5 minutos
  - Diseño HTML moderno con gradientes

### **PASO 4: Ingresar el código**
1. Copia el código de 6 dígitos del email
2. Pégalo o escríbelo en el campo
3. Haz clic en **"Confirmar acceso"**

### **PASO 5: Verificar sesión**
Si todo funciona correctamente:
- ✅ Mensaje: "¡Acceso concedido! Estamos redirigiéndote..."
- ✅ Redirigir automáticamente a `/dashboard`
- ✅ Ver el dashboard con sidebar, header y contenido
- ✅ Ver tu email en el menú de usuario (esquina superior derecha)

---

## 🔍 Qué Revisar en el Dashboard

Una vez dentro, verifica:

### **Navegación**
- [ ] Sidebar a la izquierda con secciones:
  - Dashboard (📊)
  - Ingresos (💰)
  - Egresos (📤)
  - Facturación (🧾)
  - Nómina (👥)
  - Reportes (📈)
  - Configuración (⚙️)

### **Header**
- [ ] Logo "DeltaManager" arriba
- [ ] Selector de empresas (actualmente: "Empresa Demo S.A.")
- [ ] Menú de usuario con tu email

### **Contenido del Dashboard**
- [ ] Cards con métricas:
  - Ingresos ($125,430)
  - Egresos ($85,200)
  - Balance ($40,230)
- [ ] Secciones de cobros y pagos pendientes
- [ ] Placeholders para gráficas futuras

### **Persistencia de Sesión**
- [ ] Cierra el navegador completamente
- [ ] Vuelve a abrir y ve a `http://localhost:3000`
- [ ] Deberías estar automáticamente en `/dashboard` (sin pedir login)

---

## ❌ Posibles Problemas y Soluciones

### **No llega el email**

**1. Revisa la carpeta de spam**
   - Los emails de servidores nuevos suelen caer ahí

**2. Verifica en la consola del servidor**
   - Busca errores de SMTP en la terminal donde corre `pnpm dev`
   - Si ves errores de conexión, puede ser:
     - Puerto bloqueado (prueba 587 en lugar de 465)
     - Credenciales incorrectas
     - Hostinger bloqueando conexiones desde tu IP

**3. Prueba con otro proveedor SMTP**
   - Cambia temporalmente a Gmail (más permisivo para pruebas)
   - O usa Resend (100 emails/día gratis)

### **Código inválido**

**1. Verifica que el código sea correcto**
   - Son 6 dígitos exactos
   - Sin espacios ni guiones

**2. Revisa la expiración**
   - El código expira en 5 minutos
   - Si pasó el tiempo, solicita uno nuevo

**3. Intentos máximos**
   - Máximo 3 intentos por código
   - Después de 3 fallos, debes solicitar un código nuevo

### **No redirige al dashboard**

**1. Revisa la consola del navegador**
   - Presiona F12 → pestaña "Console"
   - Busca errores en rojo

**2. Verifica la URL**
   - Después de confirmar, deberías ver: `http://localhost:3000/dashboard`
   - Si ves `/access?error=...`, hubo un error en la autenticación

---

## 📊 Métricas de la Prueba

Al finalizar, deberías poder confirmar:

| Componente | Estado |
|------------|--------|
| ✅ Servidor corriendo | [ ] |
| ✅ Página /access carga | [ ] |
| ✅ Envío de código funciona | [ ] |
| ✅ Email llega correctamente | [ ] |
| ✅ Código valida correctamente | [ ] |
| ✅ Redirige a /dashboard | [ ] |
| ✅ Dashboard se ve bien | [ ] |
| ✅ Sesión persiste al cerrar navegador | [ ] |
| ✅ Selector de empresas funciona | [ ] |
| ✅ Navegación por sidebar funciona | [ ] |

---

## 🚀 Siguiente Paso (Si Todo Funciona)

Una vez confirmado que el auth funciona perfectamente, el siguiente paso es:

### **FASE 2: Integración de FacturaloPlus para CFDI**

Implementación de:
- Timbrado de facturas CFDI 4.0
- Cancelación de facturas
- Notas de crédito
- Validación de certificados SAT
- Storage de XMLs y PDFs
- UI de facturación completa

**Duración estimada:** 2-3 semanas

---

## 📧 Reportar Resultados

Por favor comparte:

1. **✅ ¿Llegó el email?** (Sí/No/Spam)
2. **✅ ¿El código funcionó?** (Sí/No/Error específico)
3. **✅ ¿Entró al dashboard?** (Sí/No)
4. **✅ ¿La sesión persiste?** (Sí/No)
5. **📸 Screenshot del dashboard** (opcional pero útil)
6. **❌ Errores encontrados** (si los hay)

Con esta info podemos:
- Arreglar cualquier problema de configuración
- Continuar con la Fase 2 (FacturaloPlus)
- Ajustar lo que necesites antes de seguir

---

## 💡 Nota Importante

**El email se envía desde `verify@deltatasker.com`**, así que:
- Verifica que ese dominio/email esté configurado correctamente en Hostinger
- Si no funciona, puedo ayudarte a cambiar a Gmail o Resend
- La configuración SMTP puede ajustarse sin tocar código

¡Prueba y cuéntame cómo te va! 🚀


