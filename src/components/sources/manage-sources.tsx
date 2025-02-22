import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, X, Copy, Check, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Source {
  id: string;
  sourceId: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  dealType: string;
  payout: number;
  durationSeconds: number;
  phoneNumbers: Array<{
    id: number;
    phoneNumber: string;
    phoneNumberId: string;
  }> | null;
}

type SortConfig = {
  key: keyof Source | "";
  direction: "asc" | "desc" | null;
};

interface SourceEntry {
  name: string;
  payout: number;
  durationSeconds: number;
}

export function ManageSources() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPayout, setEditPayout] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: null,
  });
  const queryClient = useQueryClient();
  const [sourceEntries, setSourceEntries] = useState<SourceEntry[]>([
    { name: "", payout: 0, durationSeconds: 0 },
  ]);

  const { data: sources, isLoading } = useQuery({
    queryKey: ["sources-management"],
    queryFn: async () => {
      const response = await apiClient.get("/portal/client/sources/all");
      return response.data.data as Source[];
    },
  });

  const handleEdit = (source: Source) => {
    setEditingId(source.id);
    setEditName(source.name || "");
    setEditPayout(source.payout ?? 0);
    setEditDuration(source.durationSeconds ?? 0);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditPayout(0);
    setEditDuration(0);
  };

  const handleSave = async (source: Source) => {
    try {
      await apiClient.put(`/portal/client/sources/${source.id}`, {
        name: editName.trim() || undefined,
        payout: editPayout,
        durationSeconds: editDuration,
      });
      await queryClient.invalidateQueries({ queryKey: ["sources-management"] });
      setEditingId(null);
      setEditName("");
      setEditPayout(0);
      setEditDuration(0);
      toast.success("Source updated successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to update source";
      toast.error(errorMessage);
    }
  };

  const handleToggleEnabled = async (source: Source) => {
    try {
      await apiClient.put(`/portal/client/sources/${source.id}`, {
        enabled: !source.enabled,
      });
      await queryClient.invalidateQueries({ queryKey: ["sources-management"] });
      toast.success(source.enabled ? "Source disabled" : "Source enabled");
    } catch (error: any) {
      console.error("Error toggling source:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update source";
      toast.error(errorMessage);
    }
  };

  const handleAddEntry = () => {
    setSourceEntries([
      ...sourceEntries,
      { name: "", payout: 0, durationSeconds: 0 },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    setSourceEntries(sourceEntries.filter((_, i) => i !== index));
  };

  const handleEntryChange = (
    index: number,
    field: keyof SourceEntry,
    value: string,
  ) => {
    const newEntries = [...sourceEntries];
    if (field === "payout") {
      newEntries[index][field] = parseFloat(value) || 0;
    } else if (field === "durationSeconds") {
      newEntries[index][field] = parseInt(value) || 0;
    } else {
      newEntries[index][field] = value;
    }
    setSourceEntries(newEntries);
  };

  const handleNamePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const rows = pasteData.split(/\n/).filter((row) => row.trim());

    if (rows.length > 1) {
      const newEntries = rows.map((row) => {
        const [name, payout, duration] = row.split(/[,\t]/).map((item) => {
          // Remove quotes from start and end of the item
          return item.trim().replace(/^["']|["']$/g, "");
        });
        return {
          name: name || "",
          payout: parseFloat(payout || "0"),
          durationSeconds: parseInt(duration || "0", 10),
        };
      });
      setSourceEntries(newEntries);
    } else {
      // Also strip quotes when pasting a single value
      const cleanValue = pasteData.trim().replace(/^["']|["']$/g, "");
      handleEntryChange(index, "name", cleanValue);
    }
  };

  const handleCreate = async () => {
    const validEntries = sourceEntries.filter((entry) => entry.name.trim());

    if (validEntries.length === 0) {
      toast.error("Please enter at least one source");
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiClient.post(
        "/portal/client/sources/bulk",
        validEntries,
      );

      await queryClient.invalidateQueries({ queryKey: ["sources-management"] });
      setShowCreateDialog(false);
      setSourceEntries([{ name: "", payout: 0, durationSeconds: 0 }]);
      toast.success(
        `Successfully created ${validEntries.length} source${validEntries.length > 1 ? "s" : ""}`,
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to create sources";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopySourceId = async (sourceId: string) => {
    try {
      await navigator.clipboard.writeText(sourceId);
      setCopiedId(sourceId);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Source ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleSort = (key: keyof Source) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const sortedSources = useMemo(() => {
    if (!sources || !sortConfig.direction || !sortConfig.key) {
      return sources;
    }

    return [...sources].sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "");
      }

      if (sortConfig.key === "sourceId") {
        return sortConfig.direction === "asc"
          ? a.sourceId.localeCompare(b.sourceId)
          : b.sourceId.localeCompare(a.sourceId);
      }

      if (sortConfig.key === "dealType") {
        return sortConfig.direction === "asc"
          ? (a.dealType || "").localeCompare(b.dealType || "")
          : (b.dealType || "").localeCompare(a.dealType || "");
      }

      if (sortConfig.key === "payout") {
        return sortConfig.direction === "asc"
          ? (a.payout || 0) - (b.payout || 0)
          : (b.payout || 0) - (a.payout || 0);
      }

      if (sortConfig.key === "durationSeconds") {
        return sortConfig.direction === "asc"
          ? (a.durationSeconds || 0) - (b.durationSeconds || 0)
          : (b.durationSeconds || 0) - (a.durationSeconds || 0);
      }

      if (sortConfig.key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortConfig.key === "enabled") {
        return sortConfig.direction === "asc"
          ? Number(a.enabled) - Number(b.enabled)
          : Number(b.enabled) - Number(a.enabled);
      }

      return 0;
    });
  }, [sources, sortConfig]);

  const getSortIndicator = (key: keyof Source) => {
    if (sortConfig.key !== key) return "↕";
    if (sortConfig.direction === "asc") return "↑";
    if (sortConfig.direction === "desc") return "↓";
    return "↕";
  };

  const columns = useMemo(
    () => [
      { key: "name" as keyof Source, label: "Name" },
      { key: "sourceId" as keyof Source, label: "Source ID" },
      { key: "phoneNumbers" as keyof Source, label: "Phone Number(s)" },
      { key: "dealType" as keyof Source, label: "Deal Type" },
      { key: "payout" as keyof Source, label: "Payout" },
      { key: "durationSeconds" as keyof Source, label: "Duration (s)" },
      { key: "createdAt" as keyof Source, label: "Created" },
      { key: "enabled" as keyof Source, label: "Status" },
    ],
    [],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Source
        </Button>
      </div>

      <div className="rounded-md border glass-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => handleSort(column.key)}
                >
                  <Button
                    variant="ghost"
                    className="h-8 px-2 hover:bg-transparent"
                  >
                    {column.label}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSources?.map((source) => (
              <TableRow key={source.id} className="hover:bg-black/5">
                <TableCell>
                  <div className="h-8 w-8 flex items-center justify-center">
                    {/* Empty cell for consistency with other tables */}
                  </div>
                </TableCell>
                <TableCell>
                  {editingId === source.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="max-w-[300px]"
                    />
                  ) : (
                    source.name || "-"
                  )}
                </TableCell>
                <TableCell className="font-mono group relative">
                  <div className="flex items-center gap-2">
                    <span>{source.sourceId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopySourceId(source.sourceId)}
                    >
                      {copiedId === source.sourceId ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {source.phoneNumbers?.length ? (
                    <div className="space-y-1">
                      {source.phoneNumbers.map((phone) => (
                        <div
                          key={phone.id}
                          className="font-mono text-sm text-muted-foreground"
                        >
                          {phone.phoneNumber}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {source.dealType || "CPL"}
                </TableCell>
                <TableCell>
                  {editingId === source.id ? (
                    <Input
                      type="number"
                      value={editPayout}
                      onChange={(e) =>
                        setEditPayout(parseFloat(e.target.value))
                      }
                      className="max-w-[100px]"
                      min={0}
                      step={0.01}
                    />
                  ) : (
                    `$${parseFloat(source.payout?.toString() || "0").toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === source.id ? (
                    <Input
                      type="number"
                      value={editDuration}
                      onChange={(e) =>
                        setEditDuration(parseInt(e.target.value))
                      }
                      className="max-w-[100px]"
                      min={0}
                    />
                  ) : (
                    source.durationSeconds || 0
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(source.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={source.enabled}
                    onCheckedChange={() => handleToggleEnabled(source)}
                  />
                </TableCell>
                <TableCell>
                  {editingId === source.id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(source)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(source)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            setSourceEntries([{ name: "", payout: 0, durationSeconds: 0 }]);
          }
        }}
      >
        <DialogContent className="max-w-[800px] p-0 rounded-xl max-h-[85vh] flex flex-col">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Create Source</DialogTitle>
              <DialogDescription>
                Copy and paste directly from Excel, CSV, or spreadsheets into
                the name field to create multiple sources at once.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2">
                  <div className="flex-1">Source Name</div>
                  <div className="w-32">Payout ($)</div>
                  <div className="w-32">Duration (s)</div>
                  <div className="w-10"></div>
                </div>

                {sourceEntries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={entry.name}
                      onChange={(e) =>
                        handleEntryChange(index, "name", e.target.value)
                      }
                      onPaste={(e) => handleNamePaste(e, index)}
                      className="flex-1"
                      placeholder="Source name"
                    />
                    <Input
                      type="number"
                      value={entry.payout || ""}
                      onChange={(e) =>
                        handleEntryChange(index, "payout", e.target.value)
                      }
                      className="w-32"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                    />
                    <Input
                      type="number"
                      value={entry.durationSeconds || ""}
                      onChange={(e) =>
                        handleEntryChange(
                          index,
                          "durationSeconds",
                          e.target.value,
                        )
                      }
                      className="w-32"
                      min={0}
                      placeholder="0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEntry(index)}
                      disabled={sourceEntries.length === 1}
                      className="w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={handleAddEntry}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Source
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t">
            <DialogFooter className="px-6 py-4">
              <div className="flex justify-end gap-3 w-full">
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="min-w-[120px]"
                >
                  {isCreating ? "Creating..." : "Create Sources"}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
