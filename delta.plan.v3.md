# DeltaManager Plan v3

## Visión General
- Objetivo: completar la Fase 1 existente y planificar las Fases 2-5 para evolucionar DeltaManager en una plataforma contable SaaS lista para producción.
- Alcance: unificar acceso por correo + OTP, rediseñar UI en dark mode, estructurar dashboard modular, expandir módulos contables, preparar automatizaciones con IA y cerrar con despliegue Docker + DigitalOcean.
- Secuencia: cada fase depende de la previa; no avanzar mientras los criterios de aceptación de la fase actual no estén validados.
- Herramientas clave: Next.js (App Router), Prisma, Tailwind, Shadcn UI, pnpm, Docker, DigitalOcean, APIs CFDI (Facturalo/FacturaloPlus), servicios de IA (a definir).

## Requisitos Previos
- Mantener Node.js 20+ y pnpm 9.
- Contar con `.env.local` y variables sensibles en Secret Manager (DigitalOcean/1Password) una vez productivo.
- Documentar credenciales temporales de Hostinger en vault interno; en repositorio usar variables de entorno.
- Revisar migraciones actuales (`prisma/migrations`) antes de adicionar nuevos modelos.

## Fase 1 · Cierre y Rediseño de Acceso
### Objetivos
- Sustituir el flujo login/registro por un único acceso vía correo electrónico con OTP de 6 dígitos válido por 5 minutos.
- Configurar SMTP Hostinger con nodemailer y asegurar entregabilidad básica.
- Rediseñar pantallas auth en dark mode limpio con fuente global Montserrat (fallback Roboto) y botones gradiente azul→púrpura.

### Tareas Clave
- Backend:
  - Crear endpoint serverless para solicitar OTP (`app/api/auth/otp/route.ts` o `modules/auth/server/otp.ts`).
  - Guardar OTP con expiración en base de datos (nueva tabla `AuthOtp` en `prisma/schema.prisma`) o cache (Upstash Redis si ya disponible).
  - Implementar verificación OTP en Auth.js credentials provider (o custom route) y emitir sesión JWT.
  - Configurar nodemailer con SMTP Hostinger (`lib/mail.ts`).
- Frontend:
  - Consolidar `app/(auth)/login` y `app/(auth)/register` en `app/(auth)/access/page.tsx`.
  - Diseñar formulario en dos pasos (solicitud de código + verificación) con validaciones (Zod/React Hook Form).
  - Aplicar tipografía global en `app/globals.css` e incorporar tokens de color dark mode.
  - Actualizar componentes `Button`, `Input`, `Label` para nuevo estilo.
- UX/UI:
  - Diseñar gradiente primario (ej: `from-blue-500 via-indigo-500 to-purple-500`).
  - Añadir estados de carga y errores (mensaje si OTP expira, botón reenviar a 60s).

### Estructura de Carpetas y Archivos
- `app/(auth)/access/page.tsx` (nuevo flujo unificado).
- `app/api/auth/otp/route.ts` (API OTP).
- `modules/auth/server/otp.ts` (generación/validación OTP reutilizable).
- `modules/auth/server/mailer.ts` (wrapper nodemailer) reutilizable por futuras invitaciones.
- `prisma/schema.prisma` → agregar modelo `AuthOtp { id, email, code, expiresAt, attempts, createdAt }`.
- `modules/auth/server/auth.ts` → adaptar provider para OTP.
- Mover/archivar vistas antiguas `login` y `register`.

### Scripts y Configuración
- Variables `.env.local` nuevas:
  - `SMTP_HOST=smtp.hostinger.com`
  - `SMTP_PORT=465`
  - `SMTP_USER=verify@deltatasker.com`
  - `SMTP_PASSWORD=Delta.Tasker_2025`
  - `SMTP_SECURE=true`
- Script de utilidad: `pnpm otp:cleanup` (opcional) para remover OTP expirados via Prisma script (`scripts/cleanup-otp.ts`).
- Actualizar seed si requiere usuario demo con correo válido.

### QA y Criterios de Aceptación
- `pnpm lint`, `pnpm test` y `pnpm prisma migrate dev` ejecutan sin errores.
- Flujo OTP funciona (solicitud, recepción por correo, validación y expiración tras 5 min o 3 intentos fallidos).
- Estilos dark mode visibles en auth y componente `Button` consistente en toda la app.
- `pnpm dev` arranca sin advertencias críticas tras completar la fase.

## Fase 2 · Dashboard y Estructura
### Objetivos
- Construir panel principal con estadísticas contables iniciales, accesos rápidos y menú lateral refinado.
- Implementar layout responsive y modular con Tailwind, dejando base para áreas Contabilidad, Nómina, Facturación CFDI, Configuración.

