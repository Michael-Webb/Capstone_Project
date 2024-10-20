//page.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/table/table";
import { Database } from "@/types/supabase";
import { fetchProducts, fetchProductColumn } from "@/app/actions/getInventory";
import { columns } from "@/components/table/columns";
import AnalyticsCard from "@/components/analytics/AnalyticsCards";
type Product = Database["public"]["Tables"]["products"]["Row"];

export default async function Home() {
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
    <div className="">
      <h1 className="flex-1 space-y-4 p-8 text-3xl font-bold">Home</h1>
      <div className="flex-1 px-8 text-3xl ">
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="datatable">View Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <AnalyticsCard type="count_unique_products" title="# of Products" style="string" />
              <AnalyticsCard type="get_average_product_price" title="Average Price" style="formattedString" />
              <AnalyticsCard type="get_average_item_cost" title="Average Cost" style="formattedString" />
              <AnalyticsCard type="get_most_popular_brand" title="# of Products" style="string" />
              <AnalyticsCard type="get_price_range_counts" title="Price Range Frequency" style="PriceRangeChart" />
              <AnalyticsCard
                type="SizeFrequencyChart"
                title="Size Frequency Chart"
                style="SizeFrequencyChart"
                columnName="size"
              />
            </div>
          </TabsContent>
          <TabsContent value="datatable"><DataTable data={products} columns={columns} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
