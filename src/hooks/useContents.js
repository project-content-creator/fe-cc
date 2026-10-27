
import { useEffect, useState } from "react"
import { fetchContents } from "@/services/content.service.js"

export function useContents(params = {}) {
  const [state, setState] = useState({ data: [], loading: true, error: null })
  const [reloadKey, setReloadKey] = useState(0)
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    let ignore = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchContents(JSON.parse(paramsKey))
      .then((data) => !ignore && setState({ data, loading: false, error: null }))
      .catch((error) => !ignore && setState({ data: [], loading: false, error }))
    return () => {
      ignore = true
    }
  }, [paramsKey, reloadKey])

  return { ...state, reload: () => setReloadKey((key) => key + 1) }
}
