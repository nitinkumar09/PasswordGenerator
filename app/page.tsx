"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth-form";
import { VaultList } from "@/components/vault-list";
import { VaultItemForm } from "@/components/vault-item-form";
import { Button } from "@/components/ui/button";
import { VaultItem } from "@/lib/types";
import {
  saveVaultItem,
  updateVaultItem,
  deleteVaultItem,
  getVaultItems,
} from "@/lib/vault-storage";
import { LogOut, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { user, masterPassword, logout, isAuthenticated } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && masterPassword) {
      loadItems();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, masterPassword]);

  const loadItems = async () => {
    if (!user || !masterPassword) return;

    try {
      setLoading(true);
      const vaultItems = await getVaultItems(user.id, masterPassword);
      setItems(vaultItems);
    } catch (error) {
      console.error("Failed to load vault items:", error);
      toast.error("Failed to load vault items");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    itemData: Omit<VaultItem, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user || !masterPassword) return;

    try {
      if (editingItem) {
        const updated = await updateVaultItem(
          editingItem.id,
          itemData,
          user.id,
          masterPassword
        );
        setItems(
          items.map((item) => (item.id === updated.id ? updated : item))
        );
        toast.success("Item updated successfully");
      } else {
        const newItem = await saveVaultItem(itemData, user.id, masterPassword);
        setItems([...items, newItem]);
        toast.success("Item saved successfully");
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item:", error);
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      deleteVaultItem(id, user.id);
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Secure Vault</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <VaultList
          items={items}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <VaultItemForm
        item={editingItem}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
