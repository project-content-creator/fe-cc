import { Outlet } from "react-router-dom"
import ForbiddenState from "@/components/common/ForbiddenState"
import { useAuth } from "@/hooks/useAuth.js"

// Membatasi sekelompok rute untuk role tertentu, mis. <RoleRoute allow={["admin"]} />
export default function RoleRoute({ allow }) {
  const { user } = useAuth()
  return allow.includes(user?.role) ? <Outlet /> : <ForbiddenState />
}
