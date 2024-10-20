// @/components/TableDemo.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  RowData,
  VisibilityState,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
  getPaginationRowModel
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


import { DialogComponent } from "@/components/inventory-table/DialogComponent";
import { ColumnToggle } from "@/components/inventory-table/ColumnToggle";
import { ColumnReorder } from "@/components/inventory-table/ColumnReorder";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArchiveButton } from "./ArchiveButton";
import { HardDeleteButton } from "./HardDeleteButton";
import { TableOptions } from "@/components/inventory-table/TableOptions";
import { ChevronUp, ChevronDown, List } from "lucide-react"; 
import { createClient } from "@/utils/supabase/client";
import { Product } from "../../types/product-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
//import PaginationControls from "./PaginationControls";
import { ImageUploadMigration } from "@/components/inventory-table/ImageUploadMigration";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const supabase = createClient();

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerName?: string;
  }
}

async function getFirstImageUrl(productId: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("listing-images").list(productId, {
    limit: 1,
    sortBy: { column: "name", order: "asc" },
  });

  if (error || !data || data.length === 0) {
    //console.error("Error fetching image:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("listing-images").getPublicUrl(`${productId}/${data[0].name}`);

  return publicUrl;
}

const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    className="flex items-center"
  >
    {title}
    <span className="ml-2">
      {{
        asc: <ChevronUp className="h-4 w-4" />,
        desc: <ChevronDown className="h-4 w-4" />,
      }[column.getIsSorted() as string] ?? null}
    </span>
  </Button>
);

