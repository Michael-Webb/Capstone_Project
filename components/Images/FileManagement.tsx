"use client";

import { useState, useEffect } from "react";
import { getAllFiles, deleteFile, deleteVisionFiles } from "@/app/actions/OpenAIFilesAPI";
import { DataTable, File } from "@/components/Images/FileTable";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

export default function FileManagement() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const filesList = await getAllFiles();
      setFiles(filesList.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch listing data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDeleteVisionFiles = async () => {
    setLoading(true);
    try {
      await deleteVisionFiles();
      toast({
        title: "Success",
        description: "Vision files deleted successfully.",
      });
      // Reload files after deletion
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting vision files:", error);
      toast({
        title: "Error",
        description: "Error deleting vision files.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setLoading(true);
    try {
      await deleteFile(fileId);
      toast({
        title: "Success",
        description: `File with ID ${fileId} deleted successfully.`,
        variant: "default",
      });
      //   setMessage(`File with ID ${fileId} deleted successfully.`);
      // Reload files after deletion
      await fetchFiles();
    } catch (error) {
      toast({
        title: `Error',
        description:  deleting file with ID ${fileId}: ${error}`,
        variant: "destructive",
      });
      console.error(`Error deleting file with ID ${fileId}:`, error);
      //   setMessage(`Error deleting file with ID ${fileId}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Button variant="outline" onClick={fetchFiles} disabled={loading} className="m-2">
        Refresh Table
      </Button>
      <Button variant="destructive" onClick={handleDeleteVisionFiles} disabled={loading}>
        Delete Vision Files
      </Button>
      <DataTable files={files} onDeleteFile={handleDeleteFile} />
    </div>
  );
}
