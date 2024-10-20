// app/actions/getInventory.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  [key: string]: any;
};
export async function fetchProducts() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("updated_at, id", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  return products;
}
const handleSupabaseError = (error: any, context: string) => {
  if (error) {
    // Log the error server-side
    console.error(`Error in ${context}:`, error);
    // We can't use client-side toast in a server component, so we'll just return null
    return null;
  }
  return false;
};
export async function fetchAnalytics(userRPCName: string) {
  const supabase = createClient();

  const fetchData = async (rpcName: string) => {
    const { data, error } = await supabase.rpc(rpcName);
    if (handleSupabaseError(error, rpcName)) return null;
    return data;
  };

  return fetchData(userRPCName);
}

export async function fetchProductColumn(columnName: string) {
  const supabase = createClient();
  const fetchData = async (input: string) => {
    const { data, error } = await supabase.from("products").select(`${columnName}`);
    if (handleSupabaseError(error, input)) return null;
    // Transform the data to match the expected format
    return data?.map(item => ({ size: item[columnName as any] })) || [];
  };

  return fetchData(columnName);
}

export async function fetchProductImages(id: string) {
  const supabase = createClient();

  const { data: currentListing, error: fetchError } = await supabase
    .from("products")
    .select("uploadedImages")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching products:", fetchError);
    throw new Error("Failed to fetch products");
  }
  return currentListing;
}
export async function upsertListing(data: Product) {
  const supabase = createClient();

  const { id, ...listingData } = data;

  // Remove any keys with undefined values
  Object.keys(listingData).forEach((key) => {
    if (listingData[key] === undefined) {
      delete listingData[key];
    }
  });

  if (id) {
    // Update existing listing
    const { data: updatedListing, error } = await supabase
      .from("products")
      .update(listingData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updatedListing;
  } else {
    // Insert new listing
    const { data: newListing, error } = await supabase.from("products").insert(listingData).select().single();

    if (error) throw error;
    return newListing;
  }
}

export async function fetchListing(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("products").select().eq("id", id).single();

  if (error) throw error;
  return data;
}
