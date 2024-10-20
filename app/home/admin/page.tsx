import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingDetails from "@/components/analytics/ListingDetails";
import fastAPI from "@/components/fastAPI";
import FileManagement from "@/components/Images/FileManagement";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/server";
import { PriceRangeChart } from "@/components/analytics/PriceRangeChart";
import { SizeFrequencyChart } from "@/components/analytics/SizeFrequencyChart";
import UpdateImagesButton from "@/components/searchforfiles";
import { useToast } from "@/components/ui/use-toast"



const formatCurrency = (value: number | null) => 
  value ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : 'N/A';

export default async function adminPage() {
  const supabase = createClient();

  const handleSupabaseError = (error: any, context: string) => {
    if (error) {
      // Log the error server-side
      console.error(`Error in ${context}:`, error);
      // We can't use client-side toast in a server component, so we'll just return null
      return null;
    }
    return false;
  };

  const fetchData = async (rpcName: string, params = {}) => {
    const { data, error } = await supabase.rpc(rpcName, params);
    if (handleSupabaseError(error, rpcName)) return null;
    return data;
  };

  const distinctID = await fetchData("count_distinct_ids", { table_name: "products" });
  const avgPrice = await fetchData("get_average_product_price");
  const avgItemCost = await fetchData("get_average_item_cost");
  const popularBrand = await fetchData("get_most_popular_brand");
  const priceRangeCounts = await fetchData("get_price_range_counts");

  const { data: sizes, error: sizesError } = await supabase.from("products").select("id, size");
  handleSupabaseError(sizesError, "get_sizes");

  return (
    <div className="">
      <h1 className="flex-1 space-y-4 p-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex-1 px-8 text-3xl font-bold">
        <UpdateImagesButton />
        <Tabs defaultValue="files" className="space-y-4">
          <TabsList>
            <TabsTrigger value="files">Open AI Files</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="fastapi">FastAPI Test</TabsTrigger>
            <TabsTrigger value="json_test">JSON Test</TabsTrigger>
          </TabsList>
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>View Open AI Files</CardTitle>
              </CardHeader>
              <CardContent>
                <FileManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>...</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle># of Products</CardTitle>
                </CardHeader>
                <CardContent>{distinctID ?? 'N/A'}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Price</CardTitle>
                </CardHeader>
                <CardContent>{formatCurrency(avgPrice)}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Cost</CardTitle>
                </CardHeader>
                <CardContent>{formatCurrency(avgItemCost)}</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Brand</CardTitle>
                </CardHeader>
                <CardContent>{popularBrand ?? 'N/A'}</CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Price Range Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full">
                    <PriceRangeChart data={priceRangeCounts || []} /> 
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Size Frequency Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full">
                    <SizeFrequencyChart data={sizes || []} /> 
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="fastapi">
            <Card>
              <CardHeader>
                <CardTitle>Fast API Test</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full w-full">
                  <ListingDetails listingId={"c532f9b7-8487-4192-b63e-9cac9b68e90a"} />
                  <ScrollBar orientation="vertical" />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="json_test">
            <Card>
              <CardHeader>
                <CardTitle>JSON Test</CardTitle>
              </CardHeader>
              <CardContent>
                <FileManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}