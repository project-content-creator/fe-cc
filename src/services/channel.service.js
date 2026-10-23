import api from "@/lib/api"
import { unwrap } from "@/services/normalizers"

let cache = null

// GET /api/v1/channels. Hasilnya disimpan agar tidak diminta berulang di setiap halaman.
export function fetchChannels({ force = false } = {}) {
  if (!cache || force) {
    cache = api
      .get("/channels")
      .then(unwrap)
      .catch((error) => {
        cache = null
        throw error
      })
  }
  return cache
}

// POST /api/v1/channels -> 201 Created
export async function createChannel(payload) {
  const response = await api.post("/channels", payload)
  cache = null
  return unwrap(response)
}

// PATCH /api/v1/channels/:id. Belum ada di spesifikasi, perlu dikonfirmasi ke backend.
export async function updateChannel(id, payload) {
  const response = await api.patch(`/channels/${id}`, payload)
  cache = null
  return unwrap(response)
}

// DELETE /api/v1/channels/:id. Belum ada di spesifikasi, perlu dikonfirmasi ke backend.
export async function deleteChannel(id) {
  await api.delete(`/channels/${id}`)
  cache = null
}