// components/ArchiveButton.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ArchiveButtonProps {
  productId: string;
  isArchived: boolean;
}

export function ArchiveButton({ productId, isArchived }: ArchiveButtonProps) {
  const supabase = createClient();

  const handleArchiveToggle = async () => {
    try {
      const newArchivedState = !isArchived;
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: newArchivedState ? new Date().toISOString() : null })
        .eq('id', productId)

      if (error) throw error

      console.log(newArchivedState ? 'Product archived successfully' : 'Product unarchived successfully')
    } catch (error) {
      console.error('Error toggling archive status:', error)
    }
  }

  return (
    <Button 
      variant={isArchived ? "outline" : "secondary"}
      size="icon" 
      onClick={handleArchiveToggle}
      title={isArchived ? "Unarchive" : "Archive"}
    >
      {isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
    </Button>
  )
}