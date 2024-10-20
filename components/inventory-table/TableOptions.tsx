// components/TableOptions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface TableOptionsProps {
  showHardDelete: boolean;
  onToggleHardDelete: (show: boolean) => void;
  showMigrateImages: boolean;
  onToggleMigrateImages: (show: boolean) => void;
}

export function TableOptions({ 
  showHardDelete, 
  onToggleHardDelete, 
  showMigrateImages, 
  onToggleMigrateImages 
}: TableOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Table Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showHardDelete}
          onCheckedChange={onToggleHardDelete}
        >
          Show Delete
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showMigrateImages}
          onCheckedChange={onToggleMigrateImages}
        >
          Show Migrate
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}