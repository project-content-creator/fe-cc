import api from "@/lib/api"
import { unwrap } from "@/services/normalizers"

// Backend membalas 404 jika hasil daftar kosong; bagi UI itu sama dengan daftar kosong.
export async function getList(url, params) {
  try {
    const data = unwrap(await api.get(url, { params }))
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error.response?.status === 404) return []
    throw error
  }
}
