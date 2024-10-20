'use client';

import { Button } from "./ui/button";
interface ImageUrlProps {
  imageUrl: string;
}

export default function DownloadButton({ imageUrl }: ImageUrlProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={handleDownload} >
      Download Image
      </ Button>
  )
}
