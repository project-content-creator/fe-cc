import api from "@/lib/api"
import { getUserId } from "@/lib/session"
import { getList } from "@/services/helpers"

let cache = null
let cacheUserId = null

// GET /api/v1/channel. be-cc mengembalikan channel semua user, jadi disaring ke user yang login.
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

// PUT /api/v1/channel/:id (user_id, platform, handle_name wajib dikirim semuanya)
export async function updateChannel(id, payload) {
  await api.put(`/channel/${id}`, { user_id: getUserId(), ...payload })
  cache = null
}

// DELETE /api/v1/channel/:id. Konten di channel itu ikut terhapus (ON DELETE CASCADE).
export async function deleteChannel(id) {
  await api.delete(`/channel/${id}`)
  cache = null
}
