// components/DialogComponent.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, List } from "lucide-react";
import { Product } from '../../types/product-types';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface DialogComponentProps {
  row: Product;
}

export function DialogComponent({ row }: DialogComponentProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .storage
          .from('listing-images')
          .list(row.id);

        if (error) {
          throw error;
        }

        if (data) {
          const urls = await Promise.all(data.map(async (file) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('listing-images')
              .getPublicUrl(`${row.id}/${file.name}`);
            return publicUrl;
          }));
          setImageUrls(urls);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [row.id]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleBackClick = () => {
    setSelectedImageIndex(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full"><List /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{row.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {isLoading ? (
            <div>Loading images...</div>
          ) : selectedImageIndex === null ? (
            <>
              {imageUrls.length > 0 ? (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full max-w-5xl mx-auto"
                >
                  <CarouselContent>
                    {imageUrls.map((url, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <div
                            className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
                            onClick={() => handleImageClick(index)}
                          >
                            <Image
                              src={url}
                              alt={`${row.title} - Image ${index + 1}`}
                              width={500}
                              height={500}
                              style={{objectFit: "contain" }}
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div>No images available</div>
              )}
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.entries(row).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <strong>{key}:</strong>{" "}
                    {key === "image_gallery_Current" ? `${imageUrls.length} images` : JSON.stringify(value)}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="relative">
              <Button variant="outline" size="sm" className="absolute top-2 left-2 z-10" onClick={handleBackClick}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <div className="aspect-square relative w-full">
                <Image
                  src={imageUrls[selectedImageIndex]}
                  alt={`${row.title} - Large Image`}
                  style={{ objectFit: "contain" }}
                  fill={true}
                  quality={80}
                />
              </div>
            </div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}