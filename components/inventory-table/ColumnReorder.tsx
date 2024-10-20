// components/ColumnReorder.tsx
"use client";

import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnReorderProps<T> {
  table: Table<T>;
}

export function ColumnReorder<T>({ table }: ColumnReorderProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Reorder Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {table.getAllLeafColumns().map((column) => (
          <DropdownMenuItem
            key={column.id}
            onClick={() => {
              const newOrder = table.getState().columnOrder.filter((id) => id !== column.id);
              table.setColumnOrder([column.id, ...newOrder]);
              setTimeout(() => setOpen(true), 0);
            }}
          >
            Move {column.id} to start
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