const TruncatedCell = ({
  value,
  maxWidth = 200,
  maxLines = 1,
}: {
  value: string;
  maxWidth?: number;
  maxLines?: number;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`w-[200px] overflow-hidden text-ellipsis max-w-[${maxWidth}px]`}
          style={{
            display: "-webkit-box",
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: "vertical",
          }}
        >
          {value}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="max-w-sm">
        <p className="max-h-[300px] overflow-y-auto">{value}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const columnHelper = createColumnHelper<Product>();

const createColumns = (showHardDelete: boolean, showMigrateImages: boolean) => [
  columnHelper.display({
    id: "view_dialog",
    header: "View Details",
    cell: ({ row }) => (
      <div className="flex space-x-2 items-center justify-center">
        <DialogComponent row={row.original} />
      </div>
    ),
    meta: { headerName: "View Details" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Link href={`/dashboard/listings/${row.original.id}`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <ArchiveButton productId={row.original.id} isArchived={row.original.deleted_at !== null} />
        {showHardDelete && <HardDeleteButton productId={row.original.id} />}
        {showMigrateImages && (
          <ImageUploadMigration listingId={row.original.id} imageGalleryCurrent={row.original.image_gallery_Current} />
        )}
      </div>
    ),
    header: "Actions",
    meta: { headerName: "Actions" },
    size: 100,
    enableHiding: true,
  }),
  
  columnHelper.accessor("id", {
    header: ({ column }) => <SortableHeader column={column} title="Main Image" />,
    meta: { headerName: "Main Image" },
    size: 100,
    enableHiding: true,
    cell: (info) => {
      const [imageUrl, setImageUrl] = useState<string | null>(null);
      useEffect(() => {
        getFirstImageUrl(info.getValue()).then(setImageUrl);
      }, [info.getValue()]);

      return imageUrl ? (
        <div className="flex items-center justify-center">
          <Image
            src={imageUrl}
            alt="Product"
            width={75}
            height={75}
            priority={true} 
            style={{
              objectFit: "cover",
              width: "75px",
              height: "75px",
            }}
          />
        </div>
      ) : <div className="flex items-center justify-center h-[75px]">No Image</div>;
    },
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    meta: { headerName: "Title" },
    enableResizing: true,
    size: 200, // Set to 200px as per your requirement
    enableHiding: true,
    cell: (info) => <TruncatedCell value={info.getValue()} maxWidth={250} maxLines={1} />,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => <SortableHeader column={column} title="Description" />,
    meta: { headerName: "Description" },
    size: 200,
    enableHiding: true,
    cell: (info) => <div className="max-h-20 overflow-y-auto">{info.getValue()}</div>,
  }),
  columnHelper.accessor("brand", {
    header: ({ column }) => <SortableHeader column={column} title="Brand" />,
    meta: { headerName: "Brand" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("sku", {
    header: ({ column }) => <SortableHeader column={column} title="SKU" />,
    meta: { headerName: "SKU" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("new_with_tag", {
    header: ({ column }) => <SortableHeader column={column} title="NWT" />,
    meta: { headerName: "NWT" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("condition", {
    header: ({ column }) => <SortableHeader column={column} title="Condition" />,
    meta: { headerName: "Condition" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("condition_notes", {
    header: ({ column }) => <SortableHeader column={column} title="Condition Notes" />,
    meta: { headerName: "Condition Notes" },
    size: 150,
    enableHiding: true,
    cell: (info) => <TruncatedCell value={info.getValue()} maxWidth={250} maxLines={1} />,

  }),
  columnHelper.accessor("keywords", {
    header: ({ column }) => <SortableHeader column={column} title="Keywords" />,
    meta: { headerName: "Keywords" },
    size: 150,
    enableHiding: true,
  }),
  columnHelper.accessor("sold", {
    header: ({ column }) => <SortableHeader column={column} title="Sold Status" />,
    meta: { headerName: "Sold Status" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("colors", {
    header: ({ column }) => <SortableHeader column={column} title="Colors" />,
    meta: { headerName: "Colors" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("department", {
    header: ({ column }) => <SortableHeader column={column} title="Department" />,
    meta: { headerName: "Department" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("category", {
    header: ({ column }) => <SortableHeader column={column} title="Category" />,
    meta: { headerName: "Category" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("subcategory", {
    header: ({ column }) => <SortableHeader column={column} title="Subcategory" />,
    meta: { headerName: "Subcategory" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("all_style_tags", {
    header: ({ column }) => <SortableHeader column={column} title="Style Tags" />,
    meta: { headerName: "Style Tags" },
    size: 150,
    enableHiding: true,
  }),
  columnHelper.accessor("price", {
    header: ({ column }) => <SortableHeader column={column} title="Price" />,
    meta: { headerName: "Initial Price" },
    size: 100,
    enableHiding: true,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,

  }),
  columnHelper.accessor("msrp", {
    header: ({ column }) => <SortableHeader column={column} title="MSRP" />,
    meta: { headerName: "MSRP" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("item_cost", {
    header: ({ column }) => <SortableHeader column={column} title="COGS" />,
    meta: { headerName: "COGS" },
    size: 80,
    enableHiding: true,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,

  }),
 
  columnHelper.accessor("size", {
    header: ({ column }) => <SortableHeader column={column} title="Size" />,
    meta: { headerName: "Size" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("material", {
    header: ({ column }) => <SortableHeader column={column} title="DB Material" />,
    meta: { headerName: "DB Material" },
    size: 100,
    enableHiding: true,
  }),
  columnHelper.accessor("lp_id", {
    header: ({ column }) => <SortableHeader column={column} title="LP ID" />,
    meta: { headerName: "LP ID" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("posh_id", {
    header: ({ column }) => <SortableHeader column={column} title="Poshmark ID" />,
    meta: { headerName: "Poshmark ID" },
    size: 150,
    enableHiding: true,
  }),
  columnHelper.accessor("image_gallery_count_Current", {
    header: ({ column }) => <SortableHeader column={column} title="Image Count" />,
    meta: { headerName: "Image Count" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("image_gallery_Current", {
    header: ({ column }) => <SortableHeader column={column} title="Image Count" />,
    meta: { headerName: "Image Gallery" },
    size: 80,
    enableHiding: true,
  }),
  columnHelper.accessor("Likes_Poshmark", {
    header: ({ column }) => <SortableHeader column={column} title="Likes" />,
    meta: { headerName: "Likes" },
    size: 80,
    enableHiding: true,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,

  }),
  // columnHelper.accessor("id", {
  //   header: ({ column }) => <SortableHeader column={column} title="ID" />,
  //   meta: { headerName: "ID" },
  //   size: 200,
  //   enableHiding: true,
  //   cell: (info) => <TruncatedCell value={info.getValue()} maxWidth={250} maxLines={1} />,

  // }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <SortableHeader column={column} title="Create Date" />,
    meta: { headerName: "Create Date" },
    size: 100,
    enableHiding: true,
    cell: (info) => (info.getValue() ? new Date(info.getValue()).toLocaleString() : ""),
  }),
  columnHelper.accessor("updated_at", {
    header: ({ column }) => <SortableHeader column={column} title="Last Updated Date" />,
    meta: { headerName: "Last Updated Date" },
    size: 100,
    enableHiding: true,
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleString() : "";
    },
  }),
  columnHelper.accessor("deleted_at", {
    header: ({ column }) => <SortableHeader column={column} title="Archive Date" />,
    meta: { headerName: "Archive Date" },
    size: 100,
    enableHiding: true,
    cell: (info) => {
      const value = info.getValue();
      return value ? new Date(value).toLocaleString() : "";
    },
  }),
];

const initialVisibility = {
  lp_id: false,
  posh_id: false,
  sku: true,
  title: true,
  description: false,
  new_with_tag: false,
  condition: true,
  condition_notes: false,
  keywords: false,
  sold: false,
  colors: true,
  department: false,
  category: false,
  subcategory: false,
  all_style_tags: false,
  item_cost: false,
  msrp: false,
  price: true,
  brand: true,
  size: true,
  material: false,
  first_image_url: false,
  image_gallery_Current: false,
  image_gallery_count_Current: false,
  Likes_Poshmark: false,
  Number_of_Days_Listed_Poshmark: false,
  total_token_count: false,
  total_token_price: false,
  completion_token_count: false,
  completion_token_price: false,
  prompt_token_count: false,
  prompt_token_price: false,
  id: true,
  created_at: false,
  deleted_at: false,
  updated_at: true,
  "First Image": true,
  view_dialog: true,
};

const initialColumnOrder = [
  "lp_id",
  "posh_id",
  "sku",
  "title",
  "description",
  "new_with_tag",
  "condition",
  "condition_notes",
  "keywords",
  "sold",
  "colors",
  "department",
  "category",
  "subcategory",
  "all_style_tags",
  "item_cost",
  "msrp",
  "price",
  "brand",
  "size",
  "material",
  "first_image_url",
  "image_gallery_Current",
  "image_gallery_count_Current",
  "Likes_Poshmark",
  "Number_of_Days_Listed_Poshmark",
  "total_token_count",
  "total_token_price",
  "completion_token_count",
  "completion_token_price",
  "prompt_token_count",
  "prompt_token_price",
  "id",
  "created_at",
  "deleted_at",
  "updated_at",
  "view_dialog",
];

export default function TableDemo({ totalItems }: { totalItems: number }) {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [showHardDelete, setShowHardDelete] = useState(false);
  const [showMigrateImages, setShowMigrateImages] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([{ id: "updated_at", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const fetchData = useCallback(async () => {
    setInventory([]);
    const supabase = createClient();
    
    const sortField = searchParams.get("sort") || "updated_at";
    const sortOrder = searchParams.get("order") || "asc";
  
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order(sortField, { ascending: sortOrder === "desc" })
      .order("id", { ascending: true })

  
    if (data) {
      setInventory(data);
      console.log(data)
    } else if (error) {
      console.error("Error fetching data:", error);
    }
  }, [searchParams]);
// }, [currentPage,searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData, searchParams]);

  const columns = useMemo(() => createColumns(showHardDelete, showMigrateImages), [showHardDelete, showMigrateImages]);
  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
        },
        (payload) => {
          setInventory((currentInventory) =>
            currentInventory.map((product) =>
              product.id === payload.new.id ? { ...product, ...payload.new } : product
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const columnOrder = useMemo(() => {
    const allColumnIds = columns.map((col) => col.id as string);
    const orderedColumns = initialColumnOrder.filter((id) => allColumnIds.includes(id));
    const remainingColumns = allColumnIds.filter((id) => !initialColumnOrder.includes(id));
    return [...orderedColumns, ...remainingColumns];
  }, []);

  // const handleSortChange: OnChangeFn<SortingState> = useCallback(
  //   (updaterOrValue) => {
  //     setSorting(updaterOrValue);
  
  //     const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
  
  //     const params = new URLSearchParams(searchParams);
  //     params.set("page", "1"); // Reset to first page when sorting changes
  //     params.set("sort", newSorting[0]?.id || "updated_at");
  //     params.set("order", newSorting[0]?.desc ? "desc" : "asc");
  //     router.push(`${pathname}?${params.toString()}`);
  //   },
  //   [router, pathname, searchParams, sorting]
  // );

  // const handlePageChange = useCallback((newPage: number) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", newPage.toString());
  //   router.push(`${pathname}?${params.toString()}`);
  // }, [router, pathname, searchParams]);

  const handlePageSizeChange = useCallback((newSize: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("pageSize", newSize);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const table = useReactTable({
    data: inventory,
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    state: {
      columnVisibility,
      columnOrder,
      sorting,
    },
    // onSortingChange: handleSortChange,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualSorting: true
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4 gap-2">
        <ColumnToggle table={table} />
        <TableOptions
          showHardDelete={showHardDelete}
          onToggleHardDelete={setShowHardDelete}
          showMigrateImages={showMigrateImages}
          onToggleMigrateImages={setShowMigrateImages}
        />{" "}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* <div className="flex items-center gap-2">
          <span className="text-xs">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
        {/* <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> */}
        <Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>

    </div>
  );
}
