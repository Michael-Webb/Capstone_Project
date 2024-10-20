'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '../ui/button'

interface ListingData {
  id: string
  title: string
  // Add more properties as needed
}

interface ListingDetailsProps {
  listingId: string
}

export default function ListingDetails({ listingId }: ListingDetailsProps) {
  const [listingData, setListingData] = useState<ListingData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListingData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/listings/${listingId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch listing data')
      }
      const data: ListingData = await response.json()
      setListingData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [listingId])

  useEffect(() => {
    fetchListingData()
  }, [fetchListingData])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!listingData) return <div>No data available</div>

  return (
    <div>
      <Button 
        variant="secondary" 
        onClick={(e) => {
          e.preventDefault() // Prevents form submission
          fetchListingData()
        }}
      >
        Refresh
      </Button>
      <h1>Analytics Get Response</h1>
      <p>ID: {JSON.stringify(listingData)}</p>
      {/* Add more listing details as needed */}
    </div>
  )
}
