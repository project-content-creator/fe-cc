import api from "@/lib/api"
import { normalizeAuth } from "@/services/normalizers"

// POST /api/v1/auth/register -> 201 Created
export async function registerUser({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password })
  return data
}

// POST /api/v1/auth/login -> 200 OK (memunculkan token)
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password })
  return normalizeAuth(data, email)
}