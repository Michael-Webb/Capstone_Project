import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ImageUploadProps {
  listingId: string | null;
  onImagesChange: (existingUrls: string[], newFiles: File[], deletedUrls: string[]) => void;
  initialImages: string[];
}

export function ImageUpload({ listingId, onImagesChange, initialImages }: ImageUploadProps) {
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [newImages, setNewImages] = useState<{ file: File; url: string }[]>([]);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    setExistingImages(initialImages);
    setNewImages([]);
    setDeletedUrls([]);
  }, [initialImages]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImageObjects = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setNewImages((prev) => [...prev, ...newImageObjects]);
      onImagesChange(
        existingImages,
        [...newImages, ...newImageObjects].map((img) => img.file),
        deletedUrls
      );
    },
    [existingImages, newImages, deletedUrls, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveImage = (index: number) => {
    setImageToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete === null) return;
    
    const index = imageToDelete;
    if (index < existingImages.length) {
      const removedUrl = existingImages[index];
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setDeletedUrls((prev) => [...prev, removedUrl]);
    } else {
      const adjustedIndex = index - existingImages.length;
      setNewImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
    }

    onImagesChange(
      existingImages.filter((_, i) => i !== index),
      newImages.filter((_, i) => i !== index - existingImages.length).map((img) => img.file),
      index < existingImages.length ? [...deletedUrls, existingImages[index]] : deletedUrls
    );

    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const allImages = [...existingImages, ...newImages.map((img) => img.url)];

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-6 mt-4 border-2 border-dashed rounded-md text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      {allImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {allImages.map((image, index) => (
            <div key={index} className="relative">
              <div 
                className="relative cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                  setIsViewDialogOpen(true);
                }}
              >
                <div className="w-full relative aspect-square">
                  <Image
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 text-white bg-red-500"
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[75vh] flex flex-col items-center justify-center">
          <DialogHeader className="text-center">
            <DialogTitle>View Images</DialogTitle>
            <DialogDescription>Review your image uploads</DialogDescription>
          </DialogHeader>
          <Carousel className="w-full max-w-[75%] mx-auto flex items-center justify-center">
            <CarouselContent>
              {allImages.map((carouselImage, carouselIndex) => (
                <CarouselItem key={carouselIndex} className="relative">
                  <div className="w-full p-64 relative">
                    <Image
                      src={carouselImage}
                      alt={`Carousel ${carouselIndex + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveImage(carouselIndex);
                      }}
                      className="absolute top-2 right-2 text-white bg-red-500 z-10"
                    >
                      <X />
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}