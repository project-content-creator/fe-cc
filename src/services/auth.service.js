import api from "@/lib/api"
import { normalizeAuth, unwrap } from "@/services/normalizers"

// be-cc belum punya POST /auth/register. Pendaftaran memakai POST /user (role wajib diisi).
export async function registerUser({ name, email, password }) {
  try {
    const { data } = await api.post("/user", { name, email, password, role: "creator" })
    return data
  } catch (error) {
    // 409 { message: "Email already taken" } dipetakan ke error pada field email.
    if (error.response?.status === 409) {
      error.response.status = 422
      error.response.data = { errors: { email: [error.response.data?.message ?? "Email already taken"] } }
    }
    throw error
  }
}

// POST /api/v1/auth/login -> { status, message, data: { user: { id, name, email }, token } }
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password })
  const auth = normalizeAuth(data, email)

  // Respons login tidak memuat role, jadi data lengkap user diambil dari GET /user/:id.
  try {
    const profile = unwrap(
      await api.get(`/user/${auth.user.id}`, { headers: { Authorization: `Bearer ${auth.token}` } })
    )
    auth.user = { ...auth.user, ...profile }
  } catch {
    // lanjut tanpa role
  }
  return auth
}
