import axios from "axios"

// export const TOKEN_KEY = "token"
// export const USER_KEY = "user"

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  header: {
        "Content-Type":"application/json",
        Accept:"application/json"
    },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith("/auth/")
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.assign("/login")
    }
    return Promise.reject(error)
  }
)

export default api;