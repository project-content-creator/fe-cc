import api from "@/lib/api.js"
import { mapConflictToField } from "@/services/helpers.js"
import { normalizeAuth, unwrap } from "@/services/normalizers.js"

// POST /api/v1/auth/register -> 201. Pendaftaran publik selalu menghasilkan role "creator".
export async function registerUser({ name, email, password }) {
  try {
    const { data } = await api.post("/auth/register", { name, email, password })
    return data
  } catch (error) {
    throw mapConflictToField(error, "email")
  }
}

// POST /api/v1/auth/login -> { data: { user: { id, name, email, role }, token } }
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password })
  const auth = normalizeAuth(data, email)

  // Di backend lama belum mengirim role pada respons login.
  if (!auth.user.role && auth.user.id) {
    try {
      const profile = unwrap(
        await api.get(`/user/${auth.user.id}`, { headers: { Authorization: `Bearer ${auth.token}` } })
      )
      auth.user = { ...auth.user, ...profile }
    } catch {
      // lanjut tanpa role
    }
  }
  return auth
}
