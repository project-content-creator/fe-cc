import api from "@/lib/api"
import { normalizeMetric, unwrap } from "@/services/normalizers"

// POST /api/v1/content/:id/metrics -> 201
// Respons be-cc awal hanya memuat angka (tanpa id dan tanggal), jadi dilengkapi dari data yang dikirim.
export async function addMetric(contentId, payload) {
  const response = await api.post(`/content/${contentId}/metrics`, payload)
  const data = unwrap(response)
  return normalizeMetric({
    id: `baru-${Date.now()}`,
    ...payload,
    ...(data && typeof data === "object" ? data : {}),
  })
}
