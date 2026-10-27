import api from "@/lib/api.js"
import { normalizeAuth, unwrap } from "@/services/normalizers.js"

// POST /auth/register. Pendaftaran memakai POST /user
export async function registerUser({ name, email, password }) {
  try {
    const { data } = await api.post("/user", { name, email, password, role: "creator" })
    return data
  } catch (error) {
    if (error.response?.status === 409) {
      error.response.status = 422
      error.response.data = { errors: { email: [error.response.data?.message ?? "Email already taken"] } }
    }
    throw error
  }
}

// POST /api/v1/auth/login 
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
  }
  return auth
}
