"use client" // Client-side Component to allow for state changes.

import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { selectTheme, updateTheme } from "@/lib/features/userData/userDataSlice"

// let theme: "Light" | "Dark" = "Light"

export default function ThemeToggle() {
  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()
  return (
    <button
      type="button"
      id="dark-mode-toggle-button"
      className={"p-1 md:px-2 md:py-1 justify-center items-center "
        + "rounded-3xl shadow-md border-2 font-semibold text-md lg:text-lg "
        + (theme === "Dark" ? "bg-slate-100 border-slate-300 text-gray-900" : "bg-gray-900 border-gray-700 text-slate-100")
      }
      onClick={() => dispatch(updateTheme(theme === "Light" ? "Dark" : "Light"))}
    >
      {`Enable ${theme === "Dark" ? "Light" : "Dark"} Mode`}
    </button>
  )
}
