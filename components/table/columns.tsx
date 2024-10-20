//columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/types/supabase";
import { DataTableColumnHeader } from "@/components/table/TableColumnHeader";
import Link from "next/link";
import poshmark from "@/public/assets/images/poshmark.png";
import Image from "next/image";
import TruncatedText from "./TruncatedText";
import { ArchiveButton } from "./ArchiveButton";
import { DialogComponent } from "@/components/table/DialogComponent";
import { getProductImage } from "@/app/actions/getProductImage";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "../ui/skeleton";

type Product = Database["public"]["Tables"]["products"]["Row"];

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions2",
    header: ({ column }) => {
      return <div>Actions</div>;
    },
    cell: ({ row }) => {
      return <DialogComponent row={row.original as Product} />;
    },
  },
  {
    id: "ImageThumbnail",
    header: () => <div>Image</div>,
    cell: ({ row }) => {
      const [imageUrl, setImageUrl] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      
      useEffect(() => {
        async function fetchImage() {
          try {
            setIsLoading(true);
            const url = await getProductImage(row.original.id);
            setImageUrl(url);
          } catch (error) {
            console.error("Error fetching image:", error);
          } finally {
            setIsLoading(false);
          }
        }
      
        fetchImage();
      }, [row.original.id]);
  
      return (
        <div className="relative w-[60px] h-[60px]">
          <div
            className="absolute inset-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: isLoading ? 0 : 1 }}
          >
            {imageUrl ? (
              <Image 
                priority={true} 
                src={imageUrl} 
                alt={row.original.id || "id"} 
                width={60} 
                height={60} 
                className="-p-4"
              />
            ) : (
              <div
                className="flex justify-center items-start"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                No image available
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Title" table={table} />;
    },
    cell: ({ row }) => {
      return (
        <TruncatedText
          text={row.getValue("title")}
          length={35}
          textClassName="text-base"
          tooltipClassName="h-[200px]"
          capability="withUpdate"
        />
      );
    },
    meta: {
      filterVariant: "combo",
      sortVariant: true,
    },
  },
  {
    accessorKey: "description",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Description" table={table} />;
    },
    cell: ({ row }) => {
      return (
        <TruncatedText text={row.getValue("description")} length={50} tooltipClassName="h-[200px]" textClassName="" />
      );
    },
    meta: {
      filterVariant: "text_nomenu",
    },
  },
  {
    accessorKey: "brand",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Brand" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("brand")} length={20} />,
    meta: {
      filterVariant: "combo",
      sortVariant: true,
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "sku",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="SKU" table={table} />;
    },
    cell: ({ row }) => {
      return <TruncatedText text={row.getValue("sku")} length={10} />;
    },
    meta: {
      filterVariant: "text_nomenu",
    },
  },
  {
    accessorKey: "new_with_tag",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="NWT" table={table} />;
    },
    cell: ({ row }) => {
      const newWithTag = row?.getValue("new_with_tag") || null;
      const newWithTagValue = newWithTag ? newWithTag.toLocaleString() : "";
      return <TruncatedText text={newWithTagValue} length={20} />;
    },
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "condition",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Condition" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("condition")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },

  {
    accessorKey: "condition_notes",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Condition Notes" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("condition_notes")} length={20} />,
    meta: {
      filterVariant: "text_nomenu",
    },
  },
  {
    accessorKey: "keywords",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Keywords" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("keywords")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "sold",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Sold" table={table} />;
    },
    cell: ({ row }) => {
      const sold = row.getValue("sold");
      const soldValue = sold ? sold.toLocaleString() : "";
      return <TruncatedText text={soldValue} length={20} tooltipClassName="h-[200px]" textClassName="" />;
    },
    meta: {
      filterVariant: "text_nomenu",
    },
  },
  {
    accessorKey: "colors",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Colors" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("colors")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "department",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Department" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("department")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "category",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Category" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("category")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "subcategory",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Subcategory" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("subcategory")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "all_style_tags",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Tags" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("all_style_tags")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "size",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Size" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("size")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "material",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Material" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("material")} length={20} />,
    meta: {
      filterVariant: "combo",
    },
  },
  {
    accessorKey: "posh_id",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Platform" table={table} />;
    },
    cell: ({ row }) => (
      <div className="lowercase w-[80px] items-center align-middle">
        <Button size={"sm"} variant="ghost" asChild>
          <a
            href={`https://poshmark.com/listing/${row.getValue("posh_id")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={poshmark}
              width={40}
              alt="View on Poshmark"
              style={{ height: "auto", objectFit: "contain" }}
              priority={true} // Only use if this image is critical for above-the-fold content
            />
          </a>
        </Button>
      </div>
    ),
    enableColumnFilter: false,
    meta: {
      sortVariant: false,
    },
  },
  {
    accessorKey: "price",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Price" table={table} />;
    },
    cell: ({ row }) => {
      const value = row.getValue("price");
      const amount = value === null ? 0 : parseFloat(value as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium pr-6">{formatted}</div>;
    },
    enableColumnFilter: true,
    filterFn: "inNumberRange",
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "msrp",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="MSRP" table={table} />;
    },
    cell: ({ row }) => {
      const value = row.getValue("msrp");
      const amount = value === null ? 0 : parseFloat(value as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium pr-6">{formatted}</div>;
    },
    enableColumnFilter: true,
    filterFn: "inNumberRange",
    meta: {
      filterVariant: "range",
    },
  },
  {
    accessorKey: "item_cost",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Cost" table={table} />;
    },
    cell: ({ row }) => {
      const value = row.getValue("item_cost");
      const amount = value === null ? 0 : parseFloat(value as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium pr-6">{formatted}</div>;
    },
    enableColumnFilter: true,
    filterFn: "inNumberRange",
    meta: {
      filterVariant: "range",
      sortVariant: true,
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Created" table={table} />;
    },
    cell: ({ row }) => (
      <div className="lowercase whitespace-nowrap">
        {row.getValue("created_at") ? new Date(row.getValue("created_at")).toLocaleString() : ""}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Updated" table={table} />;
    },
    cell: ({ row }) => (
      <div className="lowercase whitespace-nowrap">
        {row.getValue("updated_at") ? new Date(row.getValue("updated_at")).toLocaleString() : ""}
      </div>
    ),
  },
  {
    accessorKey: "deleted_at",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="Archived" table={table} />;
    },
    cell: ({ row }) => (
      <div className="lowercase whitespace-nowrap">
        {row.getValue("deleted_at") ? new Date(row.getValue("deleted_at")).toLocaleString() : ""}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="db_ID" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("id")} length={20} />,
  },
  {
    accessorKey: "lp_id",
    header: ({ column, table }) => {
      return <DataTableColumnHeader column={column} title="LP_ID" table={table} />;
    },
    cell: ({ row }) => <TruncatedText text={row.getValue("lp_id")} length={20} />,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.getValue("id") as string;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product)}>Copy Item ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/home/listings/${row.getValue("id")}`}>
                <Button variant="outline" size={"sm"}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveButton productId={row.original.id} isArchived={row.original.deleted_at !== null} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
