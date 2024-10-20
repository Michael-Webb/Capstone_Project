"use server";

import { createClient } from "@/utils/supabase/server";
import { uploadFile } from "@/app/actions/OpenAIFilesAPI";
import { ProcessedImageData } from "@/types/image_types";

export async function uploadImage(formData: FormData) {
  const supabase = createClient();

  const file = formData.get("file") as File;
  const fileName = formData.get("fileName") as string;

  try {
    // 1. Insert a new row in the products table and get the id
    const { data: newProduct, error: insertError } = await supabase.from("products").insert({}).select().single();

    if (insertError) throw insertError;

    if (!newProduct || typeof newProduct.id === "undefined") {
      throw new Error("Failed to create new product or get its ID");
    }

    const productId = newProduct.id;

    // Get the file extension
    const fileExtension = fileName.split(".").pop() || "png";

    // Generate the fileName for Supabase upload
    const supabaseFilePath = `${productId}/image-1.${fileExtension}`;
    const supabaseFileName = `image-1.${fileExtension}`;

    // Generate the fileName for OpenAI upload
    const openAIFileName = `${productId}.${fileExtension}`;

    // 2. Upload the image to Supabase Storage
    const { data, error } = await supabase.storage.from("listing-images").upload(supabaseFilePath, file);
    if (error) throw error;

     // Update the product's uploadedImages array
     const { data: updatedProduct, error: updateError } = await supabase
     .from("products")
     .update({ uploadedImages: [supabaseFileName] || []})
     .eq("id", productId)
     .select()
     .single();

   if (updateError) throw updateError;
    console.log(data)
    // 3. Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(supabaseFilePath);

    // 4. Upload file to OpenAI
    const openAIFormData = new FormData();
    openAIFormData.append("file", file, openAIFileName);
    openAIFormData.append("fileName", openAIFileName);

    const result = (await uploadFile(openAIFormData));
    console.log(result);
    return {
      db_id: productId,
      url: publicUrl,
      file_id: result.file_id,
      fileName: openAIFileName,
      supabaseFileName: supabaseFileName,
      old_filename: fileName,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
