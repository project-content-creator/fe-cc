import api from "@/lib/api.js"
import { getStoredUser } from "@/lib/session.js"
import { unwrap } from "@/services/normalizers.js"

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

// PUT /api/v1/user/:id { name, email, role }
export async function updateProfile({ name, email, avatar, removeAvatar }) {
  const user = getStoredUser()
  const response = await api.put(`/user/${user.id}`, { name, email, role: user.role ?? "creator" })
  const data = unwrap(response)
  const result = { ...(data && typeof data === "object" ? data : {}), name, email }
  if (avatar) result.avatar_url = await readAsDataUrl(avatar)
  else if (removeAvatar) result.avatar_url = null
  return result
}

export async function changePassword({ current_password, password }) {
  const user = getStoredUser()
  await api.post("/auth/login", { email: user.email, password: current_password })
  await api.put(`/user/${user.id}`, {
    name: user.name,
    email: user.email,
    role: user.role ?? "creator",
    password,
  })
}

export async function logoutRequest() {}
