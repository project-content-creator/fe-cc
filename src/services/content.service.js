import api from "@/lib/api"
import { fetchChannels } from "@/services/channel.service"
import { normalizeContent, unwrap } from "@/services/normalizers"

async function channelsById() {
  const channels = await fetchChannels()
  return Object.fromEntries(channels.map((channel) => [channel.id, channel]))
}

// GET /api/v1/contents
export async function fetchContents({ format_type, ...serverParams } = {}) {
  const [response, byId] = await Promise.all([
    api.get("/contents", { params: serverParams }),
    channelsById(),
  ])
  const items = unwrap(response).map((item) => normalizeContent(item, byId))
  return format_type ? items.filter((item) => item.format_type === format_type) : items
}

// GET /api/v1/contents/:id (detail beserta checklist dan metrics)
export async function fetchContent(id) {
  const [response, byId] = await Promise.all([api.get(`/contents/${id}`), channelsById()])
  return normalizeContent(unwrap(response), byId)
}

// POST /api/v1/contents -> 201 Created
export async function createContent(payload) {
  const response = await api.post("/contents", payload)
  return normalizeContent(unwrap(response), await channelsById())
}

// PATCH /api/v1/contents/:id -> 200 OK (juga dipakai untuk transisi status)
export async function updateContent(id, payload) {
  const response = await api.patch(`/contents/${id}`, payload)
  return normalizeContent(unwrap(response), await channelsById())
}

// DELETE /api/v1/contents/:id -> 204 No Content
export async function deleteContent(id) {
  await api.delete(`/contents/${id}`)
}
