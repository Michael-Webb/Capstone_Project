// components/ImageThumbnail.tsx
'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Database } from "../../types/supabase"
// import { useImageCache } from "@/app/contexts/ImageCache"
import { Skeleton } from "../ui/skeleton"
import { getProductImage } from "@/app/actions/getProductImage"

type Product = Database["public"]["Tables"]["products"]["Row"]

interface ImageComponentProps {
  row: Product
}

export function ImageThumbnail({ row }: ImageComponentProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const { cache, setCache } = useImageCache()

  useEffect(() => {
    async function fetchImage() {
        setImageUrl(row.id)
        setIsLoading(false)


      setIsLoading(true)
      try {
        const url = await getProductImage(row.id)
        if (url) {
          setImageUrl(url)
          // setCache((prevCache) => ({ ...prevCache, [row.id]: url }))
        }
      } catch (error) {
        console.error("Error fetching image:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()
  }, [row.id])

  return (
    <div className="relative w-[60px] h-[60px]">
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="h-full w-full" />
        </div>
      )}
      <div 
        className="absolute inset-0 transition-opacity duration-300 ease-in-out" 
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        {imageUrl ? (
          <Image 
            priority={true} 
            src={imageUrl} 
            alt={row.id || "id"} 
            width={60} 
            height={60} 
            className="-p-4" 
          />
        ) : (
          <div
            className="-p-4"
            style={{
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            No image available
          </div>
        )}
      </div>
    </div>
  )
}