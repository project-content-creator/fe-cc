import api from "@/lib/api.js"
import { getUserId } from "@/lib/session.js"
import { fetchChannels } from "@/services/channel.service.js"
import { getList } from "@/services/helpers.js"
import { normalizeContent, unwrap } from "@/services/normalizers.js"

async function channelsById() {
  const channels = await fetchChannels()
  return Object.fromEntries(channels.map((channel) => [channel.id, channel]))
}

// GET /api/v1/content?status=&channel_id=
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
  const raw = Array.isArray(payload) ? { ...payload[0], id: Number(id) } : payload
  return normalizeContent(raw, byId)
}

// POST /api/v1/content -> 201
export async function createContent(payload) {
  const response = await api.post("/content", { user_id: getUserId(), status: "idea", ...payload })
  return normalizeContent(unwrap(response), await channelsById())
}

// PUT /api/v1/content/:id
export async function updateContent(id, payload) {
  await api.put(`/content/${id}`, payload)
}

// DELETE /api/v1/content/:id
export async function deleteContent(id) {
  await api.delete(`/content/${id}`)
}

export async function fetchPublishedWithMetrics() {
  const published = await fetchContents({ status: "published" })
  return Promise.all(
    published.map((item) => (item.metrics ? item : fetchContent(item.id).catch(() => item)))
  )
}
