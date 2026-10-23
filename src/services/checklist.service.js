import api from "@/lib/api"
import { normalizeChecklist, unwrap } from "@/services/normalizers"

// POST /api/v1/contents/:id/checklists -> 201 Created
export async function addChecklist(contentId, taskName) {
  const response = await api.post(`/contents/${contentId}/checklists`, { task_name: taskName })
  return normalizeChecklist(unwrap(response))
}

// PATCH /api/v1/checklists/:id/toggle -> 200 OK
export async function toggleChecklist(id) {
  await api.patch(`/checklists/${id}/toggle`)
}

// DELETE /api/v1/checklists/:id -> 204. Endpoint ini wajib (tiket CCP-04) tapi belum ada di spesifikasi.
export async function deleteChecklist(id) {
  await api.delete(`/checklists/${id}`)
}
