import axios from "axios"

export const TOKEN_KEY = "creatortrack_token"
export const USER_KEY = "creatortrack_user"

// Asumsi: autentikasi memakai Bearer token. Sesuaikan jika backend memakai session cookie.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/")
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)

export default api;
