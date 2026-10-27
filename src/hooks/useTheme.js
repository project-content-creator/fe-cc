import { useContext } from "react"
import { ThemeContext } from "@/providers/theme-context.js"

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme harus dipakai di dalam ThemeProvider")
  return context
}
