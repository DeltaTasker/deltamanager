import Link from "next/link";

import { 
  ArrowRight, 
  Calculator, 
  FileText, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap,
  Check,
  Star,
  Sparkles,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calculator,
    title: "Contabilidad Completa",
    description: "Gestión integral de ingresos, egresos, balances y reportes financieros en tiempo real con análisis predictivos impulsados por IA.",
  },
  {
    icon: FileText,
    title: "Facturación CFDI 4.0",
    description: "Timbrado automático, cancelaciones y notas de crédito con FacturaloPlus integrado. Compatible con todos los regímenes fiscales.",
  },
  {
    icon: Users,
    title: "Multiempresa",
    description: "Administra múltiples empresas, usuarios y roles con un solo panel de control. Switcheo instantáneo entre contextos.",
  },
  {
    icon: TrendingUp,
    title: "Análisis Financiero",
    description: "Dashboards interactivos con métricas, KPIs y proyecciones de flujo de caja. Visualiza el desempeño en tiempo real.",
  },
  {
    icon: Shield,
    title: "Seguridad Enterprise",
    description: "Encriptación SOC2, auditorías y controles de acceso avanzados. Tus datos protegidos con estándares bancarios.",
  },
  {
    icon: Zap,
    title: "Automatización IA",
    description: "Validación automática de comprobantes, clasificación inteligente y predicciones de gastos con machine learning avanzado.",
  },
];

const stats = [
  { number: "500+", label: "Empresas activas", color: "from-blue-400 to-cyan-400" },
  { number: "99.9%", label: "Uptime garantizado", color: "from-green-400 to-emerald-400" },
  { number: "24/7", label: "Soporte técnico", color: "from-purple-400 to-pink-400" },
  { number: "CFDI 4.0", label: "100% compatible", color: "from-amber-400 to-orange-400" },
];

const testimonials = [
  {
    name: "María González",
    role: "CFO, TechCorp México",
    content: "DeltaManager transformó nuestra operación contable. Ahorramos 15 horas semanales en tareas repetitivas.",
    rating: 5
  },
  {
    name: "Carlos Hernández",
    role: "Contador Público Certificado",
    content: "La mejor plataforma que he usado. La automatización de CFDI es impecable y el soporte es excepcional.",
    rating: 5
  },
  {
    name: "Ana Martínez",
    role: "Directora Financiera, Startup SaaS",
    content: "Desde que usamos DeltaManager, nuestra contabilidad es un 300% más eficiente. Altamente recomendado.",
    rating: 5
  }
];

const pricing = [
  {
    name: "Starter",
    price: "999",
    description: "Perfecto para pequeñas empresas y emprendedores",
    features: [
      "Hasta 3 empresas",
      "Facturación CFDI ilimitada",
      "1 usuario incluido",
      "Soporte por email",
      "Almacenamiento 5GB"
    ]
  },
  {
    name: "Professional",
    price: "2,499",
    description: "Ideal para firmas contables y medianas empresas",
    features: [
      "Hasta 10 empresas",
      "Facturación CFDI ilimitada",
      "5 usuarios incluidos",
      "Soporte prioritario 24/7",
      "Almacenamiento 50GB",
      "IA y automatizaciones",
      "API acceso completo"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Solución a medida para grandes corporativos",
    features: [
      "Empresas ilimitadas",
      "Todo lo de Professional",
      "Usuarios ilimitados",
      "Gestor de cuenta dedicado",
      "Almacenamiento ilimitado",
      "SLA personalizado",
      "Implementación guiada"
    ]
  }
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" style={{animationDelay: "2s"}}></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500/10 blur-3xl" style={{animationDelay: "1s"}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/50">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">DeltaManager</span>
              <span className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-1 text-xs font-bold text-white">PRO</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Características
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Precios
              </Link>
              <Link href="#testimonials" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Testimonios
              </Link>
              <Button asChild className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105">
                <Link href="/access">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-blue-300">Calificación 5.0 estrellas • +500 empresas confían en nosotros</span>
            </div>
            
            <h1 className="mb-8 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
              La Plataforma Contable
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Más Avanzada de México
                </span>
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 opacity-50"></span>
              </span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-300 sm:text-2xl">
              Automatiza tu contabilidad, facturación CFDI 4.0 y nómina con inteligencia artificial.
              <br />
              <span className="font-semibold text-white">La solución definitiva para contadores modernos.</span>
            </p>
            
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="group h-14 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 px-8 text-lg font-bold text-white shadow-2xl shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-blue-500/70">
                <Link href="/access">
                  Prueba Gratis 30 Días
                  <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 border-2 border-white/30 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/50">
                Ver Demo en Vivo
              </Button>
            </div>

            <div className="mt-12 flex justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Cancela cuando quieras</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards animation */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:scale-105 hover:border-white/30 hover:shadow-2xl"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 transition-opacity group-hover:opacity-10`}></div>
                <div className="relative">
                  <div className={`mb-2 text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-gray-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              Todo lo que necesitas para
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                dominar tu contabilidad
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Funcionalidades enterprise diseñadas para maximizar tu productividad
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl transition-all hover:scale-105 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 transition-all group-hover:from-blue-500/10 group-hover:to-purple-500/10"></div>
                <div className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="leading-relaxed text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              Amado por contadores
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                en todo México
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Miles de profesionales confían en DeltaManager para su operación diaria
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 backdrop-blur-xl"
              >
                <div className="mb-4 flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              Precios transparentes
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                sin sorpresas
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              Elige el plan perfecto para tu negocio. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricing.map((plan, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-2xl border p-8 backdrop-blur-xl transition-all hover:scale-105 ${
                  plan.featured
                    ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-2xl shadow-blue-500/30'
                    : 'border-white/10 bg-gradient-to-br from-white/5 to-white/10'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-1 text-xs font-bold text-white">
                    POPULAR
                  </div>
                )}
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
                  <p className="mb-6 text-sm text-gray-400">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">${plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-400">/mes</span>}
                  </div>
                  <Button 
                    className={`w-full ${
                      plan.featured
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.price === "Custom" ? "Contactar Ventas" : "Comenzar Prueba"}
                  </Button>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-400" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl shadow-blue-500/50">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative">
              <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
                ¿Listo para transformar tu contabilidad?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                Únete a cientos de empresas que ya automatizaron su operación contable con DeltaManager
              </p>
              <Button asChild size="lg" className="h-16 bg-white px-12 text-lg font-bold text-blue-600 shadow-2xl hover:scale-105 hover:bg-gray-100">
                <Link href="/access">
                  Comenzar Ahora - Es Gratis
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <p className="mt-6 text-sm text-blue-100">
                ✨ Sin tarjeta de crédito • 30 días gratis • Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/30 px-4 py-12 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 flex items-center justify-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">DeltaManager</span>
          </div>
          <p className="mb-6 text-gray-400">
            © 2025 DeltaManager. Todos los derechos reservados.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-white">Términos</Link>
            <Link href="#" className="hover:text-white">Privacidad</Link>
            <Link href="#" className="hover:text-white">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
