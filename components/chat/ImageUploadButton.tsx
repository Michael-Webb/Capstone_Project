//ImageUploadButton.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image as ImageUpload } from "lucide-react";
import { uploadImage } from "@/app/actions/uploadImage";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { ButtonLoading } from "../ui/LoadingButton";
import { ProcessedImageData } from "@/types/image_types";

interface ImageUploadButtonProps {
  onImageProcessed: (data: ProcessedImageData) => void;
  disabled?: boolean;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onImageProcessed, disabled }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      const result = await uploadImage(formData);

      onImageProcessed(result);
      //console.log("Image uploaded successfully to database:", result);

      // Update the URL with the new search parameter
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("db_id", result.db_id);
      router.push(`?${currentParams.toString()}`);

      toast({
        title: "Success",
        description: "Image uploaded successfully to database",
        variant: "default",
      });

      setSelectedFile(null);
      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error processing image:", error);
      setErrorMessage("An error occurred while processing the image.");
      toast({
        title: "Error",
        description: "An error occurred while processing the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
    },
    multiple: false,
  });

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={(open) => !disabled && setIsDialogOpen(open)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  className={`mt-1.5 inline-block rounded-lg hover:text-gray-400 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                >
                  <ImageUpload />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload Image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>Drag and drop an image here or click to select a file</DialogDescription>
          </DialogHeader>
          <div
            {...getRootProps({
              className: `border-2 border-dashed rounded p-6 text-center cursor-pointer ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"}`,
            })}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag 'n' drop an image here, or click to select a file</p>
            )}
          </div>
          {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
          {selectedFile && (
            <div className="mt-4">
              <p>Selected file: {selectedFile.name}</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            {!uploading ? (
              <Button
                onClick={() => selectedFile && processFile(selectedFile)}
                className={`px-4 py-2 ${uploading || !selectedFile ? "bg-gray-400" : "bg-blue-500"} text-white rounded ${uploading || !selectedFile ? "" : "hover:bg-blue-600"}`}
                disabled={uploading || !selectedFile}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            ) : (
              <ButtonLoading
                className={`px-4 py-2 ${uploading || !selectedFile ? "bg-gray-400" : "bg-blue-500"} text-white rounded ${uploading || !selectedFile ? "" : "hover:bg-blue-600"}`}
              >
                {uploading ? "Uploading..." : "Upload"}
              </ButtonLoading>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUploadButton;
