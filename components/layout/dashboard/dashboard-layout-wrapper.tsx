"use client";

import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar";
import { SidebarProvider, useSidebar } from "@/components/layout/dashboard/sidebar-provider";
import { cn } from "@/lib/utils";

type UserCompanySummary = {
  id: string;
  name: string;
  role: string;
  isDefault: boolean;
};

type DashboardLayoutContentProps = {
  companies: UserCompanySummary[];
  headerSlot: ReactNode;
  children: ReactNode;
};

function DashboardLayoutContent({ companies, headerSlot, children }: DashboardLayoutContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <DashboardSidebar companies={companies} />
      <div className={cn(
        "flex min-h-screen flex-col transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-72"
      )}>
        {headerSlot}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50">
          {children}
        </main>
      </div>
    </>
  );
}

export function DashboardLayoutWrapper({ companies, headerSlot, children }: DashboardLayoutContentProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <DashboardLayoutContent companies={companies} headerSlot={headerSlot}>
          {children}
        </DashboardLayoutContent>
      </div>
    </SidebarProvider>
  );
}

