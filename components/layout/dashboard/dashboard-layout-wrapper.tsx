"use client";

import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/layout/dashboard/header";
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
  userId: string;
  companies: UserCompanySummary[];
  children: ReactNode;
};

function DashboardLayoutContent({ userId, companies, children }: DashboardLayoutContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <DashboardSidebar companies={companies} />
      <div className={cn(
        "flex min-h-screen flex-col transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-72"
      )}>
        <DashboardHeader userId={userId} />
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutWrapper({ userId, companies, children }: DashboardLayoutContentProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent userId={userId} companies={companies}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

