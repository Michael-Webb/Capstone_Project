import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of the context state
interface ImageContextState {
  images: Record<string, string | null>;
  loading: Record<string, boolean>;
  fetchImage: (id: string) => void;
}

// Create the context with a default value
const ImageContext = createContext<ImageContextState>({
  images: {},
  loading: {},
  fetchImage: () => {},
});

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getProductImage = async (id: string): Promise<string> => {
    // Your logic to fetch the image URL
    // This is a placeholder function, replace it with your actual fetch call
    const response = await fetch(`/api/product/${id}/image`);
    const data = await response.json();
    return data.url;
  };

  const fetchImage = (id: string) => {
    if (!images[id] && !loading[id]) {
      setLoading((prev) => ({ ...prev, [id]: true }));
      getProductImage(id)
        .then((url) => {
          setImages((prev) => ({ ...prev, [id]: url }));
        })
        .catch((error) => console.error("Error fetching image:", error))
        .finally(() => {
          setLoading((prev) => ({ ...prev, [id]: false }));
        });
    }
  };

  return (
    <ImageContext.Provider value={{ images, loading, fetchImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (id: string) => {
  const { images, loading, fetchImage } = useContext(ImageContext);

  useEffect(() => {
    if (id && !images[id] && !loading[id]) {
      fetchImage(id);
    }
  }, [id, images, loading, fetchImage]);

  return { imageUrl: images[id], isLoading: loading[id] };
};
