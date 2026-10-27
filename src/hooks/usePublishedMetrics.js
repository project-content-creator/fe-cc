import { useEffect, useState } from "react"
import { fetchPublishedWithMetrics } from "@/services/content.service.js"

export function usePublishedMetrics() {
  const [state, setState] = useState({ data: [], loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchPublishedWithMetrics()
      .then((data) => !ignore && setState({ data, loading: false, error: null }))
      .catch((error) => !ignore && setState({ data: [], loading: false, error }))
    return () => {
      ignore = true
    }
  }, [reloadKey])

  return { ...state, reload: () => setReloadKey((key) => key + 1) }
}
