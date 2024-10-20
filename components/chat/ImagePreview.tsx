import React, { useState } from "react";
import { Minus } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImagePreviewProps {
  selectedFiles: File[];
  removeFile: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ selectedFiles, removeFile }) => {
  const [currentImage, setCurrentImage] = useState<{ src: string; name: string; key: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openModal = (file: File, key: string) => {
    setCurrentImage({ src: URL.createObjectURL(file), name: file.name, key });
    setIsDialogOpen(true);
  };

  const closeModal = () => {
    setIsDialogOpen(false);
    setCurrentImage(null);
  };

  return (
    <div className="mt-2 flex space-x-2 pr-[72px]">
      {selectedFiles.map((file, index) => {
        const key = `${file.name}-${index}`;
        return (
          <div key={key} className="relative">
            <button
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 rounded-full bg-white border border-solid border-1 border-black"
            >
              <Minus className="w-5 h-5" />
            </button>
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              width={64} // Changed from 16 to 64 for better visibility
              height={64} // Changed from 16 to 64 for better visibility
              className="w-16 h-16 object-cover rounded cursor-pointer"
              onClick={() => openModal(file, key)}
            />
          </div>
        );
      })}

      {isDialogOpen && currentImage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Image {currentImage.key}: <br /> {currentImage.name}</DialogTitle>
            </DialogHeader>
            {currentImage && (
              <Image src={currentImage.src} alt={currentImage.name} width={600} height={600} className="object-contain mx-auto" />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImagePreview;
