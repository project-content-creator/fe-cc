import api from "@/lib/api.js"
import { visibleStatuses } from "@/lib/permissions.js"
import { getStoredUser } from "@/lib/session.js"
import { fetchChannels } from "@/services/channel.service.js"
import { getList } from "@/services/helpers.js"
import { normalizeContent, unwrap } from "@/services/normalizers.js"

async function channelsById() {
  const channels = await fetchChannels()
  return Object.fromEntries(channels.map((channel) => [channel.id, channel]))
}

// GET /api/v1/content?status=&channel_id=&format_type=
// Backend sudah membatasi konten sesuai role; filter di sini hanya lapis pengaman tambahan.
export async function fetchContents(params = {}) {
  const [list, byId] = await Promise.all([getList("/content", params), channelsById()])
  const allowed = visibleStatuses(getStoredUser()?.role)
  return list
    .map((item) => normalizeContent(item, byId))
    .filter((item) => allowed.includes(item.status))
}

// GET /api/v1/content/:id (detail beserta checklists dan metrics). 404 jika di luar hak akses role.
export async function fetchContent(id) {
  const [response, byId] = await Promise.all([api.get(`/content/${id}`), channelsById()])
  return normalizeContent(unwrap(response), byId)
}

// POST /api/v1/content -> 201 (pemilik dan status awal "idea" ditentukan backend)
export async function createContent(payload) {
  const response = await api.post("/content", payload)
  return normalizeContent(unwrap(response), await channelsById())
}

// PUT /api/v1/content/:id. Field & status yang boleh diubah bergantung pada role.
export async function updateContent(id, payload) {
  await api.put(`/content/${id}`, payload)
}

// DELETE /api/v1/content/:id
export async function deleteContent(id) {
  await api.delete(`/content/${id}`)
}

// Konten published beserta riwayat metriknya (untuk halaman Analytics, khusus admin).
export async function fetchPublishedWithMetrics() {
  const published = await fetchContents({ status: "published" })
  return Promise.all(
    published.map((item) => (item.metrics ? item : fetchContent(item.id).catch(() => item)))
  )
}
