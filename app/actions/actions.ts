// app/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProductImage(productId: string, imagePath: string) {
  const supabase = createClient()

  try {
    // 1. Delete the image from storage
    const { error: storageError } = await supabase.storage
      .from('test')
      .remove([`${productId}/${imagePath}`])

    if (storageError) throw storageError

    // 2. Update the uploadedImages array in the database
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('uploadedImages')
      .eq('id', productId)
      .single()

    if (fetchError) throw fetchError

    const newImages = product.uploadedImages.filter((path: string) => path !== imagePath)

    const { error: updateError } = await supabase
      .from('products')
      .update({ uploadedImages: newImages })
      .eq('id', productId)

    if (updateError) throw updateError

    // Revalidate the product page
    revalidatePath(`/home/listings/${productId}`)

    return { success: true, newImages }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: (error as Error).message }
  }
}