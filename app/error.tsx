"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from 'react'

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center p-[25vh] min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Error</h1>
      <p className="text-lg">Sorry, something went wrong.</p>
      <Button onClick={reset} className="mt-4">
        Try again
      </Button>
    </div>
  );
}
 