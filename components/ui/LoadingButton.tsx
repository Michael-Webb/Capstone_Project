import React from 'react';
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

interface ButtonLoadingProps {
  className?: string;
  children?: React.ReactNode;
}

export function ButtonLoading({ className, children }: ButtonLoadingProps) {
  return (
    <Button className={className} disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      {children || "Please wait"}
    </Button>
  )
}