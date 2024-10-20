// TableContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TableContextType {
  showHardDelete: boolean;
  setShowHardDelete: (show: boolean) => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: ReactNode }) {
  const [showHardDelete, setShowHardDelete] = useState(false);

  return (
    <TableContext.Provider value={{ showHardDelete, setShowHardDelete }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
}