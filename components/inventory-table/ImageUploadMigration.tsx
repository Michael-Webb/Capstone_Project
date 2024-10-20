// components/ImageUploadMigration.tsx

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadMigrationProps {
  listingId: string;
  imageGalleryCurrent: string | null;
}

export function ImageUploadMigration({ listingId, imageGalleryCurrent }: ImageUploadMigrationProps) {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const migrateImages = async () => {
    if (!imageGalleryCurrent) {
      toast({
        title: 'Error',
        description: 'No images to migrate.',
        variant: 'destructive',
      });
      return;
    }

    setIsMigrating(true);

    const imageUrls = imageGalleryCurrent.split(',').map(url => url.trim());

    try {
      for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        
        console.log('Fetching image from URL:', url);
        
        const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(url)}`);
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch image from ${url}. Status: ${response.status}. Error: ${errorText}`);
        }

        const blob = await response.blob();
        const contentType = response.headers.get('Content-Type') || 'image/*';

        const fileExtension = url.split('.').pop() || 'jpg';
        const fileName = `${listingId}/image-${i + 1}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, blob, { contentType });

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }

      toast({
        title: 'Success',
        description: 'Images migrated successfully.',
      });
    } catch (error) {
      console.error('Error migrating images:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred while migrating images.',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Button onClick={migrateImages} disabled={isMigrating} size="sm">
      {isMigrating ? 'Migrating...' : 'Migrate Images'}
    </Button>
  );
}