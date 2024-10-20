// app/actions/getProductImage.ts
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getProductImage(productId: string) {
  const supabase = createClient()

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("uploadedImages")
      .eq("id", productId)
      .single()

    if (productError) throw productError

    if (product && product.uploadedImages && product.uploadedImages.length > 0) {
      const firstImage = product.uploadedImages[0]
      const { data: { publicUrl } } = supabase.storage
        .from("listing-images")
        .getPublicUrl(`${productId}/${firstImage}`)
        //console.log(publicUrl)
      return publicUrl
    }
    
    return null
  } catch (error) {
    console.error("Error fetching image:", error)
    return null
  }
}

export async function getImageUrls(productId: string, paths: string[]) {
  const supabase = createClient()

  const imageUrls = await Promise.all(
    paths.map(async (path) => {
      const { data } = await supabase.storage
        .from("listing-images")
        .createSignedUrl(`${productId}/${path}`, 3600)
      
      return {
        path,
        url: data?.signedUrl || null,
      }
    })
  )

  return imageUrls
}