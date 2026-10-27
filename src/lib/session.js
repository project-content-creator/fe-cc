import api from "@/lib/api.js"
  
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export const getUserId = () => getStoredUser()?.id ?? null
