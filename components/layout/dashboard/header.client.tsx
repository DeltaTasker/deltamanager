"use client";

import Link from "next/link";
import { Menu, Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanySwitcher, type CompanyOption } from "@/modules/companies/components/company-switcher";

const PROFILE_ROUTE = "/dashboard/settings";
const SECURITY_ROUTE = "/dashboard/settings/security";
const SIGN_OUT_ROUTE = "/api/auth/signout";

interface DashboardHeaderClientProps {
  companies: CompanyOption[];
  activeCompanyId?: string;
}

export function DashboardHeaderClient({ companies, activeCompanyId }: DashboardHeaderClientProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu className="size-5" />
          <span className="sr-only">Abrir navegación</span>
        </Button>
        <h1 className="text-lg font-semibold tracking-tight text-white">Panel principal</h1>
        <div className="mx-2 hidden h-6 w-px bg-white/20 md:flex" />
        <p className="hidden text-sm text-gray-400 md:block">
          Visibilidad financiera en tiempo real para todas tus empresas.
        </p>
      </div>
      <div className="flex items-center gap-4">
        {companies.length > 0 ? (
          <div className="hidden lg:flex">
            <CompanySwitcher companies={companies} activeCompanyId={activeCompanyId} />
          </div>
        ) : null}
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Bell className="size-4" />
          <span className="sr-only">Ver notificaciones</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
              {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              Tema
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
            <DropdownMenuLabel className="text-white">Preferencias de tema</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-300 hover:bg-white/10 hover:text-white">
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-300 hover:bg-white/10 hover:text-white">
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-300 hover:bg-white/10 hover:text-white">
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
              <Avatar className="size-9 border border-white/20">
                <AvatarImage src="/placeholder-user.png" alt="Usuario" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">DM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/20">
            <DropdownMenuLabel className="text-white">Mi cuenta</DropdownMenuLabel>
            <DropdownMenuItem asChild className="text-gray-300 hover:bg-white/10 hover:text-white">
              <Link href={PROFILE_ROUTE}>Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-300 hover:bg-white/10 hover:text-white">
              <Link href={SECURITY_ROUTE}>Seguridad</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-gray-300 hover:bg-white/10 hover:text-white">
              <Link href={SIGN_OUT_ROUTE}>Cerrar sesión</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
