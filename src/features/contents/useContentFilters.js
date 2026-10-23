import { useSearchParams } from "react-router-dom"

// Filter disimpan di URL (?status=&channel_id=&format_type=) agar tetap ada saat refresh dan bisa dibagikan.
export function useContentFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    status: searchParams.get("status") ?? "",
    channel_id: searchParams.get("channel_id") ?? "",
    format_type: searchParams.get("format_type") ?? "",
  }

  const setFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value || value === "all") next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true }
    )
  }

  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
  return { filters, setFilter, params }
}
