"use client";

import Link from "next/link";
import { Building2, CreditCard, FileText, LineChart, Settings, ShieldCheck, TrendingUp, Minus } from "lucide-react";

import { CompanySwitcher } from "@/modules/companies/components/company-switcher";
import { getUserCompanies } from "@/modules/companies/server/queries";

const DASHBOARD_ROUTE = "/dashboard";
const COMPANIES_ROUTE = "/dashboard/companies";
const BILLING_ROUTE = "/dashboard/billing";
const SUBSCRIPTIONS_ROUTE = "/dashboard/subscriptions";
const SETTINGS_ROUTE = "/dashboard/settings";

const links = [
  { href: DASHBOARD_ROUTE, label: "Dashboard", icon: LineChart },
  { href: "/dashboard/income", label: "Ingresos", icon: TrendingUp },
  { href: "/dashboard/expenses", label: "Egresos", icon: Minus },
  { href: COMPANIES_ROUTE, label: "Empresas", icon: Building2 },
  { href: BILLING_ROUTE, label: "Facturación", icon: FileText },
  { href: SUBSCRIPTIONS_ROUTE, label: "Suscripciones", icon: CreditCard },
  { href: SETTINGS_ROUTE, label: "Configuración", icon: Settings },
];

type DashboardSidebarProps = {
  userId: string;
};

export async function DashboardSidebar({ userId }: DashboardSidebarProps) {
  const companies = await getUserCompanies(userId);

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-black/20 backdrop-blur-md">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Sistema Contable</span>
            <p className="text-lg font-bold text-white">DeltaManager</p>
          </div>
        </div>
        {companies.length > 0 ? (
          <CompanySwitcher companies={companies} activeCompanyId={companies.find((c) => c.isDefault)?.id} />
        ) : (
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <p className="text-sm text-gray-400">No tienes empresas asignadas.</p>
          </div>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} DeltaManager
        </p>
      </div>
    </aside>
  );
}

