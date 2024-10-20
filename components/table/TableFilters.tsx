"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, FilterIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}
export function DataTableViewFilters<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex">
            <FilterIcon className="mr-2 h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100">
        <div className="grid gap-4">
        <ScrollArea className="h-40 rounded-md">

          <div className="">
            <h4 className="font-medium leading-none">Filter Columns</h4>
          </div>
          <Separator className="my-4"/>

          <div className="grid gap-2">
            
            <div className="grid grid-cols-3 items-center gap-4 pr-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder={`Filter Titles...`}
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4 pr-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder={`Filter Descriptions...`}
                value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4 pr-3">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder={`Filter Brands...`}
                value={(table.getColumn("brand")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("brand")?.setFilterValue(event.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4 pr-3">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                placeholder={`Filter Size...`}
                value={(table.getColumn("size")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("size")?.setFilterValue(event.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <Separator className="my-4"/>

          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
