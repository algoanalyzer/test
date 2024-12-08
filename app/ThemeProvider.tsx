"use client"

import { selectTheme } from "@/lib/features/userData/userDataSlice"
import { useAppSelector } from "@/lib/hooks"

export default function ThemeProvider({
  children
}: {
  children: React.ReactNode
}) {
  const colour = useAppSelector(selectTheme)
  return (
    <div className={"flex flex-col flex-grow h-screen border-solid " + (colour === "Light" ? "bg-gray-50 text-gray-900 border-black" : "bg-gray-900 text-gray-100 border-white")} >
      {children}
    </div>
  )
}
