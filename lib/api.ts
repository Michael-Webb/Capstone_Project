// lib/api.ts

export async function getListing(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL
    if (!apiUrl) {
      throw new Error('FASTAPI_URL is not defined in environment variables')
    }
  
    console.log(`[Server] Fetching listing ID: ${id}`)
    const res = await fetch(`${apiUrl}/${id}`)
    
    if (!res.ok) {
      console.error(`[Server] Failed to fetch listing ID: ${id}. Status: ${res.status}`)
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch listing. Status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log(`[Server] Received data for listing ID: ${id}:`, data)
    return data
  }