// utils/supabaseHelpers.ts
import { createClient } from '@/utils/supabase/client';

export async function createNewProduct(): Promise<number | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert({})
    .select();

  if (error) {
    console.error('Error creating new product:', error);
    return null;
  }

  return data[0].id;
}

export async function uploadImageToSupabase(file: File, productId: number): Promise<string | null> {
  const supabase = createClient();
  const fileName = `listing-images/${productId}/${file.name}`;
  const { data, error } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return fileName;
}

export function getPublicUrl(fileName: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from('listing-images').getPublicUrl(fileName);
  return data.publicUrl;
}