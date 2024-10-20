import { Table } from "@tanstack/react-table";
import { FilterX, Filter } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
interface DataTableClearFilterProps<TData> {
  table: Table<TData>;
}

export function ClearFilters<TData>({ table }: DataTableClearFilterProps<TData>) {
  const filterState = table.getState().columnFilters;
  const filtersApplied = filterState.length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            title={filtersApplied === true ? "Clear All Filters" : "No Filters Applied"}
            variant={"outline"}
            size={"sm"}
            className="ml-auto hidden h-8 lg:flex"
          >
            {filtersApplied === true ? <FilterX className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Filter Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-96">
            {filtersApplied === true ? (
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  table.resetColumnFilters();
                }}
              >
                <FilterX className="h-4 w-4" />
                Reset Filters
              </Button>
            ) : (
              <div>Filters: None</div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Current Filters</DropdownMenuLabel>

            <pre>{JSON.stringify(table.getState().columnFilters, null, 2)}</pre>

            <ScrollBar />
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
