import axios from "axios"
import { clearSession, getToken } from "@/lib/session.js"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1",
  headers: { Accept: "application/json" },
})
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? ""
    const isLoginOrRegister = url.startsWith("/auth/login") || url.startsWith("/auth/register")
    if (error.response?.status === 401 && !isLoginOrRegister) {
      clearSession()
      window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)

export default api
