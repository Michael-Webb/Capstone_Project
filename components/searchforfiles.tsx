'use client'
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; // Adjust this import path as necessary
import { Button } from "@/components/ui/button"; // Import shadcn Button component
import { Progress } from "@/components/ui/progress"; // Import shadcn Progress component
import { createClient } from '@/utils/supabase/client';

const UpdateAllImagesButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const supabase = createClient();

  const updateAllImages = async () => {
    setIsLoading(true);
    setProgress(0);
    try {
      // Get all product IDs
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id');

      if (productsError) throw productsError;

      const totalProducts = products.length;

      for (let i = 0; i < totalProducts; i++) {
        const productId = products[i].id;
        const folderName = `${productId}`;

        // List files in the folder
        const { data: files, error: filesError } = await supabase
          .storage
          .from('listing-images')
          .list(folderName);

        if (filesError) {
          toast({
            title: "Error",
            description: `Failed to list files for product ${productId}`,
            variant: "destructive",
          });
          continue; // Skip to next product if there's an error
        }

        // Extract file names
        const fileNames = files.map(file => file.name);

        // Update the product with the new array of file names
        const { error: updateError } = await supabase
          .from('products')
          .update({ uploadedImages: fileNames })
          .eq('id', productId);

        if (updateError) {
          toast({
            title: "Error",
            description: `Failed to update product ${productId}`,
            variant: "destructive",
          });
        }

        // Update progress
        setProgress(Math.round(((i + 1) / totalProducts) * 100));
      }

      toast({
        title: "Success",
        description: "All images updated successfully!",
      });
    } catch (error) {
      console.error('Error updating images:', error);
      toast({
        title: "Error",
        description: "Failed to update images. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={updateAllImages} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update All Images'}
      </Button>
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500">{progress}% Complete</p>
        </div>
      )}
    </div>
  );
};

export default UpdateAllImagesButton;