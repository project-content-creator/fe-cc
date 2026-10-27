import api from "@/lib/api.js"
import { normalizeChecklist, unwrap } from "@/services/normalizers.js"

// POST /api/v1/content/:id/checklists -> 201 { data: { id, content_id, task_name } }
export async function addChecklist(contentId, taskName) {
  const response = await api.post(`/content/${contentId}/checklists`, { task_name: taskName })
  return normalizeChecklist({ is_completed: false, ...unwrap(response) })
}

// PATCH /api/v1/checklists/:id/toggle
export async function toggleChecklist(id, currentValue) {
  await api.patch(`/checklists/${id}/toggle`, { is_completed: currentValue ? 1 : 0 })
}

// DELETE /api/v1/checklists/:id
export async function deleteChecklist(id) {
  await api.delete(`/checklists/${id}`)
}
