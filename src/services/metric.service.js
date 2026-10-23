import api from "@/lib/api"
import { normalizeMetric, unwrap } from "@/services/normalizers"

// POST /api/v1/contents/:id/metrics -> 201 Created
export async function addMetric(contentId, payload) {
  const response = await api.post(`/contents/${contentId}/metrics`, payload)
  return normalizeMetric(unwrap(response))
}
