import api from "@/lib/api"
import { normalizeChecklist, unwrap } from "@/services/normalizers"

// POST /api/v1/content/:id/checklists -> 201 { data: { id, content_id, task_name } }
export async function addChecklist(contentId, taskName) {
  const response = await api.post(`/content/${contentId}/checklists`, { task_name: taskName })
  return normalizeChecklist({ is_completed: false, ...unwrap(response) })
}

// PATCH /api/v1/checklists/:id/toggle. be-cc awal membalik nilai `is_completed` yang dikirim.
export async function toggleChecklist(id, currentValue) {
  await api.patch(`/checklists/${id}/toggle`, { is_completed: currentValue ? 1 : 0 })
}

// DELETE /api/v1/checklists/:id. Endpoint ini baru ada setelah patch backend dipasang.
export async function deleteChecklist(id) {
  await api.delete(`/checklists/${id}`)
}
