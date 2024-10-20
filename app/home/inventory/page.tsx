import { columns } from "@/components/table/columns";
import { fetchProducts } from "@/app/actions/getInventory";
import { DataTable } from "@/components/table/table";
import { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default async function InventoryTable() {
  let products: Product[] | null = null;
  let error: Error | null = null;

  try {
    products = await fetchProducts();
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products found</div>;
  }

  return (
    <div>
      <h1 className="flex p-8 text-3xl font-bold">Your Inventory</h1>
      <DataTable data={products} columns={columns} />
    </div>
  );
}
