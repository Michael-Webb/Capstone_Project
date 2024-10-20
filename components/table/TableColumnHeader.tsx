// TableColumnHeaders.tsx
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { Column, Table, RowData } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Database } from "@/types/supabase";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Filter from "./Filter";
import ColumnHeaderVisibility from "@/components/table/ToggleColVisibility";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  table: Table<TData>;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select" | "text_nomenu" | "combo";
    sortVariant?: true | false;
  }
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  table,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { sortVariant } = column.columnDef.meta ?? {};

  return (
    <div className={cn("flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="text-left w-full px-0 justify-start">
            {title}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-80">
          <div className="grid">
            <div>
              {title}
              <ColumnHeaderVisibility column={column}></ColumnHeaderVisibility>
            </div>
            <Filter column={column} />
          </div>
        </PopoverContent>
      </Popover>

      {sortVariant === false ? (
        <></>
      ) : sortVariant === true || sortVariant === undefined || sortVariant === null ? (
        column.getIsSorted() === "desc" ? (
          <Button className="" onClick={() => column.clearSorting()} variant="ghost">
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        ) : column.getIsSorted() === "asc" ? (
          <Button className="" onClick={() => column.toggleSorting(true)} variant="ghost">
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="text-center justify-center " onClick={() => column.toggleSorting(false)} variant="ghost">
            <CaretSortIcon className="h-4 w-4" />
          </Button>
        )
      ) : (
        <div>nothing</div>
      )}
    </div>
  );
}
