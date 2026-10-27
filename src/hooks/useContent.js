
import { useEffect, useState } from "react"
import { fetchContent } from "@/services/content.service.js"

export function useContent(id) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchContent(id)
      .then((data) => !ignore && setState({ data, loading: false, error: null }))
      .catch((error) => !ignore && setState({ data: null, loading: false, error }))
    return () => {
      ignore = true
    }
  }, [id, reloadKey])

  return { ...state, reload: () => setReloadKey((key) => key + 1) }
}