### Tareas Clave
- Actualizar `app/dashboard/layout.tsx` y `components/layout/dashboard` para aceptar paneles dinámicos.
- Diseñar tarjetas estadísticas (`modules/reports` o `components/ui/card`) con placeholders de métricas (ingresos, egresos, facturas emitidas).
- Crear menú lateral con navegación a submódulos (`Contabilidad`, `Nómina`, `CFDI`, `Configuración`).
- Implementar `app/dashboard/page.tsx` con secciones "Estadísticas", "Accesos rápidos" y "Tareas recientes".
- Documentar estructura modular en `modules/` con carpetas por dominio (`modules/accounting`, `modules/payroll`, etc.).
- Ajustar `tailwind.config.ts` para tokens de color y tipografía global.

### Estructura Propuesta
- `app/dashboard/(overview)/page.tsx` (vista principal).
- `app/dashboard/(overview)/components/` (widgets reutilizables).
- `modules/ui/cards/` (tarjetas configurables).
- `modules/layout/sidebarLinks.ts` (definición de navegación).
- `types/dashboard.ts` (tipos de widgets y métricas).

### Scripts y Configuración
- Añadir script `pnpm lint:fix` para mantener consistencia estilística.
- Actualizar `tailwind.config.ts` con fuentes Montserrat/Roboto (`@next/font/google`).
- Añadir historia de Storybook opcional (considerar `pnpm storybook` futuro, documentar).

### QA y Criterios de Aceptación
- Dashboard responsive en breakpoints sm/md/lg.
- Navegación lateral funcional con route highlighting.
- Tests de snapshot/componentes clave (`pnpm test -- --runInBand`).
- Documentación de layout base en `delta.plan.v3.md` y diagramas (en Notion/Figma enlazados externamente).

## Fase 3 · Módulos Contables
### Objetivos
- Implementar gestión de ingresos/egresos con CRUD completo y búsqueda.
- Integrar submódulo CFDI con API Facturalo o FacturaloPlus.
- Establecer control de usuarios por roles (Administrador, Contador, Auxiliar).

### Tareas Clave
- Contabilidad:
  - Crear `modules/accounting` con servicios `transactionsService`, repositorio Prisma y componentes UI.
  - Rutas App Router: `app/dashboard/accounting/income` y `.../expenses`.
  - Formularios con validaciones Zod, tablas con filtrado y paginación.
- CFDI:
  - Crear `modules/cfdi` para integración.
  - Servicio externo (`lib/facturalo.ts`) parametrizable (API key, secret desde `.env`).
  - Workflow de timbrado: previsualización → envío a API → guardado de XML/UUID.
- Control de usuarios:
  - Ampliar schema Prisma con modelos `Role`, `UserRole` si no existen; mapear permisos.
  - Agregar middleware/guards en server actions según rol.
  - UI para asignar roles en `app/dashboard/settings/users`.

### Estructura y Archivos
- `modules/accounting/` (services, components, hooks, tests).
- `modules/cfdi/` (client API, mappers, validators).
- `modules/users/roles/` (policies, constants, hooks `useHasRole`).
- `prisma/schema.prisma` → modelos `Transaction`, `Invoice`, `Role`, `UserRole` (ajustar relaciones).
- `app/api/cfdi/*` (routes serverless para timbrado, cancelación, descarga PDF).

### Scripts y Configuración
- Variables nuevas: `FACTURALO_API_KEY`, `FACTURALO_API_SECRET` (ya previstas en README) y endpoint base.
- Script `pnpm db:migrate` tras actualizar Prisma.
- Añadir pruebas E2E específicas (Playwright) para flujos contables (`pnpm test:e2e -- --project=accounting`).

### QA y Criterios de Aceptación
- CRUD ingresos/egresos con pruebas unitarias y E2E.
- Emisión CFDI válida (ambiente sandbox) con almacenamiento de UUID y XML.
- Roles aplicados correctamente; usuarios sin permisos reciben 403 y UI oculta opciones restringidas.

## Fase 4 · Automatización e IA
### Objetivos
- Introducir automatizaciones que apoyen validación de comprobantes y predicción de flujos usando servicios IA.
- Preparar integración con asistentes DeltaTasker (Delty, Delton, etc.).

### Tareas Clave
- Diseñar pipeline de validación de comprobantes:
  - Servicio `modules/ai/validators/receiptValidator.ts` que use API externa (OpenAI, Anthropic o proveedor propio) para revisar XML CFDI.
  - Agregar columna `validationStatus` en `Invoice`.
