import { useCallback, useMemo, useState } from "react"
import { TOKEN_KEY, USER_KEY } from "@/lib/api"
import { AuthContext } from "@/providers/auth-context"

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readUser)

  const login = useCallback(({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setToken(token)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
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

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(token), login, logout, updateUser }),
    [user, token, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
