// app/actions/updateListings.tsx
"use server";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

type Product = Database['public']['Tables']['products']['Row'];

// Create an array of valid keys based on the assistant function definition
const validKeys: (keyof Product)[] = [
  "title",
  "description",
  "condition",
  "keywords",
  "colors",
  "department",
  "category",
  "all_style_tags",
  "brand",
  "size",
  "material",
  "uploadedImages"
];

export async function updateListing(image_id: string, inputData: any) {
  const supabase = createClient();

  // Filter and validate the data based on the validKeys
  const validatedData: Partial<Product> = Object.keys(inputData).reduce((acc, key) => {
    if (validKeys.includes(key as keyof Product)) {
      (acc as any)[key] = inputData[key];
    }
    return acc;
  }, {} as Partial<Product>);

  // Set updated_at to current time
  (validatedData as any).updated_at = new Date().toISOString();

  // Remove any null values
  (Object.keys(validatedData) as (keyof Product)[]).forEach(key => {
    if (validatedData[key] === null) {
      delete validatedData[key];
    }
  });

  // Use the image_id to find the corresponding product
  const { data: product, error: findError } = await supabase
    .from('products')
    .select('id')
    .eq('id', image_id)
    .single();

  if (findError) {
    console.error('Error finding product:', findError);
    return { error: findError.message };
  }

  if (!product) {
    return { error: 'No product found with the given image_id' };
  }

  // Update the product using the found id
  const { error, data: updatedListing } = await supabase
    .from('products')
    .update(validatedData)
    .eq('id', product.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing:', error);
    return { error: error.message };
  }

  return { updatedListing: { id: product.id, data: updatedListing } };
}