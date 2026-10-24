import api from "@/lib/api"
import { getStoredUser } from "@/lib/session"
import { unwrap } from "@/services/normalizers"

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

// PUT /api/v1/user/:id { name, email, role }. be-cc mewajibkan ketiga field dikirim.
// be-cc belum menyimpan foto, jadi foto profil hanya disimpan di browser ini.
export async function updateProfile({ name, email, avatar, removeAvatar }) {
  const user = getStoredUser()
  const response = await api.put(`/user/${user.id}`, { name, email, role: user.role ?? "creator" })
  const data = unwrap(response)
  const result = { ...(data && typeof data === "object" ? data : {}), name, email }
  if (avatar) result.avatar_url = await readAsDataUrl(avatar)
  else if (removeAvatar) result.avatar_url = null
  return result
}

// be-cc tidak memeriksa password lama saat update, jadi diverifikasi lewat login terlebih dulu.
// Password salah -> 401 (ditangani PasswordCard).
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

// be-cc belum punya endpoint logout; sesi cukup dihapus di sisi klien.
export async function logoutRequest() {}
