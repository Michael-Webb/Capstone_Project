// app/contexts/ImageCache.tsx
'use client';

import React, { createContext, useState, useContext } from 'react';

interface ImageCacheContextType {
  cache: Record<string, string>;
  setCache: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined);

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<Record<string, string>>({});

  return (
    <ImageCacheContext.Provider value={{ cache, setCache }}>
      {children}
    </ImageCacheContext.Provider>
  );
};

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (context === undefined) {
    throw new Error('useImageCache must be used within a ImageCacheProvider');
  }
  return context;
};