- Predicción de flujos de caja:
  - Endpoint `app/api/insights/cashflow` que analice transacciones históricas.
  - UI dashboard -> widget "Proyección de flujo".
- Integración asistente:
  - Definir interfaz `modules/ai/assistants` con adaptadores (Delty, Delton).
  - Preparar eventos en frontend (chat lateral o modal) sin implementar UX final.

### Estructura Propuesta
- `modules/ai/clients/` (wrappers para OpenAI/Anthropic/DeltaTasker).
- `modules/ai/services/` (estrategias de validación y predicción).
- `modules/ai/hooks/` (React hooks para UI).
- `app/dashboard/ai` (vista experimental si se requiere).

### Scripts y Configuración
- Nuevas variables `.env`: `OPENAI_API_KEY`, `DELTATASKER_API_URL`, `DELTATASKER_API_KEY`.
- Script `pnpm ai:sync` para sincronizar prompts/config (opcional).
- Ejecutar `pnpm tsc --noEmit` para asegurar tipos en integraciones externas.

### QA y Criterios de Aceptación
- Automatización de validación marca comprobantes inválidos e informa al usuario.
- Predicción de flujo muestra datos basados en transacciones reales (mock si no hay historial).
- Logs auditables y bandeja de eventos para monitoreo (en `modules/ai/logs`).
- Documentación de endpoints y dependencias IA.

## Fase 5 · Evolución y Despliegue
### Objetivos
- Preparar entorno productivo con Docker y despliegue en DigitalOcean.
- Ejecutar pruebas de seguridad, rendimiento y validación CFDI 4.0.
- Completar documentación técnica y manual de uso.

### Tareas Clave
- Infraestructura:
  - Crear `Dockerfile` multi-stage (base, builder, runner) y `docker-compose.prod.yml` con servicios App + Postgres + Redis.
  - Configurar pipelines CI/CD (GitHub Actions) para build, test, push a DigitalOcean Container Registry y deploy.
- Seguridad y performance:
  - Ejecutar `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build` en CI.
  - Agregar pruebas OWASP (npm `npm audit`, `pnpm audit`, escaneo SAST opcional).
  - Stress test con k6/Artillery (`scripts/perf.ts`).
- CFDI 4.0 compliance:
  - Validar catálogo de impuestos, receptor, sellos digitales.
  - Ensayos con proveedores certificados.
- Documentación:
  - Manual de usuario (Notion/PDF) vinculado desde repo.
  - Documentar flujos en `docs/` (diagramas, ADRs).

### Estructura y Archivos
- `Dockerfile`, `docker-compose.prod.yml`.
- `.github/workflows/deploy.yml` (pipeline CI/CD).
- `docs/` (nuevos archivos: `infrastructure.md`, `manual-usuario.md`, `adr/`).
- `scripts/perf-test.ts` o `scripts/k6.js` para pruebas de carga.

### Scripts y Configuración
- Scripts npm:
  - `pnpm docker:build`
  - `pnpm docker:push`
  - `pnpm docker:deploy`
- Configurar variables DO: `DATABASE_URL`, `AUTH_SECRET`, SMTP, claves CFDI, etc.
- Añadir supervisión (DigitalOcean App Platform metrics, sentry opcional).

### QA y Criterios de Aceptación
- Pipeline CI/CD pasa en rama principal.
- Despliegue en DigitalOcean accesible con HTTPS, dominios configurados.
- Pruebas de rendimiento cumplen SLA definidos (p99 < 500ms, etc.).
- Documentación revisada y aprobada.

## Cronograma y Dependencias
- Fase 1 → 2 semanas.
- Fase 2 → 3 semanas (depende de Fase 1).
- Fase 3 → 5 semanas (requiere Fase 2).
- Fase 4 → 4 semanas (parcialmente paralela con QA de Fase 3, pero integra datos contables completos).
- Fase 5 → 3 semanas (requiere funcionalidad estable de Fases 1-4).

## Seguimiento y Control
- Reuniones semanales de seguimiento por fase.
- Uso de tableros (Jira/Linear) con épicas por fase y tareas atomizadas.
- QA continuo con checklist por fase (adjuntar en `docs/qa/phase-checklist.md`).
- Revisar métricas de error logging (Sentry/logflare) a partir de Fase 3.

## Entregables Finales
- `delta.plan.v3.md` (este documento) actualizado con decisiones y cambios.
- Reportes de QA por fase (archivos en `docs/qa/`).
- Artefactos de despliegue (imágenes Docker, pipelines y documentación).


