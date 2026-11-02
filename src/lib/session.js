// Satu-satunya tempat yang tahu kunci penyimpanan sesi di browser.
export const TOKEN_KEY = "creatortrack_token"
export const USER_KEY = "creatortrack_user"

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export const getUserId = () => getStoredUser()?.id ?? null

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
