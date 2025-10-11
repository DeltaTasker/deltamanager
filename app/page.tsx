import Link from "next/link";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Automatiza tu contabilidad",
    description:
      "Centraliza ingresos, egresos y facturación CFDI con flujos aprobados para despachos modernos.",
  },
  {
    title: "Operación multiempresa",
    description:
      "Gestiona múltiples razones sociales, roles y permisos desde un panel unificado.",
  },
  {
    title: "Listo para SaaS",
    description:
      "Integra Stripe, FacturaloPlus y futuros módulos IA sin cambiar tu stack principal.",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-background/80">
        <div className="container flex items-center justify-between py-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Plataforma contable inteligente</span>
            <h1 className="text-3xl font-semibold tracking-tight">DeltaManager</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Comenzar prueba</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container flex flex-1 flex-col items-center justify-center gap-10 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Controla la contabilidad, nómina y facturación CFDI de todas tus empresas desde un solo lugar.
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            DeltaManager moderniza los procesos financieros con módulos pensados para despachos contables y equipos
            que evolucionan hacia modelos SaaS.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((feature) => (
            <div key={feature.title} className="space-y-2 rounded-lg border bg-card p-6 text-left shadow-sm">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>Seguridad SOC2-ready</span>
          <span>•</span>
          <span>Compatibilidad CFDI 4.0</span>
          <span>•</span>
          <span>Integraciones IA-ready</span>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} DeltaManager. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/terms">Términos</Link>
            <Link href="/privacy">Privacidad</Link>
            <Link href="/support">Soporte</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}




