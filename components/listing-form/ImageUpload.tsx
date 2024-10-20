// components/ImageUpload.tsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface ImageUploadProps {
  productId: string;
  isNewListing: boolean;
  onUploadComplete: (newImages: string[]) => void;
}

export default function ImageUpload({ productId, isNewListing, onUploadComplete }: ImageUploadProps) {
  const supabase = createClient();
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      try {
        let currentProductId = productId;

        // If it's a new listing, create a new product first
        if (isNewListing) {
          const { data: newProduct, error: insertError } = await supabase
            .from("products")
            .insert({ uploadedImages: [] })
            .select()
            .single();

          if (insertError) throw insertError;
          currentProductId = newProduct.id;
        }

        // Upload images to storage
        const uploadPromises = acceptedFiles.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(`${currentProductId}/${fileName}`, file);

          if (uploadError) throw uploadError;
          return fileName;
        });

        const uploadedFileNames = await Promise.all(uploadPromises);

        // Fetch current uploadedImages array
        const { data: currentProduct, error: fetchError } = await supabase
          .from("products")
          .select("uploadedImages")
          .eq("id", currentProductId)
          .single();

        if (fetchError) throw fetchError;

        const updatedImages = [...(currentProduct.uploadedImages || []), ...uploadedFileNames];

        // Update the product's uploadedImages array
        const { data: updatedProduct, error: updateError } = await supabase
          .from("products")
          .update({ uploadedImages: updatedImages })
          .eq("id", currentProductId)
          .select()
          .single();

        if (updateError) throw updateError;

        onUploadComplete(updatedProduct.uploadedImages);

        if (isNewListing) {
          // Redirect to the new listing page
          router.push(`/home/listings/${currentProductId}`);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        // Handle error (e.g., show a toast notification)
      }
    },
    [productId, isNewListing, supabase, router, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mb-4"> {/* Single root element */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}