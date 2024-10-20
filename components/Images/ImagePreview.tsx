// components/Images/ImagePreview.tsx
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { X, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "./ImageCarousel";
import { getImageUrls } from "@/app/actions/getProductImage";

interface ImagePreviewProps {
  productId: string;
  uploadedImages: string[] | null;
  onReorder: (newOrder: string[]) => void;
  onMarkForDeletion: (imagePath: string) => void;
  imagesToDelete: string[];
}

interface ImageItem {
  id: string;
  path: string;
  url: string | null;
}

const DraggableImage: React.FC<{
  item: ImageItem;
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  toggleDeletion: (e: React.MouseEvent, imagePath: string) => void;
  isMarkedForDeletion: boolean;
}> = ({ item, index, moveImage, toggleDeletion, isMarkedForDeletion }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "IMAGE",
    hover(draggedItem: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveImage(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "IMAGE",
    item: () => ({ id: item.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} className="relative w-24 h-24 group" style={{ opacity }}>
      {item.url ? (
        <>
          <Image
            src={item.url}
            alt={`Product image ${index + 1}`}
            fill
            style={{
              objectFit: "cover",
              opacity: isMarkedForDeletion ? 0.5 : 1,
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <button
            className={`absolute top-0 right-0 ${isMarkedForDeletion ? "bg-green-500" : "bg-red-500"} text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
            onClick={(e) => toggleDeletion(e, item.path)}
            type="button"
          >
            {isMarkedForDeletion ? <RotateCcw size={16} /> : <X size={16} />}
          </button>
        </>
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>
      )}
    </div>
  );
};

export default function ImagePreview({
  productId,
  uploadedImages,
  onReorder,
  onMarkForDeletion,
  imagesToDelete,
}: ImagePreviewProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!uploadedImages) return;

      const imageUrls = await getImageUrls(productId, uploadedImages);
      const newImageItems = imageUrls.map((item, index) => ({
        id: `image-${index}`,
        ...item,
      }));

      setImageItems(newImageItems);
    };

    fetchImageUrls();
  }, [productId, uploadedImages]);

  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = imageItems[dragIndex];
      const newItems = [...imageItems];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setImageItems(newItems);
      onReorder(newItems.map((item) => item.path));
    },
    [imageItems, onReorder]
  );

  const toggleDeletion = (event: React.MouseEvent, imagePath: string) => {
    event.preventDefault();
    event.stopPropagation();
    onMarkForDeletion(imagePath);
  };

  const handleImageChange = (image: { id: string; path: string; url: string | null }) => {
    setCurrentImage(image);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsDialogOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-wrap gap-4">
        {imageItems.map((item, index) => (
          <Dialog
            key={item.id}
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedImageIndex(0);
              }
            }}
          >
            <DialogTrigger asChild>
              <div onClick={() => handleImageClick(index)}>
                <DraggableImage
                  item={item}
                  index={index}
                  moveImage={moveImage}
                  toggleDeletion={toggleDeletion}
                  isMarkedForDeletion={imagesToDelete.includes(item.path)}
                />
              </div>
            </DialogTrigger>

            <DialogContent className="items-center max-w-3xl h-[75vh]">
              <DialogHeader>
                <DialogTitle>Image ID: {currentImage?.id}</DialogTitle>
                <DialogDescription>Path: {currentImage?.path}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center w-full h-full">
                <ImageCarousel
                  images={imageItems}
                  onMarkForDeletion={toggleDeletion}
                  onImageChange={handleImageChange}
                  imagesToDelete={imagesToDelete}
                  initialIndex={selectedImageIndex}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </DndProvider>
  );
}
