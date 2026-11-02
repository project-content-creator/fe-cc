import api from "@/lib/api.js"
import { getUserId } from "@/lib/session.js"
import { getList } from "@/services/helpers.js"

let cache = null
let cacheUserId = null

// GET /api/v1/channel. Semua role boleh melihat semua channel (backend yang membatasi ubah/hapus).
export function fetchChannels({ force = false } = {}) {
  const userId = getUserId()
  if (!cache || force || cacheUserId !== userId) {
    cacheUserId = userId
    cache = getList("/channel").catch((error) => {
      cache = null
      throw error
    })
  }
  return cache
}

// POST /api/v1/channel { platform, handle_name } -> 201. Pemilik = user yang login.
export async function createChannel(payload) {
  await api.post("/channel", payload)
  cache = null
}

// PUT /api/v1/channel/:id (admin atau pemilik)
export async function updateChannel(id, payload) {
  await api.put(`/channel/${id}`, payload)
  cache = null
}

// DELETE /api/v1/channel/:id. Konten di channel itu ikut terhapus (ON DELETE CASCADE).
export async function deleteChannel(id) {
  await api.delete(`/channel/${id}`)
  cache = null
}
