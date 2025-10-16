"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createBankAccount } from "@/modules/bank-accounts/actions/create-bank-account";
import type { BankAccountType } from "@/modules/bank-accounts/types";

export function BankAccountForm() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<BankAccountType>("bank");
  const [last4, setLast4] = useState("");
  const [bank, setBank] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createBankAccount({
        name,
        accountType,
        last4: last4 || undefined,
        bank: bank || undefined,
        currency: "MXN",
        notes: notes || undefined,
      });

      if (result.success) {
        // Reset form
        setName("");
        setAccountType("bank");
        setLast4("");
        setBank("");
        setNotes("");
      } else {
        alert(result.error || "Error al crear cuenta");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Cuenta *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Cuenta BBVA Empresarial"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountType">Tipo de Cuenta *</Label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as BankAccountType)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="bank">Cuenta Bancaria</option>
            <option value="card">Tarjeta</option>
            <option value="cash">Efectivo</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank">Banco</Label>
          <Input
            id="bank"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Ej: BBVA, Santander, Banorte"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last4">Últimos 4 Dígitos</Label>
          <Input
            id="last4"
            value={last4}
            onChange={(e) => setLast4(e.target.value.slice(0, 4))}
            placeholder="1234"
            maxLength={4}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <textarea
          id="notes"
          className="w-full rounded-md border p-2"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Información adicional sobre esta cuenta..."
        />
      </div>

      <Button type="submit" disabled={isPending}>
        <Plus className="mr-2 h-4 w-4" />
        {isPending ? "Agregando..." : "Agregar Cuenta"}
      </Button>
    </form>
  );
}


