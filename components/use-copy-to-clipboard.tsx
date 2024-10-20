// CopyToClipboardButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CopyToClipboardButtonProps {
  text: string;
  timeout?: number;
}

export function CopyToClipboardButton({ text, timeout = 2000 }: CopyToClipboardButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      toast({
        title: "Success",
        description: "Copied to clipboard",
        duration: 2000,
      });

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </>
      )}
    </Button>
  );
}