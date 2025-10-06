"use client";

import { useState } from "react";
import { VaultItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VaultListProps {
  items: VaultItem[];
  onAdd: () => void;
  onEdit: (item: VaultItem) => void;
  onDelete: (id: string) => void;
}

export function VaultList({ items, onAdd, onEdit, onDelete }: VaultListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);

    setTimeout(() => {
      navigator.clipboard.writeText("");
      setCopiedField(null);
    }, 15000);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      if (selectedItem?.id === itemToDelete) {
        setSelectedItem(null);
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 flex-col md:flex-row">
      {/* Left List Section */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        {/* Search + Add */}
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button
            onClick={onAdd}
            size="icon"
            title="Add new item"
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1 border rounded-lg h-[40vh] md:h-auto">
          <div className="p-2 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "No items found"
                  : "No items yet. Add your first one!"}
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedItem?.id === item.id ? "bg-accent" : ""
                  }`}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowPassword(false);
                  }}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">{item.title}</CardTitle>
                    {item.username && (
                      <CardDescription className="text-xs truncate">
                        {item.username}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Detail Section */}
      <div className="flex-1 w-full">
        {selectedItem ? (
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedItem.title}</CardTitle>
                  <CardDescription className="mt-1">
                    Created:{" "}
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(selectedItem)}
                    title="Edit item"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteClick(selectedItem.id)}
                    title="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItem.username && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <div className="flex gap-2">
                    <Input value={selectedItem.username} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        copyToClipboard(selectedItem.username, "username")
                      }
                      title="Copy username"
                    >
                      {copiedField === "username" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="flex gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={selectedItem.password}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(selectedItem.password, "password")
                    }
                    title="Copy password (auto-clears in 15s)"
                  >
                    {copiedField === "password" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copiedField === "password" && (
                  <p className="text-xs text-muted-foreground">
                    Password copied! Will auto-clear in 15 seconds.
                  </p>
                )}
              </div>

              {selectedItem.url && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <div className="flex gap-2">
                    <Input value={selectedItem.url} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(selectedItem.url, "_blank")}
                      title="Open URL"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {selectedItem.notes && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                    {selectedItem.notes}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {new Date(selectedItem.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center text-muted-foreground">
              <p>Select an item to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
