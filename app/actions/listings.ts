// app/actions/listings.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { productSchema, ProductSchemaType } from '@/schemas/productSchemas'
import type { Product } from '@/types/product-types'


export async function upsertListing(formData: FormData) {
  const supabase = createClient()
  const rawData = Object.fromEntries(formData.entries())
  const newImages = Object.keys(rawData)
    .filter(key => key.startsWith('image_'))
    .map(key => rawData[key] as File)
  const currentImages = JSON.parse(rawData.currentImages as string) as string[]

  // Convert data types for specific fields
  const preparedData: Partial<Product> = {
    lp_id: rawData.lp_id ? parseInt(rawData.lp_id as string, 10) : undefined,
    posh_id: rawData.posh_id as string || undefined,
    sku: rawData.sku as string || undefined,
    title: rawData.title as string || undefined,
    description: rawData.description as string || undefined,
    new_with_tag: rawData.new_with_tag as string || undefined,
    condition: rawData.condition as string || undefined,
    condition_notes: rawData.condition_notes as string || undefined,
    keywords: rawData.keywords as string || undefined,
    sold: rawData.sold === 'true' ? true : rawData.sold === 'false' ? false : undefined,
    colors: rawData.colors as string || undefined,
    department: rawData.department as string || undefined,
    category: rawData.category as string || undefined,
    subcategory: rawData.subcategory as string || undefined,
    all_style_tags: rawData.all_style_tags as string || undefined,
    item_cost: rawData.item_cost as string || undefined,
    msrp: rawData.msrp as string || undefined,
    price: rawData.price ? parseFloat(rawData.price as string) : undefined,
    brand: rawData.brand as string || undefined,
    size: rawData.size as string || undefined,
    material: rawData.material as string || undefined,
    first_image_url: rawData.first_image_url as string || undefined,
    image_gallery_Current: rawData.image_gallery_Current as string || undefined,
    image_gallery_count_Current: rawData.image_gallery_count_Current ? parseInt(rawData.image_gallery_count_Current as string, 10) : undefined,
    Likes_Poshmark: rawData.Likes_Poshmark ? parseInt(rawData.Likes_Poshmark as string, 10) : undefined,
    Number_of_Days_Listed_Poshmark: rawData.Number_of_Days_Listed_Poshmark ? parseInt(rawData.Number_of_Days_Listed_Poshmark as string, 10) : undefined,
    total_token_count: rawData.total_token_count ? parseInt(rawData.total_token_count as string, 10) : undefined,
    total_token_price: rawData.total_token_price ? parseFloat(rawData.total_token_price as string) : undefined,
    completion_token_count: rawData.completion_token_count ? parseInt(rawData.completion_token_count as string, 10) : undefined,
    completion_token_price: rawData.completion_token_price ? parseFloat(rawData.completion_token_price as string) : undefined,
    prompt_token_count: rawData.prompt_token_count ? parseInt(rawData.prompt_token_count as string, 10) : undefined,
    prompt_token_price: rawData.prompt_token_price ? parseFloat(rawData.prompt_token_price as string) : undefined,
    id: rawData.id as string || undefined,
    created_at: rawData.created_at ? new Date(rawData.created_at as string) : undefined,
    updated_at: new Date(),
    deleted_at: rawData.deleted_at ? new Date(rawData.deleted_at as string) : undefined,
    file_id: rawData.file_id as string || undefined,
    image_id: rawData.image_id as string || undefined,
  }

  // Remove undefined properties
  Object.keys(preparedData).forEach(key => 
    preparedData[key as keyof Partial<Product>] === undefined && delete preparedData[key as keyof Partial<Product>]
  )

  const validatedFields = productSchema.safeParse(preparedData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.format() }
  }

  let listingId = rawData.id as string | undefined
  let isNewListing = !listingId

  try {
    let data;
    if (isNewListing) {
      // Create a new row for a new listing
      const { data: newListing, error: newListingError } = await supabase
        .from('products')
        .insert(validatedFields.data)
        .select()
        .single()

      if (newListingError) throw newListingError

      listingId = newListing.id
      data = newListing
    } else {
      // Update existing listing
      const { data: updatedListing, error: updateError } = await supabase
        .from('products')
        .update(validatedFields.data)
        .eq('id', listingId)
        .select()
        .single()

      if (updateError) throw updateError

      data = updatedListing
    }

    // Fetch existing images from listing-images table
    const { data: existingImages, error: fetchError } = await supabase
      .from('listing-images')
      .select('*')
      .eq('product_id', listingId)
      .order('image_sort', { ascending: true })

    if (fetchError) throw fetchError

    // Upload new images and insert into listing-images table
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i]
      const fileName = `${Date.now()}_${image.name}`
      const filePath = `${listingId}/${fileName}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, image)

      if (uploadError) throw uploadError

      // Insert into listing-images table
      const { error: insertError } = await supabase
        .from('listing-images')
        .insert({
          product_id: listingId,
          image_sort: (existingImages?.length || 0) + i + 1,
          image_name: fileName,
          created_at: new Date().toISOString(),
          // openai_file_id can be added here if available
        })

      if (insertError) throw insertError
    }

    // Fetch updated image list
    const { data: updatedImages, error: updatedFetchError } = await supabase
      .from('listing-images')
      .select('*')
      .eq('product_id', listingId)
      .order('image_sort', { ascending: true })

    if (updatedFetchError) throw updatedFetchError

    // Update first_image_url in products table if there are images
    if (updatedImages && updatedImages.length > 0) {
      const firstImageName = updatedImages[0].image_name
      const firstImageUrl = supabase.storage
        .from('listing-images')
        .getPublicUrl(`${listingId}/${firstImageName}`).data.publicUrl

      const { error: updateError } = await supabase
        .from('products')
        .update({ first_image_url: firstImageUrl })
        .eq('id', listingId)

      if (updateError) throw updateError

      data.first_image_url = firstImageUrl
    }

    revalidatePath('/home/listings')
    return { 
      data, 
      isNewListing, 
      images: updatedImages.map(img => ({
        ...img,
        url: supabase.storage
          .from('listing-images')
          .getPublicUrl(`${listingId}/${img.image_name}`).data.publicUrl
      }))
    }
  } catch (error) {
    console.error('Error in upsertListing:', error)
    return { error: (error as Error).message }
  }
}