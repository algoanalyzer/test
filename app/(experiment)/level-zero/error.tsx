'use client' // Error components must be Client Components.

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service.
    console.error(error)
  }, [error])

  return (
    <div className={"h-full flex-grow overflow-hidden flex flex-col bg-slate-50 font-sans justify-center items-center space-y-10"}>
      <span className={"px-4 font-sans text-3xl font-bold text-gray-950 col-span-4 justify-self-center"}>
        Something went wrong while loading the experiment.
      </span>
      <button
        type="button"
        className={"flex m-2 p-3 justify-center items-center rounded-md shadow-md bg-amber-300 text-xl font-sans"}
        onClick={
          // Redirect to homepage.
          () => router.push("/")
        }
      >
        Return to Homepage
      </button>
    </div>
  )
}
