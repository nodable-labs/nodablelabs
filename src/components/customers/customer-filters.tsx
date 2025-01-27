import { Input } from "@/components/ui/input"
import { Search, Columns } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react";

interface CustomerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  availableColumns: { key: string; label: string }[];
  activeColumns: string[];
  onColumnToggle: (columnKey: string) => void;
  isLoading?: boolean;
}

export function CustomerFilters({ 
  searchQuery,
  onSearchChange,
  availableColumns,
  activeColumns,
  onColumnToggle,
  isLoading = false
}: CustomerFiltersProps) {
  const [open, setOpen] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState<string[]>(activeColumns);

  // Keep checkedColumns in sync with activeColumns from parent
  useEffect(() => {
    setCheckedColumns(activeColumns);
  }, [activeColumns]);

  const handleItemSelect = (columnKey: string) => {
    // Prevent unchecking if it would result in no columns being visible
    if (checkedColumns.includes(columnKey) && checkedColumns.length <= 1) {
      return;
    }
    
    onColumnToggle(columnKey);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-full glass-panel p-4 rounded-lg">
        <div className="relative flex-1 max-w-[630px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            className="w-full bg-white/50 pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="ml-4"
              disabled={isLoading}
            >
              <Columns className="h-4 w-4 mr-2" />
              Manage Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-white border rounded-md shadow-md"
          >
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {availableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={checkedColumns.includes(column.key)}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleItemSelect(column.key);
                  }}
                  className="cursor-pointer"
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 