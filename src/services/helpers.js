import api from "@/lib/api.js"
import { unwrap } from "@/services/normalizers.js"

// Backend dapat membalas 404 jika hasilnya daftar kosong.
export async function getList(url, params) {
  try {
    const data = unwrap(await api.get(url, { params }))
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error.response?.status === 404) return []
    throw error
  }
}

// 409 { message: "Email already taken" } diubah menjadi error 422 pada field `field`,
// agar form menampilkannya di bawah input yang bersangkutan.
export function mapConflictToField(error, field = "email") {
  if (error.response?.status === 409) {
    error.response.status = 422
    error.response.data = { errors: { [field]: [error.response.data?.message ?? "Sudah dipakai"] } }
  }
  return error
}
