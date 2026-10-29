import { useCallback, useEffect, useMemo, useState } from "react"
import { ThemeContext } from "@/providers/theme-context.js"

const STORAGE_KEY = "creatortrack-theme"

// Menambahkan class "dark" / "light" pada <html>. Pilihan "system" mengikuti pengaturan perangkat.
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(STORAGE_KEY) || "system")

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    const apply = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme
      root.classList.remove("light", "dark")
      root.classList.add(resolved)
    }

    apply()
    if (theme !== "system") return undefined
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [theme])

  const setTheme = useCallback((value) => {
    localStorage.setItem(STORAGE_KEY, value)
    setThemeState(value)
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
