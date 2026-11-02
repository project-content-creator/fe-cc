import { useCallback, useEffect, useMemo, useState } from "react"
import api from "@/lib/api.js"
import { TOKEN_KEY, USER_KEY, clearSession, getStoredUser } from "@/lib/session.js"
import { AuthContext } from "@/providers/auth-context.js"

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback(({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setToken(token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setToken(null)
    setUser(null)
  }, [])

  // Memperbarui sebagian data user (mis. setelah edit profil) dan menyimpannya.
  const updateUser = useCallback(
    (patch) => {
      const next = { ...user, ...patch }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      setUser(next)
    },
    [user]
  )

  // Menyegarkan data user dari server saat aplikasi dibuka, agar perubahan role oleh admin ikut berlaku.
  useEffect(() => {
    if (!token) return undefined
    let ignore = false
    api
      .get("/auth/me")
      .then((response) => {
        const fresh = response.data?.data
        if (ignore || !fresh?.id) return
        const merged = { ...getStoredUser(), ...fresh }
        localStorage.setItem(USER_KEY, JSON.stringify(merged))
        setUser(merged)
      })
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [token])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(token), login, logout, updateUser }),
    [user, token, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
