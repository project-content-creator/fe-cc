import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth.js"

// Halaman login/register: pengguna yang sudah masuk diarahkan ke dashboard.
export default function GuestRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
