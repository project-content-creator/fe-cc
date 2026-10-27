import api from "@/lib/api.js"
import { unwrap } from "@/services/normalizers.js"

export async function getList(url, params) {
  try {
    const data = unwrap(await api.get(url, { params }))
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error.response?.status === 404) return []
    throw error
  }
}
