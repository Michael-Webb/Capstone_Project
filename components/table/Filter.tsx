import { useState, useMemo } from "react";
import { Column, Table, RowData, ColumnFiltering } from "@tanstack/react-table";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandList, CommandInput, CommandItem } from "../ui/command";
import DebouncedInput from "./debouncedInput";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();

  const logColumnFilterValueType = (value: any) => {
    if (value === null) {
      //console.log("columnFilterValue is null.");
    } else if (Array.isArray(value)) {
      //console.log("columnFilterValue is an array.");
      value.forEach((item, index) => {
        console.log(`Type of element ${index}: ${typeof item}`);
      });
    } else {
      //console.log(`columnFilterValue is of type ${typeof value}.`);
    }
  };

  logColumnFilterValueType(columnFilterValue);

  const sortedUniqueValues = useMemo(
    () => (filterVariant === "range" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000)),
    [column.getFacetedUniqueValues(), filterVariant]
  );

  const [open, setOpen] = useState(false);

  if (filterVariant === "range") {
    try {
      const [min, max] = column?.getFacetedMinMaxValues() || [null, null];
      //console.log("min,max:", min, max);
      //console.log(Number(min?.toString()) || null, Number(max?.toString()) || null);

      const getValues = column?.getFacetedMinMaxValues() || [null, null];
      const flattenValues = getValues.flat();
      //console.log("testArray:", flattenValues);
      //console.log("getFacetedMinMaxValues result:", getValues);
      if (!getValues) return null;

      // Handle the case where the first value is an array
      const minVal = flattenValues[0];
      const maxVal = flattenValues[1];

      // Convert to number, defaulting to 0 if null or undefined
      const minNumber = Number(minVal);
      const maxNumber = Number(maxVal);

      //console.log(minNumber, maxNumber)
      return (
        <div>
          <h1>Range Filter</h1>
          <div className="grid grid-cols-2 gap-2">
            <div className="">
              <Label htmlFor={column.columnDef.id + "-min"}>Min</Label>
              <DebouncedInput
                type="number"
                min={minNumber ?? ""}
                max={maxNumber ?? ""}
                value={(columnFilterValue as [number, number])?.[0] ?? ""}
                onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
                placeholder={`Min ${minVal !== undefined ? `(${minVal})` : ""}`}
                className="w-28 border shadow rounded"
              />
            </div>
            <div>
              <Label htmlFor={column.columnDef.id + "-max"}>Max</Label>
              <DebouncedInput
                id={column.columnDef.id + "-max"}
                type="number"
                min={minNumber ?? ""}
                max={maxNumber ?? ""}
                value={(columnFilterValue as [number, number])?.[1] ?? ""}
                onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
                placeholder={`Max ${maxVal ? `(${maxVal})` : ""}`}
                className="w-28 border shadow rounded"
              />
            </div>
          </div>
          <div className="h-1" />
          <pre>{JSON.stringify(column.getFilterValue())}</pre>
        </div>
      );
    } catch (error) {
      console.error("Error in range filter for column:", column.id, error);
      return <div>Error in filter</div>;
    }
  } else if (filterVariant === "select") {
    return (
      <select
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString() || ""}
        className="w-full border shadow rounded"
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value: string) => (
          <option value={value} key={value}>
            {value === null ? "-" : value}
          </option>
        ))}
      </select>
    );
  } else if (filterVariant === "text_nomenu") {
    return (
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-full border shadow rounded"
        list={column.id + "list"}
      />
    );
  } else if (filterVariant === "combo") {
    const safeColumnFilterValue = columnFilterValue === null ? "(Blank)" : (columnFilterValue ?? "").toString();
    return (
      <>
        <Command>
          <CommandInput
            value={safeColumnFilterValue}
            onValueChange={(value: string) => {
              const newValue = value === "(Blank)" ? null : value;
              column.setFilterValue(newValue);
            }}
            placeholder={`Search... (${sortedUniqueValues.length})`}
            className="h-9"
          ></CommandInput>
          <CommandEmpty>No value found.</CommandEmpty>
          <CommandList className="-ml-2">
            <CommandGroup>
              {sortedUniqueValues.map((value: string) => (
                <CommandItem key={value}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-left"
                          onClick={() => {
                            const newValue = value === "(Blank)" ? null : value;
                            if (newValue === columnFilterValue) {
                              column.setFilterValue(undefined);
                            } else {
                              column.setFilterValue(newValue);
                            }
                            setOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn("-ml-4 h-4 w-4", safeColumnFilterValue === value ? "opacity-100" : "opacity-0")}
                          />
                          {value}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{value}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </>
    );
  } else {
    return <div>No filter options available</div>;
  }
}
