import { NextRequest, NextResponse } from 'next/server'

const url = process.env.NEXT_PUBLIC_FASTAPI_URL

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listingId = params.id
  console.log(params.id)

  console.log(`[Server] Received request for listing ID: ${listingId}`)

  try {
    console.log(`[Server] Fetching data from FastAPI for listing ID: ${listingId}`)
    const fastApiUrl = `${url}${listingId}?_=${new Date().getTime()}`

    console.log(`[Server] FastAPI URL: ${fastApiUrl}`)
    const response = await fetch(fastApiUrl, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

    if (!response.ok) {
      console.error(`[Server] FastAPI request failed with status: ${response.status}`)
      throw new Error('Failed to fetch data from FastAPI')
    }

    const data = await response.json()
    console.log(`[Server] Received data from FastAPI:`, data)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error(`[Server] Error occurred:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
