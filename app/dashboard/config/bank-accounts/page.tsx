"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CreditCard, Wallet, Building2, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { loadBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from "@/app/actions/bank-accounts";
import type { BankAccount } from "@prisma/client";

const ACCOUNT_TYPE_LABELS = {
  bank: "Cuenta Bancaria",
  card: "Tarjeta",
  cash: "Efectivo",
  other: "Otro",
};

const ACCOUNT_TYPE_ICONS = {
  bank: Building2,
  card: CreditCard,
  cash: Wallet,
  other: DollarSign,
};

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    accountType: "bank" as "bank" | "card" | "cash" | "other",
    bank: "",
    last4: "",
    currency: "MXN",
    notes: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const companyId = "temp-company-id";
      const data = await loadBankAccounts(companyId);
      setAccounts(data);
    } catch (error) {
      console.error("Error loading bank accounts:", error);
      toast.error("Error al cargar cuentas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const companyId = "temp-company-id";
      const result = await createBankAccount({
        companyId,
        ...formData,
        last4: formData.last4 || undefined,
        bank: formData.bank || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast.success("Cuenta creada exitosamente");
        setShowForm(false);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al crear cuenta");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error al crear cuenta");
    }
  };

  const handleStartEdit = (account: BankAccount) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      accountType: account.accountType as "bank" | "card" | "cash" | "other",
      bank: account.bank || "",
      last4: account.last4 || "",
      currency: account.currency,
      notes: account.notes || "",
      isActive: account.isActive,
    });
    setShowForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const result = await updateBankAccount({
        id: editingId,
        ...formData,
        last4: formData.last4 || undefined,
        bank: formData.bank || undefined,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast.success("Cuenta actualizada exitosamente");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadData();
      } else {
        toast.error(result.error || "Error al actualizar cuenta");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error al actualizar cuenta");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteBankAccount(deleteTargetId);

      if (result.success) {
        toast.success("Cuenta eliminada exitosamente");
        await loadData();
      } else {
        toast.error(result.error || "Error al eliminar cuenta");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error al eliminar cuenta");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      accountType: "bank",
      bank: "",
      last4: "",
      currency: "MXN",
      notes: "",
      isActive: true,
    });
  };

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cuentas Bancarias</h1>
          <p className="text-muted-foreground">
            Gestiona las cuentas bancarias y métodos de pago para tracking de transacciones
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? "Cancelar" : "Nueva Cuenta"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Cuenta" : "Nueva Cuenta"}</CardTitle>
            <CardDescription>
              Registra cuentas bancarias, tarjetas o efectivo para control de flujo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre de la Cuenta *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Cuenta BBVA Empresarial"
                />
              </div>

              <div>
                <Label>Tipo de Cuenta *</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Cuenta Bancaria</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Banco</Label>
                <Input
                  value={formData.bank}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
                  placeholder="BBVA, Santander, Banorte..."
                />
              </div>

              <div>
                <Label>Últimos 4 Dígitos</Label>
                <Input
                  value={formData.last4}
                  onChange={(e) => setFormData(prev => ({ ...prev, last4: e.target.value.slice(0, 4) }))}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>

              <div>
                <Label>Moneda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MXN">MXN (Pesos Mexicanos)</SelectItem>
                    <SelectItem value="USD">USD (Dólares)</SelectItem>
                    <SelectItem value="EUR">EUR (Euros)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label>Cuenta Activa</Label>
              </div>

              <div className="col-span-2">
                <Label>Notas</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Información adicional..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={editingId ? handleSaveEdit : handleCreate}>
                {editingId ? "Guardar Cambios" : "Crear Cuenta"}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle>Cuentas Registradas ({accounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No hay cuentas registradas. Agrega tu primera cuenta.
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => {
                const Icon = ACCOUNT_TYPE_ICONS[account.accountType as keyof typeof ACCOUNT_TYPE_ICONS] || DollarSign;
                return (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30">
                        <Icon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{account.name}</h3>
                          {account.isActive ? (
                            <Badge variant="default" className="bg-green-500/20 text-green-400">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Inactiva</Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                          <span>{ACCOUNT_TYPE_LABELS[account.accountType as keyof typeof ACCOUNT_TYPE_LABELS]}</span>
                          {account.bank && <span>• {account.bank}</span>}
                          {account.last4 && <span>• •••• {account.last4}</span>}
                          <span>• {account.currency}</span>
                        </div>
                        {account.notes && (
                          <p className="mt-1 text-sm text-gray-500">{account.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(account.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cuenta"
        description="¿Estás seguro de que deseas eliminar esta cuenta bancaria? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}

