import api from "@/lib/api"
import { getUserId } from "@/lib/session"
import { fetchChannels } from "@/services/channel.service"
import { getList } from "@/services/helpers"
import { normalizeContent, unwrap } from "@/services/normalizers"

async function channelsById() {
  const channels = await fetchChannels()
  return Object.fromEntries(channels.map((channel) => [channel.id, channel]))
}

// GET /api/v1/content?status=&channel_id=
// be-cc mengembalikan konten semua user, jadi disaring ke user yang login.
// format_type disaring di sisi klien (be-cc asli belum mendukungnya).
export async function fetchContents({ format_type, ...serverParams } = {}) {
  const [list, byId] = await Promise.all([getList("/content", serverParams), channelsById()])
  const userId = getUserId()
  return list
    .filter((item) => userId == null || String(item.user_id) === String(userId))
    .map((item) => normalizeContent(item, byId))
    .filter((item) => !format_type || item.format_type === format_type)
}

// GET /api/v1/content/:id (detail beserta checklists dan metrics)
export async function fetchContent(id) {
  const [response, byId] = await Promise.all([api.get(`/content/${id}`), channelsById()])
  const payload = unwrap(response)
  // be-cc versi awal membalas array hasil JOIN; ambil baris pertama agar halaman tetap terbuka.
  // Checklist dan metrik baru muncul penuh setelah patch backend dipasang.
  const raw = Array.isArray(payload) ? { ...payload[0], id: Number(id) } : payload
  return normalizeContent(raw, byId)
}

// POST /api/v1/content -> 201. user_id dan status wajib dikirim.
export async function createContent(payload) {
  const response = await api.post("/content", { user_id: getUserId(), status: "idea", ...payload })
  return normalizeContent(unwrap(response), await channelsById())
}

// PUT /api/v1/content/:id. be-cc awal hanya memperbarui `status`; patch backend menambah field lain.
export async function updateContent(id, payload) {
  await api.put(`/content/${id}`, payload)
}

// DELETE /api/v1/content/:id
export async function deleteContent(id) {
  await api.delete(`/content/${id}`)
}

// Konten published beserta riwayat metriknya (untuk halaman Analytics).
export async function fetchPublishedWithMetrics() {
  const published = await fetchContents({ status: "published" })
  return Promise.all(
    published.map((item) => (item.metrics ? item : fetchContent(item.id).catch(() => item)))
  )
}
