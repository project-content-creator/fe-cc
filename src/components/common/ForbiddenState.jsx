import { Link } from "react-router-dom"
import EmptyState from "@/components/common/EmptyState"

export default function ForbiddenState() {
  return (
    <EmptyState title="Kamu tidak punya akses ke halaman ini" description="Halaman ini hanya tersedia untuk role tertentu.">
      <Link to="/dashboard" className="font-bold text-link underline">Kembali ke Dashboard</Link>
    </EmptyState>
  )
}
