import api from "@/lib/api.js"
import { getUserId } from "@/lib/session.js"
import { getList } from "@/services/helpers.js"

let cache = null
let cacheUserId = null

// GET /api/v1/channel
export function fetchChannels({ force = false } = {}) {
  const userId = getUserId()
  if (!cache || force || cacheUserId !== userId) {
    cacheUserId = userId
    cache = getList("/channel")
      .then((list) => list.filter((channel) => String(channel.user_id) === String(userId)))
      .catch((error) => {
        cache = null
        throw error
      })
  }
  return cache
}

// POST /api/v1/channel { user_id, platform, handle_name } -> 201
export async function createChannel(payload) {
  await api.post("/channel", { user_id: getUserId(), ...payload })
  cache = null
}

// PUT /api/v1/channel/:id 
export async function updateChannel(id, payload) {
  await api.put(`/channel/${id}`, { user_id: getUserId(), ...payload })
  cache = null
}

// DELETE /api/v1/channel/:id
export async function deleteChannel(id) {
  await api.delete(`/channel/${id}`)
  cache = null
}
