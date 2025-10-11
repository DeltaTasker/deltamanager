"use client";

import { useTransition } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { switchCompanyAction } from "@/modules/companies/actions/switch-company";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CompanyOption = {
  id: string;
  name: string;
  role: string;
  isDefault: boolean;
};

type Props = {
  companies: CompanyOption[];
  activeCompanyId?: string;
  onSwitch?: (companyId: string) => Promise<void> | void;
};

export function CompanySwitcher({ companies, activeCompanyId, onSwitch }: Props) {
  const [isPending, startTransition] = useTransition();

  const activeCompany = companies.find((company) => company.id === activeCompanyId) ?? companies[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-between">
          <span className="truncate text-left">
            {activeCompany ? activeCompany.name : "Selecciona empresa"}
          </span>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <ChevronsUpDown className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Empresas</DropdownMenuLabel>
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            disabled={company.id === activeCompany?.id || isPending}
            onSelect={() => {
              startTransition(async () => {
                if (onSwitch) {
                  await onSwitch(company.id);
                } else {
                  await switchCompanyAction(company.id);
                }
              });
            }}
          >
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-sm font-medium leading-none">{company.name}</p>
                <p className="text-xs capitalize text-muted-foreground">Rol: {company.role}</p>
              </div>
              <Check
                className={cn(
                  "size-4",
                  company.id === activeCompany?.id ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

