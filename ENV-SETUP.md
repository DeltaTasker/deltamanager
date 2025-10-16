# 🔐 Configuración de Variables de Entorno - DeltaManager

## Archivo `.env` requerido

Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
# ==============================================
# DeltaManager - Variables de Entorno
# ==============================================

# ---------------------------------------------
# Base de datos
# ---------------------------------------------
DATABASE_URL="file:./prisma/dev.db"

# ---------------------------------------------
# Next.js & App
# ---------------------------------------------
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ---------------------------------------------
# Auth - NextAuth.js
# ---------------------------------------------
# Genera con: openssl rand -base64 32
AUTH_SECRET="REEMPLAZA-CON-SECRET-ALEATORIO-32-CARACTERES-MINIMO"

# ---------------------------------------------
# SMTP - Envío de emails (REQUERIDO para OTP)
# ---------------------------------------------
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password-de-google"
SMTP_FROM="DeltaManager <tu-email@gmail.com>"

# ---------------------------------------------
# OTP Config (tienen defaults, son opcionales)
# ---------------------------------------------
OTP_CODE_LENGTH="6"
OTP_EXPIRATION_MINUTES="5"
OTP_MAX_ATTEMPTS="5"
OTP_RESEND_WINDOW_SECONDS="60"
LOCALE="es-MX"

# ---------------------------------------------
# CFDI - FacturaloPlus (PRÓXIMA FASE)
# ---------------------------------------------
# FACTURALO_API_KEY="tu-api-key"
# FACTURALO_API_URL="https://dev.facturaloplus.com"

# ---------------------------------------------
# Stripe (FASE POSTERIOR)
# ---------------------------------------------
# STRIPE_SECRET_KEY="sk_test_xxx"
# STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

## 📧 Cómo configurar Gmail para SMTP

### Opción 1: App Password (Recomendado)

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. **Seguridad** → Habilita **Verificación en 2 pasos**
3. **Seguridad** → **Contraseñas de aplicaciones**
4. Genera una nueva contraseña de aplicación para "Correo"
5. Copia esa contraseña (sin espacios) como `SMTP_PASSWORD`

**Configuración:**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # La contraseña generada
SMTP_FROM="DeltaManager <tu-email@gmail.com>"
```

**Límites Gmail:** 500 emails/día

### Opción 2: Resend (Recomendado para producción)

1. Crea cuenta en https://resend.com (gratis 100 emails/día)
2. Verifica tu dominio o usa su dominio de prueba
3. Genera un API Key
4. Configuración:

```env
SMTP_HOST="smtp.resend.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="resend"
SMTP_PASSWORD="re_xxxxxxxxxxxxxxxxxxxx"  # Tu API Key
SMTP_FROM="DeltaManager <noreply@tudominio.com>"
```

### Opción 3: Brevo (Sendinblue) - 300 emails/día gratis

```env
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="tu-email@dominio.com"
SMTP_PASSWORD="tu-smtp-key"
```

## 🧪 Probar el envío de emails

1. Configura tu `.env`
2. Reinicia el servidor: `pnpm dev`
3. Ve a `/access`
4. Ingresa tu email
5. Revisa tu bandeja (y spam)

Si no llega, revisa la consola del servidor para ver errores SMTP.

## 🔒 Seguridad de AUTH_SECRET

Genera un secreto seguro con:

```bash
# En PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# En Git Bash / WSL:
openssl rand -base64 32

# O usa un generador online:
# https://generate-secret.vercel.app/32
```

## 🚨 NUNCA subas tu archivo `.env` a Git

El archivo `.gitignore` ya incluye `.env`, pero verifica que esté ahí:

```gitignore
.env
.env.local
.env*.local
```


