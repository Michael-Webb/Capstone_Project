'use client';

import { Button } from "./ui/button";
import { Check, ClipboardIcon } from 'lucide-react';
import { useState } from "react";
type CopyButtonProps = {
  text: string;
};

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true)
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to copy text', error);
    }
  };

  return (
    <Button onClick={copyToClipboard} variant={"outline"} size={"icon"} className="">
      { copied? <Check /> : <ClipboardIcon className="" /> }
    </Button>
  );
}
