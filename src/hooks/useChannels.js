import { useEffect, useState } from "react"
import { fetchChannels } from "@/services/channel.service.js"

export function useChannels() {
  const [data, setData] = useState([])

  useEffect(() => {
    let ignore = false
    fetchChannels()
      .then((channels) => !ignore && setData(channels))
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [])

  return { data }
}
