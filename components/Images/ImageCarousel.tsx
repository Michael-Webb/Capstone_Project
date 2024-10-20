// components/Images/ImageCarousel.tsx

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: { id: string; path: string; url: string | null }[];
  onMarkForDeletion: (event: React.MouseEvent, imagePath: string) => void;
  onImageChange: (image: { id: string; path: string; url: string | null }) => void;
  imagesToDelete: string[];
  initialIndex?: number;
}

export function ImageCarousel({ 
  images, 
  onMarkForDeletion, 
  onImageChange, 
  imagesToDelete,
  initialIndex
}: ImageCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    if (current >= 0 && current < images.length) {
      onImageChange(images[current]);
    }
  }, [current, images, onImageChange]);

  const handleMarkForDeletion = (event: React.MouseEvent, imagePath: string) => {
    event.preventDefault();
    event.stopPropagation();
    onMarkForDeletion(event, imagePath);
  };

  return (
    <Carousel 
      setApi={setApi} 
      className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
      opts={{
        align: "start",
        loop: true,
        startIndex: initialIndex,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.id} className="relative aspect-square ">
            {image.url && (
              <Image
                src={image.url}
                alt={`Product image ${image.id}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw" 
                className={cn(
                  "object-cover transition-all",
                  imagesToDelete.includes(image.path) && "opacity-50"
                )}
              />
            )}
            <Button
              variant={imagesToDelete.includes(image.path) ? "secondary" : "destructive"}
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={(e) => handleMarkForDeletion(e, image.path)}
              type="button"
            >
              {imagesToDelete.includes(image.path) ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
            {imagesToDelete.includes(image.path) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Marked for deletion
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}