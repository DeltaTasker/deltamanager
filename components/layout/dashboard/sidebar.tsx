"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Receipt,
  Users,
  Tags,
  CreditCard,
  UserCircle,
  Building,
  Settings,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type UserCompanySummary = {
  id: string;
  name: string;
  role: string;
  isDefault: boolean;
};

type DashboardSidebarProps = {
  companies: UserCompanySummary[];
};

const links = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Vista general"
  },
  {
    title: "Ingresos",
    icon: TrendingUp,
    isCollapsible: true,
    items: [
      { href: "/dashboard/income", label: "Cobranza", icon: DollarSign },
      { href: "/dashboard/income/clients", label: "Clientes", icon: Users },
      { href: "/dashboard/income/concepts", label: "Conceptos", icon: Tags },
    ],
  },
  {
    title: "Egresos",
    icon: TrendingDown,
    isCollapsible: true,
    items: [
      { href: "/dashboard/expenses", label: "Pagos", icon: CreditCard },
      { href: "/dashboard/expenses/employees", label: "Empleados", icon: UserCircle },
      { href: "/dashboard/expenses/suppliers", label: "Proveedores", icon: Building },
      { href: "/dashboard/expenses/services", label: "Servicios", icon: Receipt },
    ],
  },
  { 
    href: "/dashboard/config", 
    label: "Configuración", 
    icon: Settings,
    description: "Ajustes del sistema"
  },
];

export function DashboardSidebar({ companies }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Ingresos: true,
    Egresos: true,
  });

  const toggleSection = (title: string) => {
    if (!isCollapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 flex h-screen flex-col border-r border-white/10 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-xl transition-all duration-300 z-40",
      isCollapsed ? "w-20" : "w-72"
    )}>
      {/* Logo/Brand */}
      <div className="relative flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 p-6">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed && "justify-center"
        )}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 ring-2 ring-white/20">
            <span className="text-xl font-black text-white">Δ</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-base font-extrabold tracking-tight text-white">DeltaManager</p>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Sistema Contable</span>
            </div>
          )}
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-gray-400 shadow-lg transition-all duration-200 hover:bg-slate-800 hover:text-white"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {links.map((item) => {
          if ("isCollapsible" in item && item.isCollapsible) {
            const Icon = item.icon;
            const isExpanded = expandedSections[item.title] && !isCollapsed;
            
            return (
              <div key={item.title} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.title)}
                  className={cn(
                    "group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                    "hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent text-gray-300 hover:text-white",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className={cn(
                    "flex items-center gap-3",
                    isCollapsed && "justify-center"
                  )}>
                    <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}
                    />
                  )}
                </button>
                {!isCollapsed && (
                  <div
                    className={cn(
                      "ml-3 space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out border-l-2 border-white/5 pl-3",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const active = isActive(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-sm ring-1 ring-white/10"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <SubIcon className={cn(
                            "h-4 w-4 shrink-0 transition-all duration-200",
                            active ? "text-blue-400 scale-110" : "group-hover:scale-110"
                          )} />
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-md ring-1 ring-white/20"
                  : "text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "h-5 w-5 shrink-0 transition-all duration-200",
                active ? "text-blue-400 scale-110" : "group-hover:scale-110"
              )} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/80 px-6 py-4 backdrop-blur-sm">
          <p className="text-center text-[10px] font-medium text-gray-500">
            © {new Date().getFullYear()} DeltaManager · v1.0.0
          </p>
        </div>
      )}
    </aside>
  );
}

