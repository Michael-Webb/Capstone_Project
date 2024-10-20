//components/chat/DropZoneModal.tsx

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DropZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: File[]) => void;
}

const DropZoneModal: React.FC<DropZoneModalProps> = ({ isOpen, onClose, onFilesSelected }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
    onClose();
  }, [onFilesSelected, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`p-10 border-dashed border-4 ${
            isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-center">{isDragActive ? 'Drop the files here ...' : 'Drag & Drop images here, or click to select files'}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DropZoneModal;
