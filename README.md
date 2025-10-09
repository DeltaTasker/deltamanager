# DeltaManager

DeltaManager es una plataforma contable y administrativa multiempresa preparada para SaaS.

## Requisitos

- Node.js 20+
- PNPM 9

## Configuración

1. Clonar el repositorio y entrar al directorio.
2. Instalar dependencias: `pnpm install`.
3. Crear `.env.local` a partir de `.env.example`.
4. Ejecutar migraciones: `pnpm prisma migrate dev --name init`.
5. Ejecutar el seed inicial: `pnpm tsx scripts/seed.ts`.

Usuario demo: `admin@delta.local` / `Password123!`

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Levanta el entorno de desarrollo con Turbopack |
| `pnpm build` | Compila la aplicación |
| `pnpm lint` | Ejecuta ESLint (sin advertencias permitidas) |
| `pnpm tsc --noEmit` | Revisión de tipos |
| `pnpm prisma migrate dev` | Nueva migración Prisma |
| `pnpm prisma generate` | Reconstruye el cliente Prisma |
| `pnpm tsx scripts/seed.ts` | Inserta datos demo |

## Estructura principal

- `app/` (App Router)
  - `(auth)/` login y registro
  - `(dashboard)/` shell autenticada con middleware
  - `(marketing)/` landing pública
  - `api/` handlers REST (Auth y Empresas)
- `modules/`
  - `auth/`: integraciones Auth.js, registro, seed
  - `companies/`: queries multiempresa, switcher y acción server
- `components/`: UI base (Shadcn + layout dashboard)
- `lib/`: Prisma client, utilidades, config runtime
- `config/`: `siteConfig`, validaciones
- `prisma/`: `schema.prisma`, migraciones y seed
- `scripts/`: automatizaciones (seed)
- `types/`: extensiones para NextAuth

## Autenticación

- Auth.js v5 (JWT) con Prisma adapter.
- Credenciales (email + password).
- Middleware protege `/dashboard`, `/api` y rutas app internas.
- Callback session expone `user.id` tipado (`types/next-auth.d.ts`).

## Multiempresa

- Modelos `Company`, `UserCompany`, `Role`, `Subscription`, `Payment`.
- Selector de empresa (`CompanySwitcher`) con server action `switchCompanyAction`.
- Seed genera rol admin + empresa demo + suscripción activa.

## Dashboard inicial

- Layout protegido, sidebar con enlaces y switcher.
- Header con selector, notificaciones placeholder y acciones de usuario.
- Home con tarjetas demo y placeholders para próximas fases.

## Pendientes siguientes fases

- Flujos completos de invitaciones/roles.
- Integración Stripe (fase 2).
- Timbrado FacturaloPlus, nómina y reportes.
- Pruebas automatizadas + CI.
# DeltaManager

DeltaManager es una plataforma SaaS multiempresa para contabilidad y administración financiera con módulos de ingresos, egresos, facturación CFDI, nómina y reportes.

## Requisitos

- Node.js >= 20
- pnpm 9.x

## Configuración

Instalación de dependencias:

```bash
pnpm install
```

Variables de entorno:

1. Copia `.env.example` a `.env.local`.
2. Completa los valores obligatorios (ver sección de variables).

## Scripts principales

- `pnpm dev`: modo desarrollo con Turbopack.
- `pnpm build`: compila la aplicación.
- `pnpm lint`: ejecuta ESLint.
- `pnpm typecheck`: valida tipos.
- `pnpm test`: pruebas unitarias con Vitest.
- `pnpm test:e2e`: pruebas E2E con Playwright.
- `pnpm db:migrate`: aplica migraciones de Prisma.
- `pnpm db:seed`: ejecuta seed inicial.

## Estructura inicial

- `app/`: App Router (marketing, auth, dashboard, api routes).
- `components/`: UI reutilizable (Shadcn UI).
- `modules/`: lógica de dominio por vertical.
- `lib/`: utilidades, clientes externos.
- `config/`: carga de variables y policies.
- `prisma/`: esquema y migraciones.
- `scripts/`: automatizaciones.

## Variables de entorno

```
NEXT_PUBLIC_APP_URL=
DATABASE_URL="file:./dev.db"
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FACTURALO_API_KEY=
FACTURALO_API_SECRET=
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
OPENAI_API_KEY=
RESEND_API_KEY=
```

## Roadmap fases

1. Fundamentals & Auth
2. Billing & Subscription
3. CFDI Invoicing & Expenses
4. Payroll & Reporting
5. AI & Optimization

